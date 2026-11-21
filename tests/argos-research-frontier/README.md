# ARGOS Research Frontier · NIV-80

Use Node 24 and start in this worktree.

```powershell
npm ci
npm run dev -- --mode argos-local --host 127.0.0.1 --strictPort
```

Open [the local fixture](http://127.0.0.1:5173/tests/argos-research-frontier/fixture.html). Start at **Solar PV**, open the tandem variant, choose a research milestone, and inspect its measurement and evidence. The evidence URL pins both the measurement version and the document edition. Browser Back and **Voltar à medição** recover the same record and its entry route. The TOPCon relationship resolves the same observations for the two experiments that document a TOPCon bottom cell.

The fixture uses the existing loopback-only Vite mode and requires no backend or account. It loads no remote assets. Original-source links require a user action. The July LONGi claim uses bibliographic metadata because NIV-74 flagged the issuer's link terms.

## Knowledge Layer handoff

- The technology and tandem IDs are candidates. The TOPCon entry reuses `variant:solar-pv:c-si:topcon` under `variant:solar-pv:c-si`, as used by J1. Bottom-cell relationships come from the observation's device and evidence.
- Use `ResearchMilestone → ObservationId + version → DocumentId + edition + locator → SourceId` when mapping to NIV-77. The `frontier` namespace marks local candidates for reconciliation using DOI, publisher ID, and edition. Keep a single observation when linking from the tandem and TOPCon views.
- The Fraunhofer prototype and the Norton field campaign each retain two documented publication states under one observation ID. These are publication histories. The dossier supplied no source error or correction for these results. The July LONGi statement has its own Claim and unlinked subject. IEA readiness and the NIVAR market/deployment assessment resolve by exact device subject.
- `readEvidence` allows only local summary and attribution metadata for a known edition and locator. Rights references are candidates under the NIV-74 decision. The standard entrypoint has no dependency on the fixture; production access remains governed by the shared product release gates.

## Verification

The browser tests use installed Chrome and Playwright. Set `RUNTIME_NODE_MODULES` to an existing Node modules directory containing Playwright when it is unavailable in the normal module path.

```powershell
node --experimental-strip-types --test tests/argos-research-frontier/read-model.test.ts tests/argos-global-explore/read-model.test.ts tests/argos-signal-inspection/read-model.test.ts
node --test tests/argos-research-frontier/browser.mjs
npx tsc -b tsconfig.json tests/argos-research-frontier/tsconfig.json
npx eslint src/features/argos-research-frontier tests/argos-research-frontier --max-warnings=0
node tools/gridalpha-detect/bin/gridalpha-detect.mjs src/features/argos-research-frontier

$env:VERCEL_ENV = 'production'
npm run build
$env:VERCEL_ENV = 'preview'
$env:ARGOS_PREVIEW_DIST = Join-Path ([System.IO.Path]::GetTempPath()) ("niv80-preview-" + [guid]::NewGuid())
npx vite build --outDir "$env:ARGOS_PREVIEW_DIST"
node --test tests/argos-research-frontier/build-exclusion.test.mjs
```

The exclusion tests scan both output directories and probe direct requests against local servers serving those builds. The Preview equivalent uses the normal Vite production mode, with only the Vercel environment and output directory varied.
