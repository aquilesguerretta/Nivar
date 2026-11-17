// Módulo 10 no modelo de aula v3. Posse: a sessão de porte do M10.
//
// PREVISÕES (regras de previsoes.ts): o cenário é o padrão do instrumento; a grandeza é
// uma saída da calculadora (calculadoras/m10.ts); a pergunta junta rótulo, valor e
// unidade da fonte, em voz da Alexandria (decisão 7). O calculado é sempre a
// calculadora rodando no cenário. A âncora é o `invocacao.posicao.antes` da extração
// (m10/instrumentos.json), contado em MODULO_10_CORPO.
//
// Cinco dos onze têm previsão: INST·03, ·04, ·05, ·06 (número) e ·11 (escolha). Os
// outros não, e o motivo está em docs/alexandria-v3/porte/m10.md:
//   · INST·01, ·07: exploradores de consulta (nenhum cálculo aponta uma opção).
//   · INST·08, ·10: réguas de verificação; o padrão é "nada marcado" — o resultado é o
//     que o aluno marca, não algo a prever.
//   · INST·02: o padrão (Azul no A4) é "elegível", e a A02 diz antes que a Azul está
//     disponível a todo o grupo A — seria recuperação.
//   · INST·09: o próprio instrumento é "estime antes de ver"; a estimativa do aluno já
//     é a previsão, e a fonte a compara com a composição real.
//
// VÉU. Medido: nenhuma prosa das Aulas 03, 04, 05 e 09 escreve o calculado (250 kW,
// 10,7%, 7,0%, 33,3%, o título do roteador). No INST·04 a A03 já diz que a base é
// 60 kW e não 10 kW — por isso a pergunta é o PESO da penalidade, que a prosa não dá.
// A nota de cada instrumento é intro + aviso da fonte, sem interpretar o cenário:
// `velarNota: false`.

// FIGURA. Uma foto real, revisada e aprovada em 15/11/2026 (Commons: licença e SHA1):
// docs/alexandria-v3/procedencia/m10.md. É um RECORTE da foto original, sem nenhum
// preenchimento — o arquivo v2 tinha os numerais do Commons apagados por geração, o que a
// regra 1 não admite. As três outras linhas m10-* são gravura e ficam fora da aula.

import type { ModuloV3 } from './tipos';

export const MODULO_V3: ModuloV3 = {
  moduloId: 'modulo-10',
  pronto: true,
  figuras: [
    {
      id: 'm10-a05-capacitores',
      moduloId: 'modulo-10',
      aula: 5,
      classe: 'foto',
      ancora: 'm10-a05-b06-paragrafo',
      arquivo: '/alexandria/v3/aulas/m10/m10v3-a05-capacitores',
      larguras: [965],
      dimensoes: [965, 410],
      alt: 'Fileira de dez células cilíndricas de capacitor, de alumínio, com terminais azuis no topo, montadas lado a lado sob uma prateleira metálica no compartimento inferior de um armário.',
      legenda: 'Células de capacitor de um banco de correção do fator de potência, no compartimento inferior do armário. Recorte da foto original; a fonte não identifica o local.',
      credito: 'foto · Bert Verbauwhede (via Beuhri, Wikipedia NL) · domínio público',
      fonte: 'https://commons.wikimedia.org/wiki/File:Condensatorenbatterij.jpg',
    },
  ],
  trechos: {
    'm10-a05-b06-paragrafo': 'é assinatura de sobrecompensação',
  },
  diagramas: {},
  previsoes: [
    {
      // A03 · fim de 03.2 ("Picos isolados precisam ser explicados…"), antes de 03.3.
      instrumentoId: 'm10-inst-03',
      depoisDoBloco: 10,
      cenario: { 'dd-ctr': 1200, 'dd-max': 1010, 'dd-tol': 5 },
      pergunta:
        'Uma unidade tem 1.200 kW de demanda contratada, tolerância de ultrapassagem de 5%, e a maior demanda medida na série foi 1.010 kW. Qual é a folga até o limite antes de ultrapassar?',
      grandeza: { tipo: 'numero', saida: 'dd-folga', unidade: 'kW', casas: 0 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 03',
    },
    {
      // A03 · depois do "Números vivos" do multiplicador, antes de 03.4.
      instrumentoId: 'm10-inst-04',
      depoisDoBloco: 16,
      cenario: { 'ul-ctr': 1000, 'ul-med': 1060, 'ul-tol': 5, 'ul-mul': 2, 'ul-tar': 40 },
      pergunta:
        'Contrato de 1.000 kW, tolerância de 5%, demanda medida de 1.060 kW, multiplicador 2 e tarifa de demanda de 40 por kW. Que peso a parcela de ultrapassagem tem no total de demanda do ciclo?',
      grandeza: { tipo: 'numero', saida: 'ul-peso', unidade: '%', casas: 1 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 04',
    },
    {
      // A04 · depois de "o instrumento correto para avaliar deslocamento devolve volume…".
      instrumentoId: 'm10-inst-05',
      depoisDoBloco: 15,
      cenario: { 'dl-tot': 420, 'dl-pta': 42, 'dl-des': 30 },
      pergunta:
        'Num ciclo de 420 MWh, 42 MWh foram consumidos no posto de ponta, e 30% desse volume é tecnicamente deslocável. Depois de deslocar, qual seria a participação da ponta no consumo do ciclo?',
      grandeza: { tipo: 'numero', saida: 'dl-p1', unidade: '%', casas: 1 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 05',
    },
    {
      // A05 · depois do três-níveis "Fator de potência e excedente reativo", antes de 05.4.
      instrumentoId: 'm10-inst-06',
      depoisDoBloco: 14,
      cenario: { 'fp-vd1': 180, 'fp-hrs': 6 },
      pergunta:
        'A janela noturna de apuração dura 6 horas por dia. Num ciclo de 30 dias, 180 horas da janela diurna foram informadas em violação. Que parte da janela diurna esteve em violação?',
      grandeza: { tipo: 'numero', saida: 'fp-pd', unidade: '%', casas: 1 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 06',
    },
    {
      // A09 · depois da tabela dos quatro achados ("Repare na coluna da direita…").
      instrumentoId: 'm10-inst-11',
      depoisDoBloco: 9,
      cenario: {},
      pergunta:
        'Você tem uma fatura só, sem memória de massa por intervalo e sem plano de produção, e na leitura observou um enquadramento suspeito. Qual veredito o roteador dá?',
      grandeza: {
        tipo: 'escolha',
        saida: 'rt-titulo',
        opcoes: [
          { valor: 'Vale investigar', rotulo: 'Vale investigar' },
          { valor: 'Não vale investigar nas condições informadas', rotulo: 'Não vale investigar nas condições informadas' },
          { valor: 'Não é possível concluir — investigação parcial viável', rotulo: 'Não é possível concluir — investigação parcial viável' },
          { valor: 'Não é possível concluir com o que foi informado', rotulo: 'Não é possível concluir com o que foi informado' },
        ],
      },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 11',
    },
  ],
};
