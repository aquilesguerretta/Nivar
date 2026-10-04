"""Add operator-only display metadata for Ariadne private objects.

Revision ID: 0015_ariadne_operator_label
Revises: 0014_ariadne_workspace_repair
"""

from typing import Union

from alembic import op


revision: str = "0015_ariadne_operator_label"
down_revision: Union[str, None] = "0014_ariadne_workspace_repair"
branch_labels: Union[str, tuple[str, ...], None] = None
depends_on: Union[str, tuple[str, ...], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE ariadne_operator_object_presentation (
          object_id     UUID PRIMARY KEY
                        REFERENCES ariadne_private_object(id) ON DELETE RESTRICT,
          workspace_id  UUID NOT NULL
                        REFERENCES ariadne_operator_workspace(id) ON DELETE RESTRICT,
          display_label TEXT NOT NULL,
          created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
          CONSTRAINT ariadne_operator_object_presentation_label_check
            CHECK (length(display_label) > 0)
        );
        CREATE INDEX ariadne_operator_object_presentation_workspace_idx
          ON ariadne_operator_object_presentation(workspace_id, created_at);
        """
    )


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS ariadne_operator_object_presentation;")
