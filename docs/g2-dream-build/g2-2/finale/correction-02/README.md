# Diógenes — craft correction 02

This revision responds to the independent `craft-system-01` NO. It replaces the separated illustration, worksheet, gesture strip and conventional footer with a closing composition that keeps Diógenes, his lantern, the open question and the account action together.

The main scene retains EV-001, its first synthetic observation (68 MW at 00:00), four observations/two gaps, the absence of a defensible trajectory, and an explicit synthetic-source label. Desktop retains the small six-interval plot. Phone puts the complete plot in the native notebook so the final scene can keep the person, lantern and action together. No synthetic value, source, or null interval changed.

The lantern opens a source aperture over its own evidence field on desktop and an inline note on phone. The complete original folio and all five gesture controls are in the native “Examinar os cinco gestos” dialog. The compact Portal footer is now a native expandable index retaining all nine destination links; the Brazil/year, method statement and system link remain visible.

## Rendered evidence

All captures are the actual `/br` route at `http://127.0.0.1:4173/br`, not a preview fixture.

- Final desktop: `1440-light-resolution.png`, `1440-dark-resolution.png`.
- Final phone: `390-light-resolution.png`, `390-dark-resolution.png`.
- Native recordings: `1440-light-interaction.mp4`, `1440-dark-interaction.mp4`, `390-light-interaction.mp4`, `390-dark-interaction.mp4`.
- Opening, source aperture and notebook states: corresponding `*-opening.png`, `*-source.png`, `*-notebook.png`.
- `verification.json` and per-recording verification files retain native capture times, interaction outcomes and actual viewport bounds.
- `playback.json`: all four encoded recordings replayed at 1× without seeking to `ended=true`; corresponding `*-playback-sheet.jpg` sheets were visually inspected.
- `keyboard-reduced-verification.json`: 1440, 390 and 360 px with reduced motion. All five gestures activate with Space; source reveals without animation; Escape returns focus to the notebook opener. Every main control is at least 44 px high. The actual illustration is loaded and horizontal overflow is zero.
- `index-native.json`: native Space, Enter and pointer index toggles. The Enter test requires the CDP carriage-return character event; omitting it does not reproduce a physical Enter keypress. No application workaround was added.
- Earlier layout sweep in `../correction-01/responsive.json` covers 1440, 1024, 768, 390 and 360 px, both modes. The final phone text and source-aperture changes were subsequently checked in correction 02.

`npx tsc -b` and scoped ESLint passed during this correction. Runtime exception arrays are empty. These recordings preserve native screenshot timing, with modest capture cadence; encoding at 30 fps is not a claim of measured 30/60 fps browser performance.

## Changed files and boundary

- `src/components/g2/HouseFinale.tsx`
- `src/components/g2/house-finale.css`
- `src/components/g2/NivarShell.tsx` — compact footer branch only.
- `src/pages/br/g21-portal.css` — compact footer rules only.

No asset regeneration, data-model changes, auth/account behavior changes, Alexandria edits, git mutation or deployment.

## Remaining judgment

The original craft finding is visibly addressed: at the default final scroll position the figure, lantern, question and account action coexist. This is a builder assessment, not a replacement for a fresh independent craft verdict. The expanded phone source intentionally uses normal document flow and temporarily lengthens the scene; closing it restores the composed ending. The full notebook remains an optional, explicit examination.
