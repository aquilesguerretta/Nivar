// ALEXANDRIA r09 — `alexandria-no-native-range`.
//
// The r09 verdict this encodes
// ----------------------------
// Verdict (4): "A prancha do Laboratório é um formulário genérico
// colado no documento gravado: SEIS SLIDERS DE TRILHO TERRACOTA CHAPADO
// COM BOTÃO CIRCULAR e cinco campos numéricos retangulares… É o mesmo
// erro da r07: corrigir por superfície e não por sistema."
//
// Why this is its own rule, and why it is P0
// ------------------------------------------
// `<input type="range">` with nothing but `accentColor` set is not a
// styling shortfall — it is a hole in the design system. The browser
// paints the thumb, and what it paints is a filled circle with a native
// bevel: S2's "zero sombra, gradiente, vidro ou brilho" is decided by
// the user agent, not by us. Every OS renders a different object, so
// the Alexandria's materiality is simply absent on that control.
//
// It is also the exact recurrence the round called out: it was fixed on
// one surface in r07 and came back on a new one in r09. That is what
// the gate is for. The check is trivially mechanical and has no
// judgement in it, so it blocks.
//
// The way to pass is to DECLARE the house treatment on the element —
// an attribute or class that names the trilho so a reviewer can find
// it and so a second slider cannot be written without one:
//
//   <input type="range" data-tratamento="trilho-alexandria" … />
//   <input type="range" className="alx-trilho" … />
//
// Declaring the treatment is not the same as having it. The auditor
// cannot see a rendered thumb; the critics do. This gate only
// guarantees that nobody ships a slider by accident.
//
// Escape hatch
//   // gridalpha-detect-disable-next-line alexandria-no-native-range

import type { Rule, Finding, SourceFile } from '../types.js';
import { isLineSuppressed } from '../walker.js';
import {
  isAlexandriaFile,
  indexToLineCol,
  snippetAt,
  scanSource,
  jsxTags,
} from './_alexandria.js';

const RULE_ID = 'alexandria-no-native-range';

const REF =
  'r09 verdict (4) "sliders de trilho chapado com botão circular" · bar.md §S2 (zero sombra/gradiente/brilho) · §6 hard gate "Materialidade quebrada"';

const TYPE_RANGE_RX = /\btype\s*=\s*(?:['"`]range['"`]|\{\s*['"`]range['"`]\s*\})/;

/** An explicit, greppable declaration that the house treatment applies. */
const HOUSE_TREATMENT_RX = [
  /\bdata-tratamento\s*=/,
  /\bdata-trilho\s*=/,
  /\bdata-controle\s*=/,
  /\bclassName\s*=\s*(?:['"`][^'"`]*\b(?:alx-|trilho|alexandria)[^'"`]*['"`]|\{[^}]*\b(?:alx-|trilho|alexandria)[^}]*\})/,
];

const rule: Rule = {
  id: RULE_ID,
  severity: 'P0',
  description:
    '<input type="range"> sem tratamento da casa declarado: o agente de usuário pinta o trilho e o botão, e a materialidade S2 deixa de ser nossa.',
  reference: REF,

  appliesTo(file: SourceFile): boolean {
    if (file.ext !== 'tsx') return false;
    return isAlexandriaFile(file.relPath);
  },

  check(file: SourceFile): Finding[] {
    const findings: Finding[] = [];
    const { code, mask } = scanSource(file.contents);

    for (const tag of jsxTags(code, mask)) {
      if (tag.name !== 'input') continue;
      if (!TYPE_RANGE_RX.test(tag.body)) continue;
      if (HOUSE_TREATMENT_RX.some((rx) => rx.test(tag.body))) continue;

      const { line, column } = indexToLineCol(file.contents, tag.index);
      if (isLineSuppressed(file.contents, line, RULE_ID)) continue;
      findings.push({
        rule: RULE_ID,
        severity: 'P0',
        message:
          'Slider nativo sem tratamento da casa. `accentColor` não substitui o trilho e o botão: declare data-tratamento / data-trilho / className da casa e estilize ::-webkit-slider-thumb e ::-moz-range-thumb.',
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
