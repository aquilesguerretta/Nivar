"""Add the Argos Source Registry without changing existing evidence tables."""

from alembic import op

revision = "0017_argos_source_registry"
down_revision = "0016_ariadne_close"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("""
        CREATE TABLE argos_source_revision (
            source_id TEXT NOT NULL,
            policy_version INTEGER NOT NULL CHECK (policy_version > 0),
            definition JSONB NOT NULL CHECK (jsonb_typeof(definition) = 'object'),
            recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            check_status TEXT NOT NULL DEFAULT 'not_checked'
                CHECK (check_status IN ('not_checked', 'healthy', 'broken', 'policy_drift')),
            last_checked_at TIMESTAMPTZ,
            last_success_at TIMESTAMPTZ,
            PRIMARY KEY (source_id, policy_version),
            CHECK ((check_status = 'not_checked') = (last_checked_at IS NULL)),
            CHECK (last_success_at IS NULL OR (last_checked_at IS NOT NULL AND last_success_at <= last_checked_at)),
            CHECK (check_status <> 'healthy' OR (last_success_at IS NOT NULL AND last_success_at = last_checked_at))
        )
    """)
    op.execute("""
        CREATE FUNCTION argos_preserve_source_policy() RETURNS trigger LANGUAGE plpgsql AS $$
        BEGIN
            IF TG_OP = 'DELETE' THEN
                RAISE EXCEPTION 'Argos source policy revisions cannot be deleted';
            END IF;
            IF (NEW.source_id, NEW.policy_version, NEW.definition, NEW.recorded_at)
                IS DISTINCT FROM (OLD.source_id, OLD.policy_version, OLD.definition, OLD.recorded_at) THEN
                RAISE EXCEPTION 'Argos source policy revisions cannot be rewritten';
            END IF;
            IF OLD.check_status = 'policy_drift' AND NEW.check_status <> 'policy_drift' THEN
                RAISE EXCEPTION 'Argos source policy drift requires a new review';
            END IF;
            RETURN NEW;
        END;
        $$
    """)
    op.execute("""
        CREATE TRIGGER argos_source_policy_history
        BEFORE UPDATE OR DELETE ON argos_source_revision
        FOR EACH ROW EXECUTE FUNCTION argos_preserve_source_policy()
    """)


def downgrade() -> None:
    op.execute("DROP TABLE argos_source_revision")
    op.execute("DROP FUNCTION argos_preserve_source_policy()")
