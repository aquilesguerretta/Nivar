// Confere src/lib/alexandria/avaliacao/mNN.dados.ts (M16, M17) contra a extração e o
// texto das aulas. Modelo: tools/alexandria-dados/verificar-avaliacao.mjs (M01).
//
//   A. todo trecho citado por item derivado existe, literal, no texto da aula dele;
//   B. itens da fonte, prova e checklist são iguais à extração (com a troca P24);
//   C. escolha: a alternativa certa está no trecho da aula; cada distrator aparece no
//      texto das aulas do módulo (como no M01);
//   D. todo exercício cujo enunciado repete o cenário-padrão de um instrumento com
//      previsão tem alerta, e a previsão espera a tentativa dele (abreDepoisDoExercicio);
//   E. ≥ 2 itens por aula, ids únicos, prova N × 4 com faixas cobrindo 0..N sem buraco,
//      tolerância nula em tudo, nenhuma ocorrência de "Demonstrado";
//   F. checklist igual à extração.
//
// Uso: node tools/alexandria-dados/avaliacao/verificar-avaliacao-m16-m17.mjs 16
// Sai com 1 se houver falha.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const n = Number(process.argv[2] ?? 16);
const NN = String(n).padStart(2, '0');
const MOD = `modulo-${NN}`;

const dados = await import(pathToFileURL(path.join(RAIZ, `src/lib/alexandria/avaliacao/m${NN}.dados.ts`)).href);
const conteudo = await import(pathToFileURL(path.join(RAIZ, `src/lib/data/alexandria-modulo-${NN}-content.ts`)).href);
const modV3 = await import(pathToFileURL(path.join(RAIZ, `src/lib/alexandria/modulos-v3/m${NN}.ts`)).href);
const ap = JSON.parse(fs.readFileSync(path.join(RAIZ, `docs/alexandria-v2/extraction/m${NN}/aparato.json`), 'utf8'));

const P24 = (s) => String(s).replace(/GridAlpha/g, 'NIVAR');
const plano = (h) => String(h ?? '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/[\s ]+/g, ' ').trim();
const baixo = (s) => plano(s).toLowerCase().replace(/[.!?:;]+$/, '');

const LEAD = conteudo[`MODULO_${NN}_LEAD`];
const CORPO = conteudo[`MODULO_${NN}_CORPO`];
const AULAS = conteudo[`MODULO_${NN}_AULAS`];
const INSTS = conteudo[`INSTRUMENTOS_MODULO_${NN}`] ?? [];
const textoDaAula = (k) => {
  const id = `aula-${NN}-${String(k).padStart(2, '0')}`;
  const partes = [LEAD[id] ?? ''];
  for (const b of CORPO[id] ?? []) {
    partes.push(
      b.kind === 'titulo' ? `${b.numero ?? ''} ${b.texto}` :
      b.kind === 'formula' ? `${b.eq} ${b.desc ?? ''}` :
      b.kind === 'lista' ? b.itens.join(' ') :
      b.kind === 'tabela' ? b.linhas.flat().join(' ') :
      b.kind === 'nota' ? `${b.label ?? ''} ${b.html}` : b.html,
    );
  }
  return partes.map(plano).join(' ');
};
const TEXTO_DO_MODULO = AULAS.map((a) => textoDaAula(a.number)).join(' ').toLowerCase();

const falhas = [];
const falha = (m) => falhas.push(m);
const itens = dados.EXERCICIOS_DAS_AULAS;

// E — estrutura
const ids = new Set();
for (const it of itens) {
  if (ids.has(it.id)) falha(`id repetido: ${it.id}`);
  ids.add(it.id);
  if (it.moduloId !== MOD) falha(`${it.id}: moduloId ${it.moduloId}`);
  if (it.tolerancia !== null) falha(`${it.id}: tolerância não nula`);
  if (/Demonstrad/i.test(JSON.stringify(it))) falha(`${it.id}: usa "Demonstrado"`);
}
for (const a of AULAS) {
  const k = itens.filter((i) => i.aula === a.number).length;
  if (k < 2) falha(`Aula ${a.number}: só ${k} item(ns)`);
}

// B — itens da fonte
const exFonte = ap.exercicios?.itens ?? [];
for (const ex of exFonte) {
  const it = itens.find((i) => i.id === ex.id) ?? (dados.EXERCICIOS_DO_MODULO ?? []).find((i) => i.id === ex.id);
  if (!it) { falha(`${ex.id}: exercício da fonte ausente`); continue; }
  if (it.origem !== 'fonte') falha(`${ex.id}: origem ${it.origem}`);
  if (plano(it.enunciado) !== plano(P24(ex.enunciado?.html ?? ex.enunciado_html))) falha(`${ex.id}: enunciado difere da extração`);
  if (plano(it.referencia) !== plano(P24(ex.resposta_de_referencia?.html ?? ex.resposta_referencia_html))) falha(`${ex.id}: referência difere da extração`);
}
const nFonte = itens.filter((i) => i.origem === 'fonte').length + (dados.EXERCICIOS_DO_MODULO ?? []).length;
if (nFonte !== exFonte.length) falha(`itens da fonte: ${nFonte} × extração ${exFonte.length}`);

// A, C — derivados
for (const it of itens.filter((i) => i.origem === 'derivado-da-aula')) {
  const aula = textoDaAula(it.aula);
  for (const ev of it.evidencias) if (!aula.includes(plano(ev.trecho))) falha(`${it.id}: trecho não está na Aula ${it.aula}: «${ev.trecho.slice(0, 70)}»`);
  if (plano(it.referencia) !== plano(it.evidencias[0]?.trecho)) falha(`${it.id}: referência ≠ trecho citado`);
  if (it.tipo === 'escolha') {
    const ev = it.evidencias.map((e) => e.trecho).join(' ').toLowerCase();
    const alts = it.alternativas ?? [];
    if (typeof it.gabarito !== 'number' || !alts[it.gabarito]) { falha(`${it.id}: gabarito inválido`); continue; }
    if (!ev.includes(baixo(alts[it.gabarito]))) falha(`${it.id}: a alternativa certa «${alts[it.gabarito]}» não está no trecho`);
    alts.forEach((a, i) => {
      if (i === it.gabarito) return;
      if (!TEXTO_DO_MODULO.includes(baixo(a))) falha(`${it.id}: distrator «${a}» não aparece nas aulas do módulo`);
    });
  } else if (it.gabarito !== null) falha(`${it.id}: aberto com gabarito`);
}

// D — cenário de instrumento × exercício
const fmtBr = (v) => [0, 1, 2, 3].map((d) => Number(v).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }));
for (const pv of modV3.MODULO_V3.previsoes) {
  const inst = INSTS.find((x) => x.id === pv.instrumentoId);
  if (!inst) { falha(`previsão de ${pv.instrumentoId}: instrumento ausente`); continue; }
  const numeros = Object.values(pv.cenario).filter((v) => typeof v === 'number' && v !== 0);
  for (const it of itens.filter((i) => i.origem === 'fonte')) {
    const t = plano(it.enunciado);
    const todos = numeros.length >= 2 && numeros.every((v) => fmtBr(v).some((s) => new RegExp(`(^|[^\\d,.])${s.replace(/\./g, '\\.')}([^\\d]|$)`).test(t)));
    if (todos && !(it.alertas ?? []).filter((a) => a.includes('INST')).length) falha(`${it.id}: repete o cenário da previsão de ${pv.instrumentoId} sem alerta`);
  }
  if (pv.abreDepoisDoExercicio) {
    const alvo = itens.find((i) => i.id === pv.abreDepoisDoExercicio);
    if (!alvo) falha(`previsão de ${pv.instrumentoId}: abreDepoisDoExercicio ${pv.abreDepoisDoExercicio} não existe`);
    else if (!(alvo.alertas ?? []).some((a) => a.includes('INST'))) falha(`${alvo.id}: a previsão de ${pv.instrumentoId} espera por ele, mas ele não tem alerta`);
    const instDaAula = AULAS.find((a) => a.number === alvo?.aula)?.instruments?.map((x) => x.id) ?? [];
    if (alvo && !instDaAula.includes(pv.instrumentoId)) falha(`${alvo.id} está na Aula ${alvo.aula}, que não tem ${pv.instrumentoId}`);
  }
}
for (const it of itens.filter((i) => (i.alertas ?? []).some((a) => a.includes('INST')))) {
  if (!modV3.MODULO_V3.previsoes.some((p) => p.abreDepoisDoExercicio === it.id)) falha(`${it.id}: tem alerta, mas nenhuma previsão espera por ele`);
}


// G — vínculo mecânico dos exercícios da fonte, recalculado: as âncoras citadas na nota
// estão no enunciado, e a aula é a ÚLTIMA cujo texto contém todas (sem casamento: módulo).
for (const it of [...itens, ...(dados.EXERCICIOS_DO_MODULO ?? [])].filter((i) => i.origem === 'fonte')) {
  const nota = (it.alertas ?? []).find((a) => /^(Vínculo mecânico|Sem vínculo)/.test(a));
  if (!nota) { falha(`${it.id}: sem registro do vínculo mecânico`); continue; }
  const ancoras = [...nota.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  for (const f of ancoras) if (!plano(it.enunciado).toLowerCase().includes(f.toLowerCase())) falha(`${it.id}: âncora "${f}" não está no enunciado`);
  const casam = AULAS.map((a) => a.number).filter((k) => ancoras.length && ancoras.every((f) => textoDaAula(k).toLowerCase().includes(f.toLowerCase())));
  const esperado = casam.length ? casam[casam.length - 1] : null;
  if ((it.aula ?? null) !== esperado) falha(`${it.id}: está na aula ${it.aula}, o vínculo mecânico dá ${esperado}`);
}

// E, B — prova
const prova = dados.PROVAS[0];
const q = ap.avaliacao;
if (!prova) falha('prova ausente');
else {
  if (prova.questoes.length !== q.perguntas.length || prova.total !== q.perguntas.length) falha(`prova: ${prova.questoes.length} questões × extração ${q.perguntas.length}`);
  prova.questoes.forEach((x, i) => {
    const p = q.perguntas[i];
    if (x.alternativas.length !== 4) falha(`${x.id}: ${x.alternativas.length} alternativas`);
    if (x.correta !== p.gabarito.indice) falha(`${x.id}: correta ${x.correta} × ${p.gabarito.indice}`);
    if (plano(x.enunciado) !== plano(P24(p.enunciado_html ?? p.enunciado))) falha(`${x.id}: enunciado difere`);
    x.alternativas.forEach((a, j) => { if (plano(a) !== plano(P24(p.alternativas[j].texto))) falha(`${x.id}: alternativa ${j} difere`); });
    // correção declarada no próprio item (alerta "trocado «X» por «Y»", caso Q15): aplicada à fonte antes de comparar
    let explicacaoFonte = P24(p.explicacao_html ?? p.explicacao);
    for (const al of x.alertas ?? []) {
      const c = al.match(/trocado «([^»]+)» por «([^»]+)»/);
      if (!c) continue;
      if (!plano(explicacaoFonte).includes(c[1])) falha(`${x.id}: a correção declarada não acha «${c[1]}» na fonte`);
      explicacaoFonte = explicacaoFonte.replace(c[1], c[2]);
    }
    if (plano(x.explicacao) !== plano(explicacaoFonte)) falha(`${x.id}: explicação difere`);
  });
  if (!plano(q.criterio_literal.prosa ?? q.criterio_literal.titulo).includes(plano(prova.criterio))) falha('critério da prova não é o literal');
  for (let a = 0; a <= prova.total; a++) {
    const k = prova.faixas.filter((f) => a >= f.min && a <= f.max).length;
    if (k !== 1) falha(`faixas: ${a} acertos cai em ${k} faixas`);
  }
  for (const f of prova.faixas) if (![].concat(q.faixas_de_placar_script.faixas ?? q.faixas_de_placar_script).some((s) => plano(P24(s.mensagem)) === plano(f.mensagem))) falha(`faixa ${f.min}–${f.max}: mensagem não é literal`);
  if (/Demonstrad/i.test(JSON.stringify(prova))) falha('prova usa "Demonstrado"');
}

// F — checklist
const ck = dados.CHECKLISTS[0];
const ckf = ap.checklist_final;
if (!ck) falha('checklist ausente');
else {
  if (ck.itens.length !== ckf.itens.length) falha(`checklist: ${ck.itens.length} × ${ckf.itens.length}`);
  ck.itens.forEach((x, i) => { if (plano(x.texto) !== plano(P24(ckf.itens[i].texto))) falha(`${x.id}: texto difere`); });
}

const porAula = AULAS.map((a) => {
  const xs = itens.filter((i) => i.aula === a.number);
  return `A${String(a.number).padStart(2, '0')} ${xs.filter((i) => i.origem === 'fonte').length}+${xs.filter((i) => i.origem !== 'fonte').length}`;
}).join(' · ');
console.log(`M${NN}: ${itens.length} itens por aula (fonte+derivado: ${porAula})`);
console.log(`prova ${prova?.questoes.length ?? 0} × 4 · critério ${prova?.acertosMinimos}/${prova?.total} · faixas ${prova?.faixas.map((f) => `${f.min}–${f.max}`).join(', ')} · checklist ${ck?.itens.length ?? 0}`);
for (const f of falhas) console.log('  ✗ ' + f);
console.log(falhas.length ? `RESULTADO: ${falhas.length} falha(s)` : 'RESULTADO: 0 falhas');
process.exit(falhas.length ? 1 : 0);
