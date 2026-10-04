import type {
  AriadneResult,
  AssumptionSet,
  AssumptionVersion,
  EvidenceRef,
  Lineage,
  ModelRun,
  ModelVersion,
  PrivateObject,
  Scenario,
  StateVersion,
  WorkspaceDetail,
} from "./operatorApi";
const INTERNAL_TEST_MODEL_NAME = "deterministic_scalar_model";
const INTERNAL_TEST_MODEL_IMPLEMENTATION = "ariadne.deterministic_scalar.multiply.v1";

export interface RunContext {
  run: ModelRun;
  result: AriadneResult;
  scenario: Scenario;
  state: StateVersion;
  object: PrivateObject;
  assumptionSet: AssumptionSet;
  assumption: AssumptionVersion;
  model: ModelVersion;
  evidence: EvidenceRef[];
}

export interface FieldDifference {
  key: string;
  a: unknown;
  b: unknown;
  changed: boolean;
  numericDelta: number | null;
}

export interface InputDependencyPresentation {
  adapterSupported: boolean;
  consumed: Array<{ path: string; value: unknown }>;
  preserved: Array<{ path: string; value: unknown }>;
}

export interface ReconstructibilityAssessment {
  reconstructible: boolean;
  missing: string[];
}

const stableValue = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(stableValue).join(",")}]`;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stableValue(record[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
};

export function recordsEqual(
  a: Record<string, unknown>,
  b: Record<string, unknown>,
): boolean {
  return stableValue(a) === stableValue(b);
}

export function diffRecords(
  a: Record<string, unknown>,
  b: Record<string, unknown>,
): FieldDifference[] {
  return [...new Set([...Object.keys(a), ...Object.keys(b)])]
    .sort((left, right) => left.localeCompare(right))
    .map((key) => {
      const before = a[key];
      const after = b[key];
      return {
        key,
        a: before,
        b: after,
        changed: stableValue(before) !== stableValue(after),
        numericDelta:
          typeof before === "number" && typeof after === "number"
            ? after - before
            : null,
      };
    });
}

export function resolveRunContext(
  detail: WorkspaceDetail,
  runId: string,
): RunContext | undefined {
  const run = detail.runs.find((candidate) => candidate.id === runId);
  if (!run) return undefined;
  const result = detail.results.find((candidate) => candidate.modelRunId === run.id);
  const scenario = detail.scenarios.find((candidate) => candidate.id === run.scenarioId);
  const state = detail.stateVersions.find((candidate) => candidate.id === run.stateVersionId);
  const assumptionMatch = detail.assumptionSets
    .flatMap((set) => set.versions.map((version) => ({ set, version })))
    .find(({ version }) => version.id === run.assumptionSetVersionId);
  const model = detail.models.find((candidate) => candidate.id === run.modelVersionId);
  const object = state
    ? detail.objects.find((candidate) => candidate.id === state.objectId)
    : undefined;
  if (!result || !scenario || !state || !assumptionMatch || !model || !object) return undefined;
  const evidence = state.evidenceRefIds
    .map((id) => detail.evidenceRefs.find((candidate) => candidate.id === id))
    .filter((candidate): candidate is EvidenceRef => Boolean(candidate));
  return {
    run,
    result,
    scenario,
    state,
    object,
    assumptionSet: assumptionMatch.set,
    assumption: assumptionMatch.version,
    model,
    evidence,
  };
}

export function runPresentationLabel(context: RunContext): string {
  const timestamp = new Date(context.run.producedAt).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const result = Object.entries(context.result.payload)
    .map(([key, value]) => `${key} ${String(value)}`)
    .join(", ");
  return `${context.scenario.name} · ${result} · modelo ${context.model.semanticVersion} · ${timestamp}`;
}

export function scalarInputDependencies(context: RunContext): InputDependencyPresentation {
  const adapterSupported = context.model.name === INTERNAL_TEST_MODEL_NAME
    && context.model.implementationIdentity === INTERNAL_TEST_MODEL_IMPLEMENTATION;
  if (!adapterSupported) return { adapterSupported: false, consumed: [], preserved: [] };
  return {
    adapterSupported: true,
    consumed: [
      { path: "observed_state.value", value: context.state.payload.value },
      { path: "assumptions.multiplier", value: context.assumption.values.multiplier },
      { path: "execution_configuration", value: context.run.executionConfiguration },
    ],
    preserved: [
      { path: "scenario.hypothetical_state", value: context.scenario.hypotheticalState },
    ],
  };
}

export function latestAssumptionVersion(context: RunContext): AssumptionVersion {
  return [...context.assumptionSet.versions]
    .sort((a, b) => b.version - a.version)[0] ?? context.assumption;
}

export function assessLineage(
  context: RunContext,
  lineage: Lineage,
): ReconstructibilityAssessment {
  const missing: string[] = [];
  if (lineage.result.id !== context.result.id) missing.push("result");
  if (lineage.run.id !== context.run.id) missing.push("run");
  if (lineage.model.versionId !== context.model.id) missing.push("exact model version");
  if (lineage.scenario.id !== context.scenario.id) missing.push("scenario");
  if (lineage.state.id !== context.state.id) missing.push("exact state version");
  if (lineage.assumptions.versionId !== context.assumption.id) {
    missing.push("exact assumption version");
  }
  if (context.state.evidenceRefIds.length === 0) missing.push("supporting evidence refs");
  const lineageEvidence = new Set(lineage.evidenceRefs.map((evidence) => evidence.id));
  for (const evidenceId of context.state.evidenceRefIds) {
    if (!lineageEvidence.has(evidenceId)) missing.push(`evidence ref ${evidenceId}`);
  }
  return { reconstructible: missing.length === 0, missing };
}
