# Terminal Brasil — G2.2 selection continuity

The authoritative final browser evidence is **iteration04/**. Earlier iterations are retained to show the defects found and corrected in rendered playback.

## Intended behavior and implementation

The existing dark operational surface is preserved. Region, selected observation, interpretation and source inspection share one actual Terminal selection. No backend, authentication, API client, shared geography or sample data file was changed.

- Selecting a region preserves the inspected time. The map and regional list identify the region; the exact selected value appears in the chart glass, time scrub, reading panel and source drawer.
- The reading panel now includes an actionable **Observação selecionada** record. It opens the same source drawer as the chart glass.
- The source drawer begins with the selected region, metric, exact value, ISO timestamp and synthetic dataset version. Its existing methods, limitations, search and source records remain available.
- Expanding 7d to 30d retains an explicitly selected daily timestamp if it exists in the target window. An hourly/daily change resets to the chosen note because these fixtures represent distinct frequencies, not interchangeable aggregations.
- Changing a metric retains the selected timestamp and uses that metric's real existing fixture value and unit.
- The chart's final SVG geometry always comes from Recharts and the existing series. Compatible geometry morphs for 620ms; frequency, unit or segment-topology changes reveal their final geometry for 360ms. No intermediate value enters the tooltip, source record or CSV.
- A 320ms stagger directs attention from region to chart to selected observation. The glass remains mounted, moves with the probe and retains its material treatment.
- Probe line, its separately rendered label, point and context card move together. Reference layers are keyed by semantic role because Recharts can reorder or replace their DOM nodes.
- Reduced motion suppresses JS and CSS movement. In-progress JS motion is cancelled when the Terminal is offscreen or the document is hidden.
- Narrow layouts use tap/scrub inspection and one persistent observation card. Their transient hover card and cursor are suppressed to prevent two competing values from overlapping.

`TerminalPreview` supports optional `initialRegion?: RegionId` and `initialProbeIndex?: number`. These seed state once on mount. Existing consumers without props retain the original defaults. The initial series remains 24h / price / sample; the caller must pass a matching fixture index. Invalid indices fall back to the selected note and indices beyond the series clamp to its last observation. This supports Ariadne's earned inline reveal without introducing a separate data model.

## Final native-browser evidence

- `iteration04/1440-interaction.mp4`: desktop region selection, time scrub, source opening, daily window continuity and metric change.
- `iteration04/390-interaction.mp4`: the corresponding narrow viewport sequence, including the expanded map.
- `iteration04/results.json`: 26 rendered observations/checks, zero exceptions, zero horizontal overflow, daily timestamp continuity passed at both widths.
- `iteration04/*-timestamps.json`: original native screencast frame timestamps. MP4s are encoded from Chrome's actual captured frames with their elapsed timing; the interactions were not recreated as graphics.
- `iteration04/playback/playback.json`: native MP4 replay at 1× through `ended`, with temporal screenshots alongside it.
- `iteration04/{1440,390}-{default,region,probe,source,load,paper}.png`: dark and light static inspection, source context and narrow layout.
- `iteration04/unavailable.png`: absent-data state has no curve or observation trace and does not substitute numbers.

The main sequence uses native CDP pointer and keyboard input. The unavailable-source check uses an explicitly dispatched select change. Inspection state and screenshots are read from the actual rendered document. The `100ms` / `320ms` names in results denote requested sampling waits; browser scheduling may add latency. Computed geometry and active animations, rather than nominal wait labels, establish that motion occurred.

Measured examples from the unchanged synthetic dataset:

| Action | Selected evidence |
| --- | --- |
| SE/CO to Nordeste | 14h · 99,04 R$/MWh |
| Keyboard ArrowRight | 15h · 107,48 R$/MWh |
| Select daily 09/09, then expand 7d to 30d | 09/09 · 119,81 R$/MWh in both windows |
| Change that observation to Carga | 09/09 · 13,6 GW |

During final native sampling, the chart had one active geometric morph after region change. On ArrowRight, the probe had a real intermediate translate of −11.55px at 1440 and −5.80px at 390 before reaching its exact final location. Reduced motion had zero curve or probe animations.

## Inspection findings and corrections

1. First browser inspection showed that Recharts replaced its curve node. A per-element cache did not animate the next curve. Tracking the curve/fill roles corrected this and was re-measured in rendered CSS `d` geometry.
2. Playback exposed overlap between the permanent context glass and transient hover tooltip at 390px. Narrow layouts now retain one selected-value card.
3. SVG line x1/x2 attributes did not move under the prior CSS transition. Native transforms now move the probe.
4. Recharts renders its reference label outside the line group, and changes the reference-layer order after region updates. Probe, baseline and label now have semantic motion roles, avoiding both a stationary label and a wrong-line transition.

## Validation and limits

Scoped ESLint and diff checks passed. `gridalpha-detect` scanned the three implementation files with zero findings. `sample.ts` has no diff. The full `tsc -b` result is coordinated with the root integration gate because other surface changes run concurrently.

`check-path-safety.mjs` verifies five cases: compatible disconnected segments, rejected gap removal, changed point count, invalid coordinate and empty path. `connectNulls={false}` remains explicit. The current sample has no null observations; the tests verify the animation guard, not a fabricated gap in the existing dataset.

`check-initial-selection.mjs` mounts the actual compact Terminal in the local `initial-selection.html` test harness. Three rendered cases passed: NE index18 → 18h / 150,52; index−1 → default14h / 99,04; index999 → clamped23h / 114,30. No exceptions occurred. This harness is a verification artifact, not a public route or duplicated Terminal.

No real-time data, live pulses, timers, market alerts, API integration or fabricated observations were introduced. All public values remain explicitly synthetic, with the existing fixed reference date and provenance. No staging, commit, merge or deployment was performed by this subtask.

Technical primary references checked: [MDN SVG d](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/d), [MDN Element.animate](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate).
