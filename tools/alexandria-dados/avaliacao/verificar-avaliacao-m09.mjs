// verificar-avaliacao-m09.mjs — confere src/lib/alexandria/avaliacao/m09.dados.ts
// contra a extração (aparato.json) e contra o texto das aulas do M09. Lê o .ts gerado
// de verdade (não o gerador) e refaz cada conta por conta própria.
//
//   A · itens da fonte iguais à extração (enunciado, referência), com a troca P24.
//   B · todo trecho citado existe, por substring, no bloco indicado.
//   C · derivados: a referência está no texto da aula; em `escolha`, a alternativa
//       certa está no trecho e TODA alternativa aparece literalmente numa aula do M09.
//   D · nenhum item entrega a resposta de outro da mesma aula, nenhum derivado
//       entrega resposta da prova, e nenhum repete cenário de instrumento do M09.
//   E · ≥ 2 itens por aula; prova 10 × 4 com faixas literais cobrindo 0–10 sem
//       buraco; checklist igual à extração; sem tolerância; sem "Demonstrado".
//
// Uso: node tools/alexandria-dados/avaliacao/verificar-avaliacao-m09.mjs

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { RAIZ } from '../porte/porte-m09-m11-comum.mjs';

const ap = JSON.parse(fs.readFileSync(path.join(RAIZ, 'docs/alexandria-v2/extraction/m09/aparato.json'), 'utf8'));
const D = await import(pathToFileURL(path.join(RAIZ, 'src/lib/alexandria/avaliacao/m09.dados.ts')).href);
const { MODULO_09_CORPO } = await import(pathToFileURL(path.join(RAIZ, 'src/lib/data/alexandria-modulo-09-content.ts')).href);
const V3 = await import(pathToFileURL(path.join(RAIZ, 'src/lib/alexandria/modulos-v3/m09.ts')).href);

const txt = (s) => String(s ?? '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const P24 = (s) => String(s).replace(/GridAlpha/g, 'NIVAR');
const bloco = (b) => !b ? '' : b.kind === 'tabela' ? txt(b.linhas.map((l) => l.join(' — ')).join(' · ')) : b.kind === 'lista' ? txt(b.itens.join(' · ')) : b.kind === 'titulo' ? txt(`${b.numero ?? ''} ${b.texto}`) : txt(`${b.label ? b.label + ' ' : ''}${b.html ?? ''}`);
const aulaTxt = (n) => (MODULO_09_CORPO[`aula-09-0${n}`] ?? []).map(bloco).join(' ');
const modTxt = [1, 2, 3, 4, 5, 6, 7, 8].map(aulaTxt).join(' ');

const falhas = [];
const f = (k, m) => falhas.push(`[${k}] ${m}`);
const itens = D.EXERCICIOS_DAS_AULAS;
// A regra de colocação de 15/11, refeita aqui por conta própria: o termo (fixado no
// gerador) está no exercício; o exercício está na ÚLTIMA aula cujo texto o contém; sem
// casamento, está nos exercícios do módulo.
const { TERMOS } = await import(pathToFileURL(path.join(RAIZ, 'tools/alexandria-dados/avaliacao/gerar-avaliacao-m09.mjs')).href);
for (const x of ap.exercicios.itens) {
  const termo = TERMOS[x.id]?.toLowerCase();
  if (!termo) { f('A', `${x.id}: sem termo de vínculo`); continue; }
  if (!txt(`${x.enunciado.html} ${x.resposta_de_referencia.map((r) => r.html).join(' ')}`).toLowerCase().includes(termo)) f('A', `${x.id}: termo fora do exercício`);
  const casam = [1, 2, 3, 4, 5, 6, 7, 8].filter((n) => aulaTxt(n).toLowerCase().includes(termo));
  const esperada = casam.length ? casam.at(-1) : null;
  const naAula = itens.find((e) => e.id === x.id);
  const noModulo = D.EXERCICIOS_DO_MODULO.find((e) => e.id === x.id);
  if (esperada === null ? !noModulo || naAula : naAula?.aula !== esperada) f('A', `${x.id}: colocação errada (termo casa com ${casam.join(',') || 'nenhuma'})`);
  const item = naAula ?? noModulo;
  if (item && !/^(Vínculo mecânico|A fonte não liga)/.test(item.alertas?.[0] ?? '')) f('A', `${x.id}: falta o registro do vínculo mecânico`);
}
const ids = new Set();

for (const e of itens) {
  if (ids.has(e.id)) f('E', `id repetido ${e.id}`);
  ids.add(e.id);
  if (e.tolerancia !== null) f('E', `${e.id}: tolerância não nula`);
  if (e.moduloId !== 'modulo-09') f('E', `${e.id}: moduloId`);
  // B
  for (const ev of e.evidencias) {
    if (ev.arquivo.endsWith('content.ts')) {
      const m = ev.campo.match(/\['aula-09-0(\d)'\]\[(\d+)\]/);
      if (!m) { f('B', `${e.id}: campo ilegível ${ev.campo}`); continue; }
      if (Number(m[1]) !== e.aula) f('B', `${e.id}: evidência de outra aula`);
      if (!bloco(MODULO_09_CORPO[`aula-09-0${m[1]}`][Number(m[2])]).includes(ev.trecho)) f('B', `${e.id}: trecho ausente do bloco ${m[2]}`);
    }
  }
  if (e.origem === 'fonte') {
    // A
    const x = ap.exercicios.itens.find((y) => y.id === e.id);
    if (!x) { f('A', `${e.id} não existe na extração`); continue; }
    if (e.enunciado !== P24(x.enunciado.html)) f('A', `${e.id}: enunciado difere`);
    if (txt(e.referencia) !== txt(P24(x.resposta_de_referencia.map((r) => r.html).join(' ')))) f('A', `${e.id}: referência difere`);
    if (!e.evidencias.some((ev) => ev.arquivo.endsWith('content.ts'))) f('B', `${e.id}: vínculo à aula sem trecho`);
  } else {
    // C
    if (!aulaTxt(e.aula).includes(txt(e.referencia))) f('C', `${e.id}: referência fora do texto da aula`);
    if (e.tipo === 'escolha') {
      const alts = e.alternativas ?? [];
      if (alts.length < 3 || new Set(alts).size !== alts.length) f('C', `${e.id}: alternativas insuficientes ou repetidas`);
      if (typeof e.gabarito !== 'number' || !alts[e.gabarito]) f('C', `${e.id}: gabarito inválido`);
      else if (!txt(e.referencia).includes(alts[e.gabarito])) f('C', `${e.id}: alternativa certa fora do trecho`);
      for (const a of alts) if (!modTxt.includes(a)) f('C', `${e.id}: alternativa «${a}» não aparece em aula do M09`);
    } else if (e.gabarito !== null) f('C', `${e.id}: aberto com gabarito`);
  }
}

// D
const prova = D.PROVAS[0];
const certasDaProva = prova.questoes.map((q) => q.alternativas[q.correta]);
for (const e of itens) {
  for (const o of itens) {
    if (o === e || o.aula !== e.aula) continue;
    const resp = o.tipo === 'escolha' ? o.alternativas[o.gabarito] : null;
    if (resp && txt(e.enunciado).includes(resp)) f('D', `${e.id} entrega a resposta de ${o.id}`);
  }
  if (e.origem === 'derivado-da-aula') {
    const tudo = txt(`${e.enunciado} ${(e.alternativas ?? []).join(' ')} ${e.referencia}`);
    for (const c of certasDaProva) if (tudo.includes(c)) f('D', `${e.id} contém a resposta certa da prova «${c}»`);
  }
}
const cenarios = V3.MODULO_V3.previsoes.map((p) => p.pergunta);
for (const e of itens.filter((x) => x.origem === 'derivado-da-aula')) for (const p of cenarios) if (txt(e.enunciado) === txt(p)) f('D', `${e.id} repete cenário de instrumento`);
for (const num of ['1.000 MWh', '0,92', '95%']) for (const e of itens.filter((x) => x.origem === 'derivado-da-aula')) if (e.enunciado.includes(num)) f('D', `${e.id} usa número de cenário de instrumento (${num})`);

// E
for (let n = 1; n <= 8; n++) { const k = itens.filter((e) => e.aula === n).length; if (k < 1) f('E', `Aula 0${n} sem exercício`); }
const fonteIds = new Set([...itens, ...D.EXERCICIOS_DO_MODULO].filter((e) => e.origem === 'fonte').map((e) => e.id));
for (const x of ap.exercicios.itens) if (!fonteIds.has(x.id)) f('A', `exercício da fonte ausente: ${x.id}`);
for (const e of D.EXERCICIOS_DO_MODULO) {
  const x = ap.exercicios.itens.find((y) => y.id === e.id);
  if (e.aula !== null || !x || e.enunciado !== P24(x.enunciado.html) || txt(e.referencia) !== txt(P24(x.resposta_de_referencia.map((r) => r.html).join(' ')))) f('A', `${e.id} (módulo): difere da extração`);
}
if (prova.total !== 10 || prova.questoes.length !== 10 || prova.acertosMinimos !== 8) f('E', 'prova não é 10 com mínimo 8');
if (!ap.avaliacao.introducao.texto.startsWith(prova.criterio)) f('E', 'critério não é literal');
prova.questoes.forEach((q, k) => {
  const x = ap.avaliacao.perguntas[k];
  if (q.alternativas.length !== 4) f('E', `${q.id}: não tem 4 alternativas`);
  if (q.id !== x.id || q.enunciado !== P24(x.enunciado) || q.correta !== x.gabarito.numero - 1 || q.explicacao !== P24(x.explicacao)) f('A', `${q.id}: difere da extração`);
  if (JSON.stringify(q.alternativas) !== JSON.stringify(x.alternativas.map((a) => P24(a.texto)))) f('A', `${q.id}: alternativas diferem`);
});
const cobre = new Array(11).fill(0);
for (const fx of prova.faixas) for (let k = fx.min; k <= fx.max; k++) cobre[k]++;
if (cobre.some((c) => c !== 1)) f('E', `faixas não cobrem 0–10 exatamente uma vez: ${cobre.join('')}`);
for (const [i, fx] of prova.faixas.entries()) if (fx.mensagem !== ap.avaliacao.faixas_de_placar_script.faixas[i].mensagem) f('A', 'faixa não literal');
const ck = D.CHECKLISTS[0];
if (ck.itens.length !== ap.checklist_final.itens.length) f('A', 'checklist com contagem diferente');
ck.itens.forEach((it, k) => { if (it.texto !== P24(ap.checklist_final.itens[k].html)) f('A', `checklist ${it.id} difere`); });
if (/Demonstrad/.test(JSON.stringify(D))) f('E', '"Demonstrado" nos dados');

const doModulo = D.EXERCICIOS_DO_MODULO.map((e) => e.id).join(', ') || 'nenhum';
const porAula = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `A0${n}: ${itens.filter((e) => e.aula === n && e.origem === 'fonte').length}F+${itens.filter((e) => e.aula === n && e.origem !== 'fonte').length}D`).join(' · ');
console.log(`M09 · ${itens.length} itens (${porAula}) · do módulo: ${doModulo} · prova ${prova.questoes.length} × 4 · checklist ${ck.itens.length}`);
for (const x of falhas) console.log('  ✗ ' + x);
console.log(falhas.length ? `RESULTADO: ${falhas.length} falha(s)` : 'RESULTADO: 0 falhas');
process.exit(falhas.length ? 1 : 0);
