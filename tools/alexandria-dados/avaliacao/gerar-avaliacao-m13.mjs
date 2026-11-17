// Gera src/lib/alexandria/avaliacao/m13.dados.ts — exercícios por aula, prova e
// checklist do Módulo 13 no modelo de aula v3. Modelo: tools/alexandria-dados/gerar-avaliacao.mjs (M01).
//
// FONTE ÚNICA:
//   - itens `fonte`, prova e checklist: docs/alexandria-v2/extraction/m13/aparato.json
//     (faixas do placar: modulo.json, criterio m13-crit-quiz);
//   - itens `derivado-da-aula`: o texto da própria aula, lido em
//     src/lib/data/alexandria-modulo-13-content.ts (conferido contra o HTML original por
//     tools/alexandria-dados/porte/verificar-porte-m13.mjs, 0 falta) e localizado no HTML
//     original para a linha.
//
// A FONTE NÃO LIGA EXERCÍCIO A AULA (os 14 têm `aula_vinculada: null`). A aula de cada um é
// decisão de porte, pelo tema do enunciado e da resposta-modelo, registrada em AULA_DO_EXERCICIO
// com a razão — o Founder delegou os exercícios ao LYCEUM (DECISOES-2026-11-15).
//
// Uso: node tools/alexandria-dados/avaliacao/gerar-avaliacao-m13.mjs
// Para (exit 1) se um trecho citado não existir na aula ou no HTML.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { lerFonte, secao, norm, compacto } from '../porte/texto-m12-m13.mjs';
import { textosDasAulas, vincular } from './vinculo-mecanico-m12-m13.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const EXT = 'docs/alexandria-v2/extraction/m13';
const HTML_ARQ = 'Alexandria modulos/alexandria_modulo13.html';
const FONTE_HTML = `C:/dev/GridAlpha v2/${HTML_ARQ}`;
const SAIDA = path.join(RAIZ, 'src/lib/alexandria/avaliacao/m13.dados.ts');

const aparato = JSON.parse(fs.readFileSync(path.join(RAIZ, EXT, 'aparato.json'), 'utf8'));
const modulo = JSON.parse(fs.readFileSync(path.join(RAIZ, EXT, 'modulo.json'), 'utf8'));
const html = lerFonte(FONTE_HTML);
const TEXTOS_VINC = await textosDasAulas(13);
const conteudo = await import(pathToFileURL(path.join(RAIZ, 'src/lib/data/alexandria-modulo-13-content.ts')).href);

// Trocas editoriais decididas, aplicadas ao texto literal antes de entrar no produto.
const TROCAS = [[/GridAlpha/g, 'NIVAR']];
const editorial = (s) => TROCAS.reduce((a, [re, por]) => a.replace(re, por), String(s));

// ── aula de cada exercício da fonte (decisão de porte; a fonte não declara) ──
// A extração anota uma "relacao_tematica_inferida" por exercício (não é vínculo da fonte).
// Ela é seguida, com duas exceções declaradas abaixo.
// (A colocação temática anterior foi substituída pelo vínculo mecânico — ver o cabeçalho.)


const ALERTAS_DO_EXERCICIO = {
  '01': 'O enunciado é o exemplo da fórmula 03.3 (EBITDA R$ 1,0 bi, capital de giro R$ 250 mi, impostos R$ 80 mi, investimento R$ 500 mi → R$ 170 mi), que a leitura da Aula 03 já resolve antes do exercício.',
  '03': 'A fonte dizia "aproximadamente 8,7%" e "passa de meio ponto percentual" na fórmula 02.4; a aula foi corrigida para "aproximadamente 8,6%" e "chega a quase meio ponto percentual" pela conta da própria fórmula (div-m13-taxa-real-8-6-vs-8-7, decidido em 15/11), que é o que esta resposta-modelo e o script dão: 8,64% e 0,45 ponto.',
  '08': 'O INST·05 da Aula 03 traz este trecho com o diagnóstico (categoria, pergunta, impacto): é a resposta. Hoje a AulaV3 só monta o primeiro instrumento da aula (INST·04); se o INST·05 passar a aparecer, abra-o só depois da tentativa.',
  '09': 'Mesmo alerta do Ex·08: o INST·05 traz o diagnóstico deste trecho.',
  '13': 'O enunciado é o caso da seção 04.2, que a leitura resolve antes do exercício; e o INST·07 (Aula 04, segundo instrumento) mostra o mesmo caso.',
  '14': 'O INST·06 da Aula 04 tem este caso hipotético ("fundo com 45% e acordo") e devolve o arquétipo: é a resposta. Abra o instrumento só depois da tentativa.',
};

// ── derivados da aula ─────────────────────────────────────────────────────────
export const ESPECIFICACOES = [
  {
    id: 'm13-a01-d01', aula: 1, tipo: 'aberto',
    enunciado: 'Segundo a aula, por que o P/E é diretamente sensível à alavancagem?',
    evidencias: ['Numerador e denominador pertencem ambos ao acionista. O preço é o que o acionista paga; o lucro é o que sobra depois de o credor ser pago.'],
  },
  {
    id: 'm13-a01-d02', aula: 1, tipo: 'aberto',
    enunciado: 'Em que condições, segundo a aula, o P/E volta a ser o múltiplo adequado?',
    evidencias: ['o lucro é recorrente e normalizado, a estrutura de capital é estável e comparável entre os pares, e a política de dividendos é o eixo da tese.'],
  },
  {
    id: 'm13-a02-d01', aula: 2, tipo: 'aberto',
    enunciado: 'Quando alguém disser "o WACC do setor é 10%", o que a aula manda responder?',
    evidencias: ['a resposta correta não é concordar nem discordar: é perguntar antes ou depois de impostos, e de que segmento.'],
  },
  {
    id: 'm13-a02-d02', aula: 2, tipo: 'escolha',
    enunciado: 'Na tabela dos componentes de um DCF de concessão, o que são os ativos reversíveis?',
    alternativas: [
      'Valor devido pelos investimentos não amortizados ao fim da concessão',
      'Bens que retornam ao poder concedente ao fim do contrato',
      'Aporte exigido por contrato ou por meta de qualidade, independente de retorno',
      'Direito ou expectativa de continuar operando depois do termo',
    ],
    correta: 1,
    evidencias: ['Bens que retornam ao poder concedente ao fim do contrato'],
  },
  {
    id: 'm13-a03-d01', aula: 3, tipo: 'escolha',
    enunciado: 'Segundo a aula, qual dos dois documentos diz quem é a empresa, quem manda nela, o que ela deve, a quem e com que garantia?',
    alternativas: ['O release', 'O Formulário'],
    correta: 1,
    evidencias: ['O Formulário diz quem é a empresa, quem manda nela, o que ela deve, a quem, com que garantia, e o que pode dar errado.'],
  },
  {
    id: 'm13-a04-d01', aula: 4, tipo: 'aberto',
    enunciado: 'Segundo a aula, onde mora o poder de decisão em companhia brasileira?',
    evidencias: ['mora em quatro lugares simultâneos: a tabela de capital votante, o acordo de acionistas, o estatuto social e — cada vez mais — decisões judiciais e termos de conciliação.'],
  },
  {
    id: 'm13-a05-d01', aula: 5, tipo: 'aberto',
    enunciado: 'Por que, segundo a aula, caixa consolidado não é caixa disponível?',
    evidencias: ['Caixa consolidado não é caixa disponível. Um grupo pode divulgar posição de liquidez robusta e ter, na holding, recursos insuficientes para o próprio vencimento — porque a maior parte do caixa está retida em projetos sob bloqueio de distribuição.'],
  },
  {
    id: 'm13-a05-d02', aula: 5, tipo: 'escolha',
    enunciado: 'Entre os dois regimes de debênture incentivada, qual concentra o benefício no emissor?',
    alternativas: ['o regime de 2011', 'o regime de 2024'],
    correta: 1,
    evidencias: ['o regime de 2024 concentra o benefício no emissor, o que reduz o custo depois de imposto.'],
  },
  {
    id: 'm13-a06-d01', aula: 6, tipo: 'escolha',
    enunciado: 'Segundo a aula, o que é risco de crédito?',
    alternativas: ['a probabilidade de a empresa ir mal', 'a probabilidade de que ela não consiga honrar obrigações no vencimento'],
    correta: 1,
    evidencias: ['Risco de crédito não é a probabilidade de a empresa ir mal. É a probabilidade de que ela não consiga honrar obrigações no vencimento'],
  },
  {
    id: 'm13-a06-d02', aula: 6, tipo: 'escolha',
    enunciado: 'Que pedido a associação de bioenergia e combustíveis ajuizou em março de 2026?',
    alternativas: ['recuperação judicial', 'recuperação extrajudicial'],
    correta: 1,
    evidencias: ['ajuizou pedido de recuperação extrajudicial em março de 2026'],
  },
  {
    id: 'm13-a06-d03', aula: 6, tipo: 'aberto',
    enunciado: 'Segundo a aula, como a geração abaixo do previsto se manifesta numa geradora diversificada e numa sociedade de projeto?',
    evidencias: ['A geração abaixo do previsto, numa geradora diversificada, é uma variação de resultado; na sociedade de projeto financiada com cobertura apertada, é um gatilho de bloqueio de dividendo.'],
  },
  {
    id: 'm13-a07-d01', aula: 7, tipo: 'aberto',
    enunciado: 'Na ficha da ENGIE Brasil Energia, por que a distinção entre participação econômica e poder de voto não se aplica?',
    evidencias: ['Capital composto exclusivamente por ações ordinárias, o que torna participação econômica e poder de voto coincidentes'],
  },
  {
    id: 'm13-a07-d02', aula: 7, tipo: 'aberto',
    enunciado: 'Na ficha da Eneva, o maior acionista é o controlador? Que pergunta de verificação a aula propõe?',
    evidencias: ['Maior acionista não é o mesmo que controlador. A pergunta de verificação: existe acordo de acionistas arquivado que agregue votos de mais de um sócio?'],
  },
  {
    id: 'm13-a08-d01', aula: 8, tipo: 'aberto',
    enunciado: 'Segundo a aula, por que a exigência do contraponto não é uma formalidade de prudência?',
    evidencias: ['É o que transforma a tese em objeto testável: uma afirmação que não pode ser derrubada por nenhuma evidência não está dizendo nada.'],
  },
  {
    id: 'm13-a08-d02', aula: 8, tipo: 'aberto',
    enunciado: 'Que frase em três partes a aula pede como conclusão condicional, no fim da hora?',
    evidencias: ['a tese funciona se…; muda se…; ainda falta confirmar…'],
  },
];

// ── texto da aula (produto) e localização no HTML ─────────────────────────────
export function textoDaAula(n) {
  const id = `aula-13-0${n}`;
  const partes = [conteudo.MODULO_13_LEAD[id] ?? ''];
  for (const b of conteudo.MODULO_13_CORPO[id] ?? []) {
    if (b.kind === 'titulo') partes.push(`${b.numero ?? ''} ${b.texto}`);
    else if (b.kind === 'lista') partes.push(...b.itens);
    else if (b.kind === 'tabela') partes.push(...b.linhas.flat());
    else if (b.kind === 'nota') partes.push(b.label ?? '', b.html);
    else if (b.kind === 'formula') partes.push(b.eq, b.desc ?? '');
    else partes.push(b.html ?? '');
  }
  return partes.map(norm).join(' ¶ ');
}

/** Linha do HTML original onde começa o trecho (busca pelos primeiros 50 caracteres). */
export function linhaNoHtml(idSecao, trecho) {
  const s = secao(html, idSecao);
  const linhas = s.html.split('\n');
  let acum = ''; const ini = [];
  for (const l of linhas) { ini.push(acum.length); acum += norm(l) + ' '; }
  const alvo = norm(trecho).slice(0, 50);
  const i = acum.indexOf(alvo);
  if (i < 0) return null;
  let k = 0; while (k + 1 < ini.length && ini[k + 1] <= i) k++;
  return s.linhaIni + k;
}

const falhas = [];
const fonteDe = (campo, linha) => ({ arquivo: `${EXT}/aparato.json`, campo, linha });

// ── itens da fonte ────────────────────────────────────────────────────────────
// Critério: a fonte não declara critério por exercício (`criterio: null` nos 14); o lede
// do §Ex diz como fazer. Esse trecho literal vai no campo.
const ledeEx = aparato.exercicios.lede.texto;
const criterioEx = 'Faça cada um antes de abrir o gabarito; a resposta que se lê sem tentar não treina nada.';
if (!norm(ledeEx).includes(criterioEx)) falhas.push('critério do §Ex não está no lede');
const itens = [];
aparato.exercicios.itens.forEach((x, i) => {
  const num = String(x.ordem).padStart(2, '0');
  const vinc = vincular(`${String(x.tag).replace(/^\d+\s*·\s*/, '')} ${x.enunciado?.texto ?? ''}`, TEXTOS_VINC);
  const aula = vinc.escolhida;
  const resumo = String(x.tag).replace(/^\d+\s*·\s*/, '');
  const enunciado = `<b>${editorial(resumo)}</b><br>${editorial(x.enunciado.html)}`;
  const linha = x.origem?.linha_aprox ?? null;
  const item = {
    id: `m13-ex-${num}`,
    moduloId: 'modulo-13',
    aula,
    origem: 'fonte',
    tipo: 'aberto',
    enunciado,
    gabarito: null,
    referencia: editorial(x.resposta_referencia.html),
    criterio: criterioEx,
    contaParaCriterioDoDrill: true,
    tolerancia: null,
    verificacao: 'autoavaliacao',
    fonte: fonteDe(`exercicios.itens[${i}]`, linha),
    evidencias: [
      { ...fonteDe(`exercicios.itens[${i}].tag`, linha), trecho: editorial(x.tag) },
      { ...fonteDe(`exercicios.itens[${i}].enunciado.texto`, linha), trecho: editorial(x.enunciado.texto) },
      { ...fonteDe(`exercicios.itens[${i}].resposta_referencia.texto`, linha), trecho: editorial(x.resposta_referencia.texto) },
    ],
  };
  if (ALERTAS_DO_EXERCICIO[num]) item.alertas = [ALERTAS_DO_EXERCICIO[num]];
  for (const a of vinc.aulas) item.evidencias.push({ arquivo: HTML_ARQ, campo: `vínculo mecânico · section#a0${a.n}${a.n === aula ? ' (escolhida: a última)' : ''}`, linha: null, trecho: a.trecho });
  itens.push(item);
});

// ── derivados ─────────────────────────────────────────────────────────────────
for (const e of ESPECIFICACOES) {
  const texto = textoDaAula(e.aula);
  const evid = e.evidencias.map((t, k) => {
    if (!compacto(texto).includes(compacto(t))) falhas.push(`${e.id}: evidência ${k} não está no texto da Aula 0${e.aula}: «${t.slice(0, 80)}»`);
    const linha = linhaNoHtml(`a0${e.aula}`, t);
    if (linha === null) falhas.push(`${e.id}: evidência ${k} não localizada no HTML (section#a0${e.aula})`);
    return { arquivo: HTML_ARQ, campo: `section#a0${e.aula}`, linha, trecho: t };
  });
  const item = { id: e.id, moduloId: 'modulo-13', aula: e.aula, origem: 'derivado-da-aula', tipo: e.tipo, enunciado: e.enunciado };
  if (e.tipo === 'escolha') { item.alternativas = e.alternativas; item.gabarito = e.correta; } else item.gabarito = null;
  item.referencia = e.evidencias.join(' ');
  item.contaParaCriterioDoDrill = false;
  item.tolerancia = null;
  item.verificacao = e.tipo === 'escolha' ? 'alternativa-correta' : 'autoavaliacao';
  item.fonte = { arquivo: HTML_ARQ, campo: `section#a0${e.aula}`, linha: evid[0].linha };
  item.evidencias = evid;
  itens.push(item);
}
const soltos = itens.filter((x) => x.aula === null);
for (const x of soltos) itens.splice(itens.indexOf(x), 1);
itens.sort((a, b) => a.aula - b.aula || (a.origem === b.origem ? a.id.localeCompare(b.id) : a.origem === 'fonte' ? -1 : 1));

// ── prova ─────────────────────────────────────────────────────────────────────
const q = aparato.avaliacao;
const PALAVRA = { oito: 8, dez: 10 };
const mc = norm(q.criterio_literal_prosa.texto).match(/O critério é (\w+) de (\w+)\./);
if (!mc) falhas.push('critério do quiz sem "N de M"');
const faixa = (cond) => q.faixas_de_placar_script.find((f) => f.condicao === cond);
const pass = faixa('acertos>=8');
const fail = faixa('acertos<8');
if (!pass || !fail) falhas.push('faixas do placar não encontradas');
const prova = {
  moduloId: 'modulo-13',
  criterio: mc?.[0] ?? '',
  acertosMinimos: PALAVRA[mc?.[1]] ?? null,
  total: PALAVRA[mc?.[2]] ?? null,
  questoes: q.perguntas.map((x, i) => ({
    id: x.id,
    enunciado: editorial(x.enunciado),
    alternativas: x.alternativas.map((a) => editorial(a.texto)),
    correta: x.gabarito.indice,
    explicacao: editorial(x.explicacao?.texto ?? x.explicacao),
    fonte: fonteDe(`avaliacao.perguntas[${i}]`, x.origem?.linha_aprox ?? null),
  })),
  faixas: [
    { min: 0, max: 7, mensagem: editorial(fail.mensagem_texto) },
    { min: 8, max: 10, mensagem: editorial(pass.mensagem_texto) },
  ],
  faixasFonte: fonteDe('avaliacao.faixas_de_placar_script', null),
  criterioFonte: fonteDe('avaliacao.criterio_literal_prosa.texto', q.criterio_literal_prosa.origem?.linha_aprox ?? null),
};

// ── checklist ─────────────────────────────────────────────────────────────────
const ck = aparato.checklist_final;
const checklist = {
  moduloId: 'modulo-13',
  introducao: editorial(ck.lede.texto),
  itens: ck.itens.map((x, i) => ({
    id: `m13-checklist-${String(x.ordem).padStart(2, '0')}`,
    texto: editorial(x.texto),
    fonte: fonteDe(`checklist_final.itens[${i}].texto`, x.origem.linha_aprox),
  })),
};


if (falhas.length) {
  console.error(falhas.map((f) => `FALHA ${f}`).join('\n'));
  process.exit(1);
}

const doAula = itens.filter((x) => x.origem === 'fonte').length;
const der = itens.length - doAula;
const cab = `// GERADO por tools/alexandria-dados/avaliacao/gerar-avaliacao-m13.mjs — não editar à mão.
// Fonte: docs/alexandria-v2/extraction/m13 (aparato.json, modulo.json) e o texto das aulas
// (alexandria-modulo-13-content.ts, conferido contra o HTML original). Conferência:
// tools/alexandria-dados/avaliacao/verificar-avaliacao-m13.mjs. Relatório: docs/alexandria-v3/porte/m13.md.
// ${itens.length} itens por aula (${doAula} da fonte, ${der} derivados) · ${soltos.length} Ex·NN do módulo (sem vínculo mecânico) · ${prova.questoes.length} questões na prova · ${checklist.itens.length} itens no checklist.
// A fonte não liga exercício a aula: cada Ex·NN vai para a última aula com vínculo mecânico, ou fica no módulo (ver o gerador).

import type { ChecklistDoModulo, ExercicioDaAula, ExercicioDoModulo, ProvaDoModulo } from '../avaliacao';

`;
const out =
  cab +
  `export const EXERCICIOS_DAS_AULAS: ExercicioDaAula[] = ${JSON.stringify(itens, null, 2)};\n\n` +
  `export const EXERCICIOS_DO_MODULO: ExercicioDoModulo[] = ${JSON.stringify(soltos, null, 2)};\n\n` +
  `export const PROVAS: ProvaDoModulo[] = ${JSON.stringify([prova], null, 2)};\n\n` +
  `export const CHECKLISTS: ChecklistDoModulo[] = ${JSON.stringify([checklist], null, 2)};\n`;
fs.writeFileSync(SAIDA, out);
console.log(`gerado ${path.relative(RAIZ, SAIDA)}: ${itens.length} itens nas aulas (${doAula} fonte, ${der} derivados), ${soltos.length} do módulo, prova ${prova.questoes.length}, checklist ${checklist.itens.length}`);
