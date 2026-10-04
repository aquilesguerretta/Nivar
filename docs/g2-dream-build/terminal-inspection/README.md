# Terminal Brasil — rendered inspection

Inspected 2026-09-11 at `http://127.0.0.1:4173/br/terminal` in an independent headless Chrome instance. CDP mouse and keyboard input exercised the rendered React route. The early browser-only component harness was replaced by the real route before final captures and interaction checks.

## Result

- `npx tsc -b`: passed after final Terminal edits.
- `gridalpha-detect src/pages/terminal-brasil`: no findings across three files.
- Region selection changes title, series and observed value.
- Period selection changes chart interval and the accessible observation table; 7d contains seven daily observations.
- Metric selection changes value, unit, curve, interpretation and explanatory context.
- Selecting a notebook observation changes the chart mark and the hypothesis to examine.
- Source/method drawer search for `geografia` returns one geography record; Escape closes the drawer even from the search input. The first inspection exposed the browser search field consuming Escape; the dialog now handles this explicitly.
- The actual CSV download completed: `NIVAR-AMOSTRA-norte-storage-7d.csv`, 881 bytes. It includes version, synthetic classification, submarket, window, metric, timestamp, value and unit. Its numerical contents were read back.
- Unavailable mode removes the chart and observations, displays a dash, disables event controls and export, and suspends interpretation. It does not reuse the sample as real data.
- Light/dark modes render with scoped variables.
- Mobile measured `innerWidth = documentElement.scrollWidth = terminal.scrollWidth = 390`.
- Pure-data assertions covered all 36 region/period/metric combinations, finite values, unique timestamps, observation counts, summary last values and CSV disclosure. The 7d daily window is an exact suffix of the 30d daily window.

## Captures

- `terminal-desktop-dark.png`: final route, 1440×1050, default SE/CO / 24h / price sample.
- `terminal-desktop-light.png`: 1440×1050, Norte / 7d / reserves after interaction checks.
- `terminal-mobile-dark.png`, `terminal-mobile-light.png`: 390×844, default sample at page start.
- `terminal-mobile-series.png`: 390×844, selected-region chart and notebook reading after scroll.
- `terminal-source-search.png`: searchable geography provenance drawer.
- `terminal-unavailable.png`: explicit absent-source state.
- `interaction-results.json`: eight observed interaction outcomes.

The inspection improved previously small provenance labels, moved a geographic coordinate away from its caption, reserved chart right margin for the final date label, and made CSV download creation/removal explicit. No backend, shared auth, Alexandria, route, package or global token file was edited by the Terminal implementation agent.

## Evidence boundary

Market observations and causal questions are authored synthetic fixtures, not an ONS / CCEE API, forecast, executable quote or recommendation. Hourly and daily profiles are separate illustrative sequences; the daily series is not presented as a computed average of the hourly profile. The actual pre-existing IBGE geometry is used unmodified and has its own source record. This is a functional product experiment awaiting owner review, not human-approved G2.

Fresh-context visual criticism and the parent task's broad regression gate remain separate from this bounded implementation inspection.
