# Fresh craft critique — NIVAR public hero

**Verdict: NO against strong current digital studio work.**

The public headline is assured and the film has an intelligible idea. The result still reads as a carefully styled animated presentation. Its largest gap is **scene authorship**: after the infrastructure opening, an almost fixed portrait-and-chart composition carries most of the 36 seconds. Six engraved characters change by dissolving while the data does relatively small work on the other side. There is continuity in the data, but insufficient visual cause and effect between the illustration, the observation, and the next scene. More easing polish alone will not close this gap.

This is an independent visual judgment. No NIVAR implementation, rationale, feature inventory, prior critique, or test report was read. Browser DOM was used only to find visible controls and media. Product was not edited.

## Evidence and motion method

- Current public `/br` render captured at 1440 × 1000: `current-desktop.png`.
- Supplied desktop film: 1438 × 666, 36.400 seconds. Played in native Chrome at **playbackRate 1**, from zero to `ended=true`; 148 sequential browser captures.
- Supplied mobile film: 388 × 620, 36.533 seconds. Played in native Chrome at **playbackRate 1**, from zero to `ended=true`; 148 sequential browser captures.
- All ten ordered `desktop-motion-01…05.png` / `mobile-motion-01…05.png` sheets were inspected, covering the entire two recordings, including transitional states. Source captures remain in `desktop-1x/` and `mobile-1x/`.
- Exact video `currentTime`, wall time, playback rate, and completion state are in `desktop-1x-timing.json` and `mobile-1x-timing.json`. Capture cadence was targeted at 250 ms; desktop screenshot cost sometimes lengthened the interval. Use these JSON timestamps, **not frame-number divided by four**, for exact timing.
- The full-speed playback and ordered sampling support judgments about staging, relative pacing, overlap, and legibility. They do not establish a 60 fps performance result or permit a frame-perfect judgment of acceleration curves. Audio was not assessed.

## Numbered sequence review

1. **Public entry — strong.** The large serif claim, restrained warm neutral field, small red rule, and compact action column have editorial authority. The film is introduced as an object of attention. This is the most convincing studio-level part of the first impression. See `current-desktop.png`.
2. **Infrastructure → measurement, approximately 0–8 s — mixed.** The Itaipu image gives real geographic substance and the large 68 creates a useful focal change. The pylons image subsequently shrinks as a visible rectangle while engraved portrait layers fade across it. The backgrounds, portrait, and number do not share a persuasive space; the composition exposes its layers. The pale number over the bright sky is also less decisive than it becomes over black. See desktop motion sheet 01 and mobile sheets 01–02.
3. **Measurement → table → graph, approximately 8–16 s — promising idea, visibly unresolved transition.** The same 68 remains recognizable as more observations appear and become plotted values. This is the film's strongest continuity. But the movement is a diagonal pile-up before it becomes a graph. Units, missing-value labels, timestamps, brackets, and values intersect while all remain visible. A viewer is asked to follow more moving marks than can be cleanly tracked. See exact desktop **13.66 s**, `evidence-desktop-047.png`, and mobile **13.74 s**, `evidence-mobile-055.png`.
4. **Graph → missing observations, approximately 16–24 s — readable, underpowered.** The discontinuous line and the two missing intervals are a useful visual claim. The faint vertical glows do not create much change in a composition that has already been stationary for several seconds. On desktop, the portrait still commands roughly two-fifths of the width while the actual argument occupies a small, low-contrast graph and a compact caption. Mobile gives the chart a better share of the width, but the upper portrait remains an ornamental strip. See desktop sheet 03 and mobile sheet 03.
5. **Graph → evidence note, approximately 24.5–27 s — material and text continuity fail.** The chart survives, which is good. The paper appears as a translucent, slightly tilted slab; the portrait/photo shows through, the old white caption survives underneath, and the new dark caption appears at the same position. At **25.75 s desktop / 25.72 s mobile**, two conclusions visibly occupy the same lines. On mobile, the portrait crosses the paper's top edge and changes tone at a hard horizontal seam; it reads as a composite layer, not an illustration printed on or sitting behind a physical note. See `evidence-desktop-103.png`, `evidence-mobile-103.png`, and the settled mobile note at **26.97 s**, `evidence-mobile-108.png`.
6. **Note → closing question, approximately 31–36.5 s — clean destination, messy arrival.** The cream note is an attractive final palette shift. But the outgoing statement, incoming question, labels, and small supporting text dissolve through each other. At **31.34 s desktop / 31.47 s mobile**, the main thought is visibly unreadable. The final state then sits for roughly four seconds with only a tiny next action. See `evidence-desktop-126.png`, `evidence-mobile-126.png`, and settled `evidence-mobile-130.png`.

## Largest corrections, in order

1. **Let the evidence object own the film.** Build a clear sequence of visual spaces: real infrastructure; one captured observation; a full, legible graph; the same graph carried into a note. Retire the dominant left portrait panel once measurement begins. If the six figures remain, integrate them as restrained chapter signatures or a single consistent print treatment rather than six interchangeable hero panels. Give the core number and graph materially more screen area. The viewer should remember one transformed object, not six portraits beside a small example.
2. **Choreograph the row-to-graph conversion in phases.** Remove redundant per-row units before travel; retain one MW label. First distribute the observations to their time columns while keeping separation, then place them vertically on the value scale. Fade in the axes and new supporting labels after the marks settle. Keep the values and the two missing markers continuously identifiable. A practical target is two clean 350–500 ms movements followed by a short settled read, rather than moving every label diagonally at once.
3. **Make caption changes exclusive.** Clear the outgoing headline and supporting copy before introducing the replacement. A 150–200 ms exit, a brief empty beat, and a 250–350 ms entrance would preserve momentum without superimposing sentences. Apply this to both the paper reveal and the last question, and to the small source text that collides with the questioning caption on mobile.
4. **Choose one paper relationship.** Either the entire illustration is printed within the sheet, moving and clipping with it, or it stays behind an opaque sheet and is occluded. In the mobile note at 26.97 s, the paper spans approximately **x=13–375, y=110–573**; the figure crosses that upper boundary and changes from dark to pale at y≈110. Remove that seam. Bring the sheet in as an opaque surface; keep the existing chart registered to it. Avoid the long grey translucent interval.
5. **Recompose the note for the actual mobile frame.** Add left room for the y-axis labels; the 120/90/60 labels sit against the sheet's edge around x≈13–27. Give the source and final action a deliberate readable size instead of reducing them to miniature technical furniture. The film should still communicate its key claim at 388 px wide without pausing or zooming.

## Concrete pixel evidence

Coordinates are approximate visual bounds in the supplied film's native pixels, after removing the browser's letterbox. The cropped evidence files preserve those native pixels; the full original browser screenshots are also retained.

| Evidence | Recorded time | Visible problem and region |
|---|---:|---|
| `evidence-desktop-047.png` | 13.66 s | Values/units/timestamps collide across roughly x=795–1200, y=250–435 during the table-to-chart move. |
| `evidence-mobile-055.png` | 13.74 s | Diagonal row pile-up across roughly x=60–305, y=265–388; multiple timestamps share the same narrow region. |
| `evidence-desktop-103.png` | 25.75 s | Outgoing and incoming headlines overlap around x=570–860, y=500–565; supporting copy also doubles around x=1015–1230, y=520–565. |
| `evidence-mobile-103.png` | 25.72 s | The two headlines and supporting copy overlap across x=24–300, y=465–553, while the sheet is translucent. |
| `evidence-mobile-108.png` | 26.97 s | Portrait crosses the sheet's sharp top edge at y≈110; y-axis labels crowd its left border. |
| `evidence-desktop-126.png` | 31.34 s | Closing copy dissolves through outgoing copy around x=570–865, y=490–557. |
| `evidence-mobile-126.png` | 31.47 s | Two headlines occupy x=24–310, y=460–519; outgoing supporting text overlaps the next action at y≈538–551. |

### Selected inspected captures

Current public entry:

![Current NIVAR public entry](C:/dev/gridalpha-v2-nivar-g2/docs/g2-dream-build/g2-2/critics/craft-hero-01/current-desktop.png)

Desktop row-to-chart movement, 13.66 s:

![Values and labels collide during the chart transition](C:/dev/gridalpha-v2-nivar-g2/docs/g2-dream-build/g2-2/critics/craft-hero-01/evidence-desktop-047.png)

Desktop paper reveal, 25.75 s:

![Two captions overlap through the translucent paper](C:/dev/gridalpha-v2-nivar-g2/docs/g2-dream-build/g2-2/critics/craft-hero-01/evidence-desktop-103.png)

Mobile settled note, 26.97 s:

![Portrait crosses the paper edge and y-axis labels crowd the border](C:/dev/gridalpha-v2-nivar-g2/docs/g2-dream-build/g2-2/critics/craft-hero-01/evidence-mobile-108.png)

Mobile closing transition, 31.47 s:

![Closing question overlaps the preceding statement](C:/dev/gridalpha-v2-nivar-g2/docs/g2-dream-build/g2-2/critics/craft-hero-01/evidence-mobile-126.png)

## External calibration

The references are not templates NIVAR should imitate. They establish the visible difference between adding animation and authoring a visual event.

- [Media.Work](https://media.work/): inspected the current homepage and played its linked Nike preview at 1× to completion. Its strongest advantage is a single dominant object with convincing material, lighting, and a memorable relationship to its surroundings. NIVAR's photo, engraving, flat graph, glow, and paper do not yet feel equally integrated. Evidence: `reference-media.png`, `media-1x/`, `media-1x-timing.json`.
- [The Spark](https://spark.thedigitalpanda.com/): entered the scene and inspected its opening composition and scroll response. The image, overlay, depth, and typography occupy one directed world. NIVAR's repeating split composition lacks that spatial integration. This was not an end-to-end review of Spark's whole story. Evidence: `reference-spark-*.png`.
- [Ten Years Away](https://ten.375.studio/): entered without sound and inspected the book composition and its opening response. The book, shadow, texture, and exaggerated type have a coherent physical scale and a specific identity. NIVAR's note is conceptually useful but its translucency and crossed portrait edge weaken that physical reading. This was not an end-to-end review of the entire comic. Evidence: `reference-ten-*.png`.
- [CRED offer interaction](https://60fps.design/shots/cred-credit-card-full-page-offers-swipe-interaction): full 7.55 s clip played at 1× to completion. The large card compresses into a small persistent reference object without becoming a muddle of unrelated parts. That is the relevant bar for NIVAR's 68. Evidence: `cred-motion.png`, `cred-1x-timing.json`.
- [Must detail sheet](https://60fps.design/shots/must-movie-detail-sheet): full 12.417 s clip played at 1× to completion. The poster stays an identifiable anchor as its surrounding surface grows and returns. NIVAR's graph-to-note has a related premise, but its caption double exposure and ambiguous paper plane interfere with the same clarity. Evidence: `must-motion-01.png`, `must-motion-02.png`, `must-1x-timing.json`.

## Limits and accessibility risks

This was a bounded hero craft review, not a product functionality or accessibility audit. The pause affordance was visible; keyboard operation, reduced motion behavior, focus order, and semantic reading order were not tested. Tiny captions and pale data against a changing background are visible readability risks. The observation clips were supplied recordings, so their capture pipeline may affect sharpness or frame cadence. The current page render was separately checked to establish the present visual surface.

**Acceptance judgment remains NO.** Clean the collisions immediately, but spend the main design effort on the evidence object's scale, scene transitions, and physical coherence. That is the change that can move this from a polished explainer toward a distinctive studio-level hero.
