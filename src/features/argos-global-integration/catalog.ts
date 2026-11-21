import { exploreObjects, investigation, type ExploreObjectKey } from "../../lib/argos/globalExplore.ts";
import { applications, china, material, timeline } from "../argos-current-energy/case.ts";
import { documents } from "../argos-current-energy/documents.ts";
import { steps } from "../argos-current-energy/navigation.ts";
import { milestones } from "../argos-research-frontier/milestones.ts";
import { solarPv, tandem, topcon } from "../argos-research-frontier/model.ts";

type Journey = "technology" | "current" | "frontier";
type ObjectKind = (typeof exploreObjects)[ExploreObjectKey]["kind"] | "Event" | "Document" | "ResearchMilestone";
type Entry = {
  key: string;
  id: string;
  kind: ObjectKind;
  name: string;
  summary: string;
  journey: Journey;
  aliases?: readonly string[];
  parent?: string;
  pins?: Record<string, string>;
};

const technologyEntries = investigation.map((key): Entry => {
  const object = exploreObjects[key];
  const parent = "parentRef" in object ? object.parentRef
    : "technologyContext" in object ? object.technologyContext : undefined;
  return {
    ...object, key, journey: "technology",
    aliases: key === "china" ? [...object.aliases, china.id] : object.aliases,
    parent: investigation.find((candidate) => exploreObjects[candidate].id === parent),
  };
});

export const currentKey = "mofcom-2025";
export const tandemKey = "tandem";
export const companiesKey = "empresas-e-ativos";
export const aprilDocumentKey = "anuncio-18-2025";
export const materialKey = "ndfeb";

const legalEntries = Object.entries(timeline).map(([key, event]): Entry => {
  const record = documents[key as keyof typeof timeline];
  return {
    key: key === "april" ? currentKey : `mofcom-${key}`,
    id: event.id,
    kind: "Event",
    name: key === "april" ? steps.evento : record.title,
    summary: event.claim.text,
    aliases: [record.source.publisher, record.nativeId],
    journey: "current",
    parent: key === "april" ? undefined : currentKey,
  };
});

const applicationEntries = (["motor", "generator"] as const).map((key): Entry => ({
  key: key === "motor" ? "motor-ima-permanente" : "gerador-ima-permanente",
  ...applications[key],
  kind: "TechnologyVariant",
  summary: "Aplicação técnica de ímãs permanentes.",
  journey: "current",
  parent: materialKey,
}));

export const entries: readonly Entry[] = [
  ...technologyEntries,
  ...legalEntries,
  {
    key: aprilDocumentKey, id: documents.april.id, kind: "Document", name: steps.documento,
    summary: "Instrumento original no idioma autêntico.", aliases: [documents.april.nativeId],
    journey: "current", parent: currentKey,
    pins: { document_ref: documents.april.id, document_version: String(documents.april.version) },
  },
  {
    key: materialKey, id: material.id, kind: material.kind, name: steps.material,
    summary: "Material em ímã ou pó magnético identificado no item 1C905.a.4.",
    aliases: ["terras raras", "dysprosium", "1C905.a.4"], journey: "current", parent: aprilDocumentKey,
  },
  ...applicationEntries,
  {
    key: tandemKey, id: tandem, kind: "TechnologyVariant", name: "Tandem perovskita–silício",
    summary: "Dispositivos fotovoltaicos que combinam junções de perovskita e silício.",
    aliases: ["perovskite silicon", "tandem 2T 4T"], journey: "frontier", parent: "solar-pv",
  },
  ...milestones.map((milestone): Entry => ({
    key: milestone.id.slice("milestone:frontier:".length), id: milestone.id,
    kind: "ResearchMilestone", name: milestone.title, summary: milestone.reachedBy,
    journey: "frontier", parent: tandemKey,
    pins: {
      observation_ref: milestone.versions[0].id,
      observation_version: milestone.versions[0].version,
    },
  })),
];

export function entryFor(ref: string | undefined) {
  return entries.find((entry) => entry.key === ref || entry.id === ref ||
    (entry.key === "china" && ref === china.id));
}

export function ancestry(entry: Entry) {
  const trail = [entry];
  let parent = entryFor(entry.parent);
  while (parent) {
    trail.unshift(parent);
    parent = entryFor(parent.parent);
  }
  return trail;
}

export const sharedRefs = { solarPv, topcon };
export const milestoneEntries = entries.filter((entry) => entry.kind === "ResearchMilestone");
export const applicationsForMaterial = applicationEntries;

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("pt-BR").normalize("NFD").replace(/\p{M}/gu, "");
}

export function searchCatalog(query: string) {
  const search = normalize(query);
  return entries.filter((entry) => [entry.id, entry.name, ...(entry.aliases ?? [])]
    .some((term) => normalize(term).includes(search)));
}
