"""Ariadne Core v0 — case-independent lineage kernel (NIV-46).

Revision ID: 0012_ariadne_core
Revises: 0011_argos_same_source_lineage
Create Date: 2026-09-19

This migration is additive.  It creates a tenant-scoped relational execution
spine for versioned private state, evidence references, assumption versions,
model versions, scenarios, immutable run manifests, and results.  Composite
foreign keys prevent a known UUID from being used to cross a tenant boundary.

Historical rows cannot be rewritten in place.  Current private state is a view
over the linear version chain, not a separately maintained mutable record.
Deletes remain available to a future authorized lifecycle process, with
foreign keys preventing accidental parent deletion while dependents exist.
"""

from typing import Sequence, Union

from alembic import op


revision: str = "0012_ariadne_core"
down_revision: Union[str, None] = "0011_argos_same_source_lineage"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


_UPDATE_PROTECTED_TABLES = (
    "ariadne_private_object",
    "ariadne_evidence_ref",
    "ariadne_private_state_version",
    "ariadne_state_evidence",
    "ariadne_assumption_set",
    "ariadne_assumption_set_version",
    "ariadne_model_definition",
    "ariadne_model_version",
    "ariadne_scenario",
    "ariadne_model_run",
    "ariadne_result",
)


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE ariadne_private_object (
          id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          tenant_id   TEXT NOT NULL CHECK (length(tenant_id) > 0),
          object_type TEXT NOT NULL CHECK (length(object_type) > 0),
          created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
          CONSTRAINT ariadne_object_id_tenant_key UNIQUE (id, tenant_id)
        );
        CREATE INDEX ariadne_object_tenant_type_idx
          ON ariadne_private_object(tenant_id, object_type);
        """
    )
    op.execute(
        """
        CREATE TABLE ariadne_evidence_ref (
          id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          tenant_id          TEXT NOT NULL CHECK (length(tenant_id) > 0),
          source_artifact_id TEXT NOT NULL CHECK (length(source_artifact_id) > 0),
          source_version     TEXT NOT NULL CHECK (length(source_version) > 0),
          locator            TEXT NOT NULL CHECK (length(locator) > 0),
          observed_at        TIMESTAMPTZ,
          recorded_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
          transform_ref      TEXT,
          CONSTRAINT ariadne_evidence_id_tenant_key UNIQUE (id, tenant_id)
        );
        CREATE INDEX ariadne_evidence_tenant_source_idx
          ON ariadne_evidence_ref(tenant_id, source_artifact_id);
        """
    )
    op.execute(
        """
        CREATE TABLE ariadne_private_state_version (
          id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          tenant_id           TEXT NOT NULL,
          object_id           UUID NOT NULL,
          version             INTEGER NOT NULL CHECK (version > 0),
          payload             JSONB NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
          recorded_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
          valid_from          TIMESTAMPTZ,
          valid_to            TIMESTAMPTZ,
          previous_version_id UUID,
          CONSTRAINT ariadne_state_id_tenant_key UNIQUE (id, tenant_id),
          CONSTRAINT ariadne_state_id_object_tenant_key
            UNIQUE (id, object_id, tenant_id),
          CONSTRAINT ariadne_state_object_version_key UNIQUE (object_id, version),
          CONSTRAINT ariadne_state_previous_version_key UNIQUE (previous_version_id),
          CONSTRAINT ariadne_state_object_tenant_fkey
            FOREIGN KEY (object_id, tenant_id)
            REFERENCES ariadne_private_object(id, tenant_id) ON DELETE RESTRICT,
          CONSTRAINT ariadne_state_previous_object_tenant_fkey
            FOREIGN KEY (previous_version_id, object_id, tenant_id)
            REFERENCES ariadne_private_state_version(id, object_id, tenant_id)
            ON DELETE RESTRICT,
          CONSTRAINT ariadne_state_valid_time_check CHECK (
            valid_from IS NULL OR valid_to IS NULL OR valid_from <= valid_to
          )
        );
        CREATE UNIQUE INDEX ariadne_state_one_root_per_object_idx
          ON ariadne_private_state_version(object_id)
          WHERE previous_version_id IS NULL;
        CREATE INDEX ariadne_state_tenant_object_idx
          ON ariadne_private_state_version(tenant_id, object_id);
        """
    )
    op.execute(
        """
        CREATE TABLE ariadne_state_evidence (
          state_version_id UUID NOT NULL,
          evidence_ref_id  UUID NOT NULL,
          tenant_id        TEXT NOT NULL,
          created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
          PRIMARY KEY (state_version_id, evidence_ref_id),
          CONSTRAINT ariadne_state_evidence_state_tenant_fkey
            FOREIGN KEY (state_version_id, tenant_id)
            REFERENCES ariadne_private_state_version(id, tenant_id) ON DELETE RESTRICT,
          CONSTRAINT ariadne_state_evidence_ref_tenant_fkey
            FOREIGN KEY (evidence_ref_id, tenant_id)
            REFERENCES ariadne_evidence_ref(id, tenant_id) ON DELETE RESTRICT
        );
        CREATE INDEX ariadne_state_evidence_tenant_idx
          ON ariadne_state_evidence(tenant_id);
        """
    )
    op.execute(
        """
        CREATE TABLE ariadne_assumption_set (
          id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          tenant_id  TEXT NOT NULL CHECK (length(tenant_id) > 0),
          name       TEXT NOT NULL CHECK (length(name) > 0),
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          CONSTRAINT ariadne_assumption_set_id_tenant_key UNIQUE (id, tenant_id),
          CONSTRAINT ariadne_assumption_set_tenant_name_key UNIQUE (tenant_id, name)
        );
        """
    )
    op.execute(
        """
        CREATE TABLE ariadne_assumption_set_version (
          id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          tenant_id             TEXT NOT NULL,
          assumption_set_id     UUID NOT NULL,
          version               INTEGER NOT NULL CHECK (version > 0),
          values                JSONB NOT NULL CHECK (jsonb_typeof(values) = 'object'),
          value_schema          JSONB NOT NULL DEFAULT '{}'::jsonb
                                  CHECK (jsonb_typeof(value_schema) = 'object'),
          origin                TEXT NOT NULL
                                  CHECK (origin IN ('human_defined', 'rule', 'other')),
          previous_version_id   UUID,
          created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
          CONSTRAINT ariadne_assumption_version_id_tenant_key UNIQUE (id, tenant_id),
          CONSTRAINT ariadne_assumption_version_id_set_tenant_key
            UNIQUE (id, assumption_set_id, tenant_id),
          CONSTRAINT ariadne_assumption_set_version_key
            UNIQUE (assumption_set_id, version),
          CONSTRAINT ariadne_assumption_previous_version_key UNIQUE (previous_version_id),
          CONSTRAINT ariadne_assumption_version_set_tenant_fkey
            FOREIGN KEY (assumption_set_id, tenant_id)
            REFERENCES ariadne_assumption_set(id, tenant_id) ON DELETE RESTRICT,
          CONSTRAINT ariadne_assumption_previous_set_tenant_fkey
            FOREIGN KEY (previous_version_id, assumption_set_id, tenant_id)
            REFERENCES ariadne_assumption_set_version(id, assumption_set_id, tenant_id)
            ON DELETE RESTRICT
        );
        CREATE UNIQUE INDEX ariadne_assumption_one_root_per_set_idx
          ON ariadne_assumption_set_version(assumption_set_id)
          WHERE previous_version_id IS NULL;
        """
    )
    op.execute(
        """
        CREATE TABLE ariadne_model_definition (
          id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          tenant_id  TEXT NOT NULL CHECK (length(tenant_id) > 0),
          name       TEXT NOT NULL CHECK (length(name) > 0),
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          CONSTRAINT ariadne_model_definition_id_tenant_key UNIQUE (id, tenant_id),
          CONSTRAINT ariadne_model_definition_tenant_name_key UNIQUE (tenant_id, name)
        );
        """
    )
    op.execute(
        """
        CREATE TABLE ariadne_model_version (
          id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          tenant_id               TEXT NOT NULL,
          model_definition_id     UUID NOT NULL,
          semantic_version        TEXT NOT NULL CHECK (length(semantic_version) > 0),
          implementation_identity TEXT NOT NULL
                                    CHECK (length(implementation_identity) > 0),
          input_contract          JSONB NOT NULL
                                    CHECK (jsonb_typeof(input_contract) = 'object'),
          output_contract         JSONB NOT NULL
                                    CHECK (jsonb_typeof(output_contract) = 'object'),
          created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
          CONSTRAINT ariadne_model_version_id_tenant_key UNIQUE (id, tenant_id),
          CONSTRAINT ariadne_model_definition_semantic_version_key
            UNIQUE (model_definition_id, semantic_version),
          CONSTRAINT ariadne_model_version_definition_tenant_fkey
            FOREIGN KEY (model_definition_id, tenant_id)
            REFERENCES ariadne_model_definition(id, tenant_id) ON DELETE RESTRICT
        );
        """
    )
    op.execute(
        """
        CREATE TABLE ariadne_scenario (
          id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          tenant_id                 TEXT NOT NULL,
          name                      TEXT NOT NULL,
          state_version_id          UUID NOT NULL,
          assumption_set_version_id UUID NOT NULL,
          hypothetical_state        JSONB NOT NULL DEFAULT '{}'::jsonb
                                      CHECK (jsonb_typeof(hypothetical_state) = 'object'),
          created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
          CONSTRAINT ariadne_scenario_id_tenant_key UNIQUE (id, tenant_id),
          CONSTRAINT ariadne_scenario_manifest_key
            UNIQUE (id, tenant_id, state_version_id, assumption_set_version_id),
          CONSTRAINT ariadne_scenario_state_tenant_fkey
            FOREIGN KEY (state_version_id, tenant_id)
            REFERENCES ariadne_private_state_version(id, tenant_id) ON DELETE RESTRICT,
          CONSTRAINT ariadne_scenario_assumption_tenant_fkey
            FOREIGN KEY (assumption_set_version_id, tenant_id)
            REFERENCES ariadne_assumption_set_version(id, tenant_id) ON DELETE RESTRICT
        );
        """
    )
    op.execute(
        """
        CREATE TABLE ariadne_model_run (
          id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          tenant_id                 TEXT NOT NULL,
          model_version_id          UUID NOT NULL,
          scenario_id               UUID NOT NULL,
          state_version_id          UUID NOT NULL,
          assumption_set_version_id UUID NOT NULL,
          execution_configuration   JSONB NOT NULL
                                      CHECK (jsonb_typeof(execution_configuration) = 'object'),
          started_at                TIMESTAMPTZ NOT NULL,
          produced_at               TIMESTAMPTZ NOT NULL,
          CONSTRAINT ariadne_model_run_id_tenant_key UNIQUE (id, tenant_id),
          CONSTRAINT ariadne_model_run_time_check CHECK (produced_at >= started_at),
          CONSTRAINT ariadne_model_run_model_tenant_fkey
            FOREIGN KEY (model_version_id, tenant_id)
            REFERENCES ariadne_model_version(id, tenant_id) ON DELETE RESTRICT,
          CONSTRAINT ariadne_model_run_scenario_manifest_fkey
            FOREIGN KEY (
              scenario_id, tenant_id, state_version_id, assumption_set_version_id
            ) REFERENCES ariadne_scenario(
              id, tenant_id, state_version_id, assumption_set_version_id
            ) ON DELETE RESTRICT
        );
        CREATE INDEX ariadne_model_run_tenant_scenario_idx
          ON ariadne_model_run(tenant_id, scenario_id);
        """
    )
    op.execute(
        """
        CREATE TABLE ariadne_result (
          id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          tenant_id    TEXT NOT NULL,
          model_run_id UUID NOT NULL,
          result_key   TEXT NOT NULL CHECK (length(result_key) > 0),
          payload      JSONB NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
          unit         TEXT,
          produced_at  TIMESTAMPTZ NOT NULL,
          CONSTRAINT ariadne_result_run_key UNIQUE (model_run_id, result_key),
          CONSTRAINT ariadne_result_run_tenant_fkey
            FOREIGN KEY (model_run_id, tenant_id)
            REFERENCES ariadne_model_run(id, tenant_id) ON DELETE RESTRICT
        );
        CREATE INDEX ariadne_result_tenant_run_idx
          ON ariadne_result(tenant_id, model_run_id);
        """
    )
    op.execute(
        """
        CREATE VIEW ariadne_current_state_version AS
        SELECT state.*
        FROM ariadne_private_state_version state
        WHERE NOT EXISTS (
          SELECT 1
          FROM ariadne_private_state_version successor
          WHERE successor.previous_version_id = state.id
            AND successor.object_id = state.object_id
            AND successor.tenant_id = state.tenant_id
        );
        """
    )
    op.execute(
        """
        CREATE FUNCTION ariadne_reject_update() RETURNS trigger AS $$
        BEGIN
          RAISE EXCEPTION
            'ariadne: UPDATE on %.% is not permitted - lineage records are append-only',
            TG_TABLE_SCHEMA, TG_TABLE_NAME;
        END;
        $$ LANGUAGE plpgsql;
        """
    )
    for table in _UPDATE_PROTECTED_TABLES:
        op.execute(
            f"""
            CREATE TRIGGER {table}_reject_update
            BEFORE UPDATE ON {table}
            FOR EACH ROW EXECUTE FUNCTION ariadne_reject_update();
            """
        )


def downgrade() -> None:
    op.execute("DROP VIEW IF EXISTS ariadne_current_state_version;")
    for table in reversed(_UPDATE_PROTECTED_TABLES):
        op.execute(f"DROP TABLE IF EXISTS {table} CASCADE;")
    op.execute("DROP FUNCTION IF EXISTS ariadne_reject_update();")
