// CHROMA Wave 5 — `no-box-shadow-on-cards`.
//
// terminal-color.md / terminal-composition.md:
//   "Elevation in the terminal is communicated by the four-tier
//    surface palette and by the 1px top-edge accent. Drop shadows on
//    every card flatten the elevation hierarchy and add visual noise
//    on a data-dense surface."
//   "Shadows only appear on raised floating UI (CommandPalette,
//    SavedViewsMenu, AnnotationDrawer) at alpha ≤ 0.25."
//
// Detection:
//   - Find JSX elements that are cards: tagged with
//     data-component="Card" / data-elevation="card", OR className
//     containing "Card" (CompactCard, DominantCard, etc.).
//   - Within the same tag, look for a boxShadow / box-shadow
//     declaration that's NOT one of the documented escape hatches.
//   - The data-elevation-override attribute lets a card explicitly
//     opt out (rare; used for expanded overlays inside a card).
//   - Emit P1.
//
// Detecting <ContainedCard> by component name is intentional — that's
// FOUNDRY's primitive and is the canonical data card. CHROMA can't
// detect every card variant statically, but ContainedCard catches
// the dominant case.

import type { Rule, Finding, SourceFile } from '../types.js';
import { isLineSuppressed } from '../walker.js';
import { isAlexandriaFile } from './_alexandria.js';

const RULE_ID = 'no-box-shadow-on-cards';

const ALLOWED_DIRS = [
  '/components/editorial/',
  '/components/landing/',
  '/components/figma-reference/',
  '/design/figma-reference/',
  '/components/ui/',
  '/pages/auth/',
];

function isAllowedPath(relPath: string): boolean {
  const norm = relPath.replace(/\\/g, '/');
  // The Alexandria v2 scope is governed by `alexandria-materialidade`,
  // whose S2 clause is strictly wider than this rule (every element,
  // not only cards / clip-text) and blocks at P0. Deferring here keeps
  // one line from being reported twice at two severities.
  if (isAlexandriaFile(norm)) return true;
  return ALLOWED_DIRS.some((dir) => norm.includes(dir));
}

const JSX_OPEN_TAG_RX = /<([A-Za-z][\w.]*)\s+([^>]*?)\/?>/gs;

const CARD_TAG_RX = /^(?:ContainedCard|MetricTile|CompactCard|DominantCard|BaseCard)$/;
const CARD_MARKER_RX = [
  /data-component\s*=\s*"Card"/,
  /data-component\s*=\s*\{['"]Card['"]\}/,
  /data-elevation\s*=\s*"card"/,
  /data-elevation\s*=\s*\{['"]card['"]\}/,
  /className\s*=\s*"[^"]*\bCard\b[^"]*"/,
];

function isCardElement(tagName: string, tagBody: string): boolean {
  if (CARD_TAG_RX.test(tagName)) return true;
  return CARD_MARKER_RX.some((rx) => rx.test(tagBody));
}

const SHADOW_RX = /(?:boxShadow|box-shadow)\s*:\s*['"]?([^'";,}]*)['"]?/g;
const ELEVATION_OVERRIDE_RX = /data-elevation-override\b/;

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
  severity: 'P1',
  description: 'box-shadow on a data card. Elevation lives in the four-tier surface tokens; shadows are reserved for raised overlays.',
  reference: 'Drop shadows on data cards',

  appliesTo(file: SourceFile): boolean {
    if (file.ext !== 'tsx') return false;
    if (isAllowedPath(file.relPath)) return false;
    return true;
  },

  check(file: SourceFile): Finding[] {
    const findings: Finding[] = [];
    const lines = file.contents.split(/\r?\n/);
    JSX_OPEN_TAG_RX.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = JSX_OPEN_TAG_RX.exec(file.contents)) !== null) {
      const tagName = match[1] ?? '';
      const tagBody = match[2] ?? '';
      if (!isCardElement(tagName, tagBody)) continue;
      if (ELEVATION_OVERRIDE_RX.test(tagBody)) continue;
      SHADOW_RX.lastIndex = 0;
      const shadowMatch = SHADOW_RX.exec(tagBody);
      if (!shadowMatch) continue;
      const value = (shadowMatch[1] ?? '').trim();
      // Filter out 'none' and inset-only — only outer drop shadows
      // are the antipattern.
      if (value === 'none' || /^inset\b/.test(value)) continue;
      // Compute the position in the file for the shadow declaration.
      const shadowAbsIdx = match.index + (match[0].indexOf(shadowMatch[0]));
      const { line, column } = indexToLineCol(file.contents, shadowAbsIdx);
      if (isLineSuppressed(file.contents, line, RULE_ID)) continue;
      const snippet = (lines[line - 1] ?? '').trim().slice(0, 120);
      findings.push({
        rule: RULE_ID,
        severity: 'P1',
        message:
          `box-shadow on <${tagName}> — elevation belongs in the four-tier bg tokens. If this is a raised overlay, add data-elevation-override.`,
        file: file.relPath,
        line,
        column,
        snippet,
        reference: rule.reference,
      });
    }
    return findings;
  },
};

export default rule;
