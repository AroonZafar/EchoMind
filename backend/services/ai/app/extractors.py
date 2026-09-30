import os
import json
import re
import httpx
from pathlib import Path
from dotenv import load_dotenv

# Load AI service environment variables
_HERE = Path(__file__).resolve()
load_dotenv(_HERE.parent.parent / ".env")
# Repo-root .env only exists in the full checkout (backend/services/ai/app/...).
# When the service is deployed on its own (e.g. /app/app/extractors.py) there
# is no 4th parent, and indexing it used to crash the app at startup.
if len(_HERE.parents) > 4:
    load_dotenv(_HERE.parents[4] / ".env")
from app.models import ExtractedMemory, MemoryEntity, Relationship
from app.store import upsert_memory, add_relation, is_in_cooldown, record_suggestion

AIML_API_KEY = os.getenv("AIML_API_KEY")
AIML_API_URL = os.getenv("AIML_API_URL", "https://api.aimlapi.com/v1/chat/completions")

FIRST_PERSON = {"i", "me", "my", "myself", "mine"}

_PROMPTS_DIR = os.path.join(os.path.dirname(__file__), "..", "prompts")


def _load_prompt(filename: str) -> str:
    """Prompts live as versioned files in prompts/ (tracked in git) instead of
    inline strings, per the prompt-engineering doc (see §14/§18)."""
    with open(os.path.join(_PROMPTS_DIR, filename), "r", encoding="utf-8") as f:
        return f.read()


EXTRACTION_PROMPT_TEMPLATE = _load_prompt("extraction_prompt.md")
EXTRACTION_RETRY_REMINDER = _load_prompt("extraction_retry_reminder.md")

_DECODER = json.JSONDecoder()


class LLMTimeout(ValueError):
    """The LLM call timed out. Retrying a slow API just doubles the wait, so
    the caller falls back to a raw memory immediately."""


async def _call_llm_for_extraction(prompt: str, json_mode: bool = True) -> str:
    """Single call to the LLM, returns raw response text. Raises ValueError
    on transport/API failure (LLMTimeout for timeouts) so the caller has one
    exception family to handle when deciding whether to retry.

    json_mode asks the API for a guaranteed-JSON response. It is only used on
    the first attempt: if the provider rejects it, the retry (json_mode=False)
    still works."""
    if not AIML_API_KEY:
        raise ValueError("AIML_API_KEY not set")

    headers = {
        "Authorization": f"Bearer {AIML_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "gpt-4o-mini",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0,
        "max_tokens": 1500
    }
    if json_mode:
        payload["response_format"] = {"type": "json_object"}

    try:
        async with httpx.AsyncClient(timeout=12.0) as client:
            response = await client.post(AIML_API_URL, json=payload, headers=headers)
    except httpx.TimeoutException as e:
        raise LLMTimeout(f"AIML API request timed out: {e}")
    except httpx.HTTPError as e:
        raise ValueError(f"AIML API request failed: {e}")

    # The provider can answer with an HTML error page (502/503/cold start);
    # response.json() would then raise a confusing JSONDecodeError.
    try:
        data = response.json()
    except ValueError:
        raise ValueError(
            f"AIML API returned non-JSON body (status {response.status_code}): {response.text[:200]!r}"
        )

    if response.status_code != 200 or not isinstance(data, dict) or "choices" not in data:
        error_detail = data.get("error", data) if isinstance(data, dict) else data
        raise ValueError(f"AIML API request failed (status {response.status_code}): {error_detail}")

    return data["choices"][0]["message"]["content"] or ""


def _parse_extraction_json(response_text: str) -> dict:
    """Find the first JSON object in the reply and decode exactly that object.
    Unlike a greedy `\\{.*\\}` regex this survives code fences, leading or
    trailing commentary, and a second {...} later in the text.
    Raises ValueError (incl. json.JSONDecodeError) if nothing parseable."""
    text = (response_text or "").strip()
    start = text.find("{")
    if start == -1:
        raise ValueError(f"Could not find JSON in AIML API response: {response_text!r}")
    obj, _ = _DECODER.raw_decode(text[start:])
    if not isinstance(obj, dict):
        raise ValueError(f"Expected a JSON object, got {type(obj).__name__}")
    return obj


def _coerce_importance(value) -> int:
    """LLMs return 7, 7.5, "7", 0.8 or null. The model field is an int 1-10."""
    try:
        n = float(value)
    except (TypeError, ValueError):
        return 5
    if 0 < n <= 1:
        n = n * 10
    return max(1, min(10, int(round(n))))


def _build_extracted_memory(result: dict, transcript: str) -> ExtractedMemory:
    entities_raw = result.get("entities")
    relationships_raw = result.get("relationships")
    if not isinstance(entities_raw, list):
        entities_raw = []
    if not isinstance(relationships_raw, list):
        relationships_raw = []

    # Extract entities
    entities = []
    for e in entities_raw:
        if not isinstance(e, dict):
            continue
        name = e.get("name") or e.get("value") or e.get("entity")
        etype = e.get("type") or e.get("category") or "unknown"
        if not name:
            continue
        name = str(name).strip()
        etype = str(etype).strip() or "unknown"
        if not name:
            continue

        # Anti-hallucination: person names must appear in transcript
        if etype.lower() == "person" and name.lower() not in transcript.lower():
            continue

        attrs = e.get("attributes")
        if not isinstance(attrs, dict):
            attrs = {}

        entities.append(MemoryEntity(type=etype, name=name, attributes=attrs))

    # Valid relationship endpoints: every extracted entity name (lowercased)
    # plus first-person pronouns. Anything else (most commonly a bare
    # date/day/time) is a stray string, not a real node.
    valid_endpoints = {ent.name.lower() for ent in entities} | FIRST_PERSON

    relationships = []
    for r in relationships_raw:
        if not isinstance(r, dict):
            continue
        source = r.get("source") or r.get("from") or r.get("subject")
        target = r.get("target") or r.get("to") or r.get("object")
        relation = r.get("relation") or r.get("relationship") or r.get("type") or "related_to"
        if not source or not target:
            continue
        source, target, relation = str(source), str(target), str(relation)
        if source.lower() not in valid_endpoints or target.lower() not in valid_endpoints:
            continue
        relationships.append(Relationship(source=source, target=target, relation=relation))

    return ExtractedMemory(
        entities=entities,
        relationships=relationships,
        importance=_coerce_importance(result.get("importance", 7)),
        memory_type=str(result.get("memory_type") or "fact"),
        summary=str(result.get("summary") or "")
    )


def _raw_fallback_memory(transcript: str) -> ExtractedMemory:
    """Used when extraction fails (timeout, bad JSON twice, invalid shape).
    Per the prompt-engineering doc (§14): never silently drop the utterance --
    store it as an unlinked raw memory instead."""
    return ExtractedMemory(
        entities=[],
        relationships=[],
        importance=5,
        memory_type="raw_unlinked",
        summary=transcript.strip()[:500]
    )


async def extract_memory_from_speech(transcript: str) -> ExtractedMemory:
    """Extract memory from speech and return structured data.

    Policy:
      - timeout            -> raw fallback immediately (retrying doubles the wait)
      - bad JSON / API err -> one retry with stricter reminder, no json_mode
      - second failure     -> raw fallback
      - JSON parsed but wrong shape (pydantic error) -> raw fallback, never a 400
    """
    prompt = EXTRACTION_PROMPT_TEMPLATE.format(transcript=transcript)

    result = None
    try:
        response_text = await _call_llm_for_extraction(prompt, json_mode=True)
        result = _parse_extraction_json(response_text)
    except LLMTimeout:
        return _raw_fallback_memory(transcript)
    except ValueError as e:
        # No AIML_API_KEY configured is a config error, not a
        # transient/malformed-output issue -- don't mask it with a fallback.
        if "AIML_API_KEY not set" in str(e):
            raise
        result = None

    if result is None:
        retry_prompt = prompt + "\n\n" + EXTRACTION_RETRY_REMINDER
        try:
            response_text = await _call_llm_for_extraction(retry_prompt, json_mode=False)
            result = _parse_extraction_json(response_text)
        except ValueError:
            return _raw_fallback_memory(transcript)

    try:
        return _build_extracted_memory(result, transcript)
    except (ValueError, TypeError, AttributeError) as e:
        # pydantic.ValidationError is a ValueError subclass in pydantic v2.
        print(f"[extract] invalid extraction shape, falling back to raw memory: {e}")
        return _raw_fallback_memory(transcript)


async def extract_and_save_memory(transcript: str) -> dict:
    """Extract memory AND save to database"""
    extracted = await extract_memory_from_speech(transcript)

    saved_memories = []
    saved_relations = []

    if extracted.memory_type == "raw_unlinked" and not extracted.entities:
        memory = upsert_memory(
            mem_type="raw",
            title=extracted.summary[:60] or "unrecognized memory",
            content={"raw_transcript": extracted.summary, "extraction_failed": True},
            importance=extracted.importance
        )
        saved_memories.append({
            "id": str(memory.get("id")),
            "type": "raw",
            "name": memory.get("title"),
            "was_update": memory.get("was_update", False)
        })
        return {
            "extracted": extracted,
            "saved_memories": saved_memories,
            "saved_relations": saved_relations,
            "message": "Extraction failed; stored as unlinked raw memory."
        }

    entity_id_map = {}
    for entity in extracted.entities:
        try:
            memory = upsert_memory(
                mem_type=entity.type,
                title=entity.name,
                content=entity.attributes,
                importance=extracted.importance
            )
            saved_memories.append({
                "id": str(memory.get("id")),
                "type": entity.type,
                "name": entity.name,
                "was_update": memory.get("was_update", False)
            })
            entity_id_map[entity.name] = str(memory.get("id"))
        except Exception as e:
            print(f"Error saving entity {entity.name}: {e}")

    for rel in extracted.relationships:
        try:
            source_id = entity_id_map.get(rel.source)
            target_id = entity_id_map.get(rel.target)

            if source_id and target_id:
                rel_id = add_relation(source_id, target_id, rel.relation)
                saved_relations.append({
                    "id": rel_id,
                    "source": rel.source,
                    "target": rel.target,
                    "relation": rel.relation
                })
        except Exception as e:
            print(f"Error saving relationship {rel.source}->{rel.target}: {e}")

    return {
        "extracted": extracted,
        "saved_memories": saved_memories,
        "saved_relations": saved_relations,
        "message": f"Saved {len(saved_memories)} memories and {len(saved_relations)} relationships"
    }
