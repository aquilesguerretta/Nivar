"""Platform messaging — conversation and message.

Revision ID: 0007_conversation
Revises: 0006_solar_proposal_validator
Create Date: 2026-09-01

Additive only. No foreign key to Conta de Luz Express, Solar Proposal
Validator, or Diagnóstico submission tables. ``product_id`` is TEXT without
a CHECK so the catalog can grow without a migration.
"""

from typing import Sequence, Union

from alembic import op


revision: str = "0007_conversation"
down_revision: Union[str, None] = "0006_solar_proposal_validator"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE conversation (
          id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          product_id   TEXT NOT NULL,
          status       TEXT NOT NULL DEFAULT 'open'
                       CHECK (status IN ('open', 'closed')),
          subject      TEXT,
          origin_kind  TEXT,
          origin_id    UUID,
          created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
          CONSTRAINT conversation_origin_pair_check CHECK (
            (origin_kind IS NULL AND origin_id IS NULL)
            OR (origin_kind IS NOT NULL AND origin_id IS NOT NULL)
          )
        );
        """
    )
    op.execute(
        "CREATE INDEX conversation_user_created_idx "
        "ON conversation(user_id, created_at DESC);"
    )
    op.execute(
        "CREATE INDEX conversation_product_created_idx "
        "ON conversation(product_id, created_at DESC);"
    )
    op.execute(
        "CREATE INDEX conversation_status_created_idx "
        "ON conversation(status, created_at);"
    )
    op.execute(
        "CREATE UNIQUE INDEX conversation_origin_unique_idx "
        "ON conversation(origin_kind, origin_id) "
        "WHERE origin_id IS NOT NULL;"
    )
    op.execute(
        """
        CREATE TABLE message (
          id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          conversation_id  UUID NOT NULL REFERENCES conversation(id) ON DELETE CASCADE,
          author_user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          role             TEXT NOT NULL CHECK (role IN ('customer', 'operator')),
          body             TEXT NOT NULL CHECK (char_length(body) > 0),
          created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
        );
        """
    )
    op.execute(
        "CREATE INDEX message_conversation_created_idx "
        "ON message(conversation_id, created_at);"
    )


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS message;")
    op.execute("DROP TABLE IF EXISTS conversation;")
