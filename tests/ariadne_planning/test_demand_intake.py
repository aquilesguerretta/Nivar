"""Engineering layouts; authentic corpus remains local and is exercised too."""

from pathlib import Path
import pytest
from app.services.ariadne_close_intake import parse_file

PUBLIC = Path(
    r"C:\dev\ariadne-planning-public-evaluation-20261003\source-review\sobral-group-a-original.pdf"
)


def demand_csv(**changes):
    values = dict(
        scope="TEST-UNIT",
        period="2019-06",
        demand_kw="260.640",
        peak_kw="150.00",
        contracted_kw="280.00",
        demand_unit="kW",
        modality="green",
        subgroup="A4",
        distributor_cnpj="07047251000170",
        reading_from="2019-05-15",
        reading_to="2019-06-14",
        invoice_id="TEST-1",
    )
    values.update(changes)
    return (";".join(values) + "\n" + ";".join(values.values()) + "\n").encode()


def test_explicit_demand_table_keeps_units_raw_values_and_locators():
    p = parse_file(demand_csv(), "monthly.csv", inspection=True)
    row = p["demandProfile"][0]
    assert p["proposal"]["role"] == "invoice"
    assert row["demand_kw"] == "260.640"
    assert row["contracted_kw"] == "280.00"
    assert row["raw"]["demand_kw"] == "260.640"
    assert row["fieldRefs"]["demand_kw"] == "CSV:row:2:3"


@pytest.mark.parametrize(
    "field,value",
    [
        ("demand_kw", ""),
        ("demand_unit", "kWh"),
        ("modality", "blue"),
        ("contracted_kw", "280,000"),
        ("period", "2019-13"),
    ],
)
def test_unsupported_or_ambiguous_facts_remain_visible(field, value):
    row = parse_file(demand_csv(**{field: value}), "monthly.csv", inspection=True)[
        "demandProfile"
    ][0]
    assert row["errors"]
    assert row["raw"][field] == value


def test_zero_demand_is_observed_but_blank_is_missing():
    zero = parse_file(demand_csv(demand_kw="0"), "monthly.csv", inspection=True)[
        "demandProfile"
    ][0]
    assert zero["demand_kw"] == "0" and not zero["errors"]
    blank = parse_file(demand_csv(demand_kw=""), "monthly.csv", inspection=True)[
        "demandProfile"
    ][0]
    assert blank["demand_kw"] is None


@pytest.mark.skipif(
    not PUBLIC.exists(), reason="separately acquired authentic Sobral corpus absent"
)
def test_actual_scanned_searchable_pdf_does_not_execute_ocr_or_rekey():
    p = parse_file(PUBLIC.read_bytes(), PUBLIC.name, inspection=True)
    assert p["proposal"]["scope"] == "429967"
    assert p["proposal"]["period"] == "2020-02"
    assert p["demandProfile"]
    good = [r for r in p["demandProfile"] if not r["errors"]]
    feb = next(r for r in good if r["period"] == "2020-02")
    assert feb["demand_kw"] == "294.48"
    assert feb["contracted_kw"] == "280.00"
    assert feb["page"] == 14
    assert feb["sourceQuality"] == "existing_searchable_scan_layer"
    assert p["demandInspection"]["unsupportedPages"]  # do not manufacture March OCR
    assert "point:" in feb["fieldRefs"]["demand_kw"]
