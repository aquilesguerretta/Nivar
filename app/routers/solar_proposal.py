"""Solar Proposal Validator — authenticated intake and manual delivery."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, File, HTTPException, Path, UploadFile, status
from fastapi.responses import Response
from sqlalchemy import select
from sqlalchemy.orm import Session, defer

from app.db.models.product_access import PRODUCT_IDS, ProductAccess
from app.db.models.solar_proposal import SolarProposalSubmission
from app.db.models.user import User
from app.db.session import get_db
from app.services.advisory_files import download_headers
from app.services.advisory_operator import (
    is_advisory_operator,
    require_advisory_operator,
)
from app.services.auth_service import get_current_user
from app.services.solar_proposal_email import (
    AdvisoryEmailDeliveryError,
    SolarEmailConfigurationError,
    email_config,
    notify_customer_deliverable_ready,
    notify_operator_new_submission,
)
from app.services.solar_proposal_storage import (
    InvalidAdvisoryUpload,
    read_deliverable_upload,
    read_source_upload,
)


PRODUCT_ID = "solar-proposal-validator"
if PRODUCT_ID not in PRODUCT_IDS:
    raise RuntimeError(f"{PRODUCT_ID!r} is missing from PRODUCT_CATALOG")

router = APIRouter(
    prefix="/api/solar-proposal-validator",
    tags=["solar-proposal-validator"],
)


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


def _get_submission_without_bytes(
    db: Session,
    submission_id: uuid.UUID,
) -> SolarProposalSubmission | None:
    return db.execute(
        select(SolarProposalSubmission)
        .where(SolarProposalSubmission.id == submission_id)
        .options(
            defer(SolarProposalSubmission.source_data),
            defer(SolarProposalSubmission.deliverable_data),
        )
    ).scalar_one_or_none()


def _require_visible_submission(
    db: Session,
    submission_id: uuid.UUID,
    user: User,
) -> SolarProposalSubmission:
    submission = _get_submission_without_bytes(db, submission_id)
    if submission is None or (
        submission.user_id != user.id and not is_advisory_operator(user)
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="submission not found",
        )
    return submission


def _submission_payload(submission: SolarProposalSubmission) -> dict:
    ready = submission.status == "ready"
    api_base = "/api/solar-proposal-validator/submissions"
    return {
        "id": str(submission.id),
        "productId": PRODUCT_ID,
        "status": submission.status,
        "source": {
            "filename": submission.source_filename,
            "contentType": submission.source_content_type,
            "sizeBytes": submission.source_size_bytes,
            "sha256": submission.source_sha256,
            "downloadUrl": f"{api_base}/{submission.id}/source",
        },
        "deliverable": (
            {
                "filename": submission.deliverable_filename,
                "contentType": submission.deliverable_content_type,
                "sizeBytes": submission.deliverable_size_bytes,
                "sha256": submission.deliverable_sha256,
                "downloadUrl": f"{api_base}/{submission.id}/deliverable",
            }
            if ready
            else None
        ),
        "createdAt": submission.created_at.isoformat(),
        "updatedAt": submission.updated_at.isoformat(),
        "deliveredAt": (
            submission.delivered_at.isoformat() if submission.delivered_at else None
        ),
    }


@router.post("/submissions", status_code=status.HTTP_201_CREATED)
async def create_submission(
    file: UploadFile = File(
        ...,
        description="Solar vendor proposal: PDF, JPEG, PNG or WebP",
    ),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _require_entitlement(db, user)
    try:
        config = email_config()
    except SolarEmailConfigurationError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc
    try:
        source = await read_source_upload(file)
    except InvalidAdvisoryUpload as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc

    submission = SolarProposalSubmission(
        user_id=user.id,
        status="submitted",
        source_filename=source.filename,
        source_content_type=source.content_type,
        source_size_bytes=source.size_bytes,
        source_sha256=source.sha256,
        source_data=source.data,
    )
    db.add(submission)
    try:
        db.flush()
        receipt = notify_operator_new_submission(
            config=config,
            submission_id=submission.id,
            customer_name=user.name,
            customer_email=user.email,
            source_filename=source.filename,
        )
        submission.operator_email_id = receipt.provider_id
        submission.operator_notified_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(submission)
    except AdvisoryEmailDeliveryError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=(
                "submission was not saved because operator notification "
                f"failed: {exc}"
            ),
        ) from exc
    return _submission_payload(submission)


@router.get("/submissions")
def list_my_submissions(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = db.execute(
        select(SolarProposalSubmission)
        .where(SolarProposalSubmission.user_id == user.id)
        .options(
            defer(SolarProposalSubmission.source_data),
            defer(SolarProposalSubmission.deliverable_data),
        )
        .order_by(SolarProposalSubmission.created_at.desc())
    ).scalars()
    data = [_submission_payload(row) for row in rows]
    return {
        "data": data,
        "summary": {
            "count": len(data),
            "submitted": sum(row["status"] == "submitted" for row in data),
            "ready": sum(row["status"] == "ready" for row in data),
        },
    }


@router.get("/submissions/{submission_id}")
def get_submission(
    submission_id: uuid.UUID = Path(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return _submission_payload(
        _require_visible_submission(db, submission_id, user)
    )


@router.get("/submissions/{submission_id}/source")
def download_source(
    submission_id: uuid.UUID = Path(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    visible = _require_visible_submission(db, submission_id, user)
    stored = db.execute(
        select(SolarProposalSubmission).where(
            SolarProposalSubmission.id == visible.id
        )
    ).scalar_one()
    return Response(
        content=stored.source_data,
        media_type=stored.source_content_type,
        headers=download_headers(stored.source_filename),
    )


@router.post("/submissions/{submission_id}/deliverable")
async def attach_deliverable(
    submission_id: uuid.UUID = Path(...),
    file: UploadFile = File(..., description="Final validation report PDF"),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_advisory_operator(user)
    try:
        config = email_config()
    except SolarEmailConfigurationError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc
    try:
        deliverable = await read_deliverable_upload(file)
    except InvalidAdvisoryUpload as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc

    submission = _get_submission_without_bytes(db, submission_id)
    if submission is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="submission not found",
        )
    if submission.status == "ready":
        if submission.deliverable_sha256 == deliverable.sha256:
            return {**_submission_payload(submission), "alreadyReady": True}
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="submission already has a different deliverable",
        )

    customer = db.execute(
        select(User).where(User.id == submission.user_id)
    ).scalar_one()
    delivered_at = datetime.now(timezone.utc)
    submission.status = "ready"
    submission.deliverable_filename = deliverable.filename
    submission.deliverable_content_type = deliverable.content_type
    submission.deliverable_size_bytes = deliverable.size_bytes
    submission.deliverable_sha256 = deliverable.sha256
    submission.deliverable_data = deliverable.data
    submission.delivered_at = delivered_at

    try:
        db.flush()
        receipt = notify_customer_deliverable_ready(
            config=config,
            submission_id=submission.id,
            customer_name=customer.name,
            customer_email=customer.email,
        )
        submission.customer_email_id = receipt.provider_id
        submission.customer_notified_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(submission)
    except AdvisoryEmailDeliveryError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=(
                "deliverable was not saved because customer notification "
                f"failed: {exc}"
            ),
        ) from exc
    return {**_submission_payload(submission), "alreadyReady": False}


@router.get("/submissions/{submission_id}/deliverable")
def download_deliverable(
    submission_id: uuid.UUID = Path(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    visible = _require_visible_submission(db, submission_id, user)
    if visible.status != "ready":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="deliverable not ready",
        )
    stored = db.execute(
        select(
            SolarProposalSubmission.deliverable_data,
            SolarProposalSubmission.deliverable_content_type,
            SolarProposalSubmission.deliverable_filename,
        ).where(SolarProposalSubmission.id == visible.id)
    ).one()
    return Response(
        content=stored.deliverable_data,
        media_type=stored.deliverable_content_type,
        headers=download_headers(stored.deliverable_filename),
    )
