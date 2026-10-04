"""ORM models — per-account learning progress (Cursor Wave 11).

Event log, not a state table. ``progress_event`` is the single source of
truth: every real action (lesson started, lesson completed, instrument
used, exercise answered, badge awarded) is one immutable row, never
overwritten. ``aula_status`` and ``badge_award`` are DERIVED read caches —
they exist because nobody should replay the whole log every time the
Alexandria Perfil page opens, not because they carry any fact the log
doesn't already carry. If the two ever disagree, the log wins; a wrong
derivation rule (streak math, a badge's award condition) is fixed by
recomputing against the log, never by a destructive migration.

The backend does not know curriculum structure and must not pretend to.
There is no ``aula``/``modulo`` table here — those entities live only in
the frontend's TypeScript data files. ``entity_id`` is an opaque string
(``aula_id``, ``instrumento_id``, ``exercicio_id``, or ``badge_id``
depending on ``event_type``) that this backend never interprets, counts
against a total, or turns into a percentage — that join belongs to
whichever frontend already knows how many lessons a module has.

``event_metadata`` (DB column ``metadata``) is deliberately loose JSONB.
No "lente" or "competency" entity is modeled here — that decision is
explicitly out of scope for this wave — and this column is what keeps
that door open without a future migration.
"""

from __future__ import annotations

import uuid
from datetime import date, datetime

from sqlalchemy import (
    CheckConstraint,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base

EVENT_TYPES: tuple[str, ...] = (
    "aula_iniciada",
    "aula_concluida",
    "instrumento_usado",
    "exercicio_respondido",
    "badge_conquistado",
)

AULA_STATUSES: tuple[str, ...] = ("em_andamento", "concluido")


class ProgressEvent(Base):
    __tablename__ = "progress_event"
    __table_args__ = (
        CheckConstraint(
            "event_type IN ('aula_iniciada', 'aula_concluida', 'instrumento_usado', "
            "'exercicio_respondido', 'badge_conquistado')",
            name="progress_event_type_check",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    event_type: Mapped[str] = mapped_column(Text, nullable=False)
    entity_id: Mapped[str] = mapped_column(Text, nullable=False)
    # Python attribute cannot be named `metadata` — that name is reserved
    # by SQLAlchemy's declarative Base (Base.metadata is the MetaData
    # registry). The DB column itself is still named `metadata`, exactly
    # as the brief's schema specifies.
    event_metadata: Mapped[dict | None] = mapped_column("metadata", JSONB, nullable=True)
    occurred_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class AulaStatus(Base):
    """Derived cache: current status of one lesson for one account.

    Not authoritative — see module docstring. Composite PK because a
    lesson's status is a fact about the (user, lesson) pair, not an
    entity with its own identity.
    """

    __tablename__ = "aula_status"
    __table_args__ = (
        CheckConstraint("status IN ('em_andamento', 'concluido')", name="aula_status_check"),
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    aula_id: Mapped[str] = mapped_column(Text, primary_key=True)
    status: Mapped[str] = mapped_column(Text, nullable=False)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )


class BadgeAward(Base):
    """Derived cache: which badges an account has been awarded, and when.

    Award TIMING (which real action earns which of the 13 badges) is
    explicitly out of scope for this wave — this table only records that
    an award happened, once someone else's wave calls the mechanism.
    """

    __tablename__ = "badge_award"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    badge_id: Mapped[str] = mapped_column(Text, primary_key=True)
    awarded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class StudyStreak(Base):
    """Derived cache: consecutive-day study streak for one account.

    Recomputed transactionally on every event via a single
    INSERT ... ON CONFLICT, comparing ``last_active_date`` against
    ``CURRENT_DATE`` — see ``app/services/progress_service.py``.
    """

    __tablename__ = "study_streak"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    current_streak_days: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    longest_streak_days: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    last_active_date: Mapped[date] = mapped_column(
        Date, nullable=False, server_default=func.current_date()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )
