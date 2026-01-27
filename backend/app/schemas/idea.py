from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
import uuid
from app.models.idea import IdeaStatus, IdeaStage, IdeaCategory, ImpactLevel, InnovationHorizon

class IdeaBase(BaseModel):
    title: str
    description: str
    category: IdeaCategory
    expected_benefits: str
    resources_needed: Optional[str] = None
    expected_impact: ImpactLevel
    estimated_time: Optional[str] = None
    references: Optional[str] = None
    is_team_submission: bool = False
    team_members: Optional[str] = None
    campaign_id: Optional[uuid.UUID] = None
    horizon: Optional[InnovationHorizon] = None

class IdeaCreate(IdeaBase):
    pass

class IdeaUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[IdeaStatus] = None
    stage: Optional[IdeaStage] = None

class IdeaResponse(IdeaBase):
    id: uuid.UUID
    status: IdeaStatus
    stage: IdeaStage
    created_at: datetime
    author_id: uuid.UUID
    votes_count: int = 0

    class Config:
        from_attributes = True

class VoteCreate(BaseModel):
    value: int # 1 or -1
