import uuid
from datetime import datetime
from sqlalchemy import Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base

class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    author_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    idea_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("ideas.id"))

    # Relationships
    author = relationship("User", back_populates="comments")
    idea = relationship("Idea", back_populates="comments")
