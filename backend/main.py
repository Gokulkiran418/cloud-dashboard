import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, create_engine, Session
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# 1. Load ENV
load_dotenv()

# 2. Pydantic Settings Class
class Settings(BaseSettings):
    database_url: str = os.environ.get("DATABASE_URL", "")

settings = Settings()

# 3. DB Engine
engine = create_engine(settings.database_url, echo=True)

# 4. App Setup
app = FastAPI(title="Cloud Optimization Dashboard API")

# 5. CORS - Allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 6. Health Check Endpoint
@app.get("/healthz", tags=["health"])
def health_check():
    try:
        with engine.connect() as conn:
            conn.execute("SELECT 1")
        return {"status": "ok"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

# 7. Simple Root Path (optional)
@app.get("/")
def root():
    return {"message": "Hello from FastAPI backend!"}

