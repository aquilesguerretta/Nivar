// Leitura das AULAS do HTML original do M14 e do M15 (só leitura).
//
// Por que existe: a extração verificada de M14/M15 (docs/alexandria-v2/extraction/mNN/)
// grava identidade, mapa, aparato e instrumentos, mas NÃO grava o corpo das aulas
// bloco a bloco (o M01 tem `aula-0N.json`; estes não). O protocolo de porte
// (docs/alexandria-v3/PORTE-POR-MODULO.md, "Regra de fonte") manda conferir contra a
// extração "e o HTML original" — esta é essa leitura, determinística, sem reescrever
// texto.
//
// Devolve, por aula (section#aNN > div.wrap): secId (texto do `div.sec-id`), h2, lede
// e a lista de filhos de topo, cada um com classe, linha e HTML interno. Os
// instrumentos (`div.inst`) vêm marcados — o corpo deles é conferido à parte.

import fs from 'node:fs';

export const FONTE = (n) => `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo${String(n).padStart(2, '0')}.html`;

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const RAW = new Set(['script', 'style']);

/** Árvore de elementos com offsets (o0/o1 abertura, c0/c1 fechamento). */
export function arvore(html) {
  const raiz = { tag: '#raiz', attrs: '', filhos: [], o0: 0, o1: 0, c0: html.length, c1: html.length };
  const pilha = [raiz];
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g;
  let m;
  while ((m = re.exec(html))) {
    if (m[0].startsWith('<!--')) continue;
    const tag = m[2].toLowerCase();
    const topo = pilha[pilha.length - 1];
    if (!m[1]) {
      const no = { tag, attrs: m[3], filhos: [], pai: topo, o0: m.index, o1: m.index + m[0].length };
      topo.filhos.push(no);
      if (VOID.has(tag) || m[3].trim().endsWith('/')) { no.c0 = no.o1; no.c1 = no.o1; continue; }
      if (RAW.has(tag)) {
        const fim = html.indexOf(`</${tag}>`, no.o1);
        no.c0 = fim; no.c1 = fim + tag.length + 3; re.lastIndex = no.c1; continue;
      }
      pilha.push(no);
    } else {
      let k = pilha.length - 1;
      while (k > 0 && pilha[k].tag !== tag) k--;
      if (k === 0) continue;
      for (let j = pilha.length - 1; j >= k; j--) { pilha[j].c0 = m.index; pilha[j].c1 = m.index + m[0].length; }
      pilha.length = k;
    }
  }
  return raiz;
}

export const classes = (no) => ((/class="([^"]*)"/.exec(no.attrs) || [])[1] ?? '').split(/\s+/).filter(Boolean);
export const temClasse = (no, c) => classes(no).includes(c);
export const idDe = (no) => (/\bid="([^"]*)"/.exec(no.attrs) || [])[1] ?? null;

export function lerModulo(n) {
  const html = fs.readFileSync(FONTE(n), 'utf8');
  const inicios = [0];
  for (let i = 0; i < html.length; i++) if (html[i] === '\n') inicios.push(i + 1);
  const linha = (pos) => {
    let lo = 0, hi = inicios.length - 1;
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (inicios[mid] <= pos) lo = mid; else hi = mid - 1; }
    return lo + 1;
  };
  const raiz = arvore(html);
  const inner = (no) => html.slice(no.o1, no.c0);
  const todos = [];
  const andar = (no) => { for (const f of no.filhos) { todos.push(f); andar(f); } };
  andar(raiz);

  const aulas = [];
  for (const s of todos.filter((x) => x.tag === 'section' && /^a\d\d$/.test(idDe(x) ?? ''))) {
    const wrap = s.filhos.find((f) => f.tag === 'div' && temClasse(f, 'wrap'));
    const filhos = [];
    let secId = null, h2 = null, lede = null;
    for (const f of wrap.filhos) {
      if (f.tag === 'div' && temClasse(f, 'sec-id')) { secId = inner(f); continue; }
      if (f.tag === 'h2') { h2 = inner(f); continue; }
      if (f.tag === 'p' && temClasse(f, 'lede')) { lede = inner(f); continue; }
      filhos.push({ no: f, tag: f.tag, classes: classes(f), linha: linha(f.o0), html: inner(f), instrumento: f.tag === 'div' && temClasse(f, 'inst') });
    }
    aulas.push({ secao: idDe(s), numero: Number(idDe(s).slice(1)), linha: linha(s.o0), secId, h2, lede, filhos });
  }
  return { html, raiz, todos, inner, linha, aulas };
}
