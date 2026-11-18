import { request, write } from "./closeApi";
export interface PlanAssumptions {
  candidateKw: string;
  normalRegime: boolean;
  tariffApplicability: boolean;
}
export interface PlanMonth {
  period: string | null;
  label: string;
  demandKw: string | null;
  originalKw: string;
  candidateKw: string;
  thresholdKw: string;
  physicalCovered: boolean;
  covered: boolean;
  reasons: string[];
  trigger: boolean | null;
  headroomKw: string | null;
  delta: string | null;
  baseline: { regular: string; overrun: string; total: string } | null;
  modeled: {
    regular: string;
    overrun: string;
    total: string;
    unusedExposure: string;
  } | null;
  sourceRef: {
    sourceId: string;
    sourceVersion: string;
    confirmationVersionId: string;
    locator: string;
    page?: number;
    fieldRefs: Record<string, string>;
  };
  rate: {
    rate: string;
    authority: string;
    reference_id: string;
    effective_from: string;
    effective_to: string;
    basis: string;
    sourceRef: PlanMonth["sourceRef"];
  } | null;
  raw: Record<string, unknown>;
  sourceQuality: string;
  formula: string | null;
}
export interface PlanOutput {
  model: string;
  version: string;
  scope: string;
  assumptions: PlanAssumptions;
  baselineKw: string;
  months: PlanMonth[];
  coverage: {
    covered: number;
    physical: number;
    total: number;
    complete: boolean;
  };
  cost: string | null;
  baselineCost: string | null;
  delta: string | null;
  overrunMonths: number;
  unusedMonths: number;
  maximumKw: string | null;
  overrunCost: string | null;
  unusedExposure: string | null;
  policy: {
    rule: string;
    authorityUrl: string;
    authorityHash: string;
    rounding: string;
  };
  warning: string;
  exclusions: string[];
}
export interface PlanView {
  baselineId: string;
  stateVersionId: string;
  newerBaselineExists: boolean;
  output: PlanOutput;
  curve?: { candidateKw: string; cost: string | null; covered: number }[];
  lowestExplored?: { candidateKw: string; cost: string | null } | null;
}
export interface SavedPlan extends PlanView {
  id: string;
  name: string;
  runId: string;
  assumptionVersionId: string;
  modelVersionId: string;
  implementation: string;
  producedAt: string;
  parentResultId: string | null;
}
export const planRoot = (w: string, r: string, b: string) =>
  `/workspaces/${encodeURIComponent(w)}/close/reviews/${encodeURIComponent(r)}/calculations/${encodeURIComponent(b)}/planning`;
export const planningApi = {
  baseline: (p: string, signal?: AbortSignal) =>
    request<PlanView>(p, { signal }),
  preview: (p: string, body: PlanAssumptions, signal?: AbortSignal) =>
    request<PlanView>(p + "/preview?curve=true", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    }),
  saved: (p: string, signal?: AbortSignal) =>
    request<SavedPlan[]>(p + "/scenarios", { signal }),
  save: (
    p: string,
    body: PlanAssumptions & {
      name: string;
      acknowledgeHistoricalBaseline: boolean;
    },
  ) => write<SavedPlan>(p + "/scenarios", body),
  duplicate: (
    p: string,
    id: string,
    name: string,
    acknowledgeHistoricalBaseline: boolean,
  ) =>
    write<SavedPlan>(p + `/scenarios/${id}/duplicate`, {
      name,
      acknowledgeHistoricalBaseline,
    }),
  replay: (p: string, id: string) =>
    request<{ matches: boolean }>(p + `/scenarios/${id}/replay`),
  compare: (p: string, resultIds: string[]) =>
    request<SavedPlan[]>(p + "/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resultIds }),
    }),
  exportUrl: (p: string, id: string) =>
    "/api/operator/ariadne" + p + `/scenarios/${id}/export`,
};
