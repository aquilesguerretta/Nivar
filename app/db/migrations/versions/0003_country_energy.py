"""World country energy profiles (Cursor Wave 10 — Our World in Data energy).

Revision ID: 0003_country_energy
Revises: 0002_identity
Create Date: 2026-08-01

Additive only. Touches no Wave 7/8/9 table. Column types and the
field/citation set are documented in
``app/db/models/country_energy.py::FIELD_DEFINITIONS`` — this migration
mirrors that module exactly, it does not introduce independent decisions.
"""

from typing import Sequence, Union

from alembic import op

revision: str = "0003_country_energy"
down_revision: Union[str, None] = "0002_identity"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE country_energy_profile (
          id                                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          iso_code                                    TEXT UNIQUE NOT NULL,
          country_name                                TEXT NOT NULL,
          year                                        INTEGER NOT NULL,
          population                                  BIGINT,
          electricity_generation                      NUMERIC(14,4),
          renewables_share_elec                       NUMERIC(6,3),
          carbon_intensity_elec                       NUMERIC(9,3),
          energy_per_capita                           NUMERIC(12,3),
          fossil_share_elec                           NUMERIC(6,3),
          nuclear_share_elec                          NUMERIC(6,3),
          hydro_share_elec                            NUMERIC(6,3),
          wind_share_elec                             NUMERIC(6,3),
          solar_share_elec                            NUMERIC(6,3),
          biofuel_share_elec                          NUMERIC(6,3),
          other_renewables_share_elec_exc_biofuel     NUMERIC(6,3),
          updated_at                                  TIMESTAMPTZ NOT NULL DEFAULT now()
        );
        """
    )
    op.execute(
        "CREATE INDEX country_energy_profile_year_idx ON country_energy_profile (year);"
    )

    op.execute(
        """
        CREATE TABLE country_energy_field_source (
          field_name        TEXT PRIMARY KEY,
          source_citation   TEXT NOT NULL,
          unit              TEXT NOT NULL
        );
        """
    )


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS country_energy_field_source CASCADE;")
    op.execute("DROP TABLE IF EXISTS country_energy_profile CASCADE;")
