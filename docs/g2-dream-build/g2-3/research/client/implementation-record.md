# Client implementation record — G2.3

This workstream modified only client presentation and product-local interaction. No backend, Alexandria, global router, catalog availability, auth client, submission client, or conversation client was edited.

## Implemented

* Academy retains the reader/Perseu opening. The duplicated curriculum imports, track selector and `/alexandria/trilha/...` links are removed. Academy philosophy now explains context, examination and autonomy; Alexandria has one substantial property entrance at `/alexandria`.
* Advisory no longer mounts the document-restoration film. `AdvisoryExamination` presents a persistent illustrative claim and lets the visitor examine generation, tariff and cost assumptions, including the consequences of missing evidence. Tab keyboard interaction supports arrows, Home and End. The component accepts `compact` for reuse by the house narrative.
* Family-owned public links to the operator were removed. All service entries lead to the unchanged top-level product URLs. Root owns the remaining Portal sample link.
* Argos and Hefesto portraits are composed into the masthead/material scenes through crop and alpha masks. Sócrates is part of the examination scene. The original portrait assets remain unchanged.
* All three product URLs now explain the service before authentication. The full `NivarShell` provides the house header, theme persistence, navigation and footer.
* CLE/Solar use a shared document intake with genuine file selection, replacement/removal, drag-and-drop, selected document metadata, explicit submission, errors and server-confirmed receipt. Requirements appear before selection. No fake upload percentage or timeline is introduced.
* Diagnóstico now provides a review step before the existing JSON POST, required-field guidance, complete-concern length validation, real receipt, selection among actual cases, and case-linked correspondence.
* The fixed four-event illustrative history and `[DATA]` method placeholder were removed from Diagnóstico. The client sees what is really recorded: scope and messages.

## Preserved contracts

For document products, the canonical registered API prefix still determines the endpoint. Selection alone does not submit. Submission checks account products, activates only if absent, then sends multipart field `file`; only the returned `Submissao` creates a receipt. HTTP 401, 403, 413, 415, 502 and 503 have honest client messages. PDFs remain delivered through the unchanged account interface.

Diagnóstico still sends readable sector/band/tariff labels, maps unknown tariff to null, and combines selected concerns plus free text with a blank line. These were existing behaviors, not changes. The review step makes no API call. Submission preserves entitlement-before-POST. Conversations are discovered with GET and created only by the first explicit message, using the exact case origin. Message length follows the backend's 8000-character maximum.

The public catalog was not changed: CLE remains available; Solar and Diagnóstico remain in preparation. Existing authenticated intake capabilities stay at the same routes and carry an explicit preparation notice.

## Validation so far

* Baseline screenshots supplied by root inspected before edits: Advisory, Academy, Hardware and all three client products.
* `npx tsc -b`: passed after implementation.
* Targeted ESLint on changed TSX files: passed.
* Full `gridalpha-detect src`: 0 P0 / 25 P2. Initial alpha-mask color literals triggered the surface-color rule; the masks now consume the opaque house ink token, with identical alpha semantics.
* No production build yet, because root is preserving the baseline `dist` for comparison.
* Live render and fixture interaction checks remain pending until root releases browser access. Source inspection is not claimed as interaction verification.

## Paths for render verification

* `/br/intelligence`: portrait/masthead relationship, light/dark contrast.
* `/br/advisory`: examination tabs; service entry links; full light/dark treatment.
* `/br/academy`: philosophy, single Alexandria property door, entry route; absence of internal tracks.
* `/br/hardware`: Hefesto measuring gesture inside copper composition.
* `/conta-de-luz-express`: anonymous public explanation; authenticated selected/error/sending/receipt states.
* `/solar-proposal-validator`: public preparation status; authenticated existing flow.
* `/diagnostico-energetico`: public preparation status; authenticated form validation, review, receipt, real case selector and correspondence.

## Follow-up contract review

`POST /api/conversations` returns the existing origin with `alreadyOpen: true` and ignores an opening body. To avoid a lost first message when another session opened the origin after the initial GET, the first explicit send now resolves/creates the conversation and then calls its message endpoint. Merely viewing an empty conversation never creates it. A failed message remains editable for retry. Closed conversations are available for reading, with sending disabled.

Scope-list and message-list failures now have their own states. Neither is rendered as a successful empty list. File validation marks the file control invalid only for a format/size error; service failures remain form-level alerts.

## Isolated browser verification environment

After baseline release, this agent's CUA session returned an empty browser inventory and `Browser is not available` for its existing browser and a fresh in-app tab, including after a session reset. The Terminal agent's CUA surface remained available, so live client verification was delegated there; this is not being counted as a successful client render check yet.

The fixture server at `docs/g2-dream-build/g2-3/evidence/client/fixture-server.mjs` serves the current local Vite front end at port 5188 with invented authenticated records, and port 5189 anonymously. Every `/api` request is answered locally; cookies and authorization are never forwarded. All mutations return a synthetic 503. The two synthetic diagnosis scopes demonstrate one conversation with one message and a second empty conversation. No real customer records, uploads, messages or authentication changes are used.

TypeScript and targeted ESLint passed again after the contract follow-up. Root may now build the production bundle; this agent has not overwritten the preserved baseline build.

## Observed browser results

The Terminal agent used its working CUA session against the isolated fixture origins. The implementation author separately inspected the saved Advisory desktop/mobile, Academy mobile, Hardware desktop/native, Intelligence mobile, CLE desktop and Diagnosis review images.

* Diagnosis: missing required fields displayed guidance and moved focus to the sector selector. Selecting Manufatura / 50–200 MWh, a concern and synthetic free text produced the exact review. Editing preserved those values. Selecting `fixture-scope-2` removed the first scope's message and rendered the second scope's actual empty conversation.
* Advisory: clicking Tarifa, then ArrowRight, selected Custos and changed the examination panel. The insufficient-evidence conclusion remained explicit.
* Academy: its public CTA moved to `#alexandria`; the product entrance points only to `/alexandria`. The curriculum remains entirely in the separate product.
* Hardware: the Tempo accordion opened the time-window explanation. The new copper study was subsequently checked after reload.
* Intelligence: the Hidrologia filter exposed its actual brief entry route.
* Anonymous CLE showed its public introduction and `Entrar para enviar fatura`; authenticated CLE showed the native upload with submit disabled until a file is selected.
* Solar kept its public preparation state, with the availability CTA scrolling to `#acesso`; its existing authenticated intake remained accessible. It was captured at 1440 dark and 430 light.
* DOM measurements confirmed root scroll width equal to the requested viewport for sampled family pages at 1440/430 and document products at 1440/430. No unobserved breakpoint is inferred from those samples.

## Copper material study

Hardware now uses the original generated six-second asset through reusable `src/components/g2/CopperStudy.tsx`. The previous separate still request was removed. The component loads its 21 KB poster first and provides no video `src` until the visitor explicitly requests playback. It uses one play followed by an explicit replay, supports pause, pauses when hidden/offscreen, and starts static even with reduced-motion preferences. A media failure retains the same poster and a retry button. The illustration is never presented as a real measurement or commercial hardware.

Browser observations: initial `src` was null; explicit play produced `paused: false`, currentTime 0.305 and duration 6.042. The film ended paused at 6.041667. Replay restarted at 0.249 with `paused: false`; explicit pause returned `paused: true`. A native 1280×720 capture is saved as `hardware-native-replay-paused.png`. No seamless-loop claim is made. Error and OS reduced-motion branches have code review but were not emulated in this browser pass.

Evidence lives in `docs/g2-dream-build/g2-3/evidence/client/`, including native captures and `browser-measurements.json`. Viewport-override captures carry the IAB surface scaling limitation; native captures show the actual 1280×720 surface. They are not presented as full-page screenshots.

## Document intake interaction follow-up

Using only the isolated authenticated origin, the Terminal agent selected `qa-invalid.txt`: the client rejected its MIME type locally with the format guidance. Selecting the invented 136-byte `qa-document.pdf` displayed its name, PDF type and removal control. Removing it disabled submit; selecting it again and explicitly submitting produced the fixture's synthetic HTTP 503. The UI retained the selected document, stated that receipt was not registered and produced no receipt. The native capture is `conta-luz-native-synthetic503.png`. This was the only intentional QA POST and was blocked by the local fixture server; no production document, notification or database record was created. Successful backend delivery and email are not claimed by this test.
