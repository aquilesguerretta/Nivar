import test from "node:test";
import assert from "node:assert/strict";
import {
  PlanningRequests,
  samePlanAssumptions,
  planMonthKey,
  initialPlanMonth,
  selectedPlanMonth,
  planPreviewForDisplay,
} from "../../src/lib/ariadne/planningSelection.ts";
import {
  DeskSelection,
  reviewedSelection,
} from "../../src/lib/ariadne/deskSelection.ts";
import type {
  PlanMonth,
  PlanView,
  SavedPlan,
} from "../../src/lib/ariadne/planningApi.ts";

test("unchanged saved output remains exact across a new executor preview", () => {
  const assumptions = {
    candidateKw: "280",
    normalRegime: true,
    tariffApplicability: true,
  };
  const selected = {
    output: { version: "0.1.0", cost: "4256.00", assumptions },
    id: "retained",
  } as SavedPlan;
  const response = {
    output: { version: "0.1.1", cost: null, assumptions },
    curve: [{ candidateKw: "280", cost: null, covered: 0 }],
  } as PlanView;
  const frozen = structuredClone(selected);
  assert.equal(
    planPreviewForDisplay(response, selected, assumptions),
    selected,
  );
  assert.deepEqual(selected, frozen);
  assert.equal(
    planPreviewForDisplay(response, selected, {
      ...assumptions,
      candidateKw: "260",
    }),
    response,
  );
  assert.equal(
    planPreviewForDisplay(response, undefined, assumptions),
    response,
  );
});
test("same-version curve can accompany the exact saved output without replacing its amounts", () => {
  const assumptions = {
    candidateKw: "280",
    normalRegime: true,
    tariffApplicability: true,
  };
  const selected = {
    output: { version: "0.1.1", cost: "4256.00", assumptions },
    id: "retained",
  } as SavedPlan;
  const response = {
    output: { version: "0.1.1", cost: "4256.00", assumptions },
    curve: [{ candidateKw: "280", cost: "4256.00", covered: 1 }],
  } as PlanView;
  const result = planPreviewForDisplay(response, selected, assumptions);
  assert.equal(result.output, selected.output);
  assert.equal(result.curve, response.curve);
});
test("two conflicting invoices for the same month retain independent source selection", () => {
  const first = {
    label: "2019-06",
    sourceRef: { sourceId: "source-a", locator: "page:3/text-token:17" },
  };
  const second = {
    label: "2019-06",
    sourceRef: { sourceId: "source-b", locator: "page:3/text-token:17" },
  };
  assert.notEqual(planMonthKey(first), planMonthKey(second));
  assert.equal(
    selectedPlanMonth([first, second], planMonthKey(second)),
    second,
  );
  assert.equal(selectedPlanMonth([first, second], planMonthKey(first)), first);
});

const february = {
  period: "2020-02",
  label: "2020-02",
  physicalCovered: true,
  sourceRef: { sourceId: "invoice-a", locator: "page:14/demand-observation" },
} as PlanMonth;
const samePeriod = {
  ...february,
  sourceRef: { ...february.sourceRef, sourceId: "invoice-b" },
};

test("incoming proof uses the exact source and locator even when the month label repeats", () => {
  const baseline = [february, samePeriod];
  assert.equal(
    initialPlanMonth(
      baseline,
      baseline,
      new URLSearchParams({
        month: february.label,
        proof: planMonthKey(samePeriod),
      }),
    ),
    samePeriod,
  );
  assert.equal(
    initialPlanMonth(
      baseline,
      baseline,
      new URLSearchParams({
        month: february.label,
      }),
    ),
    undefined,
  );
});

test("incoming proof never guesses between repeated exact locators", () => {
  const baseline = [february, { ...february }];
  assert.equal(
    initialPlanMonth(
      baseline,
      baseline,
      new URLSearchParams({
        proof: planMonthKey(february),
      }),
    ),
    undefined,
  );
});

test("stale proof in a saved scenario is rejected against the reviewed baseline", () => {
  assert.equal(
    initialPlanMonth(
      [february],
      [samePeriod],
      new URLSearchParams({
        proof: planMonthKey(february),
        month: february.label,
      }),
    ),
    undefined,
  );
});

test("uncovered selected evidence remains inspectable as a saved URL but is not a valid handoff", () => {
  const conflicting = { ...february, physicalCovered: false };
  const months = [conflicting];
  const key = planMonthKey(conflicting);
  assert.equal(
    initialPlanMonth(months, months, new URLSearchParams({ proof: key })),
    undefined,
  );
  assert.equal(
    initialPlanMonth(months, months, new URLSearchParams({ item: key })),
    conflicting,
  );
});
test("preview cleanup cannot cancel loading a different preserved scenario", async () => {
  const requests = new PlanningRequests(),
    oldPreview = requests.previews.next(),
    newLoad = requests.loads.next();
  requests.previews.next();
  await Promise.resolve();
  assert.equal(requests.loads.current(newLoad), true);
  assert.equal(requests.previews.current(oldPreview), false);
});
test("out of order candidates and workspace/scenario switches cannot publish", async () => {
  const requests = new PlanningRequests(),
    selection = new DeskSelection();
  selection.select("workspaceA/baselineA/scenarioA/280");
  const old = requests.previews.next(),
    context = selection.capture();
  selection.select("workspaceA/baselineA/scenarioB/260");
  const current = requests.previews.next();
  await Promise.resolve();
  assert.equal(context(), false);
  assert.equal(requests.previews.current(old), false);
  assert.equal(requests.previews.current(current), true);
  const save = selection.capture();
  selection.select("workspaceB/baselineB/scenarioB/260");
  assert.equal(save(), false);
});
test("editing any saved assumption makes an exploration, without mutating preserved branch", () => {
  const saved = {
    candidateKw: "280",
    normalRegime: true,
    tariffApplicability: true,
  };
  assert.equal(samePlanAssumptions(saved, { ...saved }), true);
  for (const change of [
    { candidateKw: "260" },
    { normalRegime: false },
    { tariffApplicability: false },
  ])
    assert.equal(samePlanAssumptions(saved, { ...saved, ...change }), false);
  assert.equal(saved.candidateKw, "280");
});
test("retained tariff selection survives reload and excluded reference is not silently reselected", () => {
  const mapping = {
    sheet: "CSV",
    mapping: {},
    numericMode: "strict",
    manualRows: [],
    reviewMode: "tariff_reference",
  };
  const confirmation = {
    ...mapping,
    rows: [
      { index: 1, eligible: false, planningConfirmed: true },
      { index: 2, eligible: false, planningConfirmed: false },
    ],
  };
  assert.deepEqual(
    reviewedSelection(
      [
        { index: 1, errors: [] },
        { index: 2, errors: [] },
      ],
      mapping,
      confirmation,
    ),
    [1],
  );
});
