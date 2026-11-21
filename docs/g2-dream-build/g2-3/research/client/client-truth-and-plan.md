# Client product truth and implementation plan

Read-only audit, 2026-09-12. Repository: `gridalpha-v2-nivar-g2`; requested work branch: `wave/nivar-g2-dream-build`. Root workstream owns the starting Git and visual-baseline record. No runtime changes, backend writes, authentication attempts, submissions, or outbound messages were made in this audit.

## Findings that determine the design

The products are substantially more implemented than the public navigation suggests. Solar and Diagnóstico have genuine customer intake pages and working client code; the problem is that the public catalog sends visitors to operator demonstrations, while the customer intake routes redirect visitors into authentication before explaining the product. Their public availability remains `em-breve` in `src/lib/data/br-destinos.ts`. These two facts must remain distinct: a backend route exists; public launch has not been declared.

| Surface | Existing truth | Required client correction |
| --- | --- | --- |
| Academy | `FamilyPages.tsx:497` imports Alexandria curriculum, calculates counts, presents three selectable track entry points, links `/alexandria/trilha/...` | Remove track state, track browser, track links, and curriculum imports. Explain Academy's philosophy, then present one substantial Alexandria property introduction and a clear `/alexandria` entry. |
| Advisory | Human examination copy and keyboard-operable three-stage tabs exist; archival hand/document footage carries the wrong meaning | Replace the restoration scene with an authored examination of a claim: claim, missing premises, interpretation held open. Preserve existing patron art. |
| Conta de Luz Express | Genuine authenticated upload, account activation, confirmation, real account delivery | Replace the remaining legacy product composition and wire its entire journey into G2 material, typography, spacing, responsive navigation and theme persistence. |
| Solar | Genuine authenticated proposal upload and manual PDF delivery; catalog `em-breve` | Public product explanation with accurate preparation status and requirements; preserve existing authenticated workflow. No operator entry from the public path. |
| Diagnóstico | Genuine structured scope submission and case-linked human conversation; no operational event or deliverable contract | Explain the scope and client relationship honestly. Replace illustrative progress beside real messages with actual received-scope data. |

### Operator leaks

* `src/pages/br/G2Portal.tsx:263`: public sample CTA points to `/operador/solar-proposal-validator/sol-3c71`.
* `src/pages/br/FamilyPages.tsx:468`: unavailable Solar and Diagnóstico services point to `/operador/${d.id}`.
* `src/pages/br/FamilyPages.tsx:490`: public independence statement ends with `/operador`.

Redirect those four public destinations into public product/method explanations. Do not edit operator internals. Operator route protection remains unchanged.

## Real contracts and constraints

### Shared session and entitlement behavior

All three intake routes wait for `useAuth().loading` before redirecting anonymous visitors to `/entrar` with `state.de = location.pathname`. Login returns to that state; account creation preserves it. Authentication uses relative `/api/...` paths and `credentials: include` because the session cookie depends on same-origin proxying. Preserve that topology. Before submitting, pages call `myProducts()` and activate the product only if access is absent; backend independently checks entitlement. No payment contract exists in these flows; do not invent a price or checkout.

### Conta de Luz and Solar

* Paths: `/api/conta-luz-express/submissions` and `/api/solar-proposal-validator/submissions`.
* POST: multipart, exactly one `file` field. The canonical client lives in `src/lib/submissoes/api.ts`.
* Source input: PDF, JPEG, PNG, WebP; default maximum 15 MiB, environment configurable. Server validates signatures, size, filename and content type. Final deliverable: PDF, default 20 MiB.
* Guards: session, entitlement (403), email configuration (503), upload validation (413/415), notification then transaction commit. An operator-notification failure is 502 and rolls back the submission. Never show a confirmation unless the POST returns a real submission.
* Client-visible lifecycle: only `submitted` and `ready`. Account response contains source metadata; `deliverable` is null until ready, then contains a relative download URL. Do not invent 'assigned', 'auditing', '90% complete', delivery date, or real-time progress.
* GET list and item are real; list is scoped to the user and newest-first. Source and PDF downloads require a visible submission. Operator-only attachment endpoint must stay out of client UI.
* `src/pages/conta/PerfilPlataforma.tsx` already renders real submission statuses and PDF links. Use that client destination after confirmation.
* `FLUXOS_SUBMISSAO.aoVivo` is true for both, but deliberately independent from catalog launch status. `docs/pendencias-infra.md` records unresolved email settings; it is history, not proof of today's deployment configuration. This audit did not claim that production submissions are enabled.

### Diagnóstico Energético

* Path: `/api/diagnostico-energetico/submissions`.
* POST JSON: `sector` (required, max 200), `monthlyConsumptionBand` (required, max 80), `tariffModality` (nullable, max 80), `concern` (required, max 4000).
* The frontend combines selected concerns and free text into `concern`. `nao-sei` becomes null. Preserve both transformations. Current concern length has no client-side combined-length guard, so a long text can legitimately receive 422; a counter/limit can be added without changing the API.
* Output is the stored scope, ID and timestamps. There is no `status`, `deliverable`, email notice, or operational-event feed in this router.
* Conversations use `/api/conversations`, and the exact origin pair is `diagnostico_energetico_submission` plus the scope ID. Existing conversation discovery is read-only; a conversation is created only on the first explicit client message. Preserve this useful behavior.
* `HistoricoDiagnostico.tsx` currently selects the newest case only. Its right side uses real messages, but its left side always renders four fixed sample events about a contract, scope call, and demand review—even when the user has no case. The tiny sample label does not make this a good client experience. Replace the fixed history with the selected real scope and its submission timestamp. State that additional operational milestones are not available instead of manufacturing them. A case selector is possible using the already returned scopes, without inventing an endpoint.

## Recommended implementation

### Route architecture

Preserve the current authenticated intake URLs and their redirect behavior. Add public G2 explanation routes under the existing Brazil router, e.g. `/br/advisory/solar-proposal-validator`, `/br/advisory/diagnostico-energetico`, and optionally `/br/advisory/conta-de-luz-express`. Public service links go there. Public Solar and Diagnóstico pages explicitly say the product is in preparation and explain what it will receive and examine. They may link to account history for an existing engagement; they must not advertise general availability or route into analyst samples. This is the smallest risk to existing direct links and account behavior. If the root instead chooses the original top-level URLs as public wrappers, the protected intake path and all return destinations must be treated as one deliberate routing change.

### Visual and interaction direction

1. Academy: keep the successful Perseu/reader composition, deepen the statement about independent thinking, replace the track selector with an editorial principle sequence (context → questioning → autonomy), then create a substantial Alexandria entrance as a distinct property. No embedded product navigation; no speculative Academy catalog.
2. Advisory: the three examination states become one persistent document/claim object that changes when the user tests premises. A claim is not replaced by a fake calculation. Show which required evidence is supplied or missing and why the conclusion remains open. The existing `3,2 anos` is labelled illustrative. A Socratic patron fragment can illuminate the examination surface; avoid a disconnected image box.
3. Intake: use a restrained G2 instrument frame with a durable product identifier, concise explanation, explicit requirements, selected file metadata, and one unambiguous submit action. One account authentication path; no fabricated progress percentage. Preserve selected-file/error/blocked/submitting/received states.
4. Solar: public surface describes proposal inputs and the manual output. A preparation notice should be visually integrated and clear before any CTA. The account remains the destination for existing work.
5. Diagnóstico: public surface describes the four scope inputs and real correspondence. Authenticated surface shows scope receipt and conversation, with selection among genuine past scopes where useful.
6. Use the same theme preference as `NivarShell`; the current intake pages each start `claro`, causing discontinuity. Scope all new CSS to G2/client roots. Existing intake override CSS is a bridge with fragile descendant selectors and `!important`, so new semantic classes are preferable.

### Smallest coherent file ownership

**Client implementation owner:**

* `src/pages/br/FamilyPages.tsx` — only Academy and Advisory sections plus related imports/FamilyFilm removal.
* New `src/pages/br/AdvisoryProductPages.tsx` and dedicated `g23-client.css` for public explanations and examination composition.
* `src/pages/conta-de-luz-express/ContaDeLuzExpressPage.tsx`.
* `src/pages/solar-proposal-validator/SolarProposalValidatorPage.tsx`.
* `src/pages/diagnostico-energetico/DiagnosticoEnergeticoPage.tsx`.
* `src/pages/diagnostico-energetico/HistoricoDiagnostico.tsx`.
* `src/components/g2/AdvisoryIntakeTheme.tsx` and `advisory-intake.css`.

**Root integration owner, requested small edits:**

* `src/pages/br/PortalBRRouter.tsx` — public explanation routes.
* `src/pages/br/G2Portal.tsx` — sample CTA destination.
* House/brand components and global G2 theme variables remain with the root design owner; client CSS consumes them.

**Read only:** `app/**`; `src/lib/auth/**`; `src/lib/submissoes/**`; `src/lib/diagnostico/**`; `src/lib/conversas/**`; `src/lib/data/br-destinos.ts`; account flow unless a specific integration dependency is assigned.

**Never modify:** Alexandria pages/components/assets/tokens/curriculum/navigation/runtime. Do not import its CSS or render its internal modules inside Academy.

## Research mechanism → NIVAR experiment

Research retrieved 2026-09-12. These are inspected official design guidance and accessible examples; they are not a claim that gated product flows were fully exercised.

### File selection: Carbon and Component Gallery

[Component Gallery's file upload inventory](https://component.gallery/components/file-upload/) exposes multiple design systems and their accessibility/code guidance. It led to [Carbon file uploader](https://carbondesignsystem.com/components/file-uploader/usage/), whose visible mechanisms include distinct selection/loading/uploaded states, requirements before selection, filename disclosure, aligned file records and keyboard activation. NIVAR experiment: make the selected document a visible record with type and size, keep the final submit action separate, disclose supported formats and limit before selection, preserve focus and provide corrective error text. Do not import Carbon's visual style or assume its automatic upload behavior matches NIVAR's explicit submission contract.

### Scope and confirmation: official form patterns

[Carbon forms](https://carbondesignsystem.com/patterns/forms-pattern/) provides a structured form model, and [GOV.UK check answers](https://design-system.service.gov.uk/patterns/check-answers/) demonstrates labelled summary rows and specific change actions before final submission. NIVAR experiment: on Diagnóstico, organize scope inputs as a coherent question sequence, show meaningful value labels, provide an optional review of entered scope before the existing POST, and make the submitted record clearly different from a draft. For a one-file flow a separate wizard is unnecessary: filename/type/size and an explicit send action are enough.

### Native file accessibility

[GOV.UK file upload](https://design-system.service.gov.uk/components/file-upload/) provides a native-file-input pattern with an associated label, hint and error association. NIVAR experiment: retain the native input, use visible format/size guidance and a complete accessible filename, and test keyboard focus after selection. This supports the current real upload rather than replacing it with a decorative drop zone.

### Access limitations

Pageflows returned HTTP 403 to the research tool. Mobbin's public browse route returned its login/join shell without inspectable flows. No claim of complete Mobbin or Pageflows inspection is made; the accessible official examples above were used for actionable mechanisms. Carbon's old typography URL could not be opened; the root typography workstream should use the current official page.

## Verification required after implementation

* Click every Portal/Advisory service CTA anonymously: zero operator URLs; public status truthful; no premature login before product explanation.
* Exercise authentication return destinations through existing browser-local fixtures, not real customer credentials. Confirm anonymous direct intake remains guarded.
* Fixture tests for upload selection, invalid MIME, file replacement/removal if added, submit lock, 413/415, 401, 503, 502 and successful receipt. Capture outgoing multipart field and entitlement order. Do not send a production test document or notify an operator.
* Fixture-test Diagnóstico JSON and null handling, combined concern, true confirmation, newest/selected case conversation, no duplicate conversation, and no fixed events on an empty account.
* Inspect public/client pages in both themes at 390/430/768/1024/1440/1920 as practical. Check focus, long names, horizontal overflow, reduced motion, media fallback, tabs and touch targets.
* Compare Alexandria source tree and scoped computed styles to the untouched baseline; navigate in and out via Academy. Root owns the visual baseline capture.
