import type { DocumentId, EvidenceRef, SourceId } from "./model.ts";

const sources = {
  "source:fraunhofer-ise": "Fraunhofer ISE",
  "source:wiley": "Wiley",
  "source:eu-pvsec": "EU PVSEC",
  "source:zenodo": "Zenodo",
  "source:cell-press": "Cell Press · Joule",
  "source:iea": "International Energy Agency (IEA)",
  "source:saitama": "Prefeitura de Saitama",
  "source:kaneka": "Kaneka",
  "source:longi": "LONGi",
  "source:doe": "U.S. Department of Energy (DOE)",
} satisfies Record<SourceId, string>;

type Document = Readonly<{
  source: keyof typeof sources;
  title: string;
  locator: string;
  creditedTo: string;
  date: string;
  version: string;
  language: "en" | "ja";
  nativeId?: string;
  url?: `https://${string}`;
  notice: string;
}>;

const ccBy = "CC BY 4.0 para a obra identificada. Materiais de terceiros exigem verificação própria.";

const documents = {
  "document:frontier:ise-oxford-prototype": {
    locator: "Comunicado 04, descrição do protótipo e da medição",
    source: "source:fraunhofer-ise", creditedTo: "Fraunhofer ISE",
    title: "Comunicado sobre o protótipo de módulo Oxford PV–Fraunhofer ISE",
    date: "2024-01-31", version: "2024-01-31", nativeId: "Comunicado 04", language: "en",
    url: "https://www.ise.fraunhofer.de/en/press-media/press-releases/2024/oxford-pv-and-fraunhofer-ise-develop-full-sized-tandem-pv-module-with-record-efficiency-of-25-percent.html",
    notice: "O comunicado contém fotografia creditada separadamente.",
  },
  "document:frontier:chojniak-3928": {
    locator: "Métodos e §10.3, medição no ponto de máxima potência",
    source: "source:wiley", creditedTo: "David Chojniak et al.",
    title: "Traceable Efficiency Determination of Large-Area Perovskite on Silicon Tandem Modules",
    date: "2025-05-21", version: "version-of-record", nativeId: "10.1002/pip.3928", language: "en",
    url: "https://doi.org/10.1002/pip.3928", notice: ccBy,
  },
  "document:frontier:norton-eu-pvsec": {
    locator: "Relato da campanha nos anais de 2024",
    source: "source:eu-pvsec", creditedTo: "Norton et al.",
    title: "One-Year Outdoor Testing of 4T Perovskite/Si PV Modules",
    date: "2024-09-23 a 2024-09-27 (conferência)", version: "eu-pvsec-2024",
    nativeId: "10.4229/EUPVSEC2024/2DO.9.5", language: "en",
    url: "https://doi.org/10.4229/EUPVSEC2024/2DO.9.5",
    notice: "A licença do depósito Zenodo refere-se à versão depositada.",
  },
  "document:frontier:norton-zenodo": {
    locator: "Versão 1, §§2.1–2.2 e 4",
    source: "source:zenodo", creditedTo: "Norton et al.",
    title: "One-Year Outdoor Testing of 4T Perovskite/Si PV Modules",
    date: "2026-06-25", version: "v1", nativeId: "Zenodo 20841591", language: "en",
    url: "https://zenodo.org/records/20841591", notice: ccBy,
  },
  "document:frontier:hanser-202500835": {
    locator: "Figura 3, métodos e suplemento S2",
    source: "source:wiley", creditedTo: "Mario Hanser et al.",
    title: "Fully-Textured Perovskite/Silicon Tandem Solar Cells Exceeding 30% Efficiency on Both Side Tunnel Oxide Passivating Contacted Bottom Cells",
    date: "2025-11-24", version: "version-of-record", nativeId: "10.1002/solr.202500835", language: "en",
    url: "https://doi.org/10.1002/solr.202500835", notice: ccBy,
  },
  "document:frontier:green-v68": {
    locator: "Tabela 4, entrada da célula tandem LONGi medida pela ESTI em fev 2026",
    source: "source:cell-press", creditedTo: "Martin A. Green et al.",
    title: "Solar cell efficiency tables: Version 68",
    date: "2026-05-28 (online) · 2026-07-15 (fascículo)", version: "v68",
    nativeId: "10.1016/j.joule.2026.102494", language: "en",
    url: "https://doi.org/10.1016/j.joule.2026.102494",
    notice: "CC BY-NC 4.0. A tabela e as figuras ficam restritas no produto.",
  },
  "document:frontier:iea-innovation-2026": {
    locator: "p. 53, avaliação do desenvolvimento TOPCon de 30,6% destacado em 2025",
    source: "source:iea", creditedTo: "IEA (2026)",
    title: "The State of Energy Innovation 2026",
    date: "2026-02-17", version: "2026", language: "en",
    url: "https://www.iea.org/reports/the-state-of-energy-innovation-2026", notice: ccBy,
  },
  "document:frontier:saitama-demonstration": {
    locator: "Confirmação municipal do início e registro da apresentação",
    source: "source:saitama", creditedTo: "Prefeitura de Saitama",
    title: "Registro municipal do início da demonstração fotovoltaica tandem (original em japonês)",
    date: "2026-03-27 (atualização)", version: "2026-03-27", nativeId: "C128293", language: "ja",
    url: "https://www.city.saitama.lg.jp/001/009/015/0066/2/p128293.html",
    notice: "Síntese em português de autoria da NIVAR. Direitos sobre fotos municipais não estabelecidos para o produto.",
  },
  "document:frontier:kaneka-demonstration": {
    locator: "Configuração externa, célula inferior HJT, contagem e dimensões",
    source: "source:kaneka", creditedTo: "Kaneka",
    title: "Kaneka and Saitama City to Launch Outdoor Demonstration Project of Perovskite Tandem Solar Modules",
    date: "2026-03-18", version: "2026-03-18", nativeId: "ennr2603181", language: "en",
    url: "https://www.kaneka.co.jp/en/topics/news/2026/ennr2603181.html",
    notice: "Comunicado da fabricante. Direitos sobre fotos e anexos não estabelecidos para o produto.",
  },
  "document:frontier:longi-july-claim": {
    locator: "Anúncio em 14 jul; publicação em 15 jul 2026",
    source: "source:longi", creditedTo: "LONGi",
    title: "Comunicado da LONGi sobre a célula tandem de 35,5%",
    date: "2026-07-15", version: "2026-07-15", language: "en",
    nativeId: "crystalline-silicon-perovskite-tandem-solar-cell-new-world-efficiency-2026",
    notice: "Referência bibliográfica. Link retido por condições de autorização do emissor (NIV-74).",
  },
  "document:frontier:doe-perovskite": {
    locator: "Fundamentos de células solares de perovskita e tandems",
    source: "source:doe", creditedTo: "U.S. Department of Energy",
    title: "Perovskite Solar Cells",
    date: "2026-07-22 (atualização documentada)", version: "niv72-reference", language: "en",
    url: "https://www.energy.gov/cmei/systems/perovskite-solar-cells",
    notice: "Texto governamental dos EUA. Direitos de imagens e outros materiais de terceiros são específicos de cada peça.",
  },
} satisfies Record<DocumentId, Document>;

export function evidence<K extends keyof typeof documents>(documentId: K): EvidenceRef {
  return { documentId, version: documents[documentId].version, locator: documents[documentId].locator };
}

export type EvidenceChannel = "local" | "preview" | "production" | "client" | "export" | "api";
export type EvidenceOutput = "summary-and-metadata" | "reproduction" | "certificate" | "raw-document";

export function readEvidence(
  ref: EvidenceRef,
  channel: EvidenceChannel,
  output: EvidenceOutput,
) {
  if (channel !== "local" || output !== "summary-and-metadata") return undefined;
  if (!Object.hasOwn(documents, ref.documentId)) return undefined;
  const document: Document = documents[ref.documentId as keyof typeof documents];
  if (document.version !== ref.version || document.locator !== ref.locator) return undefined;
  return {
    ...document,
    sourceName: sources[document.source],
    rightsRef: `rights:candidate:niv74:${ref.documentId}`,
    reviewedOn: "2026-11-18",
  };
}
