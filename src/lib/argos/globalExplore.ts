export const waferShareRef = "observation:iea:etp-2026:cn:pv-wafer:capacity-share:2024";
export const waferDocumentRef = "document:iea:etp-2026:wafer-capacity";

const solarPv = {
  id: "technology:solar-pv",
  kind: "Technology",
  name: "Solar PV",
  summary: "Conversão direta de luz em eletricidade por células fotovoltaicas.",
  aliases: ["solar fotovoltaica", "photovoltaics", "fotovoltaica"],
} as const;

const crystallineSilicon = {
  id: "variant:solar-pv:c-si",
  kind: "TechnologyVariant",
  name: "Silício cristalino (c-Si)",
  parentRef: solarPv.id,
  summary: "Variante fotovoltaica em que o silício cristalino absorve a luz na célula.",
  aliases: ["crystalline silicon", "c-si"],
} as const;

export const exploreObjects = {
  "solar-pv": solarPv,
  "c-si": crystallineSilicon,
  topcon: {
    id: "variant:solar-pv:c-si:topcon",
    kind: "TechnologyVariant",
    name: "TOPCon",
    parentRef: crystallineSilicon.id,
    relatedElementRef: "element:solar-pv:wafer",
    summary: "Arquitetura de contato de células fotovoltaicas de silício cristalino.",
    aliases: ["tunnel oxide passivated contact"],
  },
  "pv-wafer": {
    id: "element:solar-pv:wafer",
    kind: "TechnologyElement",
    name: "Wafer fotovoltaico",
    role: "Intermediário de fabricação",
    technologyContext: crystallineSilicon.id,
    summary: "Lâmina de silício cristalino que serve de substrato para a célula.",
    aliases: ["pv wafer", "wafer de silício", "lâmina fotovoltaica"],
    observationRef: waferShareRef,
  },
  china: {
    id: "country:CHN",
    kind: "Country",
    name: "China",
    lens: "Manufatura",
    summary: "Capacidade de fabricação de wafers fotovoltaicos instalada na China.",
    aliases: ["chn", "china manufacturing", "manufatura"],
    observationRef: waferShareRef,
  },
} as const;

export type ExploreObjectKey = keyof typeof exploreObjects;
type ExploreObject = typeof exploreObjects[ExploreObjectKey];
export const investigation = ["solar-pv", "c-si", "topcon", "pv-wafer", "china"] as const;

export function resolveExploreObject(ref: string) {
  return (Object.keys(exploreObjects) as ExploreObjectKey[])
    .map((key) => ({ key, ...exploreObjects[key] }))
    .find((object) => object.id === ref);
}

export function primaryAncestors(object: ExploreObject) {
  const ancestors = [];
  const seen = new Set<string>([object.id]);
  let current = object;
  while (current.kind === "TechnologyVariant") {
    const parent = resolveExploreObject(current.parentRef);
    if (!parent || seen.has(parent.id)) break;
    seen.add(parent.id);
    ancestors.unshift(parent);
    current = parent;
  }
  return ancestors;
}

export const pvStages = [
  { name: "Polissilício", description: "Matéria-prima de alta pureza." },
  { name: "Lingote", description: "Bloco de silício cristalizado." },
  { name: "Wafer", description: "Lâmina cortada do lingote." },
  { name: "Célula", description: "Wafer processado para gerar corrente." },
  { name: "Módulo", description: "Células interligadas e encapsuladas." },
] as const;

export const waferMetric = {
  id: "metric:pv-wafer:manufacturing-capacity-share",
  label: "Participação na capacidade mundial de fabricação de wafers fotovoltaicos",
  stage: "PV wafer",
  measure: "manufacturing-capacity",
  unit: "%",
  denominator: "Capacidade mundial de fabricação de wafers fotovoltaicos",
} as const;

export interface WaferObservation {
  readonly id: typeof waferShareRef;
  readonly metricRef: typeof waferMetric.id;
  readonly subjectRef: typeof exploreObjects.china.id;
  readonly elementRef: typeof exploreObjects["pv-wafer"]["id"];
  readonly estimate: number;
  readonly kind: "estimated";
  readonly referenceYear: number;
  readonly absoluteDenominatorGW: number | null;
  readonly documentRef: typeof waferDocumentRef;
  readonly documentVersion: number;
  readonly retrievedAt: string | null;
  readonly knownAt: string | null;
  readonly version: number;
  readonly supersedes: number | null;
  readonly access: "local" | "restricted";
  readonly synthetic?: true;
}

export function formatWaferShare(observation: WaferObservation) {
  return `≈${new Intl.NumberFormat("pt-BR").format(observation.estimate)}${waferMetric.unit}`;
}

export function assessWaferComparison(
  request: { measure: "manufacturing-capacity" | "actual-production"; referenceYear: number },
  observation: WaferObservation,
) {
  if (request.measure !== waferMetric.measure || request.referenceYear !== observation.referenceYear) {
    return "NOT COMPARABLE";
  }
  // This slice has no independent observation to compare at the requested scope.
  return "UNRESOLVED";
}

export function isExploreObject(key: string): key is ExploreObjectKey {
  return Object.hasOwn(exploreObjects, key);
}

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("pt-BR").normalize("NFD").replace(/\p{M}/gu, "");
}

export function searchExplore(query: string) {
  const normalized = normalize(query);
  return (Object.keys(exploreObjects) as ExploreObjectKey[])
    .filter((key) => {
      const item = exploreObjects[key];
      return normalize(item.id) === normalized ||
        [item.name, ...item.aliases].some((term) => normalize(term).includes(normalized));
    })
    .map((key) => ({ key, ...exploreObjects[key] }));
}

export const evidenceOutputs = {
  "Gráfico, figuras e fotos originais": "RESTRICTED",
  "Dados brutos, download e API externa": "RESTRICTED",
  "Publicação da observação": "RESTRICTED",
} as const;
