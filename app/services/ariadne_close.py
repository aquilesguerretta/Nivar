"""Task-oriented batch orchestration over exact immutable Ariadne Core records."""

from __future__ import annotations
import csv
import hashlib
import io
import json
import uuid
import zipfile
from collections import defaultdict
from sqlalchemy import select, func, cast, Text
from sqlalchemy.orm import defer
from app.db.models.ariadne_close import (
    CloseReview,
    CloseSource,
    CloseReceipt,
    CloseTreatment,
    ClosePackage,
)
from app.db.models.ariadne_core import (
    AriadneModelDefinition,
    AriadneModelVersion,
    AriadneResult,
    AriadnePrivateStateVersion,
)
from app.db.models.ariadne_operator import AriadneOperatorWorkspace
from app.services import ariadne_core as core
from app.services import ariadne_close_engine as engine
from app.services.ariadne_operator import tenant_id_for


class Conflict(ValueError):
    pass


def _json(value):
    return json.dumps(value, sort_keys=True, ensure_ascii=False, separators=(",", ":"))


def write_once(db, workspace, key, operation, body, action):
    # Lock precedes receipt lookup: simultaneous retries cannot both commit.
    db.execute(
        select(AriadneOperatorWorkspace)
        .where(AriadneOperatorWorkspace.id == workspace.id)
        .with_for_update()
    ).scalar_one()
    fingerprint = hashlib.sha256(
        _json({"operation": operation, "body": body}).encode()
    ).hexdigest()
    receipt = db.get(CloseReceipt, (workspace.id, key))
    if receipt:
        if receipt.fingerprint != fingerprint:
            raise Conflict("Chave de tentativa já usada com outros dados")
        return receipt.response
    response = action()
    db.add(
        CloseReceipt(
            workspace_id=workspace.id,
            request_key=key,
            fingerprint=fingerprint,
            response=response,
        )
    )
    db.flush()
    return response


def review_row(db, workspace, review_id):
    row = db.execute(
        select(CloseReview).where(
            CloseReview.id == review_id, CloseReview.workspace_id == workspace.id
        )
    ).scalar_one_or_none()
    if row is None:
        raise LookupError("Revisão não encontrada")
    return row


def source_row(db, workspace, review_id, source_id):
    review_row(db, workspace, review_id)
    row = db.execute(
        select(CloseSource).where(
            CloseSource.id == source_id,
            CloseSource.review_id == review_id,
            CloseSource.workspace_id == workspace.id,
        )
    ).scalar_one_or_none()
    if row is None:
        raise LookupError("Fonte não encontrada")
    return row


def review_payload(row):
    return {
        "id": str(row.id),
        "scope": row.scope,
        "period": row.period,
        "createdAt": row.created_at.isoformat(),
    }


def start_review(db, workspace, scope, period, rule_version="0.1.0"):
    from app.services import ariadne_close_engine_v2

    executor = engine if rule_version == engine.VERSION else ariadne_close_engine_v2
    if rule_version != executor.VERSION:
        raise ValueError("Versão de regra não suportada")
    existing = db.execute(
        select(CloseReview).where(
            CloseReview.workspace_id == workspace.id,
            CloseReview.scope == scope,
            CloseReview.period == period,
        )
    ).scalar_one_or_none()
    if existing:
        from app.db.models.ariadne_core import AriadneAssumptionSetVersion

        policy = (
            db.execute(
                select(AriadneAssumptionSetVersion).where(
                    AriadneAssumptionSetVersion.assumption_set_id
                    == existing.assumption_set_id,
                    AriadneAssumptionSetVersion.version == 1,
                )
            )
            .scalar_one()
            .values
        )
        if policy != {"policy": executor.POLICY}:
            raise Conflict(
                "Revisão já preservada com outra versão de regra; abra uma nova revisão privada"
            )
        return review_payload(existing)
    tenant = tenant_id_for(workspace.id)
    obj = core.create_private_object(
        db, tenant_id=tenant, object_type="assisted_close_period"
    )
    assumptions = core.create_assumption_set(
        db, tenant_id=tenant, name=f"assisted_close: {period} {scope}"
    )
    core.create_assumption_set_version(
        db,
        tenant_id=tenant,
        assumption_set_id=assumptions.id,
        values={"policy": executor.POLICY},
        origin="rule",
        value_schema={"policy": {"type": "object"}},
    )
    row = CloseReview(
        workspace_id=workspace.id,
        tenant_id=tenant,
        scope=scope,
        period=period,
        object_id=obj.id,
        assumption_set_id=assumptions.id,
    )
    db.add(row)
    db.flush()
    return review_payload(row)


def require_inspection_review(db, review):
    from app.db.models.ariadne_core import AriadneAssumptionSetVersion
    from app.services import ariadne_close_engine_v2

    policy = (
        db.execute(
            select(AriadneAssumptionSetVersion).where(
                AriadneAssumptionSetVersion.assumption_set_id
                == review.assumption_set_id,
                AriadneAssumptionSetVersion.version == 1,
            )
        )
        .scalar_one()
        .values
    )
    if policy != {"policy": ariadne_close_engine_v2.POLICY}:
        raise Conflict(
            "Revisão histórica usa a regra anterior; importe pela interface avançada ou abra uma nova revisão privada"
        )


def import_source(
    db, workspace, review, *, data, filename, role, preview, supersedes_id=None
):
    digest = hashlib.sha256(data).hexdigest()
    existing = db.execute(
        select(CloseSource)
        .options(defer(CloseSource.original))
        .where(
            CloseSource.review_id == review.id,
            CloseSource.role == role,
            CloseSource.sha256 == digest,
        )
    ).scalar_one_or_none()
    if existing:
        if supersedes_id and existing.supersedes_id != supersedes_id:
            raise Conflict(
                "Arquivo duplicado não pode substituir outra fonte; revise a associação"
            )
        if existing.preview.get("parserVersion") != preview.get(
            "parserVersion"
        ) or existing.preview.get("provenance") != preview.get("provenance"):
            raise Conflict(
                "Arquivo já importado com outra inspeção/proveniência; mantenha a versão original"
            )
        return {"id": str(existing.id), "duplicate": True}
    count, total = db.execute(
        select(
            func.count(CloseSource.id),
            func.coalesce(
                func.sum(
                    func.octet_length(CloseSource.original)
                    + func.octet_length(cast(CloseSource.preview, Text))
                ),
                0,
            ),
        ).where(CloseSource.review_id == review.id)
    ).one()
    preview_size = len(json.dumps(preview, ensure_ascii=False).encode("utf-8"))
    if count >= 64 or total + len(data) + preview_size > 64 * 1024 * 1024:
        raise ValueError("Limite de fontes/64 MiB por revisão excedido")
    if supersedes_id:
        old = source_row(db, workspace, review.id, supersedes_id)
        if old.role != role:
            raise ValueError("Correção precisa manter o papel da fonte")
        if db.execute(
            select(CloseSource.id).where(CloseSource.supersedes_id == old.id)
        ).first():
            raise Conflict("Fonte já substituída; selecione a revisão atual")
    source_id = uuid.uuid4()
    obj = core.create_private_object(
        db, tenant_id=review.tenant_id, object_type="assisted_close_batch"
    )
    evidence = core.create_evidence_ref(
        db,
        tenant_id=review.tenant_id,
        source_artifact_id=str(source_id),
        source_version=digest,
        locator="original",
        transform_ref=preview.get("parserVersion", "ariadne.tables.v1 / manual PDF"),
    )
    content_type = {
        "csv": "text/csv",
        "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "pdf": "application/pdf",
    }[preview["kind"]]
    source = CloseSource(
        id=source_id,
        workspace_id=workspace.id,
        review_id=review.id,
        tenant_id=review.tenant_id,
        object_id=obj.id,
        evidence_id=evidence.id,
        role=role,
        filename=filename,
        sha256=digest,
        original=data,
        preview=preview,
        content_type=content_type,
        supersedes_id=supersedes_id,
    )
    db.add(source)
    db.flush()
    return {"id": str(source.id), "duplicate": False}


def candidates(source, review, body):
    mode = body.get("reviewMode", "table")
    if mode in ("demand_profile", "tariff_reference"):
        field, role = (
            ("demandProfile", "invoice")
            if mode == "demand_profile"
            else ("tariffReferences", "context")
        )
        if source.role != role or not source.preview.get(field):
            raise ValueError("Layout de planejamento não disponível para esta fonte")
        rows = []
        for original in source.preview[field]:
            row = {**original, "errors": list(original["errors"])}
            if mode == "demand_profile" and row.get("scope") != review.scope:
                row["errors"].append("Unidade diverge da revisão")
            row["validation"] = "invalid" if row["errors"] else "valid"
            rows.append(row)
        return rows
    if mode == "context":
        if source.role != "context":
            raise ValueError("Reconhecimento contextual exige fonte de contexto")
        return [
            {
                "index": i + 1,
                "locator": r["locator"],
                "raw": r["values"],
                "cells": r.get("cells", {}),
                "errors": [],
                "validation": "context_only",
                "recordKind": "context_acknowledgement",
            }
            for i, r in enumerate(
                [r for t in source.preview["tables"] for r in t["rows"]]
            )
        ]
    if mode == "observations":
        if source.role != "invoice" or not source.preview.get("observations"):
            raise ValueError("Fonte sem observações de fatura no layout implementado")
        proposal = source.preview["proposal"]
        errors = (
            []
            if proposal.get("scope") == review.scope
            and proposal.get("period") == review.period
            else ["Escopo/período proposto diverge da revisão"]
        )
        return [
            {
                **r,
                "recordKind": "invoice_observation",
                "raw": {"snippet": r["snippet"]},
                "cells": {},
                "errors": errors,
                "validation": "invalid" if errors else "valid",
            }
            for r in source.preview["observations"]
        ]
    mapping = body["mapping"]
    if set(mapping) - set(engine.FIELDS):
        raise ValueError("Campos de mapeamento não suportados")
    if source.preview["kind"] == "pdf":
        rows = body.get("manualRows", [])
        if not rows or len(rows) > 50:
            raise ValueError("PDF requer 1–50 registros manuais com página")
        table_rows = []
        for i, manual in enumerate(rows):
            if set(manual) - {*engine.FIELDS, "page"}:
                raise ValueError("Campo manual não suportado")
            if any(
                value is not None and (not isinstance(value, str) or len(value) > 2000)
                for field, value in manual.items()
                if field != "page"
            ):
                raise ValueError(
                    "Valores manuais exigem texto limitado; decimais devem ser strings exatas"
                )
            page = manual.get("page")
            if (
                isinstance(page, bool)
                or not isinstance(page, int)
                or not 1 <= page <= len(source.preview["pages"])
            ):
                raise ValueError("Página de origem obrigatória")
            table_rows.append(
                {
                    "index": i + 1,
                    "values": {f: manual.get(f) for f in engine.FIELDS},
                    "locator": f"page:{page}/manual:{i+1}",
                    "cells": {},
                    "numericColumns": [],
                }
            )
        mapping = {f: f for f in engine.FIELDS}
    else:
        tables = source.preview["tables"]
        table = next((t for t in tables if t["name"] == body["sheet"]), None)
        if table is None or set(mapping.values()) - set(table["columns"]):
            raise ValueError("Planilha/coluna desconhecida")
        table_rows = table["rows"]
    normalized = []
    defaults = body.get("defaults", {})
    if set(defaults) - {
        "scope",
        "period",
        "currency",
        "component",
        "tax_basis",
        "quantity_unit",
        "price_unit",
        "invoice_id",
        "row_type",
    }:
        raise ValueError("Valores padrão não suportados")
    for raw in table_rows:
        values = {f: raw["values"].get(mapping.get(f)) for f in engine.FIELDS}
        origins = {}
        if source.preview.get("parserVersion") == "ariadne.inspect.v2":
            import re

            for field in ("amount", "quantity", "price"):
                value = values.get(field)
                mode = body["numericMode"]
                if isinstance(value, str) and (
                    (
                        mode == "comma"
                        and re.fullmatch(r"[+-]?\d{1,3}(?:\.\d{3})+,\d+", value.strip())
                    )
                    or (
                        mode == "dot"
                        and re.fullmatch(r"[+-]?\d{1,3}(?:,\d{3})+\.\d+", value.strip())
                    )
                ):
                    values[field] = value.replace("." if mode == "comma" else ",", "")
                    origins[field] = (
                        "operator-confirmed grouped decimal / ariadne.inspect.v2"
                    )
        for field, value in defaults.items():
            if values.get(field) in (None, ""):
                values[field] = value
                origins[field] = "operator-confirmed batch context"
        # OOXML numeric cells have an invariant dot decimal lexical form.
        numeric = {
            f
            for f in ("quantity", "amount", "price")
            if mapping.get(f) in raw.get("numericColumns", [])
        }
        row = engine.normalize_row(
            values,
            role=source.role,
            mode=body["numericMode"],
            review={"scope": review.scope, "period": review.period},
            locator=raw["locator"],
            numeric_fields=numeric,
        )
        row["validation"] = "invalid" if row["errors"] else "valid"
        row["errors"].extend(raw.get("issues", []))
        if row["row_type"] == "subtotal" and source.preview.get("parserVersion"):
            if len(source.preview["tables"]) > 1 or any(
                s.get("unclassifiedCells") for s in source.preview.get("sheets", [])
            ):
                row["errors"].append(
                    "Completude não estabelecida: regiões/células fora da seleção; subtotal não elegível"
                )
        row["validation"] = "invalid" if row["errors"] else "valid"
        row["valueOrigins"] = origins
        row.update(index=raw["index"], raw=raw["values"], cells=raw.get("cells", {}))
        normalized.append(row)
    return normalized


def confirm_source(db, workspace, review, source, body):
    current = core.get_current_state_version(
        db, tenant_id=review.tenant_id, object_id=source.object_id
    )
    previous = str(current.id) if current else None
    if body.get("previousConfirmationVersionId") != previous:
        raise Conflict("Confirmação avançou; releia antes de corrigir")
    rows = candidates(source, review, body)
    selected = set(body["selectedRows"])
    if selected - {r["index"] for r in rows}:
        raise ValueError("Seleção contém linha desconhecida")
    if any(r["errors"] for r in rows if r["index"] in selected):
        raise ValueError("Linhas inválidas/ambíguas não podem ser confirmadas")
    for row in rows:
        row["planningConfirmed"] = (
            row["index"] in selected and row.get("recordKind") == "tariff_reference"
        )
        row["eligible"] = row["index"] in selected and source.role != "context"
        row["humanConfirmation"] = (
            "acknowledged_context"
            if source.role == "context"
            else "confirmed" if row["eligible"] else "excluded"
        )
    payload = {
        "rows": rows,
        "mapping": body["mapping"],
        "sheet": body["sheet"],
        "numericMode": body["numericMode"],
        "manualRows": body.get("manualRows", []),
        "normalizationVersion": source.preview.get(
            "parserVersion", engine.POLICY["normalization"]
        ),
        "sourceId": str(source.id),
        "sourceVersion": source.sha256,
        "reviewMode": body.get("reviewMode", "table"),
        "defaults": body.get("defaults", {}),
    }
    evidence_ids = [source.evidence_id]
    for row in rows:
        evidence = core.create_evidence_ref(
            db,
            tenant_id=review.tenant_id,
            source_artifact_id=str(source.id),
            source_version=source.sha256,
            locator=row["locator"],
            transform_ref=payload["normalizationVersion"],
        )
        evidence_ids.append(evidence.id)
    state = core.create_state_version(
        db,
        tenant_id=review.tenant_id,
        object_id=source.object_id,
        payload=payload,
        evidence_ref_ids=evidence_ids,
    )
    return {
        "id": str(state.id),
        "version": state.version,
        "confirmedRows": sum(r["eligible"] for r in rows),
    }


def _source_payload(db, source):
    state = core.get_current_state_version(
        db, tenant_id=source.tenant_id, object_id=source.object_id
    )
    if state and (
        not isinstance(state.payload.get("rows"), list)
        or state.payload.get("sourceId") != str(source.id)
        or state.payload.get("sourceVersion") != source.sha256
    ):
        raise ValueError("Versão de confirmação não pertence ao contrato de intake")
    return {
        "id": str(source.id),
        "role": source.role,
        "filename": source.filename,
        "sha256": source.sha256,
        "kind": source.preview["kind"],
        "preview": source.preview,
        "supersedesId": str(source.supersedes_id) if source.supersedes_id else None,
        "confirmationVersionId": str(state.id) if state else None,
        "confirmation": state.payload if state else None,
    }


def list_sources(db, review):
    sources = list(
        db.execute(
            select(CloseSource)
            .options(defer(CloseSource.original))
            .where(CloseSource.review_id == review.id)
            .order_by(CloseSource.created_at, CloseSource.id)
        ).scalars()
    )
    return [_source_payload(db, s) for s in sources]


def _model(db, tenant, executor=engine):
    definition = db.execute(
        select(AriadneModelDefinition).where(
            AriadneModelDefinition.tenant_id == tenant,
            AriadneModelDefinition.name == engine.MODEL,
        )
    ).scalar_one_or_none()
    if not definition:
        definition = core.create_model_definition(
            db, tenant_id=tenant, name=engine.MODEL
        )
    version = db.execute(
        select(AriadneModelVersion).where(
            AriadneModelVersion.model_definition_id == definition.id,
            AriadneModelVersion.semantic_version == executor.VERSION,
        )
    ).scalar_one_or_none()
    if not version:
        version = core.create_model_version(
            db,
            tenant_id=tenant,
            model_definition_id=definition.id,
            semantic_version=executor.VERSION,
            implementation_identity=executor.IMPLEMENTATION,
            input_contract=executor.INPUT_CONTRACT,
            output_contract=executor.OUTPUT_CONTRACT,
        )
    return version


def calculate(db, workspace, review, expected_versions):
    sources = list_sources(db, review)
    actual = {s["id"]: s["confirmationVersionId"] for s in sources}
    if expected_versions != actual:
        raise Conflict("Fontes/confirmações avançaram; releia a revisão")
    superseded = {s["supersedesId"] for s in sources if s["supersedesId"]}
    records, evidence_ids = [], []
    for source in sources:
        source["superseded"] = source["id"] in superseded
        if source["superseded"]:
            continue
        entity = source_row(db, workspace, review.id, uuid.UUID(source["id"]))
        evidence_ids.append(entity.evidence_id)
        if source["confirmation"]:
            rows = source["confirmation"]["rows"]
        elif source["kind"] != "pdf":
            rows = []
            for table in source["preview"]["tables"]:
                rows.extend(
                    candidates(
                        entity,
                        review,
                        {
                            "mapping": table["proposedMapping"],
                            "sheet": table["name"],
                            "numericMode": "strict",
                        },
                    )
                )
        else:
            rows = []
        for row in rows:
            unselected_sheets = [
                t["name"]
                for t in source["preview"]["tables"]
                if source["confirmation"]
                and t["name"] != source["confirmation"]["sheet"]
            ]
            records.append(
                {
                    **row,
                    "eligible": bool(row.get("eligible")),
                    "record_id": f"{source['id']}:{row['locator']}",
                    "source_id": source["id"],
                    "role": source["role"],
                    "sha256": source["sha256"],
                    "confirmation_version_id": source["confirmationVersionId"],
                    "unselected_sheets": unselected_sheets,
                }
            )
    if not evidence_ids or not any(r["role"] == "invoice" for r in records):
        raise ValueError("Importe pelo menos uma tabela/registro de faturamento")
    if len(records) > 8000:
        raise ValueError("Limite de 8000 registros por cálculo excedido")
    state = core.create_state_version(
        db,
        tenant_id=review.tenant_id,
        object_id=review.object_id,
        payload={
            "review": {**review_payload(review), "synthetic": workspace.synthetic},
            "sources": sources,
            "records": records,
        },
        evidence_ref_ids=evidence_ids,
    )
    # The assumption chain is fixed by this workflow; no latest substitution in replay.
    from app.db.models.ariadne_core import AriadneAssumptionSetVersion

    assumption = db.execute(
        select(AriadneAssumptionSetVersion).where(
            AriadneAssumptionSetVersion.assumption_set_id == review.assumption_set_id,
            AriadneAssumptionSetVersion.version == 1,
        )
    ).scalar_one()
    from app.services import ariadne_close_engine_v2

    executor = (
        engine
        if assumption.values == {"policy": engine.POLICY}
        else ariadne_close_engine_v2
    )
    if assumption.values != {"policy": executor.POLICY}:
        raise ValueError("Política da revisão sem executor exato")
    if executor is engine and any(
        r.get("recordKind") == "invoice_observation" for r in records
    ):
        raise ValueError(
            "Observações nativas exigem nova revisão v0.2; históricos v0.1 preservados"
        )
    scenario = core.create_scenario(
        db,
        tenant_id=review.tenant_id,
        name=f"Fechamento {review.period} {review.scope}",
        state_version_id=state.id,
        assumption_set_version_id=assumption.id,
    )
    run = core.execute_scenario(
        db,
        tenant_id=review.tenant_id,
        scenario_id=scenario.id,
        model_version_id=_model(db, review.tenant_id, executor).id,
        execution_configuration=executor.POLICY,
    )
    return {"id": str(run.result.id), "runId": str(run.model_run.id)}


def result_lineage(db, review, result_id):
    lineage = core.reconstruct_result_lineage(
        db, tenant_id=review.tenant_id, result_id=result_id
    )
    if (
        lineage.private_object.id != review.object_id
        or lineage.result.result_key != "assisted_close"
    ):
        raise LookupError("Cálculo não encontrado nesta revisão")
    return lineage


def treatment_payload(row):
    return {
        "id": str(row.id),
        "resultId": str(row.result_id),
        "itemId": row.item_id,
        "status": row.status,
        "reason": row.reason,
        "note": row.note,
        "createdAt": row.created_at.isoformat(),
    }


def treatments(db, review, result_id):
    return [
        treatment_payload(t)
        for t in db.execute(
            select(CloseTreatment)
            .where(
                CloseTreatment.review_id == review.id,
                CloseTreatment.result_id == result_id,
            )
            .order_by(CloseTreatment.created_at, CloseTreatment.id)
        ).scalars()
    ]


def result_payload(db, review, result_id):
    chain = result_lineage(db, review, result_id)
    return {
        "id": str(chain.result.id),
        "runId": str(chain.model_run.id),
        "modelVersionId": str(chain.model_version.id),
        "implementation": chain.model_version.implementation_identity,
        "stateVersionId": str(chain.state_version.id),
        "assumptionVersionId": str(chain.assumption_set_version.id),
        "producedAt": chain.result.produced_at.isoformat(),
        "output": chain.result.payload,
        "inputs": chain.state_version.payload,
        "executionConfiguration": chain.model_run.execution_configuration,
        "treatments": treatments(db, review, result_id),
    }


def treat(db, workspace, review, result_id, body):
    result = result_payload(db, review, result_id)
    item = next(
        (i for i in result["output"]["items"] if i["id"] == body["itemId"]), None
    )
    if item is None:
        raise LookupError("Item não pertence ao cálculo")
    row = CloseTreatment(
        review_id=review.id,
        workspace_id=workspace.id,
        tenant_id=review.tenant_id,
        result_id=result_id,
        item_id=body["itemId"],
        status=body["status"],
        reason=body["reason"],
        note=body["note"],
    )
    db.add(row)
    db.flush()
    db.refresh(row)
    return treatment_payload(row)


def save_package(db, workspace, review, result_id):
    result = result_payload(db, review, result_id)
    package = ClosePackage(
        review_id=review.id,
        workspace_id=workspace.id,
        tenant_id=review.tenant_id,
        result_id=result_id,
        manifest=result,
    )
    db.add(package)
    db.flush()
    return {"id": str(package.id), "resultId": str(result_id)}


def safe_csv(value):
    value = "" if value is None else str(value)
    return (
        "'" + value
        if value.lstrip().startswith(("=", "+", "-", "@", "\t", "\r", "\n"))
        else value
    )


def export_package(package):
    result = package.manifest
    output = result["output"]
    report = [
        "NIVAR / Ariadne — Fechamento Assistido v0",
        "Experimental. Revisão de engenharia; não é auditoria, conformidade, sobrecobrança confirmada ou economia verificada.",
        f"Pacote: {package.id}",
        f"Cálculo: {result['id']} / execução: {result['runId']}",
        f"Escopo: {output['review']['scope']} / Período: {output['review']['period']}",
        f"Modelo: {result['implementation']}",
        "Cobertura: " + _json(output["coverage"]),
        "Exclusões: " + ", ".join(output["exclusions"]),
    ]
    table = io.StringIO(newline="")
    writer = csv.writer(table)
    writer.writerow(
        [
            "item",
            "component",
            "billed_BRL",
            "expected_BRL",
            "difference_BRL",
            "independent_classification",
            "internal_classification",
            "sources",
            "treatment",
        ]
    )
    treatments_by_item = defaultdict(list)
    for treatment in result["treatments"]:
        treatments_by_item[treatment["itemId"]].append(treatment)
    for item in output["items"]:
        check = item["independent"]
        notes = treatments_by_item[item["id"]]
        sources = _json(check["sourceRefs"])
        writer.writerow(
            [
                safe_csv(v)
                for v in (
                    item["itemKey"],
                    item["component"],
                    item["billed"],
                    check["expected"],
                    check["difference"],
                    check["label"],
                    item["internal"]["label"],
                    sources,
                    _json(notes),
                )
            ]
        )
        report.extend(
            [
                "",
                f"{item['itemKey']} / {item['component']} — {check['label']}",
                f"Valor na fonte: {item['candidate'].get('amount')} {item.get('currency')} (não é conversão de moeda)",
                f"Faturado: {item['billed']} BRL / Esperado coberto: {check['expected']} / Diferença: {check['difference']}",
                "Cálculo: " + str(check["calculation"]),
                "Motivos: " + "; ".join(check["reasons"]),
                "Consistência interna: " + _json(item["internal"]),
                "Fontes: " + sources,
                "Tratamento: " + _json(notes),
            ]
        )
    for group in output.get("relatedGroups", []):
        report.extend(
            [
                "",
                "Grupo relacionado: " + group["group"],
                group["reason"],
                "Referências: " + _json(group["sourceRefs"]),
            ]
        )
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        # Fixed timestamps make repeated downloads of a saved package byte-identical.
        for name, value in (
            ("report.txt", "\n".join(report)),
            ("items.csv", table.getvalue()),
            ("manifest.json", _json({"packageId": str(package.id), **result})),
        ):
            info = zipfile.ZipInfo(name, (2026, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            archive.writestr(info, value.encode("utf-8"))
    return buffer.getvalue()
