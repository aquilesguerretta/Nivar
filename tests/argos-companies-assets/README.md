# NIV-79 · Petrobras → Mero

Functional browser fixture for the private, manually curated J2 journey. It uses the existing ARGOS typography, colors and square, ruled surfaces. The table keeps the chosen denominator beside each share. The timeline places the announced transfer and its conditional projection in a separate section.

## Run on Windows

From the worktree root, use Node 24 and PowerShell.

```powershell
npm ci
npm run dev -- --mode argos-local --host 127.0.0.1
```

Open [the J2 fixture](http://127.0.0.1:5173/tests/argos-companies-assets/fixture.html) using the port printed by Vite. Follow Petrobras → entidade jurídica → Mero → histórico e projeção. Open the MME or Form 20-F evidence and use **Voltar à consulta**. The hash URL carries the chosen date and denominator. **Aplicar** commits a historical replay date. To exercise the effectiveness guard, apply **2027-03-04** and return to **Jazida compartilhada**.

```powershell
node --test tests/argos-companies-assets/read-model.test.ts
npx eslint src/features/argos-companies-assets tests/argos-companies-assets
npx tsc -b

$qa = Join-Path ([System.IO.Path]::GetTempPath()) 'niv79-browser-tools'
npm install --prefix $qa --no-package-lock playwright
$env:RUNTIME_NODE_MODULES = Join-Path $qa 'node_modules'
node --test tests/argos-companies-assets/browser.mjs
```

The browser test uses installed Chrome and captures the fixture in dark desktop and light mobile layouts. Set `ARGOS_J2_QA_OUTPUT` to choose a screenshot folder. QA-only Playwright follows the existing ARGOS harness convention and lives outside the repository.

Run the same build scripts used for normal release targets and check both outputs locally.

```powershell
$env:ARGOS_J2_PREVIEW_DIST = Join-Path ([System.IO.Path]::GetTempPath()) 'niv79-build-preview'
$env:ARGOS_J2_PRODUCTION_DIST = Join-Path ([System.IO.Path]::GetTempPath()) 'niv79-build-production'
$env:VERCEL_ENV = 'preview'
npm run build -- --outDir $env:ARGOS_J2_PREVIEW_DIST
$env:VERCEL_ENV = 'production'
npm run build -- --outDir $env:ARGOS_J2_PRODUCTION_DIST
node --test tests/argos-companies-assets/build-exclusion.test.mjs
```

## Adapter contract

The local data follows [NIV-61 Companies & Ownership](https://app.notion.com/p/41a9ca62107081d88110dd710d8bc517) and the [NIV-63 Knowledge Layer](https://app.notion.com/p/41a9ca62107081178d54e20df43e0e58). Candidate references are prefixed with `niv79:`. Resolve those references to reviewed shared IDs during integration. Treat party names sourced only from the MISC factsheet as attributed actors until there is a reviewed registry match.

| Local adapter | Shared contract at integration |
| --- | --- |
| `profile.primaryEntityRef`, `contractors`, `field`, `vessel` | CompanyProfile composition, CorporateEntity, typed Asset and Claim-backed asset association. Reuse the same Mero Asset ref for the Brazil Map handoff. Resolve CNPJ and CIK in their own namespaces. |
| `roles`, `replay(date).rows` | Controlled OwnershipRelation and supporting Claims. Each documented contractual participation row includes legal party, Mero reference, instrument scope, denominator, and evidence. Auction allocations and forecasts carry no relation kind. PPSA marketing is a Claim. The vessel title is an issuer-attributed assertion pending registry verification. |
| `replay(date).rows` and `projected` | Metric/Observation projection. Map `bps / 100` to percent, keeping `metricRef` by denominator and `subjectRef` by legal party. Preserve `type`, reference date, known-at, versioned observation ID and linked evidence. Reservoir shares use ANP's area split and are checked against the SEC filing. Forecast rows add the buyer's portion of the Union block to the documented reservoir base. |
| `resolveEvidence(claimKey)` | Source → Document version → Claim and resource-specific rights reference. Preserve publisher-native version, original URL, locator, language, research retrieval, known-at and channel gate. Map claim keys to versioned shared evidence refs when the NIV-77 link adapter is available. Corrections should add a new version and preserve prior references. |
| `replay(date).pending` | Event with separately attributed signing, announced date and unknown effectiveness. Closing needs a new reviewed primary document, the actual effective date, a separately recorded known-at date and a new version of the affected observations and relationships. |

## Coverage and limits

- The fixed [NIV-71 dossier](https://linear.app/nivarenergy/issue/NIV-71/argos-companies-assets-petrobrasmero-contractual-timeline-source-pack#comment-434de60e-c5b2-4781-967c-df43e841bb0c) was curated on 18 November 2026. Replay uses that research to filter event dates and reconstruct supported observations. It does not simulate what ARGOS knew on the selected historical date. The full reservoir snapshot is available on the FY2025 year-end reference date and as the last documented composition from the 2026 dossier. Gaps between snapshots stay unknown.
- The 2026 snapshot preserves Petrobras at 38.60% and the Union at 3.50% of the whole reservoir. The 2027 view remains pending before, on and after the announced date. No executed contract, proof of closing or general effective-date ledger is available in this fixture.
- One FPSO is in scope. Its title and maintenance roles are statements from MISC and its registry title and start dates are unverified. The Brazil Map link is a reference page with regional geography and no coordinates or map rendering.
- Public/client display, original media and documents, API, export and automated acquisition remain subject to resource-specific rights decisions. The fixture contains original NIVAR summaries, limited facts and attribution links. It makes no external requests during the journey. Original-source links open at the user's request. See the [NIV-74 decision](https://linear.app/nivarenergy/issue/NIV-74/argos-global-source-rights-and-evidence-onboarding-matrix-for-first).
- The fixture is a separate dev entry point. Integration into Global Explore, central search, shared registry IDs, canonical evidence routing and backend rights enforcement are outside this lane.
