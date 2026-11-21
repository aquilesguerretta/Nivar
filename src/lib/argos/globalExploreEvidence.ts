import {
  exploreObjects,
  waferDocumentRef,
  waferMetric,
  waferShareRef,
  type ExploreObjectKey,
  type WaferObservation,
} from "./globalExplore.ts";

const sourceRegistry = {
  "source:doe:seto": {
    kind: "Source",
    publisher: "U.S. Department of Energy · Solar Energy Technologies Office",
    rightsUrl: "https://www.energy.gov/about-us/web-policies",
  },
  "source:journal:solmat": {
    kind: "Source",
    publisher: "Solar Energy Materials and Solar Cells",
  },
  "source:iea": {
    kind: "Source",
    publisher: "International Energy Agency (IEA), Paris",
    rightsUrl: "https://www.iea.org/terms/creative-commons-cc-licenses",
  },
} as const;

export const documentRefs = {
  doe: "document:doe:crystalline-silicon-pv",
  feldmann: "document:solmat:10.1016/j.solmat.2013.09.017",
  iea: waferDocumentRef,
} as const;

export type EvidenceKey = keyof typeof documentRefs;
type DocumentRef = typeof documentRefs[EvidenceKey];
type SourceRef = keyof typeof sourceRegistry;
type EvidenceLink = { key: EvidenceKey; label: string };

const doeLink = { key: "doe", label: "Arquiteturas e fabricação · DOE" } as const;
const ieaLink = { key: "iea", label: "Estimativa de capacidade · IEA" } as const;
export const evidenceLinks: Record<ExploreObjectKey, readonly EvidenceLink[]> = {
  "solar-pv": [doeLink],
  "c-si": [doeLink],
  topcon: [doeLink, { key: "feldmann", label: "Experimento de contato · Feldmann et al." }],
  "pv-wafer": [ieaLink, doeLink],
  china: [ieaLink],
};

type Revision = {
  readonly id: string;
  readonly version: number;
  readonly access: "local" | "restricted";
};

type VersionSeries<T extends Revision> = {
  readonly currentVersion: number;
  readonly versions: readonly T[];
};

export type ExploreDocument = Revision & {
  readonly id: DocumentRef;
  readonly kind: "Document";
  readonly sourceRef: SourceRef;
  readonly title: string;
  readonly url: string;
  readonly chartUrl?: string;
  readonly authors?: string;
  readonly claim?: string;
  readonly period?: string;
  readonly publishedOn: string | null;
  readonly dateLabel?: string;
  readonly retrievedAt: string | null;
  readonly knownAt: string | null;
  readonly method: string;
  readonly limits: string;
  readonly rights: string;
  readonly supersedes: number | null;
  readonly synthetic?: true;
};

function initialDocument(document: Omit<ExploreDocument, "kind" | "version" | "access" | "supersedes" | "retrievedAt" | "knownAt">): VersionSeries<ExploreDocument> {
  return {
    currentVersion: 1,
    versions: [{ ...document, kind: "Document", version: 1, access: "local", supersedes: null, retrievedAt: null, knownAt: null }],
  };
}

export type ExploreEvidenceCatalog = {
  readonly observations: Readonly<Partial<Record<typeof waferShareRef, VersionSeries<WaferObservation>>>>;
  readonly documents: Readonly<Partial<Record<DocumentRef, VersionSeries<ExploreDocument>>>>;
};

export const exploreEvidenceCatalog: ExploreEvidenceCatalog = {
  observations: {
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
        absoluteDenominatorGW: null,
        documentRef: waferDocumentRef,
        documentVersion: 1,
        retrievedAt: null,
        knownAt: null,
        version: 1,
        supersedes: null,
        access: "local",
      }],
    },
  },
  documents: {
    [documentRefs.doe]: initialDocument({
      id: documentRefs.doe,
      sourceRef: "source:doe:seto",
      title: "Crystalline Silicon Photovoltaics Research",
      url: "https://www.energy.gov/cmei/systems/crystalline-silicon-photovoltaics-research",
      claim: "O DOE descreve a cadeia do silício cristalino e distingue as arquiteturas de célula PERC, TOPCon e heterojunção.",
      period: "Visão técnica. Sem série temporal para as afirmações deste recorte.",
      publishedOn: null,
      dateLabel: "Atualização indicada no dossiê NIV-67 · 17 dez. 2025",
      method: "Visão técnica do DOE sobre materiais, etapas de produção e projetos de célula.",
      limits: "Explicação de arquitetura e processo. Resultados comerciais e desempenho de fabricantes exigem evidência própria.",
      rights: "Resumo autoral local e link oficial. Figuras, fotos, marcas e materiais de terceiros ficam restritos.",
    }),
    [documentRefs.feldmann]: initialDocument({
      id: documentRefs.feldmann,
      sourceRef: "source:journal:solmat",
      authors: "Feldmann et al.",
      title: "Passivated rear contacts for high-efficiency n-type Si solar cells",
      url: "https://doi.org/10.1016/j.solmat.2013.09.017",
      claim: "O estudo demonstra a passivação e o transporte de cargas no contato traseiro de células experimentais de silício tipo n.",
      period: "Células experimentais estudadas no artigo.",
      publishedOn: null,
      dateLabel: "Janeiro de 2014 · volume 120",
      method: "Experimento com uma camada de óxido de tunelamento e silício dopado na interface de contato.",
      limits: "Resultado de pesquisa para os dispositivos estudados. Alegações industriais de rendimento, eficiência e durabilidade exigem outras medições.",
      rights: "Resumo autoral local e link DOI. Texto integral, figuras e dados do artigo ficam restritos.",
    }),
    [documentRefs.iea]: initialDocument({
      id: documentRefs.iea,
      sourceRef: "source:iea",
      title: "Energy Technology Perspectives 2026",
      url: "https://www.iea.org/reports/energy-technology-perspectives-2026/supply-chain-risks-and-industrial-competitiveness",
      chartUrl: "https://www.iea.org/data-and-statistics/charts/geographic-concentration-of-supply-chains-for-selected-industrial-products-fossil-fuels-and-clean-energy-technologies-by-region-2024",
      publishedOn: "2026-03-26",
      method: "A IEA estima a participação da capacidade de fabricação localizada na China na capacidade mundial da mesma etapa da cadeia fotovoltaica.",
      limits: "A estimativa cobre a etapa de wafer. Produção efetiva, capacidade de células TOPCon e geração elétrica são medidas distintas. O gráfico público não informa o denominador absoluto em GW e não disponibiliza o CSV.",
      rights: "A IEA indica CC BY 4.0 para o capítulo e o gráfico. Recorte factual em texto da NIVAR para inspeção local. A exibição pública ou para clientes depende do NIV-76. Imagens, dados subjacentes e redistribuição exigem autorização separada.",
    }),
  },
};

export type VersionPin = Readonly<{ ref: string; version: number }>;
export type EvidencePins = { observation?: VersionPin; document?: VersionPin };

export type WaferMeasurement = {
  observation: WaferObservation;
  document: ExploreDocument;
};

type EvidenceFailure = {
  state: "UNRESOLVED" | "RESTRICTED";
  reason: string;
};

export type ExploreSelection = EvidenceFailure | {
  state: "READY";
  pins: EvidencePins;
  measurement?: WaferMeasurement;
  evidence?: { key: EvidenceKey; document: ExploreDocument; source: typeof sourceRegistry[SourceRef] };
};

function unresolved(reason: string): EvidenceFailure {
  return { state: "UNRESOLVED", reason };
}

function resolveRevision<T extends Revision>(series: VersionSeries<T> | undefined, ref: string, version?: number) {
  const requestedVersion = version ?? series?.currentVersion;
  const revisions = series?.versions.filter((item) => item.id === ref && item.version === requestedVersion);
  if (revisions?.length !== 1) return unresolved("A versão solicitada não está disponível.");
  const record = revisions[0];
  if (record.access === "restricted") {
    return { state: "RESTRICTED", reason: "A versão solicitada tem acesso restrito." } satisfies EvidenceFailure;
  }
  return { state: "READY", record } as const;
}

function readPin(params: URLSearchParams, kind: "observation" | "document"): VersionPin | undefined | false {
  const refs = params.getAll(`${kind}_ref`);
  const versions = params.getAll(`${kind}_version`);
  if (refs.length === 0 && versions.length === 0) return undefined;
  const version = Number(versions[0]);
  if (refs.length !== 1 || !refs[0] || versions.length !== 1 ||
      !/^[1-9]\d*$/.test(versions[0]) || !Number.isSafeInteger(version)) return false;
  return { ref: refs[0], version };
}

function observationRefFor(key: ExploreObjectKey | undefined) {
  return key === "pv-wafer" || key === "china" ? exploreObjects[key].observationRef : undefined;
}

export function pinsForObject(key: ExploreObjectKey | undefined, pins: EvidencePins): EvidencePins {
  return {
    observation: pins.observation?.ref === observationRefFor(key) ? pins.observation : undefined,
    document: key && evidenceLinks[key].some(({ key: source }) => documentRefs[source] === pins.document?.ref)
      ? pins.document : undefined,
  };
}

export function resolveExploreSelection(
  key: ExploreObjectKey | undefined,
  params: URLSearchParams,
  catalog = exploreEvidenceCatalog,
): ExploreSelection {
  const observationPin = readPin(params, "observation");
  const documentPin = readPin(params, "document");
  if (observationPin === false || documentPin === false) {
    return unresolved("Informe a referência e uma versão inteira positiva para cada vínculo fixado.");
  }

  const pins = { observation: observationPin, document: documentPin };
  const scopedPins = pinsForObject(key, pins);
  if (observationPin !== scopedPins.observation || documentPin !== scopedPins.document) {
    return unresolved("A referência fixada não pertence a este objeto.");
  }

  const aliases = params.getAll("evidence");
  const requestedEvidence = key && evidenceLinks[key].find((entry) => entry.key === aliases[0]);
  if (aliases.length > 1 || (aliases.length === 1 && !requestedEvidence)) {
    return unresolved("Evidência fora do escopo deste objeto.");
  }
  if (requestedEvidence && documentPin && documentRefs[requestedEvidence.key] !== documentPin.ref) {
    return unresolved("O documento fixado não corresponde à evidência selecionada.");
  }

  let measurement: WaferMeasurement | undefined;
  const obsRef = observationRefFor(key);
  if (obsRef) {
    if (documentPin?.ref === waferDocumentRef && !observationPin) {
      return unresolved("A evidência da métrica exige também a Observation fixada.");
    }
    const observation = resolveRevision(catalog.observations[obsRef], obsRef, observationPin?.version);
    if (observation.state !== "READY") return observation;

    const { documentRef, documentVersion } = observation.record;
    if (documentPin?.ref === documentRef && documentPin.version !== documentVersion) {
      return unresolved("As versões fixadas da Observation e do Document não correspondem.");
    }
    const document = resolveRevision(catalog.documents[documentRef], documentRef, documentVersion);
    if (document.state !== "READY") return document;
    measurement = { observation: observation.record, document: document.record };
  }

  const ref = requestedEvidence ? documentRefs[requestedEvidence.key] : documentPin?.ref as DocumentRef | undefined;
  if (!ref) return { state: "READY", pins, measurement };
  const selectedDocument = ref === waferDocumentRef && measurement
    ? { state: "READY", record: measurement.document } as const
    : resolveRevision(catalog.documents[ref], ref, documentPin?.version);
  if (selectedDocument.state !== "READY") return selectedDocument;

  return {
    state: "READY", pins, measurement,
    evidence: requestedEvidence ? {
      key: requestedEvidence.key,
      document: selectedDocument.record,
      source: sourceRegistry[selectedDocument.record.sourceRef],
    } : undefined,
  };
}
