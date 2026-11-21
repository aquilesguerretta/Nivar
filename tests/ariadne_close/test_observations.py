from copy import deepcopy
from app.services import ariadne_close_engine_v2 as engine


def observed(index, amount, operation=None, operands=(), **extra):
    return {
        "index": index,
        "amount": amount,
        "operation": operation,
        "operands": list(operands),
        "recordKind": "invoice_observation",
        "source_id": "invoice-source",
        "sha256": "hash",
        "record_id": f"row{index}",
        "locator": f"page:1/text:{index}",
        "role": "invoice",
        "invoice_id": "test",
        "eligible": True,
        "errors": [],
        "label": f"row {index}",
        **extra,
    }


def execute(rows):
    return engine.execute_close(
        state_payload={
            "review": {"scope": "unit", "period": "2021-09"},
            "sources": [],
            "records": rows,
        },
        assumption_values={"policy": engine.POLICY},
        execution_configuration=engine.POLICY,
    )


def test_internal_observations_never_become_independent():
    rows = [
        observed(1, "76.73"),
        observed(
            2,
            "13.35",
            "product",
            quantity="100.000",
            quantity_unit="kWh",
            price="0.13350",
            price_unit="BRL/kWh",
        ),
        observed(3, "4.89"),
        observed(4, "94.97", "sum", [1, 2, 3]),
        observed(5, "-3.54"),
        observed(6, "-3.54", "sum", [5]),
        observed(7, "91.43", "sum", [4, 6]),
    ]
    result = execute(rows)
    assert result["coverage"]["internalChecks"] == 4
    assert result["coverage"]["independentlyCovered"] == 0
    assert all(
        i["independent"]["classification"] == "not_verifiable" for i in result["items"]
    )
    assert [i["internal"]["expected"] for i in result["items"]] == [
        None,
        "13.35",
        None,
        "94.97",
        None,
        "-3.54",
        "91.43",
    ]
    assert result["items"][-1]["internal"]["difference"] == "0.00"


def test_partial_confirmation_cannot_prove_total():
    rows = [observed(1, "5", eligible=False), observed(2, "5", "sum", [1])]
    assert execute(rows)["items"][1]["internal"]["expected"] is None


def test_transitive_unconfirmed_credit_blocks_total():
    rows = [
        observed(1, "-3.54", eligible=False),
        observed(2, "-3.54", "sum", [1]),
        observed(3, "-3.54", "sum", [2]),
    ]
    assert execute(rows)["items"][-1]["internal"]["expected"] is None


def test_duplicate_invoice_is_visible_and_not_picked():
    row = observed(
        1,
        "5",
        "product",
        quantity="5",
        quantity_unit="kWh",
        price="1",
        price_unit="BRL/kWh",
    )
    duplicate = deepcopy(row)
    duplicate.update(source_id="other", record_id="other")
    assert all(
        i["internal"]["expected"] is None for i in execute([row, duplicate])["items"]
    )
