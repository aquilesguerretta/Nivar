// Contrato das figuras das aulas da Alexandria v3.
//
// Regra de imagem (docs/alexandria-v3/REGRA-DE-IMAGEM.md): três classes entram
// numa aula — `foto` (real, licença verificada), `gerada-realista` (só quando a
// coisa não se fotografa; legenda declara) e `diagrama` (SVG por código, com
// eixo, unidade e fonte). A imagem estética (gravura) não entra aqui: não ensina.
//
// `FIGURAS` é o dado (tipo FiguraDaAula, com a âncora como id de bloco da extração).
// `figurasDaAula(moduloId, aula)` devolve a forma PRONTA que a casca da aula
// (components/alexandria/v3/aula/contratos.ts) lê sem adaptação: `ancora` por trecho
// literal, `arquivo` como { src, srcSet, largura, altura } e `diagrama` já como o
// componente (de components/alexandria/v3/diagramas). Figura sem âncora resolvida
// ou sem arquivo em disco fica fora, nunca vira placeholder.
//
// Legenda: `legenda` descreve o que a figura mostra; `credito` já carrega a classe
// ("foto · autor · licença", "diagrama · fonte"). Mostre as duas, nessa ordem.
// O componente de diagrama escreve a própria linha "Fonte: …" no SVG; para
// diagrama, não repita o `credito` por baixo (já está lá), só o `legenda` se quiser.
//
// Procedência e o que cada legenda NÃO pode afirmar: docs/alexandria-v2/media-provenance.md,
// seção "Alexandria v3 — aulas do M01". Especificação dos diagramas e o que ficou
// de fora (espera decisão do Founder ou dado): docs/alexandria-v3/figuras-m01.md.

import type { ComponentType } from 'react';
import { DIAGRAMAS as DIAGRAMAS_M01 } from '@/components/alexandria/v3/diagramas';
import { MODULOS_V3 } from './modulos-v3';

export type ClasseDeFigura = 'foto' | 'gerada-realista' | 'diagrama';

export interface FiguraDaAula {
  /** Estável, único no módulo. */
  id: string;
  /** Mesmo id do índice ('modulo-01'). */
  moduloId: string;
  aula: number;
  classe: ClasseDeFigura;
  /** id do bloco da extração (`m01-aNN-bNN-…`) DEPOIS do qual a figura entra. */
  ancora: string;
  /** Base do arquivo, sem largura nem extensão: `${arquivo}-${largura}.webp`. */
  arquivo?: string;
  /** Larguras que existem em disco. */
  larguras?: readonly number[];
  /** Largura × altura do menor derivado (para reservar o espaço e não pular o layout). */
  dimensoes?: readonly [number, number];
  /** Nome do componente em `DIAGRAMAS`. */
  diagrama?: string;
  alt: string;
  legenda: string;
  credito: string;
  /** Foto: página do arquivo no Commons. Diagrama: onde, na extração, está o dado. */
  fonte: string;
}


/**
 * Trecho literal (texto plano, em minúsculas na comparação) que identifica o bloco
 * da extração onde a figura entra DEPOIS. A casca da aula (Leitura.tsx) resolve a
 * âncora por trecho, porque o índice de bloco da extração não é o da leitura: os
 * blocos de figura e de instrumento da fonte não são blocos de leitura. Cada trecho
 * foi conferido contra o texto da extração e aparece uma vez só até o seu bloco.
 * Blocos de figura da fonte (a03-b06, a07-b08) ancoram no parágrafo que os anuncia.
 */
const TRECHO_DO_BLOCO: Readonly<Record<string, string>> = {
  'm01-a01-b12-tabela': 'Brasil consome ≈ 530 TWh/ano',
  'm01-a01-b14-formula': 'Energia = Potência × Tempo',
  'm01-a01-b15-paragrafo': 'Um motor de 10 kW ligado por 5 horas',
  'm01-a02-b03-paragrafo': 'Volt (V) mede tensão elétrica',
  'm01-a02-b05-tabela': 'Indústrias eletrointensivas (A1)',
  'm01-a02-b10-formula': 'P (W) = V (volts) × I (amperes)',
  'm01-a03-b05-paragrafo': 'Sinal senoidal no osciloscópio',
  'm01-a03-b06-figura': 'Sinal senoidal no osciloscópio',
  'm01-a03-b08-paragrafo': 'Guerra das Correntes',
  'm01-a03-b09-paragrafo': 'Essa habilidade de mudar de tensão',
  'm01-a03-b12-paragrafo': 'A regra física que governa todo sistema interligado',
  'm01-a03-b14-paragrafo': 'a frequência da rede cai',
  'm01-a04-b05-paragrafo': 'as perdas quadruplicam',
  'm01-a04-b08-paragrafo': 'Para transmitir a mesma potência',
  'm01-a04-b09-lista': 'Transmissão usa tensões altíssimas',
  'm01-a04-b12-tabela': 'inadimplência, erro de medição',
  'm01-a05-b13-formula': 'Fator de carga = Demanda média ÷ Demanda máxima',
  'm01-a05-b16-tabela': 'Auditoria de medição e revisão completa',
  'm01-a06-b04-tabela': 'Indústrias, grandes comércios, grandes consumidores',
  'm01-a06-b07-tabela': 'Centros urbanos com rede subterrânea',
  'm01-a06-b08-paragrafo': 'o Grupo A4 é o terreno mais fértil',
  'm01-a06-b15-tabela': 'Padrão acima de ~15 kW',
  'm01-a07-b04-paragrafo': 'fornos a arco',
  'm01-a07-b08-figura': 'As três potências formam um triângulo retângulo',
  'm01-a07-b15-paragrafo': 'fator de potência mínimo de referência de 0,92',
  'm01-a07-b18-paragrafo': 'Capacitores fornecem reativo',
  'm01-a08-b04-paragrafo': 'A solar não gera à noite',
  'm01-a08-b07-paragrafo': 'o FC foi de 25,1%',
  'm01-a08-b11-figura': 'Térmica a óleo (peaker) ~5–15%',
  'm01-a09-b06-tabela': 'Indicador específico para dias de alta severidade operacional',
  'm01-a09-b09-tabela': 'Comum em cargas como fornos',
  'm01-a09-b10-destaque': 'A ANEEL define faixas para tensão entregue ao consumidor',
};

const BASE = '/alexandria/v3/aulas/m01/';
const MOD = 'modulo-01';
const commons = (arquivo: string) => `https://commons.wikimedia.org/wiki/File:${arquivo.replace(/ /g, '_')}`;

interface DadosDeFoto {
  aula: number;
  ancora: string;
  slug: string;
  larguras: readonly number[];
  dimensoes: readonly [number, number];
  alt: string;
  legenda: string;
  credito: string;
  commons: string;
}

function foto(id: string, d: DadosDeFoto): FiguraDaAula {
  return {
    id,
    moduloId: MOD,
    aula: d.aula,
    classe: 'foto',
    ancora: d.ancora,
    arquivo: d.slug.startsWith('/') ? d.slug : BASE + d.slug,
    larguras: d.larguras,
    dimensoes: d.dimensoes,
    alt: d.alt,
    legenda: d.legenda,
    credito: d.credito,
    fonte: commons(d.commons),
  };
}

function diagrama(
  id: string,
  aula: number,
  ancora: string,
  componente: string,
  secao: string,
  alt: string,
  legenda: string,
): FiguraDaAula {
  const fonte = `Módulo 01, Aula ${String(aula).padStart(2, '0')}, seção ${secao}`;
  return {
    id,
    moduloId: MOD,
    aula,
    classe: 'diagrama',
    ancora,
    diagrama: componente,
    alt,
    legenda,
    credito: `diagrama · ${fonte}`,
    fonte,
  };
}

export const FIGURAS: readonly FiguraDaAula[] = [
  // ── Aula 01 ──────────────────────────────────────────────────────────────
  foto('m01-a01-itaipu', {
    aula: 1,
    ancora: 'm01-a01-b12-tabela',
    slug: 'm01v3-a01-itaipu',
    larguras: [1000, 2000],
    dimensoes: [1000, 635],
    alt: 'Vista aérea da barragem de Itaipu: o vertedouro aberto despeja água em um canal, e o reservatório ocupa o fundo da imagem.',
    legenda: 'Itaipu, vista aérea, com o vertedouro aberto no dia da foto.',
    credito: 'foto · Jonas de Carvalho · CC BY-SA 2.0',
    commons: 'Itaipu geral.jpg',
  }),
  diagrama(
    'm01-a01-escala-de-potencia',
    1,
    'm01-a01-b12-tabela',
    'EscalaDePotencia',
    '1.3',
    'Eixo logarítmico de potência, de 1 W a 100 GW, com quatro marcas: lâmpada LED, cerca de 9 W; chuveiro elétrico, cerca de 5,5 kW; britador de mineração, cerca de 2 MW; Itaipu, cerca de 14 GW.',
    'Os quatro exemplos da tabela 1.3 sobre um eixo em que cada passo vale mil vezes o anterior.',
  ),
  diagrama(
    'm01-a01-energia-potencia-tempo',
    1,
    'm01-a01-b14-formula',
    'EnergiaPotenciaTempo',
    '1.4',
    'Dois retângulos de mesma área, 50 kWh: 50 kW durante 1 hora, alto e estreito; 1 kW durante 50 horas, baixo e largo.',
    'A mesma energia, 50 kWh, com perfis opostos de potência e tempo.',
  ),
  foto('m01-a01-medidor-kwh', {
    aula: 1,
    ancora: 'm01-a01-b15-paragrafo',
    slug: 'm01v3-a01-medidor-kwh',
    larguras: [1000, 2000],
    dimensoes: [1000, 1152],
    alt: 'Frente de um medidor eletromecânico trifásico Siemens, com o mostrador de sete dígitos em kWh e a placa de dados abaixo.',
    legenda: 'Medidor de energia eletromecânico Siemens: o mostrador acumula kWh. A placa indica 50 Hz; a rede brasileira é de 60 Hz.',
    credito: 'foto · Bicycle Tourer · CC BY-SA 4.0',
    commons: 'Drehstromzähler Siemens.JPG',
  }),

  // ── Aula 02 ──────────────────────────────────────────────────────────────
  foto('m01-a02-pilha-volta', {
    aula: 2,
    ancora: 'm01-a02-b03-paragrafo',
    slug: 'm01v3-a02-pilha-volta',
    larguras: [1000, 2000],
    dimensoes: [1000, 1258],
    alt: 'Prancha em gravura com quatro figuras: taças com líquido ligadas por arcos de metal e três arranjos de discos empilhados, as pilhas de Volta, com fios mergulhados em taças.',
    legenda: 'A pilha de Volta e a "coroa de taças": prancha da carta de Volta a Joseph Banks, de 20 de março de 1800.',
    credito: 'documento histórico · prancha das Philosophical Transactions, 1800 · digitalização Wellcome Collection · CC BY 4.0',
    commons: "Volta's pile and 'crown of cups'. Wellcome M0014526.jpg",
  }),
  diagrama(
    'm01-a02-escada-de-tensoes',
    2,
    'm01-a02-b05-tabela',
    'EscadaDeTensoes',
    '2.1',
    'Sete faixas de tensão em escala logarítmica, de 127 e 220 volts até 230 quilovolts e acima, cada uma com onde aparece e quem consome.',
    'As sete linhas da tabela 2.1 sobre um eixo logarítmico de tensão.',
  ),
  foto('m01-a02-torres-itaipu', {
    aula: 2,
    ancora: 'm01-a02-b05-tabela',
    slug: 'm01v3-a02-torres-itaipu',
    larguras: [1000, 2000],
    dimensoes: [1000, 750],
    alt: 'Duas torres de transmissão de aço, com muitos cabos, em um gramado; ao fundo, a barragem de Itaipu.',
    legenda: 'Linha de transmissão em Foz do Iguaçu (PR), com a barragem de Itaipu ao fundo.',
    credito: 'foto · enioprado · CC BY-SA 3.0',
    commons: 'Linha de transmissão em Foz do Iguaçu - panoramio.jpg',
  }),
  foto('m01-a02-subestacao-cpfl', {
    aula: 2,
    ancora: 'm01-a02-b05-tabela',
    slug: 'm01v3-a02-subestacao-cpfl',
    larguras: [1000, 2000],
    dimensoes: [1000, 623],
    alt: 'Pátio de uma subestação visto da rua, com estruturas metálicas, isoladores e linhas elétricas; uma placa da CPFL ao fundo.',
    legenda: 'Subestação da CPFL: é onde a tensão da rede muda de nível.',
    credito: 'foto · enioprado · CC BY-SA 3.0',
    commons: 'Sub estação CPFL. - panoramio.jpg',
  }),
  diagrama(
    'm01-a02-cadeia-de-unidades',
    2,
    'm01-a02-b10-formula',
    'CadeiaDeUnidades',
    '2.3',
    'Cinco caixas ligadas por setas: volts vezes amperes; watts; quilowatts; quilowatts-hora; custo em reais. Entre elas: igual; dividir por mil; multiplicar pelas horas; multiplicar pela tarifa.',
    'Da tensão e da corrente ao custo: cada passo muda a grandeza e a unidade.',
  ),

  // ── Aula 03 ──────────────────────────────────────────────────────────────
  foto('m01-a03-osciloscopio-senoide', {
    aula: 3,
    ancora: 'm01-a03-b05-paragrafo',
    slug: 'm01v3-a03-osciloscopio-senoide',
    larguras: [1000, 1333],
    dimensoes: [1000, 807],
    alt: 'Tela de um osciloscópio analógico mostrando uma onda senoidal verde sobre uma grade.',
    legenda: 'Sinal senoidal de 10 kHz num osciloscópio. Não é a rede: a rede brasileira oscila a 60 Hz.',
    credito: 'foto · Pittigrilli · CC BY-SA 4.0',
    commons: 'Sine wave 10 kHz displayed on analog oscilloscope.jpg',
  }),
  diagrama(
    'm01-a03-corrente-dc-ac',
    3,
    'm01-a03-b06-figura',
    'CorrenteDcAc',
    '3.2',
    'Dois gráficos de tensão contra tempo em milissegundos: corrente contínua, uma linha horizontal constante; corrente alternada de 60 hertz, quatro ciclos de uma senoide de 16,7 milissegundos cada.',
    'Corrente contínua e corrente alternada de 60 Hz no tempo.',
  ),
  foto('m01-a03-anel-faraday', {
    aula: 3,
    ancora: 'm01-a03-b09-paragrafo',
    slug: 'm01v3-a03-anel-faraday',
    larguras: [1000, 1484],
    dimensoes: [1000, 1057],
    alt: 'Gravura de um anel de ferro enrolado com fio isolado em dois pontos, marcados A e B, com fios soltos e um par de pontas ao centro.',
    legenda: 'O anel de ferro de Faraday, com dois enrolamentos de fio isolado: o princípio do transformador.',
    credito: 'documento histórico · ilustração, 1896 · autor desconhecido · domínio público',
    commons: 'Faradays transformer.png',
  }),
  foto('m01-a03-niagara-geradores', {
    aula: 3,
    ancora: 'm01-a03-b08-paragrafo',
    slug: 'm01v3-a03-niagara-geradores',
    larguras: [804],
    dimensoes: [804, 538],
    alt: 'Fotografia antiga em tons de cinza de uma casa de força comprida, com uma fileira de grandes geradores verticais.',
    legenda: 'Os dez geradores Westinghouse de 5.000 HP da usina Adams, em Niagara Falls, a primeira grande usina de corrente alternada do mundo (1895). Foto da empresa, 1904.',
    credito: 'documento histórico · Westinghouse Electric & Manufacturing Company, 1904 · domínio público',
    commons: 'Westinghouse Generators at Niagara Falls.jpg',
  }),
  foto('m01-a03-edison', {
    aula: 3,
    ancora: 'm01-a03-b08-paragrafo',
    slug: 'm01v3-a03-edison',
    larguras: [1000, 2000],
    dimensoes: [1000, 1280],
    alt: 'Retrato em preto e branco de Thomas Edison sentado, de terno, olhando para a câmera.',
    legenda: 'Thomas Edison, defensor da corrente contínua. O retrato é de c. 1922, depois da Guerra das Correntes.',
    credito: 'foto · Louis Bachrach, c. 1922 · domínio público',
    commons: 'Thomas Edison2.jpg',
  }),
  foto('m01-a03-westinghouse', {
    aula: 3,
    ancora: 'm01-a03-b08-paragrafo',
    slug: 'm01v3-a03-westinghouse',
    larguras: [1000, 1677],
    dimensoes: [1000, 1250],
    alt: 'Retrato em tons de sépia de George Westinghouse, de bigode, terno e gravata-borboleta.',
    legenda: 'George Westinghouse, que apostou na corrente alternada. Retrato de 1906.',
    credito: 'foto · Joseph Gaylord Gessford, 1906 · CC0',
    commons: 'George Westinghouse 1906 (cropped).jpg',
  }),
  foto('m01-a03-tesla', {
    aula: 3,
    ancora: 'm01-a03-b08-paragrafo',
    slug: 'm01v3-a03-tesla',
    larguras: [752],
    dimensoes: [752, 1008],
    alt: 'Retrato em preto e branco de Nikola Tesla, jovem, de bigode, olhando para a câmera.',
    legenda: 'Nikola Tesla, aos 34 anos, c. 1890. A aula o põe ao lado de Westinghouse, pela corrente alternada.',
    credito: 'foto · Napoleon Sarony, c. 1890 · domínio público',
    commons: 'Nikola Tesla (1890).jpg',
  }),
  foto('m01-a03-frequencimetro', {
    aula: 3,
    ancora: 'm01-a03-b12-paragrafo',
    slug: 'm01v3-a03-frequencimetro',
    larguras: [1000, 2000],
    dimensoes: [1000, 1275],
    alt: 'Frente de um frequencímetro de lâminas em caixa de madeira e baquelite marrom, com três faixas de escala, de 25 a 105 ciclos por segundo, e um seletor de tensão de 50 a 250 volts.',
    legenda: 'Frequencímetro de lâminas (Metra Blansko), em repouso: nenhuma lâmina vibra, então a foto não mostra leitura.',
    credito: 'foto · Mister rf · CC BY-SA 4.0',
    commons: 'Metra Blansko analog frequency meter.jpg',
  }),
  diagrama(
    'm01-a03-geracao-consumo-frequencia',
    3,
    'm01-a03-b14-paragrafo',
    'GeracaoConsumoFrequencia',
    '3.4',
    'Três balanças de dois pratos, geração à esquerda e consumo à direita. Equilíbrio: frequência estável em 60 hertz. Consumo maior que a geração: a frequência cai. Geração maior que o consumo: a frequência sobe.',
    'Geração, consumo e frequência: o desequilíbrio aparece na frequência.',
  ),

  // ── Aula 04 ──────────────────────────────────────────────────────────────
  diagrama(
    'm01-a04-perdas-i2r',
    4,
    'm01-a04-b05-paragrafo',
    'PerdasI2R',
    '4.1',
    'Curva da perda dissipada em watts contra a corrente em amperes, de 0 a 500 A, com resistência de 0,5 ohm. Pontos: 100 A dá 5.000 W; 200 A dá 20.000 W; 300 A dá 45.000 W.',
    'A perda cresce com o quadrado da corrente: dobrar a corrente quadruplica a perda.',
  ),
  diagrama(
    'm01-a04-mesma-potencia-mais-tensao',
    4,
    'm01-a04-b08-paragrafo',
    'MesmaPotenciaMaisTensao',
    '4.2',
    'Três barras de perda relativa: com tensão ×1, 100 por cento; com tensão ×2, 25 por cento; com tensão ×4, 6,25 por cento.',
    'Com a potência fixa, subir a tensão derruba a corrente e, com ela, a perda.',
  ),
  foto('m01-a04-candiota', {
    aula: 4,
    ancora: 'm01-a04-b08-paragrafo',
    slug: 'm01v3-a04-candiota',
    larguras: [1000, 2000],
    dimensoes: [1000, 750],
    alt: 'Uma torre de transmissão de aço em primeiro plano e, ao fundo, as chaminés e a torre de resfriamento de uma usina termelétrica, sob céu azul.',
    legenda: 'Linha de transmissão e o complexo termelétrico de Candiota (RS): a energia sai da usina em alta tensão.',
    credito: 'foto · Ryan Garcia · CC BY 2.0',
    commons: 'Linha de transmissão e Complexo termoelétrico de Candiota.jpg',
  }),
  foto('m01-a04-torres-itaipu', {
    aula: 4,
    ancora: 'm01-a04-b09-lista',
    slug: 'm01v3-a02-torres-itaipu',
    larguras: [1000, 2000],
    dimensoes: [1000, 750],
    alt: 'Duas torres de transmissão de aço, com muitos cabos, em um gramado; ao fundo, a barragem de Itaipu.',
    legenda: 'Linha de transmissão em Foz do Iguaçu (PR): a transmissão usa tensões altíssimas para mover grandes blocos de potência.',
    credito: 'foto · enioprado · CC BY-SA 3.0',
    commons: 'Linha de transmissão em Foz do Iguaçu - panoramio.jpg',
  }),
  foto('m01-a04-furto-energia', {
    aula: 4,
    ancora: 'm01-a04-b12-tabela',
    slug: 'm01v3-a04-furto-energia',
    larguras: [1000, 2000],
    dimensoes: [1000, 744],
    alt: 'Caixa metálica de distribuição de energia com a porta aberta e fios soltos, ligados à mão, saindo de dentro.',
    legenda: 'Ligação clandestina numa caixa de distribuição em Cidade do Cabo (África do Sul): um exemplo de perda não técnica.',
    credito: 'foto · Discott · CC BY-SA 4.0',
    commons: 'Electricity theft in Cape Town.jpg',
  }),

  // ── Aula 05 ──────────────────────────────────────────────────────────────
  diagrama(
    'm01-a05-demanda-maxima-media',
    5,
    'm01-a05-b13-formula',
    'DemandaMaximaMedia',
    '5.3',
    'Duas barras em quilowatts: demanda máxima de 800 kW e demanda média de 200 kW. A razão entre elas é o fator de carga, 0,25.',
    'No cenário do instrumento, a demanda média é um quarto da máxima.',
  ),
  diagrama(
    'm01-a05-faixas-fator-de-carga',
    5,
    'm01-a05-b16-tabela',
    'FaixasFatorDeCarga',
    '5.4',
    'Régua de fator de carga de 0 a 1 com quatro faixas: 0,70 a 0,90; 0,40 a 0,70; 0,15 a 0,40; abaixo de 0,15. O cenário do instrumento, 0,25, cai na faixa de 0,15 a 0,40. Acima de 0,90 a tabela não traz faixa.',
    'As faixas de leitura do fator de carga, com o cenário do instrumento marcado.',
  ),

  // ── Aula 06 ──────────────────────────────────────────────────────────────
  foto('m01-a06-transformador-poste', {
    aula: 6,
    ancora: 'm01-a06-b04-tabela',
    slug: 'm01v3-a06-transformador-poste',
    larguras: [1000, 1500],
    dimensoes: [1000, 665],
    alt: 'Transformador de distribuição de metal montado no alto de um poste de madeira, com buchas isoladoras e cabos, contra o céu azul.',
    legenda: 'Transformador de distribuição trifásico montado em poste, do tipo usado na Austrália: é esse equipamento que baixa a tensão até a baixa tensão do Grupo B.',
    credito: 'foto · Bidgee · CC BY 3.0',
    commons: 'Pole mounted Transformer.jpg',
  }),
  diagrama(
    'm01-a06-subgrupos-por-tensao',
    6,
    'm01-a06-b07-tabela',
    'SubgruposPorTensao',
    '6.1 e 6.2',
    'Faixas de tensão em escala logarítmica: Grupo B abaixo de 2,3 quilovolts; Grupo A, em regra, de 2,3 quilovolts para cima; subgrupos A1, 230 kV ou mais; A2, 88 a 138; A3, 69; A3a, 30 a 44; A4, 2,3 a 25; AS, abaixo de 2,3, subterrâneo: a exceção à regra do Grupo A.',
    'Grupos e subgrupos tarifários sobre o eixo de tensão, na mesma escala da Aula 02. O AS é a exceção à regra dos 2,3 kV.',
  ),
  foto('m01-a06-subestacao-cpfl', {
    aula: 6,
    ancora: 'm01-a06-b08-paragrafo',
    slug: 'm01v3-a02-subestacao-cpfl',
    larguras: [1000, 2000],
    dimensoes: [1000, 623],
    alt: 'Pátio de uma subestação visto da rua, com estruturas metálicas, isoladores e linhas elétricas; uma placa da CPFL ao fundo.',
    legenda: 'Subestação da CPFL: a tensão de fornecimento define o grupo e o subgrupo do cliente.',
    credito: 'foto · enioprado · CC BY-SA 3.0',
    commons: 'Sub estação CPFL. - panoramio.jpg',
  }),
  diagrama(
    'm01-a06-sistemas-de-fases',
    6,
    'm01-a06-b15-tabela',
    'SistemasDeFases',
    '6.4',
    'Em cima, três senoides de 60 hertz deslocadas de 120 graus, uma por fase do sistema trifásico. Embaixo, uma régua de potência em quilowatts: monofásico até cerca de 10 kW; trifásico como padrão acima de cerca de 15 kW; bifásico sem número na tabela.',
    'As três fases do trifásico, defasadas em 120°, e a limitação típica de cada sistema da tabela 6.4.',
  ),

  // ── Aula 07 ──────────────────────────────────────────────────────────────
  foto('m01-a07-forno-eletrico', {
    aula: 7,
    ancora: 'm01-a07-b04-paragrafo',
    slug: 'm01v3-a07-forno-eletrico',
    larguras: [918],
    dimensoes: [918, 714],
    alt: 'Interior de uma aciaria: um forno elétrico elevado derrama aço incandescente, em jato de luz alaranjada, em uma panela sobre um vagão.',
    legenda: 'Forno elétrico de 35 toneladas vazando aço (EUA, c. 1941): um exemplo de carga industrial pesada.',
    credito: 'documento histórico · Alfred T. Palmer, c. 1941 · domínio público',
    commons: 'White-hot steel pours like water from a 35-ton electric furnace, Allegheny Ludlum Steel 1a35062v.jpg',
  }),
  diagrama(
    'm01-a07-fase-corrente',
    7,
    'm01-a07-b04-paragrafo',
    'FaseCorrente',
    '7.1',
    'Dois gráficos de tensão e corrente contra o tempo em milissegundos, dois ciclos de 16,7 ms. Carga resistiva: as ondas coincidem. Carga indutiva: a corrente está atrasada em cerca de 1,4 ms, 31 graus.',
    'Em carga resistiva a corrente acompanha a tensão; em carga indutiva, ela atrasa.',
  ),
  diagrama(
    'm01-a07-triangulo-de-potencia',
    7,
    'm01-a07-b08-figura',
    'TrianguloDePotencia',
    '7.2',
    'Triângulo retângulo em escala: cateto horizontal, potência ativa de 800 kW; cateto vertical, potência reativa de 480 kVAr; hipotenusa, potência aparente de 933 kVA. O ângulo φ é de cerca de 31 graus e o fator de potência é 0,86.',
    'O triângulo de potência do cenário do instrumento, desenhado em escala.',
  ),
  diagrama(
    'm01-a07-referencia-fator-de-potencia',
    7,
    'm01-a07-b15-paragrafo',
    'ReferenciaFatorDePotencia',
    '7.3 e 7.4',
    'Régua de fator de potência de 0,80 a 1,00 com três marcas: 0,85, o exemplo da aula; 0,92, o mínimo de referência do Grupo A; 1,00, toda a aparente vira ativa. Embaixo, o triângulo de um FP de 0,85 com a aparente valendo 100%: a ativa vale 85% e a reativa cerca de 53%.',
    'O mínimo de referência de 0,92 na régua de FP, e o FP 0,85 lido no triângulo: a reativa é cerca de 53% da aparente, não 15%.',
  ),

  foto('m01-a07-banco-capacitores', {
    aula: 7,
    ancora: 'm01-a07-b18-paragrafo',
    slug: 'm01v3-a07-banco-capacitores',
    larguras: [926],
    dimensoes: [926, 1382],
    alt: 'Estrutura alta de bancos de capacitores empilhados em prateleiras sobre isoladores de porcelana, atrás de uma cerca de arame, num pátio de subestação, sob céu azul.',
    legenda: 'Banco de capacitores de 75 Mvar numa subestação de 150 kV (Zandvliet, Bélgica). O banco da seção 7.5 fica junto à carga, na própria instalação industrial.',
    credito: 'foto · Philippe Mertens · domínio público',
    commons: 'Condensor bank 150kV - 75MVAR.jpg',
  }),

  // ── Aula 08 ──────────────────────────────────────────────────────────────
  foto('m01-a08-solar-pirapora', {
    aula: 8,
    ancora: 'm01-a08-b04-paragrafo',
    slug: 'm01v3-a08-solar-pirapora',
    larguras: [1000, 1600],
    dimensoes: [1000, 667],
    alt: 'Fileiras de painéis fotovoltaicos sobre solo de terra vermelha; um carro pequeno ao lado dá a escala; ao fundo, uma serra.',
    legenda: 'Usina solar fotovoltaica de Pirapora (MG).',
    credito: 'foto · CoyoteBR · CC BY-SA 4.0',
    commons: 'Usina solar de Pirapora 2.gif',
  }),
  foto('m01-a08-eolica-cutia', {
    aula: 8,
    ancora: 'm01-a08-b04-paragrafo',
    slug: 'm01v3-a08-eolica-cutia',
    larguras: [1000, 2000],
    dimensoes: [1000, 667],
    alt: 'Vista aérea de aerogeradores brancos espalhados por uma planície verde no litoral do Nordeste.',
    legenda: 'Parque Eólico Cutia, litoral do Rio Grande do Norte.',
    credito: 'foto · Copel · CC0',
    commons: 'Parque Cutia Freire Neto DJI 0048.jpg',
  }),
  foto('m01-a08-nuclear-angra', {
    aula: 8,
    ancora: 'm01-a08-b04-paragrafo',
    slug: 'm01v3-a08-nuclear-angra',
    larguras: [1000, 2000],
    dimensoes: [1000, 750],
    alt: 'Edifício de contenção em cúpula, chaminé alta e prédios de apoio, com uma encosta coberta de mata ao fundo.',
    legenda: 'Usinas nucleares de Angra, em Angra dos Reis (RJ).',
    credito: 'foto · Sturm · CC BY 3.0',
    commons: 'Angra dos Reis - usinas nucleares.jpg',
  }),
  foto('m01-a08-termica-candiota', {
    aula: 8,
    ancora: 'm01-a08-b04-paragrafo',
    slug: 'm01v3-a04-candiota',
    larguras: [1000, 2000],
    dimensoes: [1000, 750],
    alt: 'Uma torre de transmissão de aço em primeiro plano e, ao fundo, as chaminés e a torre de resfriamento de uma usina termelétrica.',
    legenda: 'Complexo termelétrico de Candiota (RS).',
    credito: 'foto · Ryan Garcia · CC BY 2.0',
    commons: 'Linha de transmissão e Complexo termoelétrico de Candiota.jpg',
  }),
  foto('m01-a08-termica-camacari', {
    aula: 8,
    ancora: 'm01-a08-b04-paragrafo',
    slug: 'm01v3-a08-termica-camacari',
    larguras: [1000, 2000],
    dimensoes: [1000, 667],
    alt: 'Casa de máquinas comprida com uma fileira de grandes motogeradores azuis; uma pessoa caminha ao fundo, no corredor verde.',
    legenda: 'Usina termelétrica em Camaçari (BA): uma casa de máquinas com motogeradores.',
    credito: 'foto · Fotos Gov/Ba · CC BY 2.0',
    commons: 'Termeletrica Camaçari.jpg',
  }),
  foto('m01-a08-hidreletrica-itaipu', {
    aula: 8,
    ancora: 'm01-a08-b04-paragrafo',
    slug: 'm01v3-a01-itaipu',
    larguras: [1000, 2000],
    dimensoes: [1000, 635],
    alt: 'Vista aérea da barragem de Itaipu: o vertedouro aberto despeja água em um canal, e o reservatório ocupa o fundo da imagem.',
    legenda: 'Hidrelétrica de Itaipu: a geração depende da chuva e do reservatório.',
    credito: 'foto · Jonas de Carvalho · CC BY-SA 2.0',
    commons: 'Itaipu geral.jpg',
  }),
  foto('m01-a08-hidreletrica-sobradinho', {
    aula: 8,
    ancora: 'm01-a08-b04-paragrafo',
    slug: '/alexandria/v2/aulas/m01-a08-04-sobradinho-seca',
    larguras: [560, 1000],
    dimensoes: [1000, 666],
    alt: 'Barragem de terra e enrocamento avançando sobre um reservatório azul-esverdeado, com cactos em primeiro plano, serras ao fundo e aerogeradores no horizonte.',
    legenda: 'Reservatório de Sobradinho (BA) na seca de dezembro de 2015: a hidrelétrica depende de chuva e reservatório.',
    credito: 'foto · Marcello Casal Jr / Agência Brasil · CC BY 3.0 BR',
    commons: 'Seca em Sobradinho 01.jpg',
  }),
  diagrama(
    'm01-a08-capacidade-geracao-exemplo',
    8,
    'm01-a08-b07-paragrafo',
    'CapacidadeGeracaoExemplo',
    '8.2',
    'Duas barras de energia anual: máximo teórico de 876.000 MWh, que é 100 MW vezes 8.760 horas, e geração efetiva de 220.000 MWh. A razão é o fator de capacidade, 25,1 por cento.',
    'Uma usina de 100 MW que gerou 220.000 MWh em um ano: fator de capacidade de 25,1%.',
  ),
  diagrama(
    'm01-a08-fatores-de-capacidade-tipicos',
    8,
    'm01-a08-b11-figura',
    'FatoresDeCapacidadeTipicos',
    '8.3',
    'Sete barras de fator de capacidade, de 0 a 100%: nuclear, cerca de 85 a 95%; carvão de base, 55 a 75%; gás natural de ciclo combinado, 40 a 60%; hidrelétrica brasileira média, 45 a 55%; eólica do Nordeste, 40 a 55%; solar fotovoltaica no Brasil, 20 a 28%; térmica a óleo de pico, 5 a 15%.',
    'As faixas de fator de capacidade por fonte, da figura da própria aula.',
  ),

  // ── Aula 09 ──────────────────────────────────────────────────────────────
  foto('m01-a09-apagao-madrid', {
    aula: 9,
    ancora: 'm01-a09-b06-tabela',
    slug: 'm01v3-a09-apagao-madrid',
    larguras: [1000, 2000],
    dimensoes: [1000, 562],
    alt: 'Cruzamento de uma avenida em Madri com um policial dirigindo o trânsito; pedestres e carros param entre edifícios antigos.',
    legenda: 'Madri durante o apagão de 28 de abril de 2025: sem semáforo, um policial dirige o trânsito.',
    credito: 'foto · Javier Perez Montes · CC BY-SA 4.0',
    commons: 'Power outages in Madrid - 2025-04-28 04.jpg',
  }),
  foto('m01-a09-forno-eletrico', {
    aula: 9,
    ancora: 'm01-a09-b09-tabela',
    slug: 'm01v3-a07-forno-eletrico',
    larguras: [918],
    dimensoes: [918, 714],
    alt: 'Interior de uma aciaria: um forno elétrico elevado derrama aço incandescente, em jato de luz alaranjada, em uma panela sobre um vagão.',
    legenda: 'Forno elétrico de 35 toneladas vazando aço (EUA, c. 1941): fornos a arco estão entre as cargas que causam flicker.',
    credito: 'documento histórico · Alfred T. Palmer, c. 1941 · domínio público',
    commons: 'White-hot steel pours like water from a 35-ton electric furnace, Allegheny Ludlum Steel 1a35062v.jpg',
  }),
  diagrama(
    'm01-a09-fenomenos-de-tensao',
    9,
    'm01-a09-b09-tabela',
    'FenomenosDeTensao',
    '9.3',
    'Seis pequenos gráficos de tensão contra o tempo, sem números: uma onda sem perturbação para comparar, harmônicos, afundamento de tensão, sobretensão, desequilíbrio entre as três fases e flicker.',
    'A forma de cada fenômeno da tabela 9.3, ilustrativa e sem escala de norma.',
  ),
  diagrama(
    'm01-a09-janela-de-medicao',
    9,
    'm01-a09-b10-destaque',
    'JanelaDeMedicao',
    '9.3',
    'Sete linhas, uma por dia, cada uma com 144 marcas de leitura a cada 10 minutos: 1.008 leituras em 7 dias.',
    'A janela de medição de tensão: leituras de 10 em 10 minutos durante 7 dias.',
  ),
];

/** M01 (acima) + M02–M17 (lib/alexandria/modulos-v3/mNN.ts). */
export const TODAS_AS_FIGURAS: readonly FiguraDaAula[] = [...FIGURAS, ...MODULOS_V3.flatMap((m) => m.figuras)];
const TRECHOS: Readonly<Record<string, string>> = Object.assign({}, TRECHO_DO_BLOCO, ...MODULOS_V3.map((m) => m.trechos));
const DIAGRAMAS: Readonly<Record<string, ComponentType>> = Object.assign({}, DIAGRAMAS_M01, ...MODULOS_V3.map((m) => m.diagramas));

/** Forma que a casca da aula (v3/aula/contratos.ts) lê sem adaptação. */
export interface FiguraPronta {
  id: string;
  moduloId: string;
  aula: number;
  classe: ClasseDeFigura;
  ancora: { trecho: string };
  arquivo?: { src: string; srcSet: string; largura: number; altura: number };
  diagrama?: ComponentType;
  alt: string;
  legenda: string;
  credito: string;
  fonte: string;
}

/** Caminho de um derivado em disco; sem largura, devolve o menor que cobre 1000 px (ou o único). */
export function srcDaFigura(f: FiguraDaAula, largura?: number): string | null {
  if (!f.arquivo || !f.larguras?.length) return null;
  const w = largura && f.larguras.includes(largura) ? largura : f.larguras.includes(1000) ? 1000 : Math.min(...f.larguras);
  return `${f.arquivo}-${w}.webp`;
}

/** `srcSet` com todas as larguras em disco. */
export function srcSetDaFigura(f: FiguraDaAula): string | null {
  if (!f.arquivo || !f.larguras?.length) return null;
  return f.larguras.map((w) => `${f.arquivo}-${w}.webp ${w}w`).join(', ');
}

/** Figuras de uma aula, na ordem do arquivo (a ordem dentro da mesma âncora vale). */
export function figurasDaAula(moduloId: string, aula: number): FiguraPronta[] {
  const saida: FiguraPronta[] = [];
  for (const f of TODAS_AS_FIGURAS) {
    if (f.moduloId !== moduloId || f.aula !== aula) continue;
    const trecho = TRECHOS[f.ancora];
    if (!trecho) continue;
    const src = srcDaFigura(f);
    const srcSet = srcSetDaFigura(f);
    const comp = f.diagrama ? DIAGRAMAS[f.diagrama] : undefined;
    if (f.classe === 'diagrama' ? !comp : !src || !srcSet || !f.dimensoes) continue;
    saida.push({
      id: f.id,
      moduloId: f.moduloId,
      aula: f.aula,
      classe: f.classe,
      ancora: { trecho },
      arquivo: src && srcSet && f.dimensoes ? { src, srcSet, largura: f.dimensoes[0], altura: f.dimensoes[1] } : undefined,
      diagrama: comp,
      alt: f.alt,
      legenda: f.legenda,
      credito: f.credito,
      fonte: f.fonte,
    });
  }
  return saida;
}
