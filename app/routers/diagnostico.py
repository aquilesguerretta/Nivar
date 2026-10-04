"""Diagnóstico Energético — authenticated scoping intake (structured fields)."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, Path, status
from pydantic import BaseModel, Field, field_validator
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models.diagnostico import DiagnosticoEnergeticoSubmission
from app.db.models.product_access import PRODUCT_IDS, ProductAccess
from app.db.models.user import User
from app.db.session import get_db
from app.services.advisory_operator import is_advisory_operator
from app.services.auth_service import get_current_user


PRODUCT_ID = "diagnostico-energetico"
if PRODUCT_ID not in PRODUCT_IDS:
    raise RuntimeError(f"{PRODUCT_ID!r} is missing from PRODUCT_CATALOG")

router = APIRouter(
    prefix="/api/diagnostico-energetico",
    tags=["diagnostico-energetico"],
)

_SECTOR_MAX = 200
_BAND_MAX = 80
_TARIFF_MAX = 80
_CONCERN_MAX = 4000


def _strip_required(value: str, *, field: str, max_len: int) -> str:
    text = value.strip()
    if not text:
        raise ValueError(f"{field} is required")
    if len(text) > max_len:
        raise ValueError(f"{field} must be at most {max_len} characters")
    return text


class CreateDiagnosticoRequest(BaseModel):
    sector: str
    monthly_consumption_band: str = Field(alias="monthlyConsumptionBand")
    tariff_modality: str | None = Field(default=None, alias="tariffModality")
    concern: str

    model_config = {"populate_by_name": True}

    @field_validator("sector")
    @classmethod
    def sector_ok(cls, value: str) -> str:
        return _strip_required(value, field="sector", max_len=_SECTOR_MAX)

    @field_validator("monthly_consumption_band")
    @classmethod
    def band_ok(cls, value: str) -> str:
        return _strip_required(
            value, field="monthlyConsumptionBand", max_len=_BAND_MAX
        )

    @field_validator("tariff_modality")
    @classmethod
    def tariff_ok(cls, value: str | None) -> str | None:
        if value is None:
            return None
        text = value.strip()
        if not text:
            return None
        if len(text) > _TARIFF_MAX:
            raise ValueError(
                f"tariffModality must be at most {_TARIFF_MAX} characters"
            )
        return text

    @field_validator("concern")
    @classmethod
    def concern_ok(cls, value: str) -> str:
        return _strip_required(value, field="concern", max_len=_CONCERN_MAX)


def _require_entitlement(db: Session, user: User) -> None:
    access_id = db.execute(
        select(ProductAccess.id).where(
            ProductAccess.user_id == user.id,
            ProductAccess.product_id == PRODUCT_ID,
        )
    ).scalar_one_or_none()
    if access_id is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"product '{PRODUCT_ID}' is not active for this account",
        )


def _payload(row: DiagnosticoEnergeticoSubmission) -> dict:
    return {
        "id": str(row.id),
        "productId": PRODUCT_ID,
        "sector": row.sector,
        "monthlyConsumptionBand": row.monthly_consumption_band,
        "tariffModality": row.tariff_modality,
        "concern": row.concern,
        "createdAt": row.created_at.isoformat(),
        "updatedAt": row.updated_at.isoformat(),
    }


def _require_visible(
    db: Session,
    submission_id: uuid.UUID,
    user: User,
) -> DiagnosticoEnergeticoSubmission:
    row = db.execute(
        select(DiagnosticoEnergeticoSubmission).where(
            DiagnosticoEnergeticoSubmission.id == submission_id
        )
    ).scalar_one_or_none()
    if row is None or (
        row.user_id != user.id and not is_advisory_operator(user)
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="submission not found",
        )
    return row


@router.post("/submissions", status_code=status.HTTP_201_CREATED)
def create_submission(
    body: CreateDiagnosticoRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _require_entitlement(db, user)
    row = DiagnosticoEnergeticoSubmission(
        user_id=user.id,
        sector=body.sector,
        monthly_consumption_band=body.monthly_consumption_band,
        tariff_modality=body.tariff_modality,
        concern=body.concern,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return _payload(row)


@router.get("/submissions")
def list_my_submissions(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = db.execute(
        select(DiagnosticoEnergeticoSubmission)
        .where(DiagnosticoEnergeticoSubmission.user_id == user.id)
        .order_by(DiagnosticoEnergeticoSubmission.created_at.desc())
    ).scalars()
    data = [_payload(row) for row in rows]
    return {
        "data": data,
        "summary": {"count": len(data)},
    }


@router.get("/submissions/{submission_id}")
def get_submission(
    submission_id: uuid.UUID = Path(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return _payload(_require_visible(db, submission_id, user))
