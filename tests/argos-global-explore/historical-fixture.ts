import { waferDocumentRef, waferShareRef } from "../../src/lib/argos/globalExplore.ts";
import type { ExploreEvidenceCatalog } from "../../src/lib/argos/globalExploreEvidence.ts";

// QA-only revisions. They do not describe a publisher correction.
export function syntheticCorrection(catalog: ExploreEvidenceCatalog): ExploreEvidenceCatalog {
  const observation = catalog.observations[waferShareRef]!.versions[0];
  const document = catalog.documents[waferDocumentRef]!.versions[0];
  return {
    observations: {
      [waferShareRef]: {
        currentVersion: 2,
        versions: [
          observation,
          { ...observation, version: 2, estimate: 94, documentVersion: 2, supersedes: 1, synthetic: true },
          { ...observation, version: 3, estimate: 99, documentVersion: 3, supersedes: 2, synthetic: true },
        ],
      },
    },
    documents: {
      ...catalog.documents,
      [waferDocumentRef]: {
        currentVersion: 2,
        versions: [
          document,
          { ...document, title: "Documento sintético v2", version: 2, supersedes: 1, synthetic: true },
          { ...document, title: "Documento sintético restrito v3", version: 3, access: "restricted", supersedes: 2, synthetic: true },
        ],
      },
    },
  };
}
