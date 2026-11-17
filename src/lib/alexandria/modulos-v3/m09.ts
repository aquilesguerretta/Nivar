// Módulo 09 no modelo de aula v3. Posse: a sessão de porte do M09.
//
// PREVISÕES. Pelas regras de previsoes.ts: o cenário é o padrão do instrumento, a
// grandeza é uma saída da calculadora (calculadoras/m09.ts), e a pergunta só junta
// rótulo, valor e unidade que a fonte escreve, em voz da Alexandria (decisão 7). O
// calculado é sempre a calculadora rodando no cenário.
//
// Quatro dos onze têm previsão: INST·02, ·05, ·07 e ·08, os que imprimem número.
// Os outros não têm, e o motivo está registrado em docs/alexandria-v3/porte/m09.md:
//   · INST·01 (§MAP, na A01), ·03, ·06, ·10 e ·11: exploradores de consulta. Nenhum
//     cálculo aponta uma opção — a escolha é do aluno —, então nem a previsão por
//     escolha cabe (regra de PORTE-POR-MODULO.md, 15/11).
//   · INST·04: o cenário padrão é Grupo A, e o estado ("elegível hoje") já está dito
//     na própria A03, bloco 0, antes do instrumento — a previsão seria recuperação.
//     O cenário da baixa tensão não é o padrão nem o da nota.
//   · INST·09: o cenário padrão é "nenhuma resposta", e a regra exige o cenário
//     padrão ou o da nota.
//
// VÉU. Nenhuma prosa das aulas 01, 04, 06 e 07 escreve o calculado (medido: 15,0 /
// 150 MWh / 3,0 / 92 / "três camadas" / "quatro" componentes não aparecem no corpo
// antes nem depois do instrumento). A nota de cada instrumento é a intro + aviso da
// fonte, que não interpreta o cenário padrão: `velarNota: false`. As duas fotos
// (A02, A07) não ficam perto de instrumento com previsão e não desenham cenário.
//
// ÂNCORA. `depoisDoBloco` é o bloco que a extração registra como `local.bloco_antes`
// do instrumento (instrumentos.json), contado em MODULO_09_CORPO.
//
// FIGURAS. Duas fotos reais, revisadas e aprovadas em 15/11/2026 (página do Commons,
// licença, SHA1): docs/alexandria-v3/procedencia/m09.md. As três outras linhas m09-*
// do registro v2 são gravura (estética) e ficam fora da aula pela regra do Founder.
// Nenhum diagrama: as relações do M09 já estão desenhadas pelos instrumentos.

import type { ModuloV3 } from './tipos';

const BASE = '/alexandria/v3/aulas/m09/';
const commons = (arquivo: string) => `https://commons.wikimedia.org/wiki/File:${arquivo.replace(/ /g, '_')}`;

export const MODULO_V3: ModuloV3 = {
  moduloId: 'modulo-09',
  pronto: true,
  figuras: [
    {
      id: 'm09-a02-candiota',
      moduloId: 'modulo-09',
      aula: 2,
      classe: 'foto',
      ancora: 'm09-a02-b18-paragrafo',
      arquivo: BASE + 'm09v3-a02-candiota',
      larguras: [1000, 2000],
      dimensoes: [1000, 750],
      alt: 'Torre de transmissão metálica em primeiro plano, com cabos e isoladores. Ao fundo, um complexo termelétrico: blocos de caldeira, chaminés altas e uma torre de resfriamento, sob céu azul com nuvens.',
      legenda: 'Complexo termelétrico de Candiota (RS), com uma torre de linha de transmissão em primeiro plano, em dezembro de 2023.',
      credito: 'foto · Ryan Garcia · CC BY 2.0',
      fonte: commons('Linha de transmissão e Complexo termoelétrico de Candiota.jpg'),
    },
    {
      id: 'm09-a07-sobradinho',
      moduloId: 'modulo-09',
      aula: 7,
      classe: 'foto',
      ancora: 'm09-a07-b04-paragrafo',
      arquivo: BASE + 'm09v3-a07-sobradinho',
      larguras: [1000, 2000],
      dimensoes: [1000, 562],
      alt: 'Leito seco de reservatório coberto de lama rachada e conchas no primeiro plano. Ao fundo, a água recuada, troncos de árvores mortas e morros baixos do semiárido sob céu claro.',
      legenda: 'Leito exposto do reservatório de Sobradinho, no rio São Francisco, em Remanso (BA), em dezembro de 2015.',
      credito: 'foto · Marcello Casal Jr./Agência Brasil · CC BY 3.0 BR',
      fonte: commons('Seca em Sobradinho 08.jpg'),
    },
  ],
  trechos: {
    'm09-a02-b18-paragrafo': 'comum em termelétricas, o vendedor recebe receita fixa',
    'm09-a07-b04-paragrafo': 'Fator de ajuste persistentemente abaixo de um',
  },
  diagramas: {},
  previsoes: [
    {
      // A01 · fim do Eixo 1b (bloco 15, "Do mesmo modo, o consumidor livre…"),
      // antes do h3 "Eixo 2". Contagem pelos dados (D16, QA-M09-A01): 1/4/3/2.
      instrumentoId: 'm09-inst-02',
      depoisDoBloco: 15,
      cenario: {},
      pergunta:
        'Dos dez componentes do custo de eletricidade de uma unidade industrial, quantos mudam de mecanismo quando ela migra, mas continuam devidos à mesma contraparte?',
      grandeza: { tipo: 'numero', saida: 'm09-cmp-c2', unidade: null, casas: 0 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'dados do instrumento 02',
    },
    {
      // A04 · fim de 04.5 (bloco 31), antes do destaque "Onde isso entra no produto".
      instrumentoId: 'm09-inst-05',
      depoisDoBloco: 31,
      cenario: {},
      pergunta:
        'Um contrato de até 12 meses, com entrega plana, rígido, sem banda, preço nominal fixo e entrega no mesmo submercado do consumo. Quantas camadas de risco ficam descobertas?',
      grandeza: { tipo: 'numero', saida: 'm09-mc-r4', unidade: null, casas: 0 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 05',
    },
    {
      // A06 · depois do três-níveis "Exposição ao preço de curto prazo" (bloco 11),
      // antes do destaque de produto. Entrega plana (o padrão do seletor).
      instrumentoId: 'm09-inst-07',
      depoisDoBloco: 11,
      cenario: { 'm09-ex-c': 1000, 'm09-ex-s': 15, 'm09-ex-h': 20, 'm09-ex-v': 100, 'm09-ex-f': 10 },
      pergunta:
        'Uma unidade consome em média 1.000 MWh por mês, com amplitude sazonal de ± 15% ao mês e dispersão horária de ± 20% na hora. Ela contratou 100% do consumo médio, em entrega plana, com banda de flexibilidade de ± 10%. Que parte do consumo fica descoberta?',
      grandeza: { tipo: 'numero', saida: 'm09-ex-p', unidade: '%', casas: 1 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 07',
    },
    {
      // A07 · fim de 07.2 (bloco 9), antes do três-níveis "Fator de ajuste". O fator
      // (0,92) fica no padrão do campo: o quadro do cenário só escreve uma casa.
      instrumentoId: 'm09-inst-08',
      depoisDoBloco: 9,
      cenario: { 'm09-gs-g': 100, 'm09-gs-v': 95 },
      pergunta:
        'Uma hidrelétrica tem garantia física de 100 MW médios e vendeu 95% dela. O fator de ajuste do conjunto foi 0,92. Qual é a diferença a liquidar entre a posição contratada e a energia alocada?',
      grandeza: { tipo: 'numero', saida: 'm09-gs-d', unidade: 'MW médios', casas: 1 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 08',
    },
  ],
};
