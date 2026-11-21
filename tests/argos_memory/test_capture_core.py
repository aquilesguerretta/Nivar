"""Unit tests for the deterministic core of Argos Memory capture (NIV-12).

No database involved. This is the part of the spec that must never depend
on AI or any interpretation layer: byte equality and what it means for the
version chain.
"""

from __future__ import annotations

import hashlib

import pytest

from app.services.argos_memory import (
    classify_relation,
    compute_sha256,
    read_captured_artifact,
)


def test_compute_sha256_matches_hashlib_reference():
    data = b"CAPACIDADE_GERACAO test payload"
    assert compute_sha256(data) == hashlib.sha256(data).hexdigest()


def test_compute_sha256_is_deterministic_across_calls():
    data = b"same bytes twice"
    assert compute_sha256(data) == compute_sha256(data)


def test_compute_sha256_differs_for_different_bytes():
    assert compute_sha256(b"a") != compute_sha256(b"b")


# --- classify_relation — the actual M1 proof ----------------------------


def test_classify_relation_is_first_when_no_prior_capture_exists():
    assert classify_relation(None, compute_sha256(b"anything")) == "first"


def test_classify_relation_is_unchanged_for_identical_bytes():
    sha = compute_sha256(b"CAPACIDADE_GERACAO snapshot A")
    assert classify_relation(sha, sha) == "unchanged"


def test_classify_relation_is_changed_for_different_bytes():
    prior_sha = compute_sha256(b"CAPACIDADE_GERACAO snapshot A")
    new_sha = compute_sha256(b"CAPACIDADE_GERACAO snapshot B")
    assert prior_sha != new_sha
    assert classify_relation(prior_sha, new_sha) == "changed"


def test_classify_relation_does_not_infer_change_from_hash_case_or_formatting():
    # Guards against a careless implementation comparing anything other
    # than the exact hash strings this module itself produced.
    sha = compute_sha256(b"payload")
    assert classify_relation(sha, sha.lower()) == "unchanged"


# --- read_captured_artifact ----------------------------------------------


def test_read_captured_artifact_computes_hash_type_and_size():
    data = b"a,b,c\n1,2,3\n"
    captured = read_captured_artifact(data, "text/csv")
    assert captured.sha256 == compute_sha256(data)
    assert captured.content_type == "text/csv"
    assert captured.byte_size == len(data)
    assert captured.data == data


def test_read_captured_artifact_rejects_empty_payload():
    with pytest.raises(ValueError):
        read_captured_artifact(b"", "text/csv")
