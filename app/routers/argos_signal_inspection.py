"""Authenticated, read-only operator API for NIV-52 Argos inspection."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.db.models.user import User
from app.db.session import get_db
from app.services.ariadne_operator import require_operator
from app.services.argos_ons_capacidade_signal_inspection import (
    InspectionConfigurationError,
    InspectionInvariantError,
    inspect_scenario,
)
from app.services.auth_service import get_current_user


router = APIRouter(
    prefix="/api/operator/argos/ons-capacidade",
    tags=["operator-argos"],
)


@router.get("/inspection/{scenario_id}")
def get_inspection(
    scenario_id: str,
    request: Request,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_operator(user)
    if request.query_params:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "inspection context is server-owned; query parameters are not accepted"
            ),
        )
    try:
        return inspect_scenario(db, scenario_id)
    except KeyError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="unknown bounded inspection scenario",
        ) from exc
    except LookupError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="configured Argos Memory evidence is unavailable",
        ) from exc
    except (InspectionConfigurationError, InspectionInvariantError) as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="bounded inspection scenario failed closed",
        ) from exc


__all__ = ["router"]
