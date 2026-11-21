"""Per-product activation (Wave 9).

Creating an account activates nothing. A row appears here only when the
user actually enters a product. No payment gate in this wave, by explicit
decision — activation is free and automatic on the call, and the paywall
lands once the whole base is integrated and the launch is real.

PRODUCT_CATALOG lives in app/db/models/product_access.py and is the
canonical backend list. It is served on GET /api/products/me so the
frontend can read it instead of hardcoding a second copy.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Path, status
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.orm import Session

from app.db.models.product_access import PRODUCT_CATALOG, PRODUCT_IDS, ProductAccess
from app.db.models.user import User
from app.db.session import get_db
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/products", tags=["products"])


@router.post("/{product_id}/activate")
def activate(
    product_id: str = Path(..., description="canonical backend product id"),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Activate a product for the authenticated user. Idempotent.

    Idempotency is the database's job, not a read-then-write in Python:
    ON CONFLICT DO NOTHING against the UNIQUE(user_id, product_id) index
    means two simultaneous clicks cannot produce two rows.
    """
    product_id = product_id.strip().lower()
    if product_id not in PRODUCT_IDS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"unknown product '{product_id}'",
        )

    stmt = (
        pg_insert(ProductAccess)
        .values(user_id=user.id, product_id=product_id)
        .on_conflict_do_nothing(index_elements=["user_id", "product_id"])
        .returning(ProductAccess.activated_at)
    )
    inserted = db.execute(stmt).scalar_one_or_none()
    db.commit()

    already_active = inserted is None
    if already_active:
        activated_at = db.execute(
            select(ProductAccess.activated_at).where(
                ProductAccess.user_id == user.id,
                ProductAccess.product_id == product_id,
            )
        ).scalar_one()
    else:
        activated_at = inserted

    return {
        "productId": product_id,
        "activatedAt": activated_at.isoformat(),
        "alreadyActive": already_active,
    }


@router.get("/me")
def my_products(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = db.execute(
        select(ProductAccess.product_id, ProductAccess.activated_at)
        .where(ProductAccess.user_id == user.id)
        .order_by(ProductAccess.activated_at)
    ).all()

    return {
        "products": [
            {"productId": r.product_id, "activatedAt": r.activated_at.isoformat()}
            for r in rows
        ],
        "catalog": list(PRODUCT_CATALOG),
    }
