// Verifica o porte do texto do M02 ou do M03 (modelo: verificar-porte-m01.mjs).
//
// O que o produto entrega (importado do .ts de verdade, Node 24 tira os tipos):
// MODULO_0N_LEAD, MODULO_0N_CORPO, INSTRUMENTOS_MODULO_0N, MODULO_0N_AULAS.
//
// Contra o que confere — duas camadas, de propósito:
//   A. HTML original, bloco a bloco (aulas-html-m02-m03.mjs): lead, títulos,
//      parágrafos, fórmulas, tabelas, callouts, três níveis, cadeias, listas.
//      Ordenado: cada string esperada precisa aparecer DEPOIS da anterior.
//   B. Extração verificada (docs/alexandria-v2/extraction/m0N/), independente da
//      leitura A: os painéis de três níveis (modulo.json), e título, nota e
//      rótulos dos instrumentos (instrumentos.json).
// Comparação por substring em texto (tags fora, entidades decodificadas, espaço
// colapsado); fórmula sem espaço nenhum. As trocas editoriais decididas
// (editoriais-m02-m03.mjs) são aplicadas ao lado da fonte e contadas.
//
// Falhas: FALTA (string esperada ausente ou fora de ordem), ÓRFÃO (tag aberta
// sem fechar ou o contrário), VOCABULÁRIO (GridAlpha, War Room, Cobaia Zero,
// Summit no texto entregue — Q03), DESCONHECIDO (bloco do HTML que a leitura
// não sabe tratar). Faltas explicadas saem listadas com a razão.
//
// Uso: node tools/alexandria-dados/porte/verificar-porte-m02.mjs  (ou -m03)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { lerAulas } from './aulas-html-m02-m03.mjs';
import { EDITORIAIS } from './editoriais-m02-m03.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

const ENTIDADES = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", ndash: '–', mdash: '—', hellip: '…', times: '×', middot: '·', divide: '÷', deg: '°', sup2: '²', sup3: '³', micro: 'µ', rarr: '→', ge: '≥', le: '≤', plusmn: '±', asymp: '≈', ne: '≠' };
const decodificar = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z0-9]+);/gi, (m, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return ENTIDADES[e.toLowerCase()] ?? m;
  });
const norm = (s) => decodificar(String(s ?? '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '')).replace(/[\s ]+/g, ' ').trim();
const compacto = (s) => norm(s).replace(/\s+/g, '');

export async function verificar(n, { faltasExplicadas = {} } = {}) {
  const NN = String(n).padStart(2, '0');
  const EXT = path.join(RAIZ, `docs/alexandria-v2/extraction/m${NN}`);
  const mod = await import(pathToFileURL(path.join(RAIZ, `src/lib/data/alexandria-modulo-${NN}-content.ts`)).href);
  const LEAD = mod[`MODULO_${NN}_LEAD`];
  const CORPO = mod[`MODULO_${NN}_CORPO`];
  const INST = mod[`INSTRUMENTOS_MODULO_${NN}`];
  const AULAS = mod[`MODULO_${NN}_AULAS`];

  const uso = {};
  const editorial = (s) => {
    let r = s;
    for (const e of EDITORIAIS[n]) {
      if (e.de instanceof RegExp) { const k = (r.match(e.de) || []).length; if (k) { uso[e.id] = (uso[e.id] || 0) + k; r = r.replace(e.de, e.para); } }
      else if (r.includes(e.de)) { uso[e.id] = (uso[e.id] || 0) + 1; r = r.split(e.de).join(e.para); }
    }
    return r;
  };

  // ── o que o produto entrega, por aula ────────────────────────────────────
  const entradas = (id) => {
    const out = [];
    if (LEAD[id]) out.push({ k: 'lead', t: LEAD[id] });
    for (const b of CORPO[id] ?? []) {
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
  };

  // ── o que a fonte exige (A: HTML) ────────────────────────────────────────
  const aulasHtml = lerAulas(n);
  const esperado = (a) => {
    const exp = [];
    const L = (b) => `L${b.linha}`;
    if (a.lead) exp.push({ id: 'lead', t: a.lead });
    for (const b of a.blocos) {
      switch (b.tipo) {
        case 'titulo': exp.push({ id: `${L(b)} título`, t: `${b.numero ?? ''} ${b.texto}` }); break;
        case 'paragrafo': exp.push({ id: `${L(b)} parágrafo`, t: b.html }); break;
        case 'formula': exp.push({ id: `${L(b)} fórmula`, t: b.eq, compacto: true }); if (b.desc) exp.push({ id: `${L(b)} fórmula/desc`, t: b.desc }); break;
        case 'tabela':
          b.cabecalho.forEach((c, i) => exp.push({ id: `${L(b)} tabela/cab${i}`, t: c }));
          b.linhas.forEach((l, r) => l.forEach((c, i) => exp.push({ id: `${L(b)} tabela/l${r}c${i}`, t: c })));
          break;
        case 'nota':
          if (b.rotulo) exp.push({ id: `${L(b)} nota/rótulo`, t: b.rotulo });
          b.paragrafos.forEach((p, i) => exp.push({ id: `${L(b)} nota/p${i}`, t: p }));
          break;
        case 'tres_niveis':
          b.abas.forEach((aba, i) => { exp.push({ id: `${L(b)} três níveis/aba${i}`, t: aba }); exp.push({ id: `${L(b)} três níveis/painel${i}`, t: b.paineis[i] }); });
          break;
        case 'lista': b.itens.forEach((x, i) => exp.push({ id: `${L(b)} lista/i${i}`, t: x })); break;
        case 'cadeia': b.passos.forEach((p, i) => { exp.push({ id: `${L(b)} cadeia/${i}/tensão`, t: p.volt }); exp.push({ id: `${L(b)} cadeia/${i}/nome`, t: p.nome }); }); break;
        case 'comparacao': b.celulas.forEach((c, i) => { exp.push({ id: `${L(b)} comparação/${i}/h5`, t: c.h5 }); exp.push({ id: `${L(b)} comparação/${i}/p`, t: c.p }); }); break;
        case 'instrumento': break;
        default: exp.push({ id: `${L(b)} DESCONHECIDO <${b.tag} class="${b.classe}">`, t: `[bloco não tratado: ${b.tipo}]`, desconhecido: true });
      }
    }
    return exp;
  };

  const achaOrdenado = (ents, exp) => {
    let pos = 0; const faltas = []; let achados = 0;
    for (const e of exp) {
      const alvo = e.compacto ? compacto(editorial(e.t)) : norm(editorial(e.t));
      if (!alvo) continue;
      const cmp = (x) => (e.compacto ? compacto(x.t) : norm(x.t));
      let i = -1;
      for (let k = pos; k < ents.length; k++) if (cmp(ents[k]).includes(alvo)) { i = k; break; }
      if (i >= 0) { pos = i; achados++; continue; }
      faltas.push({ ...e, foraDeOrdem: ents.some((x) => cmp(x).includes(alvo)) });
    }
    return { faltas, achados };
  };

  const PARES = ['span', 'b', 'strong', 'i', 'em', 'u', 'sub', 'sup', 'p', 'ul', 'li'];
  const orfaos = (strs) => {
    const r = [];
    for (const { onde, s } of strs) for (const tag of PARES) {
      const ab = (s.match(new RegExp(`<${tag}(\\s[^>]*)?>`, 'gi')) || []).length;
      const fe = (s.match(new RegExp(`</${tag}>`, 'gi')) || []).length;
      if (ab !== fe) r.push({ onde, tag, ab, fe, trecho: norm(s).slice(0, 70) });
    }
    return r;
  };
  const VOCAB = /GridAlpha|War Room|Cobaia Zero|Summit/;

  // ── B: extração verificada ───────────────────────────────────────────────
  const modJson = JSON.parse(fs.readFileSync(path.join(EXT, 'modulo.json'), 'utf8'));
  const instJson = JSON.parse(fs.readFileSync(path.join(EXT, 'instrumentos.json'), 'utf8'));
  const tres = n === 2
    ? modJson.tradutor.tres_niveis.map((t) => ({ aula: Number(t.aula.replace(/\D/g, '')), paineis: t.niveis.map((x) => ({ nivel: x.nivel, html: x.html })) }))
    : modJson.tres_niveis.map((t) => ({ aula: Number(t.aula), paineis: t.paineis.map((x) => ({ nivel: x.publico, html: x.html })) }));

  const resumo = []; let falhou = false;
  for (const a of aulasHtml) {
    const id = `aula-${NN}-${String(a.num).padStart(2, '0')}`;
    const ents = entradas(id);
    const exp = esperado(a);
    const { faltas, achados } = achaOrdenado(ents, exp);

    // B1: três níveis da extração, na aula certa, rótulo = nível
    const faltasB = [];
    const notas = (CORPO[id] ?? []).filter((b) => b.kind === 'nota');
    for (const t of tres.filter((x) => x.aula === a.num)) for (const p of t.paineis) {
      const alvo = norm(editorial(p.html));
      if (!notas.some((b) => norm(b.label) === norm(p.nivel) && norm(b.html).includes(alvo))) faltasB.push({ id: `extração três níveis/${p.nivel}`, t: p.html });
    }
    // B2: instrumentos da aula contra instrumentos.json
    const aulaObj = AULAS.find((x) => x.id === id);
    const instIds = (aulaObj?.instruments ?? []).map((x) => x.id);
    const instFonte = instJson.instrumentos.filter((x) => Number(String(x.aula?.marcador ?? x.aula).replace(/\D/g, '')) === a.num);
    for (const f of instFonte) {
      const obj = INST.find((x) => x.id === f.id);
      if (!obj) { faltasB.push({ id: `instrumento ${f.id} ausente`, t: f.titulo }); continue; }
      if (!instIds.includes(f.id)) faltasB.push({ id: `instrumento ${f.id} fora da aula`, t: f.titulo });
      const textos = [obj.title, obj.note, ...obj.fields.map((x) => x.label), ...obj.fields.flatMap((x) => (x.options ?? []).map((o) => o.label)), ...obj.outputs.map((x) => x.label)].filter(Boolean).map((s) => norm(s));
      const nota = f.nota_do_instrumento ?? f.nota_instrumento;
      const pedidos = [
        { id: 'título', t: f.titulo },
        ...(nota?.html ? [{ id: 'nota', t: nota.html }] : []),
        ...(f.entradas ?? []).flatMap((e) => [
          ...(e.rotulo ? [{ id: `entrada ${e.id}`, t: e.rotulo }] : []),
          ...(e.opcoes ?? []).map((o) => ({ id: `opção ${e.id}=${o.valor}`, t: o.rotulo })),
        ]),
        ...(f.saidas ?? []).filter((s) => s.rotulo).map((s) => ({ id: `saída ${s.id}`, t: s.rotulo })),
      ];
      for (const p of pedidos) {
        const alvo = norm(editorial(p.t));
        if (alvo && !textos.some((x) => x.includes(alvo))) faltasB.push({ id: `${f.id} ${p.id}`, t: p.t });
      }
    }

    const todas = [...faltas.map((f) => ({ ...f, grupo: 'html' })), ...faltasB.map((f) => ({ ...f, grupo: 'extração' }))];
    const explicadas = []; const reais = [];
    for (const f of todas) {
      const k = Object.keys(faltasExplicadas).find((x) => `${id} ${f.id}`.startsWith(x));
      if (k) explicadas.push({ ...f, razao: faltasExplicadas[k] }); else reais.push(f);
    }

    const strs = ents.map((e, i) => ({ onde: `${id}#${i}(${e.k})`, s: e.t }));
    for (const x of INST.filter((y) => instIds.includes(y.id))) if (x.note) strs.push({ onde: `${x.id}.note`, s: x.note });
    const orf = orfaos(strs);
    const vocab = strs.filter((x) => VOCAB.test(norm(x.s))).map((x) => ({ onde: x.onde, trecho: norm(x.s).match(new RegExp(`.{0,40}(${VOCAB.source}).{0,30}`))?.[0] }));
    const desconhecidos = exp.filter((e) => e.desconhecido).length + ents.filter((e) => e.k.startsWith('?')).length;

    console.log(`\n══ Aula ${String(a.num).padStart(2, '0')} — ${a.marcador}`);
    console.log(`   esperado: html ${exp.length} (achados ${achados}) · extração ${faltasB.length ? 'com faltas' : 'ok'}   |   FALTA ${reais.length} · explicadas ${explicadas.length} · ÓRFÃO ${orf.length} · VOCABULÁRIO ${vocab.length}${desconhecidos ? ` · DESCONHECIDO ${desconhecidos}` : ''}`);
    for (const f of reais) console.log(`   - [${f.grupo}] ${f.id}${f.foraDeOrdem ? ' (existe, fora de ordem)' : ''}: «${norm(f.t).slice(0, 110)}»`);
    for (const f of explicadas) console.log(`   · explicada [${f.grupo}] ${f.id}: ${f.razao}`);
    for (const o of orf) console.log(`   ! órfão ${o.onde} <${o.tag}>: ${o.ab} abre, ${o.fe} fecha — «${o.trecho}»`);
    for (const v of vocab) console.log(`   ! vocabulário interno em ${v.onde}: «${v.trecho}»`);
    resumo.push({ n: a.num, esperado: exp.length, falta: reais.length, explicadas: explicadas.length, orfaos: orf.length, vocab: vocab.length });
    if (reais.length || orf.length || vocab.length || desconhecidos) falhou = true;
  }

  console.log('\n══ Resumo');
  console.log('   aula  esperado  FALTA  explicadas  ÓRFÃO  VOCAB');
  for (const r of resumo) console.log(`   ${String(r.n).padStart(4)}  ${String(r.esperado).padStart(8)}  ${String(r.falta).padStart(5)}  ${String(r.explicadas).padStart(10)}  ${String(r.orfaos).padStart(5)}  ${String(r.vocab).padStart(5)}`);
  const tot = (k) => resumo.reduce((s, r) => s + r[k], 0);
  console.log(`   total ${String(tot('esperado')).padStart(8)}  ${String(tot('falta')).padStart(5)}  ${String(tot('explicadas')).padStart(10)}  ${String(tot('orfaos')).padStart(5)}  ${String(tot('vocab')).padStart(5)}`);
  console.log(`   aulas no HTML: ${aulasHtml.length} · painéis de três níveis na extração: ${tres.reduce((s, t) => s + t.paineis.length, 0)}`);
  console.log(`   trocas editoriais aplicadas ao lado da fonte: ${JSON.stringify(uso)}`);
  console.log(falhou ? '   RESULTADO: FALHA' : '   RESULTADO: 0 falta, 0 órfão');
  return falhou ? 1 : 0;
}
