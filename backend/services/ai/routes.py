from fastapi import APIRouter, HTTPException
from app.models import SpeechInput, ExtractedMemory
from app.extractors import extract_memory_from_speech

router = APIRouter(prefix="/api", tags=["memory"])

@router.post("/extract-memory", response_model=ExtractedMemory)
async def extract_memory(input_data: SpeechInput):
    try:
        result = await extract_memory_from_speech(input_data.transcript)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    return {"status": "AI service running"}

@router.get("/")
async def root():
    return {"name": "EchoMind AI Service", "version": "1.0.0"}
