import test from "node:test";
import assert from "node:assert/strict";
import {
  PlanningRequests,
  samePlanAssumptions,
  planMonthKey,
  selectedPlanMonth,
} from "../../src/lib/ariadne/planningSelection.ts";
import {
  DeskSelection,
  reviewedSelection,
} from "../../src/lib/ariadne/deskSelection.ts";
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
