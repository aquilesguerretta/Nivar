"""Frozen v0.1.0 executor. Decimal strings are the financial API boundary."""

from __future__ import annotations

import re
from collections import defaultdict
from decimal import Decimal, ROUND_HALF_UP, localcontext

MODEL = "assisted_close"
VERSION = "0.1.0"
IMPLEMENTATION = "ariadne.assisted_close.decimal.v0_1_0"
INPUT_CONTRACT = {
    "observed_state": {"review": "object", "records": "array", "sources": "array"},
    "assumptions": {"policy": "object"},
}
OUTPUT_CONTRACT = {
    "assisted_close": {"items": "array", "coverage": "object", "exclusions": "array"}
}
POLICY = {
    "arithmetic": "decimal",
    "precision": 48,
    "rounding": "ROUND_HALF_UP",
    "currency": "BRL",
    "normalization": "ariadne.tables.v1",
    "quantity_conversion": "1000 kWh = 1 MWh",
}
FIELDS = (
    "item_key",
    "component",
    "scope",
    "period",
    "currency",
    "tax_basis",
    "amount",
    "quantity",
    "quantity_unit",
    "price",
    "price_unit",
    "invoice_id",
    "row_type",
)
EXCLUSIONS = [
    "complex contract flex",
    "CCEE settlement",
    "tax interpretation",
    "complete TUSD/TE validation",
    "penalties",
    "regulatory compliance",
    "invoice total extrapolation",
]
LABELS = {
    "reconciled": "Conciliado no escopo verificado",
    "divergence": "Divergência a investigar",
    "not_verifiable": "Não verificável com os dados/regras disponíveis",
}


def decimal_text(raw, mode="strict"):
    if raw is None or str(raw).strip() == "":
        return None
    value = str(raw).strip()
    if mode not in ("dot", "comma", "strict"):
        raise ValueError("Modo decimal inválido")
    if not re.fullmatch(r"[+-]?\d+(?:[.,]\d+)?", value):
        raise ValueError("Formato numérico inválido; sem milhares/expoentes")
    if mode == "dot" and "," in value or mode == "comma" and "." in value:
        raise ValueError("Separador incompatível com o modo decimal")
    if mode == "strict" and re.search(r"[.,]\d{3}$", value):
        raise ValueError("Número ambíguo; confirme o separador decimal")
    digits = value.lstrip("+-").replace(",", ".")
    fraction = digits.split(".")[1] if "." in digits else ""
    if (
        len(digits.replace(".", "").lstrip("0")) > 18
        or len(fraction) > 6
        or len(value) > 40
    ):
        raise ValueError("Precisão excede 18 dígitos / 6 casas")
    return format(Decimal(value.replace(",", ".")), "f")


def normalize_row(values, *, role, mode, review, locator, numeric_fields=()):
    row = {
        field: (
            str(values.get(field)).strip() if values.get(field) is not None else None
        )
        for field in FIELDS
    }
    errors = []
    for field in ("item_key", "component", "scope", "period"):
        if not row[field]:
            errors.append(f"{field}: obrigatório")
    for field in ("scope", "period"):
        if row[field] != review[field]:
            errors.append(f"{field}: não corresponde à revisão")
    if not re.fullmatch(r"\d{4}-(0[1-9]|1[0-2])", row["period"] or ""):
        errors.append("period: esperado YYYY-MM")
    if role in ("invoice", "price"):
        if row["currency"] != "BRL":
            errors.append("currency: v0 suporta BRL")
        if row["tax_basis"] not in ("inclusive", "exclusive"):
            errors.append("tax_basis: confirme inclusive/exclusive")
    for field in ("amount", "quantity", "price"):
        try:
            row[field] = decimal_text(
                values.get(field), "dot" if field in numeric_fields else mode
            )
        except ValueError as exc:
            row[field] = None
            errors.append(f"{field}: {exc}")
    if row["price"] is not None and Decimal(row["price"]) < 0:
        errors.append("price: preço negativo não suportado; use quantidade assinada")
    row["row_type"] = row["row_type"] or "line"
    if row["row_type"] not in ("line", "subtotal"):
        errors.append("row_type: line/subtotal")
    row.update(
        locator=locator,
        raw=values,
        errors=errors,
        validation="invalid" if errors else "valid",
    )
    return row


def _money(value):
    return format(value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP), ".2f")


def _product(quantity, quantity_unit, price, price_unit):
    if quantity is None or price is None:
        raise ValueError("Quantidade ou preço ausente")
    if quantity_unit not in ("kWh", "MWh") or price_unit not in ("BRL/kWh", "BRL/MWh"):
        raise ValueError("Unidades incompatíveis ou conversão não suportada")
    q, p = Decimal(quantity), Decimal(price)
    if p < 0:
        raise ValueError("Preço negativo não suportado")
    if quantity_unit == "kWh" and price_unit == "BRL/MWh":
        q /= Decimal(1000)
    elif quantity_unit == "MWh" and price_unit == "BRL/kWh":
        q *= Decimal(1000)
    return _money(q * p)


def _check(amount=None, expected=None, reasons=(), calculation=None, refs=()):
    difference = (
        None
        if amount is None or expected is None
        else _money(Decimal(amount) - Decimal(expected))
    )
    classification = (
        "not_verifiable"
        if difference is None
        else ("reconciled" if Decimal(difference) == 0 else "divergence")
    )
    return {
        "classification": classification,
        "label": LABELS[classification],
        "expected": expected,
        "difference": difference,
        "reasons": list(reasons),
        "calculation": calculation,
        "sourceRefs": list(refs),
    }


def _ref(row):
    return {
        "sourceId": row["source_id"],
        "sourceVersion": row["sha256"],
        "confirmationVersionId": row.get("confirmation_version_id"),
        "locator": row["locator"],
        "role": row["role"],
    }


def execute_close(*, state_payload, assumption_values, execution_configuration):
    if execution_configuration != POLICY or assumption_values != {"policy": POLICY}:
        raise ValueError("Assisted close v0.1.0 requires the frozen decimal policy")
    records = state_payload["records"]
    if len(records) > 8000:
        raise ValueError("Limite de registros excedido")
    with localcontext() as ctx:
        ctx.prec = POLICY["precision"]
        groups = defaultdict(lambda: defaultdict(list))
        for row in records:
            key = tuple(
                row.get(f) for f in ("item_key", "component", "scope", "period")
            )
            if row.get("eligible") and row.get("row_type") != "subtotal":
                groups[key][row["role"]].append(row)
        invoices = [r for r in records if r["role"] == "invoice"]
        lines_by_invoice, subtotals_by_invoice = defaultdict(list), defaultdict(list)
        for row in invoices:
            bucket = (
                subtotals_by_invoice
                if row.get("row_type") == "subtotal"
                else lines_by_invoice
            )
            bucket[(row["source_id"], row.get("invoice_id"))].append(row)
        related = [
            {
                "group": " / ".join(str(v or "?") for v in key),
                "sourceRefs": [
                    _ref(r)
                    for role in ("invoice", "quantity", "price")
                    for r in group[role]
                ],
                "reason": "Duplicidade/conflito de item lógico",
            }
            for key, group in groups.items()
            if any(len(group[role]) > 1 for role in ("invoice", "quantity", "price"))
        ]
        items = []
        for row in invoices:
            key = tuple(
                row.get(f) for f in ("item_key", "component", "scope", "period")
            )
            group = groups[key]
            own_ref = _ref(row)
            # Ambiguous groups retain all references once, without quadratic JSON.
            refs = [
                own_ref,
                *[
                    _ref(group[role][0])
                    for role in ("quantity", "price")
                    if len(group[role]) == 1
                ],
            ]
            amount = (
                _money(Decimal(row["amount"]))
                if row.get("amount") is not None and row.get("currency") == "BRL"
                else None
            )
            internal = _check(
                reasons=["Aritmética da linha indisponível"], refs=[own_ref]
            )
            reasons = []
            if row.get("currency") != "BRL":
                reasons.append("Moeda não suportada; valor original preservado")
            if not row.get("eligible"):
                reasons.append("Candidato não confirmado/elegível")
            if row.get("row_type") == "subtotal":
                reasons.append("Subtotal é somente consistência interna")
                invoice_key = (row["source_id"], row.get("invoice_id"))
                lines = lines_by_invoice[invoice_key]
                if len(subtotals_by_invoice[invoice_key]) > 1:
                    internal = _check(
                        reasons=["Subtotais duplicados/ambíguos para a mesma fatura"],
                        refs=[own_ref],
                    )
                elif (
                    row.get("eligible")
                    and row.get("invoice_id")
                    and not row.get("unselected_sheets")
                    and lines
                    and len({r.get("item_key") for r in lines}) == len(lines)
                    and all(
                        r.get("eligible") and r.get("amount") is not None for r in lines
                    )
                ):
                    subtotal = _money(
                        sum(
                            (Decimal(_money(Decimal(r["amount"]))) for r in lines),
                            Decimal(0),
                        )
                    )
                    internal = _check(
                        amount,
                        subtotal,
                        calculation="Σ valores das linhas confirmadas desta fonte/fatura",
                        refs=[
                            own_ref,
                            *[
                                {
                                    "sourceId": r["source_id"],
                                    "locator": r["locator"],
                                    "role": "invoice",
                                }
                                for r in lines
                            ],
                        ],
                    )
            elif row.get("component") != "energy":
                reasons.append("Componente não suportado: NOT VERIFIED")
            elif row.get("eligible"):
                try:
                    expected = _product(
                        row.get("quantity"),
                        row.get("quantity_unit"),
                        row.get("price"),
                        row.get("price_unit"),
                    )
                    internal = _check(
                        amount,
                        expected,
                        calculation="Quantidade × preço da própria fatura; consistência interna",
                        refs=[own_ref],
                    )
                except ValueError as exc:
                    internal = _check(reasons=[str(exc)], refs=[own_ref])
            if any(len(group[role]) > 1 for role in ("invoice", "quantity", "price")):
                reasons.append(
                    "Duplicidade/conflito de item lógico; grupo exige revisão"
                )
            q = group["quantity"][0] if len(group["quantity"]) == 1 else None
            p = group["price"][0] if len(group["price"]) == 1 else None
            if q is None or p is None:
                reasons.append("Quantidade ou preço independente ausente/ambíguo")
            if q and p:
                if len({row["sha256"], q["sha256"], p["sha256"]}) != 3:
                    reasons.append(
                        "Evidência independente requer três fontes distintas"
                    )
                if p.get("currency") != row.get("currency") or p.get(
                    "tax_basis"
                ) != row.get("tax_basis"):
                    reasons.append("Moeda/base tributária incompatível")
            if amount is None:
                reasons.append("Valor faturado ausente")
            independent = _check(reasons=reasons, refs=refs)
            if not reasons:
                try:
                    expected = _product(
                        q.get("quantity"),
                        q.get("quantity_unit"),
                        p.get("price"),
                        p.get("price_unit"),
                    )
                    independent = _check(
                        amount,
                        expected,
                        calculation=f"{q.get('quantity')} {q.get('quantity_unit')} × {p.get('price')} {p.get('price_unit')}; HALF_UP centavos",
                        refs=refs,
                    )
                except ValueError as exc:
                    independent = _check(reasons=[str(exc)], refs=refs)
            items.append(
                {
                    "id": row["record_id"],
                    "group": " / ".join(str(v or "?") for v in key),
                    "itemKey": row.get("item_key"),
                    "component": row.get("component"),
                    "billed": amount,
                    "currency": row.get("currency"),
                    "internal": internal,
                    "independent": independent,
                    "candidate": row,
                }
            )
        # Unassociated inputs and unsupported context stay visible in coverage.
        orphan_refs = [
            {
                "sourceId": r["source_id"],
                "locator": r["locator"],
                "reason": "Sem item faturado elegível correspondente",
            }
            for r in records
            if r["role"] in ("quantity", "price")
            and not groups[
                tuple(r.get(f) for f in ("item_key", "component", "scope", "period"))
            ]["invoice"]
        ]
        covered = [i for i in items if i["independent"]["expected"] is not None]
        return {
            "review": state_payload["review"],
            "ruleVersion": VERSION,
            "policy": POLICY,
            "items": items,
            "relatedGroups": related,
            "coverage": {
                "invoiceItems": len(items),
                "independentlyCovered": len(covered),
                "internalChecks": sum(
                    i["internal"]["expected"] is not None for i in items
                ),
                "notVerified": len(items) - len(covered),
                "orphanInputs": orphan_refs,
                "unreviewedSources": [
                    s["id"]
                    for s in state_payload["sources"]
                    if not s.get("confirmationVersionId")
                    and not s.get("superseded")
                    and s["role"] != "context"
                ],
                "supersededSources": [
                    s["id"] for s in state_payload["sources"] if s.get("superseded")
                ],
                "unselectedSheets": [
                    {"sourceId": s["id"], "sheet": t["name"], "rows": len(t["rows"])}
                    for s in state_payload["sources"]
                    if s.get("confirmation") and not s.get("superseded")
                    for t in s["preview"]["tables"]
                    if t["name"] != s["confirmation"]["sheet"]
                ],
                "contextSources": [
                    s["id"] for s in state_payload["sources"] if s["role"] == "context"
                ],
            },
            "exclusions": EXCLUSIONS,
        }
