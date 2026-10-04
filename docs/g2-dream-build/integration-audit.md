# G2 account and operator integration audit

Verified on 2026-09-11 in the `wave/nivar-g2-dream-build` worktree. No commit, push, backend changes, shared auth changes, or Alexandria edits were made by this audit.

## Correctness fixes

- **Failed logout was silently treated as completed.** `PerfilPlataforma.tsx` previously navigated to the portal in `finally`, even when the server had not cleared the httpOnly session cookie. It now catches the failure, keeps a visible warning that access may remain active, and offers a real logout retry. This accounts for the existing AuthProvider behavior that clears its local user in `finally`. Only a successful logout response navigates away.
- **Malformed browser storage could crash a case.** `CaseWorkbench.tsx` previously accepted arbitrary annotation values from `sessionStorage`; a numeric `note` reached `.trim()` during rendering. Draft recovery now checks annotation fields individually, accepts only SHA-256 shaped hash strings, and discards invalid history entries. Valid text and valid history remain available.
- **Editing an annotation could silently assign a replacement file's identity to existing evidence.** The workbench now links the annotation to the open local file only through the explicit “Vincular anotação a esta fonte” action. Opening another source or editing text preserves the earlier hash and displays the mismatch. Unbound annotations are disclosed. The local file is never represented as the sample's original document.

## Measured verification

`account-integration-fixture-qa.mjs` opens and disposes its own headless Chrome browser context through CDP on port 9235. It does not use any existing browser page. Every API request is fulfilled by a browser-local QA fixture; unexpected writes are blocked. No account credentials, real account data, production downloads, or actual backend writes were used. Shapes were read from the actual auth, products, conta_luz, solar_proposal and diagnostico routers.

The final run recorded **24 passing checks and zero runtime exceptions** in `account-integration-fixture-qa.json`:

- Exact fixture identity, canonical product catalog, ready and pending submissions, empty solar list, and nullable diagnostic modality render through the unchanged production API clients.
- All four profile sections respond to native browser clicks. Product read failure displays an error and retry restores the catalog.
- The relative deliverable URL triggers an actual completed browser download; its bytes and SHA-256 match the browser-local fixture.
- A failed mocked logout retains the warning; successful retry clears the fixture session, after which `/conta` redirects to `/entrar`.
- Corrupted saved annotation fields no longer crash. Valid local history survives. Source A's explicit hash remains on the annotation after source B is opened and text is edited.
- Saving and exporting disclose local-only state. Export keeps the sample's original filename, the separately selected source B, and the annotation's source A identity distinct. Both local source object URLs and the export object URL are revoked.
- Reload restores saved text and hashes while declaring the document bytes absent. Clearing session storage removes the saved draft.

The profile screenshots are native CDP PNG captures at device scale 1: **1440×1000** and **390×844**, in light and dark modes. Their visible name and email are explicitly `QA Fixture` and `qa-fixture@example.invalid`. The light desktop, light mobile and dark mobile captures were visually inspected. No horizontal page overflow was measured on the mobile identity or request views. A subsequent mobile review found that horizontal section navigation hid the security label; it has now been replaced with four fully visible choices in a 2×2 grid, and both mobile screenshots were recaptured.

Screens: `screens/account-profile-fixture-desktop.png`, `screens/account-profile-fixture-mobile.png`, and their `-dark` variants.

`npx tsc -b` passed after the application changes. No clipboard feature exists in the audited account/operator code; there was no clipboard action to exercise.

## Limits

These are browser-local fixtures, not proof of a live authenticated backend session, real operator authorization, real PDF content, or backend save/delivery behavior. The operator remains an explicitly illustrative queue with local drafts. The production auth transport, relative URLs and data contracts are unchanged. No additional concrete integration regression was identified in the inspected shared G2 shell or Terminal Brasil code.

Earlier fixture-harness attempts were corrected for CDP serialization of DOM nodes, the numeric child inside the Leitura button, and a text-entry assertion that incorrectly assumed insertion would append. These were harness issues; the final report records the completed run.

## Follow-up: account navigation and actual Advisory intakes

The three real intake pages now opt into `components/g2/advisory-intake.css` and share `AdvisoryIntakeHeader`. This changes the wordmark, typography variables, visual frame, mobile layout and theme controls. It retains the production flows and adds no demonstration label to real API operations. The existing page navigation transition callbacks are preserved by the shared header.

`intake-business-preservation.json` compares each page to Git HEAD: all component state, auth guards, validation and submission logic are byte-identical, as is all main/form/history markup except the footer wordmark. No input callback, API call, product activation, upload or history component was changed.

`intake-coherence-fixture-qa.json` records **29 passing checks**, zero runtime exceptions and zero attempted POSTs. It verifies all four account navigation labels fit without scrolling at 390px; all three authenticated intake openings; retained file/select/textarea controls; header visibility; and no horizontal intake overflow at 390px. Chrome's actual rendered-font inspection confirms custom Newsreader, Instrument Sans and IBM Plex Mono for the sampled headings, form labels and navigation; no native fallback appeared in those samples.

Each intake has native **1440×1000** and **390×844** screenshots in both modes: `screens/intake-{cle,solar,diagnostico}-fixture-{desktop,mobile}.png` and their `-dark` variants. The final captures wait for the existing decorative SVG drawing animation to finish. Desktop CLE, mobile Solar dark and desktop Diagnóstico dark were visually inspected after the final style change. The account mobile screenshots were also inspected with all four labels visible.

The fixture harness intercepts auth, product, submission and conversation reads in a newly created browser context. The existing submit flows were not triggered. `npx tsc -b` and the scoped whitespace check passed after the changes. The initial type check caught an unused `Link` import after header extraction; that import was removed before the passing check.
