// Gerador e verificador da avaliação do M04 e do M05 (exercícios por aula, prova, checklist).
// Os arquivos por módulo (gerar-avaliacao-mNN.mjs, verificar-avaliacao-mNN.mjs) só passam a
// especificação (especificacao-mNN.mjs) para cá.
//
// FONTE. Exercícios, quiz e checklist: docs/alexandria-v2/extraction/mNN/aparato.json
// (extração verificada). Texto das aulas, para âncora e evidência: a apostila que o
// produto entrega (MODULO_NN_CORPO), que verificar-porte-mNN.mjs confere palavra a palavra
// contra o HTML original.
//
// O QUE A FONTE NÃO DIZ, E COMO ISSO FICA:
//   · Nenhum Ex·NN destes módulos declara aula (todos "soltos", P9). Regra do guia de porte
//     (15/11): cada um vai para a ÚLTIMA aula cujo texto contém as âncoras da especificação
//     ("vínculo mecânico", registrado em `alertas`); sem casamento, EXERCICIOS_DO_MODULO.
//   · A fonte não traz critério por exercício (o § Ex só tem instrução) → `criterio` ausente.
//   · Itens `derivado-da-aula`: a resposta é um trecho literal da aula (evidência conferida
//     por substring). Em `escolha`, a alternativa certa está no trecho, e toda alternativa é
//     uma expressão que aparece literalmente no texto do módulo.
//
// Uso (pelos arquivos por módulo): gerar(n, ESPEC) escreve src/lib/alexandria/avaliacao/mNN.dados.ts;
// verificar(n, ESPEC) devolve o código de saída.

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

const EDITORIAIS = [
  [/GridAlpha/g, 'NIVAR'],
  [/\bBloco (\d)\b/g, (_, d) => `Módulo 0${d}`],
];
export const ed = (s) => EDITORIAIS.reduce((r, [re, por]) => r.replace(re, por), String(s ?? ''));

const ENT = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', ndash: '–', mdash: '—', times: '×', middot: '·', minus: '−', hellip: '…' };
const decodificar = (s) => s.replace(/&([a-z]+);/gi, (m, e) => ENT[e.toLowerCase()] ?? m);
export const plano = (s) => decodificar(String(s ?? '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '')).replace(/[\s ]+/g, ' ').trim();
const contem = (a, b) => plano(a).toLowerCase().includes(plano(b).toLowerCase());

// As extrações do M04 e do M05 foram feitas por extratores diferentes e nomeiam os mesmos
// campos de outro jeito. `normalizar` leva o aparato do M05 à forma do M04, sem mudar texto,
// com uma exceção declarada: no M05 o HTML do enunciado e do 1º parágrafo do gabarito começa
// com o rótulo de interface da fonte (`<span class="term">Enunciado.</span>`,
// `<span class="term">Gabarito.</span>`), que o M04 extraiu à parte (`rotulos_fonte`). O
// rótulo sai; a aula v3 tem os próprios ("Ex · NN", "Resposta-modelo").
const tiraRotulo = (s, r) =>
  String(s ?? '').replace(new RegExp(`^\\s*<span class="term">${r}</span>\\s*`), '').replace(new RegExp(`^\\s*${r}\\s*`), '');
function normalizar(ap) {
  const ex = ap.exercicios;
  ex.itens = ex.itens.map((e) => {
    if (e.resposta_referencia) return e;
    return {
      ...e,
      tag_summary: e.tag_summary ?? e.tag,
      enunciado: { html: tiraRotulo(e.enunciado.html, 'Enunciado\\.'), texto: tiraRotulo(e.enunciado.texto, 'Enunciado\\.') },
      resposta_referencia: e.resposta_de_referencia.paragrafos.map((p, k) =>
        k === 0 ? { html: tiraRotulo(p.html, 'Gabarito\\.'), texto: tiraRotulo(p.texto, 'Gabarito\\.') } : p,
      ),
      origem: e.origem ?? { linha_aprox: e.enunciado.linha_aprox ?? null },
    };
  });
  const q = ap.avaliacao;
  if (!q.questoes) q.questoes = q.perguntas;
  if (!q.lede) q.lede = q.introducao;
  if (!q.origem) q.origem = q.introducao?.origem ?? null;
  if (!Array.isArray(q.faixas_de_placar_script)) q.faixas_de_placar_script = q.faixas_de_placar_script.faixas;
  const ck = ap.checklist_final;
  if (!ck.lede) ck.lede = ck.introducao;
  return ap;
}

async function carregar(n) {
  const NN = String(n).padStart(2, '0');
  const ap = normalizar(JSON.parse(fs.readFileSync(path.join(RAIZ, `docs/alexandria-v2/extraction/m${NN}/aparato.json`), 'utf8')));
  const mod = await import(pathToFileURL(path.join(RAIZ, `src/lib/data/alexandria-modulo-${NN}-content.ts`)).href);
  const CORPO = mod[`MODULO_${NN}_CORPO`];
  const LEAD = mod[`MODULO_${NN}_LEAD`];
  const textoDaAula = (a) => {
    const id = `aula-${NN}-${String(a).padStart(2, '0')}`;
    const partes = [LEAD[id] ?? ''];
    for (const b of CORPO[id] ?? []) partes.push(b.texto ?? '', b.label ?? '', b.html ?? '', b.eq ?? '', b.desc ?? '', ...(b.itens ?? []), ...(b.linhas ?? []).flat());
    return plano(partes.join(' '));
  };
  const nAulas = Object.keys(CORPO).length;
  const textoDoModulo = Array.from({ length: nAulas }, (_, i) => textoDaAula(i + 1)).join(' ');
  return { NN, ap, textoDaAula, textoDoModulo, nAulas, arqAp: `docs/alexandria-v2/extraction/m${NN}/aparato.json` };
}

/** "acertar pelo menos 8 de 10" → [8, 10] */
const nDeM = (s) => {
  const m = plano(s).match(/(\d+)\s+de\s+(\d+)/);
  return m ? [Number(m[1]), Number(m[2])] : null;
};

// Regra do guia de porte (15/11): exercício que a fonte não prende a aula vai para a ÚLTIMA
// aula cujo texto contém todas as âncoras ("vínculo mecânico", registrado no item); sem
// casamento, fica nos exercícios do módulo (a aula v3 os mostra na última aula).
function vinculoMecanico(ctx, espec) {
  const frases = [].concat(espec?.ancora ?? []);
  const casam = [];
  for (let a = 1; a <= ctx.nAulas; a++) if (frases.length && frases.every((fr) => contem(ctx.textoDaAula(a), fr))) casam.push(a);
  const lista = frases.map((fr) => `"${fr}"`).join(' e ');
  if (!casam.length) return { aula: null, nota: `Sem vínculo: a fonte não prende este exercício a aula, e ${lista} não aparece no texto de nenhuma aula. Fica nos exercícios do módulo.` };
  const aula = casam[casam.length - 1];
  const onde = casam.length > 1 ? `aparece nas Aulas ${casam.join(', ')}; vai para a última, a ${aula}` : `aparece só na Aula ${aula}`;
  return { aula, nota: `Vínculo mecânico: a fonte não prende este exercício a aula; ${lista} ${onde}.` };
}

function construir(ctx, ESPEC) {
  const { NN, ap, arqAp } = ctx;
  const moduloId = `modulo-${NN}`;
  const exs = ap.exercicios.itens;
  const daAula = [];
  const doModulo = [];

  for (const [i, e] of exs.entries()) {
    if (!ESPEC.exercicios[e.id]) throw new Error(`${e.id} sem âncora na especificação`);
    const destino = vinculoMecanico(ctx, ESPEC.exercicios[e.id]);
    const referencia = ed(e.resposta_referencia.map((p) => p.html).join('<br><br>'));
    const item = {
      id: e.id,
      moduloId,
      aula: destino.aula ?? null,
      origem: 'fonte',
      tipo: 'aberto',
      enunciado: ed(e.enunciado.html),
      gabarito: null,
      referencia,
      contaParaCriterioDoDrill: false,
      tolerancia: null,
      verificacao: 'autoavaliacao',
      fonte: { arquivo: arqAp, campo: `exercicios.itens[${i}].enunciado.html`, linha: e.origem?.linha_aprox ?? null },
      evidencias: [
        { arquivo: arqAp, campo: `exercicios.itens[${i}].enunciado.texto`, linha: e.origem?.linha_aprox ?? null, trecho: ed(e.enunciado.texto) },
        ...e.resposta_referencia.map((p, k) => ({ arquivo: arqAp, campo: `exercicios.itens[${i}].resposta_referencia[${k}].texto`, linha: e.origem?.linha_aprox ?? null, trecho: ed(p.texto) })),
      ],
      alertas: [
        destino.nota,
        'A fonte não declara critério por exercício; o § Ex só instrui: resolva antes de abrir.',
      ],
    };
    if (destino.aula) daAula.push(item); else doModulo.push({ ...item, aula: null });
  }

  for (const d of ESPEC.derivados) {
    const base = {
      id: d.id,
      moduloId,
      aula: d.aula,
      origem: 'derivado-da-aula',
      tipo: d.tipo,
      enunciado: d.enunciado,
      contaParaCriterioDoDrill: false,
      tolerancia: null,
      fonte: { arquivo: `src/lib/data/alexandria-modulo-${NN}-content.ts`, campo: `MODULO_${NN}_CORPO['aula-${NN}-${String(d.aula).padStart(2, '0')}']`, linha: null },
      evidencias: [{ arquivo: `src/lib/data/alexandria-modulo-${NN}-content.ts`, campo: `MODULO_${NN}_CORPO['aula-${NN}-${String(d.aula).padStart(2, '0')}']`, linha: null, trecho: d.evidencia }],
    };
    if (d.tipo === 'escolha') daAula.push({ ...base, alternativas: d.alternativas, gabarito: d.gabarito, referencia: d.evidencia, verificacao: 'alternativa-correta' });
    else daAula.push({ ...base, gabarito: null, referencia: d.evidencia, verificacao: 'autoavaliacao' });
  }
  // ordem de leitura: por aula, fonte antes de derivado
  daAula.sort((a, b) => a.aula - b.aula || (a.origem === b.origem ? 0 : a.origem === 'fonte' ? -1 : 1));

  const q = ap.avaliacao;
  const criterio = plano(q.lede.html).match(/O critério[^.]*\./)?.[0];
  const [acertosMinimos, total] = nDeM(criterio);
  const faixas = ESPEC.faixas(q.faixas_de_placar_script, total);
  const prova = {
    moduloId,
    criterio,
    acertosMinimos,
    total,
    questoes: q.questoes.map((x, i) => ({
      id: x.id,
      enunciado: ed(x.enunciado),
      alternativas: x.alternativas.map((a) => ed(a.texto)),
      correta: x.gabarito.indice,
      explicacao: ed(x.explicacao),
      fonte: { arquivo: arqAp, campo: `avaliacao.questoes[${i}]`, linha: x.origem?.linha_aprox ?? null },
    })),
    faixas,
    faixasFonte: { arquivo: arqAp, campo: 'avaliacao.faixas_de_placar_script', linha: q.faixas_de_placar_script[0]?.linha_aprox ?? null },
    criterioFonte: { arquivo: arqAp, campo: 'avaliacao.lede.html', linha: q.origem?.linha_aprox ?? null },
  };

  const ck = ap.checklist_final;
  const checklist = {
    moduloId,
    introducao: ed(plano(ck.lede.html)),
    itens: ck.itens.map((x, i) => ({ id: x.id, texto: ed(plano(x.html)), fonte: { arquivo: arqAp, campo: `checklist_final.itens[${i}].html`, linha: x.origem?.linha_aprox ?? null } })),
  };
  return { daAula, doModulo, prova, checklist };
}

export async function gerar(n, ESPEC) {
  const ctx = await carregar(n);
  const { daAula, doModulo, prova, checklist } = construir(ctx, ESPEC);
  const nf = daAula.filter((x) => x.origem === 'fonte').length;
  const nd = daAula.length - nf;
  const js = (v) => JSON.stringify(v, null, 2);
  const out = `// GERADO por tools/alexandria-dados/avaliacao/gerar-avaliacao-m${ctx.NN}.mjs — não editar à mão.
// Fonte: docs/alexandria-v2/extraction/m${ctx.NN}/aparato.json (exercícios, quiz, checklist) e a apostila
// do módulo (MODULO_${ctx.NN}_CORPO, conferida contra o HTML original). Conferência:
// node tools/alexandria-dados/avaliacao/verificar-avaliacao-m${ctx.NN}.mjs
// ${daAula.length} itens por aula (${nf} da fonte, ${nd} derivados) · ${doModulo.length} sem aula · ${prova.questoes.length} questões na prova · ${checklist.itens.length} itens no checklist.
// Os ${nf} da fonte não têm aula declarada na fonte: o vínculo é do porte (ver \`alertas\` de cada um).
import type { ChecklistDoModulo, ExercicioDaAula, ExercicioDoModulo, ProvaDoModulo } from '../avaliacao';

export const EXERCICIOS_DAS_AULAS: ExercicioDaAula[] = ${js(daAula)};

export const EXERCICIOS_DO_MODULO: ExercicioDoModulo[] = ${js(doModulo)};

export const PROVAS: ProvaDoModulo[] = [${js(prova)}];

export const CHECKLISTS: ChecklistDoModulo[] = [${js(checklist)}];
`;
  fs.writeFileSync(path.join(RAIZ, `src/lib/alexandria/avaliacao/m${ctx.NN}.dados.ts`), out);
  console.log(`M${ctx.NN}: ${daAula.length} itens por aula (${nf} fonte, ${nd} derivados), ${doModulo.length} sem aula, prova ${prova.questoes.length}, checklist ${checklist.itens.length}.`);
}

// ── verificação ─────────────────────────────────────────────────────────────
export async function verificar(n, ESPEC) {
  const ctx = await carregar(n);
  const { NN, ap, textoDaAula, textoDoModulo, nAulas } = ctx;
  const dados = await import(pathToFileURL(path.join(RAIZ, `src/lib/alexandria/avaliacao/m${NN}.dados.ts`)).href);
  const falhas = [];
  const f = (s) => falhas.push(s);
  const itens = [...dados.EXERCICIOS_DAS_AULAS, ...dados.EXERCICIOS_DO_MODULO];

  // ids únicos
  const ids = itens.map((x) => x.id);
  for (const id of new Set(ids)) if (ids.filter((x) => x === id).length > 1) f(`id repetido: ${id}`);

  // 1. exercícios da fonte: cada um exatamente uma vez, literal, com âncora na aula
  for (const [i, e] of ap.exercicios.itens.entries()) {
    const achados = itens.filter((x) => x.id === e.id);
    if (achados.length !== 1) { f(`${e.id}: aparece ${achados.length} vezes`); continue; }
    const x = achados[0];
    if (x.origem !== 'fonte') f(`${e.id}: origem ${x.origem}`);
    if (plano(x.enunciado) !== plano(ed(e.enunciado.html))) f(`${e.id}: enunciado difere da fonte`);
    const ref = plano(ed(e.resposta_referencia.map((p) => p.texto).join(' ')));
    if (plano(x.referencia) !== ref) f(`${e.id}: referência difere da fonte`);
    // vínculo mecânico recalculado aqui, sem o gerador: a ÚLTIMA aula cujo texto contém todas as âncoras
    const frases = [].concat(ESPEC.exercicios[e.id].ancora);
    const casam = [];
    for (let a = 1; a <= nAulas; a++) if (frases.every((fr) => contem(textoDaAula(a), fr))) casam.push(a);
    const esperada = casam.length ? casam[casam.length - 1] : null;
    if (x.aula !== esperada) f(`${e.id}: aula ${x.aula} ≠ última aula que casa (${esperada}; casam ${casam.join(', ') || 'nenhuma'})`);
    if (!x.alertas?.some((a) => a.startsWith('Vínculo mecânico') || a.startsWith('Sem vínculo'))) f(`${e.id}: falta o registro do vínculo`);
  }
  if (ap.exercicios.itens.length !== itens.filter((x) => x.origem === 'fonte').length) f('há item "fonte" que não está na extração');

  // 2. derivados: evidência literal na própria aula; resposta na evidência; alternativas no módulo
  for (const x of itens.filter((y) => y.origem === 'derivado-da-aula')) {
    const ev = x.evidencias?.[0]?.trecho;
    if (!ev || !contem(textoDaAula(x.aula), ev)) f(`${x.id}: evidência não está no texto da Aula ${x.aula}`);
    if (x.tipo === 'escolha') {
      if (!Array.isArray(x.alternativas) || x.alternativas.length < 3) f(`${x.id}: escolha com menos de 3 alternativas`);
      if (typeof x.gabarito !== 'number' || !x.alternativas[x.gabarito]) f(`${x.id}: gabarito inválido`);
      else if (!contem(ev, x.alternativas[x.gabarito])) f(`${x.id}: a alternativa certa não está na evidência`);
      for (const [k, a] of x.alternativas.entries()) if (!contem(textoDoModulo, a)) f(`${x.id}: alternativa ${k} ("${a}") não aparece no texto do módulo`);
      const outras = x.alternativas.filter((a, k) => k !== x.gabarito && contem(ev, a) && plano(a).length > 6);
      if (outras.length) f(`${x.id}: distrator também está na evidência (${outras.join(' | ')})`);
    } else if (plano(x.referencia) !== plano(ev)) f(`${x.id}: referência ≠ evidência`);
    if (x.verificacao !== (x.tipo === 'escolha' ? 'alternativa-correta' : 'autoavaliacao')) f(`${x.id}: verificação incoerente`);
  }

  // 3. toda aula tem exercício
  for (let a = 1; a <= nAulas; a++) if (!dados.EXERCICIOS_DAS_AULAS.some((x) => x.aula === a)) f(`Aula ${a} sem exercício`);

  // 4. prova
  const q = ap.avaliacao;
  const p = dados.PROVAS[0];
  if (!p || dados.PROVAS.length !== 1) f('prova ausente ou duplicada');
  else {
    if (!contem(q.lede.html, p.criterio)) f('critério da prova não é literal do lede do § Quiz');
    const nm = nDeM(p.criterio);
    if (!nm || nm[0] !== p.acertosMinimos || nm[1] !== p.total) f('acertosMinimos/total não batem com o "N de M" do critério');
    if (p.questoes.length !== q.questoes.length || p.total !== q.questoes.length) f('número de questões ≠ fonte');
    q.questoes.forEach((x, i) => {
      const y = p.questoes[i];
      if (!y || y.id !== x.id) return f(`questão ${i + 1}: id/ordem`);
      if (plano(y.enunciado) !== plano(ed(x.enunciado))) f(`${x.id}: enunciado`);
      if (y.alternativas.length !== x.alternativas.length || y.alternativas.some((a, k) => plano(a) !== plano(ed(x.alternativas[k].texto)))) f(`${x.id}: alternativas`);
      if (y.correta !== x.gabarito.indice) f(`${x.id}: correta`);
      if (plano(y.explicacao) !== plano(ed(x.explicacao))) f(`${x.id}: explicação`);
    });
    const fx = q.faixas_de_placar_script;
    if (p.faixas.length !== fx.length) f('faixas: contagem');
    p.faixas.forEach((y, i) => { if (plano(y.mensagem) !== plano(fx[i].mensagem)) f(`faixa ${i}: mensagem não é literal`); });
    const cobertos = new Set();
    for (const y of p.faixas) for (let k = y.min; k <= y.max; k++) { if (cobertos.has(k)) f(`faixas sobrepostas em ${k}`); cobertos.add(k); }
    for (let k = 0; k <= p.total; k++) if (!cobertos.has(k)) f(`placar ${k} sem faixa`);
  }

  // 5. checklist
  const ck = ap.checklist_final;
  const c = dados.CHECKLISTS[0];
  if (!c || c.itens.length !== ck.itens.length) f('checklist: contagem ≠ fonte');
  else {
    ck.itens.forEach((x, i) => { if (plano(c.itens[i].texto) !== plano(ed(x.html))) f(`checklist ${x.id}: texto`); });
    if (plano(c.introducao) !== plano(ed(ck.lede.html))) f('checklist: introdução não é literal');
  }

  // 6. marca, órfãos
  const tudo = JSON.stringify(dados);
  if (/GridAlpha/.test(tudo)) f('GridAlpha visível');
  for (const x of itens) for (const s of [x.enunciado, x.referencia, ...(x.alternativas ?? [])]) {
    for (const tag of ['strong', 'em', 'b', 'i', 'sub', 'sup']) {
      const ab = (String(s).match(new RegExp(`<${tag}[ >]`, 'g')) || []).length;
      const fe = (String(s).match(new RegExp(`</${tag}>`, 'g')) || []).length;
      if (ab !== fe) f(`${x.id}: <${tag}> órfão`);
    }
  }

  const porAula = Array.from({ length: nAulas }, (_, i) => {
    const xs = dados.EXERCICIOS_DAS_AULAS.filter((x) => x.aula === i + 1);
    return `A${String(i + 1).padStart(2, '0')}: ${xs.filter((x) => x.origem === 'fonte').map((x) => x.id.replace(/^m\d\d-/, '')).join(', ') || '—'} + ${xs.filter((x) => x.origem !== 'fonte').length} derivados`;
  });
  console.log(`M${NN} · avaliação`);
  for (const l of porAula) console.log(`   ${l}`);
  console.log(`   prova: ${p?.questoes.length} questões, critério ${p?.acertosMinimos}/${p?.total} · checklist: ${c?.itens.length} itens`);
  for (const x of falhas) console.log(`   ✗ ${x}`);
  console.log(falhas.length ? `   RESULTADO: ${falhas.length} falha(s)` : '   RESULTADO: 0 falhas');
  return falhas.length ? 1 : 0;
}
