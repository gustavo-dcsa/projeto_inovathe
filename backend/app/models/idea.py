import uuid
from datetime import datetime
from sqlalchemy import String, Text, DateTime, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base
import enum

class IdeaStatus(str, enum.Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    SCREENING = "screening"
    ANALYSIS = "analysis"
    APPROVED = "approved"
    REJECTED = "rejected"
    IMPLEMENTED = "implemented"

class InnovationHorizon(str, enum.Enum):
    H1 = "H1"
    H2 = "H2"
    H3 = "H3"

class Idea(Base):
    __tablename__ = "ideas"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(Text) # Markdown
    attachment_url: Mapped[str] = mapped_column(String, nullable=True)
    status: Mapped[IdeaStatus] = mapped_column(Enum(IdeaStatus), default=IdeaStatus.DRAFT)
    horizon: Mapped[InnovationHorizon] = mapped_column(Enum(InnovationHorizon))

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    author_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    campaign_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("campaigns.id"))

    # Relationships
    author = relationship("User", back_populates="ideas")
    campaign = relationship("Campaign", back_populates="ideas")
    comments = relationship("Comment", back_populates="idea", lazy="selectin", cascade="all, delete-orphan")
    votes = relationship("Vote", back_populates="idea", lazy="selectin", cascade="all, delete-orphan")
