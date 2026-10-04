"""Frozen historical screening. Decimal outputs; no invoice/tax reconstruction."""

import re
from datetime import date
from decimal import Decimal, localcontext, ROUND_HALF_UP

MODEL = "demand_contract_screening"
VERSION = "0.1.0"
IMPLEMENTATION = "ariadne.plan.demand_contract_screening.v0_1_0"
INPUT_CONTRACT = {
    "observed_state": "exact reviewed Close state, demand facts and tariff references",
    "assumptions": "candidateKw decimal string; normalRegime and tariffApplicability acknowledgements",
}
OUTPUT_CONTRACT = {
    "demand_contract_screening": "physical monthly profile, partial tariff-only cost, evidence and coverage"
}
POLICY = {
    "precision": 48,
    "rounding": "HALF_UP cents per regular/overrun component",
    "quantity": "kW cycle maximum, no dimensional conversion",
    "currency": "BRL",
    "basis": "PRE_TAX_REFERENCE",
    "tolerance": "1.05",
    "overrunMultiplier": "2",
    "rule": "REN414 art93/104; REN418/479; green art56; REN714 minimum30kW",
    "ruleFrom": "2019-03",
    "ruleTo": "2020-02",
    "authorityVersion": "ren414-normal-green-reviewed-v1",
    "authorityHash": "9f1af3e0b0d99364e06da989838af8608ba137497ea940fba60806c06b0ac1df",
    "authorityUrl": "https://www.gov.br/mme/pt-br/arquivos/do-12-04-2012-s1.pdf",
    "tariffPolicy": "whole reading interval; no crossing-rate allocation",
    "scope": "historical counterfactual; normal nonrural/nonseasonal/nontest assumption; no recommendation",
}


def decimal(value, *, positive=False):
    if (
        not isinstance(value, str)
        or not re.fullmatch(r"\d+(?:\.\d{1,6})?", value)
        or len(value) > 16
    ):
        raise ValueError("Valor decimal exato inválido")
    n = Decimal(value)
    if n > 100000 or (positive and n <= 0):
        raise ValueError("Valor fora do limite")
    return n


def money(n):
    return format(n.quantize(Decimal(".01"), rounding=ROUND_HALF_UP), "f")


def ref(row):
    return {
        "sourceId": row.get("source_id"),
        "sourceVersion": row.get("sha256"),
        "confirmationVersionId": row.get("confirmation_version_id"),
        "locator": row["locator"],
        "page": row.get("page"),
        "fieldRefs": row.get("fieldRefs", {}),
    }


def facts(state):
    rows = [r for r in state["records"] if r.get("recordKind") == "demand_fact"]
    if not rows or len(rows) > 60:
        raise ValueError("Baseline exige 1–60 observações mensais de demanda revisadas")
    return rows


def actual_contract(state):
    values = [
        r.get("contracted_kw")
        for r in facts(state)
        if r.get("eligible") and not r.get("errors")
    ]
    if not values or len({decimal(v, positive=True) for v in values}) != 1:
        raise ValueError(
            "Demanda contratada observada ausente/ambígua; revise o baseline"
        )
    # Compare numeric identity, retain the first frozen spelling for exact replay.
    return values[0]


def _rate(row, rates):
    try:
        start, end = date.fromisoformat(row["reading_from"]), date.fromisoformat(
            row["reading_to"]
        )
        if start >= end:
            return None
    except (ValueError, TypeError, KeyError):
        return None
    matched = []
    for r in rates:
        if (
            r.get("role") != "context"
            or not r.get("planningConfirmed")
            or r.get("errors")
        ):
            continue
        if (
            r.get("supplier_cnpj") != row.get("distributor_cnpj")
            or r.get("subgroup") != "A4"
            or r.get("modality") not in ("Verde", "green")
            or r.get("unit") != "kW"
            or r.get("currency") != "BRL"
            or r.get("basis") != "PRE_TAX_REFERENCE"
            or r.get("rate_kind") != "OFFICIAL_TARIFF_REFERENCE"
            or any(
                r.get(k) != "Não se aplica"
                for k in ("class", "subclass", "detail", "time_band")
            )
            or not r.get("authority")
            or not r.get("reference_id")
        ):
            continue
        try:
            if date.fromisoformat(
                r["effective_from"]
            ) <= start and end <= date.fromisoformat(r["effective_to"]):
                decimal(r["rate"], positive=True)
                matched.append(r)
        except (ValueError, KeyError, TypeError):
            continue
    return matched[0] if len(matched) == 1 else None


def _cost(m, c, t):
    trigger = m > Decimal(POLICY["tolerance"]) * c
    regular = money(max(m, c) * t)
    overrun = money((m - c) * 2 * t if trigger else Decimal(0))
    return {
        "regular": regular,
        "overrun": overrun,
        "total": money(Decimal(regular) + Decimal(overrun)),
        "unusedExposure": money(max(c - m, Decimal(0)) * t),
        "trigger": trigger,
    }


def execute_planning(*, state_payload, assumption_values, execution_configuration):
    if execution_configuration != POLICY:
        raise ValueError("Política de planejamento exige versão exata")
    if set(assumption_values) != {
        "candidateKw",
        "normalRegime",
        "tariffApplicability",
    } or any(
        type(assumption_values[k]) is not bool
        for k in ("normalRegime", "tariffApplicability")
    ):
        raise ValueError("Premissas fora do contrato")
    candidate = decimal(assumption_values["candidateKw"], positive=True)
    if candidate < 30:
        raise ValueError("Demanda candidata mínima de 30 kW no regime normal")
    rows = facts(state_payload)
    original = decimal(actual_contract(state_payload), positive=True)
    rates = [
        r for r in state_payload["records"] if r.get("recordKind") == "tariff_reference"
    ]
    periods = {r.get("period") for r in rows if r.get("period")}
    if any(p and not re.fullmatch(r"\d{4}-(?:0[1-9]|1[0-2])", p) for p in periods):
        raise ValueError("Período mensal inválido")
    months = []
    with localcontext() as ctx:
        ctx.prec = POLICY["precision"]
        for row in sorted(
            rows, key=lambda r: (r.get("period") or "0000", r["locator"])
        ):
            p = row.get("period")
            reasons = list(row.get("errors", []))
            if not row.get("eligible"):
                reasons.append("Observação não confirmada")
            if row.get("scope") != state_payload["review"]["scope"]:
                reasons.append("Unidade conflitante")
            if row.get("role") != "invoice":
                reasons.append("Papel de fonte não é fatura observada")
            if p and sum(r.get("period") == p for r in rows) > 1:
                reasons.append("Faturas duplicadas/conflitantes para o mês")
            if (
                row.get("demand_unit") != "kW"
                or row.get("modality") != "green"
                or row.get("subgroup") != "A4"
            ):
                reasons.append("Unidade/modalidade fora do modelo")
            try:
                m = decimal(row.get("demand_kw"))
            except ValueError:
                m = None
                reasons.append("Demanda mensal ausente/ambígua")
            physical = not reasons and m is not None
            tariff = _rate(row, rates) if physical else None
            if not p or not POLICY["ruleFrom"] <= p <= POLICY["ruleTo"]:
                reasons.append("Autoridade fora da janela verificada")
            try:
                start, end = date.fromisoformat(
                    row["reading_from"]
                ), date.fromisoformat(row["reading_to"])
                if (
                    end.strftime("%Y-%m") != p
                    or not 0 < (end - start).days <= 63
                    or start < date(2019, 2, 1)
                    or end > date(2020, 2, 29)
                ):
                    reasons.append(
                        "Ciclo de leitura incompatível com referência/janela normativa"
                    )
            except (ValueError, TypeError, KeyError):
                reasons.append("Ciclo de leitura ausente/ambíguo")
            if not tariff:
                reasons.append(
                    "Tarifa aplicável ao ciclo completo ausente/ambígua; ciclo misto não alocado"
                )
            if not assumption_values["normalRegime"]:
                reasons.append("Regime normal é premissa ainda não reconhecida")
            if not assumption_values["tariffApplicability"]:
                reasons.append(
                    "Aplicabilidade da referência externa ainda não reconhecida"
                )
            baseline, modeled = None, None
            if not reasons:
                t = decimal(tariff["rate"], positive=True)
                baseline = _cost(m, original, t)
                modeled = _cost(m, candidate, t)
            months.append(
                {
                    "period": p,
                    "label": p or f"Página {row.get('page','?')} · referência ilegível",
                    "demandKw": str(m) if physical else None,
                    "originalKw": str(original),
                    "candidateKw": str(candidate),
                    "physicalCovered": physical,
                    "covered": not reasons,
                    "reasons": list(dict.fromkeys(reasons)),
                    "thresholdKw": str(candidate * Decimal("1.05")),
                    "headroomKw": str(candidate - m) if physical else None,
                    "trigger": m > candidate * Decimal("1.05") if physical else None,
                    "baseline": baseline,
                    "modeled": modeled,
                    "delta": (
                        money(Decimal(modeled["total"]) - Decimal(baseline["total"]))
                        if modeled
                        else None
                    ),
                    "sourceRef": ref(row),
                    "raw": row.get("raw", {}),
                    "sourceQuality": row.get("sourceQuality"),
                    "rate": {**tariff, "sourceRef": ref(tariff)} if tariff else None,
                    "formula": (
                        f"max({m}, {candidate}) × T + 2 × T × ({m} − {candidate}) se {m} > 1.05 × {candidate}"
                        if physical
                        else None
                    ),
                }
            )
        covered = [m for m in months if m["covered"]]
        physical = [m for m in months if m["physicalCovered"]]

        def total(key, field="total"):
            return (
                money(sum((Decimal(m[key][field]) for m in covered), Decimal(0)))
                if covered
                else None
            )

        return {
            "model": MODEL,
            "version": VERSION,
            "policy": POLICY,
            "assumptions": assumption_values,
            "scope": state_payload["review"]["scope"],
            "months": months,
            "baselineKw": str(original),
            "coverage": {
                "covered": len(covered),
                "physical": len(physical),
                "total": len(months),
                "complete": len(covered) == len(months),
            },
            "cost": total("modeled"),
            "baselineCost": total("baseline"),
            "delta": (
                money(sum((Decimal(m["delta"]) for m in covered), Decimal(0)))
                if covered
                else None
            ),
            "overrunCost": total("modeled", "overrun"),
            "unusedExposure": total("modeled", "unusedExposure"),
            "overrunMonths": sum(bool(m["trigger"]) for m in physical),
            "unusedMonths": sum(Decimal(m["headroomKw"]) > 0 for m in physical),
            "maximumKw": (
                str(max(Decimal(m["demandKw"]) for m in physical)) if physical else None
            ),
            "exclusions": [
                "Tributos e fatura bruta",
                "Ciclos com mudança tarifária",
                "Azul/regimes especiais",
                "Projeção, CCEE, otimização contratual e recomendação",
                "Meses sem fatos legíveis/confirmados",
            ],
            "warning": "Custo modelado da cobertura indicada, referência tarifária antes de tributos; não é fatura esperada nem economia verificada.",
        }
