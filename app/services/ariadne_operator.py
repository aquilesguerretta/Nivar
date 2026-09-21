"""Thin workspace/orchestration layer for the internal Ariadne workbench.

The authorization gate currently reuses ``require_advisory_operator`` because
it is the repository's only server-side operator identity check.  Its legacy
name does not make Ariadne an Advisory product.  Workspace ownership and the
derived tenant context are enforced here, while all version/run/lineage
semantics remain in :mod:`app.services.ariadne_core`.
"""

from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models.ariadne_core import AriadneModelDefinition, AriadneModelVersion
from app.db.models.ariadne_operator import (
    AriadneOperatorObjectPresentation,
    AriadneOperatorWorkspace,
)
from app.db.models.user import User
from app.services.advisory_operator import require_advisory_operator
from app.services.ariadne_core import (
    DETERMINISTIC_SCALAR_IMPLEMENTATION,
    DETERMINISTIC_SCALAR_INPUT_CONTRACT,
    DETERMINISTIC_SCALAR_MODEL,
    DETERMINISTIC_SCALAR_OUTPUT_CONTRACT,
    DETERMINISTIC_SCALAR_SEMANTIC_VERSION,
    create_model_definition,
    create_model_version,
)


class WorkspaceNotFound(LookupError):
    """The workspace is absent or is not owned by the current operator."""


def tenant_id_for(workspace_id: uuid.UUID) -> str:
    """Derive the private context server-side from an authorized workspace."""
    return f"ariadne-operator-workspace:{workspace_id}"


def require_operator(user: User) -> None:
    """Temporary NIV-48 operator gate; see module docstring."""
    require_advisory_operator(user)


def require_workspace(
    session: Session, *, workspace_id: uuid.UUID, owner_user_id: uuid.UUID
) -> AriadneOperatorWorkspace:
    workspace = session.execute(
        select(AriadneOperatorWorkspace).where(
            AriadneOperatorWorkspace.id == workspace_id,
            AriadneOperatorWorkspace.owner_user_id == owner_user_id,
        )
    ).scalar_one_or_none()
    if workspace is None:
        raise WorkspaceNotFound("Ariadne workspace not found")
    return workspace


def list_workspaces(
    session: Session, *, owner_user_id: uuid.UUID
) -> list[AriadneOperatorWorkspace]:
    return list(
        session.execute(
            select(AriadneOperatorWorkspace)
            .where(AriadneOperatorWorkspace.owner_user_id == owner_user_id)
            .order_by(AriadneOperatorWorkspace.created_at.desc())
        ).scalars()
    )


def provision_registered_model(
    session: Session, *, tenant_id: str
) -> AriadneModelVersion:
    """Create the one registered v0 model idempotently for this workspace."""
    definition = session.execute(
        select(AriadneModelDefinition).where(
            AriadneModelDefinition.tenant_id == tenant_id,
            AriadneModelDefinition.name == DETERMINISTIC_SCALAR_MODEL,
        )
    ).scalar_one_or_none()
    if definition is None:
        definition = create_model_definition(
            session, tenant_id=tenant_id, name=DETERMINISTIC_SCALAR_MODEL
        )

    version = session.execute(
        select(AriadneModelVersion).where(
            AriadneModelVersion.tenant_id == tenant_id,
            AriadneModelVersion.model_definition_id == definition.id,
            AriadneModelVersion.semantic_version
            == DETERMINISTIC_SCALAR_SEMANTIC_VERSION,
        )
    ).scalar_one_or_none()
    if version is None:
        return create_model_version(
            session,
            tenant_id=tenant_id,
            model_definition_id=definition.id,
            semantic_version=DETERMINISTIC_SCALAR_SEMANTIC_VERSION,
            implementation_identity=DETERMINISTIC_SCALAR_IMPLEMENTATION,
            input_contract=DETERMINISTIC_SCALAR_INPUT_CONTRACT,
            output_contract=DETERMINISTIC_SCALAR_OUTPUT_CONTRACT,
        )

    if (
        version.implementation_identity != DETERMINISTIC_SCALAR_IMPLEMENTATION
        or version.input_contract != DETERMINISTIC_SCALAR_INPUT_CONTRACT
        or version.output_contract != DETERMINISTIC_SCALAR_OUTPUT_CONTRACT
    ):
        raise RuntimeError("registered deterministic model metadata drifted")
    return version


def create_workspace(
    session: Session,
    *,
    owner_user_id: uuid.UUID,
    label: str,
    synthetic: bool = False,
) -> AriadneOperatorWorkspace:
    normalized = label.strip()
    if not normalized:
        raise ValueError("label must not be empty")
    workspace = AriadneOperatorWorkspace(
        owner_user_id=owner_user_id,
        label=normalized,
        synthetic=synthetic,
    )
    session.add(workspace)
    session.flush()
    if synthetic:
        provision_registered_model(session, tenant_id=tenant_id_for(workspace.id))
    return workspace


def create_object_presentation(
    session: Session,
    *,
    workspace_id: uuid.UUID,
    object_id: uuid.UUID,
    display_label: str,
) -> AriadneOperatorObjectPresentation:
    """Attach an operator label without changing ``PrivateObject`` semantics."""
    normalized = display_label.strip()
    if not normalized:
        raise ValueError("display_label must not be empty")
    presentation = AriadneOperatorObjectPresentation(
        workspace_id=workspace_id,
        object_id=object_id,
        display_label=normalized,
    )
    session.add(presentation)
    session.flush()
    return presentation


__all__ = [
    "WorkspaceNotFound",
    "create_object_presentation",
    "create_workspace",
    "list_workspaces",
    "provision_registered_model",
    "require_operator",
    "require_workspace",
    "tenant_id_for",
]
