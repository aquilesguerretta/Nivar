/**
 * Browser API traffic is always same-origin.
 *
 * Vercel rewrites `/api/*` to Railway in production and Vite proxies the
 * same paths in development. Keeping the browser on the frontend origin is
 * also required for the host-only session cookie used by authenticated APIs.
 */
export const BROWSER_API_BASE = '';

export function browserApiUrl(path: string): string {
  if (!path.startsWith('/api/')) {
    throw new Error(`Browser API paths must start with /api/: ${path}`);
  }
  return `${BROWSER_API_BASE}${path}`;
}

/** Compatibility for existing consumers while all runtime traffic is same-origin. */
export function getBackendBase(): string {
  return BROWSER_API_BASE;
}

/** News is served by the same V2 backend and the same `/api` rewrite. */
export function getNewsApiBase(): string {
  return BROWSER_API_BASE;
}
