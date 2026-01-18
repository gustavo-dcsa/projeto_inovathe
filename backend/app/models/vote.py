import uuid
from datetime import datetime
from sqlalchemy import Integer, DateTime, ForeignKey, PrimaryKeyConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base

class Vote(Base):
    __tablename__ = "votes"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), primary_key=True)
    idea_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("ideas.id"), primary_key=True)
    value: Mapped[int] = mapped_column(Integer) # +1 or -1
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="votes")
    idea = relationship("Idea", back_populates="votes")
