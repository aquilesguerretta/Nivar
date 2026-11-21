import copy
import json
from pathlib import Path
import pytest
from app.services.ariadne_close_engine import (
    execute_close,
    decimal_text,
    normalize_row,
    POLICY,
)

EXPECTED = json.loads((Path(__file__).parent / "fixtures/expected.json").read_text())


def graph(case):
    # Expected answers are literal corpus values, never calculated by this helper.
    base = {
        "item_key": "sample",
        "component": case.get("component", "energy"),
        "scope": "SYNTHETIC-UNIT",
        "period": "2026-09",
        "currency": "BRL",
        "tax_basis": "exclusive",
        "row_type": "line",
        "eligible": True,
        "errors": [],
        "locator": "CSV:row:2",
    }
    invoice = {
        **base,
        "record_id": "invoice:2",
        "source_id": "invoice",
        "sha256": "invoice-hash",
        "role": "invoice",
        "amount": case["amount"],
        "quantity": case["quantity"],
        "quantity_unit": case["quantity_unit"],
        "price": case["price"],
        "price_unit": case["price_unit"],
    }
    quantity = {
        **base,
        "source_id": "quantity",
        "sha256": "quantity-hash",
        "role": "quantity",
        "quantity": case["quantity"],
        "quantity_unit": case["quantity_unit"],
    }
    price = {
        **base,
        "source_id": "price",
        "sha256": "price-hash",
        "role": "price",
        "price": case["price"],
        "price_unit": case["price_unit"],
    }
    return {
        "review": {"scope": base["scope"], "period": base["period"]},
        "records": [invoice, quantity, price],
        "sources": [],
    }


def execute(state):
    return execute_close(
        state_payload=state,
        assumption_values={"policy": POLICY},
        execution_configuration=POLICY,
    )


@pytest.mark.parametrize("name", list(EXPECTED))
def test_independent_golden_engineering_answers(name):
    answer = EXPECTED[name]
    output = execute(graph(answer))["items"][0]["independent"]
    assert {k: output[k] for k in ("expected", "difference", "classification")} == {
        k: answer[k] for k in ("expected", "difference", "classification")
    }


@pytest.mark.parametrize(
    "raw,mode,answer",
    [
        (None, "strict", None),
        ("", "strict", None),
        ("0", "strict", "0"),
        ("250,50", "comma", "250.50"),
        ("1000.000", "dot", "1000.000"),
        ("-0.005", "dot", "-0.005"),
    ],
)
def test_decimal_inputs(raw, mode, answer):
    assert decimal_text(raw, mode) == answer


@pytest.mark.parametrize(
    "raw,mode",
    [
        ("1,000", "strict"),
        ("1.000", "strict"),
        ("1.234,56", "comma"),
        ("1e6", "dot"),
        ("NaN", "dot"),
        ("=1+1", "dot"),
        ("250,50", "dot"),
        ("0.0000001", "dot"),
        ("9999999999999999999", "dot"),
    ],
)
def test_ambiguous_and_active_values_rejected(raw, mode):
    with pytest.raises(ValueError):
        decimal_text(raw, mode)


def test_invoice_alone_only_internal():
    state = graph(EXPECTED["mandatory"])
    state["records"] = state["records"][:1]
    item = execute(state)["items"][0]
    assert item["internal"]["difference"] == "1000.00"
    assert item["independent"]["expected"] is None


@pytest.mark.parametrize("unit", ["kW", "MWmed", "MW"])
def test_dimensions_do_not_convert(unit):
    state = graph(EXPECTED["mandatory"])
    state["records"][1]["quantity_unit"] = unit
    assert (
        execute(state)["items"][0]["independent"]["classification"] == "not_verifiable"
    )


def test_reverse_conversion_credit_rounding():
    case = {
        **EXPECTED["credit"],
        "quantity": "-2",
        "quantity_unit": "MWh",
        "price": "0.25",
        "price_unit": "BRL/kWh",
    }
    assert execute(graph(case))["items"][0]["independent"]["expected"] == "-500.00"


@pytest.mark.parametrize(
    "mutation",
    [
        "quantity_missing",
        "price_missing",
        "same_hash",
        "duplicate_quantity",
        "duplicate_invoice",
        "currency",
        "tax_basis",
        "period",
        "scope",
    ],
)
def test_missing_ambiguous_or_incompatible_evidence(mutation):
    state = graph(EXPECTED["mandatory"])
    if mutation == "quantity_missing":
        state["records"].pop(1)
    elif mutation == "price_missing":
        state["records"].pop(2)
    elif mutation == "same_hash":
        state["records"][1]["sha256"] = state["records"][0]["sha256"]
    elif mutation.startswith("duplicate"):
        state["records"].append(
            copy.deepcopy(
                state["records"][1 if mutation == "duplicate_quantity" else 0]
            )
        )
    elif mutation in ("period", "scope"):
        state["records"][1][mutation] = "foreign"
    else:
        state["records"][2][mutation] = "different"
    output = execute(state)
    assert output["items"][0]["independent"]["expected"] is None
    assert output["coverage"]["independentlyCovered"] == 0


def test_scope_period_validated_before_confirmation():
    values = {
        "item_key": "a",
        "component": "energy",
        "scope": "wrong",
        "period": "2026-13",
        "currency": "BRL",
        "tax_basis": "exclusive",
    }
    row = normalize_row(
        values,
        role="invoice",
        mode="strict",
        review={"scope": "unit", "period": "2026-09"},
        locator="row:2",
    )
    assert row["validation"] == "invalid" and len(row["errors"]) == 3
    assert row["amount"] is None


def test_subtotal_complete_only_and_no_independent_total():
    state = graph(EXPECTED["mandatory"])
    state["records"][0]["invoice_id"] = "invoice-A"
    subtotal = {
        **state["records"][0],
        "record_id": "subtotal",
        "row_type": "subtotal",
        "item_key": "total",
        "amount": "26000",
    }
    state["records"].append(subtotal)
    item = execute(state)["items"][1]
    assert (
        item["internal"]["expected"] == "26000.00"
        and item["independent"]["expected"] is None
    )
    state["records"][0]["eligible"] = False
    assert execute(state)["items"][1]["internal"]["expected"] is None


def test_policy_drift_rejected():
    with pytest.raises(ValueError):
        execute_close(
            state_payload=graph(EXPECTED["mandatory"]),
            assumption_values={"policy": {}},
            execution_configuration=POLICY,
        )


def test_subtotal_uses_rounded_line_amounts():
    state = graph(EXPECTED["mandatory"])
    line = state["records"][0]
    line.update(amount="0.005", invoice_id="rounding")
    second = {**line, "record_id": "second", "item_key": "second"}
    subtotal = {
        **line,
        "record_id": "subtotal",
        "item_key": "total",
        "row_type": "subtotal",
        "amount": "0.02",
    }
    state["records"].extend([second, subtotal])
    assert execute(state)["items"][-1]["internal"]["expected"] == "0.02"


def test_eight_thousand_duplicate_records_have_linear_reference_output():
    state = graph(EXPECTED["mandatory"])
    invoice, quantity, price = state["records"]
    state["records"] = (
        [
            {**invoice, "record_id": f"invoice:{i}", "locator": f"row:{i}"}
            for i in range(4000)
        ]
        + [{**quantity, "locator": f"quantity:{i}"} for i in range(2000)]
        + [{**price, "locator": f"price:{i}"} for i in range(2000)]
    )
    output = execute(state)
    assert output["coverage"]["independentlyCovered"] == 0
    assert (
        len(output["relatedGroups"]) == 1
        and len(output["relatedGroups"][0]["sourceRefs"]) == 8000
    )
    assert (
        sum(len(item["independent"]["sourceRefs"]) for item in output["items"]) == 4000
    )
    assert len(json.dumps(output)) < 8 * 1024 * 1024


def test_repeated_subtotals_are_ambiguous_without_quadratic_lineage():
    state = graph(EXPECTED["mandatory"])
    invoice = state["records"][0]
    lines = [
        {
            **invoice,
            "item_key": f"line-{i}",
            "record_id": f"line:{i}",
            "invoice_id": "same",
        }
        for i in range(1000)
    ]
    subtotals = [
        {
            **invoice,
            "row_type": "subtotal",
            "item_key": f"total-{i}",
            "record_id": f"total:{i}",
            "invoice_id": "same",
        }
        for i in range(1000)
    ]
    state["records"] = lines + subtotals
    output = execute(state)
    assert all(
        item["internal"]["expected"] is None
        and "Subtotais duplicados" in item["internal"]["reasons"][0]
        for item in output["items"][1000:]
    )
    assert sum(len(item["internal"]["sourceRefs"]) for item in output["items"]) == 2000


def test_unsupported_currency_never_becomes_canonical_brl():
    state = graph(EXPECTED["mandatory"])
    state["records"][0].update(currency="USD", eligible=False)
    item = execute(state)["items"][0]
    assert item["billed"] is None and item["currency"] == "USD"
    assert item["candidate"]["amount"] == "26000"
    assert item["independent"]["expected"] is None
