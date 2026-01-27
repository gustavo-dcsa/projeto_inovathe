from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.models.campaign import Campaign
from pydantic import BaseModel
import uuid

router = APIRouter()

class CampaignResponse(BaseModel):
    id: uuid.UUID
    title: str
    is_active: bool

    class Config:
        from_attributes = True

@router.get("/", response_model=List[CampaignResponse])
async def read_campaigns(
    db: AsyncSession = Depends(get_db)
) -> Any:
    result = await db.execute(select(Campaign).where(Campaign.is_active == True))
    return result.scalars().all()
