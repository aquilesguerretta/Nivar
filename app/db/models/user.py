"""ORM model — platform user (Wave 9 identity).

One account per person at the platform level, not per product. Email is
the identity key across auth methods: a Google sign-in for an address
that already has a password account links to that row instead of
creating a second one.

Email is stored lower-cased at every write and every lookup path, so the
plain UNIQUE constraint carries the "never duplicate by email" invariant
on its own — no functional index or CITEXT extension needed.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint(
            "password_hash IS NOT NULL OR google_id IS NOT NULL",
            name="users_has_auth_method",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=func.gen_random_uuid(),
    )
    email: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    # Null for Google-only accounts; the table CHECK keeps at least one method.
    password_hash: Mapped[str | None] = mapped_column(Text, nullable=True)
    google_id: Mapped[str | None] = mapped_column(Text, nullable=True, unique=True)
    name: Mapped[str] = mapped_column(Text, nullable=False)
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
