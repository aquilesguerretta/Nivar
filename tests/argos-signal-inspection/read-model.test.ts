import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  assertInspectionReadModel,
  surfaceableClaim,
  type ArgosInspectionReadModel,
} from "../../src/lib/argos/signalInspectionApi.ts";

const root = fileURLToPath(new URL("../..", import.meta.url));

function model(
  decision: "PROMOTE" | "HOLD" | "REJECT",
): ArgosInspectionReadModel {
  const claim = decision === "PROMOTE"
    ? {
        factualClaim: "Claim minted by SignalClaimPack.",
        caveats: ["Bounded caveat."],
        forbiddenClaims: ["Unsupported cause."],
        claimGuard: null,
      }
    : null;
  return {
    scenario: {
      id: decision === "PROMOTE"
        ? "promote-effective-power"
        : decision === "HOLD"
          ? "hold-removal-health-unresolved"
          : "reject-presentation-only",
      label: decision,
      goldReference: "SG-TEST",
      synthetic: true,
    },
    source: { sourceId: "ons.capacidade_geracao" },
    observations: { fromSnapshotId: "from-uuid", toSnapshotId: "to-uuid" },
    event: {
      kind: "TEST_EVENT",
      facts: {},
      deterministicResultKind: "CONTENT_DELTA",
      byteRelation: "CHANGED",
      parserVersion: "parser@1",
      diffVersion: "diff@1",
      delta: { contentEqual: false, added: [], removed: [], changed: [] },
    },
    promotion: {
      decision,
      reasonCode: `${decision}_REASON`,
      sourceHealthState: "HEALTHY_COMPLETE",
      evidenceState: "RECONSTRUCTIBLE",
      semanticsState: "UNDERSTOOD",
      materialityState: "MATERIAL",
      rights: {
        surface: "human_signal_display",
        state: "CLEARED_WITH_ATTRIBUTION",
        rightsRecordRef: "RIGHTS-REF",
        attributionRequired: true,
      },
      caveats: [],
      forbiddenClaims: [],
    },
    claim,
    evidence: {
      refs: ["from-uuid", "to-uuid"],
      fromSnapshotId: "from-uuid",
      toSnapshotId: "to-uuid",
    },
  };
}

test("PROMOTE renders only the backend claim-pack factual claim", () => {
  const promote = model("PROMOTE");
  assertInspectionReadModel(promote);
  assert.equal(surfaceableClaim(promote), "Claim minted by SignalClaimPack.");
});

test("HOLD and REJECT have no surfaceable factual claim", () => {
  for (const decision of ["HOLD", "REJECT"] as const) {
    const result = model(decision);
    assertInspectionReadModel(result);
    assert.equal(surfaceableClaim(result), null);
  }
});

test("client rejects claim/decision mismatch and changed evidence refs", () => {
  const forgedHold = model("HOLD") as unknown as Record<string, unknown>;
  forgedHold.claim = model("PROMOTE").claim;
  assert.throws(() => assertInspectionReadModel(forgedHold), /claim incompatível/);

  const forgedEvidence = model("PROMOTE");
  forgedEvidence.evidence.refs[1] = "browser-invented";
  assert.throws(() => assertInspectionReadModel(forgedEvidence), /evidência inconsistentes/);
});

test("operator component consumes canonical fields without posting authority", async () => {
  const component = await readFile(
    `${root}/src/pages/operador/ArgosSignalInspection.tsx`,
    "utf8",
  );
  const api = await readFile(
    `${root}/src/lib/argos/signalInspectionApi.ts`,
    "utf8",
  );
  assert.match(component, /surfaceableClaim\(inspection\)/);
  assert.match(component, /inspection\?\.promotion\.decision/);
  assert.match(component, /inspection\.observations\.fromSnapshotId/);
  assert.match(component, /inspection\.event\.parserVersion/);
  assert.match(api, /credentials:\s*["']include["']/);
  assert.doesNotMatch(api, /method:\s*["']POST["']/);
  assert.doesNotMatch(api, /source_health_state|materiality_state|semantics_understood/);
});
