from fastapi import APIRouter
from app.api.endpoints import auth, ideas, campaigns

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(ideas.router, prefix="/ideas", tags=["ideas"])
api_router.include_router(campaigns.router, prefix="/campaigns", tags=["campaigns"])
