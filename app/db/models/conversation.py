"""ORM models — platform messaging for any entitled account.

A conversation is a thread owned by one user and tagged with one
``product_id`` from ``PRODUCT_CATALOG``. It is not Diagnóstico-specific:
Conta de Luz Express and Solar Proposal Validator gain the same access in
a later wiring wave. ``origin_kind`` / ``origin_id`` is an opaque pointer
to a case in a sibling table — never a foreign key across submission
domains, same honesty as ``progress_event.entity_id``.

``message`` is an append-only log. Edits and deletes are out of scope.
``role`` is derived from the caller at insert time, never taken from the
request body.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    Text,
    desc,
    func,
    text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


CONVERSATION_STATUSES: tuple[str, ...] = ("open", "closed")
MESSAGE_ROLES: tuple[str, ...] = ("customer", "operator")

# Application-level origin kind for Diagnóstico cases. Not a DB enum —
# CLE / Solar kinds enter later without a migration.
ORIGIN_DIAGNOSTICO_SUBMISSION = "diagnostico_energetico_submission"


class Conversation(Base):
    __tablename__ = "conversation"
    __table_args__ = (
        CheckConstraint(
            "status IN ('open', 'closed')",
            name="conversation_status_check",
        ),
        CheckConstraint(
            """
            (origin_kind IS NULL AND origin_id IS NULL)
            OR (origin_kind IS NOT NULL AND origin_id IS NOT NULL)
            """,
            name="conversation_origin_pair_check",
        ),
        Index(
            "conversation_user_created_idx",
            "user_id",
            desc("created_at"),
        ),
        Index(
            "conversation_product_created_idx",
            "product_id",
            desc("created_at"),
        ),
        Index(
            "conversation_status_created_idx",
            "status",
            "created_at",
        ),
        Index(
            "conversation_origin_unique_idx",
            "origin_kind",
            "origin_id",
            unique=True,
            postgresql_where=text("origin_id IS NOT NULL"),
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=func.gen_random_uuid(),
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    product_id: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        server_default="open",
    )
    subject: Mapped[str | None] = mapped_column(Text, nullable=True)
    origin_kind: Mapped[str | None] = mapped_column(Text, nullable=True)
    origin_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )


class Message(Base):
    __tablename__ = "message"
    __table_args__ = (
        CheckConstraint(
            "role IN ('customer', 'operator')",
            name="message_role_check",
        ),
        CheckConstraint(
            "char_length(body) > 0",
            name="message_body_not_empty_check",
        ),
        Index(
            "message_conversation_created_idx",
            "conversation_id",
            "created_at",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=func.gen_random_uuid(),
    )
    conversation_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("conversation.id", ondelete="CASCADE"),
        nullable=False,
    )
    author_user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    role: Mapped[str] = mapped_column(Text, nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
