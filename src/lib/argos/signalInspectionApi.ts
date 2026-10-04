export const ARGOS_INSPECTION_SCENARIOS = [
  {
    id: "promote-effective-power",
    label: "Registro alterado",
    goldReference: "SG-004",
  },
  {
    id: "hold-removal-health-unresolved",
    label: "Cobertura não resolvida",
    goldReference: "SG-007",
  },
  {
    id: "reject-presentation-only",
    label: "Mudança de apresentação",
    goldReference: "SG-013",
  },
] as const;

export type ArgosInspectionScenarioId =
  (typeof ARGOS_INSPECTION_SCENARIOS)[number]["id"];
export type ArgosInspectionDecision = "PROMOTE" | "HOLD" | "REJECT";

interface DeltaChange {
  field: string;
  before: string;
  after: string;
}

interface DeltaRow {
  identity: string;
  changes: DeltaChange[];
}

export interface ArgosInspectionReadModel {
  scenario: {
    id: ArgosInspectionScenarioId;
    label: string;
    goldReference: string;
    synthetic: true;
  };
  source: { sourceId: string };
  observations: {
    fromSnapshotId: string;
    toSnapshotId: string;
  };
  event: {
    kind: string;
    facts: Record<string, string | number | boolean>;
    deterministicResultKind: string;
    byteRelation: string;
    parserVersion: string | null;
    diffVersion: string | null;
    delta: null | {
      contentEqual: boolean;
      added: string[];
      removed: string[];
      changed: DeltaRow[];
    };
  };
  promotion: {
    decision: ArgosInspectionDecision;
    reasonCode: string;
    sourceHealthState: string;
    evidenceState: string;
    semanticsState: string;
    materialityState: string;
    rights: {
      surface: string;
      state: string;
      rightsRecordRef: string | null;
      attributionRequired: boolean | null;
    };
    caveats: string[];
    forbiddenClaims: string[];
  };
  claim: null | {
    factualClaim: string;
    caveats: string[];
    forbiddenClaims: string[];
    claimGuard: null | {
      result: "FAIL";
      reasonCode: string;
      prohibitedReasonCodes: string[];
      fallbackClaim: string;
    };
  };
  evidence: {
    refs: string[];
    fromSnapshotId: string;
    toSnapshotId: string;
  };
}

export class ArgosInspectionApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ArgosInspectionApiError";
    this.status = status;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function assertInspectionReadModel(
  value: unknown,
): asserts value is ArgosInspectionReadModel {
  if (!isRecord(value) || !isRecord(value.promotion) || !isRecord(value.evidence)) {
    throw new ArgosInspectionApiError(0, "Resposta de inspeção inválida.");
  }
  const decision = value.promotion.decision;
  if (decision !== "PROMOTE" && decision !== "HOLD" && decision !== "REJECT") {
    throw new ArgosInspectionApiError(0, "Resultado de inspeção inválido.");
  }
  if ((decision === "PROMOTE") !== (value.claim !== null)) {
    throw new ArgosInspectionApiError(
      0,
      "Contrato de claim incompatível com o resultado canônico.",
    );
  }
  if (
    !isRecord(value.observations)
    || value.observations.fromSnapshotId !== value.evidence.fromSnapshotId
    || value.observations.toSnapshotId !== value.evidence.toSnapshotId
    || !Array.isArray(value.evidence.refs)
    || value.evidence.refs.length !== 2
    || value.evidence.refs[0] !== value.evidence.fromSnapshotId
    || value.evidence.refs[1] !== value.evidence.toSnapshotId
  ) {
    throw new ArgosInspectionApiError(0, "Referências de evidência inconsistentes.");
  }
}

export async function fetchArgosInspection(
  scenarioId: ArgosInspectionScenarioId,
  signal?: AbortSignal,
): Promise<ArgosInspectionReadModel> {
  let response: Response;
  try {
    response = await fetch(
      `/api/operator/argos/ons-capacidade/inspection/${scenarioId}`,
      { credentials: "include", signal },
    );
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ArgosInspectionApiError(
      0,
      "Backend indisponível. Nenhum resultado foi inventado.",
    );
  }
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      detail?: unknown;
    } | null;
    const detail = typeof payload?.detail === "string"
      ? payload.detail
      : `Falha HTTP ${response.status}`;
    throw new ArgosInspectionApiError(response.status, detail);
  }
  const payload: unknown = await response.json();
  assertInspectionReadModel(payload);
  return payload;
}

export function surfaceableClaim(
  inspection: ArgosInspectionReadModel,
): string | null {
  return inspection.claim?.factualClaim ?? null;
}
