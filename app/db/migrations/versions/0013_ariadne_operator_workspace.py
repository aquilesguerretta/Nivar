"""Add the private Ariadne operator workspace boundary.

Revision ID: 0013_ariadne_operator_workspace
Revises: 0012_ariadne_core
"""

from typing import Union

from alembic import op


revision: str = "0013_ariadne_operator_workspace"
down_revision: Union[str, None] = "0012_ariadne_core"
branch_labels: Union[str, tuple[str, ...], None] = None
depends_on: Union[str, tuple[str, ...], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE ariadne_operator_workspace (
          id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
          label         TEXT NOT NULL,
          synthetic     BOOLEAN NOT NULL DEFAULT true,
          created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
          CONSTRAINT ariadne_operator_workspace_label_check CHECK (length(label) > 0)
        );
        CREATE INDEX ariadne_operator_workspace_owner_created_idx
          ON ariadne_operator_workspace(owner_user_id, created_at);
        """
    )


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS ariadne_operator_workspace;")
