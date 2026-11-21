import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  ArrowDown,
  GitCompareArrows,
  History,
  LoaderCircle,
  RefreshCw,
  Search,
} from "lucide-react";

import { formatAuthoringValue } from "../../lib/ariadne/authoring";
import {
  assessLineage,
  diffRecords,
  latestAssumptionVersion,
  recordsEqual,
  resolveRunContext,
  runPresentationLabel,
  scalarInputDependencies,
  type RunContext,
} from "../../lib/ariadne/historyComparison";
import {
  ariadneOperatorApi,
  replayPresentation,
  type Lineage,
  type Replay,
  type WorkspaceDetail,
} from "../../lib/ariadne/operatorApi";
import { TechnicalId } from "./AriadneFieldEditor";

interface AriadneHistoryCompareProps {
  detail: WorkspaceDetail;
  initialRunId: string | null;
  workspaceId: string;
}

const localTime = (value: string | null) => value
  ? new Date(value).toLocaleString("pt-BR")
  : "não informado";

const displayValue = (value: unknown) => {
  if (value === undefined) return "campo ausente";
  if (value && typeof value === "object") return JSON.stringify(value);
  return formatAuthoringValue(value);
};

function DifferenceTable({
  a,
  b,
  showDelta = false,
}: {
  a: Record<string, unknown>;
  b: Record<string, unknown>;
  showDelta?: boolean;
}) {
  const differences = diffRecords(a, b);
  if (differences.length === 0) return <p className="ariadne-history__empty">Nenhum campo registrado.</p>;
  return (
    <div className="ariadne-history__diff" role="table" aria-label="Diferenças por campo">
      <div role="row"><strong>Campo</strong><strong>Run A</strong><strong>Run B</strong>{showDelta && <strong>Delta B − A</strong>}</div>
      {differences.map((difference) => (
        <div role="row" key={difference.key} data-changed={difference.changed}>
          <code>{difference.key}</code>
          <span>{displayValue(difference.a)}</span>
          <span>{displayValue(difference.b)}</span>
          {showDelta && <span>{difference.numericDelta === null ? "não aplicável" : formatAuthoringValue(difference.numericDelta)}</span>}
        </div>
      ))}
    </div>
  );
}

function UsedThenNow({ context, label, detail }: { context: RunContext; label: string; detail: WorkspaceDetail }) {
  const currentState = detail.stateVersions.find(
    (state) => state.objectId === context.object.id && state.current,
  );
  const currentAssumption = latestAssumptionVersion(context);
  return (
    <article className="ariadne-history__then-now">
      <header><span>{label}</span><strong>{context.scenario.name}</strong></header>
      <div>
        <section>
          <span>USED THEN</span>
          <strong>State V{context.state.version} · {context.state.current ? "CURRENT" : "HISTORICAL"}</strong>
          <small>Evidence {context.evidence.map((evidence) => evidence.sourceArtifactId).join(", ") || "unavailable"}</small>
          <small>{context.assumptionSet.name} · V{context.assumption.version}</small>
          <small>{context.model.name} · v{context.model.semanticVersion}</small>
          <small>{context.scenario.name}</small>
        </section>
        <ArrowDown size={16} aria-hidden="true" />
        <section>
          <span>CURRENT NOW</span>
          <strong>{currentState ? `State V${currentState.version}` : "Current state unavailable"}</strong>
          <small>{context.assumptionSet.name} · latest V{currentAssumption.version}</small>
          <small>Current changes do not rewrite this historical run.</small>
        </section>
      </div>
    </article>
  );
}

export function AriadneHistoryCompare({
  detail,
  initialRunId,
  workspaceId,
}: AriadneHistoryCompareProps) {
  const contexts = useMemo(
    () => detail.runs
      .map((run) => resolveRunContext(detail, run.id))
      .filter((context): context is RunContext => Boolean(context)),
    [detail],
  );
  const [runAId, setRunAId] = useState(contexts[0]?.run.id ?? "");
  const [runBId, setRunBId] = useState(contexts[1]?.run.id ?? "");
  const [inspectedStateId, setInspectedStateId] = useState(contexts[0]?.state.id ?? "");
  const [historyObjectId, setHistoryObjectId] = useState(contexts[0]?.object.id ?? "");
  const [historyAssumptionSetId, setHistoryAssumptionSetId] = useState(contexts[0]?.assumptionSet.id ?? "");
  const [lineageRunId, setLineageRunId] = useState(contexts[0]?.run.id ?? "");
  const [lineage, setLineage] = useState<Lineage | null>(null);
  const [lineageError, setLineageError] = useState<string | null>(null);
  const [lineageBusy, setLineageBusy] = useState(false);
  const [replay, setReplay] = useState<Replay | null>(null);
  const [replayError, setReplayError] = useState<string | null>(null);
  const [replayBusy, setReplayBusy] = useState(false);

  useEffect(() => {
    const requested = initialRunId && contexts.some((context) => context.run.id === initialRunId)
      ? initialRunId
      : null;
    if (requested) {
      setRunAId(requested);
      setRunBId((current) => current && current !== requested
        ? current
        : (contexts.find((context) => context.run.id !== requested)?.run.id ?? ""));
      setLineageRunId(requested);
    }
  }, [contexts, initialRunId]);

  useEffect(() => {
    if (!contexts.some((context) => context.run.id === runAId)) setRunAId(contexts[0]?.run.id ?? "");
    if (!contexts.some((context) => context.run.id === runBId)) setRunBId(contexts[1]?.run.id ?? "");
    if (!contexts.some((context) => context.run.id === lineageRunId)) {
      setLineageRunId(contexts[0]?.run.id ?? "");
      setLineage(null);
      setLineageError(null);
      setReplay(null);
      setReplayError(null);
    }
  }, [contexts, lineageRunId, runAId, runBId]);

  const contextA = contexts.find((context) => context.run.id === runAId);
  const contextB = contexts.find((context) => context.run.id === runBId);
  const distinctPair = Boolean(contextA && contextB && contextA.run.id !== contextB.run.id);

  useEffect(() => {
    if (contextA && !detail.stateVersions.some((state) => state.id === inspectedStateId)) {
      setInspectedStateId(contextA.state.id);
    }
  }, [contextA, detail.stateVersions, inspectedStateId]);

  useEffect(() => {
    if (!detail.objects.some((object) => object.id === historyObjectId)) {
      setHistoryObjectId(contextA?.object.id ?? detail.objects[0]?.id ?? "");
    }
    if (!detail.assumptionSets.some((set) => set.id === historyAssumptionSetId)) {
      setHistoryAssumptionSetId(contextA?.assumptionSet.id ?? detail.assumptionSets[0]?.id ?? "");
    }
  }, [contextA, detail.assumptionSets, detail.objects, historyAssumptionSetId, historyObjectId]);

  const stateDiff = contextA && contextB ? diffRecords(contextA.state.payload, contextB.state.payload) : [];
  const assumptionDiff = contextA && contextB ? diffRecords(contextA.assumption.values, contextB.assumption.values) : [];
  const scenarioDiff = contextA && contextB ? diffRecords(contextA.scenario.hypotheticalState, contextB.scenario.hypotheticalState) : [];
  const resultDiff = contextA && contextB ? diffRecords(contextA.result.payload, contextB.result.payload) : [];
  const selectedLineageContext = contexts.find((context) => context.run.id === lineageRunId);
  const inspectedState = detail.stateVersions.find((state) => state.id === inspectedStateId);
  const historyObject = detail.objects.find((object) => object.id === historyObjectId);
  const historyAssumptionSet = detail.assumptionSets.find((set) => set.id === historyAssumptionSetId);
  const inspectedEvidence = inspectedState?.evidenceRefIds
    .map((id) => detail.evidenceRefs.find((evidence) => evidence.id === id))
    .filter((evidence) => Boolean(evidence)) ?? [];

  const reconstruct = async (runId: string) => {
    const context = contexts.find((candidate) => candidate.run.id === runId);
    if (!context) return;
    setLineageRunId(runId);
    setLineage(null);
    setLineageError(null);
    setReplay(null);
    setReplayError(null);
    setLineageBusy(true);
    try {
      setLineage(await ariadneOperatorApi.getLineage(workspaceId, context.result.id));
    } catch (caught) {
      setLineageError(caught instanceof Error ? caught.message : "Historical chain unavailable.");
    } finally {
      setLineageBusy(false);
    }
  };

  const replayExactRun = async () => {
    if (!selectedLineageContext) return;
    setReplay(null);
    setReplayError(null);
    setReplayBusy(true);
    try {
      setReplay(await ariadneOperatorApi.replay(workspaceId, selectedLineageContext.result.id));
    } catch (caught) {
      setReplayError(caught instanceof Error ? caught.message : "Replay unavailable.");
    } finally {
      setReplayBusy(false);
    }
  };

  const lineageAssessment = lineage && selectedLineageContext
    ? assessLineage(selectedLineageContext, lineage)
    : null;

  return (
    <section className="ariadne-authoring__section ariadne-history" id="ariadne-history">
      <header>
        <div>
          <span>HISTORY / COMPARE</span>
          <h2>Investigar análises persistidas</h2>
          <p>Compare dois runs exatos; reconstrução e replay permanecem verificações separadas.</p>
        </div>
        <GitCompareArrows size={19} />
      </header>

      {contexts.length < 2 ? (
        <p className="ariadne__absence">São necessários dois runs com resultados persistidos para comparar. A inspeção individual aparece após o primeiro run.</p>
      ) : (
        <>
          <div className="ariadne-history__selectors">
            <label><span>RUN A</span><select aria-label="Selecionar Run A" value={runAId} onChange={(event) => setRunAId(event.target.value)}>{contexts.map((context) => <option key={context.run.id} value={context.run.id}>{runPresentationLabel(context)}</option>)}</select></label>
            <label><span>RUN B</span><select aria-label="Selecionar Run B" value={runBId} onChange={(event) => setRunBId(event.target.value)}>{contexts.map((context) => <option key={context.run.id} value={context.run.id}>{runPresentationLabel(context)}</option>)}</select></label>
          </div>

          {!distinctPair ? (
            <div className="ariadne-authoring__form-error" role="alert">Selecione dois runs persistidos distintos.</div>
          ) : contextA && contextB && (
            <>
              <div className="ariadne-history__summary" aria-label="Resumo descritivo do que mudou">
                {[
                  ["Observed state", stateDiff.some((item) => item.changed)],
                  ["Assumptions", assumptionDiff.some((item) => item.changed)],
                  ["Scenario hypotheticals", scenarioDiff.some((item) => item.changed)],
                  ["Model", contextA.model.id !== contextB.model.id],
                  ["Execution config", !recordsEqual(contextA.run.executionConfiguration, contextB.run.executionConfiguration)],
                  ["Result", resultDiff.some((item) => item.changed)],
                ].map(([label, changed]) => <span key={String(label)} data-changed={changed}>{label} {changed ? "changed" : "unchanged"}</span>)}
              </div>

              <div className="ariadne-history__then-now-grid">
                <UsedThenNow context={contextA} detail={detail} label="RUN A" />
                <UsedThenNow context={contextB} detail={detail} label="RUN B" />
              </div>

              <div className="ariadne-history__comparison-grid">
                <article><header><span>RESULT</span><strong>Stored outputs</strong></header><DifferenceTable a={contextA.result.payload} b={contextB.result.payload} showDelta /></article>
                <article><header><span>OBSERVED STATE</span><strong>Exact V{contextA.state.version} → V{contextB.state.version}</strong></header><p>{contextA.state.current ? "A is current now" : "A is historical now"} · {contextB.state.current ? "B is current now" : "B is historical now"}</p><DifferenceTable a={contextA.state.payload} b={contextB.state.payload} /></article>
                <article><header><span>ASSUMPTIONS</span><strong>Exact V{contextA.assumption.version} → V{contextB.assumption.version}</strong></header><DifferenceTable a={contextA.assumption.values} b={contextB.assumption.values} /></article>
                <article><header><span>SCENARIO</span><strong>{contextA.scenario.name} → {contextB.scenario.name}</strong></header><DifferenceTable a={contextA.scenario.hypotheticalState} b={contextB.scenario.hypotheticalState} /><small>Preserved scenario metadata. The scalar executor v1 does not consume hypothetical_state.</small></article>
                <article><header><span>MODEL</span><strong>{contextA.model.name}</strong></header><dl><div><dt>Run A</dt><dd>v{contextA.model.semanticVersion} · {contextA.model.implementationIdentity}<details><summary>Contracts and ModelVersion ID</summary><code>{contextA.model.id}</code><small>Input {JSON.stringify(contextA.model.inputContract)}</small><small>Output {JSON.stringify(contextA.model.outputContract)}</small></details></dd></div><div><dt>Run B</dt><dd>v{contextB.model.semanticVersion} · {contextB.model.implementationIdentity}<details><summary>Contracts and ModelVersion ID</summary><code>{contextB.model.id}</code><small>Input {JSON.stringify(contextB.model.inputContract)}</small><small>Output {JSON.stringify(contextB.model.outputContract)}</small></details></dd></div></dl></article>
                <article><header><span>EXECUTION</span><strong>Stored configuration</strong></header><DifferenceTable a={contextA.run.executionConfiguration} b={contextB.run.executionConfiguration} /></article>
              </div>

              <section className="ariadne-history__dependencies" aria-labelledby="ariadne-consumed-title">
                <header><div><span>INPUT DEPENDENCY ADAPTER</span><h3 id="ariadne-consumed-title">Consumed vs preserved</h3></div><p>Dependency facts for the exact registered scalar executor; no causal claim is inferred from the diff.</p></header>
                {[contextA, contextB].map((context, index) => {
                  const dependencies = scalarInputDependencies(context);
                  return <article key={context.run.id}><strong>RUN {index === 0 ? "A" : "B"}</strong>{dependencies.adapterSupported ? <div><section><span>CONSUMED BY MODEL</span>{dependencies.consumed.map((item) => <p key={item.path}><code>{item.path}</code><b>{displayValue(item.value)}</b></p>)}</section><section><span>PRESERVED IN SCENARIO · NOT CONSUMED</span>{dependencies.preserved.map((item) => <p key={item.path}><code>{item.path}</code><b>{displayValue(item.value)}</b></p>)}</section></div> : <p>No approved dependency presentation adapter is available for this model version.</p>}</article>;
                })}
              </section>

              <section className="ariadne-history__evidence-compare">
                <header><span>EVIDENCE BY EXACT STATE</span><strong>Supporting references</strong></header>
                {[contextA, contextB].map((context, index) => <article key={context.run.id}><span>RUN {index === 0 ? "A" : "B"} · STATE V{context.state.version}</span>{context.evidence.length ? context.evidence.map((evidence) => <p key={evidence.id}><b>{evidence.sourceArtifactId}</b> · version {evidence.sourceVersion} · {evidence.locator}</p>) : <p>Supporting evidence unavailable.</p>}</article>)}
              </section>
            </>
          )}
        </>
      )}

      {contexts.length > 0 && (
        <div className="ariadne-history__inspection">
          <section className="ariadne-history__chains">
            <header><History size={16} /><div><span>VERSION HISTORY</span><strong>Append-only chains</strong></div></header>
            {contextA && <>
              <label><span>Private object</span><select aria-label="Selecionar objeto para histórico" value={historyObjectId} onChange={(event) => setHistoryObjectId(event.target.value)}>{detail.objects.map((object) => <option key={object.id} value={object.id}>{object.displayLabel ?? object.objectType}</option>)}</select></label>
              <ol>{detail.stateVersions.filter((state) => state.objectId === historyObject?.id).sort((a, b) => a.version - b.version).map((state) => <li key={state.id} data-current={state.current}><span>V{state.version}{state.current ? " CURRENT" : ""}</span><strong>{Object.entries(state.payload).map(([key, value]) => `${key} ${displayValue(value)}`).join(" · ")}</strong><small>Recorded {localTime(state.recordedAt)} · valid {localTime(state.validFrom)} → {localTime(state.validTo)}</small><small>Evidence {state.evidenceRefIds.map((id) => detail.evidenceRefs.find((evidence) => evidence.id === id)?.sourceArtifactId ?? id).join(", ")}</small><small>Previous {state.previousVersionId ?? "root"}</small></li>)}</ol>
              <h4>Assumption history</h4>
              <label><span>Assumption set</span><select aria-label="Selecionar conjunto para histórico" value={historyAssumptionSetId} onChange={(event) => setHistoryAssumptionSetId(event.target.value)}>{detail.assumptionSets.map((set) => <option key={set.id} value={set.id}>{set.name}</option>)}</select></label>
              <ol>{[...(historyAssumptionSet?.versions ?? [])].sort((a, b) => a.version - b.version).map((version, index, versions) => <li key={version.id} data-current={index === versions.length - 1}><span>V{version.version}{index === versions.length - 1 ? " LATEST" : ""}</span><strong>{Object.entries(version.values).map(([key, value]) => `${key} ${displayValue(value)}`).join(" · ")}</strong><small>Origin {version.origin} · created {localTime(version.createdAt)}</small><small>Previous {version.previousVersionId ?? "root"}</small></li>)}</ol>
            </>}
          </section>

          <section className="ariadne-history__evidence-inspector">
            <header><Archive size={16} /><div><span>EVIDENCE INSPECTOR</span><strong>Exact support for one state version</strong></div></header>
            <label><span>State version</span><select aria-label="Selecionar estado para evidências" value={inspectedStateId} onChange={(event) => setInspectedStateId(event.target.value)}>{detail.stateVersions.map((state) => <option key={state.id} value={state.id}>V{state.version} · {state.current ? "CURRENT" : "HISTORICAL"} · {displayValue(state.payload)}</option>)}</select></label>
            {inspectedEvidence.length === 0 ? <p className="ariadne__absence">Supporting evidence unavailable for the selected state.</p> : inspectedEvidence.map((evidence) => evidence && <article key={evidence.id}><h4>{evidence.sourceArtifactId}</h4><dl><div><dt>Source version</dt><dd>{evidence.sourceVersion}</dd></div><div><dt>Locator</dt><dd>{evidence.locator}</dd></div><div><dt>Observed at</dt><dd>{localTime(evidence.observedAt)}</dd></div><div><dt>Recorded at</dt><dd>{localTime(evidence.recordedAt)}</dd></div><div><dt>Transform ref</dt><dd>{evidence.transformRef ?? "not informed"}</dd></div></dl><small>A reference records provenance; it does not grant source access or rights.</small><TechnicalId value={evidence.id} /></article>)}
          </section>
        </div>
      )}

      {contexts.length > 0 && (
        <section className="ariadne-history__lineage">
          <header><div><span>RESULT LINEAGE</span><h3>Historical exact chain</h3><p>Reconstructibility resolves stored links. Replay separately reruns the exact manifest.</p></div><Search size={17} /></header>
          <div className="ariadne-history__lineage-actions">
            <label><span>Persisted result</span><select aria-label="Selecionar resultado para linhagem" value={lineageRunId} onChange={(event) => { setLineageRunId(event.target.value); setLineage(null); setLineageError(null); setReplay(null); setReplayError(null); }}>{contexts.map((context) => <option key={context.run.id} value={context.run.id}>{runPresentationLabel(context)}</option>)}</select></label>
            <button type="button" className="g2-ops__button" disabled={lineageBusy || !selectedLineageContext} onClick={() => void reconstruct(lineageRunId)}>{lineageBusy ? <LoaderCircle className="ariadne__spin" size={14} /> : <Search size={14} />} Reconstruct chain</button>
            <button type="button" className="g2-ops__button g2-ops__button--dark" disabled={replayBusy || !selectedLineageContext} onClick={() => void replayExactRun()}>{replayBusy ? <LoaderCircle className="ariadne__spin" size={14} /> : <RefreshCw size={14} />} Replay exact run</button>
          </div>
          {lineageError && <div className="ariadne-history__status" data-status="incomplete" role="alert"><strong>CHAIN INCOMPLETE</strong><span>{lineageError}</span></div>}
          {lineage && lineageAssessment && <><div className="ariadne-history__status" data-status={lineageAssessment.reconstructible ? "complete" : "incomplete"}><strong>{lineageAssessment.reconstructible ? "RECONSTRUCTIBLE" : "CHAIN INCOMPLETE"}</strong><span>{lineageAssessment.reconstructible ? "Every material historical link resolved by exact ID." : `Unavailable or mismatched: ${lineageAssessment.missing.join(", ")}`}</span></div><ol className="ariadne-history__lineage-chain"><li><span>RESULT</span><strong>{displayValue(lineage.result.payload)}</strong><code>{lineage.result.id}</code></li><li><span>MODEL RUN</span><strong>{displayValue(lineage.run.executionConfiguration)}</strong><code>{lineage.run.id}</code></li><li><span>MODEL VERSION</span><strong>{lineage.model.name} · v{lineage.model.semanticVersion}</strong><code>{lineage.model.versionId}</code></li><li><span>SCENARIO</span><strong>{lineage.scenario.name}</strong><code>{lineage.scenario.id}</code></li><li><span>OBSERVED STATE VERSION</span><strong>V{lineage.state.version} · {displayValue(lineage.state.payload)}</strong><code>{lineage.state.id}</code>{lineage.evidenceRefs.map((evidence) => <small key={evidence.id}>↳ EVIDENCE · {evidence.sourceArtifactId} · {evidence.sourceVersion} · {evidence.locator}</small>)}</li><li><span>ASSUMPTION VERSION</span><strong>{lineage.assumptions.name} · V{lineage.assumptions.version}</strong><code>{lineage.assumptions.versionId}</code></li></ol></>}
          {replayError && <div className="ariadne-history__status" data-status="incomplete" role="alert"><strong>REPLAY UNAVAILABLE</strong><span>{replayError}</span></div>}
          {replay && (() => { const presentation = replayPresentation(replay); return <div className="ariadne-history__replay" data-match={replay.matches} role="status"><header><span>REPLAY / REPRODUCIBILITY</span><strong>{presentation.status}</strong></header><dl><div><dt>Stored result</dt><dd>{displayValue(replay.storedPayload)}</dd></div><div><dt>Replayed result</dt><dd>{displayValue(replay.replayedPayload)}</dd></div></dl><p>{presentation.detail}</p><small>Reproducibility does not establish substantive validity.</small></div>; })()}
        </section>
      )}
    </section>
  );
}
