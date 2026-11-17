// Verifica o porte de M06, M07 e M08 contra o HTML original — modelo: verificar-porte-m01.mjs.
// Chamado por verificar-porte-m06.mjs / -m07 / -m08 (um por módulo, como pede o protocolo).
//
// Lê o .ts de verdade (Node 24 tira os tipos) e compara o que o produto entrega
// (MODULO_NN_LEAD, MODULO_NN_CORPO, MODULO_NN_AULAS[].instruments) com a fonte:
//
//   1. FALTA (ordenada)  — cada texto de bloco da fonte (lido por aulas-html-m06-m08.mjs, ANTES de
//                          qualquer troca de forma) aparece no corpo do .ts, na ordem da fonte.
//   2. FALTA (palavras)  — leitura independente do parser de blocos: todas as palavras visíveis da
//                          seção da aula (tudo menos o miolo dos instrumentos) aparecem no .ts com pelo
//                          menos a mesma contagem. Pega texto que o parser de blocos não enxergasse.
//   3. ÓRFÃO             — tag inline aberta sem fechar (ou o contrário) em string do .ts.
//   4. INSTRUMENTO       — por aula, os mesmos instrumentos da fonte, na ordem; título, instrução
//                          (`inst-intro`), rótulos de campo, de leitura e o aviso `p.disc` presentes no
//                          objeto (título, campos, opções, saídas, nota).
//   5. TIPOGRAFIA (Q13)  — espaço antes de pontuação que a fonte não tem.
//
// Trocas editoriais (corpo-m06-m08.mjs, EDITORIAIS) são aplicadas ao lado da FONTE antes de comparar,
// e contadas. Faltas declaradas saem à parte, com a razão. Sai com 1 se houver falta não explicada.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { registerHooks } from 'node:module';
import { lerAulas, filhos, FONTE } from './aulas-html-m06-m08.mjs';
import { editorial } from './corpo-m06-m08.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

// O código do produto importa sem extensão e com o alias `@/` (Vite). Para o Node importar o .ts
// de verdade: tenta como veio; se falhar, tenta `.ts` (e `@/` → src/).
registerHooks({
  resolve(spec, ctx, next) {
    try {
      return next(spec, ctx);
    } catch (e) {
      if (spec.startsWith('@/')) return next(pathToFileURL(path.join(RAIZ, 'src', spec.slice(2) + '.ts')).href, ctx);
      if (/^\.\.?\//.test(spec) && !/\.\w+$/.test(spec)) return next(spec + '.ts', ctx);
      throw e;
    }
  },
});

const ENTIDADES = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", ndash: '–', mdash: '—', hellip: '…', times: '×', middot: '·', divide: '÷', deg: '°', sup2: '²', sup3: '³', micro: 'µ', rarr: '→', larr: '←', laquo: '«', raquo: '»', ge: '≥', le: '≤', plusmn: '±', asymp: '≈', ne: '≠', minus: '−', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“' };
const decodificar = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z0-9]+);/gi, (m, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return ENTIDADES[e.toLowerCase()] ?? m;
  });
const semTags = (s) => s.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ' ');
const colapsar = (s) => s.replace(/[\s ]+/g, ' ').trim();
export const norm = (s) => colapsar(decodificar(semTags(String(s ?? '')))).replace(/\s+([.,;:!?)])/g, '$1').replace(/([(])\s+/g, '$1');
const palavras = (s) => norm(s).toLowerCase().match(/[\p{L}\p{N}]+(?:[.,][\p{N}]+)*/gu) ?? [];

const PARES = ['span', 'b', 'strong', 'i', 'em', 'u', 'sub', 'sup', 'p', 'ul', 'li', 'a'];
function orfaos(strings) {
  const out = [];
  for (const { onde, s } of strings) for (const tag of PARES) {
    const ab = (s.match(new RegExp(`<${tag}(\\s[^>]*)?>`, 'gi')) || []).length;
    const fe = (s.match(new RegExp(`</${tag}>`, 'gi')) || []).length;
    if (ab !== fe) out.push({ onde, tag, ab, fe, trecho: norm(s).slice(0, 70) });
  }
  return out;
}

/** Textos esperados de um bloco da fonte, na forma em que a FONTE os escreve. */
function esperadosDoBloco(b) {
  switch (b.tipo) {
    case 'titulo': return [b.numero ? `${b.numero} ${b.texto}` : b.texto];
    case 'paragrafo': return [b.html];
    case 'formula': return [b.eq];
    case 'tabela': return [...b.cabecalho, ...b.linhas.flat()];
    case 'nota': return [b.rotulo, ...b.partes.flatMap((p) => (p.tipo === 'lista' ? p.itens : [p.html]))].filter(Boolean);
    case 'tres_niveis': return [b.cabecalho, ...b.abas.flatMap((a, i) => [a, b.paineis[i]])].filter(Boolean);
    case 'lista': return b.itens.flatMap((it) => (it.etapa ? [it.etapa, it.quem, it.texto] : [it.html]));
    case 'ficha': return [b.nome, b.tipoFicha, ...b.linhas.flat()].filter(Boolean);
    case 'cadeia': return b.passos;
    default: return [];
  }
}

/** Entradas planas do .ts (o que o produto mostra), na ordem do fluxo. */
function entradasDoCorpo(lead, corpo) {
  const out = [];
  if (lead) out.push(lead);
  for (const b of corpo ?? []) {
    switch (b.kind) {
      case 'titulo': out.push(`${b.numero ?? ''} ${b.texto}`); break;
      case 'paragrafo': out.push(b.html); break;
      case 'formula': out.push(`${b.eq} ${b.desc ?? ''}`); break;
      case 'nota': out.push(`${b.label ?? ''} ${b.html}`); break;
      case 'lista': out.push(...b.itens); break;
      case 'tabela': out.push(...b.linhas.flat()); break;
      default: out.push(`?${b.kind}`);
    }
  }
  return out;
}

/** Textos estáticos de cada instrumento da seção, lidos do HTML. */
function instrumentosDaSecao(html, ini, fim) {
  const out = [];
  const re = /<div class="inst">/g;
  re.lastIndex = ini;
  let m;
  while ((m = re.exec(html)) && m.index < fim) {
    const [f] = filhos(html, m.index, fim);
    const t = f.inner;
    const um = (r) => [...t.matchAll(r)].map((x) => x[1]);
    out.push({
      id: um(/<span class="id">([\s\S]*?)<\/span>/g)[0] ?? null,
      textos: [
        ...um(/<span class="nm">([\s\S]*?)<\/span>/g).map((s) => ({ papel: 'título', s })),
        ...um(/<p class="inst-intro">([\s\S]*?)<\/p>/g).map((s) => ({ papel: 'instrução', s })),
        ...um(/<label class="field-label">([\s\S]*?)(?:<span class="unit">[\s\S]*?<\/span>)?\s*<\/label>/g).map((s) => ({ papel: 'campo', s })),
        ...um(/<div class="seg-lb">([\s\S]*?)<\/div>/g).map((s) => ({ papel: 'grupo', s })),
        ...um(/<div class="k">([\s\S]*?)<\/div>/g).map((s) => ({ papel: 'leitura', s })),
        ...um(/<p class="disc">([\s\S]*?)<\/p>/g).map((s) => ({ papel: 'aviso', s })),
      ],
      fim: f.fim,
    });
    re.lastIndex = f.fim;
  }
  return out;
}

export async function verificar({ n, faltasExplicadas = {}, instrumentosDoModulo = null, mapa = null }) {
  const NN = String(n).padStart(2, '0');
  const TS = path.join(RAIZ, `src/lib/data/alexandria-modulo-${NN}-content.ts`);
  const mod = await import(pathToFileURL(TS).href);
  const LEAD = mod[`MODULO_${NN}_LEAD`];
  const CORPO = mod[`MODULO_${NN}_CORPO`];
  const AULAS = mod[`MODULO_${NN}_AULAS`];
  // Calculadoras do módulo: a leitura que a fonte escreve como texto vai no veredito; roda no
  // cenário padrão de cada instrumento para conferir que o rótulo da fonte chega à tela.
  let CALC = {};
  try { CALC = (await import(pathToFileURL(path.join(RAIZ, `src/lib/data/calculadoras/m${NN}.ts`)).href)).CALCULADORAS ?? {}; } catch (e) { console.log(`   (calculadoras/m${NN}.ts não carregou: ${e.message.slice(0, 120)})`); }
  const vereditoPadrao = (o) => {
    const c = CALC[o.id];
    if (!c) return null;
    const ent = Object.fromEntries((o.fields ?? []).filter((f) => f.defaultValue !== '').map((f) => [f.id, f.defaultValue]));
    try { return c(ent).veredito ?? null; } catch { return null; }
  };
  const html = fs.readFileSync(FONTE(n), 'utf8');
  const aulasFonte = lerAulas(n);
  const uso = {};
  const resumo = [];
  let exit = 0;

  for (const a of aulasFonte) {
    const idAula = `aula-${NN}-${String(a.num).padStart(2, '0')}`;
    const aulaTs = AULAS.find((x) => x.id === idAula);
    const lead = LEAD[idAula];
    const corpo = CORPO[idAula] ?? [];
    const entradas = entradasDoCorpo(lead, corpo).map(norm);
    const faltas = [];

    // 0. título e lead
    if (!aulaTs) faltas.push({ grupo: 'aula', id: idAula, t: 'aula ausente em MODULO_NN_AULAS' });
    else if (norm(aulaTs.title) !== norm(editorial(a.titulo, uso))) faltas.push({ grupo: 'aula', id: `${idAula}/titulo`, t: a.titulo });
    if (a.lead && norm(lead) !== norm(editorial(a.lead, uso))) faltas.push({ grupo: 'corpo', id: `${idAula}/lead`, t: a.lead });

    // 1. ordenada
    let pos = 0;
    let esperados = 0;
    a.blocos.forEach((b, bi) => {
      for (const t of esperadosDoBloco(b)) {
        const alvo = norm(editorial(t, uso));
        if (!alvo) continue;
        esperados++;
        let i = -1;
        for (let k = pos; k < entradas.length; k++) if (entradas[k].includes(alvo)) { i = k; break; }
        if (i >= 0) { pos = i; continue; }
        const fora = entradas.some((x) => x.includes(alvo));
        faltas.push({ grupo: 'corpo', id: `${idAula}/b${bi}(${b.tipo} L${b.linha})${fora ? ' fora de ordem' : ''}`, t });
      }
    });

    // 2. palavras — da seção inteira da fonte, sem o miolo dos instrumentos e sem o sec-id
    const ini = html.lastIndexOf('<section', html.indexOf(`<b>Aula ${String(a.num).padStart(2, '0')}</b>`));
    const fim = html.indexOf('</section>', ini);
    const insts = instrumentosDaSecao(html, ini, fim);
    let secao = html.slice(ini, fim);
    for (const it of [...insts].reverse()) {
      const a0 = html.lastIndexOf('<div class="inst">', it.fim) - ini;
      secao = secao.slice(0, a0) + secao.slice(it.fim - ini);
    }
    secao = secao.replace(/<div class="sec-id">[\s\S]*?<\/div>/, '').replace(/<!--[\s\S]*?-->/g, '').replace(/<button class="lv-tab[^"]*"[^>]*>[\s\S]*?<\/button>/g, '');
    const contaTs = new Map();
    for (const w of palavras(entradas.join(' ') + ' ' + (aulaTs?.title ?? ''))) contaTs.set(w, (contaTs.get(w) ?? 0) + 1);
    const contaFonte = new Map();
    for (const w of palavras(editorial(secao, {}))) contaFonte.set(w, (contaFonte.get(w) ?? 0) + 1);
    // abas dos três níveis entram uma vez por painel no .ts (rótulo de cada nota): contadas à parte
    for (const b of a.blocos.filter((x) => x.tipo === 'tres_niveis')) for (const ab of b.abas) for (const w of palavras(ab)) contaFonte.set(w, (contaFonte.get(w) ?? 0) + 1);
    const semPalavra = [...contaFonte].filter(([w, c]) => (contaTs.get(w) ?? 0) < c).map(([w, c]) => `${w}×${c - (contaTs.get(w) ?? 0)}`);
    if (semPalavra.length) faltas.push({ grupo: 'palavras', id: `${idAula}/palavras`, t: semPalavra.join(' ') });

    // 4. instrumentos. O do §MAP (regra de 15/11: entra na Aula 01) sai da contagem da seção e é
    //    conferido contra a seção §MAP da fonte, logo abaixo.
    const doMapa = mapa && mapa.aula === a.num ? (aulaTs?.instruments ?? []).filter((o) => o.id === mapa.id) : [];
    if (mapa && mapa.aula === a.num && !doMapa.length) faltas.push({ grupo: 'instrumento', id: `${idAula}/${mapa.id}`, t: 'instrumento do §MAP ausente da aula' });
    const instTs = (aulaTs?.instruments ?? []).filter((o) => !doMapa.includes(o));
    if (doMapa.length) {
      const iniM = html.lastIndexOf('<section', html.indexOf('<b>§MAP</b>'));
      const [fm] = instrumentosDaSecao(html, iniM, html.indexOf('</section>', iniM));
      const o = doMapa[0];
      const textosTs = [o.title, o.note, ...(o.fields ?? []).flatMap((f) => [f.label, f.unit, ...(f.options ?? []).map((x) => x.label)]), ...(o.outputs ?? []).map((x) => x.label), vereditoPadrao(o)].filter(Boolean).map(norm);
      for (const { papel, s: t } of fm?.textos ?? []) {
        const alvo = norm(editorial(t, uso));
        if (alvo && !textosTs.some((x) => x.includes(alvo))) faltas.push({ grupo: 'instrumento', id: `${o.id}/${papel}`, t });
      }
    }
    if (instTs.length !== insts.length) faltas.push({ grupo: 'instrumento', id: `${idAula}/contagem`, t: `fonte ${insts.length} × produto ${instTs.length}` });
    insts.forEach((fi, k) => {
      const o = instTs[k];
      if (!o) return;
      const numero = (fi.id ?? '').match(/\d+/)?.[0];
      if (numero && !o.id.endsWith(`-${numero.padStart(2, '0')}`)) faltas.push({ grupo: 'instrumento', id: `${idAula}/${o.id}`, t: `ordem: fonte ${fi.id}` });
      const textosTs = [o.title, o.note, ...(o.fields ?? []).flatMap((f) => [f.label, f.unit, ...(f.options ?? []).map((x) => x.label)]), ...(o.outputs ?? []).map((x) => x.label), vereditoPadrao(o)]
        .filter(Boolean).map(norm);
      for (const { papel, s } of fi.textos) {
        const alvo = norm(editorial(s, uso));
        if (alvo && !textosTs.some((x) => x.includes(alvo))) faltas.push({ grupo: 'instrumento', id: `${o.id}/${papel}`, t: s });
      }
    });

    // 3. órfãos e 5. tipografia
    const strs = [];
    if (lead) strs.push({ onde: 'lead', s: lead });
    corpo.forEach((b, i) => {
      for (const s of b.kind === 'lista' ? b.itens : b.kind === 'tabela' ? b.linhas.flat() : [b.html ?? b.eq ?? b.texto, b.label ?? b.desc].filter(Boolean)) strs.push({ onde: `corpo#${i}(${b.kind})`, s });
    });
    [...instTs, ...doMapa].forEach((o) => o.note && strs.push({ onde: `${o.id}.note`, s: o.note }));
    const orf = orfaos(strs);
    const tipo = strs.filter(({ s }) => /\S\s+[,.;:!?](?!\d)/.test(s.replace(/<[^>]+>/g, '')) && !/\S\s+[,.;:!?](?!\d)/.test(html)).map(({ onde }) => onde);

    const explicadas = [];
    const reais = [];
    for (const f of faltas) {
      const k = Object.keys(faltasExplicadas).find((p) => f.id.startsWith(p));
      if (k) explicadas.push({ ...f, razao: faltasExplicadas[k] });
      else reais.push(f);
    }
    console.log(`\n══ Aula ${String(a.num).padStart(2, '0')} — ${a.titulo}  (L${a.linha})`);
    console.log(`   esperado: ${esperados} textos de bloco · ${contaFonte.size} palavras distintas · ${insts.length} instrumento(s)`);
    console.log(`   FALTA: ${reais.length}   explicadas: ${explicadas.length}   ÓRFÃO: ${orf.length}   TIPOGRAFIA: ${tipo.length}`);
    for (const f of reais) console.log(`   - [${f.grupo}] ${f.id}: «${norm(f.t).slice(0, 160)}»`);
    for (const f of explicadas) console.log(`   · explicada [${f.grupo}] ${f.id}: ${f.razao}`);
    for (const o of orf) console.log(`   ! órfão ${o.onde} <${o.tag}>: ${o.ab} abre, ${o.fe} fecha — «${o.trecho}»`);
    for (const t of tipo) console.log(`   ! espaço antes de pontuação em ${t}`);
    resumo.push({ n: a.num, esperado: esperados, falta: reais.length, explicadas: explicadas.length, orfaos: orf.length + tipo.length });
    if (reais.length || orf.length || tipo.length) exit = 1;
  }

  // Instrumento de módulo (fora de aula, §MAP): só confere que existe, como no M01 (LAB·01).
  if (instrumentosDoModulo) {
    const ok = instrumentosDoModulo(mod);
    console.log(`\n══ Instrumento de módulo (§MAP): ${ok ? 'presente' : 'AUSENTE'}`);
    if (!ok) exit = 1;
  }

  console.log('\n══ Resumo');
  console.log('   aula  esperado  FALTA  explicadas  ÓRFÃO');
  for (const r of resumo) console.log(`   ${String(r.n).padStart(4)}  ${String(r.esperado).padStart(8)}  ${String(r.falta).padStart(5)}  ${String(r.explicadas).padStart(10)}  ${String(r.orfaos).padStart(5)}`);
  console.log(`   trocas editoriais aplicadas à fonte: ${JSON.stringify(uso)}`);
  console.log(exit ? '   RESULTADO: FALHA' : '   RESULTADO: 0 falta, 0 órfão');
  return exit;
}
