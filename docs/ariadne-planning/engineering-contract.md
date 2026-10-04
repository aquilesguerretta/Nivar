# Connected demand planning v0 — frozen engineering boundary

Base: `17319a70829e3811374c08be994d858347782a55`. One private, development-only historical demand-contract screening job. No deployment, commercial activation, canonical gate change or recommendation.

## Ownership

CREATE/MODIFY: Ariadne planning services/router/UI/tests/docs; limited Group A inspection and Review Desk connection; minimal Core executor/result-key and router registration. READ ONLY: auth/session, private uploads, scalar and Close executors, existing design/chart infrastructure. NEVER MODIFY: production/deployment, historical migrations, Argos/Advisory/Alexandria/public product logic, canonical decisions, client documents. Root owns implementation; independent source, authority and oracle work remains outside the repository and uses no shared database.

## Evidence and intake

The primary corpus is the authentic Sobral public PDF, outside repository/webroot, with acquisition metadata/hash and physical pages. Its scans have an existing noisy invisible searchable text layer. Read that layer without running OCR; extract only a narrowly recognized Enel Ceará Group A form and preserve exact text/position locators. Every proposal needs human source review. Unknown/ambiguous cells remain missing, never zero or copied from another invoice. Repeated history grids are not additional invoices. Unsupported pages remain visible. No formula execution, external provider or source URL retrieval.

Monthly facts retain billing reference, actual reading interval, scope, modality, observed cycle demand, original contracted demand, source version and confirmation. Recognized invoice rate/charge text remains raw contextual evidence; the monetary model does not normalize or consume it. Source extraction is not independent measurement verification. Private originals and page-preview safety limits remain intact.

Ordinary visible CSV/XLSX demand tables require exact headers `scope,period,demand_kw,contracted_kw,demand_unit,modality`; validation also requires `subgroup=A4`, `modality=green`, `demand_unit=kW`. For monetary eligibility supply `reading_from,reading_to,distributor_cnpj` with ISO dates and the exact distributor identity. Tariff tables require `supplier_cnpj,subgroup,modality,class,subclass,detail,time_band,unit,rate,currency,basis,effective_from,effective_to,authority,reference_id,rate_kind`. These layouts use literal nonnegative decimal-point strings with at most six fractional digits; ambiguity, blanks, incompatible metadata and hidden/active spreadsheet layouts are rejected or remain explicitly invalid. Existing raw row/sheet/cell locators are preserved. The narrow scanned Enel form additionally recognizes its tested decimal-comma contracted-demand cells; this is not generic PDF or locale inference.

## Method and financial gate

Historical screening under explicitly acknowledged normal non-rural/non-seasonal/non-test conditions only. REN 414/2010 articles 93 and 104, amended by REN 418/2010 and 479/2012; green single demand rate under article 56; normal minimum 30 kW under article 63 as amended by REN 714/2016. Primary DOU acts, hashes/effective dates and limitations are retained in the local authority package. The reviewed policy window is March 2019–February 2020, not a claim of unlimited legal validity.

For supported M (kW), hypothetical C (kW, >=30) and compatible T (BRL/kW): billable quantity=max(M,C); overrun triggers strictly when M>1.05*C; additional overrun is 2*T*(M-C), not excess above 105%. Green cycle maximum is not the sum of peak/off-peak. Blue, special regimes, raw readings needing loss correction and legal/tax reconstruction are excluded.

Monetary implementation additionally requires verified tariff semantics and applicability. Invoice-observed taxed/untaxed rates remain distinct from an authoritative pre-tax reference. A tariff must cover the actual whole reading interval. Cross-rate cycles remain monetary NOT COVERED until a verified day-allocation method exists. May 2019 crosses 22 April and is excluded from initial monetary coverage. Missing/ambiguous facts, conflicting units/modality, duplicates, corrections and absent authority/rates remain visible with reasons. Never produce a complete annual total from partial coverage.

Exact server Decimal, precision 48, HALF_UP cents per regular/overrun component, monthly sum of those rounded components, aggregate of covered monthly outputs. Threshold comparisons never round first. This rounding is engineering policy, not an asserted legal rule. No React financial math. Authoritative previews and preserved runs call the same implementation.

## Continuity and preservation

Planning references the exact Core state version of a preserved reviewed Close result; it does not copy documents into another database or mutate observed state. Each saved branch creates its own assumption version, Scenario, ModelRun and Result, binding the same baseline. Duplicate branches preserve parent identity and prior inputs/results. Exact metadata, authority/rate/source/confirmation versions, assumptions, units, rounding and coverage are preserved. Replay never reads latest data. Later reviewed corrections may mark an old baseline historical; retained scenarios remain reconstructible.

Consequential writes use existing transaction-scoped workspace receipts. Known UUIDs confer no authority. All paths derive context from authenticated operator/workspace ownership; result/scenario checks include baseline binding. Preview is read-only, bounded and cancellable; stale responses cannot replace a different candidate/month/scenario.

## Acceptance

Authentic file import/review without financial re-keying; contextual planning action; interactive candidate; physical and supported monetary month effects; exact proof; baseline plus two saved alternatives, comparison, refresh and replay. Show EXPLORING versus PRESERVED, explicit coverage and assumptions, and “lowest modeled cost in explored range”, never a contract recommendation. Independent oracle, real browser, full disposable PostgreSQL/frontend/type/build/design gates and hostile product review are required before PASS. Optional future stress mode is deferred.
