import { SelectionEpoch } from "./closeApi.ts";
import type {
  PlanView,
  SavedPlan,
  PlanAssumptions,
  PlanMonth,
} from "./planningApi.ts";
export function planProofKey(sourceId: string, locator: string) {
  return JSON.stringify([sourceId, locator]);
}
export function planMonthKey(month: {
  sourceRef: { sourceId: string; locator: string };
}) {
  return planProofKey(month.sourceRef.sourceId, month.sourceRef.locator);
}
export function selectedPlanMonth<
  T extends { sourceRef: { sourceId: string; locator: string } },
>(months: T[], key: string) {
  const matches = months.filter((month) => planMonthKey(month) === key);
  return matches.length === 1 ? matches[0] : undefined;
}

/** Resolve a link only against already authorized, immutable result data. */
export function initialPlanMonth(
  months: PlanMonth[],
  baseline: PlanMonth[],
  query: URLSearchParams,
): PlanMonth | undefined {
  const linked = query.get("proof");
  if (linked !== null) {
    const reference = selectedPlanMonth(baseline, linked);
    if (reference?.period && reference.physicalCovered)
      return selectedPlanMonth(months, linked);
    return undefined;
  }
  const item = query.get("item");
  if (item !== null) return selectedPlanMonth(months, item);
  const label = query.get("month");
  if (label !== null) {
    const matches = months.filter((month) => month.label === label);
    return matches.length === 1 ? matches[0] : undefined;
  }
  return months.find((month) => month.physicalCovered);
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
