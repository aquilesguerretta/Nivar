"""GET /api/atlas/world/countries[/{iso}] — world country energy profiles.

Cursor Wave 10. Reference data for the Alexandria world Atlas globe — real
Our World in Data energy figures per sovereign country, year 2023 (see
``app/scripts/ingest_owid_energy.py`` for why 2023 and not a newer year).
No bbox, no pagination: ~188 rows total, the whole set fits in one response.

Follows the same canonical ``{meta, data, summary}`` envelope as the Wave
7/8 infrastructure endpoints (``/api/infra/*``) — this is market/reference
data, not identity, so the identity envelope (plain JSON, no wrapper) does
not apply here.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models.country_energy import FIELD_NAMES, CountryEnergyFieldSource, CountryEnergyProfile
from app.db.session import get_db
from app.services.envelope import build_envelope

router = APIRouter(prefix="/api/atlas/world", tags=["atlas-world"])


def _fuel_mix(row) -> dict:
    return {
        "fossilPct": _num(row.fossil_share_elec),
        "nuclearPct": _num(row.nuclear_share_elec),
        "hydroPct": _num(row.hydro_share_elec),
        "windPct": _num(row.wind_share_elec),
        "solarPct": _num(row.solar_share_elec),
        "biofuelPct": _num(row.biofuel_share_elec),
        "otherRenewablesExcBiofuelPct": _num(row.other_renewables_share_elec_exc_biofuel),
    }


def _num(v) -> float | None:
    return float(v) if v is not None else None


def _profile_summary(row) -> dict:
    return {
        "isoCode": row.iso_code,
        "countryName": row.country_name,
        "year": row.year,
        "population": row.population,
        "electricityGenerationTwh": _num(row.electricity_generation),
        "renewablesShareElecPct": _num(row.renewables_share_elec),
        "carbonIntensityElecGco2PerKwh": _num(row.carbon_intensity_elec),
        "energyPerCapitaKwh": _num(row.energy_per_capita),
        "fuelMix": _fuel_mix(row),
    }


@router.get("/countries")
def list_countries(db: Session = Depends(get_db)):
    rows = db.execute(
        select(CountryEnergyProfile).order_by(CountryEnergyProfile.country_name)
    ).scalars().all()

    data = [_profile_summary(r) for r in rows]
    years = {r.year for r in rows}
    year_label = str(years.pop()) if len(years) == 1 else "mixed"

    return build_envelope(
        meta={
            "source": "our-world-in-data-energy",
            "data_age_seconds": 0,
            "count": len(data),
            "year": year_label,
        },
        data=data,
        summary=f"{len(data)} sovereign countries with a {year_label} energy profile "
        f"from Our World in Data.",
    )


@router.get("/countries/{iso}")
def get_country(
    iso: str = Path(..., description="ISO 3166-1 alpha-3 country code, e.g. BRA"),
    db: Session = Depends(get_db),
):
    iso_code = iso.strip().upper()
    if len(iso_code) != 3 or not iso_code.isalpha():
        raise HTTPException(
            status_code=422, detail="iso must be a 3-letter ISO 3166-1 alpha-3 code"
        )

    row = db.execute(
        select(CountryEnergyProfile).where(CountryEnergyProfile.iso_code == iso_code)
    ).scalar_one_or_none()
    if row is None:
        raise HTTPException(
            status_code=404,
            detail=f"no energy profile for '{iso_code}' — either not a sovereign country "
            "in the OWID dataset, or excluded as a territory/dependency (see "
            "app/scripts/ingest_owid_energy.py:NON_SOVEREIGN_ISO3)",
        )

    sources = db.execute(select(CountryEnergyFieldSource)).scalars().all()
    source_by_field = {s.field_name: s for s in sources}

    field_sources = {}
    for field in FIELD_NAMES:
        s = source_by_field.get(field)
        if s is None:
            continue
        field_sources[field] = {"unit": s.unit, "sourceCitation": s.source_citation}

    data = {
        **_profile_summary(row),
        "fieldSources": field_sources,
    }

    return build_envelope(
        meta={
            "source": "our-world-in-data-energy",
            "data_age_seconds": 0,
            "year": row.year,
        },
        data=data,
        summary=f"{row.country_name} ({row.iso_code}) — {row.year} energy profile, "
        f"{len(field_sources)} fields sourced from Our World in Data.",
    )
