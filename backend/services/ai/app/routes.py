from fastapi import APIRouter, HTTPException
from app.models import SpeechInput, ExtractedMemory
from app.extractors import extract_memory_from_speech

router = APIRouter(prefix="/api", tags=["memory"])

@router.post("/extract-memory", response_model=ExtractedMemory)
async def extract_memory(input_data: SpeechInput):
    """
    Extract structured memory from speech transcript
    
    Input:
    - transcript: Raw speech text
    
    Output:
    - entities: List of extracted entities (people, events, tasks, etc.)
    - relationships: Connections between entities
    - importance: Priority score (0-10)
    - memory_type: Type of memory
    - summary: Brief summary
    """
    try:
        if not input_data.transcript or not input_data.transcript.strip():
            raise HTTPException(status_code=400, detail="transcript cannot be empty")
        
        result = await extract_memory_from_speech(input_data.transcript)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

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
        "version": "1.0.0",
        "endpoints": {
            "health": "/api/health",
            "extract": "/api/extract-memory"
        }
    }