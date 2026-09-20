import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  Archive,
  ArrowRight,
  Check,
  FlaskConical,
  GitBranch,
  History,
  LoaderCircle,
  Play,
  Plus,
  RefreshCw,
} from "lucide-react";

import {
  AriadneOperatorApiError,
  ariadneOperatorApi,
  replayPresentation,
  settleMutationAgainstWorkspace,
  type AriadneResult,
  type Lineage,
  type Replay,
  type WorkspaceDetail,
  type WorkspaceSummary,
} from "../../lib/ariadne/operatorApi";
import { GUIDED_FIXTURE, resolveGuidedFixture } from "../../lib/ariadne/guidedFixture";
import { AriadneAuthoring } from "./AriadneAuthoring";

const short = (id?: string | null) => (id ? id.slice(0, 8).toUpperCase() : "—");
const scalar = (payload?: Record<string, unknown>) =>
  typeof payload?.value === "number" ? payload.value : "—";

function explainError(error: unknown): string {
  if (!(error instanceof AriadneOperatorApiError)) return "Falha inesperada. Nenhum dado foi inventado.";
  if (error.status === 401) return "Sessão ausente ou expirada. Entre novamente para usar a bancada.";
  if (error.status === 403) return "Esta conta não está autorizada como operador.";
  if (error.status === 404) return "Workspace não encontrado ou não pertence a este operador.";
  return error.message;
}

function isAmbiguousMutationError(error: unknown): boolean {
  return !(error instanceof AriadneOperatorApiError) || error.status === 0 || error.status >= 500;
}

function DataId({ value }: { value?: string | null }) {
  return <code title={value ?? undefined}>{short(value)}</code>;
}

function WorkspaceCreator({
  busy,
  label,
  onCreate,
  onLabelChange,
}: {
  busy: string | null;
  label: string;
  onCreate: (synthetic: boolean) => void;
  onLabelChange: (label: string) => void;
}) {
  return (
    <section className="ariadne__workspace-creator" aria-label="Criar workspace Ariadne">
      <div>
        <span>ANALYSIS WORKSPACE</span>
        <h2>Comece com um contexto privado vazio.</h2>
        <p>Nenhum registro sintético será criado. Evidências, estados e premissas entram somente pelas suas ações.</p>
      </div>
      <form onSubmit={(event) => { event.preventDefault(); onCreate(false); }}>
        <label><span>Nome do workspace</span><input value={label} onChange={(event) => onLabelChange(event.target.value)} placeholder="ex.: Análise interna — setembro" /></label>
        <button className="g2-ops__button g2-ops__button--dark" type="submit" disabled={busy !== null || !label.trim()}><Archive size={15} /> Criar workspace vazio</button>
      </form>
      <button className="ariadne__demo-create" type="button" disabled={busy !== null} onClick={() => onCreate(true)}><FlaskConical size={14} /> Criar Core Test / Demo sintética</button>
    </section>
  );
}

export function AriadneWorkbench() {
  const [workspaces, setWorkspaces] = useState<WorkspaceSummary[]>([]);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [detail, setDetail] = useState<WorkspaceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const [lineage, setLineage] = useState<Lineage | null>(null);
  const [replay, setReplay] = useState<Replay | null>(null);
  const [reconciliationRequired, setReconciliationRequired] = useState(false);
  const [workspaceLabel, setWorkspaceLabel] = useState("");
  const [showWorkspaceCreator, setShowWorkspaceCreator] = useState(false);
  const [surface, setSurface] = useState<"analysis" | "demo">("analysis");
  const mutationInFlight = useRef(false);

  const loadWorkspace = useCallback(async (id: string) => {
    const next = await ariadneOperatorApi.getWorkspace(id);
    setDetail(next);
    setSelectedResultId((current) =>
      current && next.results.some((result) => result.id === current)
        ? current
        : (next.results[0]?.id ?? null),
    );
  }, []);

  const loadIndex = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ariadneOperatorApi.listWorkspaces();
      setWorkspaces(response.data);
      const nextId = workspaceId && response.data.some((item) => item.id === workspaceId)
        ? workspaceId
        : (response.data[0]?.id ?? null);
      setWorkspaceId(nextId);
      if (nextId) await loadWorkspace(nextId);
      else setDetail(null);
      setReconciliationRequired(false);
    } catch (caught) {
      setDetail(null);
      setError(explainError(caught));
    } finally {
      setLoading(false);
    }
  }, [loadWorkspace, workspaceId]);

  useEffect(() => {
    void loadIndex();
    // The initial index load owns workspace selection; later selection uses changeWorkspace.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeWorkspace = async (id: string) => {
    setWorkspaceId(id);
    setLoading(true);
    setError(null);
    setLineage(null);
    setReplay(null);
    setReconciliationRequired(false);
    setSurface("analysis");
    setShowWorkspaceCreator(false);
    try {
      await loadWorkspace(id);
    } catch (caught) {
      setDetail(null);
      setError(explainError(caught));
    } finally {
      setLoading(false);
    }
  };

  const perform = async (label: string, action: () => Promise<unknown>): Promise<boolean> => {
    if (!workspaceId || mutationInFlight.current) return false;
    mutationInFlight.current = true;
    setBusy(label);
    setError(null);
    const settlement = await settleMutationAgainstWorkspace(
      action,
      () => loadWorkspace(workspaceId),
    );
    if (!settlement.reconciled) {
      setReconciliationRequired(true);
      setError(
        "Resultado da gravação é ambíguo e o workspace não pôde ser relido. "
        + "As ações foram bloqueadas até a reconciliação com o banco.",
      );
    } else {
      setReconciliationRequired(false);
      if (settlement.actionError) {
        setError(
          isAmbiguousMutationError(settlement.actionError)
            ? "A resposta da gravação falhou. O estado persistido foi relido; confirme o registro abaixo antes de continuar."
            : explainError(settlement.actionError),
        );
      }
    }
    mutationInFlight.current = false;
    setBusy(null);
    return settlement.reconciled && settlement.actionError === null;
  };

  const fixture = useMemo(() => resolveGuidedFixture(detail), [detail]);

  const reconcileWorkspace = async () => {
    if (!workspaceId) return;
    setBusy("reconcile");
    try {
      await loadWorkspace(workspaceId);
      setReconciliationRequired(false);
      setError(null);
    } catch (caught) {
      setReconciliationRequired(true);
      setError(`Reconciliação ainda indisponível. ${explainError(caught)}`);
    } finally {
      setBusy(null);
    }
  };

  const createWorkspace = async (synthetic: boolean) => {
    const label = synthetic
      ? `Core Test sintético — ${new Date().toLocaleDateString("pt-BR")}`
      : workspaceLabel.trim();
    if (!label) return;
    setBusy("workspace");
    setError(null);
    try {
      const workspace = await ariadneOperatorApi.createWorkspace(label, synthetic);
      const response = await ariadneOperatorApi.listWorkspaces();
      setWorkspaces(response.data);
      setWorkspaceId(workspace.id);
      await loadWorkspace(workspace.id);
      setWorkspaceLabel("");
      setShowWorkspaceCreator(false);
      setSurface(synthetic ? "demo" : "analysis");
    } catch (caught) {
      setError(explainError(caught));
    } finally {
      setBusy(null);
      setLoading(false);
    }
  };

  const reconstruct = async (result: AriadneResult) => {
    if (!workspaceId) return;
    setSelectedResultId(result.id);
    setBusy("lineage");
    setError(null);
    setReplay(null);
    try {
      setLineage(await ariadneOperatorApi.getLineage(workspaceId, result.id));
    } catch (caught) {
      setLineage(null);
      setError(explainError(caught));
    } finally {
      setBusy(null);
    }
  };

  const replayResult = async () => {
    if (!workspaceId || !selectedResultId) return;
    setBusy("replay");
    setError(null);
    try {
      setReplay(await ariadneOperatorApi.replay(workspaceId, selectedResultId));
    } catch (caught) {
      setReplay(null);
      setError(explainError(caught));
    } finally {
      setBusy(null);
    }
  };

  const actions = detail && workspaceId
    ? [
        {
          key: "e1",
          label: "Registrar E1",
          detail: "Artefato sintético · revisão 1",
          done: Boolean(fixture.evidence1),
          enabled: true,
          run: () => ariadneOperatorApi.createEvidence(workspaceId, {
            ...GUIDED_FIXTURE.evidence1,
          }),
        },
        {
          key: "o1",
          label: "Criar O1",
          detail: "Objeto privado neutro",
          done: Boolean(fixture.object),
          enabled: Boolean(fixture.evidence1),
          run: () => ariadneOperatorApi.createObject(workspaceId, GUIDED_FIXTURE.objectType),
        },
        {
          key: "v1",
          label: "Gravar V1 = 10",
          detail: "Estado observado ligado a E1",
          done: Boolean(fixture.state1),
          enabled: Boolean(fixture.object && fixture.evidence1),
          run: () => ariadneOperatorApi.createState(workspaceId, fixture.object!.id, {
            payload: { value: 10 },
            evidenceRefIds: [fixture.evidence1!.id],
          }),
        },
        {
          key: "a1",
          label: "Fixar A1 × 2",
          detail: "Premissa humana explícita",
          done: Boolean(fixture.assumption1),
          enabled: Boolean(fixture.state1),
          run: async () => {
            const set = fixture.assumptionSet ?? await ariadneOperatorApi.createAssumptionSet(workspaceId, GUIDED_FIXTURE.assumptionName);
            return ariadneOperatorApi.createAssumptionVersion(workspaceId, set.id, {
              values: { multiplier: 2 },
              origin: "human_defined",
              valueSchema: { multiplier: "integer" },
            });
          },
        },
        {
          key: "s1",
          label: "Criar S1",
          detail: "V1 + A1, sem hipótese implícita",
          done: Boolean(fixture.scenario1),
          enabled: Boolean(fixture.state1 && fixture.assumption1),
          run: () => ariadneOperatorApi.createScenario(workspaceId, {
            name: GUIDED_FIXTURE.scenario1Name,
            stateVersionId: fixture.state1!.id,
            assumptionSetVersionId: fixture.assumption1!.id,
            hypotheticalState: {},
          }),
        },
        {
          key: "r1",
          label: "Executar R1",
          detail: "M1 · determinístico · 10 × 2",
          done: Boolean(fixture.result1),
          enabled: Boolean(fixture.scenario1 && fixture.model),
          run: () => ariadneOperatorApi.createRun(workspaceId, fixture.scenario1!.id, fixture.model!.id),
        },
        {
          key: "e2",
          label: "Registrar E2",
          detail: "Correção sintética · revisão 2",
          done: Boolean(fixture.evidence2),
          enabled: Boolean(fixture.result1),
          run: () => ariadneOperatorApi.createEvidence(workspaceId, {
            ...GUIDED_FIXTURE.evidence2,
          }),
        },
        {
          key: "v2",
          label: "Gravar V2 = 12",
          detail: "Supersede V1; ligado a E2",
          done: Boolean(fixture.state2),
          enabled: Boolean(fixture.object && fixture.evidence2),
          run: () => ariadneOperatorApi.createState(workspaceId, fixture.object!.id, {
            payload: { value: 12 },
            evidenceRefIds: [fixture.evidence2!.id],
          }),
        },
        {
          key: "s2",
          label: "Criar S2",
          detail: "V2 + a mesma A1 explícita",
          done: Boolean(fixture.scenario2),
          enabled: Boolean(fixture.state2 && fixture.assumption1),
          run: () => ariadneOperatorApi.createScenario(workspaceId, {
            name: GUIDED_FIXTURE.scenario2Name,
            stateVersionId: fixture.state2!.id,
            assumptionSetVersionId: fixture.assumption1!.id,
            hypotheticalState: {},
          }),
        },
        {
          key: "r2",
          label: "Executar R2",
          detail: "M1 · determinístico · 12 × 2",
          done: Boolean(fixture.result2),
          enabled: Boolean(fixture.scenario2 && fixture.model),
          run: () => ariadneOperatorApi.createRun(workspaceId, fixture.scenario2!.id, fixture.model!.id),
        },
      ]
    : [];

  return (
    <div className="ariadne">
      <header className="ariadne__heading">
        <div>
          <p className="g2-ops__eyebrow">ARIADNE ANALYST WORKBENCH / INTERNAL ALPHA</p>
          <h1>Organize o que a organização sabe.</h1>
          <p>Evidência, estado observado e premissas preservados como uma linha contínua de versões.</p>
        </div>
        <div className="ariadne__classification" aria-label="Classificação do workspace">
          {detail?.workspace.synthetic ? <FlaskConical size={17} /> : <GitBranch size={17} />}
          <span>
            <strong>{detail?.workspace.synthetic ? "CORE TEST / DEMO" : "PRIVATE / INTERNAL"}</strong>
            {detail?.workspace.synthetic ? "SYNTHETIC / ILLUSTRATIVE" : "ANALYSIS WORKSPACE"}
          </span>
        </div>
      </header>

      <ol className="ariadne__process" aria-label="Processo Ariadne">
        {["Evidence", "State", "Assumptions", "Scenario · NIV-55", "Run · NIV-55", "Result · NIV-55"].map((item, index) => (
          <li key={item} data-deferred={index > 2}><span>{String(index + 1).padStart(2, "0")}</span>{item}{index < 5 && <ArrowRight size={13} />}</li>
        ))}
      </ol>

      {error && (
        <div className="ariadne__error" role="alert">
          <strong>{reconciliationRequired ? "Reconciliação obrigatória" : "Ausência declarada"}</strong>
          <span>{error}</span>
          {reconciliationRequired && (
            <button type="button" disabled={busy !== null} onClick={() => void reconcileWorkspace()}>
              {busy === "reconcile" ? <LoaderCircle className="ariadne__spin" size={14} /> : <RefreshCw size={14} />}
              Reler estado persistido
            </button>
          )}
        </div>
      )}

      {surface === "demo" && fixture.conflicts.length > 0 && (
        <div className="ariadne__error ariadne__error--identity" role="alert">
          <strong>Conflito de identidade</strong>
          <span>
            O protocolo foi bloqueado: rótulos não são identidade. {fixture.conflicts.join(" ")}
          </span>
        </div>
      )}

      {loading ? (
        <div className="ariadne__loading" role="status"><LoaderCircle size={18} /> Lendo o estado persistido…</div>
      ) : !detail ? (
        <WorkspaceCreator busy={busy} label={workspaceLabel} onCreate={(synthetic) => void createWorkspace(synthetic)} onLabelChange={setWorkspaceLabel} />
      ) : (
        <>
          <section className="ariadne__workspace-bar">
            <div>
              <span>WORKSPACE PRIVADO</span>
              <select value={workspaceId ?? ""} onChange={(event) => void changeWorkspace(event.target.value)} aria-label="Selecionar workspace Ariadne">
                {workspaces.map((workspace) => <option key={workspace.id} value={workspace.id}>{workspace.label}</option>)}
              </select>
            </div>
            <dl>
              <div><dt>Identidade</dt><dd><DataId value={detail.workspace.id} /></dd></div>
              <div><dt>Escopo</dt><dd>derivado no servidor</dd></div>
              <div><dt>Natureza</dt><dd>{detail.workspace.synthetic ? "demo sintética" : "análise privada"}</dd></div>
            </dl>
          </section>

          <div className="ariadne__surface-switch" role="group" aria-label="Modo da bancada">
            <button type="button" data-selected={surface === "analysis"} onClick={() => setSurface("analysis")}><GitBranch size={14} /> Analysis Workspace</button>
            {detail.workspace.synthetic ? (
              <button type="button" data-selected={surface === "demo"} onClick={() => setSurface("demo")}><FlaskConical size={14} /> Core Test / Demo sintética</button>
            ) : (
              <button type="button" onClick={() => void createWorkspace(true)} disabled={busy !== null}><FlaskConical size={14} /> Criar Core Test separado</button>
            )}
            <button type="button" onClick={() => setShowWorkspaceCreator((current) => !current)}><Plus size={14} /> Novo workspace</button>
          </div>

          {showWorkspaceCreator && <WorkspaceCreator busy={busy} label={workspaceLabel} onCreate={(synthetic) => void createWorkspace(synthetic)} onLabelChange={setWorkspaceLabel} />}

          {surface === "analysis" ? (
            <AriadneAuthoring
              busy={busy}
              detail={detail}
              reconciliationRequired={reconciliationRequired}
              runMutation={perform}
              workspaceId={workspaceId!}
            />
          ) : (
          <>

          <section className="ariadne__protocol" aria-labelledby="ariadne-protocol-title">
            <div className="ariadne__section-title">
              <div><span>CORE TEST / DEMO SINTÉTICA</span><h2 id="ariadne-protocol-title">V1 → R1 → V2 → R2</h2></div>
              <p>Cada ato grava no banco real. Concluído não é simulado no navegador.</p>
            </div>
            <div className="ariadne__actions">
              {actions.map((action, index) => (
                <button
                  key={action.key}
                  type="button"
                  data-done={action.done}
                  disabled={busy !== null || reconciliationRequired || fixture.conflicts.length > 0 || action.done || !action.enabled}
                  onClick={() => void perform(action.key, action.run)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{action.label}</strong>
                  <small>{action.detail}</small>
                  {busy === action.key ? <LoaderCircle className="ariadne__spin" size={15} /> : action.done ? <Check size={15} /> : <ArrowRight size={15} />}
                </button>
              ))}
            </div>
          </section>

          <div className="ariadne__matrix">
            <section className="ariadne__panel ariadne__panel--state">
              <div className="ariadne__section-title">
                <div><span>OBSERVED STATE</span><h2>Estado privado versionado</h2></div>
                <Activity size={18} />
              </div>
              {!fixture.object ? <p className="ariadne__absence">Nenhum objeto gravado.</p> : (
                <>
                  <dl className="ariadne__identity-row">
                    <div><dt>Objeto O1</dt><dd><DataId value={fixture.object.id} /></dd></div>
                    <div><dt>Tipo</dt><dd>{fixture.object.objectType}</dd></div>
                  </dl>
                  <div className="ariadne__versions">
                    {[...detail.stateVersions].reverse().map((state) => (
                      <article key={state.id} data-current={state.current}>
                        <div><span>V{state.version}</span>{state.current ? <strong>CURRENT STATE</strong> : <strong>HISTÓRICO / SUPERSEDIDO</strong>}</div>
                        <b>{String(scalar(state.payload))}</b>
                        <dl>
                          <div><dt>State ID</dt><dd><DataId value={state.id} /></dd></div>
                          <div><dt>Evidência</dt><dd>{state.evidenceRefIds.map(short).join(", ") || "—"}</dd></div>
                          <div><dt>Anterior</dt><dd><DataId value={state.previousVersionId} /></dd></div>
                        </dl>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </section>

            <section className="ariadne__panel">
              <div className="ariadne__section-title"><div><span>EVIDENCE</span><h2>Referências de origem</h2></div><Archive size={18} /></div>
              <div className="ariadne__ledger">
                {detail.evidenceRefs.length === 0 ? <p className="ariadne__absence">Nenhuma evidência registrada.</p> : detail.evidenceRefs.map((evidence) => (
                  <article key={evidence.id}>
                    <span>{evidence.id === fixture.evidence1?.id ? "E1" : evidence.id === fixture.evidence2?.id ? "E2" : "E?"}</span><strong>{evidence.sourceArtifactId}</strong>
                    <dl><div><dt>versão</dt><dd>{evidence.sourceVersion}</dd></div><div><dt>locator</dt><dd>{evidence.locator}</dd></div><div><dt>ref</dt><dd><DataId value={evidence.id} /></dd></div></dl>
                  </article>
                ))}
              </div>
            </section>

            <section className="ariadne__panel">
              <div className="ariadne__section-title"><div><span>ASSUMPTIONS</span><h2>Premissas explícitas</h2></div><GitBranch size={18} /></div>
              {!fixture.assumption1 ? <p className="ariadne__absence">Nenhuma premissa fixada.</p> : (
                <div className="ariadne__fact-grid">
                  <div><span>Conjunto</span><strong>A1</strong><small>{fixture.assumptionSet?.name}</small></div>
                  <div><span>Valor</span><strong>× {String(fixture.assumption1.values.multiplier)}</strong><small>multiplier · integer</small></div>
                  <div><span>Origem</span><strong>Humana</strong><small>{fixture.assumption1.origin}</small></div>
                  <div><span>Versão</span><strong>V{fixture.assumption1.version}</strong><small><DataId value={fixture.assumption1.id} /></small></div>
                </div>
              )}
            </section>

            <section className="ariadne__panel">
              <div className="ariadne__section-title"><div><span>SCENARIO</span><h2>Manifestos de análise</h2></div><History size={18} /></div>
              <div className="ariadne__ledger">
                {detail.scenarios.length === 0 ? <p className="ariadne__absence">Nenhum cenário criado.</p> : detail.scenarios.map((scenario) => {
                  const state = detail.stateVersions.find((item) => item.id === scenario.stateVersionId);
                  const label = scenario.id === fixture.scenario1?.id ? "S1" : scenario.id === fixture.scenario2?.id ? "S2" : "S?";
                  return <article key={scenario.id}><span>{label}</span><strong>{scenario.name}</strong><dl><div><dt>estado fixado</dt><dd>V{state?.version ?? "—"}</dd></div><div><dt>hipótese</dt><dd>{Object.keys(scenario.hypotheticalState).length ? JSON.stringify(scenario.hypotheticalState) : "nenhuma"}</dd></div><div><dt>ref</dt><dd><DataId value={scenario.id} /></dd></div></dl></article>;
                })}
              </div>
            </section>
          </div>

          <section className="ariadne__runs">
            <div className="ariadne__section-title"><div><span>RUN / RESULT</span><h2>Execuções imutáveis</h2></div><Play size={18} /></div>
            <div className="ariadne__model-strip">
              <span>MODELO REGISTRADO</span><strong>{fixture.model?.name ?? "indisponível"}</strong><b>{fixture.model ? `v${fixture.model.semanticVersion}` : "—"}</b><code>{fixture.model?.implementationIdentity ?? "—"}</code>
            </div>
            {detail.results.length === 0 ? <p className="ariadne__absence">Nenhum resultado persistido.</p> : (
              <div className="ariadne__result-grid">
                {detail.results.map((result) => {
                  const run = detail.runs.find((item) => item.id === result.modelRunId);
                  const state = detail.stateVersions.find((item) => item.id === run?.stateVersionId);
                  const scenario = detail.scenarios.find((item) => item.id === run?.scenarioId);
                  const resultLabel = result.id === fixture.result1?.id ? "X1" : result.id === fixture.result2?.id ? "X2" : "X?";
                  const runLabel = run?.id === fixture.run1?.id ? "R1" : run?.id === fixture.run2?.id ? "R2" : "R?";
                  return (
                    <article key={result.id} data-selected={selectedResultId === result.id}>
                      <header><span>{resultLabel}</span><strong>{String(scalar(result.payload))}</strong><small>stored result</small></header>
                      <dl>
                        <div><dt>Run</dt><dd>{runLabel} · <DataId value={run?.id} /></dd></div>
                        <div><dt>Cenário</dt><dd>{scenario?.name ?? "—"}</dd></div>
                        <div><dt>Estado usado</dt><dd>V{state?.version ?? "—"} · <DataId value={state?.id} /></dd></div>
                        <div><dt>Configuração</dt><dd>{JSON.stringify(run?.executionConfiguration ?? {})}</dd></div>
                      </dl>
                      <button type="button" className="g2-ops__button" disabled={busy !== null} onClick={() => void reconstruct(result)}><GitBranch size={14} /> Reconstruir {resultLabel === "X?" ? "resultado" : resultLabel}</button>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <div className="ariadne__verification">
            <section className="ariadne__lineage">
              <div className="ariadne__section-title"><div><span>RECONSTRUCT</span><h2>Qual cadeia produziu este resultado?</h2></div><GitBranch size={18} /></div>
              {!lineage ? <p className="ariadne__absence">Selecione “Reconstruir” em um resultado. A cadeia histórica será lida por IDs exatos, nunca por “latest”.</p> : (
                <ol aria-label="Cadeia histórica reconstruída">
                  <li><span>X</span><strong>Resultado {scalar(lineage.result.payload)}</strong><DataId value={lineage.result.id} /></li>
                  <li><span>R</span><strong>Run histórico</strong><DataId value={lineage.run.id} /></li>
                  <li><span>M</span><strong>{lineage.model.name} v{lineage.model.semanticVersion}</strong><DataId value={lineage.model.versionId} /></li>
                  <li><span>S</span><strong>{lineage.scenario.name}</strong><DataId value={lineage.scenario.id} /></li>
                  <li><span>A</span><strong>{lineage.assumptions.name} · V{lineage.assumptions.version}</strong><DataId value={lineage.assumptions.versionId} /></li>
                  <li><span>V</span><strong>State V{lineage.state.version} = {String(scalar(lineage.state.payload))}</strong><DataId value={lineage.state.id} /></li>
                  <li><span>O</span><strong>{lineage.object.objectType}</strong><DataId value={lineage.object.id} /></li>
                  {lineage.evidenceRefs.map((evidence) => <li key={evidence.id}><span>E</span><strong>{evidence.sourceArtifactId} · rev {evidence.sourceVersion}</strong><DataId value={evidence.id} /></li>)}
                </ol>
              )}
            </section>

            <section className="ariadne__replay">
              <div className="ariadne__section-title"><div><span>REPLAY</span><h2>O manifesto histórico ainda reproduz?</h2></div><RefreshCw size={18} /></div>
              <p>Executa outra vez o estado, premissas, modelo e configuração guardados no run selecionado.</p>
              <button type="button" className="g2-ops__button g2-ops__button--dark" disabled={!selectedResultId || busy !== null} onClick={() => void replayResult()}>
                {busy === "replay" ? <LoaderCircle className="ariadne__spin" size={14} /> : <RefreshCw size={14} />} Reexecutar manifesto exato
              </button>
              {replay && (() => {
                const presentation = replayPresentation(replay);
                return (
                <div className="ariadne__replay-result" data-match={replay.matches} role="status">
                  <span>{presentation.status}</span>
                  <dl><div><dt>Armazenado</dt><dd>{String(scalar(replay.storedPayload))}</dd></div><div><dt>Reexecutado</dt><dd>{String(scalar(replay.replayedPayload))}</dd></div></dl>
                  <small>{presentation.detail}</small>
                </div>
                );
              })()}
            </section>
          </div>
          </>
          )}
        </>
      )}
    </div>
  );
}
