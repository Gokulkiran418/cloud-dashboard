# backend/models.py
from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
import sqlmodel

class Resource(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    type: str  # 'instance' or 'storage'
    provider: str  # e.g., 'aws', 'azure', 'gcp'
    instance_type: Optional[str] = None
    size: Optional[str] = None
    cpu_utilization: Optional[float] = None
    memory_utilization: Optional[float] = None
    storage_gb: Optional[int] = None
    monthly_cost: float
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Recommendation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    resource_id: int = Field(foreign_key="resource.id")
    recommendation_type: str  # e.g., "downsize", "shrink"
    current_config: str
    suggested_config: str
    potential_saving: float
    confidence: float
    reason: str
    implemented: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    implemented_at: Optional[datetime] = None
