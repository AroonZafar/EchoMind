import os
import json
import re
import httpx
from app.models import ExtractedMemory, MemoryEntity, Relationship
from app.store import upsert_memory, add_relation, is_in_cooldown, record_suggestion

AIML_API_KEY = os.getenv("AIML_API_KEY")
AIML_API_URL = os.getenv("AIML_API_URL", "https://api.aimlapi.com/v1/chat/completions")

async def extract_memory_from_speech(transcript: str) -> ExtractedMemory:
    """Extract memory from speech and return structured data"""
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
- "entities" is a list of objects, each with exactly the keys "type", "name", "attributes".
- "relationships" is a list of objects with "source", "target", "relation".
- If there are no entities or relationships, use empty lists [].
- Do not add any keys other than shown above.'''

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