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

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models.argos_memory import ArgosRawArtifact, ArgosSnapshot
from app.scripts.ingest_argos_ons_capacidade_geracao import (
    ADAPTER_VERSION,
    DEFAULT_RESOURCE_URL,
    RIGHTS_RECORD_REF,
    RIGHTS_SUMMARY_STATE,
)
from app.services.argos_memory import compute_sha256, reconstruct_snapshot
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
    "id": "document:mme:portaria:876:2010",
    "label": "MME · Portaria nº 876/2010, art. 1º e anexo I",
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


def read_version(db: Session, snapshot: ArgosSnapshot) -> EvidenceVersion:
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
        comparison = {
            "fromVersion": previous.metadata(),
            "rawBytesChanged": previous.sha256 != version.sha256,
            "parsedContentChanged": not delta.content_equal,
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
        },
        "documents": [ANEEL_CEG, MME_CONCESSION, ONS_PIMENTAL, NORTE_ENERGIA_SITES],
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


def inspect_belo_monte(db: Session, known_at: datetime | None = None) -> dict:
    ids = configured_ids()
    versions = list(db.scalars(
        select(ArgosSnapshot).where(ArgosSnapshot.id.in_(ids))
        .order_by(ArgosSnapshot.retrieved_at)
    ))
    if len(versions) != len(ids):
        raise EvidenceUnavailable("An approved snapshot is unavailable")
    if any(before.retrieved_at == after.retrieved_at for before, after in zip(versions, versions[1:])):
        raise EvidenceUnavailable("Ambiguous snapshot retrieval time")

    visible = [
        version for version in versions
        if version.retrieved_at >= REVIEWED_CAPTURE_AT
        and (known_at is None or version.retrieved_at <= known_at)
    ]
    if not visible:
        return {"state": "UNKNOWN", "reason": "NO_EVIDENCE_AT_REQUESTED_TIME"}

    version = read_version(db, visible[-1])
    previous = read_version(db, visible[-2]) if len(visible) > 1 else None
    result = compose_read_model(version, previous)
    result["availableVersions"] = [
        {"id": snap.id, "retrievedAt": snap.retrieved_at.astimezone(timezone.utc)} for snap in visible
    ]
    return result
