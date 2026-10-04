import type { WorkspaceSummary } from "./operatorApi";

const BASE = "/api/operator/ariadne";
export const CLOSE_FIELDS = [
  "item_key",
  "component",
  "scope",
  "period",
  "currency",
  "tax_basis",
  "amount",
  "quantity",
  "quantity_unit",
  "price",
  "price_unit",
  "invoice_id",
  "row_type",
] as const;
export type CloseRole = "invoice" | "quantity" | "price" | "context";
export interface Candidate {
  index: number;
  locator: string;
  raw: Record<string, string | null>;
  cells: Record<string, string>;
  errors: string[];
  validation: string;
  eligible?: boolean;
  humanConfirmation?: string;
  item_key?: string;
  component?: string;
  amount?: string | null;
  quantity?: string | null;
  price?: string | null;
  label?: string;
  snippet?: string;
  page?: number;
  operation?: string | null;
  issues?: string[];
  values?: Record<string, string | null>;
  source_id?: string;
}
export interface Mapping {
  sheet: string;
  mapping: Record<string, string>;
  numericMode: "strict" | "dot" | "comma";
  manualRows: Record<string, string | number>[];
  reviewMode?: "table" | "observations" | "context";
  defaults?: Record<string, string>;
}
export interface Inspection {
  kind: string;
  parserVersion?: string;
  sha256?: string;
  tables: {
    name: string;
    sheet?: string;
    headerRow?: number;
    columns: string[];
    rows: Candidate[];
    proposedMapping: Record<string, string>;
  }[];
  pages: { number: number; text: string; status: string }[];
  sheets?: {
    name: string;
    hidden: boolean;
    warnings: string[];
    cells: {
      locator: string;
      raw: string | null;
      formula?: string;
      cachedValue?: string | null;
      issues: string[];
    }[];
  }[];
  extraction: string;
  warnings?: string[];
  observations?: Candidate[];
  provenance?: Record<string, unknown>;
  proposal?: {
    role: CloseRole | null;
    description: string;
    period?: string;
    scope?: string;
    distributor?: string;
    invoiceId?: string;
    class?: string;
    currency?: string;
    evidence: string[];
  };
}
export interface Source {
  id: string;
  role: CloseRole;
  filename: string;
  sha256: string;
  kind: string;
  supersedesId: string | null;
  confirmationVersionId: string | null;
  confirmation: (Mapping & { rows: Candidate[] }) | null;
  preview: Inspection;
}
export interface Review {
  id: string;
  scope: string;
  period: string;
  createdAt: string;
}
export interface CloseDetail {
  review: Review;
  sources: Source[];
  calculations: { id: string; producedAt: string }[];
  packages: { id: string; resultId: string }[];
}
export interface SourceRef {
  sourceId: string;
  sourceVersion?: string;
  confirmationVersionId?: string;
  locator: string;
  role: CloseRole;
}
export interface Check {
  classification: string;
  label: string;
  expected: string | null;
  difference: string | null;
  reasons: string[];
  calculation: string | null;
  sourceRefs: SourceRef[];
}
export interface Item {
  id: string;
  group: string;
  itemKey: string | null;
  component: string | null;
  billed: string | null;
  currency: string | null;
  independent: Check;
  internal: Check;
  candidate: Candidate;
}
export interface Treatment {
  id: string;
  itemId: string;
  status: string;
  reason: string;
  note: string;
  createdAt: string;
}
export interface Calculation {
  id: string;
  runId: string;
  modelVersionId: string;
  implementation: string;
  stateVersionId: string;
  assumptionVersionId: string;
  producedAt: string;
  output: {
    review: Review & { synthetic: boolean };
    ruleVersion: string;
    policy: Record<string, unknown>;
    items: Item[];
    relatedGroups?: {
      group: string;
      sourceRefs: SourceRef[];
      reason: string;
    }[];
    coverage: {
      invoiceItems: number;
      independentlyCovered: number;
      internalChecks: number;
      notVerified: number;
      unreviewedSources: string[];
      supersededSources: string[];
      unselectedSheets: { sourceId: string; sheet: string; rows: number }[];
      contextSources: string[];
      orphanInputs: { sourceId: string; locator: string; reason: string }[];
    };
    exclusions: string[];
  };
  inputs: { sources: Source[]; records: Candidate[] };
  treatments: Treatment[];
}

export class CloseApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
export class SelectionEpoch {
  private value = 0;
  next() {
    return ++this.value;
  }
  current(value: number) {
    return value === this.value;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(BASE + path, {
    credentials: "include",
    ...init,
  }).catch(() => {
    throw new CloseApiError(
      0,
      "Conexão interrompida. Repetir a mesma ação recupera a gravação sem duplicá-la.",
    );
  });
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      detail?: unknown;
    } | null;
    throw new CloseApiError(
      response.status,
      response.status === 401
        ? "Sessão expirada. Entre novamente."
        : typeof payload?.detail === "string"
          ? payload.detail
          : `Falha HTTP ${response.status}`,
    );
  }
  return (await response.json()) as T;
}

export async function retryWrite<T>(send: () => Promise<T>): Promise<T> {
  try {
    return await send();
  } catch (error) {
    if (
      !(error instanceof CloseApiError) ||
      (error.status !== 0 && error.status < 500)
    )
      throw error;
    return await send();
  }
}

async function fingerprint(value: string | ArrayBuffer) {
  const bytes =
    typeof value === "string" ? new TextEncoder().encode(value) : value;
  return Array.from(
    new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)),
  )
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("");
}

async function write<T>(
  path: string,
  body: unknown,
  form?: FormData,
  fileHash?: string,
) {
  // Store only opaque hashes/keys, never private values or originals. Keep key on ambiguous failure, including reload.
  const storageKey =
    "ariadne-close-retry:" +
    (await fingerprint(path + JSON.stringify(body) + (fileHash ?? "")));
  const key = sessionStorage.getItem(storageKey) ?? crypto.randomUUID();
  sessionStorage.setItem(storageKey, key);
  try {
    const response = await retryWrite(() =>
      request<T>(path, {
        method: "POST",
        headers: form
          ? { "Idempotency-Key": key }
          : { "Content-Type": "application/json", "Idempotency-Key": key },
        body: form ?? JSON.stringify(body),
      }),
    );
    sessionStorage.removeItem(storageKey);
    return response;
  } catch (error) {
    // An expired session does not establish whether an earlier attempt committed.
    if (
      error instanceof CloseApiError &&
      error.status >= 400 &&
      error.status < 500 &&
      ![401, 403, 408, 429].includes(error.status)
    )
      sessionStorage.removeItem(storageKey);
    throw error;
  }
}

const root = (w: string, r?: string) =>
  `/workspaces/${encodeURIComponent(w)}/close/reviews${r ? "/" + encodeURIComponent(r) : ""}`;
export const closeApi = {
  workspaces: () => request<{ data: WorkspaceSummary[] }>("/workspaces"),
  createWorkspace: (label: string, synthetic: boolean) =>
    write<WorkspaceSummary>("/close/workspaces", { label, synthetic }),
  reviews: (w: string, signal?: AbortSignal) =>
    request<{ data: Review[] }>(root(w), { signal }),
  start: (w: string, scope: string, period: string, ruleVersion = "0.1.0") =>
    write<Review>(root(w), { scope, period, ruleVersion }),
  inspect: (w: string, file: File) => {
    const form = new FormData();
    form.set("file", file);
    return request<Inspection>(
      `/workspaces/${encodeURIComponent(w)}/close/inspect`,
      { method: "POST", body: form },
    );
  },
  detail: (w: string, r: string, signal?: AbortSignal) =>
    request<CloseDetail>(root(w, r), { signal }),
  upload: async (
    w: string,
    r: string,
    file: File,
    role: CloseRole,
    supersedesId: string,
    inspection = false,
    provenance?: Record<string, unknown>,
  ) => {
    const form = new FormData();
    form.set("file", file);
    form.set("role", role);
    if (supersedesId) form.set("supersedesId", supersedesId);
    if (inspection) form.set("inspection", "true");
    if (provenance) form.set("provenance", JSON.stringify(provenance));
    return write<{ id: string; duplicate: boolean }>(
      root(w, r) + "/sources",
      { role, supersedesId, filename: file.name, inspection, provenance },
      form,
      await fingerprint(await file.arrayBuffer()),
    );
  },
  candidates: (
    w: string,
    r: string,
    s: string,
    mapping: Mapping,
    signal?: AbortSignal,
  ) =>
    request<{ rows: Candidate[] }>(root(w, r) + `/sources/${s}/candidates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mapping),
      signal,
    }),
  confirm: (
    w: string,
    r: string,
    s: string,
    mapping: Mapping,
    selectedRows: number[],
    previousConfirmationVersionId: string | null,
  ) =>
    write(root(w, r) + `/sources/${s}/confirm`, {
      ...mapping,
      selectedRows,
      previousConfirmationVersionId,
    }),
  calculate: (w: string, r: string, sources: Source[]) =>
    write<{ id: string }>(root(w, r) + "/calculate", {
      confirmationVersions: Object.fromEntries(
        sources.map((s) => [s.id, s.confirmationVersionId]),
      ),
    }),
  result: (w: string, r: string, id: string, signal?: AbortSignal) =>
    request<Calculation>(root(w, r) + `/calculations/${id}`, { signal }),
  replay: (w: string, r: string, id: string) =>
    request<{ matches: boolean }>(root(w, r) + `/calculations/${id}/replay`),
  treat: (
    w: string,
    r: string,
    id: string,
    itemId: string,
    status: string,
    reason: string,
    note: string,
  ) =>
    write(root(w, r) + `/calculations/${id}/treatments`, {
      itemId,
      status,
      reason,
      note,
    }),
  save: (w: string, r: string, id: string) =>
    write<{ id: string }>(root(w, r) + `/calculations/${id}/packages`, {}),
  exportUrl: (w: string, r: string, id: string) =>
    BASE + root(w, r) + `/packages/${id}/export`,
  originalUrl: (w: string, r: string, id: string) =>
    BASE + root(w, r) + `/sources/${id}/original`,
  pageUrl: (w: string, r: string, id: string, page: number) =>
    BASE + root(w, r) + `/sources/${id}/pages/${page}/image`,
};
