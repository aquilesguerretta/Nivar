// Biblioteca comum dos extratores do M03. Todo texto de conteúdo sai do
// arquivo-fonte por busca ancorada (regex sobre linha) — nada é digitado.
// A fonte é SOMENTE LEITURA.
import fs from 'node:fs';

export const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo03.html';
export const ROOT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure';
export const OUTDIR = `${ROOT}/docs/alexandria-v2/extraction/m03`;
export const CODE = {
  content: `${ROOT}/src/lib/data/alexandria-modulo-03-content.ts`,
  curriculo: `${ROOT}/src/lib/data/alexandria-curriculo.ts`,
  trilhas: `${ROOT}/src/lib/data/alexandria-trilhas.ts`,
  glossario: `${ROOT}/src/lib/data/alexandria-glossario.ts`,
  calculators: `${ROOT}/src/lib/data/alexandria-instrument-calculators.ts`,
  badges: `${ROOT}/src/lib/data/alexandria-badges.ts`,
  blocks: `${ROOT}/src/lib/data/alexandria-blocks.ts`,
  catalogo: 'C:/dev/GridAlpha v2/docs/catalogo-modulos-alexandria.md',
};

export const RAW = fs.readFileSync(SRC, 'utf8');
export const L = RAW.split('\n');
export const TOTAL_LINHAS = L.length;
export const ln = (n) => L[n - 1];
export const fail = (m) => { throw new Error(m); };

export const decode = (s) => s
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
export const stripTags = (h) => decode(h.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
export const collapse = (h) => h.replace(/\s+/g, ' ').trim();
export const txt = (html) => ({ html: collapse(html), texto: stripTags(html) });
export const trecho = (n) => ln(n).trim().slice(0, 90);
export const origem = (n, seletor) => ({ seletor, trecho_inicial: trecho(n), linha_aprox: n });
export const pad = (i) => String(i).padStart(2, '0');

/** Grupo 1 de `re` na linha n (falha alto se não casar). */
export function at(n, re, g = 1) {
  const m = ln(n).match(re);
  if (!m) fail(`linha ${n} não casa ${re}: ${ln(n)}`);
  return m[g];
}
/** Primeira linha >= from (e <= to) que casa re. */
export function find(re, from = 1, to = L.length) {
  for (let n = from; n <= to; n++) if (re.test(ln(n))) return n;
  return null;
}
export function findAll(re, from = 1, to = L.length) {
  const out = [];
  for (let n = from; n <= to; n++) if (re.test(ln(n))) out.push(n);
  return out;
}
export const inner = (n, tag) => at(n, new RegExp(`<${tag}(?:\\s[^>]*)?>(.*)</${tag}>`));

/** Seções `.aula` com marcador. start = linha do aula-marker, end = `</section>` seguinte. */
export const SECOES = (() => {
  const out = [];
  L.forEach((line, i) => {
    const m = line.match(/<div class="aula-marker"><span class="num">(.*?)<\/span><span class="dot"><\/span><span>(.*?)<\/span><\/div>/);
    if (!m) return;
    const n = i + 1;
    const end = find(/<\/section>/, n);
    out.push({ num: m[1], rotulo: m[2], start: n, end, h2: n + 1 });
  });
  return out;
})();
export const secao = (num) => SECOES.find((s) => s.num === num) ?? fail(`seção ${num} ausente`);

/** Bloco multi-linha a partir de uma linha que abre `<div class="X">` até o fechamento balanceado. */
export function blockEnd(startLine) {
  let depth = 0;
  for (let n = startLine; n <= L.length; n++) {
    const opens = (ln(n).match(/<div[\s>]/g) || []).length;
    const closes = (ln(n).match(/<\/div>/g) || []).length;
    depth += opens - closes;
    if (depth <= 0 && n >= startLine) return n;
  }
  fail(`bloco sem fechamento a partir de ${startLine}`);
}
export const slice = (a, b) => L.slice(a - 1, b).join('\n');

export const writeJson = (name, obj) => {
  fs.writeFileSync(`${OUTDIR}/${name}`, JSON.stringify(obj, null, 2) + '\n', 'utf8');
};
export const readCode = (k) => fs.readFileSync(CODE[k], 'utf8');

/** Marcação P14 inferida (ANOTAÇÃO desta extração, não texto da fonte). */
export function marcacaoP14(t) {
  const tags = [];
  if (/\b\d+\s*(segundos|minutos)\b|cinco minutos|5 minutos|sem travar/i.test(t)) tags.push('cronometrado_ou_fluencia');
  const v = t.trim().split(/\s+/)[0].replace(/[^A-Za-zÀ-ú]/g, '');
  const oral = ['Explicar', 'Defender', 'Narrar', 'Contar', 'Citar', 'Recitar', 'Reproduzir', 'Montar', 'Situar', 'Separar', 'Definir', 'Distinguir', 'Usar',
    // imperativos (enunciados de exercício)
    'Explique', 'Defenda', 'Corrija', 'Conte', 'Cite', 'Monte', 'Separe', 'Defina', 'Distinga', 'Narre', 'Justifique', 'Descreva', 'Responda'];
  if (oral.includes(v) || /em voz alta|recitar|narrar|em (duas|três|quatro|cinco) frases/i.test(t)) tags.push('producao_oral_ou_livre');
  if (/^Desenhar|desenhar/.test(t)) tags.push('desenho');
  if (/^Calcul(ar|e)|calcul(ar|e)/i.test(t)) tags.push('calculo');
  if (/^Escrever|escrever/i.test(t)) tags.push('escrita');
  return [...new Set(tags)];
}

export const hoje = '2026-09-17';
