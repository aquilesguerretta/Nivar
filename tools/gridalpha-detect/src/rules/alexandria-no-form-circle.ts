// ALEXANDRIA r09 — `alexandria-no-form-circle`.
//
// The r09 verdict this encodes
// ----------------------------
// Verdict (4): "A prancha do Laboratório é um formulário genérico
// colado no documento gravado: seis sliders de trilho terracota chapado
// com botão circular e cinco campos numéricos retangulares. É 'caixa
// default' + 'círculo de formulário' renascendo. É o mesmo erro da r07:
// corrigir por superfície e não por sistema."
//
// This is the "círculo de formulário" half. S2 allows a círculo pleno,
// so a bare `borderRadius: '50%'` is legal — a hit target, a position
// marker on the map, a dot. What is NOT legal is the generic-product
// tell: a FILLED circle carrying ONE OR TWO CHARACTERS. That is the
// avatar-with-initial / step-number-bubble / form-thumb shape, and it
// is the single most re-skinnable object in consumer SaaS.
//
// bar.md §6 hard gate "LMS / SaaS genérico" and §0 ("Se a tela puder
// ser re-skinned e vendida como LMS genérico, falhou") are what this
// protects — but the auditor can only see the shape, never the
// composition around it. A filled initial-circle CAN be the right
// answer somewhere. So: P1, and the directive is the way out.
//
// Detection
// ---------
//   borderRadius: '50%' | 9999 | '9999px' | '100%' | AR.circulo
//   AND background / backgroundColor that is filled (not transparent,
//       not none, not inherit)
//   AND the element's own text content is 1–2 characters, or an
//       expression that reads as an initial: `[0]`, `.charAt(0)`,
//       `.slice(0, 1)`, `inicial`, `initial`.
//
// A circle with no children, with an icon child, or with a real label
// never fires.
//
// Escape hatch
//   // gridalpha-detect-disable-next-line alexandria-no-form-circle

import type { Rule, Finding, SourceFile } from '../types.js';
import { isLineSuppressed } from '../walker.js';
import {
  isAlexandriaFile,
  indexToLineCol,
  snippetAt,
  scanSource,
  jsxTags,
} from './_alexandria.js';

const RULE_ID = 'alexandria-no-form-circle';

const REF =
  'r09 verdict (4) "círculo de formulário" · bar.md §6 hard gate "LMS / SaaS genérico" · §S2 (raio 0 exceto círculo pleno)';

const CIRCLE_RX =
  /\bborder(?:Radius|-radius)\b\s*:\s*(?:'50%'|"50%"|`50%`|AR\.circulo|'100%'|"100%"|9999(?:px)?|'9999px'|"9999px"|'999px'|"999px")/;
const TAILWIND_CIRCLE_RX = /\brounded-full\b/;

const FILLED_BG_RX =
  /\b(?:background|backgroundColor|background-color)\b\s*:\s*(?!['"`]?(?:transparent|none|inherit|initial|unset|undefined)\b)[^;,\n}]+/;

const INITIAL_EXPR_RX =
  /\[\s*0\s*\]|\.charAt\s*\(\s*0\s*\)|\.slice\s*\(\s*0\s*,\s*[12]\s*\)|\.substring\s*\(\s*0\s*,\s*[12]\s*\)|\binicia(?:l|is)\b|\binitials?\b/i;

/**
 * The element's own text content: everything from the end of the open
 * tag to the first nested `<`. Returns null for a self-closing tag.
 */
function ownTextContent(code: string, bodyEnd: number, selfClosing: boolean): string | null {
  if (selfClosing) return null;
  let j = bodyEnd;
  while (j < code.length && code[j] !== '<') j++;
  return code.slice(bodyEnd, j).trim();
}

function readsAsOneOrTwoChars(content: string): boolean {
  if (content === '') return false;
  // Plain literal text: "A", "M1", "3".
  if (!content.includes('{')) return content.length <= 2;
  // A single expression container.
  const m = /^\{([\s\S]*)\}$/.exec(content);
  if (!m) return false;
  const expr = m[1]!.trim();
  if (expr.length > 120) return false;
  return INITIAL_EXPR_RX.test(expr);
}

const rule: Rule = {
  id: RULE_ID,
  severity: 'P1',
  description:
    'Círculo preenchido com 1–2 caracteres (avatar com inicial / bolha de passo): o objeto mais re-skinnável do SaaS genérico.',
  reference: REF,

  appliesTo(file: SourceFile): boolean {
    if (file.ext !== 'tsx') return false;
    return isAlexandriaFile(file.relPath);
  },

  check(file: SourceFile): Finding[] {
    const findings: Finding[] = [];
    const { code, mask } = scanSource(file.contents);

    for (const tag of jsxTags(code, mask)) {
      const isCircle = CIRCLE_RX.test(tag.body) || TAILWIND_CIRCLE_RX.test(tag.body);
      if (!isCircle) continue;
      if (!FILLED_BG_RX.test(tag.body)) continue;
      const content = ownTextContent(code, tag.bodyEnd, tag.selfClosing);
      if (content === null || !readsAsOneOrTwoChars(content)) continue;

      const { line, column } = indexToLineCol(file.contents, tag.index);
      if (isLineSuppressed(file.contents, line, RULE_ID)) continue;
      findings.push({
        rule: RULE_ID,
        severity: 'P1',
        message:
          `<${tag.name}> é um círculo preenchido com conteúdo de 1–2 caracteres ("${content.slice(0, 24)}") — círculo de formulário / avatar com inicial. Use a marca da casa.`,
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
