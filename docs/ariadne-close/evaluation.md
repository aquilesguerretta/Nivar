# Review desk evaluation — 2026-10-03

Checkout `C:\dev\nivar-ariadne-review-desk`, branch `codex/ariadne-real-review-desk`, base04150fea408ede94f4e1e7ab647e10687a0978bf. No migration is added; Alembic head remains0016_ariadne_close. All operations below are exclusively local development.

The authentic public-data run is already complete. Open:

`http://127.0.0.1:5180/operador/ariadne/fechamento?workspace=5a71ea91-bf45-5eb2-bbb8-2a0817fdc47c&review=4d325557-649f-406b-87ee-5087a49bd1ba&result=39dc7900-73e0-4ca4-ba7e-fef30abe4ade`

Normal disposable QA account: `ariadne-browser@example.com` / `synthetic-local-qa-password`. Auth is the existing normal cookie session. A distinct local cookie **name** preserves the earlier Founder session; no authentication/admin bypass exists.

Select the red-flag component and total; inspect the exact snippets/calculations and authentic page. Select ANEEL from the source tray and choose `CSV:row:5 · B3 · Convencional`. Inspect coverage, attributed provenance, treatment, ZIP and exact replay. The Founder is not required to repeat a synthetic demonstration.

## Start safely after stopping

Use only the exclusively disposable PostgreSQL17 cluster at `C:\dev\ariadne-close-pg17-20261002`, loopback55472. Correction browser DB: `ariadne_close_review_desk_final_browser`; tests: `ariadne_close_test`. Earlier Founder8072/5178 and its database are preserved. Do not reset a shared/production database. Inspect cluster status before starting another instance:

```powershell
& 'C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe' status -D C:\dev\ariadne-close-pg17-20261002
# Only if stopped:
& 'C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe' start -D C:\dev\ariadne-close-pg17-20261002 -o '-p 55472 -h 127.0.0.1' -l C:\dev\ariadne-close-local-pg.log -w
```

Install `requirements-dev.txt` in a virtual environment and `npm ci`. This machine uses Python3.12 at `C:\dev\ariadne-close-runtime\Scripts\python.exe`, SQLAlchemy2.0.54 and PostgreSQL17.11. The page renderer adds pypdfium2 5.13.0/Pillow12.x. Use explicit `postgresql+psycopg2` URLs.

Backend terminal:

```powershell
Set-Location C:\dev\nivar-ariadne-review-desk
$python = 'C:\dev\ariadne-close-runtime\Scripts\python.exe'
$env:DATABASE_URL = 'postgresql+psycopg2://postgres@127.0.0.1:55472/ariadne_close_review_desk_final_browser'
& $python -m alembic upgrade head
$env:ARIADNE_CLOSE_DEV = '1'
$env:ARIADNE_CLOSE_ENV = 'development'
$env:ADVISORY_OPERATOR_EMAIL = 'ariadne-browser@example.com'
$env:JWT_SECRET = 'synthetic-local-only-ariadne-qa-session-signing'
$env:SESSION_COOKIE_SECURE = 'false'
$env:SESSION_COOKIE_NAME = 'ariadne_desk_local_session'
& $python -m uvicorn app.main:app --host 127.0.0.1 --port 8073 --lifespan off
```

Frontend terminal:

```powershell
Set-Location C:\dev\nivar-ariadne-review-desk
$env:VITE_BACKEND_URL = 'http://127.0.0.1:8073'
$env:VITE_ARIADNE_CLOSE_DEV = '1'
npm run dev -- --host 127.0.0.1 --port 5180 --strictPort
```

Always set the local proxy target; the repository default is remote. Browser API calls remain relative `/api/...`. `--lifespan off` avoids unrelated jobs. Bind to loopback only. A fresh disposable DB needs only identity creation through the normal `/entrar` signup UI; do not seed reviews, sources or results. No production settings change.

## Optional fresh run with authentic files

Open `/operador/ariadne/fechamento` without query parameters. Inputs are in `C:\dev\ariadne-real-public-evaluation-20261003`, outside the repository/webroot:

1. Select `aris-invoice-131111946-physical-page-190.pdf` and its matching `.provenance.json` together. Confirm the proposed invoice role/reference2021-09/account9010675; inspect and confirm the seven observations.
2. Import `aneel-enel-ce-b3-application-2021-09-original-rows.csv` with its sidecar. Confirm contextual role and acknowledge its five raw rows. No numeric values/mappings need typing for these layouts.
3. Verify/preserve checks, investigate, record treatment, save/download, refresh and replay.

Expected: four internal checks with zero differences, total91.43BRL, **zero independently verified components**, seven not independently verifiable rows. No payment, savings, tax, tariff or legal authority follows. Raw ANEEL columns/units remain contextual.

The previous v0.1 UI is `/operador/ariadne/fechamento/avancado`; retained v0.1 reviews cannot silently acquire v2 inspection inputs. Other/scanned PDFs preserve originals without generic field extraction. Manual source-linked PDF input remains advanced. Complex XLSX inventories literal regions, titles/formulas/hidden content; invalid rows stay noneligible. No OCR, formula execution, external provider or arbitrary URL fetch exists.

Synthetic files from `python tests/ariadne_close/prepare_browser.py` remain regression-only. They are not the primary evaluation or Golden Dataset. Legacy browser harnesses now target the advanced route and were not executed in this wave. This wave used the actual in-app browser.

## Verify separately

```powershell
Set-Location C:\dev\nivar-ariadne-review-desk
$python = 'C:\dev\ariadne-close-runtime\Scripts\python.exe'
$env:DATABASE_URL = 'postgresql+psycopg2://postgres@127.0.0.1:55472/ariadne_close_test'
$env:PYTHONPATH = '.'
& $python -m pytest -q
& $python -m compileall -q app tests/ariadne_close
npx tsc -b
npm run build
$frontendTests = @(rg --files tests -g '*.test.ts')
node --experimental-strip-types --test $frontendTests
node tools/gridalpha-detect/bin/gridalpha-detect.mjs src
git diff --check
```

Lifecycle suites upgrade/downgrade only the named disposable test database. Corpus-gated tests require the separately acquired public package; portable grammar/layout tests do not. Preserve acquisition versions/hashes: never substitute a fresh public download into an old review.

Server gate: `ARIADNE_CLOSE_DEV=1`, `ARIADNE_CLOSE_ENV=development|test`, no production marker. Frontend gate: DEV plus `VITE_ARIADNE_CLOSE_DEV=1`. Production-build browser smoke returned NotFound; experimental routes/UI/API code are absent from production JavaScript (scoped CSS remains). No cloud preview was used.

## Stop commands and processes left running

Correction backend52304 on8073 and Vite28576 on5180 are left ready for review. Ctrl+C in their terminals, or verify these IDs before stopping after any later restart:

```powershell
Get-NetTCPConnection -State Listen -LocalPort 8073,5180 | Select-Object LocalAddress,LocalPort,OwningProcess
Get-CimInstance Win32_Process -Filter 'ProcessId=52304 OR ProcessId=28576' | Select-Object ProcessId,CommandLine
Stop-Process -Id 52304,28576
```

Temporary production-build preview5181 was stopped. Earlier Founder8072/5178 and PG55472 remain running; do not stop them inadvertently. Once every local evaluator has stopped, the exclusively disposable cluster may be stopped with `pg_ctl stop -D C:\dev\ariadne-close-pg17-20261002 -m fast -w`.

No migration edit/reset/`stamp`, delete API, merge or deployment occurred in this wave. Future deletion authority must separately coordinate retained originals, extracts, confirmation/execution snapshots, packages, exports and backups.
