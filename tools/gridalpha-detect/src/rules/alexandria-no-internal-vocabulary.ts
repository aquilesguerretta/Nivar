// ALEXANDRIA r09 — `alexandria-no-internal-vocabulary`.
//
// bar.md §S4 ("Fonte à vista, imagem honesta, ausência honesta"), Gate:
//   "Linguagem interna proibida ao learner. 'backend', 'extraído do
//    HTML', 'extração', 'aulas confirmadas', 'a fonte declara', 'wave',
//    'mock' e os códigos '§00', '§MAP', '§Final', '§Caso' e '§Quiz'."
//
// bar.md §6 ("Hard gates globais — FAIL automático"):
//   "Ausência desonesta | … linguagem interna (S4)"  → the piece fails.
//   Hence P0.
//
// bar.md §11, P24:
//   "'GridAlpha' morta para o learner: Alexandria para o produto,
//    NIVAR para a empresa."
//
// The r09 verdict this encodes
// ----------------------------
// Verdict (3): the module page printed the pipeline's own section codes
// — "§ 00", "§ MAP", "§ Caso", "§ Lab", "§ Drill", "§ Quiz", "§ Final",
// "§ Lex", "§ Ref" — plus the word "EXTRAÇÃO" and the dead brand
// "GRIDALPHA". Those are labels from OUR work route, not from the
// learner's expedition.
//
// What is and is not "visible"
// ----------------------------
// The task's own warning: a code comment, an import specifier and a
// data key are not learner-visible. So this rule reports only:
//
//   · JSX text nodes                       <p>§ 00 · destaque</p>
//   · label attributes                     aria-label="§ Lab"
//   · string literals owned by a content   marcador: '§ 00'
//     key (see CONTENT_KEY_RX)             eyebrow: 'Alexandria · GridAlpha · Módulo 04'
//   · a literal used directly as a JSX     {'extração'}
//     child
//
// Comments, regex literals, import paths, identifiers, `id`/`slug`/
// `href`/`kind` values and every other key outside CONTENT_KEY_RX are
// invisible to this rule by construction.
//
// Escape hatch
// ------------
// P24 keeps "GridAlpha" legal in historical provenance and in a
// technical comment. A comment needs nothing. A provenance literal uses
// the auditor's standard directive:
//
//   // gridalpha-detect-disable-next-line alexandria-no-internal-vocabulary
//   fonte: 'GridAlpha_Curriculo_Definitivo.docx (nome de arquivo de origem)',

import type { Rule, Finding, SourceFile } from '../types.js';
import { isLineSuppressed } from '../walker.js';
import {
  isAlexandriaFile,
  indexToLineCol,
  snippetAt,
  scanSource,
  visibleRegions,
} from './_alexandria.js';

const RULE_ID = 'alexandria-no-internal-vocabulary';

interface Banned {
  rx: RegExp;
  why: string;
}

// The pipeline's section sigils. Listed by name in S4; the rest of the
// family ("§ Lab", "§ Drill", "§ Lex", "§ Ref") came from verdict (3)
// and is the same class of string.
const SECTION_CODE_RX =
  /§\s?(?:00|MAP|Final|Caso|Quiz|Lab|Drill|Lex|Ref)\b/gi;

const BANNED: Banned[] = [
  { rx: SECTION_CODE_RX,
    why: 'código de seção do pipeline (S4). É rótulo da nossa rota de trabalho, não da expedição do learner.' },
  { rx: /\bextra[çc][ãa]o\b/gi,
    why: '"extração" (S4) — vocabulário do nosso pipeline de conteúdo.' },
  { rx: /\bextra[íi]d[oa]s?\s+do\s+HTML\b/gi,
    why: '"extraído do HTML" (S4) — a origem técnica não é assunto do learner.' },
  { rx: /\baulas\s+confirmadas\b/gi,
    why: '"aulas confirmadas" (S4) — estado do nosso processo, não do curso.' },
  { rx: /\ba\s+fonte\s+declara\b/gi,
    why: '"a fonte declara" (S4) — voz do extrator. Diga o fato, ou nomeie a instituição.' },
  { rx: /\bbackend\b/gi,
    why: '"backend" (S4) — arquitetura interna vazando para a superfície.' },
  { rx: /\bwave\b/gi,
    why: '"wave" (S4) — unidade do nosso cronograma, invisível para o learner.' },
  { rx: /\bmock(?:s|ado|ada|ados|adas)?\b/gi,
    why: '"mock" (S4, e §6 "Dado falso ou mock como real").' },
  { rx: /\bgrid\s?alpha\b/gi,
    why: 'marca morta (P24). Alexandria para o produto, NIVAR para a empresa.' },
];

const rule: Rule = {
  id: RULE_ID,
  severity: 'P0',
  description:
    'Vocabulário interno (códigos § de seção, "extração", "backend", "wave", "mock", "a fonte declara") ou a marca morta "GridAlpha" em texto visível ao learner.',
  reference: 'bar.md §S4 (linguagem interna proibida ao learner) · §6 hard gate "Ausência desonesta" · §11 P24',

  appliesTo(file: SourceFile): boolean {
    if (file.ext !== 'tsx' && file.ext !== 'ts') return false;
    return isAlexandriaFile(file.relPath);
  },

  check(file: SourceFile): Finding[] {
    const findings: Finding[] = [];
    const scan = scanSource(file.contents);
    const seen = new Set<number>();

    for (const region of visibleRegions(file, scan)) {
      for (const banned of BANNED) {
        banned.rx.lastIndex = 0;
        let m: RegExpExecArray | null;
        while ((m = banned.rx.exec(region.text)) !== null) {
          const absIdx = region.index + m.index;
          if (seen.has(absIdx)) continue;
          seen.add(absIdx);
          const { line, column } = indexToLineCol(file.contents, absIdx);
          if (isLineSuppressed(file.contents, line, RULE_ID)) continue;
          findings.push({
            rule: RULE_ID,
            severity: 'P0',
            message: `"${m[0]}" em texto visível (${region.via}) — ${banned.why}`,
            file: file.relPath,
            line,
            column,
            snippet: snippetAt(file, line),
            reference: rule.reference,
          });
        }
      }
    }

    findings.sort((a, b) => a.line - b.line || a.column - b.column);
    return findings;
  },
};

export default rule;
