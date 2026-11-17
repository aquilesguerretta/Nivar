// Shared plumbing for the Alexandria rule family (`alexandria-*`).
//
// Why this file exists
// --------------------
// Four of the twelve verdicts of the r09 critic round were regressions:
// a rule that had already been declared and fixed in an earlier round
// came back on a NEW surface. Agent memory does not hold a rule; an
// auditor does. The `alexandria-*` rules turn those verdicts into a
// mechanical gate.
//
// Three of them need the same two primitives, so they live here rather
// than being copy-pasted three times:
//
//   1. SCOPE. The Alexandria rules must NOT fail the whole tree — the
//      GridAlpha terminal is a different product with a different bar.
//      `isAlexandriaFile()` is the single definition of "this file is
//      part of Alexandria v2".
//
//   2. VISIBILITY. S4 forbids internal vocabulary *to the learner*.
//      A code comment, an import specifier and an identifier are not
//      learner-visible; JSX text, label attributes and string literals
//      used as content are. `scanSource()` tokenises the file once so
//      every rule classifies a hit the same way, instead of each rule
//      inventing its own (and its own false positives).
//
// Everything here is offset-preserving: `code` and `mask` are the same
// length as the original source, so `indexToLineCol` keeps reporting
// real line numbers.

import type { SourceFile } from '../types.js';

// ── scope ───────────────────────────────────────────────────────────

/**
 * A file belongs to Alexandria v2 when it sits in an `alexandria/`
 * directory, or when its basename is `alexandria-*` / `alexandriaFoo`
 * / `alexandria-tokens.ts`.
 *
 * The lowercase `a` is load-bearing: `src/components/vault/Alexandria.tsx`
 * is the OLD GridAlpha terminal vault surface, governed by the terminal
 * antipatterns, not by the Alexandria bar. It must stay out of scope.
 */
const ALEXANDRIA_DIR_RX  = /(?:^|\/)alexandria\//;
const ALEXANDRIA_FILE_RX = /(?:^|\/)alexandria(?:-[\w.-]+|[A-Z][\w.]*)?\.(?:tsx?|css)$/;

export function isAlexandriaFile(relPath: string): boolean {
  const norm = relPath.replace(/\\/g, '/');
  if (ALEXANDRIA_DIR_RX.test(norm)) return true;
  return ALEXANDRIA_FILE_RX.test(norm);
}

// ── position ────────────────────────────────────────────────────────

export function indexToLineCol(s: string, idx: number): { line: number; column: number } {
  let line = 1;
  let col = 1;
  const stop = Math.min(idx, s.length);
  for (let i = 0; i < stop; i++) {
    if (s[i] === '\n') { line += 1; col = 1; } else { col += 1; }
  }
  return { line, column: col };
}

export function snippetAt(file: SourceFile, line: number): string {
  const lines = file.contents.split(/\r?\n/);
  return (lines[line - 1] ?? '').trim().slice(0, 120);
}

// ── source scan ─────────────────────────────────────────────────────

export type MaskKind =
  | 'c'  // code
  | 's'  // inside a string / template literal body
  | 'x'  // inside a `${ }` substitution (code again, but nested)
  | 'r'  // regex literal body
  | '/'; // comment body

export interface Literal {
  /** Index of the opening quote. */
  start: number;
  /** Index just past the closing quote. */
  end: number;
  quote: "'" | '"' | '`';
  /** Raw inner text, `${…}` substitutions included verbatim. */
  value: string;
}

export interface ScanResult {
  /** Same-length copy of the source with comment bodies blanked to spaces. */
  code: string;
  /** Same-length classification mask. */
  mask: string;
  literals: Literal[];
}

const REGEX_PRECEDER = new Set([
  '(', ',', '=', ':', '[', '!', '&', '|', '?', '{', '}', ';', '+', '-',
  '*', '%', '~', '^', '<', '>', '\n',
]);

/**
 * One pass over the file that separates code, strings, template
 * substitutions, regex literals and comments.
 *
 * Deliberately not a real parser: the auditor's contract is "a regex
 * walk that is honest about what it can and cannot see". What this DOES
 * guarantee is that a hit inside a `//` or `/* *\/` comment is never
 * reported as learner-visible — which is the false positive the rules
 * below would otherwise drown in.
 */
export function scanSource(src: string): ScanResult {
  const n = src.length;
  const code = src.split('');
  const mask = new Array<string>(n).fill('c');
  const literals: Literal[] = [];

  // Stack of template-literal depths, so `${ }` inside a template can
  // itself contain a nested template.
  const tmplStack: number[] = [];
  let braceDepth = 0;
  let prevSig = '\n';
  let i = 0;

  function blank(from: number, to: number, kind: string): void {
    for (let k = from; k < to && k < n; k++) {
      mask[k] = kind;
      if (kind === '/') code[k] = src[k] === '\n' ? '\n' : ' ';
    }
  }

  while (i < n) {
    const ch = src[i]!;
    const next = src[i + 1];

    // ── comments ────────────────────────────────────────────────────
    if (ch === '/' && next === '/') {
      let j = i;
      while (j < n && src[j] !== '\n') j++;
      blank(i, j, '/');
      i = j;
      continue;
    }
    if (ch === '/' && next === '*') {
      let j = i + 2;
      while (j < n && !(src[j] === '*' && src[j + 1] === '/')) j++;
      j = Math.min(n, j + 2);
      blank(i, j, '/');
      i = j;
      continue;
    }

    // ── regex literal ───────────────────────────────────────────────
    if (ch === '/' && REGEX_PRECEDER.has(prevSig)) {
      let j = i + 1;
      let inClass = false;
      let closed = false;
      while (j < n) {
        const c = src[j]!;
        if (c === '\\') { j += 2; continue; }
        if (c === '\n') break;
        if (c === '[') inClass = true;
        else if (c === ']') inClass = false;
        else if (c === '/' && !inClass) { closed = true; break; }
        j++;
      }
      if (closed) {
        blank(i + 1, j, 'r');
        i = j + 1;
        prevSig = '/';
        continue;
      }
      // Not a regex after all — fall through as a division sign.
    }

    // ── string literals ─────────────────────────────────────────────
    if (ch === "'" || ch === '"') {
      const quote = ch as "'" | '"';
      let j = i + 1;
      while (j < n) {
        const c = src[j]!;
        if (c === '\\') { j += 2; continue; }
        if (c === quote) break;
        if (c === '\n') break; // unterminated — bail rather than eat the file
        j++;
      }
      const end = Math.min(n, j + 1);
      blank(i + 1, j, 's');
      literals.push({ start: i, end, quote, value: src.slice(i + 1, j) });
      i = end;
      prevSig = quote;
      continue;
    }

    if (ch === '`') {
      // Template literal: mark the body as string, but let `${ … }`
      // substitutions fall back to code so nested literals are scanned.
      const start = i;
      let j = i + 1;
      const pieces: string[] = [];
      while (j < n) {
        const c = src[j]!;
        if (c === '\\') { j += 2; continue; }
        if (c === '`') break;
        if (c === '$' && src[j + 1] === '{') {
          // Skip to the matching close brace, leaving it masked as code.
          let depth = 1;
          let k = j + 2;
          while (k < n && depth > 0) {
            const d = src[k]!;
            if (d === '{') depth++;
            else if (d === '}') depth--;
            else if (d === '`' || d === "'" || d === '"') {
              // Nested literal inside the substitution — skip it whole.
              const q = d;
              k++;
              while (k < n) {
                if (src[k] === '\\') { k += 2; continue; }
                if (src[k] === q) break;
                k++;
              }
            }
            k++;
          }
          blank(j + 2, k - 1, 'x');
          pieces.push(src.slice(j, k));
          j = k;
          continue;
        }
        mask[j] = 's';
        pieces.push(c);
        j++;
      }
      const end = Math.min(n, j + 1);
      literals.push({ start, end, quote: '`', value: src.slice(start + 1, j) });
      i = end;
      prevSig = '`';
      continue;
    }

    if (ch === '{') braceDepth++;
    if (ch === '}') braceDepth = Math.max(0, braceDepth - 1);
    if (!/\s/.test(ch)) prevSig = ch;
    else if (ch === '\n') prevSig = '\n';
    i++;
  }

  void tmplStack;
  void braceDepth;
  return { code: code.join(''), mask: mask.join(''), literals };
}

// ── "is this literal used as learner-visible content?" ──────────────

/**
 * Attribute names whose value is read out or painted as a label.
 * Named in the task: aria-label, title, alt — plus the rest of the
 * accessible-name family, because a screen reader is a learner too.
 */
export const LABEL_ATTR_RX =
  /^(?:aria-label|aria-roledescription|aria-description|aria-valuetext|aria-placeholder|title|alt|placeholder|label|summary|caption)$/i;

/**
 * Object keys whose string value is rendered. This list is the rule's
 * honest boundary: a key NOT on it is treated as plumbing, so a data
 * key like `id`, `slug`, `href`, `arquivo` or `kind` never fires.
 *
 * Accents are matched in both forms because the codebase mixes them.
 */
export const CONTENT_KEY_RX = new RegExp(
  '^(?:' +
  [
    'titulo', 'título', 'titulos', 'títulos', 'subtitulo', 'subtítulo',
    'rotulo', 'rótulo', 'rotulos', 'rótulos', 'label', 'labels',
    'texto', 'textos', 'text', 'html', 'corpo', 'conteudo', 'conteúdo',
    'legenda', 'legendas', 'caption', 'descricao', 'descrição',
    'resumo', 'sumario', 'sumário', 'nota', 'notas', 'mensagem',
    'mensagens', 'aviso', 'avisos', 'marcador', 'marcadores',
    'secao', 'seção', 'eyebrow', 'chamada', 'cta', 'prompt',
    'pergunta', 'perguntas', 'resposta', 'respostas', 'enunciado',
    'comando', 'frase', 'termo', 'definicao', 'definição',
    'atribuicao', 'atribuição', 'objetivo', 'objetivos',
    'capacidade', 'capacidades', 'criterio', 'critério', 'criterios',
    'critérios', 'dica', 'dicas', 'motivo', 'palavra', 'unidade',
    'fonte', 'fontes', 'alt', 'placeholder', 'heading', 'copy',
    'item', 'itens', 'linha', 'linhas', 'passo', 'passos',
    'tese', 'lead', 'intro', 'pergaminho', 'citacao', 'citação',
  ].join('|') +
  ')$',
  'i',
);

const IMPORT_CONTEXT_RX = /(?:\bfrom|\bimport|\brequire\s*\(|\bawait\s+import\s*\()\s*$/;

/**
 * Walk backwards from a literal to the key that owns it, skipping over
 * array brackets, commas and sibling literals. This is what lets
 *
 *     objetivos: [
 *       'Ler o § 00 do módulo',      ← reported
 *     ]
 *
 * fire while
 *
 *     import { x } from './§thing'   ← not reported
 *     const SECAO_RX = /^§\s?/       ← not reported (regex, not a literal)
 *
 * stays quiet.
 */
export function ownerKeyOf(code: string, literalStart: number): string | null {
  let i = literalStart - 1;
  let guard = 0;
  while (i >= 0 && guard++ < 4000) {
    const c = code[i]!;
    if (/\s/.test(c) || c === ',' || c === '[' || c === '(') { i--; continue; }
    if (c === "'" || c === '"' || c === '`') {
      // A sibling literal in the same array — skip it and keep walking.
      const q = c;
      i--;
      while (i >= 0 && code[i] !== q) i--;
      i--;
      continue;
    }
    if (c === ':' || c === '=') {
      // Not `==`, `=>`, `>=` …
      if (c === '=' && (code[i - 1] === '=' || code[i - 1] === '!' ||
                        code[i - 1] === '<' || code[i - 1] === '>')) return null;
      let j = i - 1;
      while (j >= 0 && /\s/.test(code[j]!)) j--;
      let end = j + 1;
      if (code[j] === "'" || code[j] === '"') {
        const q = code[j]!;
        j--;
        const inner: string[] = [];
        while (j >= 0 && code[j] !== q) { inner.unshift(code[j]!); j--; }
        return inner.join('');
      }
      while (j >= 0 && /[\w$À-ɏ.-]/.test(code[j]!)) j--;
      const name = code.slice(j + 1, end);
      const last = name.split('.').pop() ?? name;
      return last || null;
    }
    return null;
  }
  return null;
}

export interface VisibleHit {
  /** Absolute index in the ORIGINAL source. */
  index: number;
  /** The text that was matched. */
  text: string;
  /** Why we consider it visible. */
  via: 'jsx-text' | 'label-attr' | 'content-literal' | 'jsx-child-literal';
}

/**
 * Every learner-visible text region in the file, as (index, text) pairs.
 * The caller runs its own pattern over `text` and maps the offset back
 * through `index`.
 */
export function visibleRegions(file: SourceFile, scan: ScanResult): VisibleHit[] {
  const out: VisibleHit[] = [];
  const { code, mask, literals } = scan;

  // ── string literals used as content ───────────────────────────────
  for (const lit of literals) {
    const before = code.slice(Math.max(0, lit.start - 40), lit.start);
    if (IMPORT_CONTEXT_RX.test(before)) continue;

    const key = ownerKeyOf(code, lit.start);
    if (key && (CONTENT_KEY_RX.test(key) || LABEL_ATTR_RX.test(key))) {
      out.push({ index: lit.start + 1, text: lit.value, via: LABEL_ATTR_RX.test(key) ? 'label-attr' : 'content-literal' });
      continue;
    }
    // `{'texto literal'}` as a JSX child: `{` immediately before, `}`
    // immediately after, and a `>` earlier on the same expression.
    const prev = before.replace(/\s+$/, '').slice(-1);
    const after = code.slice(lit.end, lit.end + 2).replace(/^\s+/, '').slice(0, 1);
    if (prev === '{' && after === '}' && file.ext === 'tsx') {
      out.push({ index: lit.start + 1, text: lit.value, via: 'jsx-child-literal' });
    }
  }

  // ── JSX text nodes ────────────────────────────────────────────────
  if (file.ext === 'tsx') {
    for (let i = 0; i < code.length; i++) {
      if (code[i] !== '>' || mask[i] !== 'c') continue;
      // Only a `>` that closes a tag — the char before must not be an
      // operator position such as `=>` or `>=`.
      if (code[i - 1] === '=' || code[i + 1] === '=') continue;
      let j = i + 1;
      const startRun = j;
      while (j < code.length && !(code[j] === '<' && mask[j] === 'c')) {
        if (code[j] === '{' || code[j] === '}') break;
        j++;
      }
      if (j <= startRun) continue;
      const run = code.slice(startRun, j);
      if (!/[A-Za-zÀ-ÿ§]/.test(run)) continue;
      // Everything in the run must be plain code-masked text.
      let clean = true;
      for (let k = startRun; k < j; k++) if (mask[k] !== 'c') { clean = false; break; }
      if (!clean) continue;
      out.push({ index: startRun, text: run, via: 'jsx-text' });
      i = j - 1;
    }
  }

  return out;
}

// ── JSX tag iteration (shared by the shape rules) ───────────────────

export interface JsxTag {
  /** Index of the `<`. */
  index: number;
  name: string;
  /** Everything between the tag name and the closing `>`. */
  body: string;
  /** Index just past the `>`. */
  bodyEnd: number;
  selfClosing: boolean;
}

/**
 * Brace-aware JSX open-tag scanner. The naive `/<Tag([^>]*)>/` used by
 * the older rules mis-slices any tag whose props contain a `>` inside
 * an arrow function or a comparison, which is most tags in this
 * codebase.
 */
export function jsxTags(code: string, mask: string): JsxTag[] {
  const out: JsxTag[] = [];
  for (let i = 0; i < code.length; i++) {
    if (code[i] !== '<' || mask[i] !== 'c') continue;
    const m = /^<([A-Za-z][\w.:-]*)/.exec(code.slice(i, i + 64));
    if (!m) continue;
    let j = i + m[0].length;
    let depth = 0;
    let closed = -1;
    let selfClosing = false;
    while (j < code.length) {
      const c = code[j]!;
      const mk = mask[j]!;
      if (mk === 's' || mk === 'r') { j++; continue; }
      if (c === '{') depth++;
      else if (c === '}') depth = Math.max(0, depth - 1);
      else if (c === '>' && depth === 0) {
        closed = j;
        selfClosing = code[j - 1] === '/';
        break;
      }
      else if (c === '<' && depth === 0) break; // malformed — give up
      j++;
    }
    if (closed < 0) continue;
    out.push({
      index: i,
      name: m[1]!,
      body: code.slice(i + m[0].length, closed),
      bodyEnd: closed + 1,
      selfClosing,
    });
    i = closed;
  }
  return out;
}

/** The literal that a style prop reads as, with `${…}` left in place. */
export function rawSlice(src: string, from: number, to: number): string {
  return src.slice(from, to);
}
