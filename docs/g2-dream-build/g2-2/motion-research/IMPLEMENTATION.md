# Ariadne / Software implementation handoff

The Software opening now earns the Terminal through territory, observation and declared origin. The large Ariadne engraving keeps the human gesture and visible thread central. The first surface remains mineral/lavender; opening the attached provenance sheet introduces the operational dark surface.

## Files and API

- `src/components/g2/AriadneJourney.tsx`
- `src/components/g2/ariadne-journey.css`
- Software-only replacement in `src/pages/br/FamilyPages.tsx`
- Software-only additions to `src/pages/br/g21-families.css`

Public API: `<AriadneJourney compact />`. The optional compact flag provides a class hook for the House integration; internal layout responds to container width. The default is used on `/br/software`.

No Terminal business logic, fixture, geography, backend, auth, or Alexandria file was changed by this agent. The Terminal owner separately added `initialRegion` and `initialProbeIndex` to TerminalPreview, which Ariadne now uses.

## Causal motion

1. Selecting a native region button selects the actual IBGE-derived region geometry. The selected map marker anchors the emerging observation receipt.
2. A single SVG filament follows the actual map centroid and receipt marker throughout their native layout movement. It is not a decorative network and has no unrelated nodes.
3. The region label arrives first. Measurement follows, then unit/time, axes and the traced series. The selected probe, scrubber and evidence index arrive last. The first introduction lasts 2.2 seconds and does not repeat when returning from the source.
4. Region changes morph the same chart path and area using the existing fixture's 24 hourly observations. Rapid changes start from the shape currently rendered. The selected index remains the same until the range input changes it.
5. Following the source unfolds an attached sheet while retaining the region and observation. The existing source record and exact timestamp are visible.
6. Only the explicit reveal mounts TerminalPreview. The selected region and observation index seed its actual state. At this point the introductory selection is labelled as the entry context and frozen; native Terminal controls own subsequent exploration. Returning to the journey unmounts the preview and reopens the selection.

There is no scroll hijacking, automatic background narrative, invented telemetry, generic network, ThreeUI asset import, or added library. Animation work is bounded; reduced motion presents the same information immediately.

## Inspectable recordings

- [Desktop native recording](implementation/ariadne-desktop-native.mp4): 380 real Chrome compositor frames, original timestamps, encoded at 60 fps. Region, datum selection, region change, source and earned Terminal reveal are shown.
- [Phone native recording](implementation/ariadne-phone-native.mp4): 236 real compositor frames at the authored phone layout. Dark surrounding chrome, readable attached sheet and earned phone Terminal are shown.
- [Intermediate arrival contact sheet](implementation/desktop-arrival-contact.jpg): six actual transition frames, rather than endpoint-only proof.
- [Behavior verification](implementation/verification.json)

The videos preserve compositor timing. Static frames are held; no interpolation or speed manipulation was applied. Raw frame timing manifests remain available; temporary JPEG frame sequences were removed after encoding.

## Verified

- `npx tsc -b`: passed after implementation.
- Scoped ESLint for AriadneJourney.tsx and FamilyPages.tsx: passed.
- Inspected 1440 x 1000 desktop and 390 x 844 phone, light and dark surrounding themes.
- Desktop handoff: Sul, 13h, 173.63 R$/MWh, identical in receipt and Terminal selected-observation card.
- Phone handoff: Nordeste, 12h, 102.89 R$/MWh, identical in receipt and Terminal.
- Keyboard End selects observation 23. Returning from the source preserves index and value.
- Reduced motion: no stage animations, no first-use delay, source and reverse usable.
- The preview is absent before explicit reveal. No horizontal page overflow at the inspected sizes. Phone provenance scrollHeight equals clientHeight; text is not clipped.

## Limits for the fresh critic

This is a source-aware presentation of the existing deterministic demonstration, not a live-data connection. The final full-screen link opens the existing Terminal route using that route's normal defaults; the inline reveal preserves the selection. The component provides the entry journey, while the Terminal owns subsequent selections. These checks do not replace an independent craft/motion critic across the completed House and hero.