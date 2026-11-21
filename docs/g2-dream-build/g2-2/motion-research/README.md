# G2.2 motion mechanism study

Observed 2026-09-11 in an isolated Chromium context, 1440×1000. These are research captures, not licensed NIVAR runtime art. No implementation was changed during this study. Owner brief and full reference sheet/support files read; written constitution remains authoritative.

## What changed the design judgment

The decisive difference is not animation quantity. In CRED, Pool and Must, the attention object survives while its context changes. NIVAR’s six verbs should act on one visible datum, not exchange complete information panels. Ariadne should begin with one selected region/observation and create the product around that relationship.

## Direct playback observations

- **CRED** — [source](https://60fps.design/shots/cred-credit-card-full-page-offers-swipe-interaction), [timed sequence](cred-sequence.jpg), [actual video times](cred-timing.json). Video duration 7.55 s. At 0.21 s the card dominates; by 1.22 s it retreats upward; at 1.81 s the compact card occupies the header while offer content continues beneath it. Its asymmetric silhouette and red segment carry identity without relying on text. Small final playback lag is logged, not hidden. Translate the survival of the evidence coordinate, not card styling.

- **Pool** — [source](https://60fps.design/shots/pool-grid-to-screenshot-morph-interaction), [sequence](pool-sequence.jpg), [times](pool-timing.json). Live video advanced through 3.38 s during a 4.5 s observation window; buffering therefore affects wall-clock timing. A large selected screenshot shrinks toward its exact grid destination; other thumbnails become visible around it. A second thumbnail enlarges without the grid’s spatial origin being forgotten. Translate persistent selection with the surroundings changing scale. Do not substitute a crossfade between unrelated layouts.

- **Must collection** — [source](https://60fps.design/shots/must-movie-collection), [sequence](must-sequence.jpg), [times](must-timing.json). 9.2167 s recording. Collection heading and explanatory block establish hierarchy before posters resolve. At approximately 7.26–7.58 s the selected Oppenheimer poster expands; its detail labels populate afterward. The large image is visibly ready before the rest of the detail UI. NIVAR equivalent: measured instant first, unit/time next, relational frame next, interpretation last. Poster artwork and entertainment styling are reference only.

- **Must detail sheet** — [source](https://60fps.design/shots/must-movie-detail-sheet), [sequence](must-sheet-sequence.jpg), [times](must-sheet-timing.json). Watched first 6.15 s of the 12.4167 s clip. At 0.64 s the selected poster is between its grid origin and expanded position; 1.15 s resolves detail. Around 3.15 s it returns to the same cell. This return matters as much as the entrance: opening provenance should preserve an obvious return to the selected evidence. Remainder was not studied.

- **Harvee** — [source](https://60fps.design/shots/harvee-tab-switch-graph-morph-interaction), [sequence](harvee-sequence.jpg), [times](harvee-timing.json). 4.3167 s recording fully played. This is a habit/stress dashboard with a dot matrix and donut, not an energy time-series plot. At 2.02 s the date span and values are updating while geometry still moves; by 3.03 s the reorganized state is stable. Use synchronized selection context and retained chart geometry; do not copy health/finance semantics or infer an appropriate null-data interpolation algorithm from it.

## Live cinematic sites and source verification

- **Ten Years Away** — [live](https://ten.375.studio/), [author engineering article](https://tympanus.net/codrops/2026/07/08/ten-years-away-designing-an-interactive-comic-for-studio375s-tenth-anniversary/). Entered without sound, clicked into year 2015, dispatched a real wheel gesture. [300 ms](ten-years-scroll-300ms.png) and [900 ms](ten-years-scroll-900ms.png) show first panel moving left while parts of the next become legible. Chapter assembly and fixed-canvas architecture are explicitly described by the author. Only first-year entry/scroll was personally observed; no claim to a full ten-year walkthrough. Useful mechanism: the existing composition makes room before new content aligns. No comic styling, halftone trail or horizontal navigation should be copied.

- **The Spark** — [live](https://spark.thedigitalpanda.com/), [author article](https://tympanus.net/codrops/2026/01/09/the-spark-engineering-an-immersive-story-first-web-experience/). Entered both press-and-hold gates and scrolled through approximately 59% of chapter 01. [Initial tracking](spark-start-3800ms.png), [moving camera](spark-scroll-350ms.png), [anomaly acquired](spark-scroll-1650ms.png), [lower city](spark-scroll-second.png). The tracked target/label gains meaning from a precise spatial anchor; camera movement follows the new subject into the city. This makes the UI part of the event. No full-story or closing review claimed. Translate anchor-first attention and changing shot scale; reject cyberpunk overlays, fictional machinery, glitch text and electric glow.

- **Podium** — [live](https://podium.global/), [author article](https://tympanus.net/codrops/2026/06/23/podium-building-a-website-where-running-becomes-storytelling/). [Loaded top](podium-loaded-top.png), [350 ms after wheel](podium-loaded-scroll-350ms.png), [1250 ms](podium-loaded-scroll-1250ms.png). The runner silhouette is a mask over the same media field, which expands into an open dark stage during scroll; the material object and images persist. Earlier podium-opening/scroll captures show loader transition and should not be used as evidence of a finished scroll sequence. Did not test project-route transition. Article confirms shared media overlay + GSAP Flip; translate retained geometry, not runner/logo/rock.

- **ZERO** — [live](https://why.zero.university/), [author article](https://tympanus.net/codrops/2026/07/17/zero-the-engineering-behind-a-defiant-interactive-narrative/). Entry and draw gesture inspected. Author explicitly says **no native scroll and no ScrollTrigger**: one virtual progress value, nine implementation segments with lifecycle methods, six narrative stages/five gates. Therefore the pack is directionally right about segment lifecycle but must not be used to imply ordinary ScrollTrigger architecture. NIVAR should retain native scrolling and keyboard access. Borrow one progress source and explicit handoff ownership; reject gate-heavy wheel hijacking. No whole ZERO journey or mobile performance claim.

## ThreeUI verification

[Repository](https://github.com/MengTo/threeui); observed tree 68802d5428071ada5c20db8094b1649e6bb770ed. Selected source files and original MIT notice saved alongside this document. Community code and bundled ThreeUI-authored scene assets are MIT. External catalog thumbnails/videos and remote endpoints are **not covered** by that grant; Pro/Beta source is excluded.

Live [Structure Flow](https://threeui.com/three-js/structure-flow/structure-flow) is a rotating masked point dome ([0](threeui-structure-flow-0.png), [1.2 s](threeui-structure-flow-1200ms.png)). Source confirms points and rotation, with no domain selection graph. [Predictive Arc](https://threeui.com/backgrounds/predictive-arc/predictive) is a procedural luminous arch ([render](threeui-predictive-arc.png)); source calculates distance from an abstract curve. Constellation and Portal wrapper sources select generic effect variants; Portal uses lazy Suspense loading.

**Decision:** no direct ThreeUI scene incorporation into Ariadne. Its abstraction would repeat the rejected generic network metaphor. Useful lessons are staged depth, lazy mounting and disposing rendering resources. Native HTML/SVG keyed by actual region/sample/source gives better semantic precision with lower cost. 3D Paper source was not resolved under that exact catalog name in the fetched tree; no reuse claim.

## Concrete NIVAR choreography recommendation

### Hero

Keep one rendered selected datum/mark continuously present through world → record → axis → question → publication. Preserve its asymmetry, selected status and source attachment as it changes scale. Use a single progress model with local beat ranges; reserve each new element’s entry until its semantic need exists. A connector may travel only between visible registered anchors. Stop animating the connector once the relationship is established. Empty observations reserve physical space before any curve draws; never interpolate across nulls.

Give chapters different attention rhythms: Hefesto locks a physical origin; Ariadne aligns related records; Argos expands an observation field around the retained sample; Sócrates separates claim from contradictory evidence; Perseu carries that same source into a reading; Diógenes opens the unresolved question into the House. End in a stable, usable handoff, not a mandatory automatic replay. Phone should use one large selected object and fewer simultaneous planes.

### Ariadne

Region choice initiates the relationship. A native observation strip aligns around the selected region. Its chosen point becomes the chart focus; source is then exposed beside or beneath it. Only after the source/context relationship is legible should the full product become available. Changing region updates the SAME nodes and actual fixture values; do not rerender a finished dashboard as a transition. Keep large Ariadne art in the threshold stage, allowing the product to grow beyond her gesture rather than compete with a portrait thumbnail.

## Harder motion bar for critics

1. Review **normal-speed playing sequences**, with intermediate evidence; endpoint screenshots cannot pass motion.
2. Hide verb/evidence labels temporarily: can the same datum still be tracked across at least four transitions?
3. Identify the exact frame that causes each UI part to become necessary. If panel/chrome arrives before its data/relationship, fail construction.
4. Pause mid-transition at 25%, 50%, 75%: no orphan line, duplicate selected identity, false data, hidden source, or unreadable full-screen wash.
5. Compare Ariadne directly with CRED/Pool/Must continuity, not a still dashboard.
6. Compare shot scale and camera/attention causality with The Spark’s anchor handoff and Ten Years Away’s panel arrival; never imitate their skins.
7. Test reverse navigation, rapid region changes, keyboard, reduced motion, offscreen suspension and phone framing. Functional success does not substitute for the motion verdict.
8. Preserve failed takes and negative critic outcomes. No claim of studio-level craft from a static jury.
