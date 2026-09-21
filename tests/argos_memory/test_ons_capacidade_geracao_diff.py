"""Tests for the deterministic ons.capacidade_geracao parser/diff (NIV-39).

Two layers, tested separately:

* **Parser/diff unit tests** — pure functions, no database, no network.
* **Controlled-proof integration tests** — real disposable Postgres, using
  an unmistakable test-only source ID
  (``test.argos_memory.ons_capacidade_geracao.controlled_revision``). These
  never touch the real ``ons.capacidade_geracao`` production chain — see
  ``app.scripts.ingest_argos_ons_capacidade_geracao`` for the real adapter,
  untouched by this file.

Fixtures live in ``tests/argos_memory/fixtures/ons_capacidade_geracao/``:
small, synthetic, 3-4 row CSVs built on the real live column structure
(NIV-39 Phase 0), with unmistakably fake identities (``TEST-EQ-00N``) and
values. They are committed test data, never a real ONS payload.
"""

from __future__ import annotations

import os
import pathlib
import uuid
from datetime import datetime, timezone

import pytest
from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session

from app.scripts.diff_argos_ons_capacidade_geracao import DiffCliError, build_diff_report
from app.services.argos_memory import capture_snapshot, reconstruct_snapshot
from app.services.argos_ons_capacidade_geracao_diff import (
    CONTROLLED_TEST_SOURCE_NAMESPACE,
    DIFF_VERSION,
    PARSER_VERSION,
    SOURCE_ID,
    DuplicateRowIdentityError,
    SchemaError,
    diff_capacidade_geracao,
    parse_capacidade_geracao,
)

FIXTURE_DIR = pathlib.Path(__file__).parent / "fixtures" / "ons_capacidade_geracao"


def _controlled_source_id() -> str:
    # Unmistakably test-only, unique per test so parallel/repeated runs
    # never collide with each other or with the real production chain.
    # Reuses the same constant the reviewer CLI checks against, so this
    # test can never silently drift from what the CLI actually accepts.
    return f"{CONTROLLED_TEST_SOURCE_NAMESPACE}.{uuid.uuid4().hex[:8]}"


def _fixture(name: str) -> bytes:
    return (FIXTURE_DIR / name).read_bytes()


# --- parser unit tests (no database) ----------------------------------------


def test_parser_accepts_the_real_live_schema_shape():
    rows = parse_capacidade_geracao(_fixture("fixture_a.csv"))
    assert set(rows) == {"TEST-EQ-001", "TEST-EQ-002", "TEST-EQ-003"}
    assert rows["TEST-EQ-002"]["val_potenciaefetiva"] == "20.0"
    assert rows["TEST-EQ-002"]["nom_usina"] == "USINA TESTE DOIS"


def test_parser_strips_padding_whitespace_but_preserves_content():
    padded = (
        "id_subsistema;nom_subsistema;id_estado;nom_estado;nom_modalidadeoperacao;"
        "nom_agenteproprietario;nom_agenteoperador;nom_tipousina;nom_usina;ceg;"
        "nom_unidadegeradora;cod_equipamento;num_unidadegeradora;nom_combustivel;"
        "dat_entradateste;dat_entradaoperacao;dat_desativacao;val_potenciaefetiva\n"
        "SE;SUDESTE   ;SP;SAO PAULO;TIPO I;X;X;TERMICA;X;UTE.X;X;TEST-EQ-PAD   ;"
        "1   ;GAS;2020-01-01;2020-01-02;;10.0\n"
    ).encode("utf-8")
    rows = parse_capacidade_geracao(padded)
    assert "TEST-EQ-PAD" in rows  # identity trimmed
    assert rows["TEST-EQ-PAD"]["nom_subsistema"] == "SUDESTE"  # trailing spaces stripped
    assert rows["TEST-EQ-PAD"]["num_unidadegeradora"] == "1"


def test_parser_rejects_duplicate_row_identity():
    with pytest.raises(DuplicateRowIdentityError):
        parse_capacidade_geracao(_fixture("fixture_invalid_duplicate_identity.csv"))


def test_parser_rejects_blank_identity():
    bad = (
        "id_subsistema;nom_subsistema;id_estado;nom_estado;nom_modalidadeoperacao;"
        "nom_agenteproprietario;nom_agenteoperador;nom_tipousina;nom_usina;ceg;"
        "nom_unidadegeradora;cod_equipamento;num_unidadegeradora;nom_combustivel;"
        "dat_entradateste;dat_entradaoperacao;dat_desativacao;val_potenciaefetiva\n"
        "SE;SUDESTE;SP;SAO PAULO;TIPO I;X;X;TERMICA;X;UTE.X;X;   ;1;GAS;"
        "2020-01-01;2020-01-02;;10.0\n"
    ).encode("utf-8")
    with pytest.raises(SchemaError):
        parse_capacidade_geracao(bad)


def test_parser_rejects_unexpected_header():
    bad = b"col_a;col_b\nvalue_a;value_b\n"
    with pytest.raises(SchemaError):
        parse_capacidade_geracao(bad)


def test_parser_rejects_ragged_row():
    bad = (
        "id_subsistema;nom_subsistema;id_estado;nom_estado;nom_modalidadeoperacao;"
        "nom_agenteproprietario;nom_agenteoperador;nom_tipousina;nom_usina;ceg;"
        "nom_unidadegeradora;cod_equipamento;num_unidadegeradora;nom_combustivel;"
        "dat_entradateste;dat_entradaoperacao;dat_desativacao;val_potenciaefetiva\n"
        "SE;SUDESTE;SP;SAO PAULO;TIPO I;X;X;TERMICA;X;UTE.X;X;TEST-EQ-SHORT;1;GAS\n"
    ).encode("utf-8")
    with pytest.raises(SchemaError):
        parse_capacidade_geracao(bad)


def test_parser_rejects_invalid_utf8():
    with pytest.raises(SchemaError):
        parse_capacidade_geracao(b"\xff\xfe not valid utf-8 at all")


# --- diff unit tests (no database) ------------------------------------------


def test_diff_finds_exactly_the_known_field_change_no_unrelated_changes():
    a = parse_capacidade_geracao(_fixture("fixture_a.csv"))
    b = parse_capacidade_geracao(_fixture("fixture_b_known_field_change.csv"))
    delta = diff_capacidade_geracao(a, b)

    assert delta.added == []
    assert delta.removed == []
    assert len(delta.changed) == 1
    changed_row = delta.changed[0]
    assert changed_row.identity == "TEST-EQ-002"
    assert len(changed_row.changes) == 1
    field_change = changed_row.changes[0]
    assert field_change.field == "val_potenciaefetiva"
    assert field_change.before == "20.0"
    assert field_change.after == "22.5"
    assert delta.content_equal is False


def test_diff_order_only_variation_reports_no_content_change():
    """The critical M2 invariant: byte change must not become content change."""
    a = parse_capacidade_geracao(_fixture("fixture_a.csv"))
    b = parse_capacidade_geracao(_fixture("fixture_b_order_only.csv"))
    delta = diff_capacidade_geracao(a, b)

    assert delta.added == []
    assert delta.removed == []
    assert delta.changed == []
    assert delta.content_equal is True
    # and the raw bytes really did differ (order changed the CSV bytes)
    assert _fixture("fixture_a.csv") != _fixture("fixture_b_order_only.csv")


def test_diff_reports_added_and_removed_identities_not_as_field_changes():
    a = parse_capacidade_geracao(_fixture("fixture_a.csv"))
    b = parse_capacidade_geracao(_fixture("fixture_b_added_removed.csv"))
    delta = diff_capacidade_geracao(a, b)

    assert delta.added == ["TEST-EQ-004"]
    assert delta.removed == ["TEST-EQ-003"]
    assert delta.changed == []  # TEST-EQ-001/002 present unchanged in both


def test_diff_output_ordering_is_deterministic_regardless_of_dict_insertion_order():
    a1 = {"Z-ROW": {"cod_equipamento": "Z-ROW", "val_potenciaefetiva": "1"},
          "A-ROW": {"cod_equipamento": "A-ROW", "val_potenciaefetiva": "2"}}
    a2 = {"A-ROW": {"cod_equipamento": "A-ROW", "val_potenciaefetiva": "2"},
          "Z-ROW": {"cod_equipamento": "Z-ROW", "val_potenciaefetiva": "1"}}
    empty: dict = {}

    delta1 = diff_capacidade_geracao(empty, a1)
    delta2 = diff_capacidade_geracao(empty, a2)
    assert delta1.added == delta2.added == ["A-ROW", "Z-ROW"]  # sorted, insertion-order independent


# --- controlled-proof integration tests (real disposable Postgres) --------


def _database_url() -> str | None:
    url = os.environ.get("DATABASE_URL", "").strip()
    return url or None


def _reachable(url: str) -> bool:
    try:
        engine = create_engine(url)
        with engine.connect():
            pass
        engine.dispose()
        return True
    except OperationalError:
        return False


_URL = _database_url()
pytestmark = pytest.mark.skipif(
    _URL is None or not _reachable(_URL),
    reason="DATABASE_URL not set or Postgres unreachable — see test_capture_persistence.py",
)


@pytest.fixture()
def db_session():
    """Apply the real migration chain to a disposable database, then tear it down."""
    url = _URL
    assert url is not None

    config = Config("alembic.ini")
    config.set_main_option("sqlalchemy.url", url)
    command.upgrade(config, "head")

    engine = create_engine(url)
    session = Session(bind=engine)
    try:
        yield session
    finally:
        session.rollback()
        session.close()
        engine.dispose()
        command.downgrade(config, "base")


def _capture_fixture(session, source_id: str, fixture_name: str, *, retrieved_at=None):
    return capture_snapshot(
        session,
        source_id=source_id,
        data=_fixture(fixture_name),
        content_type="text/csv",
        adapter_version="test.controlled_fixture@1",
        retrieved_at=retrieved_at or datetime.now(timezone.utc),
    )


# --- PROOF A: known field change --------------------------------------------


def test_proof_a_known_field_change(db_session):
    source_id = _controlled_source_id()

    snap_a = _capture_fixture(db_session, source_id, "fixture_a.csv")
    db_session.commit()
    assert snap_a.revision_relation == "first"

    snap_b = _capture_fixture(db_session, source_id, "fixture_b_known_field_change.csv")
    db_session.commit()
    assert snap_b.revision_relation == "changed"
    assert snap_b.prior_snapshot_id == snap_a.id

    # A remains reconstructible byte-for-byte after B exists.
    reconstructed_a, reconstructed_a_bytes = reconstruct_snapshot(db_session, snap_a.id)
    assert reconstructed_a_bytes == _fixture("fixture_a.csv")

    report = build_diff_report(db_session, snap_a.id, snap_b.id)

    assert report["source_id"] == source_id
    assert report["from_snapshot_id"] == str(snap_a.id)
    assert report["to_snapshot_id"] == str(snap_b.id)
    assert report["raw_bytes_equal"] is False  # raw hashes differ
    assert report["from_sha256"] != report["to_sha256"]
    assert report["parser_version"] == PARSER_VERSION
    assert report["diff_version"] == DIFF_VERSION
    assert report["content_equal"] is False

    assert report["added"] == []
    assert report["removed"] == []
    assert report["counts"] == {"added": 0, "removed": 0, "changed": 1}
    assert len(report["changed"]) == 1
    changed = report["changed"][0]
    assert changed["row_identity"] == "TEST-EQ-002"
    assert changed["changed_fields"] == [
        {"field": "val_potenciaefetiva", "before": "20.0", "after": "22.5"}
    ]


# --- PROOF B: order-only change --------------------------------------------


def test_proof_b_order_only_change_is_not_reported_as_content_change(db_session):
    source_id = _controlled_source_id()

    snap_a = _capture_fixture(db_session, source_id, "fixture_a.csv")
    db_session.commit()

    snap_b = _capture_fixture(db_session, source_id, "fixture_b_order_only.csv")
    db_session.commit()
    assert snap_b.revision_relation == "changed"  # row order changed every byte

    report = build_diff_report(db_session, snap_a.id, snap_b.id)

    assert report["raw_bytes_equal"] is False
    assert report["content_equal"] is True
    assert report["counts"] == {"added": 0, "removed": 0, "changed": 0}
    assert report["added"] == []
    assert report["removed"] == []
    assert report["changed"] == []


# --- PROOF C: added / removed -----------------------------------------------


def test_proof_c_added_and_removed_rows(db_session):
    source_id = _controlled_source_id()

    snap_a = _capture_fixture(db_session, source_id, "fixture_a.csv")
    db_session.commit()

    snap_b = _capture_fixture(db_session, source_id, "fixture_b_added_removed.csv")
    db_session.commit()

    report = build_diff_report(db_session, snap_a.id, snap_b.id)

    assert report["added"] == ["TEST-EQ-004"]
    assert report["removed"] == ["TEST-EQ-003"]
    assert report["changed"] == []
    assert report["counts"] == {"added": 1, "removed": 1, "changed": 0}


# --- reviewer-path safety ---------------------------------------------------


def test_reviewer_path_rejects_mismatched_source_snapshots(db_session):
    ons_source_id = _controlled_source_id()
    other_source_id = f"test.argos_memory.some_other_source.{uuid.uuid4().hex[:8]}"

    snap_ons = _capture_fixture(db_session, ons_source_id, "fixture_a.csv")
    snap_other = capture_snapshot(
        db_session,
        source_id=other_source_id,
        data=b"completely unrelated payload",
        content_type="text/plain",
        adapter_version="test.controlled_fixture@1",
        retrieved_at=datetime.now(timezone.utc),
    )
    db_session.commit()

    with pytest.raises(DiffCliError):
        build_diff_report(db_session, snap_ons.id, snap_other.id)


def test_reviewer_path_rejects_same_but_unrelated_source_id(db_session):
    """"Same source_id as each other" is necessary but not sufficient.

    Two snapshots under one arbitrary unrelated source_id, both carrying
    valid ONS-shaped fixture bytes, must still be rejected — the reviewer
    only accepts the canonical ons.capacidade_geracao source or the NIV-39
    controlled-test namespace, never an inference from CSV shape alone.
    """
    unrelated_source_id = f"test.argos_memory.some_other_source.{uuid.uuid4().hex[:8]}"

    snap_a = _capture_fixture(db_session, unrelated_source_id, "fixture_a.csv")
    db_session.commit()
    snap_b = _capture_fixture(
        db_session, unrelated_source_id, "fixture_b_known_field_change.csv"
    )
    db_session.commit()

    assert snap_a.source_id == snap_b.source_id  # confirms this isn't the mismatch case

    with pytest.raises(DiffCliError):
        build_diff_report(db_session, snap_a.id, snap_b.id)


def test_reviewer_path_accepts_controlled_test_namespace(db_session):
    source_id = _controlled_source_id()
    assert source_id.startswith(CONTROLLED_TEST_SOURCE_NAMESPACE + ".")

    snap_a = _capture_fixture(db_session, source_id, "fixture_a.csv")
    db_session.commit()
    snap_b = _capture_fixture(db_session, source_id, "fixture_b_known_field_change.csv")
    db_session.commit()

    report = build_diff_report(db_session, snap_a.id, snap_b.id)  # must not raise
    assert report["source_id"] == source_id


def test_reviewer_path_accepts_canonical_ons_source_id(db_session):
    """The real production source_id must still be diffable — never in production DB."""
    snap_a = _capture_fixture(db_session, SOURCE_ID, "fixture_a.csv")
    db_session.commit()
    snap_b = _capture_fixture(db_session, SOURCE_ID, "fixture_b_known_field_change.csv")
    db_session.commit()

    report = build_diff_report(db_session, snap_a.id, snap_b.id)  # must not raise
    assert report["source_id"] == SOURCE_ID


def test_reviewer_path_binds_to_exact_snapshot_ids_not_current_head(db_session):
    source_id = _controlled_source_id()

    snap_a = _capture_fixture(db_session, source_id, "fixture_a.csv")
    db_session.commit()
    snap_b = _capture_fixture(db_session, source_id, "fixture_b_known_field_change.csv")
    db_session.commit()
    snap_c = _capture_fixture(db_session, source_id, "fixture_b_added_removed.csv")
    db_session.commit()

    # Explicitly diff A -> B, even though C is now the lineage head — the
    # caller-supplied IDs must be honored exactly, never silently
    # substituted for the current head.
    report = build_diff_report(db_session, snap_a.id, snap_b.id)
    assert report["from_snapshot_id"] == str(snap_a.id)
    assert report["to_snapshot_id"] == str(snap_b.id)
    assert report["to_snapshot_id"] != str(snap_c.id)
