// Atlas da Alexandria v3 — áreas de atuação das distribuidoras no mapa.
//
// Uma feição por distribuidora, da BDGD da ANEEL (camada ARAT), já montada em
// public/alexandria/atlas/dados/distribuicao-areas.geojson. Este arquivo guarda
// a fonte, as camadas, a carga sob demanda e as contas feitas da geometria (o tom
// de cada concessionária, o ponto do rótulo, quem cobre um ponto). Nada da fonte é
// alterado: o tom e o ponto do rótulo vão em cópias das propriedades.
//
// Só no capítulo "A rede". Desligada, mora no fundo (controleDoMapa.montar a chama
// logo depois das áreas do combustível); ligada, sobe por cima da rede com um véu de
// papel, e a rede passa a segundo plano (ver FUNDO, abaixo).

import type mapboxgl from 'mapbox-gl';
import type { Feature, FeatureCollection, Geometry, MultiPolygon, Point, Polygon, Position } from 'geojson';
import { carregarAreasDistribuicao } from '@/lib/alexandria/atlas/dados';
import { ANTES_DOS_ROTULOS, FONTES_DO_MAPA, TONS_DA_DISTRIBUICAO, type PaletaDoMapa } from '@/lib/alexandria/atlas/estilo';
import type { PropsAreaDistribuidora } from '@/lib/alexandria/atlas/tipos';
import type { ModoV3 } from '@/components/alexandria/v3/usoV3';

/** Fontes GeoJSON da camada. */
export const FD = { areas: 'atlas-distribuicao', rotulos: 'atlas-distribuicao-rotulos' } as const;

/** Camadas de clique e hover, de cima para baixo: a permissionária vence a concessionária que a contém. */
export const ALVOS_DA_DISTRIBUICAO = ['distribuicao-perm-area', 'distribuicao-conc-area'] as const;

/** De baixo para cima. O véu (papel sobre a área das concessionárias) vem primeiro. */
const CAMADAS = ['distribuicao-veu', 'distribuicao-conc-area', 'distribuicao-conc-fio', 'distribuicao-perm-area', 'distribuicao-perm-fio', 'distribuicao-rotulo'] as const;

/** Desligada, a camada mora no fundo (logo abaixo dos submercados); ligada, sobe para o topo
 *  das camadas de dado, abaixo só dos rótulos da base e do que o Atlas põe por cima de tudo
 *  (traço da seleção e do destaque, rótulo das maquetes). Um mecanismo só para "a rede recua"
 *  (B4): o véu de papel cobre linhas, subestações, usinas e os nomes delas; as áreas e os nomes
 *  das distribuidoras ficam por cima. As marcas de chão (anel da seleção, do destaque e do
 *  conjunto, âncora) e a 3D, que montar() põe no meio da rede, sobem junto por cima do véu
 *  (ordenar). A ordem de clique (ALVOS) não muda com isso. */
const FUNDO = 'submercados-area';
/** De baixo para cima, na ordem em que controleDoMapa.montar as deixa. */
const MARCAS_DE_CHAO = ['selecao-ponto', 'destaque-ponto', 'maquetes-ancora', 'maquetes-destaque-envoltoria', 'maquetes-destaque-anel'] as const;
/** O que vem logo acima das marcas de chão em montar() (para devolvê-las ao lugar). */
const LUGAR_DAS_MARCAS = 'maquetes-membros-toque';
/** A camada 3D das maquetes, que montar() põe logo abaixo do nome das usinas. */
const CAMADA_3D = 'maquetes';
const LUGAR_DA_3D = 'usinas-rotulo';
/** As bacias hidrográficas e o que vem logo acima delas em montar() (as áreas do combustível). */
const BACIAS = ['bacias-area', 'bacias-fio'] as const;
const LUGAR_DAS_BACIAS = 'bacias-sed-area';
/** O véu de papel da área selecionada (controleDoMapa.montar o põe logo abaixo dos rótulos da
 *  base). Ligada, fica por cima do tom das áreas e abaixo dos nomes delas. */
const VEU_DA_SELECAO = 'selecao-area-veu';
/** No noturno o traço claro sobre o fundo escuro atravessa mais o véu: um pouco mais denso. */
const VEU: Record<ModoV3, number> = { claro: 0.55, noturno: 0.72 };

type AreaFC = FeatureCollection<Polygon | MultiPolygon, PropsAreaDistribuidora>;

// ── contas sobre a geometria ─────────────────────────────────────────

const poligonosDe = (g: Geometry): Position[][][] => (g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : []);

function areaDoAnel(anel: Position[]): number {
  let s = 0;
  for (let i = 0; i < anel.length - 1; i++) s += anel[i][0] * anel[i + 1][1] - anel[i + 1][0] * anel[i][1];
  return Math.abs(s / 2);
}

function dentroDoAnel(x: number, y: number, anel: Position[]): boolean {
  let dentro = false;
  for (let i = 0, j = anel.length - 1; i < anel.length; j = i++) {
    const [xi, yi] = anel[i];
    const [xj, yj] = anel[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) dentro = !dentro;
  }
  return dentro;
}

/** Ponto dentro do polígono (anel externo menos os buracos). */
function dentroDoPoligono(x: number, y: number, pol: Position[][]): boolean {
  if (!dentroDoAnel(x, y, pol[0])) return false;
  for (let k = 1; k < pol.length; k++) if (dentroDoAnel(x, y, pol[k])) return false;
  return true;
}

/** A geometria cobre o ponto [lon, lat]. */
export function cobre(g: Geometry, lon: number, lat: number): boolean {
  for (const pol of poligonosDe(g)) if (dentroDoPoligono(lon, lat, pol)) return true;
  return false;
}

/** Distância (em graus, com a longitude encolhida pela latitude) do ponto à borda mais próxima. */
function distanciaABorda(x: number, y: number, pol: Position[][], kx: number): number {
  let min = Infinity;
  for (const anel of pol) {
    for (let i = 0; i < anel.length - 1; i++) {
      const ax = anel[i][0] * kx;
      const ay = anel[i][1];
      const bx = anel[i + 1][0] * kx;
      const by = anel[i + 1][1];
      const px = x * kx;
      const dx = bx - ax;
      const dy = by - ay;
      const l2 = dx * dx + dy * dy;
      let t = l2 ? ((px - ax) * dx + (y - ay) * dy) / l2 : 0;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      const ex = ax + t * dx - px;
      const ey = ay + t * dy - y;
      const d = ex * ex + ey * ey;
      if (d < min) min = d;
    }
  }
  return Math.sqrt(min);
}

/** Ponto do rótulo: o ponto do maior polígono mais longe da borda (busca em grade, refinada
 *  duas vezes). Devolve o ponto e o raio livre em graus de latitude. */
export function pontoDoRotulo(g: Geometry): { c: [number, number]; raio: number; area: number } | null {
  let maior: Position[][] | null = null;
  let areaTotal = 0;
  let areaMaior = 0;
  for (const pol of poligonosDe(g)) {
    const a = areaDoAnel(pol[0]);
    areaTotal += a;
    if (a > areaMaior) {
      areaMaior = a;
      maior = pol;
    }
  }
  if (!maior) return null;
  let [x0, y0, x1, y1] = [180, 90, -180, -90];
  for (const [x, y] of maior[0]) {
    if (x < x0) x0 = x;
    if (y < y0) y0 = y;
    if (x > x1) x1 = x;
    if (y > y1) y1 = y;
  }
  const kx = Math.cos((((y0 + y1) / 2) * Math.PI) / 180);
  let melhor: [number, number] = [maior[0][0][0], maior[0][0][1]];
  let raio = 0;
  let w = x1 - x0;
  let h = y1 - y0;
  let cx = (x0 + x1) / 2;
  let cy = (y0 + y1) / 2;
  for (const n of [11, 5, 5]) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const x = cx - w / 2 + (w * (i + 0.5)) / n;
        const y = cy - h / 2 + (h * (j + 0.5)) / n;
        if (!dentroDoPoligono(x, y, maior)) continue;
        const d = distanciaABorda(x, y, maior, kx);
        if (d > raio) {
          raio = d;
          melhor = [x, y];
        }
      }
    }
    // a próxima rodada procura em volta do melhor, numa janela de duas células
    w = (2 * w) / n;
    h = (2 * h) / n;
    [cx, cy] = melhor;
  }
  return { c: [Math.round(melhor[0] * 1e4) / 1e4, Math.round(melhor[1] * 1e4) / 1e4], raio, area: areaTotal };
}

/** Vizinhança entre concessionárias: bordas a menos de ~4 km (grade de 0,04°). Cada vértice
 *  entra na sua célula e nas 8 em volta: duas divisas paralelas a poucos metros caem muitas
 *  vezes em células vizinhas, e só a mesma célula deixava Cemig-D e Light sem vizinhança. */
function vizinhas(fs: Feature<Polygon | MultiPolygon, PropsAreaDistribuidora>[]): Set<number>[] {
  const viz = fs.map(() => new Set<number>());
  const grade = new Map<string, Set<number>>();
  const passo = 0.04;
  fs.forEach((f, i) => {
    for (const pol of poligonosDe(f.geometry))
      for (const anel of pol)
        for (const [x, y] of anel) {
          const cx = Math.floor(x / passo);
          const cy = Math.floor(y / passo);
          for (let dx = -1; dx <= 1; dx++)
            for (let dy = -1; dy <= 1; dy++) {
              const k = `${cx + dx},${cy + dy}`;
              let s = grade.get(k);
              if (!s) grade.set(k, (s = new Set()));
              s.add(i);
            }
        }
  });
  for (const s of grade.values()) {
    if (s.size < 2) continue;
    for (const a of s) for (const b of s) if (a !== b) viz[a].add(b);
  }
  return viz;
}

/** Tom de cada concessionária (0 a 4): coloração gulosa, das que têm mais vizinhas para as
 *  que têm menos, com o menor tom que nenhuma vizinha usa. Sem tom livre, fica o tom menos
 *  usado entre as vizinhas (a divisa ainda separa as duas pelo fio). */
function colorir(fs: Feature<Polygon | MultiPolygon, PropsAreaDistribuidora>[]): number[] {
  const viz = vizinhas(fs);
  const tom = fs.map(() => -1);
  const ordem = fs.map((_, i) => i).sort((a, b) => viz[b].size - viz[a].size || fs[a].properties.codigo - fs[b].properties.codigo);
  for (const i of ordem) {
    const usados = [0, 0, 0, 0, 0];
    for (const v of viz[i]) if (tom[v] >= 0) usados[tom[v]]++;
    const livre = usados.findIndex((n) => n === 0);
    tom[i] = livre >= 0 ? livre : usados.indexOf(Math.min(...usados));
  }
  return tom;
}

/** Tom calculado de cada concessionária (código ANEEL → 0..4), para a ficha e a legenda. */
const tomPorCodigo = new Map<number, number>();
export const tomDaDistribuidora = (codigo: number): number | null => tomPorCodigo.get(codigo) ?? null;

interface Preparado {
  areas: FeatureCollection;
  rotulos: FeatureCollection<Point>;
}

/** Cópia das feições com `tom` e `perm` (a fonte não muda) e os pontos de rótulo. */
function preparar(fc: AreaFC): Preparado {
  const conc = fc.features.filter((f) => f.properties.tipo === 'concessionária');
  const tons = colorir(conc);
  conc.forEach((f, i) => tomPorCodigo.set(f.properties.codigo, tons[i]));
  const areas: Feature[] = [];
  const rotulos: Feature<Point>[] = [];
  for (const f of fc.features) {
    const perm = f.properties.tipo === 'permissionária' ? 1 : 0;
    const tom = perm ? -1 : (tomPorCodigo.get(f.properties.codigo) ?? 0);
    areas.push({ type: 'Feature', geometry: f.geometry, properties: { ...f.properties, perm, tom } });
    const r = pontoDoRotulo(f.geometry);
    if (!r) continue;
    // zoom a partir do qual o nome cabe dentro da área: o diâmetro livre (em px de um mapa
    // de 512 px no zoom 0) precisa passar da largura estimada do nome
    const largura = Math.max(54, f.properties.nome.length * (perm ? 5.6 : 6.6));
    const zmin = Math.log2((largura * 360) / (2 * Math.max(r.raio, 1e-6) * 512));
    rotulos.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: r.c },
      properties: { nome: f.properties.nome, perm, zmin: Math.max(perm ? 7 : 4.6, Math.ceil(zmin)), peso: r.area },
    });
  }
  return { areas: { type: 'FeatureCollection', features: areas }, rotulos: { type: 'FeatureCollection', features: rotulos } };
}

/** As áreas que cobrem o ponto, da de cima para a de baixo, na ordem em que o mapa desenha e o
 *  clique consulta (ALVOS_DA_DISTRIBUICAO): toda permissionária por cima de toda concessionária
 *  e, dentro de cada camada, a última do arquivo por cima. */
export function areasNoPonto(fc: AreaFC, lon: number, lat: number): PropsAreaDistribuidora[] {
  const perm: PropsAreaDistribuidora[] = [];
  const conc: PropsAreaDistribuidora[] = [];
  for (const f of fc.features) if (cobre(f.geometry, lon, lat)) (f.properties.tipo === 'permissionária' ? perm : conc).push(f.properties);
  return [...perm.reverse(), ...conc.reverse()];
}

// ── a camada no mapa ─────────────────────────────────────────────────

type Adicionar = (camada: mapboxgl.AnyLayer) => void;
const exp = (e: unknown) => e as mapboxgl.Expression;
const VAZIA: FeatureCollection = { type: 'FeatureCollection', features: [] };

/** ['step', ['zoom'], '', 5, nome se zmin ≤ 5, 6, …]: o nome aparece no zoom inteiro zmin. */
const NOME_QUANDO_CABE: unknown[] = ['step', ['zoom'], ''];
for (let z = 5; z <= 11; z++) NOME_QUANDO_CABE.push(z, ['case', ['<=', ['get', 'zmin'], z], ['get', 'nome'], '']);

/** A carga do arquivo falhou (o painel declara "Áreas indisponíveis agora" em vez de seguir
 *  anunciando a legenda de áreas que não estão no mapa). Lido por useSyncExternalStore. */
export const cargaDaDistribuicao = (() => {
  let falhou = false;
  const ouvintes = new Set<() => void>();
  return {
    ler: () => falhou,
    assinar: (f: () => void) => {
      ouvintes.add(f);
      return () => {
        ouvintes.delete(f);
      };
    },
    definir: (v: boolean) => {
      if (v === falhou) return;
      falhou = v;
      for (const f of ouvintes) f();
    },
  };
})();

/** A camada das distribuidoras: carga sob demanda, desenho e visibilidade. O controle do mapa
 *  chama `montar` a cada troca de estilo e `aplicar` a cada mudança de estado. */
export class CamadaDaDistribuicao {
  private dado: AreaFC | null = null;
  private preparado: Preparado | null = null;
  private pedido = false;
  private ligada = false;
  /** a última busca falhou: não tenta de novo sem um gesto do leitor */
  private falhou = false;
  private destruida = false;
  /** chave da distribuidora selecionada na última aplicação (seleção nova = gesto novo) */
  private ultimoPedido: string | null = null;
  /** ms da busca + preparo do arquivo (medido uma vez, para a verificação) */
  msDeCarga: number | null = null;

  private readonly mapa: mapboxgl.Map;
  private readonly aoChegar: () => void;
  private readonly aoFalhar: (mensagem: string) => void;

  constructor(mapa: mapboxgl.Map, aoChegar: () => void, aoFalhar: (mensagem: string) => void) {
    this.mapa = mapa;
    this.aoChegar = aoChegar;
    this.aoFalhar = aoFalhar;
    cargaDaDistribuicao.definir(false);
  }

  /** Fontes e camadas (por baixo das linhas: `add` insere abaixo dos rótulos da base). */
  montar(add: Adicionar, p: PaletaDoMapa, modo: ModoV3) {
    const m = this.mapa;
    const t = TONS_DA_DISTRIBUICAO[modo];
    if (!m.getSource(FD.areas)) m.addSource(FD.areas, { type: 'geojson', data: this.preparado?.areas ?? VAZIA });
    if (!m.getSource(FD.rotulos)) m.addSource(FD.rotulos, { type: 'geojson', data: this.preparado?.rotulos ?? VAZIA });
    const v = t.valores;
    const valorDoTom = exp(['match', ['get', 'tom'], 0, v[0], 1, v[1], 2, v[2], 3, v[3], v[4]]);
    const vis = this.ligada ? 'visible' : 'none';
    const conc = exp(['==', ['get', 'perm'], 0]);
    const perm = exp(['==', ['get', 'perm'], 1]);
    // véu sobre todas as áreas, concessionárias e permissionárias (no arquivo, metade das
    // permissionárias é buraco na concessionária; a que fica por cima de uma leva duas camadas
    // de véu, um pouco mais lavada): o mar e os países vizinhos não mudam
    add({ id: 'distribuicao-veu', type: 'fill', source: FD.areas, layout: { visibility: vis }, paint: { 'fill-color': p.papel, 'fill-opacity': VEU[modo] } });
    add({ id: 'distribuicao-conc-area', type: 'fill', source: FD.areas, filter: conc, layout: { visibility: vis }, paint: { 'fill-color': p.tinta, 'fill-opacity': valorDoTom } });
    add({
      id: 'distribuicao-conc-fio',
      type: 'line',
      source: FD.areas,
      filter: conc,
      layout: { visibility: vis, 'line-join': 'round' },
      paint: { 'line-color': p.tinta, 'line-width': ['interpolate', ['linear'], ['zoom'], 3, 0.6, 6, 1], 'line-opacity': t.fio },
    });
    add({ id: 'distribuicao-perm-area', type: 'fill', source: FD.areas, filter: perm, layout: { visibility: vis }, paint: { 'fill-color': t.permissao, 'fill-opacity': t.permissaoPreenchimento } });
    add({
      id: 'distribuicao-perm-fio',
      type: 'line',
      source: FD.areas,
      filter: perm,
      layout: { visibility: vis, 'line-join': 'round' },
      paint: { 'line-color': t.permissao, 'line-width': ['interpolate', ['linear'], ['zoom'], 5, 0.6, 8, 1], 'line-opacity': 0.85, 'line-dasharray': [3, 2] },
    });
    // nome dentro da área, só no zoom em que cabe. Ligada, a camada sobe por cima dos rótulos de
    // dado do Atlas (ordenar): na colisão o nome dela vence usina e subestação; cidade (rótulo
    // da base, por cima) continua vencendo
    add({
      id: 'distribuicao-rotulo',
      type: 'symbol',
      source: FD.rotulos,
      minzoom: 4.6,
      layout: {
        visibility: vis,
        // o nome só a partir do zoom em que cabe (zmin, inteiro). Não vai em filtro: o Mapbox
        // não desenhou nada com ['zoom'] comparado a uma propriedade no filtro (medido); texto
        // vazio não entra na colisão
        'text-field': exp(NOME_QUANDO_CABE),
        'text-font': exp(['case', ['==', ['get', 'perm'], 1], ['literal', FONTES_DO_MAPA.OBRA_LEVE], ['literal', FONTES_DO_MAPA.SERIFA]]),
        'text-size': exp(['interpolate', ['linear'], ['zoom'], 4.6, ['case', ['==', ['get', 'perm'], 1], 10, 11], 9, ['case', ['==', ['get', 'perm'], 1], 11, 13]]),
        'text-letter-spacing': 0.03,
        'text-max-width': 8,
        'text-padding': 4,
        // o ponto do rótulo é o mais longe da divisa: há folga para o nome escorregar um pouco
        // quando uma usina ou cidade ocupa o centro (sem isso, na metrópole nenhum nome cabia)
        'text-variable-anchor': ['center', 'top', 'bottom', 'left', 'right'],
        'text-radial-offset': 1.2,
        'symbol-sort-key': exp(['-', 0, ['get', 'peso']]),
      },
      paint: {
        // tinta cheia (B4: com a camada ligada, o nome da área é o que manda na tela)
        'text-color': exp(['case', ['==', ['get', 'perm'], 1], t.rotuloPermissao, p.tinta]),
        'text-opacity': modo === 'noturno' ? 0.82 : 0.88,
        'text-halo-color': p.papel,
        'text-halo-width': 1.2,
      },
    });
  }

  /** O controle saiu (o leitor deixou o Atlas): a chegada tardia do arquivo não toca o mapa. */
  destruir() {
    this.destruida = true;
  }

  /** Busca e prepara o arquivo uma vez; avisa o controle quando chega. Depois de uma falha, não
   *  tenta sozinha a cada aplicação (o aviso voltava a cada clique): só um gesto novo do leitor
   *  (religar a chave, buscar uma distribuidora) tenta de novo. */
  garantir() {
    if (this.pedido || this.falhou || this.destruida) return;
    this.pedido = true;
    const t0 = performance.now();
    carregarAreasDistribuicao().then(
      (fc) => {
        if (this.destruida) return;
        this.dado = fc;
        this.preparado = preparar(fc);
        this.msDeCarga = Math.round(performance.now() - t0);
        (this.mapa.getSource(FD.areas) as mapboxgl.GeoJSONSource | undefined)?.setData(this.preparado.areas);
        (this.mapa.getSource(FD.rotulos) as mapboxgl.GeoJSONSource | undefined)?.setData(this.preparado.rotulos);
        this.aoChegar();
      },
      (e: unknown) => {
        if (this.destruida) return;
        this.pedido = false;
        this.falhou = true;
        cargaDaDistribuicao.definir(true);
        console.error('[atlas] distribuição:', e);
        this.aoFalhar('Não foi possível carregar as áreas das distribuidoras.');
      },
    );
  }

  /** Liga ou desliga as camadas; ligar (ou selecionar uma área) busca o arquivo. Ligar de novo
   *  depois de uma falha, ou pedir outra área, conta como gesto novo e tenta outra vez. */
  aplicar(ligada: boolean, precisaDoDado = false, chaveDoPedido: string | null = null) {
    const gestoNovo = (ligada && !this.ligada) || (precisaDoDado && chaveDoPedido !== this.ultimoPedido);
    this.ultimoPedido = precisaDoDado ? chaveDoPedido : null;
    if (gestoNovo && this.falhou) {
      this.falhou = false;
      cargaDaDistribuicao.definir(false);
    }
    if (ligada || precisaDoDado) this.garantir();
    if (ligada === this.ligada) return;
    this.ligada = ligada;
    for (const id of CAMADAS) if (this.mapa.getLayer(id)) this.mapa.setLayoutProperty(id, 'visibility', ligada ? 'visible' : 'none');
    this.ordenar();
  }

  /** Põe as camadas no andar certo (ver FUNDO). O controle chama depois de montar todas as
   *  camadas do estilo; `aplicar` chama a cada troca de ligada. */
  ordenar() {
    const m = this.mapa;
    const antes = this.ligada ? ANTES_DOS_ROTULOS : FUNDO;
    if (!m.getLayer(antes)) return;
    for (const id of CAMADAS) if (m.getLayer(id)) m.moveLayer(id, antes);
    // as marcas de chão e a 3D sobem junto, por cima do véu, na mesma ordem relativa (o corpo
    // da maquete continua cobrindo o anel, achado 22); desligada, voltam ao lugar de montar()
    if (this.ligada) {
      // a bacia (quando o leitor a liga) responde ao clique antes da distribuidora: fica à vista,
      // por cima das áreas e abaixo dos nomes, para o que responde ser o que se vê
      for (const id of BACIAS) if (m.getLayer(id) && m.getLayer('distribuicao-rotulo')) m.moveLayer(id, 'distribuicao-rotulo');
      // o véu da área escolhida clareia a área por cima do tom dela, e não por baixo do véu da rede
      if (m.getLayer(VEU_DA_SELECAO) && m.getLayer('distribuicao-rotulo')) m.moveLayer(VEU_DA_SELECAO, 'distribuicao-rotulo');
      for (const id of [...MARCAS_DE_CHAO, CAMADA_3D]) if (m.getLayer(id)) m.moveLayer(id, ANTES_DOS_ROTULOS);
    } else {
      if (m.getLayer(VEU_DA_SELECAO)) m.moveLayer(VEU_DA_SELECAO, ANTES_DOS_ROTULOS);
      if (m.getLayer(LUGAR_DAS_BACIAS)) for (const id of BACIAS) if (m.getLayer(id)) m.moveLayer(id, LUGAR_DAS_BACIAS);
      if (m.getLayer(LUGAR_DAS_MARCAS)) for (const id of MARCAS_DE_CHAO) if (m.getLayer(id)) m.moveLayer(id, LUGAR_DAS_MARCAS);
      if (m.getLayer(CAMADA_3D) && m.getLayer(LUGAR_DA_3D)) m.moveLayer(CAMADA_3D, LUGAR_DA_3D);
    }
  }

  /** Geometria de uma distribuidora pelo código ANEEL (null enquanto o arquivo não chegou). */
  geometria(chave: string): Geometry | null {
    if (!this.dado) {
      this.garantir();
      return null;
    }
    return this.dado.features.find((f) => String(f.properties.codigo) === chave)?.geometry ?? null;
  }
}
