// Módulo 02 no modelo de aula v3. Posse: a sessão de porte do M02.
// Relatório e decisões: docs/alexandria-v3/porte/m02.md. Procedência das fotos:
// docs/alexandria-v3/procedencia/m02.md (só entra `factual_review: aprovado`).
//
// ÍNDICES DE BLOCO: `depoisDoBloco` conta os blocos de MODULO_02_CORPO da aula
// (gerado de forma determinística do HTML; os três níveis são três notas).
//
// PREVISÕES (regras de previsoes.ts): cenário = valores padrão do instrumento;
// a grandeza prevista é uma saída da calculadora; a pergunta só junta rótulo,
// valor e unidade da fonte. O INST·01 (explorador de consulta, sem número) não
// tem previsão: nenhuma saída dele é cálculo (registrado no relatório).
import type { ModuloV3 } from './tipos';
import type { FiguraDaAula } from '../figuras';
import { DIAGRAMAS_M02 } from '@/components/alexandria/v3/diagramas/m02';

const MOD = 'modulo-02';
const BASE = '/alexandria/v3/aulas/m02/';
const commons = (arquivo: string) => `https://commons.wikimedia.org/wiki/File:${arquivo.replace(/ /g, '_')}`;

function foto(
  id: string,
  aula: number,
  ancora: string,
  slug: string,
  larguras: readonly number[],
  dimensoes: readonly [number, number],
  alt: string,
  legenda: string,
  credito: string,
  arquivoCommons: string,
): FiguraDaAula {
  return { id, moduloId: MOD, aula, classe: 'foto', ancora, arquivo: BASE + slug, larguras, dimensoes, alt, legenda, credito, fonte: commons(arquivoCommons) };
}

function diagrama(id: string, aula: number, ancora: string, componente: string, secao: string, alt: string, legenda: string): FiguraDaAula {
  const fonte = `Módulo 02, Aula ${String(aula).padStart(2, '0')}, seção ${secao}`;
  return { id, moduloId: MOD, aula, classe: 'diagrama', ancora, diagrama: componente, alt, legenda, credito: `diagrama · ${fonte}`, fonte };
}

const FIGURAS: FiguraDaAula[] = [
  // ── Aula 01 ──
  diagrama('m02-a01-cadeia-de-tensoes', 1, 'm02-a01-b02-cadeia', 'CadeiaDeTensoes', '1.1',
    'Cinco faixas de tensão sobre um eixo logarítmico: geração, 13,8 a 18 kV; transmissão, 230 a 765 kV; subtransmissão, 69 a 138 kV; distribuição em média tensão, 13,8 a 34,5 kV; distribuição em baixa tensão, 127 a 440 V.',
    'Os cinco trechos da cadeia, cada um na sua faixa de tensão.'),
  // ── Aula 02 ──
  diagrama('m02-a02-perdas-por-tensao', 2, 'm02-a02-b02-formula', 'PerdasPorTensao', '2.1',
    'Curva decrescente das perdas relativas: com a tensão multiplicada por 2, as perdas caem a um quarto; multiplicada por 10, a um centésimo.',
    'Mesma potência: as perdas caem com o quadrado do fator de tensão.'),
  foto('m02-a02-torres-itaipu', 2, 'm02-a02-b04-tabela', 'm01v3-a02-torres-itaipu', [1000, 2000], [1000, 750],
    'Duas torres de transmissão de aço, com muitos cabos, em um gramado; ao fundo, a barragem de Itaipu.',
    'Linha de transmissão em Foz do Iguaçu (PR), com a barragem de Itaipu ao fundo.',
    'foto · enioprado · CC BY-SA 3.0',
    'Linha de transmissão em Foz do Iguaçu - panoramio.jpg'),
  // ── Aula 03 ──
  foto('m02-a03-subestacao-cpfl', 3, 'm02-a03-b01-paragrafo', 'm01v3-a02-subestacao-cpfl', [1000, 2000], [1000, 623],
    'Pátio de uma subestação visto da rua, com estruturas metálicas, isoladores e linhas elétricas; uma placa da CPFL ao fundo.',
    'Pátio de uma subestação da CPFL, visto da rua.',
    'foto · enioprado · CC BY-SA 3.0',
    'Sub estação CPFL. - panoramio.jpg'),
  // ── Aula 04 ──
  diagrama('m02-a04-curva-liquida', 4, 'm02-a04-b06-paragrafo', 'CurvaLiquida', '4.3',
    'Duas curvas horárias: a carga total sobe até o pico no início da noite; a carga líquida afunda no meio do dia e sobe rápido quando o sol se põe.',
    'Carga total e carga líquida no cenário-padrão do simulador da aula.'),
  // ── Aula 06 ──
  diagrama('m02-a06-horizontes', 6, 'm02-a06-b05-tabela', 'HorizontesDaOperacao', '6.2',
    'Quatro caixas ligadas por setas: PMO, mês por semanas; PDO, dia seguinte por hora; tempo real, segundos a minutos; pós-operação, depois.',
    'A cascata de horizontes, do programa mensal à pós-operação.'),
  // ── Aula 08 ──
  diagrama('m02-a08-falha-em-cascata', 8, 'm02-a08-b09-tabela', 'FalhaEmCascata', '8.4',
    'Cinco etapas ligadas por setas: defeito local, proteção atua, sobrecarga vizinha, instabilidade, corte ou colapso.',
    'As cinco etapas de uma falha em cascata.'),
  foto('m02-a08-apagao-madrid', 8, 'm02-a08-b16-paragrafo', 'm01v3-a09-apagao-madrid', [1000, 2000], [1000, 562],
    'Avenida de Madri com prédios antigos e pedestres na calçada; um policial dirige o trânsito no cruzamento.',
    'Madri, 28 de abril de 2025, durante o apagão: um policial dirige o trânsito num cruzamento. Não é no Brasil.',
    'foto · Javier Perez Montes · CC BY-SA 4.0',
    'Power outages in Madrid - 2025-04-28 04.jpg'),
  // ── Aula 09 ──
  foto('m02-a09-transformador-poste', 9, 'm02-a09-b01-paragrafo', 'm01v3-a06-transformador-poste', [1000, 1500], [1000, 665],
    'Transformador de distribuição trifásico montado em poste, com buchas e ramais, contra o céu azul.',
    'Transformador de distribuição montado em poste, do tipo usado na Austrália. Não é no Brasil.',
    'foto · Bidgee · CC BY 3.0',
    'Pole mounted Transformer.jpg'),
  foto('m02-a09-furto-energia', 9, 'm02-a09-b03-paragrafo', 'm01v3-a04-furto-energia', [1000, 2000], [1000, 744],
    'Caixa metálica de distribuição de energia com a porta aberta e fios soltos, ligados à mão, saindo de dentro.',
    'Ligação clandestina numa caixa de distribuição em Cidade do Cabo (África do Sul): um exemplo de perda não técnica. Não é no Brasil.',
    'foto · Discott · CC BY-SA 4.0',
    'Electricity theft in Cape Town.jpg'),
  diagrama('m02-a09-perdas-por-trecho', 9, 'm02-a09-b04-tabela', 'PerdasPorTrecho', '9.2',
    'Rede Básica, cerca de 2% do transportado; distribuição, perdas técnicas de 6 a 7% em média; perdas não técnicas sem número na tabela; total do sistema, 13 a 14% da injetada.',
    'As perdas por trecho, em ordem de grandeza, como a tabela da aula as dá.'),
];

/** Trecho literal (comparado em minúsculas) do bloco DEPOIS do qual a figura entra.
 *  Cada um conferido: aparece pela primeira vez no bloco indicado no nome. */
const TRECHOS: Record<string, string> = {
  'm02-a01-b02-cadeia': 'Grupo A4 conecta aqui',
  'm02-a02-b02-formula': 'perdas 4× menores',
  'm02-a02-b04-tabela': 'Tronco de máxima capacidade em corrente alternada',
  'm02-a03-b01-paragrafo': 'Medir e telecomandar',
  'm02-a04-b06-paragrafo': 'Esse degrau é a rampa do fim da tarde',
  'm02-a06-b05-tabela': 'Transforma a diretriz mensal em programação horária',
  'm02-a08-b09-tabela': 'removem um caminho de fluxo',
  'm02-a08-b16-paragrafo': 'o apagão da era renovável',
  'm02-a09-b01-paragrafo': 'quilômetros de poste',
  'm02-a09-b03-paragrafo': 'fraude de medição e erros de cadastro',
  'm02-a09-b04-tabela': 'Soma das anteriores',
};

export const MODULO_V3: ModuloV3 = {
  moduloId: MOD,
  pronto: true,
  figuras: FIGURAS,
  trechos: TRECHOS,
  diagramas: DIAGRAMAS_M02,
  previsoes: [
    {
      // A02 · 2.5, bloco 15: "O simulador abaixo é o coração da aula."
      instrumentoId: 'm02-inst-02',
      depoisDoBloco: 15,
      cenario: { 'i02-p': 1000, 'i02-d': 800, 'i02-v': '500', 'i02-n': '2' },
      pergunta: 'Uma linha de 500 kV, com 2 circuitos em paralelo, transmite 1.000 MW por 800 km. Qual é a perda relativa?',
      grandeza: { tipo: 'numero', saida: 'i02-pct', unidade: '%', casas: 1 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 02',
    },
    {
      // A03 · 3.4, bloco 9: "O instrumento abaixo monta a cadeia completa…"
      instrumentoId: 'm02-inst-03',
      depoisDoBloco: 9,
      cenario: { 'i03-pills': 'a2' },
      pergunta: 'Uma indústria eletrointensiva conectada em 138 kV (A2): qual é a perda técnica acumulada típica até a entrega?',
      grandeza: { tipo: 'numero', saida: 'i03-total', unidade: '%', casas: 1 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 03 (perfil Eletrointensiva · A2)',
    },
    {
      // A04 · 4.3, bloco 8: "No simulador abaixo…". A curva líquida desenhada
      // é o cenário resolvido: fica velada.
      instrumentoId: 'm02-inst-04',
      depoisDoBloco: 8,
      cenario: { 'i08-pico': 95, 'i08-solar': 30, 'i08-ceu': '1' },
      pergunta: 'Num dia com pico de carga de 95 GW, 30 GW de solar instalada e céu limpo, qual é a rampa máxima da carga líquida, em GW por hora?',
      grandeza: { tipo: 'numero', saida: 'i08-rampa', unidade: 'GW/h', casas: 1 },
      velar: [],
      velarFiguras: ['m02-a04-curva-liquida'],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 04',
    },
    {
      // A05 · 5.4, bloco 12: "O simulador abaixo é uma maquete didática do SIN."
      instrumentoId: 'm02-inst-05',
      depoisDoBloco: 12,
      cenario: { 'i04-dem': 82, 'i04-vento': 55, 'i04-sol': 40, 'i04-res': 60 },
      pergunta: 'Com 82 GW de demanda, vento no NE a 55% do parque, solar a 40% do parque e reservatórios a 60% de EAR, qual é o CMO da maquete, em R$/MWh?',
      grandeza: { tipo: 'numero', saida: 'i04-cmo', unidade: 'R$/MWh', casas: 0 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 05',
    },
    {
      // A07 · fim de 7.3 (bloco 14): a prosa não invoca o instrumento; ele entra
      // no fim da seção que ensina MW × MWh. O bloco 12 ("10 MW / 40 MWh …
      // cerca de 4 horas") dá a mesma duração do cenário-padrão (20 MW / 80 MWh):
      // fica velado até a previsão.
      instrumentoId: 'm02-inst-06',
      depoisDoBloco: 14,
      cenario: { 'i09-mw': 20, 'i09-mwh': 80 },
      pergunta: 'Uma bateria tem 20 MW de potência e 80 MWh de energia armazenada. Por quantas horas ela entrega a potência máxima?',
      grandeza: { tipo: 'numero', saida: 'i09-h', unidade: 'h', casas: 1 },
      velar: ['cerca de 4 horas'],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 06',
      // O Ex·09 (vínculo mecânico na Aula 07) é este cenário: o calculado é a
      // resposta (a) dele. Calculado, controles e o trecho velado esperam a tentativa.
      abreDepoisDoExercicio: 'm02-ex-09',
    },
    {
      // A08 · 8.5, bloco 12: "Escolha o tamanho da perda, a carga do momento e a inércia do mix."
      instrumentoId: 'm02-inst-07',
      depoisDoBloco: 12,
      cenario: { 'i05-dp': 6, 'i05-carga': 80, 'i05-h': '4.2' },
      pergunta: 'O sistema perde 6 GW de geração com 80 GW de carga e inércia média (mix atual). Qual é o nadir de frequência, em Hz?',
      grandeza: { tipo: 'numero', saida: 'i05-nadir', unidade: 'Hz', casas: 2 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 07',
    },
    {
      // A09 · 9.4: o instrumento vem logo depois do título (bloco 9), na fonte.
      instrumentoId: 'm02-inst-08',
      depoisDoBloco: 9,
      cenario: { 'i06-c': 500, 'i06-p': 14, 'i06-t': 350 },
      pergunta: 'Você mede 500 MWh no mês e as perdas do sistema a montante são de 14%. Quanta energia precisa ser injetada para te atender, em MWh?',
      grandeza: { tipo: 'numero', saida: 'i06-inj', unidade: 'MWh', casas: 0 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 08',
    },
    {
      // A10 · 10.6, bloco 19: "O instrumento final do módulo destila tudo…"
      instrumentoId: 'm02-inst-09',
      depoisDoBloco: 19,
      cenario: { 'i07-vento': 18, 'i07-dse': 50, 'i07-lim': 8 },
      pergunta: 'Com 18 GW de vento disponível no NE, 50 GW de demanda no SE e limite de intercâmbio de 8 GW, quanto flui do NE para o SE, em GW?',
      grandeza: { tipo: 'numero', saida: 'i07-flow', unidade: 'GW', casas: 1 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 09',
    },
  ],
};
