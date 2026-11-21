import io
import zipfile
import pytest
from openpyxl import Workbook
from pypdf import PdfWriter
from pypdf.generic import DecodedStreamObject, NameObject
from app.services.ariadne_close_intake import (
    parse_file,
    parse_isolated,
    MAX_BYTES,
    MAX_EXPANDED,
    MAX_ROWS,
)
from app.services.ariadne_close import safe_csv


def xlsx_bytes(rows, *, extra_sheet=False):
    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "Inputs"
    for row in rows:
        sheet.append(row)
    if extra_sheet:
        sheet2 = workbook.create_sheet("Other")
        sheet2.append(["note"])
        sheet2.append(["synthetic"])
    stream = io.BytesIO()
    workbook.save(stream)
    return stream.getvalue()


def xlsx_hidden_variant(rows, target, value):
    """Controlled OOXML literals, independent of the writer's hidden encoding."""
    import xml.etree.ElementTree as ET

    namespace = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
    output = io.BytesIO()
    with zipfile.ZipFile(io.BytesIO(xlsx_bytes(rows))) as source, zipfile.ZipFile(
        output, "w"
    ) as result:
        for name in source.namelist():
            content = source.read(name)
            if name == "xl/worksheets/sheet1.xml":
                root = ET.fromstring(content)
                if target == "column":
                    cols = ET.Element(namespace + "cols")
                    element = ET.SubElement(cols, namespace + "col", min="1", max="40")
                    root.insert(
                        list(root).index(root.find(namespace + "sheetData")), cols
                    )
                else:
                    rows_xml = root.findall(
                        namespace + "sheetData/" + namespace + "row"
                    )
                    element = rows_xml[0 if target == "header" else 1]
                if value is not None:
                    element.set("hidden", value)
                content = ET.tostring(root, encoding="utf-8")
            result.writestr(name, content)
    return output.getvalue()


@pytest.mark.parametrize("target", ["row", "header", "column"])
@pytest.mark.parametrize("value", ["1", "true", " \ttrue\n"])
def test_hidden_boolean_true_layout_rejected(target, value):
    with pytest.raises(ValueError, match="ocult"):
        parse_file(
            xlsx_hidden_variant([["value", "blank"], ["250.125", None]], target, value),
            "hidden.xlsx",
        )


@pytest.mark.parametrize("target", ["row", "header", "column"])
@pytest.mark.parametrize("value", [None, "0", "false", " \tfalse\n"])
def test_visible_boolean_layout_preserves_raw_and_locators(target, value):
    table = parse_file(
        xlsx_hidden_variant([["value", "blank"], ["250.125", None]], target, value),
        "visible.xlsx",
    )["tables"][0]
    assert table["rows"][0]["values"] == {"value": "250.125", "blank": None}
    assert table["rows"][0]["cells"] == {"value": "Inputs!A2", "blank": "Inputs!B2"}


@pytest.mark.parametrize("target", ["row", "column"])
@pytest.mark.parametrize(
    "value", ["", "TRUE", "False", "2", "yes", "\u00a0false\u00a0"]
)
def test_invalid_hidden_boolean_rejected(target, value):
    with pytest.raises(ValueError, match="boolean"):
        parse_file(
            xlsx_hidden_variant([["value"], ["250.125"]], target, value), "invalid.xlsx"
        )


def pdf_bytes(native=True):
    writer = PdfWriter()
    page = writer.add_blank_page(width=300, height=300)
    if native:
        stream = DecodedStreamObject()
        stream.set_data(b"BT /F1 12 Tf 20 240 Td (SYNTHETIC ENGINEERING SOURCE) Tj ET")
        from pypdf.generic import DictionaryObject

        font = DictionaryObject(
            {
                NameObject("/Type"): NameObject("/Font"),
                NameObject("/Subtype"): NameObject("/Type1"),
                NameObject("/BaseFont"): NameObject("/Helvetica"),
            }
        )
        page[NameObject("/Resources")] = DictionaryObject(
            {
                NameObject("/Font"): DictionaryObject(
                    {NameObject("/F1"): writer._add_object(font)}
                )
            }
        )
        page[NameObject("/Contents")] = writer._add_object(stream)
    output = io.BytesIO()
    writer.write(output)
    return output.getvalue()


def test_ordinary_xlsx_sheets_cells_blanks_exact_raw():
    preview = parse_file(
        xlsx_bytes(
            [["value", "empty"], [250.125, None], [0, "literal"]], extra_sheet=True
        ),
        "ordinary.xlsx",
    )
    assert len(preview["tables"]) == 2
    row = preview["tables"][0]["rows"][0]
    assert row["values"] == {"value": "250.125", "empty": None}
    assert row["cells"]["value"] == "Inputs!A2"


def test_formula_rejected_even_with_excel_cached_values():
    with pytest.raises(ValueError):
        parse_file(xlsx_bytes([["value"], ["=1+1"]]), "formula.xlsx")


@pytest.mark.parametrize(
    "name",
    [
        "xl/vbaProject.bin",
        "xl/externalLinks/link.xml",
        "xl/embeddings/data.bin",
        "xl/activeX/active.xml",
    ],
)
def test_active_archive_rejected(name):
    raw = xlsx_bytes([["value"], [1]])
    stream = io.BytesIO(raw)
    with zipfile.ZipFile(stream, "a") as z:
        z.writestr(name, b"active")
    with pytest.raises(ValueError):
        parse_file(stream.getvalue(), "active.xlsx")


def test_zip_expansion_bound():
    stream = io.BytesIO()
    with zipfile.ZipFile(stream, "w", compression=zipfile.ZIP_DEFLATED) as z:
        z.writestr("big", b"0" * (MAX_EXPANDED + 1))
    with pytest.raises(ValueError):
        parse_file(stream.getvalue(), "bomb.xlsx")


def test_csv_comma_decimal_delimiter_and_formula_text_preserved():
    preview = parse_file(b"amount;item_key\n250,50;=HYPERLINK(evil)\n", "source.csv")
    assert preview["tables"][0]["rows"][0]["values"]["amount"] == "250,50"
    assert safe_csv("=HYPERLINK(evil)").startswith("'")
    assert safe_csv("-500.00") == "'-500.00"


@pytest.mark.parametrize(
    "data,name",
    [
        (b"MZ executable", "file.pdf"),
        (b"\x00fake", "file.csv"),
        (b"", "file.csv"),
        (b"x" * (MAX_BYTES + 1), "file.csv"),
        (b"a,b\n1\n", "file.csv"),
    ],
    ids=["signature", "binary", "empty", "oversized", "ragged"],
)
def test_invalid_or_oversized(data, name):
    with pytest.raises((ValueError, UnicodeError)):
        parse_file(data, name)


def test_row_limit():
    with pytest.raises(ValueError):
        parse_file(b"a\n" + b"1\n" * 2001, "file.csv")


def test_pdf_native_and_scanned_are_manual_only():
    native = parse_file(pdf_bytes(), "source.pdf")
    scanned = parse_file(pdf_bytes(False), "scan.pdf")
    assert "SYNTHETIC" in native["pages"][0]["text"]
    assert native["extraction"] == "manual_only_no_automatic_fields"
    assert scanned["pages"][0]["status"] == "scanned_or_no_native_text"


def test_pdf_active_rejected():
    writer = PdfWriter()
    writer.add_blank_page(300, 300)
    writer.add_js("app.alert('x')")
    output = io.BytesIO()
    writer.write(output)
    with pytest.raises(ValueError):
        parse_file(output.getvalue(), "active.pdf")


def test_parser_timeout_kills_process():
    with pytest.raises(ValueError, match="Tempo"):
        parse_isolated(b"a,b\n1,2\n", "source.csv", timeout=0)


@pytest.mark.parametrize(
    "mutation", ["duplicate_cell", "duplicate_row", "out_of_order"]
)
def test_ooxml_ambiguous_locators_cannot_overwrite_evidence(mutation):
    raw = xlsx_bytes([["amount"], [10], [20]])
    result = io.BytesIO()
    with zipfile.ZipFile(io.BytesIO(raw)) as source, zipfile.ZipFile(
        result, "w"
    ) as target:
        for name in source.namelist():
            data = source.read(name)
            if name == "xl/worksheets/sheet1.xml":
                if mutation == "duplicate_cell":
                    data = data.replace(
                        b'</c></row><row r="3">',
                        b'</c><c r="A2" t="n"><v>999</v></c></row><row r="3">',
                    )
                elif mutation == "duplicate_row":
                    data = data.replace(b'<row r="3">', b'<row r="2">').replace(
                        b'r="A3"', b'r="A2"'
                    )
                else:
                    data = data.replace(b'<row r="2">', b'<row r="4">').replace(
                        b'r="A2"', b'r="A4"'
                    )
            target.writestr(name, data)
    with pytest.raises(ValueError):
        parse_file(result.getvalue(), "ambiguous.xlsx")


@pytest.mark.parametrize("encoding", ["utf-8", "utf-16", "utf-16-le", "utf-16-be"])
def test_xml_entity_rejected_before_expansion_in_every_supported_encoding(encoding):
    from app.services.ariadne_close_intake import _xml

    content = '<?xml version="1.0"?><!DOCTYPE root [<!ENTITY private "expanded">]><root>&private;</root>'
    with pytest.raises(ValueError, match="DTD"):
        _xml(content.encode(encoding))


@pytest.mark.parametrize("name", ["x" * 32, "bad/name"])
def test_oversized_sheet_locator_name_rejected_before_amplification(name):
    raw = xlsx_bytes([["amount"], [10]])
    output = io.BytesIO()
    with zipfile.ZipFile(io.BytesIO(raw)) as source, zipfile.ZipFile(
        output, "w"
    ) as target:
        for filename in source.namelist():
            content = source.read(filename)
            if filename == "xl/workbook.xml":
                content = content.replace(b'name="Inputs"', f'name="{name}"'.encode())
            target.writestr(filename, content)
    with pytest.raises(ValueError, match="Nome de planilha"):
        parse_file(output.getvalue(), "huge-name.xlsx")


def test_serialized_preview_limit_counts_utf8_bytes():
    from app.services.ariadne_close_intake import _bounded_preview, MAX_PREVIEW

    with pytest.raises(ValueError, match="Prévia"):
        _bounded_preview({"text": "ç" * (MAX_PREVIEW // 2)})


def test_csv_million_row_input_stops_reader_at_the_bound(monkeypatch):
    import app.services.ariadne_close_intake as intake

    original = intake.csv.reader
    consumed = []

    def counted(*args, **kwargs):
        for row in original(*args, **kwargs):
            consumed.append(1)
            yield row

    monkeypatch.setattr(intake.csv, "reader", counted)
    with pytest.raises(ValueError, match="2000"):
        parse_file(b"a,b\n" + b"1,2\n" * 1000000, "many.csv")
    assert len(consumed) == MAX_ROWS + 2


@pytest.mark.parametrize("index", ["-1", "1", "+0"])
def test_invalid_ooxml_shared_string_index_cannot_substitute_evidence(index):
    raw = xlsx_bytes([["amount"], [250]])
    output = io.BytesIO()
    with zipfile.ZipFile(io.BytesIO(raw)) as source, zipfile.ZipFile(
        output, "w"
    ) as target:
        for name in source.namelist():
            content = source.read(name)
            if name == "xl/worksheets/sheet1.xml":
                content = content.replace(
                    b't="n"><v>250</v>', f't="s"><v>{index}</v>'.encode()
                )
            target.writestr(name, content)
        target.writestr(
            "xl/sharedStrings.xml",
            '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><si><t>unrelated</t></si></sst>',
        )
    with pytest.raises(ValueError, match="Índice"):
        parse_file(output.getvalue(), "invalid-index.xlsx")


@pytest.mark.parametrize(
    "action", ["/Launch", "/JavaScript", "/URI", "/GoToR", "/SubmitForm"]
)
@pytest.mark.parametrize("indirect", [False, True])
def test_pdf_action_dictionary_values_are_rejected_without_execution(action, indirect):
    from pypdf.generic import DictionaryObject

    writer = PdfWriter()
    writer.add_blank_page(300, 300)
    kind = NameObject(action)
    if indirect:
        kind = writer._add_object(kind)
    writer._add_object(DictionaryObject({NameObject("/S"): kind}))
    output = io.BytesIO()
    writer.write(output)
    with pytest.raises(ValueError, match="ativo"):
        parse_file(output.getvalue(), "action.pdf")


def test_pdf_reusable_forms_are_preserved_but_native_extraction_is_isolated(
    monkeypatch,
):
    from pypdf.generic import DictionaryObject
    from pypdf._page import PageObject

    writer = PdfWriter()
    page = writer.add_blank_page(300, 300)
    resources = DictionaryObject()
    for index in range(12):
        stream = DecodedStreamObject()
        stream.set_data(b" " * (2 * 1024 * 1024))
        encoded = stream.flate_encode()
        encoded[NameObject("/Subtype")] = NameObject("/Form")
        resources[NameObject(f"/F{index}")] = writer._add_object(encoded)
    page[NameObject("/Resources")] = DictionaryObject(
        {NameObject("/XObject"): resources}
    )
    content = DecodedStreamObject()
    content.set_data(b" ".join(f"/F{index} Do".encode() for index in range(12)))
    page[NameObject("/Contents")] = writer._add_object(content)
    output = io.BytesIO()
    writer.write(output)

    def should_not_extract(*args, **kwargs):
        raise AssertionError("unsupported Form extraction must not execute")

    monkeypatch.setattr(PageObject, "extract_text", should_not_extract)
    preview = parse_file(output.getvalue(), "forms.pdf")
    assert preview["pages"][0]["status"] == "unsupported_native_layout_manual_only"
    assert preview["pages"][0]["text"] == ""


def test_pdf_cumulative_non_image_stream_expansion_is_bounded():
    writer = PdfWriter()
    writer.add_blank_page(300, 300)
    for _ in range(8):
        stream = DecodedStreamObject()
        stream.set_data(b" " * (3 * 1024 * 1024))
        writer._add_object(stream.flate_encode())
    output = io.BytesIO()
    writer.write(output)
    with pytest.raises(ValueError, match="cumulativo"):
        parse_file(output.getvalue(), "expanded.pdf")
