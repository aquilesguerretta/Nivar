# Fechamento Assistido v0 — local Founder evaluation

Experimental development workflow at `/operador/ariadne/fechamento`. This is one bounded monthly review, using real CSV/XLSX/PDF intake and synthetic engineering fixtures. The feature is closed by default and absent from production builds. It does not activate Corporate Workspace / Planejador or change the real-case/commercial gates.

Read the [frozen contract](engineering-contract.md), [Core ADR](adr-001.md), [final engineering report](final-report.md) and [source readout](source-readout.md). The report contains the review map, verification results and limitations.

## Local setup

Use an isolated checkout and disposable PostgreSQL 17 databases. Never point the tests or evaluation server at a shared or production database. The lifecycle tests intentionally upgrade/downgrade disposable schemas and require `ariadne_close_test` in the database URL. Browser evaluation uses a separate `ariadne_close_browser` database.

Install `requirements-dev.txt` in a virtual environment and run `npm ci`. The Windows verification runtime also installed `tzdata`, the existing tools' `fastmcp`/`watchdog` dependencies and SQLAlchemy `2.0.54` (`sqlalchemy<2.1`): the existing unpinned dependency allows 2.1, whose default PostgreSQL driver differs from the repository's psycopg2 setup. This PR does not change the shared SQLAlchemy requirement. Use the explicit `postgresql+psycopg2://` scheme.

Create empty local databases, then upgrade the browser database:

```powershell
$env:DATABASE_URL = 'postgresql+psycopg2://postgres@127.0.0.1:55472/ariadne_close_browser'
python -m alembic upgrade head
$env:ARIADNE_CLOSE_DEV = '1'
$env:ARIADNE_CLOSE_ENV = 'development'
$env:ADVISORY_OPERATOR_EMAIL = 'ariadne-browser@example.com'
$env:JWT_SECRET = 'synthetic-local-only-ariadne-qa-session-signing'
$env:SESSION_COOKIE_SECURE = 'false'
python -m uvicorn app.main:app --host 127.0.0.1 --port 8072 --lifespan off
```

These are deliberately local synthetic QA settings, not production credentials or storage readiness. `--lifespan off` avoids unrelated background services. In another terminal:

```powershell
$env:VITE_BACKEND_URL = 'http://127.0.0.1:8072'
$env:VITE_ARIADNE_CLOSE_DEV = '1'
npm run dev -- --host 127.0.0.1 --port 5178 --strictPort
```

Register the synthetic local account through the existing `/api/auth/signup` endpoint (or existing account UI): email `ariadne-browser@example.com`, name `Synthetic QA Operator`, password `synthetic-local-qa-password`. Only this identity needs seeding; do not insert review/source/result data. Login uses the existing cookie session. Ariadne reuses the existing operator identity check, whose environment variable retains its legacy Advisory name; this grants no Advisory document access.

Generate the extra browser fixture files:

```powershell
python tests/ariadne_close/prepare_browser.py
```

Start a synthetic workspace, enter scope `SYNTHETIC-UNIT` and period `2026-09`, then import `invoice.csv` and `quantity.csv` from `tests/ariadne_close/fixtures`, and `price.xlsx` from the generated temporary directory. Choose their distinct source roles, review the proposed mappings and confirm each batch. Calculate, select `mandatory`, inspect quantity/price source references, record an exception treatment, save a review package and download its ZIP. Refresh and replay the saved result. The amount remains `25000.00 BRL` expected / `26000.00 BRL` billed / `1000.00 BRL` difference even if a subsequent invoice corrects that component.

## Reproduce verification

Run database suites sequentially on the test database, independently of the browser database:

```powershell
$env:DATABASE_URL = 'postgresql+psycopg2://postgres@127.0.0.1:55472/ariadne_close_test'
$env:PYTHONPATH = '.'
python -m pytest -q
python -m compileall -q app tests/ariadne_close
npx tsc -b
npm run build
$frontendTests = @(rg --files tests -g '*.test.ts')
node --experimental-strip-types --test $frontendTests
node tools/gridalpha-detect/bin/gridalpha-detect.mjs src
git diff --check
```

The browser harness requires installed Playwright and Chromium. `RUNTIME_NODE_MODULES` must point to the directory containing Playwright's package, such as the bundled Codex Node dependencies. Both harnesses assert a localhost URL:

```powershell
$env:RUNTIME_NODE_MODULES = 'C:\Users\aquil\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
node tests/ariadne_close/browser.mjs
node tests/ariadne_close/browser-adverse.mjs
```

They authenticate through the real login UI and import actual fixture files. Screenshots and measurements overwrite only `docs/ariadne-close/browser-evidence`. The synthetic ZIP there is an example saved export, not seeded application data. Automated timing does not include human reading time and establishes no spreadsheet savings baseline.

Server gate: both `ARIADNE_CLOSE_DEV=1` and `ARIADNE_CLOSE_ENV=development|test`, with no production runtime marker. Frontend gate: `import.meta.env.DEV` plus `VITE_ARIADNE_CLOSE_DEV=1`. This task did not change any production settings.
