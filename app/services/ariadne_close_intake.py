"""Bounded, isolated parsing. No network, spreadsheet execution or OCR."""

from __future__ import annotations
import csv
import io
import json
import multiprocessing as mp
import posixpath
import re
import xml.etree.ElementTree as ET
import zipfile
from app.services.ariadne_close_engine import FIELDS

MAX_BYTES = 8 * 1024 * 1024
MAX_ROWS = 2000
MAX_EXPANDED = 20 * 1024 * 1024
MAX_PREVIEW = 8 * 1024 * 1024
NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}


def _xml(data):
    class PassiveTree(ET.TreeBuilder):
        def doctype(self, name, pubid, system):
            raise ValueError("DTD/entidades XML não suportados")

    return ET.fromstring(data, parser=ET.XMLParser(target=PassiveTree()))


def _table(name, matrix, locators, *, numeric_cells=()):
    if not matrix or len(matrix) < 2:
        raise ValueError("Tabela precisa de cabeçalho e pelo menos uma linha")
    headers = [str(v or "").strip() for v in matrix[0]]
    if (
        len(headers) > 40
        or any(not h or len(h) > 120 for h in headers)
        or len(set(headers)) != len(headers)
    ):
        raise ValueError("Cabeçalhos vazios/duplicados ou tabela larga")
    if len(matrix) - 1 > MAX_ROWS:
        raise ValueError("Limite de 2000 linhas excedido")
    rows = []
    numeric_by_row = {}
    for row_index, column_index in numeric_cells:
        numeric_by_row.setdefault(row_index, set()).add(column_index)
    for index, cells in enumerate(matrix[1:], 1):
        if len(cells) != len(headers):
            raise ValueError("Tabela não retangular")
        if any(v is not None and len(str(v)) > 2000 for v in cells):
            raise ValueError("Célula excede 2000 caracteres")
        if not any(v is not None and str(v).strip() for v in cells):
            continue
        rows.append(
            {
                "index": index,
                "values": dict(zip(headers, cells)),
                "locator": locators[index],
                "cells": {h: f"{locators[index]}:{j+1}" for j, h in enumerate(headers)},
                "numericColumns": [
                    headers[j] for j in sorted(numeric_by_row.get(index, ()))
                ],
            }
        )
    proposed = {f: h for f in FIELDS for h in headers if h.strip().lower() == f}
    return {"name": name, "columns": headers, "rows": rows, "proposedMapping": proposed}


def _xlsx(data):
    tables = []
    with zipfile.ZipFile(io.BytesIO(data)) as z:
        infos = z.infolist()
        names = [i.filename for i in infos]
        if (
            len(infos) > 300
            or len(names) != len(set(names))
            or sum(i.file_size for i in infos) > MAX_EXPANDED
        ):
            raise ValueError("Arquivo XLSX excede limite descompactado")
        if any(
            i.flag_bits & 1
            or ".." in i.filename.split("/")
            or i.filename.startswith("/")
            for i in infos
        ):
            raise ValueError("Arquivo XLSX inválido")
        if any(
            any(
                t in n.lower()
                for t in (
                    "vbaproject",
                    "externallink",
                    "embeddings/",
                    "activex/",
                    "connections.xml",
                    "querytables/",
                    "macrosheets/",
                )
            )
            for n in names
        ):
            raise ValueError("Macros/links/objetos ativos não suportados")
        if "xl/workbook.xml" not in names or "[Content_Types].xml" not in names:
            raise ValueError("Conteúdo não é XLSX")
        for n in names:
            if n.endswith(".rels"):
                root = _xml(z.read(n))
                if any(e.get("TargetMode") == "External" for e in root):
                    raise ValueError("Relações externas não suportadas")
        shared = []
        if "xl/sharedStrings.xml" in names:
            shared = [
                "".join(e.itertext()) for e in _xml(z.read("xl/sharedStrings.xml"))
            ]
        wb = _xml(z.read("xl/workbook.xml"))
        rels = {
            e.get("Id"): e.get("Target")
            for e in _xml(z.read("xl/_rels/workbook.xml.rels"))
        }
        sheets = wb.find("m:sheets", NS)
        if sheets is None or len(sheets) > 20:
            raise ValueError("Limite de planilhas excedido")
        total_rows = 0
        sheet_names = set()
        for sheet in sheets:
            name = sheet.get("name", "")
            if (
                not 1 <= len(name) <= 31
                or any(c in name for c in "[]:*?/\\")
                or name.casefold() in sheet_names
            ):
                raise ValueError("Nome de planilha inválido/duplicado")
            sheet_names.add(name.casefold())
            if sheet.get("state", "visible") != "visible":
                raise ValueError("Planilhas ocultas não suportadas")
            target = rels[
                sheet.get(
                    "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"
                )
            ]
            path = (
                target.lstrip("/")
                if target.startswith("/")
                else posixpath.normpath("xl/" + target)
            )
            if not path.startswith("xl/worksheets/"):
                raise ValueError("Layout de planilha não suportado")
            root = _xml(z.read(path))
            if (
                root.find("m:mergeCells", NS) is not None
                or root.find(".//m:f", NS) is not None
            ):
                raise ValueError("Fórmulas/células mescladas não suportadas")
            matrix, locators, numeric_cells = [], [], []
            previous_row = 0
            for row in root.findall("m:sheetData/m:row", NS):
                number = int(row.get("r", "0"))
                if number <= previous_row:
                    raise ValueError("Referências de linha duplicadas/fora de ordem")
                previous_row = number
                if number < 1 or number > MAX_ROWS + 1 or row.get("hidden") == "1":
                    raise ValueError("Linhas ocultas/limite de linhas não suportado")
                while len(matrix) < number:
                    matrix.append([])
                    locators.append(f"{sheet.get('name')}!row:{len(matrix)}")
                previous_column = 0
                for cell in row:
                    ref = cell.get("r", "")
                    match = re.fullmatch(r"([A-Z]{1,2})(\d+)", ref)
                    if not match or int(match[2]) != number:
                        raise ValueError("Localizador de célula inválido")
                    col = 0
                    for letter in match[1]:
                        col = col * 26 + ord(letter) - 64
                    if col <= previous_column:
                        raise ValueError(
                            "Referências de célula duplicadas/fora de ordem"
                        )
                    previous_column = col
                    if col > 40:
                        raise ValueError("Limite de 40 colunas excedido")
                    while len(matrix[number - 1]) < col:
                        matrix[number - 1].append(None)
                    v = cell.find("m:v", NS)
                    raw = v.text if v is not None else None
                    typ = cell.get("t")
                    if typ == "s":
                        if not re.fullmatch(r"0|[1-9][0-9]*", raw or "") or int(
                            raw
                        ) >= len(shared):
                            raise ValueError("Índice de texto compartilhado inválido")
                        raw = shared[int(raw)]
                    elif typ == "inlineStr":
                        inline = cell.find("m:is", NS)
                        raw = "".join(inline.itertext()) if inline is not None else None
                    elif typ in ("e", "b"):
                        raise ValueError("Erros/booleanos não suportados na tabela")
                    elif typ is None or typ == "n":
                        numeric_cells.append((number - 1, col - 1))
                    matrix[number - 1][col - 1] = raw
            if not matrix:
                continue
            width = len(matrix[0])
            for cells in matrix:
                cells.extend([None] * max(0, width - len(cells)))
            table = _table(
                sheet.get("name"), matrix, locators, numeric_cells=numeric_cells
            )
            # Exact Excel cell references, including blanks.
            for row in table["rows"]:
                row["cells"] = {
                    h: f"{sheet.get('name')}!{_column(j+1)}{row['index']+1}"
                    for j, h in enumerate(table["columns"])
                }
            total_rows += len(table["rows"])
            if total_rows > MAX_ROWS:
                raise ValueError("Limite total de 2000 linhas excedido")
            tables.append(table)
    if not tables:
        raise ValueError("Nenhuma tabela suportada")
    return {"kind": "xlsx", "tables": tables, "pages": [], "extraction": "tables_only"}


def _column(number):
    value = ""
    while number:
        number, digit = divmod(number - 1, 26)
        value = chr(65 + digit) + value
    return value


def _pdf_document(data):
    from pypdf import PdfReader
    from pypdf.generic import StreamObject

    reader = PdfReader(io.BytesIO(data), strict=True)
    if reader.is_encrypted or len(reader.pages) > 100:
        raise ValueError("PDF protegido ou excede 100 páginas")
    if (
        sum(len(objects) for objects in reader.xref.values()) + len(reader.xref_objStm)
        > 5000
    ):
        raise ValueError("PDF excede limite de objetos")
    # Examine decoded objects too: actions may be stored in compressed streams.
    forbidden = {
        "/JavaScript",
        "/JS",
        "/EmbeddedFiles",
        "/Launch",
        "/RichMedia",
        "/XFA",
        "/OpenAction",
        "/AA",
        "/EF",
    }
    active_actions = {
        "/Launch",
        "/JavaScript",
        "/URI",
        "/GoToR",
        "/GoToE",
        "/SubmitForm",
        "/ImportData",
        "/Rendition",
        "/Sound",
        "/Movie",
    }
    unsupported_forms = False
    decoded_size = 0
    decoded_streams = set()

    def name(obj, key):
        value = obj.get(key)
        return str(value.get_object() if hasattr(value, "get_object") else value)

    def inspect(obj, depth=0):
        nonlocal unsupported_forms, decoded_size
        if depth > 20:
            raise ValueError("Estrutura PDF profunda não suportada")
        if isinstance(obj, dict):
            if (
                forbidden.intersection(str(k) for k in obj)
                or name(obj, "/S") in active_actions
                or name(obj, "/Type") == "/EmbeddedFile"
                or name(obj, "/Subtype")
                in {"/RichMedia", "/Movie", "/Sound", "/3D", "/FileAttachment"}
            ):
                raise ValueError("Conteúdo ativo/embutido em PDF não suportado")
            if isinstance(obj, StreamObject) and id(obj) not in decoded_streams:
                decoded_streams.add(id(obj))
                subtype = name(obj, "/Subtype")
                if subtype == "/Form":
                    # Preserve passive originals; this v0 does not traverse forms.
                    unsupported_forms = True
                elif subtype != "/Image":
                    decoded_size += len(obj.get_data())
                    if decoded_size > MAX_EXPANDED:
                        raise ValueError("PDF excede limite cumulativo descompactado")
            for v in obj.values():
                if isinstance(v, (dict, list)):
                    inspect(v, depth + 1)
        elif isinstance(obj, list):
            for v in obj:
                inspect(v, depth + 1)

    for generation, objects in reader.xref.items():
        for object_id in objects:
            if object_id:
                from pypdf.generic import IndirectObject

                inspect(
                    reader.get_object(IndirectObject(object_id, generation, reader))
                )
    for object_id in reader.xref_objStm:
        from pypdf.generic import IndirectObject

        inspect(reader.get_object(IndirectObject(object_id, 0, reader)))
    pages = []
    expanded = 0
    for index, page in enumerate(reader.pages):
        if unsupported_forms:
            pages.append(
                {
                    "number": index + 1,
                    "text": "",
                    "status": "unsupported_native_layout_manual_only",
                }
            )
            continue
        contents = page.get_contents()
        expanded += len(contents.get_data()) if contents else 0
        if expanded > MAX_EXPANDED:
            raise ValueError("PDF excede limite de conteúdo descompactado")
        text = page.extract_text() or ""
        if len(text) > 100000:
            raise ValueError("Texto da página excede limite")
        pages.append(
            {
                "number": index + 1,
                "text": text,
                "status": (
                    "native_text_manual_only"
                    if text.strip()
                    else "scanned_or_no_native_text"
                ),
            }
        )
    return {
        "kind": "pdf",
        "tables": [],
        "pages": pages,
        "extraction": "manual_only_no_automatic_fields",
    }


def _pdf(data):
    from pypdf import apply_configuration

    with apply_configuration(
        maximum_declared_stream_length=MAX_BYTES,
        zlib_maximum_output_length=4 * 1024 * 1024,
        array_based_stream_maximum_output_length=4 * 1024 * 1024,
        lzw_maximum_output_length=4 * 1024 * 1024,
        run_length_maximum_output_length=4 * 1024 * 1024,
        page_tree_maximum_entries=500,
        page_tree_maximum_depth=20,
        xform_maximum_invocations_per_extraction=100,
        jbig2dec_binary=None,
    ):
        return _pdf_document(data)


def parse_file(data, filename):
    if not data or len(data) > MAX_BYTES:
        raise ValueError("Arquivo vazio ou excede 8 MiB")
    extension = filename.lower().rsplit(".", 1)[-1]
    if extension == "pdf" and data.startswith(b"%PDF-"):
        return _bounded_preview(_pdf(data))
    if extension == "xlsx" and data.startswith(b"PK\x03\x04"):
        return _bounded_preview(_xlsx(data))
    if extension == "csv":
        text = data.decode("utf-8-sig", errors="strict")
        if "\x00" in text:
            raise ValueError("Conteúdo não é CSV UTF-8")
        try:
            dialect = csv.Sniffer().sniff(text[:8000], delimiters=",;")
        except csv.Error as exc:
            raise ValueError(
                "CSV requer tabela com separador vírgula/ponto e vírgula"
            ) from exc
        matrix = []
        for cells in csv.reader(io.StringIO(text), dialect):
            if len(matrix) >= MAX_ROWS + 1:
                raise ValueError("Limite de 2000 linhas excedido")
            if len(cells) > 40 or any(len(cell) > 2000 for cell in cells):
                raise ValueError("Limite de colunas/tamanho da célula excedido")
            matrix.append(cells)
        return _bounded_preview(
            {
                "kind": "csv",
                "tables": [
                    _table(
                        "CSV", matrix, [f"CSV:row:{i+1}" for i in range(len(matrix))]
                    )
                ],
                "pages": [],
                "extraction": "tables_only",
            }
        )
    raise ValueError("Tipos aceitos: CSV UTF-8, XLSX comum e PDF")


def _bounded_preview(preview):
    size = 0
    for chunk in json.JSONEncoder(ensure_ascii=False).iterencode(preview):
        size += len(chunk.encode("utf-8"))
        if size > MAX_PREVIEW:
            raise ValueError("Prévia extraída excede 8 MiB")
    return preview


def _worker(connection, data, filename):
    import logging

    logging.disable(logging.CRITICAL)
    try:
        connection.send((True, parse_file(data, filename)))
    except Exception:
        # No document contents or parser details leave the isolation process.
        connection.send(
            (
                False,
                "Arquivo inválido/ativo, layout não suportado ou limite de processamento excedido",
            )
        )
    finally:
        connection.close()


def parse_isolated(data, filename, *, timeout=10):
    ctx = mp.get_context("spawn")
    parent, child = ctx.Pipe(duplex=False)
    process = ctx.Process(target=_worker, args=(child, data, filename), daemon=True)
    process.start()
    child.close()
    try:
        if not parent.poll(timeout):
            raise ValueError("Tempo de processamento excedido")
        try:
            ok, result = parent.recv()
        except (EOFError, OSError) as exc:
            raise ValueError("Processador do arquivo encerrou sem resultado") from exc
        if not ok:
            raise ValueError(result)
        return result
    finally:
        if process.is_alive():
            process.terminate()
        process.join(timeout=1)
        parent.close()
