import os
from dotenv import load_dotenv

# Load environment variables FIRST, before importing anything from `app` --
# app.routes -> app.extractors -> app.store, and app/store.py reads
# DATABASE_URL at module import time. If load_dotenv() runs after these
# imports, os.getenv("DATABASE_URL") returns None during that import and
# store.py silently falls back to the localhost default.
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router
from app.store import init_db
import uvicorn

app = FastAPI(
    title="EchoMind AI Service",
    description="Memory extraction using AIML API",
    version="1.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.on_event("startup")
async def startup():
    """Initialize database on app startup."""
    try:
        init_db()
        print("Database initialized")
    except Exception as e:
        print(f"Database init failed: {e}")


if __name__ == "__main__":
    port = int(os.getenv("AI_PORT", "8001"))
    print(f"Starting EchoMind AI Service on port {port}")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
