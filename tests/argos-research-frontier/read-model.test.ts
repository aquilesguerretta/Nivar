import assert from "node:assert/strict";
import test from "node:test";
import { contextEvidence, longiAnnouncement, milestones } from "../../src/features/argos-research-frontier/milestones.ts";
import { tandem, topcon } from "../../src/features/argos-research-frontier/model.ts";
import type { MilestoneId } from "../../src/features/argos-research-frontier/model.ts";
import {
  compareMeasurements, evidenceFor, findEvidence, hasTopconRelationship, metricValue,
  readDeployment, readMilestone, readReadiness,
} from "../../src/features/argos-research-frontier/readModel.ts";
import { readEvidence } from "../../src/features/argos-research-frontier/sources.ts";

function reading(id: MilestoneId, version?: string) {
  const record = readMilestone(id, version);
  assert.ok(record);
  return record;
}

test("five stable milestones resolve exact, typed subjects and version-pinned evidence", () => {
  assert.equal(milestones.length, 5);
  assert.equal(new Set(milestones.map(({ id }) => id)).size, 5);
  assert.equal(new Set(milestones.map(({ device }) => device.id)).size, 5);
  for (const milestone of milestones) {
    assert.equal(milestone.variant, tandem);
    for (const version of milestone.versions) {
      const record = reading(milestone.id, version.version);
      assert.equal(record.observation.id, milestone.versions[0].id);
      assert.equal(record.observation.subject, milestone.device.id);
      assert.equal(record.observation.knownOn, null);
      if (record.observation.previousVersion) {
        const previous = reading(milestone.id, record.observation.previousVersion);
        assert.ok(previous.observation.publishedOn < record.observation.publishedOn);
      }
      for (const ref of evidenceFor(record.observation)) {
        const evidence = readEvidence(ref, "local", "summary-and-metadata");
        assert.equal(evidence?.version, ref.version);
        assert.equal(evidence.locator, ref.locator);
        assert.ok(evidence.source.startsWith("source:"));
        assert.ok(evidence.rightsRef.startsWith("rights:candidate:niv74:"));
      }
    }
  }
  assert.ok(readEvidence(contextEvidence, "local", "summary-and-metadata"));
  assert.equal(readMilestone("__proto__"), undefined);
});

test("LONGi test, authors and later issuer statement keep their own scopes", () => {
  const { milestone, observation } = reading("milestone:frontier:longi-esti-cell");
  assert.equal(milestone.device.kind, "research-cell");
  assert.equal(milestone.device.terminals, 2);
  assert.equal(observation.authority, "external-lab");
  assert.match(observation.observedPeriod ?? "", /Fevereiro de 2026/);
  assert.match(observation.measurer ?? "", /JRC-ESTI/);
  assert.match(observation.reporter, /Green/);
  assert.equal(observation.area?.basis, "designated-illumination");
  assert.match(observation.area?.description ?? "", /0,9994 cm²/);
  assert.equal(metricValue(observation.metrics[0]), "35,2% ± 1,1 p.p.");
  assert.notEqual(observation.subject, longiAnnouncement.subject);
  assert.equal(readMilestone(milestone.id, "2026-07-15"), undefined);
  assert.ok(!observation.evidence.includes(longiAnnouncement.evidence));
  assert.equal(readEvidence(longiAnnouncement.evidence, "local", "summary-and-metadata")?.url, undefined);
});

test("prototype publication enriches the same measurement with active area and uncertainties", () => {
  const latest = reading("milestone:frontier:ise-oxford-prototype");
  const first = reading(latest.milestone.id, "2024-01-31");
  assert.equal(latest.observation.id, first.observation.id);
  assert.equal(latest.observation.previousVersion, first.observation.version);
  assert.equal(first.observation.area?.basis, "designated-illumination");
  assert.deepEqual(first.observation.metrics.map(metricValue), ["25%", "421 W"]);
  assert.equal(first.observation.setup, null);
  assert.equal(latest.observation.area?.basis, "active");
  assert.match(latest.observation.area?.description ?? "", /1,682 ± 0,015 m²/);
  assert.deepEqual(latest.observation.metrics.map(metricValue), ["25,00% ± 0,83 p.p.", "421 ± 13 W"]);
  assert.equal(findEvidence(first.observation, latest.observation.evidence[0].documentId, latest.observation.evidence[0].version), undefined);
});

test("comparability gate distinguishes device scale, area convention and evidentiary gaps", () => {
  const longi = reading("milestone:frontier:longi-esti-cell");
  const prototype = reading("milestone:frontier:ise-oxford-prototype");
  const prototypeAnnouncement = reading(prototype.milestone.id, "2024-01-31");
  const fraunhofer = reading("milestone:frontier:ise-topcon-research");
  const outdoor = reading("milestone:frontier:nicosia-outdoor");
  const conference = reading(outdoor.milestone.id, "2024-09");
  assert.match(outdoor.observation.observedPeriod ?? "", /primeiros 12 meses/);
  assert.match(outdoor.observation.metrics[0].denominator, /PCE inicial do submódulo superior/);
  assert.equal(outdoor.observation.metrics[0].kind, "relative-pce-loss");
  assert.equal(compareMeasurements(longi, prototype).status, "NOT_COMPARABLE");
  assert.match(compareMeasurements(longi, fraunhofer).reason, /convenções de área/);
  assert.equal(compareMeasurements(outdoor, prototype).status, "NOT_COMPARABLE");
  assert.equal(compareMeasurements(prototype, prototypeAnnouncement).status, "UNRESOLVED");
  assert.equal(compareMeasurements(outdoor, conference).status, "COMPARABLE_WITH_QUALIFICATION");
  assert.equal(compareMeasurements(longi, longi).status, "COMPARABLE");
});

test("TRL 6 stays on the assessed TOPCon cell and Saitama deployment stays on the HJT system", () => {
  const fraunhofer = reading("milestone:frontier:ise-topcon-research");
  const saitama = reading("milestone:frontier:saitama-hjt-demonstration");
  const technical = readReadiness(fraunhofer.observation.subject);
  assert.equal(technical?.level, 6);
  assert.equal(technical.assessor, "IEA");
  assert.match(technical.evidence.locator, /p\. 53/);
  assert.ok(!fraunhofer.observation.evidence.includes(technical.evidence));
  assert.equal(readReadiness(tandem), undefined);
  assert.equal(readReadiness(topcon), undefined);
  assert.equal(readReadiness(saitama.observation.subject), undefined);
  assert.equal(saitama.milestone.device.silicon, "HJT");
  assert.equal(hasTopconRelationship(saitama.milestone.id), false);
  assert.deepEqual(milestones.filter((item) => hasTopconRelationship(item.id)).map(({ id }) => id), [
    "milestone:frontier:nicosia-outdoor", "milestone:frontier:ise-topcon-research",
  ]);
  assert.equal(readDeployment(saitama.observation.subject)?.stage, "Demonstração");
  assert.equal(readDeployment(fraunhofer.observation.subject), undefined);
});

test("rights deny figures, forged evidence and all downstream channels", () => {
  const { observation } = reading("milestone:frontier:longi-esti-cell");
  const ref = observation.evidence[0];
  assert.match(readEvidence(ref, "local", "summary-and-metadata")?.notice ?? "", /CC BY-NC 4.0/);
  for (const channel of ["preview", "production", "client", "export", "api"] as const) {
    assert.equal(readEvidence(ref, channel, "summary-and-metadata"), undefined);
  }
  for (const output of ["reproduction", "certificate", "raw-document"] as const) {
    assert.equal(readEvidence(ref, "local", output), undefined);
  }
  assert.equal(readEvidence({ ...ref, documentId: "document:frontier:invented-certificate" }, "local", "summary-and-metadata"), undefined);
  assert.equal(readEvidence({ ...ref, locator: "Invented certificate" }, "local", "summary-and-metadata"), undefined);
  assert.equal(readEvidence({ ...ref, version: "v69" }, "local", "summary-and-metadata"), undefined);
});
