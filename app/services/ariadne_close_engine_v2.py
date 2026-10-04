"""Exact v0.2 executor: confirmed native observations, no new tariff/tax policy."""

from copy import deepcopy
from decimal import Decimal, localcontext
from app.services import ariadne_close_engine as v1

MODEL = v1.MODEL
VERSION = "0.2.0"
IMPLEMENTATION = "ariadne.assisted_close.observations.v0_2_0"
INPUT_CONTRACT = deepcopy(v1.INPUT_CONTRACT)
INPUT_CONTRACT["observed_state"][
    "records"
] = "array including reviewed invoice observations"
OUTPUT_CONTRACT = deepcopy(v1.OUTPUT_CONTRACT)
POLICY = {
    **v1.POLICY,
    "normalization": "ariadne.inspect.v2",
    "invoice_observations": "enel_ce_b3_native.v1",
    "unknown_tax_basis": "internal-only",
    "observation_product": "displayed factors only; no dimensional inference",
}


def execute_close(*, state_payload, assumption_values, execution_configuration):
    if execution_configuration != POLICY or assumption_values != {"policy": POLICY}:
        raise ValueError("Assisted close v0.2.0 requires the frozen observation policy")
    records = state_payload["records"]
    if len(records) > 8000:
        raise ValueError("Limite de registros excedido")
    legacy = {
        **state_payload,
        "records": [r for r in records if r.get("recordKind") != "invoice_observation"],
    }
    output = v1.execute_close(
        state_payload=legacy,
        assumption_values={"policy": v1.POLICY},
        execution_configuration=v1.POLICY,
    )
    observed = [r for r in records if r.get("recordKind") == "invoice_observation"]
    groups = {}
    for row in observed:
        groups.setdefault(row["invoice_id"], set()).add(row["source_id"])

    def complete(row, seen=frozenset()):
        identity = (row["source_id"], row["index"])
        if identity in seen or not row.get("eligible") or row.get("errors"):
            return False
        if row["operation"] != "sum":
            return True
        operands = [
            r
            for r in observed
            if r["source_id"] == row["source_id"] and r["index"] in row["operands"]
        ]
        return (
            bool(operands)
            and len(operands) == len(row["operands"])
            and all(complete(r, seen | {identity}) for r in operands)
        )

    with localcontext() as ctx:
        ctx.prec = POLICY["precision"]
        for row in observed:
            ref = v1._ref(row)
            expected, formula = None, None
            reasons, refs = [], [ref]
            if len(groups[row["invoice_id"]]) != 1:
                reasons.append(
                    "Faturas com identidade repetida/conflitante; associação precisa de revisão"
                )
            elif not row.get("eligible"):
                reasons.append("Observação não confirmada")
            elif row.get("errors"):
                reasons.extend(row["errors"])
            elif row["operation"] == "product":
                expected = v1._money(Decimal(row["quantity"]) * Decimal(row["price"]))
                formula = f"{row['quantity']} × {row['price']} (fatores exibidos; unidades da linha não estabelecidas)"
            elif row["operation"] == "sum":
                operands = [
                    r
                    for r in observed
                    if r["source_id"] == row["source_id"]
                    and r["index"] in row["operands"]
                ]
                refs.extend(v1._ref(r) for r in operands)
                if complete(row):
                    expected = v1._money(
                        sum((Decimal(r["amount"]) for r in operands), Decimal(0))
                    )
                    formula = " + ".join(r["amount"] for r in operands)
                else:
                    reasons.append(
                        "Operandos ausentes/não confirmados; subtotal/total não verificado"
                    )
            else:
                reasons.append(
                    "Valor observado; sem regra de valor esperado implementada"
                )
            independent = v1._check(
                reasons=[
                    "Sem quantidade independente e preço semanticamente comparável",
                    "Base tributária desconhecida; ANEEL é contexto, não preço confirmado",
                    "Método de disponibilidade, bandeira, descontos e tributos fora do escopo",
                ],
                refs=[ref],
            )
            internal = v1._check(
                row["amount"], expected, reasons=reasons, calculation=formula, refs=refs
            )
            output["items"].append(
                {
                    "id": row["record_id"],
                    "group": row["label"],
                    "itemKey": row["label"],
                    "component": "invoice_observation",
                    "billed": row["amount"],
                    "currency": "BRL",
                    "internal": internal,
                    "independent": independent,
                    "candidate": row,
                }
            )
    output.update(ruleVersion=VERSION, policy=POLICY)
    coverage = output["coverage"]
    coverage.update(
        invoiceItems=len(output["items"]),
        internalChecks=sum(
            i["internal"]["expected"] is not None for i in output["items"]
        ),
        notVerified=len(output["items"]) - coverage["independentlyCovered"],
        inspectedExclusions=[
            {
                "sourceId": s["id"],
                "warnings": s["preview"].get("warnings", []),
                "unselectedRegions": [
                    t["name"]
                    for t in s["preview"]["tables"]
                    if not s.get("confirmation")
                    or t["name"] != s["confirmation"]["sheet"]
                ],
            }
            for s in state_payload["sources"]
        ],
    )
    return output
