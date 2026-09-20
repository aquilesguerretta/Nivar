const BASE = "/api/operator/ariadne";

export class AriadneOperatorApiError extends Error {
  readonly status: number;

  constructor(
    status: number,
    message: string,
  ) {
    super(message);
    this.name = "AriadneOperatorApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE}${path}`, {
      credentials: "include",
      headers: init?.body ? { "Content-Type": "application/json" } : undefined,
      ...init,
    });
  } catch {
    throw new AriadneOperatorApiError(0, "Backend indisponível. Nenhum dado foi inventado.");
  }
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { detail?: unknown } | null;
    const detail = response.status >= 500
      ? "Backend indisponível ou falha interna. Nenhum dado foi inventado."
      : typeof payload?.detail === "string"
        ? payload.detail
        : `Falha HTTP ${response.status}`;
    throw new AriadneOperatorApiError(response.status, detail);
  }
  return (await response.json()) as T;
}

export interface WorkspaceSummary {
  id: string;
  label: string;
  synthetic: boolean;
  createdAt: string;
}

export interface EvidenceRef {
  id: string;
  sourceArtifactId: string;
  sourceVersion: string;
  locator: string;
  observedAt: string | null;
  recordedAt: string;
  transformRef: string | null;
}

export interface PrivateObject {
  id: string;
  objectType: string;
  displayLabel: string | null;
  createdAt: string;
  currentStateVersionId: string | null;
}

export interface StateVersion {
  id: string;
  objectId: string;
  version: number;
  payload: Record<string, unknown>;
  recordedAt: string;
  validFrom: string | null;
  validTo: string | null;
  previousVersionId: string | null;
  evidenceRefIds: string[];
  current: boolean;
}

export interface AssumptionVersion {
  id: string;
  version: number;
  values: Record<string, unknown>;
  valueSchema: Record<string, unknown>;
  origin: string;
  previousVersionId: string | null;
  createdAt: string;
}

export interface AssumptionSet {
  id: string;
  name: string;
  createdAt: string;
  versions: AssumptionVersion[];
}

export interface Scenario {
  id: string;
  name: string;
  stateVersionId: string;
  assumptionSetVersionId: string;
  hypotheticalState: Record<string, unknown>;
  createdAt: string;
}

export interface ModelVersion {
  id: string;
  definitionId: string;
  name: string;
  semanticVersion: string;
  implementationIdentity: string;
  inputContract: Record<string, unknown>;
  outputContract: Record<string, unknown>;
  createdAt: string;
}

export interface ModelRun {
  id: string;
  modelVersionId: string;
  scenarioId: string;
  stateVersionId: string;
  assumptionSetVersionId: string;
  executionConfiguration: Record<string, unknown>;
  startedAt: string;
  producedAt: string;
}

export interface AriadneResult {
  id: string;
  modelRunId: string;
  resultKey: string;
  payload: Record<string, unknown>;
  unit: string | null;
  producedAt: string;
}

export interface WorkspaceDetail {
  workspace: WorkspaceSummary;
  evidenceRefs: EvidenceRef[];
  objects: PrivateObject[];
  stateVersions: StateVersion[];
  assumptionSets: AssumptionSet[];
  scenarios: Scenario[];
  models: ModelVersion[];
  runs: ModelRun[];
  results: AriadneResult[];
}

export interface Lineage {
  result: { id: string; payload: Record<string, unknown> };
  run: { id: string; executionConfiguration: Record<string, unknown> };
  model: { definitionId: string; versionId: string; name: string; semanticVersion: string };
  scenario: { id: string; name: string };
  assumptions: {
    setId: string;
    versionId: string;
    name: string;
    version: number;
    values: Record<string, unknown>;
  };
  state: { id: string; version: number; payload: Record<string, unknown> };
  object: { id: string; objectType: string };
  evidenceRefs: Array<{
    id: string;
    sourceArtifactId: string;
    sourceVersion: string;
    locator: string;
  }>;
}

export interface Replay {
  resultId: string;
  storedPayload: Record<string, unknown>;
  replayedPayload: Record<string, unknown>;
  matches: boolean;
}

export interface MutationSettlement {
  actionError: unknown | null;
  refreshError: unknown | null;
  reconciled: boolean;
}

export type AssumptionOrigin = "human_defined" | "rule" | "other";

export interface EvidenceDraft {
  sourceArtifactId: string;
  sourceVersion: string;
  locator: string;
  observedAt?: string | null;
  transformRef?: string | null;
}

export interface StateDraft {
  payload: Record<string, unknown>;
  evidenceRefIds: string[];
  validFrom?: string | null;
  validTo?: string | null;
}

/**
 * A mutation response can be lost after the server commits. Always read the
 * persisted workspace before the UI permits another attempt.
 */
export async function settleMutationAgainstWorkspace(
  action: () => Promise<unknown>,
  refresh: () => Promise<unknown>,
): Promise<MutationSettlement> {
  let actionError: unknown | null = null;
  try {
    await action();
  } catch (caught) {
    actionError = caught;
  }

  try {
    await refresh();
    return { actionError, refreshError: null, reconciled: true };
  } catch (caught) {
    return { actionError, refreshError: caught, reconciled: false };
  }
}

export function replayPresentation(replay: Replay) {
  return replay.matches
    ? {
        status: "MATCH CONFIRMADO",
        detail: "O output é idêntico ao X armazenado.",
      }
    : {
        status: "MISMATCH DETECTADO",
        detail: "O replay divergiu; o resultado histórico permanece inalterado.",
      };
}

const post = <T>(path: string, body?: unknown) =>
  request<T>(path, {
    method: "POST",
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

export const ariadneOperatorApi = {
  listWorkspaces: () => request<{ data: WorkspaceSummary[] }>("/workspaces"),
  createWorkspace: (label: string, synthetic = false) =>
    post<WorkspaceSummary>("/workspaces", { label, synthetic }),
  getWorkspace: (workspaceId: string) => request<WorkspaceDetail>(`/workspaces/${workspaceId}`),
  createEvidence: (workspaceId: string, body: EvidenceDraft) =>
    post<{ id: string }>(`/workspaces/${workspaceId}/evidence`, body),
  createObject: (workspaceId: string, objectType: string, displayLabel?: string) =>
    post<{ id: string }>(`/workspaces/${workspaceId}/objects`, {
      objectType,
      ...(displayLabel ? { displayLabel } : {}),
    }),
  createState: (
    workspaceId: string,
    objectId: string,
    body: StateDraft,
  ) => post<{ id: string; version: number }>(`/workspaces/${workspaceId}/objects/${objectId}/states`, body),
  createAssumptionSet: (workspaceId: string, name: string) =>
    post<{ id: string }>(`/workspaces/${workspaceId}/assumption-sets`, { name }),
  createAssumptionVersion: (
    workspaceId: string,
    setId: string,
    body: { values: Record<string, unknown>; origin: AssumptionOrigin; valueSchema: Record<string, unknown> },
  ) => post<{ id: string; version: number }>(`/workspaces/${workspaceId}/assumption-sets/${setId}/versions`, body),
  createScenario: (
    workspaceId: string,
    body: {
      name: string;
      stateVersionId: string;
      assumptionSetVersionId: string;
      hypotheticalState: Record<string, unknown>;
    },
  ) => post<{ id: string }>(`/workspaces/${workspaceId}/scenarios`, body),
  enableInternalTestModel: (workspaceId: string) =>
    post<{ id: string; semanticVersion: string }>(
      `/workspaces/${workspaceId}/models/internal-test`,
      {},
    ),
  createRun: (workspaceId: string, scenarioId: string, modelVersionId: string) =>
    post<{ runId: string; resultId: string; payload: Record<string, unknown> }>(`/workspaces/${workspaceId}/runs`, {
      scenarioId,
      modelVersionId,
    }),
  getLineage: (workspaceId: string, resultId: string) =>
    request<Lineage>(`/workspaces/${workspaceId}/results/${resultId}/lineage`),
  replay: (workspaceId: string, resultId: string) =>
    post<Replay>(`/workspaces/${workspaceId}/results/${resultId}/replay`),
};
