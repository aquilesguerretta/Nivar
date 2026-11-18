"""NIV-66 read model for one reviewed ANEEL undertaking and its ONS units.

The reviewed mapping defines canonical identity. Each accepted capture independently
supports (or fails to support) that mapping and its own capacity observations.
"""

from __future__ import annotations

import json
import os
from dataclasses import dataclass
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation
from uuid import UUID

from sqlalchemy import func, literal_column, select
from sqlalchemy.exc import MultipleResultsFound
from sqlalchemy.orm import Session

from app.db.models.argos_memory import ArgosRawArtifact, ArgosSnapshot
from app.scripts.ingest_argos_ons_capacidade_geracao import (
    ADAPTER_VERSION,
    DEFAULT_RESOURCE_URL,
    RIGHTS_RECORD_REF,
    RIGHTS_SUMMARY_STATE,
)
from app.services.argos_memory import compute_sha256, get_current_snapshot, reconstruct_snapshot
from app.services.argos_ons_capacidade_geracao_diff import (
    DIFF_VERSION,
    PARSER_VERSION,
    SOURCE_ID,
    ParsedPayload,
    diff_capacidade_geracao,
    parse_capacidade_geracao,
)

CEG = "UHE.PH.PA.030354-2.01"
UNDERTAKING_ID = f"asset:aneel:ceg:{CEG}"
SNAPSHOTS_ENV = "ARGOS_BELO_MONTE_SNAPSHOTS"
CAPACITY_METRIC = "ons.capacidade_geracao:val_potenciaefetiva"
REVIEWED_CAPTURE_AT = datetime.fromisoformat("2026-11-17T17:40:18.138231+00:00")
REVIEWED_CAPTURE_SHA256 = "6fb41c0c76632addaa0338ab7eee319cfc1730df22508f3eee2afba6fbddfda2"

ANEEL_CEG = {
    "id": "document:aneel:rea:14936:2023",
    "label": "ANEEL · Resolução Autorizativa nº 14.936/2023, art. 1º",
    "date": "2023-10-24",
    "url": "https://www2.aneel.gov.br/cedoc/rea202314936ti.pdf",
}
MME_CONCESSION = {
    "id": "document:dou:concession:01-2010-mme:2010-08-31",
    "label": "DOU · Extrato republicado do Contrato de Concessão nº 01/2010-MME, seção 3, p. 96",
    "date": "2010-08-31",
    "url": "https://www.gov.br/mme/pt-br/arquivos/do-31-08-2010-s3.pdf#page=96",
}
MME_REIDI = {
    "id": "document:mme:portaria:876:2010",
    "label": "MME · Portaria nº 876/2010, enquadramento no REIDI",
    "date": "2010-11-04",
    "url": "https://www.gov.br/mme/pt-br/arquivos/portaria-876-de-04-11-2010-publicado-no-dou-de-08-11-2010.pdf",
}
ONS_PIMENTAL = {
    "id": "document:ons:cd-ct.n.2tr.01:38",
    "label": "ONS · Cadastro CD-CT.N.2TR.01, revisão 38, § 5.2",
    "date": "2026-05-20",
    "url": (
        "https://www.ons.org.br/%2FMPO%2FDocumento%20Normativo%2F"
        "2.%20Cadastros%20de%20Informa%C3%A7%C3%B5es%20Operacionais%20-%20SM%205.11%2F"
        "2.1.%20Cadastros%20de%20Informa%C3%A7%C3%B5es%20Operacionais%20de%20Dados%20de%20Equipamentos%2F"
        "2.1.4.%20Regi%C3%A3o%20Norte%2FCD-CT.N.2TR.01_Rev.38.pdf"
    ),
}
NORTE_ENERGIA_SITES = {
    "id": "document:norte-energia:fre:2025:v2",
    "label": "Norte Energia · Formulário de Referência 2025 v2, item 1.4",
    "date": "2025-08-27",
    "url": (
        "https://www.norteenergiasa.com.br/media/investor/docs/"
        "formulario-de-referencia-2025-versao-2-enviado-27-08-2025.pdf"
    ),
}


@dataclass(frozen=True)
class Site:
    slug: str
    name: str
    source_name: str
    unit_codes: tuple[tuple[str, str], ...]
    evidence_ids: tuple[str, ...]

    @property
    def id(self) -> str:
        return f"{UNDERTAKING_ID}:site:{self.slug}"

    def match(self, row: dict[str, str], number: str) -> bool:
        return (row["ceg"], row["nom_usina"], row["num_unidadegeradora"]) == (
            CEG,
            self.source_name,
            number,
        )


# These code/number pairs were verified in the reviewed CSV, scoped by the
# original CEG and the source's site label. A new code or a conflicting site
# assignment requires evidence review even if the display name still matches.
SITES = (
    Site(
        "belo-monte",
        "Belo Monte",
        "BELO MONTE",
        tuple((f"PABM--0UG{n:02}", f"{n:02}") for n in range(1, 19)),
        (NORTE_ENERGIA_SITES["id"],),
    ),
    Site(
        "pimental",
        "Pimental",
        "PIMENTAL",
        tuple((f"PAPI--0UG{n:02}", f"{n:02}") for n in range(1, 7)),
        (ONS_PIMENTAL["id"], NORTE_ENERGIA_SITES["id"]),
    ),
)


class EvidenceUnavailable(ValueError):
    """The server-approved evidence cannot be used for this read."""


def configured_ids() -> tuple[UUID, ...]:
    try:
        value = json.loads(os.environ.get(SNAPSHOTS_ENV, "[]"))
        if not isinstance(value, list) or not value:
            raise ValueError
        ids = tuple(UUID(item) for item in value)
        if len(set(ids)) != len(ids):
            raise ValueError
    except (ValueError, TypeError, AttributeError) as exc:
        raise EvidenceUnavailable("Invalid or missing snapshot approval") from exc
    return ids


@dataclass(frozen=True)
class EvidenceVersion:
    id: str
    retrieved_at: datetime
    published_at: datetime | None
    reference_time_start: datetime | None
    reference_time_end: datetime | None
    sha256: str
    byte_size: int
    rows: ParsedPayload

    def metadata(self) -> dict:
        return {
            "id": self.id,
            "retrievedAt": self.retrieved_at.astimezone(timezone.utc),
            "publishedAt": self.published_at,
            "referenceTimeStart": self.reference_time_start,
            "referenceTimeEnd": self.reference_time_end,
            "sha256": self.sha256,
            "byteSize": self.byte_size,
            "parserVersion": PARSER_VERSION,
            "rightsRecordRef": RIGHTS_RECORD_REF,
        }


def _validate_provenance(snapshot: ArgosSnapshot) -> None:
    if (
        snapshot.source_id != SOURCE_ID
        or snapshot.adapter_version != ADAPTER_VERSION
        or snapshot.rights_record_ref != RIGHTS_RECORD_REF
        or snapshot.rights_summary_state != RIGHTS_SUMMARY_STATE
        or not isinstance(snapshot.acquisition_metadata, dict)
        or snapshot.acquisition_metadata.get("url") != DEFAULT_RESOURCE_URL
        or snapshot.acquisition_metadata.get("synthetic") is True
    ):
        raise EvidenceUnavailable("Snapshot provenance or rights mismatch")


def read_version(db: Session, snapshot: ArgosSnapshot) -> EvidenceVersion:
    _validate_provenance(snapshot)
    artifact = db.get(ArgosRawArtifact, snapshot.artifact_id)
    if artifact is None:
        raise EvidenceUnavailable("Missing raw artifact")
    _, data = reconstruct_snapshot(db, snapshot.id)
    if (
        len(data) != artifact.byte_size
        or compute_sha256(data) != artifact.sha256
        or (snapshot.retrieved_at == REVIEWED_CAPTURE_AT and artifact.sha256 != REVIEWED_CAPTURE_SHA256)
    ):
        raise EvidenceUnavailable("Stored artifact failed integrity validation")
    return EvidenceVersion(
        str(snapshot.id),
        snapshot.retrieved_at,
        snapshot.published_at,
        snapshot.reference_time_start,
        snapshot.reference_time_end,
        artifact.sha256,
        artifact.byte_size,
        parse_capacidade_geracao(data),
    )


def _capacity(row: dict[str, str] | None) -> str | None:
    if row is None:
        return None
    raw = row["val_potenciaefetiva"]
    try:
        capacity = Decimal(raw)
    except InvalidOperation:
        return None
    return raw if capacity.is_finite() and capacity > 0 else None


def _unit(
    site: Site, code: str, number: str, version: EvidenceVersion,
    previous: EvidenceVersion | None,
) -> dict:
    row = version.rows.get(code)
    matched = row is not None and site.match(row, number)
    state = "UNKNOWN"
    if matched:
        state = "VERIFIED"
    elif row is not None:
        state = "UNRESOLVED"
    unit_id = f"asset:ons:cod_equipamento:{code}"
    capacity = _capacity(row) if matched else None

    earlier_row = previous.rows.get(code) if previous else None
    earlier_capacity = (
        _capacity(earlier_row) if earlier_row and site.match(earlier_row, number) else None
    )
    comparison = None
    if capacity is not None and earlier_capacity is not None:
        change = Decimal(capacity) - Decimal(earlier_capacity)
        comparison = {
            "fromObservationId": f"{unit_id}:{CAPACITY_METRIC}:{previous.id}",
            "fromMW": earlier_capacity,
            "changeMW": format(change, "f"),
        }

    return {
        "id": unit_id,
        "siteId": site.id,
        "identityState": state,
        "equipmentCode": code,
        "unitNumber": number,
        "operationEntryDate": (row["dat_entradaoperacao"] or None) if matched else None,
        "observationState": "AVAILABLE" if capacity is not None else "UNKNOWN",
        "observation": {
            "id": f"{unit_id}:{CAPACITY_METRIC}:{version.id}",
            "assetId": unit_id,
            "snapshotId": version.id,
            "metricId": CAPACITY_METRIC,
            "unit": "MW",
            "value": capacity,
            "comparison": comparison,
        } if capacity is not None else None,
    }


def compose_read_model(
    version: EvidenceVersion, previous: EvidenceVersion | None = None,
) -> dict:
    """One canonical composition shared by the Map and Terminal."""
    sites = [
        {
            "id": site.id,
            "name": site.name,
            "sourceLabel": site.source_name,
            "parentId": UNDERTAKING_ID,
            "evidenceIds": site.evidence_ids,
            "units": [_unit(site, code, number, version, previous) for code, number in site.unit_codes],
        }
        for site in SITES
    ]
    units = [unit for site in sites for unit in site["units"]]
    reviewed_codes = {unit["equipmentCode"] for unit in units}
    unreviewed_count = sum(
        row["ceg"] == CEG and code not in reviewed_codes for code, row in version.rows.items()
    )
    all_verified = not unreviewed_count and all(unit["identityState"] == "VERIFIED" for unit in units)
    observations = [unit["observation"] for unit in units]
    total = None
    if all_verified and all(observation is not None for observation in observations):
        total = format(sum(Decimal(observation["value"]) for observation in observations), "f")
    comparison = None
    if previous is not None:
        delta = diff_capacidade_geracao(previous.rows, version.rows)
        # Membership on either side catches additions, removals and CEG changes.
        # Reviewed codes also belong to this comparison when their CEG conflicts.
        changed_codes = [*delta.added, *delta.removed, *(row.identity for row in delta.changed)]
        scoped_changed = any(
            code in reviewed_codes
            or previous.rows.get(code, {}).get("ceg") == CEG
            or version.rows.get(code, {}).get("ceg") == CEG
            for code in changed_codes
        )
        comparison = {
            "fromVersion": previous.metadata(),
            "rawBytesChanged": previous.sha256 != version.sha256,
            "sourceContentChanged": not delta.content_equal,
            "scopedAssetContentChanged": scoped_changed,
            "diffVersion": DIFF_VERSION,
        }
    return {
        "state": "VERIFIED" if all_verified else "UNRESOLVED",
        "asset": {
            "id": UNDERTAKING_ID,
            "name": "Complexo Hidrelétrico de Belo Monte",
            "ceg": CEG,
            "technology": "Hidrelétrica",
            "region": "Pará, Brasil",
            "evidenceId": ANEEL_CEG["id"],
        },
        "concession": {
            "role": "concessionaire",
            "assetId": UNDERTAKING_ID,
            "company": {
                "id": "corporate-entity:br:cnpj:12300288000107",
                "cnpj": "12.300.288/0001-07",
                "name": "Norte Energia S.A.",
            },
            "instrument": "01/2010-MME-UHE Belo Monte",
            "effectiveFrom": "2010-08-26",
            "evidenceId": MME_CONCESSION["id"],
            "supplementaryEvidenceIds": [MME_REIDI["id"]],
        },
        "documents": [ANEEL_CEG, MME_CONCESSION, MME_REIDI, ONS_PIMENTAL, NORTE_ENERGIA_SITES],
        "source": {
            "id": SOURCE_ID,
            "label": "ONS · Capacidade Instalada de Geração",
            "url": "https://dados.ons.org.br/dataset/capacidade-geracao",
            "dictionaryUrl": DEFAULT_RESOURCE_URL.replace(
                "CAPACIDADE_GERACAO.csv", "DicionarioDados_Capacidade_Instalada_Geracao.pdf"
            ),
        },
        "version": version.metadata(),
        "comparison": comparison,
        "sites": sites,
        "unreviewedUnitCount": unreviewed_count,
        "totalMW": total,
    }


def _approved_lineage(db: Session) -> list[ArgosSnapshot]:
    """Walk the canonical chain and return the configured subset in ancestry order."""
    pending = set(configured_ids())
    try:
        current = get_current_snapshot(db, SOURCE_ID)
    except MultipleResultsFound as exc:
        raise EvidenceUnavailable("Ambiguous source lineage head") from exc
    seen = set()
    approved = []
    while current is not None and pending:
        if current.id in seen or current.source_id != SOURCE_ID:
            raise EvidenceUnavailable("Invalid source ancestry")
        seen.add(current.id)
        if current.id in pending:
            _validate_provenance(current)
            approved.append(current)
            pending.remove(current.id)
        if not pending or current.prior_snapshot_id is None:
            break
        current = db.get(ArgosSnapshot, current.prior_snapshot_id)

    if pending:
        raise EvidenceUnavailable("Approved snapshots do not belong to the source head's lineage")
    return list(reversed(approved))


def _commit_times(db: Session, approved: list[ArgosSnapshot]) -> dict[UUID, datetime | None]:
    """Postgres can attest row visibility only while the commit metadata is retained."""
    if db.scalar(select(func.current_setting("track_commit_timestamp"))) != "on":
        return {}

    rows = db.execute(
        select(ArgosSnapshot.id, func.pg_xact_commit_timestamp(literal_column("argos_snapshot.xmin")))
        .where(ArgosSnapshot.id.in_([snap.id for snap in approved]))
    )
    times = {snapshot_id: committed_at for snapshot_id, committed_at in rows}
    last_commit = None
    for snap in approved:
        committed = times.get(snap.id)
        if committed is not None:
            # A clock anomaly makes this chronology unusable, but does not
            # change the immutable lineage used for the current read.
            if committed < max(snap.retrieved_at, snap.created_at) or (
                last_commit is not None and committed < last_commit
            ):
                return {}
            last_commit = committed
    return times


class HistoricalVisibilityUnproven(ValueError):
    """A potentially visible successor has no retained commit evidence."""


def _historical_index(
    approved: list[ArgosSnapshot],
    times: dict[UUID, datetime | None],
    cutoff: datetime,
) -> int | None:
    for i in range(len(approved) - 1, -1, -1):
        snap = approved[i]
        committed = times.get(snap.id)
        if committed is not None:
            if committed <= cutoff:
                return i
        elif max(snap.retrieved_at, snap.created_at) <= cutoff:
            # Both acquisition and transaction start are lower bounds only.
            raise HistoricalVisibilityUnproven
    return None


def _historical_options(
    approved: list[ArgosSnapshot], times: dict[UUID, datetime | None],
) -> list[dict]:
    options = []
    first_possible_successor = None
    for snap in reversed(approved):
        committed = times.get(snap.id)
        if committed is not None and (
            first_possible_successor is None or committed < first_possible_successor
        ):
            options.append({"id": snap.id, "knownAt": committed.astimezone(timezone.utc)})
        visible_from = committed or max(snap.retrieved_at, snap.created_at)
        if first_possible_successor is None or visible_from < first_possible_successor:
            first_possible_successor = visible_from
    return list(reversed(options))


def inspect_belo_monte(db: Session, known_at: datetime | None = None) -> dict:
    approved = _approved_lineage(db)
    times = _commit_times(db, approved)

    index = len(approved) - 1
    if known_at is not None:
        try:
            historical = _historical_index(approved, times, known_at)
        except HistoricalVisibilityUnproven:
            return {"state": "UNKNOWN", "reason": "HISTORICAL_VISIBILITY_UNPROVEN"}
        if historical is None:
            return {"state": "UNKNOWN", "reason": "NO_EVIDENCE_AT_REQUESTED_TIME"}
        index = historical

    version = read_version(db, approved[index])
    previous = read_version(db, approved[index - 1]) if index > 0 else None
    result = compose_read_model(version, previous)
    committed = times.get(approved[index].id)
    result["version"]["persistedAt"] = committed.astimezone(timezone.utc) if committed else None
    result["availableVersions"] = [
        option for option in _historical_options(approved, times)
        if known_at is None or option["knownAt"] <= known_at
    ]
    return result
