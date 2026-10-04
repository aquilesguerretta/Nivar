# Review desk — frozen correction contract

Base: development wave `04150fea408ede94f4e1e7ab647e10687a0978bf`. Development only; no production/canonical gate changes.

CREATE/MODIFY: close intake/services/routes/UI/tests/docs, two page-rendering dependencies, and minimal exact Core executor registration. READ ONLY: existing auth/session, upload guards, scalar/v0.1 executors, tokens/charts, Alpha/Advisory infrastructure. NEVER MODIFY: historical migrations0012–0015 (or0016 in this wave), deployment settings, production, canonical gates and other-product logic/client files.

## Intake v2

Authenticated, owned-workspace inspection precedes review creation. Original bytes are imported unchanged after human context/role confirmation. Inspection is ephemeral until import; a refresh before import requires reselecting the file. It uses the same isolation, active-content, archive, XML, size/time and authorization boundaries as strict intake.

Strict intake remains the default for legacy callers. Opt-in inspection inventories passive XLSX sheets/cells, detects bounded literal header/data regions below titles, and preserves absolute sheet/cell locators. Merged presentation headings and unrelated formulas do not invalidate clean regions. Formula expressions/caches are displayed as unverified and cannot become eligible inputs. Hidden sheets/rows/columns and merged data remain visible with eligibility errors; nothing is silently stripped. Invalid XML booleans reject. No macro, external connection/link, embedded active object, OCR, LLM or URL fetch.

CSV retains original headers/values. Official ANEEL headers propose contextual tariff evidence; validity dates are not a billing month. Native Enel Ceará B3 invoice layout v1 is the only automatic PDF field adapter in this wave: it requires the distributor, table headers, unambiguous reference/account and complete supported billing-section syntax. Other/scanned PDFs remain preserved and explicitly unsupported for automatic fields. Proposals retain page/text offsets and need confirmation. No filename-derived financial facts.

## Checks v0.2

Keep exact v0.1 executor/metadata for retained replay. Register v0.2 separately, with a fixed observation normalization policy. Supported observed invoice checks: displayed quantity × displayed rate; complete recognized section subtotal; complete displayed signed subtotals versus displayed invoice total. Decimal strings, precision 48, HALF_UP cents; no tax/rate interpretation. Unknown tax basis is retained as unknown and **never** eligible for independent comparison. Observed invoice quantity is never independent measurement. Unsupported/missing operands produce NOT VERIFIABLE; no extrapolated total. Existing canonical quantity/price checks delegate to frozen v0.1 semantics.

ANEEL rows are acknowledged context, never automatic independent price. No complete TUSD/TE, flag methodology, tax, discounts, CCEE, availability entitlement, contract or compliance audit.

The native invoice factors have **no established line units**; their product is displayed internal arithmetic only, without dimensional conversion. Opt-in table normalization accepts explicit comma/dot grouping only when a fractional separator and valid grouping pattern disambiguate it; raw strings/origins remain frozen. Ambiguous single separators and blanks retain existing rejection semantics. Excluded formulas without caches still prevent claiming source completeness.

## Real source expectations (independently read from public originals)

ARIS physical page 190 (printed 189), invoice 131111946, reference 09/2021: availability 76.73; red flag displayed 100.000 × 0.13350 = 13.35; gross benefit 4.89; subtotal A 94.97; net benefit and subtotal B −3.54; displayed total 91.43. Internal expected checks: 13.35, 94.97, −3.54, 91.43; differences 0.00. All seven observed rows are NOT independently verifiable. Meter panel's own zero reading and invoice billed 100 are distinct, neither an independent file. ANEEL B3 conventional TE 257.20/TUSD 331.58 BRL/MWh is context only, with competing white/prepayment records retained.

## History and interaction

Candidate, validation, human confirmation, computation and treatment stay separate. Context acknowledgement freezes raw rows/classification; remains noneligible. Every confirmed observation/mapping/region and attributed provenance is included in Core versions and exact saved execution inputs. Treatment never changes arithmetic. Export/replay uses saved inputs, never latest source/context. Consequential writes retain transactional receipts; parser mode/provenance enter request fingerprints. URL/UUID context selection uses stale-response guards. Internal identities appear only in advanced history.

Public evaluation artifacts remain outside repository/webroot. Source metadata is attributed, not a cryptographic authenticity certificate. Original/source hashes, acquisition times and derivative/filter rules accompany the package. Human usability is assessed separately from measured browser automation.

Private page preview reuses source ownership/auth/development checks and returns only `no-store` raster images. It runs native rendering in a disposable process with a10s deadline, two local slots,1600px output limit,8MiB encoded output and conservative image/decompression budgets. Form XObjects and unsupported codecs/layouts remain downloadable but cannot be rasterized by this renderer. It initializes no form environment, executes no scripts, performs no OCR and fetches no URLs. It is not an OS-level memory sandbox or production-storage claim.
