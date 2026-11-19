const waferShareRef = "observation:iea:etp-2026:cn:pv-wafer:capacity-share:2024";

export const exploreObjects = {
  topcon: {
    id: "variant:solar-pv:c-si:topcon",
    kind: "TechnologyVariant",
    name: "TOPCon",
    parent: { id: "variant:solar-pv:c-si", name: "Silício cristalino", technology: "Solar PV" },
    relatedElement: "pv-wafer",
    summary: "Arquitetura de contato de células fotovoltaicas de silício cristalino.",
    aliases: ["tunnel oxide passivated contact", "solar pv", "c-si"],
  },
  "pv-wafer": {
    id: "element:solar-pv:wafer",
    kind: "TechnologyElement",
    name: "Wafer fotovoltaico",
    role: "Intermediário de fabricação",
    technologyContext: "variant:solar-pv:c-si",
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
export type WaferView = "pv-wafer" | "china";

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
  readonly id: string;
  readonly metricRef: typeof waferMetric.id;
  readonly subjectRef: typeof exploreObjects.china.id;
  readonly elementRef: typeof exploreObjects["pv-wafer"]["id"];
  readonly estimate: number;
  readonly kind: "estimated";
  readonly referenceYear: number;
  readonly publishedOn: string;
  readonly absoluteDenominatorGW: number | null;
  readonly sourceRef: "iea";
  readonly retrievedAt: string | null;
  readonly knownAt: string | null;
  readonly version: number;
  readonly supersedes: number | null;
}

interface ObservationSeries {
  readonly currentVersion: number;
  readonly versions: readonly WaferObservation[];
}

type ObservationRecords = Readonly<Record<string, ObservationSeries>>;

export const exploreObservations: ObservationRecords = {
  [waferShareRef]: {
    currentVersion: 1,
    versions: [{
      id: waferShareRef,
      metricRef: waferMetric.id,
      subjectRef: exploreObjects.china.id,
      elementRef: exploreObjects["pv-wafer"].id,
      estimate: 95,
      kind: "estimated",
      referenceYear: 2024,
      publishedOn: "2026-03-26",
      absoluteDenominatorGW: null,
      sourceRef: "iea",
      retrievedAt: null,
      knownAt: null,
      version: 1,
      supersedes: null,
    }],
  },
};

export function resolveWaferObservation(
  view: WaferView,
  records = exploreObservations,
): WaferObservation | undefined {
  const ref = exploreObjects[view].observationRef;
  const series = records[ref];
  return series?.versions.find((item) => item.id === ref && item.version === series.currentVersion);
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
      return [item.name, ...item.aliases].some((term) => normalize(term).includes(normalized));
    })
    .map((key) => ({ key, ...exploreObjects[key] }));
}

export const evidenceSources = {
  doe: {
    publisher: "U.S. Department of Energy · Solar Energy Technologies Office",
    title: "Crystalline Silicon Photovoltaics Research",
    url: "https://www.energy.gov/cmei/systems/crystalline-silicon-photovoltaics-research",
    claim: "O DOE descreve a cadeia do silício cristalino e distingue as arquiteturas de célula PERC, TOPCon e heterojunção.",
    period: "Visão técnica. Sem série temporal para as afirmações deste recorte.",
    date: "Atualização indicada no dossiê NIV-67 · 17 dez. 2025",
    method: "Visão técnica do DOE sobre materiais, etapas de produção e projetos de célula.",
    limits: "Explicação de arquitetura e processo. Resultados comerciais e desempenho de fabricantes exigem evidência própria.",
    rights: "Resumo autoral local e link oficial. Figuras, fotos, marcas e materiais de terceiros ficam restritos.",
    rightsUrl: "https://www.energy.gov/about-us/web-policies",
  },
  feldmann: {
    publisher: "Solar Energy Materials and Solar Cells · Feldmann et al.",
    title: "Passivated rear contacts for high-efficiency n-type Si solar cells",
    url: "https://doi.org/10.1016/j.solmat.2013.09.017",
    claim: "O estudo demonstra a passivação e o transporte de cargas no contato traseiro de células experimentais de silício tipo n.",
    period: "Células experimentais estudadas no artigo.",
    date: "Janeiro de 2014 · volume 120",
    method: "Experimento com uma camada de óxido de tunelamento e silício dopado na interface de contato.",
    limits: "Resultado de pesquisa para os dispositivos estudados. Alegações industriais de rendimento, eficiência e durabilidade exigem outras medições.",
    rights: "Resumo autoral local e link DOI. Texto integral, figuras e dados do artigo ficam restritos.",
  },
  iea: {
    publisher: "International Energy Agency (IEA), Paris",
    title: "Energy Technology Perspectives 2026",
    url: "https://www.iea.org/reports/energy-technology-perspectives-2026/supply-chain-risks-and-industrial-competitiveness",
    chartUrl: "https://www.iea.org/data-and-statistics/charts/geographic-concentration-of-supply-chains-for-selected-industrial-products-fossil-fuels-and-clean-energy-technologies-by-region-2024",
    method: "A IEA estima a participação da capacidade de fabricação localizada na China na capacidade mundial da mesma etapa da cadeia fotovoltaica.",
    limits: "A estimativa cobre a etapa de wafer. Produção efetiva, capacidade de células TOPCon e geração elétrica são medidas distintas. O gráfico público não informa o denominador absoluto em GW e não disponibiliza o CSV.",
    rights: "A IEA indica CC BY 4.0 para o capítulo e o gráfico. Recorte factual em texto da NIVAR para inspeção local. A exibição pública ou para clientes depende do NIV-76. Imagens, dados subjacentes e redistribuição exigem autorização separada.",
    rightsUrl: "https://www.iea.org/terms/creative-commons-cc-licenses",
  },
} as const;

export type EvidenceKey = keyof typeof evidenceSources;

export const evidenceOutputs = {
  "Gráfico, figuras e fotos originais": "RESTRICTED",
  "Dados brutos, download e API externa": "RESTRICTED",
  "Publicação da observação": "RESTRICTED",
} as const;
