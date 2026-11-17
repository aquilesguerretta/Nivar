// Módulo 04 no modelo de aula v3. Posse: a sessão de porte do M04.
//
// FIGURAS: nenhuma. O HTML do M04 não tem imagem (zero <img>, zero <svg> de conteúdo
// fora dos instrumentos), e os dados que a aula traz já estão nas quatro tabelas da
// própria leitura. Um diagrama de ordem de mérito, de PLD ao longo do ano ou de
// camadas de contrato desenharia o cenário de um instrumento — teria de ficar velado
// e repetiria o que o instrumento mostra depois da previsão. Relatório: docs/alexandria-v3/porte/m04.md.
//
// PREVISÕES (regras do cabeçalho de previsoes.ts). Em todas: o cenário é o padrão do
// instrumento na fonte; a grandeza é uma saída da calculadora (src/lib/data/calculadoras/m04.ts);
// a pergunta só junta rótulo, valor e unidade que a fonte escreve — no campo, na nota do
// instrumento ou, no INST·04, na fila de propostas do próprio script. `depoisDoBloco` é a
// posição do `div.inst` na seção da aula (gerar-corpo-m04.mjs a imprime). Nenhum bloco da
// leitura escreve o calculado de um cenário padrão (medido: busca dos sete valores no
// corpo), então `velar` fica vazio. As notas (intro + disclaimer da fonte) não entregam
// resposta, mas trazem a mecânica que o aluno explora depois: ficam veladas até a previsão.
import type { ModuloV3 } from './tipos';

export const MODULO_V3: ModuloV3 = {
  moduloId: 'modulo-04',
  pronto: true,
  figuras: [],
  trechos: {},
  diagramas: {},
  previsoes: [
    {
      // A01 · fim de 1.3, depois do box "A fila real" (bloco 11), onde está o div.inst.
      instrumentoId: 'm04-inst-01',
      depoisDoBloco: 11,
      cenario: { 'i1-d-n': 1000, 'i1-r-n': 100, 'i1-h-n': 100, 'i1-g-n': 250 },
      pergunta:
        'Demanda de 1.000 MW, renováveis 100% disponíveis, reservatório cheio (valor da água de R$ 30/MWh) e gás a R$ 250/MWh no CVU. Com as capacidades fixas do simulador — solar 200 · eólica 300 · hidráulica 350 · gás 400 · óleo 250 MW —, que preço se forma?',
      grandeza: { tipo: 'numero', saida: 'i1-p', unidade: 'R$/MWh', casas: 0 },
      velar: [],
      velarFiguras: [],
      velarNota: true,
      origemDoCenario: 'valores padrão do instrumento 01',
    },
    {
      // A02 · fim de 2.3, depois do box "Leia esses dois números juntos" (bloco 13).
      instrumentoId: 'm04-inst-02',
      depoisDoBloco: 13,
      cenario: { 'i2-e-n': 100, 'i2-a-n': 60, 'i2-c-n': 0 },
      pergunta:
        'Afluência (ENA) em 100% da MLT, reservatório (EAR) começando janeiro em 60% e carga sem variação. Qual é o PLD médio do ano no simulador?',
      grandeza: { tipo: 'numero', saida: 'i2-p', unidade: 'R$/MWh', casas: 0 },
      velar: [],
      velarFiguras: [],
      velarNota: true,
      origemDoCenario: 'valores padrão do instrumento 02',
    },
    {
      // A03 · fim de 3.3, depois do box "A frase que resolve a pergunta do Módulo 03" (bloco 10).
      instrumentoId: 'm04-inst-03',
      depoisDoBloco: 10,
      cenario: { 'i3-p-n': 200, 'i3-h-n': 200, 'i3-m-n': 400, 'i3-f-n': 300 },
      pergunta:
        'Uma usina de ponta de 200 MW despacha 200 horas por ano, com margem líquida de R$ 400/MWh quando gera, e custa R$ 300/kW-ano para ficar disponível. Vendendo só energia, quanto dinheiro falta por ano?',
      grandeza: { tipo: 'numero', saida: 'i3-g', unidade: 'R$ mi', casas: 0 },
      velar: [],
      velarFiguras: [],
      velarNota: true,
      origemDoCenario: 'valores padrão do instrumento 03',
    },
    {
      // A04 · fim de 4.1 (bloco 3). A fila de propostas é fixa no script da fonte
      // (L1540–1545) e não aparece no texto: a pergunta a escreve, porque sem ela não
      // há o que prever.
      instrumentoId: 'm04-inst-04',
      depoisDoBloco: 3,
      cenario: { 'i4-d-n': 1000, 'i4-t-n': 300 },
      pergunta:
        'Leilão reverso com seis propostas: Solar A 500 MW a R$ 170 · Eólica B 400 MW a R$ 195 · Hidro C 150 MW a R$ 230 · Gás D 600 MW a R$ 265 · Biomassa E 120 MW a R$ 280 · Térmica F 300 MW a R$ 340. O comprador quer 1.000 MW e o teto do edital é R$ 300/MWh. Qual é o preço de corte?',
      grandeza: { tipo: 'numero', saida: 'i4-c', unidade: 'R$/MWh', casas: 0 },
      velar: [],
      velarFiguras: [],
      velarNota: true,
      origemDoCenario: 'valores padrão do instrumento 04 e fila de propostas do script da fonte',
    },
    {
      // A05 · fim de 5.5, depois do box "Números vivos" (bloco 14).
      instrumentoId: 'm04-inst-05',
      depoisDoBloco: 14,
      cenario: { 'i5-c-n': 70, 'i5-p-n': 355, 'i5-l-n': 250, 'i5-s-n': 120 },
      pergunta:
        'Uma indústria consome 10.000 MWh/mês e contrata 70% em PPA a R$ 355/MWh. O resto fica exposto a um PLD médio de R$ 250/MWh, com amplitude mensal de ± R$ 120/MWh. Qual é o custo médio mensal?',
      grandeza: { tipo: 'numero', saida: 'i5-a', unidade: 'R$ mi', casas: 2 },
      velar: [],
      velarFiguras: [],
      velarNota: true,
      origemDoCenario: 'valores padrão do instrumento 05',
    },
    {
      // A06 · fim de 6.4 (bloco 11), antes do explicador em três níveis.
      instrumentoId: 'm04-inst-06',
      depoisDoBloco: 11,
      cenario: { 'i6-f-n': 300, 'i6-p-n': 250, 'i6-v-n': 8000 },
      pergunta:
        'Consumo fixo de 10.000 MWh/mês. Você trava 8.000 MWh num swap a R$ 300/MWh, e o PLD realizado no mês fecha em R$ 250/MWh. Com o swap, qual é o custo efetivo da energia no mês, por MWh?',
      // Custo efetivo, e não o resultado do swap (− R$ 400 mil): a régua de comparação
      // do InstrumentoV3 parte de zero e não desenha previsão negativa (medido no render).
      grandeza: { tipo: 'numero', saida: 'i6-u', unidade: 'R$/MWh', casas: 0 },
      velar: [],
      velarFiguras: [],
      velarNota: true,
      origemDoCenario: 'valores padrão do instrumento 06',
    },
    {
      // A07 · fim de 7.3 (bloco 10).
      instrumentoId: 'm04-inst-07',
      depoisDoBloco: 10,
      cenario: { 'i7-a-n': 50, 'i7-b-n': 25, 'i7-c-n': 15, 'i7-s-n': 0 },
      pergunta:
        'Consumo de 10.000 MWh/mês: base longa com 50% a R$ 330/MWh, camada média com 25% a R$ 348/MWh e camada curta com 15% a R$ 366/MWh, sem choque de PLD. Que parcela do consumo fica exposta ao PLD?',
      grandeza: { tipo: 'numero', saida: 'i7-e', unidade: '%', casas: 0 },
      velar: [],
      velarFiguras: [],
      velarNota: true,
      origemDoCenario: 'valores padrão do instrumento 07',
    },
  ],
};
