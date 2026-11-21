import { documentEvidence, documents, documentVersion, instrumentKey, instrumentLabel, jointAnnouncement } from "./documents.ts";
import { reviewCutoff } from "./model.ts";
import type { CandidateId, Claim, Country, Document, EffectivePeriod, Event, Instrument, TechnologyElement } from "./model.ts";

export const china = { id: "j3:country:CHN", kind: "Country", iso3: "CHN" } satisfies Country;

export const material = {
  id: "j3:element:dy-ndfeb",
  kind: "TechnologyElement",
  role: "material",
  composition: "Dy-containing NdFeB",
  forms: ["magnet", "magnetic-powder"],
} satisfies TechnologyElement;

export const applications = {
  id: "j3:application:permanent-magnet-machines",
  motor: { id: "j3:variant:pmsm", name: "Motor síncrono de ímã permanente (PMSM)" },
  generator: { id: "j3:variant:pmsg", name: "Gerador síncrono de ímã permanente (PMSG)" },
  primaryTechnologyCandidate: "j3:technology:electrical-machines",
} as const;

function claim(key: string, details: Omit<Claim, "id" | "version">): Claim {
  return { id: `j3:claim:${key}`, version: 1, ...details };
}

function legalEvent(key: string, record: Document, text: string, qualification: string, locator: string): Event {
  if (!record.issuedOn) throw new Error("A timeline action requires a verified issue date");
  const id = `j3:event:${key}` as const;
  return {
    id,
    version: 1,
    category: "trade-policy",
    topic: "critical-minerals",
    occurredOn: record.issuedOn,
    jurisdiction: china.id,
    document: documentVersion(record),
    claim: claim(key, {
      kind: "observed_fact", subjectId: id, text, qualification, evidence: [documentEvidence(record, locator)],
    }),
  };
}

const aprilEventKey = "cn-2025-04-04-export-licensing";
const aprilEventId = `j3:event:${aprilEventKey}` as const;
const itemCode = "1C905.a.4";
const itemEvidence = documentEvidence(documents.april, itemCode);
export const controlledItem = {
  materialId: material.id,
  itemCode,
  evidence: itemEvidence,
  customsReference: null,
};

export const suspensionTargets: readonly Instrument[] = [
  ...[55, 56, 57, 58].map((number) => jointAnnouncement(2025, number)),
  { issuers: "MOFCOM", year: 2025, number: 61 },
  { issuers: "MOFCOM", year: 2025, number: 62 },
];

const suspensionNotices = [documents.suspension, documents.continuation] as const;

function describesSuspension(record: Document): record is Document & { instrument: Instrument; effective: Required<EffectivePeriod> } {
  return !!record.instrument && !!record.effective?.through;
}

export function suspensionAt(instrument: Instrument, date: string) {
  const reviewedThrough = reviewCutoff.slice(0, 10);
  const dateValue = Date.parse(date);
  if (!Number.isFinite(dateValue) || new Date(dateValue).toISOString().slice(0, 10) !== date || date > reviewedThrough) return undefined;
  if (!suspensionTargets.some((target) => instrumentKey(target) === instrumentKey(instrument))) return undefined;
  return suspensionNotices.filter(describesSuspension).find(({ effective }) =>
    date >= effective.from && date <= effective.through,
  );
}

export const suspensionTargetLabel = suspensionTargets.map(instrumentLabel).join(", ");
export const legalStatusLimit = "A situação jurídica atual exige nova verificação humana. A revisão histórica não determina a classificação de um produto ou embarque.";

export const claims = {
  registry: claim("dated-register-status", {
    kind: "observed_fact", subjectId: aprilEventId,
    text: "No corte da revisão, o registro do MOFCOM indicava o Anúncio 18/2025 como vigente.",
    qualification: "O próprio registro é informativo e ressalva completude, atualização e aplicabilidade. " + legalStatusLimit,
    evidence: [documentEvidence(documents.register, "Campo de situação do registro 102405")],
  }),
  rationale: claim("issuer-rationale", {
    kind: "actor_statement", subjectId: aprilEventId,
    text: "O porta-voz do MOFCOM atribuiu a medida a objetivos de segurança nacional e não proliferação.",
    qualification: "Posição atribuída ao MOFCOM. Efeitos econômicos ou empresariais não foram estabelecidos.",
    evidence: [documentEvidence(documents.rationale, "Resposta do porta-voz de 4 abr. 2025")],
  }),
  item: claim("controlled-dy-ndfeb", {
    kind: "observed_fact", subjectId: material.id,
    text: "O item 1C905.a.4 abrange material para ímã permanente NdFeB contendo disprósio (Dy), nas formas de ímã ou pó magnético.",
    qualification: "O subitem original não indica código aduaneiro de referência. A composição e a forma delimitam a leitura do item.",
    evidence: [itemEvidence],
  }),
  application: claim("material-application", {
    kind: "nivar_analysis", subjectId: applications.id,
    text: "Em certas formulações de NdFeB, o disprósio aumenta a resistência do ímã à desmagnetização em temperaturas elevadas. Ímãs acabados podem integrar motores de tração e geradores eólicos de ímã permanente. O pó magnético entra na fabricação.",
    qualification: "O uso depende do projeto e da composição. O vínculo técnico não classifica uma máquina completa nem identifica um fornecedor ou efeito comercial.",
    evidence: [
      documentEvidence(documents.doe, "pp. 2–3 e 19 (paginação impressa)"),
      documentEvidence(documents.rom, "Discussão de materiais magnéticos para motores de veículos elétricos"),
    ],
  }),
  faq5: claim("faq5-scope", {
    kind: "actor_statement", subjectId: applications.id,
    text: "Segundo a FAQ 5 do MOFCOM, os conjuntos de rotor e estator processados descritos na orientação geralmente ficam fora do escopo do Anúncio 18/2025.",
    qualification: "Orientação atribuída ao emissor e limitada aos conjuntos descritos. " + legalStatusLimit,
    evidence: [documentEvidence(documents.faq5, "Orientação sobre conjuntos processados de rotor e estator")],
  }),
  jurisdiction: claim("issuing-jurisdiction", {
    kind: "observed_fact", subjectId: china.id,
    text: "A China é a jurisdição da medida de licenciamento. O MOFCOM e a Administração Geral das Alfândegas da China (GACC) emitiram o Anúncio 18/2025.",
    qualification: "O vínculo identifica a jurisdição do ato. Local de fabricação, empresa afetada e efeito econômico não foram estabelecidos.",
    evidence: [documentEvidence(documents.april, "Identificação e assinatura dos emissores")],
  }),
} satisfies Record<string, Claim>;

export const timeline = {
  april: legalEvent(aprilEventKey, documents.april,
    "O MOFCOM e a GACC passaram a exigir licença de exportação para itens especificados em sete famílias de terras raras.",
    "A vigência começou na publicação. Os requisitos dependem dos itens enumerados no ato.",
    "Lista de itens controlados e cláusula de vigência"),
  questioning: legalEvent("cn-2025-06-16-customs-questioning", documents.questioning,
    "A GACC emitiu um ato sobre o procedimento de questionamento aduaneiro para exportações de itens de uso duplo.",
    "A Gazeta republicou o ato em agosto. O Anúncio 52/2026 revogou esse procedimento.",
    "Identificação e objeto do anúncio"),
  suspension: legalEvent("cn-2025-11-07-suspension", documents.suspension,
    "O Anúncio 70/2025 suspendeu seis atos de outubro de 2025.",
    "A lista de suspensão não inclui o Anúncio 18/2025.",
    "Parágrafo operativo, lista de atos e prazo"),
  catalogue: legalEvent("cn-2025-12-31-licensing-catalogue", documents.catalogue,
    "O catálogo de licenciamento de 2026 manteve as famílias de códigos 1C902–1C908.",
    "O Anúncio 91/2025 substituiu o catálogo 67/2024. O catálogo não substitui o Anúncio 18/2025.",
    "Catálogo anexo, pp. 54–58 (paginação impressa); cláusula final"),
  procedure: legalEvent("cn-2026-10-19-customs-procedure", documents.procedure,
    "O Anúncio 52/2026 atualizou os procedimentos e revogou expressamente o Anúncio GACC 123/2025.",
    "A revogação se refere ao procedimento aduaneiro anterior. O Anúncio 18/2025 é um ato distinto.",
    "Cláusula final, vigência e revogação"),
  continuation: legalEvent("cn-2026-11-09-continued-suspension", documents.continuation,
    "O Anúncio 58/2026 prorrogou a suspensão dos mesmos seis atos de 2025.",
    "O Anúncio 18/2025 está fora dessa lista. O fim do intervalo publicado exige nova verificação humana.",
    "Parágrafo operativo, lista de atos e período de continuação"),
};

export type TimelineKey = keyof typeof timeline;

export const relationshipLabels = {
  officialRecord: "Registro oficial do ato",
  controlledItem: "Item legalmente controlado",
  materialUse: "Aplicação técnica do material",
  jurisdiction: "Jurisdição do ato",
} as const;

export const journeyRelations = [
  { type: "officialRecord", from: timeline.april.id, to: documents.april.id, claim: timeline.april.claim },
  { type: "controlledItem", from: documents.april.id, to: material.id, claim: claims.item },
  { type: "materialUse", from: material.id, to: applications.id, claim: claims.application },
  { type: "jurisdiction", from: applications.id, to: china.id, claim: claims.jurisdiction },
] satisfies ReadonlyArray<{
  type: keyof typeof relationshipLabels;
  from: CandidateId;
  to: CandidateId;
  claim: Claim;
}>;