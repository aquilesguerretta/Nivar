// ALEXANDRIA r09 — `alexandria-materialidade`.
//
// bar.md §S2 ("Materialidade, cor como pontuação, vozes e contenção"), Gate:
//   "Forma. Raio 0, exceto em círculo pleno. Zero sombra, gradiente,
//    vidro ou brilho. Profundidade só por fio de 1px ou troca de
//    superfície."
//
// bar.md §6 ("Hard gates globais — FAIL automático"):
//   "Materialidade quebrada | Raio, sombra, gradiente, vidro ou brilho;
//    cor fora de token; semáforo"  → the piece fails. Hence P0.
//
// The r09 verdict this encodes
// ----------------------------
// Verdict (4): "As duas regras de sistema quebraram de novo, numa
// superfície nova… É o mesmo erro da r07: corrigir por superfície e
// não por sistema." S2's shape gate is now enforced on the whole
// Alexandria scope, not on the surface that happened to break.
//
// Three clauses
// -------------
//   · boxShadow / box-shadow   → anything that is not `none` / `0`.
//   · borderRadius             → anything outside { 0, '0', '0px',
//                                AR.none, '50%', AR.circulo }.
//                                `AR = { none: '0', circulo: '50%' }`
//                                in src/design/alexandria-tokens.ts.
//                                9999 / 'rounded-full' is a pill, not a
//                                círculo pleno — it fires.
//   · linear/radial/conic-gradient in UI.
//
// Two exemptions on the gradient clause, both principled rather than
// convenient — a gradient that does not RAMP A COLOR is not the
// antipattern S2 is about:
//
//   (a) Mask ramps. `maskImage` / `WebkitMaskImage` / a const whose
//       name says máscara. The alpha of the ramp is the mask; no colour
//       is painted. src/components/alexandria/trilhas/VinhetaModulo.tsx
//       and .../TerritoriosHub.tsx rely on this.
//   (b) Flat layers and hatches: a gradient whose colour stops resolve
//       to one single colour, e.g.
//         `linear-gradient(${A.navy} 0 0)`                    — a solid layer
//         `repeating-linear-gradient(45deg, ${fio} 0 1px, transparent 1px 6px)`
//                                                             — a hatch
//       Both are hard-edged uses of the gradient() syntax, not a ramp.
//
// Supersedes, inside the Alexandria scope, the narrower platform rules
// `no-box-shadow-on-cards` (P1, cards only) and `no-gradient-text` (P0,
// background-clip only) — those two now exempt Alexandria paths so a
// line is reported exactly once, at the severity the Alexandria bar
// assigns.

import type { Rule, Finding, SourceFile } from '../types.js';
import { isLineSuppressed } from '../walker.js';
import {
  isAlexandriaFile,
  indexToLineCol,
  snippetAt,
  scanSource,
} from './_alexandria.js';

const RULE_ID = 'alexandria-materialidade';

const REF =
  'bar.md §S2 (raio 0 exceto círculo pleno; zero sombra, gradiente, vidro ou brilho) · §6 hard gate "Materialidade quebrada"';

// ── shadow ──────────────────────────────────────────────────────────

const SHADOW_RX = /\b(?:boxShadow|box-shadow|textShadow|text-shadow|filter|dropShadow|drop-shadow)\b\s*:\s*((?:\$\{[^}]*\}|[^;,\n}])*)/g;
const SHADOW_PROP_IS_SHADOW = /^(?:boxShadow|box-shadow|textShadow|text-shadow)$/;

function shadowValueIsInert(value: string): boolean {
  const v = value.trim().replace(/^['"`]|['"`]$/g, '').trim();
  if (v === '' || v === 'none' || v === '0' || v === 'undefined') return true;
  if (/^(?:A[A-Z]?\w*\.)?(?:none|nenhuma|semSombra)$/.test(v)) return true;
  return false;
}

// ── radius ──────────────────────────────────────────────────────────

const RADIUS_RX = /\b(?:borderRadius|border-radius|borderTopLeftRadius|borderTopRightRadius|borderBottomLeftRadius|borderBottomRightRadius|border-top-left-radius|border-top-right-radius|border-bottom-left-radius|border-bottom-right-radius)\b\s*:\s*((?:\$\{[^}]*\}|[^;,\n}])*)/g;

/** `AR.none` → '0' and `AR.circulo` → '50%' (alexandria-tokens.ts). */
const RADIUS_ALLOWED_RX =
  /^(?:0|0px|0rem|0%|'0'|"0"|'0px'|"0px"|AR\.none|AR\.circulo|'50%'|"50%"|`50%`|50%|inherit|initial|unset)$/;

const TAILWIND_ROUNDED_RX = /\brounded(?:-(?:sm|md|lg|xl|2xl|3xl|full|t|b|l|r|tl|tr|bl|br)\b|\b)/;

// ── gradient ────────────────────────────────────────────────────────

const GRADIENT_RX = /\b(?:repeating-)?(?:linear|radial|conic)-gradient\s*\(/g;

const MASK_CONTEXT_RX =
  /(?:maskImage|WebkitMaskImage|webkitMaskImage|mask-image|-webkit-mask-image|\bmask\b|\bMASCARA\b|\bMASK\b|m[aá]scara)/i;

/** Slice the balanced argument list of a `gradient(` that starts at `open`. */
function gradientArgs(src: string, open: number): string {
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    const c = src[i]!;
    if (c === '(') depth++;
    else if (c === ')') {
      depth--;
      if (depth === 0) return src.slice(open + 1, i);
    }
  }
  return src.slice(open + 1);
}

const COLOR_STOP_RX =
  /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)|\$\{[^}]*\}|\bcurrentColor\b|\btransparent\b|\b[A-Z][A-Za-z0-9]*\.[A-Za-z0-9_]+\b/g;

/**
 * True when the gradient does not ramp a colour: zero or one distinct
 * non-transparent colour stop (a flat layer or a hard-edged hatch), or
 * a single hue varying only in alpha (an alpha ramp, i.e. a mask).
 */
function isNotAColourRamp(args: string): boolean {
  COLOR_STOP_RX.lastIndex = 0;
  const stops = args.match(COLOR_STOP_RX) ?? [];
  const solid = stops.filter((s) => s !== 'transparent');
  const distinct = new Set(solid);
  if (distinct.size <= 1) return true;

  // All stops are the same rgb() triple at different alphas → mask ramp.
  const triples = new Set<string>();
  let allRgba = solid.length > 0;
  for (const s of solid) {
    const m = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/.exec(s);
    if (!m) { allRgba = false; break; }
    triples.add(`${m[1]},${m[2]},${m[3]}`);
  }
  if (allRgba && triples.size === 1) return true;

  return false;
}

// ── rule ────────────────────────────────────────────────────────────

const rule: Rule = {
  id: RULE_ID,
  severity: 'P0',
  description:
    'S2: sombra, raio fora de {0, 50%} ou gradiente de cor na UI da Alexandria. Profundidade só por fio de 1px ou troca de superfície.',
  reference: REF,

  appliesTo(file: SourceFile): boolean {
    if (file.ext !== 'tsx' && file.ext !== 'ts' && file.ext !== 'css') return false;
    return isAlexandriaFile(file.relPath);
  },

  check(file: SourceFile): Finding[] {
    const findings: Finding[] = [];
    const { code, mask } = scanSource(file.contents);

    const push = (idx: number, message: string): void => {
      const { line, column } = indexToLineCol(file.contents, idx);
      if (isLineSuppressed(file.contents, line, RULE_ID)) return;
      findings.push({
        rule: RULE_ID,
        severity: 'P0',
        message,
        file: file.relPath,
        line,
        column,
        snippet: snippetAt(file, line),
        reference: REF,
      });
    };

    // ── sombra ────────────────────────────────────────────────────
    SHADOW_RX.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = SHADOW_RX.exec(code)) !== null) {
      if (mask[m.index] === '/') continue;
      const prop = m[0].slice(0, m[0].indexOf(':')).trim();
      const value = m[1] ?? '';
      if (SHADOW_PROP_IS_SHADOW.test(prop)) {
        if (shadowValueIsInert(value)) continue;
        push(m.index, `${prop} — S2 proíbe sombra na Alexandria. Profundidade só por fio de 1px ou troca de superfície.`);
        continue;
      }
      // `filter` only counts when it carries a drop-shadow / blur glow.
      if (/drop-shadow\s*\(|\bblur\s*\(/.test(value)) {
        push(m.index, `${prop}: ${value.trim()} — S2 proíbe sombra, vidro e brilho.`);
      }
    }

    // ── raio ──────────────────────────────────────────────────────
    RADIUS_RX.lastIndex = 0;
    while ((m = RADIUS_RX.exec(code)) !== null) {
      if (mask[m.index] === '/') continue;
      const prop = m[0].slice(0, m[0].indexOf(':')).trim();
      const value = (m[1] ?? '').trim().replace(/\s+/g, '');
      if (value === '') continue;
      if (RADIUS_ALLOWED_RX.test(value)) continue;
      push(
        m.index,
        `${prop}: ${value} — S2 permite raio 0 (AR.none) e só o círculo pleno (AR.circulo / 50%). 9999 é pílula, não círculo.`,
      );
    }

    // Tailwind's rounded-* on the Alexandria layer is the same defect
    // wearing a utility class.
    if (file.ext === 'tsx') {
      const lines = file.contents.split(/\r?\n/);
      lines.forEach((text, i) => {
        if (!TAILWIND_ROUNDED_RX.test(text)) return;
        if (/^\s*(?:\/\/|\*|\/\*)/.test(text)) return;
        const line = i + 1;
        if (isLineSuppressed(file.contents, line, RULE_ID)) return;
        findings.push({
          rule: RULE_ID,
          severity: 'P0',
          message: 'Utilitário Tailwind rounded-* — S2 permite raio 0 e círculo pleno apenas.',
          file: file.relPath,
          line,
          column: 1,
          snippet: text.trim().slice(0, 120),
          reference: REF,
        });
      });
    }

    // ── gradiente ─────────────────────────────────────────────────
    GRADIENT_RX.lastIndex = 0;
    while ((m = GRADIENT_RX.exec(code)) !== null) {
      if (mask[m.index] === '/') continue;
      const open = code.indexOf('(', m.index);
      if (open < 0) continue;
      const args = gradientArgs(code, open);
      if (isNotAColourRamp(args)) continue;
      // Mask ramps paint nothing: look at the property / const that
      // owns this gradient, within the statement it sits in.
      const lineStart = code.lastIndexOf('\n', m.index) + 1;
      const ctxStart = Math.max(0, Math.min(lineStart, m.index - 160));
      if (MASK_CONTEXT_RX.test(code.slice(ctxStart, m.index))) continue;
      push(m.index, `${m[0].replace(/\s*\($/, '')} com rampa de cor — S2 proíbe gradiente na UI da Alexandria.`);
    }

    findings.sort((a, b) => a.line - b.line || a.column - b.column);
    return findings;
  },
};

export default rule;
