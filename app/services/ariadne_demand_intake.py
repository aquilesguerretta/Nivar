"""Narrow passive demand observations; no OCR, tariff authority or model math.

The recognized scan form uses corroborating cells at fixed relative positions.
Positions/lexical values are proposals and require source review. No numeric
fact, invoice identity, period or contracted value is hardcoded.
"""

import re
from collections import Counter
from decimal import Decimal
from datetime import date

VERSION = "ariadne.demand_observations.v1"
TABLE_FIELDS = {
    "scope",
    "period",
    "demand_kw",
    "contracted_kw",
    "demand_unit",
    "modality",
}


def number(value):
    if not isinstance(value, str) or not re.fullmatch(
        r"\d+(?:\.\d{1,6})?", value.strip()
    ):
        return None
    if Decimal(value) > 100000:
        return None
    return value.strip()


def validate(row):
    errors = list(row.get("errors", []))
    for field in ("demand_kw", "contracted_kw"):
        if number(row.get(field)) is None:
            errors.append(field + ": valor ausente/ambíguo")
            row[field] = None
    if row.get("contracted_kw") is not None and Decimal(row["contracted_kw"]) <= 0:
        errors.append("Demanda contratada deve ser positiva")
    if not re.fullmatch(r"\d{4}-(?:0[1-9]|1[0-2])", row.get("period") or ""):
        errors.append("Referência mensal ausente/ambígua")
    if not row.get("scope"):
        errors.append("Unidade ausente/ambígua")
    if row.get("demand_unit") != "kW":
        errors.append("Unidade de demanda incompatível; somente kW")
    if row.get("modality") != "green" or row.get("subgroup") != "A4":
        errors.append(
            "Somente layout A4 verde; modalidade não estabelecida/fora do escopo"
        )
    for field in ("reading_from", "reading_to"):
        value = row.get(field)
        try:
            if value:
                date.fromisoformat(value)
        except ValueError:
            row[field] = None
    if (
        row.get("reading_from")
        and row.get("reading_to")
        and row["reading_from"] >= row["reading_to"]
    ):
        row["reading_from"] = row["reading_to"] = None
    row.update(
        errors=errors,
        warnings=list(row.get("warnings", [])),
        recordKind="demand_fact",
        component="demand_profile",
        row_type="line",
        item_key=row.get("period") or row["locator"],
        quantity=row.get("demand_kw"),
        quantity_unit="kW",
        price=None,
        currency="BRL",
        tax_basis="unknown",
        amount=row.get("observed_charge"),
        label=(
            row.get("period")
            or f"Página {row.get('page', '?')} · referência não legível"
        ),
        validation="invalid" if errors else "valid",
    )
    return row


def _region(page, bounds):
    left, bottom, right, top = page["box"]
    width, height = right - left, top - bottom
    if not width > 0 or not height > 0:
        return []
    x1, x2, y1, y2 = bounds
    return sorted(
        (
            t
            for t in page["tokens"]
            if x1 <= (t["x"] - left) / width <= x2
            and y1 <= (t["y"] - bottom) / height <= y2
        ),
        key=lambda t: (-t["y"], t["x"]),
    )


def _single(tokens, pattern):
    matches = [t for t in tokens if re.fullmatch(pattern, t["raw"])]
    return matches[0] if len({t["raw"] for t in matches}) == 1 else None


def _date(tokens):
    # Adjacent text spans can split a date's initial digit; join only contiguous
    # native text on the same line inside the known date cell, never OCR repair.
    if not tokens:
        return None
    exact = [t for t in tokens if re.fullmatch(r"\d{2}/\d{2}/\d{4}", t["raw"])]
    if len({t["raw"] for t in exact}) == 1:
        tokens = [exact[0]]
    values = []
    for line in _lines(tokens):
        raw = "".join(t["raw"] for t in line)
        m = re.fullmatch(r"[^\d]*(\d{2})/(\d{2})/(\d{4})[^\d]*", raw)
        if m:
            try:
                values.append(date(int(m[3]), int(m[2]), int(m[1])).isoformat())
            except ValueError:
                pass
    return values[0] if len(set(values)) == 1 else None


def _lines(tokens):
    lines = []
    for t in sorted(tokens, key=lambda t: (-t["y"], t["x"])):
        line = next((l for l in lines if abs(l[0]["y"] - t["y"]) < 2), None)
        if line is None:
            lines.append([t])
        else:
            line.append(t)
    return [sorted(l, key=lambda t: t["x"]) for l in lines]


def _scan_row(page, index):
    tokens = page.get("tokens", [])
    raw = page["text"]
    if not tokens or not re.search(r"838\d{6}", re.sub(r"\s+", "", raw)):
        return None
    n = page["number"]
    ref = _single(_region(page, (0.68, 0.81, 0.15, 0.21)), r"(?:0[1-9]|1[0-2])/\d{4}")
    scope = _single(_region(page, (0.73, 0.84, 0.20, 0.225)), r"\d{5,12}")
    identity = _single(_region(page, (0.48, 0.70, 0.20, 0.225)), r"\d{12,20}")
    upper = _region(page, (0.49, 0.61, 0.730, 0.751))
    lower = _region(page, (0.66, 0.74, 0.32, 0.344))

    def cell_number(t):
        raw = t["raw"]
        return raw.replace(",", ".") if re.fullmatch(r"\d+[.,]\d{2}", raw) else None

    u = Counter(cell_number(t) for t in upper if cell_number(t) is not None)
    l = Counter(cell_number(t) for t in lower if cell_number(t) is not None)
    contracts = {v for v in u if u[v] >= 2 and l[v] >= 2}
    contracted = next(iter(contracts)) if len(contracts) == 1 else None
    contract_y = [t["y"] for t in upper if cell_number(t) == contracted]

    def demand_cell(bounds):
        return _single(
            [
                t
                for t in _region(page, bounds)
                if contract_y and 4 < t["y"] - max(contract_y) < 9
            ],
            r"\d+\.\d{2}",
        )

    measured = demand_cell((0.49, 0.545, 0.738, 0.765))
    peak = demand_cell((0.55, 0.61, 0.738, 0.765))
    modality = "green" if re.search(r"A4\s*HOROSAZONAL\s*VERDE", raw, re.I) else None
    period = f"{ref['raw'][3:]}-{ref['raw'][:2]}" if ref else None
    field_refs = {}
    values = {
        "period": ref,
        "scope": scope,
        "invoice_id": identity,
        "demand_kw": measured,
        "peak_kw": peak,
    }
    for field, token in values.items():
        if token:
            field_refs[field] = token["locator"]
    contract_tokens = (
        [t for t in upper + lower if cell_number(t) == contracted] if contracted else []
    )
    field_refs["contracted_kw"] = " | ".join(t["locator"] for t in contract_tokens)
    m = measured["raw"] if measured else None
    pk = peak["raw"] if peak else None
    if m is not None and pk is not None:
        # Green uses a cycle maximum, not the sum of time bands.
        chosen = measured if Decimal(m) >= Decimal(pk) else peak
        m = chosen["raw"]
        field_refs["demand_kw"] = chosen["locator"]
    elif pk is None:
        m = None
    start_tokens = _region(page, (0.34, 0.44, 0.895, 0.925))
    end_tokens = _region(page, (0.44, 0.51, 0.895, 0.925))
    for field, parts in (("reading_from", start_tokens), ("reading_to", end_tokens)):
        field_refs[field] = " | ".join(t["locator"] for t in parts)
    observed = {}
    for prefix, name in (
        ("Demanda Ativa", "regular"),
        ("Demanda Ultrapassagem", "overrun"),
    ):
        label_tokens = [
            t
            for t in tokens
            if t["raw"].casefold() in (prefix.casefold(), prefix.split()[0].casefold())
        ]
        for label in label_tokens:
            row_tokens = [t for t in tokens if abs(t["y"] - label["y"]) < 3]
            line = " ".join(t["raw"] for t in sorted(row_tokens, key=lambda t: t["x"]))
            match = re.search(
                re.escape(prefix)
                + r"\s+(\d+(?:\.\d{3})*,\d{3})\s+(\d+,\d{5})\s+(\d+(?:\.\d{3})*,\d{2})",
                line,
                re.I,
            )
            if match:
                observed[name] = {
                    "quantity": match[1],
                    "rate": match[2],
                    "charge": match[3],
                    "kind": "OBSERVED_INVOICE_RATE",
                    "raw": line,
                    "locator": label["locator"],
                }
                break
    row = dict(
        index=index,
        page=n,
        locator=f"page:{n}/demand-observation",
        scope=scope["raw"] if scope else None,
        period=period,
        invoice_id=identity["raw"] if identity else None,
        demand_kw=m,
        peak_kw=pk,
        offpeak_kw=measured["raw"] if measured else None,
        contracted_kw=contracted,
        demand_unit="kW",
        subgroup="A4" if modality else None,
        modality=modality,
        distributor_cnpj=(
            "07047251000170"
            if re.search(r"07[.\s]*047[.\s]*251[/\s]*0001[-\s]*70", raw)
            else None
        ),
        reading_from=_date(start_tokens),
        reading_to=_date(end_tokens),
        fieldRefs=field_refs,
        observedRates=observed,
        sourceQuality=page.get("sourceQuality", "native_text_candidates"),
        raw={
            "contracted_kw": [t["raw"] for t in contract_tokens],
            "demand_kw": measured["raw"] if measured else None,
            "peak_kw": pk,
            "period": ref["raw"] if ref else None,
            "reading_from": [t["raw"] for t in start_tokens],
            "reading_to": [t["raw"] for t in end_tokens],
        },
        warnings=[
            "Candidatos posicionais de camada pesquisável; confira números e rótulos no original. Não houve OCR novo.",
            "Históricos sobrepostos não são novas faturas e não foram usados para preencher lacunas.",
        ],
    )
    return validate(row)


def propose_demand(preview):
    tariff_fields = {
        "supplier_cnpj",
        "subgroup",
        "modality",
        "unit",
        "rate",
        "currency",
        "basis",
        "effective_from",
        "effective_to",
        "authority",
        "reference_id",
        "rate_kind",
        "class",
        "subclass",
        "detail",
        "time_band",
    }
    tariffs = []
    for table in preview["tables"]:
        if tariff_fields <= set(table["columns"]):
            for original in table["rows"]:
                v = original["values"]
                errors = list(original.get("issues", []))
                if number(v["rate"]) is None or Decimal(v["rate"] or "0") <= 0:
                    errors.append("Tarifa positiva exata obrigatória")
                tariffs.append(
                    {
                        **v,
                        "raw": v,
                        "index": len(tariffs) + 1,
                        "locator": original["locator"],
                        "fieldRefs": original.get("cells", {}),
                        "recordKind": "tariff_reference",
                        "errors": errors,
                        "validation": "invalid" if errors else "valid",
                        "warnings": [
                            "Referência externa: confirme dimensões, vigência, base e proveniência; não é preço bruto da fatura."
                        ],
                    }
                )
    if tariffs:
        preview.update(parserVersion=VERSION, tariffReferences=tariffs)
        preview["proposal"] = {
            "role": "context",
            "description": "Referências históricas de demanda; aplicabilidade exige revisão",
            "evidence": [r["locator"] for r in tariffs],
        }
        return
    rows = []
    if preview["kind"] == "pdf" and any(
        re.search(r"A4\s*HOROSAZONAL\s*VERDE", p["text"], re.I)
        for p in preview["pages"]
    ):
        for page in preview["pages"]:
            row = _scan_row(page, len(rows) + 1)
            if row:
                rows.append(row)
    else:
        for table in preview["tables"]:
            if not TABLE_FIELDS <= set(table["columns"]):
                continue
            for original in table["rows"]:
                raw = original["values"]
                row = {
                    **raw,
                    "index": len(rows) + 1,
                    "raw": raw,
                    "locator": original["locator"],
                    "fieldRefs": original.get("cells", {}),
                    "sourceQuality": "operator_supplied_table",
                    "warnings": [
                        "Origem e interpretação exigem confirmação; não é medição independente automática."
                    ],
                    "errors": original.get("issues", []),
                }
                rows.append(validate(row))
    if not rows:
        return
    known = [r for r in rows if not r["errors"]]
    scopes = {r["scope"] for r in known}
    periods = [r["period"] for r in known]
    preview.update(
        parserVersion=VERSION,
        demandProfile=rows,
        extraction="reviewed_demand_candidates_no_new_ocr",
    )
    preview["demandInspection"] = {
        "adapter": VERSION,
        "candidateInvoices": len(rows),
        "unsupportedPages": [
            {"page": r.get("page"), "errors": r["errors"]} for r in rows if r["errors"]
        ],
        "notAnIndependentMeterSource": True,
    }
    preview["proposal"] = {
        "role": "invoice",
        "description": "Perfil observado de demanda A4 verde; interpretação a revisar",
        "scope": next(iter(scopes)) if len(scopes) == 1 else None,
        "period": max(periods) if periods else None,
        "distributor": "Enel Ceará" if preview["kind"] == "pdf" else None,
        "class": "A4 verde",
        "currency": "BRL",
        "evidence": [r["locator"] for r in rows],
    }
    preview["warnings"].append(
        "Planejamento exige confirmar fatos e preservar estado. OCR existente pode ser incompleto; nenhuma lacuna foi preenchida."
    )
