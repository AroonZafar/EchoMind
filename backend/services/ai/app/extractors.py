import os
import json
import re
import httpx
from pathlib import Path
from dotenv import load_dotenv

# Load AI service environment variables
load_dotenv(Path(__file__).resolve().parent.parent / ".env")
load_dotenv(Path(__file__).resolve().parents[4] / ".env")
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


async def _call_llm_for_extraction(prompt: str) -> str:
    """Single call to the LLM, returns raw response text. Raises ValueError
    on transport/API failure -- including a timeout, which httpx raises as
    httpx.TimeoutException, not ValueError, so we normalize it here -- so
    the caller has one exception type to handle when deciding whether to
    retry."""
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

    try:
        async with httpx.AsyncClient(timeout=12.0) as client:
            response = await client.post(AIML_API_URL, json=payload, headers=headers)
            data = response.json()
    except httpx.HTTPError as e:
        # Timeout, connection error, etc. -- treat exactly like a failed
        # call so the retry-once-then-fallback flow in
        # extract_memory_from_speech handles it uniformly.
        raise ValueError(f"AIML API request failed: {e}")

    if response.status_code != 200 or "choices" not in data:
        error_detail = data.get("error", data)
        raise ValueError(f"AIML API request failed (status {response.status_code}): {error_detail}")

    return data["choices"][0]["message"]["content"]


def _parse_extraction_json(response_text: str) -> dict:
    """Raises json.JSONDecodeError / ValueError if the response isn't
    parseable JSON. Caller decides what to do about it."""
    json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
    if not json_match:
        raise ValueError(f"Could not find JSON in AIML API response: {response_text!r}")
    return json.loads(json_match.group())


def _build_extracted_memory(result: dict, transcript: str) -> ExtractedMemory:
    # Extract entities
    entities = []
    for e in result.get("entities", []):
        if not isinstance(e, dict):
            continue
        name = e.get("name") or e.get("value") or e.get("entity")
        etype = e.get("type") or e.get("category") or "unknown"
        if not name:
            continue

        # Anti-hallucination: person names must appear in transcript
        if etype.lower() == "person" and name.lower() not in transcript.lower():
            continue

        entities.append(MemoryEntity(
            type=etype,
            name=name,
            attributes=e.get("attributes", {}) or {}
        ))

    # Build the set of valid relationship endpoints: every extracted entity
    # name (lowercased) plus first-person pronouns. Anything else (most
    # commonly a bare date/day/time the model pulled into a relationship
    # instead of leaving it in attributes.due/attributes.when) is a stray
    # string, not a real node, and must not be allowed through as a
    # relationship endpoint -- even for the extract-only endpoint, which has
    # no downstream filtering of its own.
    valid_endpoints = {ent.name.lower() for ent in entities} | FIRST_PERSON

    # Extract relationships
    relationships = []
    for r in result.get("relationships", []):
        if not isinstance(r, dict):
            continue
        source = r.get("source") or r.get("from") or r.get("subject")
        target = r.get("target") or r.get("to") or r.get("object")
        relation = r.get("relation") or r.get("relationship") or r.get("type") or "related_to"
        if not source or not target:
            continue
        if source.lower() not in valid_endpoints or target.lower() not in valid_endpoints:
            # Skip relations pointing at something that isn't a real
            # entity (e.g. "Friday", "Thursday") instead of letting them
            # through for the caller to turn into junk nodes.
            continue
        relationships.append(Relationship(source=source, target=target, relation=relation))

    return ExtractedMemory(
        entities=entities,
        relationships=relationships,
        importance=result.get("importance", 7),
        memory_type=result.get("memory_type", "fact"),
        summary=result.get("summary", "")
    )


def _raw_fallback_memory(transcript: str) -> ExtractedMemory:
    """Used when extraction fails twice in a row (bad JSON both times, or
    the LLM call itself errors on retry). Per the prompt-engineering doc
    (§14): never silently drop the utterance -- store it as an unlinked
    raw memory instead so nothing the user said is lost, even if it
    couldn't be structured."""
    return ExtractedMemory(
        entities=[],
        relationships=[],
        importance=5,
        memory_type="raw_unlinked",
        summary=transcript.strip()[:500]
    )


async def extract_memory_from_speech(transcript: str) -> ExtractedMemory:
    """Extract memory from speech and return structured data.

    Retry policy: one retry with a stricter "JSON only" reminder if the
    first response can't be parsed as JSON. If the retry also fails (bad
    JSON again, or the API call itself errors), fall back to an unlinked
    raw memory rather than raising -- callers should not lose the
    transcript just because extraction had a bad run.
    """
    prompt = EXTRACTION_PROMPT_TEMPLATE.format(transcript=transcript)

    try:
        response_text = await _call_llm_for_extraction(prompt)
        result = _parse_extraction_json(response_text)
    except ValueError as e:
        # No AIML_API_KEY configured is a config error, not a
        # transient/malformed-output issue -- don't mask it with a
        # fallback, the service is genuinely misconfigured.
        if "AIML_API_KEY not set" in str(e):
            raise
        result = None
    except json.JSONDecodeError:
        result = None

    if result is None:
        # Retry once with a stricter reminder appended.
        retry_prompt = prompt + "\n\n" + EXTRACTION_RETRY_REMINDER
        try:
            response_text = await _call_llm_for_extraction(retry_prompt)
            result = _parse_extraction_json(response_text)
        except (ValueError, json.JSONDecodeError):
            # Second failure -- store as unlinked raw memory instead of
            # dropping the utterance or raising a 400 to the caller.
            return _raw_fallback_memory(transcript)

    return _build_extracted_memory(result, transcript)


async def extract_and_save_memory(transcript: str) -> dict:
    """Extract memory AND save to database"""
    # Extract from speech
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
            "message": "Extraction failed twice; stored as unlinked raw memory."
        }

    # Save entities as memories
    entity_id_map = {}  # Map entity name to memory ID for relations
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

    # Save relationships
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