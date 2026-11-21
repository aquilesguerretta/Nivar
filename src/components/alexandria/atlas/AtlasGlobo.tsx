// AtlasGlobo — o globo 3D do Atlas Mundial (Wave 27; composição de
// frontispício na Wave 28).
//
// Estética de instrumento científico de gabinete, 1880-1900: esfera
// navy fosca em canvas TRANSPARENTE, repousando nas mãos da gravura de
// Atlas sobre o papel creme do canvas central. Nunca gêmeo digital,
// nunca terminal de trading — sem atmosfera brilhante (showAtmosphere
// DESLIGADO), sem gradiente decorativo, sem neon.
//
// Fronteiras vêm do TopoJSON real da Natural Earth 110m servido em
// /alexandria/geo/world-110m.json — nunca de imagem gerada. A junção
// com os 188 perfis reais do backend é feita em worldApi.carregarMundo.
//
// Este arquivo é o limite do chunk lazy: react-globe.gl + three-globe
// (~601 KB raw / 193 KB gzip) só são baixados quando /alexandria/atlas
// abre, porque AtlasStub importa este componente via React.lazy.

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import Globe, { type GlobeMethods } from 'react-globe.gl';
import { MeshPhongMaterial, Color } from 'three';
import { geoCentroid, geoBounds } from 'd3-geo';
import { A, A2, AT, AS, AE } from '../../../design/alexandria-tokens';
import {
  carregarMundo,
  combustivelDominante,
  nomePaisPt,
  type MundoAtlas,
  type PaisFeature,
  type PaisFeatureProps,
  type PaisResumo,
} from '../../../lib/atlas/worldApi';
import {
  corDoPais,
  passaNoFiltro,
  COR_FONTE,
  type FiltroFonte,
  type ModoCor,
} from '../../../lib/atlas/atlasDerivacoes';
import {
  COR_SUBMERCADO,
  submercadoEm,
  type FeatureSubmercado,
  type PropsSubmercado,
} from './CamadaBrasil';
import { PaisTooltip, type AlvoTooltip } from './PaisTooltip';
import { PaisPerfil } from './PaisPerfil';
import { BuscaPais } from './BuscaPais';

// ─────────────────────────────────────────────────────────────────────
// Curva de movimento — a MESMA cubic-bezier(0.65, 0, 0.35, 1) de
// AE.easing, avaliada em JS porque o preenchimento de hover vive num
// canvas WebGL, fora do alcance de transition CSS. Sem bounce, sem
// overshoot: um atlas de 1890 não quica.
// ─────────────────────────────────────────────────────────────────────

function bezierAlexandria(p: number): number {
  if (p <= 0) return 0;
  if (p >= 1) return 1;
  const x1 = 0.65, y1 = 0, x2 = 0.35, y2 = 1;
  const cx = (t: number) => 3 * t * (1 - t) * (1 - t) * x1 + 3 * t * t * (1 - t) * x2 + t * t * t;
  const cy = (t: number) => 3 * t * (1 - t) * (1 - t) * y1 + 3 * t * t * (1 - t) * y2 + t * t * t;
  // resolve x(t) = p por bisseção — 20 iterações dão precisão de sobra
  let lo = 0, hi = 1, t = p;
  for (let i = 0; i < 20; i++) {
    t = (lo + hi) / 2;
    if (cx(t) < p) lo = t;
    else hi = t;
  }
  return cy(t);
}

const FADE_MS = 180; // dentro da janela 150-200ms do brief
const OPACIDADE_HOVER = 0.38;

// Duração do voo de câmera: AE.desenhoLongo (1200ms), o teto já
// travado do sistema. pointOfView não tem callback de término — o fim
// se marca por timer da mesma duração, e SÓ ENTÃO o perfil abre.
const VOO_MS = 1200;

// Duração do zoom entre os modos página ↔ imersivo. Vem por prop do
// AtlasStub (que não pode importar deste módulo sem quebrar a
// fronteira lazy do chunk), e a MESMA constante alimenta a transição
// CSS do palco, da figura e a animação de altitude — as três precisam
// ser solidárias para o movimento ler como um zoom só.
const MODO_MS_PADRAO = 900;

// Direção da câmera em repouso: Atlântico, com Brasil, África e
// Europa visíveis no primeiro paint. A ALTITUDE de repouso não é
// constante — é computada pela composição do frontispício (Wave 28):
// o enquadramento em que a esfera encaixa nas mãos da gravura. Esse
// mesmo valor é o piso de zoom-out da Fase 4.
const DIR_REPOUSO = { lat: 8, lng: -35 };

// ─────────────────────────────────────────────────────────────────────
// Frontispício (Wave 28) — gravura de Atlas ajoelhado, mãos abertas
// onde a esfera repousa. Âncoras MEDIDAS na imagem original
// (1536×1024, alpha 0 em 81% dos pixels — fundo transparente
// verificado por decodificação):
//   mão esquerda x=28,1% y=9,0% · mão direita x=73,9% y=8,4%
//   ponto médio x=51% y≈8,7% · vão entre as mãos = 45,8% da largura
// ─────────────────────────────────────────────────────────────────────
const GRAV = {
  src: '/alexandria/gravuras/grav-atlas-segurando-o-globo.png',
  proporcao: 1024 / 1536, // altura/largura do arquivo
  maoMeioX: 0.51,
  maoY: 0.087,
  vao: 0.458,
} as const;

// Botões da composição — decididos vendo renderizado (ver CLAUDE.md):
//   larguraFig: largura MÁXIMA da gravura como fração da largura do
//               palco (a altura pode reduzir — ver comporFrontispicio)
//   raioPorVao: raio da esfera / vão entre as mãos. Testadas as duas
//               composições do brief: 0,5 (encaixada, centro na linha
//               das mãos) ENGOLE cabeça, braços e mãos da figura —
//               reprovada no render; 0,62 (palmas tocando o arco
//               inferior) é a escolhida.
// Revisão direta pós-Wave 28 (pedido do Aquiles): o corte monumental
// do topo caiu — a composição INTEIRA (esfera + figura) agora cabe na
// altura do palco em qualquer viewport, e o zoom do browser re-encaixa
// sozinho via ResizeObserver + re-pouso da câmera.
// raioPorVao subiu 0,62 → 0,78 na segunda revisão (pedido: "aumente o
// tamanho do globo"): a esfera ganha participação na composição e as
// mãos passam a segurar mais por baixo — o gesto de erguer.
const COMPOSICAO = { larguraFig: 0.78, raioPorVao: 0.78 } as const;
const MARGEM_TOPO = 10; // ar acima da esfera quando a altura limita

// Fade do frontispício no zoom-in, em FRAÇÕES do repouso do modo (a
// altitude de repouso muda entre página ~4,4 e imersivo ~1,7, então um
// limiar absoluto inverteria o sinal no imersivo): opaco perto do
// repouso, zero ao cruzar 42% dele — sempre antes do mergulho pousar.
const FADE_INICIO = 0.95;
const FADE_FIM = 0.42;

// ─────────────────────────────────────────────────────────────────────
// Grade de coordenadas (revisão 4) — meridianos e paralelos a cada 30°,
// o retículo gravado de um globo de gabinete. Dá estrutura ao oceano
// vazio sem inventar dado nenhum: são círculos máximos e paralelos
// geográficos reais, não ornamento. Fica ABAIXO dos polígonos em
// altitude, então a terra passa por cima e a grade lê no mar.
// ─────────────────────────────────────────────────────────────────────
/**
 * Ponto de caminho com altitude PRÓPRIA.
 *
 * `pathPointAlt` do globe.gl recebe o PONTO, não o objeto do caminho —
 * medido depois de três tentativas frustradas de elevar a fronteira de
 * submercado. Enquanto o acessor lia `obj.id` (sempre `undefined` num
 * ponto), TODO traço caía no valor da grade: raio 100,2 na cena, ou
 * seja rente à superfície e ABAIXO do polígono do país (0,006). Com a
 * coloração desligada o país é uma lavagem com alfa e o traço aparecia
 * por baixo; com coloração por métrica o cap vira opaco e a fronteira
 * sumia — o defeito que o Aquiles viu, e que nenhuma mudança de
 * altitude corrigia porque o valor nunca chegava a ser usado.
 */
interface PontoCaminho { lat: number; lng: number; alt: number }

const ALT_GRADE = 0.002;      // rente à esfera: a terra passa por cima
const ALT_SUBMERCADO = 0.015; // acima do cap do país (0,006)

const GRADE: Array<PontoCaminho[]> = (() => {
  const linhas: Array<PontoCaminho[]> = [];
  for (let lng = -180; lng < 180; lng += 30) {
    const meridiano: PontoCaminho[] = [];
    for (let lat = -88; lat <= 88; lat += 4) meridiano.push({ lat, lng, alt: ALT_GRADE });
    linhas.push(meridiano);
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    const paralelo: PontoCaminho[] = [];
    for (let lng = -180; lng <= 180; lng += 4) paralelo.push({ lat, lng, alt: ALT_GRADE });
    linhas.push(paralelo);
  }
  return linhas;
})();

// Raio da esfera em cena (three-globe) e meia-abertura vertical da
// câmera (fov 50°, CONFIRMADO por medição: a razão raio/altura 0,344
// na altitude 2,3 bate com asin(R/d)/tan(fov/2) em 0,1%).
const RAIO_CENA = 100;
const TAN_MEIO_FOV = Math.tan((25 * Math.PI) / 180);

/** Altitude que faz a esfera aparecer com `raioPx` num canvas de
 *  `canvasH` px, sob fov de 50°. Com o canvas único da revisão 5 esta
 *  é a única conversão necessária: a mesma altitude rende o mesmo
 *  tamanho nos dois modos, então não há salto a compensar. */
function altPorRaio(raioPx: number, canvasH: number): number {
  const x = (2 * raioPx * TAN_MEIO_FOV) / canvasH;
  return 1 / Math.sin(Math.atan(x)) - 1;
}

export interface DimPalco {
  w: number;
  h: number;
}

interface Composicao {
  imgW: number;
  imgH: number;
  imgLeft: number;
  imgTop: number;
  /** Posição do canvas COMUM relativa a este palco. O canvas tem o
   *  mesmo tamanho nos dois modos (revisão 5) — é só a janela que se
   *  abre e a câmera que se aproxima. */
  canvasTop: number;
  canvasLeft: number;
  raio: number;
  esferaCentroY: number;
  /** Altitude que produz exatamente o raio do encaixe — o repouso e o
   *  piso de zoom-out (Fase 4). */
  altRepouso: number;
  /** Altitude em que a esfera COBRE o palco inteiro (nenhuma borda,
   *  nenhum creme). O voo de clique nunca pousa acima dela — "não pode
   *  ter nenhuma circunstância em que o mapa fica cortado". */
  altCobertura: number;
}

/** Raio da esfera em repouso, por modo — não depende do canvas.
 *  PÁGINA: a composição INTEIRA (esfera + figura + pedestal) cabe na
 *  altura; kVert é o fator vertical por unidade de largura da gravura.
 *  IMERSIVO: o maior planeta que cabe inteiro com margem. */
function raioDeRepouso(dim: DimPalco, imersivo: boolean): number {
  const rFrac = COMPOSICAO.raioPorVao * GRAV.vao;
  const dyFrac = Math.sqrt(Math.max(0, rFrac * rFrac - (GRAV.vao / 2) * (GRAV.vao / 2)));
  const kVert = GRAV.proporcao * (1 - GRAV.maoY) + dyFrac + rFrac;
  const larguraFig = Math.min(COMPOSICAO.larguraFig * dim.w, (dim.h - MARGEM_TOPO) / kVert);
  return imersivo
    ? Math.min(0.43 * dim.h, 0.46 * dim.w)
    : COMPOSICAO.raioPorVao * GRAV.vao * larguraFig;
}

/** Centro da esfera dentro do palco daquele modo. */
function centroDeRepouso(dim: DimPalco, imersivo: boolean, raio: number): number {
  if (imersivo) return dim.h / 2;
  const vao = raio / COMPOSICAO.raioPorVao;
  const imgH = (vao / GRAV.vao) * GRAV.proporcao;
  const dy = Math.sqrt(Math.max(0, raio * raio - (vao / 2) * (vao / 2)));
  return dim.h - imgH + GRAV.maoY * imgH - dy;
}

/** Canvas ÚNICO para os dois modos (revisão 5): grande o bastante para
 *  cobrir o palco de qualquer um deles a partir do centro da esfera
 *  correspondente. Com o canvas constante, a relação altitude→raio não
 *  muda entre os modos — então o globo cresce só pelo movimento de
 *  câmera, sem nenhum salto de tamanho na troca, e o canvas nunca
 *  redimensiona durante a transição. */
export function canvasComum(dimPagina: DimPalco, dimImersivo: DimPalco): DimPalco {
  let meiaAltura = 0;
  let meiaLargura = 0;
  for (const [dim, imersivo] of [
    [dimPagina, false],
    [dimImersivo, true],
  ] as Array<[DimPalco, boolean]>) {
    const raio = raioDeRepouso(dim, imersivo);
    const centro = centroDeRepouso(dim, imersivo, raio);
    meiaAltura = Math.max(meiaAltura, centro, dim.h - centro);
    meiaLargura = Math.max(meiaLargura, dim.w / 2);
  }
  return { w: Math.ceil(2 * meiaLargura), h: Math.ceil(2 * meiaAltura) };
}

function comporFrontispicio(
  dim: DimPalco,
  imersivo: boolean,
  canvas: DimPalco,
): Composicao {
  const w = dim.w;
  const h = dim.h;
  const raio = raioDeRepouso(dim, imersivo);

  // ── a gravura, derivada do raio ──────────────────────────────────
  // Em ambos os modos a geometria é a MESMA relação: o vão entre as
  // palmas corresponde ao raio por `raioPorVao`, e a esfera toca as
  // duas mãos. Só o enquadramento muda — no imersivo a figura fica
  // grande demais para caber, e é isso que o pedido queria: "as mãos
  // segurem o globo aumentado, mesmo que o corpo esteja para fora".
  // Não precisa de modelo 3D: a gravura é plana e a esfera passa na
  // frente dela; as palmas tocam o arco inferior por construção.
  const vao = raio / COMPOSICAO.raioPorVao;
  const imgW = vao / GRAV.vao;
  const imgH = imgW * GRAV.proporcao;
  // centro da esfera: base da composição na página; meio da tela no
  // imersivo (planeta centrado, como o Google Earth)
  const dy = Math.sqrt(Math.max(0, raio * raio - (vao / 2) * (vao / 2)));
  const esferaCentroY = centroDeRepouso(dim, imersivo, raio);
  const maoY = esferaCentroY + dy;                    // linha das palmas
  const imgTop = maoY - GRAV.maoY * imgH;             // topo da gravura
  const imgLeft = w / 2 - GRAV.maoMeioX * imgW;       // meio das mãos no eixo

  // O canvas é o MESMO nos dois modos — só a sua posição dentro do
  // palco muda, para o centro da esfera cair onde a composição manda.
  const canvasTop = esferaCentroY - canvas.h / 2;
  const canvasLeft = w / 2 - canvas.w / 2;
  const altRepouso = altPorRaio(raio, canvas.h);
  // Cobertura: raio aparente que alcança o canto mais distante do
  // PALCO a partir do centro da esfera — abaixo dessa altitude não
  // existe borda visível.
  const raioCobertura = Math.hypot(w / 2, Math.max(esferaCentroY, h - esferaCentroY));
  const altCobertura = altPorRaio(raioCobertura, canvas.h);
  return {
    imgW, imgH, imgLeft, imgTop,
    canvasTop, canvasLeft,
    raio, esferaCentroY,
    altRepouso, altCobertura,
  };
}

interface AnimHover {
  de: number;
  para: number;
  t0: number;
}

/** Chave estável do polígono para o fade de hover. Tolera as duas
 *  formas que convivem no mesmo array: país (a3/name) e submercado
 *  do SIN (id), que a camada Brasil acrescenta na Wave 36. */
function chaveFeature(f: PaisFeature | FeatureSubmercado): string {
  const p = f.properties as Partial<PaisFeatureProps> & Partial<PropsSubmercado>;
  return p.a3 ?? p.id ?? p.name ?? '—';
}

/** O polígono é um submercado do SIN, e não um país? */
function ehSubmercado(f: unknown): f is FeatureSubmercado {
  return (f as FeatureSubmercado)?.properties?.ehSubmercado === true;
}

export interface AtlasGloboProps {
  /** Recebe a opacidade de ambiente (1 no repouso → 0 no mergulho),
   *  na MESMA curva do fade do frontispício. É como a página esmaece
   *  título, descrição e referências quando só o globo deve restar. */
  aoMudarOpacidadeAmbiente?: (opacidade: number) => void;
  /** Modo imersivo (revisão 3): palco em tela cheia, sem header nem
   *  rodapé, planeta no enquadramento Google Earth + barra de busca. */
  imersivo: boolean;
  /** Geometria do palco em CADA modo — o Stub conhece as duas, e é o
   *  que permite compor sem depender do tamanho intermediário durante
   *  a animação de zoom (revisão 5). */
  dimPagina: DimPalco;
  dimImersivo: DimPalco;
  /** Ligado durante a troca de modo: acende as transições CSS da
   *  figura e do canvas, para o globo e as mãos crescerem juntos. */
  animandoModo: boolean;
  /** Duração do zoom entre modos — a mesma do palco no AtlasStub. */
  duracaoModo?: number;
  /** Coloração e filtro (Wave 35) vêm decididos de fora: o globo
   *  DESENHA, não escolhe. Quem escolhe é o AtlasControles, na coluna
   *  lateral, e o Stub costura os dois. */
  modoCor?: ModoCor;
  filtro?: FiltroFonte;
  /** Pedido de voo vindo de FORA do globo (ranking, comparador). O
   *  `nonce` é o que permite pedir o mesmo país duas vezes seguidas.
   *  Reusa `voarAtePais` — o mesmo movimento do clique e da busca,
   *  nunca um segundo mecanismo de seleção. */
  pedidoDeVoo?: { iso: string; nonce: number } | null;
  /** Camada Brasil (Wave 36): os quatro submercados do SIN, com a
   *  geometria REAL do ARCHITECT. Entram no MESMO array de polígonos,
   *  numa altitude acima dos países — o globo continua sendo um só. */
  submercados?: FeatureSubmercado[] | null;
  aoSelecionarSubmercado?: (id: string | null) => void;
  /** Submercado aberto no painel — realçado no globo. O que está sob o
   *  ponteiro vence este, para o feedback seguir a mão do usuário. */
  submercadoAtivo?: string | null;
  /** Avisa quem está de fora qual país foi selecionado — pelo clique
   *  no globo, pela busca ou pelo pedido acima. É como o comparador
   *  recebe seleção sem duplicar a mecânica. */
  aoSelecionarPais?: (iso: string) => void;
  /** Disparado no INÍCIO do voo, com o destino. Diferente de
   *  `aoSelecionarPais`, que só chega quando a câmera pousa: quem
   *  precisa reagir à MUDANÇA DE FOCO — a camada Brasil, que tem de
   *  fechar assim que o usuário parte para outro país — não pode
   *  esperar o voo terminar, senão os submercados ficam desenhados
   *  sobre um país que não é o Brasil. */
  aoFocarPais?: (iso: string | null) => void;
  aoEntrarImersivo?: () => void;
  aoSairImersivo?: () => void;
}

export function AtlasGlobo({
  aoMudarOpacidadeAmbiente,
  imersivo,
  dimPagina,
  dimImersivo,
  animandoModo,
  duracaoModo = MODO_MS_PADRAO,
  modoCor = 'nenhum',
  filtro = null,
  pedidoDeVoo = null,
  submercados = null,
  aoSelecionarSubmercado,
  submercadoAtivo = null,
  aoSelecionarPais,
  aoFocarPais,
  aoEntrarImersivo,
  aoSairImersivo,
}: AtlasGloboProps) {
  const [mundo, setMundo] = useState<MundoAtlas | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [hover, setHover] = useState<PaisFeature | null>(null);
  const [subHover, setSubHover] = useState<string | null>(null);
  const [selecionado, setSelecionado] = useState<{
    feature: PaisFeature;
    resumo: PaisResumo | null;
  } | null>(null);
  const [, tick] = useReducer((c: number) => c + 1, 0);

  const areaRef = useRef<HTMLDivElement | null>(null);
  const globoRef = useRef<GlobeMethods | undefined>(undefined);
  const animsRef = useRef(new Map<string, AnimHover>());
  const opacidadesRef = useRef(new Map<string, number>());
  const rafRef = useRef<number | null>(null);
  const vooRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const voandoRef = useRef(false);
  const figuraRef = useRef<HTMLImageElement | null>(null);
  const controlesRef = useRef<{ removeEventListener: (t: string, f: () => void) => void } | null>(null);
  const aoMudarCameraRef = useRef<(() => void) | null>(null);
  const compRef = useRef<Composicao | null>(null);
  const altRepousoAnteriorRef = useRef<number | null>(null);
  const [longeDoRepouso, setLongeDoRepouso] = useState(false);
  const ambienteRef = useRef(aoMudarOpacidadeAmbiente);
  ambienteRef.current = aoMudarOpacidadeAmbiente;
  const aoVoltarRef = useRef<(() => void) | null>(null);
  const selecionarRef = useRef(aoSelecionarPais);
  selecionarRef.current = aoSelecionarPais;
  const selecionarSubmercadoRef = useRef(aoSelecionarSubmercado);
  selecionarSubmercadoRef.current = aoSelecionarSubmercado;
  const focarRef = useRef(aoFocarPais);
  focarRef.current = aoFocarPais;
  const entrarImersivoRef = useRef(aoEntrarImersivo);
  entrarImersivoRef.current = aoEntrarImersivo;
  const sairImersivoRef = useRef(aoSairImersivo);
  sairImersivoRef.current = aoSairImersivo;
  // detecção de transição de modo em tempo de render: o snap do
  // configurarCamera fica suspenso até o voo de transição assentar
  const imersivoRef = useRef(imersivo);
  const transicaoModoRef = useRef(false);
  if (imersivoRef.current !== imersivo) {
    imersivoRef.current = imersivo;
    transicaoModoRef.current = true;
  }
  /** país clicado ainda no modo página — o voo dispara depois que o
   *  palco expande e a composição imersiva assenta */
  const vooPendenteRef = useRef<PaisFeature | null>(null);

  // ── dado: TopoJSON + 188 perfis, uma vez ──────────────────────────
  useEffect(() => {
    let vivo = true;
    carregarMundo()
      .then((m) => { if (vivo) setMundo(m); })
      .catch(() => {
        if (vivo) setErro('Não foi possível carregar os perfis energéticos agora. Recarregue a página para tentar de novo.');
      });
    return () => { vivo = false; };
  }, []);

  // ── fade de hover: rAF + bezier próprio ───────────────────────────
  const passoFade = useCallback(() => {
    const agora = performance.now();
    let vivoAlgum = false;
    animsRef.current.forEach((anim, chave) => {
      const p = Math.min(1, (agora - anim.t0) / FADE_MS);
      const valor = anim.de + (anim.para - anim.de) * bezierAlexandria(p);
      opacidadesRef.current.set(chave, valor);
      if (p < 1) vivoAlgum = true;
    });
    if (!vivoAlgum) {
      animsRef.current.forEach((anim, chave) => {
        if (anim.para === 0) opacidadesRef.current.delete(chave);
      });
      animsRef.current.clear();
    }
    tick();
    rafRef.current = vivoAlgum ? requestAnimationFrame(passoFade) : null;
  }, []);

  const iniciarFade = useCallback((chave: string, para: number) => {
    const atual = opacidadesRef.current.get(chave) ?? 0;
    if (atual === para) return;
    animsRef.current.set(chave, { de: atual, para, t0: performance.now() });
    if (rafRef.current === null) rafRef.current = requestAnimationFrame(passoFade);
  }, [passoFade]);

  useEffect(() => () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    if (vooRef.current !== null) clearTimeout(vooRef.current);
    if (controlesRef.current && aoMudarCameraRef.current) {
      controlesRef.current.removeEventListener('change', aoMudarCameraRef.current);
    }
  }, []);

  // ESC em camadas — mesmo idioma dos overlays do resto do sistema:
  // perfil aberto → fecha e reenquadra; senão, imersivo → volta à
  // página do atlas. (A busca intercepta o próprio ESC para limpar.)
  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (selecionado !== null) {
        aoVoltarRef.current?.();
      } else if (imersivoRef.current) {
        sairImersivoRef.current?.();
      }
    };
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [selecionado]);

  const aoHover = useCallback((poligono: object | null) => {
    const f = (poligono as PaisFeature | null) ?? null;
    setHover((anterior) => {
      if (anterior && anterior !== f) iniciarFade(chaveFeature(anterior), 0);
      if (f && f !== anterior) iniciarFade(chaveFeature(f), 1);
      return f;
    });
  }, [iniciarFade]);

  // ── Submercado sob o ponteiro: hit-testing GEODÉSICO ──────────────
  // Não passa por polígono na cena (ver `submercadoEm` para as duas
  // razões medidas). Converte o pixel em lat/lng com o próprio globo e
  // testa contra a geometria real. Só roda com a camada aberta.
  const submercadosRef = useRef<FeatureSubmercado[] | null>(null);
  submercadosRef.current = submercados;
  const cliqueEmSubmercadoRef = useRef(0);

  const submercadoNoPonto = useCallback((ev: MouseEvent): string | null => {
    const feats = submercadosRef.current;
    const globo = globoRef.current;
    if (!feats || feats.length === 0 || !globo) return null;
    const tela = areaRef.current?.querySelector('canvas');
    if (!tela) return null;
    const r = tela.getBoundingClientRect();
    const coord = globo.toGlobeCoords(ev.clientX - r.left, ev.clientY - r.top);
    if (!coord) return null;
    return submercadoEm(coord.lng, coord.lat, feats);
  }, []);

  useEffect(() => {
    const area = areaRef.current;
    if (!area || !submercados || submercados.length === 0) {
      setSubHover(null);
      return;
    }
    const aoMover = (ev: MouseEvent) => setSubHover(submercadoNoPonto(ev));
    // CAPTURA: precisa correr ANTES do handler de país do globe.gl, que
    // escuta no canvas. Cair dentro de um submercado marca o instante, e
    // `aoClicar` usa essa marca para não voar até o Brasil de novo.
    const aoClicarArea = (ev: MouseEvent) => {
      const id = submercadoNoPonto(ev);
      if (id === null) return;
      cliqueEmSubmercadoRef.current = performance.now();
      selecionarSubmercadoRef.current?.(id);
    };
    area.addEventListener('mousemove', aoMover);
    area.addEventListener('click', aoClicarArea, true);
    return () => {
      area.removeEventListener('mousemove', aoMover);
      area.removeEventListener('click', aoClicarArea, true);
      setSubHover(null);
    };
  }, [submercados, submercadoNoPonto]);

  // ── voo até um país → SÓ ENTÃO o perfil abre. Navegar antes do
  //    movimento terminar cortaria a sensação de voar até lá. ────────
  const voarAtePais = useCallback((f: PaisFeature) => {
    const globo = globoRef.current;
    if (!mundo || !globo) return;

    const [lng, lat] = geoCentroid(f);
    // Altitude proporcional ao tamanho do país — a Rússia não cabe no
    // enquadramento de Fiji. geoBounds em graus.
    //
    // Faixa afrouxada na revisão 6 ("está dando muito zoom quando
    // escolhemos um país, tem que ser menos"): o teto de COBERTURA da
    // revisão 2 forçava TODO pouso do imersivo à mesma altitude rasa
    // (~0,52 medido) porque ela é sempre menor que o cálculo por
    // tamanho — o país sumia debaixo da câmera e o tamanho relativo
    // deixava de importar. O teto sai; a faixa [0,9 … 1,8] deixa o
    // país grande com o globo ainda legível em volta.
    const [[oeste, sul], [leste, norte]] = geoBounds(f);
    const spanLng = Math.abs(leste - oeste) > 180 ? 360 - Math.abs(leste - oeste) : Math.abs(leste - oeste);
    const span = Math.max(spanLng, Math.abs(norte - sul));
    const altitude = Math.min(1.8, Math.max(0.9, span / 50));

    setSelecionado(null); // perfil anterior sai antes do voo, não durante
    // Foco muda AGORA, não no pouso: a camada Brasil precisa fechar no
    // instante em que o usuário parte para outro país, senão os
    // submercados ficam desenhados sobre território que não é o Brasil
    // durante todo o voo — e, no destino, sobre o país errado.
    focarRef.current?.(f.properties.a3 ?? null);
    voandoRef.current = true;
    globo.pointOfView({ lat, lng, altitude }, VOO_MS);
    vooRef.current = setTimeout(() => {
      voandoRef.current = false;
      const a3 = f.properties.a3;
      setSelecionado({ feature: f, resumo: a3 ? (mundo.porIso.get(a3) ?? null) : null });
      if (a3) selecionarRef.current?.(a3);
    }, VOO_MS + 50);
  }, [mundo]);

  // Clique (ou busca): no modo página, primeiro ABRE o imersivo — o
  // voo fica pendente e dispara quando o palco expandido assenta.
  const aoClicar = useCallback((poligono: object) => {
    // Camada Brasil: o clique já foi tratado pelo hit-testing geodésico
    // na fase de captura, que abre o contexto da região. Aqui só
    // impedimos o voo — senão clicar num submercado refaria o voo até o
    // Brasil, que é onde a câmera já está.
    if (performance.now() - cliqueEmSubmercadoRef.current < 250) return;
    const f = poligono as PaisFeature;
    if (!mundo || voandoRef.current) return;
    if (!imersivoRef.current) {
      vooPendenteRef.current = f;
      entrarImersivoRef.current?.();
      return;
    }
    voarAtePais(f);
  }, [mundo, voarAtePais]);

  // Pedido de voo vindo de fora (ranking, comparador): resolve o ISO
  // para a feature e entra pelo MESMO caminho do clique — inclusive
  // abrindo o modo imersivo quando ainda estamos na página.
  useEffect(() => {
    if (!pedidoDeVoo || !mundo) return;
    const alvo = mundo.features.find((f) => f.properties.a3 === pedidoDeVoo.iso);
    if (alvo) aoClicar(alvo);
    // `nonce` é o que permite pedir o mesmo país duas vezes seguidas
  }, [pedidoDeVoo, mundo, aoClicar]);

  // ── retorno: perfil fecha no clique, câmera voa de volta —
  //    movimento simétrico ao de entrada, mesma duração, pousando no
  //    MESMO enquadramento travado do frontispício ────────────────────
  const aoVoltar = useCallback(() => {
    setSelecionado(null);
    setLongeDoRepouso(false);
    const globo = globoRef.current;
    const comp = compRef.current;
    if (globo && comp) {
      voandoRef.current = true;
      // só afasta — sem girar de volta para o Atlântico. O país que o
      // usuário estava lendo continua no centro.
      globo.pointOfView({ altitude: comp.altRepouso }, VOO_MS);
      vooRef.current = setTimeout(() => { voandoRef.current = false; }, VOO_MS + 50);
    }
  }, []);
  aoVoltarRef.current = aoVoltar;

  // ── configuração de câmera IDEMPOTENTE (segunda revisão) ──────────
  // Medido na linha do tempo pós-load: o three-render-objects pode
  // recriar câmera/controles DEPOIS do onGlobeReady — o listener de
  // 'change', o maxDistance e até o pointOfView aplicados no ready
  // eram clobberados (câmera largada no skyRadius, alt ~538). A
  // resposta não é acertar o timing, é ser re-aplicável: esta função
  // detecta troca de instância dos controles, reata o listener e
  // reaplica piso, luz e pouso. Chamada no ready, no resize e num
  // assentamento pós-mount.
  // ── composição (revisão 5) ────────────────────────────────────────
  // O canvas é ÚNICO para os dois modos, então a relação altitude→raio
  // é a mesma nos dois: o globo cresce só pelo movimento de câmera, e
  // não há nenhum salto de tamanho na troca. A composição vem das
  // dimensões declaradas de cada modo, nunca do palco intermediário —
  // durante o zoom, quem interpola é a transição CSS.
  const canvas = useMemo(
    () => canvasComum(dimPagina, dimImersivo),
    [dimPagina, dimImersivo],
  );
  const comp: Composicao = useMemo(
    () => comporFrontispicio(imersivo ? dimImersivo : dimPagina, imersivo, canvas),
    [imersivo, dimPagina, dimImersivo, canvas],
  );
  compRef.current = comp;

  const configurarCamera = useCallback(() => {
    const globo = globoRef.current;
    const comp = compRef.current;
    if (!globo || !comp) return;

    const controles = globo.controls() as unknown as {
      addEventListener: (t: string, f: () => void) => void;
      removeEventListener: (t: string, f: () => void) => void;
      maxDistance: number;
    };

    if (controlesRef.current !== controles) {
      // instância nova (init tardio do TRO / StrictMode): reata tudo
      if (controlesRef.current && aoMudarCameraRef.current) {
        controlesRef.current.removeEventListener('change', aoMudarCameraRef.current);
      }
      // Fade do frontispício + página dirigido pela câmera: 'change'
      // cobre roda do mouse E o tween do pointOfView — sem estado
      // React por frame, só style direto.
      const aoMudarCamera = () => {
        const g = globoRef.current;
        if (!g) return;
        const alt = g.pointOfView().altitude;
        const repouso = compRef.current?.altRepouso ?? 2.3;
        // Fade em frações do repouso do MODO — funciona igual na página
        // (repouso ~4,4) e no imersivo (~1,7), onde um limiar absoluto
        // inverteria o sinal. A figura segue o globo nos dois modos.
        const o = Math.max(
          0,
          Math.min(1, (alt / repouso - FADE_FIM) / (FADE_INICIO - FADE_FIM)),
        );
        const figura = figuraRef.current;
        if (figura) figura.style.opacity = o.toFixed(3);
        // A coluna de texto só existe no modo página: no imersivo a
        // tela é do globo, e nada de leitura disputa espaço com ele.
        ambienteRef.current?.(imersivoRef.current ? 0 : o);
        // Gatilho de entrada por roda (revisão 3): zoom para dentro a
        // partir do repouso da página ABRE o modo imersivo.
        if (!imersivoRef.current && !voandoRef.current && !transicaoModoRef.current && alt < repouso * 0.92) {
          entrarImersivoRef.current?.();
        }
        // botão de reenquadrar: só quando o afastamento veio da roda
        setLongeDoRepouso(alt < repouso * 0.85 && !voandoRef.current && !transicaoModoRef.current);
      };
      controles.addEventListener('change', aoMudarCamera);
      controlesRef.current = controles;
      aoMudarCameraRef.current = aoMudarCamera;
    }

    // Fase 4 — piso de zoom-out pelo mecanismo NATIVO da biblioteca:
    // OrbitControls.maxDistance (default Infinity; clamp interno em
    // _clampDistance). minDistance fica intocado: é ele que permite o
    // mergulho (globe.gl o põe rente à superfície).
    // Durante a troca de modo o piso fica afrouxado pela transição —
    // ela o restaura ao pousar.
    if (!transicaoModoRef.current) {
      controles.maxDistance = (1 + comp.altRepouso) * RAIO_CENA;
    }

    // Luz de gabinete, não de estúdio (medida por pixel na Wave 27).
    for (const luz of globo.lights()) {
      const l = luz as unknown as { type: string; intensity: number };
      if (l.type === 'DirectionalLight') l.intensity = 0.4;
      if (l.type === 'AmbientLight') l.intensity = 3.4;
    }

    // Pouso: primeira vez, câmera fora do piso (estado clobberado),
    // ou estava NO repouso anterior e o palco mudou de tamanho.
    // Suspenso durante transição de modo — o voo da transição é quem
    // leva a câmera ao repouso novo, animado, não um snap.
    //
    // SÓ o primeiro pouso escolhe a direção (Atlântico). Depois disso
    // mexemos apenas na ALTITUDE: reaplicar lat/lng aqui GIRAVA o globo
    // de volta ao Atlântico ao fim de cada transição — era o "spike"
    // que o Aquiles via ao sair do modo imersivo vendo outro país.
    // Onde o usuário deixou o globo é dele; nós só afastamos.
    const alt = globo.pointOfView().altitude;
    const anterior = altRepousoAnteriorRef.current;
    const foraDoPiso = alt > comp.altRepouso + 0.05;
    const estavaEmRepouso = anterior !== null && Math.abs(alt - anterior) < 0.05;
    if (anterior === null) {
      globo.pointOfView({ ...DIR_REPOUSO, altitude: comp.altRepouso }, 0);
    } else if (!voandoRef.current && !transicaoModoRef.current && (foraDoPiso || estavaEmRepouso)) {
      globo.pointOfView({ altitude: comp.altRepouso }, 0);
    }
    altRepousoAnteriorRef.current = comp.altRepouso;

    if (import.meta.env.DEV) {
      (window as unknown as Record<string, unknown>).__atlasGlobo = globo;
    }
  }, []);

  const aoGloboPronto = useCallback(() => {
    configurarCamera();
  }, [configurarCamera]);

  // ── transição de modo = ZOOM CONTÍNUO (revisão 5) ─────────────────
  // O pedido: "poder ver o globo aumentando junto com a mão do atlas,
  // como se estivéssemos dando zoom mesmo". Antes, só a câmera animava:
  // o palco e a figura SALTAVAM e um fade cobria o salto, o que lia
  // como piscar/trocar de página.
  //
  // Agora nada salta. O canvas é único, então a altitude sozinha
  // controla o tamanho do globo; a figura e o recorte do palco animam
  // por transição CSS com AE.easing; e a altitude é animada aqui com a
  // MESMA curva (`bezierAlexandria` é a avaliação em JS do mesmo
  // cubic-bezier) e a mesma duração. As três coisas são um movimento
  // só — o globo cresce nas mãos que crescem junto.
  useEffect(() => {
    if (!transicaoModoRef.current) return;
    const globo = globoRef.current;
    if (!globo) {
      transicaoModoRef.current = false;
      return;
    }

    // Clique num país da página: o zoom nas mãos acontece PRIMEIRO, e
    // só depois a câmera voa até o país (revisão 6). Antes o voo partia
    // junto com a troca de modo e atropelava o crescimento: o globo
    // saltava direto para o enquadramento do país, e a figura crescendo
    // por baixo virava um detalhe imperceptível — "não cresce, só sobe".
    const pendente = vooPendenteRef.current;
    vooPendenteRef.current = null;

    const altInicio = globo.pointOfView().altitude;
    const altFim = comp.altRepouso;
    // o piso do modo de destino pode ser menor que a altitude atual
    // (é o caso ao ENTRAR no imersivo): afrouxa durante o zoom, e o
    // configurarCamera restaura no pouso
    const controles = controlesRef.current as { maxDistance?: number } | null;
    if (controles) {
      controles.maxDistance = (1 + Math.max(altInicio, altFim) + 0.5) * RAIO_CENA;
    }

    voandoRef.current = true;
    const t0 = performance.now();
    let raf = 0;
    const passo = () => {
      const p = Math.min(1, (performance.now() - t0) / duracaoModo);
      const alt = altInicio + (altFim - altInicio) * bezierAlexandria(p);
      globo.pointOfView({ altitude: alt }, 0);
      if (p < 1) {
        raf = requestAnimationFrame(passo);
      } else {
        voandoRef.current = false;
        transicaoModoRef.current = false;
        if (pendente) {
          // o globo terminou de crescer nas mãos — agora sim voa até o
          // país, em movimento próprio e legível
          voarAtePais(pendente);
          configurarCamera();
          return;
        }
        configurarCamera(); // restaura o piso definitivo do modo
      }
    };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [imersivo, comp, voarAtePais, configurarCamera]);

  // ── cores — tudo token, nada de neon ──────────────────────────────
  // Superfície: navy fosco. Brilho quase zero: instrumento de gabinete,
  // não render de estúdio.
  const materialRef = useRef<MeshPhongMaterial | null>(null);
  if (materialRef.current === null) {
    materialRef.current = new MeshPhongMaterial({
      color: new Color(A.navy),
      shininess: 6,
      specular: new Color(A2.navyAfundado),
    });
  }

  // Preenchimento de topo. Ordem de precedência, de cima para baixo:
  //
  //   1. HOVER — terracota animada. Cor de ESTADO, nunca glow, e vence
  //      qualquer coloração analítica: o cursor precisa dizer onde
  //      está mesmo com o globo pintado por métrica.
  //   2. FILTRADO FORA (Wave 35) — esmaece para uma lavagem quase
  //      transparente, MAS continua desenhado, com contorno visível.
  //      Sumir país de um mapa mundial confundiria geografia com dado.
  //   3. COLORAÇÃO por métrica — delegada a `corDoPais`, que devolve
  //      hachura de ausência (nunca o extremo frio da rampa) quando o
  //      país não declara o campo.
  const corTopo = (obj: object): string => {
    const f = obj as PaisFeature;
    const o = opacidadesRef.current.get(chaveFeature(f)) ?? 0;

    // Com a camada Brasil aberta, o preenchimento de hover do PAÍS não
    // se aplica ao Brasil: ele pintaria o território inteiro de
    // terracota e engoliria o realce da região sob o cursor. Quem
    // responde ao ponteiro aqui é o submercado, não o país.
    const naCamada = submercados !== null && submercados.length > 0;
    if (naCamada && f.properties.a3 === 'BRA') {
      return corDoPais(mundo?.porIso.get('BRA') ?? null, modoCor).cor;
    }

    if (o > 0.004) return `rgba(168, 70, 42, ${(o * OPACIDADE_HOVER).toFixed(3)})`;

    const a3 = f.properties.a3;
    const pais = a3 ? (mundo?.porIso.get(a3) ?? null) : null;

    if (!passaNoFiltro(pais, filtro)) return 'rgba(242, 233, 214, 0.03)';

    // Filtro SEM coloração por métrica: quem passa recebe a cor da
    // fonte filtrada, cheia. Antes o filtro só trocava a lavagem de
    // creme de 0,10 para 0,03 entre quem passa e quem não passa — uma
    // diferença que não se vê, e o usuário lia como "o filtro não faz
    // nada". Com um modo de coloração ativo o país já tem cor própria,
    // e aí o filtro continua agindo só por recuo dos demais.
    if (filtro !== null && modoCor === 'nenhum') return COR_FONTE[filtro];

    return corDoPais(pais, modoCor).cor;
  };

  // Contorno: ouro-sépia sobre navy (A2.ouroSobreNavy) — decidido
  // olhando renderizado contra a alternativa creme; ver relatório da
  // wave. Traço fino, mesma família do fio duplo do frontispício.
  const corContorno = useCallback(
    // Submercado: contorno de polígono TRANSPARENTE. A tampa dele só
    // existe para o raycast, e o traço que o usuário vê é o `pathsData`.
    (obj: object) => (ehSubmercado(obj) ? 'rgba(0, 0, 0, 0)' : A2.ouroSobreNavy),
    [],
  );
  const corLateral = useCallback(() => 'rgba(0, 0, 0, 0)', []);

  // Submercado em destaque: o que está sob o ponteiro vence o que está
  // aberto no painel — o feedback tem que seguir a mão do usuário.
  const submercadoRealcado = subHover ?? submercadoAtivo ?? null;

  // Dois usos do mesmo mecanismo de caminho: a grade de coordenadas
  // (id null) no ouro do contorno a 16%, presente para dar estrutura ao
  // mar sem disputar com a fronteira; e a fronteira de submercado (id
  // preenchido) na cor OPACA da região — fat line com espessura não
  // aceita canal alfa, medido.
  //
  // O DESTAQUE mora aqui, e não na tampa: a região realçada mantém a
  // cor cheia enquanto as outras três recuam para o ouro do contorno.
  // É o mesmo idioma do filtro de país — quem sai de foco esmaece, nunca
  // some.
  const corGrade = useCallback(
    (obj: object) => {
      const id = (obj as { id: string | null }).id;
      if (!id) return 'rgba(203, 170, 110, 0.16)';
      // A cor é IDENTIDADE da região e não muda com o foco. Duas
      // tentativas de atenuar o não-realçado foram medidas e desfeitas:
      // por alfa (fat line com espessura não aceita canal alfa — a
      // fronteira some inteira) e por tom escuro (#6E6244 sobre o navy
      // também some, e o Nordeste, que tem um único anel, desaparecia
      // por completo). O realce mora na ESPESSURA — ver abaixo.
      return COR_SUBMERCADO[id] ?? A2.ouroSobreNavy;
    },
    [submercadoRealcado],
  );
  const pontosDoCaminho = useCallback(
    (obj: object) => (obj as { pontos: PontoCaminho[] }).pontos,
    [],
  );
  const latDoPonto = useCallback((p: object) => (p as PontoCaminho).lat, []);
  const lngDoPonto = useCallback((p: object) => (p as PontoCaminho).lng, []);
  const altDoPonto = useCallback((p: object) => (p as PontoCaminho).alt, []);
  // A altitude viaja no PONTO (ver PontoCaminho); aqui fica só o peso.
  // 1,2 é o piso medido em que a fronteira de submercado deixa de ler
  // como mais um contorno de país e passa a ler como camada própria;
  // 2,4 no realce. O realce é só de PESO — a cor é identidade da
  // região e não muda com o foco (ver corGrade).
  const espessuraCaminho = useCallback(
    (obj: object) => {
      const id = (obj as { id: string | null }).id;
      if (!id) return null;
      return id === submercadoRealcado ? 2.4 : 1.2;
    },
    [submercadoRealcado],
  );

  // Piso, pouso e listener acompanham resize (inclusive zoom do
  // browser) E qualquer init tardio do three-render-objects que recrie
  // os controles: aplica já e reaplica em janelas curtas de
  // assentamento. configurarCamera é idempotente — reaplicar é barato.
  useEffect(() => {
    if (mundo === null || comp === null) return;
    configurarCamera();
    const timers = [50, 250, 700, 1500].map((ms) => setTimeout(configurarCamera, ms));
    return () => timers.forEach(clearTimeout);
  }, [mundo, comp, configurarCamera]);

  // ── polígonos do globo: países + (quando a camada Brasil está
  //    aberta) os quatro submercados do SIN, no MESMO array. O globo
  //    continua sendo um só; o que muda é a altitude, que põe o
  //    submercado acima do país que ele recorta. ────────────────────
  // ── Submercados: CONTORNO, não preenchimento ────────────────────
  // Medido: o three-globe não tritura bem estes polígonos (342–718
  // vértices, multipart com furos, ~40° de extensão). Com o cap ligado
  // saía malha de blocos em resolução 5°, fecho convexo em 90° e casca
  // oca em 2° — o STROKE, porém, saía perfeito em todos. Três valores
  // testados, três resultados errados, sempre no preenchimento.
  //
  // Então os submercados entram como PATHS, o mesmo mecanismo que
  // desenha a grade de coordenadas e que já é confiável aqui. Não é
  // recuo: um atlas gravado delimita região por fio, não por chapado —
  // e é o único jeito de manter a geometria REAL sem simplificar
  // vértice (o que seria aproximar, que o brief proíbe).
  const linhasSubmercado = useMemo(() => {
    if (!submercados || submercados.length === 0) return [];
    const linhas: Array<{ id: string; pontos: PontoCaminho[] }> = [];
    for (const f of submercados) {
      const g = f.geometry as
        | { type: 'Polygon'; coordinates: number[][][] }
        | { type: 'MultiPolygon'; coordinates: number[][][][] };
      const partes = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
      for (const parte of partes) {
        for (const anel of parte) {
          linhas.push({
            id: f.properties.id,
            // GeoJSON é [lng, lat]. A ALTITUDE viaja no próprio ponto —
            // ver PontoCaminho para a razão medida.
            pontos: anel.map(([lng, lat]) => ({ lat, lng, alt: ALT_SUBMERCADO })),
          });
        }
      }
    }
    return linhas;
  }, [submercados]);

  const caminhos = useMemo(
    () => [
      ...GRADE.map((pontos) => ({ id: null as string | null, pontos })),
      ...linhasSubmercado,
    ],
    [linhasSubmercado],
  );

  // ── alvo do tooltip: derivado do hover + índice O(1) por ISO ──────
  let alvoTooltip: AlvoTooltip | null = null;
  // Submercado não entra aqui: o PaisTooltip fala de país, e um
  // submercado cairia no texto de "fora do conjunto de 188
  // soberanos" — falso. O contexto dele vive no painel próprio.
  if (hover && mundo && subHover === null && !ehSubmercado(hover)) {
    const a3 = hover.properties.a3;
    const resumo = a3 ? (mundo.porIso.get(a3) ?? null) : null;
    alvoTooltip = {
      nome: nomePaisPt(hover.properties, resumo?.countryName),
      resumo,
      dominante: resumo ? combustivelDominante(resumo.fuelMix) : null,
    };
  }

  return (
    <div
      ref={areaRef}
      role="img"
      aria-label="Globo interativo com o perfil energético de 188 países soberanos. Passe o cursor sobre um país para o resumo; clique para voar até ele e abrir o perfil completo."
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        // Canvas TRANSPARENTE (Wave 28): a esfera repousa direto sobre
        // o papel creme do canvas central — nenhum retângulo de fundo
        // atrás dela, em nenhum nível de zoom.
        background: 'transparent',
        overflow: 'hidden',
        cursor: hover ? 'pointer' : 'grab',
      }}
    >
      {erro !== null && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: AS.xl }}>
          <p style={{ ...AT.corpo, fontSize: '14px', color: A.tintaSuave, maxWidth: '46ch', textAlign: 'center', margin: 0 }}>
            {erro}
          </p>
        </div>
      )}

      {erro === null && mundo === null && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ ...AT.rotulo, color: A.terracota }}>Montando o globo…</span>
        </div>
      )}

      {/* Frontispício ATRÁS do canvas: Atlas ajoelhado, mãos abertas
          onde a esfera pousa. Sem lazy — o bug da Wave 10 provou que
          lazy nunca dispara em container que já está na viewport.
          Largura e posição animam na MESMA curva e duração do zoom de
          câmera (revisão 5): as mãos crescem junto com o globo. */}
      {erro === null && (
        <img
          ref={figuraRef}
          src={GRAV.src}
          alt=""
          aria-hidden="true"
          decoding="async"
          style={{
            position: 'absolute',
            left: comp.imgLeft,
            top: comp.imgTop,
            width: comp.imgW,
            height: comp.imgH,
            // sem z-index em ninguém: a ordem do DOM (figura → canvas →
            // tooltip → perfil) é a ordem de pintura, e PaisTooltip é
            // intocável nesta wave
            pointerEvents: 'none',
            opacity: 1,
            transition: animandoModo
              ? `left ${duracaoModo}ms ${AE.easing}, top ${duracaoModo}ms ${AE.easing}, width ${duracaoModo}ms ${AE.easing}, height ${duracaoModo}ms ${AE.easing}, opacity ${AE.estado} ${AE.easing}`
              : `opacity ${AE.estado} ${AE.easing}`,
          }}
        />
      )}

      {erro === null && mundo !== null && (
        <div
          style={{
            position: 'absolute',
            left: comp.canvasLeft,
            top: comp.canvasTop,
            width: canvas.w,
            height: canvas.h,
            transition: animandoModo
              ? `top ${duracaoModo}ms ${AE.easing}, left ${duracaoModo}ms ${AE.easing}`
              : 'none',
          }}
        >
          <Globe
            ref={globoRef}
            width={canvas.w}
            height={canvas.h}
            backgroundColor="rgba(0,0,0,0)"
            showAtmosphere={false}
            globeMaterial={materialRef.current}
            onGlobeReady={aoGloboPronto}
            pathsData={caminhos}
            pathPoints={pontosDoCaminho}
            pathColor={corGrade}
            pathStroke={espessuraCaminho}
            pathPointLat={latDoPonto}
            pathPointLng={lngDoPonto}
            pathPointAlt={altDoPonto}
            pathTransitionDuration={0}
            polygonsData={mundo.features}
            polygonAltitude={0.006}
            polygonCapColor={corTopo}
            polygonSideColor={corLateral}
            polygonStrokeColor={corContorno}
            polygonsTransitionDuration={0}
            onPolygonHover={aoHover}
            onPolygonClick={aoClicar}
            animateIn={false}
          />
        </div>
      )}

      <PaisTooltip alvo={alvoTooltip} areaRef={areaRef} />

      {/* Barra de ferramentas do modo imersivo (revisão 3): sair à
          esquerda, busca de país ao centro, e o espaço de ferramentas
          futuras declarado honestamente — nada finge existir. */}
      {imersivo && mundo !== null && (
        <>
          <button
            type="button"
            onClick={() => {
              setSelecionado(null);
              sairImersivoRef.current?.();
            }}
            style={{
              position: 'absolute',
              top: AS.md,
              left: AS.md,
              background: A2.cremeSuperficie,
              border: `1px solid ${A.fioSobreCreme}`,
              borderRadius: 0,
              padding: `${AS.xs} ${AS.md}`,
              cursor: 'pointer',
              ...AT.rotulo,
              fontSize: '9px',
              color: A.tintaSobreCreme,
              whiteSpace: 'nowrap',
            }}
          >
            ← Página do atlas
          </button>

          {/* Ferramentas ancoradas no CANTO (revisão 4) — o centro é do
              planeta; nada de painel atravessado por cima dele. */}
          <div
            style={{
              position: 'absolute',
              top: AS.md,
              right: AS.md,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: AS.md,
              pointerEvents: 'none',
            }}
          >
            <BuscaPais mundo={mundo} aoEscolher={aoClicar} />
            <span
              style={{
                border: `1px dashed ${A.terracota}`,
                padding: `2px ${AS.sm}`,
                ...AT.rotulo,
                fontSize: '8px',
                letterSpacing: '0.13em',
                color: A.terracota,
                whiteSpace: 'nowrap',
              }}
            >
              Mais ferramentas em produção
            </span>
          </div>
        </>
      )}

      {/* Reenquadrar: aparece quando o usuário se afastou do repouso
          pela roda (nunca durante voo dirigido nem com perfil aberto).
          Caixa de fio sobre papel — o idioma de ação do sistema. */}
      {longeDoRepouso && selecionado === null && (
        <button
          type="button"
          onClick={aoVoltar}
          style={{
            position: 'absolute',
            left: AS.md,
            bottom: AS.md,
            background: A2.cremeSuperficie,
            border: `1px solid ${A.fioSobreCreme}`,
            borderRadius: 0,
            padding: `${AS.xs} ${AS.md}`,
            cursor: 'pointer',
            ...AT.rotulo,
            fontSize: '9px',
            color: A.tintaSobreCreme,
          }}
        >
          ← Enquadrar o globo
        </button>
      )}

      {selecionado !== null && (
        <PaisPerfil
          recuarDoTopo={imersivo}
          nome={nomePaisPt(selecionado.feature.properties, selecionado.resumo?.countryName)}
          isoA3={selecionado.feature.properties.a3}
          resumo={selecionado.resumo}
          aoVoltar={aoVoltar}
        />
      )}
    </div>
  );
}

export default AtlasGlobo;
