// Atlas da Alexandria v3 — o capítulo "O combustível" no mapa.
//
// Gasodutos de transporte, terminais de GNL, UPGN, refinarias, terminais de
// líquidos, campos de produção, blocos exploratórios, bacias sedimentares e o
// polígono do pré-sal, todos da ANP (GeoServer, WFS). Este arquivo guarda as
// camadas do Mapbox e o preparo dos dados; quem decide quando cada uma aparece
// é controleDoMapa.ts, como nas outras camadas. A linguagem visual (cores,
// formas, larguras) está em estilo.ts, para o mapa e a legenda desenharem igual.

import type mapboxgl from 'mapbox-gl';
import type { Feature, FeatureCollection, Geometry, MultiPolygon, Point, Polygon, Position } from 'geojson';
import {
  carregarBaciasSedimentares,
  carregarBlocosExploratorios,
  carregarCamposProducao,
  carregarGasodutos,
  carregarInstalacoesCombustivel,
  carregarPreSal,
} from '@/lib/alexandria/atlas/dados';
import { FONTES_DO_MAPA, PREENCHIMENTO_DO_CAMPO, corDoCampo, larguraDoDuto, type PaletaDoMapa } from '@/lib/alexandria/atlas/estilo';
import type { CamadaDoCombustivel } from '@/lib/alexandria/atlas/tipos';

/** Fontes GeoJSON do capítulo. */
export const FC = {
  gasodutos: 'atlas-gasodutos',
  instalacoes: 'atlas-instalacoes',
  campos: 'atlas-campos',
  blocos: 'atlas-blocos',
  baciasSed: 'atlas-bacias-sed',
  presal: 'atlas-presal',
  rotulosArea: 'atlas-combustivel-rotulos-area',
} as const;

export type ArquivoDoCombustivel = 'gasodutos' | 'instalacoes' | 'campos' | 'blocos' | 'baciasSed' | 'presal';

const CARREGAR: Record<ArquivoDoCombustivel, () => Promise<FeatureCollection>> = {
  gasodutos: carregarGasodutos as () => Promise<FeatureCollection>,
  instalacoes: carregarInstalacoesCombustivel as () => Promise<FeatureCollection>,
  campos: carregarCamposProducao as () => Promise<FeatureCollection>,
  blocos: carregarBlocosExploratorios as () => Promise<FeatureCollection>,
  baciasSed: carregarBaciasSedimentares as () => Promise<FeatureCollection>,
  presal: carregarPreSal as () => Promise<FeatureCollection>,
};

/** Em que arquivo está um ativo, pelo prefixo do id (os ids são únicos entre os seis). */
export function arquivoDoId(id: string): ArquivoDoCombustivel | null {
  if (id.startsWith('gd-')) return 'gasodutos';
  if (/^(refinaria|gnl|upgn|terminal)-/.test(id)) return 'instalacoes';
  if (id.startsWith('campo-')) return 'campos';
  if (id.startsWith('bloco-')) return 'blocos';
  if (id.startsWith('bacia-sed-')) return 'baciasSed';
  if (id === 'presal') return 'presal';
  return null;
}

/** Arquivo que desenha cada camada da legenda. */
export const ARQUIVO_DA_CAMADA: Record<CamadaDoCombustivel, ArquivoDoCombustivel> = {
  gasodutos: 'gasodutos',
  gnl: 'instalacoes',
  upgn: 'instalacoes',
  refinarias: 'instalacoes',
  terminais: 'instalacoes',
  campos: 'campos',
  presal: 'presal',
  blocos: 'blocos',
  'bacias-sedimentares': 'baciasSed',
};

/** Tipo de instalação (propriedade `tipo` da feição) de cada camada de ponto. */
export const TIPO_DA_CAMADA: Partial<Record<CamadaDoCombustivel, string>> = { gnl: 'gnl', upgn: 'upgn', refinarias: 'refinaria', terminais: 'terminal' };

// ── preparo dos dados (só rótulo e peso: nenhum valor da fonte é alterado) ──

const PARTICULAS = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'em']);

/** Nome em caixa alta da fonte → caixa de título, só para o rótulo do mapa (a ficha mostra o original). */
export function caixaDeTitulo(s: string): string {
  return s
    .toLowerCase()
    .split(/(\s+|-|\/)/)
    .map((w, i) => (i > 0 && PARTICULAS.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join('');
}

/** Sigla com que o nome do terminal de GNL termina, como a fonte escreve ("… - CELSE", "… TRSP"). */
export function siglaDoGnl(nome: string): string | null {
  const m = /(?:-\s*|\s)([A-Z][A-Z0-9-]{1,9})$/.exec(nome.trim());
  return m ? m[1] : null;
}

/** Nome curto do duto: o que vem antes do parêntese ("GASBOL (Gasoduto Bolívia-Brasil)" → "GASBOL"). */
export const nomeCurtoDoDuto = (duto: string) => duto.split(' (')[0].trim();

/** Acrescenta `rotulo`, `legenda` e `ordem` às instalações (para o rótulo e a ordem de desenho). */
function prepararInstalacoes(fc: FeatureCollection): FeatureCollection {
  for (const f of fc.features) {
    const p = f.properties as Record<string, unknown>;
    const nome = typeof p.nome === 'string' ? p.nome : '';
    const tipo = p.tipo;
    let rotulo = nome;
    let legenda = '';
    let ordem = 0;
    if (tipo === 'refinaria') {
      rotulo = typeof p.sigla === 'string' && p.sigla ? p.sigla : caixaDeTitulo(nome);
      legenda = 'refinaria';
      ordem = 30 + Math.min(9, Number(p.bpd ?? 0) / 50_000);
    } else if (tipo === 'gnl') {
      rotulo = siglaDoGnl(nome) ?? nome;
      legenda = 'terminal de GNL';
      ordem = 50;
    } else if (tipo === 'upgn') {
      legenda = typeof p.sub === 'string' && !nome.includes(p.sub) ? p.sub : '';
      ordem = 20;
    } else {
      rotulo = caixaDeTitulo(nome);
      ordem = 10;
    }
    p.rotulo = rotulo;
    p.legenda = legenda;
    p.ordem = ordem;
  }
  return fc;
}

function prepararGasodutos(fc: FeatureCollection): FeatureCollection {
  for (const f of fc.features) {
    const p = f.properties as Record<string, unknown>;
    p.rotulo = typeof p.duto === 'string' ? nomeCurtoDoDuto(p.duto) : '';
  }
  return fc;
}

/** Busca e prepara um arquivo do capítulo. */
export function carregarDoCombustivel(k: ArquivoDoCombustivel): Promise<FeatureCollection> {
  return CARREGAR[k]().then((fc) => (k === 'instalacoes' ? prepararInstalacoes(fc) : k === 'gasodutos' ? prepararGasodutos(fc) : fc));
}

// ── ponto de rótulo das áreas (calculado da forma, uma vez) ──

function areaDoAnel(anel: Position[]): number {
  let s = 0;
  for (let i = 0; i < anel.length - 1; i++) s += anel[i][0] * anel[i + 1][1] - anel[i + 1][0] * anel[i][1];
  return Math.abs(s / 2);
}

function centroDoMaiorAnel(g: Geometry): { c: [number, number]; area: number } | null {
  const poligonos: Position[][][] = g.type === 'Polygon' ? [(g as Polygon).coordinates] : g.type === 'MultiPolygon' ? (g as MultiPolygon).coordinates : [];
  let maior: Position[] | null = null;
  let area = 0;
  for (const p of poligonos) {
    const a = areaDoAnel(p[0]);
    if (a > area) {
      area = a;
      maior = p[0];
    }
  }
  if (!maior) return null;
  let x = 0;
  let y = 0;
  let a2 = 0;
  for (let i = 0; i < maior.length - 1; i++) {
    const k = maior[i][0] * maior[i + 1][1] - maior[i + 1][0] * maior[i][1];
    x += (maior[i][0] + maior[i + 1][0]) * k;
    y += (maior[i][1] + maior[i + 1][1]) * k;
    a2 += k;
  }
  return { c: a2 === 0 ? [maior[0][0], maior[0][1]] : [x / (3 * a2), y / (3 * a2)], area };
}

/** Pontos de rótulo dos campos e das bacias sedimentares. */
export function rotulosDasAreas(campos: FeatureCollection | null, bacias: FeatureCollection | null): FeatureCollection {
  const saida: Feature<Point>[] = [];
  for (const f of campos?.features ?? []) {
    const p = f.properties as Record<string, unknown>;
    const c = centroDoMaiorAnel(f.geometry);
    if (!c || typeof p.nome !== 'string') continue;
    saida.push({ type: 'Feature', geometry: { type: 'Point', coordinates: c.c }, properties: { k: 'campo', rotulo: caixaDeTitulo(p.nome), peso: c.area } });
  }
  for (const f of bacias?.features ?? []) {
    const p = f.properties as Record<string, unknown>;
    const c = centroDoMaiorAnel(f.geometry);
    if (!c || typeof p.nome !== 'string') continue;
    // "Bacia de Pernambuco-Paraiba_Terra": a parte em terra e a no mar são feições separadas
    const rotulo = p.nome.replace(/_(Terra|Mar)$/i, (_, s: string) => ` · ${s.toLowerCase()}`);
    saida.push({ type: 'Feature', geometry: { type: 'Point', coordinates: c.c }, properties: { k: 'bacia', rotulo, peso: c.area } });
  }
  return { type: 'FeatureCollection', features: saida };
}

// ── as camadas ──

type Adicionar = (camada: mapboxgl.AnyLayer) => void;
const exp = (e: unknown) => e as mapboxgl.Expression;

/** Áreas: bacias sedimentares por baixo, blocos, campos e o limite do pré-sal por cima. */
export function montarAreas(add: Adicionar, p: PaletaDoMapa) {
  add({ id: 'bacias-sed-area', type: 'fill', source: FC.baciasSed, layout: { visibility: 'none' }, paint: { 'fill-color': p.sedimento, 'fill-opacity': 0.12 } });
  add({
    id: 'bacias-sed-fio',
    type: 'line',
    source: FC.baciasSed,
    layout: { visibility: 'none', 'line-join': 'round' },
    paint: { 'line-color': p.sedimento, 'line-width': ['interpolate', ['linear'], ['zoom'], 3, 0.5, 8, 1], 'line-opacity': 0.75 },
  });
  add({ id: 'blocos-area', type: 'fill', source: FC.blocos, layout: { visibility: 'none' }, paint: { 'fill-color': p.tintaSuave, 'fill-opacity': 0.05 } });
  add({
    id: 'blocos-fio',
    type: 'line',
    source: FC.blocos,
    layout: { visibility: 'none', 'line-join': 'miter' },
    paint: { 'line-color': p.tintaSuave, 'line-width': ['interpolate', ['linear'], ['zoom'], 3, 0.4, 9, 0.9], 'line-opacity': 0.6 },
  });
  add({
    id: 'campos-area',
    type: 'fill',
    source: FC.campos,
    layout: { visibility: 'none' },
    paint: { 'fill-color': exp(corDoCampo(p)), 'fill-opacity': PREENCHIMENTO_DO_CAMPO },
  });
  add({
    id: 'campos-fio',
    type: 'line',
    source: FC.campos,
    layout: { visibility: 'none', 'line-join': 'round' },
    paint: { 'line-color': exp(corDoCampo(p)), 'line-width': ['interpolate', ['linear'], ['zoom'], 3, 0.4, 8, 0.8, 12, 1.1], 'line-opacity': 0.9 },
  });
  // o pré-sal é um limite legal, não uma obra: tracejado de tinta, como a convenção de divisa
  add({ id: 'presal-area', type: 'fill', source: FC.presal, layout: { visibility: 'none' }, paint: { 'fill-color': p.tinta, 'fill-opacity': 0.025 } });
  add({
    id: 'presal-fio',
    type: 'line',
    source: FC.presal,
    layout: { visibility: 'none', 'line-join': 'round' },
    paint: { 'line-color': p.tinta, 'line-width': ['interpolate', ['linear'], ['zoom'], 3, 0.9, 8, 1.6], 'line-opacity': 0.72, 'line-dasharray': [4, 2] },
  });
}

/** Gasodutos (casco de papel e traço na cor do gás) e o alvo de toque. */
export function montarDutos(add: Adicionar, p: PaletaDoMapa) {
  add({
    id: 'gasodutos-casco',
    type: 'line',
    source: FC.gasodutos,
    layout: { visibility: 'none', 'line-cap': 'round', 'line-join': 'round', 'line-sort-key': ['coalesce', ['get', 'diam'], 0] },
    paint: { 'line-color': p.papel, 'line-width': exp(larguraDoDuto(true)), 'line-opacity': 0.92 },
  });
  add({
    id: 'gasodutos',
    type: 'line',
    source: FC.gasodutos,
    layout: { visibility: 'none', 'line-cap': 'round', 'line-join': 'round', 'line-sort-key': ['coalesce', ['get', 'diam'], 0] },
    paint: { 'line-color': p.categoria.gas, 'line-width': exp(larguraDoDuto()), 'line-opacity': 1 },
  });
  add({ id: 'gasodutos-toque', type: 'line', source: FC.gasodutos, layout: { visibility: 'none' }, paint: { 'line-color': p.tinta, 'line-opacity': 0, 'line-width': 12 } });
}

/** Tamanho do símbolo da instalação: refinaria cresce em degraus de capacidade; o terminal de
 *  líquidos é o menor. Todos crescem devagar com o zoom. */
const TAMANHO_DA_INSTALACAO: unknown[] = [
  'match',
  ['get', 'tipo'],
  'refinaria',
  ['step', ['coalesce', ['get', 'bpd'], 0], 0.68, 30_000, 0.76, 100_000, 0.86, 250_000, 0.96],
  'gnl',
  0.92,
  'upgn',
  0.7,
  0.56,
];

/** Instalações: o símbolo por tipo (sempre desenhado: são poucas e cada uma importa). Fica acima
 *  do selo das usinas (ver controleDoMapa.montar). */
export function montarInstalacoes(add: Adicionar) {
  add({
    id: 'combustivel-instalacoes',
    type: 'symbol',
    source: FC.instalacoes,
    layout: {
      visibility: 'none',
      'icon-image': ['concat', 'atlas-inst-', ['get', 'tipo']],
      'icon-size': exp(['interpolate', ['linear'], ['zoom'], 3, ['*', 0.62, TAMANHO_DA_INSTALACAO], 6, ['*', 0.8, TAMANHO_DA_INSTALACAO], 10, TAMANHO_DA_INSTALACAO]),
      'icon-allow-overlap': true,
      // entra no índice de colisão: o selo de usina e os rótulos que vêm depois o contornam
      'icon-ignore-placement': false,
      'symbol-sort-key': ['get', 'ordem'],
    },
    paint: { 'icon-opacity': 1 },
  });
}

/** Rótulos do capítulo: dutos ao longo do traço; instalações com a hierarquia das usinas;
 *  campos e bacias no centro da área; o pré-sal ao longo do limite. */
export function montarRotulos(add: Adicionar, p: PaletaDoMapa) {
  add({
    id: 'bacias-sed-rotulo',
    type: 'symbol',
    source: FC.rotulosArea,
    minzoom: 3.6,
    maxzoom: 9,
    filter: ['==', ['get', 'k'], 'bacia'],
    layout: {
      visibility: 'none',
      'text-field': ['get', 'rotulo'],
      'text-font': FONTES_DO_MAPA.SERIFA,
      'text-size': ['interpolate', ['linear'], ['zoom'], 3.6, 10.5, 7, 13],
      'text-max-width': 8,
      'text-letter-spacing': 0.04,
      'text-padding': 6,
      'symbol-sort-key': ['-', 0, ['get', 'peso']],
    },
    paint: { 'text-color': p.sedimento, 'text-halo-color': p.papel, 'text-halo-width': 1.2 },
  });
  add({
    id: 'presal-rotulo',
    type: 'symbol',
    source: FC.presal,
    minzoom: 4,
    layout: {
      visibility: 'none',
      'symbol-placement': 'line',
      'symbol-spacing': 420,
      'text-field': 'Polígono do pré-sal',
      'text-font': FONTES_DO_MAPA.SERIFA,
      'text-size': ['interpolate', ['linear'], ['zoom'], 4, 10.5, 8, 12.5],
      'text-letter-spacing': 0.06,
      'text-offset': [0, -0.7],
      'text-max-angle': 30,
    },
    paint: { 'text-color': p.tintaSuave, 'text-halo-color': p.papel, 'text-halo-width': 1.3 },
  });
  add({
    id: 'campos-rotulo',
    type: 'symbol',
    source: FC.rotulosArea,
    minzoom: 6.4,
    filter: ['==', ['get', 'k'], 'campo'],
    layout: {
      visibility: 'none',
      'text-field': ['get', 'rotulo'],
      'text-font': FONTES_DO_MAPA.OBRA_LEVE,
      'text-size': ['interpolate', ['linear'], ['zoom'], 6.4, 10, 11, 12],
      'text-max-width': 7,
      'text-padding': 3,
      'symbol-sort-key': ['-', 0, ['get', 'peso']],
    },
    paint: { 'text-color': p.tintaSuave, 'text-halo-color': p.papel, 'text-halo-width': 1.2 },
  });
  add({
    id: 'gasodutos-rotulo',
    type: 'symbol',
    source: FC.gasodutos,
    minzoom: 5.4,
    layout: {
      visibility: 'none',
      'symbol-placement': 'line',
      'symbol-spacing': 520,
      'text-field': ['get', 'rotulo'],
      'text-font': FONTES_DO_MAPA.OBRA,
      'text-size': ['interpolate', ['linear'], ['zoom'], 5.4, 10, 10, 12],
      'text-letter-spacing': 0.04,
      'text-max-angle': 28,
      'text-offset': [0, -0.75],
      'text-padding': 4,
      'symbol-sort-key': ['-', 0, ['coalesce', ['get', 'diam'], 0]],
    },
    paint: { 'text-color': p.tintaSuave, 'text-halo-color': p.papel, 'text-halo-width': 1.3 },
  });
  add({
    id: 'combustivel-rotulo',
    type: 'symbol',
    source: FC.instalacoes,
    minzoom: 3,
    layout: {
      visibility: 'none',
      'text-field': exp([
        'format',
        ['get', 'rotulo'],
        {},
        ['case', ['==', ['get', 'legenda'], ''], '', '\n'],
        {},
        ['get', 'legenda'],
        { 'font-scale': 0.78, 'text-font': ['literal', FONTES_DO_MAPA.OBRA_LEVE], 'text-color': p.tintaFraca },
      ]),
      'text-font': FONTES_DO_MAPA.OBRA,
      'text-size': exp(['match', ['get', 'tipo'], 'refinaria', 12.5, 'gnl', 12.5, 'upgn', 11, 10.5]),
      'text-variable-anchor': ['right', 'left', 'bottom', 'top'],
      // o símbolo entra na colisão: o rótulo começa fora da caixa dele (meio símbolo + halo + text-padding),
      // e o símbolo cresce com o zoom. Medido: com 1,05 em fixo, o rótulo sumia no zoom 10.
      'text-radial-offset': exp([
        'interpolate',
        ['linear'],
        ['zoom'],
        3,
        ['match', ['get', 'tipo'], 'terminal', 0.6, 'upgn', 0.7, 0.85],
        10,
        ['match', ['get', 'tipo'], 'terminal', 1.05, 'upgn', 1.25, 1.45],
      ]),
      'text-justify': 'auto',
      'text-max-width': 9,
      'text-padding': 2,
      'symbol-sort-key': ['-', 0, ['get', 'ordem']],
    },
    paint: { 'text-color': p.tinta, 'text-halo-color': p.papel, 'text-halo-width': 1.4 },
  });
}

/** Rótulos do capítulo com o halo deles fora do satélite (para o satélite alargar). */
export const HALO_DO_COMBUSTIVEL: [string, number][] = [
  ['combustivel-rotulo', 1.4],
  ['gasodutos-rotulo', 1.3],
  ['campos-rotulo', 1.2],
  ['bacias-sed-rotulo', 1.2],
  ['presal-rotulo', 1.3],
];

/** Filtro de zoom dos rótulos das instalações: terminal de GNL e refinaria grande já no país,
 *  as outras refinarias na região, UPGN no estado, terminal de líquidos de perto. O Mapbox
 *  avalia ['zoom'] de filtro no zoom inteiro do tile: os degraus são inteiros. */
export const FILTRO_ZOOM_DO_ROTULO: unknown[] = [
  '>=',
  ['zoom'],
  ['match', ['get', 'tipo'], 'gnl', 3, 'refinaria', ['case', ['>=', ['coalesce', ['get', 'bpd'], 0], 150_000], 3, 5], 'upgn', 6, 8],
];
