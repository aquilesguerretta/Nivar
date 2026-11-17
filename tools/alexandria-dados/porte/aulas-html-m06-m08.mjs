// Leitura das AULAS do HTML original de M06, M07 e M08, bloco a bloco.
//
// Por que existe: a extração verificada destes módulos (docs/alexandria-v2/extraction/mNN/)
// grava identidade, mapa, aparato e instrumentos, mas deixa a prosa das aulas "só como
// ponteiro" (README do M06, §Escopo) — não há `aula-NN.json` como no M01. O protocolo
// (docs/alexandria-v3/PORTE-POR-MODULO.md, "Regra de fonte") manda então conferir contra o
// HTML original, só leitura. Este arquivo é essa leitura: determinística, sem reescrever
// nenhum texto. Vocabulário destes módulos (medido): `sec-id` · `lede` · `box rd|cy|gd` ·
// `lv` (três níveis) · `inst` · `scroll > table.tbl` · `fi` (ficha) · `src-card` ·
// `ol.num-list` · `ol.stp` · `ul.ck` · `div.form` · `div.chain` · `h4`.
//
// Todo filho de topo do `.wrap` de uma aula vira um bloco tipado com a linha do HTML.
// Elemento não previsto vira DESCONHECIDO — nunca é engolido em silêncio.

import fs from 'node:fs';

export const FONTE = (n) => `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo${String(n).padStart(2, '0')}.html`;

export const colapsa = (s) => String(s).replace(/\s+/g, ' ').trim();

/** Filhos de topo de um trecho de HTML, com índices absolutos. */
export function filhos(html, ini, fim) {
  const out = [];
  let i = ini;
  while (i < fim) {
    const lt = html.indexOf('<', i);
    if (lt < 0 || lt >= fim) break;
    if (html.startsWith('<!--', lt)) { i = html.indexOf('-->', lt) + 3; continue; }
    if (html.startsWith('</', lt)) { i = lt + 2; continue; }
    const m = /^<([a-zA-Z0-9]+)([^>]*)>/.exec(html.slice(lt, lt + 800));
    if (!m) { i = lt + 1; continue; }
    const tag = m[1].toLowerCase();
    const attrs = m[2];
    const abre = lt + m[0].length;
    const classe = (/class="([^"]*)"/.exec(attrs) || [])[1] ?? '';
    if (['br', 'img', 'input', 'hr', 'meta', 'link'].includes(tag) || attrs.endsWith('/')) {
      out.push({ tag, classe, attrs, inner: '', iniInner: abre, fimInner: abre, ini: lt, fim: abre });
      i = abre;
      continue;
    }
    const re = new RegExp(`<${tag}\\b|</${tag}>`, 'gi');
    re.lastIndex = abre;
    let prof = 1, mm, fecha = -1;
    while ((mm = re.exec(html))) {
      prof += mm[0].startsWith('</') ? -1 : 1;
      if (prof === 0) { fecha = mm.index; break; }
    }
    if (fecha < 0) throw new Error(`<${tag}> sem fechamento perto de ${html.slice(lt, lt + 80)}`);
    out.push({ tag, classe, attrs, inner: html.slice(abre, fecha), iniInner: abre, fimInner: fecha, ini: lt, fim: fecha + tag.length + 3 });
    i = fecha + tag.length + 3;
  }
  return out;
}

const filhosDe = (html, f) => filhos(html, f.iniInner, f.fimInner);
const temClasse = (f, c) => f.classe.split(/\s+/).includes(c);

function tabelaDe(html, f) {
  const cab = [...f.inner.matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/g)].map((x) => colapsa(x[1]));
  const linhas = [...f.inner.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)]
    .map((tr) => [...tr[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)].map((x) => colapsa(x[1])))
    .filter((l) => l.length);
  return { cabecalho: cab, linhas };
}

/** Lê as aulas do módulo n. Cada aula: num, rotulo (sec-id), titulo (h2), lead, blocos[]. */
export function lerAulas(n) {
  const html = fs.readFileSync(FONTE(n), 'utf8');
  const linha = (idx) => html.slice(0, idx).split('\n').length;
  const aulas = [];
  const re = /<section id="([^"]+)"[^>]*>/g;
  let m;
  while ((m = re.exec(html))) {
    const ini = m.index;
    const fim = html.indexOf('</section>', ini);
    const corpo = html.slice(ini, fim);
    const sid = /<div class="sec-id"><b>Aula (\d+)<\/b>\s*·\s*([\s\S]*?)<\/div>/.exec(corpo);
    if (!sid) continue;
    const wrapIni = html.indexOf('<div class="wrap">', ini);
    const [wrap] = filhos(html, wrapIni, fim);
    const blocos = [];
    let titulo = null, lead = null;
    for (const f of filhosDe(html, wrap)) {
      const L = linha(f.ini);
      const c = f.classe;
      if (f.tag === 'div' && temClasse(f, 'sec-id')) continue;
      if (f.tag === 'h2') { titulo = colapsa(f.inner); continue; }
      if (f.tag === 'p' && temClasse(f, 'lede')) { lead = colapsa(f.inner); continue; }
      if (f.tag === 'h3') {
        const nm = /<span class="num">(.*?)<\/span>([\s\S]*)/.exec(f.inner);
        blocos.push({ tipo: 'titulo', numero: nm ? colapsa(nm[1]) : null, texto: colapsa(nm ? nm[2] : f.inner), linha: L });
        continue;
      }
      if (f.tag === 'h4') { blocos.push({ tipo: 'titulo', numero: null, texto: colapsa(f.inner), linha: L }); continue; }
      if (f.tag === 'p') { blocos.push({ tipo: 'paragrafo', html: colapsa(f.inner), linha: L }); continue; }
      if (f.tag === 'ul' || f.tag === 'ol') {
        const itens = filhosDe(html, f).filter((x) => x.tag === 'li').map((x) => {
          // ol.stp: <span class="sh">Etapa<span class="sw">quem</span></span>texto
          const st = /^<span class="sh">([\s\S]*?)<span class="sw">([\s\S]*?)<\/span><\/span>([\s\S]*)$/.exec(colapsa(x.inner));
          if (st) return { html: colapsa(x.inner), etapa: colapsa(st[1]), quem: colapsa(st[2]), texto: colapsa(st[3]) };
          return { html: colapsa(x.inner) };
        });
        blocos.push({ tipo: 'lista', classe: c, ordenada: f.tag === 'ol', itens, linha: L });
        continue;
      }
      if (f.tag === 'div' && (temClasse(f, 'form') || temClasse(f, 'formula'))) {
        const eq = /<div class="(?:eq|f)">([\s\S]*?)<\/div>/.exec(f.inner);
        const desc = /<div class="(?:desc|d|lg)">([\s\S]*?)<\/div>/.exec(f.inner);
        blocos.push({ tipo: 'formula', eq: colapsa(eq ? eq[1] : f.inner), desc: desc ? colapsa(desc[1]) : null, bruto: colapsa(f.inner), linha: L });
        continue;
      }
      if (f.tag === 'table' || (f.tag === 'div' && temClasse(f, 'scroll'))) {
        blocos.push({ tipo: 'tabela', ...tabelaDe(html, f), linha: L });
        continue;
      }
      if (f.tag === 'div' && temClasse(f, 'box')) {
        const tag = /<span class="tag">([\s\S]*?)<\/span>/.exec(f.inner);
        const resto = filhosDe(html, f).filter((x) => !(x.tag === 'span' && temClasse(x, 'tag')));
        const partes = resto.map((x) => {
          if (x.tag === 'p') return { tipo: 'p', html: colapsa(x.inner) };
          if (x.tag === 'ul' || x.tag === 'ol') return { tipo: 'lista', itens: filhosDe(html, x).filter((y) => y.tag === 'li').map((y) => colapsa(y.inner)) };
          return { tipo: 'DESCONHECIDO', tag: x.tag, html: colapsa(x.inner) };
        });
        const tom = temClasse(f, 'gd') ? 'gold' : temClasse(f, 'rd') ? 'red' : 'cy';
        blocos.push({ tipo: 'nota', tom, rotulo: tag ? colapsa(tag[1]) : null, partes, linha: L });
        continue;
      }
      if (f.tag === 'div' && temClasse(f, 'lv')) {
        const hd = /<div class="lv-hd">([\s\S]*?)<\/div>/.exec(f.inner);
        const abas = [...f.inner.matchAll(/<button class="lv-tab[^"]*"[^>]*>([\s\S]*?)<\/button>/g)].map((x) => colapsa(x[1]));
        const bd = filhosDe(html, f).find((x) => temClasse(x, 'lv-bd'));
        const paineis = bd ? filhosDe(html, bd).filter((x) => temClasse(x, 'lv-pane')).map((x) => colapsa(x.inner)) : [];
        blocos.push({ tipo: 'tres_niveis', cabecalho: hd ? colapsa(hd[1]) : null, abas, paineis, linha: L });
        continue;
      }
      if (f.tag === 'div' && (temClasse(f, 'fi') || temClasse(f, 'src-card'))) {
        const sg = /<span class="(?:sg|nm)">([\s\S]*?)<\/span>/.exec(f.inner);
        const tp = /<span class="(?:tp|tg)">([\s\S]*?)<\/span>/.exec(f.inner);
        const linhas = [...f.inner.matchAll(/<div class="(?:fi|src)-k">([\s\S]*?)<\/div><div class="(?:fi|src)-v">([\s\S]*?)<\/div>/g)].map((x) => [colapsa(x[1]), colapsa(x[2])]);
        blocos.push({ tipo: 'ficha', classe: c, nome: sg ? colapsa(sg[1]) : null, tipoFicha: tp ? colapsa(tp[1]) : null, linhas, linha: L });
        continue;
      }
      if (f.tag === 'div' && temClasse(f, 'chain')) {
        const passos = filhosDe(html, f).map((x) => colapsa(x.inner.replace(/<[^>]+>/g, (t) => (/^<\/?(b|strong|em|i|sub|sup)\b/i.test(t) ? t : ' '))));
        blocos.push({ tipo: 'cadeia', passos: passos.filter(Boolean), bruto: colapsa(f.inner), linha: L });
        continue;
      }
      if (f.tag === 'div' && temClasse(f, 'inst')) {
        const nm = /<span class="nm">([\s\S]*?)<\/span>/.exec(f.inner);
        const id = /<span class="id">([\s\S]*?)<\/span>/.exec(f.inner);
        blocos.push({ tipo: 'instrumento', nome: nm ? colapsa(nm[1]) : null, id: id ? colapsa(id[1]) : null, linha: L });
        continue;
      }
      blocos.push({ tipo: 'DESCONHECIDO', tag: f.tag, classe: c, html: colapsa(f.inner).slice(0, 300), linha: L });
    }
    aulas.push({ num: Number(sid[1]), rotulo: colapsa(sid[2]), titulo, lead, blocos, linha: linha(ini) });
  }
  return aulas;
}

// Uso direto: node aulas-html-m06-m08.mjs 6  → censo por aula
if (process.argv[1] && process.argv[1].endsWith('aulas-html-m06-m08.mjs')) {
  const n = Number(process.argv[2] ?? 6);
  for (const a of lerAulas(n)) {
    const cont = {};
    for (const b of a.blocos) cont[b.tipo] = (cont[b.tipo] || 0) + 1;
    console.log(`Aula ${String(a.num).padStart(2, '0')} L${a.linha} ${a.rotulo} — ${a.titulo} — ${JSON.stringify(cont)}`);
    for (const b of a.blocos.filter((x) => x.tipo === 'DESCONHECIDO')) console.log(`   ? <${b.tag} class="${b.classe}"> L${b.linha}: ${b.html.slice(0, 100)}`);
    for (const b of a.blocos.filter((x) => x.tipo === 'nota')) for (const p of b.partes.filter((x) => x.tipo === 'DESCONHECIDO')) console.log(`   ? nota L${b.linha} <${p.tag}>`);
  }
}
