# Connected demand planning — local evaluation

Experimental development only. No production settings, migrations, deployment or commercial gates change. Read [contract](engineering-contract.md), [ADR](adr-001.md), [sources/methodology](sources-methodology.md), [oracle](oracle.md) and [report](final-report.md).

The existing local evaluated state opens at:

`http://127.0.0.1:5182/operador/ariadne/planejamento?workspace=f0b06be8-65cd-5988-9452-ffa3576e1959&review=9f7f17cd-208e-4418-ab70-c57fb75d13be&baseline=b3137f69-1928-44bd-8258-70af062007ae&scenario=7aa76674-b09d-49ed-8e73-ec302a469d64&month=2020-02`

Normal synthetic local QA login: `ariadne-browser@example.com` / `synthetic-local-qa-password`. This account was created through the normal local UI. No admin/session bypass exists. Public evaluation inputs were imported through the browser, not preinserted in the database.

## Start safely

Checkout `C:\dev\nivar-ariadne-connected-planning`; isolated branch `codex/ariadne-connected-planning-v0`. Install existing requirements into a virtual environment and `npm ci`. Runtime used: Python3.12.14, SQLAlchemy2.0.54, PostgreSQL17.11, pypdf/pypdfium2 and Pillow. Use explicit psycopg2 URLs and loopback only. Do not copy a production `.env` file.

Existing exclusively disposable cluster: `C:\dev\ariadne-close-pg17-20261002`, port55472. Evaluation DB `ariadne_close_planning_browser`; test DB `ariadne_close_test`. Inspect before starting; do not reset another evaluation or shared database.

```powershell
& 'C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe' status -D C:\dev\ariadne-close-pg17-20261002
# Only if stopped:
& 'C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe' start -D C:\dev\ariadne-close-pg17-20261002 -o '-p 55472 -h 127.0.0.1' -l C:\dev\ariadne-close-local-pg.log -w
```

Backend terminal:

```powershell
Set-Location C:\dev\nivar-ariadne-connected-planning
$python = 'C:\dev\ariadne-close-runtime\Scripts\python.exe'
$env:DATABASE_URL = 'postgresql+psycopg2://postgres@127.0.0.1:55472/ariadne_close_planning_browser'
& $python -m alembic upgrade head
$env:ARIADNE_CLOSE_DEV = '1'
$env:ARIADNE_CLOSE_ENV = 'development'
$env:ARIADNE_PLAN_DEV = '1'
$env:ADVISORY_OPERATOR_EMAIL = 'ariadne-browser@example.com'
$env:JWT_SECRET = 'synthetic-local-only-ariadne-qa-session-signing'
$env:SESSION_COOKIE_SECURE = 'false'
$env:SESSION_COOKIE_NAME = 'ariadne_plan_local_session'
& $python -m uvicorn app.main:app --host 127.0.0.1 --port 8074 --lifespan off
```

Frontend terminal:

```powershell
Set-Location C:\dev\nivar-ariadne-connected-planning
$env:VITE_BACKEND_URL = 'http://127.0.0.1:8074'
$env:VITE_ARIADNE_CLOSE_DEV = '1'
$env:VITE_ARIADNE_PLAN_DEV = '1'
npm run dev -- --host 127.0.0.1 --port 5182 --strictPort
```

The explicit local proxy target is mandatory; the repository default is remote. All browser calls remain relative `/api/...`. `--lifespan off` avoids unrelated jobs. A new disposable DB requires its QA identity through normal `/criar-conta` and `/entrar`, never a seeded private review/result. This wave adds no migration; head remains0016. Original/backend storage and safety limits are reused, not claimed production ready.

## Founder task without source editing

1. Open the evaluated baseline. Compare280kW to260 and300 using the precise number input or keyboard/slider. Costs are partial tariff-only subtotals, not actual bills.
2. SelectFebruary2020. Inspect294.48kW,15.20BRL/kW and the component arithmetic. Try280.45 then280.46 to see the strict threshold change.
3. Select a preserved alternative; duplicate it, change a premise and preserve the new exploration. Open comparison. Refresh and reconstruct; expect an identical retained result. Export the exact JSON.
4. InspectMay's mixed-tariff gap andNovember's missing supplier identity. Do not treat physical coverage as monetary verification.
5. Manually verify **Abrir fonte original · página14** in an ordinary browser. Automated in-app browser navigation to the authenticated `blob:` PDF was blocked by its security policy. This outstanding visual-source check is not represented as passed; no workaround or renderer safety weakening was used.

The full original PDF is retained privately. Native OCR tokens/raw locators are inspectable. Its8.28MP one-bit CCITT pages exceed the existing safe inline preview limits, so no fabricated thumbnail/new OCR is provided.

For a fresh authentic import, open `/operador/ariadne/fechamento` without query parameters. Files are outside repository/webroot in `C:\dev\ariadne-planning-public-evaluation-20261003\source-review`:

- `sobral-group-a-original.pdf` plus `sobral-group-a-original.pdf.provenance.json`;
- `tariff-reference.csv` plus `tariff-reference.csv.provenance.json`.

Import each pair, confirm its proposed context and candidate rows, preserve the reviewed state, then use **Planejar a partir deste estado**. No baseline financial values need typing. The tariff CSV is a source-linked deterministic projection of exact original ANEEL rows, not an operator-rekeyed price. Recognize normal-regime and ordinary tariff applicability explicitly; they are assumptions, not certifications. Original CSV89MB is outside the bounded upload size; use the documented small provenance-linked projection.

Synthetic regression layouts remain in `tests/ariadne_planning` and `tests/ariadne_close/fixtures`; they are not the primary product demonstration or Golden Dataset.

## Verification and stopping

```powershell
Set-Location C:\dev\nivar-ariadne-connected-planning
$env:DATABASE_URL = 'postgresql+psycopg2://postgres@127.0.0.1:55472/ariadne_close_test'
C:\dev\ariadne-close-runtime\Scripts\python.exe -m pytest -q
C:\dev\ariadne-close-runtime\Scripts\python.exe -m compileall -q app tests
$frontTests = @(rg --files tests -g '*.test.ts')
node --experimental-strip-types --test $frontTests
npx tsc -b
npm run build
node tools/gridalpha-detect/bin/gridalpha-detect.mjs src
git diff --check
```

Lifecycle suites only upgrade/downgrade the named disposable test DB. Corpus-gated tests require the separately acquired authentic package; don't silently substitute new downloads in historical reviews.

Current loopback services: backend50128 on8074, Vite45544 on5182, PostgreSQL50416 on55472. Verify command lines and ports before stopping after a restart:

```powershell
Get-NetTCPConnection -State Listen -LocalPort 8074,5182,55472 | Select-Object LocalAddress,LocalPort,OwningProcess
Get-CimInstance Win32_Process -Filter 'ProcessId=50128 OR ProcessId=45544' | Select-Object ProcessId,CommandLine
Stop-Process -Id 50128,45544
# Only after every other local evaluator has stopped using the disposable cluster:
& 'C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe' stop -D C:\dev\ariadne-close-pg17-20261002 -m fast -w
```

Ctrl+C in each owning terminal also stops its service. Temporary production-build preview5183 is stopped after QA. Earlier evaluator processes were found stopped before this wave; their databases were not reset. No background worker, deployment or next-module work remains.
