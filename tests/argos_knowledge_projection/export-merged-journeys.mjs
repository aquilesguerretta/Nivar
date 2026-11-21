// Test-only transport of the existing catalog exports, without network access.
import { exploreObjects, waferMetric } from "../../src/lib/argos/globalExplore.ts";
import {
  documentRefs, exploreEvidenceCatalog, resolveExploreSelection,
} from "../../src/lib/argos/globalExploreEvidence.ts";
import {
  applications, china, claims, material, timeline,
} from "../../src/features/argos-current-energy/case.ts";
import { documents } from "../../src/features/argos-current-energy/documents.ts";
import { steps } from "../../src/features/argos-current-energy/navigation.ts";
import { solarPv, tandem, topcon } from "../../src/features/argos-research-frontier/model.ts";
import { contextEvidence, milestones } from "../../src/features/argos-research-frontier/milestones.ts";
import { readEvidence } from "../../src/features/argos-research-frontier/sources.ts";

const publishers = Object.fromEntries(
  [["solar-pv", "doe"], ["china", "iea"]].map(([object, alias]) => {
    const result = resolveExploreSelection(object, new URLSearchParams({ evidence: alias }));
    if (result.state !== "READY" || !result.evidence) {
      throw new Error("Merged J1 evidence is unavailable");
    }
    return [result.evidence.document.sourceRef, result.evidence.source.publisher];
  }),
);

const frontierRefs = [
  contextEvidence,
  ...milestones.flatMap((milestone) => milestone.versions.flatMap((version) => version.evidence)),
];
const frontierDocuments = Object.fromEntries(frontierRefs.map((ref) => {
  const metadata = readEvidence(ref, "local", "summary-and-metadata");
  if (!metadata) throw new Error("Merged J4 evidence is unavailable");
  return [ref.documentId, metadata];
}));

process.stdout.write(JSON.stringify({
  j1: {
    objects: exploreObjects,
    metric: waferMetric,
    catalog: exploreEvidenceCatalog,
    document_refs: documentRefs,
    publishers,
  },
  j3: {
    event: timeline.april,
    event_label: steps.evento,
    material,
    material_label: steps.material,
    jurisdiction: china,
    claims,
    applications,
    documents,
  },
  j4: {
    solar_pv: solarPv,
    tandem,
    topcon,
    milestones,
    context_evidence: contextEvidence,
    documents: frontierDocuments,
  },
}));
