// Módulo 11 no modelo de aula v3. Posse: a sessão de porte do M11.
//
// PREVISÕES (regras de previsoes.ts): cenário padrão do instrumento; grandeza = saída da
// calculadora (calculadoras/m11.ts, código literal da fonte); pergunta em voz da
// Alexandria (decisão 7) com rótulos, valores e unidades da fonte. Âncora: o
// `localizacao.antes` da extração (m11/instrumentos.json), contado em MODULO_11_CORPO.
//
// Cinco dos onze têm previsão: INST·04 e ·05 (escolha entre as categorias que a própria
// saída imprime) e INST·06, ·07, ·08 (número). Os outros não, com motivo em
// docs/alexandria-v3/porte/m11.md:
//   · INST·01, ·02, ·03, ·09, ·11: exploradores de consulta (nenhum cálculo aponta opção).
//   · INST·10: o padrão é "tudo confere" nos quatro eixos, e a saída ("Proposta sólida")
//     é a leitura direta das entradas — não há o que prever.
//
// VÉU. Medido: nenhuma prosa das Aulas 03–06 escreve o calculado do cenário (92,2%, 1,8%,
// 74,7%, "Minigeração distribuída" para 180 kW, "GD I" para o protocolo até 7/1/2022). A
// A03 e a A04 definem as categorias — a previsão é aplicá-las ao cenário. A nota de cada
// instrumento é intro + nota de fonte, sem interpretar o cenário: `velarNota: false`.
//
// O quadro do cenário só escreve uma casa decimal: valores com duas (0,55%/ano) ficam no
// padrão do campo e na pergunta, não no `cenario`.

//
// FIGURAS: três fotos reais do Commons, revisadas em docs/alexandria-v3/procedencia/m11.md
// (licença e SHA1 iguais aos do Commons). As quatro geradas do v2 ficam fora: gravura.

import type { ModuloV3 } from './tipos';

const BASE = '/alexandria/v3/aulas/m11/';
const commons = (arquivo: string) => `https://commons.wikimedia.org/wiki/File:${arquivo.replace(/ /g, '_')}`;

export const MODULO_V3: ModuloV3 = {
  moduloId: 'modulo-11',
  pronto: true,
  figuras: [
    {
      id: 'm11-a05-piranometro',
      moduloId: 'modulo-11',
      aula: 5,
      classe: 'foto',
      ancora: 'm11-a05-b04-paragrafo',
      arquivo: BASE + 'm11v3-a05-piranometro',
      larguras: [1000, 2000],
      dimensoes: [1000, 667],
      alt: 'Sensor branco em forma de cúpula, com uma lente de vidro no topo, parafusado numa barra metálica da estrutura, entre duas fileiras de módulos fotovoltaicos.',
      legenda: 'Piranômetro (sensor de irradiância) instalado na estrutura de um arranjo fotovoltaico, entre as fileiras de módulos, em abril de 2016.',
      credito: 'foto · EKO Instruments Co., Ltd. · CC BY-SA 4.0',
      fonte: commons('MS-80S Pyranometer installed on solar panel array.jpg'),
    },
    {
      id: 'm11-a06-limpeza',
      moduloId: 'modulo-11',
      aula: 6,
      classe: 'foto',
      ancora: 'm11-a06-b08-paragrafo',
      arquivo: BASE + 'm11v3-a06-limpeza',
      larguras: [1000, 2000],
      dimensoes: [1000, 794],
      alt: 'Fileira de módulos fotovoltaicos inclinados sobre um telhado plano. Uma escova dupla rotativa, na ponta de uma haste longa segurada por uma pessoa à esquerda, espalha água sobre os módulos; a parte já limpa aparece mais escura que a parte ainda empoeirada.',
      legenda: 'Limpeza de módulos fotovoltaicos com escova rotativa de haste longa, num telhado em Dornbirn (Áustria), em maio de 2026. Recorte da foto original.',
      credito: 'foto · Asurnipal · CC BY-SA 4.0 · recorte',
      fonte: commons('Dornbirn-Photovoltaic module cleaning-14ASD.jpg'),
    },
    {
      id: 'm11-a07-modulo-trincado',
      moduloId: 'modulo-11',
      aula: 7,
      classe: 'foto',
      ancora: 'm11-a07-b02-paragrafo',
      arquivo: BASE + 'm11v3-a07-modulo-trincado',
      larguras: [1000, 2000],
      dimensoes: [1000, 548],
      alt: 'Close de um módulo fotovoltaico de células redondas, com o vidro frontal trincado em toda a superfície; à esquerda, as trincas irradiam de um ponto em padrão de estrela.',
      legenda: 'Módulo fotovoltaico com o vidro trincado, perto de Leh (Índia), em julho de 2009. A fonte não indica a causa do dano. Recorte da foto original.',
      credito: 'foto · Kiran Jonnalagadda · CC BY-SA 2.0 · recorte',
      fonte: commons('Cracked solar panel near Leh (4336613925).jpg'),
    },
  ],
  trechos: {
    'm11-a05-b04-paragrafo': 'a recomendação da própria fonte é medição no local de interesse',
    'm11-a06-b08-paragrafo': 'Um sistema fotovoltaico exige limpeza periódica',
    'm11-a07-b02-paragrafo': 'o módulo trincou, o inversor queimou',
  },
  diagramas: {},
  previsoes: [
    {
      // A03 · depois do três-níveis "As quatro modalidades de participação".
      instrumentoId: 'm11-inst-04',
      depoisDoBloco: 22,
      cenario: {},
      pergunta:
        'Um sistema solar sem baterias, com 180 kW instalados em corrente alternada, gera e consome na mesma unidade. Qual é a classificação de porte dele?',
      grandeza: {
        tipo: 'escolha',
        saida: 'cl-porte',
        opcoes: [
          { valor: 'Microgeração distribuída', rotulo: 'Microgeração distribuída' },
          { valor: 'Minigeração distribuída', rotulo: 'Minigeração distribuída' },
          { valor: 'Fora dos limites de porte', rotulo: 'Fora dos limites de porte' },
        ],
      },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 04',
    },
    {
      // A04 · depois do três-níveis "O cronograma de transição e o que vem depois".
      instrumentoId: 'm11-inst-05',
      depoisDoBloco: 20,
      cenario: {},
      pergunta:
        'O pedido de acesso foi protocolado até 7 de janeiro de 2022. É microgeração, até 75 kW, em autoconsumo local. Em 2026, em que classe de faturamento a unidade fica?',
      grandeza: {
        tipo: 'escolha',
        saida: 'rr-classe',
        opcoes: [
          { valor: 'GD I — direito adquirido', rotulo: 'GD I — direito adquirido' },
          { valor: 'GD II — transição padrão', rotulo: 'GD II — transição padrão' },
          { valor: 'GD III — regime de concentração', rotulo: 'GD III — regime de concentração' },
        ],
      },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 05',
    },
    {
      // A05 · em 05.2, depois de "A verificação, portanto, não é conf…".
      instrumentoId: 'm11-inst-06',
      depoisDoBloco: 10,
      cenario: { 'gv-pot': 100, 'gv-ger': 175, 'gv-irr': 5.2 },
      pergunta:
        'Uma proposta declara 175 MWh/ano de geração para 100 kWp instalados, numa localidade com irradiação de 5,2 kWh/m²·dia no plano dos módulos. Que desempenho global essa geração implica?',
      grandeza: { tipo: 'numero', saida: 'gv-prim', unidade: '%', casas: 1 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 06',
    },
    {
      // A05 · em 05.3, depois de "Portanto a verificação é uma compar…".
      instrumentoId: 'm11-inst-07',
      depoisDoBloco: 14,
      cenario: { 'dg-prop': 0.4, 'dg-y1': 2, 'dg-hz': 25 },
      pergunta:
        'A planilha usa degradação de 0,4% ao ano; o datasheet garante no máximo 0,55% ao ano; a perda declarada no primeiro ano é de 2%, e o horizonte é de 25 anos. Quanta energia acumulada a garantia do fabricante entrega a menos do que a planilha supõe?',
      grandeza: { tipo: 'numero', saida: 'dg-gap', unidade: '%', casas: 1 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 07',
    },
    {
      // A06 · em 06.1, depois de "Terceira, e é a mais delicada…".
      instrumentoId: 'm11-inst-08',
      depoisDoBloco: 5,
      cenario: { 'tt-prop': 9, 'tt-hist': 6, 'tt-hz': 20 },
      pergunta:
        'A proposta assume reajuste tarifário de 9% ao ano; a média histórica homologada da concessionária é de 6% ao ano; o horizonte é de 20 anos. Qual é o excesso acumulado da premissa sobre a ancoragem?',
      grandeza: { tipo: 'numero', saida: 'tt-exc', unidade: '%', casas: 1 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 08',
    },
  ],
};
