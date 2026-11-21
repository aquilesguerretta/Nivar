export const objectKinds = {
  Technology: "Tecnologias",
  TechnologyVariant: "Variantes",
  TechnologyElement: "Materiais e componentes",
  Country: "Países",
  Event: "Eventos",
  ResearchMilestone: "Marcos de pesquisa",
} as const;

export type EvidencePin = Readonly<{
  ref: string;
  version: string;
  documentRef: string;
  documentVersion: string;
}>;

type DocumentaryReference = {
  source: { id: string; name: string };
  title: string;
  publication: string | null;
  language?: string;
  locator?: string;
  retrievedAt: string | null;
  knownAt: string | null;
  reviewCutoff?: string;
  rights: string;
  citation: { mode: "link" | "bibliographic"; url?: string };
};

type LocalReading = {
  access: "private-summary-and-metadata";
  heading: string;
  paragraphs: readonly string[];
  limit: string;
  document: DocumentaryReference;
};

export type EvidenceRevision = EvidencePin & (LocalReading | { access: "restricted" | "unresolved" });
export type ReadableRevision = EvidencePin & LocalReading;
export type EvidenceSeries = {
  currentVersion: string;
  revisions: readonly EvidenceRevision[];
};

export type InvestigateObject = {
  id: string;
  kind: keyof typeof objectKinds;
  title: string;
  aliases: readonly string[];
  evidence: readonly string[];
  relations: readonly { predicate: string; target: string; evidence: string }[];
  imagePlaceholder?: string;
};

export type InvestigateCatalog = {
  objects: readonly InvestigateObject[];
  evidence: ReadonlyMap<string, EvidenceSeries>;
};

export type ReadingResult =
  | { state: "ready"; revision: ReadableRevision; historical: boolean }
  | { state: "restricted" | "unresolved" };

function resolveRevision(catalog: InvestigateCatalog, ref: string, pin?: EvidencePin): ReadingResult {
  const series = catalog.evidence.get(ref);
  const matches = series?.revisions.filter((entry) => entry.ref === ref && entry.version === (pin?.version ?? series.currentVersion));
  if (matches?.length !== 1) return { state: "unresolved" };
  const revision = matches[0];
  if (pin && (pin.documentRef !== revision.documentRef || pin.documentVersion !== revision.documentVersion)) {
    return { state: "unresolved" };
  }
  if (revision.access === "restricted") return { state: "restricted" };
  if (revision.access !== "private-summary-and-metadata") return { state: "unresolved" };
  return { state: "ready", revision, historical: revision.version !== series?.currentVersion };
}

export function readEvidence(
  catalog: InvestigateCatalog, object: InvestigateObject, ref: string, pin?: EvidencePin,
): ReadingResult {
  if (!object.evidence.includes(ref) || (pin && pin.ref !== ref)) return { state: "unresolved" };
  return resolveRevision(catalog, ref, pin);
}

export function supportedRelations(catalog: InvestigateCatalog, object: InvestigateObject, pin?: EvidencePin) {
  return object.relations.flatMap(({ predicate, target, evidence }) => {
    const relationPin = pin?.ref === evidence ? pin : undefined;
    const linked = catalog.objects.find(({ id }) => id === target);
    return linked && resolveRevision(catalog, evidence, relationPin).state === "ready" ? [{ predicate, linked }] : [];
  });
}

export function evidenceHistory(catalog: InvestigateCatalog, object: InvestigateObject, ref: string) {
  return (catalog.evidence.get(ref)?.revisions ?? []).flatMap((pin) => {
    const result = readEvidence(catalog, object, ref, pin);
    return result.state === "ready" ? [result] : [];
  });
}

const pinKeys = {
  ref: "evidence_ref",
  version: "evidence_version",
  documentRef: "document_ref",
  documentVersion: "document_version",
} as const;

export function readPin(params: URLSearchParams): EvidencePin | null | "invalid" {
  const [ref, version, documentRef, documentVersion] = Object.values(pinKeys).map((key) => params.getAll(key));
  if ([ref, version, documentRef, documentVersion].every((values) => values.length === 0)) return null;
  if (![ref, version, documentRef, documentVersion].every((values) => values.length === 1 && values[0].trim())) {
    return "invalid";
  }
  return { ref: ref[0], version: version[0], documentRef: documentRef[0], documentVersion: documentVersion[0] };
}

export function investigationParams(query: string, object?: string, pin?: EvidencePin) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (object) params.set("object", object);
  if (pin) {
    for (const key of Object.keys(pinKeys) as (keyof EvidencePin)[]) params.set(pinKeys[key], pin[key]);
  }
  return params;
}

function searchText(value: string) {
  return value.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/\p{M}/gu, "");
}

export function searchObjects(catalog: InvestigateCatalog, query: string) {
  const terms = searchText(query).match(/[\p{L}\p{N}]+/gu);
  if (!terms) return [];
  return Object.entries(objectKinds).flatMap(([kind, label]) => {
    const objects = catalog.objects.filter((object) => {
      if (object.kind !== kind) return false;
      if (searchText(object.id) === searchText(query.trim())) return true;
      const words = searchText([object.title, ...object.aliases].join(" ")).match(/[\p{L}\p{N}]+/gu) ?? [];
      return terms.every((term) => words.some((word) => term.length >= 4 ? word.startsWith(term) : word === term));
    });
    return objects.length ? [{ kind, label, objects }] : [];
  });
}

export function sourceHref({ mode, url }: DocumentaryReference["citation"]) {
  if (mode !== "link" || !url) return undefined;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "https:" && !parsed.username && !parsed.password) return parsed.href;
  } catch {
    return undefined;
  }
}
