// Módulo 06 no modelo de aula v3. Posse: a sessão de porte do M06.
//
// Figuras pela regra de imagem do Founder (docs/alexandria-v3/REGRA-DE-IMAGEM.md):
//   · foto real só com procedência aprovada (docs/alexandria-v3/procedencia/m06.md);
//   · diagrama comum, com eixo, unidade e "Fonte: Módulo 06, Aula NN, seção X" dentro da figura
//     (src/components/alexandria/v3/diagramas/m06/);
//   · nenhuma gravura estética dentro da aula.
//
// Previsões (regras do cabeçalho de components/alexandria/v3/aula/previsoes.ts): cenário = valores
// padrão do instrumento (markup da fonte); grandeza = uma saída da calculadora
// (src/lib/data/calculadoras/m06.ts); a pergunta só junta rótulo, valor e unidade que a fonte já
// escreve. Âncora = bloco da leitura depois do qual o instrumento aparece na fonte (medido por
// tools/alexandria-dados/porte/gerar-corpo-m06-m08.mjs). Relatório: docs/alexandria-v3/porte/m06.md.

import type { ModuloV3 } from './tipos';
import type { FiguraDaAula } from '../figuras';
import { DIAGRAMAS_M06 } from '@/components/alexandria/v3/diagramas/m06';

const MOD = 'modulo-06';
const BASE = '/alexandria/v3/aulas/';

function diagrama(id: string, aula: number, ancora: string, componente: keyof typeof DIAGRAMAS_M06, secao: string, alt: string, legenda: string): FiguraDaAula {
  const fonte = `Módulo 06, Aula ${String(aula).padStart(2, '0')}, seção ${secao}`;
  return { id, moduloId: MOD, aula, classe: 'diagrama', ancora, diagrama: componente, alt, legenda, credito: `diagrama · ${fonte}`, fonte };
}

const figuras: FiguraDaAula[] = [
  // ── Aula 02 ── fim de 2.3 (Itaipu: tratado de 1973, obras em 1975, unidades em 1984)
  diagrama(
    'm06-a02-estado-constroi',
    2,
    'm06-a02-itaipu-tucurui',
    'EstadoConstroi',
    '2.1 a 2.3',
    'Linha do tempo de 1935 a 1990 com as datas da aula: 1939 CNAEE; 1945 Chesf; 1952 BNDE e Cemig; 1957 Furnas; 1961 lei da Eletrobras e 1962 instalação; 1964 ativos da Amforp; 1973 GCOI, Eletronorte e Itaipu; 1979 ativos da Light; 1984 primeiras unidades de Itaipu e Tucuruí.',
    'As datas da construção estatal, na ordem em que a aula as conta.',
  ),
  {
    // Reuso da foto aprovada do M01 (media-provenance.md, "Alexandria v3 — aulas do M01").
    id: 'm06-a02-itaipu',
    moduloId: MOD,
    aula: 2,
    classe: 'foto',
    ancora: 'm06-a02-itaipu-tucurui',
    arquivo: BASE + 'm01/m01v3-a01-itaipu',
    larguras: [1000, 2000],
    dimensoes: [1000, 635],
    alt: 'Vista aérea da barragem de Itaipu: o vertedouro aberto despeja água em um canal, e o reservatório ocupa o fundo da imagem.',
    legenda: 'Itaipu, vista aérea (foto de 2011). A usina é de uma entidade criada por tratado entre Brasil e Paraguai, de 1973.',
    credito: 'foto · Jonas de Carvalho · CC BY-SA 2.0',
    fonte: 'https://commons.wikimedia.org/wiki/File:Itaipu_geral.jpg',
  },
  // ── Aula 03 ── fim de 3.7
  diagrama(
    'm06-a03-reforma-racionamento',
    3,
    'm06-a03-cicatriz',
    'ReformaERacionamento',
    '3.1 a 3.7',
    'Linha do tempo de 1992 a 2003: 1993 Lei 8.631; 1995 Leis 8.987 e 9.074; 1996 Lei 9.427 e leilão da Light; 1998 Lei 9.648, ONS e MAE; 2000 programa de termeletricidade; maio de 2001 GCE; abril de 2002 Lei 10.438. Uma faixa marca o racionamento, de junho de 2001 a fevereiro de 2002.',
    'Da reforma ao racionamento, nas datas da aula.',
  ),
  // ── Aula 05 ── 5.2 (a seca de 2013 em diante) e 5.4 (a escada)
  {
    id: 'm06-a05-sobradinho-seca',
    moduloId: MOD,
    aula: 5,
    classe: 'foto',
    ancora: 'm06-a05-afluencias-caem',
    arquivo: BASE + 'm06/m06v3-a05-sobradinho-seca',
    larguras: [1000, 2000],
    dimensoes: [1000, 666],
    alt: 'Barragem de Sobradinho vista do alto de um morro de caatinga, com um cacto em primeiro plano: o reservatório recuado deixa faixas de margem expostas, e aerogeradores aparecem na serra ao fundo.',
    legenda: 'Barragem de Sobradinho (BA), no rio São Francisco, em dezembro de 2015, com as margens do reservatório expostas pela seca.',
    credito: 'foto · Marcello Casal Jr/Agência Brasil · CC BY 3.0 BR',
    fonte: 'https://commons.wikimedia.org/wiki/File:Seca_em_Sobradinho_01.jpg',
  },
  diagrama(
    'm06-a05-escada-abertura',
    5,
    'm06-a05-tabela-escada',
    'EscadaDaAbertura',
    '5.4',
    'Gráfico em degraus da carga mínima para migrar ao mercado livre: 2.500 kW a partir de julho de 2019; 2.000 kW em 2020; 1.500 kW em 2021; 1.000 kW em 2022; 500 kW em 2023; sem limite de carga para todo o Grupo A a partir de janeiro de 2024.',
    'A tabela 5.4 desenhada: cada degrau é uma portaria.',
  ),
  // ── Aula 06 ── 6.4
  diagrama(
    'm06-a06-trajetoria-light',
    6,
    'm06-a06-light-quatro-regimes',
    'TrajetoriaDaLight',
    '6.4',
    'Barra do tempo de 1900 a 2026 da Light: capital canadense de 1904 a 1979; Estado brasileiro de 1979 a 1996; privatizada, com trocas de controlador, de 1996 em diante; recuperação judicial em maio de 2023.',
    'A trajetória da Light que a aula percorre "de uma vez só".',
  ),
];

/** Âncora → trecho literal do bloco da leitura depois do qual a figura entra (texto do corpo gerado). */
const trechos: Record<string, string> = {
  'm06-a02-itaipu-tucurui': 'As obras de Itaipu começam em 1975',
  'm06-a03-cicatriz': 'A cicatriz principal, porém, é conceitual.',
  'm06-a05-afluencias-caem': 'A partir de 2013, as afluências caem',
  'm06-a05-tabela-escada': 'sem limite de carga, todo o Grupo A',
  'm06-a06-light-quatro-regimes': 'Uma empresa, quatro regimes de propriedade, cento e vinte anos.',
};

export const MODULO_V3: ModuloV3 = {
  moduloId: MOD,
  pronto: true,
  figuras,
  trechos,
  diagramas: DIAGRAMAS_M06,
  previsoes: [
    {
      // A01 · 1.4 termina em "O instrumento abaixo mostra a mecânica dessa erosão." (bloco 16).
      instrumentoId: 'm06-inst-02',
      depoisDoBloco: 16,
      cenario: { 'i2-h-n': 100, 'i2-i-n': 12, 'i2-n-n': 15, 'i2-m-n': 60, 'i2-c-n': 4 },
      pergunta:
        'Uma concessionária é remunerada pelo custo histórico do investimento. Com inflação de 12% ao ano, 60% do equipamento importado e câmbio 4 pontos acima da inflação, depois de 15 anos, que cobertura a receita reconhecida dá ao custo de repor o mesmo ativo?',
      grandeza: { tipo: 'numero', saida: 'i2-cb', unidade: '%', casas: 1 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 02',
    },
    {
      // A02 · fim de 2.4 (bloco 21: "Faltava escolher o modelo seguinte."), onde a fonte põe o Inst 03.
      instrumentoId: 'm06-inst-03',
      depoisDoBloco: 21,
      cenario: { 'i3-i-n': 100, 'i3-t-n': 72, 'i3-s-n': 45, 'i3-c-n': 9, 'i3-y-n': 8 },
      pergunta:
        'Uma estatal precisa investir 100 por ano. A tarifa cobre 72% do custo do serviço, 45% da dívida é externa e o câmbio sobe 9 pontos acima da inflação. Depois de 8 anos de regime, o passivo acumulado vale quantas vezes o investimento anual?',
      grandeza: { tipo: 'numero', saida: 'i3-rt', unidade: '× o ano', casas: 1 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 03',
    },
    {
      // A03 · fim de 3.6 (bloco 26: "A causa do racionamento, portanto, é uma cadeia…").
      instrumentoId: 'm06-inst-04',
      depoisDoBloco: 26,
      cenario: { 'i4-e-n': 32, 'i4-a-n': 72, 'i4-m-n': 3, 'i4-t-n': 7 },
      pergunta:
        'Um sistema entra no período seco com 32% do armazenamento máximo. A afluência é de 72% da média, a margem de capacidade firme não hidráulica é de 3% da carga e faltam 7 meses para o período úmido. Que corte de consumo é necessário para não furar o limite operacional?',
      grandeza: { tipo: 'numero', saida: 'i4-ct', unidade: '%', casas: 1 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 04',
    },
    {
      // A04 · fim de 4.4 (bloco 16, "O preço dessa arquitetura é complexidade…"). Regime padrão: o
      // estatal (a fonte inicia em `cur=0`); o seletor fica no padrão e não entra no cenário mostrado.
      instrumentoId: 'm06-inst-05',
      depoisDoBloco: 16,
      cenario: { 'i5-h-n': 0 },
      pergunta:
        'No regime estatal integrado (1962–1993), a contratação obrigatória está em 0 ano de antecedência. Qual horizonte, em anos, deixaria no mínimo o atrito total — risco de faltar somado ao risco de sobrar?',
      grandeza: { tipo: 'numero', saida: 'i5-rb', unidade: 'anos', casas: 0 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 05 (regime 1962–1993)',
    },
    {
      // A05 · fim de 5.3 (bloco 14, os oito a nove bilhões retidos e a saída em camadas).
      instrumentoId: 'm06-inst-06',
      depoisDoBloco: 14,
      cenario: { 'i6-d-n': 1500, 'i6-p-n': 35, 'i6-g-n': 8, 'i6-n-n': 120 },
      pergunta:
        'Um ciclo de liquidação precisa distribuir R$ 1.500 mi entre 120 credores. Uma liminar protege 35% do devido e as garantias cobrem 8% do devido. Que parcela do devido os credores recebem neste ciclo?',
      grandeza: { tipo: 'numero', saida: 'i6-tx', unidade: '%', casas: 1 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 06',
    },
    {
      // A06 · fim de 6.3 (bloco 12). O bloco 10 diz "a partir de 1º de janeiro de 2024, todo
      // consumidor classificado no Grupo A … sem exigência de carga mínima" — é o calculado: velado.
      // O Ex·09 (vínculo mecânico nesta aula) pergunta quando uma unidade de 700 kW ficou elegível;
      // o instrumento responde isso ao ser movido, então o cálculo só abre depois da tentativa dele.
      // Ano e grupo ficam no padrão do markup (2024; Grupo A; convencional), fora do cenário mostrado.
      instrumentoId: 'm06-inst-07',
      depoisDoBloco: 12,
      cenario: { 'i7-k-n': 800 },
      // Grandeza: a leitura "Limiar no ano" da fonte; em 2024 ela escreve "sem limite" (0 kW).
      pergunta:
        'Em 2024, qual é o limiar de carga, em kW, para uma unidade do Grupo A, com 800 kW de carga, contratar energia convencional de qualquer fornecedor?',
      grandeza: { tipo: 'numero', saida: 'i7-lm', unidade: 'kW', casas: 0 },
      velar: ['sem exigência de carga mínima'],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 07 (2024, Grupo A, energia convencional)',
      abreDepoisDoExercicio: 'm06-ex-09',
    },
    // Sem previsão (registro, PORTE-POR-MODULO.md 15/11 — explorador de consulta sem cálculo que
    // aponte uma opção): m06-inst-08 (mapa trauma → cicatriz; entra depois da leitura da A06) e
    // m06-inst-01 (linha do tempo do §MAP; entra depois da leitura da A01).
  ],
};
