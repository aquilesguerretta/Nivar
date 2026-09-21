# Production stabilization runbook

## Browser API routing

Browser code calls same-origin `/api/*` paths in both production and local
development. In production, `vercel.json` rewrites those requests to the V2
Railway service. Locally, `vite.config.ts` proxies them to `VITE_BACKEND_URL`
(defaulting to the V2 Railway service).

`VITE_BACKEND_URL` is therefore a development-server setting, not a browser
runtime base URL. `VITE_API_URL` and the dead GridAlpha V1 Railway service are
not used by the application runtime.

## Railway configuration

Set this server-side variable manually in the Railway service:

```dotenv
CORS_ORIGINS=https://nivar.com.br,https://www.nivar.com.br
```

Do not use `*` with credentialed CORS. Normal browser traffic now uses the
same-origin Vercel rewrite, reducing its dependence on CORS; the explicit
origins remain useful for direct diagnostics and controlled clients.

`ANTHROPIC_API_KEY` must remain server-side and must never use a `VITE_`
prefix.

The optional server-side variable `AI_GLOBAL_RATE_LIMIT_REQUESTS` controls
the process-wide AI request ceiling per 60-second window. Its conservative
default is `60`. Invalid, zero, or negative values fall back to that default.
Never prefix this variable with `VITE_`.

## AI proxy controls

`POST /api/ai/complete` requires the existing NIVAR session authentication.
The server accepts only the model used by current clients, caps output at
2,000 tokens, rejects unknown fields, limits message counts and text sizes,
and rejects request bodies over 64 KiB. The existing per-account,
per-process burst limit allows 20 requests per 60 seconds. A second,
account-independent fuse allows 60 requests per process per 60 seconds by
default and can be configured with `AI_GLOBAL_RATE_LIMIT_REQUESTS`.

Both rate limits are intentionally lightweight. They are not shared across
Railway replicas and reset on process restart. A distributed limiter backed
by shared infrastructure remains technical debt if abuse levels require
stronger global enforcement.

## Deferred data-integrity inventory

This review pass removes invented fallback values only from the migrated
Market Drivers block. The following pre-existing mock or derived displays are
deliberately deferred to a future data-integrity wave:

- the expanded LMP view's dominant West Hub price and 24-hour chart still use
  `ZONE_LMP_DETAIL` and `ZONE_24H_PRICES`;
- the full-page and Nest resource-gap views still contain mock 24-hour chart
  series, fuel-mix-derived fallback calculations, and static structural
  planning scenarios;
- other Terminal cards continue to use the historical mock datasets under
  `src/lib/pjm/mock-data` where no V2 contract was part of this wave.

The Market Drivers block now computes highest and lowest zone prices from the
V2 all-zones response. It reports “most congested” as unavailable because that
response does not include per-zone congestion components.

## Regression commands

```text
npm run test:stabilization
py -3 -m pytest tests/production-stabilization/test_ai_route.py -q
```

The backend suite replaces the Anthropic HTTP client with a mock and never
uses real Anthropic credits.
