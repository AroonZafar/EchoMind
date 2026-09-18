from pydantic import BaseModel
from typing import List, Dict, Optional

class MemoryEntity(BaseModel):
    type: str
    name: str
    attributes: Dict = {}

class Relationship(BaseModel):
    source: str
    target: str
    relation: str

class ExtractedMemory(BaseModel):
    entities: List[MemoryEntity]
    relationships: List[Relationship]
    importance: int
    memory_type: str
    summary: str

class SpeechInput(BaseModel):
    transcript: str

# ---- New models for storage / relevance / lifecycle ----

class RememberResponse(BaseModel):
    extracted: ExtractedMemory
    saved_memories: List[Dict]
    saved_relations: List[Dict]

class RelevanceCheckRequest(BaseModel):
    context: Optional[str] = ""
    force: Optional[bool] = False  # bypass the 60-min cooldown, for testing/demo

class SuggestionOut(BaseModel):
    memory_id: str
    title: str
    score: float
    message: str
    reason: str
    suggestion_id: str

class ForgetRequest(BaseModel):
    title: Optional[str] = None
    memory_id: Optional[str] = None

class CompleteRequest(BaseModel):
    title: Optional[str] = None
    memory_id: Optional[str] = None

class SuggestionActionRequest(BaseModel):
    suggestion_id: str