"""Synthetic UI evidence only; not a client case, authority or Golden Dataset.

Writes ordinary source files outside Git. The known PDF layout is deliberately
constructed, with physical page 14 and a missing identity/period example.
No application calculation is imported to generate expected answers.
"""

import io
import json
import os
import sys
import tempfile
import uuid
from pathlib import Path
from pypdf import PdfWriter
from pypdf.generic import DictionaryObject, NameObject, DecodedStreamObject


def synthetic_pdf():
    writer = PdfWriter()
    for number in range(1, 15):
        page = writer.add_blank_page(width=1000, height=1000)
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
        cells = [
            (30, 980, f"SYNTHETIC ENGINEERING FIXTURE - PAGE {number} - NOT AN INVOICE")
        ]
        if number in (11, 12, 13, 14):
            period, demand, start, end = {
                11: ("UNKNOWN", "270.00", "15/02/2019", "14/03/2019"),
                12: ("11/2019", "300.96", "15/10/2019", "14/11/2019"),
                13: ("06/2019", "260.64", "15/05/2019", "14/06/2019"),
                14: ("02/2020", "294.48", "15/01/2020", "14/02/2020"),
            }[number]
            cells += [
                (50, 950, "A4 HOROSAZONAL VERDE - SYNTHETIC UNIT"),
                (
                    50,
                    935,
                    (
                        "CNPJ 07047251000170"
                        if number != 12
                        else "DISTRIBUTOR IDENTITY MISSING"
                    ),
                ),
                (350, 910, start),
                (450, 910, end),
                (500, 746, demand),
                (565, 746, "176.40"),
                (500, 740, "280.00"),
                (560, 740, "280.00"),
                (670, 330, "280.00"),
                (700, 330, "280.00"),
                (700, 180, period),
                (760, 212, "123456"),
                (500, 212, f"1234567890{number:04d}"),
                (50, 100, "838123456"),
            ]
        stream = DecodedStreamObject()
        stream.set_data(
            "\n".join(
                f"BT /F1 9 Tf {x} {y} Td ({text}) Tj ET" for x, y, text in cells
            ).encode("ascii")
        )
        page[NameObject("/Contents")] = writer._add_object(stream)
    output = io.BytesIO()
    writer.write(output)
    return output.getvalue()


def prepare_legacy_run():
    """Optional Core regression fixture, only in the explicitly named disposable DB."""
    from sqlalchemy import create_engine, select
    from sqlalchemy.engine import make_url
    from sqlalchemy.orm import Session
    from app.db.models.ariadne_core import AriadneResult, AriadneModelVersion
    from app.services import ariadne_core as core, ariadne_planning_engine as old

    url = make_url(os.environ["DATABASE_URL"])
    if (url.host, url.port, url.database) != (
        "127.0.0.1",
        55472,
        "ariadne_close_ux_isolated_browser_20261117",
    ):
        raise ValueError(
            "Legacy fixture requires the documented disposable UX database"
        )
    manifest = Path(tempfile.gettempdir()) / "ariadne-ux-isolated-manifest.json"
    data = json.loads(manifest.read_text())
    if data.get("legacy"):
        print("Existing legacy fixture retained")
        return
    engine = create_engine(url)
    with Session(engine) as db:
        result = db.get(AriadneResult, uuid.UUID(data["scenario"]))
        chain = core.reconstruct_result_lineage(
            db, tenant_id=result.tenant_id, result_id=result.id
        )
        version = db.scalar(
            select(AriadneModelVersion).where(
                AriadneModelVersion.model_definition_id == chain.model_definition.id,
                AriadneModelVersion.semantic_version == old.VERSION,
            )
        )
        if not version:
            version = core.create_model_version(
                db,
                tenant_id=result.tenant_id,
                model_definition_id=chain.model_definition.id,
                semantic_version=old.VERSION,
                implementation_identity=old.IMPLEMENTATION,
                input_contract=old.INPUT_CONTRACT,
                output_contract=old.OUTPUT_CONTRACT,
            )
        run = core.execute_scenario(
            db,
            tenant_id=result.tenant_id,
            scenario_id=chain.scenario.id,
            model_version_id=version.id,
            execution_configuration=old.POLICY,
        )
        data["legacy"] = str(run.result.id)
        db.commit()
    manifest.write_text(json.dumps(data, indent=2))
    engine.dispose()
    print("Prepared synthetic retained 0.1.0 run")


if __name__ == "__main__":
    if "--legacy" in sys.argv:
        prepare_legacy_run()
        raise SystemExit(0)
    destination = Path(tempfile.gettempdir()) / "ariadne-ux-isolated-synthetic"
    destination.mkdir(parents=True, exist_ok=True)
    (destination / "synthetic-demand-original.pdf").write_bytes(synthetic_pdf())
    (destination / "synthetic-tariff.csv").write_text(
        "supplier_cnpj,subgroup,modality,class,subclass,detail,time_band,unit,rate,currency,basis,effective_from,effective_to,authority,reference_id,rate_kind\n"
        "07047251000170,A4,Verde,Não se aplica,Não se aplica,Não se aplica,Não se aplica,kW,15.20,BRL,PRE_TAX_REFERENCE,2019-04-22,2020-04-21,SYNTHETIC ENGINEERING ONLY,TEST-UX,OFFICIAL_TARIFF_REFERENCE\n",
        encoding="utf-8",
    )
    print(destination)
