# Ariadne — receipt continuity, iteration 02

This bounded pass addresses the independent craft review in `critics/craft-system-01/critique.md` and the fullscreen context loss found in the brief review.

The observation, chart and usable range control now arrive together in a 520 ms primary transition. A short emphasis on the selected mark supplies the settling motion. The source card has an action beside the disclosed provenance. It preloads the existing Terminal module while the visitor examines the observation, without mounting a second dashboard.

On reveal, the previous source composition is collapsed. A presentation receipt bound to that same selected fixture observation travels in viewport coordinates to the actual chart annotation over 620 ms. The selected graph receives it first; the region and reading rails settle around it. This is a visual shared-element handoff: the travelling receipt and destination are separate rendered elements bound to the same existing value, not one DOM node reparented. No number is interpolated or invented.

Reduced motion enters the same selected Terminal directly: no travelling receipt, no delayed controls, no active animations. The old source composition is inert and hidden after entry, and can be reopened with “Rever percurso.”

The fullscreen link now receives the current state of the embedded instrument. It preserves region, metric, window, manually inspected observation or selected note, theme and source-absence mode. Query parameters are allowlisted; the observation bound is derived from the selected existing fixture series. A query cannot supply a value, source URL or API. The unchanged default remains SE/CO, hourly price, note 02.

## Rendered evidence

- [Desktop native handoff](1440-ariadne-handoff.mp4), 1440 × 1000.
- [Phone native handoff](390-ariadne-handoff.mp4), 390 × 844.
- `*-source.png`, `*-transfer.png`, `*-earned.png`: native rendered states, including the intermediate receipt.
- `*-timing.json`: original Chrome screencast timestamps and interaction markers. The MP4 encoding retains these intervals and repeats still frames at 30 fps; it does not retime the interaction. This is visual evidence, not a frame-pacing benchmark.
- [Native replay result](playback.json): both encoded movies were replayed at rate 1 to `ended=true` (desktop 5.333 s; phone 4.833 s).
- [Reduced motion results](reduced-motion.json): visible control immediately; zero active animations; selected Sul/14h/160,39 R$/MWh retained; no horizontal overflow.
- [Fullscreen results](../fullscreen-context/results.json): 13 checks passed through native mouse and keyboard input. Includes changed NE/load/7d context, selected note, unavailable source, phone 30d index 29, defaults and invalid query values. Zero browser exceptions.

`npx tsc -b` and scoped ESLint passed after the implementation. `sample.ts`, auth, backend and Alexandria were not modified. These records support review; no independent craft approval is claimed here.
