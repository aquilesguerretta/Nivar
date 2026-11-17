# Connected Planning Round 2 — real demand-contract lab

The October verdict below is historical. See the [November 2026 closure revalidation](#november-2026-closure-revalidation--2026-11-15) for the current verdict.

Verdict: **ARIADNE CONNECTED PLANNING BLOCKED**. The bounded implementation and automated engineering gates passed. Product acceptance criterion 7 still requires a manual browser check of the authenticated original PDF: automated in-app navigation to its `blob:` URL was rejected by browser security policy. No workaround, public original, new provider or weaker renderer limit was introduced. This is an evaluation blocker, not a demonstrated private-data breach. All independent implementation, testing, review and release-preparation work was completed.

## 1. Base, branch and release

Fetched development base: `17319a70829e3811374c08be994d858347782a55`; a final fetch confirmed it had not advanced. Isolated checkout `C:\dev\nivar-ariadne-connected-planning`, branch `codex/ariadne-connected-planning-v0`. Final commit identity and the one Draft PR are recorded in the delivery/PR metadata. Target is `wave/nivar-g2-dream-build`. No merge, deployment, production DB/settings or canonical Notion/Linear changes. NIV-18/19/20/50 and commercial/reference-case gates remain open. No Round 3 work.

## 2. Authentic sources and provenance

The original Sobral transparency PDF was acquired independently, retained outside repository/webroot, and imported through the actual browser with its provenance sidecar. URL: `https://transparencia.sobral.ce.gov.br/arquivo/nome:16cfd06787b4b3080aa992f28bd18746.pdf`. Acquisition `2026-10-04T00:18:04.522406Z`, 3,393,530 bytes, 14 physical pages, SHA256 `1d9b1eba3b46dd1b6f492b4fc7060799f0821b0b3b10d7e4753c2097c2ea822c`.

The separately acquired original ANEEL historical tariff CSV has SHA256 `1159c6d01d383a1f4a5c4396db73778f3d8da809ffd00ea4210f077fae1beb02`, acquisition `2026-10-03T21:47:17.375489Z`, 89,235,715 bytes. Its 2026 acquisition is distinguished from the 2018/2019 tariff periods. Original rows127460 and143912 were deterministically projected into the bounded 673-byte `tariff-reference.csv`, SHA256 `99e5eb7230ec86e996eb6cbbfff9491c20675182dff994c7116e985886a9d30a`, and imported with a provenance sidecar. This is not manually retyped financial data.

[Sources/methodology](sources-methodology.md) preserves 14 exact primary source URL/hash entries, final URLs, acquisition timestamps, pages, effective dates, row dimensions and rights limitations. Source originals, extracts, page derivatives and authentic screenshots are outside Git. Public accessibility does not confer unrestricted redistribution rights.

## 3. Exact planning question

How would this unit's **supported historical demand-related tariff-reference cost** have behaved under different hypothetical contracted kW values? This is a partial historical counterfactual. It is not a forecast, expected gross invoice, savings certificate, contract optimizer or recommendation.

## 4. Authority and effective dates

Authority was researched and frozen before writing the monetary executor. Primary DOU REN414/2010 (effective15September2010), REN418/2010 (effective1December2010), REN479/2012 (effective12April2012; relevant transition windows ended in2012), REN714/2016 (effective17July2016) and June2016 rectification support the bounded ordinary A4-green policy. References: REN414 arts93/104, REN479 green art56, minimum30kW art63 as amended by REN714. The frozen authority contract hash is `9f1af3e0b0d99364e06da989838af8608ba137497ea940fba60806c06b0ac1df`.

The reviewed model window is March2019–February2020. This is not an exhaustive legal amendment/judicial audit or confirmation of the unit's CUSD exceptions. Normal non-rural/non-recognized-seasonal/non-test regime and ordinary tariff applicability must both be explicitly acknowledged to show money.

Verified tariff dimensions include distributor CNPJ07047251000170, A4, green, ordinary application, class/subclass/detail/time band “Não se aplica”, kW and BRL. Rate13.59 applies22April2018–21April2019;15.20 applies22April2019–21April2020. The primary historical data plus acquired2018 act and2019 MME corroboration support the tariff-only reference. The direct2019 original annex returnedHTTP403 and is not claimed acquired. Consumer ICMS/PIS/Cofins/CIP additions are excluded; “pre-tax reference” does not claim every upstream tax absent. Current explanatory tax sources are not presented as archived2019 law.

## 5. Supported observed baseline

One unit429967, printed A4 horosazonal verde, ordinary observed contracted demand280kW. Twelve invoice pages3–14 cover March2019–February2020. The existing noisy invisible OCR layer is read passively; no OCR provider, repair inference or new OCR is used.

Actual application coverage: **9/12 physical, 7/12 monetary**. Physical observations: May–December2019 andFebruary2020; observed maximum300.96kW. Monetary coverage: June, July, August, September, October, December2019 andFebruary2020. Actual reading intervals, source page/token/point locators, raw values and exact source/confirmation versions are retained.

## 6. Unsupported facts

March page3 has ambiguous OCR facts; April page4 lacks eligible measured demand; January page13 lacks a readable billing reference. These are not repaired from reading dates or neighboring history grids. May crosses22April's tariff change; no unverified day-allocation method is introduced. November's supplier CNPJ is illegible; it is not copied from another invoice. Repeated history grids represent21 distinct observed labels but do not create more invoices or rates. Invoice rate/charge strings remain contextual raw evidence rather than reconstructed gross costs.

The source is scanned with an existing searchable layer, not clean native text. Each8.28MP one-bit CCITT raster exceeds existing inline-preview limits. Original preservation remains functional; unsupported preview is explicit. This wave does not weaken that guard.

## 7. Model and boundaries

Separate Core model `demand_contract_screening`, semantic version`0.1.0`, implementation`ariadne.plan.demand_contract_screening.v0_1_0`. It does not overload Close or scalar multiplication. No migration: one head remains`0016_ariadne_close`; historical migrations0012–0015 unchanged.

For eligible cycle maximum M in kW, hypothetical C>=30kW and whole-cycle applicable T in BRL/kW: regular=max(M,C)*T; additional overrun=2*T*(M-C) only if **M>1.05*C**. Equality does not trigger. Excess is M-C, not M-1.05*C. Peak/off-peak are not summed. Unused exposure=max(C-M,0)*T is descriptive, not savings. Exact server Decimal precision48; HALF_UP cents separately per component, then monthly/covered aggregate sum; threshold unrounded. This rounding is engineering policy, not an asserted legal rule. Preview and preserved Core runs use the same executor. React Number conversion is only chart rendering.

Blue, rural/seasonal/test exceptions, loss-adjusted raw readings, mixed-rate cycles, gross bill/tax reconstruction, national tariff validation, CCEE, forecasting, procurement and contracting advice are excluded. Optional future stress mode was deferred.

## 8. Independent oracle

An independent reviewer authored the reference before viewing the application or using its DB. Decimal precision64 and a separate Fraction/integer-cent cross-check froze answers independently. The eligibility mask follows observed parser coverage without repairing fields. Text freezes and the independent arithmetic script are committed; original corpus/generator remain outside Git. [Oracle](oracle.md) records hashes and reproduction.

All **34 hand assertions** and **469 covered component pairs** passed. Engine tests compare six authentic scenarios and monthly results; the authenticated API test compares all61 actual curve points against frozen expected data. Invalid assumptions, equality/just-over boundaries, old/new tariffs and missing evidence are separately exercised.

## 9. Actual scenario results

All amounts below are the same **7/12-month tariff-only subtotal**, not a complete annual invoice.

| Candidate kW | Modeled subtotal BRL | Delta to280 BRL |
|---|---:|---:|
|280 baseline|31474.94|0.00|
|260 lower|33118.97|1644.03|
|270 oracle comparison|32022.14|547.20|
|300 higher|31934.59|459.65|
|280.45 boundary|31474.94|0.00|
|280.46 boundary|31048.73|-426.21|

The61-point explored range220–340kW in2kW steps has its lowest **sampled** point at288kW:30938.69BRL, delta−536.25. It is not a continuous optimum or contracting advice. ForFebruary M294.48/T15.20: C280 gives4476.10+440.19=4916.29; C260 gives5524.29; C300 gives4560.00. C280.45 still triggers at threshold294.4725; C280.46 no longer triggers at294.4830.

## 10. Delivered interaction and measurements

Review Desk's contextual **Planejar a partir deste estado** opens three linked working panes: observed history/gaps, precise input+accessible slider with demand and cost charts, impact+assumptions+selected proof. Candidate starts from real retained280.00kW with zero financial rekeying. Selected month propagates into calculation/source proof. Conflicting invoices with the same month retain independent source selection. EXPLORING and PRESERVED SCENARIO are distinct. Edits do not overwrite saved branches; duplicate and comparison work.

Automated local instrument sample, saved in outside `browser-evidence/interaction-metrics.json`:

| Boundary | Samples | Observed range ms |
|---|---:|---:|
|Planning component mount → first useful frame|10|403.2–982.1|
|Candidate change → numerical response, including120ms debounce|14|203.0–492.8|
|Candidate change → visual frame|14|208.6–1230.2|
|Month selection → proof frame|2|152.1–859.2|

These are automated local interactions, including background in-app rendering variability. They are not full cold login/page-load times or human productivity measurements. No spreadsheet baseline was timed, so no time-saving claim is made. Two import batches/four files; zero baseline financial values manually entered; two recognized layouts reused; two explicit applicability acknowledgements. One month click reaches inline proof; one additional original-opening click remains policy-blocked.

## 11. Lineage, history and exact export

SourceVersion/confirmation → exact existing reviewed Close StateVersion → new AssumptionSetVersion → Scenario → ModelRun → Result. Documents are referenced, not copied into a planning source store. Every run binds decimal/unit/rounding policy, source/rate/reference/confirmation versions, baseline identity, assumption values and exact model implementation. Later corrections append state; stale baseline is flagged and historical branching needs acknowledgement. Old results/replays/JSON exports use frozen inputs, never latest tariffs/state.

Human scenario names may repeat; internal identities remain unique. Numeric280 and280.00 contracts compare equal, while original frozen spelling is retained for historical replay. Transaction-scoped receipts bind workspace/review/baseline/body; committed-response-lost save and duplicate retry return the original branch/run. Alpha cannot mutate reserved planning assumptions or bypass planning lineage/replay gates.

## 12. Browser workflow actually exercised

Normal QA signup/login, empty review, actual original+sidecar upload, proposed context, nine eligible candidate confirmations, two independently projected tariff reference confirmations, saved reviewed state, exception note/treatment and saved Close ZIP. No financial rows were preinserted or manually repaired. Contextual planning action,280/260/300, two near-threshold candidates, saved baseline+alternatives, duplicate, comparison, blank input error, keyboard input/slider, rapid330-preview→260-scenario switch, refresh, exact replay and JSON download were exercised in the actual in-app browser.

Retained280 scenario replay was repeated after the final equivalent-decimal fix/backend restart: **identical**. Alpha guided V1=10/A1=2/R1=20 → V2=12/R2=24, historical reconstruction/replayMATCH, Analysis Workspace evidence-authoring form, Scenario Studio form and History Compare20→24 were checked separately. Advisory's existing illustrative queue route loaded normally; no Advisory document access or writes.

Both1440×900 and1920×1080 were measured in light and dark; document scrollWidth equals viewport width in all four combinations. At1440 the baseline, decision, impact and compact selected proof fit; baseline list has deliberate internal scrolling. Comparison requires a short page scroll; no horizontal overflow. Expanded formula proof fits1920. Loading and empty/invalid states were observed. Dark SVG axis selectors were corrected for current Recharts tick classes after visual inspection.

Production-build route was opened in a temporary loopback-only preview and returned NotFound. Production JS search found zero planning route/model/UI identifiers. That preview was stopped. Backend8074/frontend5182/disposablePG55472 remain local for Founder evaluation, with current PID/stop instructions in [README](README.md).

**Outstanding:** clicking the original authenticated PDF link was rejected by browser automation security policy for `blob:` navigation. Inline text/raw locators, formula and version proof were inspected; actual PDF-tab navigation was not claimed successful. Manual Founder verification is required.

## 13. Hostile product review / Excel

- Baseline reuse is real: exact existing StateVersion and source links; no hidden financial rekeying or second source store.
- The question is economically meaningful as historical sensitivity of demand cost and strict overrun crossings, within a narrow tariff basis. It does not answer the whole contractual decision.
- Excel can express this short formula quickly if already given clean eligible rows. No controlled human Excel benchmark was performed. Ariadne adds reviewed evidence, explicit gaps, frozen semantics, traceable branches, transactional retry and exact historical replay/export.
- A month click reaches proof immediately; the original page link exists but automatic opening remains unverified. This prevents product PASS.
- Comparison exposes candidate kW and both acknowledgement choices; preserved names/results survive switches and editing.
- The chart reveals threshold jumps and the sampled cost tradeoff; unsupported physical bars are visibly translucent and uncovered months remain listed.
- “Lowest modeled cost” still risks being mistaken for advice. UI explicitly says no recommendation and partial scope; qualified interpretation remains necessary.
- A real energy manager could use this as bounded historical evidence during a meeting, but no manager usability study/client deployment was performed. That is an inference, not measured adoption.
- The working surface is an evidence/decision/proof instrument with two useful charts, not a generic KPI-card dashboard. Density and proof were checked at required sizes.

## 14. Partial and adverse behavior

Missing/ambiguous demand/contract, units, scope, modality, references, authority, effective dates and supplier identity refuse or leave visible uncovered monthly records. Duplicate periods do not silently choose a winner. Superseded source versions are excluded in a new reviewed state; old states remain retained. Every money aggregate states monetary coverage; physical counts state their independent denominator. Blank is not zero. No incomplete total is presented as annual.

## 15. Security and isolation

Existing authenticated sessions and server-derived operator/workspace ownership are reused. Route-scoped feature/production/auth/workspace/baseline checks precede application body buffering. Result/preview/compare/replay/export IDs must belong to the exact owned baseline. Foreign IDs, expired session, non-operator, disabled and production gates, oversized/active/hidden files and formula handling remain covered by the full suites. No parallel auth, arbitrary remote source fetch, new cloud/provider, public originals, destructive API or migration was added. Original storage/renderer guards and lifecycle retention boundaries are unchanged; local storage is not a production-readiness claim.

## 16. Fresh verification

| Gate | Passed | Failed | Skipped | Evidence |
|---|---:|---:|---:|---|
|Full Python suite, disposable PostgreSQL17.11|486|0|0|119.17s, includes65 new planning tests and existing Core/Operator/Close/Argos/Advisory|
|All frontend Node tests|81|0|0|fresh complete run, includes5 planning behavior regressions|
|Standalone independent hand oracle|34|0|0|no application imports/DB/output writes|
|Independent rational component checks|469|0|0|separate reviewer freeze|

Real `npx tsc -b`, production build, compileall and `git diff --check` passed. Design detector:756 files,25 existing P2 informational findings, zeroP0, exit0. One Alembic head0016; clean disposable evaluation upgrade and full test upgrade/lifecycle from retained synthetic Alpha history passed. No DB-gated skip was counted as a pass. Existing build warnings remain: old Browserslist data, unrelated CSS comment, Atlas static/dynamic import and large chunks. No dependency/version/configuration change was made to fix unrelated warnings.

The final dark-axis change is CSS only; type/build and visual gates were repeated. Final shared registration formatting was restored without behavioral change. Independent code review ended without actionable remaining defects after fixes for date coherence, precision bounds, context/receipt binding, async races, reserved identity guards, equivalent contract spelling and duplicate-source proof selection.

Browser original-source opening: **one blocked verification**, separate from automated test failures/skips. No other known failing engineering test remains.

## 17. Screenshots / local evidence

Authentic screenshots are outside repository/webroot at `C:\dev\ariadne-planning-public-evaluation-20261003\browser-evidence`: `baseline-1440-final.jpg`, `lower-1440-final.jpg`, `higher-1440-final.jpg`, `selected-proof-1920-light.jpg`, `comparison-1920-final.jpg`, `dark-1440-contrast.jpg`. Captures were inspected; intermediate loading-state captures are not the final evidence. They contain authentic public-case observations, not synthetic product KPIs; no original PDF pixels or client documents were committed. Local JSON export is `C:\Users\aquil\Downloads\planning-scenario.json`; Close package is `ariadne-review-aa3613d8-44bf-4f00-ae63-25d5e18aaf4a.zip` in the same download directory.

Evaluation identities, kept here only for local reconstruction: workspace`f0b06be8-65cd-5988-9452-ffa3576e1959`, review`9f7f17cd-208e-4418-ab70-c57fb75d13be`, baseline`b3137f69-1928-44bd-8258-70af062007ae`, state`6da9d36d-0676-4ca3-9e51-3f0ebfee6eb0`, preserved280 result`7aa76674-b09d-49ed-8e73-ec302a469d64`. UUIDs are not authority and are absent from primary UI labels.

## 18. Changed files / review map

Backend: new `ariadne_demand_intake.py`, `ariadne_planning_engine.py`, `ariadne_planning.py`, planning router. Minimal integration in `app/main.py`, Close router/confirmation/intake/inspection, Core exact executor/result key and Operator reserved-model guards. No schema or auth/deployment files.

Frontend: new planning API/selection helpers, `AriadnePlanning.tsx`/CSS; small Close API, desk selection, Review Desk contextual intake/action and OperadorRouter gate integrations. No unrelated product logic.

Tests: planning engine/intake/API/independent script and two frozen JSON answer sets; one frontend behavior suite. Local test-directory Git attributes preserve LF byte hashes for both oracle freezes even on Windows. Documentation: this report, README, frozen contract, ADR, source/method catalog and oracle. Staged paths are explicit. No original corpus, derivative, screenshot, database, dependency tree or secret is staged.

## 19. Limitations and qualified review

This adapter supports one tested historical Enel A4-green scan form and declared ordinary table layouts, not upload-anything/OCR. Seven monetary months are insufficient for a complete annual decision. Scanned proof quality, missing classification/contract exceptions, exact tariff/regulatory applicability and legal rounding require a qualified professional. A real reference case, contract evidence, authorized organizational source review and measured human usability are still needed before commercial/client decisions. No CUSD, taxes, full invoice reconciliation or source-truth certificate is claimed.

## 20. Acceptance verdict

Criteria1–6 and8–14 have concrete engineering/browser evidence within the declared partial scope. Criterion7's inline rule/calculation proof works, but automatic original-PDF page opening was security-blocked. Therefore **ARIADNE CONNECTED PLANNING BLOCKED**, pending that manual evaluation. Engineering completion is not commercial/regulatory/reference-case approval. This delivery ends here, without Contract Intelligence, merge or deployment.

## November 2026 closure revalidation — 2026-11-15

**ARIADNE CONNECTED PLANNING REAL-WORLD PASS**, limited to this engineering evaluation. The Founder manually opened the authenticated original from the February 2020 Planning proof via **Abrir fonte original · página 14** and confirmed it opened. This resolves the October product acceptance blocker. The automated browser restriction was not bypassed. The proof shows 294.48 kW observed demand and uses a separate BRL 15.20/kW tariff reference; the latter need not appear on the invoice.

**Usability follow-up:** the Founder had difficulty finding the link because it looks like plain text. Make the action visibly identifiable as a link in a later UI change; this documentation-only revalidation leaves the interface unchanged.

The development wave remained at `17319a70829e3811374c08be994d858347782a55`; no rebase. The executable head tested was `03e236db7d31dd9c3bdc916aa6c919b0490dc5a8`. The October Sobral/ARIS evidence, ANEEL original/derived inputs, frozen methodology and oracle hashes were checked without downloading replacements.

| Fresh gate | Pass | Fail | Skip |
|---|---:|---:|---:|
| Full Python on disposable PostgreSQL 17.11 | 486 | 0 | 0 |
| Authentic corpus-dependent tests, included above | 11 | 0 | 0 |
| All frontend tests | 81 | 0 | 0 |
| Exact replay of the final evaluation databases | 11 | 0 | 0 |

The retained replay covered 2 Close, 4 scalar and 5 Planning results. The two Close reference exports and the preserved Planning baseline export also matched the retained and replayed outputs and exact lineage IDs. The broader diagnostic found eight pre-commit records in a separate disposable prototype database with Decimal precision 40; the unchanged published Close v0.1 executor correctly rejects that configuration (precision 48). Those records were neither rewritten nor counted as passing the replay gate.

`compileall`, `npx tsc -b`, `npm run build`, development-only bundle exclusion, design detector (0 P0, 25 existing informational P2), and `git diff --check` passed. Alembic remains at `0016_ariadne_close`. No dependency or runtime changes were made; the pre-existing Browserslist data warning advanced from eight to nine months. The closure changes only documentation.

Sobral remains an engineering/reference fixture, **not the adopted NIV-18 Golden Dataset**. Commercial, regulatory and reference-case gates, including NIV-18/19/20/50, remain intact. No change to production, no merge or deployment, no Notion/Linear edits and no Contract Intelligence work.

## Targeted correctness hardening — 2026-11-17

**ARIADNE CONNECTED PLANNING TARGETED HARDENING PASS**, bounded to the two reviewed defects and exact historical compatibility. This supersedes the earlier claim that missing supplier identity always refused monetary eligibility. It does not constitute product acceptance, tariff/legal approval, Golden Dataset adoption or authority to merge/deploy.

### Git and ownership

Fetched integration base remains `17319a70829e3811374c08be994d858347782a55`; PR #30 started clean at `c27e87afcb1fcf39bd787c38dbd3cdd5636373f8`. No rebase was needed. Implementation/test commit: `08922f223d0e38b64feee7fd84517489da5e8072`. Documentation follows in a separate commit; final head is recorded in the PR replies and delivery. Same isolated branch `codex/ariadne-connected-planning-v0`, same [PR #30](https://github.com/aquilesguerretta/Nivar/pull/30).

CREATE/MODIFY for this patch: versioned Planning executor, minimal Core dispatch and Planning service integration, Planning regression tests, these engineering documents. READ ONLY: intake/confirmation, auth, Close/scalar executors, frozen methodology and independent corpus/oracles. NEVER MODIFY: PR #31/worktree, shared Operator UI, other products, deployment, migrations, production or canonical decisions. PR #31 head remains `2b0146d8fd5454d486bd8df04575513817f52f96`; no synchronization or rebase of that stacked branch was performed. PR readiness is unchanged, not automatically granted by these tests.

### Reproduction and correction

1. **Identity:** 0.1.0 compared `supplier_cnpj` directly with `distributor_cnpj`. `None == None`, empty strings and identical malformed strings could establish a match. The reviewed empty/empty example reported BRL `4256.00`, physical 1/1, monetary 1/1, complete=true. 0.1.1 requires valid supported numeric CNPJ structure/check digits and matching canonical identifiers. Its same example has physical 1/1, monetary 0/1, complete=false, cost/baselineCost/delta=null and an explicit identity reason. Conventional formatted and unformatted valid identifiers compare without mutating raw values. No inference, defaults or identity borrowing is introduced. Applicability acknowledgement remains a separate assumption.
2. **Period:** 0.1.0 rejected the whole baseline if any nonempty monthly string was malformed, even on an excluded row. 0.1.1 validates each row separately. A valid month plus `2019-13` now yields physical 1/2, monetary 1/2, complete=false and BRL `4256.00` from the valid month. The invalid observation stays in `months` and the denominator, with `period:null`, exact raw value, source/confirmation reference and validation errors. It is neither repaired nor used as a valid month/observed contract. Duplicate valid periods still exclude both observations; conflicting valid contracts still refuse execution. A baseline without a usable confirmed monthly contract fails closed.

Before implementation, the initial focused matrix produced **21 failed / 7 passed / 0 skipped** against 0.1.0. Two further failing tests exposed contamination of contract selection by an invalid-period row. A separate failing PostgreSQL/API regression exposed new eligibility checks blocking retained 0.1.0 reads; historical listing/result/export/replay now bind retained Close lineage instead. New preview/save/duplicate still validate with 0.1.1. Final regressions pass below. None of the independent financial expected answers was edited.

### Version and retained replay

Read-only inspection before editing found **five persisted Planning 0.1.0 runs** in the local evaluation environment. The correction therefore appends model `demand_contract_screening` / `0.1.1` / `ariadne.plan.demand_contract_screening.v0_1_1` using the existing registration path. No migration/backfill or stored-data rewrite. The 0.1.0 executor file is byte-identical; its SHA256 is recorded in the [ADR](adr-001.md#addendum--2026-11-17-preserve-010-register-011). Core requires exact metadata and policy per version, rejecting unknown versions or mismatched contracts/implementation. Authority policy, formula, Decimal precision 48 and HALF_UP component rounding are unchanged.

Before/after read-only transactions in `ariadne_close_planning_browser` and `ariadne_close_review_desk_final_browser` replayed **11/11** retained results: **5 Planning, 2 Close, 4 scalar**. Canonical hashes of outputs, inputs, state/assumption/model identities, contracts and execution configurations matched exactly. Disposable API regressions additionally persist a synthetic defective 0.1.0 result and prove exact read/replay/export beside a corrected 0.1.1 result; a duplicate calculates 0.1.1 with its old parent retained. Another synthetic legacy result whose period fails current eligibility remains listable/readable/replayable/exportable while a new preview refuses that unusable baseline.

Historical replay intentionally reconstructs the old defective coverage decision when that is what was saved. It is not financial certification. A correction requires a new calculation; this patch does not backfill old results or add a warning/redesign UI.

### Authentic frozen regression

No replacement downloads. October PDF SHA256 remains `1d9b1eba3b46dd1b6f492b4fc7060799f0821b0b3b10d7e4753c2097c2ea822c`; tariff projection remains `99e5eb7230ec86e996eb6cbbfff9491c20675182dff994c7116e985886a9d30a`. Both independent oracle hashes in [oracle.md](oracle.md) match their original freezes. Six scenarios, monthly amounts, deltas and the HTTP 61-point curve passed against those independent answers.

| Candidate kW | Physical coverage | Monetary coverage | Covered historical subtotal BRL |
|---|---|---|---:|
|280|9/12|7/12|31474.94|
|260|9/12|7/12|33118.97|
|300|9/12|7/12|31934.59|

These remain partial pre-tax tariff-reference subtotals, not complete invoice values, verified savings or recommendations. Sobral is an engineering/reference fixture, not NIV-18's adopted Golden Dataset. Olivina Azul is not ingested or qualified by this correction.

### Fresh verification, final tree

| Gate | Pass | Fail | Skip |
|---|---:|---:|---:|
|Focused correctness matrix|45|0|0|
|Planning engine/intake/API, including focused matrix|119|0|0|
|Full Python on disposable PostgreSQL 17.11|540|0|0|
|Core subset of full Python|19|0|0|
|Close subset of full Python|219|0|0|
|Operator subset of full Python|21|0|0|
|Authentic corpus-dependent subset of full Python|11|0|0|
|All frontend Node tests|81|0|0|
|Standalone independent hand assertions|34|0|0|
|Retained exact replay/hash comparison|11|0|0|
|Actual production-build route exclusion in Chrome|2|0|0|

Rows are overlapping gates/subsets, not an additive test total. Final full Python: 150.51s, 126 dependency deprecation warnings. The disposable target was exclusively `ariadne_close_test` on loopback port 55472; existing upgrade/lifecycle tests, retained synthetic Alpha history, session/ownership, request-ordering, retry safety, historical export and production/disabled gates all ran. No database-gated or authentic-corpus skip. Existing retained evaluation databases were inspected with read-only transactions only.

`compileall`, real `npx tsc -b`, `npm run build` (43.97s), design detector (756 files, zero P0, 25 informational P2) and `git diff --check` passed. No dependency/runtime changes: Python 3.12.14, SQLAlchemy 2.0.54 and PostgreSQL 17.11. Existing build warnings remain: old Browserslist data, CSS comment, Atlas static/dynamic import and large chunks. The runtime's expected Playwright browser binary was absent; the gate used installed Chrome 157.0.8103.51 via Playwright's Chrome channel, without installing or changing dependencies. Both experimental routes returned NotFound in the actual default production build. API and external requests were intercepted, with no backend/production access.

This patch changes no UI. Browser work was limited to production exclusion; the older complete-workflow/Founder usability evidence above was not relabeled as fresh. No new usability or time-saving claim. Task-owned preview on `127.0.0.1:5191` was stopped; pre-existing local evaluation services were left untouched. Local replay manifest, JUnit and gate artifacts are outside the repository at `C:\dev\ariadne-close-browser-fixtures\pr30-hardening`.

### Changed files and remaining boundary

- `app/services/ariadne_planning_engine_v0_1_1.py`: corrected version; original executor retained.
- `app/services/ariadne_core.py`: exact dual-version dispatch.
- `app/services/ariadne_planning.py`: new writes select 0.1.1; historical reads preserve lineage access.
- `tests/ariadne_planning/test_correctness_hardening.py`: identity/period/contract/duplicate/metadata matrix.
- `tests/ariadne_planning/test_api.py`: actual intake, confirmation, persistence, historical replay/export and mixed-version tests.
- `tests/ariadne_planning/test_engine.py`: run existing independent financial regressions on 0.1.1; missing-period test retains another usable month to inspect the excluded row.
- `docs/ariadne-planning/engineering-contract.md`, `adr-001.md`, `final-report.md`: amendment, version rationale and evidence.

Numeric CNPJ validation does not verify an authoritative business registry or external tariff applicability. Unsupported identities remain uncovered, and no broader identifier adapter is added. All prior partial-coverage, professional/regulatory, rights, commercial and reference-case limitations remain. No new domain, ingest adapter, schema migration, shared Operator/Argos/Advisory changes, PR #31 changes, production changes, canonical changes, merge or deployment.
