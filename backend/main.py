import os
from fastapi import FastAPI, HTTPException,  Depends, Query
from models import RecommendationResponse, RecommendationsListResponse
from optimizer import OptimizationEngine
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, create_engine, Session
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
from typing import List, Dict, Any
from sqlmodel import Session, select
from models import Resource, ResourceResponse, engine
import datetime


# 1. Load ENV
load_dotenv()
# Initialize the optimizer
optimizer = OptimizationEngine()

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

def get_session():
    with Session(engine) as session:
        yield session

@app.get("/resources", response_model=List[ResourceResponse], tags=["resources"])
def list_resources(
    limit: int = Query(20, ge=1, le=100, description="Max results to return (default 20, max 100)"),
    offset: int = Query(0, ge=0, description="How many items to skip (default 0)"),
    session: Session = Depends(get_session)
):
    stmt = select(Resource).offset(offset).limit(limit)
    resources = session.exec(stmt).all()
    return resources

@app.get("/recommendations", response_model=RecommendationsListResponse, tags=["recommendations"])
def get_recommendations(session: Session = Depends(get_session)):
    """Get optimization recommendations for all resources."""
    # Get all resources
    resources = session.exec(select(Resource)).all()
    
    # Generate recommendations
    recommendations_data = optimizer.analyze_resources(resources)
    
    # Calculate summary
    summary = optimizer.calculate_summary(resources, recommendations_data)
    
    # Convert to response models
    recommendations = [RecommendationResponse(**rec) for rec in recommendations_data]
    
    return RecommendationsListResponse(
        recommendations=recommendations,
        summary=summary
    )

@app.post("/recommendations/{resource_id}/implement", tags=["recommendations"])
def implement_recommendation(
    resource_id: int,
    session: Session = Depends(get_session)
):
    """Mark a recommendation as implemented."""
    # In a real app, you'd store implemented recommendations in the DB
    # For this demo, we'll just return success
    
    # Verify the resource exists
    resource = session.get(Resource, resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    # In production, you'd:
    # 1. Store the implementation in the recommendations table
    # 2. Update timestamps
    # 3. Possibly update the resource itself
    
    return {
        "message": f"Recommendation for resource {resource_id} marked as implemented",
        "resource_name": resource.name,
        "implemented_at": datetime.utcnow().isoformat()
    }