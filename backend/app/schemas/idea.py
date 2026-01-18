from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
import uuid
from app.models.idea import IdeaStatus, InnovationHorizon
from app.schemas.user import UserResponse

class IdeaBase(BaseModel):
    title: str
    description: str
    horizon: InnovationHorizon
    campaign_id: uuid.UUID

class IdeaCreate(IdeaBase):
    pass

class IdeaUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[IdeaStatus] = None

class IdeaResponse(IdeaBase):
    id: uuid.UUID
    status: IdeaStatus
    created_at: datetime
    author_id: uuid.UUID
    votes_count: int = 0
    # We might want to include author details or just ID

    class Config:
        from_attributes = True

class VoteCreate(BaseModel):
    value: int # 1 or -1
