import { useCallback, useEffect, useMemo, useState } from "react";
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
  RefreshCw,
} from "lucide-react";

import {
  AriadneOperatorApiError,
  ariadneOperatorApi,
  type AriadneResult,
  type Lineage,
  type Replay,
  type WorkspaceDetail,
  type WorkspaceSummary,
} from "../../lib/ariadne/operatorApi";

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

function DataId({ value }: { value?: string | null }) {
  return <code title={value ?? undefined}>{short(value)}</code>;
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
    try {
      await loadWorkspace(id);
    } catch (caught) {
      setDetail(null);
      setError(explainError(caught));
    } finally {
      setLoading(false);
    }
  };

  const perform = async (label: string, action: () => Promise<unknown>) => {
    if (!workspaceId) return;
    setBusy(label);
    setError(null);
    try {
      await action();
      await loadWorkspace(workspaceId);
    } catch (caught) {
      setError(explainError(caught));
    } finally {
      setBusy(null);
    }
  };

  const fixture = useMemo(() => {
    const evidence1 = detail?.evidenceRefs.find((item) => item.sourceArtifactId === "SYNTHETIC-E1");
    const evidence2 = detail?.evidenceRefs.find((item) => item.sourceArtifactId === "SYNTHETIC-E2");
    const object = detail?.objects.find((item) => item.objectType === "synthetic_scalar_observation");
    const states = detail?.stateVersions.filter((item) => item.objectId === object?.id) ?? [];
    const state1 = states.find((item) => item.version === 1);
    const state2 = states.find((item) => item.version === 2);
    const assumptionSet = detail?.assumptionSets.find((item) => item.name === "A1 — Multiplicador sintético");
    const assumption1 = assumptionSet?.versions.find((item) => item.version === 1);
    const scenario1 = detail?.scenarios.find((item) => item.name === "S1 — Estado observado V1");
    const scenario2 = detail?.scenarios.find((item) => item.name === "S2 — Estado observado V2");
    const model = detail?.models.find((item) => item.name === "deterministic_scalar_model");
    const run1 = detail?.runs.find((item) => item.scenarioId === scenario1?.id);
    const run2 = detail?.runs.find((item) => item.scenarioId === scenario2?.id);
    const result1 = detail?.results.find((item) => item.modelRunId === run1?.id);
    const result2 = detail?.results.find((item) => item.modelRunId === run2?.id);
    return {
      evidence1,
      evidence2,
      object,
      state1,
      state2,
      assumptionSet,
      assumption1,
      scenario1,
      scenario2,
      model,
      run1,
      run2,
      result1,
      result2,
    };
  }, [detail]);

  const createWorkspace = async () => {
    setBusy("workspace");
    setError(null);
    try {
      const workspace = await ariadneOperatorApi.createWorkspace("Ensaio escalar — NIV-48");
      const response = await ariadneOperatorApi.listWorkspaces();
      setWorkspaces(response.data);
      setWorkspaceId(workspace.id);
      await loadWorkspace(workspace.id);
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
            sourceArtifactId: "SYNTHETIC-E1",
            sourceVersion: "1",
            locator: "illustrative://scalar/input/value-10",
          }),
        },
        {
          key: "o1",
          label: "Criar O1",
          detail: "Objeto privado neutro",
          done: Boolean(fixture.object),
          enabled: Boolean(fixture.evidence1),
          run: () => ariadneOperatorApi.createObject(workspaceId, "synthetic_scalar_observation"),
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
            const set = fixture.assumptionSet ?? await ariadneOperatorApi.createAssumptionSet(workspaceId, "A1 — Multiplicador sintético");
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
            name: "S1 — Estado observado V1",
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
            sourceArtifactId: "SYNTHETIC-E2",
            sourceVersion: "2",
            locator: "illustrative://scalar/input/value-12",
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
            name: "S2 — Estado observado V2",
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
          <p className="g2-ops__eyebrow">ARIADNE / ESTADO PRIVADO RECONSTRUÍVEL</p>
          <h1>A memória antes do dashboard.</h1>
          <p>O que sabemos, o que mudou e exatamente o que produziu cada resultado.</p>
        </div>
        <div className="ariadne__classification" aria-label="Classificação do workspace">
          <FlaskConical size={17} />
          <span><strong>SYNTHETIC / ILLUSTRATIVE</strong>CASE-INDEPENDENT CORE TEST</span>
        </div>
      </header>

      <ol className="ariadne__process" aria-label="Processo Ariadne">
        {["Evidence", "State", "Assumptions", "Scenario", "Run", "Result"].map((item, index) => (
          <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}{index < 5 && <ArrowRight size={13} />}</li>
        ))}
      </ol>

      {error && <div className="ariadne__error" role="alert"><strong>Ausência declarada</strong><span>{error}</span></div>}

      {loading ? (
        <div className="ariadne__loading" role="status"><LoaderCircle size={18} /> Lendo o estado persistido…</div>
      ) : !detail ? (
        <section className="ariadne__empty">
          <span>SEM WORKSPACE</span>
          <h2>Nenhum contexto privado foi criado.</h2>
          <p>Abra um ensaio sintético isolado. O servidor deriva o contexto privado; o navegador não escolhe tenant.</p>
          <button className="g2-ops__button g2-ops__button--dark" type="button" disabled={busy !== null} onClick={() => void createWorkspace()}>
            <Archive size={15} /> Criar workspace sintético
          </button>
        </section>
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
              <div><dt>Natureza</dt><dd>sintético</dd></div>
            </dl>
          </section>

          <section className="ariadne__protocol" aria-labelledby="ariadne-protocol-title">
            <div className="ariadne__section-title">
              <div><span>PROTOCOLO GUIADO</span><h2 id="ariadne-protocol-title">V1 → R1 → V2 → R2</h2></div>
              <p>Cada ato grava no banco real. Concluído não é simulado no navegador.</p>
            </div>
            <div className="ariadne__actions">
              {actions.map((action, index) => (
                <button
                  key={action.key}
                  type="button"
                  data-done={action.done}
                  disabled={busy !== null || action.done || !action.enabled}
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
                {detail.evidenceRefs.length === 0 ? <p className="ariadne__absence">Nenhuma evidência registrada.</p> : detail.evidenceRefs.map((evidence, index) => (
                  <article key={evidence.id}>
                    <span>E{index + 1}</span><strong>{evidence.sourceArtifactId}</strong>
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
                {detail.scenarios.length === 0 ? <p className="ariadne__absence">Nenhum cenário criado.</p> : detail.scenarios.map((scenario, index) => {
                  const state = detail.stateVersions.find((item) => item.id === scenario.stateVersionId);
                  return <article key={scenario.id}><span>S{index + 1}</span><strong>{scenario.name}</strong><dl><div><dt>estado fixado</dt><dd>V{state?.version ?? "—"}</dd></div><div><dt>hipótese</dt><dd>{Object.keys(scenario.hypotheticalState).length ? JSON.stringify(scenario.hypotheticalState) : "nenhuma"}</dd></div><div><dt>ref</dt><dd><DataId value={scenario.id} /></dd></div></dl></article>;
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
                {detail.results.map((result, index) => {
                  const run = detail.runs.find((item) => item.id === result.modelRunId);
                  const state = detail.stateVersions.find((item) => item.id === run?.stateVersionId);
                  const scenario = detail.scenarios.find((item) => item.id === run?.scenarioId);
                  return (
                    <article key={result.id} data-selected={selectedResultId === result.id}>
                      <header><span>X{index + 1}</span><strong>{String(scalar(result.payload))}</strong><small>stored result</small></header>
                      <dl>
                        <div><dt>Run</dt><dd>R{index + 1} · <DataId value={run?.id} /></dd></div>
                        <div><dt>Cenário</dt><dd>{scenario?.name ?? "—"}</dd></div>
                        <div><dt>Estado usado</dt><dd>V{state?.version ?? "—"} · <DataId value={state?.id} /></dd></div>
                        <div><dt>Configuração</dt><dd>{JSON.stringify(run?.executionConfiguration ?? {})}</dd></div>
                      </dl>
                      <button type="button" className="g2-ops__button" disabled={busy !== null} onClick={() => void reconstruct(result)}><GitBranch size={14} /> Reconstruir X{index + 1}</button>
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
              {replay && (
                <div className="ariadne__replay-result" data-match={replay.matches} role="status">
                  <span>{replay.matches ? "MATCH CONFIRMADO" : "MISMATCH DETECTADO"}</span>
                  <dl><div><dt>Armazenado</dt><dd>{String(scalar(replay.storedPayload))}</dd></div><div><dt>Reexecutado</dt><dd>{String(scalar(replay.replayedPayload))}</dd></div></dl>
                  <small>{replay.matches ? "O output é idêntico ao X armazenado." : "O replay divergiu; o resultado histórico permanece inalterado."}</small>
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
