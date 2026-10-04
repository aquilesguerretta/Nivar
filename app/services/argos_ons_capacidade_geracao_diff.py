"""Argos Memory — deterministic parser/diff for ons.capacidade_geracao (NIV-39).

M2 scope: given two already-captured, immutable ``argos_snapshot`` rows for
this one source, explain what changed between them without pretending a
controlled test mutation is a publisher revision. Three concepts, kept
separate on purpose (do not collapse them):

* **Byte change** — ``argos_snapshot.revision_relation`` from M1 (NIV-12):
  raw SHA-256 differs from the immediately prior snapshot. Unchanged by this
  module.
* **Content delta** — what this module computes: a deterministic, field-level
  comparison of two *parsed* payloads. A byte change does not imply a content
  delta (row order alone changes every byte but no field), and a content
  delta does not imply a byte change is meaningful for any particular reason.
* **Publisher revision/correction** — not claimed anywhere in this module.
  Nothing here infers why bytes or content differ, or whether ONS corrected
  an error. That interpretation is out of scope for M2 and for this file.

Row identity — ``cod_equipamento``
-----------------------------------
NIV-39 Phase 0 inspected the full live payload (5,686 rows) before choosing
an identity, per the M2 rule against inventing one:

* ``cod_equipamento`` — unique across all 5,686 rows, zero blanks. Chosen.
* ``ceg`` + ``num_unidadegeradora`` (the compound key that looks obvious
  from the schema) — **not** unique: 19 duplicate groups in the live
  payload, including two different physical units under different owners
  sharing one ``(ceg, num_unidadegeradora)`` pair. Rejected.
* ``ceg`` alone — one plant enterprise has many generating units; not
  unique by design. Rejected.
* ``nom_unidadegeradora`` — empirically unique in the live payload, but it
  is a presentation-derived label (concatenates unit number, capacity and
  plant name), not an ONS-assigned identifier. Rejected despite passing
  the uniqueness test — the M2 rule is explicit that "looks unique" is not
  sufficient justification.

Normalization
-------------
Every field value (the identity column included) has leading/trailing
whitespace stripped before storage or comparison. The live payload's
string columns carry fixed-width export padding (observed, e.g.,
``cod_equipamento`` raw ``'ALUXG-0UG5          '``, ``num_unidadegeradora``
raw ``'5     '``) — this is an artifact of the upstream export, not content.
Internal whitespace, case, punctuation and every other character are
preserved exactly. No unit conversion, no blank-to-zero coercion, no
rounding, no label translation, no spelling correction is performed.

Row order is structurally irrelevant to content comparison: rows are parsed
into a mapping keyed by ``cod_equipamento``, so two payloads with identical
rows in a different order compare as ``content_equal`` even though their raw
bytes (and therefore ``revision_relation``) differ. This is the "verified
stable row key" order-independence the M2 architecture decision explicitly
allows.

Schema drift is not tolerated silently: an unexpected header, a row with the
wrong field count, a blank identity, or a duplicate identity within one
payload all raise an explicit error rather than being parsed around. A real
schema change requires a new ``PARSER_VERSION``, not a permissive parser.
"""

from __future__ import annotations

import csv
import io
from dataclasses import dataclass, field

# Must match app.scripts.ingest_argos_ons_capacidade_geracao.SOURCE_ID.
SOURCE_ID = "ons.capacidade_geracao"

# NIV-39's unmistakable controlled-test namespace (see test_ons_capacidade_geracao_diff.py).
# Reviewer-path source acceptance is a prefix match on this namespace, not on
# CSV shape: a payload merely happening to fit the 18-column schema does not
# make its source_id acceptable to diff.
CONTROLLED_TEST_SOURCE_NAMESPACE = "test.argos_memory.ons_capacidade_geracao.controlled_revision"

PARSER_VERSION = "ons.capacidade_geracao.parser@1"
DIFF_VERSION = "ons.capacidade_geracao.diff@1"

DELIMITER = ";"
IDENTITY_COLUMN = "cod_equipamento"

# Exact live schema observed in NIV-39 Phase 0 (18 columns, this order).
EXPECTED_HEADER: tuple[str, ...] = (
    "id_subsistema",
    "nom_subsistema",
    "id_estado",
    "nom_estado",
    "nom_modalidadeoperacao",
    "nom_agenteproprietario",
    "nom_agenteoperador",
    "nom_tipousina",
    "nom_usina",
    "ceg",
    "nom_unidadegeradora",
    "cod_equipamento",
    "num_unidadegeradora",
    "nom_combustivel",
    "dat_entradateste",
    "dat_entradaoperacao",
    "dat_desativacao",
    "val_potenciaefetiva",
)

ParsedRow = dict[str, str]
ParsedPayload = dict[str, ParsedRow]


class SchemaError(ValueError):
    """The payload does not match the parser's expected ons.capacidade_geracao schema."""


class DuplicateRowIdentityError(ValueError):
    """The same cod_equipamento appeared more than once in a single payload."""


def parse_capacidade_geracao(data: bytes) -> ParsedPayload:
    """Parse raw CSV bytes into rows keyed by the stable row identity.

    Pure — no I/O, no network, no database. Raises :class:`SchemaError` on
    any structural deviation from the expected live schema (bad encoding,
    wrong/missing header, ragged row, blank identity) and
    :class:`DuplicateRowIdentityError` if ``cod_equipamento`` repeats.
    """
    try:
        text = data.decode("utf-8")
    except UnicodeDecodeError as exc:
        raise SchemaError(f"payload is not valid UTF-8: {exc}") from exc

    # Explicit BOM handling: strip if present, absent is also fine (the live
    # payload has none, but a BOM is a structurally safe thing to strip).
    if text.startswith("﻿"):
        text = text[1:]

    raw_rows = list(csv.reader(io.StringIO(text), delimiter=DELIMITER))
    if not raw_rows:
        raise SchemaError("payload has no rows, not even a header")

    header = tuple(raw_rows[0])
    if header != EXPECTED_HEADER:
        raise SchemaError(
            f"unexpected header for {PARSER_VERSION}: got {header!r}, "
            f"expected {EXPECTED_HEADER!r}"
        )

    rows: ParsedPayload = {}
    for line_no, raw_row in enumerate(raw_rows[1:], start=2):
        if not any(cell.strip() for cell in raw_row):
            continue  # trailing blank line
        if len(raw_row) != len(header):
            raise SchemaError(
                f"row at line {line_no} has {len(raw_row)} fields, expected {len(header)}"
            )
        record = {col: value.strip() for col, value in zip(header, raw_row)}
        identity = record[IDENTITY_COLUMN]
        if not identity:
            raise SchemaError(f"row at line {line_no} has a blank {IDENTITY_COLUMN}")
        if identity in rows:
            raise DuplicateRowIdentityError(
                f"duplicate {IDENTITY_COLUMN}={identity!r} "
                f"(already seen before line {line_no})"
            )
        rows[identity] = record

    return rows


@dataclass(frozen=True)
class FieldChange:
    field: str
    before: str
    after: str


@dataclass(frozen=True)
class ChangedRow:
    identity: str
    changes: list[FieldChange] = field(default_factory=list)


@dataclass(frozen=True)
class ContentDelta:
    added: list[str]
    removed: list[str]
    changed: list[ChangedRow]

    @property
    def content_equal(self) -> bool:
        return not self.added and not self.removed and not self.changed


def diff_capacidade_geracao(from_rows: ParsedPayload, to_rows: ParsedPayload) -> ContentDelta:
    """Deterministic field-level comparison of two already-parsed payloads.

    Pure — no I/O. Row order in the source payloads is irrelevant: both
    inputs are already keyed by ``cod_equipamento``. Output lists are sorted
    by row identity for deterministic ordering. Only fields that actually
    differ are reported for a changed row (not the whole row).
    """
    from_keys = set(from_rows)
    to_keys = set(to_rows)

    added = sorted(to_keys - from_keys)
    removed = sorted(from_keys - to_keys)

    changed: list[ChangedRow] = []
    for identity in sorted(from_keys & to_keys):
        before_row = from_rows[identity]
        after_row = to_rows[identity]
        field_changes = [
            FieldChange(field=col, before=before_row[col], after=after_row[col])
            for col in EXPECTED_HEADER
            if before_row[col] != after_row[col]
        ]
        if field_changes:
            changed.append(ChangedRow(identity=identity, changes=field_changes))

    return ContentDelta(added=added, removed=removed, changed=changed)


__all__ = [
    "ChangedRow",
    "ContentDelta",
    "DELIMITER",
    "DIFF_VERSION",
    "DuplicateRowIdentityError",
    "EXPECTED_HEADER",
    "FieldChange",
    "IDENTITY_COLUMN",
    "PARSER_VERSION",
    "ParsedPayload",
    "ParsedRow",
    "SOURCE_ID",
    "SchemaError",
    "diff_capacidade_geracao",
    "parse_capacidade_geracao",
]
