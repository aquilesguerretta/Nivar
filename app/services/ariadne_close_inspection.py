"""Passive, bounded source proposals. No formulas, URLs or embedded instructions execute."""

from __future__ import annotations
import re
import unicodedata
from app.services.ariadne_close_engine import FIELDS, decimal_text

VERSION = "ariadne.inspect.v2"


def boolean(value):
    if value is None:
        return False
    value = re.sub(r"[ \t\r\n]+", " ", value).strip(" ")
    if value not in ("1", "true", "0", "false"):
        raise ValueError("Atributo hidden não é boolean XML válido")
    return value in ("1", "true")


def key(text):
    return "".join(
        c
        for c in unicodedata.normalize("NFKD", text.lower())
        if not unicodedata.combining(c)
    ).strip()


ALIASES = {
    "descricao": "item_key",
    "componente": "component",
    "unidade consumidora": "scope",
    "competencia": "period",
    "moeda": "currency",
    "valor faturado": "amount",
    "valor": "amount",
    "quantidade": "quantity",
    "quantidade kwh": "quantity",
    "preco": "price",
    "tarifa": "price",
    "unidade": "quantity_unit",
}


def mapping(headers):
    proposals = {}
    for header in headers:
        field = header if header in FIELDS else ALIASES.get(key(header))
        if field:
            proposals.setdefault(field, []).append(header)
    return {
        field: columns[0] for field, columns in proposals.items() if len(columns) == 1
    }


def sheet_regions(root, name, state, shared, ns):
    from app.services.ariadne_close_intake import _column

    if state not in ("visible", "hidden", "veryHidden"):
        raise ValueError("Estado de planilha não suportado")
    hidden_sheet = state != "visible"
    hidden_cols = set()
    for col in root.findall("m:cols/m:col", ns):
        lo, hi = int(col.get("min", "0")), int(col.get("max", "0"))
        if not 1 <= lo <= hi <= 16384:
            raise ValueError("Intervalo de coluna inválido")
        if boolean(col.get("hidden")):
            hidden_cols.update(range(lo, min(hi, 40) + 1))
    merges = [e.get("ref", "") for e in root.findall("m:mergeCells/m:mergeCell", ns)]
    merged_cells = set()

    def coordinate(ref):
        match = re.fullmatch(r"([A-Z]{1,3})(\d+)", ref)
        if not match:
            raise ValueError("Localizador de célula inválido")
        col = 0
        for letter in match[1]:
            col = col * 26 + ord(letter) - 64
        return int(match[2]), col

    for ref in merges:
        ends = ref.split(":")
        a, b = coordinate(ends[0]), coordinate(ends[-1])
        if not 1 <= a[0] <= b[0] <= 2001 or not 1 <= a[1] <= b[1] <= 40:
            raise ValueError("Mescla excede limites de inspeção")
        merged_cells.update(
            (r, c) for r in range(a[0], b[0] + 1) for c in range(a[1], b[1] + 1)
        )
    grid, cells, row_hidden = {}, [], {}
    previous = 0
    for row in root.findall("m:sheetData/m:row", ns):
        number = int(row.get("r", "0"))
        if not previous < number <= 2001:
            raise ValueError(
                "Referências de linha duplicadas/fora de ordem ou limite excedido"
            )
        previous = number
        row_hidden[number] = boolean(row.get("hidden"))
        previous_col = 0
        for cell in row:
            r, col = coordinate(cell.get("r", ""))
            if r != number or not previous_col < col <= 40:
                raise ValueError(
                    "Referências de célula duplicadas/fora de ordem ou limite excedido"
                )
            previous_col = col
            node = cell.find("m:v", ns)
            raw = node.text if node is not None else None
            typ = cell.get("t")
            if typ == "s":
                if not re.fullmatch(r"0|[1-9][0-9]*", raw or "") or int(raw) >= len(
                    shared
                ):
                    raise ValueError("Índice de texto compartilhado inválido")
                raw = shared[int(raw)]
            elif typ == "inlineStr":
                inline = cell.find("m:is", ns)
                raw = "".join(inline.itertext()) if inline is not None else None
            formula = cell.find("m:f", ns)
            expression = formula.text or "" if formula is not None else None
            if len(raw or "") > 2000 or len(expression or "") > 2000:
                raise ValueError("Célula excede 2000 caracteres")
            issues = []
            if hidden_sheet or row_hidden[number] or col in hidden_cols:
                issues.append("Conteúdo oculto: não elegível")
            if (r, col) in merged_cells:
                issues.append("Célula mesclada: não elegível")
            if formula is not None:
                issues.append(
                    "Fórmula não executada; cache não verificado e não elegível"
                )
            if typ in ("e", "b"):
                issues.append("Célula de erro/booleano: não elegível")
            value = {
                "locator": f"{name}!{_column(col)}{r}",
                "row": r,
                "column": col,
                "raw": raw,
                "type": typ or "n",
                "issues": issues,
            }
            if formula is not None:
                value.update(formula=expression, cachedValue=raw, cacheVerified=False)
            cells.append(value)
            grid[r, col] = value
    tables = []
    consumed_until = 0
    for r in sorted(row_hidden):
        if r <= consumed_until:
            continue
        active = [
            (c, v)
            for (rr, c), v in grid.items()
            if rr == r and v["raw"] not in (None, "")
        ]
        if len(active) < 2:
            continue
        active.sort()
        lo, hi = active[0][0], active[-1][0]
        headers = [grid.get((r, c), {}).get("raw") for c in range(lo, hi + 1)]
        if any(not h or len(h) > 120 for h in headers) or len(set(headers)) != len(
            headers
        ):
            continue
        if any(
            grid[r, c].get("formula") is not None
            or grid[r, c]["type"] not in ("s", "inlineStr", "str")
            for c in range(lo, hi + 1)
        ):
            continue
        # Prefer a recognizable real header beneath a multi-cell presentation title.
        if not mapping(headers) and not {"SigAgente", "VlrTE", "VlrTUSD"} <= set(
            headers
        ):
            later = [
                [
                    v["raw"]
                    for (rr, c), v in sorted(grid.items())
                    if rr == next_r and v["raw"]
                ]
                for next_r in range(r + 1, min(r + 6, previous + 1))
            ]
            if any(
                mapping(h) or {"SigAgente", "VlrTE", "VlrTUSD"} <= set(h) for h in later
            ):
                continue
        # A passive literal header can describe context even without canonical names.
        data_rows = []
        for rr in range(r + 1, previous + 1):
            values = {
                h: grid.get((rr, c), {}).get("raw")
                for h, c in zip(headers, range(lo, hi + 1))
            }
            if not any(v not in (None, "") for v in values.values()):
                break
            issues = sorted(
                {
                    issue
                    for c in range(lo, hi + 1)
                    for issue in grid.get((rr, c), {}).get("issues", [])
                }
            )
            issues += sorted(
                {issue for c in range(lo, hi + 1) for issue in grid[r, c]["issues"]}
            )
            data_rows.append(
                {
                    "index": rr - r,
                    "values": values,
                    "locator": f"{name}!row:{rr}",
                    "cells": {
                        h: f"{name}!{_column(c)}{rr}"
                        for h, c in zip(headers, range(lo, hi + 1))
                    },
                    "numericColumns": [
                        h
                        for h, c in zip(headers, range(lo, hi + 1))
                        if grid.get((rr, c), {}).get("type") == "n"
                        and "formula" not in grid.get((rr, c), {})
                    ],
                    "issues": list(dict.fromkeys(issues)),
                }
            )
        if data_rows:
            end = r + len(data_rows)
            region = f"{name}!{_column(lo)}{r}:{_column(hi)}{end}"
            tables.append(
                {
                    "name": region,
                    "id": region,
                    "sheet": name,
                    "headerRow": r,
                    "range": region,
                    "columns": headers,
                    "headerCells": {
                        h: f"{name}!{_column(c)}{r}"
                        for h, c in zip(headers, range(lo, hi + 1))
                    },
                    "rows": data_rows,
                    "proposedMapping": mapping(headers),
                }
            )
            consumed_until = end
            if len(tables) > 30:
                raise ValueError("Limite de regiões excedido")
    warnings = []
    if hidden_sheet or hidden_cols or any(row_hidden.values()):
        warnings.append(
            "Conteúdo oculto preservado; não pode ser confirmado como entrada"
        )
    if merges:
        warnings.append(
            "Mesclas preservadas; selecione uma região literal sem mesclas nos dados"
        )
    if any("formula" in c for c in cells):
        warnings.append(
            "Fórmulas preservadas sem execução; caches não são entradas elegíveis"
        )
    classified = set()
    for table in tables:
        for record in table["rows"]:
            classified.update(record["cells"].values())
        classified.update(table["headerCells"].values())
    first_header = min((t["headerRow"] for t in tables), default=0)
    presentation = [
        c["locator"]
        for c in cells
        if c["row"] < first_header
        and c["type"] in ("s", "inlineStr", "str")
        and "formula" not in c
        and not re.search(r"\d", c["raw"] or "")
    ]
    unclassified = [
        c["locator"]
        for c in cells
        if (c["raw"] not in (None, "") or "formula" in c)
        and c["locator"] not in classified
        and c["locator"] not in presentation
    ]
    if presentation:
        warnings.append(
            "Títulos de apresentação preservados: " + ", ".join(presentation[:20])
        )
    if unclassified:
        warnings.append(
            f"{len(unclassified)} células fora das regiões propostas; completude não estabelecida"
        )
    return tables, {
        "name": name,
        "hidden": hidden_sheet,
        "cells": cells,
        "mergedRanges": merges,
        "warnings": warnings,
        "unclassifiedCells": unclassified,
        "presentationCells": presentation,
    }


def propose(preview):
    preview["parserVersion"] = VERSION
    preview.setdefault("warnings", [])
    preview.setdefault("sheets", [])
    preview["proposal"] = {
        "role": None,
        "description": "Papel da fonte não determinado",
        "evidence": [],
    }
    tables = preview["tables"]
    tariff = next(
        (
            t
            for t in tables
            if {"SigAgente", "VlrTE", "VlrTUSD", "DatInicioVigencia"}
            <= set(t["columns"])
        ),
        None,
    )
    if tariff:
        preview["proposal"] = {
            "role": "context",
            "description": "Referência tarifária ANEEL; aplicabilidade não estabelecida",
            "evidence": [tariff["name"]],
        }
    elif tables:
        fields = set(tables[0]["proposedMapping"])
        role = (
            "invoice"
            if "amount" in fields
            else (
                "price"
                if "price" in fields
                else "quantity" if "quantity" in fields else None
            )
        )
        preview["proposal"].update(
            role=role,
            description={
                "invoice": "Possíveis valores faturados",
                "price": "Possíveis preços; independência precisa de revisão",
                "quantity": "Possíveis quantidades; independência precisa de revisão",
            }.get(role, "Papel da fonte não determinado"),
        )
        for field in ("scope", "period"):
            column = tables[0]["proposedMapping"].get(field)
            values = {r["values"].get(column) for r in tables[0]["rows"]} - {None, ""}
            if column and len(values) == 1:
                preview["proposal"][field] = next(iter(values))
                supporting = next(
                    r
                    for r in tables[0]["rows"]
                    if r["values"].get(column) not in (None, "")
                )
                preview["proposal"]["evidence"].append(supporting["cells"].get(column))
    for table in tables:
        aliases = {}
        for h in table["columns"]:
            field = h if h in FIELDS else ALIASES.get(key(h))
            if field:
                aliases.setdefault(field, []).append(h)
        for field, columns in aliases.items():
            if len(columns) > 1:
                preview["warnings"].append(
                    "Mapeamento ambíguo para " + field + ": " + ", ".join(columns)
                )
    if preview["kind"] == "pdf":
        invoice(preview)
    from app.services.ariadne_demand_intake import propose_demand

    propose_demand(preview)
    return preview


def invoice(preview):
    """Only the verified native Ceará B3 table grammar; amounts never hardcoded."""
    observations = []
    for page in preview["pages"]:
        text = page["text"]
        normalized = key(text)
        if (
            "companhia energetica do ceara" not in normalized
            or "07047251000170" not in re.sub(r"\D", "", text)
        ):
            continue
        if (
            "total medido" not in normalized
            or "tarifa (r$)" not in normalized
            or " b3 " not in normalized
        ):
            continue
        periods = re.findall(r"(?m)^(0[1-9]|1[0-2])/(\d{4})\s*$", text)
        identity = re.search(r"(?m)^(\d{9})\n[A-F0-9.]{20,}\s*$", text)
        due = re.search(r"(?m)^\d{2}/\d{2}/\d{4} (\d+,\d{2})\n(\d{5,12})\s*$", text)
        if (
            len(set(periods)) != 1
            or not identity
            or not due
            or len(
                set(
                    re.findall(
                        r"(?m)^\d{2}/\d{2}/\d{4} (\d+,\d{2})\n(\d{5,12})\s*$", text
                    )
                )
            )
            != 1
            or len(re.findall(r"(?m)^\d{9}\n[A-F0-9.]{20,}\s*$", text)) != 1
            or text.count("(A) Contrato de Energia") != 1
            or text.count("(B) Outros Encargos") != 1
        ):
            preview["warnings"].append(
                "Contexto da fatura ambíguo; campos automáticos não propostos"
            )
            continue
        a = re.search(
            r"\(A\) Contrato de Energia\n(.+?)\nSubtotal\(A\) (\d+,\d{2})\s*\n",
            text,
            re.S,
        )
        b = re.search(
            r"\(B\) Outros Encargos\n(.+?)\nSubtotal\(B\) (\d+,\d{2}-?)\s*\n",
            text,
            re.S,
        )
        if not a or not b:
            continue
        local = []

        def add(label, amount, raw, start, **extras):
            index = len(local) + 1
            row = {
                "index": index,
                "label": label,
                "amount": decimal_text(
                    ("-" + amount[:-1]) if amount.endswith("-") else amount, "comma"
                ),
                "tax_basis": "unknown",
                "currency": "BRL",
                "invoice_id": identity[1],
                "locator": f"page:{page['number']}/text:{start}:{start+len(raw)}",
                "page": page["number"],
                "snippet": raw,
                "operation": None,
                "operands": [],
                **extras,
            }
            local.append(row)
            return index

        complete = True
        for section in (a, b):
            operands = []
            offset = section.start(1)
            for line in section[1].splitlines():
                product = re.fullmatch(
                    r"(Adicional Band\. Vermelha) (\d+,\d{3}) (\d+,\d{2})(\d+,\d{5})",
                    line,
                )
                simple = re.fullmatch(
                    r"(Custo de disponibilidade|Benefício Tarifário Bruto|Benefício Tarifário Líquido) (\d+,\d{2}-?)",
                    line,
                )
                if product:
                    operands.append(
                        add(
                            product[1],
                            product[3],
                            line,
                            offset,
                            operation="product",
                            quantity=decimal_text(product[2], "comma"),
                            price=decimal_text(product[4], "comma"),
                            quantity_unit=None,
                            price_unit=None,
                        )
                    )
                elif simple:
                    operands.append(add(simple[1], simple[2], line, offset))
                else:
                    complete = False
                    preview["warnings"].append(
                        "Linha de faturamento fora do layout implementado; subtotal não verificado"
                    )
                offset += len(line) + 1
            label = "Subtotal A" if section is a else "Subtotal B"
            raw = text[section.end(1) + 1 : section.end()].strip()
            add(
                label,
                section[2],
                raw,
                section.end(1) + 1,
                operation="sum" if complete else None,
                operands=operands,
            )
        subtotal_indices = [
            r["index"] for r in local if r["label"] in ("Subtotal A", "Subtotal B")
        ]
        add(
            "Total da fatura",
            due[1],
            due[0].splitlines()[0],
            due.start(),
            operation="sum" if complete else None,
            operands=subtotal_indices,
        )
        if observations:
            preview["warnings"].append(
                "Múltiplas faturas no PDF; extração automática não elegível"
            )
            preview.pop("observations", None)
            preview["proposal"] = {
                "role": "invoice",
                "description": "Múltiplas faturas; período e unidade exigem seleção humana",
            }
            preview["extraction"] = "ambiguous / manual-only"
            return
        observations = local
        month, year = periods[0]
        preview["proposal"] = {
            "role": "invoice",
            "description": "Fatura Enel Ceará · layout nativo B3 reconhecido",
            "period": f"{year}-{month}",
            "scope": due[2],
            "distributor": "Enel Ceará",
            "invoiceId": identity[1],
            "class": " / ".join(
                re.findall(r"(?m)^\s*(B3 [^\n]+|Serviço Público [^\n]+)\s*$", text)
            ),
            "currency": "BRL",
            "evidence": [
                f"page:{page['number']}/text:{identity.start()}:{identity.end()}",
                f"page:{page['number']}/text:{due.start()}:{due.end()}",
            ],
        }
        preview["observations"] = observations
        preview["extraction"] = "enel_ce_b3_native.v1 / proposed observations"
        preview["warnings"].extend(
            [
                "Base tributária não estabelecida; sem verificação independente",
                "Quantidade da fatura não é medição independente; painel do medidor deve ser inspecionado",
                "Tributos, descontos e método de disponibilidade/bandeira não verificados",
            ]
        )


def pdf_provenance(data):
    from pypdf import PdfReader
    import io

    metadata = PdfReader(io.BytesIO(data), strict=True).metadata or {}
    fields = {
        "url": "/OriginalSourceURL",
        "originalSHA256": "/OriginalSourceSHA256",
        "acquiredUTC": "/OriginalAcquiredUTC",
        "physicalPage": "/OriginalPhysicalPage",
        "printedPage": "/OriginalPrintedPage",
        "method": "/DerivativeMethod",
    }
    result = {k: str(metadata[v])[:1000] for k, v in fields.items() if v in metadata}
    if result:
        result["status"] = (
            "metadata attribution; operator reviewed, not authenticity proof"
        )
    return result
