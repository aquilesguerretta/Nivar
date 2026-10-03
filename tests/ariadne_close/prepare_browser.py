"""Generate synthetic local browser files, never a real Golden Dataset."""

import csv
import io
import tempfile
from pathlib import Path
from openpyxl import Workbook
from pypdf import PdfWriter
from pypdf.generic import DictionaryObject, NameObject, DecodedStreamObject

DESTINATION = Path(tempfile.gettempdir()) / "ariadne-close-synthetic-browser"
FIXTURES = Path(__file__).parent / "fixtures"


def document(native=True):
    writer = PdfWriter()
    for number in (1, 2):
        page = writer.add_blank_page(width=420, height=595)
        if native:
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
            content = DecodedStreamObject()
            content.set_data(
                f"BT /F1 12 Tf 20 500 Td (SYNTHETIC ENGINEERING PAGE {number} - MANUAL REVIEW ONLY) Tj ET".encode()
            )
            page[NameObject("/Contents")] = writer._add_object(content)
    output = io.BytesIO()
    writer.write(output)
    return output.getvalue()


def prepare():
    DESTINATION.mkdir(parents=True, exist_ok=True)
    (DESTINATION / "invalid-metadata.csv").write_text(
        "item_key,component,scope,period,currency,tax_basis,amount\n,energy,SYNTHETIC-UNIT,2026-09,BRL,exclusive,100\nforeign-currency,energy,SYNTHETIC-UNIT,2026-09,USD,exclusive,100\nmissing-component,,SYNTHETIC-UNIT,2026-09,BRL,exclusive,100\n",
        encoding="utf-8",
    )
    book = Workbook()
    sheet = book.active
    sheet.title = "Reviewed prices"
    for row in csv.reader((FIXTURES / "price.csv").read_text().splitlines()):
        sheet.append(row)
    book.save(DESTINATION / "price.xlsx")
    (DESTINATION / "context.pdf").write_bytes(document())
    (DESTINATION / "scanned.pdf").write_bytes(document(False))
    original = (FIXTURES / "invoice.csv").read_text()
    (DESTINATION / "invoice-revised.csv").write_text(
        original.replace("26000", "25000"), encoding="utf-8"
    )
    (DESTINATION / "ambiguous.csv").write_text(
        "item_key,component,scope,period,currency,tax_basis,amount\nwrong,energy,WRONG,2026-13,BRL,exclusive,\nblank,energy,SYNTHETIC-UNIT,2026-09,BRL,exclusive,\nambiguous,energy,SYNTHETIC-UNIT,2026-09,BRL,exclusive,1.000\n",
        encoding="utf-8",
    )
    (DESTINATION / "long.csv").write_text(
        "item_key,component,scope,period,currency,tax_basis,amount\n"
        + "SYNTHETIC-LONG-" * 80
        + ",unsupported,SYNTHETIC-UNIT,2026-09,BRL,exclusive,100\n",
        encoding="utf-8",
    )
    print(DESTINATION)


if __name__ == "__main__":
    prepare()
