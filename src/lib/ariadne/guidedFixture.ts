import type {
  AriadneResult,
  AssumptionSet,
  AssumptionVersion,
  EvidenceRef,
  ModelRun,
  ModelVersion,
  PrivateObject,
  Scenario,
  StateVersion,
  WorkspaceDetail,
} from "./operatorApi";

export const GUIDED_FIXTURE = {
  evidence1: {
    sourceArtifactId: "SYNTHETIC-E1",
    sourceVersion: "1",
    locator: "illustrative://scalar/input/value-10",
  },
  evidence2: {
    sourceArtifactId: "SYNTHETIC-E2",
    sourceVersion: "2",
    locator: "illustrative://scalar/input/value-12",
  },
  objectType: "synthetic_scalar_observation",
  assumptionName: "A1 — Multiplicador sintético",
  scenario1Name: "S1 — Estado observado V1",
  scenario2Name: "S2 — Estado observado V2",
  modelName: "deterministic_scalar_model",
  modelSemanticVersion: "1.0.0",
  modelImplementation: "ariadne.deterministic_scalar.multiply.v1",
} as const;

export interface GuidedFixtureResolution {
  evidence1?: EvidenceRef;
  evidence2?: EvidenceRef;
  object?: PrivateObject;
  state1?: StateVersion;
  state2?: StateVersion;
  assumptionSet?: AssumptionSet;
  assumption1?: AssumptionVersion;
  scenario1?: Scenario;
  scenario2?: Scenario;
  model?: ModelVersion;
  run1?: ModelRun;
  run2?: ModelRun;
  result1?: AriadneResult;
  result2?: AriadneResult;
  conflicts: string[];
}

function unique<T>(rows: T[], label: string, conflicts: string[]): T | undefined {
  if (rows.length > 1) {
    conflicts.push(`${label}: mais de um registro reivindica a mesma identidade guiada.`);
    return undefined;
  }
  return rows[0];
}

function evidence(
  detail: WorkspaceDetail,
  expected: typeof GUIDED_FIXTURE.evidence1 | typeof GUIDED_FIXTURE.evidence2,
  label: string,
  conflicts: string[],
): EvidenceRef | undefined {
  const candidates = detail.evidenceRefs.filter(
    (row) => row.sourceArtifactId === expected.sourceArtifactId,
  );
  const selected = unique(candidates, label, conflicts);
  if (
    selected
    && (selected.sourceVersion !== expected.sourceVersion || selected.locator !== expected.locator)
  ) {
    conflicts.push(`${label}: o rótulo existe, mas versão/locator não correspondem ao protocolo.`);
    return undefined;
  }
  return selected;
}

function scalar(payload: Record<string, unknown>): unknown {
  return payload.value;
}

export function resolveGuidedFixture(detail: WorkspaceDetail | null): GuidedFixtureResolution {
  const conflicts: string[] = [];
  if (!detail) return { conflicts };

  const evidence1 = evidence(detail, GUIDED_FIXTURE.evidence1, "E1", conflicts);
  const evidence2 = evidence(detail, GUIDED_FIXTURE.evidence2, "E2", conflicts);
  const object = unique(
    detail.objects.filter((row) => row.objectType === GUIDED_FIXTURE.objectType),
    "O1",
    conflicts,
  );

  const states = object
    ? detail.stateVersions.filter((row) => row.objectId === object.id)
    : [];
  if (states.some((row) => row.version > 2)) {
    conflicts.push("O1: existem versões além de V2; o protocolo guiado não pode inferir qual tentativa as criou.");
  }
  let state1 = unique(states.filter((row) => row.version === 1), "V1", conflicts);
  if (
    state1
    && (scalar(state1.payload) !== 10
      || !evidence1
      || state1.evidenceRefIds.length !== 1
      || state1.evidenceRefIds[0] !== evidence1.id)
  ) {
    conflicts.push("V1: payload ou evidência não correspondem à identidade guiada.");
    state1 = undefined;
  }
  let state2 = unique(states.filter((row) => row.version === 2), "V2", conflicts);
  if (
    state2
    && (scalar(state2.payload) !== 12
      || !evidence2
      || !state1
      || state2.previousVersionId !== state1.id
      || state2.evidenceRefIds.length !== 1
      || state2.evidenceRefIds[0] !== evidence2.id)
  ) {
    conflicts.push("V2: payload, predecessora ou evidência não correspondem à identidade guiada.");
    state2 = undefined;
  }

  const assumptionSet = unique(
    detail.assumptionSets.filter((row) => row.name === GUIDED_FIXTURE.assumptionName),
    "A1",
    conflicts,
  );
  if (assumptionSet && assumptionSet.versions.length > 1) {
    conflicts.push("A1: existem múltiplas versões; uma repetição de criação não será tratada como A1v1.");
  }
  let assumption1 = assumptionSet?.versions.find((row) => row.version === 1);
  if (assumptionSet && assumptionSet.versions.length > 0 && !assumption1) {
    conflicts.push("A1v1: há versões persistidas, mas a versão 1 esperada está ausente.");
  }
  if (
    assumption1
    && (assumptionSet!.versions.length !== 1
      || assumption1.values.multiplier !== 2
      || assumption1.origin !== "human_defined")
  ) {
    conflicts.push("A1v1: valor, origem ou cardinalidade não correspondem à identidade guiada.");
    assumption1 = undefined;
  }

  const resolveScenario = (
    name: string,
    state: StateVersion | undefined,
    label: string,
  ): Scenario | undefined => {
    const selected = unique(detail.scenarios.filter((row) => row.name === name), label, conflicts);
    if (
      selected
      && (!state
        || !assumption1
        || selected.stateVersionId !== state.id
        || selected.assumptionSetVersionId !== assumption1.id
        || Object.keys(selected.hypotheticalState).length !== 0)
    ) {
      conflicts.push(`${label}: o rótulo existe, mas os IDs históricos não correspondem ao protocolo.`);
      return undefined;
    }
    return selected;
  };
  const scenario1 = resolveScenario(GUIDED_FIXTURE.scenario1Name, state1, "S1");
  const scenario2 = resolveScenario(GUIDED_FIXTURE.scenario2Name, state2, "S2");

  const namedModels = detail.models.filter((row) => row.name === GUIDED_FIXTURE.modelName);
  const model = unique(
    namedModels.filter(
      (row) => row.semanticVersion === GUIDED_FIXTURE.modelSemanticVersion
        && row.implementationIdentity === GUIDED_FIXTURE.modelImplementation,
    ),
    "M1",
    conflicts,
  );
  if (namedModels.length > 0 && !model) {
    conflicts.push("M1: o nome existe, mas versão/implementação não correspondem ao modelo registrado.");
  }

  const resolveRun = (scenario: Scenario | undefined, label: string): ModelRun | undefined => {
    const selected = unique(
      scenario ? detail.runs.filter((row) => row.scenarioId === scenario.id) : [],
      label,
      conflicts,
    );
    if (
      selected
      && (!model
        || selected.modelVersionId !== model.id
        || selected.stateVersionId !== scenario!.stateVersionId
        || selected.assumptionSetVersionId !== scenario!.assumptionSetVersionId
        || selected.executionConfiguration.arithmetic !== "integer")
    ) {
      conflicts.push(`${label}: o run não corresponde ao manifesto guiado exato.`);
      return undefined;
    }
    return selected;
  };
  const run1 = resolveRun(scenario1, "R1");
  const run2 = resolveRun(scenario2, "R2");

  const resolveResult = (run: ModelRun | undefined, label: string): AriadneResult | undefined =>
    unique(run ? detail.results.filter((row) => row.modelRunId === run.id) : [], label, conflicts);
  const result1 = resolveResult(run1, "X1");
  const result2 = resolveResult(run2, "X2");

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
    conflicts,
  };
}
