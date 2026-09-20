import type {
  AssumptionSet,
  AssumptionVersion,
  ModelVersion,
  Scenario,
  StateVersion,
  WorkspaceDetail,
} from "./operatorApi";

export const INTERNAL_TEST_MODEL_NAME = "deterministic_scalar_model";
export const INTERNAL_TEST_MODEL_IMPLEMENTATION =
  "ariadne.deterministic_scalar.multiply.v1";

export interface AssumptionVersionChoice {
  set: AssumptionSet;
  version: AssumptionVersion;
  current: boolean;
}

export interface ScenarioPreflight {
  compatible: boolean;
  messages: string[];
}

export function assumptionVersionChoices(
  detail: WorkspaceDetail,
): AssumptionVersionChoice[] {
  return detail.assumptionSets.flatMap((set) => {
    const newest = Math.max(0, ...set.versions.map((version) => version.version));
    return set.versions.map((version) => ({
      set,
      version,
      current: version.version === newest,
    }));
  });
}

export function stateForScenario(
  detail: WorkspaceDetail,
  scenario: Scenario,
): StateVersion | undefined {
  return detail.stateVersions.find((state) => state.id === scenario.stateVersionId);
}

export function assumptionForScenario(
  detail: WorkspaceDetail,
  scenario: Scenario,
): AssumptionVersionChoice | undefined {
  return assumptionVersionChoices(detail).find(
    (choice) => choice.version.id === scenario.assumptionSetVersionId,
  );
}

const isInteger = (value: unknown) =>
  typeof value === "number" && Number.isInteger(value);

export function preflightScenario(
  detail: WorkspaceDetail,
  scenario: Scenario | undefined,
  model: ModelVersion | undefined,
): ScenarioPreflight {
  if (!scenario) {
    return { compatible: false, messages: ["Selecione um cenário persistido."] };
  }
  if (!model) {
    return { compatible: false, messages: ["Selecione um modelo aprovado habilitado."] };
  }
  if (
    model.name !== INTERNAL_TEST_MODEL_NAME
    || model.implementationIdentity !== INTERNAL_TEST_MODEL_IMPLEMENTATION
  ) {
    return {
      compatible: false,
      messages: ["Este modelo não possui um adaptador de compatibilidade aprovado nesta fase."],
    };
  }

  const state = stateForScenario(detail, scenario);
  const assumptions = assumptionForScenario(detail, scenario);
  const messages: string[] = [];
  const observedContract = model.inputContract.observed_state;
  const assumptionContract = model.inputContract.assumptions;
  const supportedContract =
    typeof observedContract === "object"
    && observedContract !== null
    && (observedContract as Record<string, unknown>).value === "integer"
    && typeof assumptionContract === "object"
    && assumptionContract !== null
    && (assumptionContract as Record<string, unknown>).multiplier === "integer";

  if (!supportedContract) {
    messages.push("O contrato deste modelo não corresponde ao adaptador interno aprovado.");
  }
  if (!state) {
    messages.push("A versão de estado vinculada não está disponível neste workspace.");
  } else if (!isInteger(state.payload.value)) {
    messages.push("Estado selecionado: o campo “value” precisa ser um número inteiro.");
  }
  if (!assumptions) {
    messages.push("A versão de premissas vinculada não está disponível neste workspace.");
  } else if (!isInteger(assumptions.version.values.multiplier)) {
    messages.push("Premissas selecionadas: o campo “multiplier” precisa ser um número inteiro.");
  }

  return { compatible: messages.length === 0, messages };
}
