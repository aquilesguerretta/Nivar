"""Per-account learning progress (Cursor Wave 11 · Peça D).

POST /api/progress/events                     — record a real event (log + derived caches)
GET  /api/progress/me                         — this account's raw progress facts
GET  /api/progress/aulas/{aula_id}            — this account's status for one lesson
GET  /api/progress/streak                     — day-streak, derived from the log  (Peça D)
GET  /api/progress/pratica                    — the Praticado axis, aggregated     (Peça D)
GET  /api/progress/aulas/{aula_id}/pratica    — the Praticado axis for one lesson  (Peça D)
GET  /api/progress/pratica/entidades/{id}     — one instrument / exercise          (Peça D)
GET  /api/progress/revisao                    — exercise attempts for spaced review (LYCEUM)
GET  /api/progress/perfil                     — study days + first occurrences (LYCEUM, V2)
GET|PUT|DELETE /api/progress/perfil/foto      — the Alexandria-only profile photo (LYCEUM, V2)
PUT  /api/progress/perfil/faixa               — the chosen profile banner (LYCEUM, V2)

The write endpoint returns plain JSON, mirroring Wave 9's
``/api/products/{id}/activate`` shape (it reports what just happened, not
a market/reference read). The read endpoints use the canonical
{meta, data, summary} envelope, same convention as the market and
infrastructure endpoints — this is reference data about the user, not
identity, and identity is the only domain Wave 9 kept on plain JSON.

Every response here returns entity ids exactly as the caller sent them —
never a computed "3 of 9 lessons" or "42% of the level". The backend does
not have a curriculum table and must not fake having one; that join
belongs to the frontend, against what it already knows.

PEÇA D, two rules this file now enforces on the wire:

- SEPARATION OF AXES (``docs/alexandria-v2/bar.md`` §S3). ``pratica`` is
  evidence — a registered ATTEMPT — and lives under its own key, never
  merged into a single "progress" number with ``streak``, which is
  motivation. No response here combines them, and none of them is ever
  labelled Demonstrado.
- DECLARED ABSENCE. "Nothing recorded" is ``semRegistro: true`` with
  null/empty companions, not a zero dressed up as a measurement. The
  practice reads answer 200 with ``semRegistro`` rather than 404,
  because "this lesson has no practice yet" is a state the Praticado
  panel must render. ``GET /aulas/{aula_id}`` keeps its Wave 11 404 —
  it answers a different question and its contract did not change.

``tz`` is accepted on every read (and on the write) as an IANA zone name
and defaults to ``DEFAULT_LEARNER_TIMEZONE``. The day a learner studied
is the day in the learner's zone, and an instant only becomes a calendar
day once a zone is named.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Path, Query, Request, Response, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db.models.progress import (
    DEFAULT_LEARNER_TIMEZONE,
    EVENT_TYPES,
    FOTO_MAX_BYTES,
    STREAK_EVENT_TYPES,
)
from app.db.models.user import User
from app.db.session import get_db
from app.services.auth_service import get_current_user
from app.services.envelope import build_envelope
from app.services.progress_service import (
    delete_foto,
    derive_streak,
    get_aula_practice,
    get_aula_status,
    get_entity_practice,
    get_foto,
    get_perfil,
    get_practice_overview,
    get_progress_summary,
    get_review_attempts,
    record_event,
    set_faixa,
    set_foto,
    streak_payload,
)

router = APIRouter(prefix="/api/progress", tags=["progress"])

_META = {"source": "progress-event-log", "data_age_seconds": 0}

_TZ_QUERY = Query(
    default=None,
    description=(
        "IANA timezone naming the learner's day "
        f"(default {DEFAULT_LEARNER_TIMEZONE})."
    ),
    max_length=64,
)


class RecordEventRequest(BaseModel):
    event_type: str = Field(alias="eventType")
    entity_id: str = Field(alias="entityId", min_length=1, max_length=500)
    metadata: dict | None = None
    # Optional per-request zone. The streak cache this write refreshes is
    # only a cache — every read derives its own — so a caller that omits
    # it loses nothing.
    tz: str | None = Field(default=None, max_length=64)

    model_config = {"populate_by_name": True}


def _aula_status_payload(aula_status) -> dict | None:
    if aula_status is None:
        return None
    return {
        "status": aula_status.status,
        "startedAt": aula_status.started_at.isoformat() if aula_status.started_at else None,
        "completedAt": aula_status.completed_at.isoformat() if aula_status.completed_at else None,
    }


def _streak_sentence(streak: dict) -> str:
    """Motivation, phrased as motivation. Never as evidence of learning."""
    if streak["semRegistro"]:
        return "no study day on record"
    if streak["maiorAte"]:
        return (
            f"{streak['atual']}-day streak, longest {streak['maior']} "
            f"through {streak['maiorAte']} ({streak['fuso']})"
        )
    return f"{streak['atual']}-day streak ({streak['fuso']})"


def _practice_sentence(pratica: dict) -> str:
    if pratica["semRegistro"]:
        return "no practice attempt on record"
    return (
        f"{pratica['totalTentativas']} practice attempt(s) across "
        f"{pratica['totalAulasComPratica']} lesson(s) with a lesson link, "
        f"{pratica['eventosSemAulaVinculada']} not tied to a lesson"
    )


@router.post("/events", status_code=status.HTTP_201_CREATED)
def post_event(
    body: RecordEventRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if body.event_type not in EVENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"unknown eventType '{body.event_type}' — must be one of {sorted(EVENT_TYPES)}",
        )

    try:
        recorded = record_event(
            db,
            user_id=user.id,
            event_type=body.event_type,
            entity_id=body.entity_id,
            metadata=body.metadata,
            tz=body.tz,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e)) from e

    payload = {
        "eventId": str(recorded.event_id),
        "eventType": recorded.event_type,
        "entityId": recorded.entity_id,
        "occurredAt": recorded.occurred_at.isoformat(),
        "streak": streak_payload(recorded.streak),
    }
    if recorded.aula_status is not None:
        payload["aulaStatus"] = _aula_status_payload(recorded.aula_status)
    if recorded.badge_already_awarded is not None:
        payload["badgeAlreadyAwarded"] = recorded.badge_already_awarded

    return payload


@router.get("/me")
def get_me(
    tz: str | None = _TZ_QUERY,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        summary = get_progress_summary(db, user.id, tz=tz)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e)) from e

    return build_envelope(
        meta=dict(_META),
        data=summary,
        summary=(
            f"{len(summary['aulasConcluidas'])} lesson(s) concluded, "
            f"{len(summary['aulasEmAndamento'])} in progress, "
            f"{_practice_sentence(summary['pratica'])}, "
            f"{len(summary['badges'])} badge(s), "
            f"{_streak_sentence(summary['streak'])}."
        ),
    )


@router.get("/streak")
def get_streak(
    tz: str | None = _TZ_QUERY,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Derived from ``progress_event``, never read from ``study_streak``.

    ``data.tiposQueContam`` ships the list of event types the derivation
    counts, so the front never has to hardcode a copy of it — and so the
    absence of ``badge_conquistado`` is visible on the wire rather than
    buried in a service module.
    """
    try:
        derived = derive_streak(db, user.id, tz=tz)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e)) from e

    data = streak_payload(derived)
    data["tiposQueContam"] = list(STREAK_EVENT_TYPES)
    return build_envelope(
        meta=dict(_META),
        data=data,
        summary=_streak_sentence(data) + ".",
    )


@router.get("/pratica")
def get_pratica(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """The Praticado axis for this account. Evidence, never motivation."""
    data = get_practice_overview(db, user.id)
    return build_envelope(
        meta=dict(_META),
        data=data,
        summary=_practice_sentence(data) + ".",
    )


@router.get("/pratica/entidades/{entity_id}")
def get_pratica_entidade(
    entity_id: str = Path(..., min_length=1, max_length=500),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """One instrument or exercise. 200 with ``semRegistro`` when untouched."""
    data = get_entity_practice(db, user.id, entity_id)
    summary = (
        f"'{entity_id}' — no practice attempt on record."
        if data["semRegistro"]
        else f"'{entity_id}' — {data['totalTentativas']} attempt(s) on record."
    )
    return build_envelope(meta=dict(_META), data=data, summary=summary)


@router.get("/aulas/{aula_id}")
def get_aula(
    aula_id: str = Path(..., min_length=1, max_length=500),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    aula_status = get_aula_status(db, user.id, aula_id)
    if aula_status is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"no progress recorded for aula '{aula_id}'",
        )
    data = _aula_status_payload(aula_status)
    return build_envelope(
        meta=dict(_META),
        data=data,
        summary=f"aula '{aula_id}' — {data['status']}.",
    )


@router.get("/aulas/{aula_id}/pratica")
def get_aula_pratica(
    aula_id: str = Path(..., min_length=1, max_length=500),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """The Praticado axis for one lesson.

    200 with ``semRegistro: true`` — not 404 — when nothing has been
    practised here. The lesson panel has to render "nothing practised
    yet" as a state, and an error is not a state.
    """
    data = get_aula_practice(db, user.id, aula_id)
    summary = (
        f"aula '{aula_id}' — no practice attempt on record."
        if data["semRegistro"]
        else (
            f"aula '{aula_id}' — {data['totalTentativas']} attempt(s) across "
            f"{len(data['instrumentos'])} instrument(s) and "
            f"{len(data['exercicios'])} exercise(s)."
        )
    )
    return build_envelope(meta=dict(_META), data=data, summary=summary)


@router.get("/revisao")
def get_revisao(
    tz: str | None = _TZ_QUERY,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Exercise attempts, each with the learner's local day (LYCEUM).

    Raw facts for the spaced-review rule, which lives in the front and is
    a house product rule, not a pedagogical fact. No schedule is computed
    here; ``diaDeReferencia`` is "today" in the same zone the days use.
    """
    try:
        data = get_review_attempts(db, user.id, tz=tz)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e)) from e

    summary = (
        "no exercise attempt on record."
        if data["semRegistro"]
        else f"{len(data['tentativas'])} exercise attempt(s) on record ({data['fuso']})."
    )
    return build_envelope(meta=dict(_META), data=data, summary=summary)

# --- Perfil da Alexandria (LYCEUM, V2) -----------------------------------
#
# GET    /api/progress/perfil          — study days + first occurrences + banner/photo flags
# GET    /api/progress/perfil/foto     — the photo bytes (404 when there is none)
# PUT    /api/progress/perfil/foto     — raw image body (WebP/JPEG/PNG, ≤ 300 kB)
# DELETE /api/progress/perfil/foto     — remove the photo
# PUT    /api/progress/perfil/faixa    — {"faixa": "<id>" | null}
#
# The photo is the Alexandria profile's only (Founder: "a foto é só da
# Alexandria"); it is not the platform account's avatar.


class FaixaRequest(BaseModel):
    faixa: str | None = Field(default=None, max_length=64)


@router.get("/perfil")
def get_perfil_route(
    tz: str | None = _TZ_QUERY,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        data = get_perfil(db, user.id, tz=tz)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e)) from e
    return build_envelope(
        meta=dict(_META),
        data=data,
        summary=(
            "no study event on record"
            if data["semRegistro"]
            else f"{len(data['dias'])} study day(s) in the last {data['janelaDias']} days, "
            f"{len(data['primeiras'])} first occurrence(s) on record"
        )
        + ".",
    )


@router.get("/perfil/foto")
def get_foto_route(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    foto = get_foto(db, user.id)
    if foto is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="no photo")
    dados, tipo, _ = foto
    return Response(
        content=dados,
        media_type=tipo,
        headers={"Cache-Control": "private, no-cache", "X-Content-Type-Options": "nosniff"},
    )


@router.put("/perfil/foto")
async def put_foto_route(
    request: Request,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    dados = bytearray()
    async for parte in request.stream():
        dados.extend(parte)
        if len(dados) > FOTO_MAX_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"photo larger than {FOTO_MAX_BYTES} bytes",
            )
    try:
        em = set_foto(db, user.id, bytes(dados))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e)) from e
    return {"temFoto": True, "fotoAtualizadaEm": em.isoformat()}


@router.delete("/perfil/foto", status_code=status.HTTP_204_NO_CONTENT)
def delete_foto_route(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    delete_foto(db, user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.put("/perfil/faixa")
def put_faixa_route(
    body: FaixaRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        faixa = set_faixa(db, user.id, body.faixa)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e)) from e
    return {"faixa": faixa}
