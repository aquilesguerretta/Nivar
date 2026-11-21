# Implementation toolkit for the next craft pass

The goal is not to add libraries for prestige. Each tool below maps to a specific remaining design problem.

## 1. GSAP + ScrollTrigger

Docs:
https://gsap.com/docs/v3/Plugins/ScrollTrigger/
Installation:
https://gsap.com/docs/v3/Installation/

Use for:

- pinned hero chapters
- scroll-scrubbed evidence transformation
- semantic section handoffs
- Portal light-to-dark threshold
- Diógenes closing synthesis
- scroll-linked family motion

Key capabilities:

- `scrub`
- `pin`
- `snap`
- `matchMedia`
- timeline labels
- callbacks

Current GSAP docs state the plugins are available via npm with current GSAP releases.

Do not use:
scroll-jacking for basic reading sections.

## 2. Motion for React

Scroll:
https://motion.dev/docs/react-scroll-animations
Layout/shared element:
https://motion.dev/docs/react-layout-animations

Use for:

- persistent EV-001 shared element
- Ariadne path/state continuity
- panels building from smaller components
- selected observation transitions
- family emblem micro -> hero relationships
- content state changes

Useful mechanisms:

- `layout`
- `layoutId`
- `AnimatePresence`
- `useScroll`
- `useTransform`
- `useSpring`
- `useReducedMotion`

## 3. Lenis

Repo:
https://github.com/darkroomengineering/lenis

License:
MIT

Use only if:

- WebGL / scroll synchronization needs a smooth progression
- pinned storytelling benefits materially

Avoid if native scroll + ScrollTrigger/Motion already feels right.

## 4. ThreeUI Community

Site:
https://threeui.com/
Repo:
https://github.com/MengTo/threeui
Package:
`@designcodeio/threeui`

Current Community README documents:

- 50 Community parent components
- 111 Community routes
- 164 browse results total
- application and Community component code under MIT
- ThreeUI-authored Community imagery under MIT
- bundled open fonts remain OFL
- bundled Three.js runtime remains MIT

Inspect before building custom equivalents:

- 3D Paper
- Structure Flow
- Predictive Arc
- Constellation Field
- Portal Field
- Diagnostics Panel
- Globe if geography genuinely needs depth

Do not paste a component into NIVAR unchanged. Extract or adapt the mechanism.

## 5. Three.js / React Three Fiber

Use when:

- a relationship is truly spatial
- material depth is part of comprehension
- a camera transition preserves narrative continuity

Good candidate:
Ariadne light-to-dark product threshold or evidence-object transformation.

Bad candidate:
ambient floating particles behind text.

## 6. Higgsfield

Use for:

- cinematic source shots
- controlled transitions between real/brand worlds
- family hero media
- brand film connective tissue

Do not ask Higgsfield to invent factual Brazil and then label it as a real place.

The desired hierarchy is:

real Brazil when factual place matters
+
Higgsfield when cinematic or conceptual connective tissue matters
+
native UI for truth/data/method

## 7. Blender

Use for:

- brand material experiments
- patron relief / physical mark treatment
- controlled camera through evidence planes
- hardware/material scenes when not claiming factual product photography

Do not force Blender into the runtime if the render only adds decorative weight.

## 8. Browser / visual review

Every motion/craft change should be reviewed in rendered output at:

- 1920
- 1440
- 1024
- 768
- 430
- 390

Motion review must use actual playback or scrub, not endpoint screenshots only.

## 9. Recent Design skills to inspect

Directory:
https://recent.design/skills

Potentially useful skills if available in Codex/Astra:

- `anthropics/frontend-design`
- `pbakaus/critique`
- `pbakaus/polish`
- `emilkowalski/prototype`
- `emilkowalski/emil-design-eng`
- `emilkowalski/review-animations`
- `emilkowalski/animation-vocabulary`
- `emilkowalski/apple-design`
- `vercel-labs/web-design-guidelines`
- `mattpocock/grill-me`

These should complement, not replace, the Design Loop.

## 10. Suggested technical division of labor

### Hero film
Higgsfield / licensed real footage + GSAP/ScrollTrigger + Motion shared elements + native UI overlay.

### House scroll choreography
GSAP ScrollTrigger + Motion.

### Software / Ariadne
Motion shared elements first. ThreeUI/Three.js only if spatial relation is genuinely better.

### Terminal
Motion for UI state, chart morphing library/native SVG/canvas for data, CSS material hierarchy.

### Diógenes close
GSAP/Motion + high-resolution patron art. Avoid utility SVG as centerpiece.
