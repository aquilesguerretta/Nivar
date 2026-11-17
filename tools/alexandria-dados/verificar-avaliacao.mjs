// Verifica src/lib/alexandria/avaliacao.dados.ts contra a extração verificada do M01.
// Não confia no gerador: relê a extração do zero e importa o .ts de verdade (Node 24
// remove os tipos sozinho), em vez de regex sobre texto.
//
// Verificações (falha = sai com 1):
//   A. CITAÇÃO     — todo `evidencias[].trecho` existe, por substring (texto normalizado, com a
//                    troca P24 aplicada do lado da extração), no valor do `campo` indicado, e a
//                    `linha` é a do ancestral mais próximo com origem.linha_aprox.
//   B. FONTE       — nos itens `fonte`: enunciado e referência são os campos da extração
//                    (igualdade normalizada). Prova: enunciado, alternativas, correta, explicação,
//                    critério e mensagens das faixas são os literais do aparato.
//   C. DERIVADO    — nos `derivado-da-aula`: a referência é a junção literal das evidências; em
//                    `escolha`, a alternativa correta aparece nas evidências (substring, sem caixa);
//                    cada distrator aparece no texto da própria aula ou, na falta, em outra aula
//                    do módulo (a saída diz qual — "no módulo" é aviso, não falha).
//   D. SEPARAÇÃO   — nenhum item entrega a resposta de outro item da mesma aula (a alternativa
//                    correta de um não aparece no enunciado nem nas alternativas de outro; a
//                    abertura da referência de um não aparece no enunciado de outro) e nenhum
//                    derivado repete o cenário-padrão do instrumento da aula (fonte: aviso, com o
//                    alerta declarado no item).
//   E. PENDÊNCIAS  — nenhum item depende de QA-M01-A06 (linhas 1845/1846/1863; "2,3 kV", "AS") nem
//                    de QA-M01-A07 (linha 1981; "15%", "0,85") do Founder.
//   F. CONTAGEM    — as 9 aulas têm ≥ 2 itens; prova com 10 × 4 e correta válida; faixas cobrem
//                    0..10 sem lacuna; sem tolerância em lugar nenhum; sem "Demonstrado".
//
// Uso: node tools/alexandria-dados/verificar-avaliacao.mjs

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  RAIZ, lerJson, norm, indiceDoTextoDaAula, valorNoCaminho, ARQUIVO_APARATO,
} from './avaliacao-fonte.mjs';

const mod = await import(pathToFileURL(path.join(RAIZ, 'src/lib/alexandria/avaliacao.dados.ts')).href);
const { EXERCICIOS_DAS_AULAS: ITENS, EXERCICIOS_DO_MODULO: DO_MODULO, PROVAS, CHECKLISTS } = mod;

const falhas = [];
const avisos = [];
const infos = [];
const falha = (m) => falhas.push(m);
const aviso = (m) => avisos.push(m);

let trocasP24 = 0;
let trocasQ03 = 0;
let trocasQ02 = 0;
const lado = (s) =>
  norm(
    String(s)
      .replace(/GridAlpha/g, () => { trocasP24 += 1; return 'NIVAR'; })
      .replace(/a Trava [34] do War Room/g, () => { trocasQ03 += 1; return 'uma trava operacional da NIVAR'; })
      .replace(/Módulo 02 — A Rede Elétrica/g, () => { trocasQ02 += 1; return 'Módulo 02 — Como Funciona uma Rede Elétrica'; }),
  );
const semCaixa = (s) => norm(s).toLocaleLowerCase('pt-BR');
const pontua = (s) => semCaixa(s).replace(/[.?!;:]+$/u, '');

const cache = {};
// `arquivo` é relativo à raiz do repositório.
const json = (arquivo) => (cache[arquivo] ??= JSON.parse(fs.readFileSync(path.join(RAIZ, arquivo), 'utf8')));

// Linha do ancestral mais próximo que declara origem.linha_aprox, no caminho dado.
function linhaNoCaminho(raiz, caminho) {
  const passos = caminho.match(/[^.[\]]+/g) ?? [];
  let o = raiz;
  let linha = null;
  for (const p of passos) {
    if (o == null) break;
    if (o.origem && typeof o.origem.linha_aprox === 'number') linha = o.origem.linha_aprox;
    o = o[/^\d+$/.test(p) ? Number(p) : p];
  }
  if (o && typeof o === 'object' && o.origem && typeof o.origem.linha_aprox === 'number') linha = o.origem.linha_aprox;
  return linha;
}

// ── A. Citações ─────────────────────────────────────────────────────────────
let citacoes = 0;
const todos = [...ITENS, ...DO_MODULO];
for (const it of todos) {
  for (const ev of it.evidencias) {
    citacoes += 1;
    const raiz = json(ev.arquivo);
    const v = valorNoCaminho(raiz, ev.campo);
    if (typeof v !== 'string') { falha(`${it.id}: campo inexistente na extração: ${ev.arquivo} :: ${ev.campo}`); continue; }
    if (!lado(v).includes(norm(ev.trecho))) falha(`${it.id}: trecho não é substring de ${ev.campo}: "${ev.trecho.slice(0, 60)}…"`);
    const l = linhaNoCaminho(raiz, ev.campo);
    // nos blocos de aula a linha cai no ancestral; no aparato é a origem do item
    if (l != null && ev.linha != null && l !== ev.linha) falha(`${it.id}: linha ${ev.linha} ≠ ${l} em ${ev.campo}`);
  }
}
for (const q of PROVAS.flatMap((p) => p.questoes)) {
  const aparato = json(ARQUIVO_APARATO);
  const src = valorNoCaminho(aparato, q.fonte.campo);
  if (!src) { falha(`${q.id}: campo ausente ${q.fonte.campo}`); continue; }
  citacoes += 1;
  if (src.origem.linha_aprox !== q.fonte.linha) falha(`${q.id}: linha ${q.fonte.linha} ≠ ${src.origem.linha_aprox}`);
}
for (const c of CHECKLISTS.flatMap((x) => x.itens)) {
  const aparato = json(ARQUIVO_APARATO);
  const v = valorNoCaminho(aparato, c.fonte.campo);
  citacoes += 1;
  if (typeof v !== 'string' || lado(v) !== norm(c.texto)) falha(`${c.id}: texto do checklist ≠ extração`);
}
// Introdução do checklist: a remissão ao M02 leva o nome do catálogo (Q02).
for (const x of CHECKLISTS) {
  citacoes += 1;
  const intro = json(ARQUIVO_APARATO).checklist_final?.introducao?.texto;
  if (typeof intro !== 'string' || lado(intro) !== norm(x.introducao)) falha('checklist: introdução ≠ extração');
}

// ── B. Itens da fonte e prova: igualdade com a extração ─────────────────────
for (const it of todos.filter((x) => x.origem === 'fonte')) {
  const [en, ref] = it.evidencias;
  const raiz = json(en.arquivo);
  if (lado(valorNoCaminho(raiz, en.campo)) !== norm(it.enunciado)) falha(`${it.id}: enunciado ≠ extração`);
  if (lado(valorNoCaminho(raiz, ref.campo)) !== norm(it.referencia)) falha(`${it.id}: referência ≠ extração`);
  if (it.criterio && lado(json(ARQUIVO_APARATO).exercicios.criterio_literal_prosa) !== norm(it.criterio)) falha(`${it.id}: critério ≠ extração`);
}
const aparato = json(ARQUIVO_APARATO);
for (const prova of PROVAS) {
  const av = aparato.avaliacao;
  if (lado(av.criterio_literal_prosa.texto) !== norm(prova.criterio)) falha('prova: critério ≠ extração');
  if (prova.questoes.length !== av.perguntas.length) falha('prova: nº de questões ≠ extração');
  prova.questoes.forEach((q, i) => {
    const p = av.perguntas[i];
    if (q.id !== p.id) falha(`${q.id}: id fora de ordem (${p.id})`);
    if (lado(p.enunciado) !== q.enunciado) falha(`${q.id}: enunciado ≠ extração`);
    if (q.alternativas.length !== 4) falha(`${q.id}: ${q.alternativas.length} alternativas`);
    q.alternativas.forEach((a, k) => { if (lado(p.alternativas[k].texto) !== a) falha(`${q.id}: alternativa ${k} ≠ extração`); });
    if (q.correta !== p.gabarito.indice || q.alternativas[q.correta] !== lado(p.gabarito.texto)) falha(`${q.id}: correta ≠ extração`);
    if (lado(p.explicacao) !== q.explicacao) falha(`${q.id}: explicação ≠ extração`);
  });
  const fx = av.faixas_de_placar_script.faixas;
  if (prova.faixas.length !== fx.length) falha('prova: nº de faixas ≠ extração');
  for (const f of prova.faixas) {
    const s = fx.find((x) => x.minimo === f.min);
    if (!s) { falha(`faixa ${f.min}: sem ramo correspondente no script`); continue; }
    if (lado(s.mensagem) !== f.mensagem) falha(`faixa ${f.min}: mensagem ≠ extração`);
    if (s.intervalo !== `${f.min}–${f.max}`) falha(`faixa ${f.min}: intervalo ${f.min}–${f.max} ≠ ${s.intervalo}`);
  }
  const m = norm(prova.criterio).match(/(\d+) de (\d+)/);
  if (!m || Number(m[1]) !== prova.acertosMinimos || Number(m[2]) !== prova.total) falha('prova: acertosMinimos/total não vêm do critério');
}

// ── C. Derivados ────────────────────────────────────────────────────────────
const indices = {};
for (let n = 1; n <= 9; n++) indices[n] = indiceDoTextoDaAula(n).map((x) => semCaixa(lado(x.texto)));
const aulaTexto = (n) => indices[n].join(' ¶ ');
const modTexto = Object.keys(indices).map((n) => aulaTexto(n)).join(' ¶ ');
let respostasConferidas = 0;
let distratoresNaAula = 0;
let distratoresNoModulo = 0;
for (const it of ITENS.filter((x) => x.origem === 'derivado-da-aula')) {
  const juntada = it.evidencias.map((e) => e.trecho).join(it.referencia.includes(' — ') && it.evidencias.length > 1 ? ' — ' : ' ');
  if (norm(it.referencia) !== norm(juntada)) falha(`${it.id}: referência não é a junção literal das evidências`);
  if (it.tipo === 'escolha') {
    const corretaTxt = it.alternativas[it.gabarito];
    const base = semCaixa(it.evidencias.map((e) => e.trecho).join(' ¶ '));
    respostasConferidas += 1;
    if (!base.includes(pontua(corretaTxt))) falha(`${it.id}: resposta "${corretaTxt}" não aparece nas evidências`);
    if (!aulaTexto(it.aula).includes(pontua(corretaTxt))) falha(`${it.id}: resposta "${corretaTxt}" não aparece no texto da aula ${it.aula}`);
    it.alternativas.forEach((a, k) => {
      if (k === it.gabarito) return;
      const t = pontua(a);
      if (aulaTexto(it.aula).includes(t)) distratoresNaAula += 1;
      else if (modTexto.includes(t)) { distratoresNoModulo += 1; aviso(`${it.id}: distrator "${a}" só aparece em outra aula do módulo`); }
      else falha(`${it.id}: distrator "${a}" não aparece em nenhuma aula do módulo`);
    });
  } else {
    respostasConferidas += 1; // aberto: a resposta é a própria evidência, já verificada em A
    if (it.gabarito !== null) falha(`${it.id}: aberto com gabarito`);
  }
}

// ── D. Separação ────────────────────────────────────────────────────────────
// Cenário-padrão de cada instrumento: valores de entrada, como a aula os escreve.
const fmt = (v) => (Number.isInteger(v) ? v.toLocaleString('pt-BR') : String(v).replace('.', ','));
const cenarioPadrao = {};
for (let n = 1; n <= 9; n++) {
  const a = lerJson(`aula-0${n}.json`);
  const ins = a.instrumentos?.[0];
  const ent = ins?.entradas?.map((e) => e.padrao).filter((v) => typeof v === 'number');
  const alt = ins?.cenario_padrao?.entradas ? Object.values(ins.cenario_padrao.entradas).filter((v) => typeof v === 'number') : null;
  const vals = (ent && ent.length ? ent : alt) ?? [];
  if (ins && vals.length) cenarioPadrao[n] = { id: ins.id_fonte ?? ins.id, valores: vals.map(fmt) };
}
const contem = (txt, v) => new RegExp(`(^|[^\\d.,])${v.replace(/[.,]/g, '\\$&')}([^\\d]|$)`).test(txt);
for (let n = 1; n <= 9; n++) {
  const doAula = ITENS.filter((x) => x.aula === n);
  for (const a of doAula) {
    const textoVisivel = (x) => semCaixa([x.enunciado, ...(x.alternativas ?? [])].join(' ¶ '));
    for (const b of doAula) {
      if (a === b) continue;
      if (a.tipo === 'escolha') {
        const chave = pontua(a.alternativas[a.gabarito]);
        if (chave.length >= 4 && textoVisivel(b).includes(chave)) falha(`${b.id}: entrega a resposta de ${a.id} ("${a.alternativas[a.gabarito]}") no enunciado/alternativas`);
      } else if (a.referencia) {
        const abertura = semCaixa(a.referencia).slice(0, 48);
        if (semCaixa(b.enunciado).includes(abertura)) falha(`${b.id}: o enunciado repete a abertura da referência de ${a.id}`);
      }
    }
    const cp = cenarioPadrao[n];
    if (cp && cp.valores.length >= 2 && cp.valores.every((v) => contem(norm(a.enunciado), v))) {
      const msg = `${a.id}: o enunciado é o cenário-padrão do ${cp.id} (${cp.valores.join(' · ')})`;
      if (a.origem === 'fonte' && a.alertas?.length) infos.push(`${msg} — alerta declarado no item`);
      else falha(`${msg} — sem alerta declarado`);
    }
    // um derivado também não pode usar nenhum valor do cenário-padrão do instrumento
    if (a.origem === 'derivado-da-aula' && cp && cp.valores.some((v) => v.replace(/\./g, '').length >= 3 && contem(norm(textoVisivelDe(a)), v))) {
      falha(`${a.id}: usa valor do cenário-padrão do ${cp.id}`);
    }
  }
}
function textoVisivelDe(x) { return [x.enunciado, ...(x.alternativas ?? [])].join(' ¶ '); }

// ── E. Pendências do Founder ────────────────────────────────────────────────
const BLOQUEIOS = [
  { aula: 6, nome: 'QA-M01-A06', linhas: [1845, 1846, 1863], termos: ['2,3 kv', '< 2,3', '≥ 2,3', 'subterrâneo'], palavras: [/\bAS\b/] },
  { aula: 7, nome: 'QA-M01-A07', linhas: [1981], termos: ['15%', '0,85', '85%'], palavras: [] },
];
for (const b of BLOQUEIOS) {
  for (const it of ITENS.filter((x) => x.aula === b.aula)) {
    for (const ev of it.evidencias) if (b.linhas.includes(ev.linha)) falha(`${it.id}: cita a linha ${ev.linha}, de ${b.nome} (pendência do Founder)`);
    const visivel = [it.enunciado, it.referencia, ...(it.alternativas ?? [])].join(' ¶ ');
    for (const t of b.termos) if (semCaixa(visivel).includes(t)) falha(`${it.id}: contém "${t}", termo de ${b.nome}`);
    for (const re of b.palavras) if (re.test(visivel)) falha(`${it.id}: contém ${re}, termo de ${b.nome}`);
  }
}

// ── F. Contagem e regras gerais ─────────────────────────────────────────────
const porAula = {};
for (let n = 1; n <= 9; n++) {
  const xs = ITENS.filter((x) => x.aula === n);
  porAula[n] = { total: xs.length, fonte: xs.filter((x) => x.origem === 'fonte').length, derivado: xs.filter((x) => x.origem !== 'fonte').length };
  if (xs.length < 2) falha(`aula ${n}: ${xs.length} item(ns), mínimo 2`);
  const ids = new Set(xs.map((x) => x.id));
  if (ids.size !== xs.length) falha(`aula ${n}: id repetido`);
}
const idsGerais = [...todos.map((x) => x.id), ...PROVAS.flatMap((p) => p.questoes.map((q) => q.id))];
if (new Set(idsGerais).size !== idsGerais.length) falha('id repetido entre itens/questões');
for (const it of todos) {
  if (it.tolerancia !== null) falha(`${it.id}: tolerância ≠ null`);
  if (it.tipo === 'escolha' && (it.gabarito == null || !it.alternativas?.[it.gabarito])) falha(`${it.id}: escolha sem gabarito válido`);
  if (it.tipo !== 'escolha' && it.gabarito !== null) falha(`${it.id}: ${it.tipo} com gabarito (sem tolerância não há veredito)`);
  if (it.verificacao !== (it.tipo === 'escolha' ? 'alternativa-correta' : 'autoavaliacao')) falha(`${it.id}: verificação incoerente com o tipo`);
}
const fonteEx = todos.filter((x) => x.origem === 'fonte');
if (fonteEx.length !== aparato.exercicios.total_na_fonte) falha(`Ex da fonte: ${fonteEx.length} ≠ ${aparato.exercicios.total_na_fonte} declarados`);
const bruto = JSON.stringify({ ITENS, DO_MODULO, PROVAS, CHECKLISTS });
if (/Demonstrado/.test(bruto)) falha('o dado contém "Demonstrado"');
for (const p of PROVAS) {
  const total = p.faixas.at(-1).max;
  const ok = p.faixas.every((f, i) => (i === 0 ? f.min === 0 : f.min === p.faixas[i - 1].max + 1)) && total === p.total;
  if (!ok) falha(`prova ${p.moduloId}: faixas não cobrem 0..${p.total}`);
}
const faixasComDominio = PROVAS.flatMap((p) => p.faixas).filter((f) => /dom[ií]nio/i.test(f.mensagem)).length;

// ── Saída ───────────────────────────────────────────────────────────────────
console.log('Itens por aula  (total = fonte + derivado)');
for (const [n, c] of Object.entries(porAula)) console.log(`  A0${n}: ${c.total} = ${c.fonte} + ${c.derivado}`);
const sum = (k) => Object.values(porAula).reduce((s, c) => s + c[k], 0);
console.log(`  soma: ${sum('total')} = ${sum('fonte')} fonte + ${sum('derivado')} derivado   (+ ${DO_MODULO.length} síntese sem aula)`);
console.log(`Prova: ${PROVAS[0].questoes.length} questões × 4 alternativas · ${PROVAS[0].faixas.length} faixas (${PROVAS[0].faixas.map((f) => `${f.min}–${f.max}`).join(', ')}) · critério ${PROVAS[0].acertosMinimos}/${PROVAS[0].total}`);
console.log(`Checklist: ${CHECKLISTS[0].itens.length} itens (afirmações de capacidade, não perguntas)`);
console.log(`Citações conferidas na extração: ${citacoes} · troca P24 aplicada do lado da extração: ${trocasP24} · troca Q03: ${trocasQ03} · troca Q02: ${trocasQ02}`);
console.log(`Derivados: ${respostasConferidas} respostas conferidas no texto da aula · distratores: ${distratoresNaAula} na própria aula, ${distratoresNoModulo} só em outra aula do módulo`);
console.log(`Pendências do Founder: nenhum item cita QA-M01-A06 (L1845/1846/1863) nem QA-M01-A07 (L1981)`);
console.log(`Faixas com a palavra "domínio" (S3: sem Demonstrado) — quem renderiza decide a redação: ${faixasComDominio}`);
for (const i of infos) console.log('INFO  ' + i);
for (const a of avisos) console.log('AVISO ' + a);
if (falhas.length) {
  console.log(`\n${falhas.length} FALHA(S):`);
  for (const f of falhas) console.log('  ✗ ' + f);
  process.exit(1);
}
console.log('\nverificador: 0 falhas');
