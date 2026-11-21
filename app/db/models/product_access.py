"""ORM model — per-product activation (Wave 9 identity).

Creating an account activates nothing. A row exists here only once the
user has entered a specific product. No payment gate in this wave, by
explicit decision: activation is free and automatic on the endpoint call.

PRODUCT_CATALOG is the canonical backend list. It deliberately does not
import from the frontend catalog (src/lib/data/br-destinos.ts), which is
ARCHITECT territory — the two need to stay conceptually in sync, but the
backend does not read across that boundary. Membership is enforced at the
API layer rather than by a CHECK constraint so the catalog can grow
without a migration.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Text, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base

# us-terminal removed (CURSOR · catálogo /conta Wave 1): the American
# side must not appear in /conta at all — named without a link is still
# apparent. Re-add only when that product is intentionally public.
PRODUCT_CATALOG: tuple[str, ...] = (
    "alexandria",
    "terminal-brasil",
    "energy-brief",
    "conta-de-luz-express",
    "solar-proposal-validator",
    "diagnostico-energetico",
)
PRODUCT_IDS: frozenset[str] = frozenset(PRODUCT_CATALOG)


class ProductAccess(Base):
    __tablename__ = "product_access"
    __table_args__ = (
        UniqueConstraint("user_id", "product_id", name="product_access_user_id_product_id_key"),
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
    activated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
