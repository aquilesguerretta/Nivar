"""Independent expectations for identity eligibility and excluded periods."""

from copy import deepcopy
from types import SimpleNamespace

import pytest

from app.services import ariadne_planning as service
from app.services import ariadne_planning_engine as historical
from app.services import ariadne_core as core
from tests.ariadne_planning.test_engine import state

VALID_CNPJ = "07047251000170"


def execute(payload, **flags):
    return service.engine.execute_planning(
        state_payload=payload,
        assumption_values={
            "candidateKw": "280",
            "normalRegime": True,
            "tariffApplicability": True,
            **flags,
        },
        execution_configuration=service.engine.POLICY,
    )


@pytest.mark.parametrize(
    "distributor,supplier,covered",
    [
        (None, None, False),
        ("", "", False),
        ("", VALID_CNPJ, False),
        (VALID_CNPJ, "", False),
        (None, VALID_CNPJ, False),
        (VALID_CNPJ, None, False),
        (VALID_CNPJ, "11222333000181", False),
        (VALID_CNPJ, VALID_CNPJ, True),
        ("broken", "broken", False),
        (VALID_CNPJ, "broken", False),
        ("broken", VALID_CNPJ, False),
        ("070472510001", "070472510001", False),
        ("07047251000171", "07047251000171", False),
        ("00000000000000", "00000000000000", False),
        ("07.047.251/0001-70", VALID_CNPJ, True),
        (VALID_CNPJ, "07.047.251/0001-70", True),
    ],
)
def test_identity_is_required_for_money_independently_of_physical_coverage(
    distributor, supplier, covered
):
    payload = state()
    demand, tariff = payload["records"]
    demand.update(distributor_cnpj=distributor, raw={"distributor_cnpj": distributor})
    tariff.update(supplier_cnpj=supplier, raw={"supplier_cnpj": supplier})
    frozen = deepcopy(payload)
    output = execute(payload)
    month = output["months"][0]
    assert output["coverage"] == {
        "physical": 1,
        "covered": int(covered),
        "total": 1,
        "complete": covered,
    }
    assert month["physicalCovered"] is True
    assert month["covered"] is covered
    assert month["raw"] == demand["raw"]
    assert month["sourceRef"]["sourceId"] == demand["source_id"]
    assert payload == frozen
    if covered:
        assert output["cost"] == "4256.00"
        assert output["baselineCost"] == "4256.00"
        assert output["delta"] == "0.00"
        assert month["reasons"] == []
    else:
        assert output["cost"] is None
        assert output["baselineCost"] is None
        assert output["delta"] is None
        assert month["modeled"] is None and month["baseline"] is None
        assert any("identidade" in reason.lower() for reason in month["reasons"])


def test_identity_cannot_be_borrowed_from_a_neighboring_month():
    payload = state()
    unknown = deepcopy(payload["records"][0])
    unknown.update(
        period="2019-07",
        distributor_cnpj=None,
        locator="TEST:row:4",
        raw={"period": "2019-07", "distributor_cnpj": ""},
    )
    payload["records"].append(unknown)
    output = execute(payload)
    assert output["coverage"] == {
        "physical": 2,
        "covered": 1,
        "total": 2,
        "complete": False,
    }
    assert output["cost"] == "4256.00"
    assert output["months"][1]["modeled"] is None
    assert output["months"][1]["sourceRef"]["locator"] == "TEST:row:4"


@pytest.mark.parametrize("period", ["2019-13", None, ""])
@pytest.mark.parametrize("excluded", [True, False])
@pytest.mark.parametrize("reverse", [True, False])
def test_invalid_period_is_local_and_retained_in_coverage(period, excluded, reverse):
    payload = state()
    invalid = deepcopy(payload["records"][0])
    invalid.update(
        period=period,
        eligible=not excluded,
        errors=["Referência mensal ausente/ambígua"] if excluded else [],
        locator="TEST:row:4",
        raw={"period": period, "demand_kw": "270"},
    )
    payload["records"].append(invalid)
    if reverse:
        payload["records"].reverse()
    frozen = deepcopy(payload)
    output = execute(payload)
    assert output["coverage"] == {
        "physical": 1,
        "covered": 1,
        "total": 2,
        "complete": False,
    }
    assert output["cost"] == "4256.00"
    valid = next(m for m in output["months"] if m["period"] == "2019-06")
    rejected = next(
        m for m in output["months"] if m["sourceRef"]["locator"] == "TEST:row:4"
    )
    assert valid["modeled"]["total"] == "4256.00"
    assert rejected["period"] is None
    assert rejected["covered"] is False and rejected["physicalCovered"] is False
    assert rejected["modeled"] is None and rejected["baseline"] is None
    assert rejected["raw"] == invalid["raw"]
    assert any("mensal" in reason.lower() for reason in rejected["reasons"])
    assert set(invalid["errors"]) <= set(rejected["reasons"])
    assert payload == frozen


def test_duplicate_valid_periods_still_exclude_both_observations():
    payload = state()
    duplicate = deepcopy(payload["records"][0])
    duplicate.update(locator="TEST:row:4")
    payload["records"].append(duplicate)
    output = execute(payload)
    assert output["coverage"] == {
        "physical": 0,
        "covered": 0,
        "total": 2,
        "complete": False,
    }
    assert output["cost"] is None
    assert all("duplicadas" in " ".join(m["reasons"]) for m in output["months"])


@pytest.mark.parametrize("no_rows", [False, True])
def test_truly_unusable_baseline_still_fails_closed(no_rows):
    payload = state()
    if no_rows:
        payload["records"] = []
    else:
        payload["records"][0].update(
            period="2019-13", eligible=False, errors=["Referência mensal inválida"]
        )
    with pytest.raises(ValueError):
        execute(payload)


def test_all_invalid_periods_cannot_produce_physical_or_money_coverage():
    payload = state(period="2019-13")  # even a purported confirmation is insufficient
    with pytest.raises(
        ValueError, match="Demanda contratada observada ausente/ambígua"
    ):
        execute(payload)


@pytest.mark.parametrize("contract", [None, "300"])
def test_invalid_period_cannot_contaminate_valid_observed_contract(contract):
    payload = state()
    invalid = deepcopy(payload["records"][0])
    invalid.update(period="2019-13", contracted_kw=contract, locator="TEST:row:4")
    payload["records"].append(invalid)
    output = execute(payload)
    assert output["baselineKw"] == "280"
    assert output["cost"] == "4256.00"
    assert output["coverage"] == {
        "physical": 1,
        "covered": 1,
        "total": 2,
        "complete": False,
    }


def test_invalid_period_does_not_weaken_duplicate_or_contract_conflict_guards():
    payload = state()
    duplicate = deepcopy(payload["records"][0])
    duplicate["locator"] = "TEST:row:4"
    invalid = deepcopy(duplicate)
    invalid.update(
        period="2019-13",
        eligible=False,
        errors=["Invalid period"],
        locator="TEST:row:5",
    )
    payload["records"].extend([duplicate, invalid])
    output = execute(payload)
    assert output["coverage"] == {
        "physical": 0,
        "covered": 0,
        "total": 3,
        "complete": False,
    }
    assert output["cost"] is None
    duplicate.update(period="2019-07", contracted_kw="300")
    with pytest.raises(ValueError, match="ambígua"):
        execute(payload)


def dispatch(executor, payload, **metadata):
    return core._execute_model_version(
        model_definition=SimpleNamespace(name=executor.MODEL),
        model_version=SimpleNamespace(
            **{
                "semantic_version": executor.VERSION,
                "implementation_identity": executor.IMPLEMENTATION,
                "input_contract": executor.INPUT_CONTRACT,
                "output_contract": executor.OUTPUT_CONTRACT,
                **metadata,
            }
        ),
        state_version=SimpleNamespace(payload=payload),
        assumption_version=SimpleNamespace(
            values={
                "candidateKw": "280",
                "normalRegime": True,
                "tariffApplicability": True,
            }
        ),
        configuration=executor.POLICY,
    )


def test_exact_version_dispatch_preserves_historical_defect_without_new_writes_using_it():
    payload = state(distributor_cnpj="")
    payload["records"][1]["supplier_cnpj"] = ""
    old = dispatch(historical, payload)
    new = dispatch(service.engine, payload)
    assert old["version"] == "0.1.0" and old["cost"] == "4256.00"
    assert old["coverage"]["complete"] is True
    assert new["version"] == "0.1.1" and new["cost"] is None
    assert new["coverage"] == {
        "physical": 1,
        "covered": 0,
        "total": 1,
        "complete": False,
    }


@pytest.mark.parametrize("executor", [historical, service.engine])
@pytest.mark.parametrize(
    "metadata",
    [
        {"semantic_version": "0.1.2"},
        {"implementation_identity": "unknown"},
        {"input_contract": {}},
        {"output_contract": {}},
    ],
)
def test_unknown_or_inconsistent_frozen_metadata_cannot_fall_through(
    executor, metadata
):
    with pytest.raises(ValueError, match="exact demand planning metadata"):
        dispatch(executor, state(), **metadata)
