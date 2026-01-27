import uuid
from datetime import datetime
from sqlalchemy import String, Text, DateTime, Enum, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base
import enum

class IdeaStatus(str, enum.Enum):
    PENDENTE = "Pendente"
    APROVADA = "Aprovada"
    REPROVADA = "Reprovada"
    REAVALIACAO = "Reavaliação"
    EM_ANALISE = "Em Análise"

class IdeaStage(str, enum.Enum):
    SUBMETIDA = "Submetida"
    SETOR_INOVACAO = "Setor de Inovação"
    COMITE_INOVACAO = "Comitê de Inovação"
    GESTOR_RESPONSAVEL = "Gestor Responsável"
    APROVACAO_DIRETORIA = "Aprovação da Diretoria"
    SETOR_PROJETOS = "Setor de Projetos"
    IMPLEMENTADA = "Implementada"

class InnovationHorizon(str, enum.Enum):
    H1 = "H1"
    H2 = "H2"
    H3 = "H3"

class IdeaCategory(str, enum.Enum):
    PROCESSOS_INTERNOS = "Processos Internos"
    ATENDIMENTO_CLIENTE = "Atendimento ao Cliente"
    TECNOLOGIA = "Tecnologia"
    SUSTENTABILIDADE = "Sustentabilidade"
    OUTROS = "Outros"

class ImpactLevel(str, enum.Enum):
    ALTO = "Alto"
    MEDIO = "Médio"
    BAIXO = "Baixo"

class Idea(Base):
    __tablename__ = "ideas"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(Text) # Markdown

    # New Fields
    category: Mapped[IdeaCategory] = mapped_column(Enum(IdeaCategory))
    expected_benefits: Mapped[str] = mapped_column(Text)
    resources_needed: Mapped[str] = mapped_column(Text, nullable=True)
    expected_impact: Mapped[ImpactLevel] = mapped_column(Enum(ImpactLevel))
    estimated_time: Mapped[str] = mapped_column(String, nullable=True)
    references: Mapped[str] = mapped_column(Text, nullable=True)
    is_team_submission: Mapped[bool] = mapped_column(Boolean, default=False)
    team_members: Mapped[str] = mapped_column(Text, nullable=True) # JSON or Comma separated

    attachment_url: Mapped[str] = mapped_column(String, nullable=True)

    status: Mapped[IdeaStatus] = mapped_column(Enum(IdeaStatus), default=IdeaStatus.PENDENTE)
    stage: Mapped[IdeaStage] = mapped_column(Enum(IdeaStage), default=IdeaStage.SUBMETIDA)

    horizon: Mapped[InnovationHorizon] = mapped_column(Enum(InnovationHorizon), nullable=True) # Optional now as per new spec

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    author_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    campaign_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("campaigns.id"), nullable=True)

    # Relationships
    author = relationship("User", back_populates="ideas")
    campaign = relationship("Campaign", back_populates="ideas")
    comments = relationship("Comment", back_populates="idea", lazy="selectin", cascade="all, delete-orphan")
    votes = relationship("Vote", back_populates="idea", lazy="selectin", cascade="all, delete-orphan")
