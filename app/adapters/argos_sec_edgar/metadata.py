"""Normalize SEC submissions metadata without reading filing documents."""

from __future__ import annotations

import hashlib
import json
import re
from dataclasses import asdict, dataclass
from datetime import date, datetime
from typing import Literal

PETROBRAS_CIK = "0001119639"
SUBMISSIONS_BASE = "https://data.sec.gov/submissions/"
RECENT_PAGE = f"CIK{PETROBRAS_CIK}.json"
ADAPTER_VERSION = f"sec.edgar.submissions.{PETROBRAS_CIK}@1"

_ACCESSION = re.compile(r"[0-9]{10}-[0-9]{2}-[0-9]{6}")
_DATE = re.compile(r"[0-9]{4}-[0-9]{2}-[0-9]{2}")
_TIMESTAMP = re.compile(r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?")
_ARCHIVE_PAGE = re.compile(rf"CIK{PETROBRAS_CIK}-submissions-[0-9]{{3,}}\.json")
_SAFE_FILENAME = re.compile(r"[A-Za-z0-9_][A-Za-z0-9_.-]*")


@dataclass(frozen=True)
class SourceCandidate:
    source_id: str = f"sec.edgar.submissions.{PETROBRAS_CIK}"
    publisher: str = "U.S. Securities and Exchange Commission (SEC EDGAR)"
    filer_cik: str = PETROBRAS_CIK
    issuer_name: str = "Petróleo Brasileiro S.A. — Petrobras"
    resource_url: str = SUBMISSIONS_BASE + RECENT_PAGE
    retrieval_method: str = "EDGAR submissions JSON, conditional HTTPS GET"
    upstream_cadence: str = "Updated as filings are disseminated"
    authority_scope: str = "EDGAR filing metadata for the Petrobras filer CIK"
    access_policy_url: str = "https://www.sec.gov/search-filings/edgar-search-assistance/accessing-edgar-data"
    policy_version: int = 1
    license_notice_version: str | None = None
    rights_record_ref: str | None = None
    rights_summary_state: Literal["unclear"] = "unclear"
    allowed_use_modes: frozenset[str] = frozenset()

    def channel_state(self, channel: str) -> Literal["unknown", "denied"]:
        if channel in {"local_archive", "client_display", "external_api"}:
            return "unknown"
        return "denied"


SOURCE = SourceCandidate()


class EdgarPayloadError(ValueError):
    """EDGAR returned unusable or inconsistent metadata."""


@dataclass(frozen=True)
class FilingMetadata:
    accession_number: str
    form: str
    filed_on: date
    accepted_at: str | None
    report_date: date | None
    primary_document: str | None
    original_url: str
    language: str | None = None
    source_id: str = SOURCE.source_id
    corporate_entity_ref: str = f"sec-cik:{PETROBRAS_CIK}"
    evidence_scope: Literal["edgar_filing_metadata"] = "edgar_filing_metadata"
    filing_content_scope: Literal["filer_submission_unreviewed"] = "filer_submission_unreviewed"

    @property
    def document_id(self) -> str:
        return f"document:sec-edgar:{self.accession_number}"

    @property
    def is_amendment(self) -> bool:
        return self.form.endswith("/A")

    def metadata_hash(self) -> str:
        fields = asdict(self)
        fields["filed_on"] = self.filed_on.isoformat()
        if self.report_date is not None:
            fields["report_date"] = self.report_date.isoformat()
        canonical_json = json.dumps(fields, sort_keys=True, separators=(",", ":"))
        return hashlib.sha256(canonical_json.encode("utf-8")).hexdigest()


@dataclass(frozen=True)
class FilingVersion:
    metadata: FilingMetadata
    metadata_sha256: str
    revision: int
    observed_at: datetime
    supersedes_version_id: str | None
    adapter_version: str = ADAPTER_VERSION

    @property
    def version_id(self) -> str:
        return f"{self.metadata.document_id}@{self.revision}:{self.metadata_sha256}"


@dataclass(frozen=True)
class FilingChange:
    kind: Literal["new", "unchanged", "corrected"]
    version: FilingVersion


@dataclass(frozen=True)
class ArchivePage:
    filename: str
    filed_from: date | None
    filed_through: date | None

    def overlaps(self, filed_from: date | None, filed_through: date | None) -> bool:
        return not (
            (filed_from and self.filed_through and self.filed_through < filed_from)
            or (filed_through and self.filed_from and self.filed_from > filed_through)
        )


@dataclass(frozen=True)
class Page:
    filings: tuple[FilingMetadata, ...]
    archives: tuple[ArchivePage, ...] = ()


def parse_page(name: str, payload: object) -> Page:
    data = _object(payload)
    if name != RECENT_PAGE:
        return Page(_parse_columns(data))

    if str(data.get("cik")) not in (PETROBRAS_CIK, str(int(PETROBRAS_CIK))):
        raise EdgarPayloadError("Unexpected filer CIK in SEC submissions")
    filings = _object(data.get("filings"))
    files = filings.get("files")
    if not isinstance(files, list):
        raise EdgarPayloadError("Invalid SEC submissions archive list")
    archives: dict[str, ArchivePage] = {}
    for descriptor in files:
        entry = _object(descriptor)
        filename = entry.get("name")
        if not isinstance(filename, str) or not _ARCHIVE_PAGE.fullmatch(filename):
            raise EdgarPayloadError("Invalid SEC submissions archive filename")
        start = _optional_date(entry.get("filingFrom"), "filingFrom")
        end = _optional_date(entry.get("filingTo"), "filingTo")
        if start is not None and end is not None and start > end:
            raise EdgarPayloadError("Invalid SEC submissions archive date range")
        archive = ArchivePage(filename, start, end)
        if archives.setdefault(filename, archive) != archive:
            raise EdgarPayloadError("Conflicting SEC submissions archive descriptors")
    return Page(
        _parse_columns(_object(filings.get("recent"))),
        tuple(archives.values()),
    )


def _object(payload: object) -> dict:
    if not isinstance(payload, dict):
        raise EdgarPayloadError("Invalid SEC submissions JSON object")
    return payload


def _parse_columns(data: dict) -> tuple[FilingMetadata, ...]:
    accession_numbers = data.get("accessionNumber")
    if not isinstance(accession_numbers, list) or not accession_numbers:
        raise EdgarPayloadError("Missing or empty SEC submissions accession column")
    size = len(accession_numbers)
    return tuple(
        _parse_filing(*row)
        for row in zip(
            accession_numbers,
            _column(data, "form", size),
            _column(data, "filingDate", size),
            _column(data, "acceptanceDateTime", size, optional=True),
            _column(data, "reportDate", size, optional=True),
            _column(data, "primaryDocument", size, optional=True),
            strict=True,
        )
    )


def _column(data: dict, field: str, size: int, *, optional: bool = False) -> list:
    if optional and field not in data:
        return [None] * size
    column = data.get(field)
    if not isinstance(column, list) or len(column) != size:
        raise EdgarPayloadError(f"Invalid SEC submissions column: {field}")
    return column


def _parse_filing(
    accession: object, form: object, filed: object, accepted: object, report_date: object, filename: object
) -> FilingMetadata:
    if not isinstance(accession, str) or not _ACCESSION.fullmatch(accession):
        raise EdgarPayloadError("Invalid SEC accession number")
    if not isinstance(form, str) or not form.strip():
        raise EdgarPayloadError("Invalid SEC form")
    filed_on = _optional_date(filed, "filingDate")
    if filed_on is None:
        raise EdgarPayloadError("Missing SEC filing date")

    accepted_at = _optional_string(accepted)
    if accepted_at is not None:
        if not _TIMESTAMP.fullmatch(accepted_at):
            raise EdgarPayloadError("Invalid SEC acceptance timestamp")
        try:
            datetime.fromisoformat(accepted_at.replace("Z", "+00:00"))
        except ValueError:
            raise EdgarPayloadError("Invalid SEC acceptance timestamp") from None

    primary_document = _optional_string(filename)
    archive_base = f"https://www.sec.gov/Archives/edgar/data/{int(PETROBRAS_CIK)}"
    if primary_document and _SAFE_FILENAME.fullmatch(primary_document):
        original_url = f"{archive_base}/{accession.replace('-', '')}/{primary_document}"
    else:
        primary_document = None
        original_url = f"{archive_base}/{accession}-index.html"

    return FilingMetadata(
        accession_number=accession,
        form=form.strip(),
        filed_on=filed_on,
        accepted_at=accepted_at,
        report_date=_optional_date(report_date, "reportDate"),
        primary_document=primary_document,
        original_url=original_url,
    )


def _optional_date(value: object, field: str) -> date | None:
    text = _optional_string(value)
    if text is None:
        return None
    if not _DATE.fullmatch(text):
        raise EdgarPayloadError(f"Invalid SEC date: {field}")
    try:
        return date.fromisoformat(text)
    except ValueError:
        raise EdgarPayloadError(f"Invalid SEC date: {field}") from None


def _optional_string(value: object) -> str | None:
    if value is None:
        return None
    if not isinstance(value, str):
        raise EdgarPayloadError("Invalid SEC submissions field type")
    return value.strip() or None
