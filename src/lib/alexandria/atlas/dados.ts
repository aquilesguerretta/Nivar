// Atlas da Alexandria v3 — carga dos dados gerados por
// tools/alexandria-atlas/construir.mjs. Cada arquivo é buscado uma vez por
// sessão; o que pesa (usinas menores, séries) só vem quando alguém pede.

import type { Feature, FeatureCollection, LineString, MultiLineString, MultiPolygon, Point, Polygon } from 'geojson';
import type {
  IndiceDoAtlas,
  PropsUsina,
  SerieBalancoMensal,
  SerieEar,
  SerieEarReservatorios,
  SerieIntercambio,
  SeriePerfilHorario,
  UsinasColunar,
} from './tipos';
import type {
  IndiceCombustivel,
  IndiceDoAtlasComCombustivel,
  PropsBaciaSedimentar,
  PropsBlocoExploratorio,
  PropsCampoProducao,
  PropsGasoduto,
  PropsInstalacaoCombustivel,
  PropsPreSal,
} from './tipos';
import type { IndiceDistribuicao, IndiceDoAtlasComDistribuicao, PropsAreaDistribuidora } from './tipos';

const BASE = '/alexandria/atlas/dados';

const cache = new Map<string, Promise<unknown>>();

function buscar<T>(arquivo: string): Promise<T> {
  let p = cache.get(arquivo) as Promise<T> | undefined;
  if (!p) {
    p = fetch(`${BASE}/${arquivo}`).then((r) => {
      if (!r.ok) throw new Error(`${arquivo} respondeu ${r.status}`);
      return r.json() as Promise<T>;
    });
    // falha não fica em cache: a próxima tentativa busca de novo
    p.catch(() => cache.delete(arquivo));
    cache.set(arquivo, p);
  }
  return p;
}

export const carregarIndice = () => buscar<IndiceDoAtlas>('indice.json');
export const carregarLinhas = () => buscar<FeatureCollection>('rede-linhas.geojson');
export const carregarSubestacoes = () => buscar<FeatureCollection>('rede-subestacoes.geojson');
export const carregarReservatorios = () => buscar<FeatureCollection>('agua-reservatorios.geojson');
export const carregarBacias = () => buscar<FeatureCollection>('agua-bacias.geojson');
export const carregarSerieEar = () => buscar<SerieEar>('serie-ear-subsistema.json');
export const carregarSerieEarReservatorios = () => buscar<SerieEarReservatorios>('serie-ear-reservatorios.json');
export const carregarSerieIntercambio = () => buscar<SerieIntercambio>('serie-intercambio.json');
export const carregarSerieBalanco = () => buscar<SerieBalancoMensal>('serie-balanco-mensal.json');
export const carregarSeriePerfil = () => buscar<SeriePerfilHorario>('serie-perfil-horario.json');

/** Submercados: o arquivo PRÓPRIO do Atlas (construir.mjs), feito dos dois arquivos do IBGE que
 *  o Portal BR usa (que não mudam), com Roraima no Norte: o estado entrou no Norte em setembro
 *  de 2025, pela linha de 500 kV Manaus – Boa Vista. */
export const URL_DOS_SUBMERCADOS = '/alexandria/atlas/dados/submercados.geojson';
export const carregarSubmercados = (): Promise<FeatureCollection> => {
  const chave = '__submercados';
  let p = cache.get(chave) as Promise<FeatureCollection> | undefined;
  if (!p) {
    p = fetch(URL_DOS_SUBMERCADOS).then((r) => {
      if (!r.ok) throw new Error(`submercados.geojson respondeu ${r.status}`);
      return r.json() as Promise<FeatureCollection>;
    });
    p.catch(() => cache.delete(chave));
    cache.set(chave, p);
  }
  return p;
};

export type FeicaoUsina = Feature<Point, PropsUsina>;

/** Expande o arquivo colunar em feições. `deslocamento` mantém ids únicos
 *  entre o arquivo das principais e o das menores. */
function expandir(c: UsinasColunar, deslocamento: number): FeicaoUsina[] {
  const saida: FeicaoUsina[] = new Array(c.n);
  for (let i = 0; i < c.n; i++) {
    saida[i] = {
      type: 'Feature',
      id: deslocamento + i + 1,
      geometry: { type: 'Point', coordinates: [c.lon[i], c.lat[i]] },
      properties: {
        ceg: c.ceg[i],
        nome: c.nome[i] ?? c.ceg[i],
        uf: c.uf[i],
        mun: c.mun[i],
        tipo: c.tipos[c.tipo[i]] ?? '',
        cat: c.categorias[c.cat[i]],
        comb: c.combustiveis[c.comb[i]] ?? '',
        kw: c.kw[i],
        fase: c.fase[i],
        ano: c.ano[i],
        dono: c.dono[i] >= 0 ? (c.donos[c.dono[i]] ?? null) : null,
        susp: c.susp[i] === 1,
        modalidade: c.mod[i] >= 0 ? c.modalidades[c.mod[i]] : null,
        sub: c.sub[i] >= 0 ? c.subsistemas[c.sub[i]] : null,
        mwOns: c.mwOns[i],
        ug: c.ug[i],
        // precisão da coordenada na fonte (casas decimais, 0 a 4) e rumo da barragem pelo
        // reservatório da ANA: ausentes quando o arquivo não traz (null vira ausente)
        ...(c.prec?.[i] != null ? { prec: c.prec[i] as number } : {}),
        ...(c.rumoB?.[i] != null ? { rumoB: c.rumoB[i] as number } : {}),
        // etapas por unidade do ONS (potência no ano: tempo.ts › kwNoAno)
        ...(c.etapas?.[i] ? { etapas: c.etapas[i] as number[] } : {}),
      },
    };
  }
  return saida;
}

let principais: Promise<FeicaoUsina[]> | null = null;
let menores: Promise<FeicaoUsina[]> | null = null;

/** Usinas a partir de 5 MW: o que o mapa mostra de saída. */
export function carregarUsinasPrincipais(): Promise<FeicaoUsina[]> {
  principais ??= buscar<UsinasColunar>('usinas-principais.json').then((c) => expandir(c, 0));
  principais.catch(() => (principais = null));
  return principais;
}

/** Usinas abaixo de 5 MW (a maioria, em número): só quando o zoom pede. */
export function carregarUsinasMenores(): Promise<FeicaoUsina[]> {
  menores ??= buscar<UsinasColunar>('usinas-menores.json').then((c) => expandir(c, 100_000));
  menores.catch(() => (menores = null));
  return menores;
}

// ── formatação (pt-BR) ───────────────────────────────────────────────

const nf0 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1, minimumFractionDigits: 1 });

/** Potência em kW escrita na unidade que a deixa legível. */
export function potencia(kw: number | null | undefined): string {
  if (kw == null) return 'sem dado na fonte';
  if (kw >= 1_000_000) return `${nf1.format(kw / 1_000_000)} GW`;
  if (kw >= 10_000) return `${nf0.format(kw / 1000)} MW`;
  if (kw >= 1000) return `${nf1.format(kw / 1000)} MW`;
  return `${nf0.format(kw)} kW`;
}

export const inteiro = (n: number | null | undefined): string => (n == null ? 'sem dado na fonte' : nf0.format(n));
export const decimal = (n: number | null | undefined): string => (n == null ? 'sem dado na fonte' : nf1.format(n));

/** 'AAAA-MM-DD' → 'DD/MM/AAAA'. */
export const dataBr = (iso: string): string => {
  const [a, m, d] = iso.split('-');
  return d ? `${d}/${m}/${a}` : `${m}/${a}`;
};

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
/** 'AAAA-MM' → 'mar 2021'. */
export const mesBr = (aaaaMm: string): string => {
  const [a, m] = aaaaMm.split('-');
  return `${MESES[Number(m) - 1]} ${a}`;
};

// ── gás e petróleo (ANP) ─────────────────────────────────────────────
// Cada arquivo só é buscado quando a camada é ligada; o cache é o mesmo dos demais.

export const carregarGasodutos = () =>
  buscar<FeatureCollection<LineString | MultiLineString, PropsGasoduto>>('combustivel-gasodutos.geojson');
/** Refinarias, terminais de GNL, UPGN e terminais de líquidos, discriminados por `tipo`. */
export const carregarInstalacoesCombustivel = () =>
  buscar<FeatureCollection<Point, PropsInstalacaoCombustivel>>('combustivel-instalacoes.geojson');
export const carregarCamposProducao = () =>
  buscar<FeatureCollection<Polygon | MultiPolygon, PropsCampoProducao>>('combustivel-campos.geojson');
export const carregarBlocosExploratorios = () =>
  buscar<FeatureCollection<Polygon | MultiPolygon, PropsBlocoExploratorio>>('combustivel-blocos.geojson');
export const carregarBaciasSedimentares = () =>
  buscar<FeatureCollection<Polygon | MultiPolygon, PropsBaciaSedimentar>>('combustivel-bacias.geojson');
export const carregarPreSal = () => buscar<FeatureCollection<Polygon | MultiPolygon, PropsPreSal>>('combustivel-presal.geojson');
/** Bloco `combustivel` do índice; null quando o índice foi gerado sem ele. */
export const carregarIndiceCombustivel = (): Promise<IndiceCombustivel | null> =>
  carregarIndice().then((i) => (i as IndiceDoAtlasComCombustivel).combustivel ?? null);

// ── distribuição: áreas de atuação (ANEEL · BDGD) ────────────────────
// Só buscado quando a camada é ligada; o cache é o mesmo dos demais.

export const carregarAreasDistribuicao = () =>
  buscar<FeatureCollection<Polygon | MultiPolygon, PropsAreaDistribuidora>>('distribuicao-areas.geojson');
/** Bloco `distribuicao` do índice; null quando o índice foi gerado sem ele ou o arquivo não foi publicado. */
export const carregarIndiceDistribuicao = (): Promise<IndiceDistribuicao | null> =>
  carregarIndice().then((i) => {
    const d = (i as IndiceDoAtlasComDistribuicao).distribuicao;
    return d && !d.ausente ? d : null;
  });
