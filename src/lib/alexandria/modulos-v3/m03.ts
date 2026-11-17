// Módulo 03 no modelo de aula v3. Posse: a sessão de porte do M03.
// Relatório e decisões: docs/alexandria-v3/porte/m03.md. Procedência das fotos:
// docs/alexandria-v3/procedencia/m03.md (só entra `factual_review: aprovado`).
//
// ÂNCORAS DOS INSTRUMENTOS: a posição do instrumento no HTML da fonte, contada em
// blocos de MODULO_03_CORPO (gerado do HTML; três níveis = três notas). Cada uma
// cai logo depois do parágrafo que invoca o instrumento.
//
// PREVISÕES: cenário = valores padrão do instrumento; a grandeza é saída da
// calculadora. INST·01 é explorador de consulta (a lente só troca a tabela): sem
// previsão. INST·07 e INST·08 têm como cenário-padrão o enunciado do Ex·08 e do
// Ex·09 da mesma aula: o cálculo só abre depois da tentativa (abreDepoisDoExercicio).
import type { ModuloV3 } from './tipos';
import type { FiguraDaAula } from '../figuras';
import { DIAGRAMAS_M03 } from '@/components/alexandria/v3/diagramas/m03';

const MOD = 'modulo-03';
const BASE = '/alexandria/v3/aulas/m03/';
const commons = (arquivo: string) => `https://commons.wikimedia.org/wiki/File:${arquivo.replace(/ /g, '_')}`;

function foto(
  id: string, aula: number, ancora: string, slug: string, larguras: readonly number[], dimensoes: readonly [number, number],
  alt: string, legenda: string, credito: string, arquivoCommons: string,
): FiguraDaAula {
  return { id, moduloId: MOD, aula, classe: 'foto', ancora, arquivo: BASE + slug, larguras, dimensoes, alt, legenda, credito, fonte: commons(arquivoCommons) };
}
function diagrama(id: string, aula: number, ancora: string, componente: string, secao: string, alt: string, legenda: string): FiguraDaAula {
  const fonte = `Módulo 03, Aula ${String(aula).padStart(2, '0')}, ${secao}`;
  return { id, moduloId: MOD, aula, classe: 'diagrama', ancora, diagrama: componente, alt, legenda, credito: `diagrama · ${fonte}`, fonte };
}

const FIGURAS: FiguraDaAula[] = [
  diagrama('m03-a01-fatores-de-capacidade', 1, 'm03-a01-b07-tabela', 'FatoresDeCapacidade', 'tabela de FC típico',
    "Faixas de fator de capacidade por fonte: hidro com reservatório, 50 a 55%; fio d'água, 40 a 55%; eólica do Nordeste, 40 a 55%; solar com tracker, 25 a 30%; biomassa, cerca de 50% na safra; gás natural, de menos de 15% a mais de 60%; nuclear, 85 a 90%.",
    'As faixas de fator de capacidade da tabela, lado a lado.'),
  foto('m03-a02-itaipu', 2, 'm03-a02-b02-paragrafo', 'm01v3-a01-itaipu', [1000, 2000], [1000, 635],
    'Vista aérea da barragem de Itaipu: o vertedouro aberto despeja água em um canal, e o reservatório ocupa o fundo da imagem.',
    'Itaipu, vista aérea, com o vertedouro aberto no dia da foto.',
    'foto · Jonas de Carvalho · CC BY-SA 2.0', 'Itaipu geral.jpg'),
  diagrama('m03-a04-curva-de-potencia', 4, 'm03-a04-b01-paragrafo', 'CurvaDePotencia', 'abertura da aula',
    'Potência em porcentagem da nominal contra a velocidade do vento: zero até 3 m/s; sobe com o cubo até 12 m/s; 100% até 25 m/s; zero acima de 25 m/s.',
    'A curva de potência: cut-in, nominal e cut-out.'),
  foto('m03-a04-eolica-cutia', 4, 'm03-a04-b03-paragrafo', 'm01v3-a08-eolica-cutia', [1000, 2000], [1000, 667],
    'Vista aérea de aerogeradores brancos espalhados por uma planície verde no litoral do Nordeste.',
    'Parque Eólico Cutia, litoral do Rio Grande do Norte.',
    'foto · Copel · CC0', 'Parque Cutia Freire Neto DJI 0048.jpg'),
  foto('m03-a05-solar-pirapora', 5, 'm03-a05-b02-paragrafo', 'm01v3-a08-solar-pirapora', [1000, 1600], [1000, 667],
    'Fileiras de painéis fotovoltaicos sobre solo de terra vermelha; um carro pequeno ao lado dá a escala; ao fundo, uma serra.',
    'Usina solar fotovoltaica de Pirapora (MG): uma UFV.',
    'foto · CoyoteBR · CC BY-SA 4.0', 'Usina solar de Pirapora 2.gif'),
  foto('m03-a07-candiota', 7, 'm03-a07-b01-paragrafo', 'm01v3-a04-candiota', [1000, 2000], [1000, 750],
    'Uma torre de transmissão de aço em primeiro plano e, ao fundo, as chaminés e a torre de resfriamento de uma usina termelétrica, sob céu azul.',
    'Complexo termelétrico de Candiota (RS), citado na aula.',
    'foto · Ryan Garcia · CC BY 2.0', 'Linha de transmissão e Complexo termoelétrico de Candiota.jpg'),
  foto('m03-a08-angra', 8, 'm03-a08-b01-paragrafo', 'm01v3-a08-nuclear-angra', [1000, 2000], [1000, 750],
    'Edifício de contenção em cúpula, chaminé alta e prédios de apoio, com uma encosta coberta de mata ao fundo.',
    'Usinas nucleares de Angra, em Angra dos Reis (RJ).',
    'foto · Sturm · CC BY 3.0', 'Angra dos Reis - usinas nucleares.jpg'),
  diagrama('m03-a08-parque-nuclear', 8, 'm03-a08-b02-paragrafo', 'ParqueNuclear', 'seção 8.1',
    'Linha do tempo: Angra 3 iniciada em 1984; Angra 1 em operação desde 1985; Angra 2 desde 2001; fim de 2025, fatia na Eletronuclear vendida à Âmbar.',
    'Os marcos do parque nuclear brasileiro que a aula dá.'),
];

const TRECHOS: Record<string, string> = {
  'm03-a01-b07-tabela': 'Paradas programadas; o resto é base contínua',
  'm03-a02-b02-paragrafo': 'Itaipu — 14 GW binacionais',
  'm03-a04-b01-paragrafo': 'É a curva de potência',
  'm03-a04-b03-paragrafo': 'Os ventos alísios do litoral',
  'm03-a05-b02-paragrafo': 'UFV — Usina Fotovoltaica centralizada',
  'm03-a07-b01-paragrafo': 'Candiota e o polo',
  'm03-a08-b01-paragrafo': 'O Brasil opera Angra 1',
  'm03-a08-b02-paragrafo': 'E há Angra 3: iniciada em 1984',
};

const OPCOES_MARGEM = ['Hidro reservatório', 'Biomassa (safra)', 'GN ciclo combinado', 'GN ciclo simples'].map((v) => ({ valor: v, rotulo: v }));

export const MODULO_V3: ModuloV3 = {
  moduloId: MOD,
  pronto: true,
  figuras: FIGURAS,
  trechos: TRECHOS,
  diagramas: DIAGRAMAS_M03,
  previsoes: [
    {
      // A01 · bloco 8, "Repare na linha do gás…" (onde a fonte põe o INST·02).
      instrumentoId: 'm03-inst-02',
      depoisDoBloco: 8,
      cenario: { 'i02-mw': 100, 'i02-fc': 27 },
      pergunta: 'Uma usina de 100 MW opera com fator de capacidade de 27%. Quanta energia ela entrega por ano, em GWh?',
      grandeza: { tipo: 'numero', saida: 'i02-gwh', unidade: 'GWh/ano', casas: 0 },
      velar: [], velarFiguras: [], velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 02',
    },
    {
      // A02 · bloco 6 (características operacionais, antes de "O instrumento ensina…").
      instrumentoId: 'm03-inst-03',
      depoisDoBloco: 6,
      cenario: { 'i03-ena': 100, 'i03-ear': 60 },
      pergunta: 'Num ano de hidrologia média (ENA em 100% da média), com EAR de 60% em 1º de janeiro, qual é a EAR mínima do ano?',
      grandeza: { tipo: 'numero', saida: 'i03-min', unidade: '%', casas: 0 },
      velar: [], velarFiguras: [], velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 03',
    },
    {
      // A03 · bloco 4 (a consequência sistêmica do fio d'água).
      instrumentoId: 'm03-inst-04',
      depoisDoBloco: 4,
      cenario: { 'i04-ena': 100 },
      pergunta: "Num ano de hidrologia média (ENA em 100% da média), qual é o fator de capacidade anual da usina a fio d'água?",
      grandeza: { tipo: 'numero', saida: 'i04-fcfio', unidade: '%', casas: 0 },
      velar: [], velarFiguras: [], velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 04',
    },
    {
      // A05 · bloco 5, "Use o instrumento — agora com as duas variáveis juntas:".
      instrumentoId: 'm03-inst-05',
      depoisDoBloco: 5,
      cenario: { 'i05-sol': 35, 'i05-eol': 12 },
      pergunta: 'Com 35 GW de solar instalada e 12 GW médios de eólica gerando no dia, qual é a rampa do pôr do sol, em GW por hora?',
      grandeza: { tipo: 'numero', saida: 'i05-rampa', unidade: 'GW/h', casas: 1 },
      velar: [], velarFiguras: [], velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 05',
    },
    {
      // A06 · bloco 7 (o cenário institucional do gás).
      instrumentoId: 'm03-inst-06',
      depoisDoBloco: 7,
      cenario: { 'i06-dem': 75, 'i06-agua': 150, 'i06-gas': '1' },
      pergunta: 'Com 75 GW de demanda, valor da água em R$ 150/MWh e gás a preço médio, qual fonte fica na margem?',
      grandeza: { tipo: 'escolha', saida: 'i06-marg', opcoes: OPCOES_MARGEM },
      velar: [], velarFiguras: [], velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 06',
    },
    {
      // A09 · bloco 1 (9.1, MW e MWh).
      instrumentoId: 'm03-inst-07',
      depoisDoBloco: 1,
      cenario: { 'i07-mw': 100, 'i07-h': 4, 'i07-eff': 88 },
      pergunta: 'Uma bateria de 100 MW e 4 horas, com eficiência de ciclo de 88%, faz um ciclo completo por dia. Quanta energia ela perde por dia, em MWh?',
      grandeza: { tipo: 'numero', saida: 'i07-perda', unidade: 'MWh/dia', casas: 0 },
      velar: [], velarFiguras: [], velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 07',
      abreDepoisDoExercicio: 'm03-ex-08',
    },
    {
      // A10 · bloco 1, "Manipule as duas no instrumento:".
      instrumentoId: 'm03-inst-08',
      depoisDoBloco: 1,
      cenario: { 'i08-pills': 'solar', 'i08-fc': 27, 'i08-wacc': 10 },
      pergunta: 'Uma usina solar (CAPEX R$ 3.500/kW, O&M R$ 50/kW·ano, 25 anos) opera com FC de 27% e WACC de 10% ao ano. Qual é o LCOE, em R$/MWh?',
      grandeza: { tipo: 'numero', saida: 'i08-lcoe', unidade: 'R$/MWh', casas: 0 },
      velar: [], velarFiguras: [], velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 08 (preset Solar UFV)',
      abreDepoisDoExercicio: 'm03-ex-09',
    },
    {
      // A10 · bloco 6, "…o instrumento final mostra o porquê em doze meses:".
      instrumentoId: 'm03-inst-09',
      depoisDoBloco: 6,
      cenario: { 'i09-checks-hidro': 'on', 'i09-checks-eolica': 'off', 'i09-checks-solar': 'off', 'i09-checks-bio': 'off' },
      pergunta: 'Só com a hidro ligada no portfólio, quanto o mês mais fraco entrega em relação ao mês mais forte?',
      grandeza: { tipo: 'numero', saida: 'i09-ratio', unidade: '%', casas: 0 },
      velar: [], velarFiguras: [], velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 09',
    },
  ],
};
