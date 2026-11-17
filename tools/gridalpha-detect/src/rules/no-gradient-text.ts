// CHROMA Wave 5 — `no-gradient-text`.
//
// terminal-antipatterns.md ("Gradient text for emphasis"):
//   "background-clip: text with a gradient fill to make a headline
//    'pop'. Loses tabular-nums alignment for numeric values, fails
//    contrast checks, signals 'marketing landing page'. Emphasis in
//    GridAlpha is carried by size, weight, and color tier — not by
//    gradient fill."
//
// Detection: an element style that combines:
//   (a) `background-clip: text` OR `backgroundClip: 'text'`
//       OR `-webkit-background-clip: text` (the legacy syntax that
//       Safari needed)
//       OR Tailwind `bg-clip-text`
//   AND
//   (b) any gradient fill — `linear-gradient(`, `radial-gradient(`,
//       or Tailwind `bg-gradient-to-*` utility.
//
// We don't require the gradient to be on the same element as the
// clip — they only need to live in the same style declaration block
// (inline style object or CSS rule).

import type { Rule, Finding, SourceFile } from '../types.js';
import { isLineSuppressed } from '../walker.js';
import { isAlexandriaFile } from './_alexandria.js';

const RULE_ID = 'no-gradient-text';

const ALLOWED_DIRS = [
  '/components/editorial/',
  '/components/landing/',
  '/components/figma-reference/',
  '/design/figma-reference/',
  '/components/ui/',
  '/pages/auth/',
];

const ALLOWED_FILE_SUFFIXES = [
  'src/components/LandingPage.tsx',
];

function isAllowedPath(relPath: string): boolean {
  const norm = relPath.replace(/\\/g, '/');
  // The Alexandria v2 scope is governed by `alexandria-materialidade`,
  // whose S2 clause is strictly wider than this rule (every element,
  // not only cards / clip-text) and blocks at P0. Deferring here keeps
  // one line from being reported twice at two severities.
  if (isAlexandriaFile(norm)) return true;
  if (ALLOWED_FILE_SUFFIXES.some((suf) => norm.endsWith(suf))) return true;
  return ALLOWED_DIRS.some((dir) => norm.includes(dir));
}

// CSS-side: a rule block that contains both `background-clip: text`
// and a gradient.
// TSX inline: a style object that contains both `backgroundClip: 'text'`
// or `WebkitBackgroundClip: 'text'` and a gradient on `background` or
// `backgroundImage`.

const BG_CLIP_TEXT_RX = /(?:-webkit-)?background-clip\s*:\s*text\b|backgroundClip\s*:\s*['"]text['"]|WebkitBackgroundClip\s*:\s*['"]text['"]/g;
const GRADIENT_RX = /linear-gradient\s*\(|radial-gradient\s*\(|conic-gradient\s*\(/g;

// Tailwind: bg-clip-text + bg-gradient-to-*
const TAILWIND_CLIP_TEXT_RX = /\bbg-clip-text\b/;
const TAILWIND_GRADIENT_RX = /\bbg-gradient-to-(?:r|l|t|b|tr|tl|br|bl)\b/;

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
  severity: 'P0',
  description: 'background-clip:text + gradient fill (gradient text). Emphasis lives in size/weight/color tier, not gradient.',
  reference: 'Gradient text for emphasis',

  appliesTo(file: SourceFile): boolean {
    if (file.ext !== 'tsx' && file.ext !== 'ts' && file.ext !== 'css') return false;
    if (isAllowedPath(file.relPath)) return false;
    return true;
  },

  check(file: SourceFile): Finding[] {
    const findings: Finding[] = [];
    const lines = file.contents.split(/\r?\n/);

    // ── CSS / inline style path ─────────────────────────────────────
    BG_CLIP_TEXT_RX.lastIndex = 0;
    let clipMatch: RegExpExecArray | null;
    while ((clipMatch = BG_CLIP_TEXT_RX.exec(file.contents)) !== null) {
      // Look within a 400-char window before AND after the clip match
      // for a gradient — covers inline style objects up to a few
      // hundred chars and CSS rule blocks.
      const start = Math.max(0, clipMatch.index - 400);
      const end = Math.min(file.contents.length, clipMatch.index + 400);
      const window = file.contents.slice(start, end);
      GRADIENT_RX.lastIndex = 0;
      if (!GRADIENT_RX.test(window)) continue;
      const { line, column } = indexToLineCol(file.contents, clipMatch.index);
      if (isLineSuppressed(file.contents, line, RULE_ID)) continue;
      const snippet = (lines[line - 1] ?? '').trim().slice(0, 120);
      findings.push({
        rule: RULE_ID,
        severity: 'P0',
        message: 'Gradient text (background-clip:text + gradient fill). Use color tier instead.',
        file: file.relPath,
        line,
        column,
        snippet,
        reference: rule.reference,
      });
    }

    // ── Tailwind className path ─────────────────────────────────────
    if (TAILWIND_CLIP_TEXT_RX.test(file.contents) && TAILWIND_GRADIENT_RX.test(file.contents)) {
      // Find the className that contains both markers — we report on
      // the line containing bg-clip-text since that's the operative
      // utility.
      const lineNum = lines.findIndex((l) => TAILWIND_CLIP_TEXT_RX.test(l));
      if (lineNum >= 0) {
        const line = lineNum + 1;
        if (!isLineSuppressed(file.contents, line, RULE_ID)) {
          const snippet = (lines[lineNum] ?? '').trim().slice(0, 120);
          findings.push({
            rule: RULE_ID,
            severity: 'P0',
            message: 'Gradient text (Tailwind bg-clip-text + bg-gradient-to-*). Use color tier instead.',
            file: file.relPath,
            line,
            column: 1,
            snippet,
            reference: rule.reference,
          });
        }
      }
    }

    return findings;
  },
};

export default rule;
