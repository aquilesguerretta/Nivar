import { SelectionEpoch } from "./closeApi.ts";
import type { PlanView, SavedPlan, PlanAssumptions } from "./planningApi.ts";
export function planMonthKey(month: {
  sourceRef: { sourceId: string; locator: string };
}) {
  return JSON.stringify([month.sourceRef.sourceId, month.sourceRef.locator]);
}
export function selectedPlanMonth<
  T extends { sourceRef: { sourceId: string; locator: string } },
>(months: T[], key: string) {
  return months.find((month) => planMonthKey(month) === key);
}
/** Loading a retained branch and calculating a preview have independent lifetimes. */
export class PlanningRequests {
  readonly loads = new SelectionEpoch();
  readonly previews = new SelectionEpoch();
  readonly actions = new SelectionEpoch();
}
export function samePlanAssumptions(
  a: {
    candidateKw: string;
    normalRegime: boolean;
    tariffApplicability: boolean;
  },
  b: {
    candidateKw: string;
    normalRegime: boolean;
    tariffApplicability: boolean;
  },
) {
  return (
    a.candidateKw === b.candidateKw &&
    a.normalRegime === b.normalRegime &&
    a.tariffApplicability === b.tariffApplicability
  );
}

/** A current preview may supply a curve, never replace an unchanged saved output. */
export function planPreviewForDisplay(
  response: PlanView,
  selected: SavedPlan | undefined,
  assumptions: PlanAssumptions,
): PlanView {
  if (
    !selected ||
    !samePlanAssumptions(selected.output.assumptions, assumptions)
  )
    return response;
  // A curve under another executor must not be presented as the historical run.
  if (selected.output.version !== response.output.version) return selected;
  return { ...response, ...selected };
}
