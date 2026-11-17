import test from "node:test";
import assert from "node:assert/strict";
import {
  ariadneWorkspaceLinks,
  planningPath,
  reviewDeskPath,
} from "../../src/lib/ariadne/workspaceNavigation.ts";

const ids = {
  workspace: "11111111-1111-4111-8111-111111111111",
  review: "22222222-2222-4222-8222-222222222222",
  baseline: "33333333-3333-4333-8333-333333333333",
  scenario: "44444444-4444-4444-8444-444444444444",
};
const search =
  "?" +
  new URLSearchParams({
    ...ids,
    month: "2020-02",
    item: '["source","page:14"]',
  });

test("Planning self-navigation retains saved scenario, baseline, month and exact selection", () => {
  assert.equal(
    ariadneWorkspaceLinks(planningPath, search).planning,
    planningPath + search,
  );
});
test("unsaved exploration self-navigation does not change its route or effect dependencies", () => {
  const query =
    "?" +
    new URLSearchParams({
      workspace: ids.workspace,
      review: ids.review,
      baseline: ids.baseline,
    });
  assert.equal(
    ariadneWorkspaceLinks(planningPath, query).planning,
    planningPath + query,
  );
  assert.equal(new URLSearchParams(query).has("scenario"), false);
});
test("refresh reconstructs the same saved URL without a private navigation cache", () => {
  const first = ariadneWorkspaceLinks(planningPath, search).planning;
  const refreshed = new URL(first, "http://127.0.0.1");
  assert.equal(
    ariadneWorkspaceLinks(refreshed.pathname, refreshed.search).planning,
    first,
  );
});
test("Planning returns to its exact retained review result", () => {
  const url = new URL(
    ariadneWorkspaceLinks(planningPath, search).review,
    "http://127.0.0.1",
  );
  assert.equal(url.pathname, reviewDeskPath);
  assert.deepEqual(Object.fromEntries(url.searchParams), {
    workspace: ids.workspace,
    review: ids.review,
    result: ids.baseline,
  });
});
test("Review opens Planning on its own result; never borrows a scenario from another baseline", () => {
  const query = "?" + new URLSearchParams({ ...ids, result: ids.baseline });
  const url = new URL(
    ariadneWorkspaceLinks(reviewDeskPath, query).planning,
    "http://127.0.0.1",
  );
  assert.deepEqual(Object.fromEntries(url.searchParams), {
    workspace: ids.workspace,
    review: ids.review,
    baseline: ids.baseline,
  });
  assert.equal(
    ariadneWorkspaceLinks(reviewDeskPath, query).review,
    reviewDeskPath + query,
  );
});
for (const query of [
  "",
  "?workspace=" + ids.workspace,
  "?" + new URLSearchParams({ ...ids, workspace: "invalid" }),
]) {
  test(
    "direct/partial/invalid context supports explicit direct entry: " + query,
    () => {
      assert.deepEqual(ariadneWorkspaceLinks(planningPath, query), {
        review: reviewDeskPath,
        planning: planningPath,
      });
    },
  );
}
test("foreign IDs remain locators for server ownership checks, never an inferred authority", () => {
  const foreign =
    "?" +
    new URLSearchParams({
      ...ids,
      workspace: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    });
  assert.equal(
    ariadneWorkspaceLinks(planningPath, foreign).planning,
    planningPath + foreign,
  );
});
test("unavailable saved scenario is retained for server rejection, not silently changed to baseline", () => {
  const invalid = search.replace(ids.scenario, "unavailable");
  assert.equal(
    ariadneWorkspaceLinks(planningPath, invalid).planning,
    planningPath + invalid,
  );
});
test("a non-Ariadne path or redirect parameter cannot select an arbitrary destination", () => {
  assert.equal(
    ariadneWorkspaceLinks("/operador/argos", search).planning,
    planningPath,
  );
  assert.equal(
    new URL(
      ariadneWorkspaceLinks(
        planningPath,
        search + "&next=https://example.test",
      ).planning,
      "http://127.0.0.1",
    ).pathname,
    planningPath,
  );
});
