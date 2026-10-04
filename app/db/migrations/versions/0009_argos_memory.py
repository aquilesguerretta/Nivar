"""Argos Memory — raw artifact evidence and snapshot/version records (NIV-12).

Revision ID: 0009_argos_memory
Revises: 0008_diagnostico_energetico
Create Date: 2026-09-16

Additive only. Two new tables, unrelated to ``users`` or any Advisory
submission table — Argos Memory is external-world evidence, not client data.

``argos_raw_artifact`` holds immutable, content-addressed raw bytes (BYTEA),
reusing the storage pattern already established by ``conta_luz_submission``
/ ``solar_proposal_submission`` (Postgres is the only durable storage the
Railway web container has — see ``docs/conta-luz-express-wave-2-backend.md``).

``argos_snapshot`` holds one retrieval/version event, self-referencing the
immediately prior snapshot for the same ``source_id`` to form a linear
version chain.

Both tables get a trigger that rejects ``UPDATE``/``DELETE`` outright — not
a silent no-op, an explicit exception — so prior evidence cannot be mutated
even by a raw SQL statement that bypasses the ORM. ``argos_current_snapshot``
is a view, not a table: current state is resolved live from history, so
there is no second, independently-mutable "current truth" store to drift.

``argos_snapshot_one_root_per_source_idx`` is a partial unique index on
``source_id`` where ``prior_snapshot_id IS NULL``. The plain ``UNIQUE
(prior_snapshot_id)`` constraint above does not by itself stop two
concurrent *first* captures of a brand-new source: standard SQL treats every
``NULL`` as distinct from every other ``NULL``, so two rows with
``prior_snapshot_id = NULL`` do not collide against a non-partial unique
constraint. This index closes that gap at the database level — it is the
actual correctness guarantee (a direct SQL insert that bypasses the service
layer is rejected too), independent of any application-level locking. This
was discovered and fixed before PR #9 (which carries this migration) was
merged, so it is folded directly into this migration rather than added as a
separate 0010 that would only exist to repair an unmerged one.
"""

from typing import Sequence, Union

from alembic import op


revision: str = "0009_argos_memory"
down_revision: Union[str, None] = "0008_diagnostico_energetico"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE argos_raw_artifact (
          id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          sha256             TEXT NOT NULL UNIQUE,
          content_type       TEXT NOT NULL,
          byte_size          BIGINT NOT NULL CHECK (byte_size > 0),
          data               BYTEA NOT NULL,
          first_captured_at  TIMESTAMPTZ NOT NULL DEFAULT now()
        );
        """
    )

    op.execute(
        """
        CREATE TABLE argos_snapshot (
          id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          source_id               TEXT NOT NULL,
          artifact_id             UUID NOT NULL
                                   REFERENCES argos_raw_artifact(id) ON DELETE RESTRICT,

          retrieved_at            TIMESTAMPTZ NOT NULL,
          acquisition_metadata    JSONB,

          published_at            TIMESTAMPTZ,
          reference_time_start    TIMESTAMPTZ,
          reference_time_end      TIMESTAMPTZ,
          source_timezone         TEXT,

          adapter_version         TEXT NOT NULL,
          parser_version          TEXT,
          processing_status       TEXT NOT NULL DEFAULT 'captured'
                                   CHECK (processing_status IN ('captured')),

          rights_record_ref       TEXT,
          rights_summary_state    TEXT NOT NULL DEFAULT 'unknown'
                                   CHECK (rights_summary_state IN
                                     ('cleared', 'restricted', 'unclear', 'unknown')),

          prior_snapshot_id       UUID UNIQUE
                                   REFERENCES argos_snapshot(id) ON DELETE RESTRICT,
          revision_relation       TEXT NOT NULL
                                   CHECK (revision_relation IN ('first', 'unchanged', 'changed')),

          created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),

          CONSTRAINT argos_snapshot_reference_time_order_check CHECK (
            reference_time_start IS NULL OR reference_time_end IS NULL
            OR reference_time_start <= reference_time_end
          ),
          CONSTRAINT argos_snapshot_first_requires_no_prior_check CHECK (
            (revision_relation = 'first') = (prior_snapshot_id IS NULL)
          )
        );
        """
    )
    op.execute(
        "CREATE INDEX argos_snapshot_source_retrieved_idx "
        "ON argos_snapshot(source_id, retrieved_at DESC);"
    )
    op.execute(
        "CREATE INDEX argos_snapshot_artifact_idx ON argos_snapshot(artifact_id);"
    )
    # At most one root snapshot (prior_snapshot_id IS NULL) per source_id —
    # see module docstring. Partial index: plain UNIQUE does not constrain
    # NULLs against each other.
    op.execute(
        "CREATE UNIQUE INDEX argos_snapshot_one_root_per_source_idx "
        "ON argos_snapshot(source_id) WHERE prior_snapshot_id IS NULL;"
    )

    # Current state is a live projection over history, not a maintained table.
    op.execute(
        """
        CREATE VIEW argos_current_snapshot AS
        SELECT DISTINCT ON (source_id) *
        FROM argos_snapshot
        ORDER BY source_id, retrieved_at DESC, id DESC;
        """
    )

    # Explicit rejection, not a silent RULE ... DO INSTEAD NOTHING — a caller
    # that tries to mutate evidence must see it fail, not appear to succeed.
    op.execute(
        """
        CREATE FUNCTION argos_reject_mutation() RETURNS trigger AS $$
        BEGIN
          RAISE EXCEPTION
            'argos: % on %.% is not permitted - Argos Memory evidence is immutable (row id %)',
            TG_OP, TG_TABLE_SCHEMA, TG_TABLE_NAME, OLD.id;
        END;
        $$ LANGUAGE plpgsql;
        """
    )
    op.execute(
        """
        CREATE TRIGGER argos_raw_artifact_immutable
        BEFORE UPDATE OR DELETE ON argos_raw_artifact
        FOR EACH ROW EXECUTE FUNCTION argos_reject_mutation();
        """
    )
    op.execute(
        """
        CREATE TRIGGER argos_snapshot_immutable
        BEFORE UPDATE OR DELETE ON argos_snapshot
        FOR EACH ROW EXECUTE FUNCTION argos_reject_mutation();
        """
    )


def downgrade() -> None:
    op.execute("DROP TRIGGER IF EXISTS argos_snapshot_immutable ON argos_snapshot;")
    op.execute("DROP TRIGGER IF EXISTS argos_raw_artifact_immutable ON argos_raw_artifact;")
    op.execute("DROP FUNCTION IF EXISTS argos_reject_mutation();")
    op.execute("DROP VIEW IF EXISTS argos_current_snapshot;")
    op.execute("DROP TABLE IF EXISTS argos_snapshot CASCADE;")
    op.execute("DROP TABLE IF EXISTS argos_raw_artifact CASCADE;")
