import assert from "node:assert/strict";
import { test } from "node:test";
import { claims, dossierCutoff, resolveEvidence, type ClaimKey } from "../../src/features/argos-companies-assets/evidence.ts";
import { areaSplit, contractors, field, isDate, profile, replay, roles, transfer, union, vessel } from "../../src/features/argos-companies-assets/model.ts";

test("company profile, entities, public party, field and FPSO use distinct scoped identities", () => {
  const objects = [profile, field, vessel, union, ...Object.values(contractors)];
  assert.equal(new Set(objects.map((item) => item.id)).size, objects.length);
  assert.ok(objects.every((item) => item.id.startsWith("niv79:")));
  assert.equal(profile.primaryEntityRef, contractors.petrobras.id);
  assert.equal(field.assetType, "oil_field");
  assert.equal(vessel.assetType, "fpso");
  assert.equal(vessel.fieldRef, field.id);
  assert.deepEqual(contractors.petrobras.identifiers.map(({ value }) => value), ["33.000.167/0001-01", "0001119639"]);
  assert.deepEqual(contractors.cnodc.identifiers.map(({ value }) => value), ["19.233.194/0001-01"]);
  assert.deepEqual(contractors.cnooc.identifiers.map(({ value }) => value), ["19.246.634/0001-57"]);
});

test("issuer governance, field operation, PPSA marketing and issuer-reported vessel roles remain scoped", () => {
  assert.equal(roles.governance.kind, "governance_control");
  assert.equal(roles.governance.objectRef, contractors.petrobras.id);
  assert.equal(roles.fieldOperation.subjectRef, contractors.petrobras.id);
  assert.equal(roles.fieldOperation.objectRef, field.id);
  assert.equal(roles.unionRepresentation.kind, "Claim");
  const vesselRoles = Object.values(roles).filter((role) => role.objectRef === vessel.id);
  assert.deepEqual(vesselRoles.map((role) => role.scope), ["issuer_reported_vessel_title", "vessel_operations_and_maintenance"]);
  assert.ok(!vesselRoles.some((role) => "subjectRef" in role && role.subjectRef === contractors.petrobras.id));
  assert.match(roles.vesselOwner.subjectName, /^MISC Offshore/);
  assert.equal(roles.vesselOwner.effectiveFrom, null);
  assert.equal("bps" in roles.vesselOwner, false);
  assert.equal(field.geometry, null);
  assert.equal("geometry" in vessel, false);
});

test("the documented denominators reconcile independently in integer basis points", () => {
  const { rows } = replay(dossierCutoff);
  assert.deepEqual(areaSplit, { contractedBps: 9650, unionBps: 350 });
  for (const table of Object.values(rows)) {
    assert.ok(table.every((row) => Number.isInteger(row.bps)));
    assert.equal(table.reduce((total, row) => total + row.bps, 0), 10_000);
  }
  assert.deepEqual(rows.reservoir.map(({ bps }) => bps), [3860, 1930, 1930, 965, 965, 350]);
  assert.equal(rows.reservoir.at(-1)?.subjectRef, union.id);
  assert.equal(rows.contracted[0].bps, 4000);
  assert.equal(rows.acquired[0].bps, 8000);
  assert.ok(rows.acquired.every((row) => row.relationKind === null));
  assert.equal(new Set(Object.values(rows).map((table) => table[0].metricRef)).size, 3);
  assert.ok(Object.values(rows).flat().every((row) => row.effectiveFrom === null && row.objectRef === field.id));
});

test("historical replay respects approval, signing, the auction and the specific FY2025 observation", () => {
  assert.deepEqual(replay("2021-12-08").events, []);
  assert.equal(replay("2021-12-09").events.at(-1)?.evidence, "aip-approval");
  assert.equal(replay("2024-09-08").events.length, 1);
  assert.equal(replay("2024-09-09").events.at(-1)?.evidence, "aip-addendum");
  assert.deepEqual(replay("2025-12-03").rows.acquired, []);
  assert.equal(replay("2025-12-04").rows.acquired[0].bps, 8000);
  assert.deepEqual(replay("2025-12-30").rows.reservoir, []);
  const historical = replay("2025-12-31").rows.reservoir[0];
  assert.deepEqual([historical.bps, historical.referenceOn, historical.knownAt], [3860, "2025-12-31", dossierCutoff]);
  assert.deepEqual(historical.evidence, ["reservoir-split"]);
  assert.deepEqual(replay("2026-01-01").rows.reservoir, []);
  assert.equal(replay("2026-03-09").pending, null);
  assert.equal(replay(transfer.signedOn).pending?.status, "pending");
  assert.deepEqual(replay(transfer.signedOn).projected, []);
});

test("passing the announced date cannot close a transfer or overwrite documented participation", () => {
  for (const date of ["2027-02-28", transfer.plannedOn, "2027-03-02", "2040-01-01"]) {
    const state = replay(date);
    assert.equal(state.pending?.status, "pending");
    assert.equal(state.pending?.announcedDateReached, date >= transfer.plannedOn);
    assert.equal(state.pending?.effectiveOn, null);
    assert.equal(state.baselineOn, dossierCutoff);
    assert.equal(state.rows.reservoir[0].bps, 3860);
    assert.equal(state.rows.reservoir.at(-1)?.bps, 350);
    assert.deepEqual(state.projected.map(({ bps, incrementBps, type }) => [bps, incrementBps, type]),
      [[4140, 280, "forecast"], [2000, 70, "forecast"]]);
    assert.ok(state.projected.every((row) => row.referenceOn === transfer.plannedOn && row.effectiveFrom === null && row.relationKind === null));
    assert.ok(state.rows.reservoir.every((row) => row.type === "reported"));
  }
});

test("IDs resolve to fixed evidence claims, documents and resource rights with distinct dates", () => {
  const evidenceKeys = [
    ...Object.values(roles).map((role) => role.evidence),
    ...Object.values(contractors).flatMap((entity) => entity.identifiers.map((item) => item.evidence)),
    vessel.associationEvidence, field.geographyEvidence,
    ...Object.values(replay(dossierCutoff).rows).flat().flatMap((row) => row.evidence),
    ...replay(dossierCutoff).projected.flatMap((row) => row.evidence),
    ...replay(dossierCutoff).events.map((event) => event.evidence),
  ];
  assert.deepEqual(new Set(evidenceKeys), new Set(Object.keys(claims)));
  for (const key of Object.keys(claims) as ClaimKey[]) {
    const { claim, document, source, rights } = resolveEvidence(key);
    assert.match(claim.id, /^niv79:claim:.+:v1$/);
    assert.match(document.id, /^niv79:document:.+:v1$/);
    assert.equal(new URL(document.url).protocol, "https:");
    assert.ok(source.publisher && claim.locator && document.version && claim.limit);
    assert.equal(claim.knownAt, dossierCutoff);
    assert.equal(document.retrievedOn, dossierCutoff);
    assert.ok(document.publishedOn === null || document.publishedOn <= dossierCutoff);
    assert.equal(rights.status, "conditional-private");
    assert.match(rights.gated, /API/);
  }
  assert.equal(resolveEvidence("vessel-roles").document.publishedOn, null);
  const addendum = resolveEvidence("aip-addendum");
  assert.equal(addendum.document.publishedOn, "2024-11-18");
  assert.equal(addendum.claim.referencePeriod, "09/09/2024");
  assert.equal(resolveEvidence("transfer-signing").document.id, resolveEvidence("transfer-schedule").document.id);
  assert.notEqual(resolveEvidence("transfer-signing").claim.id, resolveEvidence("transfer-schedule").claim.id);
});

test("invalid dates fail closed before any replay", () => {
  assert.equal(isDate("2028-02-29"), true);
  for (const invalid of ["2027-02-29", "2026-11-31", "2026-1-1", "2027-03-01T00:00:00Z", ""]) {
    assert.equal(isDate(invalid), false);
    assert.throws(() => replay(invalid), RangeError);
  }
});
