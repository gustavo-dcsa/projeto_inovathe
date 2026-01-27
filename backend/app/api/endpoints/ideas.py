from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.db.session import get_db
from app.models.idea import Idea, IdeaStatus, IdeaStage
from app.models.vote import Vote
from app.models.user import User, UserRole
from app.schemas.idea import IdeaCreate, IdeaResponse, IdeaUpdate, VoteCreate

router = APIRouter()

@router.post("/", response_model=IdeaResponse)
async def create_idea(
    idea_in: IdeaCreate,
    current_user: User = Depends(deps.get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    idea = Idea(
        title=idea_in.title,
        description=idea_in.description,
        category=idea_in.category,
        expected_benefits=idea_in.expected_benefits,
        resources_needed=idea_in.resources_needed,
        expected_impact=idea_in.expected_impact,
        estimated_time=idea_in.estimated_time,
        references=idea_in.references,
        is_team_submission=idea_in.is_team_submission,
        team_members=idea_in.team_members,
        horizon=idea_in.horizon,
        campaign_id=idea_in.campaign_id,
        author_id=current_user.id,
        status=IdeaStatus.PENDENTE,
        stage=IdeaStage.SUBMETIDA
    )
    db.add(idea)
    await db.commit()
    await db.refresh(idea)
    return idea

@router.get("/", response_model=List[IdeaResponse])
async def read_ideas(
    skip: int = 0,
    limit: int = 100,
    status: Optional[IdeaStatus] = None,
    db: AsyncSession = Depends(get_db)
) -> Any:
    query = select(Idea).options(selectinload(Idea.votes)).offset(skip).limit(limit)
    if status:
        query = query.where(Idea.status == status)

    result = await db.execute(query)
    ideas = result.scalars().all()

    # Calculate votes count
    for idea in ideas:
        idea.votes_count = sum(v.value for v in idea.votes)

    return ideas

def get_vote_weight(role: UserRole) -> int:
    if role == UserRole.ADMIN:
        return 3
    elif role == UserRole.TECHNICAL:
        return 2
    else:
        return 1

@router.post("/{id}/vote")
async def vote_idea(
    id: str,
    vote_in: VoteCreate,
    current_user: User = Depends(deps.get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    # Check if idea exists
    result = await db.execute(select(Idea).where(Idea.id == id))
    idea = result.scalars().first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")

    weight = get_vote_weight(current_user.role)
    weighted_value = vote_in.value * weight

    # Check if vote exists
    result = await db.execute(select(Vote).where(Vote.user_id == current_user.id, Vote.idea_id == id))
    existing_vote = result.scalars().first()

    if existing_vote:
        existing_sign = 1 if existing_vote.value > 0 else -1
        input_sign = 1 if vote_in.value > 0 else -1

        if existing_sign == input_sign:
            # Toggle off
            await db.delete(existing_vote)
        else:
            # Update
            existing_vote.value = weighted_value
    else:
        # Create
        new_vote = Vote(user_id=current_user.id, idea_id=id, value=weighted_value)
        db.add(new_vote)

    await db.commit()
    return {"status": "success"}
