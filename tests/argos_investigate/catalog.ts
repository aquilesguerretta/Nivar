import { exploreObjects, formatWaferShare, waferShareRef } from "../../src/lib/argos/globalExplore.ts";
import type { ExploreObjectKey } from "../../src/lib/argos/globalExplore.ts";
import { exploreEvidenceCatalog, resolveExploreSelection } from "../../src/lib/argos/globalExploreEvidence.ts";
import type { EvidenceKey } from "../../src/lib/argos/globalExploreEvidence.ts";
import { applications, claims, legalStatusLimit, material, timeline } from "../../src/features/argos-current-energy/case.ts";
import { resolveDocument } from "../../src/features/argos-current-energy/documents.ts";
import type { Claim } from "../../src/features/argos-current-energy/model.ts";
import { contextEvidence, milestones } from "../../src/features/argos-research-frontier/milestones.ts";
import { tandem } from "../../src/features/argos-research-frontier/model.ts";
import type { EvidenceRef } from "../../src/features/argos-research-frontier/model.ts";
import { metricValue } from "../../src/features/argos-research-frontier/readModel.ts";
import { readEvidence as frontierEvidence } from "../../src/features/argos-research-frontier/sources.ts";
import type { EvidenceRevision, EvidenceSeries, InvestigateCatalog, InvestigateObject } from "../../src/features/argos_investigate/reading.ts";

const solar = exploreObjects["solar-pv"];
const silicon = exploreObjects["c-si"];
const topcon = exploreObjects.topcon;
const wafer = exploreObjects["pv-wafer"];
const china = exploreObjects.china;
const event = timeline.april;
const readings = new Map<string, EvidenceSeries>();

function addSeries(currentVersion: string, revisions: readonly EvidenceRevision[]) {
  const ref = revisions[0].ref;
  if (readings.has(ref)) throw new Error(`Referência duplicada no fixture: ${ref}`);
  readings.set(ref, { currentVersion, revisions });
  return ref;
}

function j1Reading(key: ExploreObjectKey, sourceKey: EvidenceKey, ref: string, heading: string, paragraphs: readonly string[]) {
  const source = resolveExploreSelection(key, new URLSearchParams({ evidence: sourceKey }));
  if (source.state !== "READY" || !source.evidence) throw new Error(`Referência J1 indisponível: ${ref}`);
  const { document, source: publisher } = source.evidence;
  const version = String(document.version);
  return addSeries(version, [{
    ref, version, documentRef: document.id, documentVersion: version,
    access: "private-summary-and-metadata", heading, paragraphs, limit: document.limits,
    document: {
      source: { id: document.sourceRef, name: publisher.publisher },
      title: document.title, publication: document.publishedOn ?? document.dateLabel ?? null,
      retrievedAt: document.retrievedAt, knownAt: document.knownAt, rights: document.rights,
      citation: { mode: "link", url: document.url },
    },
  }]);
}

const solarReading = j1Reading("solar-pv", "doe", "claim:investigate:solar-pv", "Da luz à eletricidade",
  [solar.summary, "O silício cristalino é uma das famílias de dispositivos fotovoltaicos. A arquitetura da célula e as etapas de fabricação são dimensões diferentes da tecnologia."]);
const siliconReading = j1Reading("c-si", "doe", "claim:investigate:c-si", "Silício como material absorvedor",
  [silicon.summary, "Na cadeia descrita pelo DOE, corta-se o lingote em lâminas de silício. Cada lâmina passa pelo processamento que dá origem à célula."]);
const topconReading = j1Reading("topcon", "doe", "claim:investigate:topcon", "O contato passivado na célula",
  [topcon.summary, "O contato emprega uma camada fina de óxido e silício dopado. O wafer pertence à cadeia anterior ao processamento da célula. A mesma etapa de fabricação também atende outras arquiteturas de silício cristalino."]);
const feldmannReading = j1Reading("topcon", "feldmann", "claim:investigate:passivated-contact-experiment", "A demonstração em laboratório",
  ["Feldmann e coautores estudaram o contato traseiro passivado em células experimentais de silício tipo n. O artigo documenta a estrutura do contato e as condições em que os autores investigaram o transporte de cargas."]);
const waferReading = j1Reading("pv-wafer", "doe", "claim:investigate:wafer", "Do lingote à lâmina",
  [wafer.summary, "O corte do lingote precede o processamento elétrico da célula. A estimativa abaixo se refere à capacidade instalada na etapa de fabricação dessa lâmina."]);

const waferSeries = exploreEvidenceCatalog.observations[waferShareRef];
if (!waferSeries) throw new Error("Observação J1 indisponível no fixture");
const waferFact = addSeries(String(waferSeries.currentVersion), waferSeries.versions.map((item): EvidenceRevision => {
  const pin = { ref: item.id, version: String(item.version), documentRef: item.documentRef, documentVersion: String(item.documentVersion) };
  const source = resolveExploreSelection("pv-wafer", new URLSearchParams({
    evidence: "iea", observation_ref: pin.ref, observation_version: pin.version,
    document_ref: pin.documentRef, document_version: pin.documentVersion,
  }));
  if (source.state !== "READY") return { ...pin, access: source.state === "RESTRICTED" ? "restricted" : "unresolved" };
  if (!source.measurement || !source.evidence) return { ...pin, access: "unresolved" };
  const { observation, document } = source.measurement;
  return {
    ...pin, access: "private-summary-and-metadata", heading: "Capacidade de fabricação de wafers",
    paragraphs: [
      `Segundo a IEA, ${formatWaferShare(observation)} da capacidade mundial de fabricação de wafers fotovoltaicos estava localizada na China no ano de referência ${observation.referenceYear}.`,
      document.method,
    ],
    limit: document.limits,
    document: {
      source: { id: document.sourceRef, name: source.evidence.source.publisher },
      title: document.title, publication: document.publishedOn,
      retrievedAt: observation.retrievedAt, knownAt: observation.knownAt, rights: document.rights,
      citation: { mode: "link", url: document.url },
    },
  };
}));

function j3Reading(claim: Claim, heading: string, extraLimit = "") {
  const version = String(claim.version);
  const evidence = claim.evidence[0];
  const record = resolveDocument(evidence.document);
  const pin = { ref: claim.id, version, documentRef: evidence.document.id, documentVersion: String(evidence.document.version) };
  if (!record || record.source.rights.local !== "private-metadata-and-nivar-notes") {
    return addSeries(version, [{ ...pin, access: "restricted" }]);
  }
  return addSeries(version, [{
    ...pin, access: "private-summary-and-metadata", heading,
    paragraphs: [claim.text], limit: [claim.qualification, extraLimit, `Revisão histórica com corte em ${record.reviewedThrough}.`].filter(Boolean).join(" "),
    document: {
      source: { id: record.source.id, name: record.source.publisher }, title: record.title,
      publication: record.publication?.date ?? null, language: record.language,
      retrievedAt: record.retrievedAt, knownAt: record.knownAt, reviewCutoff: record.reviewedThrough,
      locator: evidence.locator,
      rights: "NIV-74 · Resumo autoral e metadados para consulta privada. Reprodução, download, API e publicação externa sem aprovação.",
      citation: { mode: "bibliographic" },
    },
  }]);
}

const eventFact = j3Reading(event.claim, "O ato de 4 de abril de 2025", legalStatusLimit);
const itemFact = j3Reading(claims.item, "Ímãs e pós magnéticos com disprósio", legalStatusLimit);
const jurisdiction = j3Reading(claims.jurisdiction, "Jurisdição do anúncio de 2025", legalStatusLimit);
const laterNotice = j3Reading(timeline.continuation.claim, "A prorrogação de 2026", legalStatusLimit);
const application = j3Reading({
  ...claims.application,
  text: "O estudo técnico do DOE descreve a função do disprósio em certas formulações de ímãs NdFeB e o uso desses materiais em máquinas de ímã permanente.",
}, "Uso técnico em máquinas elétricas");

function j4Revision(ref: string, version: string, evidence: EvidenceRef, heading: string, paragraphs: readonly string[], limit: string, knownAt: string | null = null): EvidenceRevision {
  const pin = { ref, version, documentRef: evidence.documentId, documentVersion: evidence.version };
  const record = frontierEvidence(evidence, "local", "summary-and-metadata");
  if (!record) return { ...pin, access: "restricted" };
  return {
    ...pin, access: "private-summary-and-metadata", heading, paragraphs, limit,
    document: {
      source: { id: record.source, name: record.sourceName }, title: record.title,
      publication: record.date, language: record.language, locator: evidence.locator,
      retrievedAt: null, knownAt, rights: `NIV-74 · Resumo e metadados para revisão privada. ${record.notice}`,
      citation: record.url ? { mode: "link", url: record.url } : { mode: "bibliographic" },
    },
  };
}

const tandemReading = addSeries(contextEvidence.version, [j4Revision(
  contextEvidence.documentId, contextEvidence.version, contextEvidence, "Duas junções, duas faixas de luz",
  ["A célula tandem combina uma junção de perovskita com uma de silício. Cada junção aproveita faixas distintas do espectro solar.",
    "Os marcos do acervo descrevem dispositivos, áreas de medição e ensaios específicos. A leitura começa pelo tipo de dispositivo e pelas condições das medições."],
  "Os resultados de célula e de módulo são incomparáveis como desempenho comercial. O estágio de implantação requer evidência própria.",
)]);

const restrictedTable = "document:frontier:green-v68:table-4";
addSeries("v68", [{
  ref: restrictedTable, version: "v68", documentRef: "document:frontier:green-v68", documentVersion: "v68", access: "restricted",
}]);

const frontierObjects: InvestigateObject[] = [];
for (const milestone of milestones) {
  if (!["milestone:frontier:ise-oxford-prototype", "milestone:frontier:ise-topcon-research", "milestone:frontier:longi-esti-cell"].includes(milestone.id)) continue;
  const fact = addSeries(milestone.versions[0].version, milestone.versions.map((observation) =>
    j4Revision(observation.id, observation.version, observation.evidence[0], "O que o ensaio estabeleceu", [
      milestone.device.description,
      `${observation.reporter} reportou ${observation.metrics.map(metricValue).join(" e ")}. ${observation.area?.description ?? ""}`,
      ...(observation.observedPeriod ? [`Período do ensaio: ${observation.observedPeriod}.`] : []),
      ...(observation.measurer ? [`Medição atribuída a ${observation.measurer}.`] : []),
      ...(observation.setup ? [observation.setup.details] : []),
    ], observation.limitations, observation.knownOn),
  ));
  frontierObjects.push({
    id: milestone.id, title: milestone.title, kind: "ResearchMilestone",
    aliases: ["pesquisa tandem perovskita silício", ...(milestone.device.silicon === "TOPCon" ? ["TOPCon"] : [])],
    evidence: milestone.id === "milestone:frontier:longi-esti-cell" ? [fact, restrictedTable] : [fact],
    relations: [{ predicate: "Variante investigada", target: tandem, evidence: fact }],
  });
}

export const catalog: InvestigateCatalog = {
  evidence: readings,
  objects: [
    { ...solar, title: solar.name, evidence: [solarReading], relations: [
      { predicate: "Família fotovoltaica", target: silicon.id, evidence: solarReading },
      { predicate: "Variante em pesquisa", target: tandem, evidence: tandemReading },
    ] },
    { ...silicon, title: silicon.name, evidence: [siliconReading, topconReading], relations: [
      { predicate: "Tecnologia de origem", target: solar.id, evidence: siliconReading },
      { predicate: "Arquitetura de célula", target: topcon.id, evidence: topconReading },
    ] },
    { ...topcon, title: topcon.name, evidence: [topconReading, feldmannReading],
      imagePlaceholder: "Espaço para ilustração autoral do contato de uma célula TOPCon.",
      relations: [
        { predicate: "Variante de origem", target: silicon.id, evidence: topconReading },
        { predicate: "Etapa anterior da cadeia", target: wafer.id, evidence: topconReading },
      ] },
    { ...wafer, title: wafer.name, aliases: [...wafer.aliases, "China wafers 2024"], evidence: [waferFact, waferReading],
      imagePlaceholder: "Espaço para fotografia licenciada de uma lâmina fotovoltaica.",
      relations: [
        { predicate: "Localização da capacidade", target: china.id, evidence: waferFact },
        { predicate: "Arquitetura de célula relacionada", target: topcon.id, evidence: topconReading },
      ] },
    { ...china, title: china.name, aliases: [...china.aliases, "China wafers 2024", "j3:country:CHN"], evidence: [waferFact, jurisdiction],
      relations: [
        { predicate: "Etapa de fabricação medida", target: wafer.id, evidence: waferFact },
        { predicate: "Ato de jurisdição chinesa", target: event.id, evidence: jurisdiction },
      ] },
    { id: event.id, kind: "Event", title: "Anúncio 18/2025 do MOFCOM e da GACC",
      aliases: ["evento mofcom terras raras licenciamento exportação"], evidence: [eventFact, laterNotice, itemFact, jurisdiction],
      imagePlaceholder: "Espaço para fotografia licenciada ligada à cadeia de terras raras.",
      relations: [
        { predicate: "Item legalmente controlado", target: material.id, evidence: itemFact },
        { predicate: "Jurisdição do ato", target: china.id, evidence: jurisdiction },
      ] },
    { id: material.id, kind: "TechnologyElement", title: "NdFeB com disprósio", aliases: ["ímas pó magnético terras raras 1C905.a.4"],
      evidence: [itemFact, application],
      relations: [
        { predicate: "Instrumento de origem", target: event.id, evidence: itemFact },
        { predicate: "Aplicação técnica do material", target: applications.motor.id, evidence: application },
      ] },
    { id: applications.motor.id, kind: "TechnologyVariant", title: applications.motor.name, aliases: ["motor pmsm"],
      evidence: [application], relations: [{ predicate: "Material magnético", target: material.id, evidence: application }] },
    { id: tandem, kind: "TechnologyVariant", title: "Tandem perovskita–silício", aliases: ["pesquisa tandem fotovoltaica"],
      evidence: [tandemReading],
      imagePlaceholder: "Espaço para ilustração autoral das duas junções de uma célula tandem.",
      relations: [
        { predicate: "Tecnologia de origem", target: solar.id, evidence: tandemReading },
        ...frontierObjects.map((object) => ({ predicate: "Marco da variante", target: object.id, evidence: object.evidence[0] })),
      ] },
    ...frontierObjects,
  ],
};
