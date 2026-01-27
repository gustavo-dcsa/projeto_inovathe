from typing import Optional
from pydantic import BaseModel, EmailStr
from app.models.user import UserRole, BusinessUnit
import uuid

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    department: Optional[str] = None
    role: UserRole = UserRole.INNOVATOR
    business_unit: Optional[BusinessUnit] = None
    job_title: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    department: Optional[str] = None
    password: Optional[str] = None
    business_unit: Optional[BusinessUnit] = None
    job_title: Optional[str] = None

class UserResponse(UserBase):
    id: uuid.UUID
    is_active: bool
    xp_points: int
    badges: dict

    class Config:
        from_attributes = True
