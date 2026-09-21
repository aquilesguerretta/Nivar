import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  FlaskConical,
  GitBranch,
  Play,
  Plus,
} from "lucide-react";

import {
  AuthoringValidationError,
  authoringFieldsToPayload,
  formatAuthoringValue,
  payloadToAuthoringFields,
  type AuthoringField,
} from "../../lib/ariadne/authoring";
import {
  ariadneOperatorApi,
  type ModelVersion,
  type Scenario,
  type WorkspaceDetail,
} from "../../lib/ariadne/operatorApi";
import {
  assumptionForScenario,
  assumptionVersionChoices,
  preflightScenario,
  stateForScenario,
} from "../../lib/ariadne/scenarioStudio";
import { FieldEditor } from "./AriadneFieldEditor";

type MutationRunner = (
  label: string,
  action: () => Promise<unknown>,
) => Promise<boolean>;

interface AriadneScenarioStudioProps {
  busy: string | null;
  detail: WorkspaceDetail;
  reconciliationRequired: boolean;
  runMutation: MutationRunner;
  workspaceId: string;
  onInvestigateRun: (runId: string) => void;
}

const newestScenarioId = (detail: WorkspaceDetail) =>
  detail.scenarios[detail.scenarios.length - 1]?.id ?? "";

const defaultStateVersionId = (detail: WorkspaceDetail) =>
  detail.stateVersions.find((state) => state.current)?.id
  ?? detail.stateVersions[detail.stateVersions.length - 1]?.id
  ?? "";

const defaultAssumptionVersionId = (detail: WorkspaceDetail) =>
  assumptionVersionChoices(detail).find((choice) => choice.current)?.version.id
  ?? assumptionVersionChoices(detail)[0]?.version.id
  ?? "";

const hypothesisFields = (scenario?: Scenario): AuthoringField[] => {
  if (!scenario || Object.keys(scenario.hypotheticalState).length === 0) return [];
  return payloadToAuthoringFields(scenario.hypotheticalState);
};

function stateLabel(detail: WorkspaceDetail, stateVersionId: string) {
  const state = detail.stateVersions.find((candidate) => candidate.id === stateVersionId);
  if (!state) return "Estado indisponível";
  const object = detail.objects.find((candidate) => candidate.id === state.objectId);
  const name = object?.displayLabel ?? object?.objectType ?? "Objeto privado";
  return `${name} · V${state.version} · ${state.current ? "CURRENT" : "HISTÓRICO"}`;
}

function assumptionLabel(detail: WorkspaceDetail, assumptionVersionId: string) {
  const choice = assumptionVersionChoices(detail).find(
    (candidate) => candidate.version.id === assumptionVersionId,
  );
  if (!choice) return "Premissas indisponíveis";
  return `${choice.set.name} · V${choice.version.version} · ${choice.current ? "CURRENT" : "HISTÓRICO"}`;
}

function ModelContract({ model }: { model: ModelVersion }) {
  return (
    <div className="ariadne-studio__contract">
      <strong>Input esperado</strong>
      <span>state.value → número inteiro</span>
      <span>assumption multiplier → número inteiro</span>
      <small>Contrato técnico real: observed_state.value e assumptions.multiplier.</small>
      <details>
        <summary>Ver contrato e implementação</summary>
        <dl>
          <div><dt>Implementação</dt><dd><code>{model.implementationIdentity}</code></dd></div>
          <div><dt>Input</dt><dd><code>{JSON.stringify(model.inputContract)}</code></dd></div>
          <div><dt>Output</dt><dd><code>{JSON.stringify(model.outputContract)}</code></dd></div>
          <div><dt>ID técnico</dt><dd><code>{model.id}</code></dd></div>
        </dl>
      </details>
    </div>
  );
}

export function AriadneScenarioStudio({
  busy,
  detail,
  reconciliationRequired,
  runMutation,
  workspaceId,
  onInvestigateRun,
}: AriadneScenarioStudioProps) {
  const locked = busy !== null || reconciliationRequired;
  const assumptionChoices = useMemo(() => assumptionVersionChoices(detail), [detail]);
  const [scenarioFormOpen, setScenarioFormOpen] = useState(false);
  const [scenarioName, setScenarioName] = useState("");
  const [stateVersionId, setStateVersionId] = useState(defaultStateVersionId(detail));
  const [assumptionVersionId, setAssumptionVersionId] = useState(
    defaultAssumptionVersionId(detail),
  );
  const [hypotheticalFields, setHypotheticalFields] = useState<AuthoringField[]>([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState(newestScenarioId(detail));
  const [selectedModelId, setSelectedModelId] = useState(detail.models[0]?.id ?? "");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!detail.scenarios.some((scenario) => scenario.id === selectedScenarioId)) {
      setSelectedScenarioId(newestScenarioId(detail));
    }
  }, [detail.scenarios, selectedScenarioId]);

  useEffect(() => {
    if (!detail.models.some((model) => model.id === selectedModelId)) {
      setSelectedModelId(detail.models[0]?.id ?? "");
    }
  }, [detail.models, selectedModelId]);

  const selectedScenario = detail.scenarios.find(
    (scenario) => scenario.id === selectedScenarioId,
  );
  const selectedModel = detail.models.find((model) => model.id === selectedModelId);
  const preflight = preflightScenario(detail, selectedScenario, selectedModel);

  const openScenario = (source?: Scenario) => {
    setFormError(null);
    setScenarioName(source ? `${source.name} — cópia` : "");
    setStateVersionId(source?.stateVersionId ?? defaultStateVersionId(detail));
    setAssumptionVersionId(
      source?.assumptionSetVersionId ?? defaultAssumptionVersionId(detail),
    );
    try {
      setHypotheticalFields(hypothesisFields(source));
      setScenarioFormOpen(true);
    } catch (caught) {
      setFormError(
        caught instanceof Error
          ? caught.message
          : "As alterações hipotéticas não podem ser abertas com segurança.",
      );
    }
  };

  const submitScenario = async () => {
    if (!scenarioName.trim() || !stateVersionId || !assumptionVersionId) {
      setFormError("Nome, versão de estado e versão de premissas são obrigatórios.");
      return;
    }
    try {
      const hypotheticalState = hypotheticalFields.length
        ? authoringFieldsToPayload(hypotheticalFields)
        : {};
      const saved = await runMutation("scenario-authoring", () =>
        ariadneOperatorApi.createScenario(workspaceId, {
          name: scenarioName.trim(),
          stateVersionId,
          assumptionSetVersionId: assumptionVersionId,
          hypotheticalState,
        }));
      if (saved) {
        setScenarioFormOpen(false);
        setScenarioName("");
        setHypotheticalFields([]);
      }
    } catch (caught) {
      setFormError(
        caught instanceof AuthoringValidationError
          ? caught.message
          : "Revise as alterações hipotéticas.",
      );
    }
  };

  const enableModel = async () => {
    await runMutation("internal-model-enablement", () =>
      ariadneOperatorApi.enableInternalTestModel(workspaceId));
  };

  const executeRun = async () => {
    setFormError(null);
    if (!selectedScenario || !selectedModel || !preflight.compatible) {
      setFormError(preflight.messages.join(" "));
      return;
    }
    await runMutation("model-run", () =>
      ariadneOperatorApi.createRun(workspaceId, selectedScenario.id, selectedModel.id));
  };

  return (
    <div className="ariadne-studio">
      {formError && <div className="ariadne-authoring__form-error" role="alert">{formError}</div>}

      <section className="ariadne-authoring__section" id="ariadne-scenarios">
        <header>
          <div>
            <span>SCENARIO BRANCH</span>
            <h2>Cenários</h2>
            <p>Cada cenário preserva versões exatas de estado e premissas.</p>
          </div>
          <button
            type="button"
            className="g2-ops__button"
            disabled={locked || detail.stateVersions.length === 0 || assumptionChoices.length === 0}
            onClick={() => openScenario()}
          >
            <Plus size={14} /> Criar cenário
          </button>
        </header>

        {detail.stateVersions.length === 0 && (
          <p className="ariadne__absence">Registre um estado observado antes de criar cenários.</p>
        )}
        {assumptionChoices.length === 0 && (
          <p className="ariadne__absence">Crie uma versão de premissas antes de criar cenários.</p>
        )}

        {scenarioFormOpen && (
          <form
            className="ariadne-authoring__form ariadne-authoring__form--stack ariadne-studio__scenario-form"
            onSubmit={(event) => { event.preventDefault(); void submitScenario(); }}
          >
            <div className="ariadne-authoring__form-intro">
              <span>NOVO CENÁRIO IMUTÁVEL</span>
              <strong>Escolha versões exatas; nenhuma referência a “latest” será salva.</strong>
            </div>
            <label>
              <span>Nome do cenário</span>
              <input
                value={scenarioName}
                placeholder="ex.: Base"
                onChange={(event) => setScenarioName(event.target.value)}
              />
            </label>
            <label>
              <span>Estado observado — versão exata</span>
              <select value={stateVersionId} onChange={(event) => setStateVersionId(event.target.value)}>
                {detail.stateVersions.map((state) => (
                  <option key={state.id} value={state.id}>{stateLabel(detail, state.id)}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Premissas — versão exata</span>
              <select
                value={assumptionVersionId}
                onChange={(event) => setAssumptionVersionId(event.target.value)}
              >
                {assumptionChoices.map((choice) => (
                  <option key={choice.version.id} value={choice.version.id}>
                    {assumptionLabel(detail, choice.version.id)} · origem {choice.version.origin}
                  </option>
                ))}
              </select>
            </label>
            <div className="ariadne-studio__hypothesis-copy">
              <GitBranch size={15} />
              <p>Alterações hipotéticas pertencem apenas a este cenário e não modificam o estado observado.</p>
            </div>
            <FieldEditor
              allowEmpty
              disabled={locked}
              fields={hypotheticalFields}
              legend="Alterações hipotéticas — opcionais"
              onChange={setHypotheticalFields}
            />
            <div className="ariadne-authoring__form-actions">
              <button type="button" onClick={() => setScenarioFormOpen(false)}>Cancelar</button>
              <button className="g2-ops__button g2-ops__button--dark" disabled={locked} type="submit">
                Salvar novo cenário
              </button>
            </div>
          </form>
        )}

        {detail.scenarios.length === 0 ? (
          detail.stateVersions.length > 0 && assumptionChoices.length > 0 && (
            <div className="ariadne-authoring__empty">
              <p>Nenhum cenário persistido.</p>
              <button type="button" className="g2-ops__button" disabled={locked} onClick={() => openScenario()}>
                <Plus size={14} /> Criar cenário
              </button>
            </div>
          )
        ) : (
          <div className="ariadne-studio__scenario-list">
            {detail.scenarios.map((scenario) => {
              const state = stateForScenario(detail, scenario);
              const assumption = assumptionForScenario(detail, scenario);
              return (
                <article key={scenario.id}>
                  <header><GitBranch size={15} /><div><span>CENÁRIO IMUTÁVEL</span><h3>{scenario.name}</h3></div></header>
                  <dl>
                    <div><dt>Estado observado</dt><dd>{stateLabel(detail, scenario.stateVersionId)}</dd></div>
                    <div><dt>Premissas</dt><dd>{assumptionLabel(detail, scenario.assumptionSetVersionId)}</dd></div>
                  </dl>
                  <div className="ariadne-studio__hypothesis-summary">
                    <strong>Alterações hipotéticas</strong>
                    {Object.keys(scenario.hypotheticalState).length === 0 ? (
                      <span>Nenhuma.</span>
                    ) : (
                      <dl>{Object.entries(scenario.hypotheticalState).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{formatAuthoringValue(value)}</dd></div>)}</dl>
                    )}
                  </div>
                  <details>
                    <summary>Ver vínculos técnicos</summary>
                    <code>{scenario.id}</code>
                    <small>Estado {state?.id} · Premissas {assumption?.version.id}</small>
                  </details>
                  <button type="button" className="ariadne-fields__add" disabled={locked} onClick={() => openScenario(scenario)}>
                    <Copy size={13} /> Duplicar cenário
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="ariadne-authoring__section" id="ariadne-runs">
        <header>
          <div>
            <span>MODELS & RUNS</span>
            <h2>Modelo aprovado e execuções</h2>
            <p>Execução determinística vinculada ao cenário e à versão exata do modelo.</p>
          </div>
        </header>

        {detail.models.length === 0 ? (
          <div className="ariadne-studio__model-empty">
            <FlaskConical size={18} />
            <div>
              <strong>Nenhum modelo aprovado habilitado neste workspace.</strong>
              <p>O workspace permanece vazio por padrão. Habilite explicitamente o único modelo interno registrado.</p>
            </div>
            <button type="button" className="g2-ops__button" disabled={locked} onClick={() => void enableModel()}>
              Habilitar modelo interno de teste
            </button>
          </div>
        ) : (
          <div className="ariadne-studio__models">
            {detail.models.map((model) => (
              <article key={model.id}>
                <div className="ariadne-studio__model-classification">
                  <span>INTERNAL TEST MODEL</span>
                  <strong>DOMAIN-NEUTRAL</strong>
                  <small>NOT AN ENERGY MODEL</small>
                </div>
                <h3>Modelo interno de teste</h3>
                <p>{model.name} · versão {model.semanticVersion}</p>
                <ModelContract model={model} />
              </article>
            ))}
          </div>
        )}

        {detail.models.length > 0 && (
          <div className="ariadne-studio__run-console">
            <div className="ariadne-authoring__form-intro">
              <span>EXECUÇÃO PERSISTIDA</span>
              <strong>O servidor executa; o navegador apenas escolhe IDs exatos.</strong>
            </div>
            <label>
              <span>Cenário</span>
              <select value={selectedScenarioId} onChange={(event) => setSelectedScenarioId(event.target.value)}>
                <option value="">Selecione</option>
                {detail.scenarios.map((scenario) => <option key={scenario.id} value={scenario.id}>{scenario.name}</option>)}
              </select>
            </label>
            <label>
              <span>Modelo e versão</span>
              <select value={selectedModelId} onChange={(event) => setSelectedModelId(event.target.value)}>
                {detail.models.map((model) => <option key={model.id} value={model.id}>Modelo interno de teste · {model.semanticVersion}</option>)}
              </select>
            </label>
            <div className="ariadne-studio__preflight" data-compatible={preflight.compatible}>
              {preflight.compatible ? <CheckCircle2 size={17} /> : <AlertCircle size={17} />}
              <div>
                <strong>{preflight.compatible ? "Entradas compatíveis" : "Execução bloqueada"}</strong>
                {preflight.compatible ? (
                  <p>state.value e assumption multiplier são inteiros nas versões exatas escolhidas.</p>
                ) : (
                  preflight.messages.map((message) => <p key={message}>{message}</p>)
                )}
                <small>Alterações hipotéticas são preservadas no cenário; o executor v1 consome o estado observado e as premissas vinculadas.</small>
              </div>
            </div>
            <button
              type="button"
              className="g2-ops__button g2-ops__button--dark"
              disabled={locked || !preflight.compatible}
              onClick={() => void executeRun()}
            >
              <Play size={14} /> Executar modelo
            </button>
          </div>
        )}

        <div className="ariadne-studio__results">
          {detail.runs.length === 0 ? (
            <p className="ariadne__absence">Nenhuma execução persistida.</p>
          ) : [...detail.runs].reverse().map((run) => {
            const result = detail.results.find((candidate) => candidate.modelRunId === run.id);
            const scenario = detail.scenarios.find((candidate) => candidate.id === run.scenarioId);
            const model = detail.models.find((candidate) => candidate.id === run.modelVersionId);
            return (
              <article key={run.id}>
                <header><span>RESULT</span><strong>{result ? "PERSISTIDO" : "RESULTADO AUSENTE"}</strong></header>
                {result && (
                  <dl className="ariadne-studio__result-values">
                    {Object.entries(result.payload).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{formatAuthoringValue(value)}</dd></div>)}
                  </dl>
                )}
                <dl>
                  <div><dt>Modelo</dt><dd>Modelo interno de teste</dd></div>
                  <div><dt>Versão do modelo</dt><dd>{model?.semanticVersion ?? "indisponível"}</dd></div>
                  <div><dt>Cenário</dt><dd>{scenario?.name ?? "indisponível"}</dd></div>
                  <div><dt>Estado observado</dt><dd>{stateLabel(detail, run.stateVersionId)}</dd></div>
                  <div><dt>Premissas</dt><dd>{assumptionLabel(detail, run.assumptionSetVersionId)}</dd></div>
                  <div><dt>Produzido em</dt><dd>{new Date(run.producedAt).toLocaleString("pt-BR")}</dd></div>
                </dl>
                <details>
                  <summary>Ver detalhes técnicos da execução</summary>
                  <dl>
                    <div><dt>ModelRun ID</dt><dd><code>{run.id}</code></dd></div>
                    <div><dt>Result ID</dt><dd><code>{result?.id ?? "ausente"}</code></dd></div>
                    <div><dt>Configuração</dt><dd><code>{JSON.stringify(run.executionConfiguration)}</code></dd></div>
                    <div><dt>Implementação</dt><dd><code>{model?.implementationIdentity ?? "indisponível"}</code></dd></div>
                  </dl>
                </details>
                {result && (
                  <button type="button" className="ariadne-fields__add" onClick={() => onInvestigateRun(run.id)}>
                    <GitBranch size={13} /> Investigar resultado
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
