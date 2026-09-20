import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Check,
  GitBranch,
  Plus,
} from "lucide-react";

import {
  AuthoringValidationError,
  authoringFieldsToPayload,
  blankAuthoringField,
  formatAuthoringValue,
  payloadToAuthoringFields,
  valueSchemaFromAuthoringFields,
  type AuthoringField,
} from "../../lib/ariadne/authoring";
import {
  ariadneOperatorApi,
  type AssumptionOrigin,
  type StateVersion,
  type WorkspaceDetail,
} from "../../lib/ariadne/operatorApi";
import { AriadneScenarioStudio } from "./AriadneScenarioStudio";
import { FieldEditor, TechnicalId } from "./AriadneFieldEditor";

type MutationRunner = (
  label: string,
  action: () => Promise<unknown>,
) => Promise<boolean>;

interface AriadneAuthoringProps {
  busy: string | null;
  detail: WorkspaceDetail;
  reconciliationRequired: boolean;
  runMutation: MutationRunner;
  workspaceId: string;
}

const inputDateTime = (value: string | null) => value?.slice(0, 16) ?? "";
const apiDateTime = (value: string) => value ? new Date(value).toISOString() : null;
const shortId = (value: string) => value.slice(0, 8).toUpperCase();

function EmptyAction({
  action,
  children,
  disabled,
  onClick,
}: {
  action: string;
  children: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <div className="ariadne-authoring__empty">
      <p>{children}</p>
      <button type="button" className="g2-ops__button" disabled={disabled} onClick={onClick}>
        <Plus size={14} /> {action}
      </button>
    </div>
  );
}

export function AriadneAuthoring({
  busy,
  detail,
  reconciliationRequired,
  runMutation,
  workspaceId,
}: AriadneAuthoringProps) {
  const locked = busy !== null || reconciliationRequired;
  const [openForm, setOpenForm] = useState<
    "evidence" | "object" | "state" | "assumption-set" | "assumption-version" | null
  >(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [evidenceDraft, setEvidenceDraft] = useState({
    sourceArtifactId: "",
    sourceVersion: "",
    locator: "",
    observedAt: "",
    transformRef: "",
  });
  const [objectDraft, setObjectDraft] = useState({ displayLabel: "", objectType: "" });
  const [selectedObjectId, setSelectedObjectId] = useState(detail.objects[0]?.id ?? "");
  const [stateMode, setStateMode] = useState<"new" | "correction">("new");
  const [stateFields, setStateFields] = useState<AuthoringField[]>([blankAuthoringField()]);
  const [stateEvidenceIds, setStateEvidenceIds] = useState<string[]>([]);
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");
  const [assumptionName, setAssumptionName] = useState("");
  const [selectedAssumptionSetId, setSelectedAssumptionSetId] = useState(
    detail.assumptionSets[0]?.id ?? "",
  );
  const [assumptionFields, setAssumptionFields] = useState<AuthoringField[]>([
    blankAuthoringField(),
  ]);
  const [assumptionOrigin, setAssumptionOrigin] = useState<AssumptionOrigin>("human_defined");

  useEffect(() => {
    if (!detail.objects.some((item) => item.id === selectedObjectId)) {
      setSelectedObjectId(detail.objects[0]?.id ?? "");
    }
  }, [detail.objects, selectedObjectId]);

  useEffect(() => {
    if (!detail.assumptionSets.some((item) => item.id === selectedAssumptionSetId)) {
      setSelectedAssumptionSetId(detail.assumptionSets[0]?.id ?? "");
    }
  }, [detail.assumptionSets, selectedAssumptionSetId]);

  const selectedObject = detail.objects.find((item) => item.id === selectedObjectId);
  const selectedStates = useMemo(
    () => detail.stateVersions
      .filter((item) => item.objectId === selectedObjectId)
      .sort((a, b) => b.version - a.version),
    [detail.stateVersions, selectedObjectId],
  );
  const currentState = selectedStates.find((item) => item.current);
  const selectedAssumptionSet = detail.assumptionSets.find(
    (item) => item.id === selectedAssumptionSetId,
  );
  const assumptionVersions = [...(selectedAssumptionSet?.versions ?? [])]
    .sort((a, b) => b.version - a.version);

  const startForm = (form: typeof openForm) => {
    setFormError(null);
    setOpenForm(form);
  };

  const submitEvidence = async () => {
    if (!evidenceDraft.sourceArtifactId.trim() || !evidenceDraft.sourceVersion.trim() || !evidenceDraft.locator.trim()) {
      setFormError("Identificador da fonte, versão e localizador são obrigatórios.");
      return;
    }
    const saved = await runMutation("evidence-authoring", () =>
      ariadneOperatorApi.createEvidence(workspaceId, {
        sourceArtifactId: evidenceDraft.sourceArtifactId.trim(),
        sourceVersion: evidenceDraft.sourceVersion.trim(),
        locator: evidenceDraft.locator.trim(),
        observedAt: apiDateTime(evidenceDraft.observedAt),
        transformRef: evidenceDraft.transformRef.trim() || null,
      }));
    if (saved) {
      setEvidenceDraft({ sourceArtifactId: "", sourceVersion: "", locator: "", observedAt: "", transformRef: "" });
      setOpenForm(null);
    }
  };

  const submitObject = async () => {
    if (!objectDraft.displayLabel.trim() || !objectDraft.objectType.trim()) {
      setFormError("Nome de exibição e tipo do objeto são obrigatórios.");
      return;
    }
    const saved = await runMutation("object-authoring", () =>
      ariadneOperatorApi.createObject(
        workspaceId,
        objectDraft.objectType.trim(),
        objectDraft.displayLabel.trim(),
      ));
    if (saved) {
      setObjectDraft({ displayLabel: "", objectType: "" });
      setOpenForm(null);
    }
  };

  const openState = (mode: "new" | "correction", state?: StateVersion) => {
    setFormError(null);
    setStateMode(mode);
    if (state) {
      try {
        setStateFields(payloadToAuthoringFields(state.payload));
        setStateEvidenceIds([...state.evidenceRefIds]);
        setValidFrom(inputDateTime(state.validFrom));
        setValidTo(inputDateTime(state.validTo));
      } catch (caught) {
        setFormError(caught instanceof Error ? caught.message : "Este estado não pode ser editado com segurança.");
        return;
      }
    } else {
      setStateFields([blankAuthoringField()]);
      setStateEvidenceIds([]);
      setValidFrom("");
      setValidTo("");
    }
    setOpenForm("state");
  };

  const submitState = async () => {
    if (!selectedObject) return;
    if (stateEvidenceIds.length === 0) {
      setFormError("Selecione ao menos uma evidência que sustenta este estado.");
      return;
    }
    try {
      const payload = authoringFieldsToPayload(stateFields);
      const saved = await runMutation("state-authoring", () =>
        ariadneOperatorApi.createState(workspaceId, selectedObject.id, {
          payload,
          evidenceRefIds: stateEvidenceIds,
          validFrom: apiDateTime(validFrom),
          validTo: apiDateTime(validTo),
        }));
      if (saved) setOpenForm(null);
    } catch (caught) {
      setFormError(caught instanceof AuthoringValidationError ? caught.message : "Revise os campos do estado.");
    }
  };

  const submitAssumptionSet = async () => {
    if (!assumptionName.trim()) {
      setFormError("Dê um nome ao conjunto de premissas.");
      return;
    }
    const saved = await runMutation("assumption-set-authoring", () =>
      ariadneOperatorApi.createAssumptionSet(workspaceId, assumptionName.trim()));
    if (saved) {
      setAssumptionName("");
      setOpenForm(null);
    }
  };

  const openAssumptionVersion = () => {
    setFormError(null);
    const current = assumptionVersions[0];
    try {
      setAssumptionFields(current ? payloadToAuthoringFields(current.values) : [blankAuthoringField()]);
      setAssumptionOrigin((current?.origin as AssumptionOrigin | undefined) ?? "human_defined");
      setOpenForm("assumption-version");
    } catch (caught) {
      setFormError(caught instanceof Error ? caught.message : "Esta premissa não pode ser editada com segurança.");
    }
  };

  const submitAssumptionVersion = async () => {
    if (!selectedAssumptionSet) return;
    try {
      const values = authoringFieldsToPayload(assumptionFields);
      const valueSchema = valueSchemaFromAuthoringFields(assumptionFields);
      const saved = await runMutation("assumption-version-authoring", () =>
        ariadneOperatorApi.createAssumptionVersion(workspaceId, selectedAssumptionSet.id, {
          values,
          valueSchema,
          origin: assumptionOrigin,
        }));
      if (saved) setOpenForm(null);
    } catch (caught) {
      setFormError(caught instanceof AuthoringValidationError ? caught.message : "Revise os campos de premissas.");
    }
  };

  return (
    <div className="ariadne-authoring" aria-label="Analysis Workspace">
      <nav className="ariadne-authoring__nav" aria-label="Autoria Ariadne">
        <a href="#ariadne-evidence">Evidence</a>
        <a href="#ariadne-state">State</a>
        <a href="#ariadne-assumptions">Assumptions</a>
        <a href="#ariadne-scenarios">Scenarios</a>
        <a href="#ariadne-runs">Runs</a>
      </nav>

      {formError && <div className="ariadne-authoring__form-error" role="alert">{formError}</div>}

      <section className="ariadne-authoring__section" id="ariadne-evidence">
        <header>
          <div><span>EVIDENCE</span><h2>Evidências da análise</h2><p>Referências de origem preservadas exatamente como registradas.</p></div>
          <button type="button" className="g2-ops__button" disabled={locked} onClick={() => startForm("evidence")}><Plus size={14} /> Adicionar evidência</button>
        </header>
        {openForm === "evidence" && (
          <form className="ariadne-authoring__form" onSubmit={(event) => { event.preventDefault(); void submitEvidence(); }}>
            <label><span>Identificador da fonte</span><input value={evidenceDraft.sourceArtifactId} onChange={(event) => setEvidenceDraft({ ...evidenceDraft, sourceArtifactId: event.target.value })} /></label>
            <label><span>Versão</span><input value={evidenceDraft.sourceVersion} onChange={(event) => setEvidenceDraft({ ...evidenceDraft, sourceVersion: event.target.value })} /></label>
            <label className="ariadne-authoring__wide"><span>Localizador / referência</span><input value={evidenceDraft.locator} onChange={(event) => setEvidenceDraft({ ...evidenceDraft, locator: event.target.value })} /></label>
            <label><span>Observado em <small>opcional</small></span><input type="datetime-local" value={evidenceDraft.observedAt} onChange={(event) => setEvidenceDraft({ ...evidenceDraft, observedAt: event.target.value })} /></label>
            <label><span>Transformação / provenance reference <small>opcional</small></span><input value={evidenceDraft.transformRef} onChange={(event) => setEvidenceDraft({ ...evidenceDraft, transformRef: event.target.value })} /></label>
            <div className="ariadne-authoring__form-actions"><button type="button" onClick={() => setOpenForm(null)}>Cancelar</button><button className="g2-ops__button g2-ops__button--dark" disabled={locked} type="submit">Salvar evidência</button></div>
          </form>
        )}
        {detail.evidenceRefs.length === 0 ? (
          <EmptyAction action="Adicionar evidência" disabled={locked} onClick={() => startForm("evidence")}>Nenhuma evidência registrada.</EmptyAction>
        ) : (
          <div className="ariadne-authoring__cards">
            {detail.evidenceRefs.map((evidence, index) => (
              <article key={evidence.id}>
                <span>E{index + 1}</span><h3>{evidence.sourceArtifactId}</h3>
                <dl><div><dt>Versão</dt><dd>{evidence.sourceVersion}</dd></div><div><dt>Localizador</dt><dd>{evidence.locator}</dd></div>{evidence.observedAt && <div><dt>Observado em</dt><dd>{new Date(evidence.observedAt).toLocaleString("pt-BR")}</dd></div>}{evidence.transformRef && <div><dt>Transformação</dt><dd>{evidence.transformRef}</dd></div>}</dl>
                <TechnicalId value={evidence.id} />
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="ariadne-authoring__section" id="ariadne-state">
        <header>
          <div><span>OBSERVED STATE</span><h2>Estado observado</h2><p>Fatos sustentados por evidência. Cada correção cria uma nova versão imutável.</p></div>
          <button type="button" className="g2-ops__button" disabled={locked} onClick={() => startForm("object")}><Plus size={14} /> Criar objeto</button>
        </header>
        {openForm === "object" && (
          <form className="ariadne-authoring__form" onSubmit={(event) => { event.preventDefault(); void submitObject(); }}>
            <label><span>Nome de exibição</span><input placeholder="ex.: Unidade principal" value={objectDraft.displayLabel} onChange={(event) => setObjectDraft({ ...objectDraft, displayLabel: event.target.value })} /></label>
            <label><span>Tipo do objeto</span><input placeholder="ex.: instalação" value={objectDraft.objectType} onChange={(event) => setObjectDraft({ ...objectDraft, objectType: event.target.value })} /></label>
            <p className="ariadne-authoring__wide">O nome ajuda a distinguir objetos do mesmo tipo; o tipo permanece uma classificação independente.</p>
            <div className="ariadne-authoring__form-actions"><button type="button" onClick={() => setOpenForm(null)}>Cancelar</button><button className="g2-ops__button g2-ops__button--dark" disabled={locked} type="submit">Criar objeto</button></div>
          </form>
        )}
        {detail.objects.length === 0 ? (
          <EmptyAction action="Criar objeto" disabled={locked} onClick={() => startForm("object")}>Nenhum objeto privado.</EmptyAction>
        ) : (
          <>
            <div className="ariadne-authoring__selector" role="list" aria-label="Objetos privados">
              {detail.objects.map((item) => (
                <button key={item.id} type="button" data-selected={item.id === selectedObjectId} onClick={() => { setSelectedObjectId(item.id); setOpenForm(null); }}>
                  <span>{item.displayLabel ?? `Objeto ${shortId(item.id)}`}</span><small>{item.objectType}</small>
                </button>
              ))}
            </div>
            {selectedObject && (
              <div className="ariadne-authoring__state-head">
                <div><span>OBJETO ATIVO</span><strong>{selectedObject.displayLabel ?? `Objeto ${shortId(selectedObject.id)}`}</strong><small>{selectedObject.objectType}</small></div>
                {!currentState ? <button type="button" className="g2-ops__button" disabled={locked || detail.evidenceRefs.length === 0} onClick={() => openState("new")}><Plus size={14} /> Criar estado V1</button> : <button type="button" className="g2-ops__button" disabled={locked} onClick={() => openState("correction", currentState)}><Activity size={14} /> Corrigir estado</button>}
              </div>
            )}
          </>
        )}
        {openForm === "state" && selectedObject && (
          <form className="ariadne-authoring__form ariadne-authoring__form--stack" onSubmit={(event) => { event.preventDefault(); void submitState(); }}>
            <div className="ariadne-authoring__form-intro"><span>{stateMode === "correction" ? "NOVA VERSÃO" : "PRIMEIRA VERSÃO"}</span><strong>{stateMode === "correction" ? `V${(currentState?.version ?? 0) + 1} preservará V${currentState?.version}` : "V1 — estado observado"}</strong></div>
            <FieldEditor disabled={locked} fields={stateFields} legend="Fatos observados" onChange={setStateFields} />
            <fieldset className="ariadne-authoring__evidence-choice" disabled={locked}>
              <legend>Este estado é sustentado por:</legend>
              {detail.evidenceRefs.map((evidence) => (
                <label key={evidence.id}><input type="checkbox" checked={stateEvidenceIds.includes(evidence.id)} onChange={(event) => setStateEvidenceIds(event.target.checked ? [...stateEvidenceIds, evidence.id] : stateEvidenceIds.filter((id) => id !== evidence.id))} /><span>{evidence.sourceArtifactId}</span><small>versão {evidence.sourceVersion} · {evidence.locator}</small></label>
              ))}
            </fieldset>
            <details className="ariadne-authoring__advanced"><summary>Validade observada — opcional</summary><div><label><span>Válido a partir de</span><input type="datetime-local" value={validFrom} onChange={(event) => setValidFrom(event.target.value)} /></label><label><span>Válido até</span><input type="datetime-local" value={validTo} onChange={(event) => setValidTo(event.target.value)} /></label></div></details>
            <div className="ariadne-authoring__form-actions"><button type="button" onClick={() => setOpenForm(null)}>Cancelar</button><button className="g2-ops__button g2-ops__button--dark" disabled={locked} type="submit">{stateMode === "correction" ? "Criar nova versão" : "Salvar estado V1"}</button></div>
          </form>
        )}
        {selectedObject && selectedStates.length === 0 ? (
          <p className="ariadne__absence">Nenhum estado observado. Registre evidência antes de criar V1.</p>
        ) : (
          <div className="ariadne-authoring__versions">
            {selectedStates.map((state) => (
              <article key={state.id} data-current={state.current}>
                <header><span>V{state.version}</span><strong>{state.current ? "CURRENT" : "HISTÓRICO / SUPERSEDED"}</strong></header>
                <dl>{Object.entries(state.payload).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{formatAuthoringValue(value)}</dd></div>)}</dl>
                <p>Sustentado por {state.evidenceRefIds.map((id) => detail.evidenceRefs.find((evidence) => evidence.id === id)?.sourceArtifactId ?? shortId(id)).join(", ")}</p>
                {(state.validFrom || state.validTo) && <small>Válido: {state.validFrom ? new Date(state.validFrom).toLocaleString("pt-BR") : "início aberto"} → {state.validTo ? new Date(state.validTo).toLocaleString("pt-BR") : "fim aberto"}</small>}
                <TechnicalId value={state.id} />
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="ariadne-authoring__section" id="ariadne-assumptions">
        <header>
          <div><span>ASSUMPTIONS</span><h2>Premissas do analista</h2><p>Premissa definida pelo analista não altera o estado observado.</p></div>
          <button type="button" className="g2-ops__button" disabled={locked} onClick={() => startForm("assumption-set")}><Plus size={14} /> Criar conjunto de premissas</button>
        </header>
        {openForm === "assumption-set" && (
          <form className="ariadne-authoring__form" onSubmit={(event) => { event.preventDefault(); void submitAssumptionSet(); }}>
            <label className="ariadne-authoring__wide"><span>Nome do conjunto</span><input placeholder="ex.: Cenário base" value={assumptionName} onChange={(event) => setAssumptionName(event.target.value)} /></label>
            <div className="ariadne-authoring__form-actions"><button type="button" onClick={() => setOpenForm(null)}>Cancelar</button><button className="g2-ops__button g2-ops__button--dark" disabled={locked} type="submit">Criar conjunto</button></div>
          </form>
        )}
        {detail.assumptionSets.length === 0 ? (
          <EmptyAction action="Criar conjunto de premissas" disabled={locked} onClick={() => startForm("assumption-set")}>Nenhuma premissa.</EmptyAction>
        ) : (
          <>
            <div className="ariadne-authoring__selector" role="list" aria-label="Conjuntos de premissas">
              {detail.assumptionSets.map((item) => <button key={item.id} type="button" data-selected={item.id === selectedAssumptionSetId} onClick={() => { setSelectedAssumptionSetId(item.id); setOpenForm(null); }}><span>{item.name}</span><small>{item.versions.length} versão(ões)</small></button>)}
            </div>
            <div className="ariadne-authoring__state-head"><div><span>PREMISSA DEFINIDA PELO ANALISTA</span><strong>{selectedAssumptionSet?.name}</strong><small>Separada do estado observado</small></div><button type="button" className="g2-ops__button" disabled={locked || !selectedAssumptionSet} onClick={openAssumptionVersion}><GitBranch size={14} /> {assumptionVersions.length ? "Nova versão de premissas" : "Adicionar versão de premissas"}</button></div>
          </>
        )}
        {openForm === "assumption-version" && selectedAssumptionSet && (
          <form className="ariadne-authoring__form ariadne-authoring__form--stack" onSubmit={(event) => { event.preventDefault(); void submitAssumptionVersion(); }}>
            <div className="ariadne-authoring__form-intro"><span>APPEND-ONLY</span><strong>{assumptionVersions.length ? `Nova V${assumptionVersions[0].version + 1}; V${assumptionVersions[0].version} permanece preservada` : "Primeira versão de premissas"}</strong></div>
            <FieldEditor disabled={locked} fields={assumptionFields} legend="Valores assumidos" onChange={setAssumptionFields} />
            <label className="ariadne-authoring__origin"><span>Origem</span><select value={assumptionOrigin} onChange={(event) => setAssumptionOrigin(event.target.value as AssumptionOrigin)}><option value="human_defined">Definida pelo analista</option><option value="rule">Regra explícita</option><option value="other">Outra origem declarada</option></select><small>Origem descreve como a premissa foi definida; não declara autoridade da fonte.</small></label>
            <div className="ariadne-authoring__form-actions"><button type="button" onClick={() => setOpenForm(null)}>Cancelar</button><button className="g2-ops__button g2-ops__button--dark" disabled={locked} type="submit">Salvar nova versão</button></div>
          </form>
        )}
        <div className="ariadne-authoring__versions ariadne-authoring__versions--assumptions">
          {assumptionVersions.map((version, index) => (
            <article key={version.id} data-current={index === 0}>
              <header><span>V{version.version}</span><strong>{index === 0 ? "CURRENT" : "HISTÓRICO / SUPERSEDED"}</strong></header>
              <dl>{Object.entries(version.values).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{formatAuthoringValue(value)}</dd></div>)}</dl>
              <p>Origem: {version.origin === "human_defined" ? "definida pelo analista" : version.origin}</p>
              <TechnicalId value={version.id} />
            </article>
          ))}
        </div>
      </section>

      <AriadneScenarioStudio
        busy={busy}
        detail={detail}
        reconciliationRequired={reconciliationRequired}
        runMutation={runMutation}
        workspaceId={workspaceId}
      />

      <footer className="ariadne-authoring__boundary">
        <Check size={15} /> Estado, premissas, cenários, runs e resultados persistidos no Core real.
      </footer>
    </div>
  );
}
