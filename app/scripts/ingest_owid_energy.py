"""Ingest Our World in Data energy profiles into ``country_energy_profile``.

Run from repo root::

    DATABASE_URL=... py -3 -m app.scripts.ingest_owid_energy

Environment: ``DATABASE_URL`` (PostgreSQL).

Source: https://github.com/owid/energy-data
  - codebook: https://raw.githubusercontent.com/owid/energy-data/master/owid-energy-codebook.csv
    (the brief's ``owid-public.owid.io/.../owid-energy-codebook.csv`` 404s —
    confirmed at Fase 1 of this wave; the GitHub mirror is the real one)
  - data:     https://owid-public.owid.io/data/energy/owid-energy-data.json
    (this URL from the brief is correct, verified with a HEAD request)

Reference year: 2023, not the newest year in the dataset (2025 partial /
2024 for most fields). Measured at Fase 1: the electricity-mix fields
(Ember-sourced) reach 2024 for most sovereign countries, but
``energy_per_capita`` (EIA/Energy-Institute-sourced) only reaches 100%
coverage of the sovereign set at 2023 — one calendar year behind. At 2023,
161 of 188 sovereign countries (86%) have every one of the twelve ingested
metrics populated simultaneously; at 2024 that drops to 55/188 (29%). 2023
is the most recent year with complete data for the majority of countries,
exactly as Fase 1 was asked to confirm.

Country filter: ``iso_code`` present in the OWID JSON AND the entity is a
UN member state or UN permanent observer state (Palestine is present in
the dataset; Vatican is absent — OWID has no energy data for it). This
excludes 32 entities that carry an ISO 3166-1 alpha-3 code but are not
sovereign UN-recognized states: dependent territories (Puerto Rico, Hong
Kong, Macao, Bermuda, Guam, French Guiana, Greenland, Gibraltar, and 21
more — see NON_SOVEREIGN_ISO3 below), Antarctica, the defunct Netherlands
Antilles, disputed Western Sahara, and Taiwan (not a UN member since
1971). This lands at 188 countries, not the ~195 the brief expected —
short of 195 mainly because of Taiwan and the several small Pacific/
Caribbean territories OWID also tracks. Reported as measured, not forced
to match the estimate.
"""

from __future__ import annotations

import logging
import sys

import requests
from psycopg2.extras import execute_batch

from app.db.models.country_energy import FIELD_DEFINITIONS, FIELD_NAMES
from app.scripts._db import connect

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
logger = logging.getLogger(__name__)

OWID_ENERGY_DATA_JSON = "https://owid-public.owid.io/data/energy/owid-energy-data.json"
REFERENCE_YEAR = 2023

# ISO 3166-1 alpha-3 codes present in the OWID energy dataset that belong to
# non-sovereign territories, disputed territories, defunct entities, or
# Antarctica — not UN member states or UN permanent observer states. See the
# module docstring and CLAUDE.md for the full reasoning.
NON_SOVEREIGN_ISO3: dict[str, str] = {
    "ASM": "American Samoa (US territory)",
    "ATA": "Antarctica (no permanent population / sovereign)",
    "ABW": "Aruba (Netherlands constituent country)",
    "BMU": "Bermuda (UK overseas territory)",
    "VGB": "British Virgin Islands (UK overseas territory)",
    "CYM": "Cayman Islands (UK overseas territory)",
    "COK": "Cook Islands (self-governing, free association with NZ, not a UN member)",
    "CUW": "Curacao (Netherlands constituent country)",
    "FLK": "Falkland Islands (UK overseas territory)",
    "FRO": "Faroe Islands (Danish autonomous territory)",
    "GUF": "French Guiana (France overseas department)",
    "PYF": "French Polynesia (France overseas collectivity)",
    "GIB": "Gibraltar (UK overseas territory)",
    "GRL": "Greenland (Danish autonomous territory)",
    "GLP": "Guadeloupe (France overseas department)",
    "GUM": "Guam (US territory)",
    "HKG": "Hong Kong (China SAR)",
    "MAC": "Macao (China SAR)",
    "MTQ": "Martinique (France overseas department)",
    "MSR": "Montserrat (UK overseas territory)",
    "ANT": "Netherlands Antilles (defunct 2010)",
    "NCL": "New Caledonia (France special collectivity)",
    "NIU": "Niue (self-governing, free association with NZ, not a UN member)",
    "MNP": "Northern Mariana Islands (US commonwealth)",
    "PRI": "Puerto Rico (US commonwealth)",
    "REU": "Reunion (France overseas department)",
    "SHN": "Saint Helena (UK overseas territory)",
    "SPM": "Saint Pierre and Miquelon (France overseas collectivity)",
    "TCA": "Turks and Caicos Islands (UK overseas territory)",
    "VIR": "United States Virgin Islands (US territory)",
    "ESH": "Western Sahara (disputed territory, not a seated UN member)",
    "TWN": "Taiwan (not a UN member state since 1971)",
}


def download_json() -> dict:
    r = requests.get(OWID_ENERGY_DATA_JSON, timeout=180)
    r.raise_for_status()
    return r.json()


def build_rows(payload: dict) -> list[tuple]:
    rows: list[tuple] = []
    skipped_no_iso = 0
    skipped_non_sovereign = 0
    skipped_no_year = 0
    for country_name, entry in payload.items():
        iso_code = entry.get("iso_code")
        if not iso_code:
            skipped_no_iso += 1
            continue
        if iso_code in NON_SOVEREIGN_ISO3:
            skipped_non_sovereign += 1
            continue
        year_row = next(
            (r for r in entry.get("data", []) if r.get("year") == REFERENCE_YEAR), None
        )
        if year_row is None:
            skipped_no_year += 1
            logger.warning(
                "no %s row for %s (%s) — skipped entirely, not defaulted to an older year",
                REFERENCE_YEAR,
                country_name,
                iso_code,
            )
            continue

        values = [year_row.get(field) for field in FIELD_NAMES]
        rows.append((iso_code, country_name, REFERENCE_YEAR, *values))

    logger.info(
        "entities: %s total, %s without iso_code, %s non-sovereign/territory, "
        "%s sovereign but missing a %s row, %s ingested",
        len(payload),
        skipped_no_iso,
        skipped_non_sovereign,
        skipped_no_year,
        REFERENCE_YEAR,
        len(rows),
    )
    return rows


UPSERT_PROFILE_SQL = f"""
INSERT INTO country_energy_profile (
  iso_code, country_name, year, {", ".join(FIELD_NAMES)}
) VALUES (
  %s, %s, %s, {", ".join(["%s"] * len(FIELD_NAMES))}
)
ON CONFLICT (iso_code) DO UPDATE SET
  country_name = EXCLUDED.country_name,
  year = EXCLUDED.year,
  {", ".join(f"{f} = EXCLUDED.{f}" for f in FIELD_NAMES)},
  updated_at = now();
"""

UPSERT_FIELD_SOURCE_SQL = """
INSERT INTO country_energy_field_source (field_name, source_citation, unit)
VALUES (%s, %s, %s)
ON CONFLICT (field_name) DO UPDATE SET
  source_citation = EXCLUDED.source_citation,
  unit = EXCLUDED.unit;
"""


def main() -> int:
    logger.info("downloading %s", OWID_ENERGY_DATA_JSON)
    payload = download_json()
    logger.info("parsed %s entities (countries + aggregates/regions)", len(payload))

    rows = build_rows(payload)

    field_source_rows = [
        (f["column"], f["source_citation"], f["unit"]) for f in FIELD_DEFINITIONS
    ]

    conn = connect()
    try:
        with conn.cursor() as cur:
            execute_batch(cur, UPSERT_PROFILE_SQL, rows, page_size=200)
            execute_batch(cur, UPSERT_FIELD_SOURCE_SQL, field_source_rows, page_size=50)
        conn.commit()
    finally:
        conn.close()

    logger.info("upserted %s country_energy_profile rows", len(rows))
    logger.info("upserted %s country_energy_field_source rows", len(field_source_rows))

    if len(rows) < 150:
        logger.warning(
            "ingested count (%s) is well below the ~195 expected — investigate before "
            "treating this as final",
            len(rows),
        )
    return 0


if __name__ == "__main__":
    sys.exit(main())
