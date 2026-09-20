# Terminal Brasil — G2.3 research and implementation plan

Read-only research conducted 2026-09-12. Repository inspected at `67f3074bd5197e2f18b9ea084501acf989c024e3`, on `wave/nivar-g2-dream-build`. The root agent owns preservation and any subsequent Git operations. This subtask did not change runtime, backend, shared geography, Alexandria, or Git state.

## What exists

`src/pages/br/PortalBRRouter.tsx` mounts the public `/br/terminal` route directly. `src/pages/terminal-brasil/TerminalBrasil.tsx` is approximately 1,240 lines and contains the route adapter, compact preview, workspace, chart, map, notes, source dialog, and exports. Its local `sample.ts` holds all market-like observations. No request to an ONS, CCEE, EPE, or Brazilian market API occurs in this Terminal. Existing `/api/lmp` and `/api/atlas` routers explicitly serve PJM/HIFLD data; they cannot supply Brazilian observations by changing labels.

The sample supplies four regions, three metrics, and three windows:

| Item | Actual provenance / behavior |
| --- | --- |
| Price | Authored synthetic reference price in R$/MWh; explicitly not PLD, forecast, or executable quote |
| Load | Authored synthetic load in GW; not SIN measurement |
| Storage | Authored synthetic percentage; not observed EAR or reservoir measurement |
| 24h | 24 authored hourly values on 2026-09-10, UTC−03:00 |
| 7d and 30d | Daily observations from independent fixed daily profiles; 7d is the exact tail of 30d |
| Regional differences | Deterministic scale/offset/sine adjustments, not measured market separation |
| Notes | Three illustrative hypotheses per metric at proportional positions; not dated actual events |
| Geography | Existing IBGE-derived local paths, separately sourced from the synthetic values |
| Source absence | Explicit mode suppresses curves, values, reading and CSV export |

There are already region, metric and preset-window controls; a click/range probe; region sparklines; three notebook hypotheses; a searchable source dialog; and a CSV of the primary selected series. A disclosure table exists below the notebook in full mode, but it is not a primary chart/table workspace representation and its rows do not inspect observations.

The selection continuity added in G2.2 is valuable: region and metric changes preserve the inspected timestamp; daily window changes retain it when included; chart, observation glass, scrubber, reading record and source dialog refer to the same observation. The compact `TerminalPreview` is used inside `AriadneJourney.tsx`, and `onEntryUrlChange` exports the current embedded state for the full-screen link. `TerminalThreshold.tsx` also creates observation deep links. Preserve these interfaces.

The full route only **reads** URL query parameters at entry. Changing its controls does not update the current address; there is no share button or Terminal-specific saved workspace. The existing US `savedViewsStore.ts` uses localStorage, but its `ViewSnapshot` and route enum are US-shell-specific. Reusing it as-is would misclassify `/br/terminal` as `nest` and needlessly broaden shared-file ownership.

The inspected G2.2 screenshot has a convincing three-plane instrument: small spatial rail, larger recessed chart, independent reading rail. Keep its graphite/espresso/aubergine material hierarchy. Do not replace this with a flat generic dashboard. The rejected brand-facing crosshair is in `.g2t-product-mark`; utility probe icons serve a different role and may remain useful.

## Research decisions

### Koyfin: make analysis editable and returnable

Koyfin's documented Historical Graph separates a Series Manager from the plotted output. The manager adds/removes series; templates retain analysis settings; Show Table inspects underlying values. Its newer My Graphs saves full chart state, while templates intentionally omit the primary instrument. This distinction suggests one compact NIVAR comparison manager and explicitly local saved analyses, rather than a speculative configurable dashboard system. [Historical Graph](https://www.koyfin.com/help/charts-and-graphs/), [My Graphs](https://www.koyfin.com/help/release-notes/my-graphs/).

### OpenBB: one analytical focus drives all representations

OpenBB documents parameter linking: changing a shared parameter updates grouped widgets together. NIVAR already has the beginnings of this with its selected observation. Extend that same selection model to comparison lines, table rows, spatial values and provenance; do not create independent state in each panel. [Interacting With Data](https://docs.openbb.co/workspace/analysts/widgets/interacting-with-data).

### OWID: preserve dataset identity across views and export

OWID's Chart API exposes entity, time, representation, focus and source-overlay parameters. It separately exports data and metadata. The transferable mechanism is a canonical view state plus a single displayed dataset, from which chart, table, spatial view, share URL and download are derived. This is stronger than adding an unrelated table or map beside a chart. [Chart API](https://docs.owid.io/projects/etl/api/chart-api/).

No OWID Grapher package should be installed for this work. The current official FAQ distinguishes studying its code from permission to reuse it; the existing Recharts dependency already covers NIVAR's needed mechanisms. [OWID software FAQ](https://ourworldindata.org/faqs).

### Bloomberg and LSEG: useful professional depth, bounded to this product

Bloomberg's chart tools emphasize comparison, annotations, templates, export and contextual maps. The relevant lesson is an analysis that can be examined and communicated. Their trading/backtesting/collaboration claims are not capabilities NIVAR currently has. [Bloomberg Charts](https://professional.bloomberg.com/products/bloomberg-terminal/charts/).

LSEG documents saved layouts containing selected analytical panels. NIVAR can provide a focus mode and a useful saved analysis without implementing a drag-and-drop multiwindow workspace. [LSEG layout guide](https://www.lseg.com/content/dam/data-analytics/en_us/documents/support/workspace/administration-panel-configuration-guide.pdf).

### Yes Energy: energy meaning comes from joining evidence

PowerSignals combines interactive maps and charts for prices, outages, constraints, transmission, generation and weather, with drilldown into underlying data. The useful principle is a shared entity/time context across evidence. NIVAR's fixture has no observed outages, weather or network flows; adding fake event feeds or live alerts would undermine that principle. [PowerSignals solution sheet](https://www.yesenergy.com/hubfs/Updated%20Solution%20Sheets/PowerSignals.pdf).

### EPE Webmap and ANEEL GGT: spatial data is a distinct layer contract

EPE Webmap supports queries, vector/raster downloads, measurements, user-added data, WMS and metadata. Existing and planned energy infrastructure are separate groups. This research argues for explicit layer catalogs, feature identity and provenance, not decorative infrastructure nodes drawn onto NIVAR's map. [EPE Webmap description](https://www.epe.gov.br/en/publications/publications/webmap-epe).

The real public service inspected is [WMS_Webmap_EPE_Data](https://gisepeprd2.epe.gov.br/arcgis/rest/services/WMS_Webmap_EPE_Data/MapServer). Relevant layer IDs: existing hydro 16, wind 14, photovoltaic 15, substations 22, transmission 23; planned hydro 3, wind 1, photovoltaic 2, substations 9, transmission 10. The service uses EPSG:4674 and reports a 2,000-record limit, with JSON/GeoJSON/PBF query formats. A future ingestion must preserve existing/planned status and paginate instead of silently truncating.

The [hydro layer](https://gisepeprd2.epe.gov.br/arcgis/rest/services/WMS_Webmap_EPE_Data/MapServer/16) provides source identity fields including name, river, owner, CEG, power in kW and operation date. The [transmission layer](https://gisepeprd2.epe.gov.br/arcgis/rest/services/WMS_Webmap_EPE_Data/MapServer/23) provides line name, owner, voltage in kV and operation year. The layer copyright fields are blank; consult item metadata and the source attribution before rehosting a production extract. No asset values were imported by this audit.

ANEEL GGT crosses satellite-derived information with transmission-agent information to examine line performance. This is contextual evidence with distinct sources and time scales, not evidence that a single price curve proves a transmission restriction. [ANEEL GGT](https://www.gov.br/aneel/pt-br/assuntos/transmissao/ggt).

ONS's public history interfaces explicitly support filtering/export and temporal scales. NIVAR's authored daily and hourly profiles must not inherit those real aggregation claims. [ONS operation bulletins and history](https://www.ons.org.br/paginas/resultados-da-operacao/boletins-da-operacao).

## Recommended coherent G2.3 feature set

Build an **analysis → comparison → evidence → preserved view** loop.

1. **Comparison manager:** select the primary region and add/remove the other three regions. Legend controls expose selected series, exact names, line styles and values at the current timestamp. Primary region remains the anchor for the reading/source panel. A primary region change does not erase other selected comparisons.
2. **Native values / index 100:** comparing a single metric across regions is valid in its native unit. Optional index 100 uses `value / firstVisibleValue * 100`, retaining raw values beside derived values in tooltip, inspector, source method and CSV. Label the baseline date explicitly. A zero/missing baseline produces missing derived values. For storage, also distinguish percentage points from relative percentages. Do not put GW and R$/MWh on one unlabeled axis.
3. **Chart / table / spatial snapshot:** one selected dataset, one time context. Promote the existing table into the analysis surface, include all selected series, and let row selection drive the observation inspector. A spatial mode uses real existing polygons to show the sample values at the selected timestamp, with an explicit synthetic-value legend. It should never imply infrastructure/flow layers are present. A bar snapshot across regions can be offered where the selected timestamp is the x-context, rather than a candlestick or stacked area that invents semantics.
4. **Inspect a real selected window:** let users narrow within the current fixed hourly/day sequence using a visible range control or start/end selectors. Retain timestamp where included and reset deterministically where not. Summary, baseline, chart, table and export all use the same visible window. Hourly ↔ daily is a frequency switch, not aggregation. Preset 7d/30d remain useful quick entries.
5. **Pinned comparison / difference:** if additional depth is needed, make a user-chosen comparison region the explicit reference and show the selected-time absolute difference. In storage this is p.p.; in load GW; in price R$/MWh. Call it a difference in the sample, never spread opportunity or congestion. This earns its complexity more than alerts or watchlists with only four regions.
6. **Preserve and share:** serialize validated state into the URL; share/copy with graceful clipboard failure. Offer named local saved views with clear “neste navegador” wording. Store configuration and sample version, never imply account/cloud synchronization. Include reset-to-default and restore actions. A downloaded JSON analysis record can preserve configuration and method alongside CSV if valuable.
7. **Focus mode and efficient controls:** make the graph/table expand to usable width and height. Keep source/unit/frequency/synthetic classification and exit control visible. Existing native range keyboard behavior plus explicit shortcut help is enough; a command palette is not justified by three metrics and four regions.

Advanced heterogeneous-metric overlays are optional, after the above loop works. If included, use explicit indexed values or synchronized small multiples; dual axes should not become the default. No forecasting, correlation claims, operational alerts, execution controls or live badges belong to this dataset.

## Implementation ownership and state design

Suggested exclusive implementation ownership is `src/pages/terminal-brasil/**` plus Terminal-only evidence under `docs/g2-dream-build/g2-3/terminal/`. Read-only: shared `brasil-outline.ts`, G2 brand component, `AriadneJourney.tsx`, `TerminalThreshold.tsx`, `PortalBRRouter.tsx`, backend APIs, authentication, US saved views and all Alexandria. Root integrates any brand/shared consumer changes.

Keep the default export route and `TerminalPreview`/`onEntryUrlChange` contracts. Add local modules such as `analysis.ts` (pure selectors, transforms, export), `workspace-state.ts` (allowlisted parse/serialize and persistence), `ComparisonControls.tsx`, `AnalysisChart.tsx`, `AnalysisTable.tsx`, and `SpatialSnapshot.tsx` if that separation makes the main component reviewable. Keep all new types local; no shared `src/lib/types` modification is necessary. Preserve existing fixture values and public `getSeries` semantics.

Canonical state should include schema/sample version, primary region, comparison region IDs, metric, frequency/window, visible time range, selected timestamp, representation, transform, source mode, tone and selected note. For compatibility, accept existing `region`, `period`, `metric`, `observation`, `source`, `tone`, `note` parameters. New parsing must whitelist identifiers and bound indices/ranges. A URL must never supply a data value, remote source URL or arbitrary API endpoint.

Avoid rekeying/remounting the entire instrument on each URL synchronization. The current adapter derives a `key` from initial query values; naively adding `setSearchParams` on each scrub would reset local state and motion continuously. Choose a controlled URL-state owner or a deliberate one-way replace synchronization with a separate popstate handling strategy. Scrubbing should replace history, while saved-view navigation can push a meaningful history state.

The current motion hook caches only one curve and one area role. Multiple series need stable semantic IDs keyed by region + metric + transform, or the hook will morph one region into another. Changing frequency, transform or segment topology should reveal final geometry instead of inventing correspondence. Preserve `connectNulls={false}`. The SVG node keys and observation-range indices must remain stable through window changes.

## Source correction required before stronger spatial claims

The local geography note says Roraima is unassigned in its documented aggregation. ONS's current PAR/PEL text reports interconnection of Roraima to the SIN in September 2025. Electrical interconnection does not itself establish the current CCEE settlement classification, but it makes any generic present-tense claim that RR is outside the system unsafe. [ONS PAR/PEL](https://www.ons.org.br/Paginas/energia-no-futuro/suprimento-eletrico/parpel2025/sumario-executivo/index.aspx).

Do not edit shared geometry based on inference. In the Terminal source record, say that this is an illustrative local UF aggregation, RR is unassigned **in this geometry**, and it does not certify current electrical topology or commercial settlement boundaries. If infrastructure is later imported, it needs a separately dated, sourced layer and no assumed causal join to the fixture.

## Concrete acceptance journey

Start from the current public default. Add NE and Sul to SE/CO, narrow the daily window, select a timestamp, switch native/indexed representation, switch chart → table → spatial view, inspect the source, export displayed CSV, save locally, change the analysis, restore it, copy a URL and load that URL in a fresh page. The same selected series/time/transform must return; numbers in each representation and exported rows must reconcile.

Repeat core actions at 390 and 1440, both themes, with keyboard and reduced motion. Then inspect 430/768/1024/1920. Test invalid URL/localStorage data, persistence failure, copy failure, zero or missing transformed baseline in pure selector checks, daily window identity, source-unavailable mode, resizing/focus mode and compact Ariadne handoff. Check browser console and horizontal overflow in the render. Record actual pointer/keyboard work, not just DOM presence.

Run `npx tsc -b`, scoped ESLint and `gridalpha-detect`; use the root's coordinated final build. Pure unit checks are justified for transforms, state validation and exports because silent disagreement would compromise evidence, but visual agency still requires real browser use. Final review should compare the ability to answer and preserve a question against the professional mechanisms above, rather than count added buttons.

## Evidence limits of this audit

This audit inspected source, prior G2 handoff/evidence documents, one prior native-rendered G2.2 Terminal capture and public primary documentation. It did not claim current live-browser interaction, paid Bloomberg/LSEG/Koyfin/Yes Energy access, a production EPE integration, or real Brazilian market ingestion. Root is collecting the fresh runtime baseline separately.
