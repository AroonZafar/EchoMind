from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router
import uvicorn
import os
from dotenv import load_dotenv
from app.store import init_db

# Load environment variables FIRST
load_dotenv()

app = FastAPI(
    title="EchoMind AI Service",
    description="Memory extraction using AIML API",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(router)

@app.on_event("startup")
async def startup():
    """Initialize database on app startup"""
    try:
        init_db()
        print("✅ Database initialized")
    except Exception as e:
        print(f"⚠️  Database init failed: {e}")

if __name__ == "__main__":
    port = int(os.getenv("AI_PORT", 8001))
    print(f"Starting EchoMind AI Service on port {port}")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )