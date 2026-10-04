"""Independent review oracle. Copied functions, unchanged, from the separate source/rule review; no application imports. See oracle.md for provenance and full outside-only generator."""
from __future__ import annotations
import re
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP, localcontext
from typing import Any
CENT = Decimal("0.01")

class Uncovered(ValueError):
    pass


def exact(value: Any, *, nonnegative: bool = True) -> Decimal:
    if not isinstance(value, str) or not value.strip():
        raise Uncovered("missing_or_nonstring_decimal")
    if not re.fullmatch(r"-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?", value):
        raise Uncovered("invalid_or_ambiguous_decimal")
    try:
        number = Decimal(value)
    except InvalidOperation as exc:
        raise Uncovered("invalid_decimal") from exc
    if not number.is_finite() or (nonnegative and number < 0):
        raise Uncovered("negative_or_nonfinite_decimal")
    return number


def money(value: Decimal) -> str:
    return str(value.quantize(CENT, rounding=ROUND_HALF_UP))


def modeled_month(measured: Any, candidate: Any, tariff: Any, *,
                  unit: str = "kW", price_unit: str = "BRL/kW",
                  currency: str = "BRL", basis: str = "PRE_TAX",
                  modality: str = "A4_VERDE", normal_policy: bool = True,
                  component: str = "active_demand", matching_scope: bool = True,
                  matching_period: bool = True, rate_covered: bool = True) -> dict[str, Any]:
    """Independent formula in the authority contract, with explicit exclusions."""
    try:
        if component != "active_demand":
            raise Uncovered("unsupported_component_or_credit")
        if unit != "kW" or price_unit != "BRL/kW":
            raise Uncovered("unsupported_dimension")
        if currency != "BRL" or basis not in {"PRE_TAX", "PRE_TAX_REFERENCE"}:
            raise Uncovered("incompatible_monetary_basis")
        if modality != "A4_VERDE":
            raise Uncovered("unsupported_modality")
        if not normal_policy:
            raise Uncovered("normal_regime_assumption_not_confirmed")
        if not matching_scope or not matching_period:
            raise Uncovered("ambiguous_scope_or_period")
        if not rate_covered:
            raise Uncovered("missing_or_crossing_tariff_coverage")
        m, c, t = exact(measured), exact(candidate), exact(tariff)
        if c < Decimal("30"):
            raise Uncovered("candidate_below_supported_normal_minimum")
        if t <= 0:
            raise Uncovered("nonpositive_price")
        with localcontext() as context:
            context.prec = 64
            threshold = c * Decimal("1.05")
            trigger = m > threshold
            billable = max(c, m)
            overrun_kw = m - c if trigger else Decimal("0")
            regular = (billable * t).quantize(CENT, rounding=ROUND_HALF_UP)
            overrun = (overrun_kw * Decimal("2") * t).quantize(CENT, rounding=ROUND_HALF_UP)
            exposure = max(c - m, Decimal("0")) * t
            return {
                "covered": True,
                "measured_kw": str(m), "candidate_kw": str(c),
                "tariff_brl_per_kw": str(t), "threshold_kw": str(threshold),
                "billable_kw": str(billable), "overrun_trigger": trigger,
                "overrun_kw": str(overrun_kw),
                "regular_brl": str(regular), "overrun_brl": str(overrun),
                "modeled_demand_total_brl": str(regular + overrun),
                "unused_contracted_exposure_brl": money(exposure),
            }
    except Uncovered as exc:
        return {"covered": False, "reason": str(exc), "modeled_demand_total_brl": None}


def synthetic_cases() -> list[dict[str, Any]]:
    cases: list[tuple[str, dict[str, Any], dict[str, Any]]] = [
        ("below_contract", {"measured": "270", "candidate": "280", "tariff": "15.20"},
         {"covered": True, "regular_brl": "4256.00", "overrun_brl": "0.00", "modeled_demand_total_brl": "4256.00", "overrun_trigger": False, "unused_contracted_exposure_brl": "152.00"}),
        ("above_contract_below_boundary", {"measured": "282.24", "candidate": "280", "tariff": "15.20"},
         {"covered": True, "regular_brl": "4290.05", "overrun_brl": "0.00", "modeled_demand_total_brl": "4290.05", "overrun_trigger": False}),
        ("strict_exact_boundary", {"measured": "294", "candidate": "280", "tariff": "15.20"},
         {"covered": True, "regular_brl": "4468.80", "overrun_brl": "0.00", "modeled_demand_total_brl": "4468.80", "overrun_trigger": False}),
        ("strict_just_above_boundary", {"measured": "294.001", "candidate": "280", "tariff": "15.20"},
         {"covered": True, "regular_brl": "4468.82", "overrun_brl": "425.63", "modeled_demand_total_brl": "4894.45", "overrun_trigger": True, "overrun_kw": "14.001"}),
        ("lower_candidate_overrun", {"measured": "284.40", "candidate": "270", "tariff": "15.20"},
         {"covered": True, "regular_brl": "4322.88", "overrun_brl": "437.76", "modeled_demand_total_brl": "4760.64", "overrun_trigger": True}),
        ("higher_candidate_without_overrun", {"measured": "300.96", "candidate": "300", "tariff": "15.20"},
         {"covered": True, "regular_brl": "4574.59", "overrun_brl": "0.00", "modeled_demand_total_brl": "4574.59", "overrun_trigger": False}),
        ("explicit_zero_quantity", {"measured": "0", "candidate": "280", "tariff": "15.20"},
         {"covered": True, "modeled_demand_total_brl": "4256.00", "overrun_trigger": False}),
        ("component_rounding_not_total_rounding", {"measured": "60", "candidate": "50", "tariff": "0.00025"},
         {"covered": True, "regular_brl": "0.02", "overrun_brl": "0.01", "modeled_demand_total_brl": "0.03", "overrun_trigger": True}),
        ("old_tariff", {"measured": "280", "candidate": "280", "tariff": "13.59"},
         {"covered": True, "modeled_demand_total_brl": "3805.20"}),
        ("new_tariff_same_quantity", {"measured": "280", "candidate": "280", "tariff": "15.20"},
         {"covered": True, "modeled_demand_total_brl": "4256.00"}),
        ("february_boundary_candidate_280_45", {"measured": "294.48", "candidate": "280.45", "tariff": "15.20"},
         {"covered": True, "threshold_kw": "294.4725", "regular_brl": "4476.10", "overrun_brl": "426.51", "modeled_demand_total_brl": "4902.61", "overrun_trigger": True, "overrun_kw": "14.03"}),
        ("february_boundary_candidate_280_46", {"measured": "294.48", "candidate": "280.46", "tariff": "15.20"},
         {"covered": True, "threshold_kw": "294.4830", "regular_brl": "4476.10", "overrun_brl": "0.00", "modeled_demand_total_brl": "4476.10", "overrun_trigger": False}),
    ]
    invalid = [
        ("missing_quantity", {"measured": None}, "missing_or_nonstring_decimal"),
        ("blank_quantity_not_zero", {"measured": ""}, "missing_or_nonstring_decimal"),
        ("nan_quantity", {"measured": "NaN"}, "invalid_or_ambiguous_decimal"),
        ("negative_quantity", {"measured": "-1"}, "negative_or_nonfinite_decimal"),
        ("browser_float_input", {"measured": 294.001}, "missing_or_nonstring_decimal"),
        ("comma_decimal_unreviewed", {"measured": "294,001"}, "invalid_or_ambiguous_decimal"),
        ("ambiguous_thousands_unreviewed", {"measured": "1.000,00"}, "invalid_or_ambiguous_decimal"),
        ("missing_tariff", {"tariff": None}, "missing_or_nonstring_decimal"),
        ("zero_tariff", {"tariff": "0"}, "nonpositive_price"),
        ("candidate_below_minimum", {"candidate": "29.99"}, "candidate_below_supported_normal_minimum"),
        ("kwh_not_demand_kw", {"unit": "kWh"}, "unsupported_dimension"),
        ("mwmed_not_demand_kw", {"unit": "MWmed"}, "unsupported_dimension"),
        ("rate_brl_mwh_not_brl_kw", {"price_unit": "BRL/MWh"}, "unsupported_dimension"),
        ("currency_mismatch", {"currency": "USD"}, "incompatible_monetary_basis"),
        ("tax_inclusive_basis", {"basis": "TAX_INCLUSIVE"}, "incompatible_monetary_basis"),
        ("blue_modality_excluded", {"modality": "A4_AZUL"}, "unsupported_modality"),
        ("seasonal_or_unknown_normal_status", {"normal_policy": False}, "normal_regime_assumption_not_confirmed"),
        ("ambiguous_scope", {"matching_scope": False}, "ambiguous_scope_or_period"),
        ("ambiguous_period", {"matching_period": False}, "ambiguous_scope_or_period"),
        ("crossing_tariff_without_day_allocation", {"rate_covered": False}, "missing_or_crossing_tariff_coverage"),
        ("unsupported_reactive_charge", {"component": "reactive_demand"}, "unsupported_component_or_credit"),
        ("credit_not_inverted_into_demand_cost", {"component": "credit"}, "unsupported_component_or_credit"),
    ]
    default = {"measured": "270", "candidate": "280", "tariff": "15.20"}
    for name, override, reason in invalid:
        cases.append((name, default | override, {"covered": False, "reason": reason, "modeled_demand_total_brl": None}))
    frozen = []
    for name, inputs, expected in cases:
        actual = modeled_month(**inputs)
        for key, value in expected.items():
            assert actual.get(key) == value, (name, key, actual.get(key), value)
        frozen.append({"id": name, "synthetic": True, "inputs": inputs, "expected": actual, "manually_independent_assertions": expected})
    return frozen


if __name__ == "__main__":
    cases = synthetic_cases()
    print(f"Independent hand assertions passed: {len(cases)} cases")
