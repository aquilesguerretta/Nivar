// Biblioteca da conferência de texto do porte dos Módulos 12 e 13.
//
// Por que contra o HTML original: as extrações do M12 e do M13 não têm o corpo
// das aulas (não há `aula-NN.json`; o README de cada uma diz que o corpo ficou
// fora do escopo). A régua, então, é o próprio `<section id="aNN">` do HTML da
// fonte, lido só para leitura.
//
// Método (o mesmo para os dois módulos):
//   1. recorta a seção da aula; tira os instrumentos (`div.inst`, conferidos à
//      parte contra `instrumentos.json`), o `div.sec-id` e o `h2` (conferidos
//      contra `title`/`subtitle` da aula), comentários, script e style;
//   2. corta o resto em SEGMENTOS nas fronteiras de bloco (p, div, li, td, th,
//      h3…, span.tag) e tira as tags inline — cada segmento é um pedaço de texto
//      que o aluno lê na fonte;
//   3. monta o fluxo do produto da aula (title, subtitle, lead, cada campo de
//      cada bloco de MODULO_NN_CORPO, na ordem);
//   4. cada segmento precisa aparecer no fluxo, em ordem, comparado sem espaço
//      (compacto) depois das trocas editoriais declaradas. Falta = segmento que
//      não aparece; fora de ordem é falta também (a marca diz).
//   5. ÓRFÃO: tag inline aberta sem fechar (ou o contrário) em qualquer string
//      do produto.
//
// Trocas editoriais e faltas explicadas são declaradas por quem chama, com a
// razão; a saída lista cada uso. Nada é explicado em silêncio.

import fs from 'node:fs';

const ENTIDADES = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", ndash: '–', mdash: '—', hellip: '…', times: '×', middot: '·', divide: '÷', deg: '°', sup2: '²', sup3: '³', micro: 'µ', ohm: 'Ω', rarr: '→', larr: '←', laquo: '«', raquo: '»', ge: '≥', le: '≤', plusmn: '±', asymp: '≈', ne: '≠', minus: '−', ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', thinsp: ' ', ensp: ' ', emsp: ' ' };
export const decodificar = (s) =>
  String(s).replace(/&(#x[0-9a-f]+|#\d+|[a-z0-9]+);/gi, (m, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return ENTIDADES[e.toLowerCase()] ?? m;
  });
export const semTags = (s) => String(s).replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '');
export const colapsar = (s) => String(s).replace(/[\s  ]+/g, ' ').trim();
export const norm = (s) => colapsar(decodificar(semTags(s ?? '')));
export const compacto = (s) => norm(s).replace(/\s+/g, '');

/** Remove elementos balanceados cuja tag de abertura casa `abre` (regex sobre a
 *  tag de abertura, ex. /<div class="inst"[^>]*>/). Devolve [html sem eles, removidos]. */
export function removerBalanceado(html, abre, tag = 'div', marca = '\u0000') {
  const removidos = [];
  let out = html;
  for (;;) {
    const m = abre.exec(out);
    abre.lastIndex = 0;
    if (!m) break;
    const ini = m.index;
    const re = new RegExp(`<${tag}\\b[^>]*>|</${tag}>`, 'gi');
    re.lastIndex = ini;
    let prof = 0; let fim = -1; let t;
    while ((t = re.exec(out))) {
      if (t[0][1] === '/') prof--; else prof++;
      if (prof === 0) { fim = re.lastIndex; break; }
    }
    if (fim < 0) throw new Error(`elemento sem fechamento em ${ini}`);
    removidos.push(out.slice(ini, fim));
    out = out.slice(0, ini) + marca + out.slice(fim);
  }
  return [out, removidos];
}

const BLOCOS = ['p', 'div', 'li', 'ul', 'ol', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'section', 'details', 'summary', 'blockquote', 'figure', 'figcaption', 'dl', 'dt', 'dd', 'button'];
const RE_BLOCO = new RegExp(`</?(?:${BLOCOS.join('|')})\\b[^>]*>`, 'gi');

/** Recorta a seção `id` do HTML e devolve { linhaIni, html }. */
export function secao(html, id) {
  const ini = html.indexOf(`<section id="${id}">`);
  if (ini < 0) throw new Error(`seção ${id} não encontrada`);
  const fim = html.indexOf('</section>', ini);
  return { linhaIni: html.slice(0, ini).split('\n').length, html: html.slice(ini, fim) };
}

/** Segmentos de texto da seção de uma aula, na ordem da fonte. */
export function segmentosDaAula(htmlSecao, { linhaIni = 1 } = {}) {
  let h = htmlSecao.replace(/<!--[\s\S]*?-->/g, '').replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
  const [semInst, instrumentos] = removerBalanceado(h, /<div class="inst"[^>]*>/);
  h = semInst;
  // Painel de três níveis (div.lv): na fonte, as três abas vêm antes dos três painéis;
  // o produto não tem abas e lê aba + painel, um nível de cada vez. A conferência usa a
  // ordem intercalada (mesma decisão do verificar-porte-m01.mjs).
  const [semLv, paineis] = removerBalanceado(h, /<div class="lv"[^>]*>/, 'div', '\u0002');
  h = semLv;
  for (const lv of paineis) {
    const hd = (lv.match(/<div class="lv-hd">([\s\S]*?)<\/div>/) || [])[1] ?? '';
    const abas = [...lv.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/g)].map((m) => m[1]);
    const pan = [...lv.matchAll(/<div class="lv-pane[^"]*"[^>]*>([\s\S]*?)<\/div>/g)].map((m) => m[1]);
    const inter = abas.map((a, i) => `<p>${a}</p><p>${pan[i] ?? ''}</p>`).join('');
    h = h.replace('\u0002', `<p>${hd}</p>${inter}`);
  }
  // Caixas com rótulo em negrito inicial (M13 08.4, div.and-br/and-no): o rótulo é segmento próprio.
  h = h.replace(/(<div class="and-(?:br|no)">)<b>([\s\S]*?)<\/b>/g, '$1<p>$2</p>');
  const [semSecId] = removerBalanceado(h, /<div class="sec-id"[^>]*>/);
  h = semSecId.replace(/<h2[^>]*>[\s\S]*?<\/h2>/i, '\u0000');
  // span.tag é rótulo de caixa: vira segmento próprio.
  // O mesmo para os rótulos de ficha (sg, tp), o selo de status da taxonomia (st),
  // os selos de estado das fichas (ok2, pend, nao) e a nota miúda (mini).
  h = h.replace(/<span class="(?:tag|sg|tp|st|ok2|pend|nao|mini)"[^>]*>([\s\S]*?)<\/span>/gi, '\u0000$1\u0000');
  const partes = h.replace(/<br\s*\/?>/gi, ' ').replace(RE_BLOCO, '\u0000').split('\u0000');
  const segs = [];
  for (const p of partes) {
    const t = norm(p);
    if (!t || !/[\p{L}\p{N}]/u.test(t)) continue;
    segs.push(t);
  }
  return { segmentos: segs, instrumentos };
}

/** Fluxo do produto de uma aula: [{ k, t }] na ordem em que o aluno lê. */
export function fluxoDoProduto({ aula, lead, corpo }) {
  const out = [];
  if (aula?.title) out.push({ k: 'title', t: aula.title });
  if (aula?.subtitle) out.push({ k: 'subtitle', t: aula.subtitle });
  if (lead) out.push({ k: 'lead', t: lead });
  for (const b of corpo ?? []) {
    switch (b.kind) {
      case 'titulo': out.push({ k: 'titulo', t: `${b.numero ?? ''} ${b.texto}` }); break;
      case 'paragrafo': out.push({ k: 'paragrafo', t: b.html }); break;
      case 'formula': out.push({ k: 'formula', t: b.eq }); if (b.desc) out.push({ k: 'formula-desc', t: b.desc }); break;
      case 'nota': if (b.label) out.push({ k: 'nota-label', t: b.label }); out.push({ k: 'nota', t: b.html }); break;
      case 'lista': for (const it of b.itens) out.push({ k: 'lista', t: it }); break;
      case 'tabela': for (const l of b.linhas) for (const c of l) out.push({ k: 'celula', t: c }); break;
      default: out.push({ k: `?${b.kind}`, t: '' });
    }
  }
  return out;
}

/** Procura cada segmento no fluxo, em ordem. `trocas`: [[RegExp, por, nome]]
 *  aplicadas ao segmento da fonte; `uso` conta cada troca. */
export function conferirOrdem(segmentos, fluxo, trocas, uso) {
  const SEP = '\u0001';
  const pedacos = fluxo.map((e) => compacto(e.t));
  const tudo = pedacos.join(SEP);
  let pos = 0;
  const faltas = [];
  for (const s of segmentos) {
    let alvo = s;
    for (const [re, por, nome] of trocas) {
      const n = (alvo.match(re) || []).length;
      if (n) { uso[nome] = (uso[nome] || 0) + n; alvo = alvo.replace(re, por); }
    }
    const c = compacto(alvo);
    if (!c) continue;
    const i = tudo.indexOf(c, pos);
    if (i >= 0) { pos = i + c.length; continue; }
    faltas.push({ t: s, foraDeOrdem: tudo.includes(c) });
  }
  return faltas;
}

const PARES = ['span', 'b', 'strong', 'i', 'em', 'u', 'sub', 'sup', 'small', 'p', 'ul', 'li', 'a', 'code'];
export function orfaos(strings) {
  const achados = [];
  for (const { onde, s } of strings) {
    for (const tag of PARES) {
      const ab = (String(s).match(new RegExp(`<${tag}(\\s[^>]*)?>`, 'gi')) || []).length;
      const fe = (String(s).match(new RegExp(`</${tag}>`, 'gi')) || []).length;
      if (ab !== fe) achados.push({ onde, tag, ab, fe, trecho: norm(s).slice(0, 70) });
    }
  }
  return achados;
}

export const lerFonte = (caminho) => fs.readFileSync(caminho, 'utf8').replace(/\r\n/g, '\n');
