export const reviewCutoff = "2026-11-18T04:15:59Z";
export const rightsReviewedOn = "2026-11-18"; // NIV-74 review date in America/New_York.

export type CandidateId = `j3:${string}`;
export type DateValue = `${number}-${number}-${number}`;
export type DocumentVersion = { readonly id: CandidateId; readonly version: number };
export type Issuers = "MOFCOM + GACC" | "MOFCOM" | "GACC";
export type Instrument = {
  readonly issuers: Issuers;
  readonly year: number;
  readonly number: number;
};
export type EffectivePeriod = {
  readonly from: DateValue;
  readonly through?: DateValue;
};

export type Source = {
  readonly id: CandidateId;
  readonly publisher: string;
  readonly rights: {
    readonly review: "NIV-74";
    readonly reviewedOn: DateValue;
    readonly local: "private-metadata-and-nivar-notes";
    readonly link: "bibliographic-only";
    readonly collection: "prohibited" | "unapproved";
    readonly reproduction: "unapproved";
    readonly translation: "unapproved";
    readonly publicDisplay: "unapproved";
    readonly download: "unapproved";
    readonly api: "unapproved";
    readonly termsUrl: string;
  };
};

export type Document = DocumentVersion & {
  readonly title: string;
  readonly source: Source;
  readonly dossierRef: string;
  readonly language: "zh-CN" | "en";
  readonly authority: "original" | "gazette-reprint" | "reference-translation" | "register" | "issuer-guidance" | "issuer-statement" | "technical";
  readonly nativeId: string;
  readonly instrument?: Instrument;
  readonly url: string;
  readonly urlAliases?: readonly string[];
  readonly issuedOn: DateValue | null;
  readonly publication: {
    readonly date: DateValue;
    readonly time?: string;
    readonly kind: "publication" | "gazette-repost";
  } | null;
  readonly effective: EffectivePeriod | null;
  readonly reviewedThrough: typeof reviewCutoff;
  readonly retrievedAt: string | null;
  readonly knownAt: string | null;
  readonly relatesTo?: { readonly type: "translation-of" | "repeals"; readonly document: DocumentVersion };
};

export type EvidenceRef = {
  readonly document: DocumentVersion;
  readonly locator: string;
};

export type Claim = {
  readonly id: CandidateId;
  readonly version: number;
  readonly kind: "observed_fact" | "actor_statement" | "nivar_analysis";
  readonly subjectId: CandidateId;
  readonly text: string;
  readonly qualification: string;
  readonly evidence: readonly [EvidenceRef, ...EvidenceRef[]];
};

export type Event = {
  readonly id: CandidateId;
  readonly version: number;
  readonly category: "trade-policy";
  readonly topic: "critical-minerals";
  readonly occurredOn: DateValue;
  readonly jurisdiction: CandidateId;
  readonly document: DocumentVersion;
  readonly claim: Claim;
};

export type TechnologyElement = {
  readonly id: CandidateId;
  readonly kind: "TechnologyElement";
  readonly role: "material";
  readonly composition: "Dy-containing NdFeB";
  readonly forms: readonly ["magnet", "magnetic-powder"];
};

export type Country = {
  readonly id: CandidateId;
  readonly kind: "Country";
  readonly iso3: "CHN";
};