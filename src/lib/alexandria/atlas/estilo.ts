// Atlas da Alexandria v3 — o estilo do mapa.
//
// O mapa base é desenhado aqui, camada por camada, sobre os tiles vetoriais do
// Mapbox (ruas v8, relevo e satélite): papel e tinta no modo claro, tinta
// invertida no noturno. Não usamos um estilo pronto do Mapbox porque nenhum
// deles fala a língua da Alexandria — o Atlas é uma prancha do mesmo livro.
//
// As cores abaixo espelham os tokens de alexandria-v3.css. O canvas do mapa não
// lê variável CSS, por isso elas existem duas vezes; se um token mudar lá, muda
// aqui.

import type { AnyLayer, Fog, Style } from 'mapbox-gl';
import type { ModoV3 } from '@/components/alexandria/v3/usoV3';
import type { Categoria } from './tipos';
import type { MatrizGeracao } from '@/lib/atlas/worldApi';

export interface PaletaDoMapa {
  papel: string;
  papelFundo: string;
  tinta: string;
  tintaSuave: string;
  tintaFraca: string;
  ouro: string;
  oxido: string;
  mar: string;
  rio: string;
  fio: string;
  fioForte: string;
  /** sombra e luz do relevo */
  relevoSombra: string;
  relevoLuz: string;
  /** linhas de transmissão, da maior tensão para a menor */
  linha: { ca765: string; ca500: string; ca440: string; ca345: string; ca230: string; caMenor: string; cc: string };
  /**
   * Cor de cada fonte de geração. Medida contra daltonismo: compostas a 0,88
   * sobre o papel (a opacidade do disco no mapa) e passadas pelas matrizes de
   * Machado (2009) para protanopia, deuteranopia e tritanopia, todo par das
   * nove fica com ΔE2000 ≥ 10 nos dois modos (pior caso medido: 10,46 no claro,
   * 11,04 no noturno). Separam-se por matiz e por luminância; nenhuma é o óxido
   * nem o ouro da casa, nenhuma é o vermelho/verde de semáforo. Se mudar uma,
   * meça de novo o conjunto inteiro.
   */
  categoria: Record<Categoria, string>;
  /**
   * Os quatro submercados (N, NE, SE, S): quatro valores da mesma tinta, do
   * escuro ao claro, sem tomar emprestada nenhuma cor de fonte. Separam-se por
   * luminância (ΔE2000 ≥ 10 entre vizinhos em qualquer simulação de
   * daltonismo); o mais claro ainda tem contraste ≥ 3:1 com o papel.
   */
  submercado: Record<'N' | 'NE' | 'SE' | 'S', string>;
  /**
   * Os quatro elos de intercâmbio (na ordem do painel As trocas), na mesma
   * rampa de tinta dos submercados. Opcional para não obrigar quem monta
   * uma paleta à mão; PALETA traz os dois modos.
   */
  elo?: Record<'N>NE' | 'N>SE' | 'NE>SE' | 'SE>S', string>;
  /** escala de água: de reservatório vazio a cheio */
  aguaVazia: string;
  aguaCheia: string;
  /** espelho d'água do reservatório fora do capítulo da água (lugar, não medida) */
  lago: string;
  /** rótulo de mar e de rio (itálico azulado: a convenção da hidrografia) */
  rotuloAgua: string;
  rotuloRio: string;
  /** curva de nível (só de perto) */
  curva: string;
  /** faixa larga e pálida que acompanha a fronteira entre países */
  fronteiraFaixa: string;
  /** halo dos rótulos sobre a foto de satélite (mais largo e mais opaco que o do papel) */
  haloSatelite: string;
  /** bacia sedimentar (capítulo do combustível): areia acinzentada, só área e fio */
  sedimento: string;
}

export const PALETA: Record<ModoV3, PaletaDoMapa> = {
  claro: {
    papel: '#f2ecdf',
    papelFundo: '#ebe3d3',
    tinta: '#15213b',
    tintaSuave: '#4a5163',
    tintaFraca: '#6d6a62',
    ouro: '#a8854f',
    oxido: '#9a3b22',
    mar: '#dde3e1',
    rio: '#9fb0c2',
    fio: 'rgba(21, 33, 59, 0.16)',
    fioForte: 'rgba(21, 33, 59, 0.38)',
    relevoSombra: 'rgba(60, 48, 30, 0.22)',
    relevoLuz: 'rgba(255, 252, 244, 0.5)',
    linha: { ca765: '#15213b', ca500: '#24396a', ca440: '#3f5b93', ca345: '#5d79ab', ca230: '#8696b6', caMenor: '#a8afbf', cc: '#8a5a1a' },
    categoria: {
      hidro: '#15476d',
      // eólica e solar um pouco mais escuras que na primeira leva: contra o papel #f2ecdf o fio
      // passa de 3,01 e 2,22 para ~3,6 e ~3,2 (decisão 2 da onda 2); as maquetes e a legenda leem daqui
      eolica: '#0a8a85',
      solar: '#a87d1c',
      nuclear: '#7e4ea8',
      biomassa: '#5c7d2a',
      gas: '#e14e8a',
      carvao: '#2d313a',
      oleo: '#634011',
      outros: '#646464',
    },
    submercado: { N: '#15213b', NE: '#3a4159', SE: '#5c627b', S: '#7f85a0' },
    elo: { 'N>NE': '#15213b', 'N>SE': '#3a4159', 'NE>SE': '#5c627b', 'SE>S': '#7f85a0' },
    aguaVazia: '#e8dcc4',
    aguaCheia: '#1f4f86',
    lago: '#c6d2da',
    rotuloAgua: '#55718a',
    rotuloRio: '#43627f',
    curva: 'rgba(96, 74, 44, 0.26)',
    fronteiraFaixa: 'rgba(21, 33, 59, 0.07)',
    haloSatelite: 'rgba(242, 236, 223, 0.92)',
    sedimento: '#8c7b58',
  },
  noturno: {
    papel: '#0f1728',
    papelFundo: '#0b1220',
    tinta: '#ede5d3',
    tintaSuave: '#c3bba9',
    tintaFraca: '#9b9484',
    ouro: '#c4a26a',
    oxido: '#e07a57',
    // critico-desktop 11: a água era navy quase igual à terra (#0a111e sobre #0f1728) e o rio e o
    // reservatório sumiam. Um navy mais claro e mais azul que a terra; o fio da margem continua
    mar: '#152a47',
    rio: '#2b4263',
    fio: 'rgba(237, 229, 211, 0.16)',
    fioForte: 'rgba(237, 229, 211, 0.4)',
    relevoSombra: 'rgba(0, 0, 0, 0.45)',
    relevoLuz: 'rgba(160, 180, 220, 0.12)',
    linha: { ca765: '#f2ecdf', ca500: '#cdd6ea', ca440: '#a7b7da', ca345: '#8499c4', ca230: '#647ba8', caMenor: '#4d5f84', cc: '#e0b266' },
    categoria: {
      hidro: '#6594bb',
      eolica: '#4cc1c8',
      solar: '#e9b849',
      nuclear: '#bf94fc',
      biomassa: '#748c12',
      gas: '#c15e93',
      carvao: '#dcdcdc',
      oleo: '#c08e64',
      outros: '#9d9a94',
    },
    submercado: { N: '#ede5d3', NE: '#beb8aa', SE: '#969083', S: '#726d60' },
    elo: { 'N>NE': '#ede5d3', 'N>SE': '#beb8aa', 'NE>SE': '#969083', 'SE>S': '#726d60' },
    aguaVazia: '#3a3424',
    aguaCheia: '#7fb4ec',
    lago: '#22385a',
    rotuloAgua: '#7f9cc0',
    rotuloRio: '#86a6cc',
    curva: 'rgba(237, 229, 211, 0.12)',
    fronteiraFaixa: 'rgba(237, 229, 211, 0.06)',
    haloSatelite: 'rgba(15, 23, 40, 0.92)',
    sedimento: '#a8997a',
  },
};

// Tipografia do mapa. Os glifos vêm do fontstack do Mapbox (Newsreader, Instrument
// Sans e IBM Plex não existem lá; conferido por requisição em 15/11/2026). A regra:
//   · LUGAR (cidade, país) em serifa — Source Serif Pro, a mais próxima da Newsreader;
//   · ÁGUA (mar, rio) em itálico de serifa — Merriweather Light Italic, a convenção das
//     pranchas de atlas para hidrografia;
//   · INSTALAÇÃO (usina, reservatório) em sem-serifa — Source Sans Pro, par da
//     Instrument Sans; a diferença de família separa o que é lugar do que é obra;
//   · DADO (subestação, submercado) em mono — Source Code Pro, par da IBM Plex Mono;
//   · DIVISA (estado) em sem-serifa de caixa alta espaçada, clara: rótulo de área,
//     o único versalete do mapa além dos países.
const SERIFA = ['Source Serif Pro Regular', 'Arial Unicode MS Regular'];
const SERIFA_FORTE = ['Source Serif Pro Semibold', 'Arial Unicode MS Regular'];
const DADO = ['Source Code Pro Medium', 'Arial Unicode MS Regular'];
const AGUA = ['Merriweather Light Italic', 'Arial Unicode MS Regular'];
const OBRA = ['Source Sans Pro Semibold', 'Arial Unicode MS Regular'];
const OBRA_LEVE = ['Source Sans Pro Regular', 'Arial Unicode MS Regular'];
const AREA = ['Source Sans Pro Semibold', 'Arial Unicode MS Regular'];

export const FONTES_DO_MAPA = { SERIFA, SERIFA_FORTE, DADO, AGUA, OBRA, OBRA_LEVE, AREA };

/** Rótulos do mapa base cujo halo e cor mudam sobre a foto de satélite. */
export const ROTULOS_DA_BASE = ['base-rotulo-agua', 'base-rotulo-rio', 'base-rotulo-cidade', 'base-rotulo-uf', 'base-rotulo-pais'] as const;

/** Primeira camada de rótulo do mapa base: os dados entram logo abaixo dela. */
export const ANTES_DOS_ROTULOS = 'base-rotulo-agua';

const nomePt = ['coalesce', ['get', 'name_pt'], ['get', 'name']];

export function atmosfera(modo: ModoV3): Fog {
  const p = PALETA[modo];
  return modo === 'claro'
    ? { range: [1.2, 9], color: p.papel, 'high-color': '#e4dac6', 'horizon-blend': 0.03, 'space-color': p.papel, 'star-intensity': 0 }
    : { range: [1.2, 9], color: '#1a2740', 'high-color': '#101a2e', 'horizon-blend': 0.05, 'space-color': p.papel, 'star-intensity': 0 };
}

export function estiloDoMapa(modo: ModoV3): Style {
  const p = PALETA[modo];
  const claro = modo === 'claro';
  const camadas: AnyLayer[] = [
    { id: 'base-terra', type: 'background', paint: { 'background-color': p.papel } },
    // relevo: sombra quente e luz fria, rasa de longe (o país não vira papel amassado) e
    // mais presente na escala do estado, onde serra e vale explicam o traçado das linhas
    {
      id: 'base-relevo',
      type: 'hillshade',
      source: 'relevo',
      layout: { visibility: 'visible' },
      paint: {
        'hillshade-shadow-color': p.relevoSombra,
        'hillshade-highlight-color': p.relevoLuz,
        'hillshade-accent-color': p.relevoSombra,
        'hillshade-exaggeration': ['interpolate', ['linear'], ['zoom'], 3, 0.18, 6, 0.34, 9, 0.48, 13, 0.36],
        'hillshade-illumination-direction': 315,
      },
    },
    {
      id: 'base-satelite',
      type: 'raster',
      source: 'satelite',
      layout: { visibility: 'none' },
      // a foto recua um pouco (menos saturação e contraste) para o desenho do Atlas ler por cima
      paint: { 'raster-opacity': 1, 'raster-fade-duration': 300, 'raster-saturation': -0.28, 'raster-contrast': -0.08, 'raster-brightness-max': claro ? 0.94 : 0.82 },
    },
    // curvas de nível: só de perto, mestras primeiro; a gravura do terreno na escala local
    {
      id: 'base-curva',
      type: 'line',
      source: 'curvas',
      'source-layer': 'contour',
      minzoom: 10,
      filter: ['step', ['zoom'], ['==', ['get', 'index'], 10], 11.5, ['in', ['get', 'index'], ['literal', [5, 10]]], 13, true],
      layout: { 'line-join': 'round' },
      paint: {
        'line-color': p.curva,
        'line-width': ['match', ['get', 'index'], 10, 0.8, 5, 0.6, 0.4],
        'line-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0, 10.6, 1],
      },
    },
    { id: 'base-mar', type: 'fill', source: 'base', 'source-layer': 'water', paint: { 'fill-color': p.mar, 'fill-antialias': true } },
    {
      id: 'base-margem',
      type: 'line',
      source: 'base',
      'source-layer': 'water',
      minzoom: 2,
      layout: { 'line-join': 'round' },
      paint: { 'line-color': p.rio, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 0.5, 8, 0.8, 13, 1.1], 'line-opacity': ['interpolate', ['linear'], ['zoom'], 2, 0.6, 8, 0.9] },
    },
    // rios em hierarquia: o rio grande entra cedo e engrossa; o córrego só de perto, fino
    {
      id: 'base-corrego',
      type: 'line',
      source: 'base',
      'source-layer': 'waterway',
      minzoom: 10.5,
      filter: ['in', ['get', 'class'], ['literal', ['stream', 'stream_intermittent']]],
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': p.rio, 'line-width': ['interpolate', ['linear'], ['zoom'], 10.5, 0.3, 14, 0.9], 'line-opacity': 0.7 },
    },
    {
      id: 'base-rio',
      type: 'line',
      source: 'base',
      'source-layer': 'waterway',
      minzoom: 6,
      filter: ['in', ['get', 'class'], ['literal', ['river', 'canal']]],
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': p.rio,
        'line-width': ['interpolate', ['exponential', 1.4], ['zoom'], 6, 0.45, 9, 0.9, 12, 1.8, 15, 3.2],
        'line-opacity': ['interpolate', ['linear'], ['zoom'], 6, 0.55, 8, 1],
      },
    },
    {
      id: 'base-estrada',
      type: 'line',
      source: 'base',
      'source-layer': 'road',
      minzoom: 9,
      filter: ['in', ['get', 'class'], ['literal', ['motorway', 'trunk', 'primary']]],
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': p.tintaFraca,
        'line-opacity': ['interpolate', ['linear'], ['zoom'], 9, 0.18, 12, 0.3],
        'line-width': ['interpolate', ['linear'], ['zoom'], 9, 0.4, 14, 1.6],
      },
    },
    // divisa de estado: traço-ponto fino (convenção de limite administrativo)
    {
      id: 'base-divisa-uf',
      type: 'line',
      source: 'base',
      'source-layer': 'admin',
      minzoom: 3,
      filter: ['all', ['==', ['get', 'admin_level'], 1], ['==', ['get', 'maritime'], 'false'], ['match', ['get', 'worldview'], ['all', 'US'], true, false]],
      layout: { 'line-join': 'round' },
      paint: {
        'line-color': p.tinta,
        'line-opacity': ['interpolate', ['linear'], ['zoom'], 3, 0.16, 6, 0.3, 10, 0.36],
        'line-width': ['interpolate', ['linear'], ['zoom'], 3, 0.4, 8, 0.75, 12, 1],
        'line-dasharray': [4, 1.6, 1, 1.6],
      },
    },
    // fronteira entre países: faixa larga e pálida por baixo, fio de tinta por cima
    {
      id: 'base-fronteira-faixa',
      type: 'line',
      source: 'base',
      'source-layer': 'admin',
      minzoom: 2.5,
      filter: ['all', ['==', ['get', 'admin_level'], 0], ['==', ['get', 'maritime'], 'false'], ['match', ['get', 'worldview'], ['all', 'US'], true, false]],
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': p.fronteiraFaixa, 'line-width': ['interpolate', ['linear'], ['zoom'], 2.5, 2.5, 6, 6, 10, 9] },
    },
    {
      id: 'base-fronteira',
      type: 'line',
      source: 'base',
      'source-layer': 'admin',
      filter: ['all', ['==', ['get', 'admin_level'], 0], ['==', ['get', 'maritime'], 'false'], ['match', ['get', 'worldview'], ['all', 'US'], true, false]],
      layout: { 'line-join': 'round' },
      paint: {
        'line-color': p.tinta,
        'line-opacity': ['interpolate', ['linear'], ['zoom'], 1, 0.3, 5, 0.5],
        'line-width': ['interpolate', ['linear'], ['zoom'], 1, 0.4, 5, 0.8, 10, 1.2],
      },
    },
    // ── rótulos do mapa base (os dados do Atlas entram abaixo deste ponto) ──
    // symbol-placement não aceita expressão por dado: mares (ponto) e rios (linha) em camadas separadas
    {
      id: ANTES_DOS_ROTULOS,
      type: 'symbol',
      source: 'base',
      'source-layer': 'natural_label',
      minzoom: 1,
      filter: ['all', ['==', ['geometry-type'], 'Point'], ['in', ['get', 'class'], ['literal', ['ocean', 'sea', 'water', 'bay']]], ['<=', ['get', 'filterrank'], 2]],
      layout: {
        'text-field': nomePt as never,
        'text-font': AGUA,
        'text-size': ['interpolate', ['linear'], ['zoom'], 1, 10.5, 6, 14],
        'text-letter-spacing': 0.18,
        'text-max-width': 7,
        'text-line-height': 1.35,
      },
      paint: { 'text-color': p.rotuloAgua, 'text-halo-color': p.mar, 'text-halo-width': 1 },
    },
    {
      id: 'base-rotulo-rio',
      type: 'symbol',
      source: 'base',
      'source-layer': 'natural_label',
      minzoom: 4,
      filter: ['all', ['==', ['geometry-type'], 'LineString'], ['in', ['get', 'class'], ['literal', ['river', 'canal', 'water']]], ['<=', ['get', 'filterrank'], ['step', ['zoom'], 1, 6, 2, 9, 3, 12, 5]]],
      layout: {
        'text-field': nomePt as never,
        'text-font': AGUA,
        'text-size': ['interpolate', ['linear'], ['zoom'], 4, 10, 9, 12, 13, 13.5],
        'text-letter-spacing': 0.12,
        'symbol-placement': 'line',
        'symbol-spacing': 460,
        'text-max-angle': 28,
        'text-offset': [0, -0.55],
      },
      paint: { 'text-color': p.rotuloRio, 'text-opacity': 0.92, 'text-halo-color': p.papel, 'text-halo-width': 1.2 },
    },
    // cidades: ponto de tinta, capital de estado com anel, capital do país com anel duplo; o
    // nome na serifa, maior quanto mais importante (symbolrank), sempre ao lado do ponto
    {
      id: 'base-rotulo-cidade',
      type: 'symbol',
      source: 'base',
      'source-layer': 'place_label',
      minzoom: 4.5,
      filter: [
        'all',
        ['==', ['get', 'class'], 'settlement'],
        ['<=', ['get', 'filterrank'], 2],
        ['<=', ['get', 'symbolrank'], ['step', ['zoom'], 6, 5.5, 8, 7, 10, 9, 13, 11, 16]],
      ],
      layout: {
        'icon-image': ['match', ['get', 'capital'], 2, 'atlas-cidade-pais', 4, 'atlas-cidade-capital', 'atlas-cidade'] as never,
        'icon-size': ['interpolate', ['linear'], ['zoom'], 4.5, 0.75, 9, 1],
        'text-field': nomePt as never,
        'text-font': ['match', ['get', 'capital'], [2, 4], SERIFA_FORTE, SERIFA] as never,
        'text-size': ['interpolate', ['linear'], ['zoom'], 4.5, ['match', ['get', 'capital'], [2, 4], 12, 10.5], 10, ['match', ['get', 'capital'], [2, 4], 16, ['step', ['get', 'symbolrank'], 15, 9, 13.5, 13, 12]]] as never,
        'text-max-width': 8,
        'text-padding': 4,
        'text-variable-anchor': ['left', 'right', 'top', 'bottom'],
        'text-radial-offset': 0.55,
        'text-justify': 'auto',
        'symbol-sort-key': ['get', 'symbolrank'],
      },
      paint: { 'text-color': p.tintaSuave, 'text-halo-color': p.papel, 'text-halo-width': 1.3, 'text-opacity': 0.95, 'icon-opacity': 0.85 },
    },
    {
      id: 'base-rotulo-uf',
      type: 'symbol',
      source: 'base',
      'source-layer': 'place_label',
      minzoom: 3.6,
      maxzoom: 8,
      filter: ['==', ['get', 'class'], 'state'],
      layout: {
        'text-field': ['step', ['zoom'], ['coalesce', ['get', 'abbr'], nomePt], 5, nomePt] as never,
        'text-font': AREA,
        'text-transform': 'uppercase',
        'text-letter-spacing': 0.22,
        'text-size': ['interpolate', ['linear'], ['zoom'], 3.6, 8.5, 7, 11],
        'text-max-width': 7,
        'text-padding': 8,
        // o controle põe esta camada logo abaixo do selo das usinas (o selo é colocado antes e
        // vence): o nome do estado desvia dele em vez de sumir (Belo Monte contra "PARÁ")
        'text-variable-anchor': ['center', 'top', 'bottom', 'left', 'right'],
        'text-radial-offset': 1.1,
        'text-justify': 'auto',
      },
      paint: { 'text-color': p.tintaFraca, 'text-halo-color': p.papel, 'text-halo-width': 1, 'text-opacity': 0.62 },
    },
    {
      id: 'base-rotulo-pais',
      type: 'symbol',
      source: 'base',
      'source-layer': 'place_label',
      maxzoom: 6.5,
      filter: ['all', ['==', ['get', 'class'], 'country'], ['<=', ['get', 'symbolrank'], ['step', ['zoom'], 2, 2, 3, 3, 5, 4, 8]]],
      layout: {
        'text-field': nomePt as never,
        'text-font': SERIFA_FORTE,
        'text-transform': 'uppercase',
        'text-letter-spacing': 0.24,
        'text-size': ['interpolate', ['linear'], ['zoom'], 1, 9.5, 5, 15],
        'text-max-width': 6,
        'text-padding': 10,
      },
      paint: { 'text-color': p.tinta, 'text-halo-color': p.papel, 'text-halo-width': 1.4, 'text-opacity': 0.78 },
    },
  ];

  return {
    version: 8,
    name: `Alexandria · Atlas · ${modo}`,
    glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
    projection: { name: 'globe' },
    fog: atmosfera(modo),
    sources: {
      base: { type: 'vector', url: 'mapbox://mapbox.mapbox-streets-v8' },
      relevo: { type: 'raster-dem', url: 'mapbox://mapbox.mapbox-terrain-dem-v1', tileSize: 512, maxzoom: 14 },
      curvas: { type: 'vector', url: 'mapbox://mapbox.mapbox-terrain-v2' },
      satelite: { type: 'raster', url: 'mapbox://mapbox.satellite', tileSize: 512, maxzoom: 19 },
    },
    layers: camadas,
  } as Style;
}

/** Cor padrão de cada rótulo da base, no modo (o satélite não troca a cor: só alarga o halo). */
export function corDoRotuloDaBase(id: (typeof ROTULOS_DA_BASE)[number], p: PaletaDoMapa): { cor: string; halo: string } {
  switch (id) {
    case 'base-rotulo-agua':
      return { cor: p.rotuloAgua, halo: p.mar };
    case 'base-rotulo-rio':
      return { cor: p.rotuloRio, halo: p.papel };
    case 'base-rotulo-pais':
      return { cor: p.tinta, halo: p.papel };
    case 'base-rotulo-uf':
      return { cor: p.tintaFraca, halo: p.papel };
    default:
      return { cor: p.tintaSuave, halo: p.papel };
  }
}

/** Cor de uma linha pela tensão (kV) — expressão Mapbox. */
export function corDaLinha(p: PaletaDoMapa): unknown[] {
  return [
    'case',
    ['==', ['get', 'cc'], 1],
    p.linha.cc,
    ['>=', ['get', 'kv'], 750],
    p.linha.ca765,
    ['>=', ['get', 'kv'], 500],
    p.linha.ca500,
    ['>=', ['get', 'kv'], 440],
    p.linha.ca440,
    ['>=', ['get', 'kv'], 345],
    p.linha.ca345,
    ['>=', ['get', 'kv'], 230],
    p.linha.ca230,
    p.linha.caMenor,
  ];
}

/** Cor de uma usina pela fonte — expressão Mapbox. */
export function corDaUsina(p: PaletaDoMapa): unknown[] {
  const pares: unknown[] = [];
  for (const [cat, cor] of Object.entries(p.categoria)) pares.push(cat, cor);
  return ['match', ['get', 'cat'], ...pares, p.categoria.outros];
}

/** Cor de uma usina pela fonte com transparência (preenchimento do símbolo proporcional). */
export function corDaUsinaTranslucida(p: PaletaDoMapa, alfa: number): unknown[] {
  const pares: unknown[] = [];
  for (const [cat, cor] of Object.entries(p.categoria)) pares.push(cat, comAlfa(cor, alfa));
  return ['match', ['get', 'cat'], ...pares, comAlfa(p.categoria.outros, alfa)];
}

/** #rrggbb → rgba(r, g, b, alfa). */
export function comAlfa(hex: string, alfa: number): string {
  const v = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgba(${v[0]}, ${v[1]}, ${v[2]}, ${alfa})`;
}

/** Luminância relativa (WCAG) de #rrggbb. */
function luminancia(hex: string): number {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

function contraste(a: string, b: string): number {
  const [x, y] = [luminancia(a), luminancia(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

// ── a linguagem das linhas ──────────────────────────────────────────
//
// Uma linha de transmissão é desenhada em duas passadas: um contorno da cor do
// papel (o "casco") e o traço por cima. O casco é o que faz o cruzamento ler — a
// linha mais alta corta a mais baixa com um fio de papel — e o que deixa a linha
// legível sobre a foto de satélite. As camadas vão em dois andares (abaixo de
// 345 kV e de 345 kV para cima), cada um com seu casco: o andar de cima corta o de
// baixo. Dentro de cada andar, a de maior tensão é desenhada por último.
//
// A hierarquia é de espessura primeiro (a 765 kV tem quase quatro vezes a largura
// da 230 kV) e de tom depois (PALETA.linha, do mais escuro para o mais claro). A
// largura cresce com o zoom, mas devagar: de perto a linha continua fio, não barra.
// A corrente contínua tem linguagem própria: faixa de ouro com alma de papel (um
// trilho duplo), a única linha "oca" do mapa. Linha ainda sem entrada em operação
// é tracejada, mais fina e mais clara, sem casco.

export type ClasseDeTensao = 'cc' | 'ca765' | 'ca500' | 'ca440' | 'ca345' | 'ca230' | 'caMenor';

/** Largura do traço (px) de cada classe nos zooms de ZOOMS_DO_TRACO. */
export const LARGURA_DA_CLASSE: Record<ClasseDeTensao, readonly [number, number, number, number]> = {
  // achado 11 (a rede pesava mais que as usinas): de perto a linha é fio, e a usina, o objeto
  // mais escuro da vista; do zoom 9 em diante 500 kV ou mais fica em ~1,6 px e o resto em ~1 px
  cc: [1.7, 2.4, 2.2, 2.5],
  ca765: [1.6, 2.2, 1.8, 1.9],
  ca500: [1.1, 1.6, 1.5, 1.6],
  ca440: [0.9, 1.3, 1.2, 1.3],
  ca345: [0.72, 1.0, 1.0, 1.1],
  ca230: [0.45, 0.55, 0.8, 0.9],
  caMenor: [0.35, 0.42, 0.6, 0.7],
};
export const ZOOMS_DO_TRACO = [3, 6, 9, 12] as const;
/** Casco de papel, px de cada lado do traço, nos mesmos zooms. */
export const CASCO_DO_TRACO = [0.45, 0.8, 1.1, 1.4] as const;
/** A alma de papel da corrente contínua, como fração da largura da faixa. */
export const ALMA_DA_CC = 0.36;

/** Classe de uma linha pela tensão e pelo tipo de corrente (mesma regra da expressão). */
export function classeDaLinha(kv: number, cc: boolean): ClasseDeTensao {
  if (cc) return 'cc';
  if (kv >= 750) return 'ca765';
  if (kv >= 500) return 'ca500';
  if (kv >= 440) return 'ca440';
  if (kv >= 345) return 'ca345';
  if (kv >= 230) return 'ca230';
  return 'caMenor';
}

/** Valor por classe, como expressão Mapbox (case encadeado sobre cc e kv). */
function porClasse(valor: (k: ClasseDeTensao) => number): unknown[] {
  return [
    'case',
    ['==', ['get', 'cc'], 1],
    valor('cc'),
    ['>=', ['get', 'kv'], 750],
    valor('ca765'),
    ['>=', ['get', 'kv'], 500],
    valor('ca500'),
    ['>=', ['get', 'kv'], 440],
    valor('ca440'),
    ['>=', ['get', 'kv'], 345],
    valor('ca345'),
    ['>=', ['get', 'kv'], 230],
    valor('ca230'),
    valor('caMenor'),
  ];
}

/** Largura do traço por zoom e classe. `fator` multiplica o traço; `casco` soma o
 *  contorno de papel dos dois lados (para a camada de casco). */
export function larguraDaLinha(fator = 1, casco = false): unknown[] {
  const e: unknown[] = ['interpolate', ['linear'], ['zoom']];
  ZOOMS_DO_TRACO.forEach((z, i) => {
    e.push(z, porClasse((k) => +(LARGURA_DA_CLASSE[k][i] * fator + (casco ? 2 * CASCO_DO_TRACO[i] : 0)).toFixed(3)));
  });
  return e;
}

/** Deslocamento lateral dos circuitos paralelos (propriedade `par`, em vagas): todos
 *  sobrepostos de longe, lado a lado a partir da escala do estado. */
export function deslocamentoDosParalelos(): unknown[] {
  const par = ['coalesce', ['get', 'par'], 0];
  return ['interpolate', ['linear'], ['zoom'], 8.5, 0, 11, ['*', par, 4], 14, ['*', par, 7]];
}

// ── a linguagem das usinas ──────────────────────────────────────────
//
// Duas escalas, um vocabulário:
//   · DE LONGE, símbolo proporcional: a área cresce com a potência (a mesma régua de
//     antes), preenchimento translúcido e fio cheio na cor da fonte; os menores por
//     cima. A FORMA já diz a família: círculo para usina de fluxo natural (água, vento,
//     sol), quadrado de mesma área para usina térmica (queima ou fissão: biomassa,
//     gás, carvão, óleo, outros fósseis, nuclear). Assim a fonte não depende só da cor.
//   · DE PERTO (a partir do zoom 5, onde houver espaço, as maiores primeiro), o selo:
//     a mesma forma, cheia na cor da fonte, com o pictograma da fonte em gravura (gota
//     de onda, rotor, sol, átomo, folha, chama, carvão, barril, chaminé) na cor da casa
//     que mais contrasta com o selo. O selo cresce em degraus de potência.
//   · Na escala das maquetes, o selo encolhe para uma âncora ao pé do modelo 3D.
// A legenda do painel usa estas mesmas funções de desenho.

export type FormaDaUsina = 'disco' | 'quadro';

export const FORMA_DA_CATEGORIA: Record<Categoria, FormaDaUsina> = {
  hidro: 'disco',
  eolica: 'disco',
  solar: 'disco',
  nuclear: 'quadro',
  biomassa: 'quadro',
  gas: 'quadro',
  carvao: 'quadro',
  oleo: 'quadro',
  outros: 'quadro',
};

/** Categorias de forma quadrada, para expressões do mapa. */
export const CATEGORIAS_QUADRADAS = (Object.keys(FORMA_DA_CATEGORIA) as Categoria[]).filter((c) => FORMA_DA_CATEGORIA[c] === 'quadro');

/** Lado lógico (px) da imagem SDF do símbolo proporcional: forma de SDF_FORMA px com
 *  SDF_BORDA px de borda de cada lado (a borda guarda o fio, que é o halo do SDF). */
export const SDF_FORMA = 24;
export const SDF_BORDA = 8;

/** Quadrado de mesma área que o círculo de raio r tem lado r·√π. */
export const LADO_DO_QUADRADO_POR_RAIO = Math.sqrt(Math.PI);

/** Imagem SDF (alfa = distância à borda, convenção do Mapbox: borda em 0,75, 8 px por
 *  unidade) de um disco ou de um quadrado. Uma imagem por forma; a cor vem do mapa.
 *
 *  `fio`: em vez da forma cheia, o contorno dela com largura zero. No Mapbox o halo do
 *  SDF cobre também o miolo da forma, então preenchimento translúcido + halo dá um disco
 *  chapado. Com o contorno de largura zero a forma não tem área, e o halo vira um fio de
 *  largura constante na tela (icon-halo-width), em qualquer tamanho do símbolo. */
export function imagemSdf(forma: FormaDaUsina, fio = false, tracejado = false): { width: number; height: number; data: Uint8Array } {
  const lado = SDF_FORMA + 2 * SDF_BORDA;
  const data = new Uint8Array(lado * lado * 4);
  const c = lado / 2;
  const h = SDF_FORMA / 2;
  // tracejado (posição a confirmar no cadastro): o contorno vira traços, e a distância passa a
  // ser até o traço mais perto. Pontos do contorno a cada 0,25 px; 8 traços no disco, 3 por lado
  // no quadrado (os cantos ficam cheios, para a forma continuar lendo como quadrado).
  const tracos: [number, number][] = [];
  if (tracejado) {
    if (forma === 'disco') {
      const per = 2 * Math.PI * h;
      for (let s = 0; s < per; s += 0.25) {
        const t = s / per;
        if ((t * 16) % 2 < 1) tracos.push([h * Math.cos(t * 2 * Math.PI), h * Math.sin(t * 2 * Math.PI)]);
      }
    } else {
      for (let lado4 = 0; lado4 < 4; lado4++)
        for (let s = -h; s <= h; s += 0.25) {
          // traço–vão–traço–vão–traço: 5 partes iguais, os vãos na 2ª e na 4ª
          const parte = Math.floor(((s + h) / (2 * h)) * 5);
          if (parte === 1 || parte === 3) continue;
          tracos.push(lado4 === 0 ? [s, -h] : lado4 === 1 ? [h, s] : lado4 === 2 ? [s, h] : [-h, s]);
        }
    }
  }
  for (let y = 0; y < lado; y++) {
    for (let x = 0; x < lado; x++) {
      const px = x + 0.5 - c;
      const py = y + 0.5 - c;
      let d: number;
      if (forma === 'disco') d = Math.hypot(px, py) - h;
      else {
        const qx = Math.abs(px) - h;
        const qy = Math.abs(py) - h;
        d = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0);
      }
      if (fio) d = Math.abs(d);
      if (tracejado) {
        d = Infinity;
        for (const [tx, ty] of tracos) d = Math.min(d, Math.hypot(px - tx, py - ty));
      }
      const v = Math.max(0, Math.min(255, Math.round(255 - 255 * (d / 8 + 0.25))));
      const i = (y * lado + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = 255;
      data[i + 3] = v;
    }
  }
  return { width: lado, height: lado, data };
}

/** Lado lógico (px) do selo da usina com icon-size 1. */
export const LADO_DO_SELO = 26;
/** Raio do selo redondo; o quadrado tem a mesma área. */
const RAIO_DO_SELO = 10.5;

/** Cor do pictograma: papel ou tinta, a que mais contrasta com o fundo do selo. */
export function corDoGlifo(fundo: string, p: PaletaDoMapa): string {
  return contraste(fundo, p.papel) >= contraste(fundo, p.tinta) ? p.papel : p.tinta;
}

/** O pictograma de cada fonte, centrado em (0, 0), cabendo num raio de ~7 px. */
function glifo(c: CanvasRenderingContext2D, cat: Categoria, cor: string, fundo: string) {
  c.fillStyle = cor;
  c.strokeStyle = cor;
  c.lineCap = 'round';
  c.lineJoin = 'round';
  switch (cat) {
    case 'hidro': {
      // duas ondas: a água que passa pela turbina
      c.lineWidth = 2;
      for (const y0 of [-2.4, 2.8]) {
        c.beginPath();
        c.moveTo(-6, y0);
        c.bezierCurveTo(-4, y0 - 2.4, -2, y0 - 2.4, 0, y0);
        c.bezierCurveTo(2, y0 + 2.4, 4, y0 + 2.4, 6, y0);
        c.stroke();
      }
      break;
    }
    case 'eolica': {
      // rotor de três pás sobre o mastro
      // pás largas e mastro curto: em 14 px o rotor tem de ler como rotor, não como seta
      const hy = -1.2;
      c.lineWidth = 1.6;
      c.beginPath();
      c.moveTo(0, hy);
      c.lineTo(0, 7.6);
      c.stroke();
      for (const a of [-90, 30, 150]) {
        c.save();
        c.translate(0, hy);
        c.rotate((a * Math.PI) / 180);
        c.beginPath();
        c.moveTo(0.6, -1.5);
        c.quadraticCurveTo(4, -2.3, 6.6, -0.2);
        c.quadraticCurveTo(4, 1.2, 0.6, 1.4);
        c.closePath();
        c.fill();
        c.restore();
      }
      c.beginPath();
      c.arc(0, hy, 1.7, 0, Math.PI * 2);
      c.fill();
      break;
    }
    case 'solar': {
      c.beginPath();
      c.arc(0, 0, 2.9, 0, Math.PI * 2);
      c.fill();
      c.lineWidth = 1.5;
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        c.beginPath();
        c.moveTo(Math.cos(a) * 4.7, Math.sin(a) * 4.7);
        c.lineTo(Math.cos(a) * 7, Math.sin(a) * 7);
        c.stroke();
      }
      break;
    }
    case 'nuclear': {
      c.lineWidth = 1.1;
      for (const a of [0, 60, 120]) {
        c.beginPath();
        c.ellipse(0, 0, 6.7, 2.4, (a * Math.PI) / 180, 0, Math.PI * 2);
        c.stroke();
      }
      c.beginPath();
      c.arc(0, 0, 1.55, 0, Math.PI * 2);
      c.fill();
      break;
    }
    case 'biomassa': {
      // folha, com a nervura na cor do selo
      c.beginPath();
      c.moveTo(-6.2, 6.2);
      c.bezierCurveTo(-6.8, -1.8, -1.2, -6.6, 6.6, -6.6);
      c.bezierCurveTo(6.6, 1.2, 1.8, 6.8, -6.2, 6.2);
      c.closePath();
      c.fill();
      c.strokeStyle = fundo;
      c.lineWidth = 1.1;
      c.beginPath();
      c.moveTo(-5.6, 5.6);
      c.quadraticCurveTo(-0.6, 0.4, 4.4, -4.4);
      c.stroke();
      break;
    }
    case 'gas': {
      // chama, com o miolo na cor do selo
      c.beginPath();
      c.moveTo(0, -7.2);
      c.bezierCurveTo(2.6, -3.6, 5.6, -1, 5.6, 2.6);
      c.bezierCurveTo(5.6, 5.7, 3.1, 7.3, 0, 7.3);
      c.bezierCurveTo(-3.1, 7.3, -5.6, 5.7, -5.6, 2.6);
      c.bezierCurveTo(-5.6, -1, -2.6, -3.6, 0, -7.2);
      c.closePath();
      c.fill();
      c.fillStyle = fundo;
      c.beginPath();
      c.moveTo(0, 0.6);
      c.bezierCurveTo(1.3, 2.1, 2.5, 3.1, 2.5, 4.7);
      c.bezierCurveTo(2.5, 6.1, 1.3, 6.9, 0, 6.9);
      c.bezierCurveTo(-1.3, 6.9, -2.5, 6.1, -2.5, 4.7);
      c.bezierCurveTo(-2.5, 3.1, -1.3, 2.1, 0, 0.6);
      c.closePath();
      c.fill();
      break;
    }
    case 'carvao': {
      // três pedras empilhadas
      const pedras = [
        [-6.6, 6.2, -5.6, 1.8, -2, 0.6, 0.3, 3.7, -0.9, 6.2],
        [0.7, 6.2, 1.7, 2.3, 4.9, 1.2, 6.7, 4.5, 5.3, 6.2],
        [-3.3, -0.4, -2, -4.6, 1.4, -5.8, 3.7, -2.5, 1.4, 0],
      ];
      for (const q of pedras) {
        c.beginPath();
        c.moveTo(q[0], q[1]);
        for (let i = 2; i < q.length; i += 2) c.lineTo(q[i], q[i + 1]);
        c.closePath();
        c.fill();
      }
      break;
    }
    case 'oleo': {
      // barril com dois aros na cor do selo
      c.fillRect(-4.6, -6.6, 9.2, 13.2);
      c.strokeStyle = fundo;
      c.lineWidth = 1.2;
      for (const y of [-2.3, 2.3]) {
        c.beginPath();
        c.moveTo(-4.6, y);
        c.lineTo(4.6, y);
        c.stroke();
      }
      break;
    }
    default: {
      // outros fósseis: galpão de telhado em dente de serra e chaminé
      c.fillRect(2.6, -6.8, 2.6, 13.4);
      c.beginPath();
      c.moveTo(-6.6, 6.6);
      c.lineTo(-6.6, -0.6);
      c.lineTo(-3.6, 1.6);
      c.lineTo(-3.6, -0.6);
      c.lineTo(-0.6, 1.6);
      c.lineTo(-0.6, -0.6);
      c.lineTo(2.6, 1.8);
      c.lineTo(2.6, 6.6);
      c.closePath();
      c.fill();
    }
  }
}

/** O selo de uma fonte num quadro de LADO_DO_SELO px (unidades lógicas do contexto):
 *  forma da família, cheia na cor da fonte, halo de papel por fora e o pictograma. */
export function desenharSelo(c: CanvasRenderingContext2D, cat: Categoria, p: PaletaDoMapa) {
  const fundo = p.categoria[cat];
  const meio = LADO_DO_SELO / 2;
  c.save();
  c.translate(meio, meio);
  const caminho = (folga: number) => {
    c.beginPath();
    if (FORMA_DA_CATEGORIA[cat] === 'disco') c.arc(0, 0, RAIO_DO_SELO + folga, 0, Math.PI * 2);
    else {
      const h = (RAIO_DO_SELO * LADO_DO_QUADRADO_POR_RAIO) / 2 + folga;
      c.rect(-h, -h, 2 * h, 2 * h);
    }
  };
  caminho(1.5);
  c.fillStyle = p.papel;
  c.fill();
  caminho(0);
  c.fillStyle = fundo;
  c.fill();
  glifo(c, cat, corDoGlifo(fundo, p), fundo);
  c.restore();
}

/** Âncora: o pé da maquete 3D, no ponto do cadastro. Usina: disco de 3,5 px na cor da fonte
 *  (quadrado de mesma área nas térmicas), com fio de papel de 1 px. Rede (e instalação da
 *  ANP): quadrado de 4 px em tinta, com o mesmo fio. */
export function desenharAncora(c: CanvasRenderingContext2D, cat: Categoria | 'rede', p: PaletaDoMapa) {
  const meio = LADO_DA_ANCORA / 2;
  c.save();
  c.translate(meio, meio);
  c.beginPath();
  if (cat === 'rede') c.rect(-2, -2, 4, 4);
  else if (FORMA_DA_CATEGORIA[cat] === 'disco') c.arc(0, 0, 3.5, 0, Math.PI * 2);
  else c.rect(-3.1, -3.1, 6.2, 6.2);
  c.fillStyle = cat === 'rede' ? p.tinta : p.categoria[cat];
  c.fill();
  c.strokeStyle = p.papel;
  c.lineWidth = 1;
  c.stroke();
  c.restore();
}
export const LADO_DA_ANCORA = 14;

// ── subestações, reservatórios e cidades ────────────────────────────

/** Porte da subestação pela maior tensão: o símbolo cresce e ganha núcleo. */
export type PorteDaSubestacao = 'alta' | 'media' | 'baixa' | 'prevista';
export const LADO_DA_SUBESTACAO = 16;

/** Quadrado de papel com fio de tinta; a de 500 kV ou mais ganha núcleo cheio, a de 345 e
 *  440 kV um núcleo menor; a prevista é só o contorno tracejado. */
export function desenharSubestacao(c: CanvasRenderingContext2D, porte: PorteDaSubestacao, p: PaletaDoMapa, aConfirmar = false) {
  const m = LADO_DA_SUBESTACAO / 2;
  const meio = { alta: 5.6, media: 4.6, baixa: 3.6, prevista: 4.4 }[porte];
  c.save();
  c.translate(m, m);
  if (porte === 'prevista') {
    c.strokeStyle = p.tinta;
    c.lineWidth = 1.3;
    c.setLineDash([2.2, 1.6]);
    c.strokeRect(-meio, -meio, 2 * meio, 2 * meio);
    c.restore();
    return;
  }
  // halo de papel, para o quadrado não se perder sobre as linhas que chegam nele (e o que
  // separa a posição a confirmar, que tem halo e núcleo, da prevista, que é só o fio)
  c.fillStyle = p.papel;
  c.fillRect(-meio - 1.2, -meio - 1.2, 2 * meio + 2.4, 2 * meio + 2.4);
  c.strokeStyle = p.tinta;
  c.lineWidth = porte === 'alta' ? 1.5 : 1.25;
  // posição a confirmar no cadastro: o mesmo quadrado com o fio tracejado
  if (aConfirmar) c.setLineDash([1.8, 1.4]);
  c.strokeRect(-meio + 0.6, -meio + 0.6, 2 * meio - 1.2, 2 * meio - 1.2);
  c.setLineDash([]);
  if (porte !== 'baixa') {
    const n = porte === 'alta' ? 2.3 : 1.3;
    c.fillStyle = p.tinta;
    c.fillRect(-n, -n, 2 * n, 2 * n);
  }
  c.restore();
}

/** Expressão do porte da subestação (mesma regra de desenharSubestacao). */
export function porteDaSubestacao(prevista: unknown[]): unknown[] {
  return ['case', prevista, 'prevista', ['>=', ['coalesce', ['get', 'kv'], 0], 500], 'alta', ['>=', ['coalesce', ['get', 'kv'], 0], 345], 'media', 'baixa'];
}

/** Disco do reservatório fora do capítulo da água (cores iguais às do mapa). */
export function desenharReservatorio(c: CanvasRenderingContext2D, p: PaletaDoMapa, lado = 16) {
  c.beginPath();
  c.arc(lado / 2, lado / 2, lado / 2 - 2.2, 0, Math.PI * 2);
  c.fillStyle = p.lago;
  c.fill();
  c.strokeStyle = p.categoria.hidro;
  c.lineWidth = 1.1;
  c.stroke();
}

export type TipoDeCidade = 'cidade' | 'capital' | 'pais';
export const LADO_DA_CIDADE = 12;

/** Ponto de cidade: capital de estado com anel; capital do país com anel e ponto maior. */
export function desenharCidade(c: CanvasRenderingContext2D, tipo: TipoDeCidade, p: PaletaDoMapa) {
  const m = LADO_DA_CIDADE / 2;
  c.fillStyle = p.tintaSuave;
  c.strokeStyle = p.tintaSuave;
  c.beginPath();
  c.arc(m, m, tipo === 'pais' ? 2.2 : 1.7, 0, Math.PI * 2);
  c.fill();
  if (tipo !== 'cidade') {
    c.lineWidth = tipo === 'pais' ? 1.1 : 0.9;
    c.beginPath();
    c.arc(m, m, tipo === 'pais' ? 4.6 : 3.7, 0, Math.PI * 2);
    c.stroke();
  }
}

// ── a legenda desenha com as mesmas funções ─────────────────────────

const cacheDeImagens = new Map<string, string>();

/** Desenha num canvas fora da tela e devolve o data URL (com cache por chave). */
function urlDoDesenho(chave: string, largura: number, altura: number, desenho: (c: CanvasRenderingContext2D) => void): string {
  const pronto = cacheDeImagens.get(chave);
  if (pronto) return pronto;
  if (typeof document === 'undefined') return '';
  const escala = 3;
  const cv = document.createElement('canvas');
  cv.width = Math.round(largura * escala);
  cv.height = Math.round(altura * escala);
  const c = cv.getContext('2d');
  if (!c) return '';
  c.scale(escala, escala);
  desenho(c);
  const url = cv.toDataURL('image/png');
  cacheDeImagens.set(chave, url);
  return url;
}

/** Selo da fonte, como imagem para a legenda (o mesmo desenho do mapa). */
export function urlDoSelo(cat: Categoria, modo: ModoV3): string {
  return urlDoDesenho(`selo-${cat}-${modo}`, LADO_DO_SELO, LADO_DO_SELO, (c) => desenharSelo(c, cat, PALETA[modo]));
}

export function urlDaSubestacao(porte: PorteDaSubestacao, modo: ModoV3): string {
  return urlDoDesenho(`se-${porte}-${modo}`, LADO_DA_SUBESTACAO, LADO_DA_SUBESTACAO, (c) => desenharSubestacao(c, porte, PALETA[modo]));
}

export function urlDoReservatorio(modo: ModoV3): string {
  return urlDoDesenho(`res-${modo}`, 16, 16, (c) => desenharReservatorio(c, PALETA[modo]));
}

/** Amostra do traço de uma classe de tensão (largura e cores do mapa no zoom 9, a escala do estado). */
export function urlDoTraco(classe: ClasseDeTensao, modo: ModoV3, prevista = false, largura = 30): string {
  const p = PALETA[modo];
  const altura = 10;
  return urlDoDesenho(`traco-${classe}-${prevista ? 'p' : 'o'}-${modo}-${largura}`, largura, altura, (c) => {
    const w = LARGURA_DA_CLASSE[classe][2];
    const y = altura / 2;
    const reta = (lw: number, cor: string, traco: number[] = []) => {
      c.beginPath();
      c.setLineDash(traco);
      c.lineWidth = lw;
      c.strokeStyle = cor;
      c.moveTo(1, y);
      c.lineTo(largura - 1, y);
      c.stroke();
    };
    if (prevista) {
      c.globalAlpha = 0.75;
      reta(w * 0.7, p.linha[classe], [w * 0.7 * 2.2, w * 0.7 * 1.6]);
      return;
    }
    // a legenda fica sobre o papel do painel: o casco não aparece, mas a alma da CC sim
    reta(w, p.linha[classe]);
    if (classe === 'cc') reta(w * ALMA_DA_CC, p.papel);
  });
}

// ── a linguagem do combustível ──────────────────────────────────────
//
// O capítulo "O combustível" fala a mesma língua da rede, com um vocabulário próprio
// para o que não é usina nem linha de transmissão:
//   · GASODUTO de transporte: traço contínuo na cor da fonte "gás natural" (a mesma da
//     usina a gás, para amarrar o duto à usina que ele alimenta), com casco de papel; a
//     espessura cresce com o diâmetro nominal declarado pela ANP. Trecho sem diâmetro na
//     fonte fica com o traço mais fino (a ausência não ganha largura plausível).
//   · INSTALAÇÃO: a FORMA diz a função e a COR diz o fluido. Hexágono = processamento
//     (refinaria, UPGN); losango = terminal (GNL, líquidos). Cor do óleo para refinaria e
//     terminal de líquidos, cor do gás para UPGN e terminal de GNL. Nenhuma é círculo nem
//     quadrado: essas formas são das usinas. O terminal de líquidos, o mais numeroso e o de
//     menor hierarquia, é só contorno (papel por dentro), com um núcleo pequeno.
//   · ÁREAS: campo de produção com preenchimento translúcido na cor do fluido principal;
//     bloco exploratório só com fio; bacia sedimentar em areia acinzentada (PALETA.sedimento);
//     o polígono do pré-sal como limite tracejado (convenção de limite, como a divisa).

export type TipoDeInstalacao = 'refinaria' | 'gnl' | 'upgn' | 'terminal';

/** Lado lógico (px) do símbolo da instalação com icon-size 1. */
export const LADO_DA_INSTALACAO = 26;

/** Cor do fluido da instalação. */
export function corDaInstalacao(tipo: TipoDeInstalacao, p: PaletaDoMapa): string {
  return tipo === 'gnl' || tipo === 'upgn' ? p.categoria.gas : p.categoria.oleo;
}

/** Símbolo da instalação, num quadro de LADO_DA_INSTALACAO px (o mesmo desenho no mapa e na legenda). */
export function desenharInstalacao(c: CanvasRenderingContext2D, tipo: TipoDeInstalacao, p: PaletaDoMapa) {
  const fundo = corDaInstalacao(tipo, p);
  const meio = LADO_DA_INSTALACAO / 2;
  c.save();
  c.translate(meio, meio);
  const hexagono = tipo === 'refinaria' || tipo === 'upgn';
  const caminho = (r: number) => {
    c.beginPath();
    if (hexagono) {
      // hexágono de topo plano: lê diferente do círculo mesmo em 14 px
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        if (i === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
    } else {
      c.moveTo(0, -r);
      c.lineTo(r, 0);
      c.lineTo(0, r);
      c.lineTo(-r, 0);
    }
    c.closePath();
  };
  const r = hexagono ? 11 : 12;
  // halo de papel por fora, como o selo das usinas
  caminho(r + 1.6);
  c.fillStyle = p.papel;
  c.fill();
  if (tipo === 'terminal') {
    // só contorno, com um núcleo pequeno: o mais numeroso e o de menor hierarquia
    caminho(r - 1.2);
    c.lineJoin = 'miter';
    c.strokeStyle = fundo;
    c.lineWidth = 2.2;
    c.stroke();
    caminho(3.8);
    c.fillStyle = fundo;
    c.fill();
    c.restore();
    return;
  }
  caminho(r);
  c.fillStyle = fundo;
  c.fill();
  const cor = corDoGlifo(fundo, p);
  c.fillStyle = cor;
  c.strokeStyle = cor;
  c.lineCap = 'round';
  c.lineJoin = 'round';
  if (tipo === 'refinaria') {
    // duas colunas de destilação, a alta com os pratos na cor do fundo
    c.fillRect(-5, -6.4, 3.6, 12.6);
    c.fillRect(0.4, -2.8, 4.2, 9);
    c.strokeStyle = fundo;
    c.lineWidth = 0.9;
    for (const y of [-3.3, -0.4, 2.5]) {
      c.beginPath();
      c.moveTo(-5, y);
      c.lineTo(-1.4, y);
      c.stroke();
    }
  } else if (tipo === 'upgn') {
    // esfera de gás sobre dois pés, com o equador na cor do fundo
    c.beginPath();
    c.arc(0, -1.2, 4.6, 0, Math.PI * 2);
    c.fill();
    c.lineWidth = 1.4;
    c.beginPath();
    c.moveTo(-3, 2.2);
    c.lineTo(-4.2, 6.4);
    c.moveTo(3, 2.2);
    c.lineTo(4.2, 6.4);
    c.stroke();
    c.strokeStyle = fundo;
    c.lineWidth = 0.9;
    c.beginPath();
    c.moveTo(-4.6, -1.2);
    c.lineTo(4.6, -1.2);
    c.stroke();
  } else {
    // gota: o gás que chega líquido
    c.beginPath();
    c.moveTo(0, -6.6);
    c.bezierCurveTo(1.8, -3.6, 4.6, -1, 4.6, 2);
    c.bezierCurveTo(4.6, 4.8, 2.5, 6.6, 0, 6.6);
    c.bezierCurveTo(-2.5, 6.6, -4.6, 4.8, -4.6, 2);
    c.bezierCurveTo(-4.6, -1, -1.8, -3.6, 0, -6.6);
    c.closePath();
    c.fill();
  }
  c.restore();
}

export function urlDaInstalacao(tipo: TipoDeInstalacao, modo: ModoV3): string {
  return urlDoDesenho(`inst-${tipo}-${modo}`, LADO_DA_INSTALACAO, LADO_DA_INSTALACAO, (c) => desenharInstalacao(c, tipo, PALETA[modo]));
}

/** Zooms e coeficientes da largura do gasoduto: largura = base + k · diâmetro (pol). */
const DUTO_POR_ZOOM: [number, number, number][] = [
  [3, 0.5, 0.02],
  [6, 0.8, 0.045],
  [9, 1.1, 0.065],
  [12, 1.4, 0.085],
];
/** Casco de papel do gasoduto, px de cada lado, nos mesmos zooms. */
const CASCO_DO_DUTO = [0.45, 0.8, 1.1, 1.4];

/** Largura do gasoduto por zoom e diâmetro nominal. Sem diâmetro na fonte: o traço mais fino. */
export function larguraDoDuto(casco = false): unknown[] {
  const d = ['coalesce', ['get', 'diam'], 0];
  const e: unknown[] = ['interpolate', ['linear'], ['zoom']];
  DUTO_POR_ZOOM.forEach(([z, base, k], i) => {
    e.push(z, ['+', base + (casco ? 2 * CASCO_DO_DUTO[i] : 0), ['*', k, d]]);
  });
  return e;
}

/** Amostra do gasoduto para a legenda: diâmetro dado, zoom 9 (a escala do estado). */
export function urlDoDuto(modo: ModoV3, diam = 24, largura = 30): string {
  const p = PALETA[modo];
  const [, base, k] = DUTO_POR_ZOOM[2];
  return urlDoDesenho(`duto-${diam}-${modo}-${largura}`, largura, 10, (c) => {
    c.beginPath();
    c.lineWidth = base + k * diam;
    c.strokeStyle = p.categoria.gas;
    c.lineCap = 'round';
    c.moveTo(2, 5);
    c.lineTo(largura - 2, 5);
    c.stroke();
  });
}

export type AmostraDeArea = 'campo-oleo' | 'campo-gas' | 'campo-outros' | 'bloco' | 'bacia' | 'presal';

/** Opacidade do preenchimento do campo de produção (o fio fica cheio). */
export const PREENCHIMENTO_DO_CAMPO = 0.15;

/** Cor do campo pelo fluido principal declarado — expressão Mapbox. */
export function corDoCampo(p: PaletaDoMapa): unknown[] {
  return ['match', ['get', 'fluido'], 'oleo', p.categoria.oleo, 'gas', p.categoria.gas, p.tintaFraca];
}

/** Amostra de área para a legenda (as mesmas cores e opacidades do mapa). */
export function urlDaArea(tipo: AmostraDeArea, modo: ModoV3): string {
  const p = PALETA[modo];
  return urlDoDesenho(`area-${tipo}-${modo}`, 16, 16, (c) => {
    const ret = () => {
      c.beginPath();
      c.rect(2.5, 3.5, 11, 9);
    };
    if (tipo === 'presal') {
      c.setLineDash([3, 1.6]);
      c.strokeStyle = p.tinta;
      c.lineWidth = 1.2;
      ret();
      c.stroke();
      return;
    }
    const cor = tipo === 'campo-oleo' ? p.categoria.oleo : tipo === 'campo-gas' ? p.categoria.gas : tipo === 'campo-outros' ? p.tintaFraca : tipo === 'bacia' ? p.sedimento : p.tintaSuave;
    const alfa = tipo === 'bloco' ? 0.06 : tipo === 'bacia' ? 0.16 : PREENCHIMENTO_DO_CAMPO;
    ret();
    c.fillStyle = comAlfa(cor, alfa);
    c.fill();
    c.strokeStyle = cor;
    c.lineWidth = 1;
    c.stroke();
  });
}

// ── o mundo ─────────────────────────────────────────────────────────
// O capítulo "O mundo" colore países pela fonte dominante (sete chaves do
// Our World in Data) e por duas métricas contínuas. As cores abaixo seguem a
// paleta de fontes do Atlas, para que hidráulica, eólica, solar e nuclear
// tenham a mesma cor no Brasil e no mundo. Fóssil é um tom neutro (o OWID não
// separa gás, carvão e óleo nesta chave). "Outras renováveis" (geotérmica,
// marés) é uma biomassa mais funda: medida com as outras seis, mantém ΔE2000
// ≥ 10 nas três simulações de daltonismo, nos dois modos.

const FONTE_DO_MUNDO: Record<ModoV3, Record<keyof MatrizGeracao, string>> = {
  claro: {
    fossilPct: PALETA.claro.categoria.outros,
    nuclearPct: PALETA.claro.categoria.nuclear,
    hydroPct: PALETA.claro.categoria.hidro,
    windPct: PALETA.claro.categoria.eolica,
    solarPct: PALETA.claro.categoria.solar,
    biofuelPct: PALETA.claro.categoria.biomassa,
    otherRenewablesExcBiofuelPct: '#213602',
  },
  noturno: {
    fossilPct: PALETA.noturno.categoria.outros,
    nuclearPct: PALETA.noturno.categoria.nuclear,
    hydroPct: PALETA.noturno.categoria.hidro,
    windPct: PALETA.noturno.categoria.eolica,
    solarPct: PALETA.noturno.categoria.solar,
    biofuelPct: PALETA.noturno.categoria.biomassa,
    otherRenewablesExcBiofuelPct: '#527128',
  },
};

/** As sete cores de fonte do mundo, no modo pedido. */
export function corDaFonteDoMundo(modo: ModoV3): Record<keyof MatrizGeracao, string> {
  return FONTE_DO_MUNDO[modo];
}

export type MetricaDoMundo = 'renovavel' | 'intensidade';

/**
 * Rampas contínuas do mundo, [zero, máximo]. Uma matiz só, a leitura vem da
 * luminância: no claro, mais é mais escuro; no noturno, mais é mais claro. O
 * zero nunca é a cor do papel (contraste de cerca de 1,4:1 com o fundo do modo, para que
 * "0" não se confunda com "sem dado"); o máximo passa de 6:1. Renovável vai
 * para um azul-petróleo, intensidade para a tinta. Sem óxido, sem semáforo.
 */
const RAMPA_DO_MUNDO: Record<ModoV3, Record<MetricaDoMundo, [string, string]>> = {
  claro: {
    renovavel: ['#cfc6b3', '#1e5a6b'],
    intensidade: ['#cfc6b3', '#2d313a'],
  },
  noturno: {
    renovavel: ['#2a3448', '#7fd0c8'],
    intensidade: ['#2a3448', '#e6dfcf'],
  },
};

/** Extremos da rampa [zero, máximo] de uma métrica do mundo no modo pedido. */
export function rampaDoMundo(modo: ModoV3, metrica: MetricaDoMundo): [string, string] {
  return RAMPA_DO_MUNDO[modo][metrica];
}

/** Cor na rampa, para t entre 0 e 1 (fora disso, preso aos extremos). */
export function corNaRampaDoMundo(modo: ModoV3, metrica: MetricaDoMundo, t: number): string {
  const [de, ate] = RAMPA_DO_MUNDO[modo][metrica];
  const k = Math.max(0, Math.min(1, Number.isFinite(t) ? t : 0));
  const a = [1, 3, 5].map((i) => parseInt(de.slice(i, i + 2), 16));
  const b = [1, 3, 5].map((i) => parseInt(ate.slice(i, i + 2), 16));
  return `#${a.map((v, i) => Math.round(v + (b[i] - v) * k).toString(16).padStart(2, '0')).join('')}`;
}

// ── áreas de atuação das distribuidoras (ANEEL · BDGD · ARAT) ──────────
// Fundo, não primeiro plano: preenchimento quase transparente e fio de 1px. As
// concessionárias recebem um de cinco VALORES da tinta (a mesma tinta, cinco
// opacidades), escolhidos por coloração do mapa para que vizinhas não repitam o
// valor (mapa/distribuicao.ts): em transparência baixa, luminância separa melhor
// que matiz, e o mapa não vira arco-íris. As permissionárias (cooperativas), por
// cima, em ouro e com fio tracejado. Nenhum tom é o óxido; nenhum é vermelho ou verde.

export interface TonsDaDistribuicao {
  /** opacidade do preenchimento de tinta de cada um dos cinco valores das concessionárias */
  valores: readonly [number, number, number, number, number];
  /** opacidade do fio de tinta da divisa entre concessionárias */
  fio: number;
  permissao: string;
  permissaoPreenchimento: number;
  /** nome da permissionária no mapa (ouro escurecido no claro, para ler sobre o papel) */
  rotuloPermissao: string;
}

export const TONS_DA_DISTRIBUICAO: Record<ModoV3, TonsDaDistribuicao> = {
  claro: { valores: [0.015, 0.04, 0.065, 0.09, 0.115], fio: 0.42, permissao: '#a8854f', permissaoPreenchimento: 0.11, rotuloPermissao: '#7d6235' },
  // no noturno a permissionária sai do ouro (achado 10: o tracejado dourado se confundia com as
  // linhas de corrente contínua) para a tinta clara, um degrau abaixo do papel
  noturno: { valores: [0.02, 0.045, 0.07, 0.095, 0.12], fio: 0.36, permissao: '#cdc5b2', permissaoPreenchimento: 0.1, rotuloPermissao: '#cdc5b2' },
};
