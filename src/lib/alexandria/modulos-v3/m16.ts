// Módulo 16 no modelo de aula v3. Posse: a sessão de porte do M16.
//
// PREVISÕES. Regras do cabeçalho de previsoes.ts: o cenário é o padrão do
// instrumento (a instrução de cada um declara os valores iniciais), a grandeza
// prevista é um readout da própria calculadora (src/lib/data/calculadoras/m16.ts,
// script da fonte executado), e a pergunta só junta rótulo, valor e unidade que
// a fonte escreve. `depoisDoBloco` é o bloco da leitura que precede o
// instrumento no HTML-fonte (medido por tools/alexandria-dados/porte/).
//
// VÉU. Para cada previsão, o calculado foi procurado em toda a leitura da aula
// (com 0 a 3 casas): nenhum bloco o escreve, nenhuma nota de instrumento o
// interpreta, e o M16 não tem figura. `velar` fica vazio por medição, não por
// omissão.
//
// PREVISÃO POR ESCOLHA (01, 02, 03, 11). O calculado é uma saída de escolha que
// a calculadora LÊ do HTML que o script da fonte escreveu (`extratores` em
// tools/alexandria-dados/porte/instrumentos-config-m16-m17.mjs): a posição que o
// veredito declara, o candidato que ele nomeia, o defeito que o painel mostra, a
// última tendência da fila. Rótulos das opções: literais da fonte (botões, CAND,
// DF, primeira palavra de TND). Cenário: o padrão do instrumento, vazio no cartão
// porque o padrão já é o estado inicial da fonte.
//
// O §MAP (INST·01) entra na A01 com previsão própria: a fila dele, aberta, daria
// a posição de estágio de cada tendência — a resposta da previsão do INST·02.
//
// SEM PREVISÃO (2 de 11): INST·07 e INST·10 são exploradores de consulta (o
// painel devolve texto de um dispositivo ou de um elo; nada aponta uma opção).
import type { ModuloV3 } from './tipos';

export const MODULO_V3: ModuloV3 = {
  moduloId: 'modulo-16',
  pronto: true,
  figuras: [],
  trechos: {},
  diagramas: {},
  previsoes: [
    {
      // A01 · 01.2 "A régua aplicada às seis tendências" (bloco 4) — o instrumento vem logo depois do título.
      instrumentoId: 'm16-inst-02',
      depoisDoBloco: 4,
      cenario: {},
      pergunta: 'Em 4 de agosto de 2026, em que posição da régua de cinco posições está a eletrificação de transporte?',
      grandeza: {
        tipo: 'escolha',
        saida: 'rg-posicao-correta',
        opcoes: [
          { valor: '1', rotulo: '1 · escala' },
          { valor: '2', rotulo: '2 · piloto' },
          { valor: '3', rotulo: '3 · regulado' },
          { valor: '4', rotulo: '4 · anunciado' },
          { valor: '5', rotulo: '5 · projeção' },
        ],
      },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 02',
    },
    {
      // A01 · §MAP, no fim da leitura (bloco 8): a fonte o põe fora de aula.
      instrumentoId: 'm16-inst-01',
      depoisDoBloco: 8,
      cenario: {},
      pergunta: 'Reagrupadas pela dimensão estágio, qual das seis tendências o mapa põe em último lugar na fila?',
      grandeza: {
        tipo: 'escolha',
        saida: 'mp-ultima',
        opcoes: [
          { valor: 'Eletrificação', rotulo: 'Eletrificação' },
          { valor: 'Agregação', rotulo: 'Agregação' },
          { valor: 'Medição', rotulo: 'Medição' },
          { valor: 'Armazenamento', rotulo: 'Armazenamento' },
          { valor: 'Mercado', rotulo: 'Mercado' },
          { valor: 'Demanda', rotulo: 'Demanda' },
        ],
      },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 01 (§MAP)',
    },
    {
      // A02 · fim de 02.2 (bloco 5).
      instrumentoId: 'm16-inst-03',
      depoisDoBloco: 5,
      cenario: {},
      pergunta: 'Em 4 de agosto de 2026, qual dos cinco candidatos é o gargalo vinculante da eletrificação de transporte?',
      grandeza: {
        tipo: 'escolha',
        saida: 'gg-vinculante',
        opcoes: [
          { valor: 'tec', rotulo: 'Maturidade tecnológica' },
          { valor: 'reg', rotulo: 'Regra habilitante' },
          { valor: 'tar', rotulo: 'Sinal econômico tarifário' },
          { valor: 'cad', rotulo: 'Cadeia de suprimento' },
          { valor: 'con', rotulo: 'Conexão à rede' },
        ],
      },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 03',
    },
    {
      // A10 · fim de 10.2 (bloco 5, a lista dos quatro defeitos).
      instrumentoId: 'm16-inst-11',
      depoisDoBloco: 5,
      cenario: {},
      pergunta:
        'Enunciado: "O Brasil tem 38 GW de projetos de centros de dados pedindo acesso à rede — mais de um terço da carga média projetada do país para 2035." Qual é o defeito dominante?',
      grandeza: {
        tipo: 'escolha',
        saida: 'vf-defeito',
        opcoes: [
          { valor: 'A', rotulo: 'A · estágio confundido' },
          { valor: 'B', rotulo: 'B · gargalo não identificado' },
          { valor: 'C', rotulo: 'C · carga não convertida' },
          { valor: 'D', rotulo: 'D · base de comparação não declarada' },
        ],
      },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 11',
    },
    {
      // A03 · fim de 03.2 (bloco 10, a fórmula da potência coincidente).
      instrumentoId: 'm16-inst-04',
      depoisDoBloco: 10,
      cenario: { 'fc-n-n': 167026, 'fc-p-n': 7.4, 'fc-fc-n': 30 },
      pergunta:
        'Uma frota de 167.026 veículos com tomada recarrega em pontos de 7,4 kW, com fator de coincidência de 30%. Qual é a potência coincidente?',
      grandeza: { tipo: 'numero', saida: 'fc-pc', unidade: 'MW', casas: 1 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 04',
    },
    {
      // A04 · fim de 04.5 (bloco 20, a fórmula da margem de um ciclo).
      instrumentoId: 'm16-inst-05',
      depoisDoBloco: 20,
      cenario: { 'ar-pc-n': 80, 'ar-rte-n': 86 },
      pergunta: 'Um sistema compra energia a R$ 80/MWh e tem eficiência de ciclo de 86%. Qual é o spread mínimo de equilíbrio?',
      grandeza: { tipo: 'numero', saida: 'ar-sp', unidade: 'R$/MWh', casas: 2 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 05',
    },
    {
      // A05 · 05.4 "Convertendo a obrigação em quantidade" (bloco 12): a seção
      // é só o título e o instrumento.
      instrumentoId: 'm16-inst-06',
      depoisDoBloco: 12,
      cenario: { 'am-ro-n': 2, 'am-ra-n': 0 },
      pergunta:
        'A obrigação manda instalar medição avançada em 2% das unidades consumidoras por ano, sem ritmo adicional voluntário. Em quantos anos todas estariam cobertas?',
      grandeza: { tipo: 'numero', saida: 'am-at', unidade: 'anos', casas: 1 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 06',
    },
    {
      // A07 · fim de 07.5 (bloco 20, o painel de três níveis do escopo 2).
      // O INST·07 da mesma aula é de seleção e não tem previsão; AulaV3 monta
      // um instrumento por aula (pedido em docs/alexandria-v3/porte/m16.md).
      instrumentoId: 'm16-inst-08',
      depoisDoBloco: 20,
      cenario: { 'e2-cs-n': 120, 'e2-at-n': 0 },
      pergunta:
        'Uma empresa consome 120 GWh no ano, nenhum com atributo contratado. O fator médio da rede é 0,080 tCO2e/MWh e o fator residual, 0,120 tCO2e/MWh. Pelo método de mercado, quanto ela reporta?',
      grandeza: { tipo: 'numero', saida: 'e2-mkt', unidade: 'tCO2e', casas: 0 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 08',
      // o padrão escreve 9.600 tCO2e no método de localização: a resposta do Ex·14
      abreDepoisDoExercicio: 'm16-ex-14',
    },
    {
      // A08 · fim de 08.3 (bloco 13, a fórmula da energia anual).
      instrumentoId: 'm16-inst-09',
      depoisDoBloco: 13,
      cenario: { 'dc-ti-n': 100, 'dc-pue-n': 1.3, 'dc-fc-n': 90 },
      pergunta:
        'Um centro de dados tem 100 MW de potência de tecnologia da informação, eficiência do uso de energia de 1,30 e fator de carga médio de 90%. Qual é a carga média?',
      grandeza: { tipo: 'numero', saida: 'dc-cm', unidade: 'MW', casas: 1 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 09',
      // o Ex·12 tem este cenário e a resposta 117 MW
      abreDepoisDoExercicio: 'm16-ex-12',
    },
  ],
};
