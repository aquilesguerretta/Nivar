# Fresh CRAFT review — NIVAR hero, iteration05

**Overall verdict: NO at the requested cinematic, physically authored craft bar.** The list-to-chart sequence is intelligible, persistent, and meaningfully animated. The largest remaining gap is the graph-to-paper relationship. The panel reveals the graph by passing underneath it; it does not yet convincingly behave as a material document bearing that graph.

This is a rendered-product review. I did not read implementation, earlier critiques, tests, or builder reports. The only earlier artifacts inspected were the explicitly allowed external reference images. The capture helper was used only for browser operation. All new evidence and review files are confined to this critic folder.

## Playback and scope

1. **Current desktop, 1440 × 900 — healthy presentation.** Captured `http://127.0.0.1:4173/br`. The large editorial heading, restrained controls, and hydroelectric photograph establish a clear hierarchy. Evidence: [01-current-desktop](captures/01-current-desktop.png).
2. **Desktop native movie, 1438 × 666 — mixed craft.** Played the whole 23.200-second file at `playbackRate: 1`, without seeking, through its end. Captured 59 intermediate screenshots in chronological order. The browser logged no `seeking` or `seeked` events. It briefly buffered, so wall time was 24.808 seconds. Evidence: [playback log](desktop-playback.json), `desktop-contact-00.jpg` through `desktop-contact-06.jpg`.
3. **Phone, current 390 × 844 and native movie 388 × 620 — legible core story.** Played the whole 21.333-second file at 1×, without seeking, through its end. Captured 78 intermediate screenshots. No seek events. Evidence: [playback log](mobile-playback.json), [current phone](captures/02-current-mobile-top.png), `mobile-contact-00.jpg` through `mobile-contact-06.jpg`.
4. **External benchmarks — persistence comparison established; physical comparison bounded.** CRED's live 7.550-second demo completed at 1× without seeking. Media.Work, Spark, and Ten Years Away were inspected using permitted external imagery, which establishes their visible material/art-direction bar but does not independently verify their full motion. MUST playback status is recorded in the reference appendix below.

The native movies include the product's internal return to the opening scene. Their encoded file ends are later arbitrary recording cutoffs, so I judged the product loop around 18–19 seconds, not a hypothetical loop of the MP4 file itself. Screenshots are sequential visual evidence; this is not a frame-perfect smoothness or dropped-frame measurement.

## Required verdicts

| Criterion | Verdict | Rendered evidence |
|---|---|---|
| Cinematic authored transformation | **NO** | The scenery and patron images predominantly pan/fade while data and typography rearrange on the screen plane. The 13.6–14.3s paper reveal exposes that separation most clearly. The timeline has authorship, but the scene does not consistently feel like one authored material world. |
| Object continuity | **YES** | The bracketed `68` shrinks into the first row, then the same value/bracket family spreads into the chart. `64`, the two missing-value marks, `81`, and `108` remain trackable. Desktop 4.163–8.573s; phone 3.683–8.677s. This is a visible accomplishment, independent of implementation. |
| Causal graph build | **YES** | Rows are established before they become positions; axes then establish the reading; only the adjacent observed pair 68→64 receives a connecting line. The missing 08:00 and 16:00 intervals remain explicit rather than being falsely bridged. Desktop 6.58–11.17s; phone 6.34–11.56s. |
| Coherent physical material | **NO** | At desktop 13.617s the cream leading edge is below much of the graph; at 13.948s it has passed upward behind stationary numeric anchors. A pale portrait remains over its upper edge and the small heading straddles the edge. At phone 13.948s, `108` is still above the incoming sheet while other tokens have changed to dark ink. This is a moving color/occlusion reveal, not a sheet carrying its markings. |
| Phone legibility | **YES** | At native 388px width, the main statements, four readings, missing marks, hours, and 68→108 qualification are readable without zoom. The layout is deliberately stacked. Source/footer type remains very small, and low-contrast text is briefly hard to read during fades; those are secondary weaknesses rather than a failure of the main narrative. |
| Loop | **YES** | The paper leaves downward, an interior infrastructure image remains briefly, then the opening photograph and statement return. Desktop 17.78–19.95s; phone 17.86–19.77s. I saw no full blank screen or hard jump at this internal boundary. The reset is visually smooth, although it does not itself resolve the weaker material causality. |
| Six patron/family behaviors | **NO** | The brief's six functions are not all perceptually distinct as actions. Measuring/locking, organization, and contradiction receive visible data actions. Observation, transmission, and reopening lean more heavily on replacement portraits and changing statements. A new figure appearing does not by itself constitute a new behavior. See the family observations below. |

## Biggest gap: the evidence should belong to its carrier

At the decisive handoff, the evidence has excellent identity continuity but ambiguous material ownership. [Desktop 13.948s](captures/desktop-035.png) shows the incoming cream plane, chart ink, portrait ghost, and heading sharing no single clear edge rule. [Phone 13.948s](captures/mobile-050.png) makes the same issue easy to see: the sheet has reached the middle of the chart while the top value remains outside it. The graph is being recolored by a passing rectangle.

This is not a request for ornamental texture or more effects. The consequential change would be one readable event in which the graph becomes ink on a defined surface and subsequently shares that surface's translation, crop, lighting, and edge behavior. If the surface emerges behind an already fixed chart, that transfer needs a visible deposition/printing mechanism. If it is an already printed document, chart and paper need to arrive together. Either interpretation can preserve the existing numeric continuity.

The same carrier should leave with its evidence at the loop. The current exit is more convincing than the entrance because the chart visibly moves with the departing sheet. That asymmetry makes the entrance's independent layer behavior more noticeable.

## Patron behavior observations

The six names/functions below come from the owner brief supplied during this review; they are not inferred from code.

- **Hefesto — measure/lock:** the prominent `68` and closing bracket treatment communicate capture/lock. The statue remains largely illustrative.
- **Ariadne — organize/route:** the ordered rows and their continuous diagonal spread provide a distinct organizing act. The drawn thread does not visibly route the data, but the data behavior itself is clear.
- **Argos — observe/focus:** the many-eyed/profile image changes in as the chart establishes itself. I did not see an equally clear act of selecting, scanning, or focusing that only this family performs.
- **Sócrates — examine contradiction:** the two absent intervals brighten and the qualification appears. This is the strongest distinct analytical behavior because it changes what the reader should conclude from the evidence.
- **Perseu — transmit reading:** the paper and “Levar a leitura” statement express transmission, but the physical handoff is the unresolved event described above. The portrait fades away as the panel arrives.
- **Diógenes — reopen inquiry:** the final question followed by the return to infrastructure conveys reopening in words and sequence. It does not visibly revisit a specific prior assumption or change the evidence through a distinct inquiry action.

## Benchmarks and limits

- **[CRED](https://60fps.design/shots/cred-credit-card-full-page-offers-swipe-interaction):** live playback, fresh screenshots, no seek. In 1.10–1.93s the large card reduces and changes perspective into the header while its markings, silhouette, and shadow remain coherent; it stays present through the feature changes. NIVAR's value tokens meet the identity principle. Its paper does not yet meet the same carrier/material principle. Evidence: [CRED contact sequence](cred-contact-00.jpg), [log](cred-playback.json).
- **Media.Work:** the permitted shoe/material frames show specific material differences, supporting contact, consistent directional light, and cast shadows. Those cues make the absurd sole forms feel like objects in one world. NIVAR's cream panel, infrastructure photographs, and pale engravings have a weaker common physical relationship. Source imagery: `../craft-hero-01/media-motion.png`.
- **Spark:** the permitted scene has a central apparatus whose geometry, luminous field, electrical discharge, and atmosphere visibly relate to each other. NIVAR's figures and data more often coexist as independent layers. Source imagery: `../craft-hero-01/reference-spark-scene.png`.
- **Ten Years Away:** the permitted scene visibly commits to comic ink, paper grain, and a consistent illustrated world. NIVAR's engraved portraits have a family resemblance, but that resemblance does not supply the six requested behaviors. Source imagery: `../craft-hero-01/reference-ten-scene.png`.

These external still references support visual material comparisons only. They do not lower the motion bar or substitute for the fresh native playback above. No product files, Git state, keyboard accessibility, reduced-motion behavior, or other routes were changed/tested. A pause control is visible; this review does not claim full accessibility compliance.

## Reference appendix

MUST's first fresh direct native playback stalled at 1.236s of 12.417s despite 65.8 seconds elapsed. A second controlled native-player attempt reported the whole movie buffered before playback, then repeatedly entered `waiting` and reached only 0.247s in 39.3 seconds. Neither attempt completed. Their partial frames are excluded from claims about the complete interaction. See [the bounded reference result](reference-result.md) and `must-buffered-playback.json`.
