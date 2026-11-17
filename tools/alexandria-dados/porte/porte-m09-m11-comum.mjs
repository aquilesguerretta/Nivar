// porte-m09-m11-comum.mjs — verificador de texto do porte v3 para M09, M10 e M11.
//
// Os três módulos têm a mesma gramática de HTML (sec-id, lede, inst, box, lv, fi,
// tbl, num-list), e a extração deles (docs/alexandria-v2/extraction/mNN/) NÃO traz o
// corpo das aulas bloco a bloco — só a estrutura (roteiro). Por isso a régua do corpo
// é o HTML original (só leitura, lido pelo mini-dom), e cada string de conteúdo de
// cada aula precisa aparecer em src/lib/data/alexandria-modulo-NN-content.ts, na
// ordem da fonte.
//
// Unidade de comparação: cada "corrida inline" de um elemento de bloco — o texto
// contíguo de nós de texto e de tags inline (b, i, span, sub, sup...) entre dois
// elementos de bloco. Assim um <p> é uma unidade, uma célula é uma unidade, o
// rótulo span.tag de um box é uma unidade, e a ficha div.fi-k/fi-v são unidades.
// O instrumento (div.inst) fica fora: ele é conferido pelo verificador de
// instrumentos. sec-id e h2 conferem contra o subtítulo e o título da aula; p.lede
// confere contra o LEAD.
//
// Três verificações, como no M01: FALTA (unidade da fonte que não aparece, ou fora
// de ordem), ÓRFÃO (tag aberta sem fechar, ou fechada antes de abrir, no .ts) e
// TROCAS editoriais declaradas (aplicadas ao lado da FONTE antes de comparar, e
// contadas na saída). Nada é explicado em silêncio.

import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { carregarModulo, decodificar } from '../mini-dom.mjs';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

const INLINE = new Set(['b', 'strong', 'i', 'em', 'u', 'span', 'a', 'sub', 'sup', 'br', 'code', 'small', 'abbr', 'mark', 's']);
// span de bloco vira unidade própria: rótulo do box (tag), nota da fórmula (note),
// rótulo do cartão da cadeia (ck2)
const SPAN_BLOCO = /\b(tag|note|ck2)\b/;

const colapsar = (s) => s.replace(/[\s ]+/g, ' ').trim();
export const semTags = (s) => String(s ?? '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '');
export const norm = (s) => colapsar(decodificar(semTags(s)));
// Comparação sem espaço: o HTML da fonte cola spans de bloco visual ("Diagnósticoantes
// de tudo") que o produto separa com espaço. Só o espaço é ignorado, nunca um caractere.
export const compacto = (s) => norm(s).replace(/\s+/g, '');

const ehTexto = (f) => !f.tag;
const classe = (e) => e.attrs?.class ?? '';

function unidadesDe(el, out, pular) {
  let run = '';
  const fecha = () => {
    const t = colapsar(run);
    if (t) out.push(t);
    run = '';
  };
  for (const f of el.filhos) {
    if (ehTexto(f)) { run += f.data; continue; }
    if (pular(f)) { fecha(); continue; }
    const inline = INLINE.has(f.tag) && !(f.tag === 'span' && SPAN_BLOCO.test(classe(f)));
    if (inline) { run += f.tag === 'br' ? ' ' : f.textContent; continue; }
    fecha();
    if (f.tag === 'span') {
      const t = colapsar(f.textContent);
      if (t) out.push(t);
      continue;
    }
    if (classe(f).split(' ').includes('lv')) {
      // painel de três níveis: o produto não tem abas. Como no M01, cada nível vira
      // uma nota, intercalada (aba, painel); o rótulo é "<cabeça> · <aba>".
      const hd = f.querySelector('.lv-hd');
      const abas = f.querySelectorAll('.lv-tab');
      const paineis = f.querySelectorAll('.lv-pane');
      abas.forEach((ab, i) => {
        out.push(`${hd ? colapsar(hd.textContent) + ' · ' : ''}${colapsar(ab.textContent)}`);
        if (paineis[i]) unidadesDe(paineis[i], out, pular);
      });
      continue;
    }
    if (classe(f).split(' ').includes('fi-hd')) {
      // cabeça da ficha: dois spans (nome · posição) que a fonte separa só por estilo;
      // o produto os escreve com " · " entre eles.
      out.push(f.children.map((x) => colapsar(x.textContent)).join(" · "));
      continue;
    }
    unidadesDe(f, out, pular);
  }
  fecha();
}

/** Unidades de texto das aulas do módulo n, a partir do HTML original. */
export function fonteDasAulas(n) {
  const m = carregarModulo(n, { instrumentar: false });
  const secs = m.doc.querySelectorAll('section').filter((s) => /^a\d+$/.test(s.attrs?.id ?? ''));
  return secs.map((s, i) => {
    const sid = s.querySelector('.sec-id');
    const h2 = s.querySelector('h2');
    const lede = s.querySelector('p.lede');
    const unidades = [];
    const pular = (e) => /\binst\b/.test(classe(e)) || /\bsec-id\b/.test(classe(e)) || e.tag === 'h2' || /\blede\b/.test(classe(e));
    unidadesDe(s, unidades, pular);
    return {
      numero: i + 1,
      id: s.attrs.id,
      secId: sid ? colapsar(sid.textContent) : null,
      titulo: h2 ? colapsar(h2.textContent) : null,
      lede: lede ? colapsar(lede.textContent) : null,
      unidades,
    };
  });
}

export async function carregarTs(nn) {
  return import(pathToFileURL(path.join(RAIZ, `src/lib/data/alexandria-modulo-${nn}-content.ts`)).href);
}

/** Entradas do .ts na ordem do fluxo. */
export function entradasDoCorpo(blocos) {
  const out = [];
  for (const b of blocos ?? []) {
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

const PARES = ['span', 'b', 'strong', 'i', 'em', 'u', 'sub', 'sup', 'p', 'ul', 'ol', 'li', 'a'];
export function orfaos(strings) {
  const achados = [];
  for (const { onde, s } of strings) {
    const str = String(s ?? '');
    for (const tag of PARES) {
      const ab = (str.match(new RegExp(`<${tag}(\\s[^>]*)?>`, 'gi')) || []).length;
      const fe = (str.match(new RegExp(`</${tag}>`, 'gi')) || []).length;
      if (ab !== fe) { achados.push({ onde, tag, ab, fe, trecho: norm(str).slice(0, 70) }); continue; }
      let prof = 0;
      const re = new RegExp(`<(/?)${tag}(\\s[^>]*)?>`, 'gi');
      let m;
      while ((m = re.exec(str))) {
        prof += m[1] ? -1 : 1;
        if (prof < 0) { achados.push({ onde, tag, ab, fe, trecho: 'fecha antes de abrir: ' + norm(str).slice(0, 60) }); break; }
      }
    }
  }
  return achados;
}

/**
 * Roda a conferência do corpo. `trocas`: [[RegExp, substituto, nome]] aplicadas à
 * FONTE. `explicadas`: { 'aNN#i': razão }, faltas declaradas. `extras(mod, idAula)`:
 * strings adicionais do .ts para a checagem de órfão (instrumentos, exercícios).
 * Devolve o código de saída.
 */
export async function verificar({ n, trocas = [], explicadas = {}, sobras = {}, extras = () => [] }) {
  const nn = String(n).padStart(2, '0');
  const mod = await carregarTs(nn);
  const LEAD = mod[`MODULO_${nn}_LEAD`];
  const CORPO = mod[`MODULO_${nn}_CORPO`];
  const AULAS = mod[`MODULO_${nn}_AULAS`];
  const uso = {};
  const editorial = (s) => {
    let r = s;
    for (const [re, por, nome] of trocas) {
      const k = (r.match(re) || []).length;
      if (k) { uso[nome] = (uso[nome] || 0) + k; r = r.replace(re, por); }
    }
    return r;
  };
  const fonte = fonteDasAulas(n);
  let codigo = 0;
  const resumo = [];
  for (const a of fonte) {
    const idA = `aula-${nn}-${String(a.numero).padStart(2, '0')}`;
    const aula = AULAS.find((x) => x.id === idA);
    const corpo = entradasDoCorpo(CORPO[idA]);
    const faltas = [];
    const expl = [];
    const cab = [
      ['titulo', a.titulo, aula?.title],
      ['subtitulo', a.secId?.replace(/^Aula \d+\s*·\s*/, ''), aula?.subtitle],
      ['lede', a.lede, LEAD[idA]],
    ];
    for (const [k, f, t] of cab) if (f && compacto(editorial(f)) !== compacto(t ?? '')) faltas.push({ id: `${a.id}/${k}`, t: f, ts: t ?? '' });
    let pos = 0;
    a.unidades.forEach((u, i) => {
      const id = `${a.id}#${i}`;
      const alvo = compacto(editorial(u));
      if (!alvo) return;
      let achou = -1;
      for (let k = pos; k < corpo.length; k++) if (compacto(corpo[k].t).includes(alvo)) { achou = k; break; }
      if (achou >= 0) { pos = achou; return; }
      const fora = corpo.findIndex((x) => compacto(x.t).includes(alvo));
      const f = { id, t: u, foraDeOrdem: fora >= 0 };
      if (explicadas[id]) expl.push({ ...f, razao: explicadas[id] });
      else faltas.push(f);
    });
    // SOBRA: o inverso — toda entrada do .ts precisa estar na fonte desta aula (a
    // concatenação das unidades, depois das trocas). Frase nova só com declaração
    // (voz da Alexandria, decisões 7/8), por prefixo de texto em `sobras`.
    const semContar = (s) => trocas.reduce((r, [re, por]) => r.replace(re, por), s);
    const fonteCompacta = a.unidades.map((u) => compacto(semContar(u))).join('');
    corpo.forEach((e, i) => {
      const c = compacto(e.t);
      if (!c || fonteCompacta.includes(c)) return;
      const dec = Object.keys(sobras).find((p) => norm(e.t).startsWith(p));
      if (dec) expl.push({ id: `${a.id}/ts#${i}`, t: e.t, razao: `sobra declarada — ${sobras[dec]}` });
      else faltas.push({ id: `${a.id}/ts#${i} SOBRA (no .ts, não na fonte)`, t: e.t });
    });
    const strs = [{ onde: 'lead', s: LEAD[idA] ?? '' }, ...corpo.map((e, i) => ({ onde: `corpo#${i}(${e.k})`, s: e.t })), ...extras(mod, idA)];
    const orf = orfaos(strs);
    const desconhecidos = corpo.filter((e) => e.k.startsWith('?'));
    console.log(`\n══ ${nn}·Aula ${String(a.numero).padStart(2, '0')} — ${a.titulo}`);
    console.log(`   unidades da fonte: ${a.unidades.length} · entradas no .ts: ${corpo.length} · FALTA: ${faltas.length} · explicadas: ${expl.length} · ÓRFÃO: ${orf.length}`);
    for (const f of faltas) console.log(`   - ${f.id}${f.foraDeOrdem ? ' (fora de ordem)' : ''}: «${norm(f.t).slice(0, 160)}»${f.ts !== undefined ? `\n       .ts: «${norm(f.ts).slice(0, 160)}»` : ''}`);
    for (const f of expl) console.log(`   · explicada ${f.id}: ${f.razao}`);
    for (const o of orf) console.log(`   ! órfão ${o.onde} <${o.tag}>: ${o.ab} abre, ${o.fe} fecha — «${o.trecho}»`);
    for (const d of desconhecidos) console.log(`   ! bloco de tipo desconhecido: ${d.k}`);
    resumo.push({ n: a.numero, u: a.unidades.length, falta: faltas.length, expl: expl.length, orf: orf.length });
    if (faltas.length || orf.length || desconhecidos.length) codigo = 1;
  }
  if (fonte.length !== AULAS.length) {
    console.log(`\n! a fonte tem ${fonte.length} aulas e o .ts ${AULAS.length}`);
    codigo = 1;
  }
  console.log('\n══ Resumo');
  for (const r of resumo) console.log(`   aula ${String(r.n).padStart(2, '0')}: ${String(r.u).padStart(3)} unidades · falta ${r.falta} · explicadas ${r.expl} · órfão ${r.orf}`);
  const tot = (k) => resumo.reduce((s, r) => s + r[k], 0);
  console.log(`   total: ${tot('u')} unidades · falta ${tot('falta')} · explicadas ${tot('expl')} · órfão ${tot('orf')}`);
  if (Object.keys(uso).length) console.log(`   trocas editoriais aplicadas à fonte: ${JSON.stringify(uso)}`);
  console.log(codigo ? '   RESULTADO: FALHA' : '   RESULTADO: 0 falta, 0 órfão');
  return codigo;
}

/** innerHTML de um elemento da fonte → HTML curto do produto. Regra única, usada pelos
 *  re-portes: span.hl e span.sh → <b>; span.sw → <i> com espaço; outros span → texto;
 *  b/strong/i/em/sub/sup/br ficam; atributos saem. */
export function converterHtml(el) {
  let out = '';
  for (const f of el.filhos) {
    if (!f.tag) { out += f.data.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); continue; }
    const c = f.attrs?.class ?? '';
    if (f.tag === 'span') {
      if (/\bhl\b/.test(c) || /\bsh\b/.test(c)) {
        // span.sh carrega o span.sw dentro: o qualificador sai do negrito
        const sw = f.filhos.filter((x) => x.tag === 'span' && /\bsw\b/.test(x.attrs?.class ?? ''));
        if (sw.length) {
          const cabeca = { filhos: f.filhos.filter((x) => !sw.includes(x)) };
          out += `<b>${converterHtml(cabeca).trim()}</b> ${sw.map((x) => `<i>${converterHtml(x).trim()}</i>`).join(' ')} `;
        } else out += /\bsh\b/.test(c) ? `<b>${converterHtml(f).trim()}</b> ` : `<b>${converterHtml(f)}</b>`;
        continue;
      }
      if (/\bsw\b/.test(c)) { out += ` <i>${converterHtml(f).trim()}</i> `; continue; }
      out += converterHtml(f);
      continue;
    }
    if (['b', 'strong', 'i', 'em', 'sub', 'sup'].includes(f.tag)) { out += `<${f.tag}>${converterHtml(f)}</${f.tag}>`; continue; }
    if (f.tag === 'br') { out += '<br>'; continue; }
    out += converterHtml(f);
  }
  return out.replace(/[ \t\n\r]+/g, ' ').replace(/ ([,.;:])/g, '$1');
}

