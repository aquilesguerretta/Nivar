import assert from "node:assert/strict";
import test from "node:test";
import { waferShareRef } from "../../src/lib/argos/globalExplore.ts";
import { evidenceHistory, investigationParams, readEvidence, readPin, searchObjects, sourceHref, supportedRelations } from "../../src/features/argos_investigate/reading.ts";
import { catalog } from "./catalog.ts";

function object(id: string) {
  const found = catalog.objects.find((entry) => entry.id === id);
  assert.ok(found, id);
  return found;
}

test("finds the four curated entry points under their object kinds", () => {
  assert.deepEqual(searchObjects(catalog, "TOPCon").map(({ kind }) => kind), ["TechnologyVariant", "ResearchMilestone"]);
  assert.deepEqual(searchObjects(catalog, " China WAFERS 2024 ").map(({ kind }) => kind), ["TechnologyElement", "Country"]);
  assert.deepEqual(searchObjects(catalog, "evento MOFCOM").map(({ kind }) => kind), ["Event"]);
  assert.deepEqual(searchObjects(catalog, "PESQUÍSA tandem").map(({ kind }) => kind), ["TechnologyVariant", "ResearchMilestone"]);
  assert.deepEqual(searchObjects(catalog, "china wafers 2025"), []);
  assert.deepEqual(searchObjects(catalog, "pergunta sem resposta"), []);
  assert.deepEqual(searchObjects(catalog, "???"), []);
});

test("China alias and wafer resolve to one canonical Observation and provenance", () => {
  const china = object("country:CHN");
  const wafer = object("element:solar-pv:wafer");
  assert.equal(searchObjects(catalog, "j3:country:CHN")[0].objects[0], china);
  const a = readEvidence(catalog, china, waferShareRef);
  const b = readEvidence(catalog, wafer, waferShareRef);
  assert.equal(a.state, "ready");
  assert.equal(b.state, "ready");
  assert.equal(a.revision, b.revision);
  assert.match(a.revision.paragraphs[0], /capacidade mundial.*2024/u);
  assert.match(a.revision.limit, /Produção efetiva/u);
});

test("typed links have resolvable evidence and target IDs without inferring legal relevance to TOPCon", () => {
  assert.equal(new Set(catalog.objects.map(({ id }) => id)).size, catalog.objects.length);
  for (const item of catalog.objects) {
    assert.equal(supportedRelations(catalog, item).length, item.relations.length, item.id);
  }
  const event = searchObjects(catalog, "evento MOFCOM")[0].objects[0];
  assert.deepEqual(supportedRelations(catalog, event).map(({ linked }) => linked.kind), ["TechnologyElement", "Country"]);
  const incomplete = { ...catalog, evidence: new Map() };
  assert.deepEqual(supportedRelations(incomplete, event), []);
});

test("historical scope is exact for both Observation and Document with no latest fallback", () => {
  const milestone = object("milestone:frontier:ise-oxford-prototype");
  const ref = milestone.evidence[0];
  const [current, prior] = evidenceHistory(catalog, milestone, ref);
  assert.equal(current.historical, false);
  assert.equal(prior.historical, true);
  assert.notEqual(prior.revision.documentRef, current.revision.documentRef);
  const parsed = readPin(investigationParams("Pesquisa tandem", milestone.id, prior.revision));
  assert.ok(parsed && parsed !== "invalid");
  assert.equal(readEvidence(catalog, milestone, ref, parsed).state, "ready");
  assert.equal(readEvidence(catalog, milestone, ref, { ...parsed, documentVersion: "latest" }).state, "unresolved");
  assert.equal(readEvidence(catalog, milestone, ref, { ...parsed, version: "missing" }).state, "unresolved");
  assert.equal(readEvidence(catalog, object("country:CHN"), ref, parsed).state, "unresolved");
  assert.equal(readPin(new URLSearchParams("evidence_ref=x&document_ref=y")), "invalid");
  const doubled = investigationParams("", milestone.id, prior.revision);
  doubled.append("evidence_version", parsed.version);
  assert.equal(readPin(doubled), "invalid");
});

test("withheld table yields status only and cannot appear in history", () => {
  const milestone = object("milestone:frontier:longi-esti-cell");
  const ref = milestone.evidence[1];
  assert.deepEqual(readEvidence(catalog, milestone, ref), { state: "restricted" });
  assert.deepEqual(evidenceHistory(catalog, milestone, ref), []);
});

test("links require explicit authorization and secure URLs", () => {
  const event = searchObjects(catalog, "evento mofcom")[0].objects[0];
  const result = readEvidence(catalog, event, event.evidence[0]);
  assert.equal(result.state, "ready");
  assert.equal(sourceHref(result.revision.document.citation), undefined);
  assert.equal(sourceHref({ mode: "bibliographic", url: "https://example.com" }), undefined);
  assert.equal(sourceHref({ mode: "link", url: "javascript:alert(1)" }), undefined);
  assert.equal(sourceHref({ mode: "link", url: "https://embedded:credential@example.com" }), undefined);
  assert.equal(sourceHref({ mode: "link", url: "https://example.com/doc" }), "https://example.com/doc");
});
