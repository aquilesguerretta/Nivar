// Gera src/lib/alexandria/avaliacao/m17.dados.ts (exercícios por aula, prova,
// checklist do Módulo 17). Mesmo método do M16 (gerar-avaliacao-m16.mjs).
//
// FONTE. Itens `fonte`, prova e checklist: docs/alexandria-v2/extraction/m17/aparato.json,
// literais. Itens `derivado-da-aula`: pergunta de recuperação cuja resposta é um trecho
// LITERAL da aula (src/lib/data/alexandria-modulo-17-content.ts, conferido contra o
// HTML-fonte por tools/alexandria-dados/porte/verificar-porte-m17.mjs). O gerador para se
// um trecho citado não existir na aula.
//
// AULA DE CADA EXERCÍCIO DA FONTE. A fonte não liga nenhum dos 18 a aula
// (`aula_vinculada: null`). Vínculo mecânico (guia de porte, 15/11): a ÚLTIMA aula
// cujo texto contém todas as âncoras; as âncoras são termos LITERAIS do próprio
// enunciado; sem casamento, EXERCICIOS_DO_MODULO. O vínculo fica registrado no item.
//
// CRITÉRIO. O §Ex do M17 não tem critério (o lede é instrução: "Escreva a resposta antes
// de abrir o gabarito…"), e nenhum exercício traz critério próprio (`criterio: null`).
// `criterio` fica ausente; `contaParaCriterioDoDrill: false`.
//
// Uso: node tools/alexandria-dados/avaliacao/gerar-avaliacao-m17.mjs
// Conferência: node tools/alexandria-dados/avaliacao/verificar-avaliacao-m16-m17.mjs 17

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARQ_APARATO = 'docs/alexandria-v2/extraction/m17/aparato.json';
const ARQ_CONTEUDO = 'src/lib/data/alexandria-modulo-17-content.ts';
const SAIDA = path.join(RAIZ, 'src/lib/alexandria/avaliacao/m17.dados.ts');
const MOD = 'modulo-17';

const ap = JSON.parse(fs.readFileSync(path.join(RAIZ, ARQ_APARATO), 'utf8'));
const conteudo = await import(pathToFileURL(path.join(RAIZ, ARQ_CONTEUDO)).href);

const P24 = (s) => String(s).replace(/GridAlpha/g, 'NIVAR');
const textoPlano = (h) =>
  String(h ?? '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”').replace(/[\s ]+/g, ' ').trim();

function blocosDaAula(n) {
  const id = `aula-17-${String(n).padStart(2, '0')}`;
  const lead = conteudo.MODULO_17_LEAD[id];
  const out = [];
  if (lead) out.push({ campo: `MODULO_17_LEAD['${id}']`, texto: textoPlano(lead) });
  conteudo.MODULO_17_CORPO[id].forEach((b, i) => {
    const t =
      b.kind === 'titulo' ? `${b.numero ?? ''} ${b.texto}` :
      b.kind === 'formula' ? `${b.eq} ${b.desc ?? ''}` :
      b.kind === 'lista' ? b.itens.join(' ') :
      b.kind === 'tabela' ? b.linhas.flat().join(' ') :
      b.kind === 'nota' ? `${b.label ?? ''} ${b.html}` : b.html;
    out.push({ campo: `MODULO_17_CORPO['${id}'][${i}]`, texto: textoPlano(t) });
  });
  return out;
}

// ── exercícios da fonte → aula: vínculo mecânico ────────────────────────────
const ANCORAS = {
  'm17-ex-01': ['tarifa industrial'],
  'm17-ex-02': ['€89/MWh', 'liquidação de diferenças'],
  'm17-ex-03': ['preço da energia', 'nodal'],
  'm17-ex-04': ['tributo'],
  'm17-ex-05': ['média aritmética', 'atacado'],
  'm17-ex-06': ['intensidade', 'dotação'],
  'm17-ex-07': ['parcela vincula'],
  'm17-ex-08': ['custo de capital'],
  'm17-ex-09': ['três parcelas'],
  'm17-ex-10': ['recurso solar', 'corte de geração'],
  'm17-ex-11': ['leilão central de capacidade'],
  'm17-ex-12': ['só de energia'],
  'm17-ex-13': ['ajuste de fronteira'],
  'm17-ex-14': ['redespacho'],
  'm17-ex-15': ['quatro números'],
  'm17-ex-16': ['fator de utilização'],
  'm17-ex-17': ['meta', '2030'],
  'm17-ex-18': ['certificado', 'exportador'],
};
const contem = (texto, termo) => texto.toLowerCase().includes(termo.toLowerCase());
function vinculoMecanico(ancoras, nAulas) {
  const casam = [];
  for (let a = 1; a <= nAulas; a++) {
    const t = blocosDaAula(a).map((b) => b.texto).join(' ');
    if (ancoras.length && ancoras.every((f) => contem(t, f))) casam.push(a);
  }
  const lista = ancoras.map((f) => `"${f}"`).join(' e ');
  if (!casam.length) return { aula: null, nota: `Sem vínculo: a fonte não prende este exercício a aula, e ${lista} não aparece no texto de nenhuma aula. Fica nos exercícios do módulo.` };
  const aula = casam[casam.length - 1];
  const onde = casam.length > 1 ? `aparece nas Aulas ${casam.join(', ')}; vai para a última, a ${aula}` : `aparece só na Aula ${aula}`;
  return { aula, nota: `Vínculo mecânico: a fonte não prende este exercício a aula; ${lista} ${onde}.` };
}

// Exercício cuja resposta o instrumento da mesma aula escreve no veredito (medido): a
// previsão correspondente registra e o cálculo espera a tentativa.
const ALERTAS = {
  'm17-ex-18':
    'O veredito do INST·09, no padrão, escreve as razões da resposta deste exercício (fator de entrada gradual, emissão indireta fora da conta para ferro e aço, enquadramento em oito dígitos). O INST·09 não abre antes da tentativa deste exercício.',
};

// ── derivados da aula (um por aula) ─────────────────────────────────────────
const DERIVADOS = [
  { aula: 1, tipo: 'escolha', enunciado: 'Segundo a aula, se qualquer uma das sete declarações faltar, como fica a comparação de preço?',
    alternativas: ['Imprecisa', 'Inválida'], gabarito: 1,
    evidencia: 'Se qualquer uma faltar, a comparação não é imprecisa — ela é inválida' },
  { aula: 2, tipo: 'aberto', enunciado: 'Qual é, segundo a aula, a regra operacional sobre o que uma mudança de governo altera nas três parcelas?',
    evidencia: 'A regra operacional: mudança de governo altera a parcela de política; raramente altera desenho no mesmo mandato; nunca altera dotação.' },
  { aula: 3, tipo: 'aberto', enunciado: 'Segundo a aula, o que decide qual das três granularidades de preço é a adequada?',
    evidencia: 'O que decide não é sofisticação — é a relação entre onde está o recurso, onde está a carga e quanto custa a linha entre os dois.' },
  { aula: 4, tipo: 'aberto', enunciado: 'O que um mercado central de capacidade compra, segundo a aula — e o que ele não compra?',
    evidencia: 'Compra disponibilidade futura acreditada. Não compra energia, não compra a placa da usina, e não compra a promessa do proprietário.' },
  { aula: 5, tipo: 'aberto', enunciado: 'Segundo a aula, o que preço negativo e corte de geração num sistema com alta penetração solar significam?',
    evidencia: 'Preço negativo e corte de geração num sistema com alta penetração solar não significam que renovável não funciona. Significam que localização, rede, flexibilidade e demanda não acompanharam a produção.' },
  { aula: 6, tipo: 'aberto', enunciado: 'Segundo a aula, quando a coordenação entre estados e governo federal funciona?',
    evidencia: 'Federalismo não é sinônimo de descentralização eficiente — a coordenação funciona quando competências, dados, alocação de custo e autoridade de execução estão claros, e não quando estão simplesmente distribuídos.' },
  { aula: 7, tipo: 'escolha', enunciado: 'A distância entre o recurso, no oeste e no norte, e a carga, no litoral leste, é qual das três parcelas, segundo a aula?',
    alternativas: ['Dotação', 'Desenho', 'Política'], gabarito: 0,
    evidencia: 'A distância entre os dois é a variável estruturante, e é dotação — ninguém a escolheu.' },
  { aula: 8, tipo: 'aberto', enunciado: 'Segundo a aula, existe hoje preço de carbono pago no Brasil que possa ser abatido no mecanismo de fronteira?',
    evidencia: 'não existe preço de carbono pago no Brasil para abater hoje, e não existirá antes de 2030 no calendário vigente.' },
  { aula: 9, tipo: 'aberto', enunciado: 'Por que, segundo a aula, um sistema com alta penetração renovável e interconexão forte não demonstrou a mesma coisa que um com interconexão fraca?',
    evidencia: 'O primeiro resolveu parte do problema exportando-o; o segundo teve de resolvê-lo internamente, com corte de geração, armazenamento ou flexibilidade de demanda.' },
  { aula: 10, tipo: 'aberto', enunciado: 'Segundo a aula, qual é o risco dominante no país vizinho de operação centralizada?',
    evidencia: 'O risco dominante não é ausência de engenharia nem de desenho — é a moeda.' },
  { aula: 11, tipo: 'aberto', enunciado: 'Que quatro coisas, segundo a aula, a resposta correta às duas conclusões recusadas devolve?',
    evidencia: 'A resposta correta a ambas devolve quatro coisas: perímetro, decomposição em três parcelas, pressuposto institucional e as condições que fariam cada leitura mudar.' },
];

function localizar(n, trecho) {
  const achado = blocosDaAula(n).find((b) => b.texto.includes(trecho));
  if (!achado) throw new Error(`trecho não está na Aula ${n}: «${trecho.slice(0, 80)}»`);
  return achado.campo;
}

// ── montagem ────────────────────────────────────────────────────────────────
const itens = [];
const soltos = [];
const N_AULAS = conteudo.MODULO_17_AULAS.length;
ap.exercicios.itens.forEach((ex, k) => {
  const ancoras = ANCORAS[ex.id];
  if (!ancoras) throw new Error(`${ex.id} sem âncora`);
  for (const f of ancoras) if (!contem(textoPlano(ex.enunciado_html), f)) throw new Error(`${ex.id}: âncora "${f}" não está no enunciado`);
  const { aula, nota } = vinculoMecanico(ancoras, N_AULAS);
  const linha = ex.origem?.linha_aprox ?? null;
  const item = {
    id: ex.id,
    moduloId: MOD,
    aula,
    origem: 'fonte',
    tipo: 'aberto',
    enunciado: P24(ex.enunciado_html),
    gabarito: null,
    referencia: P24(ex.resposta_referencia_html),
    contaParaCriterioDoDrill: false,
    tolerancia: null,
    verificacao: 'autoavaliacao',
    fonte: { arquivo: ARQ_APARATO, campo: `exercicios.itens[${k}].enunciado_texto`, linha },
    evidencias: [
      { arquivo: ARQ_APARATO, campo: `exercicios.itens[${k}].enunciado_texto`, linha, trecho: P24(ex.enunciado_texto) },
      { arquivo: ARQ_APARATO, campo: `exercicios.itens[${k}].resposta_referencia_texto`, linha, trecho: P24(ex.resposta_referencia_texto) },
    ],
    alertas: [nota, ...(ALERTAS[ex.id] ? [ALERTAS[ex.id]] : [])],
  };
  (aula ? itens : soltos).push(item);
});
const contagem = {};
for (const d of DERIVADOS) {
  contagem[d.aula] = (contagem[d.aula] ?? 0) + 1;
  const id = `m17-a${String(d.aula).padStart(2, '0')}-d${String(contagem[d.aula]).padStart(2, '0')}`;
  const campo = localizar(d.aula, d.evidencia);
  itens.push({
    id,
    moduloId: MOD,
    aula: d.aula,
    origem: 'derivado-da-aula',
    tipo: d.tipo,
    enunciado: d.enunciado,
    ...(d.tipo === 'escolha' ? { alternativas: d.alternativas, gabarito: d.gabarito } : { gabarito: null }),
    referencia: d.evidencia,
    contaParaCriterioDoDrill: false,
    tolerancia: null,
    verificacao: d.tipo === 'escolha' ? 'alternativa-correta' : 'autoavaliacao',
    fonte: { arquivo: ARQ_CONTEUDO, campo, linha: null },
    evidencias: [{ arquivo: ARQ_CONTEUDO, campo, linha: null, trecho: d.evidencia }],
  });
}
itens.sort((a, b) => a.aula - b.aula || (a.origem === b.origem ? 0 : a.origem === 'fonte' ? -1 : 1));

// prova — critério "Critério: 8 de 10" (h2 do §Quiz) = `acertos>=8` do script
const q = ap.avaliacao;
const crit = q.criterio_literal;
const mm = crit.titulo.match(/(\d+) de (\d+)/);
const acertosMinimos = Number(mm[1]);
const total = Number(mm[2]);
if (acertosMinimos !== crit.limiar.acertos || total !== crit.limiar.total || total !== q.perguntas.length) throw new Error('critério da prova não confere');
const faixas = q.faixas_de_placar_script.faixas.map((f) => {
  const m = f.condicao.match(/acertos(>=|<)(\d+)/);
  const v = Number(m[2]);
  return m[1] === '>=' ? { min: v, max: total, mensagem: P24(f.mensagem) } : { min: 0, max: v - 1, mensagem: P24(f.mensagem) };
}).sort((a, b) => b.min - a.min);
// Q15 (decisão de 15/11: caso a caso, na sessão de porte). A explicação da Q7 diz que "a
// diferença entre o teto e a estimativa sem teto é maior que o próprio teto"; os números
// da própria fonte (A05, L2105–2108: teto US$ 325/MW-dia, estimativa sem teto US$ 554,72)
// dão diferença de 229,72, menor que o teto (div-m17-ap-03-q7-teto). Como na Q04, o número
// vence a prosa: a oração passa a dizer o que a fonte diz em outro lugar, com as palavras
// dela ("cerca de 70% acima", INST·07, L4763; 554,72 ÷ 325 = 1,71). Registrado no item.
const CORRECOES = {
  'm17-quiz-q07': {
    de: 'a diferença entre o teto e a estimativa sem teto é maior que o próprio teto',
    para: 'a estimativa sem teto fica cerca de 70% acima dele',
  },
};
const corrigir = (id, s) => {
  const c = CORRECOES[id];
  if (!c) return s;
  if (!s.includes(c.de)) throw new Error(`${id}: trecho a corrigir não encontrado`);
  return s.replace(c.de, c.para);
};
const alertaDe = (id) => {
  const c = CORRECOES[id];
  return c ? [`Q15 (porte M17): trocado «${c.de}» por «${c.para}». Os números da fonte (teto US$ 325/MW-dia, estimativa sem teto US$ 554,72/MW-dia, Aula 05) dão diferença de 229,72, menor que o teto; "cerca de 70% acima" é a forma da própria fonte (INST·07). Ver div-m17-ap-03-q7-teto.`] : undefined;
};
const prova = {
  moduloId: MOD,
  criterio: crit.titulo,
  acertosMinimos,
  total,
  questoes: q.perguntas.map((p, i) => ({
    id: p.id,
    enunciado: P24(p.enunciado_html),
    alternativas: p.alternativas.map((a) => P24(a.texto)),
    correta: p.gabarito.indice,
    explicacao: corrigir(p.id, P24(p.explicacao_html)),
    ...(alertaDe(p.id) ? { alertas: alertaDe(p.id) } : {}),
    fonte: { arquivo: ARQ_APARATO, campo: `avaliacao.perguntas[${i}]`, linha: p.origem?.linha_aprox ?? null },
  })),
  faixas,
  faixasFonte: { arquivo: ARQ_APARATO, campo: 'avaliacao.faixas_de_placar_script', linha: q.faixas_de_placar_script.origem?.linha_aprox ?? null },
  criterioFonte: { arquivo: ARQ_APARATO, campo: 'avaliacao.criterio_literal.titulo', linha: q.titulo?.origem?.linha_aprox ?? null },
};

// checklist
const ck = ap.checklist_final;
const checklist = {
  moduloId: MOD,
  introducao: P24(ck.introducao?.texto ?? ck.titulo.texto),
  itens: ck.itens.map((it, i) => ({
    id: it.id,
    texto: P24(it.texto),
    fonte: { arquivo: ARQ_APARATO, campo: `checklist_final.itens[${i}].texto`, linha: it.origem?.linha_aprox ?? null },
  })),
};

const nFonte = itens.filter((i) => i.origem === 'fonte').length;
const nDer = itens.length - nFonte;
fs.writeFileSync(SAIDA, [
  '// GERADO por tools/alexandria-dados/avaliacao/gerar-avaliacao-m17.mjs — não editar à mão.',
  '// Fonte: docs/alexandria-v2/extraction/m17/aparato.json (fonte, prova, checklist) e o texto das aulas',
  '// em src/lib/data/alexandria-modulo-17-content.ts (derivados). Posse: a sessão de porte do M17.',
  `// ${itens.length} itens por aula (${nFonte} da fonte, ${nDer} derivados) · ${soltos.length} exercício(s) do módulo · ${prova.questoes.length} questões na prova · ${checklist.itens.length} itens no checklist.`,
  '',
  "import type { ChecklistDoModulo, ExercicioDaAula, ExercicioDoModulo, ProvaDoModulo } from '../avaliacao';",
  '',
  `export const EXERCICIOS_DAS_AULAS: ExercicioDaAula[] = ${JSON.stringify(itens, null, 2)};`,
  '',
  '/** Exercícios da fonte sem vínculo mecânico com aula (a aula v3 os mostra na última aula). */',
  `export const EXERCICIOS_DO_MODULO: ExercicioDoModulo[] = ${JSON.stringify(soltos.map((s) => ({ ...s, aula: null })), null, 2)};`,
  '',
  `export const PROVAS: ProvaDoModulo[] = ${JSON.stringify([prova], null, 2)};`,
  '',
  `export const CHECKLISTS: ChecklistDoModulo[] = ${JSON.stringify([checklist], null, 2)};`,
  '',
].join('\n'));
console.log(`m17.dados.ts: ${itens.length} itens (${nFonte} fonte, ${nDer} derivados), ${soltos.length} do módulo, prova ${prova.questoes.length}×${prova.questoes[0].alternativas.length}, critério ${acertosMinimos}/${total}, checklist ${checklist.itens.length}.`);
for (const it of [...itens, ...soltos].filter((i) => i.origem === 'fonte')) console.log(`  ${it.id} → A${it.aula ?? '—'}`);
