import uuid
from sqlalchemy import String, Boolean, Enum, JSON, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    INNOVATOR = "innovator"
    TECHNICAL = "technical"

class BusinessUnit(str, enum.Enum):
    UNIMED_TERESINA = "Operadora Unimed"
    INTERMED = "Operadora Intermed"
    HUP = "Hospital Unimed Primavera (HUP)"
    CIS = "Centro Integrado Ilhotas (CIS)"
    UNIHOME = "Unihome"
    UNIMED_PARNAIBA = "Unimed Parnaíba"
    INTERMED_PARNAIBA = "Intermed Parnaíba"
    THEACOLHER = "TheAcolher"

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String)
    full_name: Mapped[str] = mapped_column(String)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.INNOVATOR)

    # New Fields
    business_unit: Mapped[BusinessUnit] = mapped_column(Enum(BusinessUnit), nullable=True)
    job_title: Mapped[str] = mapped_column(String, nullable=True)

    department: Mapped[str] = mapped_column(String, nullable=True) # Kept for backward compatibility or general use
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    xp_points: Mapped[int] = mapped_column(Integer, default=0)
    badges: Mapped[dict] = mapped_column(JSON, default={})

    # Relationships
    ideas = relationship("Idea", back_populates="author", lazy="selectin")
    comments = relationship("Comment", back_populates="author", lazy="selectin")
    votes = relationship("Vote", back_populates="user", lazy="selectin")
    campaigns = relationship("Campaign", back_populates="creator", lazy="selectin")
