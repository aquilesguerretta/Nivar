// Gera src/lib/alexandria/avaliacao/mNN.dados.ts (M14 ou M15): exercícios por aula,
// prova do módulo e checklist — a partir SÓ da extração verificada
// (docs/alexandria-v2/extraction/mNN/aparato.json) e do texto das aulas já conferido
// contra o HTML (MODULO_NN_CORPO, verificar-porte-m14-m15.mjs: 0 falta, 0 inventado).
//
// Três origens, nunca misturadas:
//   'fonte'            — Ex NN do §Ex (enunciado e gabarito literais), os exercícios que a
//                        própria aula declara (fichas da Aula 08 do M14), o §Quiz e o §Final.
//   'derivado-da-aula' — pergunta de recuperação cuja resposta está LITERALMENTE no texto da
//                        aula (campo `evidencias`; o verificador confere por substring). A
//                        pergunta e os distratores são voz da Alexandria (decisão 7/8 de
//                        DECISOES-2026-11-15.md); a referência mostrada é o trecho literal.
//
// VÍNCULO EX → AULA. A fonte não liga nenhum Ex a aula (P9: `aula_declarada: null` nos 14).
// O vínculo abaixo é por AFINIDADE DE TEMA, a do estudo docs/alexandria-v2/estudos/aulas/mNN.md
// ("Afinidade: Ex …" em cada aula), e vai em `alertas` de cada item — nunca como dado da fonte.
//
// Uso: node tools/alexandria-dados/avaliacao/gerar-avaliacao-m14-m15.mjs <14|15>

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as LER from './aparato-m14-m15.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const N = Number(process.argv[2]);
if (N !== 14 && N !== 15) { console.error('uso: gerar-avaliacao-m14-m15.mjs <14|15>'); process.exit(2); }
const NN = String(N);
const MOD = `modulo-${NN}`;
const ARQ_APARATO = `docs/alexandria-v2/extraction/m${NN}/aparato.json`;
const ARQ_HTML = `Alexandria modulos/alexandria_modulo${NN}.html`;
const AP = JSON.parse(fs.readFileSync(path.join(RAIZ, ARQ_APARATO), 'utf8'));
const CONT = await import(pathToFileURL(path.join(RAIZ, `src/lib/data/alexandria-modulo-${NN}-content.ts`)).href);
const CORPO = CONT[`MODULO_${NN}_CORPO`];

let trocas = 0;
const editorial = (s) => String(s ?? '')
  .replace(/GridAlpha/g, () => { trocas++; return 'NIVAR'; })
  .replace(/\bBloco (\d+)/g, (m, d) => { trocas++; return `Módulo ${d}`; });
const colapsa = (s) => String(s ?? '').replace(/[\s ]+/g, ' ').replace(/ ([,.;:)])/g, '$1').trim();
const plano = (h) => colapsa(String(h ?? '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"'));
const lit = (h) => colapsa(editorial(h)).replace(/<span class="mini">/g, '<br>').replace(/<\/?span[^>]*>/g, '');

/** Texto plano de uma aula (o que o verificador também usa) e localização do trecho. */
function acharNaAula(aula, trecho) {
  const id = `aula-${NN}-${String(aula).padStart(2, '0')}`;
  const blocos = CORPO[id] ?? [];
  const alvo = plano(trecho);
  for (let i = 0; i < blocos.length; i++) {
    const b = blocos[i];
    const partes = b.kind === 'titulo' ? [b.texto] : b.kind === 'formula' ? [b.eq, b.desc ?? ''] : b.kind === 'lista' ? b.itens : b.kind === 'tabela' ? b.linhas.flat() : [b.label ?? '', b.html];
    if (partes.some((p) => plano(p).includes(alvo))) return { bloco: i, kind: b.kind };
  }
  throw new Error(`Aula ${aula}: trecho não encontrado no texto da aula: «${alvo.slice(0, 90)}»`);
}

// ── especificação por módulo ────────────────────────────────
const ESPEC = (await import(pathToFileURL(path.join(RAIZ, `tools/alexandria-dados/avaliacao/espec-avaliacao-m${NN}.mjs`)).href)).default;

const EXERCICIOS_DAS_AULAS = [];
const EXERCICIOS_DO_MODULO = [];

// 1 · Ex NN do §Ex, na aula da afinidade
const exs = LER.exercicios(AP);
const vinculados = new Set();
for (const [aulaTxt, ids] of Object.entries(ESPEC.afinidade)) {
  const aula = Number(aulaTxt);
  for (const nEx of ids) {
    const e = exs.find((x) => x.id === `m${NN}-ex-${String(nEx).padStart(2, '0')}`);
    if (!e) throw new Error(`Ex ${nEx} não existe no §Ex`);
    if (vinculados.has(e.id)) throw new Error(`${e.id} vinculado duas vezes`);
    vinculados.add(e.id);
    const f = (sufixo) => ({ arquivo: ARQ_APARATO, campo: `${e.campo}.${sufixo}`, linha: e.linha });
    EXERCICIOS_DAS_AULAS.push({
      id: e.id, moduloId: MOD, aula, origem: 'fonte', tipo: 'aberto',
      enunciado: lit(e.enunciadoHtml),
      gabarito: null,
      referencia: lit(e.respostaHtml),
      contaParaCriterioDoDrill: false,
      tolerancia: null,
      verificacao: 'autoavaliacao',
      fonte: f('enunciado'),
      evidencias: [
        { ...f('enunciado'), trecho: plano(editorial(e.enunciadoTexto)) },
        { ...f('resposta_referencia'), trecho: plano(editorial(e.respostaTexto)) },
      ],
      alertas: [
        `Tag da fonte: "${e.tag}". A fonte não liga este exercício a aula (P9); o vínculo com a Aula ${String(aula).padStart(2, '0')} é por afinidade de tema (docs/alexandria-v2/estudos/aulas/m${NN}.md).`,
        ...(ESPEC.alertasEx?.[nEx] ?? []),
      ],
    });
  }
}
// Ex que fica no módulo (EXERCICIOS_DO_MODULO, mostrado na última aula), com a razão
for (const [nEx, razao] of Object.entries(ESPEC.doModulo ?? {})) {
  const e = exs.find((x) => x.id === `m${NN}-ex-${String(nEx).padStart(2, '0')}`);
  if (!e || vinculados.has(e.id)) throw new Error(`Ex ${nEx}: inexistente ou já vinculado`);
  vinculados.add(e.id);
  const f = (sufixo) => ({ arquivo: ARQ_APARATO, campo: `${e.campo}.${sufixo}`, linha: e.linha });
  EXERCICIOS_DO_MODULO.push({
    id: e.id, moduloId: MOD, aula: null, origem: 'fonte', tipo: 'aberto',
    enunciado: lit(e.enunciadoHtml), gabarito: null, referencia: lit(e.respostaHtml),
    contaParaCriterioDoDrill: false, tolerancia: null, verificacao: 'autoavaliacao',
    fonte: f('enunciado'),
    evidencias: [
      { ...f('enunciado'), trecho: plano(editorial(e.enunciadoTexto)) },
      { ...f('resposta_referencia'), trecho: plano(editorial(e.respostaTexto)) },
    ],
    alertas: [`Tag da fonte: "${e.tag}". A fonte não liga este exercício a aula (P9). Fica nos exercícios do módulo: ${razao}`],
  });
}
for (const e of exs) if (!vinculados.has(e.id)) throw new Error(`${e.id} ficou sem aula`);

// 2 · exercícios que a própria aula declara (M14: fichas de rota da A08; M15: fichas de elo)
const SEM_REFERENCIA = 'Sem resposta-modelo na fonte para este campo da ficha.';
for (const e of LER.embutidos(AP)) {
  EXERCICIOS_DAS_AULAS.push({
    id: e.id, moduloId: MOD, aula: e.aula, origem: 'fonte', tipo: 'aberto',
    enunciado: `<b>${lit(e.titulo)}</b> — ${lit(e.campo)}: ${lit(e.enunciadoHtml)}`,
    gabarito: null,
    referencia: e.referenciaTexto ? lit(e.referenciaTexto) : SEM_REFERENCIA,
    contaParaCriterioDoDrill: false,
    tolerancia: null,
    verificacao: 'autoavaliacao',
    fonte: { arquivo: ARQ_APARATO, campo: e.origem.campo, linha: e.origem.linha },
    evidencias: [
      { arquivo: ARQ_APARATO, campo: e.origem.campo, linha: e.origem.linha, trecho: plano(editorial(e.enunciadoTexto)) },
      ...(e.referenciaTexto ? [{ arquivo: ARQ_APARATO, campo: e.referenciaFonte.campo, linha: e.referenciaFonte.linha, trecho: plano(editorial(e.referenciaTexto)) }] : []),
    ],
    alertas: [
      e.referenciaTexto
        ? 'Exercício declarado pela própria aula (campo "o que este número não diz" da ficha), sem gabarito na fonte: a referência é a instrução da fonte, que manda conferir contra o verificador.'
        : 'Exercício declarado pela própria aula (campo "Preencha." da ficha de elo). A fonte não traz gabarito; a referência declara a ausência (voz da Alexandria).',
    ],
  });
}

// 3 · derivados da aula
const contaPorAula = {};
for (const d of ESPEC.derivados) {
  contaPorAula[d.aula] = (contaPorAula[d.aula] ?? 0) + 1;
  const id = `m${NN}-a${String(d.aula).padStart(2, '0')}-d${String(contaPorAula[d.aula]).padStart(2, '0')}`;
  const evid = d.evidencias.map((t) => {
    const onde = acharNaAula(d.aula, t);
    return { arquivo: ARQ_HTML, campo: `section#a${String(d.aula).padStart(2, '0')} · bloco ${onde.bloco} (${onde.kind})`, linha: null, trecho: plano(t) };
  });
  const item = {
    id, moduloId: MOD, aula: d.aula, origem: 'derivado-da-aula', tipo: d.tipo,
    enunciado: d.enunciado,
    ...(d.tipo === 'escolha' ? { alternativas: d.alternativas } : {}),
    gabarito: d.tipo === 'escolha' ? d.correta : null,
    referencia: evid.map((e) => e.trecho).join(' '),
    contaParaCriterioDoDrill: false,
    tolerancia: null,
    verificacao: d.tipo === 'escolha' ? 'alternativa-correta' : 'autoavaliacao',
    fonte: { arquivo: ARQ_HTML, campo: evid[0].campo, linha: null },
    evidencias: evid,
    alertas: ['Pergunta e distratores: voz da Alexandria (decisões 7 e 8). A resposta é o trecho literal da aula em `evidencias`.'],
  };
  EXERCICIOS_DAS_AULAS.push(item);
}
EXERCICIOS_DAS_AULAS.sort((a, b) => a.aula - b.aula || (a.origem === b.origem ? 0 : a.origem === 'fonte' ? -1 : 1));

// 4 · prova (§Quiz)
const crit = LER.criterio(AP).texto;
const NUM = { um: 1, dois: 2, tres: 3, três: 3, quatro: 4, cinco: 5, seis: 6, sete: 7, oito: 8, nove: 9, dez: 10 };
const m = /(\d+|\p{L}+) de (\d+|\p{L}+)/u.exec(crit);
const ler = (s) => (/^\d+$/.test(s) ? Number(s) : NUM[s.toLowerCase()]);
const acertosMinimos = ler(m[1]);
const total = ler(m[2]);
const qs = LER.perguntas(AP);
if (!acertosMinimos || total !== qs.length) throw new Error(`critério "${crit}" não reconcilia com ${qs.length} questões`);
const PROVAS = [{
  moduloId: MOD,
  criterio: lit(crit),
  acertosMinimos,
  total,
  questoes: qs.map((q, k) => ({
    id: q.id,
    enunciado: lit(q.enunciado),
    alternativas: q.alternativas.map(lit),
    correta: q.correta,
    explicacao: lit(q.explicacaoHtml ?? q.explicacao),
    fonte: { arquivo: ARQ_APARATO, campo: `avaliacao.perguntas[${k}]`, linha: q.linha },
  })),
  faixas: LER.faixas(AP).map((f) => ({ min: f.min, max: f.max ?? total, mensagem: lit(f.mensagem) })),
  faixasFonte: { arquivo: ARQ_APARATO, campo: 'avaliacao.faixas_de_placar_script', linha: AP.avaliacao.script?.linha_ini ?? null },
  criterioFonte: { arquivo: ARQ_APARATO, campo: 'avaliacao.criterio_literal_prosa', linha: LER.criterio(AP).linha },
}];

// 5 · checklist (§Final)
const ck = AP.checklist_final;
const CHECKLISTS = [{
  moduloId: MOD,
  introducao: lit(ck.introducao?.html ?? ck.introducao?.texto ?? ''),
  itens: ck.itens.map((it, k) => ({ id: it.id, texto: lit(it.html), fonte: { arquivo: ARQ_APARATO, campo: `checklist_final.itens[${k}].html`, linha: it.origem?.linha_aprox ?? null } })),
}];

const porOrigem = (o) => EXERCICIOS_DAS_AULAS.filter((e) => e.origem === o).length;
const cab = `// GERADO por tools/alexandria-dados/avaliacao/gerar-avaliacao-m14-m15.mjs ${NN} — não editar à mão.
// Fonte: ${ARQ_APARATO} (§Ex, §Quiz, §Final, fichas declaradas nas aulas) e o texto das aulas
// (MODULO_${NN}_CORPO, conferido contra o HTML). Conferência: verificar-avaliacao-m14-m15.mjs ${NN}.
// ${EXERCICIOS_DAS_AULAS.length} itens por aula (${porOrigem('fonte')} da fonte, ${porOrigem('derivado-da-aula')} derivados) · ${PROVAS[0].questoes.length} questões na prova · ${CHECKLISTS[0].itens.length} itens no checklist.
// Relatório: docs/alexandria-v3/porte/m${NN}.md.

import type { ChecklistDoModulo, ExercicioDaAula, ExercicioDoModulo, ProvaDoModulo } from '../avaliacao';

`;
const ts = cab +
  `export const EXERCICIOS_DAS_AULAS: ExercicioDaAula[] = ${JSON.stringify(EXERCICIOS_DAS_AULAS, null, 2)};\n\n` +
  `export const EXERCICIOS_DO_MODULO: ExercicioDoModulo[] = ${JSON.stringify(EXERCICIOS_DO_MODULO, null, 2)};\n\n` +
  `export const PROVAS: ProvaDoModulo[] = ${JSON.stringify(PROVAS, null, 2)};\n\n` +
  `export const CHECKLISTS: ChecklistDoModulo[] = ${JSON.stringify(CHECKLISTS, null, 2)};\n`;
fs.writeFileSync(path.join(RAIZ, `src/lib/alexandria/avaliacao/m${NN}.dados.ts`), ts);
const porAula = {};
for (const e of EXERCICIOS_DAS_AULAS) porAula[e.aula] = `${porAula[e.aula] ? porAula[e.aula] + ' ' : ''}${e.id.replace(`m${NN}-`, '')}`;
for (const [a, s] of Object.entries(porAula)) console.log(`A${String(a).padStart(2, '0')}: ${s}`);
console.log(`fonte ${porOrigem('fonte')} · derivados ${porOrigem('derivado-da-aula')} · prova ${PROVAS[0].questoes.length} (critério ${acertosMinimos}/${total}) · checklist ${CHECKLISTS[0].itens.length} · trocas editoriais ${trocas}`);
