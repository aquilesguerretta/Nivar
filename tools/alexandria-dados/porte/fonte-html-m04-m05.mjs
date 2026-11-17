// fonte-html-m04-m05.mjs — o corpo das aulas do M04 e do M05, lido do HTML original.
//
// Por que existe: a extração verificada desses dois módulos (docs/alexandria-v2/
// extraction/m04 e m05) cobre módulo, aparato e instrumentos, mas declara que "as
// aulas (corpo de apostila) não entram neste pacote" (README de cada uma). A única
// fonte do texto das aulas é, então, o HTML original em `Alexandria modulos/`, só
// leitura. Este arquivo faz para as aulas o papel que `aula-0N.json` faz no M01: lê
// o markup e devolve os blocos na ordem da fonte, com a linha de origem.
//
// Nada é reescrito aqui. O HTML de cada bloco sai como está na fonte, com três
// reduções de transporte, todas declaradas:
//   · `span.hl` / `span.num` perdem o invólucro (o texto fica);
//   · atributos `class` e `style` saem das tags que ficam;
//   · espaço em branco é colapsado e `<br/>` vira `<br>`.
// Entidades nomeadas viram o caractere (exceto &amp; &lt; &gt;).
//
// A troca editorial (P24/Q03: GridAlpha → NIVAR; Q02: "Bloco N" → "Módulo 0N") NÃO é
// feita aqui; quem consome aplica `EDITORIAIS` e conta cada uso.
//
// Uso: import { aulasDaFonte } from './fonte-html-m04-m05.mjs'; aulasDaFonte(4)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { carregarModulo, arquivoHtml } from '../mini-dom.mjs';

export const EDITORIAIS = [
  [/GridAlpha/g, 'NIVAR', 'P24/Q03 (empresa = NIVAR)'],
  [/\bBloco (\d)\b/g, (_, d) => `Módulo 0${d}`, 'Q02 (o catálogo governa o nome: "Bloco N" → "Módulo 0N")'],
  // "§00" é o código da seção de abertura na fonte (`<b>§00</b> · Tese`); o aluno não vê esse
  // código. Fica o nome que a própria fonte dá à seção.
  [/da §00\b/g, 'da tese do módulo', 'Q03 ("da §00" → "da tese do módulo": §00 é código de seção; a fonte a rotula "Tese")'],
];

export function editorial(s, uso = {}) {
  let r = String(s);
  for (const [re, por, nome] of EDITORIAIS) {
    const n = (r.match(re) || []).length;
    if (n) {
      uso[nome] = (uso[nome] || 0) + n;
      r = r.replace(re, por);
    }
  }
  return r;
}

const ENT = { nbsp: ' ', middot: '·', times: '×', minus: '−', ndash: '–', mdash: '—', hellip: '…', rarr: '→', larr: '←', deg: '°', plusmn: '±', divide: '÷', sup2: '²', sup3: '³', micro: 'µ', laquo: '«', raquo: '»', ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', bull: '•', asymp: '≈', ne: '≠', le: '≤', ge: '≥', uarr: '↑', darr: '↓', harr: '↔', quot: '"', apos: "'" };
const decodificaNomeadas = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z0-9]+);/gi, (m, e) => {
    if (e[0] === '#') {
      const cp = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      const c = String.fromCodePoint(cp);
      return c === '&' || c === '<' || c === '>' ? m : c;
    }
    return ENT[e.toLowerCase()] ?? m;
  });

/** HTML de um nó da fonte, com as reduções de transporte declaradas no cabeçalho. */
export function limpar(html) {
  let s = String(html);
  // span.hl / span.num: o invólucro sai, o texto fica (aninhamento de span não ocorre neles).
  for (let k = 0; k < 3; k++) s = s.replace(/<span class="(?:hl|num)"[^>]*>([\s\S]*?)<\/span>/g, '$1');
  s = s.replace(/<(\w+)((?:\s+[a-z-]+="[^"]*")+)\s*(\/?)>/gi, (m, tag, attrs, barra) => {
    const fica = [...attrs.matchAll(/\s+([a-z-]+)="([^"]*)"/gi)].filter(([, k]) => !/^(class|style)$/i.test(k));
    return `<${tag}${fica.map(([, k, v]) => ` ${k}="${v}"`).join('')}${barra ? ' /' : ''}>`;
  });
  s = s.replace(/<br\s*\/?>/gi, '<br>');
  s = decodificaNomeadas(s);
  return s.replace(/[\s ]+/g, (m) => (m.includes(' ') && !/[\n\t ]/.test(m) ? ' ' : ' ')).trim();
}

const texto = (el) => decodificaNomeadas(el.textContent).replace(/\s+/g, ' ').trim();

// Linha de cada bloco: a próxima tag de abertura igual no arquivo, a partir do bloco anterior.
function linhaDe(html, el, desde) {
  const alvo = `<${el.tag}${el.className ? ` class="${el.className}"` : ''}`;
  const i = html.indexOf(alvo, desde);
  return i < 0 ? { linha: null, pos: desde } : { linha: html.slice(0, i).split('\n').length, pos: i + 1 };
}

/**
 * Aulas do módulo `n`, na ordem da fonte. Cada bloco:
 *   { tipo: 'titulo', numero, texto } · { tipo: 'paragrafo', html } · { tipo: 'nota', tom, label, html }
 *   { tipo: 'tres_niveis', cabecalho, abas: [{ rotulo, html }] } · { tipo: 'tabela', linhas: string[][] }
 *   { tipo: 'lista', ordenada, itens } · { tipo: 'formula', eq, desc } · { tipo: 'instrumento', ordem }
 * mais `linha` (aproximada, do HTML-fonte).
 */
export function aulasDaFonte(n) {
  const m = carregarModulo(n, { instrumentar: false });
  const html = fs.readFileSync(arquivoHtml(n), 'utf8');
  const secoes = m.doc.querySelectorAll('section').filter((s) => /^a\d\d$/.test(s.id));
  let pos = 0;
  const aulas = [];
  let nInst = 0;
  for (const s of secoes) {
    const wrap = s.children.find((c) => c.temClasse('wrap')) ?? s;
    const aula = { id: s.id, numero: Number(s.id.slice(1)), secId: null, titulo: null, lead: null, blocos: [] };
    pos = Math.max(pos, html.indexOf(`<section id="${s.id}"`));
    for (const c of wrap.children) {
      const l = linhaDe(html, c, pos);
      pos = l.pos;
      const linha = l.linha;
      const cls = (k) => c.temClasse(k);
      if (c.tag === 'div' && cls('sec-id')) { aula.secId = texto(c); continue; }
      if (c.tag === 'h2') { aula.titulo = texto(c); continue; }
      if (c.tag === 'p' && cls('lede')) { aula.lead = limpar(c.innerHTML); continue; }
      if (c.tag === 'h3') {
        const num = c.children.find((x) => x.temClasse('num'));
        const numero = num ? texto(num) : null;
        const t = texto(c);
        aula.blocos.push({ tipo: 'titulo', numero, texto: numero && t.startsWith(numero) ? t.slice(numero.length).trim() : t, linha });
        continue;
      }
      if (c.tag === 'p') { aula.blocos.push({ tipo: 'paragrafo', html: limpar(c.innerHTML), linha }); continue; }
      if (c.tag === 'div' && cls('box')) {
        const tom = cls('cy') ? 'cy' : cls('rd') ? 'rd' : cls('gd') ? 'gd' : 'neutro';
        const tag = c.children.find((x) => x.temClasse('tag'));
        const ps = c.children.filter((x) => x.tag === 'p');
        const outros = c.children.filter((x) => x !== tag && x.tag !== 'p');
        if (outros.length) throw new Error(`box com filho não previsto em ${s.id} L${linha}: ${outros.map((x) => x.tag).join(',')}`);
        aula.blocos.push({ tipo: 'nota', tom, label: tag ? texto(tag) : null, paragrafos: ps.map((p) => limpar(p.innerHTML)), linha });
        continue;
      }
      if (c.tag === 'div' && cls('lv')) {
        const hd = c.querySelector('.lv-hd');
        const abas = c.querySelectorAll('.lv-tab').map((b) => texto(b));
        const paineis = c.querySelectorAll('.lv-pane').map((p) => limpar(p.innerHTML));
        if (abas.length !== paineis.length) throw new Error(`lv com ${abas.length} abas e ${paineis.length} painéis em ${s.id}`);
        aula.blocos.push({ tipo: 'tres_niveis', cabecalho: hd ? texto(hd) : null, abas: abas.map((r, i) => ({ rotulo: r, html: paineis[i] })), linha });
        continue;
      }
      if (c.tag === 'div' && cls('scroll')) {
        const t = c.querySelector('table');
        const linhas = t.querySelectorAll('tr').map((tr) => tr.children.filter((x) => x.tag === 'td' || x.tag === 'th').map((x) => limpar(x.innerHTML)));
        aula.blocos.push({ tipo: 'tabela', linhas, linha });
        continue;
      }
      if (c.tag === 'ol' || c.tag === 'ul') {
        aula.blocos.push({ tipo: 'lista', ordenada: c.tag === 'ol', itens: c.children.filter((x) => x.tag === 'li').map((x) => limpar(x.innerHTML)), linha });
        continue;
      }
      if (c.tag === 'div' && cls('form')) {
        const nota = c.children.find((x) => x.temClasse('note'));
        let eq = c.innerHTML;
        if (nota) eq = eq.replace(nota.outerHTML, '');
        aula.blocos.push({ tipo: 'formula', eq: limpar(eq).replace(/(<br>\s*)+$/, ''), desc: nota ? limpar(nota.innerHTML) : null, linha });
        continue;
      }
      if (c.tag === 'div' && cls('inst')) {
        nInst += 1;
        aula.blocos.push({ tipo: 'instrumento', ordem: nInst, linha });
        continue;
      }
      throw new Error(`elemento não previsto em ${s.id} L${linha}: <${c.tag} class="${c.className}">`);
    }
    aulas.push(aula);
  }
  return aulas;
}

/** Os instrumentos (div.inst) do módulo: título, intro, rótulos, unidades, readouts, disclaimer. */
export function instrumentosDaFonte(n) {
  const m = carregarModulo(n, { instrumentar: false });
  return m.doc.querySelectorAll('div').filter((d) => d.temClasse('inst')).map((d, i) => {
    const nm = d.querySelector('.nm');
    const intro = d.querySelector('.inst-intro');
    const disc = d.querySelector('.disc');
    const campos = d.querySelectorAll('.field').map((f) => {
      const lab = f.querySelector('label');
      const un = lab?.querySelector('.unit');
      const t = lab ? texto(lab) : '';
      const unidade = un ? texto(un) : null;
      const input = f.querySelector('input');
      return { rotulo: unidade && t.endsWith(unidade) ? t.slice(0, -unidade.length).trim() : t, unidade, id: input?.id ?? null, tipo: input?.type ?? null };
    });
    const saidas = d.querySelectorAll('.ro').map((ro) => {
      const k = ro.querySelector('.k');
      const nn = ro.querySelector('.n');
      const u = nn?.querySelector('.u');
      return { id: nn?.id ?? null, rotulo: k ? texto(k) : '', unidadeEstatica: u ? texto(u) : null };
    });
    return {
      ordem: i + 1,
      titulo: nm ? texto(nm) : null,
      intro: intro ? limpar(intro.innerHTML) : null,
      disc: disc ? limpar(disc.innerHTML) : null,
      campos,
      saidas,
    };
  });
}

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

// ── A apostila do produto (AulaBloco), derivada dos blocos da fonte ──────────
//
// Uma forma por tipo, sem decisão de conteúdo:
//   box.cy → nota tom 'gold' · box.rd → nota tom 'red' · box.gd → nota tom 'neutro'
//     (os parágrafos do box são unidos por <br><br>, como no M01);
//   div.lv (três níveis) → três notas, uma por aba, com o rótulo
//     "<cabeçalho do lv> · <rótulo da aba>" (no M01, uma nota por nível);
//   div.scroll > table → tabela; ol/ul → lista; div.form → fórmula (eq + nota);
//   div.inst → não vira bloco: registra depois de qual bloco o instrumento está.
const TOM = { cy: 'gold', rd: 'red', gd: 'neutro', neutro: 'neutro' };

export function apostilaDoModulo(n) {
  const uso = {};
  const ed = (s) => (s == null ? s : editorial(s, uso));
  const aulas = aulasDaFonte(n).map((a) => {
    const blocos = [];
    let instrumentoDepoisDoBloco = null;
    for (const b of a.blocos) {
      switch (b.tipo) {
        case 'titulo': blocos.push({ kind: 'titulo', numero: b.numero, texto: ed(b.texto) }); break;
        case 'paragrafo': blocos.push({ kind: 'paragrafo', html: ed(b.html) }); break;
        case 'nota': blocos.push({ kind: 'nota', tom: TOM[b.tom], label: ed(b.label), html: ed(b.paragrafos.join('<br><br>')) }); break;
        case 'tres_niveis':
          for (const aba of b.abas) blocos.push({ kind: 'nota', tom: 'neutro', label: ed(`${b.cabecalho} · ${aba.rotulo}`), html: ed(aba.html) });
          break;
        case 'tabela': blocos.push({ kind: 'tabela', linhas: b.linhas.map((l) => l.map(ed)) }); break;
        case 'lista': blocos.push({ kind: 'lista', itens: b.itens.map(ed) }); break;
        case 'formula': blocos.push({ kind: 'formula', eq: ed(b.eq), desc: ed(b.desc) }); break;
        case 'instrumento': instrumentoDepoisDoBloco = blocos.length - 1; break;
        default: throw new Error(`tipo ${b.tipo}`);
      }
    }
    return { numero: a.numero, titulo: ed(a.titulo), secId: a.secId, lead: ed(a.lead), blocos, instrumentoDepoisDoBloco };
  });
  return { aulas, uso };
}
