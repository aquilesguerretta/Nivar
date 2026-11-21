import { reviewCutoff, rightsReviewedOn } from "./model.ts";
import type { Document, DocumentVersion, EvidenceRef, Instrument, Source } from "./model.ts";

function source(
  key: string,
  publisher: string,
  termsUrl: string,
  collection: Source["rights"]["collection"] = "unapproved",
): Source {
  return {
    id: `j3:source:${key}`,
    publisher,
    rights: {
      review: "NIV-74",
      reviewedOn: rightsReviewedOn,
      local: "private-metadata-and-nivar-notes",
      link: "bibliographic-only",
      collection,
      reproduction: "unapproved",
      translation: "unapproved",
      publicDisplay: "unapproved",
      download: "unapproved",
      api: "unapproved",
      termsUrl,
    },
  };
}

const mofcomTerms = "https://www.mofcom.gov.cn/fzlm/wzsm/index.html";
const registerUrl = "https://policy.mofcom.gov.cn/claw/clawContent.shtml?id=102405";
const mofcom = source("mofcom-zh", "Ministério do Comércio da China (MOFCOM)", mofcomTerms);
const mofcomEn = source("mofcom-en", "Ministério do Comércio da China (MOFCOM), edição em inglês", mofcomTerms);
const gazette = source("mofcom-gazette", "Gazeta de Comércio Exterior e Cooperação Econômica (MOFCOM)", mofcomTerms);
const register = source("mofcom-policy-register", "Registro de políticas do MOFCOM", registerUrl, "prohibited");
const doe = source("us-doe", "U.S. Department of Energy", "https://www.energy.gov/web-policies");
const mrs = source("mrs-bulletin", "MRS Bulletin · Rom et al.", "https://creativecommons.org/licenses/by/4.0/");

export function jointAnnouncement(year: number, number: number): Instrument {
  return { issuers: "MOFCOM + GACC", year, number };
}

export function instrumentKey({ issuers, year, number }: Instrument) {
  return `CN/${issuers}/Announcement/${year}/${number}`;
}

export function instrumentLabel({ year, number }: Instrument) {
  return `${number}/${year}`;
}

function reviewedDocument(
  key: string,
  record: Omit<Document, keyof DocumentVersion | "retrievedAt" | "knownAt" | "reviewedThrough">,
): Document {
  return {
    id: `j3:document:${key}`,
    version: 1,
    reviewedThrough: reviewCutoff,
    retrievedAt: null,
    knownAt: null,
    ...record,
  };
}

function announcement(
  instrument: Instrument,
  language: Document["language"],
  record: Omit<Parameters<typeof reviewedDocument>[1], "instrument" | "nativeId" | "language">,
) {
  return reviewedDocument(
    `cn-${instrument.issuers === "GACC" ? "gacc" : "mofcom-gacc"}-${instrument.year}-${instrument.number}-${language}`,
    { ...record, instrument, nativeId: instrumentKey(instrument), language },
  );
}

const aprilInstrument = jointAnnouncement(2025, 18);
const april = announcement(aprilInstrument, "zh-CN", {
  title: "Anúncio 18/2025 · Original em chinês",
  source: mofcom,
  dossierRef: "L01",
  authority: "original",
  url: "https://aqygzj.mofcom.gov.cn/flzc/gzjgfxwj/art/2025/art_f3a1432ba20248eca12ff7b91bc73fda.html",
  issuedOn: "2025-04-04",
  publication: { date: "2025-04-04", time: "18:00", kind: "publication" },
  effective: { from: "2025-04-04" },
});

export const documents = {
  april,
  english: announcement(aprilInstrument, "en", {
    title: "Anúncio 18/2025 · Versão oficial em inglês para referência",
    source: mofcomEn,
    dossierRef: "L02",
    authority: "reference-translation",
    url: "https://english.mofcom.gov.cn/Policies/AnnouncementsOrders/art/2025/art_0dd87cbee7b045bf93fabe6ab2faceee.html",
    issuedOn: "2025-04-04",
    publication: null,
    effective: { from: "2025-04-04" },
    relatesTo: { type: "translation-of", document: documentVersion(april) },
  }),
  register: reviewedDocument("mofcom-register-102405", {
    title: "Anúncio 18/2025 · Registro de políticas do MOFCOM",
    source: register,
    dossierRef: "L03",
    nativeId: "102405",
    language: "zh-CN",
    authority: "register",
    url: registerUrl,
    urlAliases: ["https://policy.mofcom.gov.cn/claw/clawContent.shtml?id=102310"],
    issuedOn: null,
    publication: null,
    effective: null,
  }),
  rationale: reviewedDocument("mofcom-2025-04-04-spokesperson", {
    title: "Posição do porta-voz do MOFCOM sobre o Anúncio 18/2025",
    source: mofcom,
    dossierRef: "L04",
    nativeId: "art_2eb722ef209c4d268dcd1aca8b2abf40",
    language: "zh-CN",
    authority: "issuer-statement",
    url: "https://www.mofcom.gov.cn/xwfb/xwfyrth/art/2025/art_2eb722ef209c4d268dcd1aca8b2abf40.html",
    issuedOn: null,
    publication: { date: "2025-04-04", time: "18:00", kind: "publication" },
    effective: null,
  }),
  faq5: reviewedDocument("mofcom-2025-faq-5", {
    title: "MOFCOM · Perguntas frequentes, edição 5",
    source: mofcom,
    dossierRef: "L06",
    nativeId: "art_d0efa4e7555246b29dfa11cba0bcaf8c",
    language: "zh-CN",
    authority: "issuer-guidance",
    url: "https://www.mofcom.gov.cn/hygq/art/2025/art_d0efa4e7555246b29dfa11cba0bcaf8c.html",
    issuedOn: null,
    publication: { date: "2025-09-16", time: "10:20", kind: "publication" },
    effective: null,
  }),
  questioning: announcement({ issuers: "GACC", year: 2025, number: 123 }, "zh-CN", {
    title: "Anúncio GACC 123/2025 · Questionamento aduaneiro",
    source: gazette,
    dossierRef: "L07",
    authority: "gazette-reprint",
    url: "https://www.mofcom.gov.cn/zcfb/zgdwjjmywg/art/2025/art_33c938c117e54a71847487ee82a07f82.html",
    issuedOn: "2025-06-16",
    publication: { date: "2025-08-19", kind: "gazette-repost" },
    effective: null,
  }),
  suspension: announcement(jointAnnouncement(2025, 70), "zh-CN", {
    title: "Anúncio 70/2025 · Suspensão inicial",
    source: mofcom,
    dossierRef: "L10",
    authority: "original",
    url: "https://www.mofcom.gov.cn/zcfb/blgg/art/2025/art_2ec8b9f2c6404a56b311abc82d87f486.html",
    issuedOn: "2025-11-07",
    publication: { date: "2025-11-07", time: "18:00", kind: "publication" },
    effective: { from: "2025-11-07", through: "2026-11-10" },
  }),
  catalogue: announcement(jointAnnouncement(2025, 91), "zh-CN", {
    title: "Anúncio 91/2025 · Catálogo de licenciamento de 2026",
    source: gazette,
    dossierRef: "L11",
    authority: "gazette-reprint",
    url: "https://www.mofcom.gov.cn/zcfb/zgdwjjmywg/art/2026/art_5f049bc04a094e0cb7ef669a98ee503f.html",
    issuedOn: "2025-12-31",
    publication: { date: "2026-02-06", kind: "gazette-repost" },
    effective: { from: "2026-01-01" },
  }),
  procedure: announcement(jointAnnouncement(2026, 52), "zh-CN", {
    title: "Anúncio 52/2026 · Atualização de procedimentos",
    source: mofcom,
    dossierRef: "L13",
    authority: "original",
    url: "https://www.mofcom.gov.cn/zwgk/zcfb/art/2026/art_bd9c3f79b64e4700bede88d06edac2d4.html",
    issuedOn: "2026-10-19",
    publication: { date: "2026-10-19", time: "15:00", kind: "publication" },
    effective: { from: "2026-10-19" },
    relatesTo: {
      type: "repeals",
      document: { id: "j3:document:cn-gacc-2025-123-zh-CN", version: 1 },
    },
  }),
  continuation: announcement(jointAnnouncement(2026, 58), "zh-CN", {
    title: "Anúncio 58/2026 · Continuação da suspensão",
    source: mofcom,
    dossierRef: "L14",
    authority: "original",
    url: "https://www.mofcom.gov.cn/zcfb/dwmygl/art/2026/art_46a13d76cf7243b7af4394ecbdf13b90.html",
    issuedOn: "2026-11-09",
    publication: { date: "2026-11-09", time: "16:00", kind: "publication" },
    effective: { from: "2026-11-11", through: "2027-01-10" },
  }),
  doe: reviewedDocument("doe-rare-earth-permanent-magnets-2022", {
    title: "Rare Earth Permanent Magnets: Supply Chain Deep Dive Assessment",
    source: doe,
    dossierRef: "T01",
    nativeId: "DOE · Rare Earth Permanent Magnets · 2022-02-24",
    language: "en",
    authority: "technical",
    url: "https://www.energy.gov/sites/default/files/2024-12/Neodymium%2520Magnets%2520Supply%2520Chain%2520Report%2520-%2520Final%5B1%5D.pdf?refid=20251036",
    issuedOn: "2022-02-24",
    publication: null,
    effective: null,
  }),
  rom: reviewedDocument("rom-et-al-2024-10-1557-s43577-024-00743-4", {
    title: "Rom et al. · MRS Bulletin",
    source: mrs,
    dossierRef: "T03",
    nativeId: "10.1557/s43577-024-00743-4",
    language: "en",
    authority: "technical",
    url: "https://doi.org/10.1557/s43577-024-00743-4",
    issuedOn: null,
    publication: { date: "2024-07-02", kind: "publication" },
    effective: null,
  }),
} satisfies Record<string, Document>;

export function documentVersion({ id, version }: DocumentVersion): DocumentVersion {
  return { id, version };
}

export function documentEvidence(record: Document, locator: string): EvidenceRef {
  return { document: documentVersion(record), locator };
}

export function resolveDocument(ref: DocumentVersion) {
  return Object.values(documents).find(({ id, version }) => id === ref.id && version === ref.version);
}