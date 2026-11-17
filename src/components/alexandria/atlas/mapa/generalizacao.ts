// Atlas da Alexandria v3 — generalização dos símbolos de usina abaixo do zoom 10.
//
// O cadastro (ANEEL SIGA) registra cada parque eólico e cada usina solar em separado:
// nenhum registro eólico ou solar passa de 300 MW, e o piso por registro apagava as duas
// fontes no zoom do Brasil. Aqui, em cada faixa de zoom inteiro (3 a 9), as usinas em
// operação da MESMA fonte a menos de R px da maior (semente, sem encadear) viram um símbolo
// só, NO PONTO da maior: ninguém sai do lugar. O sobrevivente leva a soma dos kW (`s3..s9`)
// e o número de membros (`n3..n9`); as outras ganham o bit da faixa em `gen` e somem dela.
// A soma, o raio e a escolha da sede são conta do MAPA, não da fonte: a interface declara
// isso pelo anel do símbolo, pela legenda e pela etiqueta/ficha do agregado.

import type { Feature, Point } from 'geojson';
import type { Categoria, PropsUsina } from '@/lib/alexandria/atlas/tipos';
import { KW_DO_OLEO_PEQUENO, encurtarNome, metrosPorPixel } from './maquetes';

/** Faixas de zoom inteiro (zoom do tile) em que há agregação. Do zoom 10 em diante, nenhuma. */
export const FAIXAS = [3, 4, 5, 6, 7, 8, 9] as const;
export type Faixa = (typeof FAIXAS)[number];
export const ZOOM_SEM_AGREGACAO = 10;

/** A regra de cada faixa (relatório do batedor "simbolos", decisão 2 da onda 2):
 *  raio de agrupamento (px), piso da SOMA para o símbolo aparecer (kW), piso da soma para
 *  o selo (kW), raio mínimo do símbolo (px), px por √MW e raio máximo (px). */
export interface RegraDaFaixa {
  raioPx: number;
  pisoKw: number;
  seloKw: number;
  rMin: number;
  k: number;
  rMax: number;
}
export const REGRA_DA_FAIXA: Record<Faixa, RegraDaFaixa> = {
  3: { raioPx: 48, pisoKw: 300_000, seloKw: 1_500_000, rMin: 4, k: 0.12, rMax: 16 },
  4: { raioPx: 48, pisoKw: 300_000, seloKw: 1_000_000, rMin: 4, k: 0.13, rMax: 17 },
  5: { raioPx: 44, pisoKw: 200_000, seloKw: 600_000, rMin: 4, k: 0.16, rMax: 18 },
  6: { raioPx: 36, pisoKw: 30_000, seloKw: 200_000, rMin: 3.5, k: 0.2, rMax: 18 },
  7: { raioPx: 32, pisoKw: 5000, seloKw: 60_000, rMin: 3.5, k: 0.26, rMax: 18 },
  8: { raioPx: 28, pisoKw: 1000, seloKw: 20_000, rMin: 3.5, k: 0.32, rMax: 18 },
  9: { raioPx: 64, pisoKw: 0, seloKw: 5000, rMin: 3.5, k: 0.36, rMax: 18 },
};

/** Nas faixas 3 a 6 só entram na soma os registros de 5 MW ou mais (o conteúdo de
 *  usinas-principais.json): a soma não muda quando o arquivo das menores chega. */
export const KW_MINIMO_NA_SOMA_DE_LONGE = 5000;
/** Usina de 3 GW ou mais nunca entra na soma de outra (decisões leva 4, 2.3; critico-desktop
 *  8: Tucuruí, 8,5 GW, sumia dentro do símbolo de Belo Monte no zoom do Brasil). */
export const KW_NUNCA_NA_SOMA_DE_OUTRA = 3_000_000;
/** Da faixa 7 em diante a soma conta todos os registros (as menores também). */
export const FAIXA_DA_SOMA_COMPLETA = 7;

/** Faixa de agregação de um zoom de câmera (o Mapbox avalia o filtro no zoom inteiro do tile). */
export function faixaDoZoom(zoom: number): Faixa | null {
  const z = Math.floor(zoom);
  if (z >= ZOOM_SEM_AGREGACAO) return null;
  return Math.max(3, z) as Faixa;
}

/** Raio de agrupamento da faixa em km, numa latitude (o Brasil médio: 15° S). */
export function raioDaFaixaKm(faixa: Faixa, lat = -15): number {
  return (REGRA_DA_FAIXA[faixa].raioPx * metrosPorPixel(faixa, lat)) / 1000;
}

const RAD = Math.PI / 180;
const distM = (a: number[], b: number[]) => Math.hypot((b[0] - a[0]) * 111_320 * Math.cos(a[1] * RAD), (b[1] - a[1]) * 110_574);
const idDe = (u: Feature<Point, PropsUsina>) => (typeof u.id === 'number' ? u.id : Number(u.id));
const suspeita = (p: PropsUsina) => {
  const s = (p as unknown as { susp?: unknown }).susp;
  return s === true || s === 'true' || s === 1;
};

/** Um agregado: a sede (a maior) e os membros, da maior para a menor (a sede primeiro). */
export interface Agregado {
  faixa: Faixa;
  cat: Categoria;
  somaKw: number;
  n: number;
  sede: Feature<Point, PropsUsina>;
  membros: Feature<Point, PropsUsina>[];
}

/** O resultado da marcação: quem é membro de quem em cada faixa. */
export interface Generalizacao {
  /** o agregado cuja sede é a usina `id` na faixa (null: a usina não soma ninguém ali) */
  agregadoDe(id: number, faixa: Faixa): Agregado | null;
}

/** Marca `gen` (bit faixa−3 = escondida na faixa), `s3..s9` e `n3..n9` (só nas sedes com mais
 *  de um membro) e `nm` (nome encurtado para o mapa) em cada usina. Fica fora da agregação,
 *  sozinha e com a própria potência: usina que não está em operação, posição a confirmar no
 *  cadastro (o ponto dela não pode virar sede de soma) e grupo gerador a óleo pequeno (o mapa
 *  o esconde até o zoom 13). Refazer (chegada das menores) apaga a marcação anterior. */
export function marcarGeneralizacao(usinas: Feature<Point, PropsUsina>[], soFaixas: readonly Faixa[] = FAIXAS): Generalizacao {
  const emOp = usinas.filter((u) => {
    const p = u.properties;
    if (!p || p.fase !== 0 || suspeita(p)) return false;
    if (p.cat === 'oleo' && p.kw < KW_DO_OLEO_PEQUENO) return false;
    const c = u.geometry?.coordinates;
    return Array.isArray(c) && Number.isFinite(c[0]) && Number.isFinite(c[1]);
  });
  emOp.sort((a, b) => b.properties.kw - a.properties.kw || idDe(a) - idDe(b));
  const gen = new Map<Feature<Point, PropsUsina>, number>();
  const porFaixa = new Map<Faixa, Map<number, Agregado>>();
  // soFaixas: o arrasto da régua do ano (controleDoMapa › remarcar) só refaz a faixa da câmera;
  // as outras ficam sem soma até a conta inteira, ao soltar
  for (const z of soFaixas) {
    const { raioPx } = REGRA_DA_FAIXA[z];
    const lista = z < FAIXA_DA_SOMA_COMPLETA ? emOp.filter((u) => u.properties.kw >= KW_MINIMO_NA_SOMA_DE_LONGE) : emOp;
    const cLat = (raioPx * metrosPorPixel(z, 0)) / 110_574;
    const cLon = cLat / Math.cos(35 * RAD);
    const grade = new Map<string, number[]>();
    lista.forEach((u, i) => {
      const [lon, lat] = u.geometry.coordinates;
      const ch = `${Math.floor(lon / cLon)}:${Math.floor(lat / cLat)}`;
      const g = grade.get(ch);
      if (g) g.push(i);
      else grade.set(ch, [i]);
    });
    const agregados = new Map<number, Agregado>();
    const usada = new Uint8Array(lista.length);
    for (let i = 0; i < lista.length; i++) {
      if (usada[i]) continue;
      usada[i] = 1;
      const s = lista[i];
      const pos = s.geometry.coordinates;
      const r = raioPx * metrosPorPixel(z, pos[1]);
      const gx = Math.floor(pos[0] / cLon);
      const gy = Math.floor(pos[1] / cLat);
      let membros: Feature<Point, PropsUsina>[] | null = null;
      for (let dx = -1; dx <= 1; dx++)
        for (let dy = -1; dy <= 1; dy++)
          for (const j of grade.get(`${gx + dx}:${gy + dy}`) ?? []) {
            if (usada[j] || lista[j].properties.cat !== s.properties.cat) continue;
            // a usina grande nunca entra na soma de outra: é sede de si mesma em todo zoom
            if (lista[j].properties.kw >= KW_NUNCA_NA_SOMA_DE_OUTRA) continue;
            if (distM(pos, lista[j].geometry.coordinates) >= r) continue;
            usada[j] = 1;
            gen.set(lista[j], (gen.get(lista[j]) ?? 0) | (1 << (z - 3)));
            (membros ??= [s]).push(lista[j]);
          }
      if (membros) {
        membros.sort((a, b) => b.properties.kw - a.properties.kw || idDe(a) - idDe(b));
        agregados.set(idDe(s), { faixa: z, cat: s.properties.cat, somaKw: membros.reduce((t, u) => t + u.properties.kw, 0), n: membros.length, sede: s, membros });
      }
    }
    porFaixa.set(z, agregados);
  }
  for (const u of usinas) {
    const pr = u.properties as unknown as Record<string, unknown> | null;
    if (!pr) continue;
    for (const z of FAIXAS) {
      delete pr[`s${z}`];
      delete pr[`n${z}`];
    }
    pr.gen = gen.get(u) ?? 0;
    pr.nm = encurtarNome(u.properties.nome ?? '');
    // prioridade de selo e de desenho: a maior soma que a usina representa em alguma faixa
    pr.ord = u.properties.kw;
  }
  for (const [z, agregados] of porFaixa)
    for (const a of agregados.values()) {
      const pr = a.sede.properties as unknown as Record<string, unknown>;
      pr[`s${z}`] = a.somaKw;
      pr[`n${z}`] = a.n;
      if (a.somaKw > (pr.ord as number)) pr.ord = a.somaKw;
    }
  return {
    agregadoDe: (id, faixa) => porFaixa.get(faixa)?.get(id) ?? null,
  };
}
