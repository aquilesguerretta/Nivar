// Atlas da Alexandria v3 — "Nesta tela": o que o enquadramento corrente contém.
//
// A conta sai dos ARQUIVOS (usinas e linhas carregados), filtrados pela caixa da
// tela que o controle do mapa informa quando a câmera assenta. Não sai de
// queryRenderedFeatures: a colisão e o piso por zoom tirariam usinas da conta.
// Por isso o bloco diz "no cadastro": conta também o que o mapa, neste zoom, não
// desenha (as menores, as somadas na vizinha maior).
//
// Linhas: o cadastro declara o comprimento inteiro de cada linha; o que se soma é
// esse comprimento, das linhas cujo traçado cruza a tela, e o texto diz isso.

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import type { FeatureCollection } from 'geojson';
import type { ModoV3 } from '@/components/alexandria/v3/usoV3';
import { carregarLinhas, carregarUsinasMenores, carregarUsinasPrincipais, inteiro, potencia, type FeicaoUsina } from '@/lib/alexandria/atlas/dados';
import { PALETA, urlDoSelo } from '@/lib/alexandria/atlas/estilo';
import { CATEGORIAS, ROTULO_CATEGORIA, type AtivoSelecionado, type Categoria, type IndiceDoAtlas } from '@/lib/alexandria/atlas/tipos';
import { kwNoAno } from '@/lib/alexandria/atlas/tempo';
import './atlas-rede.css';

/** Zoom de câmera a partir do qual a conta é do enquadramento (abaixo, Brasil inteiro). */
export const ZOOM_DA_CONTA = 4;

export type Limites = [number, number, number, number];

/** Usinas em operação em colunas (a conta percorre ~22 mil pontos a cada assentar). */
export interface Colunas {
  n: number;
  lon: Float64Array;
  lat: Float64Array;
  kw: Float64Array;
  cat: Uint8Array;
  /** ano de entrada do cadastro; NaN = sem ano (o SIGA não data, ou grava 1900) */
  ano: Float64Array;
  /** etapas por unidade (ONS), quando o arquivo traz: [ano, kW acumulado, …]; null = sem */
  etapas: (readonly number[] | null)[];
  feicao: FeicaoUsina[];
}

export interface LinhasIndexadas {
  n: number;
  /** caixa de cada linha: oeste, sul, leste, norte */
  caixa: Float64Array;
  km: Float64Array;
  /** ano de entrada (op) e ano da data de carga da base (opAntesDe); NaN = ausente */
  op: Float64Array;
  opAntesDe: Float64Array;
  /** traçados como listas de [lon, lat] (cada parte de MultiLineString à parte) */
  partes: number[][][][];
}

const IDX_CAT = new Map<string, number>(CATEGORIAS.map((c, i) => [c, i]));

export function colunas(usinas: FeicaoUsina[]): Colunas {
  const em = usinas.filter((u) => Number(u.properties.fase) === 0 && IDX_CAT.has(u.properties.cat as string));
  const n = em.length;
  const c: Colunas = { n, lon: new Float64Array(n), lat: new Float64Array(n), kw: new Float64Array(n), cat: new Uint8Array(n), ano: new Float64Array(n), etapas: new Array(n).fill(null), feicao: em };
  for (let i = 0; i < n; i++) {
    const u = em[i];
    c.lon[i] = u.geometry.coordinates[0];
    c.lat[i] = u.geometry.coordinates[1];
    c.kw[i] = Number(u.properties.kw) || 0;
    c.cat[i] = IDX_CAT.get(u.properties.cat as string) as number;
    const a = (u.properties as { ano?: number | null }).ano;
    c.ano[i] = a == null ? NaN : Number(a);
    const et = (u.properties as { etapas?: readonly number[] | null }).etapas;
    c.etapas[i] = et && et.length >= 2 ? et : null;
  }
  return c;
}

/** Só as linhas em operação: as mesmas que a chave "Linhas em operação" conta. */
export function indexarLinhas(fc: FeatureCollection): LinhasIndexadas {
  const ok = fc.features.filter((f) => {
    const p = f.properties as { op?: number | null; opAntesDe?: number | null } | null;
    return p && (p.op != null || p.opAntesDe != null) && (f.geometry?.type === 'LineString' || f.geometry?.type === 'MultiLineString');
  });
  const n = ok.length;
  const caixa = new Float64Array(n * 4);
  const km = new Float64Array(n);
  const op = new Float64Array(n);
  const opAntesDe = new Float64Array(n);
  const partes: number[][][][] = new Array(n);
  for (let i = 0; i < n; i++) {
    const g = ok[i].geometry as { type: string; coordinates: number[][] | number[][][] };
    const ps = (g.type === 'LineString' ? [g.coordinates] : g.coordinates) as number[][][];
    partes[i] = ps;
    let o = Infinity, s = Infinity, l = -Infinity, nn = -Infinity;
    for (const p of ps)
      for (const [x, y] of p) {
        if (x < o) o = x;
        if (x > l) l = x;
        if (y < s) s = y;
        if (y > nn) nn = y;
      }
    caixa.set([o, s, l, nn], i * 4);
    const pr = ok[i].properties as { km?: number; op?: number | null; opAntesDe?: number | null };
    km[i] = Number(pr.km) || 0;
    op[i] = pr.op == null ? NaN : Number(pr.op);
    opAntesDe[i] = pr.opAntesDe == null ? NaN : Number(pr.opAntesDe);
  }
  return { n, caixa, km, op, opAntesDe, partes };
}

/** Segmento contra retângulo (Liang–Barsky): o segmento entra na caixa? */
function segmentoCruza(x0: number, y0: number, x1: number, y1: number, o: number, s: number, l: number, n: number): boolean {
  let t0 = 0;
  let t1 = 1;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const p = [-dx, dx, -dy, dy];
  const q = [x0 - o, l - x0, y0 - s, n - y0];
  for (let k = 0; k < 4; k++) {
    if (p[k] === 0) {
      if (q[k] < 0) return false;
    } else {
      const r = q[k] / p[k];
      if (p[k] < 0) {
        if (r > t1) return false;
        if (r > t0) t0 = r;
      } else {
        if (r < t0) return false;
        if (r < t1) t1 = r;
      }
    }
  }
  return true;
}

/** A área livre da tela como polígono (anel em [lon, lat]), quando o controle a informa:
 *  com a câmera inclinada, a caixa abraça o trapézio inteiro e conta o que está fora da tela. */
export type AreaLivre = readonly (readonly [number, number])[];

/** Anel preparado para o teste: x desdobrado no mesmo lado do antimeridiano que a caixa. */
interface Anel {
  x: Float64Array;
  y: Float64Array;
}

function prepararAnel(p: AreaLivre | null | undefined): { anel: Anel; caixa: Limites } | null {
  if (!p || p.length < 3) return null;
  const n = p.length;
  const x = new Float64Array(n);
  const y = new Float64Array(n);
  let o = Infinity, s = Infinity, l = -Infinity, nn = -Infinity;
  for (let i = 0; i < n; i++) {
    let xi = p[i][0];
    // o anel não dá saltos de 180°: desdobra pelo vizinho (antimeridiano)
    if (i > 0) while (xi - x[i - 1] > 180) xi -= 360;
    if (i > 0) while (xi - x[i - 1] < -180) xi += 360;
    x[i] = xi;
    y[i] = p[i][1];
    if (!Number.isFinite(xi) || !Number.isFinite(y[i])) return null;
    if (xi < o) o = xi;
    if (xi > l) l = xi;
    if (y[i] < s) s = y[i];
    if (y[i] > nn) nn = y[i];
  }
  return { anel: { x, y }, caixa: [o, s, l, nn] };
}

/** Ponto no polígono (par-ímpar). */
function dentroDoAnel(px: number, py: number, a: Anel): boolean {
  let dentro = false;
  const n = a.x.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const yi = a.y[i];
    const yj = a.y[j];
    if (yi > py !== yj > py && px < ((a.x[j] - a.x[i]) * (py - yi)) / (yj - yi) + a.x[i]) dentro = !dentro;
  }
  return dentro;
}

/** Dois segmentos se cruzam (sentido estrito, como a conta independente). */
function segmentosCruzam(ax: number, ay: number, bx: number, by: number, cx: number, cy: number, dx: number, dy: number): boolean {
  const cr = (px: number, py: number, qx: number, qy: number, rx: number, ry: number) => (qx - px) * (ry - py) - (qy - py) * (rx - px);
  const d1 = cr(cx, cy, dx, dy, ax, ay);
  const d2 = cr(cx, cy, dx, dy, bx, by);
  const d3 = cr(ax, ay, bx, by, cx, cy);
  const d4 = cr(ax, ay, bx, by, dx, dy);
  return d1 > 0 !== d2 > 0 && d3 > 0 !== d4 > 0;
}

/** O segmento entra no polígono: um extremo dentro, ou cruza uma aresta. */
function segmentoNoAnel(x0: number, y0: number, x1: number, y1: number, a: Anel): boolean {
  if (dentroDoAnel(x0, y0, a) || dentroDoAnel(x1, y1, a)) return true;
  const n = a.x.length;
  for (let i = 0, j = n - 1; i < n; j = i++) if (segmentosCruzam(x0, y0, x1, y1, a.x[j], a.y[j], a.x[i], a.y[i])) return true;
  return false;
}

export interface ContaDaTela {
  usinas: number;
  kw: number;
  porCat: number[];
  /** usinas por fonte (a legenda da lente Fontes diz quantas) */
  nPorCat: number[];
  /** o arquivo das linhas já estava na conta (sem ele, `linhas` = 0 não quer dizer nenhuma) */
  linhasProntas: boolean;
  maiores: FeicaoUsina[];
  /** a potência de cada uma das maiores na conta (com ano escolhido, a daquele ano) */
  kwDasMaiores: number[];
  linhas: number;
  km: number;
  /** ms da conta (usinas + linhas) */
  ms: number;
  /** a conta já incluiu as usinas menores (abaixo de 5 MW) */
  cadastroInteiro: boolean;
  /** o ano da linha do tempo (null = hoje) */
  ano: number | null;
  /** com ano escolhido: usinas na caixa sem ano no cadastro (fora da conta acima) */
  usinasSemAno: number;
  kwSemAno: number;
  /** com ano escolhido: linhas na caixa cujo ano não se sabe (data de carga da base depois do ano) */
  linhasSemAno: number;
  /** a conta usou o polígono da área livre (false = a caixa, o recuo) */
  peloPoligono: boolean;
}

/** Piso das "maiores desta tela", em kW. */
export const PISO_DAS_MAIORES_KW = 1000;

/** Quantas, por extenso, no título das maiores. */
const POR_EXTENSO = ['', 'uma', 'duas', 'três', 'quatro', 'cinco'];

/** A conta da caixa. Exportada para a sonda medir o custo. */
export function contarNaCaixa(u: Colunas | null, li: LinhasIndexadas | null, caixaDaTela: Limites, cadastroInteiro: boolean, ano: number | null = null, areaLivre: AreaLivre | null = null): ContaDaTela {
  const t0 = performance.now();
  let usinasSemAno = 0;
  let kwSemAno = 0;
  let linhasSemAno = 0;
  // com o polígono, a caixa dele é só o filtro grosso; o teste fino é o do polígono
  const pol = prepararAnel(areaLivre);
  const anel = pol?.anel ?? null;
  let [o, s, l, n] = pol?.caixa ?? caixaDaTela;
  // caixa que dá a volta no antimeridiano: o Brasil fica do lado oeste, basta abrir até 180
  if (l < o) l += 360;
  const porCat = new Array(CATEGORIAS.length).fill(0) as number[];
  const nPorCat = new Array(CATEGORIAS.length).fill(0) as number[];
  let usinas = 0;
  let kw = 0;
  // as cinco maiores, por inserção (lista curta)
  const top: number[] = [];
  const topKw: number[] = [];
  if (u) {
    for (let i = 0; i < u.n; i++) {
      let x = u.lon[i];
      const y = u.lat[i];
      if (y < s || y > n) continue;
      if (x < o) x += 360;
      if (x > l) continue;
      if (anel && !dentroDoAnel(x, y, anel)) continue;
      // o ano escolhido (a mesma regra do mapa, tempo.ts › situacaoDaUsina): depois dele, fora;
      // sem ano no cadastro, à parte (nunca no ano zero)
      let kwI = u.kw[i];
      if (ano != null) {
        const et = u.etapas[i];
        const a = u.ano[i];
        if (et) {
          // data por unidade (ONS, tempo.ts › kwNoAno): conta a potência que a usina tinha no ano
          kwI = kwNoAno({ kw: u.kw[i], ano: Number.isNaN(a) ? null : a, etapas: et }, ano);
          if (!(kwI > 0)) continue;
        } else if (Number.isNaN(a)) {
          usinasSemAno++;
          kwSemAno += u.kw[i];
          continue;
        }
        else if (a > ano) continue;
      }
      usinas++;
      kw += kwI;
      porCat[u.cat[i]] += kwI;
      nPorCat[u.cat[i]]++;
      // piso de 1 MW: o microgerador de 1 kW não entra entre as maiores da tela (com poucas
      // usinas grandes à vista, a lista fica mais curta e o título diz quantas são)
      // (com ano escolhido, pela potência que a usina tinha nele)
      if (kwI >= PISO_DAS_MAIORES_KW && (top.length < 5 || kwI > topKw[topKw.length - 1])) {
        let k = top.length;
        while (k > 0 && topKw[k - 1] < kwI) k--;
        top.splice(k, 0, i);
        topKw.splice(k, 0, kwI);
        if (top.length > 5) {
          top.pop();
          topKw.pop();
        }
      }
    }
  }
  let linhas = 0;
  let km = 0;
  if (li) {
    for (let i = 0; i < li.n; i++) {
      const b = i * 4;
      if (li.caixa[b + 2] < o || li.caixa[b] > l || li.caixa[b + 3] < s || li.caixa[b + 1] > n) continue;
      // tempo.ts › situacaoDaRede: `op` decide; com só a data de carga da base, antes dela não se sabe
      let semAno = false;
      if (ano != null) {
        const opI = li.op[i];
        const antes = li.opAntesDe[i];
        if (!Number.isNaN(opI)) {
          if (opI > ano) continue;
        } else if (!Number.isNaN(antes)) {
          if (antes > ano) semAno = true;
        } else continue;
      }
      let cruza = false;
      for (const parte of li.partes[i]) {
        for (let k = 1; k < parte.length && !cruza; k++) {
          const x0 = parte[k - 1][0], y0 = parte[k - 1][1], x1 = parte[k][0], y1 = parte[k][1];
          cruza = segmentoCruza(x0, y0, x1, y1, o, s, l, n) && (!anel || segmentoNoAnel(x0, y0, x1, y1, anel));
        }
        if (cruza) break;
        if (parte.length === 1) cruza = parte[0][0] >= o && parte[0][0] <= l && parte[0][1] >= s && parte[0][1] <= n && (!anel || dentroDoAnel(parte[0][0], parte[0][1], anel));
        if (cruza) break;
      }
      if (cruza && semAno) linhasSemAno++;
      else if (cruza) {
        linhas++;
        km += li.km[i];
      }
    }
  }
  return { usinas, kw, porCat, nPorCat, linhasProntas: !!li, maiores: u ? top.map((i) => u.feicao[i]) : [], kwDasMaiores: topKw, linhas, km, ms: performance.now() - t0, cadastroInteiro, ano, usinasSemAno, kwSemAno, linhasSemAno, peloPoligono: !!anel };
}

/** A caixa do Brasil inteiro: tudo o que os arquivos trazem. */
const CAIXA_TODA: Limites = [-180, -90, 180, 90];

type CatIndice = { noMapaEmOperacao?: number; gwOperacaoNoMapa?: number };

/** O estado da conta que o painel de "A rede" mostra (topo, maiores, linhas). */
export interface EstadoDaConta {
  /** 'tela' a partir de ZOOM_DA_CONTA; abaixo, o Brasil inteiro */
  escopo: 'tela' | 'brasil';
  ano: number | null;
  /** a conta dos arquivos (da tela, ou do Brasil inteiro); null enquanto carregam */
  conta: ContaDaTela | null;
  /** Brasil hoje pelo índice, enquanto os arquivos não chegam (os mesmos números da lista por fonte) */
  doIndice: { kw: number; usinas: number; porCat: number[]; nPorCat: number[] } | null;
  falhouUsinas: boolean;
  falhouMenores: boolean;
  falhouLinhas: boolean;
  /** escopo da tela, mas o mapa ainda não informou a caixa */
  semLimites: boolean;
}

/** A conta do enquadramento, dos arquivos. Os três arquivos são os mesmos do mapa e da busca
 *  (o cache de dados.ts é um só: nada baixa duas vezes). */
export function useContaDaTela({ zoom, limites, indice, ano = null, areaLivre = null }: { zoom: number; limites: Limites | null; indice: IndiceDoAtlas | null; ano?: number | null; areaLivre?: AreaLivre | null }): EstadoDaConta {
  const daTela = zoom >= ZOOM_DA_CONTA;
  const [principais, setPrincipais] = useState<FeicaoUsina[] | null>(null);
  const [menores, setMenores] = useState<FeicaoUsina[] | null>(null);
  const [linhas, setLinhas] = useState<FeatureCollection | null>(null);
  const [falhouUsinas, setFalhouUsinas] = useState(false);
  const [falhouMenores, setFalhouMenores] = useState(false);
  // a falha das linhas guardada à parte (codigo.md 19): sem o arquivo, a tela não afirma "nenhuma linha"
  const [falhouLinhas, setFalhouLinhas] = useState(false);

  useEffect(() => {
    let vivo = true;
    if (!principais && !falhouUsinas) carregarUsinasPrincipais().then((u) => vivo && setPrincipais(u), () => vivo && setFalhouUsinas(true));
    if (!menores && !falhouMenores) carregarUsinasMenores().then((u) => vivo && setMenores(u), () => vivo && setFalhouMenores(true));
    if (!linhas && !falhouLinhas) carregarLinhas().then((l) => vivo && setLinhas(l), () => vivo && setFalhouLinhas(true));
    return () => {
      vivo = false;
    };
  }, [principais, menores, linhas, falhouUsinas, falhouMenores, falhouLinhas]);

  const u = useMemo(() => (principais ? colunas(menores ? principais.concat(menores) : principais) : null), [principais, menores]);
  const li = useMemo(() => (linhas ? indexarLinhas(linhas) : null), [linhas]);
  const conta = useMemo(() => {
    if (!u) return null;
    // o polígono da área livre vence a caixa quando o controle o informa; a caixa fica de recuo
    if (daTela) return limites ? contarNaCaixa(u, li, limites, !!menores, ano, areaLivre) : null;
    return contarNaCaixa(u, li, CAIXA_TODA, !!menores, ano);
  }, [daTela, limites, areaLivre, u, li, menores, ano]);

  const doIndice = useMemo(() => {
    const pc = indice?.camadas.usinas.porCategoria as unknown as Record<string, CatIndice> | undefined;
    if (!pc) return null;
    const porCat = CATEGORIAS.map((c) => (pc[c]?.gwOperacaoNoMapa ?? 0) * 1e6);
    const nPorCat = CATEGORIAS.map((c) => pc[c]?.noMapaEmOperacao ?? 0);
    return { kw: porCat.reduce((a, b) => a + b, 0), usinas: nPorCat.reduce((a, b) => a + b, 0), porCat, nPorCat };
  }, [indice]);

  return { escopo: daTela ? 'tela' : 'brasil', ano, conta, doIndice: !daTela && ano == null ? doIndice : null, falhouUsinas, falhouMenores, falhouLinhas, semLimites: daTela && !limites };
}

/** "<1%" / "16%": só o número vai em mono. */
function pctDe(v: number, total: number): string {
  const x = (v / total) * 100;
  return x >= 1 ? `${Math.round(x)}%` : '<1%';
}

/** O topo da coluna de "A rede": escopo e ano, o ÚNICO número grande, a barra por fonte (que
 *  liga e desliga a fonte no mapa) e as ressalvas da conta, curtas e visíveis. */
export function CabecaDaConta({
  estado,
  modo,
  camadas,
  aoAlternar,
  aoMudarAno,
  regua,
}: {
  estado: EstadoDaConta;
  modo: ModoV3;
  camadas?: ReadonlySet<string>;
  aoAlternar?: (c: Categoria) => void;
  aoMudarAno?: (ano: number | null) => void;
  /** a régua compacta do ano, colada logo abaixo do número que ela muda */
  regua?: ReactNode;
}) {
  const { escopo, ano, conta, doIndice } = estado;
  const p = PALETA[modo];
  const kw = conta?.kw ?? doIndice?.kw ?? null;
  const n = conta?.usinas ?? doIndice?.usinas ?? null;
  const porCat = conta?.porCat ?? doIndice?.porCat ?? null;
  return (
    <section className="atl-rp-topo" aria-labelledby="atl-nesta-tela-t" data-atlas="nesta-tela" data-escopo={escopo} data-ano={ano ?? undefined} data-ms={conta ? conta.ms.toFixed(2) : undefined} data-area={conta && escopo === 'tela' ? (conta.peloPoligono ? 'poligono' : 'caixa') : undefined}>
      <p className="atl-rp-sobre" id="atl-nesta-tela-t">
        <span className="atl-rp-sobre-escopo">{escopo === 'tela' ? 'Nesta tela' : 'Brasil, no cadastro'}</span>
        <span className="atl-rp-sobre-ano">{ano != null ? <>até <span className="atl-num">{ano}</span></> : 'hoje'}</span>
        {ano != null && aoMudarAno && (
          <button type="button" className="atl-rp-hoje" onClick={() => aoMudarAno(null)}>
            voltar a hoje
          </button>
        )}
      </p>
      {estado.falhouUsinas && !conta ? (
        <p className="atl-legenda-linha atl-ausencia">Os arquivos das usinas não responderam agora; a conta {escopo === 'tela' ? 'desta tela' : 'do ano'} fica indisponível.</p>
      ) : kw == null || n == null || !porCat ? (
        <p className="atl-carregando">{estado.semLimites ? 'Aguardando o mapa…' : ano != null ? `Somando o que existia em ${ano}…` : 'Somando o que está na tela…'}</p>
      ) : n === 0 ? (
        <p className="atl-nesta-vazio">{ano != null ? `Nenhuma usina desta tela operava até ${ano}.` : 'Nenhuma usina em operação nesta tela.'}</p>
      ) : (
        <>
          <p className="atl-rp-numero">
            <span className="atl-numero-heroi">{potencia(kw)}</span>
            <span className="atl-rp-numero-legenda">em {inteiro(n)} {n === 1 ? 'usina' : 'usinas'}</span>
          </p>
          <BarraDasFontes porCat={porCat} kw={kw} cores={p.categoria} camadas={camadas} aoAlternar={aoAlternar} />
        </>
      )}
      {regua}
      <p className="atl-rp-ressalva" data-atlas="ressalva-do-cadastro">
        Fonte: ANEEL, sem a geração distribuída (telhados).
      </p>
      {conta && <SemAno conta={conta} />}
      {conta && !conta.cadastroInteiro && (
        <p className="atl-rp-ressalva">{estado.falhouMenores ? 'Sem as usinas abaixo de 5 MW: o arquivo delas não respondeu agora.' : 'Ainda sem as usinas abaixo de 5 MW: o arquivo delas está chegando.'}</p>
      )}
    </section>
  );
}

/** Barra empilhada por fonte. Com `aoAlternar`, cada fatia é um interruptor da fonte no mapa;
 *  a fatia desligada fica hachurada (continua na conta: a conta é do cadastro, não do desenho). */
function BarraDasFontes({ porCat, kw, cores, camadas, aoAlternar }: { porCat: number[]; kw: number; cores: Record<Categoria, string>; camadas?: ReadonlySet<string>; aoAlternar?: (c: Categoria) => void }) {
  if (!(kw > 0)) return null;
  const partes = CATEGORIAS.map((c, i) => ({ c, v: porCat[i] })).filter((x) => x.v > 0);
  const tres = partes
    .slice()
    .sort((a, b) => b.v - a.v)
    .slice(0, 3);
  const falado = partes.map((x) => `${ROTULO_CATEGORIA[x.c]} ${pctDe(x.v, kw)}`).join(', ');
  const ativa = !!aoAlternar && !!camadas;
  return (
    <>
      <div className="atl-rp-barra" role={ativa ? 'group' : 'img'} aria-label={ativa ? 'Fontes nesta conta: tocar numa fatia liga ou desliga a fonte no mapa' : `Potência por fonte: ${falado}`} data-ativa={ativa || undefined}>
        {partes.map((x) =>
          ativa ? (
            <button
              key={x.c}
              type="button"
              className="atl-rp-fatia"
              aria-pressed={camadas.has(x.c)}
              aria-label={`${ROTULO_CATEGORIA[x.c]}, ${pctDe(x.v, kw)} (${potencia(x.v)})`}
              title={`${ROTULO_CATEGORIA[x.c]} · ${potencia(x.v)} · ${camadas.has(x.c) ? 'tocar esconde no mapa' : 'tocar mostra no mapa'}`}
              style={{ flexGrow: x.v, '--cor': cores[x.c] } as CSSProperties}
              onClick={() => aoAlternar(x.c)}
            />
          ) : (
            <span key={x.c} className="atl-rp-fatia" style={{ flexGrow: x.v, '--cor': cores[x.c] } as CSSProperties} title={`${ROTULO_CATEGORIA[x.c]} · ${potencia(x.v)}`} />
          ),
        )}
      </div>
      <p className="atl-rp-fontes" aria-hidden="true">
        {tres.map((x) => (
          <span key={x.c} data-desligada={ativa && !camadas.has(x.c) ? '' : undefined}>
            <span className="atl-rp-cor" style={{ background: cores[x.c] }} />
            {ROTULO_CATEGORIA[x.c]} <span className="atl-num">{pctDe(x.v, kw)}</span>
          </span>
        ))}
      </p>
    </>
  );
}

/** As linhas de transmissão da conta, ditas uma vez. Sem o arquivo, não afirma zero (codigo.md 19). */
export function LinhasDaConta({ estado, indice, soNaConta = false }: { estado: EstadoDaConta; indice: IndiceDoAtlas | null; soNaConta?: boolean }) {
  const { conta, escopo, ano } = estado;
  const li = indice?.camadas.linhas;
  // Brasil hoje: o índice já sabe (as mesmas que a chave "Linhas em operação" conta); dentro do
  // painel, a própria chave já diz o número, e o bloco não se repete (`soNaConta`)
  if (escopo === 'brasil' && ano == null && li) {
    if (soNaConta) return null;
    return (
      <p className="atl-rp-linhas" data-atlas="linhas-da-conta">
        <span className="atl-num">{inteiro(li.total - li.previstas)}</span> linhas de transmissão em operação, <span className="atl-num">{inteiro(li.kmEmOperacao)}</span>&nbsp;km
      </p>
    );
  }
  if (!conta || !conta.linhasProntas) {
    return (
      <p className="atl-rp-linhas" data-atlas="linhas-da-conta">
        {estado.falhouLinhas ? 'As linhas de transmissão não responderam agora.' : 'Carregando as linhas…'}
      </p>
    );
  }
  if (conta.linhas === 0) return <p className="atl-rp-linhas" data-atlas="linhas-da-conta">{ano != null ? `Nenhuma linha de transmissão desta tela operava até ${ano}.` : 'Nenhuma linha de transmissão em operação cruza esta tela.'}</p>;
  return (
    <p className="atl-rp-linhas" data-atlas="linhas-da-conta">
      <span className="atl-num">{inteiro(conta.linhas)}</span> {conta.linhas === 1 ? 'linha de transmissão' : 'linhas de transmissão'}
      {escopo === 'tela' ? (conta.linhas === 1 ? ' cruza a tela' : ' cruzam a tela') : ano != null ? ` até ${ano}` : ''}, <span className="atl-num">{inteiro(conta.km)}</span>&nbsp;km
      {escopo === 'tela' ? ' de ponta a ponta' : ''}
    </p>
  );
}

/** Com ano escolhido: o que não entra na conta por falta de ano, contado e dito (nunca no ano zero). */
function SemAno({ conta }: { conta: ContaDaTela }) {
  if (conta.ano == null || (conta.usinasSemAno === 0 && conta.linhasSemAno === 0)) return null;
  const partes: string[] = [];
  if (conta.usinasSemAno > 0) partes.push(`${inteiro(conta.usinasSemAno)} ${conta.usinasSemAno === 1 ? 'usina' : 'usinas'} (${potencia(conta.kwSemAno)})`);
  if (conta.linhasSemAno > 0) partes.push(`${inteiro(conta.linhasSemAno)} ${conta.linhasSemAno === 1 ? 'linha' : 'linhas'} com só a data de carga da base, posterior a ${conta.ano}`);
  return (
    <p className="atl-rp-ressalva atl-nesta-sem-ano" data-atlas="nesta-tela-sem-ano">
      Fora da conta, sem ano no cadastro: {partes.join(' e ')}.
    </p>
  );
}

/** As cinco maiores da conta (da tela ou do Brasil), cada uma abre a ficha. */
export function MaioresDaConta({ estado, modo, aoEscolher }: { estado: EstadoDaConta; modo: ModoV3; aoEscolher: (a: AtivoSelecionado) => void }) {
  const conta = estado.conta;
  if (!conta) return null;
  // todas abaixo do piso (mini e microgeração): a ausência é dita, não escondida
  if (!conta.maiores.length) return conta.usinas > 0 ? <p className="atl-legenda-linha atl-nesta-maiores-nenhuma">Nenhuma usina de 1 MW ou mais {estado.escopo === 'tela' ? 'nesta tela' : 'na conta'}.</p> : null;
  const onde = estado.escopo === 'tela' ? 'desta tela' : 'do Brasil';
  return (
    <div className="atl-rp-maiores" data-atlas="maiores-da-conta">
      <h3 className="atl-rp-h">{conta.maiores.length === 1 ? `A maior ${onde}` : `As ${POR_EXTENSO[conta.maiores.length]} maiores ${onde}`}{estado.ano != null ? <em> em {estado.ano}</em> : null}</h3>
      <ol>
        {conta.maiores.map((f, i) => {
          const pr = f.properties;
          const cat = pr.cat as Categoria;
          return (
            <li key={String(f.id)}>
              <button
                type="button"
                onClick={() =>
                  aoEscolher({ tipo: 'usina', chave: String(pr.ceg), props: pr as unknown as Record<string, unknown>, lngLat: [f.geometry.coordinates[0], f.geometry.coordinates[1]] })
                }
              >
                <img className="atl-rp-selo" src={urlDoSelo(cat, modo)} alt="" aria-hidden="true" />
                <span className="atl-rp-maior-nome">{String(pr.nome)}</span>
                <span className="atl-num atl-rp-maior-kw">{potencia(conta.kwDasMaiores[i] ?? Number(pr.kw))}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

interface NestaTelaProps {
  zoom: number;
  limites: Limites | null;
  indice: IndiceDoAtlas | null;
  modo: ModoV3;
  aoEscolher: (a: AtivoSelecionado) => void;
  /** o ano da linha do tempo de "A rede" (null = hoje): a conta passa a ser do que já existia nele */
  ano?: number | null;
}

/** O bloco inteiro, para quem ainda monta "Nesta tela" à parte do painel (montagem antiga da página). */
export function NestaTela({ zoom, limites, indice, modo, aoEscolher, ano = null }: NestaTelaProps) {
  const estado = useContaDaTela({ zoom, limites, indice, ano });
  return (
    <div className="atl-rp atl-rp-solto">
      <CabecaDaConta estado={estado} modo={modo} />
      <LinhasDaConta estado={estado} indice={indice} />
      <MaioresDaConta estado={estado} modo={modo} aoEscolher={aoEscolher} />
    </div>
  );
}
