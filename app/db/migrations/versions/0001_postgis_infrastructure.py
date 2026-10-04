"""PostGIS extension and infrastructure tables (generation, transmission, batteries).

Revision ID: 0001_postgis_infrastructure
Revises:
Create Date: 2026-05-13

"""

from typing import Sequence, Union

from alembic import op

revision: str = "0001_postgis_infrastructure"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

_ISO_CHECK = (
    "iso IN ('PJM','MISO','NYISO','ISO-NE','CAISO','SPP','ERCOT','WECC','AK','QC','OTHER')"
)


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS postgis;")

    op.execute(
        f"""
        CREATE TABLE generation_units (
          id                TEXT PRIMARY KEY,
          eia_plant_id      INTEGER,
          eia_generator_id  TEXT,
          name              TEXT NOT NULL,
          owner             TEXT,
          iso               TEXT NOT NULL,
          state             TEXT NOT NULL,
          fuel              TEXT NOT NULL,
          capacity_mw       NUMERIC(10,2) NOT NULL,
          status            TEXT NOT NULL,
          cod_date          DATE,
          retirement_date   DATE,
          geom              GEOMETRY(POINT, 4326) NOT NULL,
          CONSTRAINT generation_units_iso_check
            CHECK ({_ISO_CHECK})
        );
        """
    )
    op.execute(
        "CREATE INDEX gen_geom_idx     ON generation_units USING GIST (geom);"
    )
    op.execute("CREATE INDEX gen_iso_idx      ON generation_units (iso);")
    op.execute("CREATE INDEX gen_fuel_idx     ON generation_units (fuel);")
    op.execute("CREATE INDEX gen_status_idx   ON generation_units (status);")
    op.execute(
        "CREATE INDEX gen_capacity_idx ON generation_units (capacity_mw);"
    )

    op.execute(
        f"""
        CREATE TABLE transmission_segments (
          id                  TEXT PRIMARY KEY,
          voltage_kv          INTEGER NOT NULL,
          name                TEXT,
          owner               TEXT,
          iso                 TEXT NOT NULL,
          segment_length_km   NUMERIC(10,2) NOT NULL,
          geom                GEOMETRY(LINESTRING, 4326) NOT NULL,
          geom_mid            GEOMETRY(LINESTRING, 4326) NOT NULL,
          geom_low            GEOMETRY(LINESTRING, 4326) NOT NULL,
          CONSTRAINT transmission_segments_iso_check CHECK ({_ISO_CHECK})
        );
        """
    )
    op.execute(
        "CREATE INDEX tx_geom_idx     ON transmission_segments USING GIST (geom);"
    )
    op.execute(
        "CREATE INDEX tx_geom_mid_idx ON transmission_segments USING GIST (geom_mid);"
    )
    op.execute(
        "CREATE INDEX tx_geom_low_idx ON transmission_segments USING GIST (geom_low);"
    )
    op.execute("CREATE INDEX tx_voltage_idx  ON transmission_segments (voltage_kv);")
    op.execute("CREATE INDEX tx_iso_idx      ON transmission_segments (iso);")

    op.execute(
        f"""
        CREATE TABLE battery_assets (
          id                TEXT PRIMARY KEY,
          eia_plant_id      INTEGER,
          eia_generator_id  TEXT,
          name              TEXT NOT NULL,
          owner             TEXT,
          iso               TEXT NOT NULL,
          state             TEXT NOT NULL,
          capacity_mw       NUMERIC(10,2) NOT NULL,
          capacity_mwh      NUMERIC(12,2),
          duration_hours    NUMERIC(6,2),
          status            TEXT NOT NULL,
          cod_date          DATE,
          retirement_date   DATE,
          geom              GEOMETRY(POINT, 4326) NOT NULL,
          CONSTRAINT battery_assets_iso_check CHECK ({_ISO_CHECK})
        );
        """
    )
    op.execute("CREATE INDEX bat_geom_idx ON battery_assets USING GIST (geom);")
    op.execute("CREATE INDEX bat_iso_idx  ON battery_assets (iso);")


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS battery_assets CASCADE;")
    op.execute("DROP TABLE IF EXISTS transmission_segments CASCADE;")
    op.execute("DROP TABLE IF EXISTS generation_units CASCADE;")
