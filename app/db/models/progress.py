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
    LargeBinary,
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

# --- Derivation vocabularies (Peça D) -----------------------------------
#
# Which event types count as the learner having STUDIED on a day. This is
# the list the day-streak derives from, and it is deliberately NOT all of
# `EVENT_TYPES`: `badge_conquistado` is emitted by the machine itself
# (the award mechanism), never by a learner action, so counting it would
# let the product's own congratulation extend the learner's streak. A
# streak is evidence about the learner; an award is evidence about the
# machine.
STREAK_EVENT_TYPES: tuple[str, ...] = (
    "aula_iniciada",
    "aula_concluida",
    "instrumento_usado",
    "exercicio_respondido",
)

# The "Praticado" axis of `docs/alexandria-v2/bar.md` §S3: a registered
# ATTEMPT at a task. Only these two event types are attempts — opening or
# finishing a lesson is "Percorrido", and a badge is motivation, not
# evidence. Nothing here is ever presented as "Demonstrado".
PRACTICE_EVENT_TYPES: tuple[str, ...] = (
    "instrumento_usado",
    "exercicio_respondido",
)

# The learner's day is the learner's day. `progress_event.occurred_at` is
# TIMESTAMPTZ (an instant), and an instant only becomes a calendar day
# once a zone is named. This is the zone the product declares by default;
# the read endpoints accept an explicit override.
DEFAULT_LEARNER_TIMEZONE = "America/Sao_Paulo"


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

    CACHE, NOT SOURCE (Peça D). It used to be maintained by blind
    increment — every event, of every type, compared ``last_active_date``
    to the database clock's ``CURRENT_DATE`` and added one. Two facts
    were wrong in that: the day was UTC's day, not the learner's (a
    22:00 study session in Brasília landed on the next calendar day),
    and ``badge_conquistado`` — which the machine emits — extended the
    learner's streak.

    It is now written only from the derivation over ``progress_event``
    in ``app/services/progress_service.py``: distinct study days in a
    named zone, restricted to ``STREAK_EVENT_TYPES``. No read path reads
    this table as a fact; every endpoint derives from the log. The row
    survives as a reconstructible cache and can be dropped and rebuilt at
    any time without losing anything.

    ``longest_streak_days`` stores the record's LENGTH and not the day it
    ended — that column does not exist and was deliberately not added
    (no migration). "Longest streak: 5 days, ending 12 September" is
    derived from the log on read, never stored, never guessed.
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

# --- Perfil da Alexandria (LYCEUM, V2) ----------------------------------
#
# The two things on the Alexandria profile that the event log cannot
# carry: the learner's photo and the banner they chose. Founder,
# 2026-11-15: "a foto é só da Alexandria" — this photo is NOT the
# platform account's avatar and nothing outside /alexandria reads it.
# Identity (name, e-mail, password) stays in `users`, untouched.
#
# XP, level, medals, calendar and history are NOT stored here: all of
# them are derived from `progress_event` by whoever already knows the
# curriculum (the frontend). The banner id is opaque to this backend;
# which banners a learner has unlocked is a curriculum fact, so the
# frontend validates it and falls back to the default when it isn't.

FOTO_TIPOS: tuple[str, ...] = ("image/webp", "image/jpeg", "image/png")
FOTO_MAX_BYTES = 300_000


class AlexandriaPerfil(Base):
    __tablename__ = "alexandria_perfil"
    __table_args__ = (
        CheckConstraint(
            "foto_tipo IS NULL OR foto_tipo IN ('image/webp', 'image/jpeg', 'image/png')",
            name="alexandria_perfil_foto_tipo_check",
        ),
        CheckConstraint(
            f"foto IS NULL OR octet_length(foto) <= {FOTO_MAX_BYTES}",
            name="alexandria_perfil_foto_tamanho_check",
        ),
        CheckConstraint(
            "(foto IS NULL) = (foto_tipo IS NULL)",
            name="alexandria_perfil_foto_par_check",
        ),
        CheckConstraint(
            "faixa IS NULL OR faixa ~ '^[a-z0-9][a-z0-9-]{0,63}$'",
            name="alexandria_perfil_faixa_check",
        ),
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    foto: Mapped[bytes | None] = mapped_column(LargeBinary, nullable=True)
    foto_tipo: Mapped[str | None] = mapped_column(Text, nullable=True)
    foto_atualizada_em: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    faixa: Mapped[str | None] = mapped_column(Text, nullable=True)
    atualizado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )
