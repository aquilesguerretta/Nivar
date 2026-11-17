# gridalpha-detect

Static auditor for the GridAlpha terminal anti-patterns. Encodes the
detectable subset of `.claude/skills/gridalpha-terminal/references/`
(FOUNDRY's design vocabulary) into a CLI gate that runs on a
developer's machine, in a pre-commit hook, and in CI.

This is GridAlpha's analog to impeccable's `detect` CLI (referenced in
the "Designing with Claude Code" guide) — same enforcement pattern,
different rule set. Where impeccable's gate is tuned for Western
minimalism, ours is tuned for institutional terminal aesthetic
(Palantir Gotham × Bloomberg × ISA-101 industrial HMI).

The auditor exists to catch what slips past three other layers:

1. **The skill itself** — FOUNDRY's `gridalpha-terminal` skill primes
   the model at write-time.
2. **CHROMA hand-passes** — each wave reviews surfaces for cohesion.
3. **Screenshot verification** — CONDUIT's Playwright loop catches
   visual regressions.

Three layers of defense. The auditor catches what slips past all of
them.

---

## Quick start

```sh
# Audit the entire src/ tree
node tools/gridalpha-detect/bin/gridalpha-detect.mjs src

# Audit specific files
node tools/gridalpha-detect/bin/gridalpha-detect.mjs \
  src/components/nest/trader/TraderNest.tsx

# JSON output for CI integration
node tools/gridalpha-detect/bin/gridalpha-detect.mjs src --json > audit.json

# List every rule with severity and description
node tools/gridalpha-detect/bin/gridalpha-detect.mjs --list-rules

# Run a single rule (used by tests + targeted sweeps)
node tools/gridalpha-detect/bin/gridalpha-detect.mjs src \
  --only no-tailwind-on-layout

# Don't block on P0 (rare; useful for measurement)
node tools/gridalpha-detect/bin/gridalpha-detect.mjs src --no-fail-on-p0
```

Exit codes:

| Code | Meaning |
| --- | --- |
| `0` | clean run, or only sub-P0 findings (P1/P2/P3) |
| `1` | at least one P0 finding |
| `2` | invocation error (bad args, unreadable root) |

---

## Severity

| Severity | Behavior | Examples |
| --- | --- | --- |
| **P0 BLOCK** | Blocks the pre-commit hook + CI check. | Default Inter, pure #000/#FFF, gradient text, Tailwind on layout-critical, easeOutBounce easing, sine-wave decorative SVG. |
| **P1 WARN** | Surfaces in output, requires acknowledgment but does NOT block. | Numeric data missing tabular-nums, box-shadow on a data card, pill chip on a metadata role. |
| **P0 BLOCK** (Alexandria) | Same, scoped to `src/**/alexandria*`. | Internal vocabulary or the dead "GridAlpha" brand in learner-visible text; shadow / radius / gradient against S2; a native `<input type="range">`. |
| **P1 WARN** (Alexandria) | Same, scoped to `src/**/alexandria*`. | Filled circle carrying an initial; a control closed by a four-sided border. |
| **P2 INFO** | Worth fixing but doesn't immediately break the surface. | Grid with 3+ children and no dominant focal marker. |
| **P3 NOTE** | Informational. Surfaced in `--json` reports for trend tracking; suppressed by default in console output. (No P3 rules ship today.) |

---

## The rule catalogue

Fifteen rules. Rules 1-10 are the GridAlpha terminal family and run on
the whole tree; the "Source" column points at the FOUNDRY skill
reference that authorizes them. Rules 11-15 are the `alexandria-*`
family, scoped to `src/**/alexandria*` and sourced from
`docs/alexandria-v2/bar.md` — see "The Alexandria rule family" below.

### P0 (blocks merge)

#### 1. `no-tailwind-on-layout`

**Catches:** Tailwind utility classes for height/width/padding/margin/
gap/grid-cols/flex-direction/positioning on elements inside terminal
surfaces.

```tsx
// ✗
<div className="grid grid-cols-3 gap-4 p-6">…</div>

// ✓
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: S.lg, padding: S.lg }}>…</div>
```

**Source:** `terminal-antipatterns.md` → "Tailwind on layout-critical
elements". Historical failure: Generation Mix bar's Tailwind `h-X`
utilities broke on resize inside the established grid pattern.

**Exemptions:** `/components/editorial/`, `/components/landing/`,
`/components/ui/` (shadcn), `/components/figma-reference/`,
`/pages/auth/` + `GlobalShell.tsx`, `FalconLogo.tsx`, `LMPCard.tsx`,
`LandingPage.tsx`.

---

#### 2. `no-decorative-svg`

**Catches:** Inline SVG `<path d="…">` whose path signature looks like
a hand-drawn sine wave (3+ cubic-bezier segments, no straight-line
commands, Y coordinates alternating above/below a baseline).

```tsx
// ✗ (a fake hero "chart")
<svg viewBox="0 0 100 50">
  <path d="M0 25 C20 0 30 50 50 25 C70 0 80 50 100 25" stroke="…"/>
</svg>

// ✓
<ResponsiveContainer width="100%" height={140}>
  <LineChart data={liveLmp24h}>…</LineChart>
</ResponsiveContainer>
```

**Source:** `terminal-antipatterns.md` → "Sine-wave decorative SVGs
masquerading as data". The operator sees real data on every other
surface; a fake sine wave breaks the trust contract.

**Exemptions:** `/components/terminal/` (FOUNDRY's icon primitives),
`/components/ui/`, editorial paths, `FalconLogo.tsx`.

---

#### 3. `no-inter-no-system`

**Catches:** `fontFamily` / `font-family` declarations on the
terminal layer that:
- Name Inter, system-ui, -apple-system, SF Pro, Segoe UI, or
  Roboto AND don't put Geist Mono first in the stack.
- Use bare `monospace` without `Geist Mono` as the primary.

```tsx
// ✗
fontFamily: 'Inter, system-ui, sans-serif'

// ✗ (bare monospace)
fontFamily: 'monospace'

// ✓
fontFamily: F.mono  // resolves to "'Geist Mono', 'Fira Code', monospace"
```

**Source:** `terminal-typography.md` → font lock.

**Exemptions:** editorial / landing / auth + `LandingPage.tsx`,
`design/editorial.ts`.

---

#### 4. `no-pure-black-white`

**Catches:** `#000`, `#000000`, `#FFF`, `#FFFFFF`, `rgb(0,0,0)`,
`rgb(255,255,255)` in TSX inline styles, TS files, or CSS.

```tsx
// ✗
color: '#FFFFFF'

// ✓
color: C.textPrimary  // #F1F1F3
```

**Source:** `terminal-color.md` → "No pure black `#000000`",
"No pure white `#FFFFFF`".

**Exemptions:** editorial / landing / auth / figma-reference /
shadcn ui + `LandingPage.tsx` + `design/editorial.ts` +
`/components/atlas/layers/` (Mapbox layer expressions need hex) +
`/services/pdfTemplates/` + `services/pdfExport.ts` (printed paper).

---

#### 5. `no-gradient-text`

**Catches:** `background-clip: text` (or `-webkit-background-clip:
text` / TSX `backgroundClip: 'text'` / Tailwind `bg-clip-text`) AND
a gradient fill in the same style declaration.

```tsx
// ✗
<h1 style={{
  backgroundImage: 'linear-gradient(90deg, …)',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
}}>…</h1>

// ✓
<h1 style={{ color: C.textPrimary, fontSize: 32 }}>…</h1>
```

**Source:** `terminal-antipatterns.md` → "Gradient text for emphasis".

**Exemptions:** editorial / landing / auth + `LandingPage.tsx`.

---

#### 6. `no-easeOutBounce`

**Catches:**
- `easeOutBounce`, `bounceIn`, `bounceOut`, `bounceInOut`
- `easeOutElastic`, `easeInElastic`, `easeInOutElastic`
- GSAP `Bounce.easeOut` / `Bounce.easeIn`
- GSAP `Elastic.easeOut` / `Elastic.easeIn`
- GSAP `Back.easeOut` / `Back.easeIn` (overshoot)
- Framer Motion `type: 'spring'`
- Framer Motion `bounce: <number>`

```tsx
// ✗
transition={{ type: 'spring', bounce: 0.4 }}

// ✓
transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)'
```

**Source:** `terminal-motion.md` → "Forbidden easings: spring, bounce,
elastic".

**Exemptions:** editorial paths.

---

### P1 (warns)

#### 7. `require-tabular-nums`

**Catches:** Elements opt-marked as numeric (via `className`
containing `"numeric"`, `data-numeric` attribute, or
`data-display="metric"`) that don't also declare
`fontVariantNumeric: 'tabular-nums'` (or spread `T.dataValue` /
`T.displayValue` which include it).

```tsx
// ✗
<span data-numeric>{price.toFixed(2)}</span>

// ✓
<span data-numeric style={{ ...T.dataValue }}>{price.toFixed(2)}</span>

// or
<span data-numeric style={{ fontVariantNumeric: 'tabular-nums', fontFamily: F.mono }}>
  {price.toFixed(2)}
</span>
```

**Source:** `terminal-typography.md` → "A numeric value rendered
without tabular-nums is a defect, not a preference."

**Exemptions:** editorial / landing / auth.

---

#### 8. `no-pill-chip-default`

**Catches:** JSX elements with `data-role="metadata" | "chip" | "tag"`
that also carry a pill-shape signal (`rounded-full`, `borderRadius:
9999`, `'50%'`, `'100%'`).

`role="status"` is INTENTIONALLY excluded — that's the canonical
small-circle pattern (`StatusDot`, `ConnectionStatusDot`,
`RegimeBadge` dot), not the antipattern.

```tsx
// ✗
<span data-role="metadata" className="rounded-full bg-blue-100 px-3 py-1">
  WEST_HUB
</span>

// ✓ (the platform's badge pattern)
<RegimeBadge regime="burning" />
// or
<span data-role="metadata" style={{
  display: 'inline-flex', alignItems: 'center', gap: 6,
  fontFamily: F.mono, fontSize: 11, textTransform: 'uppercase',
  letterSpacing: '0.12em', color: C.textMuted,
}}>
  <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.alertNormal }} />
  WEST_HUB
</span>
```

**Source:** `terminal-antipatterns.md` → "Pill-shaped chips with full
border-radius for metadata".

**Exemptions:** editorial / landing / auth.

---

#### 9. `no-box-shadow-on-cards`

**Catches:** Card elements (FOUNDRY components by name —
`ContainedCard`, `MetricTile`, etc. — or anything with
`data-component="Card"` / `data-elevation="card"` / `className`
containing `"Card"`) that declare a `boxShadow` other than
`none` / `inset`.

Escape hatch: add `data-elevation-override` to the card if it's a
raised overlay that legitimately needs a shadow.

```tsx
// ✗
<ContainedCard style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.20)' }}>…</ContainedCard>

// ✓ (elevation lives in the bg-token tier)
<ContainedCard>…</ContainedCard>

// ✓ (raised overlay opting in)
<ContainedCard data-elevation-override style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.20)' }}>…</ContainedCard>
```

**Source:** `terminal-color.md` → "No drop shadows on data cards.
Elevation shifts via surface hex."

**Exemptions:** editorial / landing / auth.

---

### P2 (info)

#### 10. `equal-weight-grid`

**Catches:** Grid containers (`display: grid` or Tailwind
`grid-cols-N`) with 3+ direct children and no child marked as the
dominant focal element via `data-hero`, `data-focal`, or `className`
containing `"hero"`, `"primary"`, `"dominant"`, `"focal"`.

```tsx
// ⚠ (auditor surfaces; reviewer decides)
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: S.md }}>
  <Card>…</Card>
  <Card>…</Card>
  <Card>…</Card>
</div>

// ✓
<div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: S.md }}>
  <Card data-hero>…</Card>
  <Card>…</Card>
  <Card>…</Card>
</div>

// ✓ (legitimately equal-weight — suppress)
// gridalpha-detect-disable-next-line equal-weight-grid
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>…</div>
```

**Source:** `terminal-composition.md` → "Every screen, every region,
must have one element whose visual weight is at least 2× the
next-highest element. This is non-negotiable."

**Exemptions:** editorial / landing / auth.

---

---

## The Alexandria rule family (`alexandria-*`)

Five rules that encode the **Alexandria v2 bar**
(`docs/alexandria-v2/bar.md`), not the GridAlpha terminal antipatterns.
They exist because of a method problem, not a taste problem.

> Three of the r09 critic findings were rules that had **already been
> declared and fixed in an earlier round** and came back on a new
> surface. Agent memory does not hold a rule; an auditor does.

### Scope — these rules never fail the whole tree

Every `alexandria-*` rule returns `false` from `appliesTo` unless
`isAlexandriaFile()` says yes. One definition, in
`src/rules/_alexandria.ts`:

| In scope | Out of scope |
| --- | --- |
| any path with an `alexandria/` directory segment — `src/components/alexandria/**`, `src/pages/alexandria/**` | `src/components/vault/Alexandria.tsx` (capital `A`: the old terminal vault surface) |
| basename `alexandria-*` or `alexandriaFoo` — `src/design/alexandria-tokens.ts`, `src/lib/data/alexandria-modulo-04-content.ts`, `src/services/cmdp/alexandriaQuery.ts` | everything else in `src/` |

This is load-bearing. Run the same five rules over the whole tree with
the scope guard off and they produce **1 435 findings, of which 1 134
(79 %) land outside Alexandria** — GridAlpha terminal code judged by a
bar that does not govern it (`R.md` radius tokens, the live company
wordmark on the landing page, framed controls that are terminal
vocabulary). The scope is the difference between a gate and a siren.

### What "visible to the learner" means

S4 forbids internal vocabulary **to the learner**. A comment, an import
specifier, a regex and a plumbing key are not learner-visible. The
shared scanner in `_alexandria.ts` tokenises each file once — code /
string / template substitution / regex / comment — and only these four
positions count as visible:

| Position | Example |
| --- | --- |
| JSX text node | `<p>§ 00 · destaque</p>` |
| label attribute (`aria-label`, `title`, `alt`, `placeholder`, …) | `aria-label="Abrir o § Lab"` |
| string literal owned by a **content key** (`titulo`, `rotulo`, `texto`, `html`, `marcador`, `secao`, `eyebrow`, `nota`, `atribuicao`, …) | `marcador: '§ 00'` |
| literal used directly as a JSX child | `{'extração'}` |

Anything owned by `id`, `slug`, `href`, `kind`, `arquivo`, `eixosNota`
and every other key outside `CONTENT_KEY_RX` is plumbing, and is
invisible to the rule by construction.

---

### P0 (blocks merge)

#### 11. `alexandria-no-internal-vocabulary`

**Catches:** the pipeline's own vocabulary printed at the learner —
section codes `§00 / § 00 / §MAP / §Final / §Caso / §Quiz / §Lab /
§Drill / §Lex / §Ref`, the words `extração`, `extraído do HTML`,
`aulas confirmadas`, `a fonte declara`, `backend`, `wave`, `mock` — plus
the dead brand `GridAlpha` in any form.

```tsx
// ✗
<span style={{ ...AT.rotulo }}>§ Lex · Módulos 01-08</span>
const dossie = { marcador: '§ 00', eyebrow: 'Alexandria · GridAlpha · Módulo 04' };

// ✓
<span style={{ ...AT.rotulo }}>Glossário · Módulos 01-08</span>
const dossie = { marcador: 'Abertura', eyebrow: 'Alexandria · Módulo 04' };
```

**Source:** `bar.md` §S4 gate "Linguagem interna proibida ao learner";
`bar.md` §6 hard gate "Ausência desonesta → linguagem interna (S4)" —
the piece fails automatically, hence P0; `bar.md` §11 **P24**
("GridAlpha morta para o learner").

**Exemptions:** none by path. P24 keeps `GridAlpha` legal in historical
provenance and in a technical comment — a comment needs nothing, a
provenance literal uses the line directive.

---

#### 12. `alexandria-materialidade`

**Catches,** anywhere in the Alexandria scope:

- `boxShadow` / `box-shadow` / `textShadow` other than `none` / `0`, and
  `filter` carrying `drop-shadow(` or `blur(`;
- `borderRadius` outside `{ 0, '0', '0px', AR.none, '50%', AR.circulo }`
  — `9999` is a pill, not a círculo pleno — and the Tailwind
  `rounded-*` utilities;
- `linear-` / `radial-` / `conic-gradient` **that ramps a colour**.

```tsx
// ✗
<div style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.2)', borderRadius: 12 }} />

// ✓ (depth is a 1px fio or a surface change — nothing else)
<div style={{ border: `1px solid ${A.fioSobreCreme}`, borderRadius: AR.none }} />
```

Two exemptions on the gradient clause, both principled — a gradient
that does not ramp a colour is not the thing S2 bans:

1. **Mask ramps.** `maskImage` / `WebkitMaskImage`, or a const whose
   name says máscara. Alpha is the mask; no colour is painted.
   `VinhetaModulo.tsx` and `TerritoriosHub.tsx` depend on this.
2. **Flat layers and hatches** — one distinct colour stop, or one rgb
   triple at several alphas: `linear-gradient(${A.navy} 0 0)`,
   `repeating-linear-gradient(45deg, ${fio} 0 1px, transparent 1px 6px)`.

**Source:** `bar.md` §S2 gate "Raio 0, exceto em círculo pleno. Zero
sombra, gradiente, vidro ou brilho. Profundidade só por fio de 1px ou
troca de superfície"; `bar.md` §6 hard gate "Materialidade quebrada".
`AR = { none: '0', circulo: '50%' }` in `src/design/alexandria-tokens.ts`.

**Supersedes** `no-box-shadow-on-cards` and `no-gradient-text` inside the
Alexandria scope — both of those now return early for Alexandria paths,
so one line is reported exactly once, at the severity the Alexandria bar
assigns. (`no-pill-chip-default` is *not* exempted: S2 allows a 50%
circle, which that rule still judges in its own context.)

---

#### 13. `alexandria-no-native-range`

**Catches:** `<input type="range">` with no declared house treatment.

```tsx
// ✗ — accentColor does not paint a thumb
<input type="range" style={{ accentColor: A.terracota, height: 24 }} />

// ✓
<input type="range" data-tratamento="trilho-alexandria" />
<input type="range" className="alx-trilho" />
```

A native range hands the thumb to the user agent, which paints a filled
circle with a bevel that differs per OS — S2's "zero sombra, gradiente,
vidro ou brilho" stops being ours to decide. It is also the exact r07 →
r09 recurrence, the check has no judgement in it, and it is trivially
mechanical. So it blocks.

Declaring the treatment is not the same as having it: the auditor cannot
see a rendered thumb, the critics can. This gate only guarantees that
nobody ships a slider by accident.

**Accepted markers:** `data-tratamento`, `data-trilho`, `data-controle`,
or a `className` containing `alx-` / `trilho` / `alexandria`.

---

### P1 (warns)

#### 14. `alexandria-no-form-circle`

**Catches:** a **filled** circle (`borderRadius: '50%' | 9999 | '100%' |
AR.circulo`, or `rounded-full`) whose own text content is **one or two
characters** — literally, or through an initial-shaped expression
(`[0]`, `.charAt(0)`, `.slice(0, 1)`, `inicial`).

```tsx
// ✗ — avatar with initial / step bubble: the most re-skinnable object in consumer SaaS
<span style={{ borderRadius: '50%', background: A.navy }}>{nome[0]}</span>

// ✓ — a circle is legal (S2 allows círculo pleno); the tell is the filled initial
<button style={{ borderRadius: '50%' }} aria-label="Abrir o Módulo 01" />
<div style={{ borderRadius: '50%', width: 9, height: 9, background: A.navy }} />
```

**Why P1.** S2 permits a círculo pleno, so shape alone proves nothing.
What this fires on is the generic-product tell that §6's "LMS / SaaS
genérico" gate is about — but composition is what actually decides that,
and the auditor does not judge composition. It warns; a reviewer rules.

---

#### 15. `alexandria-no-default-control-box`

**Catches:** a control — `<button>`, `<input>`, `<select>`,
`<textarea>`, `role="button"`, or any tag with `onClick` — closed by the
four-sided `border:` shorthand, with no declared exception.

```tsx
// ⚠ (auditor surfaces; reviewer decides)
<button style={{ border: `1px solid ${A.fioSobreCreme}`, padding: AS.sm }}>Registrar</button>

// ✓ (a single rule under the control is the house's own move)
<button style={{ borderBottom: `1px solid ${A.fioSobreCreme}`, border: 'none' }}>Registrar</button>

// ✓ (the frame is the decision — name it)
<button data-moldura="ficha" style={{ border: `1px solid ${A.fioSobreCreme}` }}>Registrar</button>
```

**Why P1, not P0.** S2 makes the 1px fio the house's *only* depth
language, so `border: 1px solid` is house vocabulary, used correctly
~35 times in this codebase on figures, sections and tooltips. A static
regex cannot separate "framed control that earns its frame" from
"framework default"; blocking on it would be dishonest. `borderTop` /
`borderBottom` / `borderLeft` / `borderRight` never fire.

**Declared exception:** `data-moldura`, `data-tratamento`, `data-caixa`
or `data-excecao` on the element — so the next reader sees a choice
instead of a default.

---

### What these five rules do NOT catch

The auditor reads text, not renders. It is worth writing down which r09
verdicts stayed with the critics, so nobody mistakes a green run for a
passing piece:

| Verdict | Why no rule |
| --- | --- |
| (1) S1 lost below the first fold; the resume block sliced mid-line | Composition and fold position — needs a render at a viewport. |
| (2) False destinations: the panel names an experience the map declares absent | Cross-surface consistency of data against data; the auditor has no model of what a surface promises. |
| (5) "a seguir" on Home vs "NÃO INICIADO" on the card, same state | Same: agreement between two surfaces at runtime. |
| (6) Hard vertical seam at x=624 | Layout, measured in pixels. |
| (7) The prediction field takes focus with no visible indicator | Runtime `:focus-visible` — CONDUIT's Playwright loop. |
| (8) The veil broken: the answer sits inside the prompt | Semantics of content. |
| (9) The lesson's entry fold has no matter | Presence and density. |
| (10) Three stacked location bands; a 276×17 target at 10px | Computed geometry at 390. |

**Composition, hierarchy and presence are not auditable statically.**
This family buys back exactly the part that is: vocabulary and
materiality, the two that came back twice.

### Fixtures

`fixtures/alexandria/fixture.tsx` holds one synthetic violation per
clause plus ten CLEAN blocks that must stay silent. After touching any
`alexandria-*` rule:

```sh
node bin/gridalpha-detect.mjs fixtures --no-fail-on-p0
```

Expected: 16 P0 + 3 P1, all on the numbered blocks, nothing below the
`-- CLEAN --` divider.

## Suppression

### Line-level

```tsx
// gridalpha-detect-disable-next-line no-pure-black-white
const PRINT_BG = '#FFFFFF'; // PDF needs literal white
```

Without a rule id, suppresses every rule on the next line.

Inside JSX the directive still needs a literal `//` on the raw previous
line, so it has to travel inside a JSX comment:

```tsx
{/* // gridalpha-detect-disable-next-line alexandria-no-internal-vocabulary — proveniência histórica (P24) */}
<span style={{ ...AT.aparato }}>Fonte: GridAlpha_Curriculo_Definitivo.docx</span>
```

The `alexandria-*` family also takes **declared exceptions on the
element itself**, which are better than a directive when the decision is
part of the design rather than a one-off: `data-tratamento` /
`data-trilho` / `data-controle` on a range, and `data-moldura` /
`data-tratamento` / `data-caixa` / `data-excecao` on a framed control.
A directive hides the finding from the auditor; an attribute shows the
choice to the next reader.

### File-level

```ts
// gridalpha-detect-disable file
// reason: generated Mapbox style config; literal hex is required
```

Top-of-file. The walker skips the file entirely. Use sparingly — a
file-wide bypass usually means the rule's path-config should be
updated instead.

### Bypass-the-hook

```sh
git commit --no-verify -m "…"
```

Three legitimate cases (everything else fixes the violation or uses
a directive):

1. Merge conflict resolution.
2. Mass refactor with a follow-up cleanup commit.
3. CI hot-fix.

---

## Reading the JSON report

```sh
node tools/gridalpha-detect/bin/gridalpha-detect.mjs src --json
```

```json
{
  "version": 1,
  "tool": "gridalpha-detect",
  "scannedFiles": 477,
  "durationMs": 293,
  "bySeverity": { "P0": 40, "P1": 0, "P2": 22, "P3": 0 },
  "findings": [
    {
      "rule": "no-pure-black-white",
      "severity": "P0",
      "message": "Pure white (#FFFFFF) — use C.textPrimary (or another four-tier token).",
      "file": "src/components/LMPCard.tsx",
      "line": 37,
      "column": 89,
      "snippet": "<span style={{ fontFamily: F.mono, fontSize: '72px', fontWeight: 'bold', color: '#FFFFFF', lineHeight: 1 }}>",
      "reference": "Pure black #000000 or pure white #FFFFFF"
    }
  ]
}
```

The CI workflow consumes this shape. Field stability is part of the
contract — additive changes are fine; renaming or removing fields is
a breaking change requiring a version bump.

---

## Adding a new rule

When a new anti-pattern emerges (FOUNDRY adds a new section to
`terminal-antipatterns.md`, CHROMA spots a new failure mode in a
wave audit), wire it as a rule in three steps.

### 1. Decide severity

Use the severity table at the top of this file.

### 2. Write the rule file

`src/rules/<rule-id>.ts` exports a default `Rule`:

```ts
import type { Rule, Finding, SourceFile } from '../types.js';
import { isLineSuppressed } from '../walker.js';

const RULE_ID = 'rule-id';

const ALLOWED_DIRS = [
  '/components/editorial/',
  '/components/landing/',
  // …editorial-layer exemptions
];

function isAllowedPath(relPath: string): boolean {
  const norm = relPath.replace(/\\/g, '/');
  return ALLOWED_DIRS.some((dir) => norm.includes(dir));
}

function indexToLineCol(s: string, idx: number): { line: number; column: number } {
  let line = 1;
  let col = 1;
  for (let i = 0; i < idx && i < s.length; i++) {
    if (s[i] === '\n') { line += 1; col = 1; } else { col += 1; }
  }
  return { line, column: col };
}

const rule: Rule = {
  id: RULE_ID,
  severity: 'P1',  // or P0 / P2 / P3
  description: 'One-line description.',
  reference: 'Section title in terminal-antipatterns.md',

  appliesTo(file: SourceFile): boolean {
    if (file.ext !== 'tsx') return false;
    if (isAllowedPath(file.relPath)) return false;
    return true;
  },

  check(file: SourceFile): Finding[] {
    const findings: Finding[] = [];
    // …regex / AST walk against file.contents
    //   on a match, compute { line, column } via indexToLineCol
    //   check isLineSuppressed(file.contents, line, RULE_ID)
    //   push a Finding
    return findings;
  },
};

export default rule;
```

### 3. Register in the rule index

Add the import + the export to `src/rules/index.ts`:

```ts
import myNewRule from './my-new-rule.js';
export const ALL_RULES: Rule[] = [
  // …
  myNewRule,
];
```

### Checklist before shipping the rule

- [ ] Rule passes `npm run typecheck`.
- [ ] Rule fires on at least one synthetic violation (write a quick
      `tests/`-style test or run `--only <rule-id>` against a file
      you've added a violation to).
- [ ] Rule produces zero false-positives on the existing src/ (or
      every false-positive is documented in the rule's exemptions).
- [ ] Rule entry added to this README's catalogue.
- [ ] Commit message references the FOUNDRY skill section that
      authorizes the rule.

---

## Pre-commit hook

`.husky/pre-commit` ships with the repo and runs the auditor on
staged TSX/TS/CSS files before each commit. Blocks on P0, warns on
P1+.

### Installation

```sh
# With husky (recommended)
npm install -D husky
npx husky init

# Manual
cp .husky/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

See "Suppression → Bypass-the-hook" above for legitimate bypass
cases.

---

## CI integration

Documented at [`ci-integration.md`](./ci-integration.md). The GitHub
Actions workflow is ready to deploy — Aquiles activates it when ready
by copying the YAML to `.github/workflows/gridalpha-detect.yml`.

---

## What the auditor does NOT do

- **Doesn't run a browser.** Visual / runtime rules (atmospheric
  vignette intensity, focus-ring contrast, motion timing) need
  Playwright. Future: integrate with CONDUIT's screenshot loop.
- **Doesn't auto-fix violations.** Authors fix or suppress.
- **Doesn't enforce ownership boundaries between agents.** Tokens
  are FOUNDRY's; rule files are CHROMA's. The auditor itself
  doesn't police "who owns what file" — git history does.
- **Doesn't reach the editorial layer.** Editorial / landing / auth
  surfaces have their own (looser) rules; the auditor exempts those
  paths by default.

---

## Roadmap

- **Runtime rules** via Playwright (post-CONDUIT Wave 4 stabilization).
- **Auto-fix mode** (`--auto-fix`) for mechanical P0 violations
  (`'#fff'` → `C.textPrimary`, default `Inter` → `F.mono` import,
  etc.).
- **Skill-sourced rule descriptions.** Today the rule's `reference`
  field is a string; a future iteration parses
  `.claude/skills/gridalpha-terminal/references/` at rule-build time
  so changes to the skill flow through automatically.
- **TypeScript AST mode** for the rules that currently regex —
  trades a small perf hit for false-positive reduction on complex
  JSX.
