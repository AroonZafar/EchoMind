import os
import json
import re
import httpx
from app.models import ExtractedMemory, MemoryEntity, Relationship

AIML_API_KEY = os.getenv("AIML_API_KEY")
AIML_API_URL = os.getenv("AIML_API_URL", "https://api.aimlapi.com/v1/chat/completions")

async def extract_memory_from_speech(transcript: str) -> ExtractedMemory:
    if not AIML_API_KEY:
        raise ValueError("AIML_API_KEY not set")

    prompt = f'''Extract structured memory from this speech transcript.

Transcript: "{transcript}"

Respond with ONLY valid JSON, no other text, in exactly this shape:
{{
  "entities": [
    {{"type": "person", "name": "...", "attributes": {{}}}}
  ],
  "relationships": [
    {{"source": "...", "target": "...", "relation": "..."}}
  ],
  "importance": 7,
  "memory_type": "fact",
  "summary": "..."
}}

Rules:
- "entities" is a list of objects, each with exactly the keys "type", "name", "attributes" (attributes may be an empty object {{}}).
- "relationships" is a list of objects, each with exactly the keys "source", "target", "relation".
- If there are no entities or relationships, use empty lists [].
- Do not add any keys other than the ones shown above.'''

    headers = {
        "Authorization": f"Bearer {AIML_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "gpt-4o-mini",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 1500
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(AIML_API_URL, json=payload, headers=headers)
        data = response.json()

    if response.status_code != 200 or "choices" not in data:
        error_detail = data.get("error", data)
        raise ValueError(
            f"AIML API request failed (status {response.status_code}): {error_detail}"
        )

    response_text = data["choices"][0]["message"]["content"]
    json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
    if not json_match:
        raise ValueError(f"Could not find JSON in AIML API response: {response_text!r}")

    try:
        result = json.loads(json_match.group())
    except json.JSONDecodeError as e:
        raise ValueError(f"AI returned invalid JSON: {e}. Raw text: {response_text!r}")

    entities = []
    for e in result.get("entities", []):
        if not isinstance(e, dict):
            continue
        name = e.get("name") or e.get("value") or e.get("entity")
        etype = e.get("type") or e.get("category") or "unknown"
        if not name:
            continue
        # Anti-hallucination guard: a person's name should literally appear
        # in what the user said. Other entity types (task/event/fact) are
        # often paraphrased by the model, so we don't apply this check to them.
        if etype.lower() == "person" and name.lower() not in transcript.lower():
            continue
        entities.append(MemoryEntity(type=etype, name=name, attributes=e.get("attributes", {}) or {}))

    relationships = []
    for r in result.get("relationships", []):
        if not isinstance(r, dict):
            continue
        source = r.get("source") or r.get("from") or r.get("subject")
        target = r.get("target") or r.get("to") or r.get("object")
        relation = r.get("relation") or r.get("relationship") or r.get("type") or "related_to"
        if not source or not target:
            continue
        relationships.append(Relationship(source=source, target=target, relation=relation))

    return ExtractedMemory(
        entities=entities,
        relationships=relationships,
        importance=result.get("importance", 7),
        memory_type=result.get("memory_type", "fact"),
        summary=result.get("summary", "")
    )