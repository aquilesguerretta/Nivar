// ALEXANDRIA r09 — `alexandria-no-default-control-box`.
//
// The r09 verdict this encodes
// ----------------------------
// Verdict (4), the "caixa default" half: a control drawn as a box with
// a line all the way round it. It is the shape every framework ships
// by default, it is what r07 was told to stop doing, and it came back
// on the Laboratório prancha in r09.
//
// Why P1 and not P0
// -----------------
// S2 makes the 1px fio the house's ONLY depth language: "Profundidade
// só por fio de 1px ou troca de superfície." So a `border: 1px solid`
// is not in itself a violation — it is the house vocabulary, and this
// codebase uses it correctly on figures, sections and tooltips
// (`border: 1px solid ${A.fioSobreCreme}` appears ~35 times, almost all
// on non-controls).
//
// What the critics flagged is narrower: a FOUR-SIDED line closing a box
// around a CONTROL, which is what makes the control read as a generic
// form widget rather than as part of a printed document. A static
// regex cannot tell "framed control that earns its frame" from
// "framework default", so it would be dishonest to block on it. It
// warns, and it warns on a surface small enough to review:
//
//   · the element is a control — <button>, <input>, <select>,
//     <textarea>, role="button", or any tag with onClick;
//   · the border is the four-sided shorthand `border:` (borderTop /
//     borderBottom / borderLeft / borderRight never fire — a single
//     rule under a control is the house's own move);
//   · there is no declared exception on the element.
//
// Declared exception — name the decision on the element itself, so the
// next reader sees a choice instead of a default:
//
//   <button data-moldura="ficha" …>            ← the frame is the point
//   <button data-tratamento="carimbo" …>
//   // gridalpha-detect-disable-next-line alexandria-no-default-control-box

import type { Rule, Finding, SourceFile } from '../types.js';
import { isLineSuppressed } from '../walker.js';
import {
  isAlexandriaFile,
  indexToLineCol,
  snippetAt,
  scanSource,
  jsxTags,
} from './_alexandria.js';

const RULE_ID = 'alexandria-no-default-control-box';

const REF =
  'r09 verdict (4) "caixa default" · bar.md §S2 (profundidade só por fio de 1px ou troca de superfície)';

const CONTROL_TAGS = new Set(['button', 'input', 'select', 'textarea']);

const ROLE_BUTTON_RX = /\brole\s*=\s*(?:['"`](?:button|switch|tab|checkbox|radio|slider)['"`]|\{\s*['"`](?:button|switch|tab|checkbox|radio|slider)['"`]\s*\})/;
const ONCLICK_RX = /\bon(?:Click|KeyDown|Change|Input|Pointer(?:Down|Up))\s*=/;

/** The four-sided shorthand only. `borderTop` / `border-bottom` etc. never match. */
const BORDER_SHORTHAND_RX = /\bborder\s*:\s*((?:\$\{[^}]*\}|[^;,\n}])*)/;
const TAILWIND_BORDER_RX = /\bborder(?:-\d+)?\b(?!-(?:t|b|l|r|x|y|collapse|separate|spacing))/;

function borderIsInert(value: string): boolean {
  const v = value.trim().replace(/^['"`]|['"`]$/g, '').trim();
  if (v === '' || v === 'none' || v === '0' || v === 'undefined' || v === 'inherit') return true;
  // `border: none` written through a ternary that can only produce none.
  if (/^['"`]?none['"`]?$/.test(v)) return true;
  return false;
}

const DECLARED_EXCEPTION_RX = [
  /\bdata-moldura\s*=/,
  /\bdata-tratamento\s*=/,
  /\bdata-caixa\s*=/,
  /\bdata-excecao\s*=/,
];

function isControl(tag: { name: string; body: string }): boolean {
  if (CONTROL_TAGS.has(tag.name)) return true;
  if (ROLE_BUTTON_RX.test(tag.body)) return true;
  if (ONCLICK_RX.test(tag.body)) return true;
  return false;
}

const rule: Rule = {
  id: RULE_ID,
  severity: 'P1',
  description:
    'Controle desenhado como caixa: fio nos quatro lados em <button>/<input>/role="button"/onClick, sem exceção declarada.',
  reference: REF,

  appliesTo(file: SourceFile): boolean {
    if (file.ext !== 'tsx') return false;
    return isAlexandriaFile(file.relPath);
  },

  check(file: SourceFile): Finding[] {
    const findings: Finding[] = [];
    const { code, mask } = scanSource(file.contents);

    for (const tag of jsxTags(code, mask)) {
      if (!isControl(tag)) continue;
      if (DECLARED_EXCEPTION_RX.some((rx) => rx.test(tag.body))) continue;

      const m = BORDER_SHORTHAND_RX.exec(tag.body);
      const tw = TAILWIND_BORDER_RX.test(tag.body) && /\bclassName\s*=/.test(tag.body);
      if (!m && !tw) continue;
      if (m && borderIsInert(m[1] ?? '')) continue;

      const full = m ? (m[1] ?? '').trim() : 'className border-*';
      const value = full.length > 56 ? `${full.slice(0, 56)}…` : full;
      const { line, column } = indexToLineCol(file.contents, tag.index);
      if (isLineSuppressed(file.contents, line, RULE_ID)) continue;
      findings.push({
        rule: RULE_ID,
        severity: 'P1',
        message:
          `<${tag.name}> é um controle fechado por fio nos quatro lados (border: ${value}). Caixa default. Se a moldura é a decisão, declare-a (data-moldura / data-tratamento).`,
        file: file.relPath,
        line,
        column,
        snippet: snippetAt(file, line),
        reference: REF,
      });
    }

    return findings;
  },
};

export default rule;
