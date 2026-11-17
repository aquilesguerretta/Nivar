// Módulo 05 no modelo de aula v3. Posse: a sessão de porte do M05.
//
// FIGURAS: nenhuma. O HTML do M05 não tem imagem (zero <img>); os 4 <svg> do arquivo são
// gráficos desenhados pelo script dentro dos instrumentos. Os dados das aulas já estão nas
// tabelas da leitura, e o mapa de dois eixos da Aula 06 é o próprio INST·06. Relatório:
// docs/alexandria-v3/porte/m05.md.
//
// PREVISÕES (regras do cabeçalho de previsoes.ts). Em todas: o cenário é o padrão do
// instrumento na fonte; a grandeza é uma saída da calculadora (src/lib/data/calculadoras/m05.ts,
// porte verbatim do script); a pergunta só junta rótulo, valor e unidade que a fonte escreve —
// no campo ou no disclaimer do instrumento (a anuidade de 10% do INST·01, o preço de
// referência de R$ 200/MWh do INST·03). `depoisDoBloco` é a posição do `div.inst` na seção da
// aula (gerar-corpo-m05.mjs a imprime). Nenhum bloco da leitura escreve o calculado de um
// cenário padrão (medido), então `velar` fica vazio; as notas ficam veladas até a previsão.
import type { ModuloV3 } from './tipos';

export const MODULO_V3: ModuloV3 = {
  moduloId: 'modulo-05',
  pronto: true,
  figuras: [],
  trechos: {},
  diagramas: {},
  previsoes: [
    {
      // A01 · fim de 1.3, depois do box "O que a regulação substitui" (bloco 14).
      instrumentoId: 'm05-inst-01',
      depoisDoBloco: 14,
      cenario: { 'i1-q': 200, 'i1-f': 900, 'i1-c': 180, 'i1-n': 1 },
      pergunta:
        'Um mercado de 200 mil consumidores, uma rede completa com custo fixo de R$ 900 mi, custo incremental de R$ 180/ano por consumidor e um só operador. Com o custo fixo convertido em anuidade a 10% ao ano, como faz o simulador, qual é o custo médio por consumidor por ano?',
      grandeza: { tipo: 'numero', saida: 'i1-cm', unidade: 'R$/ano', casas: 0 },
      velar: [],
      velarFiguras: [],
      velarNota: true,
      origemDoCenario: 'valores padrão do instrumento 01',
    },
    {
      // A02 · fim de 2.4 (bloco 16), antes de 2.5.
      instrumentoId: 'm05-inst-02',
      depoisDoBloco: 16,
      cenario: { 'i2-g': 3, 'i2-c': 50, 'i2-f': 55 },
      pergunta:
        'Separação jurídica (grau 3, na escala de 1 contábil a 4 societária), dependência de coordenação 50 e qualidade da fiscalização de acesso 55, nos índices do simulador. Qual é o atrito total?',
      grandeza: { tipo: 'numero', saida: 'i2-t', unidade: null, casas: 0 },
      velar: [],
      velarFiguras: [],
      velarNota: true,
      origemDoCenario: 'valores padrão do instrumento 02',
    },
    {
      // A03 · fim de 3.4 (bloco 16).
      instrumentoId: 'm05-inst-03',
      depoisDoBloco: 16,
      cenario: { 'i3-l': 60, 'i3-c': 25, 'i3-p': 40, 'i3-v': 55 },
      pergunta:
        'Um consumidor contrata 60% do volume em contrato longo, com prêmio de R$ 40/MWh, e 25% em contrato curto; o resto fica descoberto. O curto prazo tem preço de referência de R$ 200/MWh e volatilidade 55. Qual é o custo esperado?',
      grandeza: { tipo: 'numero', saida: 'i3-e', unidade: 'R$/MWh', casas: 2 },
      velar: [],
      velarFiguras: [],
      velarNota: true,
      origemDoCenario: 'valores padrão do instrumento 03',
    },
    {
      // A04 · fim de 4.5, depois do teste de sete perguntas (bloco 15).
      instrumentoId: 'm05-inst-04',
      depoisDoBloco: 15,
      cenario: { 'i4-m': 120, 'i4-s0': '0', 'i4-s1': '0', 'i4-s2': '0', 'i4-s3': '0', 'i4-s4': '0', 'i4-s5': '0', 'i4-s6': '0', 'i4-s7': '0' },
      pergunta:
        'Uma decisão regulatória com R$ 120 mi/ano em jogo, em que nenhum dos oito sinais do termômetro está presente. Qual é o índice de opacidade, de 0 a 100?',
      grandeza: { tipo: 'numero', saida: 'i4-o', unidade: '/100', casas: 0 },
      velar: [],
      velarFiguras: [],
      velarNota: true,
      origemDoCenario: 'valores padrão do instrumento 04 (nenhum sinal marcado)',
    },
    {
      // A05 · fim de 5.7 (bloco 25).
      instrumentoId: 'm05-inst-05',
      depoisDoBloco: 25,
      cenario: { 'i5-b': 4000, 'i5-w': 7.5, 'i5-o': 620, 'i5-d': 180, 'i5-e': 14000, 'i5-x': 2.5 },
      pergunta:
        'Base de remuneração líquida de R$ 4.000 mi, WACC regulatório de 7,5% real a.a., OPEX eficiente de R$ 620 mi/ano e reintegração regulatória de R$ 180 mi/ano. Qual é a Parcela B no ano da revisão?',
      grandeza: { tipo: 'numero', saida: 'i5-p', unidade: 'R$ mi', casas: 0 },
      velar: [],
      velarFiguras: [],
      velarNota: true,
      origemDoCenario: 'valores padrão do instrumento 05',
    },
    {
      // A06 · fim de 6.4, depois do box "A formulação de três frases" (bloco 14).
      instrumentoId: 'm05-inst-06',
      depoisDoBloco: 14,
      cenario: { 'i6-x': 85, 'i6-y': 45, 'i6-h': 60 },
      pergunta:
        'Revelação de custo em 85 (0 oferta → 100 custo declarado), remuneração de capacidade em 45 (0 só energia → 100 formal) e recurso armazenável plurianual pesando 60%. Qual é a coerência com o parque, de 0 a 100?',
      grandeza: { tipo: 'numero', saida: 'i6-co', unidade: '/100', casas: 0 },
      velar: [],
      velarFiguras: [],
      velarNota: true,
      origemDoCenario: 'valores padrão do instrumento 06',
    },
  ],
};
