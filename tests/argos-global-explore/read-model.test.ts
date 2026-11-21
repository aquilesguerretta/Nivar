import assert from "node:assert/strict";
import test from "node:test";
import {
  assessWaferComparison,
  evidenceOutputs,
  exploreObjects,
  formatWaferShare,
  isExploreObject,
  pvStages,
  primaryAncestors,
  resolveExploreObject,
  searchExplore,
  waferMetric,
  waferDocumentRef,
  waferShareRef,
  type ExploreObjectKey,
} from "../../src/lib/argos/globalExplore.ts";
import { documentRefs, exploreEvidenceCatalog, resolveExploreSelection } from "../../src/lib/argos/globalExploreEvidence.ts";
import { syntheticCorrection } from "./historical-fixture.ts";

const corrected = syntheticCorrection(exploreEvidenceCatalog);
const pin = (version: number, documentVersion = version) => new URLSearchParams({
  evidence: "iea",
  observation_ref: waferShareRef,
  observation_version: String(version),
  document_ref: waferDocumentRef,
  document_version: String(documentVersion),
});

function ready(key: ExploreObjectKey, params = new URLSearchParams(), catalog = exploreEvidenceCatalog) {
  const result = resolveExploreSelection(key, params, catalog);
  assert.equal(result.state, "READY");
  return result;
}

test("typed search resolves TOPCon and rejects unknown keys", () => {
  const [topcon, ...others] = searchExplore("  tOpCoN  ");
  assert.equal(others.length, 0);
  assert.equal(topcon.kind, "TechnologyVariant");
  assert.equal(topcon.key, "topcon");
  assert.deepEqual(searchExplore("unknown facility"), []);
  assert.equal(isExploreObject("constructor"), false);
  for (const [query, key, kind, id] of [
    ["Solar PV", "solar-pv", "Technology", "technology:solar-pv"],
    ["Crystalline silicon", "c-si", "TechnologyVariant", "variant:solar-pv:c-si"],
  ]) {
    const [result, ...rest] = searchExplore(query);
    assert.equal(rest.length, 0);
    assert.equal(result.key, key);
    assert.equal(result.kind, kind);
    assert.equal(result.id, id);
    assert.deepEqual(resolveExploreObject(id), result);
    assert.deepEqual(searchExplore(id), [result]);
  }
});

test("TOPCon has a crystalline-silicon parent and a distinct wafer element", () => {
  const topcon = exploreObjects.topcon;
  assert.deepEqual(primaryAncestors(topcon).map(({ id }) => id), [
    exploreObjects["solar-pv"].id, exploreObjects["c-si"].id,
  ]);
  assert.equal(topcon.parentRef, exploreObjects["c-si"].id);
  const wafer = resolveExploreObject(topcon.relatedElementRef);
  assert.ok(wafer?.kind === "TechnologyElement");
  assert.equal(wafer.technologyContext, topcon.parentRef);
  assert.deepEqual(pvStages.map(({ name }) => name), ["Polissilício", "Lingote", "Wafer", "Célula", "Módulo"]);
});

test("the views share one estimated capacity observation with intact scope and dates", () => {
  const wafer = ready("pv-wafer").measurement;
  const china = ready("china").measurement;
  assert.ok(wafer && china);
  assert.equal(china.observation, wafer.observation);
  assert.equal(china.document, wafer.document);
  const { observation, document } = wafer;
  assert.equal(observation.metricRef, waferMetric.id);
  assert.equal(observation.subjectRef, exploreObjects.china.id);
  assert.equal(observation.elementRef, exploreObjects["pv-wafer"].id);
  assert.equal(waferMetric.stage, "PV wafer");
  assert.equal(waferMetric.measure, "manufacturing-capacity");
  assert.match(waferMetric.denominator, /mundial/);
  assert.equal(observation.kind, "estimated");
  assert.equal(formatWaferShare(observation), "≈95%");
  assert.equal(observation.referenceYear, 2024);
  assert.equal(document.publishedOn, "2026-03-26");
  assert.equal(document.retrievedAt, null);
  assert.equal(document.knownAt, null);
  assert.equal(observation.absoluteDenominatorGW, null);
  assert.equal(observation.retrievedAt, null);
  assert.equal(observation.knownAt, null);
});

test("a synthetic v2 correction propagates to both views and retains v1", () => {
  for (const key of ["pv-wafer", "china"] as const) {
    const latest = ready(key, new URLSearchParams("evidence=iea"), corrected);
    const history = ready(key, pin(1), corrected);
    assert.equal(latest.measurement?.observation.version, 2);
    assert.equal(latest.measurement?.observation.estimate, 94);
    assert.equal(latest.evidence?.document.version, 2);
    assert.equal(history.measurement?.observation.version, 1);
    assert.equal(history.measurement?.observation.estimate, 95);
    assert.equal(history.evidence?.document.title, "Energy Technology Perspectives 2026");
    assert.equal(history.evidence?.document.version, 1);
  }
});

test("an unchanged Observation keeps the exact document version it cites", () => {
  const catalog = { ...corrected, observations: exploreEvidenceCatalog.observations };
  const result = ready("china", new URLSearchParams("evidence=iea"), catalog);
  assert.equal(result.evidence?.document.version, 1);
});

test("invalid, unavailable, duplicate, and out-of-scope pins fail closed", () => {
  for (const [key, params] of [
    ["topcon", pin(1)], ["china", pin(99)], ["china", pin(1, 2)],
    ["china", new URLSearchParams("evidence=doe")],
    ["china", new URLSearchParams("evidence=iea&evidence=iea")],
    ["china", new URLSearchParams("observation_version=01")],
    ["china", new URLSearchParams("document_ref=unknown&document_version=1")],
    ["china", new URLSearchParams({ document_ref: waferDocumentRef, document_version: "1" })],
  ] as const) {
    const result = resolveExploreSelection(key, params, corrected);
    assert.equal(result.state, "UNRESOLVED");
    assert.equal("measurement" in result, false);
    assert.equal("evidence" in result, false);
  }
  assert.equal(resolveExploreSelection("china", pin(1), { ...corrected, observations: {} }).state, "UNRESOLVED");
});

test("a restricted cited Document withholds the metric and the evidence on both views", () => {
  for (const key of ["pv-wafer", "china"] as const) {
    const result = resolveExploreSelection(key, pin(3), corrected);
    assert.equal(result.state, "RESTRICTED");
    assert.equal("measurement" in result, false);
    assert.equal("evidence" in result, false);
  }
});

test("the comparison guard rejects wrong measures and years and requires a second sourced observation", () => {
  const observation = ready("china").measurement?.observation;
  assert.ok(observation);
  assert.equal(assessWaferComparison({ measure: "actual-production", referenceYear: 2024 }, observation), "NOT COMPARABLE");
  assert.equal(assessWaferComparison({ measure: "manufacturing-capacity", referenceYear: 2025 }, observation), "NOT COMPARABLE");
  assert.equal(assessWaferComparison({ measure: "manufacturing-capacity", referenceYear: 2024 }, observation), "UNRESOLVED");
});

test("evidence provides official source links and restricts original media and external output", () => {
  const params = new URLSearchParams({ evidence: "doe", document_ref: documentRefs.doe, document_version: "1" });
  const solar = ready("solar-pv", params).evidence;
  const silicon = ready("c-si", params).evidence;
  assert.ok(solar && silicon);
  assert.equal(solar.document, silicon.document);
  assert.equal(solar.source, silicon.source);
  assert.equal(solar.document.sourceRef, "source:doe:seto");
  assert.match(solar.document.url, /^https:\/\/www\.energy\.gov\//);
  assert.match(ready("topcon", new URLSearchParams("evidence=feldmann")).evidence?.document.url ?? "", /^https:\/\/doi\.org\//);
  const iea = ready("china", new URLSearchParams("evidence=iea")).evidence;
  assert.match(iea?.document.url ?? "", /^https:\/\/www\.iea\.org\/reports\//);
  assert.match(iea?.document.chartUrl ?? "", /^https:\/\/www\.iea\.org\/data-and-statistics\/charts\//);
  assert.deepEqual(Object.values(evidenceOutputs), ["RESTRICTED", "RESTRICTED", "RESTRICTED"]);
});
