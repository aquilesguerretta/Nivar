# Ariadne review desk — local development evaluation

**Current correction wave:** use the [review desk evaluation guide](evaluation.md), [real public-data report](real-world-report.md), [public provenance/retrieval](public-corpus.md), [contract](review-desk-contract.md) and [ADR 002](adr-002.md). The primary route now opens a task-first desk; the old interface remains at `/operador/ariadne/fechamento/avancado`. The authentic public-data workflow has already been completed by the engineer. No repeat synthetic demonstration is required from the Founder.

The correction services use loopback8073/5180 and a separate disposable browser database; the earlier Founder8072/5178 session is preserved. Current process IDs and stop commands are in the evaluation guide. No migration is added or edited by this wave.

## Historical PR #28 evaluation setup

The following records the earlier hardening evaluation, including environment/migration status at that time. For the current wave follow `evaluation.md`; the earlier services have been resumed for Founder use, so statements below about stopped services are historical.

Experimental development workflow at `/operador/ariadne/fechamento`. This is one bounded monthly review, using real CSV/XLSX/PDF intake and synthetic engineering fixtures. The feature is closed by default and absent from production builds. It does not activate Corporate Workspace / Planejador or change the real-case/commercial gates.

Read the [frozen contract](engineering-contract.md), [Core ADR](adr-001.md), [original engineering report](final-report.md), [PR #28 hardening report](hardening-report.md) and [source readout](source-readout.md). The hardening report and `verification.json` contain the current verification results.

## Local setup

Use the existing isolated checkout `C:\dev\ariadne-fechamento-assistido-v0` and disposable PostgreSQL 17 databases. Never point the tests or evaluation server at a shared or production database. The lifecycle tests intentionally upgrade/downgrade disposable schemas and require `ariadne_close_test` in the database URL. The refreshed browser evaluation uses a separate `ariadne_close_hardening_browser` database. The earlier `ariadne_close_browser` database was retained unchanged and still has the earlier trigger definition.

Install `requirements-dev.txt` in a virtual environment and run `npm ci`. The Windows verification runtime also installed `tzdata`, the existing tools' `fastmcp`/`watchdog` dependencies and SQLAlchemy `2.0.54` (`sqlalchemy<2.1`): the existing unpinned dependency allows 2.1, whose default PostgreSQL driver differs from the repository's psycopg2 setup. This PR does not change the shared SQLAlchemy requirement. Use the explicit `postgresql+psycopg2://` scheme.

This machine's exclusively local disposable cluster is already initialized at `C:\dev\ariadne-close-pg17-20261002`; both evaluation/test databases already exist. The processes are stopped after QA. Start this exact cluster on loopback port 55472, then the backend in terminal 1:

```powershell
Set-Location C:\dev\ariadne-fechamento-assistido-v0
& 'C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe' start -D C:\dev\ariadne-close-pg17-20261002 -o '-p 55472 -h 127.0.0.1' -l C:\dev\ariadne-close-local-pg.log -w
$python = 'C:\dev\ariadne-close-runtime\Scripts\python.exe'
$env:DATABASE_URL = 'postgresql+psycopg2://postgres@127.0.0.1:55472/ariadne_close_hardening_browser'
& $python -m alembic upgrade head
$env:ARIADNE_CLOSE_DEV = '1'
$env:ARIADNE_CLOSE_ENV = 'development'
$env:ADVISORY_OPERATOR_EMAIL = 'ariadne-browser@example.com'
$env:JWT_SECRET = 'synthetic-local-only-ariadne-qa-session-signing'
$env:SESSION_COOKIE_SECURE = 'false'
& $python -m uvicorn app.main:app --host 127.0.0.1 --port 8072 --lifespan off
```

If `pg_ctl` reports that this cluster is already running, inspect its status; do not start another instance or switch to a different database. On another machine, initialize an exclusively disposable PG17 cluster and create the two named databases first. Never omit the explicit port. These are deliberately local synthetic QA settings, not production credentials or storage readiness. `--lifespan off` avoids unrelated background services. In terminal 2:

```powershell
Set-Location C:\dev\ariadne-fechamento-assistido-v0
$env:VITE_BACKEND_URL = 'http://127.0.0.1:8072'
$env:VITE_ARIADNE_CLOSE_DEV = '1'
npm run dev -- --host 127.0.0.1 --port 5178 --strictPort
```

The synthetic account already exists in the refreshed evaluation database: email `ariadne-browser@example.com`, password `synthetic-local-qa-password`. Open `http://127.0.0.1:5178/entrar` and log in normally. For a fresh database, register through the existing account UI or `/api/auth/signup` endpoint with name `Synthetic QA Operator`. No authentication bypass exists. Only this identity needs seeding; do not insert review/source/result data. Login uses the existing cookie session. Ariadne reuses the existing operator identity check, whose environment variable retains its legacy Advisory name; this grants no Advisory document access.

Generate the extra browser fixture files:

```powershell
& C:\dev\ariadne-close-runtime\Scripts\python.exe tests/ariadne_close/prepare_browser.py
```

Inputs are now together at `%TEMP%\ariadne-close-synthetic-browser` (on this machine `C:\Users\aquil\AppData\Local\Temp\ariadne-close-synthetic-browser`). `synthetic-input-package.zip` contains the three required sources, contextual/scanned PDFs, a revision and an ambiguous example, plus a short README. Extract the ZIP; the application imports its CSV/XLSX/PDF members, not ZIP containers. This is synthetic engineering evidence, not a client case or Golden Dataset.

### Founder task, without editing source

Open `http://127.0.0.1:5178/operador/ariadne/fechamento`. Create a workspace and mark its synthetic-evidence checkbox. Enter scope `SYNTHETIC-UNIT` and period `2026-09`. Import `invoice.csv` as invoiced values, `quantity.csv` as independent quantity and `price.xlsx` as reviewed price. Review each proposed mapping once, inspect invalid/ambiguous rows and confirm each eligible batch. Calculate; select `mandatory`, inspect the quantity/price values and original references, record an explained exception treatment, save the review and download its ZIP. Refresh and replay that saved result. Expect `25000.00 BRL` expected / `26000.00 BRL` billed / `1000.00 BRL` difference; treatment does not change the computation. Select the unsupported component: it remains not verified. Optional: import `invoice-revised.csv` explicitly superseding the original, confirm/calculate, then reopen the older result; its difference and exported package remain unchanged.

### Migration refresh and lifecycle boundary

0016 is unpublished/unmerged and was applied by this task only to disposable local databases. The patch amends it to reject UPDATE only, matching Core. Running `upgrade head` on a database already at the old 0016 will **not** change its installed triggers. Prefer a new empty disposable database, as this evaluation does. Only if the database is explicitly disposable and its close data may be discarded, `alembic downgrade 0015_ariadne_operator_label` followed by `alembic upgrade head` recreates close tables; retained Alpha history survives. Never do this on a shared/non-disposable database, never use `stamp`. If any shared application of old 0016 is discovered, preserve its migration history and use an additive correction instead. No shared/production environment was accessed to assert global absence.

Removing DELETE rejection grants no deletion authority. There is no deletion endpoint/UI. A future authorized lifecycle must coordinate originals, previews/extracts, Core confirmation and execution snapshots/results, receipts, packages, downloaded exports and backups; controlled close-table removal alone is not erasure.

### Stop local processes

Press Ctrl+C in the backend and frontend terminals (and any optional preview terminal). Then stop only this exclusively disposable cluster:

```powershell
& 'C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe' stop -D C:\dev\ariadne-close-pg17-20261002 -m fast -w
```

No local servers or browser jobs are left running by the hardening task. The disposable data remains for evaluation; restarting uses the same real login and persisted reviews. All servers bind to `127.0.0.1`, never a public interface. Always set the explicit local `VITE_BACKEND_URL`: the repository's default proxy target is remote.

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

The legacy browser harness requires installed Playwright and Chromium and now targets `/fechamento/avancado`. It was not run in the review-desk wave; that wave used the actual in-app browser. `RUNTIME_NODE_MODULES` must point to the directory containing Playwright's package, such as the bundled Codex Node dependencies. Both harnesses assert a localhost URL:

```powershell
$env:RUNTIME_NODE_MODULES = 'C:\Users\aquil\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
node tests/ariadne_close/browser.mjs
node tests/ariadne_close/browser-adverse.mjs
```

For an additional actual production-build gate check, serve the already built frontend locally in another terminal with `VITE_BACKEND_URL=http://127.0.0.1:8072` and `npm run preview -- --host 127.0.0.1 --port 5179 --strictPort`, then run `node tests/ariadne_close/browser-production-gate.mjs`. That browser check intercepts API requests locally and verifies the experimental route is unavailable. It never exercises the remote Vercel preview or a production backend.

The two development workflow harnesses authenticate through the real login UI and import actual fixture files. Screenshots and measurements overwrite only `docs/ariadne-close/browser-evidence`. The synthetic ZIP there is an example saved export, not seeded application data. Automated timing does not include human reading time and establishes no spreadsheet savings baseline.

Server gate: both `ARIADNE_CLOSE_DEV=1` and `ARIADNE_CLOSE_ENV=development|test`, with no production runtime marker. Frontend gate: `import.meta.env.DEV` plus `VITE_ARIADNE_CLOSE_DEV=1`. This task did not change any production settings.
