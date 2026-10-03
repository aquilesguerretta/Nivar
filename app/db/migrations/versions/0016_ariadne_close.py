"""Add assisted close metadata with frozen DDL; preserve Core histories."""

from alembic import op

revision = "0016_ariadne_close"
down_revision = "0015_ariadne_operator_label"
branch_labels = None
depends_on = None

# Frozen definitions: later ORM changes must not alter this historical migration.
ARIADNE_CLOSE_REVIEW = """
CREATE TABLE ariadne_close_review (
	id UUID NOT NULL,
	workspace_id UUID NOT NULL,
	tenant_id TEXT NOT NULL,
	scope TEXT NOT NULL,
	period TEXT NOT NULL,
	object_id UUID NOT NULL,
	assumption_set_id UUID NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
	PRIMARY KEY (id),
	UNIQUE (id, workspace_id),
	UNIQUE (workspace_id, scope, period),
	FOREIGN KEY(workspace_id) REFERENCES ariadne_operator_workspace (id),
	FOREIGN KEY(object_id, tenant_id) REFERENCES ariadne_private_object (id, tenant_id),
	FOREIGN KEY(assumption_set_id, tenant_id) REFERENCES ariadne_assumption_set (id, tenant_id),
	CHECK (tenant_id = 'ariadne-operator-workspace:' || workspace_id::text)
)

"""
ARIADNE_CLOSE_SOURCE = """
CREATE TABLE ariadne_close_source (
	id UUID NOT NULL,
	review_id UUID NOT NULL,
	workspace_id UUID NOT NULL,
	tenant_id TEXT NOT NULL,
	object_id UUID NOT NULL,
	evidence_id UUID NOT NULL,
	supersedes_id UUID,
	role TEXT NOT NULL,
	filename TEXT NOT NULL,
	content_type TEXT NOT NULL,
	sha256 TEXT NOT NULL,
	original BYTEA NOT NULL,
	preview JSONB NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
	PRIMARY KEY (id),
	UNIQUE (id, review_id, workspace_id),
	UNIQUE (review_id, role, sha256),
	FOREIGN KEY(review_id, workspace_id) REFERENCES ariadne_close_review (id, workspace_id),
	FOREIGN KEY(supersedes_id, review_id, workspace_id) REFERENCES ariadne_close_source (id, review_id, workspace_id),
	UNIQUE (supersedes_id),
	FOREIGN KEY(object_id, tenant_id) REFERENCES ariadne_private_object (id, tenant_id),
	FOREIGN KEY(evidence_id, tenant_id) REFERENCES ariadne_evidence_ref (id, tenant_id),
	CHECK (tenant_id = 'ariadne-operator-workspace:' || workspace_id::text),
	CHECK (role IN ('invoice','quantity','price','context'))
)

"""
ARIADNE_CLOSE_RECEIPT = """
CREATE TABLE ariadne_close_receipt (
	workspace_id UUID NOT NULL,
	request_key TEXT NOT NULL,
	fingerprint TEXT NOT NULL,
	response JSONB NOT NULL,
	PRIMARY KEY (workspace_id, request_key),
	FOREIGN KEY(workspace_id) REFERENCES ariadne_operator_workspace (id)
)

"""
ARIADNE_CLOSE_TREATMENT = """
CREATE TABLE ariadne_close_treatment (
	id UUID NOT NULL,
	review_id UUID NOT NULL,
	workspace_id UUID NOT NULL,
	tenant_id TEXT NOT NULL,
	result_id UUID NOT NULL,
	item_id TEXT NOT NULL,
	status TEXT NOT NULL,
	reason TEXT NOT NULL,
	note TEXT NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(review_id, workspace_id) REFERENCES ariadne_close_review (id, workspace_id),
	FOREIGN KEY(result_id, tenant_id) REFERENCES ariadne_result (id, tenant_id),
	CHECK (tenant_id = 'ariadne-operator-workspace:' || workspace_id::text),
	CHECK (status IN ('open','explained','accepted','follow_up'))
)

"""
ARIADNE_CLOSE_PACKAGE = """
CREATE TABLE ariadne_close_package (
	id UUID NOT NULL,
	review_id UUID NOT NULL,
	workspace_id UUID NOT NULL,
	tenant_id TEXT NOT NULL,
	result_id UUID NOT NULL,
	manifest JSONB NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(review_id, workspace_id) REFERENCES ariadne_close_review (id, workspace_id),
	FOREIGN KEY(result_id, tenant_id) REFERENCES ariadne_result (id, tenant_id),
	CHECK (tenant_id = 'ariadne-operator-workspace:' || workspace_id::text)
)

"""

TABLES = (
    "ariadne_close_review",
    "ariadne_close_source",
    "ariadne_close_receipt",
    "ariadne_close_treatment",
    "ariadne_close_package",
)
DDL = (
    ARIADNE_CLOSE_REVIEW,
    ARIADNE_CLOSE_SOURCE,
    ARIADNE_CLOSE_RECEIPT,
    ARIADNE_CLOSE_TREATMENT,
    ARIADNE_CLOSE_PACKAGE,
)


def upgrade():
    op.create_unique_constraint(
        "ariadne_result_id_tenant_key", "ariadne_result", ["id", "tenant_id"]
    )
    op.execute(
        "CREATE FUNCTION ariadne_close_reject_mutation() RETURNS trigger AS $$ BEGIN RAISE EXCEPTION 'assisted close records are append-only'; END; $$ LANGUAGE plpgsql"
    )
    for table, sql in zip(TABLES, DDL):
        op.execute(sql)
        op.execute(
            f"CREATE TRIGGER {table}_immutable BEFORE UPDATE OR DELETE ON {table} FOR EACH ROW EXECUTE FUNCTION ariadne_close_reject_mutation()"
        )


def downgrade():
    for table in reversed(TABLES):
        op.execute(f"DROP TABLE {table}")
    op.execute("DROP FUNCTION ariadne_close_reject_mutation()")
    op.drop_constraint("ariadne_result_id_tenant_key", "ariadne_result", type_="unique")
