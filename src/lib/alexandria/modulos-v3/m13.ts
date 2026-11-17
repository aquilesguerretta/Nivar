// Módulo 13 no modelo de aula v3. Posse: a sessão de porte do M13.
// Relatório: docs/alexandria-v3/porte/m13.md.
//
// PREVISÕES. Os onze instrumentos foram portados nesta rodada (calculadoras/m13.ts).
// Três têm saída NUMÉRICA — 02, 03 e 08 — e são justamente os primeiros das suas aulas
// (A01, A02, A05). Um quarto, o 06 (arquétipo de controle), tem previsão por ESCOLHA: o
// cálculo aponta um dos seis arquétipos. Sem previsão, com registro no relatório: o 05 (o
// trecho do cenário-padrão é o do Ex·08, exercício do módulo que só aparece na Aula 08) e
// os de consulta (01, 04, 07, 09, 10, 11), cujo cálculo não aponta uma opção.
//
// Cenário = valores padrão do instrumento; a pergunta junta rótulo, valor e unidade dos
// campos. O calculado é a calculadora rodando sobre o cenário.
//
// O VÉU. Nenhum trecho da leitura escreve o calculado das três previsões (5,5× no INST·02;
// 1,6% no INST·03; 1,41× no INST·08). A tabela de fontes e usos da A05 mostra 2.100 e
// 1.470 — entradas e dívida do cenário —, não a cobertura. As notas são intro + disc da
// fonte e não interpretam o cenário: `velarNota: false`.
//
// INST·03 E O EX·03. Com o prêmio de 0,5 p.p., a "Taxa real de desconto" do cenário
// (9,14%) entrega a taxa real implícita do Ex·03 (8,64%, a resposta dele). O cálculo e os
// controles do INST·03 só abrem depois da tentativa do Ex·03 (`abreDepoisDoExercicio`).
//
// FIGURAS. Nenhuma nesta rodada (ver o relatório).

import type { ModuloV3 } from './tipos';
import { M13_ARQUETIPOS } from '@/lib/data/calculadoras/m13';

export const MODULO_V3: ModuloV3 = {
  moduloId: 'modulo-13',
  pronto: true,
  figuras: [],
  trechos: {},
  diagramas: {},
  previsoes: [
    {
      // A01 · fim de 01.3 (bloco 13): "É por isso que o instrumento a seguir se recusa a
      // classificar qualquer coisa sem cruzar pelo menos dois sinais."
      instrumentoId: 'm13-inst-02',
      depoisDoBloco: 13,
      cenario: { 'mu-eq-n': 30, 'mu-dl-n': 25, 'mu-eb-n': 10, 'mu-jf-n': 30, 'mu-da-n': 25, 'mu-tx-n': 34 },
      pergunta:
        'Uma companhia tem valor de mercado do capital próprio de R$ 30 bi, dívida líquida de R$ 25 bi e EBITDA dos últimos doze meses de R$ 10 bi. Qual é o EV / EBITDA?',
      grandeza: { tipo: 'numero', saida: 'mu-ee', unidade: '×', casas: 1 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 02',
    },
    {
      // A02 · depois do painel de três níveis de 02.4 (bloco 21); na fonte o INST·03 vem
      // logo depois dele. A pergunta é sobre o peso da indenização — o "valor terminal"
      // de uma concessão, que a aula diz ser pequeno e documentado.
      instrumentoId: 'm13-inst-03',
      depoisDoBloco: 21,
      cenario: {
        'dc-se-n': 14.25,
        'dc-ip-n': 5.16,
        'dc-pr-n': 0.5,
        'dc-hz-n': 20,
        'dc-f1-n': 900,
        'dc-gr-n': 1,
        'dc-in-n': 1200,
        'dc-pi-n': 70,
      },
      pergunta:
        'Concessão com 20 anos remanescentes, fluxo de caixa livre real de R$ 900 mi no ano 1 crescendo 1% a.a., indenização estimada de R$ 1.200 mi no termo com 70% de probabilidade de recebimento; Selic nominal de 14,25% a.a., inflação projetada de 5,16% a.a. e prêmio de 0,5 p.p. Que porcentagem do valor da firma vem da indenização?',
      grandeza: { tipo: 'numero', saida: 'dc-pw', unidade: '%', casas: 1 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 03',
      abreDepoisDoExercicio: 'm13-ex-03',
    },
    {
      // A05 · depois da caixa "O erro clássico, e ele é frequente" (bloco 15), que fecha 05.4;
      // na fonte o INST·08 vem logo depois dela.
      instrumentoId: 'm13-inst-08',
      depoisDoBloco: 15,
      cenario: {
        'ds-cx-n': 2100,
        'ds-al-n': 70,
        'ds-kd-n': 7.5,
        'ds-pz-n': 15,
        'ds-cf-n': 235,
        'ds-mn-n': 1.25,
        'ds-lk-n': 1.35,
        'ds-ch-n': 10,
      },
      pergunta:
        'Projeto de R$ 2.100 mi, 70% financiado por dívida a custo real de 7,5% a.a., amortizada em 15 anos, com CFADS de R$ 235 mi no ano 1. Qual é o DSCR base?',
      grandeza: { tipo: 'numero', saida: 'ds-d0', unidade: '×', casas: 2 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 08',
    },
    {
      // A04 · depois da caixa "A lição estrutural" (bloco 11), que fecha 04.3; na fonte o
      // INST·06 vem logo depois dela. Cenário-padrão: AXIA Energia (c1). A 04.3 descreve o
      // mecanismo (voto estatutariamente limitado a um teto) sem dar o nome do arquétipo;
      // o calculado é `textos['ct-arq']`, casado com o rótulo de um dos seis arquétipos.
      instrumentoId: 'm13-inst-06',
      depoisDoBloco: 11,
      cenario: { 'ct-grid': 'c1' },
      pergunta: 'Em que arquétipo de controle cai a AXIA Energia?',
      grandeza: {
        tipo: 'escolha',
        saida: 'ct-arq',
        opcoes: Object.entries(M13_ARQUETIPOS).map(([valor, a]) => ({ valor, rotulo: a.n })),
      },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valor padrão do instrumento 06',
    },
  ],
};
