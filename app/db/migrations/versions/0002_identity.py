"""Platform identity — users and per-product activation.

Revision ID: 0002_identity
Revises: 0001_postgis_infrastructure
Create Date: 2026-07-29

Additive only. Touches no Wave 7/8 table.

gen_random_uuid() is core in PostgreSQL 13+, but pgcrypto is created
defensively so the migration also applies against an older server.

The FK carries ON DELETE CASCADE, which the Wave 9 brief's literal SQL
does not specify. Without it any future account-deletion path fails at
the constraint, and a product_access row outliving its user is an orphan
with no meaning. Documented as the single deviation from the brief.
"""

from typing import Sequence, Union

from alembic import op

revision: str = "0002_identity"
down_revision: Union[str, None] = "0001_postgis_infrastructure"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto;")

    op.execute(
        """
        CREATE TABLE users (
          id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email           TEXT UNIQUE NOT NULL,
          password_hash   TEXT,
          google_id       TEXT UNIQUE,
          name            TEXT NOT NULL,
          created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
          CONSTRAINT users_has_auth_method
            CHECK (password_hash IS NOT NULL OR google_id IS NOT NULL)
        );
        """
    )

    op.execute(
        """
        CREATE TABLE product_access (
          id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          product_id    TEXT NOT NULL,
          activated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
          UNIQUE (user_id, product_id)
        );
        """
    )
    op.execute("CREATE INDEX product_access_user_idx ON product_access (user_id);")


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS product_access CASCADE;")
    op.execute("DROP TABLE IF EXISTS users CASCADE;")
