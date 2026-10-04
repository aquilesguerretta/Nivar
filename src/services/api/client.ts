// FORGE Wave 4 — V2 backend fetch wrapper.
// Single point of entry for every canonical-envelope endpoint. Browser
// requests stay same-origin; Vercel/Vite proxy `/api/*` to the backend.
// Validates the canonical envelope shape so callers never have to
// defensively check `meta`/`data` themselves.

import { BROWSER_API_BASE, browserApiUrl } from '@/lib/backendBase';
import type { ApiEnvelope } from '@/lib/types/api';

// ─── Configuration ────────────────────────────────────────────────

/** Empty by design: existing URL builders therefore produce `/api/...`. */
export const BASE_URL = BROWSER_API_BASE;

/**
 * Global mock-mode toggle. When `true`, hooks bypass real fetches and
 * use shape-matched mock data internally. Flip to `false` once Cursor's
 * endpoints are confirmed live in the environment you're testing in.
 *
 * Default: `false` — live mode. Offline development can override via the
 * `VITE_MOCK_API` env flag (`VITE_MOCK_API=true` in `.env.local`).
 */
export const MOCK_MODE: boolean =
  (import.meta.env.VITE_MOCK_API as string | undefined) === 'true';

// ─── Errors ───────────────────────────────────────────────────────

/**
 * Thrown by `fetchEnvelope` on network/HTTP/envelope-validation failures.
 * Hook consumers catch the bare `Error` shape, so we extend it directly
 * rather than introducing a new class hierarchy.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly path: string;
  constructor(message: string, status: number, path: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.path = path;
  }
}

// ─── Envelope validator ──────────────────────────────────────────

function isApiEnvelope(value: unknown): value is ApiEnvelope<unknown> {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  if (!obj.meta || typeof obj.meta !== 'object') return false;
  const meta = obj.meta as Record<string, unknown>;
  if (typeof meta.timestamp !== 'string') return false;
  // `data` can be null (e.g. degraded), absent, or any shape — leave it.
  if (!('data' in obj)) return false;
  if (typeof obj.summary !== 'string') return false;
  return true;
}

// ─── Public fetcher ──────────────────────────────────────────────

export interface FetchEnvelopeOptions {
  /** AbortSignal — pass when the consumer wants cancellation. */
  signal?: AbortSignal;
}

/**
 * Fetch a canonical-envelope JSON response and validate its shape.
 *
 * @param path  Same-origin API path, e.g. '/api/lmp/current?zone=WEST_HUB'
 * @throws ApiError on non-2xx status or invalid envelope.
 */
export async function fetchEnvelope<TData>(
  path: string,
  options: FetchEnvelopeOptions = {},
): Promise<ApiEnvelope<TData>> {
  const url = browserApiUrl(path);
  let res: Response;
  try {
    res = await fetch(url, {
      signal: options.signal,
      headers: { Accept: 'application/json' },
      credentials: 'omit',
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') throw err;
    throw new ApiError(
      `Network error fetching ${path}: ${
        err instanceof Error ? err.message : 'unknown'
      }`,
      0,
      path,
    );
  }

  if (!res.ok) {
    throw new ApiError(
      `API ${path} failed: HTTP ${res.status}`,
      res.status,
      path,
    );
  }

  let body: unknown;
  try {
    body = await res.json();
  } catch (err) {
    throw new ApiError(
      `API ${path} returned non-JSON body: ${
        err instanceof Error ? err.message : 'unknown'
      }`,
      res.status,
      path,
    );
  }

  if (!isApiEnvelope(body)) {
    throw new ApiError(
      `API ${path} returned malformed envelope (missing meta/data/summary).`,
      res.status,
      path,
    );
  }

  return body as ApiEnvelope<TData>;
}

// ─── Query-string helper ─────────────────────────────────────────

/**
 * Build a query string from a record of params. Skips undefined/null
 * values so callers can pass optional params verbatim.
 *
 *   qs({ zone: 'WEST_HUB', heat_rate: 7500 }) === '?zone=WEST_HUB&heat_rate=7500'
 *   qs({})                                    === ''
 */
export function qs(params: Record<string, string | number | undefined | null>): string {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  }
  return parts.length ? `?${parts.join('&')}` : '';
}

// ─── Stale detection ─────────────────────────────────────────────

/**
 * Returns the response's age in seconds, falling back to the diff
 * between the meta timestamp and the local clock when `data_age_seconds`
 * isn't supplied.
 */
export function envelopeAgeSeconds(envelope: ApiEnvelope<unknown>): number {
  const meta = envelope.meta;
  if (typeof meta.data_age_seconds === 'number') return meta.data_age_seconds;
  const ts = Date.parse(meta.timestamp);
  if (Number.isFinite(ts)) {
    return Math.max(0, Math.round((Date.now() - ts) / 1000));
  }
  return 0;
}
