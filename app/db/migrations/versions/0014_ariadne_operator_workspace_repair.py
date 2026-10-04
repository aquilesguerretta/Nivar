"""Repair a missing Ariadne operator workspace table.

Revision ID: 0014_ariadne_workspace_repair
Revises: 0013_ariadne_operator_workspace

Migration 0013 semantically owns ``ariadne_operator_workspace``.  This
forward repair handles an observed production drift where Alembic history can
reach 0013 while that table is absent.  It deliberately refuses to reconstruct
missing predecessor/Core relations because that would conceal broader history
corruption.
"""

from typing import Union

from alembic import op


revision: str = "0014_ariadne_workspace_repair"
down_revision: Union[str, None] = "0013_ariadne_operator_workspace"
branch_labels: Union[str, tuple[str, ...], None] = None
depends_on: Union[str, tuple[str, ...], None] = None


def upgrade() -> None:
    op.execute(
        """
        DO $$
        DECLARE
          missing_relations TEXT[];
        BEGIN
          SELECT array_agg(relation_name ORDER BY relation_name)
          INTO missing_relations
          FROM unnest(
            ARRAY[
              'public.users',
              'public.ariadne_private_object',
              'public.ariadne_model_run'
            ]
          ) AS prerequisites(relation_name)
          WHERE to_regclass(relation_name) IS NULL;

          IF missing_relations IS NOT NULL THEN
            RAISE EXCEPTION
              'Ariadne operator workspace repair refused: required predecessor relation(s) missing: %',
              array_to_string(missing_relations, ', ');
          END IF;

          IF to_regclass('public.ariadne_operator_workspace') IS NULL THEN
            CREATE TABLE public.ariadne_operator_workspace (
              id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              owner_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
              label         TEXT NOT NULL,
              synthetic     BOOLEAN NOT NULL DEFAULT true,
              created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
              CONSTRAINT ariadne_operator_workspace_label_check
                CHECK (length(label) > 0)
            );
            CREATE INDEX ariadne_operator_workspace_owner_created_idx
              ON public.ariadne_operator_workspace(owner_user_id, created_at);
          END IF;
        END
        $$;
        """
    )


def downgrade() -> None:
    # 0013 owns and expects this table.  Removing it here would recreate the
    # production drift this migration repairs, so 0014 -> 0013 is a no-op.
    pass
