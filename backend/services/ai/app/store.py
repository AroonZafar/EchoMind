from fastapi import APIRouter, HTTPException
from app.models import (
    SpeechInput, ExtractedMemory, RememberResponse, RelevanceCheckRequest,
    ForgetRequest, CompleteRequest, SuggestionActionRequest
)
from app.extractors import extract_memory_from_speech
from app import store, relevance

router = APIRouter(prefix="/api", tags=["memory"])

# Initialize the SQLite schema as soon as this module loads, so the DB is
# ready regardless of how the app is started (uvicorn, tests, etc.)
store.init_db()


@router.post("/extract-memory", response_model=ExtractedMemory)
async def extract_memory(input_data: SpeechInput):
    """
    Extract structured memory from speech transcript (no storage side effect).
    Useful for testing extraction quality in isolation.
    """
    try:
        if not input_data.transcript or not input_data.transcript.strip():
            raise HTTPException(status_code=400, detail="transcript cannot be empty")

        result = await extract_memory_from_speech(input_data.transcript)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/remember", response_model=RememberResponse)
async def remember(input_data: SpeechInput):
    """
    Extract structured memory from speech AND persist it to the Personal
    Memory Graph. Existing memories with the same name+type are updated
    instead of duplicated (per doc: no endless duplicate creation).
    """
    try:
        if not input_data.transcript or not input_data.transcript.strip():
            raise HTTPException(status_code=400, detail="transcript cannot be empty")

        extracted = await extract_memory_from_speech(input_data.transcript)

        name_to_id = {}
        saved_memories = []
        for ent in extracted.entities:
            saved = store.upsert_memory(
                mem_type=ent.type,
                title=ent.name,
                content=ent.attributes or {},
                importance=extracted.importance / 10.0 if extracted.importance > 1 else extracted.importance,
            )
            name_to_id[ent.name.lower()] = saved["id"]
            saved_memories.append(saved)

        saved_relations = []
        for rel in extracted.relationships:
            src_id = name_to_id.get(rel.source.lower())
            tgt_id = name_to_id.get(rel.target.lower())
            if not src_id:
                placeholder = store.upsert_memory("fact", rel.source, {}, importance=0.3)
                src_id = placeholder["id"]
                name_to_id[rel.source.lower()] = src_id
            if not tgt_id:
                placeholder = store.upsert_memory("fact", rel.target, {}, importance=0.3)
                tgt_id = placeholder["id"]
                name_to_id[rel.target.lower()] = tgt_id

            rel_id = store.add_relation(src_id, tgt_id, rel.relation)
            saved_relations.append({"id": rel_id, "source": rel.source, "target": rel.target, "relation": rel.relation})

        return RememberResponse(extracted=extracted, saved_memories=saved_memories, saved_relations=saved_relations)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/memories")
async def get_memories(include_forgotten: bool = False):
    """'What do you remember?' query."""
    try:
        memories = store.list_memories(include_forgotten=include_forgotten)
        relations = store.list_relations()
        return {"memories": memories, "relations": relations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/check-relevance")
async def check_relevance(req: RelevanceCheckRequest):
    """
    Run the proactive relevance check across all active memories.
    Returns any suggestions that cross the trigger threshold and aren't
    in cooldown; each returned suggestion is recorded (starts its cooldown).
    """
    try:
        suggestions = relevance.check_relevance(req.context or "")
        return {"suggestions": suggestions, "count": len(suggestions)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/suggestions/confirm")
async def confirm_suggestion(req: SuggestionActionRequest):
    ok = store.update_suggestion_status(req.suggestion_id, "accepted")
    if not ok:
        raise HTTPException(status_code=404, detail="Suggestion not found")
    return {"status": "accepted"}


@router.post("/suggestions/dismiss")
async def dismiss_suggestion(req: SuggestionActionRequest):
    ok = store.update_suggestion_status(req.suggestion_id, "dismissed")
    if not ok:
        raise HTTPException(status_code=404, detail="Suggestion not found")
    return {"status": "dismissed"}


@router.post("/forget")
async def forget(req: ForgetRequest):
    """'Forget this' action. Marks a memory forgotten (soft delete);
    it will no longer appear in normal retrieval or relevance checks."""
    if not req.title and not req.memory_id:
        raise HTTPException(status_code=400, detail="Provide either title or memory_id")
    ok = store.forget_memory(title=req.title, memory_id=req.memory_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Memory not found")
    return {"status": "forgotten"}


@router.post("/complete")
async def complete(req: CompleteRequest):
    """Mark a task/event memory completed so it stops generating reminders."""
    if not req.title and not req.memory_id:
        raise HTTPException(status_code=400, detail="Provide either title or memory_id")
    ok = store.mark_completed(title=req.title, memory_id=req.memory_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Memory not found")
    return {"status": "completed"}


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "AI service is running",
        "service": "EchoMind AI Extraction Service"
    }


@router.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": "EchoMind AI Service",
        "version": "1.1.0",
        "endpoints": {
            "health": "/api/health",
            "extract": "/api/extract-memory (extract only, no storage)",
            "remember": "/api/remember (extract + save to memory graph)",
            "memories": "/api/memories (list what's remembered)",
            "check_relevance": "/api/check-relevance (proactive suggestions)",
            "forget": "/api/forget",
            "complete": "/api/complete"
        }
    }