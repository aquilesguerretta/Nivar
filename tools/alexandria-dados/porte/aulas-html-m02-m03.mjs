// Leitura das AULAS do HTML original do M02 e do M03, bloco a bloco.
//
// Por que existe: a extração verificada de M02/M03 (docs/alexandria-v2/extraction/mNN/)
// cobre identidade, mapa, aparato, instrumentos, três níveis e glossário, mas NÃO
// grava o corpo das aulas bloco a bloco (o M01 tem `aula-0N.json`; M02/M03 não).
// O protocolo de porte (docs/alexandria-v3/PORTE-POR-MODULO.md, "Regra de fonte")
// manda conferir contra a extração "e o HTML original" — este arquivo é essa leitura,
// determinística, só leitura, sem nenhuma reescrita do texto.
//
// O que devolve, por aula: marcador, título (h2), lead e a sequência de blocos de
// topo do `.container`, cada um com a linha do HTML:
//   titulo · paragrafo · formula · tabela · nota (callout) · tres_niveis · lista ·
//   cadeia (div.chain) · instrumento (só id, o corpo é do instrumento) · DESCONHECIDO
// Elemento de topo não previsto vira DESCONHECIDO — nunca é engolido em silêncio.

import fs from 'node:fs';

export const FONTE = (n) => `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo${String(n).padStart(2, '0')}.html`;

const colapsa = (s) => String(s).replace(/\s+/g, ' ').trim();

/** Filhos de topo de um trecho de HTML, com índice absoluto. */
function filhos(html, ini, fim) {
  const out = [];
  let i = ini;
  while (i < fim) {
    const lt = html.indexOf('<', i);
    if (lt < 0 || lt >= fim) break;
    if (html.startsWith('<!--', lt)) { i = html.indexOf('-->', lt) + 3; continue; }
    const m = /^<([a-zA-Z0-9]+)([^>]*)>/.exec(html.slice(lt, lt + 600));
    if (!m) { i = lt + 1; continue; }
    const tag = m[1].toLowerCase();
    const attrs = m[2];
    const abre = lt + m[0].length;
    // fechamento balanceado do mesmo nome
    const re = new RegExp(`<${tag}\\b|</${tag}>`, 'gi');
    re.lastIndex = abre;
    let prof = 1, mm, fecha = -1;
    while ((mm = re.exec(html))) {
      prof += mm[0].startsWith('</') ? -1 : 1;
      if (prof === 0) { fecha = mm.index; break; }
    }
    if (fecha < 0) throw new Error(`<${tag}> sem fechamento perto de ${html.slice(lt, lt + 80)}`);
    const classe = (/class="([^"]*)"/.exec(attrs) || [])[1] ?? '';
    out.push({ tag, classe, attrs, inner: html.slice(abre, fecha), iniInner: abre, fimInner: fecha, ini: lt, fim: fecha + tag.length + 3 });
    i = fecha + tag.length + 3;
  }
  return out;
}

export function lerAulas(n) {
  const html = fs.readFileSync(FONTE(n), 'utf8');
  const linha = (idx) => html.slice(0, idx).split('\n').length;
  const aulas = [];
  const re = /<div class="aula-marker"><span class="num">Aula (\d+)<\/span><span class="dot"><\/span><span>(.*?)<\/span><\/div>/g;
  let m;
  while ((m = re.exec(html))) {
    const num = Number(m[1]);
    const ini = html.lastIndexOf('<section class="aula">', m.index);
    const fim = html.indexOf('</section>', m.index);
    const cont = html.indexOf('<div class="container">', ini);
    const contFim = html.lastIndexOf('</div>', fim);
    const blocos = [];
    let titulo = null, lead = null;
    for (const f of filhos(html, cont + '<div class="container">'.length, contFim)) {
      const L = linha(f.ini);
      const c = f.classe.split(/\s+/);
      if (f.tag === 'div' && c.includes('aula-marker')) continue;
      if (f.tag === 'h2') { titulo = colapsa(f.inner); continue; }
      if (f.tag === 'p' && c.includes('lead')) { lead = colapsa(f.inner); continue; }
      if (f.tag === 'h3') {
        const nm = /<span class="num">(.*?)<\/span>([\s\S]*)/.exec(f.inner);
        blocos.push({ tipo: 'titulo', numero: nm ? nm[1] : null, texto: colapsa(nm ? nm[2] : f.inner), linha: L });
        continue;
      }
      if (f.tag === 'p') { blocos.push({ tipo: 'paragrafo', html: colapsa(f.inner), linha: L }); continue; }
      if (f.tag === 'ul' || f.tag === 'ol') {
        const itens = filhos(html, f.iniInner, f.fimInner)
          .filter((x) => x.tag === 'li').map((x) => colapsa(x.inner));
        blocos.push({ tipo: 'lista', ordenada: f.tag === 'ol', itens, linha: L });
        continue;
      }
      if (f.tag === 'div' && c.includes('formula')) {
        const eq = /<div class="eq">([\s\S]*?)<\/div>/.exec(f.inner);
        const desc = /<div class="desc">([\s\S]*?)<\/div>/.exec(f.inner);
        blocos.push({ tipo: 'formula', eq: colapsa(eq ? eq[1] : f.inner), desc: desc ? colapsa(desc[1]) : null, linha: L });
        continue;
      }
      if ((f.tag === 'div' && c.includes('table-wrap')) || f.tag === 'table') {
        const cab = [...f.inner.matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/g)].map((x) => colapsa(x[1]));
        const linhas = [...f.inner.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)]
          .map((tr) => [...tr[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)].map((x) => colapsa(x[1])))
          .filter((l) => l.length);
        blocos.push({ tipo: 'tabela', cabecalho: cab, linhas, linha: L });
        continue;
      }
      if (f.tag === 'div' && c.includes('callout')) {
        const rot = /<div class="callout-label">([\s\S]*?)<\/div>/.exec(f.inner);
        const corpo = f.inner.replace(/<div class="callout-label">[\s\S]*?<\/div>/, '');
        const ps = [...corpo.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map((x) => colapsa(x[1]));
        const tom = c.includes('gold') ? 'gold' : c.includes('red') ? 'red' : 'neutro';
        blocos.push({ tipo: 'nota', tom, rotulo: rot ? colapsa(rot[1]) : null, paragrafos: ps.length ? ps : [colapsa(corpo)], linha: L });
        continue;
      }
      if (f.tag === 'div' && c.includes('three-levels')) {
        const abas = [...f.inner.matchAll(/<button class="three-levels-tab[^"]*">([\s\S]*?)<\/button>/g)].map((x) => colapsa(x[1]));
        const paineis = [...f.inner.matchAll(/<div class="three-levels-panel[^"]*">([\s\S]*?)<\/div>/g)].map((x) => colapsa(x[1]));
        blocos.push({ tipo: 'tres_niveis', abas, paineis, linha: L });
        continue;
      }
      if (f.tag === 'div' && c.includes('chain')) {
        const passos = [...f.inner.matchAll(/<div class="cs-volt">([\s\S]*?)<\/div><div class="cs-name">([\s\S]*?)<\/div>/g)]
          .map((x) => ({ volt: colapsa(x[1]), nome: colapsa(x[2]) }));
        blocos.push({ tipo: 'cadeia', passos, linha: L });
        continue;
      }
      if (f.tag === 'div' && c.includes('vs-grid')) {
        const celulas = [...f.inner.matchAll(/<h5>([\s\S]*?)<\/h5>\s*<p>([\s\S]*?)<\/p>/g)].map((x) => ({ h5: colapsa(x[1]), p: colapsa(x[2]) }));
        blocos.push({ tipo: 'comparacao', celulas, linha: L });
        continue;
      }
      if (f.tag === 'div' && c.includes('instrument')) {
        const id = /<div class="instrument-id">([\s\S]*?)<\/div>/.exec(f.inner);
        blocos.push({ tipo: 'instrumento', id: id ? colapsa(id[1]) : null, linha: L });
        continue;
      }
      blocos.push({ tipo: 'DESCONHECIDO', tag: f.tag, classe: f.classe, html: colapsa(f.inner).slice(0, 200), linha: L });
    }
    aulas.push({ num, marcador: m[2], titulo, lead, blocos, linha: linha(m.index) });
  }
  return aulas;
}

// Uso direto: node aulas-html-m02-m03.mjs 2  → censo por aula
if (process.argv[1] && process.argv[1].endsWith('aulas-html-m02-m03.mjs')) {
  const n = Number(process.argv[2] ?? 2);
  for (const a of lerAulas(n)) {
    const cont = {};
    for (const b of a.blocos) cont[b.tipo] = (cont[b.tipo] || 0) + 1;
    console.log(`Aula ${String(a.num).padStart(2, '0')} L${a.linha} ${a.marcador} — ${JSON.stringify(cont)}`);
    for (const b of a.blocos.filter((x) => x.tipo === 'DESCONHECIDO')) console.log(`   ? <${b.tag} class="${b.classe}"> L${b.linha}: ${b.html.slice(0, 100)}`);
  }
}
