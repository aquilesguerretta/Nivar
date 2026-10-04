"""Shared Advisory operator identity — one email, every Advisory product.

Extracted from the identical ``_require_operator`` / ``_is_operator`` copies
in the Conta de Luz Express and Solar Proposal Validator routers. Behavior
is byte-stable: same env name, same 503/403, same ``detail`` strings.

The gate is dormant until ``ADVISORY_OPERATOR_EMAIL`` is set. It is an
identity check, not a thread ACL and not a payment flag.
"""

from __future__ import annotations

import os

from fastapi import HTTPException, status

from app.db.models.user import User


OPERATOR_EMAIL_ENV = "ADVISORY_OPERATOR_EMAIL"


def configured_operator_email() -> str:
    """Lowercased operator identity, or empty when the env is unset."""
    return os.environ.get(OPERATOR_EMAIL_ENV, "").strip().lower()


def is_advisory_operator(user: User) -> bool:
    configured = configured_operator_email()
    return bool(configured and user.email.lower() == configured)


def require_advisory_operator(user: User) -> None:
    configured = configured_operator_email()
    if not configured:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ADVISORY_OPERATOR_EMAIL is not configured",
        )
    if user.email.lower() != configured:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="operator access required",
        )
