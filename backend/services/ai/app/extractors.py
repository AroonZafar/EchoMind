import os
import json
import re
import httpx
from app.models import ExtractedMemory, MemoryEntity, Relationship
from app.store import upsert_memory, add_relation, is_in_cooldown, record_suggestion

AIML_API_KEY = os.getenv("AIML_API_KEY")
AIML_API_URL = os.getenv("AIML_API_URL", "https://api.aimlapi.com/v1/chat/completions")

FIRST_PERSON = {"i", "me", "my", "myself", "mine"}


async def extract_memory_from_speech(transcript: str) -> ExtractedMemory:
    """Extract memory from speech and return structured data"""
    if not AIML_API_KEY:
        raise ValueError("AIML_API_KEY not set")

    prompt = f'''Extract structured memory from this speech transcript.

Transcript: "{transcript}"

Respond with ONLY valid JSON, no other text, in exactly this shape:
{{
  "entities": [
    {{"type": "person", "name": "...", "attributes": {{}}}},
    {{"type": "task", "name": "...", "attributes": {{"due": "..."}}}},
    {{"type": "event", "name": "...", "attributes": {{"when": "..."}}}}
  ],
  "relationships": [
    {{"source": "...", "target": "...", "relation": "..."}}
  ],
  "importance": 7,
  "memory_type": "fact",
  "summary": "..."
}}

Rules:
- "entities" is a list of objects, each with exactly the keys "type", "name", "attributes".
- "relationships" is a list of objects with "source", "target", "relation".
- ALWAYS extract EVERY task, deadline, and event mentioned, not just people. A task is any
  thing the speaker says they have to do, need to finish, or must complete, even if phrased
  casually (e.g. "I have to finish X", "gotta send Y", "need to submit Z").
- Never skip a task entity just because a person entity was also mentioned in the same
  sentence or transcript — extract ALL of them, not just one.
- A relationship's "source" and "target" must EACH be either "I" (the speaker) or the exact
  "name" of one of the entities listed in "entities". NEVER use a raw date, day of week, or
  time (e.g. "Friday", "Thursday", "3pm") as a source or target — dates/times belong only
  inside that entity's "attributes" (e.g. attributes.due, attributes.when), never as their
  own relationship endpoint.
- If there are no entities or relationships, use empty lists [].
- Do not add any keys other than shown above.

Example:
Transcript: "I have to finish my EchoMind demo before Friday, and I have a meeting with Maya on Thursday."
{{
  "entities": [
    {{"type": "task", "name": "EchoMind demo", "attributes": {{"due": "Friday"}}}},
    {{"type": "person", "name": "Maya", "attributes": {{}}}},
    {{"type": "event", "name": "meeting with Maya", "attributes": {{"when": "Thursday"}}}}
  ],
  "relationships": [
    {{"source": "I", "target": "EchoMind demo", "relation": "must_finish"}},
    {{"source": "I", "target": "meeting with Maya", "relation": "attending"}},
    {{"source": "meeting with Maya", "target": "Maya", "relation": "with"}}
  ],
  "importance": 7,
  "memory_type": "fact",
  "summary": "Speaker has a demo due Friday and a meeting with Maya on Thursday."
}}
Notice "Friday" and "Thursday" appear only inside attributes, never as a relationship source or target.'''

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

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(AIML_API_URL, json=payload, headers=headers)
        data = response.json()

    if response.status_code != 200 or "choices" not in data:
        error_detail = data.get("error", data)
        raise ValueError(f"AIML API request failed (status {response.status_code}): {error_detail}")

    response_text = data["choices"][0]["message"]["content"]
    json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
    if not json_match:
        raise ValueError(f"Could not find JSON in AIML API response: {response_text!r}")

    try:
        result = json.loads(json_match.group())
    except json.JSONDecodeError as e:
        raise ValueError(f"AI returned invalid JSON: {e}. Raw text: {response_text!r}")

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


async def extract_and_save_memory(transcript: str) -> dict:
    """Extract memory AND save to database"""
    # Extract from speech
    extracted = await extract_memory_from_speech(transcript)

    saved_memories = []
    saved_relations = []

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
