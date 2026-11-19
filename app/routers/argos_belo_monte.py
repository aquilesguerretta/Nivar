"""Local-only, authenticated human inspection of the NIV-66 vertical."""

from __future__ import annotations

import os
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.routing import APIRoute
from sqlalchemy.orm import Session
from starlette.responses import JSONResponse

from app.db.models.user import User
from app.db.session import engine, get_db
from app.services.ariadne_operator import require_operator
from app.services.argos_belo_monte import EvidenceUnavailable, inspect_belo_monte
from app.services.argos_ons_capacidade_geracao_diff import DuplicateRowIdentityError, SchemaError
from app.services.auth_service import get_current_user


ACCESS_HEADERS = {"Cache-Control": "private, no-store", "Vary": "Cookie"}


class UncachedInspectionRoute(APIRoute):
    def get_route_handler(self):
        handle = super().get_route_handler()

        async def uncached(request: Request):
            try:
                response = await handle(request)
            except HTTPException as exc:
                exc.headers = {**(exc.headers or {}), **ACCESS_HEADERS}
                raise
            response.headers.update(ACCESS_HEADERS)
            return response

        return uncached


def require_local_inspection(request: Request):
    db_url = engine.url
    if (
        os.environ.get("ARGOS_BELO_MONTE_DEV") != "1"
        or "RAILWAY_ENVIRONMENT_NAME" in os.environ
        or any(os.environ.get(key, "").lower() == "production" for key in (
            "ENVIRONMENT", "APP_ENV", "VERCEL_ENV",
        ))
        or db_url.host != "127.0.0.1"
        or db_url.get_backend_name() != "postgresql"
        or db_url.database not in {"niv66_demo", "niv66_test"}
        or db_url.query
    ):
        raise HTTPException(404, "Inspeção local indisponível")
    if "authorization" in request.headers:
        raise HTTPException(403, "Use uma sessão de navegador autorizada")


router = APIRouter(
    prefix="/api/operator/argos",
    dependencies=[Depends(require_local_inspection)],
    route_class=UncachedInspectionRoute,
)


@router.get("/belo-monte", include_in_schema=False)
def get_belo_monte(
    request: Request,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_operator(user)
    params = request.query_params.multi_items()
    if not params:
        known_at = None
    elif len(params) == 1 and params[0][0] == "known_at":
        try:
            known_at = datetime.fromisoformat(params[0][1])
            if known_at.utcoffset() is None:
                raise ValueError()
        except ValueError as exc:
            raise HTTPException(400, "Informe uma data ISO 8601 com fuso horário") from exc
    else:
        raise HTTPException(400, "A inspeção aceita somente a data conhecida pelo ARGOS")

    try:
        return inspect_belo_monte(db, known_at)
    except (EvidenceUnavailable, SchemaError, DuplicateRowIdentityError):
        return JSONResponse(
            status_code=503,
            content={"state": "UNRESOLVED", "reason": "SOURCE_EVIDENCE_UNAVAILABLE"},
        )
