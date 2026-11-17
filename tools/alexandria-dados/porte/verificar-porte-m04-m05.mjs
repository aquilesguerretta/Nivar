// Verifica o porte de um módulo (M04 ou M05) contra o HTML original. Chamado por
// verificar-porte-m04.mjs e verificar-porte-m05.mjs.
//
// Duas medidas independentes, e as duas precisam fechar:
//
//   1. BLOCO A BLOCO. Cada bloco que `fonte-html-m04-m05.mjs` lê da seção da aula
//      (título, parágrafo, nota, três níveis, tabela, lista, fórmula) precisa aparecer,
//      em texto normalizado, no que o produto entrega (MODULO_NN_LEAD + MODULO_NN_CORPO),
//      na ordem da fonte. FALTA = string da fonte que não aparece (ou fora de ordem).
//
//   2. PALAVRA A PALAVRA, sem o leitor acima. A seção crua (`<section id="aNN">` …
//      `</section>`, recortada por texto, sem parser) perde o instrumento, o sec-id e o h2;
//      as tags saem; sobra a sequência de palavras. A apostila do produto vira a mesma
//      sequência. Um alinhamento (LCS) mede quantas palavras da fonte não estão no produto
//      e quantas do produto não estão na fonte. Só são aceitas, e listadas, as diferenças
//      declaradas: trocas editoriais e o cabeçalho do três-níveis repetido em cada aba.
//
// Mais: ÓRFÃO (tag aberta sem fechar, ou o contrário), DANO tipográfico (espaço antes de
// pontuação, entidade não decodificada) e marca/vocabulário interno visível (GridAlpha,
// War Room, Cobaia Zero, Summit). E o instrumento de cada aula: título, rótulos e unidades
// dos campos e das saídas numéricas, intro e disclaimer na nota.
//
// Sai com 1 se houver falta, órfão, dano ou marca.

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { aulasDaFonte, instrumentosDaFonte, editorial, RAIZ } from './fonte-html-m04-m05.mjs';
import { arquivoHtml } from '../mini-dom.mjs';

const ENT = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", ndash: '–', mdash: '—', hellip: '…', times: '×', middot: '·', divide: '÷', deg: '°', sup2: '²', sup3: '³', micro: 'µ', rarr: '→', larr: '←', laquo: '«', raquo: '»', ge: '≥', le: '≤', plusmn: '±', asymp: '≈', ne: '≠', minus: '−', ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', bull: '•', uarr: '↑', darr: '↓' };
const decodificar = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z0-9]+);/gi, (m, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return ENT[e.toLowerCase()] ?? m;
  });
const semTags = (s) => s.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ' ');
const norm = (s) => decodificar(semTags(String(s ?? ''))).replace(/[\s ]+/g, ' ').trim();
const palavras = (s) => norm(s).replace(/([.,;:!?)(»«“”"—–·×=+÷≈−±/])/g, ' $1 ').split(' ').filter(Boolean);

// Recorta um elemento pelo texto cru, contando aberturas e fechamentos da mesma tag.
function recortaElemento(html, ini, tag) {
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'gi');
  re.lastIndex = ini;
  let prof = 0;
  let m;
  while ((m = re.exec(html))) {
    prof += m[1] ? -1 : 1;
    if (prof === 0) return re.lastIndex;
  }
  throw new Error(`elemento <${tag}> sem fechamento em ${ini}`);
}

function secaoCrua(html, id) {
  const ini = html.indexOf(`<section id="${id}"`);
  const fim = html.indexOf('</section>', ini);
  let s = html.slice(ini, fim);
  // fora: instrumento (vai para INSTRUMENTOS_MODULO_NN), sec-id e h2 (vão para a aula)
  for (;;) {
    const i = s.indexOf('<div class="inst">');
    if (i < 0) break;
    s = s.slice(0, i) + s.slice(recortaElemento(s, i, 'div'));
  }
  s = s.replace(/<div class="sec-id">[\s\S]*?<\/div>/, ' ').replace(/<h2>[\s\S]*?<\/h2>/, ' ');
  s = s.replace(/<!--[\s\S]*?-->/g, ' ');
  return s;
}

function lcs(a, b) {
  const n = a.length;
  const m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const soA = []; const soB = [];
  let i = 0; let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) soA.push({ i, w: a[i++] }); else soB.push({ j, w: b[j++] });
  }
  while (i < n) soA.push({ i, w: a[i++] });
  while (j < m) soB.push({ j, w: b[j++] });
  return { soA, soB };
}

// Agrupa índices contíguos em trechos legíveis.
function trechos(lista, seq) {
  const out = [];
  for (const x of lista) {
    const k = x.i ?? x.j;
    const ult = out[out.length - 1];
    if (ult && k === ult.fim + 1) { ult.fim = k; ult.ws.push(x.w); } else out.push({ ini: k, fim: k, ws: [x.w] });
  }
  return out.map((t) => ({ ...t, texto: t.ws.join(' '), contexto: seq.slice(Math.max(0, t.ini - 4), t.fim + 5).join(' ') }));
}

const PARES = ['span', 'b', 'strong', 'i', 'em', 'u', 'sub', 'sup', 'p', 'ul', 'ol', 'li', 'a'];
function orfaos(onde, s) {
  const r = [];
  for (const tag of PARES) {
    const ab = (s.match(new RegExp(`<${tag}(\\s[^>]*)?>`, 'gi')) || []).length;
    const fe = (s.match(new RegExp(`</${tag}>`, 'gi')) || []).length;
    if (ab !== fe) r.push(`${onde} <${tag}>: ${ab} abre, ${fe} fecha — «${norm(s).slice(0, 70)}»`);
  }
  return r;
}
function danos(onde, s) {
  const r = [];
  // aqui as tags saem SEM espaço: "<em>reverso</em>," não pode virar "reverso ,"
  const t = decodificar(String(s ?? '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '')).replace(/[\s ]+/g, ' ').trim();
  const m1 = t.match(/\S\s[.,;:!?](?:\s|$)/g);
  if (m1) r.push(`${onde}: espaço antes de pontuação (${m1.join(' | ')}) — «${t.slice(0, 70)}»`);
  if (/&[a-z]+;/i.test(String(s).replace(/&(amp|lt|gt);/g, ''))) r.push(`${onde}: entidade não decodificada — «${t.slice(0, 70)}»`);
  if (/GridAlpha|War Room|Cobaia Zero|Summit/i.test(t)) r.push(`${onde}: marca ou vocabulário interno visível — «${t.slice(0, 90)}»`);
  return r;
}

export async function verificarPorte(n, { faltasExplicadas = {}, so = null } = {}) {
  const NN = String(n).padStart(2, '0');
  const mod = await import(pathToFileURL(path.join(RAIZ, `src/lib/data/alexandria-modulo-${NN}-content.ts`)).href);
  const LEAD = mod[`MODULO_${NN}_LEAD`];
  const CORPO = mod[`MODULO_${NN}_CORPO`];
  const INST = mod[`INSTRUMENTOS_MODULO_${NN}`];
  const AULAS = mod[`MODULO_${NN}_AULAS`];
  const html = fs.readFileSync(arquivoHtml(n), 'utf8');
  const fonte = aulasDaFonte(n);
  const instFonte = instrumentosDaFonte(n);
  const uso = {};
  let exit = 0;
  const resumo = [];

  for (const a of fonte) {
    if (so && a.numero !== so) continue;
    const idAula = `aula-${NN}-${String(a.numero).padStart(2, '0')}`;
    const blocos = CORPO[idAula] ?? [];
    const lead = LEAD[idAula];
    const aula = AULAS.find((x) => x.id === idAula);

    // entradas do produto, na ordem do fluxo
    const ent = [];
    if (lead) ent.push(lead);
    for (const b of blocos) {
      if (b.kind === 'titulo') ent.push(`${b.numero ?? ''} ${b.texto}`);
      else if (b.kind === 'paragrafo') ent.push(b.html);
      else if (b.kind === 'nota') { if (b.label) ent.push(b.label); ent.push(b.html); }
      else if (b.kind === 'formula') { ent.push(b.eq); if (b.desc) ent.push(b.desc); }
      else if (b.kind === 'lista') ent.push(...b.itens);
      else if (b.kind === 'tabela') ent.push(...b.linhas.flat());
      else ent.push(`?${b.kind}`);
    }
    const entN = ent.map(norm);

    // 1 · bloco a bloco
    const esp = [];
    if (a.lead) esp.push({ id: 'lead', t: a.lead });
    for (const b of a.blocos) {
      const id = `L${b.linha}`;
      if (b.tipo === 'titulo') esp.push({ id, t: `${b.numero ?? ''} ${b.texto}` });
      else if (b.tipo === 'paragrafo') esp.push({ id, t: b.html });
      else if (b.tipo === 'nota') { if (b.label) esp.push({ id: `${id}/rotulo`, t: b.label }); b.paragrafos.forEach((p, i) => esp.push({ id: `${id}/p${i}`, t: p })); }
      else if (b.tipo === 'tres_niveis') { esp.push({ id: `${id}/cab`, t: b.cabecalho }); b.abas.forEach((x, i) => { esp.push({ id: `${id}/aba${i}`, t: x.rotulo }); esp.push({ id: `${id}/painel${i}`, t: x.html }); }); }
      else if (b.tipo === 'tabela') b.linhas.forEach((l, r) => l.forEach((c, k) => esp.push({ id: `${id}/l${r}c${k}`, t: c })));
      else if (b.tipo === 'lista') b.itens.forEach((it, i) => esp.push({ id: `${id}/i${i}`, t: it }));
      else if (b.tipo === 'formula') { esp.push({ id: `${id}/eq`, t: b.eq }); if (b.desc) esp.push({ id: `${id}/desc`, t: b.desc }); }
    }
    const faltas = [];
    let pos = 0;
    for (const e of esp) {
      const alvo = norm(editorial(e.t, uso));
      if (!alvo) continue;
      let k = -1;
      for (let x = pos; x < entN.length; x++) if (entN[x].includes(alvo)) { k = x; break; }
      if (k >= 0) { pos = k; continue; }
      faltas.push({ ...e, fora: entN.some((x) => x.includes(alvo)) });
    }

    // 2 · palavra a palavra (seção crua × apostila)
    const cru = palavras(editorial(secaoCrua(html, a.id), {}));
    const prod = palavras(ent.join(' '));
    const { soA, soB } = lcs(cru, prod);
    // o três-níveis: a fonte escreve as três abas juntas antes dos painéis; o produto escreve
    // "cabeçalho · aba" antes de cada painel. Essas palavras podem sobrar dos dois lados.
    const cabecalhos = new Set(a.blocos.filter((b) => b.tipo === 'tres_niveis').flatMap((b) => [...palavras(b.cabecalho), ...b.abas.flatMap((x) => palavras(x.rotulo)), '·']));
    const soFonte = trechos(soA, cru).filter((t) => !t.ws.every((w) => cabecalhos.has(w)));
    // no produto, só pode sobrar o cabeçalho do três-níveis (repetido nas abas)
    const soProduto = trechos(soB, prod).filter((t) => !t.ws.every((w) => cabecalhos.has(w)));

    // órfãos e danos
    const problemas = [];
    ent.forEach((s, i) => { problemas.push(...orfaos(`entrada#${i}`, s), ...danos(`entrada#${i}`, s)); });

    // instrumento da aula
    const faltasInst = [];
    const instIds = (aula?.instruments ?? []).map((x) => (typeof x === 'string' ? x : x.id));
    const blocoInst = a.blocos.find((b) => b.tipo === 'instrumento');
    if (blocoInst) {
      const f = instFonte[blocoInst.ordem - 1];
      const ip = INST.find((x) => instIds.includes(x.id));
      if (!ip) faltasInst.push(`instrumento ${blocoInst.ordem} ausente da aula`);
      else {
        const ed = (s) => norm(editorial(s, uso));
        if (norm(ip.title) !== ed(f.titulo)) faltasInst.push(`título: «${ip.title}» ≠ fonte «${f.titulo}»`);
        const nota = norm(ip.note ?? '');
        if (f.intro && !nota.includes(ed(f.intro))) faltasInst.push(`intro fora da nota: «${norm(f.intro).slice(0, 60)}»`);
        if (f.disc && !nota.includes(ed(f.disc))) faltasInst.push(`disclaimer fora da nota: «${norm(f.disc).slice(0, 60)}»`);
        for (const c of f.campos) {
          // Na fonte, cada campo é um par: <input type="number" id="X-n"> e <input type="range" id="X">.
          // Os dois são ids da fonte; o produto usa um deles (o M04, o número; o M05, o range que o script lê).
          const idsDaFonte = [c.id, c.id.replace(/-n$/, '')];
          const pc = ip.fields.find((x) => idsDaFonte.includes(x.id)) ?? ip.fields.find((x) => norm(x.label) === ed(c.rotulo));
          if (!pc) { faltasInst.push(`campo «${c.rotulo}» (${c.id}) ausente`); continue; }
          if (norm(pc.label) !== ed(c.rotulo)) faltasInst.push(`campo ${c.id}: rótulo «${pc.label}» ≠ «${c.rotulo}»`);
          if ((pc.unit ?? null) !== (c.unidade ?? null)) faltasInst.push(`campo ${c.id}: unidade «${pc.unit}» ≠ fonte «${c.unidade}»`);
          if (!idsDaFonte.includes(pc.id)) faltasInst.push(`campo «${c.rotulo}»: id ${pc.id} não é id da fonte (${idsDaFonte.join(' / ')})`);
        }
        for (const s of f.saidas) {
          const po = ip.outputs.find((x) => x.id === s.id);
          const declarada = faltasExplicadas[`saida:${s.id}`];
          if (!po) { if (!declarada) faltasInst.push(`saída «${s.rotulo}» (${s.id}) ausente`); continue; }
          if (norm(po.label) !== ed(s.rotulo)) faltasInst.push(`saída ${s.id}: rótulo «${po.label}» ≠ «${s.rotulo}»`);
          if (!po.unit && !faltasExplicadas[`unidade:${s.id}`]) faltasInst.push(`saída ${s.id} («${s.rotulo}») sem unidade`);
        }
        problemas.push(...orfaos(`${ip.id}.note`, ip.note ?? ''), ...danos(`${ip.id}.note`, ip.note ?? ''));
      }
    }

    const explicadas = [];
    const reais = [];
    for (const f of faltas) {
      const k = Object.keys(faltasExplicadas).find((x) => `${idAula}:${f.id}`.startsWith(x));
      (k ? explicadas : reais).push({ ...f, razao: k ? faltasExplicadas[k] : null });
    }
    const falha = reais.length + soFonte.length + soProduto.length + faltasInst.length + problemas.length;
    if (falha) exit = 1;
    console.log(`\n══ ${idAula} — ${a.titulo}`);
    console.log(`   bloco a bloco: ${esp.length - faltas.length}/${esp.length} · palavras: fonte ${cru.length}, produto ${prod.length}, só na fonte ${soA.length}, só no produto ${soB.length} (cabeçalho de três-níveis: ${soB.length - soProduto.reduce((s, t) => s + t.ws.length, 0)})`);
    for (const f of reais) console.log(`   - FALTA ${f.id}${f.fora ? ' (existe fora de ordem)' : ''}: «${norm(f.t).slice(0, 100)}»`);
    for (const f of explicadas) console.log(`   · explicada ${f.id}: ${f.razao}`);
    for (const t of soFonte) console.log(`   - SÓ NA FONTE: «${t.texto}» … ${t.contexto}`);
    for (const t of soProduto) console.log(`   - SÓ NO PRODUTO: «${t.texto}» … ${t.contexto}`);
    for (const f of faltasInst) console.log(`   - INSTRUMENTO: ${f}`);
    for (const p of problemas) console.log(`   ! ${p}`);
    resumo.push({ aula: idAula, esperado: esp.length, falta: reais.length, palavras: soFonte.length + soProduto.length, inst: faltasInst.length, problemas: problemas.length });
  }

  console.log('\n══ Resumo');
  console.log('   aula         esperado  FALTA  PALAVRA  INST  ÓRFÃO/DANO');
  for (const r of resumo) console.log(`   ${r.aula}  ${String(r.esperado).padStart(8)}  ${String(r.falta).padStart(5)}  ${String(r.palavras).padStart(7)}  ${String(r.inst).padStart(4)}  ${String(r.problemas).padStart(10)}`);
  if (Object.keys(uso).length) console.log(`   trocas editoriais aplicadas ao lado da fonte: ${JSON.stringify(uso)}`);
  const decl = Object.entries(faltasExplicadas);
  if (decl.length) { console.log('   declaradas:'); for (const [k, v] of decl) console.log(`     ${k}: ${v}`); }
  console.log(exit ? '   RESULTADO: FALHA' : '   RESULTADO: 0 falta, 0 órfão');
  return exit;
}
