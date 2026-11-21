import assert from "node:assert/strict";
import test from "node:test";
import {
  DeskSelection,
  reviewedSelection,
} from "../../src/lib/ariadne/deskSelection.ts";

test("old inspection/validation cannot publish after switching source or review", () => {
  const selection = new DeskSelection();
  selection.select("workspaceA/reviewA/sourceA");
  const first = selection.capture();
  selection.select("workspaceA/reviewA/sourceB");
  assert.equal(first(), false);
  const second = selection.capture();
  selection.select("workspaceB/reviewB/sourceB");
  assert.equal(second(), false);
});
test("same context renders keep current request; switching away and back does not", () => {
  const selection = new DeskSelection();
  selection.select("A");
  const request = selection.capture();
  selection.select("A");
  assert.equal(request(), true);
  selection.select("B");
  selection.select("A");
  assert.equal(request(), false);
});
test("a delayed package or treatment cannot publish into another historical run", async () => {
  const selection = new DeskSelection();
  const key = (result: string) =>
    JSON.stringify(["workspace", "review", result, "source", "same-item"]);
  selection.select(key("runA"));
  const save = selection.capture(),
    treatment = selection.capture();
  selection.select(key("runB"));
  await Promise.resolve();
  assert.equal(save(), false);
  assert.equal(treatment(), false);
});
test("refresh preserves excluded rows until a different interpretation is reviewed", () => {
  const mapping = {
    sheet: "",
    mapping: {},
    numericMode: "strict",
    manualRows: [],
    reviewMode: "observations",
  };
  const confirmation = {
    ...mapping,
    rows: [
      { index: 1, eligible: true },
      { index: 2, eligible: false },
    ],
  };
  const candidates = [
    { index: 1, errors: [] },
    { index: 2, errors: [] },
  ];
  assert.deepEqual(reviewedSelection(candidates, mapping, confirmation), [1]);
  assert.deepEqual(
    reviewedSelection(
      candidates,
      { ...mapping, numericMode: "comma" },
      confirmation,
    ),
    [1, 2],
  );
});
