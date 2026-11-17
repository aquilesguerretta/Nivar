// Confere src/lib/alexandria/avaliacao/m12.dados.ts contra a fonte, sem reaproveitar o
// gerador (lê a extração, o HTML original e o texto das aulas por conta própria).
// Modelo: tools/alexandria-dados/verificar-avaliacao.mjs (M01).
//
//   (A) itens da fonte: os 14 Ex·NN, cada um com resumo, enunciado e resposta-modelo literais
//       (troca P24 aplicada), numa aula de 1 a 8;
//   (B) derivados: toda evidência está no texto da aula (produto) e no HTML original, na linha
//       declarada (±3);
//   (C) escolha: a alternativa correta está na evidência; todo distrator aparece no texto das
//       aulas do módulo (◇ = só em outra aula, informativo);
//   (D) nenhum derivado entrega a resposta de um Ex·NN da mesma aula, nem usa valor padrão de
//       instrumento da aula;
//   (E) ≥ 2 itens por aula; prova 10 × 4 igual ao quiz da fonte; faixas cobrindo 0–10 sem
//       buraco; critério 8 de 10; checklist de 28 igual à fonte; tolerância null em tudo;
//       nenhum "Demonstrado".
//
// Uso: node tools/alexandria-dados/avaliacao/verificar-avaliacao-m12.mjs  → exit 1 se houver falha.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { lerFonte, secao, norm, compacto } from '../porte/texto-m12-m13.mjs';
import { textosDasAulas, vincular } from './vinculo-mecanico-m12-m13.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const EXT = path.join(RAIZ, 'docs/alexandria-v2/extraction/m12');
const html = lerFonte('C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo12.html');
const aparato = JSON.parse(fs.readFileSync(path.join(EXT, 'aparato.json'), 'utf8'));
const modulo = JSON.parse(fs.readFileSync(path.join(EXT, 'modulo.json'), 'utf8'));
const D = await import(pathToFileURL(path.join(RAIZ, 'src/lib/alexandria/avaliacao/m12.dados.ts')).href);
const C = await import(pathToFileURL(path.join(RAIZ, 'src/lib/data/alexandria-modulo-12-content.ts')).href);

const falhas = []; const info = [];
const F = (s) => falhas.push(s);
const ed = (s) => String(s).replace(/GridAlpha/g, 'NIVAR');
const cl = (s) => compacto(s).toLowerCase();

function textoDaAula(n) {
  const id = `aula-12-0${n}`;
  const p = [C.MODULO_12_LEAD[id] ?? ''];
  for (const b of C.MODULO_12_CORPO[id] ?? []) {
    if (b.kind === 'titulo') p.push(`${b.numero ?? ''} ${b.texto}`);
    else if (b.kind === 'lista') p.push(...b.itens);
    else if (b.kind === 'tabela') p.push(...b.linhas.flat());
    else if (b.kind === 'nota') p.push(b.label ?? '', b.html);
    else p.push(b.html ?? b.eq ?? '');
  }
  return p.map(norm).join(' ');
}
const TEXTO = Object.fromEntries([1, 2, 3, 4, 5, 6, 7, 8].map((n) => [n, textoDaAula(n)]));
const TODAS = Object.values(TEXTO).join(' ');

function linhasDoTrecho(idSecao, trecho) {
  // Concatena as linhas da seção (sem tags) guardando onde cada uma começa, e acha a
  // linha em que o trecho começa. Implementação própria (não a do gerador).
  const s = secao(html, idSecao);
  const ls = s.html.split('\n');
  let txt = ''; const ini = [];
  for (const l of ls) { ini.push(txt.length); txt += norm(l) + ' '; }
  const alvo = norm(trecho).slice(0, 30);
  const out = [];
  for (let i = txt.indexOf(alvo); i >= 0; i = txt.indexOf(alvo, i + 1)) {
    let k = 0; while (k + 1 < ini.length && ini[k + 1] <= i) k++;
    out.push(s.linhaIni + k);
  }
  return out;
}

const itens = D.EXERCICIOS_DAS_AULAS;

// (A) fonte
// Ex·NN da fonte: nas aulas (vínculo mecânico) ou no módulo (sem vínculo).
const fontes = [...itens.filter((x) => x.origem === 'fonte'), ...D.EXERCICIOS_DO_MODULO];
const TEXTOS_VINC = await textosDasAulas(12);
if (fontes.length !== aparato.exercicios.length) F(`(A) ${fontes.length} itens da fonte × ${aparato.exercicios.length} na extração`);
for (const x of aparato.exercicios) {
  const it = fontes.find((f) => f.id === `m12-ex-${x.numero}`);
  if (!it) { F(`(A) falta m12-ex-${x.numero}`); continue; }
  // (A') a aula é a do vínculo mecânico (a última que casa), ou null sem vínculo
  const vinc = vincular(`${x.tag} ${x.resumo?.texto ?? ''} ${x.enunciado?.texto ?? ''}`, TEXTOS_VINC);
  if (it.aula !== vinc.escolhida) F(`(A) ${it.id}: aula ${it.aula} × vínculo mecânico ${vinc.escolhida}`);
  if (it.aula === null && !D.EXERCICIOS_DO_MODULO.includes(it)) F(`(A) ${it.id}: sem aula fora de EXERCICIOS_DO_MODULO`);
  if (vinc.escolhida !== null) info.push(`vínculo ${it.id} → Aula 0${vinc.escolhida}: «${vinc.aulas.at(-1).trecho}»`);
  if (!cl(it.enunciado).includes(cl(ed(x.resumo.texto)))) F(`(A) ${it.id}: resumo não está no enunciado`);
  if (x.enunciado && !cl(it.enunciado).includes(cl(ed(x.enunciado.texto)))) F(`(A) ${it.id}: enunciado da fonte ausente`);
  if (!cl(it.enunciado).includes(cl(ed(x.tag)))) F(`(A) ${it.id}: tag ausente`);
  if (cl(it.referencia) !== cl(ed(x.resposta_referencia.texto))) F(`(A) ${it.id}: referência difere da resposta-modelo`);
  if (it.tolerancia !== null) F(`(A) ${it.id}: tolerância`);
}

// (B)(C)(D) derivados
const derivados = itens.filter((x) => x.origem === 'derivado-da-aula');
for (const d of derivados) {
  for (const ev of d.evidencias) {
    if (!cl(TEXTO[d.aula]).includes(cl(ev.trecho))) F(`(B) ${d.id}: evidência fora do texto da Aula 0${d.aula}`);
    const s = norm(secao(html, `a0${d.aula}`).html.replace(/<[^>]+>/g, ' '));
    if (!cl(s).includes(cl(ev.trecho))) F(`(B) ${d.id}: evidência não está no HTML original (section#a0${d.aula})`);
    const ls = linhasDoTrecho(`a0${d.aula}`, ev.trecho);
    if (!ls.some((l) => Math.abs(l - ev.linha) <= 3)) F(`(B) ${d.id}: linha ${ev.linha} não confere (achado em ${ls.join(',') || '—'})`);
  }
  const resposta = d.tipo === 'escolha' ? d.alternativas[d.gabarito] : d.evidencias[0].trecho;
  if (d.tipo === 'escolha') {
    if (!d.evidencias.some((ev) => cl(ev.trecho).includes(cl(resposta)))) F(`(C) ${d.id}: alternativa correta não está na evidência`);
    d.alternativas.forEach((a, i) => {
      if (i === d.gabarito) return;
      if (!cl(TODAS).includes(cl(a))) F(`(C) ${d.id}: distrator «${a}» não aparece nas aulas do módulo`);
      else if (!cl(TEXTO[d.aula]).includes(cl(a))) info.push(`◇ ${d.id}: distrator «${a}» só em outra aula`);
    });
    if (new Set(d.alternativas.map(cl)).size !== d.alternativas.length) F(`(C) ${d.id}: alternativas repetidas`);
  }
  // (D) não entrega Ex·NN da mesma aula
  // resposta curta ("Quatro") casaria por acaso: usa-se a evidência.
  const chave = (cl(resposta).length >= 15 ? cl(resposta) : cl(d.evidencias[0].trecho)).slice(0, 60);
  for (const f of fontes.filter((f) => f.aula === d.aula)) {
    if (cl(f.referencia).includes(chave)) F(`(D) ${d.id}: a resposta aparece na referência de ${f.id}`);
    if (cl(f.enunciado).includes(chave)) F(`(D) ${d.id}: a resposta aparece no enunciado de ${f.id}`);
  }
  // (D) valor padrão de instrumento da aula
  const aula = C.MODULO_12_AULAS.find((a) => a.id === `aula-12-0${d.aula}`);
  for (const inst of aula?.instruments ?? []) {
    for (const f of inst.fields) {
      if (typeof f.defaultValue !== 'number') continue;
      const v = String(f.defaultValue).replace('.', ',');
      if (new RegExp(`(^|[^\\d,])${v.replace(',', '\\,')}([^\\d,]|$)`).test(norm(d.enunciado + ' ' + resposta)))
        F(`(D) ${d.id}: usa ${v} (padrão de ${inst.id}.${f.id})`);
    }
  }
  if (d.contaParaCriterioDoDrill !== false) F(`(D) ${d.id}: derivado não conta para o critério`);
  if (d.tolerancia !== null) F(`(E) ${d.id}: tolerância`);
}

// (E) contagens e prova
for (let n = 1; n <= 8; n++) {
  const k = itens.filter((x) => x.aula === n).length;
  if (k < 2) F(`(E) Aula 0${n} com ${k} item(ns)`);
  info.push(`Aula 0${n}: ${itens.filter((x) => x.aula === n && x.origem === 'fonte').length} fonte + ${itens.filter((x) => x.aula === n && x.origem !== 'fonte').length} derivados`);
}
const [P] = D.PROVAS;
if (!P || P.questoes.length !== 10) F('(E) prova sem 10 questões');
if (P.acertosMinimos !== 8 || P.total !== 10) F('(E) critério ≠ 8 de 10');
if (!norm(aparato.quiz.lede.texto).includes(P.criterio)) F('(E) critério não é literal do lede do §Quiz');
aparato.quiz.questoes.forEach((x, i) => {
  const q = P.questoes[i];
  if (!q) return;
  if (q.enunciado !== ed(x.enunciado)) F(`(E) ${q.id}: enunciado`);
  if (q.alternativas.length !== 4) F(`(E) ${q.id}: ≠ 4 alternativas`);
  x.alternativas.forEach((a, k) => q.alternativas[k] !== ed(a.texto) && F(`(E) ${q.id}: alternativa ${k}`));
  if (q.correta !== x.gabarito_indice) F(`(E) ${q.id}: gabarito`);
  if (q.explicacao !== ed(x.explicacao)) F(`(E) ${q.id}: explicação`);
});
const gab = P.questoes.map((q) => 'abcd'[q.correta]).join('');
if (gab !== 'cadbdabcad') F(`(E) gabarito ${gab} ≠ cadbdabcad (README da extração)`);
const cob = new Array(11).fill(0);
for (const f of P.faixas) for (let k = f.min; k <= f.max; k++) cob[k]++;
if (cob.some((c) => c !== 1)) F('(E) faixas não cobrem 0–10 uma vez cada');
const msgs = modulo.criterio.criterios.find((c) => c.id === 'm12-crit-quiz').mensagens_do_script.map((m) => ed(m.texto));
if (!P.faixas.every((f) => msgs.includes(f.mensagem))) F('(E) mensagem de faixa não literal');
const [CK] = D.CHECKLISTS;
if (CK.itens.length !== 28) F(`(E) checklist com ${CK.itens.length}`);
aparato.checklist.itens.forEach((x, i) => CK.itens[i]?.texto !== ed(x.texto) && F(`(E) checklist ${i + 1} difere`));
const tudo = JSON.stringify(D);
if (/Demonstrad/.test(tudo)) F('(E) "Demonstrado" no dado');
if (/GridAlpha/.test(tudo)) F('(E) "GridAlpha" no dado');

console.log(`itens: ${itens.length} (${fontes.length} fonte, ${derivados.length} derivados) · prova ${P.questoes.length} · checklist ${CK.itens.length}`);
for (const i of info) console.log(`   ${i}`);
for (const f of falhas) console.log(`   FALHA ${f}`);
console.log(falhas.length ? `RESULTADO: ${falhas.length} falha(s)` : 'RESULTADO: 0 falhas');
process.exit(falhas.length ? 1 : 0);
