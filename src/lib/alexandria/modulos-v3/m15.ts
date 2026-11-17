// Módulo 15 no modelo de aula v3. Posse: a sessão de porte do M15.
//
// Relatório (o que entrou, o que ficou de fora e por quê): docs/alexandria-v3/porte/m15.md.
//
// PREVISÕES. Regras do cabeçalho de components/alexandria/v3/aula/previsoes.ts: o cenário é o
// padrão do instrumento (o script da fonte), a grandeza é uma saída da calculadora
// (calculadoras/m15.ts) e a pergunta só junta rótulo, valor e unidade da fonte. A âncora é o
// bloco que a fonte põe logo antes do `div.inst` (extraction/m15/instrumentos.json →
// `posicao_no_texto.bloco_anterior`).
//
// Onde a prosa já escreve a saída do cenário padrão, a previsão pede outra saída do mesmo
// cenário: A02 dá R/P (12,7 anos), 2P, 3P e a amplitude; A08 dá o CVU do exemplo (R$ 403).
// INST·01 (§MAP) e INST·02 (comparador de regimes) são consulta pura: sem previsão.
//
// Sem figura: o HTML do M15 não tem <img>, e nenhum dado da aula pede diagrama que o texto não
// carregue (procedência: docs/alexandria-v3/procedencia/m15.md).

import type { ModuloV3 } from './tipos';

export const MODULO_V3: ModuloV3 = {
  moduloId: 'modulo-15',
  pronto: true,
  figuras: [],
  trechos: {},
  diagramas: {},
  previsoes: [
    {
      // A02 · §02.3, depois do nível "Especialista" de "Reserva contra recurso" (bloco 18). A fórmula do IRR (bloco
      // 14) escreve "147,03%", que é o calculado deste cenário: o bloco fica velado até a
      // previsão (como o 8.2 do M01).
      instrumentoId: 'm15-inst-03',
      depoisDoBloco: 18,
      cenario: { 'gs-pd-n': 1.38, 'gs-ad-n': 2.023 },
      pergunta:
        'Uma carteira produziu 1,380 bilhão de barris no ano e incorporou 2,023 bilhões de barris de reserva provada. Qual é o índice de reposição de reservas (IRR) do período?',
      grandeza: { tipo: 'numero', saida: 'gs-ir', unidade: '%', casas: 1 },
      velar: ['147,03%'],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 03',
    },
    {
      // A03 · §03.4, depois de "…o caso em que elas andam em sentidos opostos." (bloco 12).
      instrumentoId: 'm15-inst-04',
      depoisDoBloco: 12,
      cenario: { 'pe-vol-n': 180, 'pe-pr-n': 80.61, 'pe-cx-n': 5.26, 'pe-al-n': 10 },
      pergunta:
        'Um campo produz 180 mil barris por dia, com preço de referência de US$ 80,61 por barril, câmbio de R$ 5,26 e alíquota de royalty de 10%. Quanto ele paga de royalty por ano, em bilhões de reais?',
      grandeza: { tipo: 'numero', saida: 'pe-ry', unidade: 'R$ bi', casas: 2 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 04',
    },
    {
      // A04 · fim da aula (bloco 16, "O que este módulo não faz"), onde a fonte põe o INST·05.
      instrumentoId: 'm15-inst-05',
      depoisDoBloco: 16,
      cenario: { 'cb-p4-n': 3.1, 'cb-bi-n': 0.62, 'cb-tf-n': 0.42, 'cb-te-n': 1.47, 'cb-dr-n': 0.98 },
      pergunta:
        'Num litro de combustível, o produtor recebe R$ 3,10; o biocombustível de mistura soma R$ 0,62; os tributos federais, R$ 0,42; o tributo estadual, R$ 1,47; distribuição e revenda, R$ 0,98; não há subvenção. Que parcela do preço final fica com o produtor?',
      grandeza: { tipo: 'numero', saida: 'cb-pp', unidade: '%', casas: 1 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 05',
    },
    {
      // A05 · §05.3, depois da fórmula da margem de refino (bloco 9).
      instrumentoId: 'm15-inst-06',
      depoisDoBloco: 9,
      cenario: { 'rf-cap-n': 1800, 'rf-uti-n': 86.4, 'rf-ren-n': 40 },
      pergunta:
        'Um parque de refino com capacidade de 1.800 mil barris por dia opera a 86,4% e tira 40% da carga em diesel. Quanto diesel ele produz, em mil barris por dia?',
      grandeza: { tipo: 'numero', saida: 'rf-di', unidade: 'mil bpd', casas: 0 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 06',
    },
    {
      // A06 · §06.3, depois do parágrafo da indexação (bloco 11). Camada padrão do script:
      // a molécula na saída do processamento.
      instrumentoId: 'm15-inst-07',
      depoisDoBloco: 11,
      cenario: { 'gc-mol-n': 8.5, 'gc-top-n': 80, 'gc-ret-n': 65 },
      pergunta:
        'Um contrato cobra US$ 8,50/MMBtu pela molécula, com retirada mínima de 80% do volume contratado, e o comprador retirou só 65%. Quanto custou, de fato, cada MMBtu que ele consumiu?',
      grandeza: { tipo: 'numero', saida: 'gc-ef', unidade: 'US$/MMBtu', casas: 2 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 07',
    },
    {
      // A07 · §07.4, depois da tabela do vocabulário de capacidade (bloco 11). Padrão do script: produção de
      // petróleo atribuída ao campo. A grandeza é o estado que o painel escreve ("Aplica." /
      // "Não se aplica."), exposto pela calculadora.
      instrumentoId: 'm15-inst-08',
      depoisDoBloco: 11,
      cenario: {},
      pergunta: 'Um número de "produção de petróleo" atribuído ao elo "campo": a atribuição se aplica?',
      grandeza: {
        tipo: 'escolha',
        saida: 'cl-comb',
        opcoes: [
          { valor: 'Aplica', rotulo: 'Aplica' },
          { valor: 'Não se aplica', rotulo: 'Não se aplica' },
        ],
      },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 08',
    },
    {
      // A08 · §08.3, depois do nível "Especialista" de "Custo variável de térmica" (bloco 16).
      // O §08.1 (bloco 3) já resolve o
      // CVU deste cenário (R$ 403/MWh); a previsão pede o preço de gás que zera a distância
      // ao custo marginal, que a aula não escreve.
      instrumentoId: 'm15-inst-09',
      depoisDoBloco: 16,
      cenario: { 'ac-gas-n': 9, 'ac-cx-n': 5.4, 'ac-hr-n': 7.1, 'ac-om-n': 58, 'ac-cmo-n': 330 },
      pergunta:
        'A térmica do exemplo da aula — gás a US$ 9,00/MMBtu, câmbio de R$ 5,40, 7,1 MMBtu/MWh e R$ 58/MWh de O&M e encargos — enfrenta um custo marginal de operação de R$ 330/MWh. A que preço o gás entregue teria de cair para ela entrar na ordem de mérito?',
      grandeza: { tipo: 'numero', saida: 'ac-gb', unidade: 'US$/MMBtu', casas: 2 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 09',
    },
    {
      // A09 · §09.1, depois do protocolo de leitura (bloco 1). Padrão do script: o enunciado e01.
      // As opções são as quatro categorias do filtro do instrumento; o calculado é a etiqueta do
      // chip do enunciado (`y`), exposta pela calculadora. Os chips não mostram a etiqueta.
      instrumentoId: 'm15-inst-10',
      depoisDoBloco: 1,
      cenario: {},
      pergunta:
        '"O campo produziu 180 mil barris por dia e a operadora tem 30% de participação; logo a receita dela foi de 54 mil barris por dia vezes o preço realizado." Qual é o defeito dominante desse enunciado?',
      grandeza: {
        tipo: 'escolha',
        saida: 'vf-cat',
        opcoes: [
          { valor: 'Regime', rotulo: 'Regime não declarado' },
          { valor: 'Camada', rotulo: 'Camada confundida' },
          { valor: 'Grandeza', rotulo: 'Grandeza confundida' },
          { valor: 'Acoplamento', rotulo: 'Acoplamento omitido' },
        ],
      },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 10',
    },
  ],
};
