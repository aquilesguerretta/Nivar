// gerar-avaliacao-m09.mjs — escreve src/lib/alexandria/avaliacao/m09.dados.ts.
//
// Fonte única: docs/alexandria-v2/extraction/m09/aparato.json (exercícios do §Ex, quiz
// do §Quiz, checklist do §Final) e o texto das aulas como está em
// src/lib/data/alexandria-modulo-09-content.ts (conferido contra o HTML original por
// tools/alexandria-dados/porte/verificar-porte-m09.mjs). Nada é digitado fora desta
// especificação, e cada trecho citado é procurado por substring antes de escrever: se
// não existir, o gerador PARA.
//
// O VÍNCULO EXERCÍCIO → AULA. A fonte não liga nenhum dos 14 a aula
// (`vinculados_a_aula: 0`). Sem vínculo, eles não aparecem na tela (D04). O vínculo
// aqui é declarado e medido, no espírito da decisão 5: cada exercício vai para a aula
// que contém, literalmente, o trecho que sustenta a resposta de referência — e o
// trecho vai em `evidencias`, com o bloco, para quem conferir. É ancoragem de leitura,
// não afirmação de que a fonte o pôs ali; o alerta do item diz isso.
//
// DERIVADOS. Doze perguntas de recuperação em voz da Alexandria (decisões 7 e 8), nas
// aulas que ficariam com menos de dois itens. A resposta está literalmente no texto da
// aula; em `escolha`, toda alternativa aparece literalmente em alguma aula do M09.
// Nenhum derivado repete pergunta da prova nem cenário de instrumento.
//
// Uso: node tools/alexandria-dados/avaliacao/gerar-avaliacao-m09.mjs

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { RAIZ } from '../porte/porte-m09-m11-comum.mjs';

export const MODULO = 'modulo-09';
const APARATO = 'docs/alexandria-v2/extraction/m09/aparato.json';
const CONTEUDO = 'src/lib/data/alexandria-modulo-09-content.ts';
const SAIDA = path.join(RAIZ, 'src/lib/alexandria/avaliacao/m09.dados.ts');

const ap = JSON.parse(fs.readFileSync(path.join(RAIZ, APARATO), 'utf8'));
const { MODULO_09_CORPO } = await import(pathToFileURL(path.join(RAIZ, CONTEUDO)).href);

// Troca editorial decidida (Q03/P24), aplicada ao texto visível.
export const editorial = (s) => String(s).replace(/GridAlpha/g, 'NIVAR');
export const texto = (s) => String(s ?? '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

/** Texto plano de um bloco da aula (o que o aluno lê). */
export function textoDoBloco(b) {
  if (!b) return '';
  if (b.kind === 'tabela') return texto(b.linhas.map((l) => l.join(' — ')).join(' · '));
  if (b.kind === 'lista') return texto(b.itens.join(' · '));
  if (b.kind === 'titulo') return texto(`${b.numero ?? ''} ${b.texto}`);
  return texto(`${b.label ? b.label + ' ' : ''}${b.html ?? ''}`);
}
const idAula = (n) => `aula-09-0${n}`;
export const blocoDaAula = (n, i) => MODULO_09_CORPO[idAula(n)]?.[i];

/** Confere que o trecho está no bloco; senão para. */
function evidencia(n, bloco, trecho) {
  const t = textoDoBloco(blocoDaAula(n, bloco));
  if (!t.includes(trecho)) throw new Error(`A${n} bloco ${bloco}: trecho ausente «${trecho.slice(0, 80)}»`);
  return { arquivo: CONTEUDO, campo: `MODULO_09_CORPO['${idAula(n)}'][${bloco}]`, linha: null, trecho };
}

// ── vínculo dos 14 exercícios da fonte: termo mecânico ──────────────────────
// Regra de colocação de 15/11 (docs/alexandria-v3/PORTE-POR-MODULO.md): o exercício
// solto vai para a ÚLTIMA aula cujo texto contém, literalmente, o termo; sem casamento,
// fica em EXERCICIOS_DO_MODULO. O termo é escolhido aqui, uma vez, e precisa estar
// literalmente no próprio exercício (enunciado ou resposta de referência) — o gerador
// confere as duas pontas e para se faltar uma. Comparação sem diferença de caixa.
export const TERMOS = {
  'm09-ex-01': 'fatura única',
  'm09-ex-02': 'elétron',
  'm09-ex-03': 'produto padrão',
  'm09-ex-04': 'realocação',
  'm09-ex-05': 'horizonte operacional',
  'm09-ex-06': 'denúncia',
  'm09-ex-07': 'cobertura anual',
  'm09-ex-08': 'risco de crédito',
  'm09-ex-09': 'totalidade da carga',
  'm09-ex-10': 'volume plano',
  'm09-ex-11': 'devolução da sobra',
  'm09-ex-12': 'reequilíbrio',
  'm09-ex-13': 'tudo incluso',
  'm09-ex-14': 'ampliações',
};

/** Aulas cujo texto contém o termo; para cada uma, o primeiro bloco que o contém. */
export function casamentos(termo) {
  const t = termo.toLowerCase();
  const out = [];
  for (let n = 1; n <= 8; n++) {
    const bs = MODULO_09_CORPO[idAula(n)] ?? [];
    const i = bs.findIndex((b) => textoDoBloco(b).toLowerCase().includes(t));
    if (i >= 0) out.push({ aula: n, bloco: i });
  }
  return out;
}

// ── os doze derivados ───────────────────────────────────────────────────────
// resposta: em `escolha`, o índice certo; o texto dessa alternativa está no trecho.
export const DERIVADOS = [
  { id: 'm09-a02-d01', aula: 2, tipo: 'aberto', bloco: 8,
    enunciado: 'Segundo a aula, o que significa a sobra contratual de uma distribuidora — e o que ela não significa?',
    trecho: 'Sobra contratual não significa energia física desperdiçada. Significa que a posição contratada da distribuidora excede a necessidade reconhecida.' },
  { id: 'm09-a02-d02', aula: 2, tipo: 'escolha', bloco: 14,
    enunciado: 'Para energia de novos empreendimentos, qual é hoje a janela legal de antecedência da entrega, contada a partir da licitação?',
    alternativas: ['cento e oitenta dias', 'vinte e quatro meses', 'de três a sete anos'], certa: 2,
    trecho: 'A janela de antecedência da energia nova, portanto, é hoje uma faixa legal de três a sete anos' },
  { id: 'm09-a02-d03', aula: 2, tipo: 'aberto', bloco: 30,
    enunciado: 'O consumidor livre não paga bandeira sobre a energia contratada. Por que, segundo a aula, isso não é uma economia?',
    trecho: 'o consumidor livre não paga bandeira sobre a energia contratada, e isso não é uma economia. É uma troca de mecanismo. Ele passa a pagar, sobre a parcela descoberta, o preço horário do submercado — que pode ser menor que o adicional de bandeira, ou várias vezes maior, na mesma semana.' },
  { id: 'm09-a03-d01', aula: 3, tipo: 'escolha', bloco: 0,
    enunciado: 'Em 1º de janeiro de 2024, para quem a abertura do ambiente livre foi ampliada, sem exigência de carga mínima como teste geral?',
    alternativas: ['cargas acima de 10 MW', 'todos os consumidores do Grupo A', 'consumidores atendidos em tensão inferior a 2,3 kV'], certa: 1,
    trecho: 'a abertura foi ampliada para todos os consumidores do Grupo A' },
  { id: 'm09-a03-d02', aula: 3, tipo: 'aberto', bloco: 19,
    enunciado: 'Segundo a aula, quem arca com os custos do déficit involuntário do supridor de última instância, e por qual meio?',
    trecho: 'os custos e efeitos financeiros decorrentes do déficit involuntário do supridor de última instância serão rateados entre todos os consumidores do ambiente livre, por meio de encargo tarifário específico, conforme regulamentação.' },
  { id: 'm09-a06-d01', aula: 6, tipo: 'escolha', bloco: 0,
    enunciado: 'Desde 2021, em que base o preço de liquidação das diferenças é calculado e publicado?',
    alternativas: ['em base mensal', 'em base horária', 'por patamar'], certa: 1,
    trecho: 'Desde 2021 é calculado e publicado em base horária, para os quatro submercados.' },
  { id: 'm09-a06-d02', aula: 6, tipo: 'escolha', bloco: 2,
    enunciado: 'Segundo a aula, o que determina a exposição de uma empresa ao preço de curto prazo?',
    alternativas: ['o tamanho da fábrica', 'o preço do contrato', 'o desenho contratual'], certa: 2,
    trecho: 'O que determina a exposição é o desenho contratual — não o tamanho da fábrica nem o preço do contrato.' },
  { id: 'm09-a06-d03', aula: 6, tipo: 'aberto', bloco: 8,
    enunciado: 'Por que, segundo a aula, usar o preço de curto prazo de hoje para justificar um contrato de cinco anos é um erro — e em que sentido esse erro é simétrico?',
    trecho: 'Usar o preço de hoje para justificar contrato de cinco anos é erro de horizonte, e ele é simétrico — quem se recusa a contratar porque o preço está alto hoje comete o mesmo erro com o sinal trocado.' },
  { id: 'm09-a07-d01', aula: 7, tipo: 'escolha', bloco: 9,
    enunciado: 'Que limite a Lei nº 15.269/2025 impôs às revisões ordinárias de garantia física das usinas participantes do mecanismo?',
    alternativas: ['cinquenta por cento', 'cinco por cento por revisão, e dez por cento no total acumulado ao longo da vigência da outorga', 'limitada a sete anos'], certa: 1,
    trecho: 'cinco por cento por revisão, e dez por cento no total acumulado ao longo da vigência da outorga' },
  { id: 'm09-a07-d02', aula: 7, tipo: 'aberto', bloco: 1,
    enunciado: 'Segundo a aula, o que acontece quando o fator de ajuste fica abaixo de um — e quando fica acima?',
    trecho: 'Se ele fica abaixo de um, a alocação de cada participante é proporcionalmente menor que a referência, e quem tiver posição contratual acima da energia alocada precisa comprar a diferença no mercado de curto prazo. Se fica acima de um, há energia secundária a ser distribuída conforme as regras.' },
  { id: 'm09-a08-d01', aula: 8, tipo: 'escolha', bloco: 3,
    enunciado: 'Na tabela de sinais de cautela, por que um contrato de rede sem janela próxima recomenda adiar a migração?',
    alternativas: [
      'Montante mínimo, multa e sobra podem superar qualquer ganho, e o risco é assimétrico',
      'A data de migração não é executável, e comprar energia para data impossível cria exposição imediata',
      'Não há como dimensionar estrutura; qualquer contrato assinado é aposta com nome técnico',
    ], certa: 1,
    trecho: 'Contrato de rede sem janela próxima — A data de migração não é executável, e comprar energia para data impossível cria exposição imediata' },
  { id: 'm09-a08-d02', aula: 8, tipo: 'aberto', bloco: 0,
    enunciado: 'Segundo a aula, qual é a competência escassa de um analista de migração, e qual é a mais escassa ainda?',
    trecho: 'A competência escassa é o "não" fundamentado, e a competência mais escassa ainda é o "não é possível concluir com o que foi apresentado" dito sem constrangimento.' },
];

function gerar() {
  const exs = ap.exercicios.itens;
  const EXERCICIOS_DAS_AULAS = [];
  const EXERCICIOS_DO_MODULO = [];
  for (const e of exs) {
    const termo = TERMOS[e.id];
    if (!termo) throw new Error(`exercício sem termo: ${e.id}`);
    const doEx = texto(`${e.enunciado.html} ${e.resposta_de_referencia.map((r) => r.html).join(' ')}`).toLowerCase();
    if (!doEx.includes(termo.toLowerCase())) throw new Error(`${e.id}: o termo «${termo}» não está no próprio exercício`);
    const casa = casamentos(termo);
    const ultima = casa.at(-1) ?? null;
    const aula = ultima ? ultima.aula : null;
    const ref = e.resposta_de_referencia.map((r) => editorial(r.html)).join('<br><br>');
    let evAula = null;
    if (ultima) {
      const t = textoDoBloco(blocoDaAula(ultima.aula, ultima.bloco));
      const k = t.toLowerCase().indexOf(termo.toLowerCase());
      evAula = evidencia(ultima.aula, ultima.bloco, t.slice(k, k + termo.length));
    }
    const lista = aula ? EXERCICIOS_DAS_AULAS : EXERCICIOS_DO_MODULO;
    lista.push({
      id: e.id,
      moduloId: MODULO,
      aula,
      origem: 'fonte',
      tipo: 'aberto',
      enunciado: editorial(e.enunciado.html),
      gabarito: null,
      referencia: ref,
      contaParaCriterioDoDrill: false,
      tolerancia: null,
      verificacao: 'autoavaliacao',
      fonte: { arquivo: APARATO, campo: `exercicios.itens[${exs.indexOf(e)}].enunciado`, linha: e.origem.linha_aprox },
      evidencias: [
        { arquivo: APARATO, campo: `exercicios.itens[${exs.indexOf(e)}].enunciado.texto`, linha: e.origem.linha_aprox, trecho: editorial(e.enunciado.texto) },
        ...(evAula ? [evAula] : []),
      ],
      alertas: [
        aula
          ? `Vínculo mecânico: a fonte não liga o ${e.tag} a nenhuma aula (§Ex, ${e.bloco}). O termo «${termo}», que está no exercício, aparece literalmente ${casa.length === 1 ? 'só na Aula ' + String(casa[0].aula).padStart(2, '0') + ', e o exercício vai para ela' : 'nas Aulas ' + casa.map((c) => String(c.aula).padStart(2, '0')).join(', ') + ', e o exercício vai para a última'} (regra de colocação de 15/11).`
          : `A fonte não liga o ${e.tag} a nenhuma aula (§Ex, ${e.bloco}), e o termo «${termo}» não aparece em nenhuma aula: fica nos exercícios do módulo (regra de colocação de 15/11).`,
      ],
    });
  }
  for (const d of DERIVADOS) {
    const ev = evidencia(d.aula, d.bloco, d.trecho);
    const item = {
      id: d.id,
      moduloId: MODULO,
      aula: d.aula,
      origem: 'derivado-da-aula',
      tipo: d.tipo,
      enunciado: d.enunciado,
      ...(d.tipo === 'escolha' ? { alternativas: d.alternativas, gabarito: d.certa } : { gabarito: null }),
      referencia: d.trecho,
      contaParaCriterioDoDrill: false,
      tolerancia: null,
      verificacao: d.tipo === 'escolha' ? 'alternativa-correta' : 'autoavaliacao',
      fonte: { arquivo: CONTEUDO, campo: ev.campo, linha: null },
      evidencias: [ev],
    };
    EXERCICIOS_DAS_AULAS.push(item);
  }
  EXERCICIOS_DAS_AULAS.sort((a, b) => a.aula - b.aula || (a.origem === b.origem ? 0 : a.origem === 'fonte' ? -1 : 1));

  // ── prova ──
  const av = ap.avaliacao;
  const crit = 'Oito acertos em dez é o critério.';
  if (!av.introducao.texto.startsWith(crit)) throw new Error('critério literal mudou');
  const PROVAS = [{
    moduloId: MODULO,
    criterio: crit,
    acertosMinimos: 8,
    total: 10,
    questoes: av.perguntas.map((q) => ({
      id: q.id,
      enunciado: editorial(q.enunciado),
      alternativas: q.alternativas.map((a) => editorial(a.texto)),
      correta: q.gabarito.numero - 1,
      explicacao: editorial(q.explicacao),
      fonte: { arquivo: APARATO, campo: `avaliacao.perguntas[${av.perguntas.indexOf(q)}]`, linha: q.origem.linha_aprox },
    })),
    faixas: [
      { min: 8, max: 10, mensagem: av.faixas_de_placar_script.faixas[0].mensagem },
      { min: 0, max: 7, mensagem: av.faixas_de_placar_script.faixas[1].mensagem },
    ],
    faixasFonte: { arquivo: APARATO, campo: 'avaliacao.faixas_de_placar_script', linha: av.faixas_de_placar_script.origem.linha_aprox },
    criterioFonte: { arquivo: APARATO, campo: 'avaliacao.introducao', linha: av.introducao.origem.linha_aprox },
  }];

  // ── checklist ──
  const ck = ap.checklist_final;
  const CHECKLISTS = [{
    moduloId: MODULO,
    introducao: editorial(ck.introducao.html),
    itens: ck.itens.map((i) => ({ id: i.id, texto: editorial(i.html), fonte: { arquivo: APARATO, campo: `checklist_final.itens[${ck.itens.indexOf(i)}]`, linha: i.linha_aprox ?? null } })),
  }];

  return { EXERCICIOS_DAS_AULAS, EXERCICIOS_DO_MODULO, PROVAS, CHECKLISTS };
}

export const DADOS = gerar();

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { EXERCICIOS_DAS_AULAS, EXERCICIOS_DO_MODULO, PROVAS, CHECKLISTS } = DADOS;
  const ts = `// Avaliação do M09 (exercícios por aula, prova, checklist). Posse: a sessão de porte do M09.
// GERADO por tools/alexandria-dados/avaliacao/gerar-avaliacao-m09.mjs — não editar à mão.
// Conferido por tools/alexandria-dados/avaliacao/verificar-avaliacao-m09.mjs.
import type { ChecklistDoModulo, ExercicioDaAula, ExercicioDoModulo, ProvaDoModulo } from '../avaliacao';

export const EXERCICIOS_DAS_AULAS: ExercicioDaAula[] = ${JSON.stringify(EXERCICIOS_DAS_AULAS, null, 2)};

/** Exercícios da fonte cujo termo não casa com nenhuma aula (regra de colocação de 15/11). */
export const EXERCICIOS_DO_MODULO: ExercicioDoModulo[] = ${JSON.stringify(EXERCICIOS_DO_MODULO, null, 2)};

export const PROVAS: ProvaDoModulo[] = ${JSON.stringify(PROVAS, null, 2)};

export const CHECKLISTS: ChecklistDoModulo[] = ${JSON.stringify(CHECKLISTS, null, 2)};
`;
  fs.writeFileSync(SAIDA, ts);
  const porAula = {};
  for (const e of EXERCICIOS_DAS_AULAS) porAula[e.aula] = (porAula[e.aula] ?? []).concat(e.origem === 'fonte' ? 'F' : 'D');
  console.log(`escrito ${path.relative(RAIZ, SAIDA)}: ${EXERCICIOS_DAS_AULAS.length} itens por aula ${JSON.stringify(porAula)} · do módulo ${EXERCICIOS_DO_MODULO.map((e) => e.id).join(', ') || 'nenhum'} · prova ${PROVAS[0].questoes.length} · checklist ${CHECKLISTS[0].itens.length}`);
}
