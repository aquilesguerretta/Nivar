// Atlas da Alexandria v3 — a página.
//
// Um mapa real (Mapbox, projeção globo) com a infraestrutura elétrica do Brasil
// vinda de fonte oficial, lido em cinco capítulos: a rede, a água, as trocas,
// um dia e o mundo. As aulas apontam para cá por `?vista=<id>`.
//
// Este arquivo guarda o estado e a composição. O desenho do mapa está em
// mapa/controleDoMapa.ts; cada painel tem o seu arquivo.

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { FeatureCollection, Geometry, Position } from 'geojson';
import { useModoV3 } from '@/components/alexandria/v3/usoV3';
import {
  carregarIndice,
  carregarSerieEar,
  carregarSerieEarReservatorios,
  carregarSerieIntercambio,
  carregarSeriePerfil,
  carregarUsinasMenores,
  carregarUsinasPrincipais,
  decimal,
  type FeicaoUsina,
  inteiro,
  mesBr,
} from '@/lib/alexandria/atlas/dados';
import { carregarVistas, type VistaDoAtlas } from '@/lib/alexandria/atlas/vistas';
import {
  CATEGORIAS,
  CATEGORIAS_DO_COMBUSTIVEL,
  COMBUSTIVEL_LIGADAS,
  ROTULO_SUBSISTEMA,
  type AtivoSelecionado,
  type CamadaDoCombustivel,
  type CamadaId,
  type CapituloId,
  type IndiceDoAtlas,
  type SerieEar,
  type SerieEarReservatorios,
  type SerieIntercambio,
  type SeriePerfilHorario,
  type Subsistema,
} from '@/lib/alexandria/atlas/tipos';
import { carregarMundo, nomePaisPt, type MundoAtlas } from '@/lib/atlas/worldApi';
import { fonteDominante, type ModoCor } from '@/lib/atlas/atlasDerivacoes';
import { corDaFonteDoMundo, corNaRampaDoMundo } from '@/lib/alexandria/atlas/estilo';
import { MapaAtlas, type MapaAtlasRef } from './mapa/MapaAtlas';
import { controleParaDepuracao, type ControleDoMapa, type MedidaDasMaquetes, type RotuloMedido } from './mapa/controleDoMapa';
import { MOTIVOS_DA_ESCOLHA } from './mapa/maquetes';
import { BRASIL, REGRA_DAS_USINAS, tensaoNoZoom, type CameraAlvo, type Destaque, type EstadoDoMapa, type FatiaDoDia, type Pairado, type Troca } from './mapa/controleDoMapa';
import { PainelRede } from './paineis/PainelRede';
import { PainelAgua } from './paineis/PainelAgua';
import { PainelCombustivel } from './paineis/PainelCombustivel';
import { PainelTrocas, trocasDoMes } from './paineis/PainelTrocas';
import { PainelDia } from './paineis/PainelDia';
import { BuscaPais, PainelMundo } from './paineis/PainelMundo';
import { PainelAulas } from './paineis/PainelAulas';
import { PainelFontes } from './paineis/PainelFontes';
import { FichaDoAtivo } from './FichaDoAtivo';
import { CartaoDaVista } from './CartaoDaVista';
import { BuscaAtlas } from './BuscaAtlas';
import type { Limites } from './NestaTela';
import { PainelComercio } from './paineis/PainelComercio';
import { FichaDoComercio } from './FichaDoComercio';
import { FILTRO_INICIAL_DO_COMERCIO, cargaDoComercio, nomeDoProduto, type Comercio, type FiltroDoComercio } from '@/lib/alexandria/atlas/comercio';
import { cargaDaOperacao, lerChave, type MomentoDaOperacao, type Operacao } from '@/lib/alexandria/atlas/operacao';
import { SecaoDiaReal } from './paineis/SecaoDiaReal';
import { MetodoDoTempo, ReguaCompactaDoAno, SecaoLinhaDoTempo } from './paineis/SecaoLinhaDoTempo';
import { MetodoDosDonos, SecaoDonos } from './paineis/SecaoDonos';
import { donosDaFrota, normalizarNome, type UsinaDoDono } from '@/lib/alexandria/atlas/donos';
import { faixasDoTempo } from '@/lib/alexandria/atlas/tempo';
import { FichaDaOperacao } from './FichaDaOperacao';
import { AlternadorDoDia, FonteDoDiaReal } from './paineis/PainelDia';
import { VistasDoCapitulo } from './VistasDoCapitulo';
import { Frontispicio } from './Frontispicio';
import { nomeDeExibicao } from './nomes';
import './atlas-v3.css';

const CAPITULOS: { id: CapituloId; nome: string; resumo: string }[] = [
  { id: 'rede', nome: 'A rede', resumo: 'Onde a energia é gerada e por onde ela viaja.' },
  { id: 'agua', nome: 'A água', resumo: 'Quanto os reservatórios guardam, mês a mês, desde 2000.' },
  { id: 'combustivel', nome: 'O combustível', resumo: 'De onde vêm o gás e o óleo que as térmicas queimam.' },
  { id: 'trocas', nome: 'As trocas', resumo: 'O que cada subsistema manda e recebe dos outros.' },
  { id: 'dia', nome: 'Um dia', resumo: 'Como a geração acompanha a carga em 24 horas.' },
  { id: 'mundo', nome: 'O mundo', resumo: 'A matriz elétrica de cada país.' },
  { id: 'comercio', nome: 'O comércio', resumo: 'O que o Brasil vende e compra de energia, e por onde.' },
];

/** Câmera de abertura de "O comércio": o Atlântico no centro, o Brasil à esquerda dele, as rotas
 *  dos EUA e da China dentro do disco (medida pelo comercio na leva 4, item 5.8: Flórida a 0,55 do
 *  centro e o Cabo a 0,56 a 1440; a 390 o disco cabe na largura em z 1,15). */
const CAMERA_DO_COMERCIO = (estreito: boolean): CameraAlvo => ({ centro: estreito ? [-36, -6] : [-32, -6], zoom: estreito ? 1.15 : 1.9, exato: true });
/** Câmera de "O mundo": a composição do Titã (o Atlas segurando o mundo), com o Atlântico
 *  Norte no centro. O zoom e o padding saem da medida da tela (controle, `comporTita`). */
const CAMERA_DO_MUNDO: CameraAlvo = { tita: true, centro: [-30, 8] };
/** O botão "Globo": a composição do Titã com o globo de frente para o Brasil. */
const CAMERA_DO_TITA: CameraAlvo = { tita: true };

const CAMADAS_INICIAIS: CamadaId[] = [...CATEGORIAS, 'linhas', 'subestacoes', 'submercados', 'relevo', 'maquetes', ...COMBUSTIVEL_LIGADAS];

/** Capítulos em que a vista impõe as próprias camadas (nos outros valem as iniciais). */
const CAPITULO_COM_CAMADAS = new Set<CapituloId>(['rede', 'combustivel']);

type Painel = 'capitulo' | 'aulas' | 'fontes';

/** sessionStorage: a coluna recolhida no desktop (sim/nao). */
const CHAVE_RECOLHIDA = 'alexandria-atlas-coluna';
/** Largura da coluna aberta e do trilho recolhido (as mesmas de atlas-v3.css). */
const LARGURA_COLUNA = 372;
const LARGURA_TRILHO = 56;

const ehCapitulo = (s: string | null): s is CapituloId => !!s && CAPITULOS.some((c) => c.id === s);

/** Camadas desligadas ao abrir que um link pode ligar (?camada=distribuicao,reservatorios). */
const CAMADAS_POR_LINK: readonly CamadaId[] = ['distribuicao', 'linhas-previstas', 'reservatorios', 'bacias', 'usinas-futuras'];
const camadasDoLink = (s: string | null): CamadaId[] => (s ? CAMADAS_POR_LINK.filter((c) => s.split(',').includes(c)) : []);

const SUBS: Subsistema[] = ['SE', 'S', 'NE', 'N'];

/** A câmera no endereço: ?cam=lon,lat,zoom,inclinacao,rumo. Inválida (ou fora da faixa) = ausente. */
function lerCam(s: string | null): (CameraAlvo & { centro: [number, number]; zoom: number }) | null {
  if (!s) return null;
  const v = s.split(',').map(Number);
  if (v.length < 3 || v.slice(0, 5).some((x) => !Number.isFinite(x))) return null;
  const [lon, lat, zoom, inclinacao = 0, rumo = 0] = v;
  if (Math.abs(lon) > 180 || Math.abs(lat) > 85 || zoom < 0 || zoom > 22 || inclinacao < 0 || inclinacao > 85) return null;
  return { centro: [lon, lat], zoom, inclinacao, rumo };
}

/** ?ano=1990: um ano de quatro dígitos plausível para a linha do tempo; o resto é ausente. */
function lerAno(s: string | null): number | null {
  if (!s || !/^\d{4}$/.test(s)) return null;
  const a = Number(s);
  return a >= 1880 && a <= 2100 ? a : null;
}
/** ?dia=AAAA-MM-DD (só o formato; se o arquivo não tiver o dia, abre no último publicado). */
const lerDia = (s: string | null): string | null => (s && /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null);
/** ?hora=19 (0 a 23). */
function lerHora(s: string | null): number | null {
  if (!s || !/^\d{1,2}$/.test(s)) return null;
  const h = Number(s);
  return h <= 23 ? h : null;
}
const horaInteiraDoMomento = (m: MomentoDaOperacao | null): number | null => (m ? Math.round(m.hora) : null);

/** Os dias do arquivo da operação, em ordem (o esquema: `dias: [{ dia: 'AAAA-MM-DD', … }]`). */
function diasDe(o: Operacao | null): string[] {
  const dias = (o as { dias?: { dia?: unknown }[] } | null)?.dias;
  if (!Array.isArray(dias)) return [];
  return dias
    .map((d) => d?.dia)
    .filter((d): d is string => typeof d === 'string')
    .sort();
}
/** O ponto de uma entidade da operação (chave `u:<id>`), para a ficha não cobri-la. */
function pontoDaOperacao(o: Operacao | null, chave: string): [number, number] | null {
  const e = (o as { entidades?: { id?: string[]; lon?: (number | null)[]; lat?: (number | null)[] } } | null)?.entidades;
  if (!e?.id || !chave.startsWith('u:')) return null;
  const i = e.id.indexOf(chave.slice(2));
  const lon = i >= 0 ? e.lon?.[i] : null;
  const lat = i >= 0 ? e.lat?.[i] : null;
  return lon != null && lat != null ? [lon, lat] : null;
}

const escreverCam = (c: { centro: [number, number]; zoom: number; inclinacao: number; rumo: number }) =>
  [c.centro[0].toFixed(4), c.centro[1].toFixed(4), c.zoom.toFixed(2), Math.round(c.inclinacao), Math.round(((c.rumo % 360) + 360) % 360)].join(',');

/** O endereço desta vista: o endereço corrente com ?cam da câmera dada. */
function enderecoComCam(c: Parameters<typeof escreverCam>[0]): string {
  const u = new URL(window.location.href);
  u.searchParams.set('cam', escreverCam(c));
  // vírgula legível no endereço (é permitida na query)
  return u.toString().replace(/cam=([^&]*)/, (_, v: string) => `cam=${decodeURIComponent(v)}`);
}

/** Atalhos de teclado do Atlas (a lista do "?"). */
const ATALHOS: [string, string][] = [
  ['A', 'modo aula: painel recolhido e tela cheia (de novo, volta)'],
  ['1 a 7', 'troca de capítulo'],
  ['/', 'vai à busca'],
  ['?', 'mostra ou esconde esta lista'],
];

/** Camada do capítulo do combustível que desenha o ativo (null para os ativos da rede e da água). */
function camadaDoAtivoDoCombustivel(a: AtivoSelecionado): CamadaDoCombustivel | null {
  switch (a.tipo) {
    case 'gasoduto':
      return 'gasodutos';
    case 'instalacao':
      return a.props.tipo === 'refinaria' ? 'refinarias' : a.props.tipo === 'gnl' ? 'gnl' : a.props.tipo === 'upgn' ? 'upgn' : 'terminais';
    case 'campo':
      return 'campos';
    case 'bloco':
      return 'blocos';
    case 'bacia-sedimentar':
      return 'bacias-sedimentares';
    case 'presal':
      return 'presal';
    default:
      return null;
  }
}

/** Teto das escalas contínuas do mundo: renovável em % e intensidade em gCO₂/kWh.
 *  São os mesmos tetos que a legenda do painel usa (PainelMundo.tsx). */
export const TETO_DO_MUNDO = { renovavel: 100, intensidade: 1000 } as const;

/** Põe o foco num elemento qualquer (título incluído) sem rolar a página. */
function focar(el: Element | null | undefined): boolean {
  if (!(el instanceof HTMLElement) || !el.isConnected || el.closest('[inert]')) return false;
  if (!el.matches('a[href], button, input, select, textarea, [tabindex]')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
  return document.activeElement === el;
}

/** A dica do ponteiro guarda o próprio estado: o hover não re-renderiza o Atlas. */
interface AlcaDaDica {
  mostrar: (p: Pairado | null) => void;
}

function DicaDoMapa({ alca, ativa }: { alca: { current: AlcaDaDica | null }; ativa: boolean }) {
  const [p, setP] = useState<Pairado | null>(null);
  useEffect(() => {
    alca.current = { mostrar: setP };
    return () => {
      alca.current = null;
    };
  }, [alca]);
  if (!p || !ativa) return null;
  return (
    <div className="atl-dica" style={{ left: p.x + 14, top: p.y + 14 }} role="status">
      <strong>{p.titulo}</strong>
      {p.detalhe && <span>{p.detalhe}</span>}
    </div>
  );
}

function usarMovimentoReduzido(): boolean {
  const [reduzido, setReduzido] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const ouvir = () => setReduzido(mq.matches);
    mq.addEventListener('change', ouvir);
    return () => mq.removeEventListener('change', ouvir);
  }, []);
  return reduzido;
}

function usarJanela(): { largura: number; altura: number } {
  const [j, setJ] = useState(() => (typeof window === 'undefined' ? { largura: 1440, altura: 900 } : { largura: window.innerWidth, altura: window.innerHeight }));
  useEffect(() => {
    const ouvir = () => setJ({ largura: window.innerWidth, altura: window.innerHeight });
    window.addEventListener('resize', ouvir);
    return () => window.removeEventListener('resize', ouvir);
  }, []);
  return j;
}

/** Medidas que o harness de verificação lê (FPS, tempo de carga). */
declare global {
  interface Window {
    __atlas?: {
      msAtePronto: number | null;
      fps: () => Promise<number>;
      /** FPS medido enquanto a câmera se move (gira 40° em 2 s) */
      fpsEmMovimento: () => Promise<number>;
      desenhadas: () => Record<string, number>;
      /** leva a câmera a um enquadramento, sem animação (só para a verificação) */
      ir: (c: CameraAlvo) => void;
      zoom: number;
      capitulo: string;
      vista: string | null;
      // ── medição da colocação das maquetes (só em desenvolvimento) ──
      /** maquetes desenhadas agora: caixa medida na geometria desenhada, pé projetado */
      maquetes?: () => MedidaDasMaquetes;
      /** rótulos colocados agora (caixa de colisão do Mapbox menos o text-padding) */
      rotulos?: (camadas?: readonly string[]) => RotuloMedido[];
      /** desloca dx px (panBy) ou dzoom níveis, sem animação; espera o moveend + 300 ms e
       *  compara os ids desenhados, restritos ao que está na tela nas duas posições */
      estabilidade?: (dx: number, dzoom?: number) => Promise<{ antes: string[]; depois: string[]; jaccard: number }>;
      /** liga ou desliga a camada 3D (A/B de FPS); não mexe na escolha */
      maquetesLigadas?: (ligar: boolean) => void;
      /** FPS medido num voo de +1 nível de zoom em 2 s */
      fpsEmZoom?: () => Promise<number>;
      /** ms médios de `vezes` execuções da escolha + entrega no enquadramento corrente */
      msDaEscolha?: (vezes?: number) => number;
      /** quadros desenhados em `ms` (com o mapa parado, 0 = ocioso) */
      contarRepaints?: (ms: number) => Promise<number>;
      /** papéis 2D no render: membros no disco, vencedores sem símbolo 2D, âncoras, rótulos de usina */
      papeis?: () => ReturnType<ControleDoMapa['depurarPapeis']>;
      /** feições desenhadas agora numa camada do mapa */
      motivos?: () => Record<string, string>;
      distribuicao?: () => { msDeCarga: number | null; camadas: Record<string, string> };
      naCamada?: (camada: string) => { id: string | number | null; props: Record<string, unknown> }[];
    };
  }
}

export default function AtlasV3() {
  const [modo] = useModoV3ComEvento();
  const reduzido = usarMovimentoReduzido();
  const { largura, altura } = usarJanela();
  const estreito = largura <= 860;
  const [params, setParams] = useSearchParams();
  const mapa = useRef<MapaAtlasRef | null>(null);

  const vistaId = params.get('vista');
  const capituloUrl = params.get('c');

  const [capitulo, setCapitulo] = useState<CapituloId>(ehCapitulo(capituloUrl) ? capituloUrl : 'rede');
  // ?camada=distribuicao (lista separada por vírgula) liga camadas que começam desligadas
  const [camadas, setCamadas] = useState<ReadonlySet<CamadaId>>(() => new Set([...CAMADAS_INICIAIS, ...camadasDoLink(params.get('camada'))]));
  const [selecionado, setSelecionado] = useState<AtivoSelecionado | null>(null);
  const dica = useRef<AlcaDaDica | null>(null);
  const aoPairar = useCallback((p: Pairado | null) => dica.current?.mostrar(p), []);
  const [camera, setCamera] = useState({ zoom: 3.2, centro: [-52, -12] as [number, number], inclinacao: 0, rumo: 0 });
  // a caixa da tela no último assentar da câmera ("Nesta tela")
  const [limites, setLimites] = useState<Limites | null>(null);
  const [areaLivre, setAreaLivre] = useState<[number, number][] | null>(null);
  // ?cam= lido uma vez, na abertura: vale sobre o pouso padrão e sobre a câmera da vista
  const camDaAbertura = useRef(lerCam(params.get('cam')));
  const vistaDaAbertura = useRef(params.get('vista'));
  const cameraRef = useRef(camera);
  const [painel, setPainel] = useState<Painel>('capitulo');
  // celular: a gaveta tem três alturas (crítica do celular, achados 1 e 2). Fechada, sobra o
  // puxador (e a linha do estado ativo); na MEIA altura (~40% da tela) o mapa fica à vista em
  // cima e o painel embaixo: é para onde ela vai quando o leitor mexe num controle que muda o
  // mapa; aberta, o painel inteiro.
  const [gaveta, setGaveta] = useState<'fechada' | 'meia' | 'aberta'>('fechada');
  const gavetaAberta = gaveta !== 'fechada';
  const [erro, setErro] = useState<string | null>(null);
  const [pronto, setPronto] = useState<number | null>(null);
  const [destaqueDaBusca, setDestaqueDaBusca] = useState<Destaque | null>(null);

  // coluna retrátil no desktop: o estado vale para a sessão do leitor
  const [recolhida, setRecolhida] = useState<boolean>(() => {
    try {
      return window.sessionStorage.getItem(CHAVE_RECOLHIDA) === 'sim';
    } catch {
      return false;
    }
  });
  const colunaRecolhida = recolhida && !estreito;
  const recolhedor = useRef<HTMLButtonElement | null>(null);
  const abridorDaColuna = useRef<HTMLButtonElement | null>(null);
  const focoAposAlternar = useRef<'abrir' | 'recolher' | null>(null);
  const alternarColuna = useCallback((recolher: boolean) => {
    setRecolhida(recolher);
    focoAposAlternar.current = recolher ? 'abrir' : 'recolher';
    try {
      window.sessionStorage.setItem(CHAVE_RECOLHIDA, recolher ? 'sim' : 'nao');
    } catch {
      /* sem armazenamento: vale só nesta página */
    }
  }, []);
  // quem recolheu fica com o foco no botão de abrir, e vice-versa
  useEffect(() => {
    const alvo = focoAposAlternar.current;
    if (!alvo) return;
    focoAposAlternar.current = null;
    (alvo === 'abrir' ? abridorDaColuna.current : recolhedor.current)?.focus({ preventScroll: true });
  }, [colunaRecolhida]);

  // celular: Brasil, Inclinar e Satélite numa folha que abre do botão "Mapa"
  const [folhaDaVista, setFolhaDaVista] = useState(false);
  const idFolha = useId();

  // troca de capítulo ou de painel (fontes, aulas): a coluna volta ao topo, onde está a manchete
  useEffect(() => {
    document.querySelector<HTMLElement>('.atl-coluna-rolagem')?.scrollTo({ top: 0 });
  }, [capitulo, painel]);

  // celular: a altura do palco (a meia gaveta é 40% dela; é também a margem de baixo da câmera)
  const [alturaDoPalco, setAlturaDoPalco] = useState(0);
  // o último controle que o leitor tocou dentro da gaveta: na meia altura ele é rolado para a
  // faixa visível (quem arrastou a régua continua vendo a régua)
  const tocadoNaGaveta = useRef<HTMLElement | null>(null);
  // a troca de capítulo voa a câmera: a subida da gaveta espera esse voo assentar para deslocar
  // (sem isso, o deslocamento partia da câmera do capítulo anterior e desfazia o voo)
  const vooDoCapitulo = useRef(false);
  // leva 5: o número do pedido de câmera que a subida espera assentar (null: nenhuma espera); um
  // pedido mais novo (link, vista, ir(), gesto) a cancela, em vez de levar o centro velho por cima
  const subirDepoisDoVoo = useRef<number | null>(null);

  // celular: o índice de capítulos é uma fileira rolável; o capítulo corrente fica à vista
  useEffect(() => {
    if (!estreito || !gavetaAberta) return;
    const lista = document.querySelector<HTMLElement>('.atl-estreito .atl-capitulos-lista');
    const ativo = lista?.querySelector<HTMLElement>('.atl-capitulo.ativo');
    if (lista && ativo) lista.scrollLeft = Math.max(0, ativo.offsetLeft - (lista.clientWidth - ativo.offsetWidth) / 2);
  }, [estreito, gavetaAberta, capitulo]);

  // tempo
  const [mesIdx, setMesIdx] = useState<number | null>(null);
  const [tocando, setTocando] = useState(false);
  const [mesPerfil, setMesPerfil] = useState<number | null>(null);
  const [hora, setHora] = useState(12);
  const [modoMundo, setModoMundo] = useState<ModoCor>('matriz');

  // dados
  const [indice, setIndice] = useState<IndiceDoAtlas | null>(null);
  const [ear, setEar] = useState<SerieEar | null>(null);
  const [earRes, setEarRes] = useState<SerieEarReservatorios | null>(null);
  const [intercambio, setIntercambio] = useState<SerieIntercambio | null>(null);
  const [perfil, setPerfil] = useState<SeriePerfilHorario | null>(null);
  const [mundo, setMundo] = useState<MundoAtlas | null>(null);
  const [erroMundo, setErroMundo] = useState<string | null>(null);
  const [vistas, setVistas] = useState<VistaDoAtlas[] | null>(null);
  // "O comércio": o arquivo (o mesmo cache que a camada do mapa usa) e o filtro do painel
  const [comercio, setComercio] = useState<Comercio | null>(null);
  const [erroComercio, setErroComercio] = useState<string | null>(null);
  const [filtroComercio, setFiltroComercio] = useState<FiltroDoComercio>(FILTRO_INICIAL_DO_COMERCIO);

  // "A rede" (leva 3, B1 e B2): o ano da linha do tempo (null = hoje, tudo) e o dono destacado.
  // ?ano=1990 e ?dono=<chave> abrem com eles (as cenas do plano de captura usam isso)
  const [anoLimite, setAnoLimite] = useState<number | null>(() => lerAno(params.get('ano')));
  const [anoArrastando, setAnoArrastando] = useState(false);
  // o "percorrer" da régua do ano também usa o filtro barato do controle (recado do tempo-e-donos)
  const [tocandoAno, setTocandoAno] = useState(false);
  // ?dono= chega normalizado pela mesma regra da lista (codigo.md 18): um link digitado à mão
  // com caixa ou acento diferentes ainda acha o dono; um dono que não existe cai abaixo
  const [donoDestacado, setDonoDestacado] = useState<string | null>(() => {
    const d = params.get('dono');
    return d ? normalizarNome(d) || null : null;
  });
  // as usinas para a linha do tempo e os donos: o mesmo cache de dados.ts que o mapa e "Nesta
  // tela" usam (nada baixa duas vezes); as menores (2,7 MB) só depois do mapa pronto
  const [usinasPrincipais, setUsinasPrincipais] = useState<FeicaoUsina[] | null>(null);
  const [usinasMenores, setUsinasMenores] = useState<FeicaoUsina[] | null>(null);
  // codigo.md 20: o erro de cada arquivo fica guardado (antes era engolido e as seções diziam o contrário)
  const [erroPrincipais, setErroPrincipais] = useState(false);
  const [erroMenores, setErroMenores] = useState(false);

  // "Um dia" (leva 3, B3): média do mês (o de sempre) ou um dia real da operação. `momento` é
  // null no modo médio; no real, o dia e a hora. ?dia=AAAA-MM-DD&hora=19 abre no dia real.
  const [modoDoDia, setModoDoDia] = useState<'medio' | 'real'>(() => (lerDia(params.get('dia')) ? 'real' : 'medio'));
  const [momento, setMomento] = useState<MomentoDaOperacao | null>(() => {
    const d = lerDia(params.get('dia'));
    return d ? { dia: d, hora: lerHora(params.get('hora')) ?? 12 } : null;
  });
  const [operacao, setOperacao] = useState<Operacao | null>(null);
  const [erroOperacao, setErroOperacao] = useState<string | null>(null);

  useEffect(() => {
    carregarIndice().then(setIndice, () => setErro('Não foi possível carregar o índice de dados do Atlas.'));
    carregarVistas().then(setVistas, () => setVistas([]));
  }, []);

  // cada capítulo busca só o que usa
  useEffect(() => {
    if (capitulo === 'agua') {
      if (!ear) carregarSerieEar().then(setEar, () => setErro('Não foi possível carregar a série de energia armazenada.'));
      if (!earRes) carregarSerieEarReservatorios().then(setEarRes, () => undefined);
    }
    if (capitulo === 'trocas' && !intercambio) carregarSerieIntercambio().then(setIntercambio, () => setErro('Não foi possível carregar a série de intercâmbio.'));
    if (capitulo === 'dia' && !perfil) carregarSeriePerfil().then(setPerfil, () => setErro('Não foi possível carregar o perfil horário.'));
    // o comércio também lê os países do mundo: o tom leve dos parceiros usa a mesma fonte
    if ((capitulo === 'mundo' || capitulo === 'comercio') && !mundo && !erroMundo)
      carregarMundo().then(setMundo, () => setErroMundo('O perfil dos países não respondeu agora. O globo segue navegável; os números por país ficam indisponíveis até a próxima tentativa.'));
    if (capitulo === 'comercio' && !comercio && !erroComercio)
      cargaDoComercio().then(setComercio, () => setErroComercio('O arquivo do comércio exterior não respondeu agora. O globo segue navegável; as rotas e os números voltam na próxima tentativa.'));
    // o dia real só é buscado quando o leitor o escolhe (a camada do pulso usa o mesmo cache)
    if (capitulo === 'dia' && modoDoDia === 'real' && !operacao && !erroOperacao)
      cargaDaOperacao().then(setOperacao, () => setErroOperacao('O arquivo da operação hora a hora não respondeu agora. A média do mês segue disponível; o dia real volta na próxima tentativa.'));
  }, [capitulo, ear, earRes, intercambio, perfil, mundo, erroMundo, comercio, erroComercio, modoDoDia, operacao, erroOperacao]);

  useEffect(() => {
    if (capitulo !== 'rede') return;
    let vivo = true;
    if (!usinasPrincipais && !erroPrincipais) carregarUsinasPrincipais().then((u) => vivo && setUsinasPrincipais(u), () => vivo && setErroPrincipais(true));
    // as menores (2021–2022 é quase só solar pequena) também: sem elas a linha do tempo é parcial;
    // esperam o mapa pronto para não disputar a abertura
    if (!usinasMenores && !erroMenores && pronto != null) carregarUsinasMenores().then((u) => vivo && setUsinasMenores(u), () => vivo && setErroMenores(true));
    return () => {
      vivo = false;
    };
  }, [capitulo, usinasPrincipais, usinasMenores, pronto, erroPrincipais, erroMenores]);
  // as seções só recebem as menores junto com as principais (sem as principais, nada de conta parcial)
  const usinasDaFrota = useMemo(() => (usinasPrincipais ? [usinasPrincipais, usinasMenores].filter((x): x is FeicaoUsina[] => !!x) : []), [usinasPrincipais, usinasMenores]);
  const situacaoDasUsinas = useMemo(
    () => ({
      principais: usinasPrincipais ? ('ok' as const) : erroPrincipais ? ('erro' as const) : ('carregando' as const),
      menores: usinasMenores ? ('ok' as const) : erroMenores ? ('erro' as const) : ('carregando' as const),
    }),
    [usinasPrincipais, usinasMenores, erroPrincipais, erroMenores],
  );
  // codigo.md 21: ?ano fora do intervalo do cadastro é limitado a ele: antes do primeiro ano vai
  // ao primeiro; depois do último, é "hoje" (o último ano é ano de verdade: deixa de fora as sem ano)
  useEffect(() => {
    if (anoLimite == null || !usinasPrincipais) return;
    const t = faixasDoTempo(usinasDaFrota);
    if (anoLimite > t.ultimoAno) setAnoLimite(null);
    else if (anoLimite < t.primeiroAno) setAnoLimite(t.primeiroAno);
  }, [anoLimite, usinasPrincipais, usinasDaFrota]);
  // codigo.md 18: dono que não existe na frota (link à mão, chave de outra versão) cai, e o
  // efeito do endereço tira o ?dono. Só decide com os dois arquivos (ou com o das menores em erro)
  useEffect(() => {
    if (!donoDestacado || !usinasPrincipais || (!usinasMenores && !erroMenores)) return;
    if (!donosDaFrota(usinasDaFrota).some((d) => d.chave === donoDestacado)) setDonoDestacado(null);
  }, [donoDestacado, usinasPrincipais, usinasMenores, erroMenores, usinasDaFrota]);

  // dia real escolhido e o arquivo chegou: sem dia ainda (ou com um dia que o arquivo não tem),
  // abre no último dia publicado, na hora que o leitor já olhava
  const diasDaOperacao = useMemo(() => diasDe(operacao), [operacao]);
  useEffect(() => {
    if (modoDoDia !== 'real' || !diasDaOperacao.length) return;
    if (momento && diasDaOperacao.includes(momento.dia)) return;
    setMomento({ dia: diasDaOperacao[diasDaOperacao.length - 1], hora: momento?.hora ?? hora });
  }, [modoDoDia, diasDaOperacao, momento, hora]);
  // o momento que o mapa recebe: só no capítulo e no modo real
  const momentoNoMapa = capitulo === 'dia' && modoDoDia === 'real' ? momento : null;
  const mudarModoDoDia = useCallback(
    (m: 'medio' | 'real') => {
      setModoDoDia(m);
      if (m === 'medio') {
        // a hora inteira mais próxima volta ao dia médio; a seleção da operação cai
        if (momento) setHora(Math.max(0, Math.min(23, Math.round(momento.hora))));
        setMomento(null);
        setSelecionado((s) => (s?.tipo === 'operacao' ? null : s));
      } else setMomento((x) => x ?? (diasDaOperacao.length ? { dia: diasDaOperacao[diasDaOperacao.length - 1], hora } : null));
    },
    [momento, diasDaOperacao, hora],
  );
  // a seção do dia real devolve null para "voltar ao dia médio"
  const mudarMomento = useCallback((m: MomentoDaOperacao | null) => (m ? setMomento(m) : mudarModoDoDia('medio')), [mudarModoDoDia]);

  const meses = capitulo === 'trocas' ? intercambio?.meses : ear?.meses;
  const mesCorrente = meses && meses.length ? (mesIdx == null ? meses.length - 1 : Math.min(mesIdx, meses.length - 1)) : 0;
  const perfilCorrente = perfil ? (mesPerfil == null ? perfil.meses.length - 1 : Math.min(mesPerfil, perfil.meses.length - 1)) : 0;

  // reprodução da linha do tempo
  useEffect(() => {
    if (!tocando || !meses?.length || reduzido) return;
    const t = window.setInterval(() => {
      setMesIdx((i) => {
        const atual = i == null ? meses.length - 1 : i;
        if (atual >= meses.length - 1) {
          setTocando(false);
          return atual;
        }
        return atual + 1;
      });
    }, 110);
    return () => window.clearInterval(t);
  }, [tocando, meses, reduzido]);

  // ── vista ativa ────────────────────────────────────────────────────
  const vista = useMemo(() => (vistaId && vistas ? (vistas.find((v) => v.id === vistaId) ?? null) : null), [vistaId, vistas]);
  const vistaInexistente = !!vistaId && vistas !== null && !vista;
  const vistaAplicada = useRef<string | null>(null);
  // as camadas de antes da primeira vista: voltam quando o leitor sai dela
  const camadasRef = useRef(camadas);
  camadasRef.current = camadas;
  const camadasAntesDaVista = useRef<ReadonlySet<CamadaId> | null>(null);

  // achado 9: a câmera da vista (centro e zoom) foi composta para a tela larga; no celular o
  // assunto a 300 px do centro caía fora da borda. Lá ela recua meio zoom (os limites já se
  // adaptam sozinhos ao tamanho da tela)
  const cameraDaVista = useCallback((v: VistaDoAtlas): CameraAlvo => {
    const c: CameraAlvo = { ...v.camera };
    if (!c.limites && c.zoom != null && typeof window !== 'undefined' && window.innerWidth < 700) c.zoom -= 0.5;
    return c;
  }, []);

  useEffect(() => {
    if (!vista || vistaAplicada.current === vista.id) return;
    vistaAplicada.current = vista.id;
    camadasAntesDaVista.current ??= camadasRef.current;
    setCapitulo(vista.capitulo);
    setSelecionado(null);
    setDestaqueDaBusca(null);
    setPainel('capitulo');
    setTocando(false);
    setGaveta('fechada');
    const novas = new Set<CamadaId>(CAPITULO_COM_CAMADAS.has(vista.capitulo) ? vista.camadas : CAMADAS_INICIAIS);
    novas.add('relevo');
    novas.add('maquetes');
    if (vista.satelite) novas.add('satelite');
    setCamadas(novas);
    // endereço copiado de dentro de uma vista: a câmera dele vence a da vista, uma vez
    const cam = vista.id === vistaDaAbertura.current ? camDaAbertura.current : null;
    camDaAbertura.current = null;
    mapa.current?.relevo3d(cam ? cam.inclinacao != null && cam.inclinacao > 20 : !!vista.camera.inclinacao && vista.camera.inclinacao > 20);
    if (!cam) mapa.current?.voarPara(cameraDaVista(vista));
  }, [vista, cameraDaVista]);

  // o momento da vista só pode ser aplicado quando a série daquele capítulo chegou
  const momentoAplicado = useRef<string | null>(null);
  useEffect(() => {
    if (vista?.capitulo !== 'dia' || !vista.momento || !perfil) return;
    const chave = `${vista.id}@dia`;
    if (momentoAplicado.current === chave) return;
    const i = perfil.meses.indexOf(vista.momento);
    // mês que já saiu da janela de doze meses: fica o último, e o cartão avisa
    if (i >= 0) setMesPerfil(i);
    momentoAplicado.current = chave;
  }, [vista, perfil]);
  useEffect(() => {
    if (!vista?.momento || vista.capitulo === 'dia' || !meses?.length) return;
    const chave = `${vista.id}@${vista.capitulo}`;
    if (momentoAplicado.current === chave) return;
    const i = meses.indexOf(vista.momento);
    if (i >= 0) {
      momentoAplicado.current = chave;
      setMesIdx(i);
    }
  }, [vista, meses]);

  // Sair da vista — pelo botão do cartão, pelo menu de capítulos ou pelo Voltar
  // do navegador — desfaz o que ela ligou: relevo 3D, satélite e o conjunto de
  // camadas que ela impôs. Fica num efeito porque o Voltar não passa por handler.
  const vistaAnterior = useRef<VistaDoAtlas | null>(null);
  useEffect(() => {
    if (vista) {
      vistaAnterior.current = vista;
      return;
    }
    if (!vistaAnterior.current) return; // carga inicial, ou as vistas ainda não chegaram
    vistaAnterior.current = null;
    vistaAplicada.current = null;
    momentoAplicado.current = null;
    mapa.current?.relevo3d(false);
    const antes = camadasAntesDaVista.current;
    camadasAntesDaVista.current = null;
    setCamadas((c) => {
      if (antes) return antes;
      if (!c.has('satelite')) return c;
      const n = new Set(c);
      n.delete('satelite');
      return n;
    });
  }, [vista]);

  const fecharVista = useCallback(() => {
    vistaAplicada.current = null;
    momentoAplicado.current = null;
    const novo = new URLSearchParams(params);
    novo.delete('vista');
    setParams(novo, { replace: false });
  }, [params, setParams]);

  const abrirVista = useCallback(
    (id: string) => {
      const novo = new URLSearchParams(params);
      novo.set('vista', id);
      novo.delete('c');
      setParams(novo, { replace: false });
      setGaveta('fechada');
    },
    [params, setParams],
  );

  const trocarCapitulo = useCallback(
    (c: CapituloId) => {
      setCapitulo(c);
      setPainel('capitulo');
      setSelecionado(null);
      setDestaqueDaBusca(null);
      setTocando(false);
      vistaAplicada.current = null;
      momentoAplicado.current = null;
      const novo = new URLSearchParams(params);
      novo.delete('vista');
      if (c === 'rede') novo.delete('c');
      else novo.set('c', c);
      setParams(novo, { replace: true });
      mapa.current?.relevo3d(false);
      vooDoCapitulo.current = c === 'mundo' || c === 'comercio' || capitulo === 'mundo' || capitulo === 'comercio' || !!vista;
      if (c === 'mundo') mapa.current?.voarPara(CAMERA_DO_MUNDO);
      else if (c === 'comercio') mapa.current?.voarPara(CAMERA_DO_COMERCIO(estreito));
      else if (capitulo === 'mundo' || capitulo === 'comercio' || vista) mapa.current?.voarPara({ limites: BRASIL });
    },
    [params, setParams, capitulo, vista, estreito],
  );

  // ── a gaveta do celular segue o que muda no mapa ────────────────────
  // Com a gaveta aberta, o leitor mexeu num controle que muda o mapa (régua do ano ou do mês,
  // dono, fonte, camada, sentido do comércio, hora, capítulo): ela desce à MEIA altura e o mapa
  // aparece em cima (crítica do celular, achado 1). A conta é pelo estado, não por controle: o
  // que mudar o desenho, venha de onde vier, leva à meia altura.
  const mudancaNoMapa = [anoLimite, donoDestacado, filtroComercio, momento?.dia, horaInteiraDoMomento(momento), modoDoDia, mesIdx, hora, mesPerfil, modoMundo, camadas, capitulo];
  const mudancaAnterior = useRef<unknown[] | null>(null);
  useEffect(() => {
    const antes = mudancaAnterior.current;
    mudancaAnterior.current = mudancaNoMapa;
    if (!antes || !estreito || gaveta !== 'aberta') return;
    if (antes.every((v, i) => Object.is(v, mudancaNoMapa[i]))) return;
    // funcional: quem fechou a gaveta no mesmo instante (a vista da aula, a seleção) vence
    setGaveta((g) => (g === 'aberta' ? 'meia' : g));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, mudancaNoMapa);
  // na meia altura, o controle tocado vai para a faixa visível do painel, depois que a altura
  // nova assentou (a transição da gaveta é de 650 ms; no movimento reduzido, nenhuma)
  useEffect(() => {
    if (!estreito || gaveta !== 'meia') return;
    const t = window.setTimeout(() => {
      const rol = document.querySelector<HTMLElement>('.atl-estreito .atl-coluna-rolagem');
      const el = tocadoNaGaveta.current;
      if (!rol || !el || !el.isConnected || !rol.contains(el)) return;
      const r = rol.getBoundingClientRect();
      const q = el.getBoundingClientRect();
      // folga para a legenda que mora sob o controle (os anos sob a régua, por exemplo)
      const folga = 36;
      if (q.bottom > r.bottom - folga) rol.scrollTop += Math.min(q.bottom - (r.bottom - folga), q.top - r.top - folga);
      else if (q.top < r.top + folga) rol.scrollTop -= r.top + folga - q.top;
    }, reduzido ? 30 : 700);
    return () => window.clearTimeout(t);
  }, [estreito, gaveta, reduzido]);

  // ── estado do mapa ─────────────────────────────────────────────────
  const earSubsistema = useMemo(() => {
    if (capitulo !== 'agua' || !ear) return null;
    return { SE: ear.SE[mesCorrente], S: ear.S[mesCorrente], NE: ear.NE[mesCorrente], N: ear.N[mesCorrente] };
  }, [capitulo, ear, mesCorrente]);

  const earReservatorio = useMemo(() => {
    if (capitulo !== 'agua' || !earRes) return null;
    const o: Record<string, number | null> = {};
    for (const [cod, r] of Object.entries(earRes.reservatorios)) o[cod] = r.pct[mesCorrente] ?? null;
    return o;
  }, [capitulo, earRes, mesCorrente]);

  const trocas: Troca[] | null = useMemo(() => (capitulo === 'trocas' && intercambio ? trocasDoMes(intercambio, mesCorrente) : null), [capitulo, intercambio, mesCorrente]);

  const dia: FatiaDoDia[] | null = useMemo(() => {
    if (capitulo !== 'dia' || !perfil) return null;
    return (['SE', 'S', 'NE', 'N'] as Subsistema[]).map((sub) => {
      const s = perfil.sub[sub];
      const v = (k: 'hidro' | 'termica' | 'eolica' | 'solar' | 'carga') => s[k][perfilCorrente]?.[hora] ?? 0;
      return { sub, hidro: v('hidro'), termica: v('termica'), eolica: v('eolica'), solar: v('solar'), carga: v('carga') };
    });
  }, [capitulo, perfil, perfilCorrente, hora]);

  // régua fixa dos discos do capítulo "dia": o maior valor do mês exibido, nas
  // 24 horas e nos quatro subsistemas, entre a geração somada e a carga
  const tetoDoDia = useMemo(() => {
    if (capitulo !== 'dia' || !perfil) return undefined;
    let teto = 0;
    for (const sub of SUBS) {
      const s = perfil.sub[sub];
      for (let h = 0; h < 24; h++) {
        const ger = (['hidro', 'termica', 'eolica', 'solar'] as const).reduce((a, k) => a + Math.max(0, s[k][perfilCorrente]?.[h] ?? 0), 0);
        const carga = s.carga[perfilCorrente]?.[h] ?? 0;
        teto = Math.max(teto, ger, carga);
      }
    }
    return teto > 0 ? teto : undefined;
  }, [capitulo, perfil, perfilCorrente]);

  // ── o que o leitor de tela ouve ────────────────────────────────────
  // Um único status, fora do painel: a troca de capítulo e, fora da reprodução,
  // o resumo do instante (mês, ou hora) com os quatro subsistemas.
  const resumoDoInstante = useMemo(() => {
    if (painel !== 'capitulo') return null;
    if (capitulo === 'agua' && ear?.meses.length) {
      const valores = SUBS.map((s) => `${ROTULO_SUBSISTEMA[s]} ${ear[s][mesCorrente] == null ? 'sem dado na fonte' : `${decimal(ear[s][mesCorrente])}%`}`);
      return `${mesBr(ear.meses[mesCorrente])}, energia armazenada: ${valores.join('; ')}.`;
    }
    if (capitulo === 'trocas' && intercambio?.meses.length && trocas) {
      const elos = trocas.map((t) => `${ROTULO_SUBSISTEMA[t.de]} para ${ROTULO_SUBSISTEMA[t.para]}, ${inteiro(t.mw)} MW médios`);
      return `${mesBr(intercambio.meses[mesCorrente])}, trocas: ${elos.length ? elos.join('; ') : 'nenhum fluxo líquido na fonte'}.`;
    }
    if (capitulo === 'dia' && modoDoDia === 'medio' && perfil?.meses.length) {
      const subs = SUBS.map((sub) => {
        const s = perfil.sub[sub];
        const partes = (['hidro', 'termica', 'eolica', 'solar'] as const).map((k) => s[k][perfilCorrente]?.[hora]);
        const ger = partes.every((v) => v == null) ? null : partes.reduce<number>((a, v) => a + Math.max(0, v ?? 0), 0);
        return `${ROTULO_SUBSISTEMA[sub]} gera ${inteiro(ger)}, consome ${inteiro(s.carga[perfilCorrente]?.[hora])}`;
      });
      return `${String(hora).padStart(2, '0')}h, ${mesBr(perfil.meses[perfilCorrente])}, em MW: ${subs.join('; ')}.`;
    }
    return null;
  }, [painel, capitulo, ear, intercambio, trocas, perfil, mesCorrente, perfilCorrente, hora, modoDoDia]);

  const [anuncio, setAnuncio] = useState('');
  const painelAnterior = useRef<string | null>(null);
  useEffect(() => {
    const chave = painel === 'capitulo' ? capitulo : painel;
    if (painelAnterior.current == null) {
      painelAnterior.current = chave; // na carga, nada é dito
      return;
    }
    if (painelAnterior.current === chave) return;
    painelAnterior.current = chave;
    setAnuncio(painel === 'aulas' ? 'Nas aulas' : painel === 'fontes' ? 'Fontes, datas e licenças' : `Capítulo: ${CAPITULOS.find((c) => c.id === capitulo)?.nome ?? ''}`);
  }, [painel, capitulo]);

  const resumoAnterior = useRef<{ chave: string; texto: string | null; tocando: boolean } | null>(null);
  useEffect(() => {
    const chave = `${painel}:${capitulo}`;
    const ant = resumoAnterior.current;
    resumoAnterior.current = { chave, texto: resumoDoInstante, tocando };
    // nunca durante a reprodução; nem quando o capítulo acabou de abrir ou o dado acabou de chegar
    if (tocando || !resumoDoInstante || !ant || ant.chave !== chave || ant.texto == null) return;
    if (ant.texto === resumoDoInstante && !ant.tocando) return;
    // com folga: seta segurada na régua não vira enxurrada
    const t = window.setTimeout(() => setAnuncio(resumoDoInstante), 600);
    return () => window.clearTimeout(t);
  }, [resumoDoInstante, painel, capitulo, tocando]);

  // o nome em português entra na feição: é o que o hover do mapa mostra
  const paises: FeatureCollection | null = useMemo(
    () =>
      mundo
        ? {
            type: 'FeatureCollection',
            features: mundo.features.map((f) => ({
              ...f,
              geometry: semSaltoNoAntimeridiano(f.geometry),
              properties: { ...f.properties, nomePt: nomePaisPt(f.properties, f.properties.a3 ? mundo.porIso.get(f.properties.a3)?.countryName : undefined) },
            })),
          }
        : null,
    [mundo],
  );
  const coresDoMundo = useMemo(() => {
    if (!mundo) return null;
    const o: Record<string, string> = {};
    // as mesmas cores da legenda do painel, no modo corrente (claro ou noturno)
    const fontes = corDaFonteDoMundo(modo);
    for (const f of mundo.features) {
      const a3 = f.properties.a3;
      if (!a3) continue;
      const p = mundo.porIso.get(a3);
      if (!p) continue; // sem perfil: fica sem cor (ausência, não zero)
      if (modoMundo === 'matriz') {
        const dom = fonteDominante(p.fuelMix);
        if (dom) o[a3] = fontes[dom.chave];
      } else if (modoMundo === 'renovavel') {
        if (p.renewablesShareElecPct != null) o[a3] = corNaRampaDoMundo(modo, 'renovavel', p.renewablesShareElecPct / TETO_DO_MUNDO.renovavel);
      } else if (modoMundo === 'intensidade') {
        if (p.carbonIntensityElecGco2PerKwh != null) o[a3] = corNaRampaDoMundo(modo, 'intensidade', p.carbonIntensityElecGco2PerKwh / TETO_DO_MUNDO.intensidade);
      }
    }
    return o;
  }, [mundo, modoMundo, modo]);

  const destaque: Destaque | null = useMemo(() => {
    if (vista) {
      const d = vista.destaque;
      return { usinas: d.usinas, linhas: d.linhas, subestacoes: d.subestacoes, reservatorios: d.reservatorios, submercados: d.submercados, bacias: d.bacias, paises: d.paises, combustivel: d.combustivel, deVista: true };
    }
    return destaqueDaBusca;
  }, [vista, destaqueDaBusca]);

  // O enquadramento desconta o que os painéis cobrem: no celular, a busca e os
  // controles em cima e a gaveta (ou o cartão da vista, ou a ficha) embaixo; no
  // desktop, a ficha à direita e o cartão da vista no canto inferior esquerdo.
  const temCartao = !!vista || !!selecionado;
  // a linha do estado no pé da gaveta fechada (o ano, o dono, a hora escolhidos): ver `estadosAtivos`
  // Limpar não pode esconder (crítica do celular, achado 2): com a gaveta fechada, o que o
  // leitor escolheu e muda o mapa fica dito no pé, com a saída num alvo de 44 px
  const estadosAtivos = useMemo(() => {
    const e: { chave: string; rotulo: string; acao: string; fazer: () => void }[] = [];
    if (!estreito) return e;
    if (capitulo === 'rede') {
      if (anoLimite != null) e.push({ chave: 'ano', rotulo: `até ${anoLimite}`, acao: 'voltar a hoje', fazer: () => setAnoLimite(null) });
      if (donoDestacado) {
        const d = usinasPrincipais ? donosDaFrota(usinasDaFrota).find((x) => x.chave === donoDestacado) : null;
        e.push({ chave: 'dono', rotulo: nomeDeExibicao(d?.nome ?? donoDestacado), acao: 'desfazer', fazer: () => setDonoDestacado(null) });
      }
    }
    if ((capitulo === 'agua' || capitulo === 'trocas') && meses?.length && mesIdx != null && mesCorrente < meses.length - 1)
      e.push({ chave: 'mes', rotulo: mesBr(meses[mesCorrente]), acao: 'último mês', fazer: () => (setTocando(false), setMesIdx(null)) });
    if (capitulo === 'dia' && modoDoDia === 'real' && momento) {
      const [a, m, d] = momento.dia.split('-');
      e.push({ chave: 'dia', rotulo: `${String(Math.round(momento.hora)).padStart(2, '0')}h · ${Number(d)} ${mesBr(`${a}-${m}`)}`, acao: 'média do mês', fazer: () => mudarModoDoDia('medio') });
    }
    if (capitulo === 'comercio' && comercio && (filtroComercio.sentido !== FILTRO_INICIAL_DO_COMERCIO.sentido || filtroComercio.produtos || filtroComercio.quantas !== FILTRO_INICIAL_DO_COMERCIO.quantas)) {
      const partes = [
        filtroComercio.sentido === 'importacao' ? 'Importação' : filtroComercio.sentido === 'ambos' ? 'Exportação e importação' : 'Exportação',
        ...(filtroComercio.produtos ?? []).map((p) => nomeDoProduto(comercio, p)),
        ...(filtroComercio.quantas === 'todas' ? ['todas'] : []),
      ];
      e.push({ chave: 'comercio', rotulo: partes.join(' · '), acao: 'desfazer', fazer: () => setFiltroComercio(FILTRO_INICIAL_DO_COMERCIO) });
    }
    return e;
  }, [estreito, capitulo, anoLimite, donoDestacado, usinasPrincipais, usinasDaFrota, meses, mesIdx, mesCorrente, modoDoDia, momento, mudarModoDoDia, comercio, filtroComercio]);
  const palco = alturaDoPalco || altura;
  const margens = useMemo(
    () =>
      estreito
        ? // o cartão da vista no celular sobe até ~48% da altura (medido a 390×844): 0,4 cortava o anel do destaque.
          // Sem cartão, a base é o que a gaveta cobre de fato: fechada (puxador e a linha do estado) ou
          // na meia altura (40% do palco); aberta, ela cobre quase tudo e a câmera não persegue
          {
            esquerda: 0,
            direita: temCartao ? 0 : 56,
            topo: 64,
            // a ficha e o cartão da vista sobem até 46% do palco a partir do puxador (atlas-v3.css):
            // a margem é essa altura inteira, para o selecionado ficar na faixa ACIMA deles
            // (crítica do celular, achado 8; antes 40% da janela, que deixava ~76 px sob a ficha)
            base: temCartao
              ? Math.round(palco * 0.46) + 56 + 8
              : gaveta === 'meia'
                ? Math.round(palco * 0.4) + 8
                : 56 + (estadosAtivos.length ? 44 : 0) + 8,
          }
        : {
            esquerda: vista && !selecionado ? 300 : 0,
            direita: selecionado ? Math.max(104, Math.min(460, largura - (colunaRecolhida ? LARGURA_TRILHO : LARGURA_COLUNA) - 120)) : 104,
            topo: 48,
            base: 20,
          },
    [estreito, temCartao, vista, selecionado, altura, largura, colunaRecolhida, gaveta, palco, estadosAtivos.length],
  );
  // a gaveta subiu à meia altura ou desceu: o que estava no meio da tela vai para o meio da faixa
  // livre (no zoom do Brasil, o Brasil inteiro; de perto, o centro de antes). Só no celular e
  // sem ficha: com ficha, quem enquadra é a seleção
  const baseAnterior = useRef({ base: margens.base, cartao: temCartao });
  useEffect(() => {
    const { base: antes, cartao } = baseAnterior.current;
    baseAnterior.current = { base: margens.base, cartao: temCartao };
    // só o que a GAVETA mudou: ficha e cartão têm o enquadramento da seleção
    if (!estreito || temCartao || cartao || pronto == null || Math.abs(antes - margens.base) < 40) return;
    // "O mundo" é a composição do Titã: ela se recompõe sozinha pela altura útil
    if (capitulo === 'mundo') return;
    // o capítulo acabou de voar a câmera: a subida espera o voo assentar (ver aoMoverCamera)
    if (vooDoCapitulo.current) {
      vooDoCapitulo.current = false;
      if (margens.base > antes) subirDepoisDoVoo.current = mapa.current?.geracaoDaCamera() ?? null;
      return;
    }
    // a câmera está num voo (pedido de outro lugar): a última câmera assentada é velha; a subida
    // espera esse voo e parte de onde ele assentar
    if (margens.base > antes && mapa.current?.cameraEmMovimento()) {
      subirDepoisDoVoo.current = mapa.current.geracaoDaCamera();
      return;
    }
    const c = cameraRef.current;
    // ao SUBIR: o ponto no meio da tela vai ao meio da faixa livre, no mesmo zoom (sem `exato`,
    // o controle desconta as margens; no globo isso gira o globo, e o Brasil sobe inteiro). O
    // enquadramento por limites encolhia o Brasil pela altura que sobra (z 1,9 → 1,15 a 390).
    // Ao DESCER: no zoom do Brasil, o Brasil de novo pelos limites; de perto, nada se mexe (o
    // que o leitor via na faixa continua onde estava, e o mapa só ganha chão embaixo)
    if (margens.base > antes) mapa.current?.voarPara({ centro: c.centro, zoom: c.zoom, inclinacao: c.inclinacao, rumo: c.rumo });
    // (no comércio, que tem câmera própria no globo, ao descer nada se mexe)
    else if (c.zoom < 5.5 && capitulo !== 'comercio') mapa.current?.voarPara({ limites: BRASIL });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [margens.base]);

  const mesDosSubmercados = (capitulo === 'agua' || capitulo === 'trocas') && meses?.length ? meses[mesCorrente] : null;
  const estado: EstadoDoMapa = useMemo(
    () => ({
      modo,
      capitulo,
      camadas,
      selecionado,
      destaque,
      earSubsistema,
      earReservatorio,
      trocas,
      dia,
      tetoDoDia,
      coresDoMundo,
      paises,
      filtroDoComercio: filtroComercio,
      movimentoReduzido: reduzido,
      margens,
      // o ano e o dono valem só em "A rede" (o painel deles só existe lá)
      anoLimite: capitulo === 'rede' ? anoLimite : null,
      anoArrastando: capitulo === 'rede' && (anoArrastando || tocandoAno),
      donoDestacado: capitulo === 'rede' ? donoDestacado : null,
      // o dia real: só no capítulo "Um dia" e no modo real (null = a média do mês, intacta)
      momentoDaOperacao: momentoNoMapa,
      // o mês da régua de "A água" e de "As trocas": antes de set/2025 o mapa desenha o Norte sem
      // Roraima (item 2.11 do controle; a frase visível é da página, sob a régua)
      mesDosSubmercados: mesDosSubmercados,
    }),
    [modo, capitulo, camadas, selecionado, destaque, earSubsistema, earReservatorio, trocas, dia, tetoDoDia, coresDoMundo, paises, filtroComercio, reduzido, margens, anoLimite, anoArrastando, tocandoAno, donoDestacado, momentoNoMapa, mesDosSubmercados],
  );

  // ── medidas para o harness ─────────────────────────────────────────
  useEffect(() => {
    const medir = (duracao: number) =>
      new Promise<number>((resolver) => {
        let quadros = 0;
        const t0 = performance.now();
        const conta = (t: number) => {
          quadros++;
          if (t - t0 >= duracao) resolver(Math.round((quadros * 1000) / (t - t0)));
          else requestAnimationFrame(conta);
        };
        requestAnimationFrame(conta);
      });
    window.__atlas = {
      msAtePronto: pronto,
      desenhadas: () => mapa.current?.contar() ?? {},
      ir: (c) => mapa.current?.voarPara(c, true),
      fpsEmMovimento: () => {
        mapa.current?.girar(40, 2000);
        return medir(2000);
      },
      zoom: camera.zoom,
      capitulo,
      vista: vista?.id ?? null,
      fps: () => medir(2000),
    };
    if (import.meta.env.DEV) {
      const ctl = () => {
        const c = controleParaDepuracao();
        if (!c) throw new Error('mapa não montado');
        return c;
      };
      const naTela = (q: { x: number; y: number }, w: number, h: number) => q.x >= 0 && q.y >= 0 && q.x <= w && q.y <= h;
      /** ponto dentro do polígono (lon/lat) dos quatro cantos da tela */
      const dentroDe = (poli: [number, number][], lon: number, lat: number) => {
        let dentro = false;
        for (let i = 0, j = poli.length - 1; i < poli.length; j = i++) {
          const [xi, yi] = poli[i];
          const [xj, yj] = poli[j];
          if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) dentro = !dentro;
        }
        return dentro;
      };
      // ── A10 (decisão de 16/11/2026): só conta o que está nas duas telas, longe da borda ──
      type Ret = [number, number, number, number];
      const dormir = (ms: number) => new Promise((r) => window.setTimeout(r, ms));
      /** retângulos (px do canvas) da casca sobre o mapa: os mesmos seletores de zonasDaCasca do controle */
      const zonasDaCasca = (): Ret[] => {
        const cv = ctl().mapa.getCanvas();
        const raiz = cv.closest('.atl') ?? document.body;
        const c = cv.getBoundingClientRect();
        const z: Ret[] = [];
        for (const el of raiz.querySelectorAll('.atl-busca, .atl-controles, .mapboxgl-ctrl-attrib, .mapboxgl-ctrl-logo, .atl-ficha, .atl-vista')) {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) z.push([r.left - c.left, r.top - c.top, r.right - c.left, r.bottom - c.top]);
        }
        return z;
      };
      /** Mercator plano: tela e chão se relacionam por homografia, então retângulo de tela vira quadrilátero aqui */
      const merc = (lon: number, lat: number): [number, number] => [(lon + 180) / 360, (1 - Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) / Math.PI) / 2];
      const noChao = (r: Ret): [number, number][] =>
        ([[r[0], r[1]], [r[2], r[1]], [r[2], r[3]], [r[0], r[3]]] as [number, number][]).map((p) => {
          const l = ctl().mapa.unproject(p);
          return merc(l.lng, l.lat);
        });
      /** a área livre da tela agora (folga das bordas, fora da casca), no chão */
      const areaLivre = (folga: number) => {
        const cv = ctl().mapa.getCanvas();
        const tela = noChao([folga, folga, cv.clientWidth - folga, cv.clientHeight - folga]);
        const zonas = zonasDaCasca().map(noChao);
        return (lon: number, lat: number) => {
          const [x, y] = merc(lon, lat);
          return dentroDe(tela, x, y) && !zonas.some((q) => dentroDe(q, x, y));
        };
      };
      /** move a câmera sem animação e espera o moveend (com teto, para não pendurar) */
      const mover = (fazer: () => void) =>
        new Promise<void>((resolver) => {
          const m = ctl().mapa;
          const t = window.setTimeout(resolver, 1500);
          m.once('moveend', () => {
            window.clearTimeout(t);
            resolver();
          });
          fazer();
        });
      /** a escolha assentou: 350 ms depois do moveend e o conjunto igual em duas leituras seguidas */
      const assentar = async () => {
        await dormir(350);
        let anterior = '';
        for (let i = 0; i < 10; i++) {
          const s = ctl()
            .depurarMaquetes()
            .itens.map((x) => x.id)
            .sort()
            .join(',');
          if (s === anterior) return;
          anterior = s;
          await dormir(200);
        }
      };
      Object.assign(window.__atlas, {
        maquetes: () => ctl().depurarMaquetes(),
        rotulos: (camadas?: readonly string[]) => ctl().depurarRotulos(camadas),
        maquetesLigadas: (ligar: boolean) => ctl().ligarMaquetes(ligar),
        msDaEscolha: (vezes = 10) => ctl().cronometrarEscolha(vezes),
        contarRepaints: (ms: number) => ctl().contarRepaints(ms),
        papeis: () => ctl().depurarPapeis(),
        /** por que cada candidato da última escolha ficou ou saiu */
        motivos: () => Object.fromEntries(MOTIVOS_DA_ESCOLHA),
        /** áreas das distribuidoras: ms de busca + preparo do arquivo e visibilidade de cada camada */
        distribuicao: () => {
          const m = ctl().mapa;
          const ids = ['distribuicao-conc-area', 'distribuicao-conc-fio', 'distribuicao-perm-area', 'distribuicao-perm-fio', 'distribuicao-rotulo'];
          return { msDeCarga: ctl().distrib.msDeCarga, camadas: Object.fromEntries(ids.map((id) => [id, m.getLayer(id) ? String(m.getLayoutProperty(id, 'visibility')) : 'ausente'])) };
        },
        /** lon/lat → px do canvas (a sonda do painel clica num símbolo pelo ponto do cadastro) */
        projetar: (lon: number, lat: number) => {
          const q = ctl().mapa.project([lon, lat]);
          return { x: q.x, y: q.y };
        },
        /** feições desenhadas agora numa camada do mapa (destaque do conjunto, toque dos membros) */
        naCamada: (camada: string) => {
          const m = ctl().mapa;
          return m.getLayer(camada) ? m.queryRenderedFeatures(undefined, { layers: [camada] }).map((f) => ({ id: f.id ?? null, props: f.properties ?? {} })) : [];
        },
        fpsEmZoom: () => {
          const m = ctl().mapa;
          m.easeTo({ zoom: m.getZoom() + 1, duration: 2000, easing: (x) => x, essential: true });
          return medir(2000);
        },
        estabilidade: async (dx: number, dzoom = 0) => {
          const c = ctl();
          const m = c.mapa;
          const cv = m.getCanvas();
          const w = cv.clientWidth;
          const h = cv.clientHeight;
          const cantos = ([[0, 0], [w, 0], [w, h], [0, h]] as [number, number][]).map((p) => {
            const l = m.unproject(p);
            return [l.lng, l.lat] as [number, number];
          });
          const antes = c.depurarMaquetes().itens;
          if (dx || dzoom) {
            await new Promise<void>((resolver) => {
              m.once('moveend', () => resolver());
              if (dzoom) m.zoomTo(m.getZoom() + dzoom, { duration: 0 });
              else m.panBy([dx, 0], { duration: 0 });
            });
          }
          await new Promise((r) => window.setTimeout(r, 300));
          const depois = c.depurarMaquetes().itens;
          const a = antes.filter((it) => naTela(m.project([it.lon, it.lat]), w, h)).map((it) => it.id);
          const b = depois.filter((it) => dentroDe(cantos, it.lon, it.lat)).map((it) => it.id);
          const sa = new Set(a);
          const sb = new Set(b);
          const inter = a.filter((x) => sb.has(x)).length;
          const uniao = new Set([...sa, ...sb]).size;
          return { antes: a, depois: b, jaccard: uniao ? inter / uniao : 1 };
        },
        /** A10, arrasto: compara só os itens que cabem INTEIROS nas duas telas (antes e depois):
         *  a âncora com folga das bordas e fora da casca, e a caixa da maquete somada à do
         *  rótulo fora da margem e da casca nas duas (a regra testa a caixa, não a âncora).
         *  "saiu" é quem estava desenhado, cabe inteiro nas duas e deixou de ser desenhado: é o
         *  que reprova. "entrou" (a vaga de quem saiu pela borda) é informação. dx padrão: 15%
         *  da largura, até 200 px (a 390 um arrasto de 200 não deixa interseção com 120 px de folga). */
        arrasto: async (dx?: number, folga = 120) => {
          const c = ctl();
          const m = c.mapa;
          const w = m.getCanvas().clientWidth;
          const h = m.getCanvas().clientHeight;
          const d = Math.round(dx ?? Math.min(200, w * 0.15));
          await assentar();
          const livreAntes = areaLivre(folga);
          const zonasAntes = zonasDaCasca();
          const antes = c.depurarMaquetes().itens;
          await mover(() => m.panBy([d, 0], { duration: 0 }));
          await assentar();
          const livreDepois = areaLivre(folga);
          const zonasDepois = zonasDaCasca();
          const depois = c.depurarMaquetes().itens;
          type Item = (typeof antes)[number];
          // margem da tela (16 px) + casca inflada (4 px) + tolerância de medida
          const BORDA = 24;
          // sem caixa prevista não há como dizer que cabe: o item fica fora da comparação
          const corpo = (it: Item): Ret | null => {
            const q = it.caixa;
            if (!q) return null;
            const r = it.rotulo?.caixa;
            return r ? [Math.min(q[0], r[0]), Math.min(q[1], r[1]), Math.max(q[2], r[2]), Math.max(q[3], r[3])] : [q[0], q[1], q[2], q[3]];
          };
          const cabe = (q: Ret | null, zonas: Ret[]) =>
            !!q && q[0] >= BORDA && q[1] >= BORDA && q[2] <= w - BORDA && q[3] <= h - BORDA && !zonas.some((z) => q[0] < z[2] + BORDA && z[0] - BORDA < q[2] && q[1] < z[3] + BORDA && z[1] - BORDA < q[3]);
          const desl = (q: Ret | null, s: number): Ret | null => (q ? [q[0] + s, q[1], q[2] + s, q[3]] : null);
          // quanto o conteúdo andou na tela: medido num item presente nas duas; sem nenhum, −d
          const emDepois = new Map(depois.map((it) => [it.id, it]));
          const comum = antes.find((it) => emDepois.has(it.id));
          const passo = comum ? (emDepois.get(comum.id) as Item).pe[0] - comum.pe[0] : -d;
          const ancora = (it: Item) => livreAntes(it.lon, it.lat) && livreDepois(it.lon, it.lat);
          const inteiroAntes = (it: Item) => ancora(it) && cabe(corpo(it), zonasAntes) && cabe(desl(corpo(it), passo), zonasDepois);
          const inteiroDepois = (it: Item) => ancora(it) && cabe(corpo(it), zonasDepois) && cabe(desl(corpo(it), -passo), zonasAntes);
          const idsAntes = new Set(antes.map((it) => it.id));
          const a = antes.filter(inteiroAntes).map((it) => it.id);
          const b = depois.filter((it) => (idsAntes.has(it.id) ? a.includes(it.id) : inteiroDepois(it))).map((it) => it.id);
          const sb = new Set(depois.map((it) => it.id));
          const uniao = new Set([...a, ...b]).size;
          return { dx: d, folga, passo: Math.round(passo), comparaveis: uniao, antes: a, depois: b, saiu: a.filter((x) => !sb.has(x)), entrou: b.filter((x) => !idsAntes.has(x)), jaccard: uniao ? a.filter((x) => sb.has(x)).length / uniao : 1 };
        },
        /** A10, zoom: varre de z0−meia a z0+meia em passos, assentando em cada um, e conta as
         *  piscadas (o item some e volta na varredura monótona) entre os
         *  itens cuja âncora fica na área livre de TODOS os passos (a da tela mais apertada,
         *  z0+meia, mais as zonas da casca de cada passo). Volta a z0 no fim. */
        varrerZoom: async (meia = 0.6, passo = 0.1, folga = 120) => {
          const c = ctl();
          const m = c.mapa;
          await assentar();
          const z0 = m.getZoom();
          const n = Math.round((2 * meia) / passo);
          const passos: { zoom: number; ids: Set<string>; livre: (lon: number, lat: number) => boolean }[] = [];
          const lugar = new Map<string, { lon: number; lat: number; nome: string | null }>();
          for (let i = 0; i <= n; i++) {
            const z = z0 - meia + i * passo;
            await mover(() => m.zoomTo(z, { duration: 0 }));
            await assentar();
            const itens = c.depurarMaquetes().itens;
            for (const it of itens) lugar.set(it.id, { lon: it.lon, lat: it.lat, nome: it.nome });
            passos.push({ zoom: m.getZoom(), ids: new Set(itens.map((it) => it.id)), livre: areaLivre(folga) });
          }
          await mover(() => m.zoomTo(z0, { duration: 0 }));
          await assentar();
          const olhados = [...lugar].filter(([, p]) => passos.every((s) => s.livre(p.lon, p.lat)));
          const r2 = (v: number) => Math.round(v * 100) / 100;
          // piscada, pela letra da decisão: o item some e VOLTA (■·■, ·■·■). "Aparece e some"
          // (·■·) é troca de hierarquia entre níveis: vai à parte, como informação
          const piscadas = [];
          const aparecemESomem = [];
          for (const [id, p] of olhados) {
            const seq = passos.map((s) => s.ids.has(id));
            const trocas: number[] = [];
            for (let i = 1; i < seq.length; i++) if (seq[i] !== seq[i - 1]) trocas.push(i);
            const registro = { id, nome: p.nome, presenca: seq.map((v) => (v ? '■' : '·')).join(''), mudancas: trocas.map((i) => `${seq[i] ? '+' : '−'}${r2(passos[i].zoom)}`) };
            if (trocas.length >= (seq[0] ? 2 : 3)) piscadas.push(registro);
            else if (trocas.length >= 2) aparecemESomem.push(registro);
          }
          return { z0: r2(z0), de: r2(passos[0].zoom), ate: r2(passos[passos.length - 1].zoom), passos: passos.length, folga, olhados: olhados.length, piscadas, aparecemESomem };
        },
        /** A10, ida e volta: z0 → z0+dz → z0. "perdidos" é quem estava na tela no início,
         *  CONTINUAVA desenhado em z0+dz e mesmo assim não voltou: a falha de histerese. Quem
         *  saiu na ida (a caixa bateu na borda ao aproximar) e perdeu a vaga para quem ficou
         *  desenhado vai em "saiuNaIda", como informação: a histerese promete estabilidade, não
         *  reversibilidade. Pode ganhar item, pela mesma razão. */
        idaEVolta: async (dz = 0.3) => {
          const c = ctl();
          const m = c.mapa;
          await assentar();
          const z0 = m.getZoom();
          const w = m.getCanvas().clientWidth;
          const h = m.getCanvas().clientHeight;
          const antes = c.depurarMaquetes().itens.filter((it) => naTela(m.project([it.lon, it.lat]), w, h));
          await mover(() => m.zoomTo(z0 + dz, { duration: 0 }));
          await assentar();
          const meio = new Set(c.depurarMaquetes().itens.map((it) => it.id));
          const noMeio = meio.size;
          await mover(() => m.zoomTo(z0, { duration: 0 }));
          await assentar();
          const depois = new Set(c.depurarMaquetes().itens.map((it) => it.id));
          const ids = new Set(antes.map((it) => it.id));
          return { z0: Math.round(z0 * 100) / 100, dz, antes: antes.length, noMeio, perdidos: antes.filter((it) => meio.has(it.id) && !depois.has(it.id)).map((it) => `${it.id} ${it.nome}`), saiuNaIda: antes.filter((it) => !meio.has(it.id)).map((it) => `${it.id} ${it.nome}`), ganhos: [...depois].filter((x) => !ids.has(x)) };
        },
      });
    }
    return () => {
      delete window.__atlas;
    };
  }, [pronto, camera.zoom, capitulo, vista]);

  // ── câmera assentada: "Nesta tela" e o endereço ────────────────────
  // O controle chama aoMoverCamera no moveend (a câmera assentou). Daqui sai a caixa da tela
  // para a conta do painel e o ?cam do endereço, gravado com replaceState: nenhuma entrada
  // nova no histórico a cada movimento (o Voltar continua voltando de vista em vista).
  const gravarCamNoEndereco = useCallback((c: Parameters<typeof escreverCam>[0]) => {
    try {
      const novo = enderecoComCam(c);
      if (novo !== window.location.href) window.history.replaceState(window.history.state, '', novo);
    } catch {
      /* endereço que o navegador recusa: fica o anterior */
    }
  }, []);
  // a caixa vem do controle quando a área livre muda de fato: câmera assentada (e de novo no
  // quadro seguinte, quando o globo refez a projeção), tela redimensionada, ficha aberta ou
  // fechada, coluna recolhida. Antes, a conta da abertura saía de uma caixa velha e só se
  // corrigia no primeiro movimento do leitor.
  const aoAssentar = useCallback((a: { limites: Limites | null; poligono: [number, number][] | null }) => {
    setLimites((antes) => (antes && a.limites && antes.every((v, i) => v === a.limites?.[i]) ? antes : a.limites));
    // leva 5: o anel da área livre no chão (câmera inclinada ou girada); null = vale a caixa
    setAreaLivre((antes) =>
      antes && a.poligono && antes.length === a.poligono.length && antes.every((p, i) => p[0] === a.poligono?.[i][0] && p[1] === a.poligono?.[i][1]) ? antes : a.poligono,
    );
  }, []);
  const aoMoverCamera = useCallback(
    (c: { zoom: number; centro: [number, number]; inclinacao: number; rumo: number }) => {
      cameraRef.current = c;
      setCamera(c);
      gravarCamNoEndereco(c);
      vooDoCapitulo.current = false;
      // o voo do capítulo assentou com a gaveta na meia altura: o centro dele sobe à faixa livre
      const esperada = subirDepoisDoVoo.current;
      if (esperada != null) {
        subirDepoisDoVoo.current = null;
        // o moveend de um voo parado por um pedido mais novo não sobe nada (o número mudou)
        if (mapa.current?.geracaoDaCamera() === esperada)
          mapa.current?.voarPara({ centro: c.centro, zoom: c.zoom, inclinacao: c.inclinacao, rumo: c.rumo });
      }
    },
    [gravarCamNoEndereco],
  );
  // o ano, o dono e o dia real vão ao endereço (o "Link" copiado reabre igual), com folga: o
  // arrasto da régua e o dia tocando não viram uma escrita por quadro
  const horaInteira = momento ? Math.round(momento.hora) : null;
  // codigo.md 16 e 17: a query sai do endereço CORRENTE no instante da escrita (um params de
  // closure velho desfazia a troca de capítulo ou fechava a vista recém-aberta), e o efeito
  // rearma a cada navegação (`params` nas dependências): depois do Voltar do navegador, o
  // endereço volta a dizer o ano, o dono e o dia que a tela mostra, e o "Link" copia o certo
  const setParamsRef = useRef(setParams);
  setParamsRef.current = setParams;
  useEffect(() => {
    const t = window.setTimeout(() => {
      const atual = window.location.search;
      const novo = new URLSearchParams(atual);
      const poe = (k: string, v: string | null) => (v == null ? novo.delete(k) : novo.set(k, v));
      poe('ano', anoLimite != null ? String(anoLimite) : null);
      poe('dono', donoDestacado);
      poe('dia', modoDoDia === 'real' && momento ? momento.dia : null);
      poe('hora', modoDoDia === 'real' && horaInteira != null ? String(horaInteira) : null);
      if (novo.toString() !== new URLSearchParams(atual).toString()) setParamsRef.current(novo, { replace: true });
    }, 400);
    return () => window.clearTimeout(t);
  }, [anoLimite, donoDestacado, modoDoDia, momento?.dia, horaInteira, params]);

  // o roteador reescreve a query (troca de capítulo, vista) sem o ?cam, que ele não conhece:
  // depois de cada troca, a câmera corrente volta ao endereço
  useEffect(() => {
    if (pronto != null) gravarCamNoEndereco(cameraRef.current);
  }, [params, pronto, gravarCamNoEndereco]);

  const [copiado, setCopiado] = useState<'sim' | 'falhou' | null>(null);
  const copiarEndereco = useCallback(() => {
    const url = enderecoComCam(cameraRef.current);
    const fim = (r: 'sim' | 'falhou') => {
      setCopiado(r);
      window.setTimeout(() => setCopiado(null), 2400);
    };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(url).then(() => fim('sim'), () => fim('falhou'));
    else fim('falhou');
  }, []);

  // ── modo aula e atalhos ────────────────────────────────────────────
  const [ajudaAberta, setAjudaAberta] = useState(false);
  const [emAula, setEmAula] = useState(false);
  // codigo.md 22: a coluna volta como o leitor a deixou antes da aula (recolhida fica recolhida)
  const colunaAntesDaAula = useRef(false);
  const alternarAula = useCallback(() => {
    const raizEl = document.querySelector<HTMLElement>('.atl');
    const tela = !!document.fullscreenElement;
    if (emAula || tela) {
      setEmAula(false);
      if (tela) void document.exitFullscreen?.().catch(() => undefined);
      if (!estreito) alternarColuna(colunaAntesDaAula.current);
      return;
    }
    setEmAula(true);
    setGaveta('fechada');
    colunaAntesDaAula.current = recolhida;
    if (!estreito) alternarColuna(true);
    // tela cheia é pedido: o navegador pode recusar (moldura, política); o painel recolhido fica
    void raizEl?.requestFullscreen?.().catch(() => undefined);
  }, [emAula, estreito, alternarColuna, recolhida]);
  // Esc do navegador sai da tela cheia: o modo aula termina junto (o painel fica como está)
  useEffect(() => {
    const ouvir = () => {
      if (!document.fullscreenElement) setEmAula(false);
    };
    document.addEventListener('fullscreenchange', ouvir);
    return () => document.removeEventListener('fullscreenchange', ouvir);
  }, []);

  const trocarCapituloRef = useRef(trocarCapitulo);
  trocarCapituloRef.current = trocarCapitulo;
  useEffect(() => {
    const ouvir = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
      const alvo = e.target as HTMLElement | null;
      // nada de atalho enquanto se digita (busca, campo de país) ou num controle que usa a tecla
      if (alvo && (alvo.isContentEditable || alvo.closest('input, textarea, select, [contenteditable], [role="slider"]'))) return;
      if (e.key === '?') {
        e.preventDefault();
        setAjudaAberta((v) => !v);
        return;
      }
      if (e.key === 'Escape' && ajudaAberta) {
        setAjudaAberta(false);
        return;
      }
      if (e.key === '/') {
        const campo = document.querySelector<HTMLElement>('.atl-topo input');
        if (campo) {
          e.preventDefault();
          campo.focus();
        }
        return;
      }
      if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        alternarAula();
        return;
      }
      if (new RegExp(`^[1-${CAPITULOS.length}]$`).test(e.key)) {
        e.preventDefault();
        trocarCapituloRef.current(CAPITULOS[Number(e.key) - 1].id);
      }
    };
    window.addEventListener('keydown', ouvir);
    return () => window.removeEventListener('keydown', ouvir);
  }, [alternarAula, ajudaAberta]);

  // ── ações ──────────────────────────────────────────────────────────
  const alternarCamada = useCallback((c: CamadaId) => {
    setCamadas((atual) => {
      const n = new Set(atual);
      if (n.has(c)) n.delete(c);
      else n.add(c);
      return n;
    });
  }, []);

  const definirCamadas = useCallback((lista: CamadaId[], ligar: boolean) => {
    setCamadas((atual) => {
      const n = new Set(atual);
      for (const c of lista) {
        if (ligar) n.add(c);
        else n.delete(c);
      }
      return n;
    });
  }, []);

  const selecionar = useCallback(
    (a: AtivoSelecionado | null) => {
      setSelecionado(a);
      if (a) setGaveta('fechada');
    },
    [],
  );

  // a ficha aberta por clique no mapa: quem a abriu é o mapa (o canvas), e é para ele que o foco
  // volta depois do Esc (item 5 da leva 4). O Mapbox não deixa o clique focar o canvas
  const abertaPeloMapa = useRef(false);
  const chaveAtual = useRef<string | null>(null);
  chaveAtual.current = selecionado ? `${selecionado.tipo}:${selecionado.chave}` : null;
  const selecionarPeloMapa = useCallback(
    (a: AtivoSelecionado | null) => {
      // a MESMA seleção reenviada pelo controle (a soma do símbolo refeita depois de a câmera
      // assentar ou de o ano mudar): só as props mudam; a gaveta e o foco ficam como estão
      if (a && chaveAtual.current === `${a.tipo}:${a.chave}`) {
        setSelecionado(a);
        return;
      }
      abertaPeloMapa.current = !!a;
      selecionar(a);
    },
    [selecionar],
  );

  const escolherNaBusca = useCallback(
    (a: AtivoSelecionado) => {
      // Garante que o capítulo e a camada que desenham o ativo estejam ligados.
      // Na água só aparecem hidrelétricas em operação, reservatórios que
      // regularizam, submercados e bacias; o resto pede o capítulo da rede.
      const desenhadoNaAgua =
        (a.tipo === 'reservatorio' && Number(a.props.vutil ?? 0) > 0) ||
        (a.tipo === 'usina' && a.props.cat === 'hidro' && Number(a.props.fase) === 0) ||
        a.tipo === 'submercado' ||
        a.tipo === 'bacia';
      // gás e petróleo só existem no capítulo do combustível; as térmicas que queimam, nos dois
      const camadaComb = camadaDoAtivoDoCombustivel(a);
      const termicaNoComb = a.tipo === 'usina' && Number(a.props.fase) === 0 && (CATEGORIAS_DO_COMBUSTIVEL as readonly string[]).includes(String(a.props.cat));
      const destino: CapituloId = camadaComb ? 'combustivel' : 'rede';
      const fica = camadaComb
        ? capitulo === 'combustivel'
        : capitulo === 'rede' || (capitulo === 'agua' && desenhadoNaAgua) || (capitulo === 'combustivel' && termicaNoComb) || (a.tipo === 'submercado' && (capitulo === 'trocas' || capitulo === 'dia'));
      if (!fica) {
        setCapitulo(destino);
        setPainel('capitulo');
        setTocando(false);
        const novo = new URLSearchParams(params);
        if (destino === 'rede') novo.delete('c');
        else novo.set('c', destino);
        if (novo.toString() !== params.toString()) setParams(novo, { replace: true });
      }
      setCamadas((atual) => {
        const n = new Set(atual);
        if (a.tipo === 'usina') {
          n.add(a.props.cat as CamadaId);
          if (Number(a.props.fase) > 0) n.add('usinas-futuras');
        }
        if (a.tipo === 'linha') {
          n.add('linhas');
          if (a.props.op == null && a.props.opAntesDe == null) n.add('linhas-previstas');
        }
        if (a.tipo === 'subestacao') n.add('subestacoes');
        if (a.tipo === 'reservatorio') n.add('reservatorios');
        if (a.tipo === 'submercado') n.add('submercados');
        if (a.tipo === 'bacia') n.add('bacias');
        if (a.tipo === 'distribuidora') n.add('distribuicao');
        if (camadaComb) n.add(camadaComb);
        return n;
      });
      setDestaqueDaBusca(
        a.tipo === 'usina'
          ? { usinas: [a.chave] }
          : a.tipo === 'linha'
            ? { linhas: [a.chave] }
            : a.tipo === 'subestacao'
              ? { subestacoes: [a.chave] }
              : a.tipo === 'reservatorio'
                ? { reservatorios: [a.chave] }
                : a.tipo === 'submercado'
                  ? { submercados: [a.chave as Subsistema] }
                  : a.tipo === 'bacia'
                    ? { bacias: [a.chave] }
                    : camadaComb
                      ? { combustivel: [a.chave] }
                      : null,
      );
      setSelecionado(a);
      setGaveta('fechada');
      // a geometria da linha vem dos dados do controle
      window.setTimeout(() => mapa.current?.enquadrar(a), 0);
    },
    [capitulo, params, setParams],
  );

  // "O comércio": seleção vinda do painel ou da ficha (a do mapa chega por `selecionar`). A chave
  // é opaca, da camada do comércio; o enquadramento sai da geometria que a camada devolve.
  const chaveDoComercio = selecionado?.tipo === 'comercio' ? selecionado.chave : null;
  const selecionarNoComercio = useCallback((chave: string | null) => {
    if (!chave) {
      setSelecionado(null);
      return;
    }
    const a: AtivoSelecionado = { tipo: 'comercio', chave, props: { origem: 'painel' }, lngLat: cameraRef.current.centro };
    setSelecionado(a);
    setGaveta('fechada');
    // depois das margens novas da ficha chegarem ao controle
    window.setTimeout(() => mapa.current?.enquadrar(a), 0);
  }, []);

  // "Um dia", dia real: seleção vinda da seção ou da ficha (a do mapa chega por `selecionar`,
  // já no formato { tipo: 'operacao', chave }). A chave é opaca (`u:<id>`), da camada do pulso.
  const chaveDaOperacao = selecionado?.tipo === 'operacao' ? selecionado.chave : null;
  const selecionarNaOperacao = useCallback(
    (chave: string | null) => {
      if (!chave) {
        setSelecionado((s) => (s?.tipo === 'operacao' ? null : s));
        return;
      }
      // membro de conjunto ('ceg:…', itens 3.6 e 6.3.1): abre a USINA do Atlas, pelo cadastro (o
      // arquivo da operação não tem a geração dela). O capítulo fica: fechar a ficha volta ao dia
      const lida = lerChave(chave);
      if (lida?.tipo === 'membro') {
        const ceg = lida.ceg;
        const achar = (l: FeicaoUsina[] | null | undefined) => l?.find((x) => x.properties.ceg === ceg);
        void (async () => {
          const f = achar(await carregarUsinasPrincipais().catch(() => null)) ?? achar(await carregarUsinasMenores().catch(() => null));
          const a: AtivoSelecionado = f
            ? { tipo: 'usina', chave: ceg, props: f.properties as unknown as Record<string, unknown>, lngLat: [f.geometry.coordinates[0], f.geometry.coordinates[1]] }
            : { tipo: 'operacao', chave, props: { origem: 'painel', foraDoCadastro: true }, lngLat: cameraRef.current.centro };
          setSelecionado(a);
          setGaveta('fechada');
          if (f) window.setTimeout(() => mapa.current?.enquadrar(a), 0);
        })();
        return;
      }
      const ponto = pontoDaOperacao(operacao, chave);
      const a: AtivoSelecionado = { tipo: 'operacao', chave, props: { origem: 'painel' }, lngLat: ponto ?? cameraRef.current.centro };
      setSelecionado(a);
      setGaveta('fechada');
      // a escolha na lista enquadra a entidade (o controle responde a 'operacao' pela geometria do
      // pulso), depois que as margens novas da ficha chegaram ao controle
      window.setTimeout(() => mapa.current?.enquadrar(a), 0);
    },
    [operacao],
  );

  // "A rede": o dono escolhido de novo desfaz; o ano solto termina o arrasto
  const mudarDono = useCallback((chave: string | null) => setDonoDestacado((d) => (chave != null && chave === d ? null : chave)), []);
  const mudarAno = useCallback((ano: number | null) => setAnoLimite(ano), []);
  // o arrasto da régua do ano: o ponteiro apertado dentro da seção liga o "filtro barato" do
  // controle (anoArrastando); soltar em qualquer lugar desliga e o mapa refaz a soma
  const comecarArrasto = useCallback(() => setAnoArrastando(true), []);
  useEffect(() => {
    if (!anoArrastando) return;
    const soltar = () => setAnoArrastando(false);
    window.addEventListener('pointerup', soltar);
    window.addEventListener('pointercancel', soltar);
    return () => {
      window.removeEventListener('pointerup', soltar);
      window.removeEventListener('pointercancel', soltar);
    };
  }, [anoArrastando]);
  // uma usina da lista do dono: a feição do cadastro (para a ficha) e o mesmo caminho da busca
  const escolherUsinaDoDono = useCallback(
    (u: UsinaDoDono) => {
      const f = usinasPrincipais?.find((x) => x.properties.ceg === u.ceg) ?? usinasMenores?.find((x) => x.properties.ceg === u.ceg);
      const props = (f?.properties ?? { ceg: u.ceg, nome: u.nome, cat: u.cat, uf: u.uf, kw: u.kw, fase: 0 }) as unknown as Record<string, unknown>;
      escolherNaBusca({ tipo: 'usina', chave: u.ceg, props, lngLat: f ? [f.geometry.coordinates[0], f.geometry.coordinates[1]] : [u.lon, u.lat] });
    },
    [usinasPrincipais, usinasMenores, escolherNaBusca],
  );

  const folgaDaVista = destaque?.deVista ? 1.2 : 0;
  // o que o filtro das usinas esconde neste zoom: a mesma regra que o mapa aplica (REGRA_DAS_USINAS)
  const escondidas = REGRA_DAS_USINAS.noZoom(camera.zoom, folgaDaVista, !!destaque?.deVista);
  const tensaoKv = tensaoNoZoom(camera.zoom, folgaDaVista);
  const capAtual = CAPITULOS.find((c) => c.id === capitulo) ?? CAPITULOS[0];

  // "Brasil" no mapa do país; no globo do capítulo O mundo, o botão enquadra o mundo (nas mãos
  // do Titã); no comércio, volta à câmera do capítulo (o Atlântico com as rotas)
  const enquadrarTudo =
    capitulo === 'mundo' ? (
      <button type="button" className="atl-controle-texto" onClick={() => mapa.current?.voarPara(CAMERA_DO_MUNDO)}>
        Mundo
      </button>
    ) : capitulo === 'comercio' ? (
      <button type="button" className="atl-controle-texto" onClick={() => mapa.current?.voarPara(CAMERA_DO_COMERCIO(estreito))}>
        Rotas
      </button>
    ) : (
      <button type="button" className="atl-controle-texto" onClick={() => mapa.current?.voarPara({ limites: BRASIL })}>
        Brasil
      </button>
    );
  // "Globo": o Titã segurando o globo (no "O mundo" o botão "Mundo" já leva a ele)
  const botaoGlobo =
    capitulo === 'mundo' ? null : (
      <button type="button" className="atl-controle-texto" onClick={() => mapa.current?.voarPara(CAMERA_DO_TITA)}>
        Globo
      </button>
    );

  // copiar o endereço desta vista: discreto, nos controles do mapa (no celular, na folha "Mapa")
  const botaoCopiar = (
    <button type="button" className="atl-controle-texto atl-controle-copiar" onClick={copiarEndereco} title="Copiar o endereço desta vista" aria-label="Copiar o endereço desta vista">
      {copiado === 'sim' ? 'Copiado' : copiado === 'falhou' ? 'Falhou' : 'Link'}
    </button>
  );

  const vistasComMomento = useMemo(() => (vistas ?? []).filter((v) => v.momento && v.capitulo === capitulo), [vistas, capitulo]);

  // `exato`: o controle não desloca o centro pelas margens dos painéis (o ?cam já é o centro real);
  // até o controle ler o campo, o centro volta deslocado pela metade das margens.
  // Sem ?cam, sem vista e sem movimento reduzido, o Atlas nasce com o Titã segurando o globo,
  // segura e voa ao Brasil ("O mundo" fica no Titã; "O comércio" tem câmera própria). Com
  // movimento reduzido, abre no Brasil (null: o pouso padrão, sem voo).
  // ?cam de perto da composição do Titã (zoom ≤ z0 + 0,35, sem inclinação: o link copiado com o
  // Titã na tela) abre NA composição, centrada no lon/lat do link, sem voo: quem decide é o
  // controle, que conhece z0 desta tela (`titaSePerto`, decisões da leva 3, A1.5)
  const cameraInicial = useRef<CameraAlvo | null>(
    camDaAbertura.current
      ? ({ ...camDaAbertura.current, exato: true, titaSePerto: true } as CameraAlvo)
      : vistaId
        ? null
        : capituloUrl === 'mundo'
          ? CAMERA_DO_MUNDO
          : capituloUrl === 'comercio'
            ? CAMERA_DO_COMERCIO(estreito)
            : reduzido
              ? null
              : { tita: true, depois: { limites: BRASIL } },
  ).current;

  // ── foco ───────────────────────────────────────────────────────────
  // Ao abrir a ficha, o foco vai para o título dela. Quando o elemento focado
  // some (ficha ou cartão fechado, botão que se remove ao ser acionado, gaveta
  // que se fecha), o foco volta a um lugar estável em vez de cair no body.
  const raiz = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const r = raiz.current;
    if (!r) return;
    const medir = () => setAlturaDoPalco(r.clientHeight);
    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(r);
    return () => obs.disconnect();
  }, []);
  const puxador = useRef<HTMLButtonElement | null>(null);
  const idGaveta = useId();
  const gavetaFechada = estreito && !gavetaAberta;
  const ultimoFoco = useRef<HTMLElement | null>(null);
  const abridorDaFicha = useRef<HTMLElement | null>(null);

  const chaveSelecionada = selecionado ? `${selecionado.tipo}:${selecionado.chave}` : null;
  // a ficha (desktop) ou a folha (celular) não cobre o que acabou de ser selecionado: a câmera
  // desliza até ele ficar na área livre, depois que as margens novas chegaram ao controle (o voo
  // da busca, quando há, já está em curso e tem precedência)
  const lngLatSelecionado = selecionado?.lngLat ?? null;
  useEffect(() => {
    if (!chaveSelecionada || !lngLatSelecionado) return;
    // a rota escolhida no painel é enquadrada inteira: não há ponto a desviar da ficha
    if (selecionado?.tipo === 'comercio' && selecionado.props.origem === 'painel') return;
    // leva 5: a rota tocada no mapa (navio, avião ou a linha) também é enquadrada inteira, origem e
    // destino na área livre (no celular, acima da ficha); o ponto por terra só desvia da ficha
    const sel = selecionado;
    if (sel?.tipo === 'comercio' && String(sel.chave).startsWith('v:')) {
      const q = requestAnimationFrame(() => mapa.current?.enquadrar(sel));
      return () => cancelAnimationFrame(q);
    }
    const q = requestAnimationFrame(() => mapa.current?.manterVisivel(lngLatSelecionado as [number, number], selecionado?.tipo));
    return () => cancelAnimationFrame(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chaveSelecionada]);
  useEffect(() => {
    if (!chaveSelecionada) return;
    const quem = abertaPeloMapa.current ? raiz.current?.querySelector<HTMLElement>('.atl-mapa canvas') : ultimoFoco.current;
    abertaPeloMapa.current = false;
    // um botão de dentro da ficha anterior (a lista do conjunto) já saiu do documento quando a
    // ficha nova renderiza: não é abridor; fica o de antes
    if (quem && quem.isConnected && !quem.closest('.atl-ficha')) abridorDaFicha.current = quem;
    const q = requestAnimationFrame(() => focar(raiz.current?.querySelector('.atl-ficha .atl-ficha-titulo')));
    return () => cancelAnimationFrame(q);
  }, [chaveSelecionada]);

  const devolverFoco = useCallback(() => {
    const r = raiz.current;
    if (!r) return;
    const a = document.activeElement as HTMLElement | null;
    if (a && a !== document.body && !a.closest('[inert]')) return; // o foco está num lugar válido
    const u = ultimoFoco.current;
    if (!u) return; // o leitor nunca pôs o foco no Atlas: nada a devolver
    if (u.isConnected && !u.closest('[inert]') && a === document.body) return; // clicou fora de algo focável
    const candidatos: (Element | null)[] = [
      r.querySelector('.atl-ficha .atl-ficha-titulo'),
      r.querySelector('.atl-vista .atl-vista-titulo'),
      abridorDaFicha.current,
      gavetaFechada ? puxador.current : null,
      r.querySelector('.atl-capitulo[aria-current="true"]'),
      r.querySelector('.atl-trilho-cap[aria-current="true"]'),
      abridorDaColuna.current,
      r.querySelector('.atl-busca .atl-campo'),
    ];
    for (const c of candidatos) if (focar(c)) return;
  }, [gavetaFechada]);

  // depois de cada render, confere se o foco ficou órfão
  useEffect(() => {
    const q = requestAnimationFrame(() => window.setTimeout(devolverFoco, 0));
    return () => cancelAnimationFrame(q);
  });

  return (
    <main
      ref={raiz}
      className={`atl${estreito ? ' atl-estreito' : ''}${gaveta === 'aberta' ? ' atl-gaveta-aberta' : gaveta === 'meia' ? ' atl-gaveta-meia' : ''}${estreito && estadosAtivos.length ? ' atl-com-estado' : ''}`}
      data-gaveta={estreito ? gaveta : undefined}
      data-satelite={camadas.has('satelite') ? 'sim' : 'nao'}
      data-recolhida={colunaRecolhida ? 'sim' : 'nao'}
      data-capitulo={capitulo}
      data-pronto={pronto != null ? 'sim' : 'nao'}
      onFocus={(e) => {
        ultimoFoco.current = e.target as HTMLElement;
      }}
    >
      <p className="so-leitor" role="status">
        {anuncio}
      </p>
      <aside
        className="atl-coluna"
        aria-label="Capítulos e camadas do Atlas"
        onKeyDown={(e) => {
          // Escape fecha a gaveta do celular e devolve o foco ao puxador
          if (e.key !== 'Escape' || !estreito || !gavetaAberta) return;
          e.stopPropagation();
          setGaveta('fechada');
          puxador.current?.focus({ preventScroll: true });
        }}
        onPointerDownCapture={(e) => {
          // o controle tocado na gaveta: na meia altura ele fica à vista (ver o efeito da gaveta)
          if (!estreito) return;
          const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('button, input, select, [role="slider"], [role="radio"], [role="tab"], label, summary, .atl-regua');
          tocadoNaGaveta.current = el && !el.closest('.atl-puxador-linha') ? el : null;
        }}
      >
        {estreito && (
          <div className="atl-puxador-linha">
            {/* fechada → aberta; levantada (meia ou aberta) → fechada */}
            <button
              type="button"
              ref={puxador}
              className="atl-puxador"
              onClick={() => setGaveta((g) => (g === 'fechada' ? 'aberta' : 'fechada'))}
              aria-expanded={gavetaAberta}
              aria-controls={idGaveta}
            >
              <span className="atl-puxador-nome">{painel === 'aulas' ? 'Nas aulas' : painel === 'fontes' ? 'Fontes e licenças' : capAtual.nome}</span>
              <span className="atl-puxador-acao">{gavetaAberta ? 'Fechar' : 'Camadas e capítulos'}</span>
            </button>
            {gaveta === 'meia' && (
              <button type="button" className="atl-puxador-mais" onClick={() => setGaveta('aberta')} aria-controls={idGaveta}>
                Ver tudo
              </button>
            )}
          </div>
        )}
        {/* fechada: o que o leitor escolheu e muda o mapa, dito no pé, com a saída */}
        {estreito && gaveta === 'fechada' && estadosAtivos.length > 0 && (
          <ul className="atl-puxador-estado" aria-label="Escolhas ativas no mapa">
            {estadosAtivos.map((s) => (
              <li key={s.chave}>
                <span className="atl-puxador-estado-rotulo">{s.rotulo}</span>
                <button type="button" onClick={s.fazer}>
                  {s.acao}
                </button>
              </li>
            ))}
          </ul>
        )}
        {/* recolhida no desktop: sobra o trilho com o capítulo corrente e o botão de abrir */}
        {colunaRecolhida && (
          <nav className="atl-trilho" aria-label="Capítulos do Atlas">
            <button type="button" ref={abridorDaColuna} className="atl-trilho-abrir" onClick={() => alternarColuna(false)} aria-expanded={false} aria-controls={idGaveta} title="Abrir o painel">
              <span aria-hidden="true">›</span>
              <span className="so-leitor">Abrir o painel</span>
            </button>
            <ol className="atl-trilho-lista">
              {CAPITULOS.map((c, i) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className={`atl-trilho-cap${painel === 'capitulo' && c.id === capitulo ? ' ativo' : ''}`}
                    aria-current={painel === 'capitulo' && c.id === capitulo ? 'true' : undefined}
                    aria-label={c.nome}
                    title={c.nome}
                    onClick={() => trocarCapitulo(c.id)}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </button>
                </li>
              ))}
            </ol>
            <p className="atl-trilho-nome" aria-hidden="true">
              {painel === 'aulas' ? 'Nas aulas' : painel === 'fontes' ? 'Fontes e licenças' : capAtual.nome}
            </p>
          </nav>
        )}
        {/* fechada no celular, a gaveta não recebe foco nem é lida; recolhida no desktop, sai da tela */}
        <div className="atl-coluna-rolagem" id={idGaveta} inert={gavetaFechada} hidden={colunaRecolhida}>
          <header className="atl-cabeca">
            <p className="v-dado atl-kicker">Atlas do sistema elétrico</p>
            {!estreito && (
              <button type="button" ref={recolhedor} className="atl-recolher" onClick={() => alternarColuna(true)} aria-expanded={true} aria-controls={idGaveta}>
                <span aria-hidden="true">‹</span> Recolher
              </button>
            )}
          </header>

          <nav className="atl-capitulos" aria-label="Capítulos do Atlas">
            <ol className="atl-capitulos-lista">
              {CAPITULOS.map((c, i) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className={`atl-capitulo${painel === 'capitulo' && c.id === capitulo ? ' ativo' : ''}`}
                    aria-current={painel === 'capitulo' && c.id === capitulo ? 'true' : undefined}
                    onClick={() => trocarCapitulo(c.id)}
                  >
                    <span className="atl-capitulo-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="atl-capitulo-nome">{c.nome}</span>
                  </button>
                </li>
              ))}
            </ol>
            <button type="button" className={`atl-capitulo-aulas${painel === 'aulas' ? ' ativo' : ''}`} onClick={() => setPainel(painel === 'aulas' ? 'capitulo' : 'aulas')} aria-current={painel === 'aulas' ? 'true' : undefined}>
              {painel === 'aulas' ? (
                'Voltar ao capítulo'
              ) : (
                <>
                  Nas aulas{vistas ? <span className="atl-capitulo-aulas-n"> · {vistas.length} vistas</span> : null} <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </nav>

          <section className="atl-corpo">
            <header className="atl-abertura">
              <h1 className="atl-titulo">{painel === 'aulas' ? 'Nas aulas' : painel === 'fontes' ? 'Fontes e licenças' : capAtual.nome}</h1>
              <p className="atl-deck">
                {painel === 'aulas'
                  ? 'Cada vista abre o mapa no ponto que a aula cita, com a frase da própria aula.'
                  : painel === 'fontes'
                    ? 'De onde vem cada camada, quando foi baixada, sob que licença, e o que a fonte não traz.'
                    : capAtual.resumo}
              </p>
              {painel === 'capitulo' && <VistasDoCapitulo vistas={vistas} capitulo={capitulo} vistaAtiva={vista?.id ?? null} aoAbrir={abrirVista} />}
            </header>
            {painel === 'aulas' && <PainelAulas vistas={vistas} vistaAtiva={vista?.id ?? null} aoAbrir={abrirVista} />}
            {painel === 'fontes' && <PainelFontes indice={indice} aoVoltar={() => setPainel('capitulo')} />}
            {painel === 'capitulo' && (
              <>
                {vista && CAPITULO_COM_CAMADAS.has(vista.capitulo) && vista.capitulo === capitulo && (
                  <p className="atl-legenda-linha atl-aviso-vista">A vista da aula ligou só as camadas que ela usa; ao fechar a vista, as suas voltam.</p>
                )}
                {capitulo === 'rede' && (
                  // o painel inteiro de "A rede" é do painel-da-rede (leva 4): o número grande de "Nesta
                  // tela", a régua compacta do ano colada a ele, as lentes, as camadas e um só "Como ler".
                  // A página só passa o estado
                  <PainelRede
                    indice={indice}
                    camadas={camadas}
                    aoAlternar={alternarCamada}
                    aoDefinir={definirCamadas}
                    modo={modo}
                    escondidas={escondidas}
                    tensaoKv={tensaoKv}
                    zoom={camera.zoom}
                    limites={limites}
                    areaLivre={areaLivre}
                    ano={anoLimite}
                    aoMudarAno={mudarAno}
                    aoEscolher={escolherNaBusca}
                    donoAtivo={donoDestacado != null}
                    regua={
                      <div className="atl-rede-tempo" onPointerDownCapture={comecarArrasto}>
                        <ReguaCompactaDoAno usinas={usinasDaFrota} anoLimite={anoLimite} aoMudarAno={mudarAno} modo={modo} aoTocar={setTocandoAno} situacao={situacaoDasUsinas} />
                      </div>
                    }
                    periodos={
                      <div onPointerDownCapture={comecarArrasto}>
                        <SecaoLinhaDoTempo usinas={usinasDaFrota} anoLimite={anoLimite} aoMudarAno={mudarAno} modo={modo} aoTocar={setTocandoAno} situacao={situacaoDasUsinas} semComoLer />
                      </div>
                    }
                    donos={<SecaoDonos usinas={usinasDaFrota} dono={donoDestacado} aoMudarDono={mudarDono} aoEscolherUsina={escolherUsinaDoDono} modo={modo} situacao={situacaoDasUsinas} semComoLer />}
                    metodoDoTempo={<MetodoDoTempo usinas={usinasDaFrota} situacao={situacaoDasUsinas} />}
                    metodoDosDonos={<MetodoDosDonos usinas={usinasDaFrota} situacao={situacaoDasUsinas} />}
                  />
                )}
                {capitulo === 'agua' && (
                  <PainelAgua
                    ear={ear}
                    indice={indice}
                    mes={mesCorrente}
                    aoMudarMes={(i) => {
                      setTocando(false);
                      setMesIdx(i);
                    }}
                    tocando={tocando}
                    aoTocar={() => {
                      if (!tocando && ear && mesCorrente >= ear.meses.length - 1) setMesIdx(0);
                      setTocando((v) => !v);
                    }}
                    reduzido={reduzido}
                    modo={modo}
                    marcas={vistasComMomento}
                    aoAbrirVista={abrirVista}
                    camadas={camadas}
                    aoAlternar={alternarCamada}
                  />
                )}
                {capitulo === 'combustivel' && <PainelCombustivel indice={indice} camadas={camadas} aoAlternar={alternarCamada} aoDefinir={definirCamadas} modo={modo} escondidas={escondidas} zoom={camera.zoom} />}
                {capitulo === 'trocas' && (
                  <PainelTrocas
                    serie={intercambio}
                    indice={indice}
                    mes={mesCorrente}
                    aoMudarMes={(i) => {
                      setTocando(false);
                      setMesIdx(i);
                    }}
                    tocando={tocando}
                    aoTocar={() => {
                      if (!tocando && intercambio && mesCorrente >= intercambio.meses.length - 1) setMesIdx(0);
                      setTocando((v) => !v);
                    }}
                    reduzido={reduzido}
                    modo={modo}
                    marcas={vistasComMomento}
                    aoAbrirVista={abrirVista}
                  />
                )}
                {capitulo === 'dia' && (
                  <>
                    <AlternadorDoDia modo={modoDoDia} aoMudar={mudarModoDoDia} />
                    {modoDoDia === 'medio' ? (
                      <PainelDia perfil={perfil} indice={indice} mes={perfilCorrente} aoMudarMes={setMesPerfil} hora={hora} aoMudarHora={setHora} modo={modo} />
                    ) : (
                      <>
                        <SecaoDiaReal
                          dados={operacao}
                          erro={erroOperacao}
                          momento={momento}
                          aoMudarMomento={mudarMomento}
                          selecionado={chaveDaOperacao}
                          aoSelecionar={selecionarNaOperacao}
                          modo={modo}
                        />
                        <FonteDoDiaReal dados={operacao} />
                      </>
                    )}
                  </>
                )}
                {capitulo === 'mundo' && <PainelMundo mundo={mundo} erro={erroMundo} modo={modo} modoCor={modoMundo} aoMudarModo={setModoMundo} />}
                {capitulo === 'comercio' && (
                  <PainelComercio
                    dados={comercio}
                    erro={erroComercio}
                    filtro={filtroComercio}
                    aoMudarFiltro={setFiltroComercio}
                    // A2.3: trocar o sentido ou o produto derruba a seleção (o painel faz) e, se o Brasil
                    // saiu da tela, a câmera volta à do capítulo (o `comercioBrasilNaTela` é do controle)
                    aoMudarRecorte={() => {
                      const m = mapa.current as (MapaAtlasRef & { comercioBrasilNaTela?: () => boolean }) | null;
                      if (m && !(m.comercioBrasilNaTela?.() ?? true)) m.voarPara(CAMERA_DO_COMERCIO(estreito));
                    }}
                    selecionado={chaveDoComercio}
                    aoSelecionar={selecionarNoComercio}
                    modo={modo}
                  />
                )}
              </>
            )}
          </section>

          <footer className="atl-rodape">
            <button type="button" className="atl-link-fontes" onClick={() => setPainel(painel === 'fontes' ? 'capitulo' : 'fontes')}>
              {painel === 'fontes' ? 'Voltar ao capítulo' : 'Fontes e licenças'} <span aria-hidden="true">→</span>
            </button>
            {!estreito && (
              <button type="button" className="atl-link-atalhos" onClick={() => setAjudaAberta((v) => !v)} aria-expanded={ajudaAberta}>
                Atalhos <kbd>?</kbd>
              </button>
            )}
            {indice && (
              <p className="atl-rodape-data">
                dados de <span className="atl-num">{indice.gerado.split('-').reverse().join('/')}</span>
              </p>
            )}
          </footer>
        </div>
      </aside>

      <div className="atl-palco">
        <MapaAtlas
          ref={mapa}
          estado={estado}
          cameraInicial={cameraInicial}
          aoSelecionar={selecionarPeloMapa}
          aoPairar={aoPairar}
          aoMoverCamera={aoMoverCamera}
          aoAssentar={aoAssentar}
          aoFicarPronto={(m) => setPronto(m.msAtePronto)}
          aoFalhar={setErro}
        />
        {/* o Titã: por cima do mapa, abaixo da busca, dos controles e da ficha; fora do "O comércio" */}
        <Frontispicio mapa={mapa} ativo={capitulo !== 'comercio'} />

        <div className="atl-topo">
          {capitulo === 'mundo' ? <BuscaPais mundo={mundo} aoEscolher={(a) => selecionar(a)} aoEnquadrar={(c) => mapa.current?.voarPara(c)} /> : <BuscaAtlas aoEscolher={escolherNaBusca} modo={modo} />}
          {!estreito && (
            <div className="atl-controles" role="group" aria-label="Controles do mapa">
              <button type="button" onClick={() => mapa.current?.aproximar(1)} aria-label="Aproximar">
                +
              </button>
              <button type="button" onClick={() => mapa.current?.aproximar(-1)} aria-label="Afastar">
                −
              </button>
              {botaoGlobo}
              {enquadrarTudo}
              <button type="button" className="atl-controle-texto" onClick={() => mapa.current?.inclinar()} aria-pressed={camera.inclinacao > 10}>
                Inclinar
              </button>
              <button type="button" className="atl-controle-texto atl-controle-satelite" onClick={() => alternarCamada('satelite')} aria-pressed={camadas.has('satelite')}>
                Satélite
              </button>
              {botaoCopiar}
            </div>
          )}
        </div>

        {/* celular: zoom em coluna no canto inferior direito, acima do puxador; o resto numa folha */}
        {estreito && !temCartao && (
          <div
            className="atl-controles atl-controles-pe"
            role="group"
            aria-label="Controles do mapa"
            onKeyDown={(e) => {
              if (e.key !== 'Escape' || !folhaDaVista) return;
              e.stopPropagation();
              setFolhaDaVista(false);
            }}
          >
            <button type="button" className="atl-controle-texto atl-controle-vista" onClick={() => setFolhaDaVista((v) => !v)} aria-expanded={folhaDaVista} aria-controls={folhaDaVista ? idFolha : undefined}>
              Mapa
            </button>
            {/* depois do botão no DOM (o Tab chega nela em seguida); na tela, à esquerda dele */}
            {folhaDaVista && (
              <div
                className="atl-folha-vista"
                id={idFolha}
                // a folha fecha depois de uma escolha (crítica do celular, achado 4); o "Link" espera
                // o "Copiado" ser visto antes de fechar
                onClick={(e) => {
                  const b = (e.target as HTMLElement).closest('button');
                  if (!b) return;
                  if (b.classList.contains('atl-controle-copiar')) window.setTimeout(() => setFolhaDaVista(false), 1400);
                  else setFolhaDaVista(false);
                }}
              >
                {botaoGlobo}
                {enquadrarTudo}
                <button type="button" className="atl-controle-texto" onClick={() => mapa.current?.inclinar()} aria-pressed={camera.inclinacao > 10}>
                  Inclinar
                </button>
                <button type="button" className="atl-controle-texto atl-controle-satelite" onClick={() => alternarCamada('satelite')} aria-pressed={camadas.has('satelite')}>
                  Satélite
                </button>
                {botaoCopiar}
              </div>
            )}
            <button type="button" onClick={() => mapa.current?.aproximar(1)} aria-label="Aproximar">
              +
            </button>
            <button type="button" onClick={() => mapa.current?.aproximar(-1)} aria-label="Afastar">
              −
            </button>
          </div>
        )}

        <DicaDoMapa alca={dica} ativa={!estreito} />

        <p className="so-leitor" role="status">
          {copiado === 'sim' ? 'Endereço desta vista copiado.' : copiado === 'falhou' ? 'O navegador não deixou copiar o endereço.' : ''}
        </p>

        {ajudaAberta && (
          <div className="atl-atalhos" role="dialog" aria-label="Atalhos de teclado">
            <p className="v-dado atl-atalhos-titulo">Atalhos de teclado</p>
            <dl>
              {ATALHOS.map(([k, t]) => (
                <div key={k}>
                  <dt>
                    <kbd>{k}</kbd>
                  </dt>
                  <dd>{t}</dd>
                </div>
              ))}
            </dl>
            <button type="button" className="atl-atalhos-fechar" onClick={() => setAjudaAberta(false)}>
              Fechar
            </button>
          </div>
        )}

        {erro && (
          <div className="atl-aviso" role="alert">
            <p>{erro}</p>
            <button type="button" onClick={() => setErro(null)}>
              Fechar aviso
            </button>
          </div>
        )}

        {vistaInexistente && (
          <div className="atl-aviso" role="status">
            <p>A vista “{vistaId}” não existe no Atlas. O mapa abriu no enquadramento geral.</p>
            <button type="button" onClick={fecharVista}>
              Fechar aviso
            </button>
          </div>
        )}

        {vista && !selecionado && <CartaoDaVista vista={vista} todas={vistas ?? []} aoAbrir={abrirVista} aoFechar={fecharVista} aoReenquadrar={() => mapa.current?.voarPara(cameraDaVista(vista))} />}

        {/* a ficha do comércio espera o arquivo (o clique no mapa só existe com ele carregado) */}
        {selecionado?.tipo === 'comercio' && comercio && (
          <FichaDoComercio dados={comercio} chave={selecionado.chave} aoFechar={() => setSelecionado(null)} aoSelecionar={selecionarNoComercio} modo={modo} />
        )}

        {/* a ficha da operação espera o arquivo e o momento (só existe no dia real) */}
        {chaveDaOperacao && operacao && momento && (
          <FichaDaOperacao dados={operacao} chave={chaveDaOperacao} momento={momento} aoFechar={() => setSelecionado(null)} aoSelecionar={(c) => selecionarNaOperacao(c)} modo={modo} />
        )}

        {selecionado && selecionado.tipo !== 'comercio' && selecionado.tipo !== 'operacao' && (
          <FichaDoAtivo
            ativo={selecionado}
            indice={indice}
            earRes={earRes}
            ear={ear}
            mes={capitulo === 'agua' ? mesCorrente : null}
            ano={capitulo === 'rede' ? anoLimite : null}
            mundo={mundo}
            modo={modo}
            satelite={camadas.has('satelite')}
            aoFechar={() => setSelecionado(null)}
            aoAbrirOutro={selecionar}
            aoAproximar={() => mapa.current?.enquadrar(selecionado)}
            aoVerFoto={() => {
              definirCamadas(['satelite'], true);
              mapa.current?.voarPara({ centro: selecionado.lngLat, zoom: 13.2 });
            }}
            aoPedirSerie={() => {
              if (!earRes) carregarSerieEarReservatorios().then(setEarRes, () => undefined);
              if (!ear) carregarSerieEar().then(setEar, () => undefined);
            }}
          />
        )}

        <p className="atl-credito">
          {capitulo === 'combustivel'
            ? 'ANP · ANEEL'
            : capitulo === 'mundo'
              ? // "O mundo" desenha só os países e a base: o crédito cita só isso (A1.6)
                'Our World in Data · Natural Earth'
              : capitulo === 'comercio'
                ? 'MDIC/Comex Stat · ONS · Natural Earth'
                : capitulo === 'dia' && modoDoDia === 'real'
                  ? // dia real: a geração e o corte são do ONS; o ponto de cada usina, do cadastro da ANEEL
                    'ONS (geração por usina, corte eólico e solar) · ANEEL'
                  : 'ANEEL · ONS'}{' '}
          · base © Mapbox © OpenStreetMap
        </p>
      </div>
    </main>
  );
}

/** País que cruza o antimeridiano (Fiji, Rússia) vem da Natural Earth com um
 *  salto de +180° para −180° dentro do mesmo anel; desenhado assim, o polígono
 *  dá a volta no globo como uma faixa. Aqui cada anel fica contínuo: quando dois
 *  vértices seguidos saltam mais de 180°, o resto do anel é deslocado 360°. A
 *  forma não muda — só a representação da longitude. */
function semSaltoNoAntimeridiano(g: Geometry): Geometry {
  const anel = (pts: Position[]): Position[] => {
    let desloc = 0;
    const saida: Position[] = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const d = pts[i][0] - pts[i - 1][0];
      if (d > 180) desloc -= 360;
      else if (d < -180) desloc += 360;
      saida.push(desloc ? [pts[i][0] + desloc, pts[i][1]] : pts[i]);
    }
    return saida;
  };
  if (g.type === 'Polygon') return { type: 'Polygon', coordinates: g.coordinates.map(anel) };
  if (g.type === 'MultiPolygon') return { type: 'MultiPolygon', coordinates: g.coordinates.map((p) => p.map(anel)) };
  return g;
}

/** O modo (claro/noturno) é guardado pela casca; o Atlas precisa reagir quando
 *  ela troca. A casca grava em localStorage e marca `data-modo` na raiz .alx3:
 *  observamos o atributo, que é a fonte de verdade do que está na tela. */
function useModoV3ComEvento(): [ReturnType<typeof useModoV3>[0]] {
  const [inicial] = useModoV3();
  const [modo, setModo] = useState(inicial);
  useEffect(() => {
    const raiz = document.querySelector('.alx3');
    if (!raiz) return;
    const ler = () => setModo(raiz.getAttribute('data-modo') === 'noturno' ? 'noturno' : 'claro');
    ler();
    const obs = new MutationObserver(ler);
    obs.observe(raiz, { attributes: true, attributeFilter: ['data-modo'] });
    return () => obs.disconnect();
  }, []);
  return [modo];
}
