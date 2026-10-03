"""Experimental authenticated close routes, closed by default in every runtime."""

import hashlib
import json
import os
import uuid
from contextlib import AsyncExitStack
from typing import Literal
from fastapi import (
    APIRouter,
    Depends,
    Header,
    HTTPException,
    UploadFile,
    File,
    Form,
    Response,
    Request,
)
from fastapi.dependencies.utils import get_dependant, solve_dependencies
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from starlette.concurrency import run_in_threadpool
from fastapi.routing import APIRoute
from app.db.models.ariadne_operator import AriadneOperatorWorkspace
from app.db.models.ariadne_close import CloseReview, ClosePackage
from app.db.models.ariadne_core import (
    AriadnePrivateStateVersion,
    AriadneModelRun,
    AriadneResult,
)
from app.db.models.user import User
from app.db.session import get_db
from app.services.auth_service import get_current_user
from app.services.ariadne_operator import (
    require_operator,
    require_workspace,
    WorkspaceNotFound,
)
from app.services.advisory_files import (
    read_bounded,
    safe_filename,
    download_headers,
    InvalidAdvisoryUpload,
)
from app.services.ariadne_close_intake import MAX_BYTES, parse_isolated
from app.services import ariadne_close as service
from app.services import ariadne_core as core


def require_development():
    runtime = os.environ.get("ARIADNE_CLOSE_ENV", "").lower()
    if (
        os.environ.get("ARIADNE_CLOSE_DEV") != "1"
        or runtime not in ("development", "test")
        or any(
            os.environ.get(k, "").lower() == "production"
            for k in (
                "ENVIRONMENT",
                "APP_ENV",
                "RAILWAY_ENVIRONMENT_NAME",
                "VERCEL_ENV",
            )
        )
    ):
        raise HTTPException(404, "Fechamento experimental desativado")


def _preflight_access(
    request: Request,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Bodyless access check; the normal handler still rechecks after transfer."""
    require_operator(user)
    workspace_id = request.path_params.get("workspace_id")
    if workspace_id is None:
        return
    try:
        workspace_id = uuid.UUID(workspace_id)
        review_id = request.path_params.get("review_id")
        review_id = uuid.UUID(review_id) if review_id else None
    except ValueError as exc:
        raise HTTPException(422, "Identificador de contexto inválido") from exc
    workspace = context(workspace_id, user, db)
    if review_id is not None:
        try:
            service.review_row(db, workspace, review_id)
        except LookupError as exc:
            raise _error(exc) from exc


class BoundedCloseRoute(APIRoute):
    def get_route_handler(self):
        handler = super().get_route_handler()
        preflight = get_dependant(path=self.path, call=_preflight_access)

        async def bounded(request):
            # Normal FastAPI dependencies run after body parsing. Gate explicitly
            # before receive(), then resolve the existing auth/DB dependencies.
            require_development()
            if request.method == "POST":
                async with AsyncExitStack() as stack:
                    keys = ("fastapi_inner_astack", "fastapi_function_astack")
                    previous = {key: request.scope.get(key) for key in keys}
                    # Newer FastAPI uses scope stacks; older versions use the
                    # explicit argument. Both must close before awaiting upload.
                    for key in keys:
                        request.scope[key] = stack
                    try:
                        solved = await solve_dependencies(
                            request=request,
                            dependant=preflight,
                            body=None,
                            dependency_overrides_provider=(
                                self.dependency_overrides_provider or request.app
                            ),
                            async_exit_stack=stack,
                            embed_body_fields=False,
                        )
                        if solved.errors:
                            raise RequestValidationError(solved.errors)
                        await run_in_threadpool(_preflight_access, **solved.values)
                    finally:
                        for key, original in previous.items():
                            if original is None:
                                request.scope.pop(key, None)
                            else:
                                request.scope[key] = original
                limit = MAX_BYTES + 256 * 1024
                chunks, size = [], 0
                async for chunk in request.stream():
                    size += len(chunk)
                    if size > limit:
                        raise HTTPException(413, "Requisição de intake excede limite")
                    chunks.append(chunk)
                request._body = b"".join(chunks)
            return await handler(request)

        return bounded


router = APIRouter(
    prefix="/api/operator/ariadne",
    tags=["ariadne-close-experimental"],
    dependencies=[Depends(require_development)],
    route_class=BoundedCloseRoute,
)


class Strict(BaseModel):
    model_config = ConfigDict(extra="forbid")


class WorkspaceBody(Strict):
    label: str = Field(min_length=1, max_length=160)
    synthetic: bool = False


class ReviewBody(Strict):
    scope: str = Field(min_length=1, max_length=160)
    period: str = Field(pattern=r"^\d{4}-(0[1-9]|1[0-2])$")
    ruleVersion: Literal["0.1.0", "0.2.0"] = "0.1.0"


class MappingBody(Strict):
    sheet: str = Field(max_length=120)
    mapping: dict[str, str]
    numericMode: Literal["strict", "dot", "comma"] = "strict"
    manualRows: list[dict] = Field(default_factory=list, max_length=50)
    reviewMode: Literal["table", "observations", "context"] = "table"
    defaults: dict[str, str] = Field(default_factory=dict, max_length=12)


class ConfirmBody(MappingBody):
    selectedRows: list[int] = Field(max_length=2000)
    previousConfirmationVersionId: str | None = None


class CalculateBody(Strict):
    confirmationVersions: dict[str, str | None]


class TreatmentBody(Strict):
    itemId: str = Field(min_length=1, max_length=500)
    status: Literal["open", "explained", "accepted", "follow_up"]
    reason: str = Field(min_length=1, max_length=500)
    note: str = Field(min_length=1, max_length=4000)


def context(workspace_id, user, db):
    require_operator(user)
    try:
        return require_workspace(db, workspace_id=workspace_id, owner_user_id=user.id)
    except WorkspaceNotFound as exc:
        raise HTTPException(404, "Workspace não encontrado") from exc


def _error(exc):
    if isinstance(exc, (LookupError, core.TenantScopeError)):
        return HTTPException(404, "Registro privado não encontrado")
    return HTTPException(
        409 if isinstance(exc, (service.Conflict, IntegrityError)) else 422,
        (
            str(exc)
            if not isinstance(exc, IntegrityError)
            else "Gravação concorrente; releia e tente novamente"
        ),
    )


def _write(db, workspace, key, operation, body, action):
    try:
        response = service.write_once(db, workspace, str(key), operation, body, action)
        db.commit()
        return response
    except (ValueError, LookupError, IntegrityError) as exc:
        db.rollback()
        raise _error(exc) from exc


@router.post("/close/workspaces", status_code=201)
def create_close_workspace(
    body: WorkspaceBody,
    key: uuid.UUID = Header(alias="Idempotency-Key"),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_operator(user)
    db.execute(select(User).where(User.id == user.id).with_for_update()).scalar_one()
    workspace_id = uuid.uuid5(user.id, "assisted-close:" + str(key))
    workspace = db.get(AriadneOperatorWorkspace, workspace_id)
    if not workspace:
        workspace = AriadneOperatorWorkspace(
            id=workspace_id,
            owner_user_id=user.id,
            label=body.label.strip(),
            synthetic=body.synthetic,
        )
        if not workspace.label:
            raise HTTPException(422, "Nome obrigatório")
        db.add(workspace)
        db.flush()
    return _write(
        db,
        workspace,
        key,
        "create workspace",
        body.model_dump(),
        lambda: {
            "id": str(workspace.id),
            "label": workspace.label,
            "synthetic": workspace.synthetic,
            "createdAt": workspace.created_at.isoformat(),
        },
    )


@router.get("/workspaces/{workspace_id}/close/reviews")
def list_reviews(
    workspace_id: uuid.UUID,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workspace = context(workspace_id, user, db)
    return {
        "data": [
            service.review_payload(r)
            for r in db.execute(
                select(CloseReview)
                .where(CloseReview.workspace_id == workspace.id)
                .order_by(CloseReview.created_at.desc())
            ).scalars()
        ]
    }


@router.post("/workspaces/{workspace_id}/close/reviews", status_code=201)
def start_review(
    body: ReviewBody,
    workspace_id: uuid.UUID,
    key: uuid.UUID = Header(alias="Idempotency-Key"),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workspace = context(workspace_id, user, db)
    if not body.scope.strip():
        raise HTTPException(422, "Escopo obrigatório")
    return _write(
        db,
        workspace,
        key,
        "start review",
        body.model_dump(),
        lambda: service.start_review(
            db, workspace, body.scope.strip(), body.period, body.ruleVersion
        ),
    )


@router.post("/workspaces/{workspace_id}/close/inspect")
async def inspect_source(
    workspace_id: uuid.UUID,
    file: UploadFile = File(),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    context(workspace_id, user, db)
    try:
        data = await read_bounded(file, MAX_BYTES)
        preview = await run_in_threadpool(
            parse_isolated,
            data,
            safe_filename(file.filename, "source"),
            inspection=True,
        )
        return {**preview, "sha256": hashlib.sha256(data).hexdigest()}
    except InvalidAdvisoryUpload as exc:
        raise HTTPException(exc.status_code, str(exc)) from exc
    except ValueError as exc:
        raise _error(exc) from exc


@router.get("/workspaces/{workspace_id}/close/reviews/{review_id}")
def get_review(
    workspace_id: uuid.UUID,
    review_id: uuid.UUID,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workspace = context(workspace_id, user, db)
    try:
        review = service.review_row(db, workspace, review_id)
        results = db.execute(
            select(AriadneResult.id, AriadneResult.produced_at)
            .join(AriadneModelRun, AriadneResult.model_run_id == AriadneModelRun.id)
            .join(
                AriadnePrivateStateVersion,
                AriadneModelRun.state_version_id == AriadnePrivateStateVersion.id,
            )
            .where(
                AriadnePrivateStateVersion.object_id == review.object_id,
                AriadneResult.tenant_id == review.tenant_id,
            )
            .order_by(AriadneResult.produced_at.desc())
        ).all()
        packages = db.execute(
            select(ClosePackage.id, ClosePackage.result_id)
            .where(ClosePackage.review_id == review.id)
            .order_by(ClosePackage.created_at.desc())
        ).all()
        return {
            "review": service.review_payload(review),
            "sources": service.list_sources(db, review),
            "calculations": [
                {"id": str(r.id), "producedAt": r.produced_at.isoformat()}
                for r in results
            ],
            "packages": [
                {"id": str(p.id), "resultId": str(p.result_id)} for p in packages
            ],
        }
    except (ValueError, LookupError) as exc:
        raise _error(exc) from exc


@router.post(
    "/workspaces/{workspace_id}/close/reviews/{review_id}/sources", status_code=201
)
async def upload_source(
    workspace_id: uuid.UUID,
    review_id: uuid.UUID,
    role: Literal["invoice", "quantity", "price", "context"] = Form(),
    supersedesId: uuid.UUID | None = Form(default=None),
    inspection: bool = Form(default=False),
    provenance: str | None = Form(default=None, max_length=16384),
    file: UploadFile = File(),
    key: uuid.UUID = Header(alias="Idempotency-Key"),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workspace = context(workspace_id, user, db)
    try:
        review = service.review_row(db, workspace, review_id)
        if inspection:
            service.require_inspection_review(db, review)
        filename = safe_filename(file.filename, "source")
        declared = file.content_type
        data = await read_bounded(file, MAX_BYTES)
        preview = await run_in_threadpool(
            parse_isolated, data, filename, inspection=inspection
        )
        if provenance:
            try:
                supplied = json.loads(provenance)
            except (ValueError, RecursionError) as exc:
                raise ValueError(
                    "Proveniência deve ser um objeto JSON limitado"
                ) from exc
            if not isinstance(supplied, dict):
                raise ValueError("Proveniência deve ser um objeto JSON limitado")
            if (
                supplied.get("sha256")
                and supplied["sha256"] != hashlib.sha256(data).hexdigest()
            ):
                raise ValueError("Hash de proveniência não corresponde ao arquivo")
            preview["provenance"] = {
                "embedded": preview.get("provenance", {}),
                "attributed": supplied,
                "status": "operator-reviewed attribution; not authenticity proof",
            }
        accepted = {
            "csv": ("text/csv", "application/vnd.ms-excel"),
            "xlsx": (
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ),
            "pdf": ("application/pdf",),
        }[preview["kind"]]
        if declared not in (*accepted, "application/octet-stream", None, ""):
            raise ValueError("Tipo declarado não corresponde ao conteúdo")
    except InvalidAdvisoryUpload as exc:
        raise HTTPException(exc.status_code, str(exc)) from exc
    except (ValueError, LookupError) as exc:
        raise _error(exc) from exc
    body = {
        "role": role,
        "filename": filename,
        "sha256": hashlib.sha256(data).hexdigest(),
        "supersedesId": str(supersedesId) if supersedesId else None,
        "inspection": inspection,
        "provenance": preview.get("provenance"),
    }
    return _write(
        db,
        workspace,
        key,
        "import:" + str(review_id),
        body,
        lambda: service.import_source(
            db,
            workspace,
            review,
            data=data,
            filename=filename,
            role=role,
            preview=preview,
            supersedes_id=supersedesId,
        ),
    )


@router.get(
    "/workspaces/{workspace_id}/close/reviews/{review_id}/sources/{source_id}/original"
)
def original(
    workspace_id: uuid.UUID,
    review_id: uuid.UUID,
    source_id: uuid.UUID,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workspace = context(workspace_id, user, db)
    try:
        source = service.source_row(db, workspace, review_id, source_id)
        headers = download_headers(source.filename)
        # Preserve originals as downloads; embedded viewer uses page text safely.
        return Response(
            source.original, media_type=source.content_type, headers=headers
        )
    except LookupError as exc:
        raise _error(exc) from exc


@router.get(
    "/workspaces/{workspace_id}/close/reviews/{review_id}/sources/{source_id}/pages/{page_number}/image"
)
def page_image(
    workspace_id: uuid.UUID,
    review_id: uuid.UUID,
    source_id: uuid.UUID,
    page_number: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workspace = context(workspace_id, user, db)
    try:
        source = service.source_row(db, workspace, review_id, source_id)
        if source.preview["kind"] != "pdf":
            raise ValueError("Esta fonte não é um PDF")
        from app.services.ariadne_close_pages import render_page

        return Response(
            render_page(source.original, page_number),
            media_type="image/png",
            headers={"Cache-Control": "no-store", "X-Content-Type-Options": "nosniff"},
        )
    except (ValueError, LookupError) as exc:
        raise _error(exc) from exc


@router.post(
    "/workspaces/{workspace_id}/close/reviews/{review_id}/sources/{source_id}/candidates"
)
def preview_mapping(
    body: MappingBody,
    workspace_id: uuid.UUID,
    review_id: uuid.UUID,
    source_id: uuid.UUID,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workspace = context(workspace_id, user, db)
    try:
        review = service.review_row(db, workspace, review_id)
        source = service.source_row(db, workspace, review_id, source_id)
        return {"rows": service.candidates(source, review, body.model_dump())}
    except (ValueError, LookupError) as exc:
        raise _error(exc) from exc


@router.post(
    "/workspaces/{workspace_id}/close/reviews/{review_id}/sources/{source_id}/confirm",
    status_code=201,
)
def confirm(
    body: ConfirmBody,
    workspace_id: uuid.UUID,
    review_id: uuid.UUID,
    source_id: uuid.UUID,
    key: uuid.UUID = Header(alias="Idempotency-Key"),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workspace = context(workspace_id, user, db)

    def action():
        review = service.review_row(db, workspace, review_id)
        return service.confirm_source(
            db,
            workspace,
            review,
            service.source_row(db, workspace, review_id, source_id),
            body.model_dump(),
        )

    return _write(
        db, workspace, key, "confirm:" + str(source_id), body.model_dump(), action
    )


@router.post(
    "/workspaces/{workspace_id}/close/reviews/{review_id}/calculate", status_code=201
)
def calculate(
    body: CalculateBody,
    workspace_id: uuid.UUID,
    review_id: uuid.UUID,
    key: uuid.UUID = Header(alias="Idempotency-Key"),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workspace = context(workspace_id, user, db)
    return _write(
        db,
        workspace,
        key,
        "calculate:" + str(review_id),
        body.model_dump(),
        lambda: service.calculate(
            db,
            workspace,
            service.review_row(db, workspace, review_id),
            body.confirmationVersions,
        ),
    )


@router.get(
    "/workspaces/{workspace_id}/close/reviews/{review_id}/calculations/{result_id}"
)
def result(
    workspace_id: uuid.UUID,
    review_id: uuid.UUID,
    result_id: uuid.UUID,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workspace = context(workspace_id, user, db)
    try:
        return service.result_payload(
            db, service.review_row(db, workspace, review_id), result_id
        )
    except LookupError as exc:
        raise _error(exc) from exc


@router.get(
    "/workspaces/{workspace_id}/close/reviews/{review_id}/calculations/{result_id}/replay"
)
def replay(
    workspace_id: uuid.UUID,
    review_id: uuid.UUID,
    result_id: uuid.UUID,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workspace = context(workspace_id, user, db)
    try:
        review = service.review_row(db, workspace, review_id)
        service.result_lineage(db, review, result_id)
        outcome = core.replay_result(
            db, tenant_id=review.tenant_id, result_id=result_id
        )
        return {
            "matches": outcome.matches,
            "stored": outcome.stored_payload,
            "replayed": outcome.replayed_payload,
        }
    except (ValueError, LookupError) as exc:
        raise _error(exc) from exc


@router.post(
    "/workspaces/{workspace_id}/close/reviews/{review_id}/calculations/{result_id}/treatments",
    status_code=201,
)
def treatment(
    body: TreatmentBody,
    workspace_id: uuid.UUID,
    review_id: uuid.UUID,
    result_id: uuid.UUID,
    key: uuid.UUID = Header(alias="Idempotency-Key"),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workspace = context(workspace_id, user, db)
    return _write(
        db,
        workspace,
        key,
        "treat:" + str(result_id),
        body.model_dump(),
        lambda: service.treat(
            db,
            workspace,
            service.review_row(db, workspace, review_id),
            result_id,
            body.model_dump(),
        ),
    )


@router.post(
    "/workspaces/{workspace_id}/close/reviews/{review_id}/calculations/{result_id}/packages",
    status_code=201,
)
def save_package(
    workspace_id: uuid.UUID,
    review_id: uuid.UUID,
    result_id: uuid.UUID,
    key: uuid.UUID = Header(alias="Idempotency-Key"),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workspace = context(workspace_id, user, db)
    return _write(
        db,
        workspace,
        key,
        "package:" + str(result_id),
        {},
        lambda: service.save_package(
            db, workspace, service.review_row(db, workspace, review_id), result_id
        ),
    )


@router.get(
    "/workspaces/{workspace_id}/close/reviews/{review_id}/packages/{package_id}/export"
)
def export(
    workspace_id: uuid.UUID,
    review_id: uuid.UUID,
    package_id: uuid.UUID,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workspace = context(workspace_id, user, db)
    package = db.execute(
        select(ClosePackage).where(
            ClosePackage.id == package_id,
            ClosePackage.workspace_id == workspace.id,
            ClosePackage.review_id == review_id,
        )
    ).scalar_one_or_none()
    if not package:
        raise HTTPException(404, "Pacote não encontrado")
    return Response(
        service.export_package(package),
        media_type="application/zip",
        headers=download_headers(f"ariadne-review-{package.id}.zip"),
    )
