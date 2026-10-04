"""Bounded PostgreSQL-backed intake for Solar Proposal Validator V1."""

from __future__ import annotations

from fastapi import UploadFile

from app.services.advisory_files import (
    PDF_CONTENT_TYPE,
    PDF_OR_IMAGE_CONTENT_TYPES,
    InvalidAdvisoryUpload,
    StoredAdvisoryUpload,
    positive_env_int,
    read_advisory_upload,
)


DEFAULT_SOURCE_MAX_BYTES = 15 * 1024 * 1024
DEFAULT_DELIVERABLE_MAX_BYTES = 20 * 1024 * 1024


def source_max_bytes() -> int:
    return positive_env_int("SPV_MAX_SOURCE_BYTES", DEFAULT_SOURCE_MAX_BYTES)


def deliverable_max_bytes() -> int:
    return positive_env_int(
        "SPV_MAX_DELIVERABLE_BYTES",
        DEFAULT_DELIVERABLE_MAX_BYTES,
    )


async def read_source_upload(upload: UploadFile) -> StoredAdvisoryUpload:
    # A vendor proposal may arrive as a native PDF or as one photo/scan of a
    # printed document. The endpoint intentionally remains single-file in V1.
    return await read_advisory_upload(
        upload,
        max_bytes=source_max_bytes(),
        allowed=PDF_OR_IMAGE_CONTENT_TYPES,
        expected_label="PDF, JPEG, PNG or WebP",
        fallback_filename="proposta-solar",
    )


async def read_deliverable_upload(upload: UploadFile) -> StoredAdvisoryUpload:
    return await read_advisory_upload(
        upload,
        max_bytes=deliverable_max_bytes(),
        allowed=frozenset({PDF_CONTENT_TYPE}),
        expected_label="PDF",
        fallback_filename="relatorio-validacao-proposta-solar.pdf",
    )


__all__ = [
    "InvalidAdvisoryUpload",
    "StoredAdvisoryUpload",
    "deliverable_max_bytes",
    "read_deliverable_upload",
    "read_source_upload",
    "source_max_bytes",
]
