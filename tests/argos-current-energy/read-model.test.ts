import assert from "node:assert/strict";
import test from "node:test";
import {
  applications, china, claims, controlledItem, journeyRelations, material, suspensionAt, suspensionTargets, timeline,
} from "../../src/features/argos-current-energy/case.ts";
import { documents, documentVersion, instrumentKey, jointAnnouncement, resolveDocument } from "../../src/features/argos-current-energy/documents.ts";
import { reviewCutoff } from "../../src/features/argos-current-energy/model.ts";
import { actionContext, readView } from "../../src/features/argos-current-energy/navigation.ts";

test("April is one dated licensing Event with one authentic Chinese Document and a separate translation", () => {
  const original = resolveDocument(timeline.april.document);
  assert.equal(original, documents.april);
  assert.equal(original?.nativeId, "CN/MOFCOM + GACC/Announcement/2025/18");
  assert.equal(original?.authority, "original");
  assert.equal(original?.language, "zh-CN");
  assert.equal(timeline.april.occurredOn, "2025-04-04");
  assert.equal(original?.issuedOn, "2025-04-04");
  assert.deepEqual(original?.publication, { date: "2025-04-04", time: "18:00", kind: "publication" });
  assert.deepEqual(original?.effective, { from: "2025-04-04" });
  assert.equal(documents.english.nativeId, original?.nativeId);
  assert.notEqual(documents.english.id, original?.id);
  assert.equal(documents.english.authority, "reference-translation");
  assert.deepEqual(documents.english.relatesTo, { type: "translation-of", document: timeline.april.document });
  assert.equal(documents.english.publication, null);
  assert.ok(Object.values(timeline).every(({ document }) => document.id !== documents.english.id));
});

test("the suspension scope is exactly six instruments, keyed by issuing authorities, year and number", () => {
  assert.deepEqual(suspensionTargets.map(instrumentKey), [
    "CN/MOFCOM + GACC/Announcement/2025/55",
    "CN/MOFCOM + GACC/Announcement/2025/56",
    "CN/MOFCOM + GACC/Announcement/2025/57",
    "CN/MOFCOM + GACC/Announcement/2025/58",
    "CN/MOFCOM/Announcement/2025/61",
    "CN/MOFCOM/Announcement/2025/62",
  ]);
  assert.notEqual(timeline.april.id, timeline.continuation.id);
  assert.equal(timeline.continuation.occurredOn, "2026-11-09");
  assert.equal(documents.continuation.issuedOn, "2026-11-09");
  assert.deepEqual(documents.continuation.effective, { from: "2026-11-11", through: "2027-01-10" });
  assert.deepEqual(documents.suspension.effective, { from: "2025-11-07", through: "2026-11-10" });
  for (const date of ["2025-11-07", "2026-11-10", "2026-11-11", "2026-11-18"]) {
    assert.equal(suspensionAt(jointAnnouncement(2025, 18), date), undefined);
    assert.equal(suspensionAt(jointAnnouncement(2026, 58), date), undefined);
    assert.equal(suspensionAt(jointAnnouncement(2025, 61), date), undefined);
    assert.equal(suspensionAt({ issuers: "GACC", year: 2025, number: 61 }, date), undefined);
    const expected = date < "2026-11-11" ? documents.suspension : documents.continuation;
    for (const instrument of suspensionTargets) assert.equal(suspensionAt(instrument, date), expected);
  }
});

test("a historical lookup rejects invalid periods and does not infer future status or automatic resumption", () => {
  const target = jointAnnouncement(2025, 58);
  for (const date of ["2025-11-06", "2026-11-31", "2026-1-01", "2026-11-19", "2027-01-10", "2027-01-11", "today"]) {
    assert.equal(suspensionAt(target, date), undefined, date);
  }
  assert.equal(documents.questioning.issuedOn, "2025-06-16");
  assert.deepEqual(documents.questioning.publication, { date: "2025-08-19", kind: "gazette-repost" });
  assert.equal(documents.catalogue.issuedOn, "2025-12-31");
  assert.equal(documents.catalogue.effective?.from, "2026-01-01");
  assert.deepEqual(documents.procedure.relatesTo, { type: "repeals", document: documentVersion(documents.questioning) });
  assert.equal(documents.procedure.effective?.from, "2026-10-19");
  assert.equal(documents.april.relatesTo, undefined);
});

test("only the selected item and independent technical application are linked to the action jurisdiction", () => {
  assert.equal(controlledItem.itemCode, "1C905.a.4");
  assert.equal(controlledItem.materialId, material.id);
  assert.equal(controlledItem.evidence.locator, controlledItem.itemCode);
  assert.equal(resolveDocument(controlledItem.evidence.document), documents.april);
  assert.equal(controlledItem.customsReference, null);
  assert.deepEqual(material.forms, ["magnet", "magnetic-powder"]);
  assert.equal(material.role, "material");
  assert.deepEqual(journeyRelations.map(({ type, from, to }) => [type, from, to]), [
    ["officialRecord", timeline.april.id, documents.april.id],
    ["controlledItem", documents.april.id, material.id],
    ["materialUse", material.id, applications.id],
    ["jurisdiction", applications.id, china.id],
  ]);
  assert.ok(journeyRelations.every(({ claim }) => claim.evidence.every(({ document }) => resolveDocument(document))));
  assert.equal(claims.application.kind, "nivar_analysis");
  assert.deepEqual(claims.application.evidence.map(({ document }) => resolveDocument(document)), [documents.doe, documents.rom]);
  assert.equal(claims.faq5.kind, "actor_statement");
  assert.match(claims.faq5.text, /segundo a FAQ 5.*geralmente/i);
  assert.match(claims.jurisdiction.qualification, /empresa afetada e efeito econômico não foram estabelecidos/);
  assert.equal(claims.rationale.kind, "actor_statement");
  assert.equal(claims.registry.kind, "observed_fact");
});

test("every claim resolves a specific version and metadata-only source; acquisition dates remain unknown", () => {
  const allDocuments = Object.values(documents);
  const allClaims = [...Object.values(claims), ...Object.values(timeline).map(({ claim }) => claim)];
  assert.equal(new Set(allDocuments.map(({ id }) => id)).size, allDocuments.length);
  assert.equal(new Set(allClaims.map(({ id }) => id)).size, allClaims.length);
  for (const { evidence } of allClaims) {
    for (const { document, locator } of evidence) {
      assert.ok(locator);
      assert.ok(resolveDocument(document));
      assert.equal(resolveDocument({ ...document, version: document.version + 1 }), undefined);
    }
  }
  for (const record of allDocuments) {
    assert.ok(record.id.startsWith("j3:document:"));
    assert.ok(record.source.id.startsWith("j3:source:"));
    assert.equal(record.reviewedThrough, reviewCutoff);
    assert.equal(record.knownAt, null);
    assert.equal(record.retrievedAt, null);
    assert.equal(new URL(record.url).protocol, "https:");
    const { rights } = record.source;
    assert.equal(rights.review, "NIV-74");
    assert.equal(rights.local, "private-metadata-and-nivar-notes");
    assert.equal(rights.link, "bibliographic-only");
    for (const channel of ["reproduction", "translation", "publicDisplay", "download", "api"] as const) {
      assert.equal(rights[channel], "unapproved");
    }
    assert.ok(!Object.keys(record).some((key) => /raw|artifact|full.?text|transcript/i.test(key)));
  }
  assert.equal(documents.register.source.rights.collection, "prohibited");
  assert.deepEqual(documents.register.urlAliases, ["https://policy.mofcom.gov.cn/claw/clawContent.shtml?id=102310"]);
});

test("navigation accepts typed local context and rejects unsupported categories, evidence and object links", () => {
  assert.deepEqual(readView(""), { kind: "step", context: "evento" });
  assert.equal(actionContext("april"), "documento");
  assert.deepEqual(readView("#cronologia/continuation"), { kind: "action", context: "cronologia/continuation", action: "continuation" });
  assert.deepEqual(readView("#evidencias/material"), { kind: "evidence", origin: "material" });
  assert.deepEqual(readView("#evidencias/cronologia/continuation"), { kind: "evidence", origin: "cronologia/continuation" });
  for (const hash of ["#topcon", "#empresa", "#signal", "#raw", "#evidencias/arquivo", "#cronologia/april", "#cronologia/2025-58", "#evidencias/__proto__", "#politica/2027"]) {
    assert.deepEqual(readView(hash), { kind: "unavailable" }, hash);
  }
});