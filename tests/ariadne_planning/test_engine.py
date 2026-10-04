from copy import deepcopy
import json
from pathlib import Path
import pytest
from app.services import ariadne_planning_engine as engine
from app.services.ariadne_close_intake import parse_file
from tests.ariadne_planning.test_demand_intake import PUBLIC

ORACLE = json.loads(
    (Path(__file__).parent / "oracle-expected.json").read_text(encoding="utf-8")
)


def state(measured="270", rate="15.20", **changes):
    row = dict(
        recordKind="demand_fact",
        eligible=True,
        errors=[],
        period="2019-06",
        scope="UNIT",
        demand_kw=measured,
        contracted_kw="280",
        modality="green",
        subgroup="A4",
        demand_unit="kW",
        distributor_cnpj="07047251000170",
        reading_from="2019-05-15",
        reading_to="2019-06-14",
        locator="TEST:row:2",
        role="invoice",
        source_id="synthetic-invoice",
        sha256="v1",
        confirmation_version_id="c1",
    )
    row.update(changes)
    tariff = dict(
        recordKind="tariff_reference",
        planningConfirmed=True,
        errors=[],
        supplier_cnpj="07047251000170",
        subgroup="A4",
        modality="Verde",
        unit="kW",
        rate=rate,
        currency="BRL",
        basis="PRE_TAX_REFERENCE",
        rate_kind="OFFICIAL_TARIFF_REFERENCE",
        effective_from="2019-04-22",
        effective_to="2020-04-21",
        authority="Synthetic verified policy fixture",
        reference_id="TEST-T1",
        locator="TEST:row:3",
        role="context",
        **{
            "class": "Não se aplica",
            "subclass": "Não se aplica",
            "detail": "Não se aplica",
            "time_band": "Não se aplica",
        }
    )
    return {"review": {"scope": "UNIT"}, "records": [row, tariff]}


def execute(s, c="280", **flags):
    return engine.execute_planning(
        state_payload=s,
        assumption_values={
            "candidateKw": c,
            "normalRegime": True,
            "tariffApplicability": True,
            **flags,
        },
        execution_configuration=engine.POLICY,
    )


@pytest.mark.parametrize(
    "case",
    [c for c in ORACLE["synthetic_cases"] if c["expected"]["covered"]],
    ids=lambda c: c["id"],
)
def test_independent_frozen_arithmetic(case):
    i = case["inputs"]
    e = case["expected"]
    out = execute(state(i["measured"], i["tariff"]), i["candidate"])
    m = out["months"][0]
    assert m["modeled"]["regular"] == e["regular_brl"]
    assert m["modeled"]["overrun"] == e["overrun_brl"]
    assert m["modeled"]["total"] == e["modeled_demand_total_brl"]
    assert m["trigger"] == e["overrun_trigger"]
    assert m["modeled"]["unusedExposure"] == e["unused_contracted_exposure_brl"]


@pytest.mark.parametrize(
    "field,value",
    [
        ("demand_kw", None),
        ("eligible", False),
        ("demand_unit", "kWh"),
        ("modality", "blue"),
        ("period", None),
        ("reading_to", None),
        ("scope", "FOREIGN"),
        ("period", "2023-01"),
    ],
)
def test_missing_and_conflicting_facts_are_visible_uncovered(field, value):
    s = state()
    s["records"][0][field] = value
    if field in ("eligible", "modality"):
        # Another confirmed month makes an observed contract available.
        extra = deepcopy(state()["records"][0])
        extra["period"] = "2019-07"
        extra["locator"] = "TEST:row:4"
        s["records"].append(extra)
    out = execute(s)
    m = out["months"][0]
    assert m["covered"] is False and m["modeled"] is None
    assert out["coverage"]["complete"] is False


@pytest.mark.parametrize(
    "field,value",
    [
        ("currency", "USD"),
        ("unit", "kWh"),
        ("basis", "gross"),
        ("detail", "APE"),
        ("planningConfirmed", False),
        ("role", "invoice"),
        ("subgroup", "A3"),
        ("effective_to", "2019-06-01"),
    ],
)
def test_reference_semantics_are_not_promoted_by_date_alone(field, value):
    s = state()
    s["records"][1][field] = value
    assert execute(s)["cost"] is None


def test_no_normal_assumption_no_money_but_physical_profile():
    out = execute(state(), normalRegime=False)
    assert out["cost"] is None and out["months"][0]["demandKw"] == "270"


def test_duplicates_remain_grouped_uncovered():
    s = state()
    s["records"].append(deepcopy(s["records"][0]))
    out = execute(s)
    assert out["cost"] is None and out["coverage"]["total"] == 2
    assert all("duplicadas" in " ".join(m["reasons"]) for m in out["months"])


def test_equal_contract_spellings_do_not_create_false_ambiguity():
    s = state()
    extra = deepcopy(s["records"][0])
    extra.update(contracted_kw="280.00", period="2019-07", locator="TEST:row:4")
    s["records"].append(extra)
    assert engine.actual_contract(s) == "280"
    assert execute(s)["baselineKw"] == "280"
    s["records"][0]["contracted_kw"] = "280.00"
    assert engine.actual_contract(s) == "280.00"  # retained representation is stable
    extra["contracted_kw"] = "300"
    with pytest.raises(ValueError, match="ambígua"):
        engine.actual_contract(s)


def test_zero_is_not_blank():
    assert execute(state("0"))["cost"] == "4256.00"
    assert execute(state(None))["cost"] is None


@pytest.mark.parametrize(
    "candidate", ["-1", "29", "0", "NaN", "1e3", "1,000", "100001", "280.0000001"]
)
def test_invalid_assumption_rejected(candidate):
    with pytest.raises(ValueError):
        execute(state(), candidate)


def test_reading_interval_cannot_rebind_2019_rule_to_2023():
    s = state(reading_from="2023-01-01", reading_to="2023-02-01", period="2019-03")
    s["records"][1].update(effective_from="2023-01-01", effective_to="2023-12-31")
    assert execute(s)["cost"] is None


@pytest.mark.skipif(
    not PUBLIC.exists(), reason="separate authentic public corpus absent"
)
@pytest.mark.parametrize(
    "scenario", ORACLE["monetary_scenarios"], ids=lambda s: s["candidate_kw"]
)
def test_authentic_parser_matches_independent_months_without_rekeying(scenario):
    p = parse_file(PUBLIC.read_bytes(), "sobral.pdf", inspection=True)
    t = Path(
        r"C:\dev\ariadne-planning-public-evaluation-20261003\source-review\tariff-reference.csv"
    )
    rates = parse_file(t.read_bytes(), "tariffs.csv", inspection=True)[
        "tariffReferences"
    ]
    rows = [
        {**r, "eligible": not r["errors"], "role": "invoice"}
        for r in p["demandProfile"]
    ]
    s = {
        "review": {"scope": "429967"},
        "records": rows
        + [{**r, "planningConfirmed": True, "role": "context"} for r in rates],
    }
    out = execute(s, scenario["candidate_kw"])
    expected = {m["period"]: m for m in scenario["months"]}
    auto = json.loads((Path(__file__).parent / "oracle-auto-expected.json").read_text())
    aggregate = next(
        s
        for s in auto["selected_scenarios"]
        if s["candidate_kw"] == scenario["candidate_kw"]
    )
    assert out["cost"] == aggregate["covered_7_months_subtotal_brl"]
    assert out["delta"] == aggregate["covered_subtotal_minus_baseline_brl"]
    for m in out["months"]:
        if m["covered"]:
            e = expected[m["period"]]
            assert m["modeled"]["total"] == e["modeled_demand_total_brl"]
            assert m["delta"] == e["scenario_minus_baseline_brl"]
    assert out["coverage"]["covered"] == 7
    assert out["coverage"]["physical"] == 9
    assert out["coverage"]["total"] == 12
