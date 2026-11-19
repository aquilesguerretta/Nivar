import assert from "node:assert/strict";
import test from "node:test";
import {
  assessWaferComparison,
  evidenceOutputs,
  evidenceSources,
  exploreObjects,
  formatWaferShare,
  isExploreObject,
  pvStages,
  resolveWaferObservation,
  searchExplore,
  waferMetric,
} from "../../src/lib/argos/globalExplore.ts";

test("typed search resolves TOPCon and rejects unknown keys", () => {
  const [topcon, ...others] = searchExplore("  tOpCoN  ");
  assert.equal(others.length, 0);
  assert.equal(topcon.kind, "TechnologyVariant");
  assert.equal(topcon.key, "topcon");
  assert.deepEqual(searchExplore("unknown facility"), []);
  assert.equal(isExploreObject("constructor"), false);
});

test("TOPCon has a crystalline-silicon parent and a distinct wafer element", () => {
  const topcon = exploreObjects.topcon;
  assert.equal(topcon.parent.technology, "Solar PV");
  const wafer = exploreObjects[topcon.relatedElement];
  assert.equal(wafer.technologyContext, topcon.parent.id);
  assert.equal(wafer.kind, "TechnologyElement");
  assert.deepEqual(pvStages.map(({ name }) => name), ["Polissilício", "Lingote", "Wafer", "Célula", "Módulo"]);
});

test("the views share one estimated capacity observation with intact scope and dates", () => {
  const observation = resolveWaferObservation("pv-wafer");
  assert.ok(observation);
  assert.equal(resolveWaferObservation("china"), observation);
  assert.equal(observation.metricRef, waferMetric.id);
  assert.equal(observation.subjectRef, exploreObjects.china.id);
  assert.equal(observation.elementRef, exploreObjects["pv-wafer"].id);
  assert.equal(waferMetric.stage, "PV wafer");
  assert.equal(waferMetric.measure, "manufacturing-capacity");
  assert.match(waferMetric.denominator, /mundial/);
  assert.equal(observation.kind, "estimated");
  assert.equal(formatWaferShare(observation), "≈95%");
  assert.equal(observation.referenceYear, 2024);
  assert.equal(observation.publishedOn, "2026-03-26");
  assert.equal(observation.absoluteDenominatorGW, null);
  assert.equal(observation.retrievedAt, null);
  assert.equal(observation.knownAt, null);
});

test("a synthetic v2 correction propagates to both views and retains v1", () => {
  const original = resolveWaferObservation("pv-wafer");
  assert.ok(original);
  const syntheticCorrection = { ...original, version: 2, supersedes: 1, estimate: 94 };
  const versions = [original, syntheticCorrection];
  const records = { [original.id]: { currentVersion: 2, versions } };
  assert.equal(resolveWaferObservation("china", records), syntheticCorrection);
  assert.equal(resolveWaferObservation("pv-wafer", records), syntheticCorrection);
  assert.equal(formatWaferShare(versions[0]), "≈95%");
  assert.equal(resolveWaferObservation("china"), original);
  assert.equal(resolveWaferObservation("pv-wafer", { [original.id]: { currentVersion: 3, versions } }), undefined);
  assert.equal(resolveWaferObservation("china", {}), undefined);
});

test("the comparison guard rejects wrong measures and years and requires a second sourced observation", () => {
  const observation = resolveWaferObservation("china");
  assert.ok(observation);
  assert.equal(assessWaferComparison({ measure: "actual-production", referenceYear: 2024 }, observation), "NOT COMPARABLE");
  assert.equal(assessWaferComparison({ measure: "manufacturing-capacity", referenceYear: 2025 }, observation), "NOT COMPARABLE");
  assert.equal(assessWaferComparison({ measure: "manufacturing-capacity", referenceYear: 2024 }, observation), "UNRESOLVED");
});

test("evidence provides official source links and restricts original media and external output", () => {
  assert.match(evidenceSources.doe.url, /^https:\/\/www\.energy\.gov\//);
  assert.match(evidenceSources.feldmann.url, /^https:\/\/doi\.org\//);
  assert.match(evidenceSources.iea.url, /^https:\/\/www\.iea\.org\/reports\//);
  assert.match(evidenceSources.iea.chartUrl, /^https:\/\/www\.iea\.org\/data-and-statistics\/charts\//);
  assert.deepEqual(Object.values(evidenceOutputs), ["RESTRICTED", "RESTRICTED", "RESTRICTED"]);
});
