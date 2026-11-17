// Atlas da Alexandria v3 — capítulo "O comércio" no mapa: rotas esquemáticas, veículos que
// andam por elas, interligações elétricas por terra, o gás da Bolívia e o tom dos países parceiros.
//
// Tudo vem de public/alexandria/atlas/dados/comercio-2025.json (bloco `viagens`, `rotas`,
// `condutos`, `eletricidade`). A camada não recalcula número: escolhe o que o filtro mostra,
// desenha e anima. Rotas, veículos e pontos são camadas nativas do Mapbox, e por isso o lado de
// trás do globo os oculta (o SVG por cima, como o de "As trocas", não ocultaria).
//
// Veículo: silhueta vista de cima desenhada em código e registrada como imagem SDF (a cor vem do
// sentido; o halo de papel separa o veículo da rota). A posição anda pela linha da rota em
// coordenada de Mercator (o Mapbox desenha cada segmento reto em Mercator), a no máximo ~20 Hz,
// só com o capítulo aberto e a aba visível. Velocidade ilustrativa. Movimento reduzido: parados
// perto do meio da rota, sem laço.

import mapboxgl from 'mapbox-gl';
import type { Feature, FeatureCollection, Geometry, LineString, Point } from 'geojson';
import { ANTES_DOS_ROTULOS, FONTES_DO_MAPA, comAlfa, type PaletaDoMapa } from '@/lib/alexandria/atlas/estilo';
import {
  TETO_DE_VEICULOS,
  cargaDoComercio,
  chaveDaEletrica,
  chaveDaViagem,
  chaveDoGas,
  lerChave,
  nomeDoPais,
  nomeDoProduto,
  quanto,
  veiculosDaViagem,
  viagensDe,
  viagensVisiveis,
  viagensEmDestaque,
  type ClasseDoVeiculo,
  type Comercio,
  type FiltroDoComercio,
  type ViagemDoComercio,
} from '@/lib/alexandria/atlas/comercio';
import type { ModoV3 } from '@/components/alexandria/v3/usoV3';

type Adicionar = (camada: mapboxgl.AnyLayer) => void;
const exp = (e: unknown) => e as mapboxgl.Expression;
const VAZIA: FeatureCollection = { type: 'FeatureCollection', features: [] };

/** Fontes GeoJSON da camada. */
export const FC = { rotas: 'atlas-comercio-rotas', veiculos: 'atlas-comercio-veiculos', terra: 'atlas-comercio-terra' } as const;
/** A fonte dos países que o capítulo "O mundo" já usa (controleDoMapa › F.paises, promoteId a3). */
const FONTE_DOS_PAISES = 'atlas-paises';

/** De baixo para cima. */
const CAMADAS = [
  'comercio-parceiros',
  'comercio-rota-casco',
  'comercio-rota-mar',
  'comercio-rota-ar',
  'comercio-rota-toque',
  'comercio-terra',
  'comercio-terra-rotulo',
  'comercio-veiculo',
  'comercio-terra-toque',
  'comercio-veiculo-toque',
] as const;

/** Camadas de clique e de pairar, da de cima para a de baixo: o veículo vence o ponto, que vence a rota.
 *  O símbolo do veículo entra junto com o círculo de toque: no globo, a consulta do Mapbox ao círculo
 *  só acertou o centro (medido: a 8 px do centro, nada), e a do símbolo usa a caixa inteira do ícone. */
const ALVOS = ['comercio-veiculo', 'comercio-veiculo-toque', 'comercio-terra', 'comercio-terra-toque', 'comercio-rota-toque'] as const;

// ── as silhuetas (SDF) ─────────────────────────────────────────────────

/** Imagem SDF: lado em px de imagem; a forma aponta para leste (+x). Leva 4: maior, porque o navio
 *  cresceu ~1,4× (ESCALA_DO_NAVIO) e o avião, de envergadura 30, precisa de 30 + 2 × borda. */
const SDF_L = 76;
const SDF_A = 48;
/** Leva 4: o navio lia como cápsula de tão pequeno; desenhado 1,4× maior. */
const ESCALA_DO_NAVIO = 1.4;
const SDF_BORDA = 8;
/** Supersamplagem da máscara antes da distância. */
const SUPER = 4;

type Desenho = (c: CanvasRenderingContext2D) => void;

/** Recorta (deixa vazio) um retângulo. */
function vao(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  c.save();
  c.globalCompositeOperation = 'destination-out';
  c.fillRect(x, y, w, h);
  c.restore();
}

function furo(c: CanvasRenderingContext2D, x: number, y: number, r: number) {
  c.save();
  c.globalCompositeOperation = 'destination-out';
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fill();
  c.restore();
}

/** Casco de navio da leva 4, visto de cima, proa em +x: popa reta, costados paralelos e a proa em
 *  CUNHA (reta até a ponta, não curva: a curva lia como pílula). `cheia` (0..1) arredonda a cunha
 *  para o graneleiro, de proa cheia. */
function cascoEmCunha(c: CanvasRenderingContext2D, comprimento: number, boca: number, proa: number, cheia = 0) {
  const x0 = -comprimento / 2;
  const x1 = comprimento / 2;
  const h = boca / 2;
  const xp = x1 - proa;
  c.beginPath();
  c.moveTo(x0, -h + 0.8);
  c.quadraticCurveTo(x0, -h, x0 + 0.8, -h);
  c.lineTo(xp, -h);
  if (cheia > 0) c.quadraticCurveTo(x1 - proa * (1 - cheia) * 0.5, -h, x1, 0);
  else c.lineTo(x1, 0);
  if (cheia > 0) c.quadraticCurveTo(x1 - proa * (1 - cheia) * 0.5, h, xp, h);
  else c.lineTo(xp, h);
  c.lineTo(x0 + 0.8, h);
  c.quadraticCurveTo(x0, h, x0, h - 0.8);
  c.closePath();
  c.fill();
}

/** Esvazia o convés (do fim da casaria até perto da proa): fica o contorno do casco e a casaria
 *  cheia na popa, que é o que faz o desenho ler como navio e não como cápsula. */
function conves(c: CanvasRenderingContext2D, xIni: number, xFim: number, meiaBoca: number, ponta: number) {
  c.save();
  c.globalCompositeOperation = 'destination-out';
  c.beginPath();
  c.moveTo(xIni, -meiaBoca);
  c.lineTo(xFim - ponta, -meiaBoca);
  c.lineTo(xFim, 0);
  c.lineTo(xFim - ponta, meiaBoca);
  c.lineTo(xIni, meiaBoca);
  c.closePath();
  c.fill();
  c.restore();
}

/** Desenha na escala do navio (leva 4). */
const comoNavio =
  (f: Desenho): Desenho =>
  (c) => {
    c.save();
    c.scale(ESCALA_DO_NAVIO, ESCALA_DO_NAVIO);
    f(c);
    c.restore();
  };

const DESENHOS: Record<ClasseDoVeiculo | 'conversora' | 'duto', Desenho> = {
  // petroleiro (leva 4): casco longo e fino com proa em cunha aguda; convés vazado com a linha de
  // tubos no meio; a casaria cheia na popa, um pouco mais larga que o convés (as asas do passadiço)
  petroleiro: comoNavio((c) => {
    cascoEmCunha(c, 40, 8.6, 11);
    conves(c, -11, 15.5, 2.5, 7.5);
    c.fillRect(-11, -0.55, 23, 1.1);
    c.fillRect(-15.5, -5.2, 4, 10.4);
  }),
  // graneleiro (leva 4): casco mais curto e mais largo, proa CHEIA (arredondada) e castelo de proa;
  // convés vazado com a fileira de tampas dos porões; casaria cheia na popa
  graneleiro: comoNavio((c) => {
    cascoEmCunha(c, 36, 11, 6, 0.75);
    conves(c, -9.5, 13, 3.6, 2.5);
    for (let i = 0; i < 5; i++) c.fillRect(-7.8 + i * 4.3, -2.7, 2.9, 5.4);
  }),
  // gaseiro: as esferas (tanques Moss) passam da boca do casco, e cada uma tem o seu domo; proa em
  // cunha e casaria cheia na popa
  gaseiro: comoNavio((c) => {
    cascoEmCunha(c, 40, 7, 9);
    for (let i = 0; i < 4; i++) {
      c.beginPath();
      c.arc(-9 + i * 7.2, 0, 4.6, 0, Math.PI * 2);
      c.fill();
    }
    for (let i = 0; i < 4; i++) furo(c, -9 + i * 7.2, 0, 1.5);
    vao(c, -14, -3.5, 0.9, 7);
  }),
  // carga (urânio, em contêiner): casco médio com as pilhas de contêineres em grade
  carga: comoNavio((c) => {
    cascoEmCunha(c, 34, 10, 8);
    for (let i = 0; i < 4; i++) {
      vao(c, -8.6 + i * 5, -3.6, 0.9, 7.2);
    }
    vao(c, -8.6, -0.45, 20, 0.9);
  }),
  // avião: fuselagem, asas em flecha e o estabilizador
  aviao: (c) => {
    c.beginPath();
    c.moveTo(16, 0);
    c.quadraticCurveTo(15, -2, 11, -2);
    c.lineTo(-13, -1.6);
    c.quadraticCurveTo(-16, -1.2, -16, 0);
    c.quadraticCurveTo(-16, 1.2, -13, 1.6);
    c.lineTo(11, 2);
    c.quadraticCurveTo(15, 2, 16, 0);
    c.fill();
    // asas
    c.beginPath();
    c.moveTo(4, -1.8);
    c.lineTo(-4, -15);
    c.lineTo(-7.5, -15);
    c.lineTo(-3, -1.8);
    c.closePath();
    c.moveTo(4, 1.8);
    c.lineTo(-4, 15);
    c.lineTo(-7.5, 15);
    c.lineTo(-3, 1.8);
    c.closePath();
    c.fill();
    // estabilizador
    c.beginPath();
    c.moveTo(-11, -1.4);
    c.lineTo(-15, -6.5);
    c.lineTo(-16.8, -6.5);
    c.lineTo(-14.6, -1.2);
    c.closePath();
    c.moveTo(-11, 1.4);
    c.lineTo(-15, 6.5);
    c.lineTo(-16.8, 6.5);
    c.lineTo(-14.6, 1.2);
    c.closePath();
    c.fill();
  },
  // conversora (interligação elétrica): losango
  conversora: (c) => {
    c.beginPath();
    c.moveTo(0, -6.5);
    c.lineTo(6.5, 0);
    c.lineTo(0, 6.5);
    c.lineTo(-6.5, 0);
    c.closePath();
    c.fill();
    c.beginPath();
    c.moveTo(0, -2.6);
    c.lineTo(2.6, 0);
    c.lineTo(0, 2.6);
    c.lineTo(-2.6, 0);
    c.closePath();
    c.save();
    c.globalCompositeOperation = 'destination-out';
    c.fill();
    c.restore();
  },
  // chegada por duto: anel
  duto: (c) => {
    c.beginPath();
    c.arc(0, 0, 6, 0, Math.PI * 2);
    c.fill();
    furo(c, 0, 0, 2.6);
  },
};

/** Desenha a forma numa máscara supersamplada e devolve a distância com sinal em SDF (borda em
 *  191, como imagemSdf de estilo.ts: 255 − 255·(d/8 + 0,25), d em px, negativo dentro). */
function imagemSdfDe(desenho: Desenho): { width: number; height: number; data: Uint8Array } | null {
  const W = SDF_L * SUPER;
  const H = SDF_A * SUPER;
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const c = cv.getContext('2d');
  if (!c) return null;
  c.setTransform(SUPER, 0, 0, SUPER, W / 2, H / 2);
  // máscara: só o alfa conta (a cor sai do sentido, no mapa)
  c.fillStyle = '#15213b';
  desenho(c);
  const px = c.getImageData(0, 0, W, H).data;
  const dentro = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) dentro[i] = px[i * 4 + 3] >= 128 ? 1 : 0;
  // borda: pixel de dentro com vizinho de fora
  const bx: number[] = [];
  const by: number[] = [];
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      if (!dentro[i]) continue;
      if (x === 0 || y === 0 || x === W - 1 || y === H - 1 || !dentro[i - 1] || !dentro[i + 1] || !dentro[i - W] || !dentro[i + W]) {
        bx.push(x + 0.5);
        by.push(y + 0.5);
      }
    }
  const data = new Uint8Array(SDF_L * SDF_A * 4);
  for (let y = 0; y < SDF_A; y++)
    for (let x = 0; x < SDF_L; x++) {
      const cx = (x + 0.5) * SUPER;
      const cy = (y + 0.5) * SUPER;
      let min = Infinity;
      for (let k = 0; k < bx.length; k++) {
        const dx = bx[k] - cx;
        const dy = by[k] - cy;
        const d2 = dx * dx + dy * dy;
        if (d2 < min) min = d2;
      }
      let d = Math.sqrt(min) / SUPER;
      const xi = Math.min(W - 1, Math.floor(cx));
      const yi = Math.min(H - 1, Math.floor(cy));
      if (dentro[yi * W + xi]) d = -d;
      const v = Math.max(0, Math.min(255, Math.round(255 - 255 * (d / SDF_BORDA + 0.25))));
      const i = (y * SDF_L + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = 255;
      data[i + 3] = v;
    }
  return { width: SDF_L, height: SDF_A, data };
}

const memoDasImagens = new Map<string, { width: number; height: number; data: Uint8Array }>();
const nomeDaImagem = (forma: keyof typeof DESENHOS) => `atlas-comercio-${forma}`;

// ── geometria da rota ─────────────────────────────────────────────────

const RAD = Math.PI / 180;
function haversineKm(a: [number, number], b: [number, number]): number {
  const dLat = (b[1] - a[1]) * RAD;
  const dLon = (b[0] - a[0]) * RAD;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(a[1] * RAD) * Math.cos(b[1] * RAD) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(s)));
}

/** Longitude desenrolada (sem salto de 360 entre vértices vizinhos). */
function desenrolar(linha: [number, number][]): [number, number][] {
  const out: [number, number][] = [];
  let ajuste = 0;
  for (let i = 0; i < linha.length; i++) {
    const [lon, lat] = linha[i];
    if (i > 0) {
      const ant = linha[i - 1][0] + ajuste;
      while (lon + ajuste - ant > 180) ajuste -= 360;
      while (lon + ajuste - ant < -180) ajuste += 360;
    }
    out.push([lon + ajuste, lat]);
  }
  return out;
}

interface Trajeto {
  /** vértices em Mercator (0..1) */
  mx: Float64Array;
  my: Float64Array;
  /** km acumulados até cada vértice */
  acc: Float64Array;
  km: number;
}

function trajetoDe(linha: [number, number][]): Trajeto {
  const l = desenrolar(linha);
  const n = l.length;
  const mx = new Float64Array(n);
  const my = new Float64Array(n);
  const acc = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const m = mapboxgl.MercatorCoordinate.fromLngLat({ lng: l[i][0], lat: l[i][1] });
    mx[i] = m.x;
    my[i] = m.y;
    if (i > 0) acc[i] = acc[i - 1] + haversineKm(l[i - 1], l[i]);
  }
  return { mx, my, acc, km: acc[n - 1] || 0 };
}

/** Ponto e rumo (graus a partir do norte, sentido horário) na fração f do trajeto. */
function pontoNoTrajeto(t: Trajeto, f: number, aoContrario: boolean): { lon: number; lat: number; rumo: number } {
  const n = t.mx.length;
  const alvo = Math.max(0, Math.min(1, aoContrario ? 1 - f : f)) * t.km;
  let lo = 0;
  let hi = n - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (t.acc[mid] <= alvo) lo = mid;
    else hi = mid;
  }
  const seg = t.acc[hi] - t.acc[lo];
  const u = seg > 0 ? (alvo - t.acc[lo]) / seg : 0;
  const x = t.mx[lo] + (t.mx[hi] - t.mx[lo]) * u;
  const y = t.my[lo] + (t.my[hi] - t.my[lo]) * u;
  let dx = t.mx[hi] - t.mx[lo];
  let dy = t.my[hi] - t.my[lo];
  if (aoContrario) {
    dx = -dx;
    dy = -dy;
  }
  const ll = new mapboxgl.MercatorCoordinate(x, y, 0).toLngLat();
  // y de Mercator cresce para o sul
  const rumo = (Math.atan2(dx, -dy) * 180) / Math.PI;
  return { lon: ll.lng, lat: ll.lat, rumo };
}

// ── os veículos ───────────────────────────────────────────────────────

/** Velocidade ilustrativa (km de rota por segundo de tela) e o período de uma volta. */
const VELOCIDADE = { mar: 320, ar: 700 } as const;
const PERIODO = { mar: [20, 70], ar: [12, 36] } as const;
/** Intervalo mínimo entre duas atualizações da posição (~20 Hz). */
const PASSO_MS = 50;

interface Veiculo {
  viagem: ViagemDoComercio;
  trajeto: Trajeto;
  /** fase inicial (0..1), por índice, sem acaso */
  fase: number;
  periodo: number;
  aoContrario: boolean;
  /** leva 4: o primeiro veículo de cada remessa; de perto da costa (ZOOM_DO_PORTO) ele anda só
   *  junto do porto brasileiro, saindo ou chegando, para que a ponta da rota não fique vazia */
  porto: boolean;
  /** leva 4, movimento reduzido: a fração parada, espalhada entre TODOS os veículos do mesmo traçado
   *  (antes cada remessa punha o seu no meio, e as remessas do mesmo traçado caíam no mesmo pixel) */
  meio: number;
  meioPorto: number;
  props: Record<string, unknown>;
}

/** Leva 4: zoom a partir do qual o primeiro veículo de cada remessa anda junto do porto. */
const ZOOM_DO_PORTO = 4;
/** Trecho (km) do laço do porto no zoom 4; cai à metade a cada zoom (fica ~do tamanho da tela). */
const TRECHO_DO_PORTO_KM = 2600;
/** Período (s) do laço do porto: o trecho cai à metade a cada zoom, então o período é o mesmo. */
const PERIODO_DO_PORTO = 30;

const fracao = (x: number) => x - Math.floor(x);
/** razão áurea: espalha as fases das rotas sem acaso */
const AUREA = 0.6180339887;

// ── a camada ─────────────────────────────────────────────────────────

export interface OpcoesDaCamadaDoComercio {
  reduzido: () => boolean;
  aoChegar: () => void;
  aoFalhar: (mensagem: string) => void;
}

/** Zoom em que o tom dos países parceiros começa a sumir e em que já sumiu (leva 3, medido nas
 *  capturas de perto, Øresund e Bretanha, tom fixo: a 4 o polígono grosseiro já corta o mar à vista; a 3,5
 *  começa a aparecer na costa da Suécia; a 3 não se vê). */
export const TOM_DOS_PARCEIROS = [3, 3.8] as const;

/** Raio (px) da busca do veículo mais perto do dedo, e o empate apertado (px) em que vence a rota
 *  mais grossa (leva 3: a 390, perto de Natal e Recife, o toque abria o vizinho). */
const RAIO_DO_TOQUE = 22;
const EMPATE_DO_TOQUE = 4;
/** Leva 4: o avião tem prioridade sobre os navios, num raio maior (ele anda ~2× mais rápido). */
const RAIO_DO_AVIAO = 30;
const PESO_DA_LARGURA: Record<string, number> = { grossa: 3, media: 2, fina: 1 };

/** Larguras das três classes de tonelagem (px no zoom 2 e no zoom 6). */
const LARGURA = { fina: [0.8, 1.3], media: [1.5, 2.3], grossa: [2.4, 3.6] } as const;
const classeDaLargura = (kt: number) => (kt >= 5000 ? 'grossa' : kt >= 1000 ? 'media' : 'fina');
/** Opacidade da rota menor em "todos" (claro, noturno): fio fraco, que não compete com as maiores. */
const OPACIDADE_DA_MENOR = [0.3, 0.38] as const;

export class CamadaDoComercio {
  private readonly mapa: mapboxgl.Map;
  private readonly opcoes: OpcoesDaCamadaDoComercio;
  private dado: Comercio | null = null;
  private pedido = false;
  private falhou = false;
  private destruida = false;
  private ligada = false;
  private filtro: FiltroDoComercio | null = null;
  private selecionado: string | null = null;
  private paleta: PaletaDoMapa | null = null;

  private rotas: FeatureCollection = VAZIA;
  private terra: FeatureCollection = VAZIA;
  private veiculos: Veiculo[] = [];
  private parceiros: { ex: string[]; im: string[] } = { ex: [], im: [] };
  private trajetos = new Map<string, Trajeto>();

  private quadro = 0;
  private ultimoPasso = 0;
  private readonly t0 = performance.now();
  /** ms de cada atualização (conta + setData), as últimas 240: para a medida de custo */
  readonly custos: number[] = [];
  /** quantas atualizações de posição já houve (a sonda confere que o laço para) */
  atualizacoes = 0;

  constructor(mapa: mapboxgl.Map, opcoes: OpcoesDaCamadaDoComercio) {
    this.mapa = mapa;
    this.opcoes = opcoes;
    document.addEventListener('visibilitychange', this.aoMudarVisibilidade);
    // leva 4: o trecho do porto depende do zoom; parado (movimento reduzido), a posição se refaz
    // ao fim de cada zoom
    mapa.on('zoomend', this.aoFimDoZoom);
  }

  private aoFimDoZoom = () => {
    if (this.ligada && !this.destruida && this.veiculos.length && !this.deveAnimar()) this.atualizarVeiculos(performance.now());
  };

  // ── montagem ──

  /** Fontes, imagens e camadas. O controle chama a cada troca de estilo. */
  montar(add: Adicionar, p: PaletaDoMapa, modo: ModoV3): void {
    const m = this.mapa;
    this.paleta = p;
    for (const forma of Object.keys(DESENHOS) as (keyof typeof DESENHOS)[]) {
      const nome = nomeDaImagem(forma);
      let img = memoDasImagens.get(forma);
      if (!img) {
        const feita = imagemSdfDe(DESENHOS[forma]);
        if (!feita) continue;
        img = feita;
        memoDasImagens.set(forma, img);
      }
      if (m.hasImage(nome)) m.removeImage(nome);
      m.addImage(nome, img, { sdf: true, pixelRatio: 1 });
    }
    if (!m.getSource(FC.rotas)) m.addSource(FC.rotas, { type: 'geojson', data: this.rotas });
    if (!m.getSource(FC.veiculos)) m.addSource(FC.veiculos, { type: 'geojson', data: this.dadosDosVeiculos() });
    if (!m.getSource(FC.terra)) m.addSource(FC.terra, { type: 'geojson', data: this.terra });
    const vis = this.ligada ? 'visible' : 'none';

    // países parceiros: um tom leve no destino ou na origem das rotas mostradas
    if (m.getSource(FONTE_DOS_PAISES)) {
      add({
        id: 'comercio-parceiros',
        type: 'fill',
        source: FONTE_DOS_PAISES,
        layout: { visibility: vis },
        // o tom vem do polígono grosseiro do mundo (o mesmo de "O mundo"): de perto ele vira quadrilátero
        // sobre o mar (medido: Øresund e Bretanha). Só vale de longe e some em rampa (TOM_DOS_PARCEIROS)
        paint: {
          'fill-color': this.corDosParceiros(p),
          'fill-opacity': exp(['interpolate', ['linear'], ['zoom'], TOM_DOS_PARCEIROS[0], modo === 'noturno' ? 0.14 : 0.1, TOM_DOS_PARCEIROS[1], 0]),
        },
      });
    }
    const corDoSentido = (sel: string) => exp(['case', ['==', ['get', 'sel'], 1], sel, ['==', ['get', 'sentido'], 'exportacao'], p.tinta, p.ouro]);
    const largura = (k: 0 | 1, extra = 0) =>
      exp(['match', ['get', 'larg'], 'grossa', LARGURA.grossa[k] + extra, 'media', LARGURA.media[k] + extra, LARGURA.fina[k] + extra]);
    const larguraPorZoom = (extra = 0) => exp(['interpolate', ['linear'], ['zoom'], 2, largura(0, extra), 6, largura(1, extra)]);
    // com "as duas", a rota que serve os dois sentidos vira duas linhas lado a lado
    const deslocamento = exp(['interpolate', ['linear'], ['zoom'], 2, ['*', ['get', 'lado'], 1.6], 6, ['*', ['get', 'lado'], 2.6]]);
    add({
      id: 'comercio-rota-casco',
      type: 'line',
      source: FC.rotas,
      layout: { visibility: vis, 'line-join': 'round', 'line-cap': 'round' },
      // a rota menor (em "todos", fora dos maiores) não leva o casco de papel: fica fio fraco
      paint: { 'line-color': p.papel, 'line-width': larguraPorZoom(1.6), 'line-opacity': exp(['case', ['==', ['get', 'menor'], 1], 0, modo === 'noturno' ? 0.35 : 0.55]), 'line-offset': deslocamento },
    });
    add({
      id: 'comercio-rota-mar',
      type: 'line',
      source: FC.rotas,
      filter: exp(['!=', ['get', 'via'], 'aérea']),
      layout: { visibility: vis, 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': corDoSentido(p.oxido),
        'line-width': larguraPorZoom(),
        'line-opacity': exp(['case', ['==', ['get', 'sel'], 1], 1, ['==', ['get', 'menor'], 1], OPACIDADE_DA_MENOR[modo === 'noturno' ? 1 : 0], 0.78]),
        'line-offset': deslocamento,
      },
    });
    // a via aérea, tracejada: arco do aeroporto ao centro do país, não rota de voo
    add({
      id: 'comercio-rota-ar',
      type: 'line',
      source: FC.rotas,
      filter: exp(['==', ['get', 'via'], 'aérea']),
      layout: { visibility: vis, 'line-join': 'round' },
      paint: {
        'line-color': corDoSentido(p.oxido),
        'line-width': larguraPorZoom(),
        'line-opacity': exp(['case', ['==', ['get', 'sel'], 1], 1, ['==', ['get', 'menor'], 1], OPACIDADE_DA_MENOR[modo === 'noturno' ? 1 : 0], 0.85]),
        'line-dasharray': [2, 2.2],
        'line-offset': deslocamento,
      },
    });
    // alvo de toque da rota: largo e invisível
    add({
      id: 'comercio-rota-toque',
      type: 'line',
      source: FC.rotas,
      layout: { visibility: vis },
      paint: { 'line-color': p.tinta, 'line-width': 14, 'line-opacity': 0 },
    });
    add({
      id: 'comercio-terra',
      type: 'symbol',
      source: FC.terra,
      layout: {
        visibility: vis,
        'icon-image': exp(['match', ['get', 'tipo'], 'gas', nomeDaImagem('duto'), nomeDaImagem('conversora')]),
        'icon-size': exp(['interpolate', ['linear'], ['zoom'], 2, 0.62, 6, 0.95]),
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
      },
      paint: {
        'icon-color': exp(['case', ['==', ['get', 'sel'], 1], p.oxido, p.tinta]),
        'icon-halo-color': p.papel,
        'icon-halo-width': 1.4,
      },
    });
    add({
      id: 'comercio-terra-rotulo',
      type: 'symbol',
      source: FC.terra,
      minzoom: 3.4,
      layout: {
        visibility: vis,
        'text-field': exp(['get', 'rotulo']),
        'text-font': exp(['literal', FONTES_DO_MAPA.SERIFA]),
        'text-size': 11,
        'text-anchor': 'left',
        'text-offset': [0.9, 0],
        'text-padding': 3,
      },
      paint: { 'text-color': p.tinta, 'text-halo-color': p.papel, 'text-halo-width': 1.3, 'text-opacity': 0.9 },
    });
    add({
      id: 'comercio-veiculo',
      type: 'symbol',
      source: FC.veiculos,
      layout: {
        visibility: vis,
        'icon-image': exp(['concat', 'atlas-comercio-', ['get', 'classe']]),
        // leva 4: o globo inteiro do celular (z ~0,3 a 0,8, ao enquadrar uma rota longa) pede o navio
        // menor, agora que a silhueta cresceu 1,4×
        'icon-size': exp(['interpolate', ['linear'], ['zoom'], 0.5, 0.55, 1.5, 0.74, 2, 0.85, 3, 0.95, 6, 1.15]),
        'icon-rotate': exp(['-', ['get', 'rumo'], 90]),
        'icon-rotation-alignment': 'map',
        'icon-pitch-alignment': 'map',
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
        // a seleção por cima de tudo; o avião por cima dos navios (leva 4)
        'symbol-sort-key': exp(['+', ['*', ['get', 'sel'], 2], ['case', ['==', ['get', 'classe'], 'aviao'], 1, 0]]),
      },
      paint: {
        'icon-color': corDoSentido(p.oxido),
        'icon-halo-color': p.papel,
        'icon-halo-width': modo === 'noturno' ? 1.2 : 1.5,
      },
    });
    // alvos de toque: círculos invisíveis, mais largos que o desenho (o clique tem de ser fácil)
    add({
      id: 'comercio-terra-toque',
      type: 'circle',
      source: FC.terra,
      layout: { visibility: vis },
      paint: { 'circle-radius': 13, 'circle-opacity': 0, 'circle-stroke-width': 0 },
    });
    add({
      id: 'comercio-veiculo-toque',
      type: 'circle',
      source: FC.veiculos,
      layout: { visibility: vis },
      paint: { 'circle-radius': exp(['interpolate', ['linear'], ['zoom'], 2, 15, 6, 19]), 'circle-opacity': 0, 'circle-stroke-width': 0, 'circle-pitch-alignment': 'map' },
    });
    this.empurrar();
  }

  /** Põe as camadas juntas, por cima dos dados do Atlas e abaixo dos rótulos da base. */
  ordenar(): void {
    const m = this.mapa;
    if (!m.getLayer(ANTES_DOS_ROTULOS)) return;
    for (const id of CAMADAS) if (m.getLayer(id)) m.moveLayer(id, ANTES_DOS_ROTULOS);
  }

  alvos(): string[] {
    return ALVOS.filter((id) => this.mapa.getLayer(id));
  }

  // ── estado ──

  aplicar(ligada: boolean, filtro: FiltroDoComercio, selecionado: string | null): void {
    if (this.destruida) return;
    const gestoNovo = ligada && !this.ligada;
    if (gestoNovo && this.falhou) this.falhou = false;
    if (ligada) this.garantir();
    const mudouVisivel = ligada !== this.ligada;
    const mudouFiltro = filtro !== this.filtro;
    const mudouSelecao = selecionado !== this.selecionado;
    this.ligada = ligada;
    this.filtro = filtro;
    this.selecionado = selecionado;
    if (mudouVisivel) for (const id of CAMADAS) if (this.mapa.getLayer(id)) this.mapa.setLayoutProperty(id, 'visibility', ligada ? 'visible' : 'none');
    if (this.dado && (mudouFiltro || mudouSelecao || mudouVisivel || this.veiculos.length === 0)) this.recompor();
    // movimento reduzido ligado agora: os veículos vão para o meio da rota e o laço para
    else if (this.dado && this.opcoes.reduzido()) this.atualizarVeiculos(performance.now());
    this.laco();
  }

  descrever(f: mapboxgl.MapboxGeoJSONFeature): { chave: string; titulo: string; linha: string } | null {
    const pr = f.properties as Record<string, unknown> | null;
    if (!pr || typeof pr.chave !== 'string') return null;
    return { chave: pr.chave, titulo: String(pr.titulo ?? ''), linha: String(pr.linha ?? '') };
  }

  geometria(chave: string): Geometry | null {
    const d = this.dado;
    const alvo = lerChave(chave);
    if (!d || !alvo) return null;
    if (alvo.tipo === 'viagem') {
      const v = viagensDe(d).find((x) => x.id === alvo.id);
      const r = v ? d.rotas[v.rota] : null;
      return r?.linha?.length ? { type: 'LineString', coordinates: desenrolar(r.linha) } : null;
    }
    if (alvo.tipo === 'eletrica') {
      const pts = (d.eletricidade?.interligacoes ?? []).filter((i) => i.pais === alvo.pais && i.lonlat).map((i) => i.lonlat as [number, number]);
      // um ponto só (a média das conversoras do país, que ficam a metros umas das outras): o
      // controle enquadra ponto com voo ao zoom 4,5, com contexto; MultiPoint quase coincidente
      // virava enquadramento de limites e mergulhava no zoom máximo (medido no Uruguai)
      if (!pts.length) return null;
      return { type: 'Point', coordinates: [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length] };
    }
    const c = (d.condutos ?? []).find((x) => x.pais === alvo.pais && x.lonlat);
    return c?.lonlat ? { type: 'Point', coordinates: c.lonlat } : null;
  }

  /** O alvo do clique ou do toque (leva 3): o veículo mais perto do ponto, num raio de
   *  RAIO_DO_TOQUE px; com empate apertado (EMPATE_DO_TOQUE px), o da rota mais grossa (mais kt).
   *  Sem veículo perto: o ponto por terra e, por fim, a rota (a mais grossa no mesmo ponto). O
   *  controle chama isto no lugar da primeira feição da consulta, que abria o vizinho que andou
   *  para baixo do dedo. */
  alvoEm(ponto: mapboxgl.Point): mapboxgl.MapboxGeoJSONFeature | null {
    const m = this.mapa;
    const vis = (id: string) => !!m.getLayer(id) && m.getLayoutProperty(id, 'visibility') !== 'none';
    const camadasV = ['comercio-veiculo', 'comercio-veiculo-toque'].filter(vis);
    if (camadasV.length) {
      const caixa: [mapboxgl.PointLike, mapboxgl.PointLike] = [
        [ponto.x - RAIO_DO_AVIAO, ponto.y - RAIO_DO_AVIAO],
        [ponto.x + RAIO_DO_AVIAO, ponto.y + RAIO_DO_AVIAO],
      ];
      let melhor: { f: mapboxgl.MapboxGeoJSONFeature; d: number; peso: number } | null = null;
      let aviao: { f: mapboxgl.MapboxGeoJSONFeature; d: number } | null = null;
      for (const f of m.queryRenderedFeatures(caixa, { layers: camadasV })) {
        if (f.geometry.type !== 'Point' || !this.descrever(f)) continue;
        const [lon, lat] = f.geometry.coordinates as [number, number];
        const q = m.project([lon, lat]);
        const d = Math.hypot(q.x - ponto.x, q.y - ponto.y);
        const pr = f.properties as Record<string, unknown>;
        // leva 4: o avião vence o navio (é rápido e pequeno: o dedo chega onde ele estava há meio
        // segundo), num raio maior que o dos navios
        if (pr.classe === 'aviao' && d <= RAIO_DO_AVIAO && (!aviao || d < aviao.d)) aviao = { f, d };
        if (d > RAIO_DO_TOQUE) continue;
        const peso = Number(pr.sel ?? 0) * 1e9 + Number(pr.kt ?? 0);
        if (!melhor || d < melhor.d - EMPATE_DO_TOQUE || (Math.abs(d - melhor.d) <= EMPATE_DO_TOQUE && peso > melhor.peso)) melhor = { f, d, peso };
      }
      if (aviao) return aviao.f;
      if (melhor) return melhor.f;
    }
    for (const id of ['comercio-terra', 'comercio-terra-toque'].filter(vis)) for (const f of m.queryRenderedFeatures(ponto, { layers: [id] })) if (this.descrever(f)) return f;
    if (vis('comercio-rota-toque')) {
      const fs = m.queryRenderedFeatures(ponto, { layers: ['comercio-rota-toque'] }).filter((f) => this.descrever(f));
      fs.sort((a, b) => (PESO_DA_LARGURA[String(b.properties?.larg)] ?? 0) - (PESO_DA_LARGURA[String(a.properties?.larg)] ?? 0));
      if (fs[0]) return fs[0];
    }
    return null;
  }

  /** O Brasil está na tela? (leva 3, para a página decidir se volta à câmera do capítulo quando o
   *  filtro muda): metade ou mais das âncoras das URFs do arquivo dentro do quadro útil do mapa (fora
   *  das margens) e na face do globo voltada para o leitor. Sem o arquivo, responde que sim. */
  brasilNaTela(): boolean {
    const d = this.dado;
    if (!d) return true;
    const m = this.mapa;
    const c = m.getCenter();
    const W = m.getCanvas().clientWidth;
    const H = m.getCanvas().clientHeight;
    const pad = m.getPadding();
    const pts = Object.values(d.ancoras ?? {})
      .map((a) => a.lonlat)
      .filter((x): x is [number, number] => !!x);
    if (!pts.length) return true;
    let dentro = 0;
    for (const [lon, lat] of pts) {
      const frente = Math.sin(lat * RAD) * Math.sin(c.lat * RAD) + Math.cos(lat * RAD) * Math.cos(c.lat * RAD) * Math.cos((lon - c.lng) * RAD);
      if (frente <= 0.05) continue;
      const q = m.project([lon, lat]);
      if (q.x >= (pad.left ?? 0) && q.x <= W - (pad.right ?? 0) && q.y >= (pad.top ?? 0) && q.y <= H - (pad.bottom ?? 0)) dentro++;
    }
    return dentro >= pts.length / 2;
  }

  destruir(): void {
    this.destruida = true;
    if (this.quadro) cancelAnimationFrame(this.quadro);
    this.quadro = 0;
    document.removeEventListener('visibilitychange', this.aoMudarVisibilidade);
    try {
      this.mapa.off('zoomend', this.aoFimDoZoom);
    } catch {
      /* o mapa já foi removido */
    }
  }

  /** Medida para a sonda: veículos na tela, atualizações e custo por atualização (ms). */
  medida(): { veiculos: number; rotas: number; atualizacoes: number; custoMedioMs: number | null; custoP95Ms: number | null } {
    const c = [...this.custos].sort((a, b) => a - b);
    return {
      veiculos: this.veiculos.length,
      rotas: this.rotas.features.length,
      atualizacoes: this.atualizacoes,
      custoMedioMs: c.length ? Math.round((c.reduce((s, x) => s + x, 0) / c.length) * 1000) / 1000 : null,
      custoP95Ms: c.length ? Math.round(c[Math.floor(c.length * 0.95)] * 1000) / 1000 : null,
    };
  }

  // ── carga ──

  private garantir() {
    if (this.dado || this.pedido || this.falhou || this.destruida) return;
    this.pedido = true;
    cargaDoComercio().then(
      (d) => {
        this.pedido = false;
        if (this.destruida) return;
        this.dado = d;
        this.recompor();
        this.laco();
        this.opcoes.aoChegar();
      },
      (e: unknown) => {
        this.pedido = false;
        if (this.destruida) return;
        this.falhou = true;
        console.error('[atlas] comércio:', e);
        this.opcoes.aoFalhar('Não foi possível carregar o comércio exterior de energia.');
      },
    );
  }

  private trajeto(id: string): Trajeto | null {
    let t = this.trajetos.get(id);
    if (t) return t;
    const r = this.dado?.rotas?.[id];
    if (!r?.linha || r.linha.length < 2) return null;
    t = trajetoDe(r.linha);
    this.trajetos.set(id, t);
    return t;
  }

  /** Refaz rotas, pontos por terra, veículos e parceiros a partir do filtro e da seleção. */
  private recompor() {
    const d = this.dado;
    if (!d || !this.filtro) return;
    const sel = this.selecionado ? lerChave(this.selecionado) : null;
    // "todos" (leva 3): as maiores do mesmo recorte ficam em destaque (traço cheio e veículo); as
    // demais viram fio fraco e sem veículo, e a via aérea fora das maiores sai do mapa (o leque de
    // tracejados sobre o Brasil), salvo com um produto isolado. A lista do painel continua inteira.
    const destaque = viagensEmDestaque(d, this.filtro);
    const filtro = this.filtro;
    const visiveis = viagensVisiveis(d, filtro).filter((v) => !destaque || destaque.has(v.id) || v.via !== 'aérea' || !!filtro.produtos);
    // a viagem escolhida fica à vista mesmo fora do filtro (veio da lista "todas" ou da busca)
    if (sel?.tipo === 'viagem' && !visiveis.some((v) => v.id === sel.id)) {
      const v = viagensDe(d).find((x) => x.id === sel.id);
      if (v) visiveis.push(v);
    }
    const selId = sel?.tipo === 'viagem' ? sel.id : null;
    const rotaSel = selId ? (visiveis.find((v) => v.id === selId)?.rota ?? null) : null;

    // rotas: uma feição por rota × sentido, com a tonelagem das viagens mostradas
    const porRota = new Map<string, ViagemDoComercio[]>();
    for (const v of visiveis) {
      const k = `${v.rota}|${v.sentido}`;
      const l = porRota.get(k);
      if (l) l.push(v);
      else porRota.set(k, [v]);
    }
    const sentidosDaRota = new Map<string, Set<string>>();
    for (const v of visiveis) {
      const s = sentidosDaRota.get(v.rota) ?? new Set<string>();
      s.add(v.sentido);
      sentidosDaRota.set(v.rota, s);
    }
    const rotas: Feature<LineString>[] = [];
    for (const [k, vs] of porRota) {
      const [rid, sentido] = k.split('|');
      const r = d.rotas[rid];
      if (!r?.linha || r.linha.length < 2) continue;
      const kt = vs.reduce((s, v) => s + v.kt, 0);
      const maior = vs[0];
      const ambos = (sentidosDaRota.get(rid)?.size ?? 0) > 1;
      const essaSelecionada = selId != null && rid === rotaSel && vs.some((v) => v.id === selId);
      const menor = destaque != null && !vs.some((v) => destaque.has(v.id) || v.id === selId);
      const texto = this.textos(d, maior);
      rotas.push({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: desenrolar(r.linha) },
        properties: {
          // a rota responde pela maior viagem dela; a ficha lista as outras do mesmo par
          chave: chaveDaViagem(essaSelecionada && selId ? selId : maior.id),
          titulo: texto.titulo,
          linha: vs.length > 1 ? `${texto.linha} · e mais ${vs.length - 1} ${vs.length - 1 === 1 ? 'produto' : 'produtos'}` : texto.linha,
          sentido,
          via: r.via ?? maior.via,
          larg: menor ? 'fina' : classeDaLargura(kt),
          menor: menor ? 1 : 0,
          lado: ambos ? (sentido === 'exportacao' ? -1 : 1) : 0,
          sel: essaSelecionada ? 1 : 0,
        },
      });
    }
    // as menores embaixo, a selecionada por cima
    rotas.sort((a, b) => Number(a.properties?.sel) - Number(b.properties?.sel) || Number(b.properties?.menor) - Number(a.properties?.menor));
    this.rotas = { type: 'FeatureCollection', features: rotas };

    // veículos: clamp(round(sqrt(kt/1000)), 1, 4) por viagem, teto de 40; primeiro um por viagem
    // (da maior para a menor), depois os demais na mesma ordem
    const quantos = new Map<string, number>();
    let total = 0;
    // em "todos", só as maiores (e a escolhida) levam veículo
    const comVeiculo = destaque ? visiveis.filter((v) => destaque.has(v.id) || v.id === selId) : visiveis;
    for (const v of comVeiculo) {
      if (total >= TETO_DE_VEICULOS) break;
      quantos.set(v.id, 1);
      total++;
    }
    for (const v of comVeiculo) {
      const q = quantos.get(v.id);
      if (q == null) continue;
      const extra = Math.min(veiculosDaViagem(v.kt) - 1, TETO_DE_VEICULOS - total);
      if (extra > 0) {
        quantos.set(v.id, q + extra);
        total += extra;
      }
    }
    const veiculos: Veiculo[] = [];
    visiveis.forEach((v, iv) => {
      const n = quantos.get(v.id) ?? 0;
      const t = this.trajeto(v.rota);
      if (!n || !t || t.km <= 0) return;
      const ar = v.classe === 'aviao' || v.via === 'aérea';
      const [pmin, pmax] = ar ? PERIODO.ar : PERIODO.mar;
      const periodo = Math.min(pmax, Math.max(pmin, t.km / (ar ? VELOCIDADE.ar : VELOCIDADE.mar)));
      const texto = this.textos(d, v);
      for (let k = 0; k < n; k++) {
        veiculos.push({
          viagem: v,
          trajeto: t,
          fase: fracao(k / n + iv * AUREA),
          periodo,
          aoContrario: v.sentido === 'importacao',
          porto: k === 0,
          meio: 0.5,
          meioPorto: 0.5,
          props: {
            chave: chaveDaViagem(v.id),
            titulo: texto.titulo,
            linha: texto.linha,
            sentido: v.sentido,
            classe: v.classe,
            kt: v.kt,
            sel: v.id === selId ? 1 : 0,
          },
        });
      }
    });
    // movimento reduzido (leva 4): os veículos que vão para o mesmo país pela mesma via se espalham
    // ao longo dos traçados (frações (i + 1)/(N + 1) entre os N do grupo): traçados de URFs vizinhas
    // para o mesmo país correm juntos no meio do oceano, e o meio de cada um caía no mesmo pixel.
    // Os do porto se espalham no trecho do porto, por traçado.
    const agrupar = (chave: (x: Veiculo) => string, lista: Veiculo[]) => {
      const g = new Map<string, Veiculo[]>();
      for (const x of lista) {
        const k = chave(x);
        const l = g.get(k);
        if (l) l.push(x);
        else g.set(k, [x]);
      }
      return [...g.values()];
    };
    for (const l of agrupar((x) => `${x.viagem.pais}|${x.viagem.via}`, veiculos))
      l.forEach((x, i) => {
        x.meio = (i + 1) / (l.length + 1);
      });
    for (const l of agrupar((x) => x.viagem.rota, veiculos.filter((x) => x.porto)))
      l.forEach((x, i) => {
        x.meioPorto = (i + 1) / (l.length + 1);
      });
    this.veiculos = veiculos;

    // por terra: as interligações elétricas e a chegada por duto
    const terra: Feature<Point>[] = [];
    for (const i of d.eletricidade?.interligacoes ?? []) {
      if (!i.lonlat) continue;
      const chave = chaveDaEletrica(i.pais);
      terra.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: i.lonlat },
        properties: {
          chave,
          tipo: 'eletrica',
          rotulo: i.nome,
          titulo: i.nome,
          linha: `Energia elétrica · ${i.paisNome ?? nomeDoPais(d, i.pais)}`,
          sel: sel?.tipo === 'eletrica' && sel.pais === i.pais ? 1 : 0,
        },
      });
    }
    for (const c of d.condutos ?? []) {
      if (!c.lonlat) continue;
      const seta = c.sentido === 'importacao' ? '←' : '→';
      terra.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: c.lonlat },
        properties: {
          chave: chaveDoGas(c.pais),
          tipo: 'gas',
          rotulo: `${nomeDoProduto(d, c.produto)} ${seta} ${nomeDoPais(d, c.pais)}`,
          titulo: `${nomeDoProduto(d, c.produto)} ${seta} ${nomeDoPais(d, c.pais)}`,
          linha: `${quanto(d, c.produto, c.kt, c.fobUS)} · por duto`,
          sel: sel?.tipo === 'gas' && sel.pais === c.pais ? 1 : 0,
        },
      });
    }
    this.terra = { type: 'FeatureCollection', features: terra };

    // países parceiros das rotas mostradas
    const ex = new Set<string>();
    const im = new Set<string>();
    for (const v of visiveis) (v.sentido === 'exportacao' ? ex : im).add(v.pais);
    this.parceiros = { ex: [...ex].filter((a) => a !== 'BRA'), im: [...im].filter((a) => a !== 'BRA' && !ex.has(a)) };
    this.empurrar();
  }

  private textos(d: Comercio, v: ViagemDoComercio): { titulo: string; linha: string } {
    const seta = v.sentido === 'exportacao' ? '→' : '←';
    const q = quanto(d, v.produto, v.kt, v.fobUS);
    return { titulo: `${nomeDoProduto(d, v.produto)} ${seta} ${nomeDoPais(d, v.pais)}`, linha: v.via === 'aérea' ? `${q} · via aérea` : q };
  }

  private corDosParceiros(p: PaletaDoMapa): mapboxgl.Expression {
    const { ex, im } = this.parceiros;
    const e: unknown[] = ['match', ['get', 'a3']];
    // os rótulos do match são lista crua (com 'literal' o Mapbox recusa a expressão em silêncio)
    if (ex.length) e.push(ex, p.tinta);
    if (im.length) e.push(im, p.ouro);
    e.push(comAlfa(p.tinta, 0));
    // match sem nenhum braço não vale: sem parceiro, transparente
    return exp(e.length > 3 ? e : ['literal', comAlfa(p.tinta, 0)]);
  }

  /** Manda rotas, pontos e veículos ao mapa (e o tom dos parceiros). */
  private empurrar() {
    const m = this.mapa;
    (m.getSource(FC.rotas) as mapboxgl.GeoJSONSource | undefined)?.setData(this.rotas);
    (m.getSource(FC.terra) as mapboxgl.GeoJSONSource | undefined)?.setData(this.terra);
    if (this.paleta && m.getLayer('comercio-parceiros')) m.setPaintProperty('comercio-parceiros', 'fill-color', this.corDosParceiros(this.paleta));
    this.atualizarVeiculos(performance.now());
  }

  // ── animação ──

  private dadosDosVeiculos(agora = performance.now()): FeatureCollection {
    const reduzido = this.opcoes.reduzido();
    const s = (agora - this.t0) / 1000;
    // leva 4: de perto da costa, o primeiro veículo de cada remessa anda num trecho junto do porto
    // brasileiro (a linha da rota começa sempre na URF): sai dele na exportação, chega nele na
    // importação. O trecho é ~do tamanho da tela (cai à metade a cada zoom, por degrau inteiro).
    let z = 0;
    try {
      z = this.mapa.getZoom();
    } catch {
      z = 0;
    }
    const trechoDoPorto = z >= ZOOM_DO_PORTO ? TRECHO_DO_PORTO_KM / 2 ** (Math.floor(z) - ZOOM_DO_PORTO) : 0;
    const fs: Feature<Point>[] = this.veiculos.map((v) => {
      let p: { lon: number; lat: number; rumo: number };
      if (trechoDoPorto > 0 && v.porto && v.trajeto.km > 0) {
        const L = Math.min(trechoDoPorto, v.trajeto.km * 0.5);
        const u = reduzido ? v.meioPorto : fracao(v.fase + s / PERIODO_DO_PORTO);
        // posição em km a partir do porto: crescendo na saída, decrescendo na chegada
        const km = v.aoContrario ? (1 - u) * L : u * L;
        const q = pontoNoTrajeto(v.trajeto, km / v.trajeto.km, false);
        p = v.aoContrario ? { ...q, rumo: q.rumo + 180 } : q;
      } else {
        const f = reduzido ? v.meio : fracao(v.fase + s / v.periodo);
        p = pontoNoTrajeto(v.trajeto, f, v.aoContrario);
      }
      return { type: 'Feature', geometry: { type: 'Point', coordinates: [p.lon, p.lat] }, properties: { ...v.props, rumo: Math.round(p.rumo * 10) / 10 } };
    });
    // o selecionado por cima
    fs.sort((a, b) => Number(a.properties?.sel) - Number(b.properties?.sel));
    return { type: 'FeatureCollection', features: fs };
  }

  private atualizarVeiculos(agora: number) {
    const src = this.mapa.getSource(FC.veiculos) as mapboxgl.GeoJSONSource | undefined;
    if (!src) return;
    const t = performance.now();
    src.setData(this.dadosDosVeiculos(agora));
    this.custos.push(performance.now() - t);
    if (this.custos.length > 240) this.custos.shift();
    this.atualizacoes++;
  }

  private deveAnimar() {
    return this.ligada && !this.destruida && this.veiculos.length > 0 && !this.opcoes.reduzido() && document.visibilityState === 'visible';
  }

  private laco = () => {
    if (!this.deveAnimar()) {
      if (this.quadro) cancelAnimationFrame(this.quadro);
      this.quadro = 0;
      return;
    }
    if (this.quadro) return;
    const passo = (agora: number) => {
      this.quadro = 0;
      if (!this.deveAnimar()) return;
      if (agora - this.ultimoPasso >= PASSO_MS) {
        this.ultimoPasso = agora;
        this.atualizarVeiculos(agora);
      }
      this.quadro = requestAnimationFrame(passo);
    };
    this.quadro = requestAnimationFrame(passo);
  };

  private aoMudarVisibilidade = () => {
    this.laco();
  };
}

/** A silhueta de cada forma em SDF (para a sonda e para o painel desenhar a legenda). */
export function imagemDaForma(forma: keyof typeof DESENHOS): { width: number; height: number; data: Uint8Array } | null {
  return memoDasImagens.get(forma) ?? imagemSdfDe(DESENHOS[forma]);
}
export const FORMAS_DO_COMERCIO = Object.keys(DESENHOS) as (keyof typeof DESENHOS)[];
