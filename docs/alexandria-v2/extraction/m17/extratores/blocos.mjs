// Walker de blocos do vocabulario do M17. Converte cada filho direto do .wrap
// de uma secao num bloco tipado, com html/texto literais e origem. Estrutura
// nao reconhecida NAO e descartada: vira bloco `desconhecido` e e reportada.
import * as L from './lib.mjs';

const { T, H, els, find, findAll, classIs, hasClass, cls, origem, lineOf } = L;
export const DESCONHECIDOS = [];

const sel = (sec, n) => `section#${sec} ${n.tag}${n.attrs.class ? '.' + cls(n).join('.') : ''}${n.attrs.id ? '#' + n.attrs.id : ''}`;
const kidsBy = (n, c) => els(n).filter((k) => classIs(k, c) || hasClass(k, c));
const one = (n, c) => find(n, (k) => classIs(k, c));
const litp = (n, s) => ({ html: H(n), texto: T(n), origem: origem(s, n) });

function tabela(n, s) {
  const rows = findAll(n, (k) => k.tag === 'tr');
  return {
    tipo: 'tabela',
    cabecalho: (() => { const th = findAll(rows[0], (k) => k.tag === 'th'); return th.length ? th.map((c) => ({ html: H(c), texto: T(c) })) : null; })(),
    linhas: rows.filter((r) => !findAll(r, (k) => k.tag === 'th').length || findAll(r, (k) => k.tag === 'td').length)
      .map((r) => ({ celulas: findAll(r, (k) => k.tag === 'td').map((c) => ({ html: H(c), texto: T(c) })), linha_aprox: lineOf(r.start) })),
    origem: origem(s, n),
  };
}

function box(n, s) {
  const tag = find(n, (k) => classIs(k, 'tag'));
  const partes = els(n).filter((k) => k !== tag).map((k) => {
    if (k.tag === 'p') return { tipo: 'paragrafo', html: H(k), texto: T(k), linha_aprox: lineOf(k.start) };
    if (classIs(k, 'ga')) return { tipo: 'pares', pares: pares(k) };
    return desconhecido(k, s);
  });
  const c = cls(n).filter((x) => x !== 'box');
  return { tipo: 'destaque', classe: n.attrs.class, variante: c[0] || null, rotulo: tag ? T(tag) : null,
    bloco_de_produto_P7: tag ? /^Onde isso entra no produto/.test(T(tag)) : false, partes, origem: origem(s, n, tag ? T(tag) : undefined) };
}
function pares(ga) {
  const ks = els(ga);
  const out = [];
  for (let i = 0; i < ks.length; i += 2) {
    const k = ks[i], v = ks[i + 1];
    out.push({ chave: T(k), valor_html: H(v), valor_texto: T(v), linha_aprox: lineOf(k.start) });
  }
  return out;
}
function desconhecido(n, s) {
  const d = { tipo: 'desconhecido', tag: n.tag, classe: n.attrs.class || null, html: H(n), texto: T(n), origem: origem(s, n) };
  DESCONHECIDOS.push({ secao: s, tag: n.tag, classe: n.attrs.class, linha: lineOf(n.start) });
  return d;
}

export function bloco(n, sec) {
  const s = sel(sec, n);
  const c = n.attrs.class || '';
  if (classIs(n, 'sec-id')) return { tipo: 'marcador', ...litp(n, s) };
  if (n.tag === 'h2') return { tipo: 'titulo_secao', ...litp(n, s) };
  if (n.tag === 'h3') return { tipo: 'subtitulo', ...litp(n, s) };
  if (n.tag === 'p') return { tipo: c === 'lede' ? 'lede' : c === 'srcnote' ? 'nota_de_fonte' : 'paragrafo', ...litp(n, s) };
  if (n.tag === 'table') return tabela(n, s);
  if (n.tag === 'div' && /^box\b/.test(c)) return box(n, s);
  if (classIs(n, 'tri')) return { tipo: 'grade_tres', itens: kidsBy(n, 'tg').map((g) => ({ chave: T(one(g, 'tk')), valor_html: H(one(g, 'tv')), valor_texto: T(one(g, 'tv')), linha_aprox: lineOf(g.start) })), origem: origem(s, n) };
  if (classIs(n, 'grg')) return { tipo: 'grade_parcelas', itens: els(n).map((r) => ({ classe: r.attrs.class, chave: T(one(r, 'grg-k')), valor_html: H(one(r, 'grg-v')), valor_texto: T(one(r, 'grg-v')), linha_aprox: lineOf(r.start) })), origem: origem(s, n) };
  if (classIs(n, 'esc')) return { tipo: 'escada', itens: els(n).map((r) => ({ numero: T(one(r, 'esc-n')), html: H(one(r, 'esc-b')), texto: T(one(r, 'esc-b')), linha_aprox: lineOf(r.start) })), origem: origem(s, n) };
  if (classIs(n, 'p7')) return { tipo: 'sete_declaracoes', itens: els(n).map((r) => ({ classe: r.attrs.class, numero: T(one(r, 'p7-n')), chave: T(one(r, 'p7-k')), valor_html: H(one(r, 'p7-v')), valor_texto: T(one(r, 'p7-v')), linha_aprox: lineOf(r.start) })), origem: origem(s, n) };
  if (classIs(n, 'cn5')) return { tipo: 'casos_numerados', itens: els(n).map((r) => ({ numero: T(one(r, 'cn5-n')), chave: T(one(r, 'cn5-k')), valor_html: H(one(r, 'cn5-v')), valor_texto: T(one(r, 'cn5-v')), linha_aprox: lineOf(r.start) })), origem: origem(s, n) };
  if (classIs(n, 'conf')) return { tipo: 'declaracao_conflito', rotulo: T(one(n, 'conf-hd')), paragrafos: findAll(one(n, 'conf-bd'), (k) => k.tag === 'p').map((p) => ({ html: H(p), texto: T(p), linha_aprox: lineOf(p.start) })), origem: origem(s, n) };
  if (classIs(n, 'glo')) {
    const bd = one(n, 'glo-bd');
    return { tipo: 'glosa', rotulo: T(one(n, 'glo-hd')), palavra: T(one(bd, 'gw')),
      intro: (() => { const p = find(bd, (k) => k.tag === 'p'); return { html: H(p), texto: T(p) }; })(),
      sentidos: pares(one(bd, 'ga')), origem: origem(s, n) };
  }
  if (classIs(n, 'inst')) {
    const hd = one(n, 'inst-hd');
    return { tipo: 'instrumento', id_fonte: n.attrs.id, rotulo: T(find(hd, (k) => classIs(k, 'id'))), titulo: T(find(hd, (k) => classIs(k, 'ti'))), ver: 'instrumentos.json', origem: origem(s, n) };
  }
  if (classIs(n, 'dvs')) return { tipo: 'divisor', ...litp(n, s) };
  if (classIs(n, 'jgrid')) return { tipo: 'grade_gerada_por_script', id_fonte: n.attrs.id, nota: 'Div vazia no markup; preenchida pelo <script> (ver instrumentos.json/grades_estaticas).', origem: origem(s, n, `#${n.attrs.id}`) };
  if (classIs(n, 'lv')) {
    const tabs = findAll(n, (k) => k.tag === 'button');
    const panes = findAll(n, (k) => hasClass(k, 'lv-pane'));
    return { tipo: 'tres_niveis', id_fonte: n.attrs.id, rotulo: T(one(n, 'lv-hd')),
      niveis: panes.map((p, i) => ({ aba: tabs[i] ? T(tabs[i]) : null, html: H(p), texto: T(p), linha_aprox: lineOf(p.start) })), origem: origem(s, n) };
  }
  if (classIs(n, 'par3')) {
    const bd = one(n, 'par3-bd');
    const partes = els(bd).map((k) => {
      if (k.tag === 'p') return { tipo: 'paragrafo', html: H(k), texto: T(k), style: k.attrs.style || null, linha_aprox: lineOf(k.start) };
      if (classIs(k, 'par3-bar')) return { tipo: 'barra', segmentos: els(k).map((g) => ({ classe: g.attrs.class, style: g.attrs.style, rotulo: T(g), flex: +(/flex:\s*([\d.]+)/.exec(g.attrs.style || '') || [])[1] })), linha_aprox: lineOf(k.start) };
      if (classIs(k, 'par3-nt')) return { tipo: 'nota', html: H(k), texto: T(k), linha_aprox: lineOf(k.start) };
      return desconhecido(k, s);
    });
    return { tipo: 'decomposicao_estatica', id_fonte: n.attrs.id, rotulo: T(one(n, 'par3-hd')), partes, origem: origem(s, n) };
  }
  if (classIs(n, 'clk')) return { tipo: 'roteiro_cronometrado', itens: els(n).map((r) => {
    const b = one(r, 'clk-b'); const bold = find(b, (k) => k.tag === 'b');
    const corpo = L.html.slice(bold.end, b.closeStart);
    return { faixa: T(one(r, 'clk-t')), faixa_html: H(one(r, 'clk-t')), titulo: T(bold), html: H(b), fala_html: L.inline(corpo), fala_texto: L.texto(corpo), linha_aprox: lineOf(r.start) };
  }), origem: origem(s, n) };
  if (n.tag === 'ul') return { tipo: 'lista', classe: n.attrs.class || null, itens: findAll(n, (k) => k.tag === 'li').map((li) => ({ html: H(li), texto: T(li), linha_aprox: lineOf(li.start) })), origem: origem(s, n) };
  if (n.tag === 'details') {
    const sum = find(n, (k) => k.tag === 'summary'); const bd = one(n, 'det-bd');
    return { tipo: 'expansivel', resumo_html: H(sum), resumo_texto: T(sum), corpo_html: H(bd), corpo_texto: T(bd), origem: origem(s, n) };
  }
  if (classIs(n, 'fi')) {
    const hd = one(n, 'fi-hd');
    return { tipo: 'ficha', jurisdicao: T(find(hd, (k) => classIs(k, 'sg'))), etiqueta: (() => { const j = find(hd, (k) => hasClass(k, 'jtag')); return j ? { classe: j.attrs.class, texto: T(j), html: H(j) } : null; })(),
      campos: kidsBy(n, 'fi-row').map((r) => ({ campo: T(one(r, 'fi-k')), html: H(one(r, 'fi-v')), texto: T(one(r, 'fi-v')), linha_aprox: lineOf(r.start) })), origem: origem(s, n, T(hd)) };
  }
  if (classIs(n, 'ref-list')) return { tipo: 'lista_de_blocos_de_fonte', itens: findAll(n, (k) => k.tag === 'p').map((p) => ({ html: H(p), texto: T(p), linha_aprox: lineOf(p.start) })), origem: origem(s, n) };
  if (n.attrs.id === 'quiz-box' || n.attrs.id === 'quiz-score') return { tipo: 'alvo_de_script', id_fonte: n.attrs.id, origem: origem(s, n, '#' + n.attrs.id) };
  return desconhecido(n, s);
}

export function blocosDaSecao(id) {
  const sec = L.secao(id);
  return L.wrapKids(sec).map((k) => bloco(k, id));
}
