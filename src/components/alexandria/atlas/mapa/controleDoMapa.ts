// Atlas da Alexandria v3 — controle imperativo do mapa.
//
// O React guarda o estado (capítulo, camadas, seleção, tempo); este arquivo é
// a única parte que conversa com o mapbox-gl. Toda mudança de estado passa por
// `atualizar`, que aplica só a diferença: o passo do tempo (mês, hora) toca só
// em cor e feature-state; o resto (capítulo, camadas, seleção, destaque) refaz
// filtros e visibilidade. Trocar de modo (claro/noturno) reconstrói o estilo
// inteiro e remonta fontes, camadas, ícones, feature-state e relevo a partir do
// estado corrente.

import mapboxgl from 'mapbox-gl';
import type { Feature, FeatureCollection, Geometry, MultiPolygon, Point, Polygon, Position } from 'geojson';
import type { ModoV3 } from '@/components/alexandria/v3/usoV3';
import { anoDeEntrada, kwNoAno } from '@/lib/alexandria/atlas/tempo';
import {
  carregarBacias,
  carregarLinhas,
  carregarReservatorios,
  carregarSubestacoes,
  carregarSubmercados,
  carregarUsinasMenores,
  carregarUsinasPrincipais,
  type FeicaoUsina,
} from '@/lib/alexandria/atlas/dados';
import {
  ALMA_DA_CC,
  ANTES_DOS_ROTULOS,
  CATEGORIAS_QUADRADAS,
  FONTES_DO_MAPA,
  LADO_DA_ANCORA,
  LADO_DA_CIDADE,
  LADO_DA_INSTALACAO,
  LADO_DA_SUBESTACAO,
  LADO_DO_QUADRADO_POR_RAIO,
  LADO_DO_SELO,
  PALETA,
  ROTULOS_DA_BASE,
  SDF_FORMA,
  atmosfera,
  corDaLinha,
  corDaUsina,
  corDaUsinaTranslucida,
  corDoRotuloDaBase,
  desenharAncora,
  desenharCidade,
  desenharInstalacao,
  desenharSelo,
  desenharSubestacao,
  deslocamentoDosParalelos,
  estiloDoMapa,
  imagemSdf,
  larguraDaLinha,
  porteDaSubestacao,
  type PaletaDoMapa,
  type TipoDeInstalacao,
} from '@/lib/alexandria/atlas/estilo';
import type { CamadaDeMaquetes } from './camada3d';
import {
  LARGURA_DO_CELULAR,
  MODELOS,
  NIVEIS,
  RESUMO_INATIVO,
  ZOOM_DA_MAQUETE_INTEIRA,
  ZOOM_DAS_MAQUETES,
  ZOOM_DO_OLEO_PEQUENO,
  KW_DO_OLEO_PEQUENO,
  encurtarNome,
  adiarEntrada,
  escolherMaquetes,
  lojaDoResumo,
  lojaDosConjuntos,
  metrosPorPixel,
  raioDoConjuntoM,
  type ConjuntoNaTela,
  type EscolhaDeMaquetes,
  type PontoDeMaquete,
  type UsinaDoConjunto,
  type MotivoDoForcado,
  type PedidoDeMaquetes,
  type ResumoDaEscolha,
  type TipoDeMaquete,
} from './maquetes';
import {
  ARQUIVO_DA_CAMADA,
  FC,
  FILTRO_ZOOM_DO_ROTULO,
  HALO_DO_COMBUSTIVEL,
  TIPO_DA_CAMADA,
  arquivoDoId,
  carregarDoCombustivel,
  montarAreas,
  montarDutos,
  montarInstalacoes,
  montarRotulos,
  rotulosDasAreas,
  type ArquivoDoCombustivel,
} from './combustivel';
import { ALVOS_DA_DISTRIBUICAO, CamadaDaDistribuicao } from './distribuicao';
import { CamadaDoComercio } from './comercio';
import { CamadaDoPulso } from './pulso';
import type { MomentoDaOperacao } from '@/lib/alexandria/atlas/operacao';
import { chavesDoDono } from '@/lib/alexandria/atlas/donos';
import { FILTRO_INICIAL_DO_COMERCIO, type FiltroDoComercio } from '@/lib/alexandria/atlas/comercio';
import { FAIXAS, FAIXA_DA_SOMA_COMPLETA, KW_MINIMO_NA_SOMA_DE_LONGE, REGRA_DA_FAIXA, ZOOM_SEM_AGREGACAO, faixaDoZoom, marcarGeneralizacao, raioDaFaixaKm, type Agregado, type Faixa, type Generalizacao } from './generalizacao';
import {
  CAMADAS_DO_COMBUSTIVEL,
  CATEGORIAS,
  CATEGORIAS_DO_COMBUSTIVEL,
  SUBSISTEMA_DO_SUBMERCADO,
  type AtivoSelecionado,
  type CamadaDoCombustivel,
  type CamadaId,
  type CapituloId,
  type Categoria,
  type Subsistema,
  type TipoDeAtivo,
} from '@/lib/alexandria/atlas/tipos';

// ── estado que o React entrega ───────────────────────────────────────

/** O que uma vista (ou a busca) pede para ficar em evidência. */
export interface Destaque {
  /** CEG das usinas */
  usinas?: string[];
  /** id (EQP_ID) das linhas */
  linhas?: string[];
  /** id das subestações */
  subestacoes?: string[];
  /** código de planejamento dos reservatórios */
  reservatorios?: string[];
  /** siglas: SE, S, NE, N */
  submercados?: Subsistema[];
  /** nome da bacia, como no arquivo do ONS */
  bacias?: string[];
  /** código ISO alpha-3 dos países (capítulo mundo) */
  paises?: string[];
  /** id dos ativos de gás e petróleo da ANP (gasoduto, instalação, campo, bloco, bacia sedimentar, pré-sal) */
  combustivel?: string[];
  /** true quando o destaque vem de uma vista de aula: o mapa afrouxa o limiar de zoom */
  deVista?: boolean;
}

export interface CameraAlvo {
  /** [oeste, sul, leste, norte] — preferido: adapta-se ao tamanho da tela */
  limites?: [number, number, number, number];
  centro?: [number, number];
  zoom?: number;
  inclinacao?: number;
  rumo?: number;
  /** alvo com centro: pousa exatamente nele, sem deslocar pelas margens dos painéis (o ?cam= do endereço) */
  exato?: boolean;
  /** a composição do Titã (frontispício): o globo inteiro nas mãos da gravura, no zoom e no
   *  padding que `comporTita` mede para esta tela. `centro` opcional (padrão CENTRO_DO_TITA). */
  tita?: boolean;
  /** só na câmera inicial com `tita`: segura PAUSA_DO_TITA ms e voa a este alvo (o gesto do leitor cancela) */
  depois?: CameraAlvo;
  /** só na câmera inicial (o ?cam= do endereço): se o zoom está na escala do Titã (até
   *  zRepouso + ZOOM_DE_ASSENTAR_NO_TITA) e a câmera não está inclinada, o Atlas abre NA
   *  composição, centrado no `centro` do link, sem voo automático (A1.5 da leva 3) */
  titaSePerto?: boolean;
}

/** O globo na tela (px do canvas): centro projetado, raio aparente do limbo, e o zoom de
 *  repouso da composição do Titã (a gravura esmaece pela distância a ele). */
export interface GloboNaTela {
  cx: number;
  cy: number;
  r: number;
  zoom: number;
  inclinacao: number;
  zRepouso: number;
  /** 0..1: a composição cabe na área livre (1) ou não (0: a gravura esmaece). Multiplica a
   *  opacidade que o Frontispicio calcula pela distância a zRepouso e pela inclinação. */
  opacidade: number;
}

/** Geometria da gravura `grav-atlas-segurando-o-globo.png` (1536 × 1024), medida no alfa do
 *  arquivo (scratchpad l2-tita/maos.cjs): o círculo de raio 0,357 × largura que encosta nas
 *  duas mãos tem o centro em x 0,5043 da largura e 0,3577 da ALTURA acima do topo da imagem
 *  (as mãos entram ~1,2% do raio no globo: a máscara as corta no limbo, "segurando"). O pé do
 *  pedestal fica em 93,3% da altura; a figura opaca vai de x 0,2415 a 0,7708. */
export const GRAVURA_DO_TITA = { raio: 0.357, centroX: 0.5043, centroY: -0.3577, pe: 0.933, proporcao: 1024 / 1536 } as const;
/** altura da composição, do topo do globo ao pé do pedestal, em raios do globo (3,41) */
const ALTURA_DO_TITA_EM_RAIOS =
  1 + ((-GRAVURA_DO_TITA.centroY + GRAVURA_DO_TITA.pe) * GRAVURA_DO_TITA.proporcao) / GRAVURA_DO_TITA.raio;
/** o globo que o Titã segura: o Atlântico Sul e o Brasil de frente */
export const CENTRO_DO_TITA: [number, number] = [-45, -8];
/** a abertura segura o Titã por este tempo antes de voar (ms) */
// decisões leva 4, 2.6 (critico-celular 10): a 390 a gravura durava ~1 s inteira. Com 2,0 s
// ela ficou inteira 1,78 s (medido do data-pronto ao início do voo); 2,1 s dá a folga dos 1,8 s
const PAUSA_DO_TITA = 2100;
/** acima de zRepouso + isto a gravura já sumiu: o padding da composição volta a 0 */
export const ZOOM_DE_SAIDA_DO_TITA = 0.6;
/** até zRepouso + isto, a câmera parada (afastada à mão, ou aberta por ?cam=) assenta na composição */
export const ZOOM_DE_ASSENTAR_NO_TITA = 0.35;
/** A rede entra em rampa, relativa ao zoom de repouso da composição (A1.1 da leva 3): nada de
 *  símbolo de usina, anel, selo, subestação nem rótulo de submercado até zRepouso + 0,25; inteira
 *  em zRepouso + 0,7. Perto da composição o Brasil é só a silhueta dos submercados e a malha das
 *  linhas em fio fino. No celular (zRepouso 0,84) a rampa termina antes do pouso em 1,88. */
export const RAMPA_DA_REDE_NO_TITA: readonly [number, number] = [0.25, 0.7];
/** raio mínimo do globo (px) na composição com a gravura: abaixo disto a gravura esmaece */
const RAIO_MINIMO_DO_TITA = 120;
const SEM_PADDING = { top: 0, bottom: 0, left: 0, right: 0 };

/** Fluxo líquido entre dois subsistemas num mês (capítulo "trocas"). */
export interface Troca {
  de: Subsistema;
  para: Subsistema;
  mw: number;
}

/** Geração por fonte num subsistema, numa hora (capítulo "dia"). */
export interface FatiaDoDia {
  sub: Subsistema;
  hidro: number;
  termica: number;
  eolica: number;
  solar: number;
  carga: number;
}

export interface EstadoDoMapa {
  modo: ModoV3;
  capitulo: CapituloId;
  camadas: ReadonlySet<CamadaId>;
  selecionado: AtivoSelecionado | null;
  destaque: Destaque | null;
  /** % de energia armazenada por subsistema no mês corrente (capítulo água) */
  earSubsistema: Partial<Record<Subsistema, number | null>> | null;
  /** % por reservatório (código de planejamento → %) */
  earReservatorio: Record<string, number | null> | null;
  trocas: Troca[] | null;
  dia: FatiaDoDia[] | null;
  /** Maior valor (MW), entre os quatro subsistemas e as 24 horas do mês exibido, de
   *  max(geração somada, carga). É a régua fixa dos discos do capítulo "dia"; sem ele,
   *  o controle só conhece a hora corrente e a escala muda de hora em hora. */
  tetoDoDia?: number;
  /** cor por país (ISO alpha-3 → cor), capítulo mundo */
  coresDoMundo: Record<string, string> | null;
  /** feições de país (Natural Earth), carregadas pelos capítulos mundo e comércio */
  paises: FeatureCollection | null;
  /** o que o capítulo "O comércio" mostra (sentido, produtos, maiores ou todas) */
  filtroDoComercio?: FiltroDoComercio;
  /** B1 (linha do tempo, capítulo "A rede"): null = hoje. Com ano, o mapa mostra só o que já
   *  existia: usina com `ano <= anoLimite`; linha e subestação com `op <= anoLimite`, ou com a
   *  data de carga da base (`opAntesDe`) <= anoLimite. O que não tem ano fica num estado próprio
   *  ("sem ano no cadastro": contorno em tinta suave, fora da soma), nunca no ano zero. O que
   *  ainda não opera (usina futura, linha e subestação previstas) sai. */
  anoLimite?: number | null;
  /** true enquanto o leitor arrasta a régua do ano: o mapa aplica só o filtro e refaz a soma do
   *  símbolo somado ao soltar (ver aplicarAno) */
  anoArrastando?: boolean;
  /** 'AAAA-MM' do mês que a régua de "A água" ou de "As trocas" mostra (null fora deles): antes de
   *  set/2025 Roraima não é Norte (critico-honestidade 9; submercados.geojson › roraimaAParte) */
  mesDosSubmercados?: string | null;
  /** B2 (quem é dono): a chave normalizada de donos.ts; as usinas dele vão por cima, as demais
   *  esmaecem (sem óxido). null = nenhum */
  donoDestacado?: string | null;
  /** B3 (capítulo "Um dia", modo dia real): o dia e a hora; null = o perfil médio do mês */
  momentoDaOperacao?: MomentoDaOperacao | null;
  movimentoReduzido: boolean;
  /** margens ocupadas por painéis, para o enquadramento não ficar atrás deles */
  margens: { esquerda: number; direita: number; topo: number; base: number };
}

export interface Pairado {
  x: number;
  y: number;
  tipo: TipoDeAtivo;
  titulo: string;
  detalhe: string | null;
}

export interface RetornosDoMapa {
  aoSelecionar: (a: AtivoSelecionado | null) => void;
  aoPairar: (p: Pairado | null) => void;
  aoMoverCamera: (c: { zoom: number; centro: [number, number] }) => void;
  aoFicarPronto: (m: { msAtePronto: number }) => void;
  aoFalhar: (mensagem: string) => void;
  /** a câmera assentou (moveend): `limites` é o de `limitesDaTela()` naquele instante e
   *  `poligono` o de `poligonoDaTela()` (null de cima e sem rumo: vale a caixa) */
  aoAssentar?: (c: { limites: [number, number, number, number] | null; poligono: [number, number][] | null; zoom: number }) => void;
}

// ── constantes de desenho ────────────────────────────────────────────

export const BRASIL: [number, number, number, number] = [-74.2, -34.0, -34.6, 5.6];

/** Potência mínima (kW) que o mapa mostra em cada zoom. A legenda repete isto
 *  pela mesma conta do filtro (`limiarNoZoom`), e não pela tabela crua: o Mapbox
 *  avalia ['zoom'] de filtro no zoom INTEIRO do tile (o da fonte GeoJSON é o piso
 *  do zoom da câmera), então um degrau em 4,2 só passa a valer no zoom 5. */
export const LIMIAR_POR_ZOOM: [number, number][] = [
  [0, 300_000],
  [4.2, 100_000],
  [5.2, 30_000],
  [6.2, 5000],
  [7.6, 1000],
  [9, 0],
];

/** O degrau que o filtro do mapa usa (com a folga da vista), comparado com o zoom do tile. */
const degrau = (z: number, folga: number) => Math.max(0.1, z - folga);

/** Valor da tabela que o MAPA está desenhando neste zoom: mesma conta de `passo`,
 *  no zoom inteiro do tile. Assim a legenda não diverge do que se vê. */
function valorNoZoom(pares: [number, number][], zoom: number, folga: number): number {
  const zt = Math.floor(zoom);
  let v = pares[0][1];
  for (const [z, val] of pares.slice(1)) if (zt >= degrau(z, folga)) v = val;
  return v;
}

export function limiarNoZoom(zoom: number, folga = 0): number {
  return valorNoZoom(LIMIAR_POR_ZOOM, zoom, folga);
}

/** O que o filtro das usinas em operação esconde num zoom de câmera. */
export interface EscondidasNoZoom {
  /** potência mínima (kW); 0 = nenhum piso. Com `somaDaFaixa`, é o piso da SOMA do símbolo */
  limiarKw: number;
  /** vizinhas da mesma fonte ficam na maior (que passa a levar a soma delas) */
  generaliza: boolean;
  /** geradores a óleo abaixo desta potência (kW) ficam fora; 0 = nenhum */
  oleoAbaixoDeKw: number;
  /** o piso compara a soma do agregado (fora da vista de aula, abaixo do zoom 10) */
  somaDaFaixa: boolean;
  /** raio de agrupamento deste zoom, em km (a 15° S); null quando não há agregação */
  raioKm: number | null;
  /** piso da soma para o selo da fonte (kW); null fora da agregação */
  seloKw: number | null;
}

/** Expressão `step` por faixa de agregação (3 a 9, no zoom inteiro do tile) e o valor de 10 em diante. */
const porFaixa = (f: (b: Faixa) => unknown, depois: unknown): unknown[] => {
  const e: unknown[] = ['step', ['zoom'], f(3)];
  for (const b of FAIXAS.slice(1)) e.push(b, f(b));
  e.push(ZOOM_SEM_AGREGACAO, depois);
  return e;
};
/** A soma que o símbolo representa na faixa (a própria potência quando não soma ninguém). */
const somaNa = (b: Faixa): unknown[] => ['coalesce', ['get', `s${b}`], ['get', 'kw']];
/** Membros do agregado na faixa (1 quando não soma ninguém). */
const membrosNa = (b: Faixa): unknown[] => ['coalesce', ['get', `n${b}`], 1];

/** A regra das usinas em operação, num lugar só: `filtro` é o que o mapa aplica (avaliado pelo
 *  Mapbox no zoom inteiro do tile) e `noZoom` é a mesma regra lida num zoom de câmera, para a
 *  frase do painel. As duas leem as mesmas constantes; mudar uma muda a outra.
 *  Fora da vista de aula, abaixo do zoom 10, o símbolo é o AGREGADO (generalizacao.ts): o piso
 *  e o selo leem a soma da faixa. Na vista de aula nada é agregado nem escondido pela
 *  generalização: o piso lê a potência própria (LIMIAR_POR_ZOOM, com a folga da vista). */
export const REGRA_DAS_USINAS = {
  filtro(folga: number, deVista: boolean) {
    const gen = ['coalesce', ['get', 'gen'], 0];
    const fica = (b: Faixa): unknown[] => ['==', ['%', ['floor', ['/', gen, 2 ** (b - 3)]], 2], 0];
    const kw = ['get', 'kw'];
    return {
      limiar: (deVista ? ['>=', kw, passo(LIMIAR_POR_ZOOM, folga)] : porFaixa((b) => ['>=', somaNa(b), REGRA_DA_FAIXA[b].pisoKw], true)) as unknown,
      // na vista de aula o destaque não esconde ninguém
      generalizada: (deVista ? true : porFaixa(fica, true)) as unknown,
      // achado O4: na metrópole, centenas de grupos geradores a óleo (prédio, shopping, banco)
      // cobriam a cena; abaixo de 5 MW eles só aparecem do zoom 13 em diante
      oleoPequeno: ['any', ['!=', ['get', 'cat'], 'oleo'], ['>=', ['get', 'kw'], ['step', ['zoom'], KW_DO_OLEO_PEQUENO, ZOOM_DO_OLEO_PEQUENO, 0]]] as unknown,
      // selo da fonte: pela soma desde o zoom 3; na vista de aula, como antes (do zoom 5, pela potência própria)
      selo: (deVista ? ['all', ['>=', ['zoom'], 5], ['>=', kw, passo(SELO_POR_ZOOM, folga)]] : porFaixa((b) => ['>=', somaNa(b), REGRA_DA_FAIXA[b].seloKw], true)) as unknown,
      // o símbolo soma mais de uma usina nesta faixa (anel; sem nome de usina no mapa)
      agregado: (deVista ? false : porFaixa((b) => ['>', membrosNa(b), 1], false)) as unknown,
    };
  },
  noZoom(zoom: number, folga: number, deVista: boolean): EscondidasNoZoom {
    const zt = Math.floor(zoom);
    const b = deVista ? null : faixaDoZoom(zoom);
    return {
      limiarKw: b ? REGRA_DA_FAIXA[b].pisoKw : deVista ? limiarNoZoom(zoom, folga) : 0,
      generaliza: b != null,
      oleoAbaixoDeKw: zt < ZOOM_DO_OLEO_PEQUENO ? KW_DO_OLEO_PEQUENO : 0,
      somaDaFaixa: b != null,
      raioKm: b ? Math.round(raioDaFaixaKm(b)) : null,
      seloKw: b ? REGRA_DA_FAIXA[b].seloKw : null,
    };
  },
};

/** A regra das subestações (camada e filtro leem daqui; a legenda escreve o limiar): a camada
 *  começa no zoom 4,6 só com as de 500 kV ou mais, e do zoom 7 (de tile) em diante mostra todas. */
export const REGRA_DAS_SUBESTACOES = { aPartirDoZoom: 4.6, todasNoZoom: 7, kvDeLonge: 500 } as const;

/** Tensão mínima (kV) das linhas em cada zoom (mesma regra de leitura da tabela acima). */
export const TENSAO_POR_ZOOM: [number, number][] = [
  [0, 440],
  [4.4, 345],
  [5.4, 0],
];

export function tensaoNoZoom(zoom: number, folga = 0): number {
  return valorNoZoom(TENSAO_POR_ZOOM, zoom, folga);
}

/** Expressão step por zoom. `folga` antecipa cada degrau (em níveis de zoom). */
const passo = (pares: [number, number][], folga = 0): unknown[] => {
  const e: unknown[] = ['step', ['zoom'], pares[0][1]];
  for (const [z, v] of pares.slice(1)) e.push(degrau(z, folga), v);
  return e;
};

/** Primeiro degrau da tabela que deixa passar usina abaixo de 5 MW: as menores
 *  (usinas-menores.json, todas abaixo de 5.000 kW) só podem aparecer dali em diante. */
const DEGRAU_DAS_MENORES = LIMIAR_POR_ZOOM.find(([, v]) => v < 5000)?.[0] ?? 7.6;

/** Zoom de câmera a partir do qual o arquivo das menores é buscado: meio nível antes
 *  do zoom de tile em que o filtro começa a desenhá-las (com a folga da vista). */
const zoomDasMenores = (folga: number) => Math.ceil(degrau(DEGRAU_DAS_MENORES, folga)) - 0.5;
/** Fora da vista, a faixa 7 já soma as menores (generalizacao.ts): o arquivo chega meio nível antes. */
const ZOOM_DAS_MENORES_NA_SOMA = 6.5;

export { ZOOM_DAS_MAQUETES } from './maquetes';

// ── medição da colocação (só desenvolvimento: window.__atlas, montado em AtlasV3) ──

type Caixa = [number, number, number, number];

/** Uma maquete desenhada, como a medição a vê. Px de CSS relativos ao canvas do mapa. */
export interface ItemDeMaquete {
  /** usina:<id do cadastro> · anp:<id> · se:<índice> · torre:<lon,lat> */
  id: string;
  tipo: TipoDeMaquete;
  familia: 'usina' | 'rede' | 'anp' | 'torre';
  nome: string | null;
  /** potência do cadastro (usinas); null para rede, ANP e torre */
  mw: number | null;
  lon: number;
  lat: number;
  /** modelo desenhado (o simplificado das torres quando pequeno) */
  arquivo: string;
  /** maior medida pretendida na tela (px), a da lei de tamanho em vigor */
  L: number;
  /** ponto do cadastro projetado por map.project */
  pe: [number, number];
  /** origem do modelo desenhado (pé da maquete, com a altitude do relevo) projetada pela câmera 3D */
  peDesenhado: [number, number] | null;
  /** caixa dos 8 cantos da bbox do modelo desenhado (a laje só quando desenhada) */
  caixaMedida: Caixa | null;
  /** caixa de todos os vértices desenhados (silhueta; o rotor pelo disco varrido) */
  caixaJusta: Caixa | null;
  /** escala local no ponto (px por metro no chão) */
  k: number;
  /** zoom efetivo no ponto, medido: zoom + log2(k_ponto / k_centro) */
  zEfMedido: number;
  // a regra nova (especificação §11–12)
  mwConjunto?: number;
  membros?: string[];
  nivel?: 0 | 1 | 2 | 3 | 4;
  zEf?: number;
  prio?: number;
  forcado?: boolean;
  histerese?: boolean;
  /** caixa calculada pela escolha (a medida é caixaMedida) */
  caixa?: Caixa;
  escalaVertical?: number;
  deCima?: boolean;
  rotorGira?: boolean;
  /** o modelo está desenhado em 3D agora (false: câmera de cima ou satélite de perto) */
  desenhado3d?: boolean;
  /** a lei sem a escala real */
  Llei?: number;
  /** índice da linha (torres) */
  linha?: number;
  /** caixa prevista do rótulo do vencedor e se ele é permanente */
  rotulo?: { linha2: string; mostrar: boolean; caixa: Caixa } | null;
}

export interface MedidaDasMaquetes {
  itens: ItemDeMaquete[];
  resumo: {
    centro: [number, number];
    zoom: number;
    inclinacao: number;
    rumo: number;
    largura: number;
    altura: number;
    /** px por metro no centro da tela */
    kCentro: number;
    satelite: boolean;
    relevo: boolean;
    /** a camada 3D está visível (maquetesLigadas) */
    ligadas: boolean;
    capitulo: CapituloId;
    total: number;
    porFamilia: Record<string, number>;
    porTipo: Record<string, number>;
    // a regra nova (especificação §11)
    nivel?: number;
    R_km?: number;
    usinasNaTela?: number;
    mwNaTela?: number;
    conjuntos?: number;
    comMaquete?: number;
    mwRepresentado?: number;
    cortadosPeloTeto?: number;
    cortadosPorEspaco?: number;
    forcados?: number;
    /** o resumo inteiro da escolha (o aviso lê o mesmo) */
    escolha?: ResumoDaEscolha;
    /** média dos últimos 10 tempos da escolha (ms) */
    msDaEscolha?: number;
  };
}

export interface RotuloMedido {
  camada: string;
  id: string | number | null;
  texto: string | null;
  /** caixa na tela, px de CSS relativos ao canvas */
  caixa: Caixa;
  /** colisao: caixa de colisão do Mapbox menos o text-padding (±1 px); estimada: ponto + measureText */
  fonte: 'colisao' | 'estimada';
}

/** Camadas de rótulo que a medição lê: vencedor da maquete, usina, subestação, instalação da ANP, reservatório e cidade. */
export const CAMADAS_DE_ROTULO_MEDIDAS = ['maquetes-rotulo', 'usinas-rotulo', 'subestacoes', 'combustivel-rotulo', 'reservatorios-rotulo', 'base-rotulo-cidade'] as const;

let controleEmDepuracao: ControleDoMapa | null = null;
/** O controle vivo, para a depuração (window.__atlas). Só em desenvolvimento. */
export const controleParaDepuracao = (): ControleDoMapa | null => controleEmDepuracao;

const F = {
  linhas: 'atlas-linhas',
  subestacoes: 'atlas-subestacoes',
  usinas: 'atlas-usinas',
  reservatorios: 'atlas-reservatorios',
  bacias: 'atlas-bacias',
  submercados: 'atlas-submercados',
  rotulosSub: 'atlas-submercados-rotulo',
  /** Roraima fora do Norte (contorno), nos meses e anos antes da interligação */
  roraima: 'atlas-roraima',
  selecao: 'atlas-selecao',
  destaque: 'atlas-destaque',
  paises: 'atlas-paises',
  /** B2: as usinas do dono destacado (cópias, com a soma entre elas), por cima das demais */
  dono: 'atlas-dono',
  /** vencedores da escolha das maquetes: âncora, selo da troca e rótulo (maquetes.ts) */
  maquetes: 'atlas-maquetes',
  /** caixa de tela de cada maquete como obstáculo de rótulo (e alvo de clique e hover) */
  maquetesObstaculo: 'atlas-maquetes-obstaculo',
  /** área de toque dos membros dos conjuntos com maquete */
  maquetesMembros: 'atlas-maquetes-membros',
  /** destaque do conjunto no hover e na seleção: anel nos membros, envoltória */
  maquetesDestaque: 'atlas-maquetes-destaque',
  /** obstáculos transparentes nas bordas do canvas (rótulo cortado na borda) */
  borda: 'atlas-borda',
  // capítulo do combustível (ANP)
  ...FC,
} as const;

const VAZIA: FeatureCollection = { type: 'FeatureCollection', features: [] };

/** submercados.geojson com o membro roraimaAParte (agente dados, leva 4): o Norte sem Roraima e
 *  o anel de Roraima, para os meses e anos antes da interligação. */
interface ComRoraimaAParte extends FeatureCollection {
  roraimaAParte?: {
    noNorteDesde: string;
    primeiroMesNoNorte: string;
    primeiroAnoNoNorte: number;
    roraima: Polygon;
    norteSemRoraima: MultiPolygon;
    nota: string;
  };
}

/** Tipo do filtro aceito por setFilter (a tipagem do mapbox-gl 3.0 não o exporta com nome). */
type Filtro = Parameters<mapboxgl.Map['setFilter']>[1];

/** Camadas que respondem a clique e hover, na ordem de prioridade. */
const ALVOS: { camada: string; tipo: TipoDeAtivo }[] = [
  // o selo é maior que o símbolo proporcional das usinas pequenas: vem primeiro
  // a instalação de gás e petróleo é desenhada por cima do selo e do símbolo da usina
  { camada: 'combustivel-instalacoes', tipo: 'instalacao' },
  // B2: as do dono destacado, por cima das esmaecidas
  { camada: 'dono', tipo: 'usina' },
  { camada: 'usinas-selo', tipo: 'usina' },
  { camada: 'usinas', tipo: 'usina' },
  // B1: a sem ano no cadastro (com um ano escolhido)
  { camada: 'usinas-sem-ano', tipo: 'usina' },
  { camada: 'usinas-futuras', tipo: 'usina' },
  { camada: 'reservatorios', tipo: 'reservatorio' },
  { camada: 'subestacoes', tipo: 'subestacao' },
  { camada: 'linhas-toque', tipo: 'linha' },
  { camada: 'gasodutos-toque', tipo: 'gasoduto' },
  // áreas do combustível, da mais específica para a mais ampla
  { camada: 'campos-area', tipo: 'campo' },
  { camada: 'blocos-area', tipo: 'bloco' },
  { camada: 'presal-area', tipo: 'presal' },
  { camada: 'bacias-sed-area', tipo: 'bacia-sedimentar' },
  // a bacia só está visível quando o leitor a ligou: ligada, ela vence a distribuidora (que
  // cobre o país quase inteiro e, antes dela, deixava a bacia sem clique) e o submercado
  { camada: 'bacias-area', tipo: 'bacia' },
  // distribuidoras (capítulo da rede): a permissionária, desenhada por cima, vence
  ...ALVOS_DA_DISTRIBUICAO.map((camada) => ({ camada, tipo: 'distribuidora' as const })),
  { camada: 'submercados-area', tipo: 'submercado' },
  { camada: 'paises-area', tipo: 'pais' },
];

/** Subestação que só existe no SINDAT como prevista: sem data de entrada, com data prevista. */
const SUBESTACAO_PREVISTA: unknown[] = ['all', ['==', ['get', 'op'], null], ['==', ['get', 'opAntesDe'], null], ['!=', ['get', 'prev'], null]];

/** Régua do anel de seleção e do destaque do conjunto: [zoom, raio mínimo, px por √MW], pela
 *  potência própria. O símbolo das usinas lê raioDoSimbolo (a soma da faixa). */
const REGUA_DA_USINA: [number, number, number][] = [
  [2, 1.2, 0.085],
  [4, 1.6, 0.13],
  [6, 2.2, 0.2],
  [9, 3.2, 0.36],
  [12, 4.5, 0.62],
];
/** Raio da usina (px) por zoom: o disco proporcional, igual para quem tem e quem não tem
 *  maquete (quem a ganhou some por feature-state; os membros e os perdedores ficam com o
 *  disco, e o porte de cada usina continua visível). `fator` multiplica cada parada. */
const raioDaUsina = (folga = 0, piso = 0, fator: unknown = 1): mapboxgl.Expression => {
  const kw = ['coalesce', ['get', 'kw'], 0];
  const r = (min: number, k: number): unknown[] => ['max', min, ['*', k, ['sqrt', ['/', kw, 1000]]]];
  const v = (min: number, k: number): unknown => {
    const bruto = folga || piso ? ['max', piso, ['+', folga, r(min, k)]] : r(min, k);
    return fator === 1 ? bruto : ['*', fator, bruto];
  };
  const e: unknown[] = ['interpolate', ['linear'], ['zoom']];
  for (const [z, min, k] of REGUA_DA_USINA) e.push(z, v(min, k));
  return e as mapboxgl.Expression;
};

/** Fator do icon-size por raio (px) do ícone SDF: o círculo de raio r tem diâmetro 2r; o
 *  quadrado da térmica tem a mesma área (lado r·√π). */
const FATOR_DA_FORMA: unknown[] = ['match', ['get', 'cat'], CATEGORIAS_QUADRADAS, LADO_DO_QUADRADO_POR_RAIO / SDF_FORMA, 2 / SDF_FORMA];

/** Raio do símbolo das usinas em operação (px), por faixa: lê a SOMA do agregado (fora da vista
 *  de aula) com o raio mínimo, o k e o teto da faixa (REGRA_DA_FAIXA); do zoom 10 em diante,
 *  a potência própria com mínimo de 4 px. Paradas em zoom inteiro: a soma muda no zoom inteiro
 *  (o do filtro) e o Mapbox interpola o tamanho entre uma faixa e a seguinte. `extra` soma px
 *  ao raio (halo, anel); `fator` multiplica o resultado (icon-size do SDF). */
const raioDoSimbolo = (somar: boolean, extra = 0, fator: unknown = 1, piso = 0): mapboxgl.Expression => {
  const mw = (x: unknown): unknown[] => ['sqrt', ['/', ['coalesce', x, 0], 1000]];
  const final = (r0: unknown): unknown => {
    // piso do raio (o símbolo do dono destacado: legível no zoom do Brasil)
    const r = piso ? ['max', piso, r0] : r0;
    const v = extra ? ['+', extra, r] : r;
    return fator === 1 ? v : ['*', fator, v];
  };
  // abaixo do zoom 3 (abertura do celular, o Brasil com ~150 px) o símbolo encolhe à metade: com o
  // raio da faixa 3 o país virava um amontoado de discos de 16 px (medido a 390 px)
  const e: unknown[] = ['interpolate', ['linear'], ['zoom'], 2, final(['min', 8, ['max', 2, ['*', 0.06, mw(somar ? somaNa(3) : ['get', 'kw'])]]])];
  for (const b of FAIXAS) {
    const { rMin, k, rMax } = REGRA_DA_FAIXA[b];
    e.push(b, final(['min', rMax, ['max', rMin, ['*', k, mw(somar ? somaNa(b) : ['get', 'kw'])]]]));
  }
  e.push(ZOOM_SEM_AGREGACAO, final(['max', 4, ['*', 0.447, mw(['get', 'kw'])]]));
  e.push(12, final(['max', 4.5, ['*', 0.62, mw(['get', 'kw'])]]));
  return e as mapboxgl.Expression;
};

/** Degrau do selo por uma potência (fração do LADO_DO_SELO). */
const degrauDoSelo = (x: unknown): unknown[] => ['step', ['coalesce', x, 0], 0.68, 5000, 0.74, 30_000, 0.82, 300_000, 0.92, 1_000_000, 1.04];
/** Tamanho do selo: pela soma da faixa (fora da vista), crescendo com o zoom até o tamanho cheio em 11. */
const tamanhoDoSelo = (somar: boolean): mapboxgl.Expression => {
  const f: Record<Faixa, number> = { 3: 0.7, 4: 0.72, 5: 0.8, 6: 0.83, 7: 0.86, 8: 0.9, 9: 0.93 };
  const e: unknown[] = ['interpolate', ['linear'], ['zoom']];
  for (const b of FAIXAS) e.push(b, ['*', f[b], degrauDoSelo(somar ? somaNa(b) : ['get', 'kw'])]);
  e.push(11, degrauDoSelo(['get', 'kw']));
  return e as mapboxgl.Expression;
};

/** Prioridade de desenho e de colisão: a maior soma que a usina representa (os menores por cima). */
const ORDEM_DA_USINA: unknown[] = ['-', 0, ['coalesce', ['get', 'ord'], ['get', 'kw']]];

/** Posição a confirmar no cadastro (susp): booleano nas usinas, 0/1 nas subestações. */
const POSICAO_A_CONFIRMAR: unknown[] = ['any', ['==', ['get', 'susp'], true], ['==', ['get', 'susp'], 1]];

/** Largura do halo de cada rótulo da base fora do satélite (a mesma de estilo.ts). */
const HALO_DA_BASE: Record<(typeof ROTULOS_DA_BASE)[number], number> = {
  'base-rotulo-agua': 1,
  'base-rotulo-rio': 1.2,
  'base-rotulo-cidade': 1.3,
  'base-rotulo-uf': 1,
  'base-rotulo-pais': 1.4,
};

/** Rótulos do Atlas e a largura do halo deles fora do satélite. */
const HALO_DOS_DADOS: [string, number][] = [
  ['usinas-rotulo', 1.4],
  ['maquetes-rotulo', 2],
  ['reservatorios-rotulo', 1.3],
  ['subestacoes', 2],
  ['submercados-rotulo', 2.4],
  ['destaque-rotulo', 1.8],
  ...HALO_DO_COMBUSTIVEL,
];

/** Áreas: a consulta de clique é pelo ponto, não pela caixa de folga. */
const AREAIS = new Set<TipoDeAtivo>(['submercado', 'bacia', 'pais', 'campo', 'bloco', 'presal', 'bacia-sedimentar', 'distribuidora']);

/** Arquivo do combustível que guarda cada tipo de ativo novo. */
const ARQUIVO_DO_TIPO: Partial<Record<TipoDeAtivo, ArquivoDoCombustivel>> = {
  gasoduto: 'gasodutos',
  instalacao: 'instalacoes',
  campo: 'campos',
  bloco: 'blocos',
  'bacia-sedimentar': 'baciasSed',
  presal: 'presal',
};

/** A fonte no plural, depois de "N usinas" (etiqueta do agregado). */
const FONTE_NO_PLURAL: Record<Categoria, string> = {
  hidro: 'hidrelétricas',
  eolica: 'eólicas',
  solar: 'solares',
  nuclear: 'nucleares',
  biomassa: 'a biomassa',
  gas: 'a gás',
  carvao: 'a carvão',
  oleo: 'a óleo',
  outros: 'de outras fontes',
};
const inteiroBr = (n: number) => n.toLocaleString('pt-BR');
/** kW → "12,57 GW" ou "387 MW" (a soma do agregado). */
const potenciaBr = (kw: number) =>
  kw >= 1_000_000 ? `${(kw / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} GW` : `${(kw / 1000).toLocaleString('pt-BR', { maximumFractionDigits: kw < 10_000 ? 1 : 0 })} MW`;

/** O que a ficha recebe de um símbolo agregado (props.agregado na seleção): a soma é conta do
 *  MAPA (as usinas da mesma fonte a menos de raioKm da maior, neste zoom); cada membro é um
 *  registro do cadastro. `membros` traz as dez maiores (a sede primeiro); `resto` é quantas
 *  ficaram fora da lista. */
export interface ResumoDoAgregado {
  faixa: number;
  cat: Categoria;
  somaKw: number;
  n: number;
  raioKm: number;
  /** nome da maior (a sede, onde o símbolo está) */
  maior: string;
  membros: { id: number; ceg: string; nome: string; uf: string; kw: number }[];
  resto: number;
  /** "387 usinas eólicas · 12,57 GW somados · a maior: Alegria II" */
  frase: string;
}

export function resumoDoAgregado(a: Agregado): ResumoDoAgregado {
  const membros = a.membros.slice(0, 10).map((u) => ({ id: Number(u.id), ceg: u.properties.ceg, nome: u.properties.nome, uf: u.properties.uf, kw: u.properties.kw }));
  return {
    faixa: a.faixa,
    cat: a.cat,
    somaKw: a.somaKw,
    n: a.n,
    raioKm: Math.round(raioDaFaixaKm(a.faixa, a.sede.geometry.coordinates[1])),
    maior: a.sede.properties.nome,
    membros,
    resto: Math.max(0, a.n - membros.length),
    frase: `${inteiroBr(a.n)} usinas ${FONTE_NO_PLURAL[a.cat] ?? ''} · ${potenciaBr(a.somaKw)} somados · a maior: ${a.sede.properties.nome}`,
  };
}

const ROTULO_DA_INSTALACAO: Record<string, string> ={ refinaria: 'refinaria', gnl: 'terminal de GNL', upgn: 'unidade de processamento de gás natural', terminal: 'terminal de combustíveis líquidos' };

/** Opacidade do símbolo 2D: zero onde a feição ganhou maquete 3D (feature-state "maquete",
 *  posto por atualizarMaquetes). O símbolo ficava pintado no meio do corpo da maquete. */
const SEM_MAQUETE = (v: unknown): mapboxgl.Expression => ['case', ['boolean', ['feature-state', 'maquete'], false], 0, v] as mapboxgl.Expression;
/** critico-desktop 4: nos símbolos das usinas (e do dono) quem esconde o vencedor da maquete é a
 *  COR (transparente pelo feature-state), não a opacidade. A cor tem a mesma forma de expressão
 *  em todo zoom; a opacidade (rampa do Titã, recuo perto das maquetes) fica só de câmera ou de
 *  dado, nunca de estado. Trocar a opacidade entre uma expressão com feature-state e outra sem
 *  deixava baldes com o ligante antigo, e o próximo setFeatureState quebrava o laço de pintura
 *  ('this.expression.evaluate is not a function' em updatePaintArray). */
const SOME_SOB_A_MAQUETE = (cor: unknown): mapboxgl.Expression => ['case', ['boolean', ['feature-state', 'maquete'], false], 'rgba(0,0,0,0)', cor] as mapboxgl.Expression;

/** Opacidade do preenchimento do símbolo proporcional (o fio fica cheio). */
const PREENCHIMENTO_DA_USINA = 0.42;

/** Potência mínima (kW) para a usina ganhar selo em cada zoom (mesma leitura de LIMIAR_POR_ZOOM).
 *  Abaixo dela a usina continua no mapa pelo símbolo proporcional; o selo é a camada de
 *  leitura, não a de presença, e não pode virar confete. */
const SELO_POR_ZOOM: [number, number][] = [
  [0, 300_000],
  [6, 100_000],
  [7, 30_000],
  [8, 10_000],
  [9, 1000],
  [10, 0],
];

/** Imagem SDF da forma da família (térmica: quadrado; fluxo natural: círculo). */
const FORMA_SDF: unknown[] = ['match', ['get', 'cat'], CATEGORIAS_QUADRADAS, 'atlas-sdf-quadro', 'atlas-sdf-disco'];
/** O contorno da mesma forma, de largura zero: o fio é o halo (ver imagemSdf). */
const FIO_SDF: unknown[] = ['match', ['get', 'cat'], CATEGORIAS_QUADRADAS, 'atlas-sdf-quadro-fio', 'atlas-sdf-disco-fio'];
/** O fio da usina em operação: tracejado quando a posição está a confirmar no cadastro (decisão 1). */
const FIO_DA_USINA: unknown[] = ['case', POSICAO_A_CONFIRMAR, ['match', ['get', 'cat'], CATEGORIAS_QUADRADAS, 'atlas-sdf-quadro-tracejado', 'atlas-sdf-disco-tracejado'], FIO_SDF];


/** Imagem do selo da fonte. */
const IMAGEM_DO_SELO: unknown[] = ['concat', 'atlas-selo-', ['get', 'cat']];

/** Distância do rótulo ao centro da usina (em em): fora do selo. */
const afastamentoDoRotulo = (): unknown[] => {
  const kw = ['coalesce', ['get', 'kw'], 0];
  // o selo tem até ~27 px; o rótulo começa fora da caixa de colisão dele (meio selo + icon-padding
  // + text-padding). Medido: com folga menor, o rótulo das maiores colide com o próprio selo e some.
  const longe = ['step', kw, 0.5, 1_000_000, 0.65, 5_000_000, 0.95];
  const perto = ['step', kw, 1.32, 300_000, 1.4, 1_000_000, 1.48];
  return ['interpolate', ['linear'], ['zoom'], 3.4, longe, 5, perto, 12, perto];
};

/** Zoom em que o selo dos membros e dos perdedores termina de sair (some de 9,8 a este). */
const ZOOM_SEM_SELO = 10.2;

/** Atraso (ms) entre o moveend e a escolha das maquetes: um gesto que recomeça logo não refaz a escolha. */
const ESPERA_DA_ESCOLHA = 120;
/** B1: durante o arrasto da régua do ano, a soma do símbolo somado e a fonte são refeitas no
 *  máximo uma vez a cada tanto (ms); entre uma e outra o mapa mostra o último ano refeito */
const ESPERA_DO_ANO_MS = 90;
/** abaixo deste zoom não há maquete: a opacidade dos símbolos das usinas é só de câmera (rampa do Titã) */
const ZOOM_DA_RAMPA_SO_CAMERA = 8;
/** A partir daqui o submercado não é mais uma área lida (o rótulo dele sai em 6,2, o fundo é de
 *  8%): não responde a pairar nem a clique fora de "A água" (critico-desktop 17). */
const ZOOM_SEM_AREA_DO_SUBMERCADO = 6.2;
/** Piso do raio (px) do símbolo das usinas do dono destacado. */
const PISO_DO_DONO = 5;

/** Imagens do obstáculo das maquetes: largura fixa (px) e as proporções altura/largura. */
const OBSTACULO_LARGURA = 32;
const OBSTACULO_RAZOES = Array.from({ length: 16 }, (_, i) => 0.25 * 1.25 ** i);
/** Área de toque dos membros (raio em px): desktop, celular. */
const TOQUE_DO_MEMBRO: [number, number] = [8, 22];
/** Obstáculo de borda (relatório "limitacoes", §3): ícones transparentes de (passo + 8) × espessura
 *  px a cada `passo` px nas quatro bordas do canvas. Entram na colisão antes dos rótulos, que
 *  então não nascem cortados pela borda da tela. Do zoom 3 em diante (critico-desktop 15: no
 *  zoom do Brasil "CABO" ficava cortado no topo); o ponto da borda que cai fora do globo não
 *  entra (noChao). */
const BORDA_PASSO = 48;
const BORDA_ESPESSURA = 4;
const ZOOM_DA_BORDA = 3;
/** Vão (px) entre o fundo da maquete desenhada e o topo do rótulo dela (A4: 2–12 px). */
const VAO_DO_ROTULO = 6;

/** Raio do disco do reservatório (px) por zoom, pelo volume útil; idem para o anel. */
const raioDoReservatorio = (folga = 0, piso = 0): mapboxgl.Expression => {
  const vu = ['coalesce', ['get', 'vutil'], 0];
  const r = (min: number, k: number): unknown[] => ['max', min, ['*', k, ['sqrt', vu]]];
  const v = (min: number, k: number): unknown => (folga || piso ? ['max', piso, ['+', folga, r(min, k)]] : r(min, k));
  return ['interpolate', ['linear'], ['zoom'], 3, v(2, 0.075), 7, v(3.5, 0.16), 10, v(5, 0.3)] as mapboxgl.Expression;
};

// ── geometria auxiliar ───────────────────────────────────────────────

function areaDoAnel(anel: Position[]): number {
  let s = 0;
  for (let i = 0; i < anel.length - 1; i++) s += anel[i][0] * anel[i + 1][1] - anel[i + 1][0] * anel[i][1];
  return Math.abs(s / 2);
}

function centroideDoAnel(anel: Position[]): [number, number] {
  let x = 0;
  let y = 0;
  let a = 0;
  for (let i = 0; i < anel.length - 1; i++) {
    const c = anel[i][0] * anel[i + 1][1] - anel[i + 1][0] * anel[i][1];
    x += (anel[i][0] + anel[i + 1][0]) * c;
    y += (anel[i][1] + anel[i + 1][1]) * c;
    a += c;
  }
  return a === 0 ? [anel[0][0], anel[0][1]] : [x / (3 * a), y / (3 * a)];
}

/** Centroide do maior polígono da feição: ponto de rótulo, calculado da forma. */
export function centroDaArea(g: Geometry): [number, number] | null {
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
  return maior ? centroideDoAnel(maior) : null;
}

function limitesDe(g: Geometry, acc: [number, number, number, number] = [180, 90, -180, -90]): [number, number, number, number] {
  const visita = (c: unknown): void => {
    if (typeof (c as number[])[0] === 'number') {
      const [x, y] = c as number[];
      if (x < acc[0]) acc[0] = x;
      if (y < acc[1]) acc[1] = y;
      if (x > acc[2]) acc[2] = x;
      if (y > acc[3]) acc[3] = y;
    } else for (const d of c as unknown[]) visita(d);
  };
  if (g.type !== 'GeometryCollection') visita(g.coordinates);
  return acc;
}

/** Circuitos paralelos: linhas com as mesmas duas pontas (arredondadas a ~1 km) formam
 *  um feixe. Cada uma recebe `par`, a vaga lateral no feixe (…, -1, 0, 1, … ou meias
 *  vagas quando o feixe é par), com o sinal acertado pelo sentido do desenho — o
 *  deslocamento do Mapbox é à direita do sentido da linha. De longe o feixe é um traço só;
 *  de perto os circuitos se abrem lado a lado. Nada é movido no dado: é deslocamento de tela. */
export function marcarParalelos(fc: FeatureCollection): number {
  const grupos = new Map<string, { f: Feature; sentido: number }[]>();
  for (const f of fc.features) {
    const g = f.geometry;
    const pts: Position[] | null = g.type === 'LineString' ? g.coordinates : g.type === 'MultiLineString' ? g.coordinates.flat() : null;
    if (!pts || pts.length < 2) continue;
    const a = `${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
    const b = `${pts[pts.length - 1][0].toFixed(2)},${pts[pts.length - 1][1].toFixed(2)}`;
    if (a === b) continue;
    const sentido = a < b ? 1 : -1;
    const chave = sentido === 1 ? `${a}|${b}` : `${b}|${a}`;
    const lista = grupos.get(chave);
    if (lista) lista.push({ f, sentido });
    else grupos.set(chave, [{ f, sentido }]);
  }
  let feixes = 0;
  for (const lista of grupos.values()) {
    if (lista.length < 2) continue;
    feixes++;
    // ordem estável: maior tensão primeiro, depois o identificador
    lista.sort((x, y) => Number(y.f.properties?.kv ?? 0) - Number(x.f.properties?.kv ?? 0) || String(x.f.properties?.id).localeCompare(String(y.f.properties?.id)));
    const n = lista.length;
    lista.forEach(({ f, sentido }, i) => {
      (f.properties as Record<string, unknown>).par = (i - (n - 1) / 2) * sentido;
    });
  }
  return feixes;
}

/** Arco esquemático entre dois pontos (curva de Bézier quadrática). */
function arco(a: [number, number], b: [number, number], curvatura = 0.18): Position[] {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const cx = mx - dy * curvatura;
  const cy = my + dx * curvatura;
  const pts: Position[] = [];
  for (let i = 0; i <= 28; i++) {
    const t = i / 28;
    pts.push([(1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * cx + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * cy + t * t * b[1]]);
  }
  return pts;
}

// ── o controle ───────────────────────────────────────────────────────

export class ControleDoMapa {
  readonly mapa: mapboxgl.Map;
  private estado: EstadoDoMapa;
  private readonly ret: RetornosDoMapa;
  private montado = false;
  private destruido = false;
  private readonly inicio = performance.now();
  private avisouPronto = false;

  private usinas: FeicaoUsina[] = [];
  /** quem soma quem em cada faixa de zoom (generalizacao.ts); refeito quando as menores chegam */
  private gen: Generalizacao | null = null;
  /** o tamanho dos símbolos das usinas lê a soma da faixa (false na vista de aula) */
  private tamanhoPelaSoma = true;
  /** pontos do obstáculo de borda (rótulo cortado na borda da tela) */
  private bordaPosta = '';
  private menoresCarregadas = false;
  private linhas: FeatureCollection | null = null;
  private subestacoes: FeatureCollection | null = null;
  private reservatorios: FeatureCollection | null = null;
  private bacias: FeatureCollection | null = null;
  private submercados: FeatureCollection | null = null;
  private nos: Partial<Record<Subsistema, [number, number]>> = {};
  private marcadoresDoDia: Partial<Record<Subsistema, mapboxgl.Marker>> = {};
  private svgDasTrocas: SVGSVGElement | null = null;
  /** câmera pedida antes de o mapa carregar (vista aberta por link): vale no lugar do pouso padrão */
  private cameraPedida: CameraAlvo | null = null;
  private maquetes: CamadaDeMaquetes | null = null;
  private importandoMaquetes = false;
  /** true depois da primeira montagem; nunca volta a false (a troca de modo zera só `montado`) */
  private jaMontou = false;
  /** relevo 3D pedido por último (vale também para pedido feito antes da montagem) */
  private relevoLigado = false;
  /** o leitor mexeu na câmera (gesto ou botão) depois do último pedido de câmera */
  private cameraTocada = false;
  /** a câmera está em movimento (movestart → moveend): a etiqueta de pairar não aparece */
  private emMovimento = false;
  /** o alvo do último clique ("tipo:chave"): a etiqueta dele não volta enquanto o ponteiro
   *  não sair de cima dele (ela cairia por cima da ficha que o clique abriu) */
  private pairarCalado: string | null = null;
  /** reconta da área livre já pedida para o próximo quadro desenhado */
  private recontaPedida = false;
  /** composição do Titã medida para a tela corrente (zoom de repouso, padding, raio pedido) */
  private tita: { zoom: number; padding: typeof SEM_PADDING; r: number; opacidade: number } | null = null;
  /** a câmera está parada na composição do Titã (a tela redimensionada recompõe) */
  private naComposicao = false;
  /** o voo automático da abertura (Titã → Brasil), enquanto espera a pausa */
  private vooDaAbertura: number | null = null;
  /** leva 5 (câmera intermitente): cada pedido de câmera (voo, botão, deslize) ganha um número;
   *  o que foi agendado por um pedido mais velho (assentar no Titã, recentrar depois da ficha, a
   *  subida da gaveta na página) só age se o número ainda for o dele. */
  private geracaoDaCamera = 0;
  /** true enquanto um pedido novo para o movimento anterior: o fim do voo interrompido dispara
   *  moveend/zoomend dentro do pedido novo, e nada nascido desses eventos pode mexer na câmera
   *  (medido: soltarPaddingDoTita, no zoomend do voo da abertura parado pelo ir(), começava um
   *  easeTo de 500 ms só de padding que regravava o centro velho por cima do pedido novo) */
  private parandoCamera = false;
  /** quem segue o globo quadro a quadro (a gravura do Titã) e o último aviso dado */
  private seguidores = new Set<(g: GloboNaTela | null) => void>();
  private globoAvisado: GloboNaTela | null = null;
  /** sobe a cada dado novo entregue: invalida os memos de destaque e seleção */
  private versaoDosDados = 0;
  private aguaPedida = false;
  /** arquivos do capítulo do combustível já entregues (e os já pedidos) */
  private comb: Partial<Record<ArquivoDoCombustivel, FeatureCollection | null>> = {};
  private combPedido = new Set<ArquivoDoCombustivel>();
  private rotulosDasAreasComb: FeatureCollection | null = null;
  /** áreas de atuação das distribuidoras (mapa/distribuicao.ts); `enquadrarAoChegar`: busca que
   *  pediu o enquadramento antes de o arquivo chegar */
  readonly distrib: CamadaDaDistribuicao;
  /** capítulo "O comércio" (mapa/comercio.ts): rotas, veículos, interligações e o gás da Bolívia */
  readonly comercio: CamadaDoComercio;
  /** capítulo "Um dia", modo dia real (mapa/pulso.ts): a geração de cada entidade na hora */
  readonly pulso: CamadaDoPulso;
  /** B1: o ano cuja lista está na fonte das usinas (null = todas), e se a soma do símbolo
   *  somado já foi refeita para ele (false durante o arrasto: vale só o filtro) */
  private anoNaFonte: number | null = null;
  private somaDoAno: number | null = null;
  /** linhas e subestações do ano (para a escolha das maquetes), memorizadas por ano */
  private redeDoAno: { ano: number; linhas: FeatureCollection | null; subestacoes: FeatureCollection | null; vl: FeatureCollection | null; vs: FeatureCollection | null } | null = null;
  /** custo (ms) das últimas mudanças de ano: [filtro, soma + entrega da fonte] */
  readonly custoDoAno: { filtro: number[]; soma: number[] } = { filtro: [], soma: [] };
  /** B2: o dono cujas usinas estão na fonte do destaque, e quem resolve a chave em CEGs */
  private donoNaFonte: string | null = null;
  private donoUsinas: number = 0;
  private enquadrarAoChegar: AtivoSelecionado | null = null;
  // memos do que já foi entregue ao mapa (zerados a cada montagem do estilo)
  private memoDestaque: { d: Destaque | null; v: number; cap: CapituloId; paises: FeatureCollection | null } | null = null;
  private memoSelecao: { s: AtivoSelecionado | null; v: number } | null = null;
  private memoSubmercados: { ear: EstadoDoMapa['earSubsistema']; agua: boolean; v: number } | null = null;
  private memoMaquetes: { cap: CapituloId; camadas: ReadonlySet<CamadaId>; sel: AtivoSelecionado | null; dq: Destaque | null; v: number } | null = null;

  constructor(container: HTMLElement, token: string, estado: EstadoDoMapa, ret: RetornosDoMapa, cameraInicial: CameraAlvo | null) {
    this.estado = estado;
    this.ret = ret;
    mapboxgl.accessToken = token;
    const reduzido = estado.movimentoReduzido;
    this.mapa = new mapboxgl.Map({
      container,
      style: estiloDoMapa(estado.modo),
      // nasce como globo inteiro; o pouso no Brasil vem depois do primeiro quadro
      center: [-52, -12],
      zoom: reduzido || (cameraInicial && !cameraInicial.tita) ? 3.2 : 1.35,
      // a mesma do estilo, mas já no construtor: a composição do Titã é medida antes de o
      // estilo chegar, e sem isto o transform ainda é Mercator (o raio do globo sai outro)
      projection: 'globe',
      minZoom: 0.9,
      maxZoom: 17,
      attributionControl: false,
      // antisserrilhamento do contexto WebGL: sem ele as maquetes 3D (peças finas) serrilham
      antialias: true,
      logoPosition: 'bottom-right',
      dragRotate: true,
      pitchWithRotate: true,
      touchPitch: true,
      fadeDuration: reduzido ? 0 : 200,
      respectPrefersReducedMotion: true,
      // nome acessível do canvas e textos dos controles do Mapbox, em português
      locale: {
        'Map.Title': 'Mapa do Atlas: infraestrutura elétrica do Brasil. Setas do teclado deslocam o mapa; mais e menos aproximam e afastam.',
        'AttributionControl.ToggleAttribution': 'Mostrar ou ocultar os créditos do mapa',
        'AttributionControl.MapFeedback': 'Comentar o mapa base',
        'LogoControl.Title': 'Logotipo do Mapbox',
        'ScrollZoomBlocker.CtrlMessage': 'Use ctrl + rolagem para aproximar o mapa',
        'ScrollZoomBlocker.CmdMessage': 'Use ⌘ + rolagem para aproximar o mapa',
        'TouchPanBlocker.Message': 'Use dois dedos para mover o mapa',
      },
    });
    if (import.meta.env.DEV) {
      controleEmDepuracao = this;
      // as sondas de verificação acham o controle vivo mesmo depois de uma recarga a quente
      // (o import dinâmico da sonda pega outra instância do módulo)
      (globalThis as { __controleDoAtlas?: ControleDoMapa }).__controleDoAtlas = this;
    }
    this.distrib = new CamadaDaDistribuicao(
      this.mapa,
      () => {
        if (this.destruido) return;
        this.versaoDosDados++;
        this.aplicar();
        const s = this.enquadrarAoChegar;
        this.enquadrarAoChegar = null;
        // só se a distribuidora pedida ainda é a selecionada (o leitor pode ter clicado em outra coisa)
        const atual = this.estado.selecionado;
        if (s && atual?.tipo === 'distribuidora' && String(atual.chave) === String(s.chave)) this.enquadrar(s);
      },
      (msg) => this.ret.aoFalhar(msg),
    );
    this.comercio = new CamadaDoComercio(this.mapa, {
      reduzido: () => this.estado.movimentoReduzido,
      aoChegar: () => {
        if (this.destruido) return;
        this.versaoDosDados++;
        this.aplicar();
      },
      aoFalhar: (msg) => this.ret.aoFalhar(msg),
    });
    this.pulso = new CamadaDoPulso(this.mapa, {
      reduzido: () => this.estado.movimentoReduzido,
      aoChegar: () => {
        if (this.destruido) return;
        this.versaoDosDados++;
        this.aplicar();
      },
      aoFalhar: (msg) => this.ret.aoFalhar(msg),
    });
    this.mapa.getCanvas().setAttribute('aria-roledescription', 'mapa');
    this.mapa.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');
    // a composição do Titã é medida já: a abertura nasce nela, sem quadro intermediário
    this.tita = this.comporTita();
    if (this.tita) this.mapa.setMinZoom(Math.min(0.9, this.tita.zoom - 0.1));
    // A1.5: o ?cam= copiado com o Titã na tela (zoom na escala da composição, sem inclinação)
    // reabre NA composição, centrado no ponto do link, sem voo automático
    if (
      cameraInicial?.titaSePerto &&
      cameraInicial.centro &&
      this.tita &&
      (cameraInicial.zoom ?? Infinity) <= this.tita.zoom + ZOOM_DE_ASSENTAR_NO_TITA &&
      (cameraInicial.inclinacao ?? 0) < 8
    )
      cameraInicial = { tita: true, centro: cameraInicial.centro };
    if (cameraInicial?.tita && this.tita) {
      this.mapa.jumpTo({ center: cameraInicial.centro ?? CENTRO_DO_TITA, zoom: this.tita.zoom, pitch: 0, bearing: 0, padding: this.tita.padding });
      this.naComposicao = true;
    }

    this.mapa.on('style.load', () => {
      if (this.destruido) return;
      this.montar();
    });
    this.mapa.on('error', (e) => {
      const err = e.error as (Error & { status?: number }) | undefined;
      const st = err?.status;
      const ev = e as unknown as { tile?: unknown; sourceId?: string };
      // a URL do Mapbox carrega access_token: não vai inteira para o console
      console.warn('[atlas] mapa:', st ?? '', (err?.message || 'falha do mapa').replace(/access_token=[^&\s]+/g, 'access_token=…'));
      if (st === 401 || st === 403) {
        // só a resposta do servidor diz que a chave foi recusada; falha de rede não é isso
        this.ret.aoFalhar('O Mapbox recusou a chave de acesso deste ambiente.');
      } else if (!this.jaMontou) {
        // antes da primeira montagem, o erro é do estilo ou da rede: o mapa não vai aparecer
        this.ret.aoFalhar('O mapa não conseguiu carregar a base cartográfica. Recarregue a página; se continuar, a chave do Mapbox ou o estilo estão com problema.');
      } else if (!ev.tile && (ev.sourceId === 'base' || ev.sourceId === 'relevo' || ev.sourceId === 'satelite')) {
        // falha da fonte inteira (TileJSON), não de um tile: a base não vai aparecer nesta sessão
        this.ret.aoFalhar('O mapa base não respondeu agora. Os dados do Atlas seguem navegáveis; recarregue a página para tentar de novo.');
      }
      // tile ou glifo isolado: só no console, o mapa segue
    });
    // gesto do leitor (só evento com originalEvent: resize e voos programados não contam)
    this.mapa.on('movestart', (ev) => {
      if ((ev as { originalEvent?: unknown }).originalEvent) {
        this.cameraTocada = true;
        this.movidoPeloLeitor = true;
        // o gesto é o pedido mais novo: o que estava agendado por pedidos anteriores não vem
        this.geracaoDaCamera++;
        // o gesto do leitor cancela o voo automático da abertura e o deixa no comando
        this.cancelarVooDaAbertura();
        this.naComposicao = false;
      }
      // qualquer movimento da câmera (gesto, botão, voo) apaga a etiqueta de pairar
      this.emMovimento = true;
      this.ret.aoPairar(null);
    });
    this.mapa.on('moveend', () => {
      this.emMovimento = false;
      this.atualizarBorda();
      this.avisarCamera();
      this.agendarMaquetes();
      // câmera assentada: a página relê o que está na tela ("Nesta tela")
      this.avisarAreaLivre();
      this.refazerAgregadoDaSelecao();
    });
    this.mapa.on('resize', () => {
      // a composição depende do tamanho da tela (e de onde a busca e o puxador caem)
      this.tita = this.comporTita();
      if (this.tita) this.mapa.setMinZoom(Math.min(0.9, this.tita.zoom - 0.1));
      if (this.naComposicao && this.tita && !this.mapa.isMoving())
        this.mapa.jumpTo({ zoom: this.tita.zoom, pitch: 0, bearing: 0, padding: this.tita.padding });
      this.aplicarRampaDoTita();
      this.atualizarBorda();
      this.avisarAreaLivre();
      this.avisarGlobo();
    });
    this.mapa.on('zoom', () => this.aoMudarZoom());
    this.mapa.on('move', () => {
      if (this.svgDasTrocas) this.desenharTrocas();
      // a gravura do Titã segue o globo quadro a quadro
      this.avisarGlobo();
    });
    // aproximado à mão além da composição: o padding do Titã sai (o resto do Atlas conta com 0)
    this.mapa.on('zoomend', (ev) => {
      // a roda do mouse dispara o movestart sem originalEvent; o zoomend dela traz
      if ((ev as { originalEvent?: unknown }).originalEvent) this.movidoPeloLeitor = true;
      this.soltarPaddingDoTita();
      this.assentarNoTita();
      // os discos do dia acompanham o espaço entre os nós (critico-celular 7)
      if (Object.keys(this.marcadoresDoDia).length && this.estado.dia) this.atualizarDia(true);
    });
    // codigo.md 2: voltar a 0° (botão Norte, "Inclinar" de volta, gesto) na escala do Titã é um
    // easeTo só de inclinação e rumo, sem zoomend: o pitchend também assenta na composição
    // (assentarNoTita exige movido pelo leitor, fora da composição, pitch ≤ 8 e câmera parada)
    this.mapa.on('pitchend', (ev) => {
      if ((ev as { originalEvent?: unknown }).originalEvent) this.movidoPeloLeitor = true;
      this.soltarPaddingDoTita();
      this.assentarNoTita();
    });
    this.mapa.on('click', (e) => this.aoClicar(e));
    this.mapa.on('mousemove', (e) => this.aoMover(e));
    this.mapa.on('mouseout', () => {
      this.ret.aoPairar(null);
      this.pairarCalado = null;
      if (this.conjuntoEmHover) {
        this.conjuntoEmHover = null;
        this.atualizarDestaqueDoConjunto();
      }
    });

    // "pronto" = evento load do Mapbox: estilo e tiles do primeiro enquadramento
    // carregados e desenhados. Não se usa "idle": capítulo com animação nunca fica ocioso.
    this.mapa.once('load', () => {
      if (this.destruido) return;
      if (!this.avisouPronto) {
        this.avisouPronto = true;
        this.ret.aoFicarPronto({ msAtePronto: Math.round(performance.now() - this.inicio) });
      }
      // a página pode ter se acomodado depois do construtor (fontes, casca): mede de novo
      this.tita = this.comporTita() ?? this.tita;
      if (this.tita) this.mapa.setMinZoom(Math.min(0.9, this.tita.zoom - 0.1));
      this.rampaPosta = '';
      // ordem: gesto do leitor antes do load > câmera pedida (vista aberta por link) >
      // câmera inicial (capítulo por link, ou o Titã) > pouso padrão no Brasil
      if (this.cameraTocada) {
        // o leitor já mexeu: a câmera fica onde ele deixou
      } else if (this.cameraPedida) this.voarPara(this.cameraPedida, true);
      else if (cameraInicial) {
        this.voarPara(cameraInicial, true);
        // a abertura do Titã: segura, depois voa ao alvo (o gesto do leitor, um botão ou um
        // pedido de câmera de fora cancelam; ver cancelarVooDaAbertura)
        const depois = cameraInicial.tita ? cameraInicial.depois : undefined;
        if (depois && !reduzido)
          this.vooDaAbertura = window.setTimeout(() => {
            this.vooDaAbertura = null;
            if (this.destruido || this.cameraTocada) return;
            this.voarPara(depois, false, 2600);
          }, PAUSA_DO_TITA);
        else if (depois) this.voarPara(depois, true);
      } else this.voarPara({ limites: BRASIL }, reduzido, 2600);
      this.cameraPedida = null;
      this.aplicar();
      this.avisarGlobo();
    });

    void this.carregarDados();
  }

  // ── dados ──────────────────────────────────────────────────────────

  /** Cada arquivo vai ao mapa quando chega (sem esperar o maior). Bacias e
   *  reservatórios só são buscados quando alguém precisa deles (`garantirAgua`). */
  private async carregarDados() {
    const falha = (o: string) => (e: unknown) => {
      console.error(`[atlas] ${o}:`, e);
      this.ret.aoFalhar(`Não foi possível carregar ${o}.`);
      return null;
    };
    const chegou = (fontes: (keyof typeof F)[]) => {
      if (this.destruido) return;
      this.versaoDosDados++;
      this.alimentar(fontes);
      this.aplicar();
    };
    await Promise.all([
      carregarLinhas()
        .catch(falha('as linhas de transmissão'))
        .then((linhas) => {
          if (linhas) marcarParalelos(linhas);
          this.linhas = linhas;
          chegou(['linhas']);
        }),
      carregarUsinasPrincipais()
        .catch(falha('as usinas'))
        .then((usinas) => {
          // as menores podem ter chegado antes (vista que cita usina pequena): ficam depois
          this.usinas = (usinas ?? []).concat(this.usinas);
          this.remarcar();
          chegou(['usinas']);
          this.talvezCarregarMenores();
        }),
      carregarSubestacoes()
        .catch(falha('as subestações'))
        .then((subestacoes) => {
          this.subestacoes = subestacoes;
          chegou(['subestacoes']);
        }),
      carregarSubmercados()
        .catch(falha('os submercados'))
        .then((submercados) => {
          if (submercados) {
            // marca cada submercado com a sigla do ONS e calcula o ponto do rótulo
            for (const f of submercados.features) {
              const sigla = SUBSISTEMA_DO_SUBMERCADO[(f.properties as { id: string }).id];
              (f.properties as Record<string, unknown>).sub = sigla;
              const c = centroDaArea(f.geometry);
              if (sigla && c) this.nos[sigla] = c;
            }
            this.submercados = submercados;
          }
          this.memoSubmercados = null;
          chegou(['submercados', 'rotulosSub']);
        }),
    ]);
  }

  /** Bacias e reservatórios: só quando o capítulo da água, a camada, um destaque ou a seleção pedem. */
  private garantirAgua() {
    if (this.aguaPedida) return;
    this.aguaPedida = true;
    const falha = (o: string) => (e: unknown) => {
      console.error(`[atlas] ${o}:`, e);
      this.ret.aoFalhar(`Não foi possível carregar ${o}.`);
      return null;
    };
    void carregarReservatorios()
      .catch(falha('os reservatórios'))
      .then((r) => {
        if (this.destruido) return;
        this.reservatorios = r;
        this.ultimoEarRes = null;
        this.versaoDosDados++;
        this.alimentar(['reservatorios']);
        this.aplicar();
      });
    void carregarBacias()
      .catch(falha('as bacias'))
      .then((b) => {
        if (this.destruido) return;
        this.bacias = b;
        this.versaoDosDados++;
        this.alimentar(['bacias']);
        this.aplicar();
      });
  }

  /** Arquivos do combustível: cada um só quando o capítulo, a camada, um destaque ou a seleção pedem. */
  private garantirCombustivel(quais: Iterable<ArquivoDoCombustivel>) {
    for (const k of quais) {
      if (this.combPedido.has(k)) continue;
      this.combPedido.add(k);
      carregarDoCombustivel(k).then(
        (fc) => {
          if (this.destruido) return;
          this.comb[k] = fc;
          const fontes: (keyof typeof F)[] = [k];
          if (k === 'campos' || k === 'baciasSed') {
            this.rotulosDasAreasComb = rotulosDasAreas(this.comb.campos ?? null, this.comb.baciasSed ?? null);
            fontes.push('rotulosArea');
          }
          this.versaoDosDados++;
          this.alimentar(fontes);
          this.aplicar();
        },
        (e: unknown) => {
          // falha não fica marcada: a próxima aplicação tenta de novo
          this.combPedido.delete(k);
          console.error(`[atlas] combustível (${k}):`, e);
          this.ret.aoFalhar('Não foi possível carregar uma camada de gás e petróleo da ANP.');
        },
      );
    }
  }

  /** Busca as menores quando o zoom chega perto do degrau em que o filtro as desenha. */
  private talvezCarregarMenores() {
    if (this.menoresCarregadas || !this.usinas.length) return;
    const vista = !!this.estado.destaque?.deVista;
    if (this.mapa.getZoom() >= (vista ? zoomDasMenores(1.2) : Math.min(zoomDasMenores(0), ZOOM_DAS_MENORES_NA_SOMA))) void this.carregarMenores();
  }

  private async carregarMenores() {
    if (this.menoresCarregadas) return;
    this.menoresCarregadas = true;
    try {
      const menores = await carregarUsinasMenores();
      if (this.destruido) return;
      this.usinas = this.usinas.concat(menores);
      this.remarcar();
      this.versaoDosDados++;
      // só a fonte das usinas muda: as outras não são reenviadas
      this.alimentar(['usinas']);
      this.aplicar();
    } catch (e) {
      this.menoresCarregadas = false;
      console.error('[atlas] usinas menores:', e);
    }
  }

  /** Roraima fora do Norte agora? Só com o arquivo trazendo roraimaAParte. */
  private roraimaPosta = false;
  private roraimaForaDoNorte(): boolean {
    const rr = (this.submercados as ComRoraimaAParte | null)?.roraimaAParte;
    if (!rr) return false;
    const cap = this.estado.capitulo;
    if (cap === 'agua' || cap === 'trocas') {
      const mes = this.estado.mesDosSubmercados;
      return typeof mes === 'string' && mes < rr.primeiroMesNoNorte;
    }
    const ano = this.anoEfetivo();
    return ano != null && ano < rr.primeiroAnoNoNorte;
  }
  /** Os submercados como a tela os desenha: antes da interligação, o Norte sem Roraima. */
  private submercadosNaTelaMemo: { de: FeatureCollection; fora: boolean; fc: FeatureCollection } | null = null;
  private submercadosNaTela(): FeatureCollection | null {
    const sm = this.submercados as ComRoraimaAParte | null;
    if (!sm) return null;
    const rr = sm.roraimaAParte;
    if (!rr || !this.roraimaPosta) return sm;
    const memo = this.submercadosNaTelaMemo;
    if (memo && memo.de === sm && memo.fora) return memo.fc;
    const fc: FeatureCollection = { type: 'FeatureCollection', features: sm.features.map((f) => ((f.properties as { sub?: string }).sub === 'N' ? { ...f, geometry: rr.norteSemRoraima } : f)) };
    this.submercadosNaTelaMemo = { de: sm, fora: true, fc };
    return fc;
  }

  /** Entrega os dados já carregados às fontes do mapa (se o estilo estiver montado).
   *  Sem argumento, todas (montagem do estilo); com lista, só as que mudaram. */
  private alimentar(quais?: (keyof typeof F)[]) {
    if (!this.montado) return;
    const m = this.mapa;
    const quer = (k: keyof typeof F) => !quais || quais.includes(k);
    const por = (id: string, dado: FeatureCollection | null) => {
      const s = m.getSource(id) as mapboxgl.GeoJSONSource | undefined;
      if (s && dado) s.setData(dado);
    };
    if (quer('linhas')) por(F.linhas, this.linhas);
    if (quer('subestacoes')) por(F.subestacoes, this.subestacoes);
    if (quer('usinas') && this.usinas.length) por(F.usinas, { type: 'FeatureCollection', features: this.usinasNaFonte });
    if (quer('dono')) this.entregarDono(true);
    if (quer('reservatorios')) por(F.reservatorios, this.reservatorios);
    if (quer('bacias')) por(F.bacias, this.bacias);
    if (quer('submercados')) por(F.submercados, this.submercadosNaTela());
    if (quer('roraima')) {
      const rr = (this.submercados as ComRoraimaAParte | null)?.roraimaAParte;
      por(F.roraima, rr && this.roraimaPosta ? { type: 'FeatureCollection', features: [{ type: 'Feature', geometry: rr.roraima, properties: {} }] } : VAZIA);
    }
    if (quer('paises')) por(F.paises, this.estado.paises);
    for (const k of ['gasodutos', 'instalacoes', 'campos', 'blocos', 'baciasSed', 'presal'] as const) if (quer(k)) por(F[k], this.comb[k] ?? null);
    if (quer('rotulosArea')) por(F.rotulosArea, this.rotulosDasAreasComb);
    if (quer('rotulosSub') && Object.keys(this.nos).length) {
      const rot: Feature<Point>[] = [];
      for (const [sub, c] of Object.entries(this.nos)) rot.push({ type: 'Feature', geometry: { type: 'Point', coordinates: c as [number, number] }, properties: { sub } });
      por(F.rotulosSub, { type: 'FeatureCollection', features: rot });
    }
  }

  // ── B1: o ano (linha do tempo) ─────────────────────────────────────

  /** O que está na fonte das usinas: todas (ano nulo) ou, com ano, as em operação com
   *  ano <= ano escolhido e as sem ano no cadastro (estas fora da soma, camada própria). */
  private usinasNaFonte: FeicaoUsina[] = [];
  /** usinas datadas do ano corrente (as que entram na soma e na escolha das maquetes) */
  private usinasDatadas: FeicaoUsina[] = [];
  private esperaDoAno: number | null = null;

  /** O ano que o mapa aplica: só no capítulo "A rede". */
  private anoEfetivo(): number | null {
    const a = this.estado.anoLimite;
    return this.estado.capitulo === 'rede' && typeof a === 'number' && Number.isFinite(a) ? a : null;
  }

  /** Refaz a lista da fonte e a soma do símbolo somado (generalizacao.ts) para o ano corrente.
   *  Parcial (só durante o arrasto da régua, com a câmera abaixo do zoom 7): só os registros de
   *  5 MW ou mais. É o mesmo desenho: abaixo do zoom 7 a soma só conta esses registros
   *  (generalizacao.ts › KW_MINIMO_NA_SOMA_DE_LONGE) e um registro menor nunca passa do piso
   *  sozinho. Custa ~1/8 da conta inteira; ao soltar, a conta inteira é refeita. */
  private remarcar(parcial = false) {
    const t0 = performance.now();
    const ano = this.anoEfetivo();
    this.anoNaFonte = ano;
    this.somaDoAno = ano;
    this.fonteParcial = parcial;
    if (ano == null && !parcial) {
      this.usinasNaFonte = this.usinas;
      this.usinasDatadas = this.usinas;
      const h = this.marcacaoDeHoje;
      if (h && h.usinas === this.usinas) {
        // voltar a hoje: a marcação de hoje é reposta da cópia (a conta inteira levava ~150 ms)
        for (let i = 0; i < this.usinas.length; i++) {
          const pr = this.usinas[i].properties as unknown as Record<string, unknown>;
          for (const z of FAIXAS) {
            delete pr[`s${z}`];
            delete pr[`n${z}`];
          }
          Object.assign(pr, h.props[i]);
        }
        this.gen = h.gen;
      } else {
        this.gen = marcarGeneralizacao(this.usinas);
        const props = this.usinas.map((u) => {
          const pr = u.properties as unknown as Record<string, unknown>;
          const o: Record<string, unknown> = { gen: pr.gen, ord: pr.ord };
          for (const z of FAIXAS) if (pr[`s${z}`] != null) ((o[`s${z}`] = pr[`s${z}`]), (o[`n${z}`] = pr[`n${z}`]));
          return o;
        });
        this.marcacaoDeHoje = { usinas: this.usinas, gen: this.gen, props };
      }
    } else {
      const datadas: FeicaoUsina[] = [];
      const semAno: FeicaoUsina[] = [];
      for (const u of this.usinas) {
        const pr = u.properties;
        if (parcial && pr.kw < KW_MINIMO_NA_SOMA_DE_LONGE) continue;
        if (ano == null) {
          datadas.push(u);
          continue;
        }
        if (pr.fase !== 0) continue;
        // decisões leva 4, 2.13: a usina existe desde a primeira unidade (etapas do ONS) e entra
        // na soma e no tamanho com a potência que tinha NAQUELE ano (kwNoAno, tempo.ts): a cópia
        // leva o kw do ano e o de hoje em kwHoje (Tucuruí em 1990: 3,5 GW, não 8,5)
        const a0 = anoDeEntrada(pr);
        if (a0 == null) semAno.push(u);
        else if (a0 <= ano) {
          const kw = pr.etapas ? kwNoAno(pr, ano) : pr.kw;
          datadas.push(kw === pr.kw ? u : { ...u, properties: { ...pr, kw, kwHoje: pr.kw } });
        }
      }
      // a marcação escreve nas próprias feições (s3..s9, gen): as que ficam fora da lista não vão à
      // fonte. No arrasto, só a faixa da câmera (e a vizinha de cima, para o zoom fracionário)
      const fz = faixaDoZoom(this.mapa.getZoom()) ?? 3;
      this.gen = parcial ? marcarGeneralizacao(datadas, FAIXAS.filter((f) => f === fz || f === fz + 1)) : marcarGeneralizacao(datadas);
      this.usinasDatadas = datadas;
      this.usinasNaFonte = datadas.concat(semAno);
    }
    this.indiceDeCeg = null;
    this.versaoDoAno++;
    const ms = performance.now() - t0;
    this.custoDoAno.soma.push(ms);
    if (this.custoDoAno.soma.length > 20) this.custoDoAno.soma.shift();
  }
  private versaoDoAno = 0;
  /** a marcação de hoje (todas as usinas), guardada para voltar do passado sem refazer a conta */
  private marcacaoDeHoje: { usinas: FeicaoUsina[]; gen: Generalizacao; props: Record<string, unknown>[] } | null = null;
  /** a fonte das usinas é a do arrasto (só os registros de 5 MW ou mais): refazer ao soltar */
  private fonteParcial = false;

  /** Chamado por aplicar(): o ano mudou. Fora do arrasto, a soma e a fonte são refeitas na hora;
   *  durante o arrasto, no máximo uma vez a cada ESPERA_DO_ANO_MS (o resto do quadro é só filtro).
   *  Devolve true quando a fonte das usinas foi reenviada. */
  private aplicarAno(): boolean {
    const ano = this.anoEfetivo();
    const arrastando = !!this.estado.anoArrastando;
    // no arrasto, abaixo do zoom 7, a conta parcial (barata) vale; fora dele, a inteira
    const parcial = arrastando && Math.floor(this.mapa.getZoom()) < FAIXA_DA_SOMA_COMPLETA && this.usinas.length > 0;
    if (ano === this.anoNaFonte && ano === this.somaDoAno && (!this.fonteParcial || parcial)) return false;
    const refazer = (comoParcial = false) => {
      this.remarcar(comoParcial);
      const t1 = performance.now();
      this.alimentar(['usinas']);
      this.entregarDono(true);
      const ms = performance.now() - t1;
      this.custoDoAno.filtro.push(ms);
      if (this.custoDoAno.filtro.length > 20) this.custoDoAno.filtro.shift();
      this.memoMaquetes = null;
    };
    if (parcial) {
      if (this.esperaDoAno != null) window.clearTimeout(this.esperaDoAno);
      this.esperaDoAno = null;
      refazer(true);
      return true;
    }
    if (!arrastando || this.anoNaFonte === null || ano === null) {
      if (this.esperaDoAno != null) window.clearTimeout(this.esperaDoAno);
      this.esperaDoAno = null;
      refazer();
      return true;
    }
    // arrastando: refaz no fim da espera (o último ano pedido vale); a régua não engasga
    if (this.esperaDoAno == null)
      this.esperaDoAno = window.setTimeout(() => {
        this.esperaDoAno = null;
        if (this.destruido || !this.montado) return;
        refazer();
        this.aplicar();
        this.refazerAgregadoDaSelecao();
      }, ESPERA_DO_ANO_MS);
    return false;
  }

  /** linhas e subestações que já existiam no ano (para a escolha das maquetes e as torres) */
  private redeNoAno(): { linhas: FeatureCollection | null; subestacoes: FeatureCollection | null } {
    const ano = this.anoNaFonte;
    if (ano == null) return { linhas: this.linhas, subestacoes: this.subestacoes };
    const r = this.redeDoAno;
    if (r && r.ano === ano && r.vl === this.linhas && r.vs === this.subestacoes) return r;
    const existia = (f: Feature) => {
      const pr = f.properties as { op?: number | null; opAntesDe?: number | null };
      return (pr.op != null && pr.op <= ano) || (pr.op == null && pr.opAntesDe != null && pr.opAntesDe <= ano);
    };
    const filtrar = (fc: FeatureCollection | null) => (fc ? { ...fc, features: fc.features.filter(existia) } : null);
    this.redeDoAno = { ano, linhas: filtrar(this.linhas), subestacoes: filtrar(this.subestacoes), vl: this.linhas, vs: this.subestacoes };
    return this.redeDoAno;
  }

  // ── B2: o dono destacado ───────────────────────────────────────────

  /** CEGs do dono destacado (donos.ts), na lista do ano corrente; null sem dono. */
  private cegsDoDono: ReadonlySet<string> | null = null;
  /** a soma entre as usinas do dono (o agregado do símbolo da camada 'dono') */
  private genDoDono: Generalizacao | null = null;

  /** Para as sondas: o que o ano e o dono puseram no mapa agora. */
  depurarAnoEDono() {
    return {
      ano: this.anoNaFonte,
      somaDoAno: this.somaDoAno,
      naFonte: this.usinasNaFonte.length,
      datadas: this.usinasDatadas.length,
      semAno: this.usinasNaFonte.length - (this.anoNaFonte == null ? this.usinasNaFonte.length : this.usinasDatadas.length),
      dono: this.donoNaFonte,
      usinasDoDono: this.donoUsinas,
      custoDoAno: this.custoDoAno,
    };
  }
  private donoPosto = '';
  /** Entrega a fonte do dono: cópias das usinas dele (com a soma refeita só entre elas). */
  private entregarDono(forcar = false) {
    const fonte = this.mapa.getSource(F.dono) as mapboxgl.GeoJSONSource | undefined;
    if (!fonte) return;
    const chave = this.estado.capitulo === 'rede' ? (this.estado.donoDestacado ?? null) : null;
    const k = [chave ?? '', this.versaoDoAno, this.usinas.length].join('|');
    if (!forcar && k === this.donoPosto) return;
    this.donoPosto = k;
    this.donoNaFonte = chave;
    if (!chave) {
      this.cegsDoDono = null;
      this.donoUsinas = 0;
      fonte.setData(VAZIA);
      return;
    }
    // decisões leva 4, 2.4: TODAS as usinas do dono, também as menores (antes do zoom em que o
    // mapa as busca, o destaque perdia 3 das 13 da ENGIE): a chegada delas refaz esta fonte
    // (remarcar muda versaoDoAno, e a chave acima também leva o tamanho da lista)
    if (!this.menoresCarregadas && this.usinas.length) void this.carregarMenores();
    // a regra de quem tem parte é a de donos.ts (a mesma da lista do painel): fração > 0
    const cegs = new Set<string>();
    const copias: FeicaoUsina[] = [];
    for (const u of this.usinasDatadas) {
      if (u.properties.fase !== 0 || !chavesDoDono(u.properties.dono).includes(chave)) continue;
      cegs.add(u.properties.ceg);
      copias.push({ type: 'Feature', id: u.id, geometry: u.geometry, properties: { ...u.properties } });
    }
    // codigo.md 18 (defesa): chave que não bate com nenhuma usina não apaga o mapa inteiro
    this.cegsDoDono = cegs.size ? cegs : null;
    this.genDoDono = marcarGeneralizacao(copias);
    this.donoUsinas = copias.length;
    fonte.setData({ type: 'FeatureCollection', features: copias });
    // o setData mantém o feature-state por id: as maquetes de agora valem também na fonte nova
    for (const id of [...this.membrosSobAMaquete, ...this.membrosComoPonto]) this.marcarMaquete(F.usinas, id, true);
    for (const f of this.comMaquete.values()) if (f.source === F.usinas) this.marcarMaquete(F.usinas, f.id, true);
  }

  // ── montagem das camadas (a cada troca de estilo) ──────────────────

  private montar() {
    const m = this.mapa;
    const p = PALETA[this.estado.modo];
    // fontes recém-criadas nascem sem feature-state e sem dado: tudo o que foi
    // memorizado como "já entregue" deixa de valer e é refeito pelo aplicar() final
    this.ultimoEarRes = null;
    this.ultimasCores = null;
    this.memoDestaque = null;
    this.memoSelecao = null;
    this.memoSubmercados = null;
    this.memoMaquetes = null;
    this.memoMaqueteNoSimbolo = null;
    this.rotuloDasUsinasPosto = null;
    this.filtrosPostos = { se: '', comb: '' };
    this.destaqueDoConjuntoPosto = '';
    this.membrosSobAMaquete = new Set();
    // as camadas das usinas nascem com o tamanho pela soma (raioDoSimbolo(true))
    this.tamanhoPelaSoma = true;
    m.setFog(atmosfera(this.estado.modo));
    this.desenharIcones(p);

    const geo = (id: string, extra: Partial<mapboxgl.GeoJSONSourceRaw> = {}) => {
      if (!m.getSource(id)) m.addSource(id, { type: 'geojson', data: VAZIA, ...extra });
    };
    geo(F.paises, { promoteId: 'a3' });
    geo(F.bacias);
    geo(F.submercados, { promoteId: 'sub' });
    geo(F.roraima);
    geo(F.rotulosSub);
    geo(F.linhas);
    geo(F.subestacoes);
    geo(F.usinas);
    geo(F.dono);
    geo(F.reservatorios, { promoteId: 'cod' });
    for (const k of ['gasodutos', 'instalacoes', 'campos', 'blocos', 'baciasSed', 'presal', 'rotulosArea'] as const) geo(F[k]);
    geo(F.destaque);
    geo(F.selecao);
    geo(F.maquetes);
    geo(F.maquetesObstaculo);
    geo(F.maquetesMembros);
    geo(F.maquetesDestaque);
    geo(F.borda);
    this.bordaPosta = '';

    const add =(camada: mapboxgl.AnyLayer) => m.addLayer(camada, ANTES_DOS_ROTULOS);
    const acima = (camada: mapboxgl.AnyLayer) => m.addLayer(camada);

    // mundo
    add({
      id: 'paises-area',
      type: 'fill',
      source: F.paises,
      layout: { visibility: 'none' },
      paint: { 'fill-color': ['coalesce', ['feature-state', 'cor'], 'rgba(0,0,0,0)'], 'fill-opacity': 0.82, 'fill-outline-color': p.fioForte },
    });

    // água
    add({ id: 'bacias-area', type: 'fill', source: F.bacias, layout: { visibility: 'none' }, paint: { 'fill-color': p.categoria.hidro, 'fill-opacity': 0.07 } });
    add({
      id: 'bacias-fio',
      type: 'line',
      source: F.bacias,
      layout: { visibility: 'none', 'line-join': 'round' },
      paint: { 'line-color': p.categoria.hidro, 'line-width': 0.8, 'line-opacity': 0.7 },
    });

    // combustível: bacias sedimentares, blocos, campos e o pré-sal (por baixo de todo traço)
    montarAreas(add, p);
    // distribuidoras: fundo do capítulo da rede, por baixo dos submercados, das linhas e das usinas
    this.distrib.montar(add, p, this.estado.modo);

    // submercados
    add({
      id: 'submercados-area',
      type: 'fill',
      source: F.submercados,
      layout: { visibility: 'none' },
      paint: {
        // no capítulo da água a cor vem por feature-state (um passo de mês não refaz o tile);
        // fora dele o estado é nulo e vale a cor fixa de cada submercado
        'fill-color': ['coalesce', ['feature-state', 'cor'], ['match', ['get', 'sub'], 'N', p.submercado.N, 'NE', p.submercado.NE, 'SE', p.submercado.SE, 'S', p.submercado.S, p.tinta]],
        'fill-opacity': 0.08,
      },
    });
    add({
      id: 'submercados-fio',
      type: 'line',
      source: F.submercados,
      layout: { visibility: 'none', 'line-join': 'round' },
      paint: { 'line-color': p.tinta, 'line-width': ['interpolate', ['linear'], ['zoom'], 3, 1, 7, 1.8], 'line-opacity': 0.7 },
    });
    // Roraima antes da interligação (set/2025): fora do Norte, só o contorno tracejado, sem fundo
    add({
      id: 'roraima-fio',
      type: 'line',
      source: F.roraima,
      layout: { visibility: 'none', 'line-join': 'round' },
      paint: { 'line-color': p.tinta, 'line-width': ['interpolate', ['linear'], ['zoom'], 3, 1, 7, 1.6], 'line-opacity': 0.7, 'line-dasharray': [3, 2] },
    });

    // linhas de transmissão (a linguagem está em estilo.ts): previstas por baixo, sem casco;
    // depois dois andares em corrente alternada, cada um com seu casco de papel (o de cima
    // corta o de baixo nos cruzamentos); por fim a corrente contínua, faixa de ouro com alma
    // de papel. Dentro de cada andar a maior tensão vem por último (line-sort-key).
    const desloca = deslocamentoDosParalelos() as mapboxgl.Expression;
    const casco = (id: string) => ({
      id,
      type: 'line' as const,
      source: F.linhas,
      layout: { visibility: 'none' as const, 'line-cap': 'round' as const, 'line-join': 'round' as const, 'line-sort-key': ['get', 'kv'] as mapboxgl.Expression },
      paint: { 'line-color': p.papel, 'line-width': larguraDaLinha(1, true) as mapboxgl.Expression, 'line-opacity': 0.92, 'line-offset': desloca },
    });
    const traco = (id: string) => ({
      id,
      type: 'line' as const,
      source: F.linhas,
      layout: { visibility: 'none' as const, 'line-cap': 'round' as const, 'line-join': 'round' as const, 'line-sort-key': ['get', 'kv'] as mapboxgl.Expression },
      paint: { 'line-color': corDaLinha(p) as mapboxgl.Expression, 'line-width': larguraDaLinha(1) as mapboxgl.Expression, 'line-opacity': 1, 'line-offset': desloca },
    });
    add({
      id: 'linhas-previstas',
      type: 'line',
      source: F.linhas,
      layout: { visibility: 'none', 'line-cap': 'butt', 'line-join': 'round' },
      paint: { 'line-color': corDaLinha(p) as mapboxgl.Expression, 'line-width': larguraDaLinha(0.7) as mapboxgl.Expression, 'line-opacity': 0.72, 'line-dasharray': [2.2, 1.6] },
    });
    // B1: linha em operação hoje cujo ano de entrada o cadastro não dá para o ano escolhido (só a
    // data de carga da base, posterior a ele): fio fino em tinta suave, sem cor de tensão
    add({
      id: 'linhas-sem-ano',
      type: 'line',
      source: F.linhas,
      layout: { visibility: 'none', 'line-cap': 'butt', 'line-join': 'round' },
      paint: { 'line-color': p.tintaSuave, 'line-width': larguraDaLinha(0.55) as mapboxgl.Expression, 'line-opacity': 0.55 },
    });
    add(casco('linhas-casco-sub'));
    add(traco('linhas-sub'));
    add(casco('linhas-casco'));
    add(traco('linhas'));
    add({ ...casco('linhas-cc-casco'), layout: { visibility: 'none', 'line-cap': 'butt', 'line-join': 'round' } });
    add({
      id: 'linhas-cc',
      type: 'line',
      source: F.linhas,
      layout: { visibility: 'none', 'line-cap': 'butt', 'line-join': 'round' },
      paint: { 'line-color': p.linha.cc, 'line-width': larguraDaLinha(1) as mapboxgl.Expression, 'line-opacity': 1, 'line-offset': desloca },
    });
    add({
      id: 'linhas-cc-alma',
      type: 'line',
      source: F.linhas,
      minzoom: 4,
      layout: { visibility: 'none', 'line-cap': 'butt', 'line-join': 'round' },
      paint: {
        'line-color': p.papel,
        'line-width': larguraDaLinha(ALMA_DA_CC) as mapboxgl.Expression,
        'line-opacity': ['interpolate', ['linear'], ['zoom'], 4, 0, 4.8, 1],
        'line-offset': desloca,
      },
    });
    add({
      id: 'linhas-toque',
      type: 'line',
      source: F.linhas,
      layout: { visibility: 'none' },
      paint: { 'line-color': p.tinta, 'line-opacity': 0, 'line-width': 12 },
    });

    // gasodutos de transporte: traço na cor do gás, com casco de papel
    montarDutos(add, p);

    // subestações: quadrado de papel com fio de tinta, que cresce e ganha núcleo com a tensão
    const porte = porteDaSubestacao(SUBESTACAO_PREVISTA);
    add({
      id: 'subestacoes',
      type: 'symbol',
      source: F.subestacoes,
      minzoom: REGRA_DAS_SUBESTACOES.aPartirDoZoom,
      layout: {
        visibility: 'none',
        // posição a confirmar no cadastro: o mesmo quadrado com fio tracejado (a prevista já é só fio)
        'icon-image': ['concat', 'atlas-se-', porte, ['case', ['all', POSICAO_A_CONFIRMAR, ['!', SUBESTACAO_PREVISTA]], '-tracejado', '']] as mapboxgl.Expression,
        'icon-size': ['interpolate', ['linear'], ['zoom'], 4.6, 0.62, 8, 0.85, 12, 1.05],
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
        'symbol-sort-key': ['coalesce', ['get', 'kv'], 0],
        'text-field': ['step', ['zoom'], '', 8.6, ['get', 'n']],
        'text-font': FONTES_DO_MAPA.DADO,
        'text-size': ['step', ['coalesce', ['get', 'kv'], 0], 9.5, 500, 10.5],
        'text-offset': [0, 0.95],
        'text-anchor': 'top',
        'text-optional': true,
        'text-letter-spacing': 0.04,
        'text-max-width': 9,
      },
      paint: { 'text-color': p.tintaSuave, 'text-halo-color': p.papel, 'text-halo-width': 1.3, 'icon-opacity': 1 },
    });

    // usinas: símbolo proporcional (SDF: círculo ou quadrado de mesma área), os menores por cima
    add({
      id: 'usinas-futuras',
      type: 'symbol',
      source: F.usinas,
      layout: {
        visibility: 'none',
        'icon-image': FIO_SDF as mapboxgl.Expression,
        'icon-size': raioDoSimbolo(false, 0, FATOR_DA_FORMA),
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
        'symbol-sort-key': ['-', 0, ['get', 'kw']],
      },
      // só o contorno, tracejado não existe em SDF: fio cheio e mais fino que o da usina em operação
      paint: { 'icon-color': 'rgba(0,0,0,0)', 'icon-halo-color': corDaUsina(p) as mapboxgl.Expression, 'icon-halo-width': 0.6, 'icon-opacity': 0.9 },
    });
    const simbolo = (id: string, imagem: unknown[], extra = 0, fonte: string = F.usinas) => ({
      id,
      type: 'symbol' as const,
      source: fonte,
      layout: {
        visibility: 'none' as const,
        'icon-image': imagem as mapboxgl.Expression,
        // decisões leva 4, 2.4: o símbolo do dono tem piso de raio (5 px, 10 px de diâmetro mais
        // o halo): no zoom do Brasil o destaque eram pontos de 6–8 px que não se liam
        'icon-size': raioDoSimbolo(true, extra, FATOR_DA_FORMA, fonte === F.dono ? PISO_DO_DONO : 0),
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
        'symbol-sort-key': ORDEM_DA_USINA as mapboxgl.Expression,
      },
    });
    // halo de papel 1,5 px por fora: separa o símbolo do fundo e das linhas que passam por baixo
    add({ ...simbolo('usinas-halo', FORMA_SDF, 1.5), paint: { 'icon-color': SOME_SOB_A_MAQUETE(p.papel), 'icon-opacity': 0.9 } });
    // preenchimento translúcido (sem halo: o halo do SDF cobriria o miolo)...
    add({ ...simbolo('usinas', FORMA_SDF), paint: { 'icon-color': SOME_SOB_A_MAQUETE(corDaUsinaTranslucida(p, PREENCHIMENTO_DA_USINA)), 'icon-opacity': 1 } });
    // ...e o fio cheio na cor da fonte, por cima de todos os preenchimentos (tracejado: posição a confirmar)
    add({
      ...simbolo('usinas-fio', FIO_DA_USINA),
      paint: {
        'icon-color': 'rgba(0,0,0,0)',
        'icon-halo-color': SOME_SOB_A_MAQUETE(corDaUsina(p)),
        // o tracejado (posição a confirmar) é mais grosso: o vão do traço come metade do fio
        'icon-halo-width': ['interpolate', ['linear'], ['zoom'], 3, ['case', POSICAO_A_CONFIRMAR, 1, 0.6], 8, ['case', POSICAO_A_CONFIRMAR, 1.1, 0.7], 12, ['case', POSICAO_A_CONFIRMAR, 1.3, 0.85]] as mapboxgl.Expression,
        'icon-opacity': 1,
      },
    });
    // anel fino 3 px por fora: a marca de que o símbolo SOMA mais de uma usina (agregação do mapa)
    add({
      ...simbolo('usinas-anel', FIO_SDF, 3),
      paint: {
        'icon-color': 'rgba(0,0,0,0)',
        'icon-halo-color': SOME_SOB_A_MAQUETE(corDaUsina(p)),
        'icon-halo-width': 0.8,
        'icon-opacity': 0.85,
      },
    });
    // B1: usina em operação sem ano no cadastro, com um ano escolhido: só o contorno, em tinta
    // suave (sem a cor da fonte), no tamanho da própria potência; não entra na soma de ninguém
    add({
      ...simbolo('usinas-sem-ano', FIO_SDF, 0),
      layout: { ...simbolo('usinas-sem-ano', FIO_SDF, 0).layout, 'icon-size': raioDoSimbolo(false, 0, FATOR_DA_FORMA), 'symbol-sort-key': ['-', 0, ['get', 'kw']] as mapboxgl.Expression },
      paint: { 'icon-color': 'rgba(0,0,0,0)', 'icon-halo-color': p.tintaSuave, 'icon-halo-width': 0.9, 'icon-opacity': 0.75 },
    });
    // B2: as usinas do dono destacado, por cima das demais (que esmaecem): a mesma linguagem do
    // símbolo, com a soma refeita só entre as dele (fonte própria, cópias das feições)
    // (1 px maior que o símbolo comum, com halo de papel de 2,5 px: salta das esmaecidas)
    add({ ...simbolo('dono-halo', FORMA_SDF, 3.5, F.dono), paint: { 'icon-color': SOME_SOB_A_MAQUETE(p.papel), 'icon-opacity': 0.95 } });
    add({ ...simbolo('dono', FORMA_SDF, 1, F.dono), paint: { 'icon-color': SOME_SOB_A_MAQUETE(corDaUsinaTranslucida(p, 0.62)), 'icon-opacity': 1 } });
    add({
      ...simbolo('dono-fio', FIO_SDF, 1, F.dono),
      paint: { 'icon-color': 'rgba(0,0,0,0)', 'icon-halo-color': SOME_SOB_A_MAQUETE(corDaUsina(p)), 'icon-halo-width': 1, 'icon-opacity': 1 },
    });
    add({
      ...simbolo('dono-anel', FIO_SDF, 4, F.dono),
      paint: { 'icon-color': 'rgba(0,0,0,0)', 'icon-halo-color': SOME_SOB_A_MAQUETE(corDaUsina(p)), 'icon-halo-width': 0.8, 'icon-opacity': 0.9 },
    });

    // reservatórios: espelho d'água (capítulo da rede) ou escala do armazenamento (capítulo da água)
    add({
      id: 'reservatorios',
      type: 'circle',
      source: F.reservatorios,
      layout: { visibility: 'none', 'circle-sort-key': ['-', 0, ['coalesce', ['get', 'vutil'], 0]] },
      // cor e contorno por capítulo: definidos em aplicar() (água: escala do armazenamento,
      // com anel vazado para "sem série"; rede: espelho d'água)
      paint: {
        'circle-radius': raioDoReservatorio(),
        'circle-color': p.lago,
        'circle-opacity': 0.92,
        'circle-stroke-color': p.categoria.hidro,
        'circle-stroke-width': 1,
      },
    });

    // rótulos das usinas (acima das camadas de dado, abaixo dos rótulos de lugar): sem-serifa,
    // maiores para as maiores usinas, em volta do selo, as maiores primeiro
    add({
      id: 'usinas-rotulo',
      type: 'symbol',
      source: F.usinas,
      minzoom: 3.4,
      layout: {
        visibility: 'none',
        'text-field': ['coalesce', ['get', 'nm'], ['get', 'nome']],
        'text-font': FONTES_DO_MAPA.OBRA,
        'text-size': ['interpolate', ['linear'], ['zoom'], 3.4, ['step', ['get', 'kw'], 10.5, 1_000_000, 11.5], 9, ['step', ['get', 'kw'], 11.5, 300_000, 12.5, 1_000_000, 13.5]] as mapboxgl.Expression,
        'text-variable-anchor': ['right', 'left', 'top', 'bottom'],
        'text-radial-offset': afastamentoDoRotulo() as mapboxgl.Expression,
        'text-justify': 'auto',
        'text-max-width': 8,
        'text-padding': 2,
        'symbol-sort-key': ['-', 0, ['get', 'kw']],
      },
      paint: { 'text-color': p.tinta, 'text-halo-color': p.papel, 'text-halo-width': 1.4 },
    });
    // âncora do vencedor: o pé da maquete, no ponto do cadastro. Abaixo da camada 3D (que entra
    // antes de usinas-rotulo, depois desta): o corpo da maquete cobre a junção. Aparece com a
    // maquete, de 9,4 a 9,8 (a troca é guiada pelo zoom, sem animação por tempo).
    m.addLayer(
      {
        id: 'maquetes-ancora',
        type: 'symbol',
        source: F.maquetes,
        layout: {
          'icon-image': ['get', 'ancora'],
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
          'icon-size': 1,
        },
        // a âncora da subestação e da instalação da ANP é um quadrado que lia como o símbolo 2D por
        // cima do corpo (recado do dono dos modelos, 3): só a usina mantém a âncora visível
        // decisões leva 4, 1.1 (recado do regra-e-3d): em repouso nada interpolado pelo zoom; a
        // entrada e a saída da maquete são no tempo (camada3d)
        paint: { 'icon-opacity': ['case', ['==', ['get', 'familia'], 'usina'], 1, 0] },
      },
      'usinas-rotulo',
    );
    // destaque do conjunto (só no hover e na seleção; nada em repouso): a envoltória dos
    // pontos do conjunto em fio tracejado e um anel de ouro em cada membro. No chão, abaixo
    // da camada 3D (que entra antes de usinas-rotulo, depois destas).
    m.addLayer(
      {
        id: 'maquetes-destaque-envoltoria',
        type: 'line',
        source: F.maquetesDestaque,
        filter: ['==', ['geometry-type'], 'LineString'],
        layout: { 'line-join': 'miter' },
        paint: { 'line-color': p.tinta, 'line-opacity': 0.35, 'line-width': 1, 'line-dasharray': [2, 2] },
      },
      'usinas-rotulo',
    );
    m.addLayer(
      {
        id: 'maquetes-destaque-anel',
        type: 'circle',
        source: F.maquetesDestaque,
        filter: ['==', ['geometry-type'], 'Point'],
        paint: { 'circle-radius': raioDaUsina(2.5), 'circle-color': 'rgba(0,0,0,0)', 'circle-stroke-color': p.ouro, 'circle-stroke-width': 1 },
      },
      'usinas-rotulo',
    );
    // área de toque dos membros: invisível (8 px no desktop, 22 no celular, na propriedade r)
    m.addLayer(
      {
        id: 'maquetes-membros-toque',
        type: 'circle',
        source: F.maquetesMembros,
        paint: { 'circle-radius': ['get', 'r'], 'circle-opacity': 0, 'circle-stroke-width': 0 },
      },
      'usinas-rotulo',
    );
    // o membro de um conjunto com maquete: ponto de 2,5 px na cor da fonte a 45%, sem fio (o
    // disco proporcional dele sai por feature-state). A ligação com a semente fica no hover
    // (anel de ouro). No celular, em repouso, nenhum.
    m.addLayer(
      {
        id: 'maquetes-membros-ponto',
        type: 'circle',
        source: F.maquetesMembros,
        filter: ['all', ['==', ['get', 'sob'], 0], ['!=', ['get', 'cel'], 1]],
        paint: { 'circle-radius': 2.5, 'circle-color': corDaUsina(p) as mapboxgl.Expression, 'circle-opacity': 0.45, 'circle-stroke-width': 0 },
      },
      'maquetes-membros-toque',
    );
    add({
      id: 'reservatorios-rotulo',
      type: 'symbol',
      source: F.reservatorios,
      minzoom: 4.2,
      layout: {
        visibility: 'none',
        'text-field': ['get', 'n'],
        'text-font': FONTES_DO_MAPA.AGUA,
        'text-size': ['step', ['coalesce', ['get', 'vutil'], 0], 10.5, 4000, 11.5],
        'text-offset': [0, 1.1],
        'text-anchor': 'top',
        'text-transform': 'none',
        'text-padding': 4,
        'text-letter-spacing': 0.04,
        'symbol-sort-key': ['-', 0, ['coalesce', ['get', 'vutil'], 0]],
      },
      paint: { 'text-color': p.rotuloRio, 'text-halo-color': p.papel, 'text-halo-width': 1.3 },
    });
    // rótulos do combustível (dutos, instalações, campos, bacias, pré-sal)
    montarRotulos(add, p);
    // selo da fonte: acima dos rótulos das usinas, para ser posto antes deles (os rótulos
    // contornam o selo). Só onde há espaço, as maiores primeiro; onde não cabe, fica o
    // símbolo proporcional, que nunca some.
    add({
      id: 'usinas-selo',
      type: 'symbol',
      source: F.usinas,
      minzoom: 3,
      layout: {
        visibility: 'none',
        'icon-image': IMAGEM_DO_SELO as mapboxgl.Expression,
        'icon-size': tamanhoDoSelo(true),
        'icon-allow-overlap': false,
        'icon-ignore-placement': false,
        // respiro entre selos: onde dois não cabem, fica o de maior soma; o outro segue no símbolo proporcional
        'icon-padding': 2,
        'symbol-sort-key': ORDEM_DA_USINA as mapboxgl.Expression,
      },
      paint: { 'icon-opacity': ['interpolate', ['linear'], ['zoom'], 2.9, 0, 3.1, 1] },
    });
    // instalações de gás e petróleo: acima do selo e das maquetes. Entram na colisão: onde o
    // terminal ou a refinaria estão, o selo da usina vizinha cede e fica o símbolo proporcional
    // dela por baixo (a usina nunca some; a instalação da ANP nunca fica escondida)
    montarInstalacoes(add);
    // selo do vencedor durante a troca 2D → 3D: cheio em 9,4, some até 9,8 enquanto a maquete
    // cresce do chão. Com a câmera de cima o aerogerador não é desenhado e o selo fica cheio.
    // Fora da colisão: quem cede espaço é a escolha, não o Mapbox.
    add({
      id: 'maquetes-selo-troca',
      type: 'symbol',
      source: F.maquetes,
      filter: ['!=', ['get', 'selo'], ''],
      layout: {
        'icon-image': ['get', 'selo'],
        'icon-size': ['get', 'seloTam'],
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
      },
      // só o aerogerador visto de cima (não desenhado em 3D) fica com o selo (recado do regra-e-3d)
      paint: { 'icon-opacity': ['case', ['==', ['get', 'deCima'], 1], 1, 0] },
    });

    // rótulo do vencedor (nome; nos conjuntos, "+n parques · X MW"): abaixo da caixa da
    // maquete, pelo afastamento calculado na escolha. Acima dos rótulos de lugar: é posto
    // primeiro e os outros desviam dele. No celular, só os três de maior prioridade.
    acima({
      id: 'maquetes-rotulo',
      type: 'symbol',
      source: F.maquetes,
      filter: ['==', ['get', 'mostrar'], 1],
      layout: {
        'text-field': [
          'format',
          ['get', 'nome'],
          {},
          ['case', ['==', ['get', 'linha2'], ''], '', '\n'],
          {},
          ['get', 'linha2'],
          // decisões leva 4, 1.5: o subtítulo ('+22 parques · 698 MW') no mesmo corpo do nome, em
          // tinta (não cinza), peso mais leve: legível sem pesar mais que o nome
          { 'font-scale': 1, 'text-font': ['literal', FONTES_DO_MAPA.OBRA_LEVE], 'text-color': p.tinta },
        ] as mapboxgl.Expression,
        'text-font': ['case', ['==', ['get', 'familia'], 'rede'], ['literal', FONTES_DO_MAPA.DADO], ['literal', FONTES_DO_MAPA.OBRA]] as mapboxgl.Expression,
        'text-size': ['get', 'tamTela'],
        'text-variable-anchor': ['top'],
        'text-radial-offset': ['get', 'off'],
        'text-justify': 'center',
        'text-max-width': 11,
        'text-padding': 2,
        'text-letter-spacing': ['case', ['==', ['get', 'familia'], 'rede'], 0.04, 0] as mapboxgl.Expression,
        'symbol-sort-key': ['get', 'ordem'],
      },
      paint: {
        'text-color': p.tinta,
        'text-halo-color': p.papel,
        'text-halo-width': 1.4,
        // opaco em repouso; a entrada é o fade do próprio Mapbox (fadeDuration, 0 no movimento reduzido)
        'text-opacity': 1,
      },
    });

    // destaque (vistas e busca) e seleção: acima de tudo, inclusive dos rótulos de lugar
    acima({
      id: 'destaque-area',
      type: 'line',
      source: F.destaque,
      filter: ['in', ['geometry-type'], ['literal', ['Polygon', 'MultiPolygon']]],
      layout: { 'line-join': 'round' },
      paint: { 'line-color': p.oxido, 'line-width': 2.2, 'line-opacity': 0.9 },
    });
    acima({
      id: 'destaque-linha',
      type: 'line',
      source: F.destaque,
      filter: ['in', ['geometry-type'], ['literal', ['LineString', 'MultiLineString']]],
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': p.oxido, 'line-width': ['interpolate', ['linear'], ['zoom'], 3, 2.6, 8, 4.5], 'line-opacity': 0.92 },
    });
    acima({
      id: 'destaque-ponto',
      type: 'circle',
      source: F.destaque,
      filter: ['==', ['geometry-type'], 'Point'],
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, ['+', 4, ['max', 1.2, ['*', 0.085, ['sqrt', ['/', ['coalesce', ['get', 'kw'], 0], 1000]]]]], 6, ['+', 5, ['max', 2.2, ['*', 0.2, ['sqrt', ['/', ['coalesce', ['get', 'kw'], 0], 1000]]]]], 12, ['+', 6, ['max', 4.5, ['*', 0.62, ['sqrt', ['/', ['coalesce', ['get', 'kw'], 0], 1000]]]]]],
        'circle-color': 'rgba(0,0,0,0)',
        'circle-stroke-color': p.oxido,
        'circle-stroke-width': 1.8,
      },
    });
    acima({
      id: 'destaque-rotulo',
      type: 'symbol',
      source: F.destaque,
      filter: ['all', ['==', ['geometry-type'], 'Point'], ['has', 'rotulo']],
      layout: {
        'text-field': ['get', 'rotulo'],
        'text-font': FONTES_DO_MAPA.SERIFA_FORTE,
        'text-size': 13,
        'text-offset': [0, 1.3],
        'text-anchor': 'top',
        'text-max-width': 9,
        'text-allow-overlap': false,
        'text-padding': 2,
      },
      paint: { 'text-color': p.oxido, 'text-halo-color': p.papel, 'text-halo-width': 1.8 },
    });
    acima({
      id: 'submercados-rotulo',
      type: 'symbol',
      source: F.rotulosSub,
      maxzoom: 6.2,
      layout: {
        visibility: 'none',
        'text-field': ['match', ['get', 'sub'], 'SE', 'SUDESTE / CENTRO-OESTE', 'S', 'SUL', 'NE', 'NORDESTE', 'N', 'NORTE', ''],
        'text-font': FONTES_DO_MAPA.DADO,
        'text-size': ['interpolate', ['linear'], ['zoom'], 2.5, 9, 5, 12],
        'text-letter-spacing': 0.14,
        'text-max-width': 8,
        'text-allow-overlap': true,
        'text-ignore-placement': true,
      },
      paint: { 'text-color': p.tinta, 'text-halo-color': p.papel, 'text-halo-width': 1.6 },
    });
    // área selecionada: véu de papel por dentro e fio óxido de 1,5 px (achado 10: o traço de
    // 2,6 px serrilhava a concessão inteira e era a maior mancha de óxido do Atlas)
    // (o véu entra por baixo dos rótulos: clareia a área sem lavar os nomes)
    add({
      id: 'selecao-area-veu',
      type: 'fill',
      source: F.selecao,
      filter: ['in', ['geometry-type'], ['literal', ['Polygon', 'MultiPolygon']]],
      paint: { 'fill-color': p.papel, 'fill-opacity': 0.2 },
    });
    acima({
      id: 'selecao-area',
      type: 'line',
      source: F.selecao,
      filter: ['in', ['geometry-type'], ['literal', ['Polygon', 'MultiPolygon']]],
      layout: { 'line-join': 'round' },
      paint: { 'line-color': p.oxido, 'line-width': 1.5 },
    });
    acima({
      id: 'selecao-linha',
      type: 'line',
      source: F.selecao,
      filter: ['in', ['geometry-type'], ['literal', ['LineString', 'MultiLineString']]],
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': p.oxido, 'line-width': ['interpolate', ['linear'], ['zoom'], 3, 3.2, 8, 5.5] },
    });
    // anel de seleção: a mesma régua do disco (usina ou reservatório), 4 px por fora, em qualquer zoom
    acima({
      id: 'selecao-ponto',
      type: 'circle',
      source: F.selecao,
      filter: ['all', ['==', ['geometry-type'], 'Point'], ['!=', ['get', 'res'], 1]],
      paint: { 'circle-radius': raioDaUsina(4, 7), 'circle-color': 'rgba(0,0,0,0)', 'circle-stroke-color': p.oxido, 'circle-stroke-width': 2.2 },
    });
    // o anel de seleção e o do destaque ficam no chão, abaixo da camada 3D e dos rótulos das
    // maquetes: o corpo do modelo cobre o anel, nunca o anel risca o corpo nem o nome (achado 22)
    if (m.getLayer('maquetes-ancora')) {
      m.moveLayer('selecao-ponto', 'maquetes-ancora');
      if (m.getLayer('destaque-ponto')) m.moveLayer('destaque-ponto', 'maquetes-ancora');
    }
    acima({
      id: 'selecao-reservatorio',
      type: 'circle',
      source: F.selecao,
      filter: ['all', ['==', ['geometry-type'], 'Point'], ['==', ['get', 'res'], 1]],
      paint: { 'circle-radius': raioDoReservatorio(4, 7), 'circle-color': 'rgba(0,0,0,0)', 'circle-stroke-color': p.oxido, 'circle-stroke-width': 2.2 },
    });

    // obstáculo de borda: logo abaixo do das maquetes, acima de todo rótulo (é colocado antes deles)
    acima({
      id: 'borda-obstaculo',
      type: 'symbol',
      source: F.borda,
      layout: {
        'icon-image': ['get', 'img'],
        'icon-allow-overlap': true,
        'icon-ignore-placement': false,
        'icon-padding': 0,
        'icon-pitch-alignment': 'viewport',
        'icon-rotation-alignment': 'viewport',
      },
      paint: { 'icon-opacity': 0 },
    });
    // obstáculo das maquetes (§8): um ícone transparente do tamanho da caixa de tela de cada
    // maquete, na camada mais alta. O Mapbox coloca os símbolos de cima para baixo, então o
    // obstáculo entra primeiro no índice de colisão e todo rótulo abaixo (cidade, rio,
    // subestação, combustível, o nome das outras maquetes) desvia dele. Sempre colocado
    // (allow-overlap), nunca ignorado (ignore-placement falso). Alvo de clique e hover.
    acima({
      id: 'maquetes-obstaculo',
      type: 'symbol',
      source: F.maquetesObstaculo,
      layout: {
        'icon-image': ['get', 'img'],
        'icon-size': ['get', 's'],
        'icon-offset': ['get', 'off'],
        // ancorado no canto de baixo: a sobra da faixa de proporção vai para cima (céu), nunca
        // para baixo, onde mora o rótulo da própria maquete
        'icon-anchor': 'bottom-left',
        'icon-allow-overlap': true,
        'icon-ignore-placement': false,
        'icon-padding': 0,
        'icon-pitch-alignment': 'viewport',
        'icon-rotation-alignment': 'viewport',
      },
      paint: { 'icon-opacity': 0 },
    });

    // capítulo "O comércio": depois da fonte dos países (o tom dos parceiros lê atlas-paises)
    this.comercio.montar(add, p, this.estado.modo);
    // capítulo "Um dia", modo dia real (mapa/pulso.ts)
    this.pulso.montar(add, p, this.estado.modo);

    if (this.maquetes) {
      this.maquetes.definirModo(this.estado.modo);
      m.addLayer(this.maquetes.camada(), this.antesDasMaquetes());
    }
    // com todas as camadas no estilo, as distribuidoras ligadas sobem por cima da rede (B4)
    this.distrib.ordenar();
    this.comercio.ordenar();
    this.pulso.ordenar();
    // O nome do estado era colocado antes do selo da fonte (rótulo da base fica acima dos dados,
    // e o Mapbox coloca de cima para baixo): no zoom 3,6 o selo de Belo Monte e o do polo eólico
    // da Bahia perdiam para "PARÁ" e "BAHIA". Logo abaixo do selo, o nome é colocado depois dele
    // e desvia (âncora variável em estilo.ts); continua acima das linhas e dos discos.
    if (m.getLayer('base-rotulo-uf') && m.getLayer('usinas-selo')) m.moveLayer('base-rotulo-uf', 'usinas-selo');

    // relevo 3D: o pedido feito antes da montagem (ou antes da troca de modo) vale agora
    if (this.relevoLigado) m.setTerrain({ source: 'relevo', exaggeration: 1.5 });

    this.montado = true;
    this.jaMontou = true;
    this.alimentar();
    this.aplicar();
    this.atualizarBorda();

    // CTL-4 (medido: em Santos, trocar claro → noturno parado devolvia o quadrado da UTE sob a
    // base da RPBC, e ele ficava até o próximo movimento): o que sai por estar sob o corpo ou o
    // rótulo de uma maquete é achado por queryRenderedFeatures, que volta vazio enquanto as fontes
    // recriadas pela troca de estilo não terminaram. Quando usinas e instalações terminam, e de
    // novo no primeiro 'idle', a conta se refaz.
    const refazer = (ev: mapboxgl.MapSourceDataEvent) => {
      if (this.destruido) return void m.off('sourcedata', refazer);
      if (ev.sourceId !== F.usinas && ev.sourceId !== F.instalacoes) return;
      if (!m.getSource(F.usinas) || !m.isSourceLoaded(F.usinas) || (m.getSource(F.instalacoes) && !m.isSourceLoaded(F.instalacoes))) return;
      m.off('sourcedata', refazer);
      this.agendarObstaculo();
    };
    m.on('sourcedata', refazer);
    m.once('idle', () => {
      if (!this.destruido) this.agendarObstaculo();
    });
  }

  /** Ícones desenhados em canvas com as cores do modo (as mesmas funções de desenho da
   *  legenda, em estilo.ts): formas SDF do símbolo proporcional, selos e âncoras das
   *  usinas, subestações por porte e pontos de cidade. */
  private desenharIcones(p: PaletaDoMapa) {
    const m = this.mapa;
    const fazer = (nome: string, lado: number, desenho: (c: CanvasRenderingContext2D) => void) => {
      const cv = document.createElement('canvas');
      cv.width = cv.height = lado * 2;
      const c = cv.getContext('2d');
      if (!c) return;
      c.scale(2, 2);
      desenho(c);
      const img = c.getImageData(0, 0, lado * 2, lado * 2);
      if (m.hasImage(nome)) m.removeImage(nome);
      m.addImage(nome, img, { pixelRatio: 2 });
    };
    for (const forma of ['disco', 'quadro'] as const) {
      for (const fio of [false, true]) {
        const nome = `atlas-sdf-${forma}${fio ? '-fio' : ''}`;
        if (m.hasImage(nome)) m.removeImage(nome);
        m.addImage(nome, imagemSdf(forma, fio), { sdf: true, pixelRatio: 1 });
      }
      // contorno tracejado da usina de posição a confirmar no cadastro
      const nome = `atlas-sdf-${forma}-tracejado`;
      if (m.hasImage(nome)) m.removeImage(nome);
      m.addImage(nome, imagemSdf(forma, true, true), { sdf: true, pixelRatio: 1 });
    }
    for (const cat of CATEGORIAS) {
      fazer(`atlas-selo-${cat}`, LADO_DO_SELO, (c) => desenharSelo(c, cat, p));
      fazer(`atlas-ancora-${cat}`, LADO_DA_ANCORA, (c) => desenharAncora(c, cat, p));
    }
    for (const porte of ['alta', 'media', 'baixa', 'prevista'] as const) fazer(`atlas-se-${porte}`, LADO_DA_SUBESTACAO, (c) => desenharSubestacao(c, porte, p));
    for (const porte of ['alta', 'media', 'baixa'] as const) fazer(`atlas-se-${porte}-tracejado`, LADO_DA_SUBESTACAO, (c) => desenharSubestacao(c, porte, p, true));
    // obstáculos de borda (transparentes): rótulo da base e do Atlas não nasce cortado na borda da tela
    for (const [nome, w, h] of [['atlas-borda-h', BORDA_PASSO + 8, BORDA_ESPESSURA], ['atlas-borda-v', BORDA_ESPESSURA, BORDA_PASSO + 8]] as const) {
      if (m.hasImage(nome)) m.removeImage(nome);
      m.addImage(nome, { width: w, height: h, data: new Uint8Array(w * h * 4) }, { pixelRatio: 1 });
    }
    for (const tipo of ['refinaria', 'gnl', 'upgn', 'terminal'] as TipoDeInstalacao[]) fazer(`atlas-inst-${tipo}`, LADO_DA_INSTALACAO, (c) => desenharInstalacao(c, tipo, p));
    fazer('atlas-ancora-rede', LADO_DA_ANCORA, (c) => desenharAncora(c, 'rede', p));
    // obstáculos transparentes, um por faixa de proporção altura/largura (o icon-size escala
    // os dois lados juntos; a faixa logo acima cobre a caixa, sobrando no máximo 25% de altura)
    for (let i = 0; i < OBSTACULO_RAZOES.length; i++) {
      const nome = `atlas-obst-${i}`;
      if (m.hasImage(nome)) m.removeImage(nome);
      const h = Math.max(1, Math.round(OBSTACULO_LARGURA * OBSTACULO_RAZOES[i]));
      m.addImage(nome, { width: OBSTACULO_LARGURA, height: h, data: new Uint8Array(OBSTACULO_LARGURA * h * 4) }, { pixelRatio: 1 });
    }
    fazer('atlas-cidade', LADO_DA_CIDADE, (c) => desenharCidade(c, 'cidade', p));
    fazer('atlas-cidade-capital', LADO_DA_CIDADE, (c) => desenharCidade(c, 'capital', p));
    fazer('atlas-cidade-pais', LADO_DA_CIDADE, (c) => desenharCidade(c, 'pais', p));
  }

  /** Papéis 2D com as maquetes ligadas (§7): o vencedor some do símbolo proporcional e do selo
   *  por feature-state (âncora, selo da troca e rótulo dele vêm da fonte das maquetes); o selo
   *  dos membros e dos perdedores sai de 9,8 a 10,2; o rótulo deles sai a partir de 9,4 (só as
   *  maquetes têm nome em repouso; o nome dos discos vem no hover). A subestação que perdeu
   *  mantém o quadrado; o nome permanente fica para 230 kV ou mais no nível regional e para
   *  todas de perto. */
  private memoMaqueteNoSimbolo: boolean | null = null;
  private aplicarMaquetesNosSimbolos(maquete: boolean) {
    const m = this.mapa;
    if (this.memoMaqueteNoSimbolo === maquete || !m.getLayer('usinas')) return;
    this.memoMaqueteNoSimbolo = maquete;
    m.setLayerZoomRange('usinas-selo', 3, maquete ? ZOOM_SEM_SELO : 24);
    const n = ['get', 'n'];
    const kv = ['coalesce', ['get', 'kv'], 0];
    // o Mapbox avalia ['zoom'] de layout no zoom inteiro do tile: degraus inteiros
    m.setLayoutProperty('subestacoes', 'text-field', maquete ? ['step', ['zoom'], '', 8.6, n, 9, ['case', ['>=', kv, 345], n, ''], 12, n] : ['step', ['zoom'], '', 8.6, n]);
  }

  /** O rótulo 2D das usinas com as maquetes ligadas sai a partir de 9,4 (as maquetes têm
   *  rótulo próprio). Visibilidade, não opacidade: o rótulo transparente ainda colide. */
  private rotuloDasUsinasQuer = false;
  private rotuloDasUsinasPosto: boolean | null = null;
  private aplicarRotuloDasUsinas() {
    const perto = this.estado.camadas.has('maquetes') && ['rede', 'agua', 'combustivel'].includes(this.estado.capitulo) && this.mapa.getZoom() >= ZOOM_DAS_MAQUETES;
    const ver = this.rotuloDasUsinasQuer && !perto;
    if (ver === this.rotuloDasUsinasPosto) return;
    this.rotuloDasUsinasPosto = ver;
    this.ver('usinas-rotulo', ver);
  }

  /** Onde a camada das maquetes entra: abaixo dos rótulos das usinas e dos reservatórios
   *  (o nome fica legível por cima do modelo 3D), acima dos símbolos 2D (a âncora fica no pé). */
  private antesDasMaquetes(): string {
    return this.mapa.getLayer('usinas-rotulo') ? 'usinas-rotulo' : ANTES_DOS_ROTULOS;
  }

  // ── aplicação do estado ────────────────────────────────────────────

  atualizar(novo: EstadoDoMapa) {
    const antes = this.estado;
    this.estado = novo;
    if (novo.modo !== antes.modo) {
      this.montado = false;
      this.memoria.limpar();
      // o estilo novo nasce sem feature-state: o regime da opacidade das usinas recomeça
      this.opacidadeDasUsinas = null;
      // diff: false — com o diff (padrão do Mapbox 3) as camadas do Atlas somem e o
      // 'style.load' não dispara, então montar() nunca rodaria de novo. Reconstruindo do
      // zero, 'style.load' dispara e montar() repõe fontes, camadas, ícones, feature-state,
      // relevo e maquetes; aplicar() repõe discos do dia e arcos das trocas com a paleta nova.
      this.mapa.setStyle(estiloDoMapa(novo.modo), { diff: false });
      return;
    }
    if (!this.montado) return;
    // a memória da estabilidade vale para o mesmo capítulo, as mesmas camadas e o mesmo modo
    if (novo.capitulo !== antes.capitulo || novo.camadas !== antes.camadas) this.memoria.limpar();
    if (novo.paises !== antes.paises) {
      this.alimentar(['paises']);
      this.ultimasCores = null;
    }
    // a área livre mudou sem a câmera andar (ficha aberta ou fechada, coluna recolhida): reconta
    // e, na composição do Titã, desliza o globo para o centro da área livre nova (A1.2)
    if (novo.margens !== antes.margens) {
      this.avisarAreaLivre();
      this.recomporTita();
    }
    this.acompanharSelecao(antes, novo);
    // só as margens mudaram: aplicar() não as lê (só a câmera lê, no próximo voo)
    if (this.soMargensMudaram(antes, novo)) return;
    this.aplicar();
  }

  /** O último ponto selecionado (usina, subestação, instalação, entidade do dia): âncora do
   *  "+"/"−" e do recentrar ao fechar a ficha (critico-celular 3). Sai ao trocar de capítulo. */
  private ultimoSelecionado: { lngLat: [number, number]; tipo: TipoDeAtivo } | null = null;
  private recentrarPendente: number | null = null;
  private acompanharSelecao(antes: EstadoDoMapa, novo: EstadoDoMapa) {
    if (novo.capitulo !== antes.capitulo) this.ultimoSelecionado = null;
    const s = novo.selecionado;
    // leva 5: a ficha da rota do comércio fechou (ou outra coisa foi escolhida): o disco volta ao
    // meio da tela (o padding do enquadramento da rota sai); a rota nova, se houver, enquadra de novo
    const ehRota = (x: EstadoDoMapa['selecionado']) => x?.tipo === 'comercio' && String(x.chave).startsWith('v:');
    if (this.paddingDaRota && ehRota(antes.selecionado) && !ehRota(s)) {
      this.paddingDaRota = false;
      if (this.temPadding() && !this.parandoCamera) {
        this.geracaoDaCamera++;
        this.mapa.easeTo({ padding: SEM_PADDING, duration: this.estado.movimentoReduzido ? 0 : 500, essential: false });
      }
    }
    if (s?.lngLat && s.tipo !== 'comercio') this.ultimoSelecionado = { lngLat: s.lngLat, tipo: s.tipo };
    // celular: a ficha fechou (a folha de baixo saiu): o selecionado volta ao meio da área livre
    // (as margens novas chegam no mesmo render ou no seguinte: lidas um pouco depois)
    if (antes.selecionado && !s && novo.capitulo === antes.capitulo && window.innerWidth <= 860 && this.ultimoSelecionado) {
      if (this.recentrarPendente != null) window.clearTimeout(this.recentrarPendente);
      const alvo = this.ultimoSelecionado;
      const geracao = this.geracaoDaCamera;
      this.recentrarPendente = window.setTimeout(() => {
        this.recentrarPendente = null;
        const m = this.mapa;
        if (this.destruido || !this.montado || this.naComposicao || m.isMoving() || this.estado.selecionado) return;
        // um pedido de câmera mais novo que a ficha fechada (link, vista, botão) vence
        if (geracao !== this.geracaoDaCamera) return;
        this.geracaoDaCamera++;
        const { left, right, top, bottom, w, h } = this.margensSeguras();
        const q = m.project(alvo.lngLat);
        // só quem ainda está na tela (o leitor que já andou para longe não é puxado de volta)
        if (q.x < 0 || q.x > w || q.y < 0 || q.y > h) return;
        const comMaquete = alvo.tipo === 'usina' || alvo.tipo === 'subestacao' || alvo.tipo === 'instalacao';
        m.easeTo({
          center: alvo.lngLat,
          offset: [(left - right) / 2, (top - bottom) / 2 + (comMaquete && m.getZoom() >= ZOOM_DAS_MAQUETES ? 50 : 0)],
          duration: this.estado.movimentoReduzido ? 0 : 500,
          essential: false,
          ...(this.temPadding() ? { padding: SEM_PADDING } : {}),
        });
      }, 120);
    }
  }
  /** "+"/"−": aproxima em torno do último selecionado enquanto ele estiver na área livre
   *  (critico-celular 3: depois de fechar a ficha de Itaipu, dois "+" tiravam a maquete da tela). */
  ancoraDoZoom(): { around?: mapboxgl.LngLatLike } {
    const a = this.ultimoSelecionado;
    if (!a || this.naComposicao) return {};
    const { left, right, top, bottom, w, h } = this.margensSeguras();
    const q = this.mapa.project(a.lngLat);
    const dentro = q.x >= left && q.x <= w - right && q.y >= top && q.y <= h - bottom;
    return dentro ? { around: a.lngLat } : {};
  }

  private soMargensMudaram(a: EstadoDoMapa, b: EstadoDoMapa): boolean {
    if (a.margens === b.margens) return false;
    for (const k of Object.keys(b) as (keyof EstadoDoMapa)[]) if (k !== 'margens' && a[k] !== b[k]) return false;
    for (const k of Object.keys(a) as (keyof EstadoDoMapa)[]) if (k !== 'margens' && !(k in b)) return false;
    return true;
  }

  private ver(camada: string, visivel: boolean) {
    if (this.mapa.getLayer(camada)) this.mapa.setLayoutProperty(camada, 'visibility', visivel ? 'visible' : 'none');
  }

  private aplicar() {
    if (!this.montado) return;
    const m = this.mapa;
    const e = this.estado;
    const p = PALETA[e.modo];
    const cap = e.capitulo;
    const on = (c: CamadaId) => e.camadas.has(c);
    const rede = cap === 'rede';
    const agua = cap === 'agua';
    const trocas = cap === 'trocas';
    const dia = cap === 'dia';
    const mundo = cap === 'mundo';
    const comb = cap === 'combustivel';
    // Esmaece só a camada em que há itens destacados (para os destacados saltarem).
    // Destaque só de área (submercado, bacia, país) ou vista sem destaque não apaga nada:
    // nessas, as usinas e as linhas costumam ser justamente o assunto.
    const dq = e.destaque;
    const destacaUsinas = !!dq?.usinas?.length;
    const destacaLinhas = !!dq?.linhas?.length;
    const destacaSubestacoes = !!dq?.subestacoes?.length;
    const destacaReservatorios = !!dq?.reservatorios?.length;
    // em vista de aula o mapa mostra um degrau a mais de usinas e de linhas do que o zoom daria
    const folga = dq?.deVista ? 1.2 : 0;

    // mapa base
    this.ver('base-relevo', on('relevo') && !on('satelite'));
    this.ver('base-satelite', on('satelite'));
    const sat = on('satelite');
    m.setPaintProperty('base-mar', 'fill-opacity', sat ? 0 : 1);
    m.setPaintProperty('base-margem', 'line-opacity', sat ? 0 : ['interpolate', ['linear'], ['zoom'], 2, 0.6, 8, 0.9]);
    this.ver('base-curva', !sat);
    // Sobre a foto, cada rótulo (da base e do Atlas) mantém a cor do modo e ganha um halo
    // mais largo e mais opaco: um sistema só de rótulo, com ou sem satélite.
    for (const id of ROTULOS_DA_BASE) {
      const { cor, halo } = corDoRotuloDaBase(id, p);
      m.setPaintProperty(id, 'text-color', cor);
      m.setPaintProperty(id, 'text-halo-color', sat ? p.haloSatelite : halo);
      m.setPaintProperty(id, 'text-halo-width', sat ? 1.9 : HALO_DA_BASE[id]);
    }
    m.setPaintProperty('base-rotulo-uf', 'text-opacity', sat ? 0.92 : 0.62);
    for (const [id, largura] of HALO_DOS_DADOS) {
      if (!m.getLayer(id)) continue;
      m.setPaintProperty(id, 'text-halo-color', sat ? p.haloSatelite : p.papel);
      m.setPaintProperty(id, 'text-halo-width', sat ? largura + 0.6 : largura);
    }
    // a maquete toma o lugar do símbolo de perto: âncora no pé, rótulo abaixo dela
    this.aplicarMaquetesNosSimbolos(on('maquetes') && (rede || agua || comb));

    // usinas (no capítulo do combustível, só as térmicas que queimam gás, óleo e carvão)
    const cats = CATEGORIAS.filter((c) => on(c));
    const mostraUsinas = (rede || agua || comb) && cats.length > 0;
    const catsAgua: Categoria[] = ['hidro'];
    const catsComb: readonly Categoria[] = CATEGORIAS_DO_COMBUSTIVEL;
    const lista = agua ? catsAgua.filter((c) => cats.includes(c)) : comb ? cats.filter((c) => catsComb.includes(c)) : cats;
    const filtroCat: unknown[] = ['in', ['get', 'cat'], ['literal', lista]];
    // limiar por zoom, generalização e óleo pequeno: a mesma regra que a linha do painel lê
    const vista = !!dq?.deVista;
    const { limiar, generalizada, oleoPequeno, selo, agregado } = REGRA_DAS_USINAS.filtro(folga, vista);
    // B1: o ano escolhido (só em "A rede"): a fonte já traz só o que existia e os sem ano
    // (a soma mudou: a ficha aberta pelo símbolo somado refaz "Este símbolo, neste zoom")
    if (this.aplicarAno()) queueMicrotask(() => !this.destruido && this.refazerAgregadoDaSelecao());
    const ano = this.anoNaFonte;
    const datada: unknown = ano == null ? true : ['any', ['!=', ['get', 'ano'], null], ['has', 'etapas']];
    // B2: o dono destacado (só em "A rede"): as dele por cima, as demais esmaecem
    this.entregarDono();
    const comDono = rede && this.cegsDoDono != null;
    for (const id of ['usinas-halo', 'usinas', 'usinas-fio', 'usinas-anel']) this.ver(id, mostraUsinas && lista.length > 0);
    this.ver('usinas-selo', mostraUsinas && lista.length > 0 && !comDono);
    this.ver('usinas-sem-ano', rede && mostraUsinas && lista.length > 0 && ano != null);
    for (const id of ['dono-halo', 'dono', 'dono-fio', 'dono-anel']) this.ver(id, comDono && mostraUsinas && lista.length > 0);
    // o tamanho lê a soma da faixa fora da vista de aula; na vista, a potência própria
    if (this.tamanhoPelaSoma !== !vista && m.getLayer('usinas')) {
      this.tamanhoPelaSoma = !vista;
      m.setLayoutProperty('usinas-halo', 'icon-size', raioDoSimbolo(!vista, 1.5, FATOR_DA_FORMA));
      m.setLayoutProperty('usinas', 'icon-size', raioDoSimbolo(!vista, 0, FATOR_DA_FORMA));
      m.setLayoutProperty('usinas-fio', 'icon-size', raioDoSimbolo(!vista, 0, FATOR_DA_FORMA));
      m.setLayoutProperty('usinas-anel', 'icon-size', raioDoSimbolo(!vista, 3, FATOR_DA_FORMA));
      m.setLayoutProperty('usinas-selo', 'icon-size', tamanhoDoSelo(!vista));
    }
    this.rotuloDasUsinasQuer = mostraUsinas && lista.length > 0 && !destacaUsinas && !comDono;
    this.aplicarRotuloDasUsinas();
    // com um ano escolhido, o que ainda não opera hoje não tem lugar no passado
    this.ver('usinas-futuras', rede && on('usinas-futuras') && cats.length > 0 && ano == null);
    if (m.getLayer('usinas')) {
      // abaixo do zoom 10, vizinhas da mesma fonte ficam na maior (marcarGeneralizacao, bit por
      // faixa de zoom inteiro); o óleo pequeno só do zoom 13 em diante (REGRA_DAS_USINAS)
      const emOperacao = ['all', ['==', ['get', 'fase'], 0], datada, filtroCat, limiar, generalizada, oleoPequeno] as Filtro;
      m.setFilter('usinas-halo', emOperacao);
      m.setFilter('usinas', emOperacao);
      m.setFilter('usinas-fio', emOperacao);
      m.setFilter('usinas-anel', ['all', ['==', ['get', 'fase'], 0], datada, filtroCat, limiar, generalizada, oleoPequeno, agregado] as Filtro);
      m.setFilter('usinas-selo', ['all', ['==', ['get', 'fase'], 0], datada, filtroCat, limiar, generalizada, oleoPequeno, selo] as Filtro);
      // B1: sem ano no cadastro, com ano escolhido: pela própria potência, com o piso da tabela
      if (m.getLayer('usinas-sem-ano')) {
        m.setFilter('usinas-sem-ano', ['all', ['==', ['get', 'fase'], 0], ['==', ['get', 'ano'], null], ['!', ['has', 'etapas']], filtroCat, ['>=', ['get', 'kw'], passo(LIMIAR_POR_ZOOM, folga)], oleoPequeno] as Filtro);
        m.setPaintProperty('usinas-sem-ano', 'icon-opacity', this.comRampa(comDono ? 0.25 : 0.75));
      }
      // B2: as do dono, somadas só entre elas, sem piso (o dono pequeno não some de longe)
      if (comDono && m.getLayer('dono')) {
        const doDono = ['all', filtroCat, generalizada, oleoPequeno] as Filtro;
        for (const id of ['dono-halo', 'dono', 'dono-fio']) m.setFilter(id, doDono);
        m.setFilter('dono-anel', ['all', filtroCat, generalizada, oleoPequeno, agregado] as Filtro);
      }
      m.setFilter('usinas-futuras', ['all', ['>', ['get', 'fase'], 0], filtroCat, limiar] as Filtro);
      // codigo.md 6: a futura segue a mesma rampa da rede (na composição do Titã, apagada)
      m.setPaintProperty('usinas-futuras', 'icon-opacity', this.comRampa(0.9));
      // o ponto do membro de um conjunto obedece ao mesmo piso do óleo pequeno (CTL-5)
      if (m.getLayer('maquetes-membros-ponto')) m.setFilter('maquetes-membros-ponto', ['all', ['==', ['get', 'sob'], 0], ['!=', ['get', 'cel'], 1], oleoPequeno] as Filtro);
      m.setFilter('usinas-rotulo', [
        'all',
        ['==', ['get', 'fase'], 0],
        // codigo.md 5: com um ano escolhido, a sem ano carrega a marcação de hoje (gen, s{z}):
        // ela não decide quem leva nome (a sem ano só aparece em contorno, sem rótulo)
        datada,
        filtroCat,
        ['>=', ['get', 'kw'], ['step', ['zoom'], 3_000_000, 4.4, 1_500_000, 5.4, 600_000, 6.6, 150_000, 8, 30_000, 9.5, 5000, 11, 0]],
        // a usina escondida pela generalização não deixa o nome no lugar (achado 6: no zoom 9 a
        // 10 cada parque do RN levava rótulo, inclusive os sem símbolo)
        generalizada,
        oleoPequeno,
        // o agregado não leva nome de usina no mapa: o nome da sede sozinho diria que a soma é dela
        ['!', agregado],
        // nem o símbolo que o piso da soma tirou do mapa
        limiar,
      ] as Filtro);
      // com dono destacado as demais recuam a 18% (esmaecer, nunca óxido)
      const opUsina = comDono ? 0.18 : destacaUsinas ? 0.4 : agua ? 0.62 : 1;
      const comMaquetes = on('maquetes') && (rede || agua || comb);
      // achado 3: na escala das maquetes o disco de quem não ganhou maquete recua (preenchimento
      // a 60%, fio a 30%) para não competir com o modelo; de longe, peso cheio
      // (degrau no limiar, sem estado intermediário em zoom parado: recado do regra-e-3d)
      const recua = (v: number, f: number): unknown => (comMaquetes ? ['step', ['zoom'], v, ZOOM_DAS_MAQUETES, v * f] : v);
      // A1.1: de longe (abaixo de ZOOM_DA_RAMPA_SO_CAMERA), a opacidade é expressão SÓ de câmera,
      // em rampa a partir do zoom de repouso do Titã. Com dado (o feature-state da maquete) a
      // expressão vira "composta" e o Mapbox a avalia no zoom inteiro do TILE (medido: a z1,2, com
      // tiles do zoom 3 ainda em cache, a rampa devolvia opacidade cheia). A maquete só existe de
      // perto: lá vale a expressão de antes. Nenhuma das duas lê feature-state: quem esconde o
      // vencedor da maquete é a cor (SOME_SOB_A_MAQUETE).
      // codigo.md 4: as camadas do dono destacado também apagam sob a maquete (o feature-state
      // 'maquete' é espelhado na fonte do dono, e a cor delas o lê)
      const opDono = (id: string) => (id === 'dono-halo' ? 0.95 : id === 'dono-anel' ? 0.9 : 1);
      const donoPerto = Object.fromEntries(['dono-halo', 'dono', 'dono-fio', 'dono-anel'].map((id) => [id, opDono(id)]));
      const donoLonge = Object.fromEntries(['dono-halo', 'dono', 'dono-fio', 'dono-anel'].map((id) => [id, this.comRampa(opDono(id))]));
      this.opacidadeDasUsinas = {
        regime: this.opacidadeDasUsinas?.regime ?? null,
        sujo: true,
        perto: {
          ...donoPerto,
          'usinas-halo': recua(0.9 * opUsina, 0.6),
          usinas: recua(opUsina, 0.6),
          // o fio tracejado da posição a confirmar não recua: é a única marca dela no mapa
          'usinas-fio': comMaquetes
            ? ['step', ['zoom'], opUsina, ZOOM_DAS_MAQUETES, ['case', POSICAO_A_CONFIRMAR, opUsina, opUsina * 0.3]]
            : opUsina,
          'usinas-anel': recua(0.85 * opUsina, 0.3),
        },
        longe: {
          ...donoLonge,
          'usinas-halo': this.comRampa(0.9 * opUsina),
          usinas: this.comRampa(opUsina),
          'usinas-fio': this.comRampa(opUsina),
          'usinas-anel': this.comRampa(0.85 * opUsina),
        },
      };
      this.porOpacidadeDasUsinas();
      const opSelo = SEM_MAQUETE(destacaUsinas ? 0.3 : agua ? 0.8 : 1);
      // com maquetes, o selo dos membros e dos perdedores sai de 9,8 a 10,2 (a camada termina em 10,2)
      m.setPaintProperty(
        'usinas-selo',
        'icon-opacity',
        comMaquetes ? ['interpolate', ['linear'], ['zoom'], 2.9, 0, 3.1, opSelo, ZOOM_DA_MAQUETE_INTEIRA, opSelo, ZOOM_SEM_SELO, 0] : ['interpolate', ['linear'], ['zoom'], 2.9, 0, 3.1, opSelo],
      );
    }

    // linhas: dois andares em corrente alternada (abaixo de 345 kV; de 345 kV para cima),
    // cada um com seu casco; nas trocas, só as de 500 kV ou mais, sem casco e apagadas
    const tensao: unknown[] = ['>=', ['get', 'kv'], passo(TENSAO_POR_ZOOM, folga)];
    const linhasOn = (rede && on('linhas')) || trocas;
    const redeLinhas = rede && on('linhas');
    for (const id of ['linhas', 'linhas-cc', 'linhas-cc-casco', 'linhas-cc-alma']) this.ver(id, linhasOn);
    this.ver('linhas-casco', redeLinhas);
    this.ver('linhas-sub', redeLinhas);
    this.ver('linhas-casco-sub', redeLinhas);
    this.ver('linhas-toque', redeLinhas);
    this.ver('linhas-previstas', redeLinhas && on('linhas-previstas') && ano == null);
    this.ver('linhas-sem-ano', redeLinhas && ano != null);
    // B1: com ano, "existia" = op <= ano, ou (sem op) a data de carga da base <= ano; "sem ano" =
    // só a data de carga, posterior ao ano (a mesma regra de tempo.ts › situacaoDaRede)
    const existiaNoAno: unknown[] | null =
      ano == null
        ? null
        : ['any', ['<=', ['coalesce', ['get', 'op'], 99999], ano], ['all', ['==', ['get', 'op'], null], ['<=', ['coalesce', ['get', 'opAntesDe'], 99999], ano]]];
    const semAnoNaRede: unknown[] = ano == null ? ['boolean', false] : ['all', ['==', ['get', 'op'], null], ['!=', ['get', 'opAntesDe'], null], ['>', ['coalesce', ['get', 'opAntesDe'], 0], ano]];
    if (m.getLayer('linhas')) {
      // em operação: tem ano de entrada, ou o cadastro só traz a data de carga da base (opAntesDe)
      const emOperacao: unknown[] = existiaNoAno ?? ['any', ['!=', ['get', 'op'], null], ['!=', ['get', 'opAntesDe'], null]];
      const ca: unknown[] = ['==', ['get', 'cc'], 0];
      const alto: unknown[] = ['>=', ['get', 'kv'], 345];
      const filtroAlto = ['all', emOperacao, ca, alto, trocas ? ['>=', ['get', 'kv'], 500] : tensao] as Filtro;
      const filtroBaixo = ['all', emOperacao, ca, ['<', ['get', 'kv'], 345], tensao] as Filtro;
      const filtroCc = ['all', emOperacao, ['==', ['get', 'cc'], 1]] as Filtro;
      m.setFilter('linhas', filtroAlto);
      m.setFilter('linhas-casco', filtroAlto);
      m.setFilter('linhas-sub', filtroBaixo);
      m.setFilter('linhas-casco-sub', filtroBaixo);
      for (const id of ['linhas-cc', 'linhas-cc-casco', 'linhas-cc-alma']) m.setFilter(id, filtroCc);
      m.setFilter('linhas-toque', ['all', ['any', emOperacao, semAnoNaRede, on('linhas-previstas') && ano == null], ['any', ['==', ['get', 'cc'], 1], tensao]] as Filtro);
      if (m.getLayer('linhas-sem-ano')) {
        m.setFilter('linhas-sem-ano', ['all', semAnoNaRede, ['any', ['==', ['get', 'cc'], 1], tensao]] as Filtro);
        m.setPaintProperty('linhas-sem-ano', 'line-opacity', this.comRampa(0.7, [], 0.3));
      }
      m.setFilter('linhas-previstas', ['all', ['==', ['get', 'op'], null], ['==', ['get', 'opAntesDe'], null], ['any', ['==', ['get', 'cc'], 1], tensao]] as Filtro);
      // no noturno o traço claro sobre o escuro irradia (parece mais grosso): recua um pouco
      const cheio0 = e.modo === 'noturno' ? 0.84 : 1;
      // na escala das maquetes a linha recua a 75%: a usina é o objeto mais escuro da vista
      // A1.1: perto da composição do Titã a malha fica em fio fino (35%), sem casco
      const FIO_NO_TITA = 0.35;
      const cheio = (b: number): unknown => this.comRampa(b, [[9, cheio0], [9.6, cheio0 * 0.75]], b * FIO_NO_TITA);
      const fixo = (b: number): unknown => this.comRampa(b, [], b * FIO_NO_TITA);
      // com o dono destacado (B2) a rede recua como no destaque: o assunto são as usinas dele
      const recuaRede = destacaLinhas || comDono;
      m.setPaintProperty('linhas', 'line-opacity', trocas ? fixo(0.28) : recuaRede ? fixo(0.35) : cheio(cheio0));
      m.setPaintProperty('linhas-sub', 'line-opacity', recuaRede ? fixo(0.35) : cheio(cheio0));
      m.setPaintProperty('linhas-cc', 'line-opacity', fixo(trocas ? 0.4 : recuaRede ? 0.4 : 1));
      m.setPaintProperty('linhas-cc-alma', 'line-opacity', ['interpolate', ['linear'], ['zoom'], 4, 0, 4.8, trocas || recuaRede ? 0.5 : 1]);
      // codigo.md 6: a prevista também fica em fio fino perto do Titã, como as em operação
      m.setPaintProperty('linhas-previstas', 'line-opacity', fixo(0.72));
      // nas trocas e com destaque o casco some: o que importa ali são as setas ou o destacado
      const casco = trocas ? 0 : recuaRede ? 0.5 : sat ? 1 : 0.92;
      for (const id of ['linhas-casco', 'linhas-casco-sub', 'linhas-cc-casco']) m.setPaintProperty(id, 'line-opacity', this.comRampa(casco));
    }

    // subestações (o filtro por zoom vale no zoom inteiro do tile: escrito em inteiro).
    // A prevista (sem data de entrada no SINDAT) só aparece com as previstas ligadas.
    this.ver('subestacoes', rede && on('subestacoes'));
    if (m.getLayer('subestacoes')) {
      const porZoom: unknown[] = ['any', ['>=', ['zoom'], REGRA_DAS_SUBESTACOES.todasNoZoom], ['>=', ['coalesce', ['get', 'kv'], 0], REGRA_DAS_SUBESTACOES.kvDeLonge]];
      // com ano: a que existia, e a sem ano (só a data de carga, posterior) em tinta apagada; a prevista sai
      this.filtroBaseSE = existiaNoAno ? ['all', porZoom, ['any', existiaNoAno, semAnoNaRede]] : on('linhas-previstas') ? porZoom : ['all', porZoom, ['!', SUBESTACAO_PREVISTA]];
      this.filtrarVencedores();
      const opSe = destacaSubestacoes ? 0.4 : 1;
      m.setPaintProperty('subestacoes', 'icon-opacity', ano == null ? opSe : ['case', semAnoNaRede, opSe * 0.35, opSe]);
    }

    // submercados
    const subOn = (rede && on('submercados')) || agua || trocas || dia;
    // no dia real, o submercado fica só como contexto (fio e fundo apagados): o pulso é o assunto
    const pulsoNoDia = dia && e.momentoDaOperacao != null;
    this.ver('submercados-area', subOn);
    this.ver('submercados-fio', subOn);
    // critico-honestidade 9: antes de set/2025 (mês da régua em A água/As trocas; ano da linha
    // do tempo em A rede) o Norte é desenhado sem Roraima, e Roraima só em contorno
    const rrFora = this.roraimaForaDoNorte();
    if (rrFora !== this.roraimaPosta) {
      this.roraimaPosta = rrFora;
      this.alimentar(['submercados', 'roraima']);
    }
    this.ver('roraima-fio', subOn && rrFora);
    this.ver('submercados-rotulo', subOn && !dia);
    if (m.getLayer('submercados-rotulo')) m.setPaintProperty('submercados-rotulo', 'text-opacity', this.comRampa(1));
    if (m.getLayer('submercados-area')) {
      this.pintarSubmercados(agua);
      // com as distribuidoras ligadas, o fundo é delas: o submercado fica só no fio e no nome
      m.setPaintProperty('submercados-area', 'fill-opacity', agua && e.earSubsistema ? 0.5 : pulsoNoDia ? 0.04 : trocas || dia ? 0.1 : rede && on('distribuicao') ? 0 : 0.08);
      m.setPaintProperty('submercados-fio', 'line-opacity', pulsoNoDia ? 0.35 : 0.7);
    }

    // água
    const baciasOn = (rede || agua) && on('bacias');
    const resOn = (rede && on('reservatorios')) || agua;
    if (baciasOn || resOn || !!dq?.reservatorios?.length || !!dq?.bacias?.length || e.selecionado?.tipo === 'reservatorio' || e.selecionado?.tipo === 'bacia') this.garantirAgua();
    this.ver('bacias-area', baciasOn);
    this.ver('bacias-fio', baciasOn);
    this.ver('reservatorios', resOn);
    this.ver('reservatorios-rotulo', resOn && !destacaReservatorios);
    if (m.getLayer('reservatorios')) {
      // fio d'água não guarda energia: no capítulo da água só entra quem regulariza
      // (o painel da água diz isso). O tipo é o tip_reservatorio do ONS.
      const filtroAgua = ['all', ['>', ['coalesce', ['get', 'vutil'], 0], 0], ['!=', ['get', 'tipo'], 'FIO DAGUA']] as Filtro;
      if (agua) m.setFilter('reservatorios', filtroAgua);
      else if (m.getFilter('reservatorios') != null) m.setFilter('reservatorios', null);
      m.setFilter('reservatorios-rotulo', ['>=', ['coalesce', ['get', 'vutil'], 0], ['step', ['zoom'], 12000, 5, 4000, 6.5, 800, 8, 0]] as Filtro);
      const semSerie: unknown[] = ['==', ['feature-state', 'pct'], null];
      if (agua) {
        // sem série de armazenamento: anel vazado, sem preenchimento. A ausência não pode
        // ter a cor do reservatório vazio (o creme do papel fica a ΔE 3 de aguaVazia).
        m.setPaintProperty('reservatorios', 'circle-color', ['case', semSerie, 'rgba(0,0,0,0)', ['interpolate', ['linear'], ['feature-state', 'pct'], 0, p.aguaVazia, 100, p.aguaCheia]]);
        m.setPaintProperty('reservatorios', 'circle-stroke-color', ['case', semSerie, p.fioForte, p.tinta]);
        m.setPaintProperty('reservatorios', 'circle-stroke-width', ['case', semSerie, 1.4, 0.9]);
      } else {
        // fora da água o reservatório é só lugar: espelho d'água, fio da cor da hidrelétrica
        m.setPaintProperty('reservatorios', 'circle-color', p.lago);
        m.setPaintProperty('reservatorios', 'circle-stroke-color', p.categoria.hidro);
        m.setPaintProperty('reservatorios', 'circle-stroke-width', 1);
      }
    }
    this.pintarReservatorios();

    // combustível (ANP): cada arquivo só é buscado quando uma camada ligada, um destaque ou a
    // seleção pede; as camadas só aparecem no capítulo delas
    const destacaComb = !!dq?.combustivel?.length;
    const combOn = (c: CamadaDoCombustivel) => comb && on(c);
    const pedidos = new Set<ArquivoDoCombustivel>(CAMADAS_DO_COMBUSTIVEL.filter(combOn).map((c) => ARQUIVO_DA_CAMADA[c]));
    for (const id of dq?.combustivel ?? []) {
      const a = arquivoDoId(id);
      if (a) pedidos.add(a);
    }
    const arqSel = e.selecionado ? ARQUIVO_DO_TIPO[e.selecionado.tipo] : undefined;
    if (arqSel) pedidos.add(arqSel);
    if (pedidos.size) this.garantirCombustivel(pedidos);
    for (const id of ['gasodutos-casco', 'gasodutos', 'gasodutos-toque']) this.ver(id, combOn('gasodutos'));
    this.ver('gasodutos-rotulo', combOn('gasodutos') && !destacaComb);
    const tiposOn = (['gnl', 'upgn', 'refinarias', 'terminais'] as const).filter(combOn).map((c) => TIPO_DA_CAMADA[c] as string);
    this.ver('combustivel-instalacoes', tiposOn.length > 0);
    this.ver('combustivel-rotulo', tiposOn.length > 0 && !destacaComb);
    if (m.getLayer('combustivel-instalacoes')) {
      const porTipo: unknown[] = ['in', ['get', 'tipo'], ['literal', tiposOn]];
      m.setFilter('combustivel-instalacoes', porTipo as Filtro);
      this.filtroBaseCombRotulo = ['all', porTipo, FILTRO_ZOOM_DO_ROTULO];
      this.filtrarVencedores();
      m.setPaintProperty('combustivel-instalacoes', 'icon-opacity', SEM_MAQUETE(destacaComb ? 0.45 : 1));
      m.setPaintProperty('gasodutos', 'line-opacity', destacaComb ? 0.4 : e.modo === 'noturno' ? 0.9 : 1);
      m.setPaintProperty('gasodutos-casco', 'line-opacity', destacaComb ? 0.4 : sat ? 1 : 0.92);
    }
    for (const id of ['campos-area', 'campos-fio', 'campos-rotulo']) this.ver(id, combOn('campos'));
    for (const id of ['blocos-area', 'blocos-fio']) this.ver(id, combOn('blocos'));
    for (const id of ['bacias-sed-area', 'bacias-sed-fio', 'bacias-sed-rotulo']) this.ver(id, combOn('bacias-sedimentares'));
    for (const id of ['presal-area', 'presal-fio', 'presal-rotulo']) this.ver(id, combOn('presal'));

    // distribuidoras: só no capítulo da rede; a seleção (vinda da busca) também pede o arquivo
    this.distrib.aplicar(rede && on('distribuicao'), e.selecionado?.tipo === 'distribuidora', e.selecionado?.tipo === 'distribuidora' ? String(e.selecionado.chave) : null);
    // a ficha da área abriu com o cursor parado em cima dela: a etiqueta do hover ficava por cima
    // da ficha repetindo o título (achado 10); o próximo movimento do mouse a refaz se couber
    if (e.selecionado?.tipo === 'distribuidora') this.ret.aoPairar(null);

    // comércio: a camada busca o arquivo ao ser ligada e anima sozinha (só com o capítulo aberto)
    this.comercio.aplicar(cap === 'comercio', e.filtroDoComercio ?? FILTRO_INICIAL_DO_COMERCIO, e.selecionado?.tipo === 'comercio' ? String(e.selecionado.chave) : null);

    // trocas
    this.atualizarTrocas();

    // dia: no modo dia real (momento escolhido) o pulso por usina toma o lugar dos discos por
    // subsistema e do perfil médio (B3); sem momento, o capítulo é o de hoje, intacto
    const pulsoLigado = dia && e.momentoDaOperacao != null;
    this.pulso.aplicar(pulsoLigado, pulsoLigado ? (e.momentoDaOperacao ?? null) : null, e.selecionado?.tipo === 'operacao' ? String(e.selecionado.chave) : null);
    this.atualizarDia(dia && !pulsoLigado);

    // mundo
    this.ver('paises-area', mundo);
    this.pintarMundo();

    this.atualizarDestaque();
    this.atualizarSelecao();
    this.atualizarDestaqueDoConjunto();
    this.maquetes?.definirMovimentoReduzido(e.movimentoReduzido);
    // maquetes dependem do capítulo, das camadas e do enquadramento (este, no moveend);
    // o passo do tempo não as toca
    const mq = this.memoMaquetes;
    if (!mq || mq.cap !== cap || mq.camadas !== e.camadas || mq.sel !== e.selecionado || mq.dq !== e.destaque || mq.v !== this.versaoDosDados) {
      this.memoMaquetes = { cap, camadas: e.camadas, sel: e.selecionado, dq: e.destaque, v: this.versaoDosDados };
      this.atualizarMaquetes();
    }
    this.talvezCarregarMenores();
  }

  /** Cor dos submercados por feature-state (água: tinta do armazenamento; fora: nula). */
  private pintarSubmercados(agua: boolean) {
    const m = this.mapa;
    if (!m.getSource(F.submercados)) return;
    const ear = agua ? this.estado.earSubsistema : null;
    const mm = this.memoSubmercados;
    if (mm && mm.ear === ear && mm.agua === agua && mm.v === this.versaoDosDados) return;
    this.memoSubmercados = { ear, agua, v: this.versaoDosDados };
    const p = PALETA[this.estado.modo];
    for (const sub of ['N', 'NE', 'SE', 'S'] as Subsistema[]) {
      let cor: string | null = null;
      if (ear) {
        const pct = ear[sub];
        // sem valor: transparente (só o fio do submercado), nunca a cor de "vazio"
        cor = pct == null ? 'rgba(0,0,0,0)' : misturar(p.aguaVazia, p.aguaCheia, Math.max(0, Math.min(1, pct / 100)));
      }
      m.setFeatureState({ source: F.submercados, id: sub }, { cor });
    }
  }

  // ── maquetes 3D ────────────────────────────────────────────────────

  /** A escolha corrente (o que a camada 3D, a cartografia 2D, o aviso e a medição leem). */
  private escolha: EscolhaDeMaquetes = { pontos: [], resumo: RESUMO_INATIVO };
  /** ids desenhados agora (os da última entrega) */
  private idsAnteriores = new Set<string>();
  /** o conjunto entregue em cada faixa de zoom, para a histerese da volta (estabilidade) */
  private readonly memoria = new MemoriaDeVencedores();
  /** últimos tempos da escolha (ms), para msDaEscolha */
  private temposDaEscolha: number[] = [];
  private esperaDaEscolha: number | null = null;
  private ultimoPedido: PedidoDeMaquetes | null = null;
  /** ceg → id da feição da usina (forçados pela seleção e pelo destaque) */
  private indiceDeCeg: { usinas: FeicaoUsina[]; porCeg: Map<string, number> } | null = null;

  /** moveend: a escolha espera ESPERA_DA_ESCOLHA ms (um gesto que recomeça não a refaz). */
  private agendarMaquetes() {
    if (this.esperaDaEscolha != null) window.clearTimeout(this.esperaDaEscolha);
    this.esperaDaEscolha = window.setTimeout(() => {
      this.esperaDaEscolha = null;
      if (!this.destruido) this.atualizarMaquetes();
    }, ESPERA_DA_ESCOLHA);
  }

  /** Itens que furam teto, piso e distância: o ativo selecionado, o destino da busca e o
   *  destaque da vista da aula. */
  private forcadosDaEscolha(): Map<string, MotivoDoForcado> {
    const e = this.estado;
    const saida = new Map<string, MotivoDoForcado>();
    if (!this.indiceDeCeg || this.indiceDeCeg.usinas !== this.usinas) {
      const porCeg = new Map<string, number>();
      for (const u of this.usinas) if (typeof u.id === 'number') porCeg.set(u.properties.ceg, u.id);
      this.indiceDeCeg = { usinas: this.usinas, porCeg };
    }
    const porCeg = this.indiceDeCeg.porCeg;
    const idDe = (fc: FeatureCollection | null | undefined, chave: string) => {
      const f = fc?.features.find((x) => (x.properties as { id?: unknown } | null)?.id === chave);
      return typeof f?.id === 'number' ? f.id : null;
    };
    const por = (tipo: string, chave: string, motivo: MotivoDoForcado) => {
      if (tipo === 'usina') {
        const id = porCeg.get(chave);
        if (id != null) saida.set(`usina:${id}`, motivo);
      } else if (tipo === 'subestacao') {
        const id = idDe(this.subestacoes, chave);
        if (id != null) saida.set(`se:${id}`, motivo);
      } else if (tipo === 'instalacao') {
        const id = idDe(this.comb.instalacoes, chave);
        if (id != null) saida.set(`anp:${id}`, motivo);
      }
    };
    const d = e.destaque;
    if (d) {
      const motivo: MotivoDoForcado = d.deVista ? 'aula' : 'busca';
      for (const c of d.usinas ?? []) por('usina', c, motivo);
      for (const c of d.subestacoes ?? []) por('subestacao', c, motivo);
      for (const c of d.combustivel ?? []) por('instalacao', c, motivo);
    }
    if (e.selecionado) por(e.selecionado.tipo, e.selecionado.chave, 'selecao');
    return saida;
  }

  /** Escolhe o que ganha maquete no enquadramento corrente (maquetes.ts) e entrega: camada 3D,
   *  fonte das maquetes (âncora, selo da troca, rótulo), papéis 2D (feature-state e filtro por
   *  id) e o resumo do aviso. Roda no moveend (com espera) e quando capítulo ou camadas mudam. */
  private atualizarMaquetes() {
    if (!this.montado) return;
    const e = this.estado;
    const m = this.mapa;
    const zoom = m.getZoom();
    const capituloComMaquete = e.capitulo === 'rede' || e.capitulo === 'agua' || e.capitulo === 'combustivel';
    const quer = e.camadas.has('maquetes') && capituloComMaquete && zoom >= ZOOM_DAS_MAQUETES - 0.6;
    if (!quer) {
      this.entregarEscolha({ pontos: [], resumo: { ...RESUMO_INATIVO, zoom, inclinacao: m.getPitch() } });
      return;
    }
    if (!this.maquetes && !this.importandoMaquetes) {
      this.importandoMaquetes = true;
      // o Three.js e os modelos só são baixados aqui, na primeira vez que se chega perto do zoom
      import('./camada3d').then(
        ({ CamadaDeMaquetes: Classe }) => {
          this.importandoMaquetes = false;
          if (this.destruido) return;
          this.maquetes = new Classe(m, this.estado.modo, this.estado.movimentoReduzido);
          this.maquetes.aoPosicionar = () => this.agendarObstaculo();
          // COL-4: um modelo que falhou (ou voltou) refaz a escolha, como o moveend
          this.maquetes.aoMudarDisponibilidade = () => {
            if (!this.destruido) this.agendarMaquetes();
          };
          if (this.montado && !m.getLayer('maquetes')) {
            m.addLayer(this.maquetes.camada(), this.antesDasMaquetes());
            // com as distribuidoras ligadas, a 3D vai por cima do véu (B4)
            this.distrib.ordenar();
          }
          this.maquetes.definirPontos(this.escolha.pontos, this.escolha.pontos.length > 0, this.estado.camadas.has('satelite'));
        },
        (erro) => {
          this.importandoMaquetes = false;
          console.error('[atlas] maquetes:', erro);
        },
      );
    }
    const b = m.getBounds();
    if (!b) return;
    const cv = m.getCanvas();
    const largura = cv.clientWidth;
    const altura = cv.clientHeight;
    // no celular a folha inferior cobre a base do mapa: maquete ali não conta como vista
    const alturaUtil = largura < LARGURA_DO_CELULAR ? Math.max(altura * 0.4, altura - Math.max(0, e.margens.base)) : altura;
    // No capítulo do combustível o mapa desenha só as térmicas a gás, óleo e carvão: as outras
    // fontes saem do conjunto entregue, para não ganharem maquete sem símbolo por baixo.
    const comb = e.capitulo === 'combustivel';
    const camadas: ReadonlySet<CamadaId> = comb ? new Set([...e.camadas].filter((c) => !(CATEGORIAS as readonly string[]).includes(c) || (CATEGORIAS_DO_COMBUSTIVEL as readonly string[]).includes(c))) : e.camadas;
    const c = m.getCenter();
    const pedido: PedidoDeMaquetes = {
      capitulo: e.capitulo,
      camadas,
      zoom,
      inclinacao: m.getPitch(),
      rumo: m.getBearing(),
      centro: [c.lng, c.lat],
      limites: [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()],
      largura,
      altura,
      alturaUtil,
      // B1: com um ano escolhido, só o que já existia (as sem ano não ganham maquete)
      usinas: this.usinasDatadas,
      ...this.redeNoAno(),
      // o ponto do reservatório do ONS dá o lado de montante da hidrelétrica
      reservatorios: this.reservatorios,
      // refinarias, GNL, UPGN e terminais (maquetes.ts filtra pelas camadas ligadas e pelo tipo)
      instalacoesCombustivel: comb ? (this.comb.instalacoes ?? null) : null,
      projetar: (lon, lat) => {
        const q = m.project([lon, lat]);
        return [q.x, q.y];
      },
      // a histerese lê o conjunto que esta faixa de zoom teve há pouco, com a mesma pose (ida e
      // volta pelo zoom devolvem o mesmo conjunto); sem memória válida, o desenhado agora
      anteriores: this.memoria.anteriores(m) ?? this.idsAnteriores,
      niveisAnteriores: new Map(this.escolha.pontos.map((p) => [p.id, p.nivel])),
      forcados: this.forcadosDaEscolha(),
      zonasProibidas: this.zonasDaCasca(),
      // COL-4: tipo cujo GLB falhou não é escolhido; o item fica no símbolo 2D e fora da contagem
      indisponivel: (t) => this.maquetes?.tipoIndisponivel(t) ?? false,
    };
    this.ultimoPedido = pedido;
    const t0 = performance.now();
    const escolha = escolherMaquetes(pedido);
    const ms = performance.now() - t0;
    this.temposDaEscolha.push(ms);
    if (this.temposDaEscolha.length > 10) this.temposDaEscolha.shift();
    escolha.resumo.msDaEscolha = ms;
    this.entregarEscolha(escolha);
  }

  /** Entrega a escolha a quem desenha e a quem declara. */
  private entregarEscolha(escolha: EscolhaDeMaquetes) {
    const m = this.mapa;
    const e = this.estado;
    // entrada adiada: o recém-chegado só entra se também vence em z ± 0,15 (maquetes.ts ›
    // adiarEntrada); só quando a câmera não andou desde o pedido
    const ped = this.ultimoPedido;
    if (ped && escolha.pontos.length && Math.abs(ped.zoom - m.getZoom()) < 0.01) {
      escolha = adiarEntrada(escolha, ped, this.idsAnteriores, (z) => {
        const t = (m as unknown as { transform: { clone(): TransformoDoMapa } }).transform.clone();
        t.zoom = z;
        const b = t.getBounds();
        return {
          limites: [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()],
          projetar: (lon, lat) => {
            const q = t.locationPoint(new mapboxgl.LngLat(lon, lat));
            return [q.x, q.y];
          },
        };
      });
    }
    this.escolha = escolha;
    this.idsAnteriores = new Set(escolha.pontos.map((p) => p.id));
    if (escolha.pontos.length) this.memoria.guardar(this.idsAnteriores, m);
    this.maquetes?.definirPontos(escolha.pontos, escolha.pontos.length > 0, e.camadas.has('satelite'));
    // âncora, selo da troca e rótulo dos vencedores (as torres não têm nenhum dos três)
    const ordem = escolha.pontos
      .filter((p) => p.familia !== 'torre')
      .slice()
      .sort((a, b) => b.prio - a.prio);
    const feicoes: Feature<Point>[] = ordem.map((p, i) => {
      const tipoAnp = p.tipo === 'terminal-gnl' ? 'gnl' : p.tipo === 'terminal-liquidos' ? 'terminal' : p.tipo;
      const porte = (p.kv ?? 0) >= 500 ? 'alta' : (p.kv ?? 0) >= 345 ? 'media' : 'baixa';
      const kw = (p.mw ?? 0) * 1000;
      const seloTam = kw >= 1_000_000 ? 1.04 : kw >= 300_000 ? 0.92 : kw >= 30_000 ? 0.82 : kw >= 5000 ? 0.74 : 0.68;
      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [p.lon, p.lat] },
        properties: {
          id: p.id,
          nome: encurtarNome(p.nome ?? ''),
          linha2: p.rotulo?.linha2 ?? '',
          cat: p.cat ?? '',
          familia: p.familia,
          tam: p.rotulo?.tam ?? 11,
          tamTela: p.rotulo?.tamTela ?? 11,
          off: p.rotulo?.off ?? 1,
          mostrar: p.rotulo?.mostrar ? 1 : 0,
          ordem: i,
          ancora: p.familia === 'usina' ? `atlas-ancora-${p.cat}` : 'atlas-ancora-rede',
          selo: p.familia === 'usina' ? `atlas-selo-${p.cat}` : p.familia === 'rede' ? `atlas-se-${porte}` : p.familia === 'anp' ? `atlas-inst-${tipoAnp}` : '',
          seloTam: p.familia === 'usina' ? seloTam : 0.92,
          deCima: p.deCima ? 1 : 0,
        },
      };
    });
    this.feicoesDasMaquetes = feicoes;
    (m.getSource(F.maquetes) as mapboxgl.GeoJSONSource | undefined)?.setData({ type: 'FeatureCollection', features: feicoes });
    this.marcarSimbolosComMaquete();
    this.filtrarVencedores();
    this.entregarConjuntos();
    this.atualizarObstaculo();
    this.atualizarDestaqueDoConjunto();
    lojaDoResumo.definir(escolha.resumo);
  }

  /** Feições da fonte das maquetes (âncora, selo da troca, rótulo), para o rótulo descer até a caixa medida. */
  private feicoesDasMaquetes: Feature<Point>[] = [];

  /** fid → feição da usina (membros, clique na maquete, ficha do conjunto). */
  private indiceDeUsinas: { usinas: FeicaoUsina[]; porId: Map<number, FeicaoUsina> } | null = null;
  private usinaPorId(id: number): FeicaoUsina | undefined {
    if (!this.indiceDeUsinas || this.indiceDeUsinas.usinas !== this.usinas) {
      const porId = new Map<number, FeicaoUsina>();
      for (const u of this.usinas) if (typeof u.id === 'number') porId.set(u.id, u);
      this.indiceDeUsinas = { usinas: this.usinas, porId };
    }
    return this.indiceDeUsinas.porId.get(id);
  }

  /** Área de toque dos membros (camada invisível) e os conjuntos para a ficha. */
  private entregarConjuntos() {
    const m = this.mapa;
    const r = m.getCanvas().clientWidth < LARGURA_DO_CELULAR ? TOQUE_DO_MEMBRO[1] : TOQUE_DO_MEMBRO[0];
    const toque: Feature<Point>[] = [];
    const conjuntos = new Map<string, ConjuntoNaTela>();
    const daFicha = (f: FeicaoUsina): UsinaDoConjunto => ({
      ceg: f.properties.ceg,
      nome: f.properties.nome,
      mw: f.properties.kw / 1000,
      props: { ...f.properties } as Record<string, unknown>,
      lngLat: [f.geometry.coordinates[0], f.geometry.coordinates[1]],
    });
    for (const p of this.escolha.pontos) {
      if (p.familia !== 'usina' || !p.membros.length || !p.origem) continue;
      const usinas: UsinaDoConjunto[] = [];
      const s = this.usinaPorId(p.origem.id);
      if (s) usinas.push(daFicha(s));
      for (const mb of p.membros) {
        const fid = Number(mb.id.slice(6));
        const f = this.usinaPorId(fid);
        // cat: o ponto pequeno do membro (maquetes-membros-ponto) na cor da fonte DELE; kw: o piso
        // do óleo pequeno vale também para ele; sob: escondido por cair sob a maquete ou sob um
        // rótulo (esconderMembrosSobAMaquete)
        toque.push({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [mb.lon, mb.lat] },
          properties: { fid, ponto: p.id, r, cat: f?.properties.cat ?? p.cat ?? 'outros', kw: f?.properties.kw ?? mb.mw * 1000, sob: 0, cel: r === TOQUE_DO_MEMBRO[1] ? 1 : 0 },
        });
        if (f) usinas.push(daFicha(f));
      }
      const c: ConjuntoNaTela = { usinas, mw: p.mwConjunto ?? 0, R_km: Math.round(raioDoConjuntoM(NIVEIS[p.nivel - 1], p.lat) / 100) / 10 };
      for (const u of usinas) conjuntos.set(u.ceg, c);
    }
    this.feicoesDosMembros = toque;
    (m.getSource(F.maquetesMembros) as mapboxgl.GeoJSONSource | undefined)?.setData({ type: 'FeatureCollection', features: toque });
    lojaDosConjuntos.definir(conjuntos);
  }

  /** Obstáculo de rótulo de cada maquete desenhada: a caixa de tela MEDIDA na geometria
   *  desenhada (camada3d.caixasDeTela, 8 cantos), ou a prevista pela escolha enquanto o modelo
   *  não chegou. O Mapbox escala o ícone pela perspectiva (0,5 + 0,5 · distância ao centro /
   *  distância ao ponto, até 1,5) e o deslocamento junto; aqui se divide por esse fator. */
  private esperaDoObstaculo: number | null = null;
  private agendarObstaculo() {
    if (this.esperaDoObstaculo != null) return;
    this.esperaDoObstaculo = window.setTimeout(() => {
      this.esperaDoObstaculo = null;
      // durante o gesto vale a caixa do último moveend (§8)
      if (!this.destruido && this.montado && !this.mapa.isMoving()) this.atualizarObstaculo();
    }, 60);
  }
  private atualizarObstaculo() {
    const m = this.mapa;
    const fonte = m.getSource(F.maquetesObstaculo) as mapboxgl.GeoJSONSource | undefined;
    if (!fonte) return;
    const medidas = new Map((this.maquetes?.caixasDeTela(false) ?? []).map((c) => [c.ponto, c.caixa]));
    const B = (m.getBearing() * Math.PI) / 180;
    const kEm = (lon: number, lat: number) => {
      const pe = m.project([lon, lat]);
      const q = m.project([lon + (50 * Math.cos(B)) / (111_320 * Math.cos((lat * Math.PI) / 180)), lat - (50 * Math.sin(B)) / 110_574]);
      return Math.hypot(q.x - pe.x, q.y - pe.y) / 50;
    };
    const c = m.getCenter();
    const kC = kEm(c.lng, c.lat);
    const alturas = OBSTACULO_RAZOES.map((r) => Math.max(1, Math.round(OBSTACULO_LARGURA * r)));
    const feicoes: Feature<Point>[] = [];
    const rotulos = new Map(this.feicoesDasMaquetes.map((f) => [String(f.properties?.id), f]));
    let rotuloMudou = false;
    for (const p of this.escolha.pontos) {
      if (p.deCima || p.semModelo) continue;
      const medida = medidas.get(p);
      const cx = medida ?? p.caixa;
      const w = cx[2] - cx[0];
      const h = cx[3] - cx[1];
      if (!(w > 0 && h > 0) || !(kC > 0)) continue;
      const pe = m.project([p.lon, p.lat]);
      const persp = Math.min(1.5, 0.5 + (0.5 * kEm(p.lon, p.lat)) / kC);
      let i = alturas.findIndex((a) => a / OBSTACULO_LARGURA >= h / w);
      // mais alta que a última faixa: a altura manda (a largura sobra)
      const s = i < 0 ? h / (alturas[(i = alturas.length - 1)] * persp) : w / (OBSTACULO_LARGURA * persp);
      feicoes.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [p.lon, p.lat] },
        properties: { id: p.id, img: `atlas-obst-${i}`, s, off: [(cx[0] - pe.x) / (s * persp), (cx[3] - pe.y) / (s * persp)] },
      });
      // o rótulo do vencedor desce até a caixa MEDIDA (a prevista erra a laje e a perspectiva
      // perto da câmera): topo do texto a VAO_DO_ROTULO px do fundo do que está desenhado
      const r = rotulos.get(p.id);
      if (medida && r?.properties) {
        // o corpo na camada é tamTela; o Mapbox o multiplica pela perspectiva (o em do afastamento também)
        const tam = Number(r.properties.tamTela) || 11;
        const off = (cx[3] - pe.y + VAO_DO_ROTULO) / (tam * persp);
        if (Math.abs(off - Number(r.properties.off)) * tam * persp > 0.75) {
          r.properties.off = off;
          rotuloMudou = true;
        }
      }
    }
    fonte.setData({ type: 'FeatureCollection', features: feicoes });
    if (rotuloMudou) (m.getSource(F.maquetes) as mapboxgl.GeoJSONSource | undefined)?.setData({ type: 'FeatureCollection', features: this.feicoesDasMaquetes });
    this.esconderMembrosSobAMaquete(medidas);
  }

  /** Disco que cai sob a maquete não tem como aparecer: o Mapbox desenha o símbolo por cima
   *  da camada 3D e o disco translúcido virava uma mancha sobre o modelo (o quadrado roxo de
   *  Angra 1 sobre Angra 2, o rosa da UTE Cubatão sobre a refinaria). Sai pelo mesmo
   *  feature-state dos vencedores: o membro está no rótulo ("+1 unidade") e na ficha; o
   *  outro continua no hover, na busca e na ficha. "Como ler" diz isso. */
  private membrosSobAMaquete = new Set<number>();
  /** instalações da ANP cujo ícone cai sob o corpo de outra maquete (saem por feature-state) */
  private instSobAMaquete = new Set<number>();
  /** Membros dos conjuntos com maquete: o disco proporcional sai e fica o ponto pequeno
   *  (maquetes-membros-ponto). A hierarquia: maquete, rótulo, perdedor, membro. */
  private membrosComoPonto = new Set<number>();
  /** Subestações cujo quadrado cai sob o rótulo de uma maquete (saem por filtro). */
  private seSobRotulo: number[] = [];
  private feicoesDosMembros: Feature<Point>[] = [];
  private esconderMembrosSobAMaquete(medidas: Map<PontoDeMaquete, [number, number, number, number] | null>) {
    const m = this.mapa;
    if (!m.getSource(F.usinas)) return;
    const novo = new Set<number>();
    const comoPonto = new Set<number>();
    const seSob = new Set<number>();
    const usinasVisiveis = m.getLayer('usinas') && m.getLayoutProperty('usinas', 'visibility') !== 'none';
    const seVisiveis = m.getLayer('subestacoes') && m.getLayoutProperty('subestacoes', 'visibility') !== 'none';
    const dentroDe = (q: { x: number; y: number }, c: [number, number, number, number]) => q.x > c[0] && q.x < c[2] && q.y > c[1] && q.y < c[3];
    // caixas dos rótulos das maquetes (abaixo da caixa medida, infladas 4 px): disco, ponto de
    // membro e quadrado de subestação que caem nelas saem (achado 8: "CEurus II")
    const caixasDeRotulo: [number, number, number, number][] = [];
    for (const p of this.escolha.pontos) {
      if (!p.rotulo?.mostrar) continue;
      const cx = medidas.get(p) ?? p.caixa;
      const pe = m.project([p.lon, p.lat]);
      const meia = (p.rotulo.caixa[2] - p.rotulo.caixa[0]) / 2;
      const alt = p.rotulo.caixa[3] - p.rotulo.caixa[1];
      caixasDeRotulo.push([pe.x - meia - 4, cx[3] - 2, pe.x + meia + 4, cx[3] + VAO_DO_ROTULO + alt + 4]);
    }
    /** caixas desenhadas das maquetes, infladas 14 px (o quadrado de subestação encostado sai) */
    const caixasDosCorpos: [number, number, number, number][] = [];
    /** ícones de instalação da ANP sob o corpo de outra maquete */
    const instSob = new Set<number>();
    for (const p of this.escolha.pontos) {
      if (p.familia === 'torre') continue;
      // membros do próprio conjunto dentro da caixa desenhada (a unidade do mesmo sítio)
      const cx = medidas.get(p) ?? p.caixa;
      for (const mb of p.membros) {
        const fid = Number(mb.id.slice(6));
        const q = m.project([mb.lon, mb.lat]);
        const sobModelo = !p.deCima && !p.semModelo && q.x > cx[0] + 2 && q.x < cx[2] - 2 && q.y > cx[1] + 2 && q.y < cx[3] - 2;
        if (sobModelo || caixasDeRotulo.some((c) => dentroDe(q, c))) novo.add(fid);
        else comoPonto.add(fid);
      }
      if (p.deCima || p.semModelo) continue;
      // quadrado de subestação encostado num corpo de maquete (a menos de 14 px da caixa
      // desenhada) sai: o pórtico 2D colado no aerogerador ou na refinaria lia como peça dela
      if (seVisiveis) {
        const c: [number, number, number, number] = [cx[0] - 14, cx[1] - 14, cx[2] + 14, cx[3] + 14];
        caixasDosCorpos.push(c);
        for (const f of m.queryRenderedFeatures(
          [
            [c[0], c[1]],
            [c[2], c[3]],
          ],
          { layers: ['subestacoes'] },
        )) {
          if (typeof f.id !== 'number' || f.geometry.type !== 'Point') continue;
          if (p.origem?.fonte === 'subestacoes' && p.origem.id === f.id) continue;
          if (dentroDe(m.project((f.geometry as Point).coordinates as [number, number]), c)) seSob.add(f.id);
        }
      }
      // qualquer outro disco de usina cujo ponto cai na caixa DESENHADA da maquete (achado 5:
      // o quadrado rosa da UTE ao lado da RPBC, os selos sobre a base da U-300). O aerogerador
      // não esconde ninguém: o céu atrás das pás é transparente.
      if (p.tipo === 'aerogerador') continue;
      const caixaDoCorpo: [number, number, number, number] = [cx[0] - 3, cx[1] - 3, cx[2] + 3, cx[3] + 3];
      // os ícones das outras instalações da ANP no mesmo sítio (r2: os dois selos rosa sobre a
      // base da U-300 em Macaé) saem pelo mesmo feature-state; continuam na busca e na ficha
      if (m.getLayer('combustivel-instalacoes') && m.getLayoutProperty('combustivel-instalacoes', 'visibility') !== 'none')
        for (const f of m.queryRenderedFeatures(
          [
            [caixaDoCorpo[0], caixaDoCorpo[1]],
            [caixaDoCorpo[2], caixaDoCorpo[3]],
          ],
          { layers: ['combustivel-instalacoes'] },
        )) {
          const id = typeof f.id === 'number' ? f.id : Number(f.id);
          if (!Number.isFinite(id) || f.geometry.type !== 'Point') continue;
          if (p.origem?.fonte === 'instalacoes' && p.origem.id === id) continue;
          if (dentroDe(m.project((f.geometry as Point).coordinates as [number, number]), caixaDoCorpo)) instSob.add(id);
        }
      if (!usinasVisiveis) continue;
      for (const f of m.queryRenderedFeatures(
        [
          [caixaDoCorpo[0], caixaDoCorpo[1]],
          [caixaDoCorpo[2], caixaDoCorpo[3]],
        ],
        { layers: ['usinas'] },
      )) {
        if (typeof f.id !== 'number' || f.geometry.type !== 'Point') continue;
        if (dentroDe(m.project((f.geometry as Point).coordinates as [number, number]), caixaDoCorpo)) novo.add(f.id);
      }
    }
    // discos dos perdedores e quadrados de subestação sob os rótulos
    for (const c of caixasDeRotulo) {
      const caixa: [mapboxgl.PointLike, mapboxgl.PointLike] = [
        [c[0], c[1]],
        [c[2], c[3]],
      ];
      if (usinasVisiveis)
        for (const f of m.queryRenderedFeatures(caixa, { layers: ['usinas'] })) {
          if (typeof f.id !== 'number' || f.geometry.type !== 'Point') continue;
          if (dentroDe(m.project((f.geometry as Point).coordinates as [number, number]), c)) novo.add(f.id);
        }
      if (seVisiveis)
        for (const f of m.queryRenderedFeatures(caixa, { layers: ['subestacoes'] })) {
          if (typeof f.id !== 'number' || f.geometry.type !== 'Point') continue;
          if (dentroDe(m.project((f.geometry as Point).coordinates as [number, number]), c)) seSob.add(f.id);
        }
    }
    // as que já saíram por filtro não voltam no queryRenderedFeatures: ficam se ainda estão sob um rótulo
    for (const id of this.seSobRotulo) {
      const f = this.subestacoes?.features.find((x, i) => (typeof x.id === 'number' ? x.id : i + 1) === id);
      if (f?.geometry.type !== 'Point') continue;
      const q = m.project((f.geometry as Point).coordinates as [number, number]);
      const vencedora = this.escolha.pontos.some((p) => p.origem?.fonte === 'subestacoes' && p.origem.id === id);
      if (caixasDeRotulo.some((c) => dentroDe(q, c)) || (!vencedora && caixasDosCorpos.some((c) => dentroDe(q, c)))) seSob.add(id);
    }
    for (const id of novo) comoPonto.delete(id);
    const vencedor = (id: number) => this.comMaquete.has(`${F.usinas}:${id}`);
    const antes = new Set([...this.membrosSobAMaquete, ...this.membrosComoPonto]);
    for (const id of antes) if (!novo.has(id) && !comoPonto.has(id) && !vencedor(id)) this.marcarMaquete(F.usinas, id, false);
    for (const id of novo) this.marcarMaquete(F.usinas, id, true);
    for (const id of comoPonto) this.marcarMaquete(F.usinas, id, true);
    this.membrosSobAMaquete = novo;
    this.membrosComoPonto = comoPonto;
    // a pintura zera a opacidade mas a feição continua no índice: o conjunto se refaz a cada vez
    if (m.getSource(F.instalacoes)) {
      const venc = (id: number) => this.comMaquete.has(`${F.instalacoes}:${id}`);
      for (const id of this.instSobAMaquete) if (!instSob.has(id) && !venc(id)) m.removeFeatureState({ source: F.instalacoes, id }, 'maquete');
      for (const id of instSob) m.setFeatureState({ source: F.instalacoes, id }, { maquete: true });
    }
    this.instSobAMaquete = instSob;
    // o ponto do membro escondido sob a maquete ou o rótulo também sai
    let mudou = false;
    for (const f of this.feicoesDosMembros) {
      const sob = novo.has(Number(f.properties?.fid)) ? 1 : 0;
      if (f.properties && f.properties.sob !== sob) {
        f.properties.sob = sob;
        mudou = true;
      }
    }
    if (mudou) (m.getSource(F.maquetesMembros) as mapboxgl.GeoJSONSource | undefined)?.setData({ type: 'FeatureCollection', features: this.feicoesDosMembros });
    const se = [...seSob].sort((a, b) => a - b);
    if (se.join(',') !== this.seSobRotulo.join(',')) {
      this.seSobRotulo = se;
      this.filtrarVencedores();
    }
  }

  /** Destaque do conjunto (§7): no hover de uma maquete ou de um membro, e na seleção de
   *  qualquer usina do conjunto; anel de ouro nos membros e envoltória tracejada dos pontos.
   *  Nada em repouso. */
  private conjuntoEmHover: string | null = null;
  private destaqueDoConjuntoPosto = '';
  private atualizarDestaqueDoConjunto() {
    const m = this.mapa;
    const fonte = m.getSource(F.maquetesDestaque) as mapboxgl.GeoJSONSource | undefined;
    if (!fonte) return;
    const sel = this.estado.selecionado;
    const daSelecao = sel?.tipo === 'usina' ? this.escolha.pontos.find((p) => p.familia === 'usina' && (p.ceg === sel.chave || p.membros.some((mb) => mb.ceg === sel.chave))) : undefined;
    const p = (this.conjuntoEmHover ? this.escolha.pontos.find((x) => x.id === this.conjuntoEmHover) : undefined) ?? daSelecao;
    const chave = p && p.membros.length ? `${p.id}|${p.membros.length}|${this.estado.modo}` : '';
    if (chave === this.destaqueDoConjuntoPosto) return;
    this.destaqueDoConjuntoPosto = chave;
    if (!p || !p.membros.length) {
      fonte.setData(VAZIA);
      return;
    }
    const feicoes: Feature[] = p.membros.map((mb) => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [mb.lon, mb.lat] }, properties: { kw: mb.mw * 1000 } }));
    const anel = envoltoria([[p.lon, p.lat], ...p.membros.map((mb) => [mb.lon, mb.lat] as [number, number])], 12 * metrosPorPixel(m.getZoom(), p.lat));
    if (anel) feicoes.push({ type: 'Feature', geometry: { type: 'LineString', coordinates: anel }, properties: {} });
    fonte.setData({ type: 'FeatureCollection', features: feicoes });
  }

  /** Alvo de clique e hover entre as maquetes: o membro de um conjunto (área de toque), a
   *  usina 2D que não ganhou maquete sob o cursor, e a caixa da maquete (obstáculo). */
  private alvoDeMaquete(ponto: mapboxgl.Point): { tipo: TipoDeAtivo; feicao: FeicaoAlvo; idDoPonto: string } | null {
    const m = this.mapa;
    if (!this.escolha.pontos.length || !m.getLayer('maquetes-obstaculo')) return null;
    // o membro escondido sob a maquete ou o rótulo (sob = 1) não toma o clique do corpo visível:
    // sem membro à mostra, o fluxo segue para os discos e para o obstáculo, que dá a semente
    const membros = (m.getLayer('maquetes-membros-toque') ? m.queryRenderedFeatures(ponto, { layers: ['maquetes-membros-toque'] }) : []).filter((f) => f.properties?.sob !== 1);
    if (membros.length) {
      const perto = membros
        .map((f) => ({ f, d: (() => {
          const g = (f.geometry as Point).coordinates;
          const q = m.project([g[0], g[1]]);
          return Math.hypot(q.x - ponto.x, q.y - ponto.y);
        })() }))
        .sort((a, b) => a.d - b.d)[0].f;
      const u = this.usinaPorId(Number(perto.properties?.fid));
      if (u) return { tipo: 'usina', feicao: { properties: u.properties as unknown as Record<string, unknown>, geometry: u.geometry }, idDoPonto: String(perto.properties?.ponto) };
    }
    // disco 2D de usina sem maquete exatamente sob o cursor: fica com ele (os ALVOS de sempre)
    if (m.getLayer('usinas') && m.getLayoutProperty('usinas', 'visibility') !== 'none') {
      const discos = m.queryRenderedFeatures(
        [
          [ponto.x - 3, ponto.y - 3],
          [ponto.x + 3, ponto.y + 3],
        ],
        { layers: ['usinas'] },
      );
      if (discos.some((f) => typeof f.id === 'number' && m.getFeatureState({ source: F.usinas, id: f.id }).maquete !== true)) return null;
    }
    for (const f of m.queryRenderedFeatures(ponto, { layers: ['maquetes-obstaculo'] })) {
      const p = this.escolha.pontos.find((x) => x.id === f.properties?.id);
      if (!p || !p.origem) continue;
      const alvo = this.feicaoDeOrigem(p);
      if (alvo) return { ...alvo, idDoPonto: p.id };
    }
    return null;
  }

  /** A feição de origem (usina, subestação, instalação da ANP) de um ponto escolhido. */
  private feicaoDeOrigem(p: PontoDeMaquete): { tipo: TipoDeAtivo; feicao: FeicaoAlvo } | null {
    const o = p.origem;
    if (!o) return null;
    if (o.fonte === 'usinas') {
      const u = this.usinaPorId(o.id);
      return u ? { tipo: 'usina', feicao: { properties: u.properties as unknown as Record<string, unknown>, geometry: u.geometry } } : null;
    }
    if (o.fonte === 'subestacoes') {
      const f = this.subestacoes?.features.find((x, i) => (typeof x.id === 'number' ? x.id : i + 1) === o.id);
      return f ? { tipo: 'subestacao', feicao: { properties: (f.properties ?? {}) as Record<string, unknown>, geometry: f.geometry } } : null;
    }
    const f = this.comb.instalacoes?.features.find((x) => (typeof x.id === 'number' ? x.id : Number(x.id)) === o.id);
    return f ? { tipo: 'instalacao', feicao: { properties: (f.properties ?? {}) as Record<string, unknown>, geometry: f.geometry } } : null;
  }

  /** Vencedores da fonte das usinas e das instalações: o símbolo 2D (selo, disco proporcional,
   *  ícone da instalação) apaga por feature-state (pintura, não colisão: o disco não colide; o
   *  selo some de vez a partir de 10,2). Os membros dos conjuntos e os perdedores continuam
   *  com o disco proporcional de sempre. */
  private comMaquete = new Map<string, { source: string; id: number }>();
  private marcarSimbolosComMaquete() {
    const m = this.mapa;
    const novo = new Map<string, { source: string; id: number }>();
    for (const p of this.escolha.pontos) {
      if (!p.origem || p.origem.fonte === 'subestacoes') continue;
      const source = p.origem.fonte === 'usinas' ? F.usinas : F.instalacoes;
      novo.set(`${source}:${p.origem.id}`, { source, id: p.origem.id });
    }
    for (const [k, f] of this.comMaquete) if (!novo.has(k) && m.getSource(f.source)) this.marcarMaquete(f.source, f.id, false);
    // todas de novo a cada vez: a troca de modo remonta o estilo e zera o feature-state
    for (const f of novo.values()) if (m.getSource(f.source)) this.marcarMaquete(f.source, f.id, true);
    this.comMaquete = novo;
  }

  /** Filtros de base (aplicar) das camadas cujo símbolo do vencedor sai por filtro: o quadrado
   *  e o nome da subestação (mesma camada) e o rótulo da instalação da ANP. */
  private filtroBaseSE: unknown[] | null = null;
  private filtroBaseCombRotulo: unknown[] | null = null;
  private filtrosPostos: { se: string; comb: string } = { se: '', comb: '' };
  private filtrarVencedores() {
    const m = this.mapa;
    const se: number[] = [];
    const anp: number[] = [];
    for (const p of this.escolha.pontos) {
      if (p.origem?.fonte === 'subestacoes') se.push(p.origem.id);
      else if (p.origem?.fonte === 'instalacoes') anp.push(p.origem.id);
    }
    // o quadrado de subestação que cai sob o rótulo de uma maquete sai (esconder, nunca deslocar)
    for (const id of this.seSobRotulo) if (!se.includes(id)) se.push(id);
    const sem = (base: unknown[] | null, ids: number[]): unknown[] | null => {
      if (!base) return null;
      return ids.length ? ['all', base, ['!', ['in', ['id'], ['literal', ids]]]] : base;
    };
    const fSe = sem(this.filtroBaseSE, se);
    const fComb = sem(this.filtroBaseCombRotulo, anp);
    const kSe = JSON.stringify(fSe);
    const kComb = JSON.stringify(fComb);
    if (fSe && m.getLayer('subestacoes') && kSe !== this.filtrosPostos.se) {
      m.setFilter('subestacoes', fSe as Filtro);
      this.filtrosPostos.se = kSe;
    }
    if (fComb && m.getLayer('combustivel-rotulo') && kComb !== this.filtrosPostos.comb) {
      m.setFilter('combustivel-rotulo', fComb as Filtro);
      this.filtrosPostos.comb = kComb;
    }
  }

  private ultimoEarRes: Record<string, number | null> | null = null;
  private pintarReservatorios() {
    const m = this.mapa;
    const ear = this.estado.capitulo === 'agua' ? this.estado.earReservatorio : null;
    if (ear === this.ultimoEarRes || !this.reservatorios) return;
    if (!m.getSource(F.reservatorios)) return;
    this.ultimoEarRes = ear;
    for (const f of this.reservatorios.features) {
      const cod = (f.properties as { cod: string | null }).cod;
      if (!cod) continue;
      const v = ear ? (ear[cod] ?? null) : null;
      m.setFeatureState({ source: F.reservatorios, id: cod }, { pct: v });
    }
  }

  private ultimasCores: Record<string, string> | null = null;
  private pintarMundo() {
    const m = this.mapa;
    const e = this.estado;
    if (!e.paises || !m.getSource(F.paises)) return;
    const cores = e.capitulo === 'mundo' ? e.coresDoMundo : null;
    if (cores === this.ultimasCores) return;
    this.ultimasCores = cores;
    for (const f of e.paises.features) {
      const a3 = (f.properties as { a3: string | null }).a3;
      if (!a3) continue;
      m.setFeatureState({ source: F.paises, id: a3 }, { cor: cores?.[a3] ?? null });
    }
  }

  /** As trocas são desenhadas em SVG sobre o mapa, não como camada do Mapbox: o
   *  tracejado caminha por animação de CSS (stroke-dashoffset), que roda no
   *  compositor e não custa um quadro do mapa. A versão por camada, animando
   *  line-dasharray, derrubava o capítulo para ~18 fps numa GPU dedicada (medido). */
  private atualizarTrocas() {
    const trocas = this.estado.capitulo === 'trocas' ? this.estado.trocas : null;
    if (!trocas || trocas.length === 0) {
      this.svgDasTrocas?.remove();
      this.svgDasTrocas = null;
      return;
    }
    if (!this.svgDasTrocas) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'atl-fluxos');
      svg.setAttribute('aria-hidden', 'true');
      this.mapa.getCanvasContainer().appendChild(svg);
      this.svgDasTrocas = svg;
    }
    this.desenharTrocas();
  }

  /** Reprojeta os arcos para a tela (a cada movimento da câmera e a cada mês). */
  private desenharTrocas() {
    const svg = this.svgDasTrocas;
    const trocas = this.estado.trocas;
    if (!svg || !trocas) return;
    // mesma régua de largura em todos os meses: 1 px no zero, 15 px em 9.000 MW médios
    const largura = (mw: number) => (mw <= 1000 ? 1 + (mw / 1000) * 2 : mw <= 4000 ? 3 + ((mw - 1000) / 3000) * 5 : 8 + (Math.min(mw, 9000) - 4000) / 5000 * 7);
    // O rótulo do nó ("NORTE", "SUDESTE / CENTRO-OESTE") fica centrado no próprio nó, e o arco
    // nasce e morre ali: a seta de chegada tapava o nome ("N  E", "ESTE"). O arco é aparado na
    // caixa do rótulo, estimada com as mesmas regras da camada submercados-rotulo (corpo pela
    // rampa do zoom, mono a ~0,6 em por letra mais 0,14 em de espaçamento, quebra em 8 em).
    const z = this.mapa.getZoom();
    const corpo = z <= 2.5 ? 9 : z >= 5 ? 12 : 9 + ((z - 2.5) / 2.5) * 3;
    const LINHAS_DO_ROTULO: Record<Subsistema, string[]> = { SE: ['SUDESTE /', 'CENTRO-OESTE'], S: ['SUL'], NE: ['NORDESTE'], N: ['NORTE'] };
    const rotuloVisivel = this.mapa.getLayer('submercados-rotulo') && this.mapa.getLayoutProperty('submercados-rotulo', 'visibility') === 'visible' && z < 6.2;
    const caixaDoNo = (sub: Subsistema, c: mapboxgl.Point) => {
      const linhas = LINHAS_DO_ROTULO[sub];
      const meiaL = rotuloVisivel ? (Math.max(...linhas.map((t) => t.length)) * 0.74 * corpo) / 2 + 5 : 6;
      const meiaA = rotuloVisivel ? (linhas.length * 1.2 * corpo) / 2 + 4 : 6;
      return { x0: c.x - meiaL, x1: c.x + meiaL, y0: c.y - meiaA, y1: c.y + meiaA };
    };
    const dentro = (q: { x: number; y: number }, k: { x0: number; x1: number; y0: number; y1: number }) => q.x > k.x0 && q.x < k.x1 && q.y > k.y0 && q.y < k.y1;
    /** apara a ponta da polilinha (do lado de `pts[0]`) até a borda da caixa */
    const aparar = (pts: mapboxgl.Point[], k: ReturnType<typeof caixaDoNo>): mapboxgl.Point[] => {
      let i = 0;
      while (i < pts.length - 1 && dentro(pts[i + 1], k)) i++;
      if (i >= pts.length - 2) return pts; // o arco inteiro cabe no rótulo (nós colados): fica como está
      const a = pts[i];
      const b = pts[i + 1];
      // bissecção no segmento que sai da caixa
      let lo = 0;
      let hi = 1;
      for (let n = 0; n < 12; n++) {
        const t = (lo + hi) / 2;
        if (dentro({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }, k)) lo = t;
        else hi = t;
      }
      const q = new mapboxgl.Point(a.x + (b.x - a.x) * hi, a.y + (b.y - a.y) * hi);
      return [q, ...pts.slice(i + 1)];
    };
    let conteudo = '';
    for (const troca of trocas) {
      const a = this.nos[troca.de];
      const b = this.nos[troca.para];
      if (!a || !b || troca.mw <= 0) continue;
      let pts = arco(a, b).map((c) => this.mapa.project(c as [number, number]));
      pts = aparar(pts, caixaDoNo(troca.de, pts[0]));
      pts = aparar(pts.slice().reverse(), caixaDoNo(troca.para, pts[pts.length - 1])).reverse();
      if (pts.length < 3) continue;
      const d = 'M' + pts.map((q) => `${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join('L');
      const l = largura(troca.mw);
      conteudo += `<path class="atl-fluxo-leito" d="${d}" stroke-width="${(l + 2.5).toFixed(1)}"/><path class="atl-fluxo" d="${d}" stroke-width="${l.toFixed(1)}"/>`;
      // A3 (leva 3): a ponta da seta é proporcional ao espaço entre os nós. No celular os nós
      // ficam a ~80 px e a ponta de 20 px (feita para ~200 px) amontoava as setas entre eles:
      // a escala cai com a distância (referência 200 px), nunca abaixo da meia largura do traço;
      // critico-desktop 14 (leva 4): UMA ponta por fluxo, na chegada (a do meio encavalava com a
      // do fluxo vizinho e lia como gagueira); o sentido do movimento é o do tracejado.
      const dNos = Math.hypot(pts[pts.length - 1].x - pts[0].x, pts[pts.length - 1].y - pts[0].y);
      const escala = Math.min(1, dNos / 200);
      const m = Math.max(l * 0.8 + 2, (5 + l * 1.15) * escala);
      const pontas = [pts.length - 1];
      for (const k of pontas) {
        const p1 = pts[k];
        const p0 = pts[k - 1];
        const rad = Math.atan2(p1.y - p0.y, p1.x - p0.x);
        const ang = (rad * 180) / Math.PI;
        // a seta de chegada termina NA ponta aparada (a ponta da seta fica m·1,25 à frente do
        // ponto de apoio): recua o apoio para a ponta não entrar na caixa do rótulo
        const recuo = k === pts.length - 1 ? m * 1.25 : 0;
        const x = p1.x - Math.cos(rad) * recuo;
        const y = p1.y - Math.sin(rad) * recuo;
        conteudo += `<path class="atl-fluxo-seta" d="M${(m * 1.25).toFixed(1)} 0L${(-m * 0.75).toFixed(1)} ${(-m).toFixed(1)}L${(-m * 0.3).toFixed(1)} 0L${(-m * 0.75).toFixed(1)} ${m.toFixed(1)}Z" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(1)})"/>`;
      }
    }
    svg.innerHTML = conteudo;
  }

  /** Um disco por subsistema: fatias por fonte, anel de carga. */
  private atualizarDia(ligado: boolean) {
    const fatias = ligado ? this.estado.dia : null;
    if (!fatias) {
      for (const k of Object.keys(this.marcadoresDoDia) as Subsistema[]) {
        this.marcadoresDoDia[k]?.remove();
        delete this.marcadoresDoDia[k];
      }
      return;
    }
    const p = PALETA[this.estado.modo];
    // régua fixa do dia (o maior valor das 24 horas, geração ou carga), entregue pelo React;
    // sem ela, o melhor que se tem é o maior da hora corrente (a escala muda de hora em hora)
    const daHora = Math.max(...fatias.map((f) => Math.max(f.hidro + f.termica + f.eolica + f.solar, f.carga)));
    const maior = Math.max(this.estado.tetoDoDia != null && this.estado.tetoDoDia > 0 ? this.estado.tetoDoDia : daHora, 1);
    // critico-celular 7: o raio máximo (64 px no desktop) depende da largura útil e do espaço
    // entre os nós na tela: dois discos vizinhos no máximo se tocam (a 390 eles se cobriam)
    const { left, right, w } = this.margensSeguras();
    const nos = fatias.map((f) => this.nos[f.sub]).filter((c): c is [number, number] => !!c).map((c) => this.mapa.project(c));
    let dMin = Infinity;
    for (let i = 0; i < nos.length; i++) for (let j = i + 1; j < nos.length; j++) dMin = Math.min(dMin, Math.hypot(nos[i].x - nos[j].x, nos[i].y - nos[j].y));
    const rMax = Math.max(20, Math.min(64 * Math.min(1, Math.max(0.6, (w - left - right) / 1000)), Number.isFinite(dMin) ? dMin / 2 : 64));
    const raio = (v: number) => rMax * (18 / 64) + rMax * (46 / 64) * Math.sqrt(Math.max(v, 0) / maior);
    for (const f of fatias) {
      const no = this.nos[f.sub];
      if (!no) continue;
      let marc = this.marcadoresDoDia[f.sub];
      if (!marc) {
        const el = document.createElement('div');
        el.className = 'atlas-disco';
        marc = new mapboxgl.Marker({ element: el, anchor: 'center' }).setLngLat(no).addTo(this.mapa);
        this.marcadoresDoDia[f.sub] = marc;
      }
      const total = f.hidro + f.termica + f.eolica + f.solar;
      const r = raio(total);
      const partes: [number, string][] = [
        [f.hidro, p.categoria.hidro],
        [f.termica, p.categoria.gas],
        [f.eolica, p.categoria.eolica],
        [f.solar, p.categoria.solar],
      ];
      let ang = -Math.PI / 2;
      let caminhos = '';
      for (const [v, cor] of partes) {
        if (v <= 0 || total <= 0) continue;
        const a2 = ang + (v / total) * Math.PI * 2;
        const grande = a2 - ang > Math.PI ? 1 : 0;
        const x1 = r * Math.cos(ang);
        const y1 = r * Math.sin(ang);
        const x2 = r * Math.cos(a2);
        const y2 = r * Math.sin(a2);
        caminhos +=
          v / total > 0.999
            ? `<circle r="${r}" fill="${cor}"/>`
            : `<path d="M0 0 L${x1.toFixed(2)} ${y1.toFixed(2)} A${r} ${r} 0 ${grande} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z" fill="${cor}"/>`;
        ang = a2;
      }
      // anel de carga: raio na mesma escala de área da geração
      const rc = raio(f.carga);
      const lado = Math.ceil(Math.max(r, rc) * 2 + 8);
      marc.getElement().innerHTML = `<svg width="${lado}" height="${lado}" viewBox="${-lado / 2} ${-lado / 2} ${lado} ${lado}" aria-hidden="true"><g opacity="0.92">${caminhos}</g><circle r="${r}" fill="none" stroke="${p.papel}" stroke-width="1"/><circle r="${rc.toFixed(1)}" fill="none" stroke="${p.tinta}" stroke-width="1.4" stroke-dasharray="3 3"/></svg>`;
    }
  }

  // ── destaque e seleção ─────────────────────────────────────────────

  private atualizarDestaque() {
    const s = this.mapa.getSource(F.destaque) as mapboxgl.GeoJSONSource | undefined;
    if (!s) return;
    const e = this.estado;
    const d = e.destaque;
    // nada mudou desde a última entrega: não reenvia (o passo do tempo cai aqui)
    const md = this.memoDestaque;
    const paisesConta = d?.paises?.length ? e.paises : null;
    if (md && md.d === d && md.v === this.versaoDosDados && md.cap === e.capitulo && md.paises === paisesConta) return;
    this.memoDestaque = { d, v: this.versaoDosDados, cap: e.capitulo, paises: paisesConta };
    if (!d) {
      s.setData(VAZIA);
      return;
    }
    const feicoes: Feature[] = [];
    if (d.usinas?.length) {
      const alvo = new Set(d.usinas);
      for (const u of this.usinas) {
        if (!alvo.has(u.properties.ceg)) continue;
        alvo.delete(u.properties.ceg);
        feicoes.push({ type: 'Feature', geometry: u.geometry, properties: { rotulo: u.properties.nome, kw: u.properties.kw } });
      }
      // usina citada que não está entre as principais: as menores vêm agora, sem esperar o zoom
      if (alvo.size && !this.menoresCarregadas && this.usinas.length) void this.carregarMenores();
    }
    const colher = (fc: FeatureCollection | null, chaves: string[] | undefined, campo: string, rotulo: string | null) => {
      if (!fc || !chaves?.length) return;
      const alvo = new Set(chaves);
      for (const f of fc.features) {
        const v = (f.properties as Record<string, unknown>)[campo];
        if (typeof v === 'string' && alvo.has(v)) feicoes.push({ type: 'Feature', geometry: f.geometry, properties: rotulo ? { rotulo: (f.properties as Record<string, unknown>)[rotulo] } : {} });
      }
    };
    colher(this.linhas, d.linhas, 'id', null);
    colher(this.subestacoes, d.subestacoes, 'id', 'n');
    colher(this.reservatorios, d.reservatorios, 'cod', 'n');
    colher(this.submercados, d.submercados, 'sub', null);
    colher(this.bacias, d.bacias, 'Nome_Bacia', null);
    if (d.combustivel?.length) {
      // os seis arquivos da ANP compartilham o espaço de ids: procura-se só no arquivo do prefixo
      const porArquivo = new Map<ArquivoDoCombustivel, string[]>();
      for (const id of d.combustivel) {
        const a = arquivoDoId(id);
        if (a) porArquivo.set(a, [...(porArquivo.get(a) ?? []), id]);
      }
      for (const [a, ids] of porArquivo) colher(this.comb[a] ?? null, ids, 'id', a === 'instalacoes' ? 'rotulo' : null);
    }
    if (e.capitulo === 'mundo') colher(e.paises, d.paises, 'a3', null);
    s.setData({ type: 'FeatureCollection', features: feicoes });
  }

  private atualizarSelecao() {
    const s = this.mapa.getSource(F.selecao) as mapboxgl.GeoJSONSource | undefined;
    if (!s) return;
    // a seleção do comércio é desenhada pela camada dele (rota e veículo em óxido)
    const sel = this.estado.selecionado?.tipo === 'comercio' || this.estado.selecionado?.tipo === 'operacao' ? null : this.estado.selecionado;
    const ms = this.memoSelecao;
    if (ms && ms.s === sel && ms.v === this.versaoDosDados) return;
    this.memoSelecao = { s: sel, v: this.versaoDosDados };
    if (!sel) {
      s.setData(VAZIA);
      return;
    }
    const g = this.geometriaDe(sel);
    // o raio do anel é expressão de zoom na camada; aqui vai só a grandeza que o define
    const res = sel.tipo === 'reservatorio';
    const dadoDoRes = res ? (this.reservatorios?.features.find((f) => (f.properties as { cod?: unknown }).cod === sel.chave)?.properties as { vutil?: unknown } | undefined) : undefined;
    const vutil = res ? Number(dadoDoRes?.vutil ?? sel.props.vutil) || 0 : 0;
    const props = { kw: sel.tipo === 'usina' ? Number(sel.props.kw) || 0 : 0, vutil, res: res ? 1 : 0 };
    s.setData(g ? { type: 'FeatureCollection', features: [{ type: 'Feature', geometry: g, properties: props }] } : VAZIA);
  }

  /** Geometria do ativo selecionado, buscada nos dados (não no tile recortado). */
  private geometriaDe(sel: AtivoSelecionado): Geometry | null {
    const achar = (fc: FeatureCollection | null, campo: string) => fc?.features.find((f) => (f.properties as Record<string, unknown>)[campo] === sel.chave)?.geometry ?? null;
    switch (sel.tipo) {
      case 'usina':
        return this.usinas.find((u) => u.properties.ceg === sel.chave)?.geometry ?? { type: 'Point', coordinates: sel.lngLat };
      case 'linha':
        return achar(this.linhas, 'id');
      case 'subestacao':
        return achar(this.subestacoes, 'id');
      case 'reservatorio':
        return achar(this.reservatorios, 'cod') ?? { type: 'Point', coordinates: sel.lngLat };
      case 'submercado':
        return achar(this.submercados, 'sub');
      case 'bacia':
        return achar(this.bacias, 'Nome_Bacia');
      case 'pais':
        return achar(this.estado.paises, 'a3');
      case 'distribuidora':
        return this.distrib.geometria(sel.chave);
      case 'comercio':
        return this.comercio.geometria(sel.chave);
      case 'operacao':
        return this.pulso.geometria(sel.chave);
      default: {
        const arq = ARQUIVO_DO_TIPO[sel.tipo];
        if (!arq) return null;
        return achar(this.comb[arq] ?? null, 'id') ?? (sel.tipo === 'instalacao' ? { type: 'Point', coordinates: sel.lngLat } : null);
      }
    }
  }

  // ── interação ──────────────────────────────────────────────────────

  private alvoEm(ponto: mapboxgl.Point): { tipo: TipoDeAtivo; feicao: FeicaoAlvo; idDoPonto?: string } | null {
    const m = this.mapa;
    // capítulo do comércio: só as camadas dele respondem (veículo, ponto por terra, rota)
    // (A2.6: a camada escolhe o veículo mais perto do ponto; empate apertado, a rota mais grossa)
    if (this.estado.capitulo === 'comercio') {
      const f = this.comercio.alvoEm(ponto);
      return f ? { tipo: 'comercio', feicao: f } : null;
    }
    // "Um dia", modo dia real: só o pulso responde (disco da entidade)
    if (this.estado.capitulo === 'dia' && this.estado.momentoDaOperacao != null) {
      for (const camada of this.pulso.alvos()) {
        if (!m.getLayer(camada) || m.getLayoutProperty(camada, 'visibility') === 'none') continue;
        for (const f of m.queryRenderedFeatures(ponto, { layers: [camada] })) if (this.pulso.descrever(f)) return { tipo: 'operacao', feicao: f };
      }
      return null;
    }
    // maquetes primeiro: o membro do conjunto, depois a caixa da maquete (o disco 2D de quem
    // não ganhou maquete, exatamente sob o cursor, ainda vence a caixa: ver alvoDeMaquete)
    const daMaquete = this.alvoDeMaquete(ponto);
    if (daMaquete) return daMaquete;
    // codigo.md 1: na composição do Titã a rampa apaga as usinas só pela opacidade; abaixo do
    // primeiro degrau da rampa elas não respondem a clique nem a pairar (o que não se vê não abre)
    const d = this.degrausDaRampa();
    const semUsinas = !!d && m.getZoom() < d[0] + 0.05;
    const folga = 5;
    const caixa: [mapboxgl.PointLike, mapboxgl.PointLike] = [
      [ponto.x - folga, ponto.y - folga],
      [ponto.x + folga, ponto.y + folga],
    ];
    for (const { camada, tipo } of ALVOS) {
      if (semUsinas && tipo === 'usina') continue;
      if (!m.getLayer(camada) || m.getLayoutProperty(camada, 'visibility') === 'none') continue;
      // critico-desktop 17: o submercado só responde quando a área dele está desenhada (de longe)
      // (o rótulo dele sai em 6,2; em "A água" a área pintada pelo armazenamento é o assunto)
      if (tipo === 'submercado' && this.estado.capitulo !== 'agua' && m.getZoom() >= ZOOM_SEM_AREA_DO_SUBMERCADO) continue;
      const areal = AREAIS.has(tipo);
      const fs = m.queryRenderedFeatures(areal ? ponto : caixa, { layers: [camada] });
      if (fs.length) {
        // entre várias usinas sob o dedo, fica a maior
        const f = tipo === 'usina' ? fs.slice().sort((a, b) => Number(b.properties?.kw ?? 0) - Number(a.properties?.kw ?? 0))[0] : fs[0];
        return { tipo, feicao: f };
      }
    }
    return null;
  }

  private chaveDe(tipo: TipoDeAtivo, props: Record<string, unknown>): string {
    switch (tipo) {
      case 'usina':
        return String(props.ceg);
      case 'reservatorio':
        return String(props.cod);
      case 'submercado':
        return String(props.sub);
      case 'bacia':
        return String(props.Nome_Bacia);
      case 'pais':
        return String(props.a3 ?? props.nome ?? '');
      case 'distribuidora':
        return String(props.codigo);
      case 'comercio':
      case 'operacao':
        return String(props.chave);
      default:
        return String(props.id);
    }
  }

  /** Identidade do alvo para calar a etiqueta depois do clique. */
  private chaveDoPairar(alvo: { tipo: TipoDeAtivo; feicao: FeicaoAlvo; idDoPonto?: string }): string {
    return `${alvo.tipo}:${this.chaveDe(alvo.tipo, (alvo.feicao.properties ?? {}) as Record<string, unknown>)}:${alvo.idDoPonto ?? ''}`;
  }

  /** A área livre mudou (câmera assentada, tela redimensionada, painel aberto ou fechado):
   *  a página reconta "Nesta tela". No globo o Mapbox só refaz a projeção da câmera no
   *  quadro seguinte ao salto (medido: no moveend de um easeTo de duração zero, getBounds e
   *  unproject ainda respondem pela câmera anterior ao ajuste do globo, e a caixa saía maior:
   *  822 usinas contra 794), então a conta sai agora e de novo depois do próximo quadro. */
  private avisarAreaLivre() {
    if (!this.montado || !this.ret.aoAssentar) return;
    this.ret.aoAssentar({ limites: this.limitesDaTela(), poligono: this.poligonoDaTela(), zoom: this.mapa.getZoom() });
    if (this.recontaPedida) return;
    this.recontaPedida = true;
    this.mapa.once('render', () => {
      this.recontaPedida = false;
      if (this.destruido || !this.montado) return;
      this.ret.aoAssentar?.({ limites: this.limitesDaTela(), poligono: this.poligonoDaTela(), zoom: this.mapa.getZoom() });
    });
    this.mapa.triggerRepaint();
  }

  /** O agregado sob o cursor: só o símbolo 2D da usina em operação (não a maquete, não a futura). */
  private agregadoDoAlvo(alvo: { tipo: TipoDeAtivo; feicao: FeicaoAlvo; idDoPonto?: string }): Agregado | null {
    if (alvo.tipo !== 'usina' || alvo.idDoPonto) return null;
    const f = alvo.feicao as { layer?: { id?: string }; id?: unknown };
    if (f.layer?.id !== 'usinas' && f.layer?.id !== 'usinas-selo' && f.layer?.id !== 'dono') return null;
    const id = Number(f.id);
    if (!Number.isFinite(id)) return null;
    if (f.layer?.id === 'dono') {
      const b = faixaDoZoom(this.mapa.getZoom());
      return b && this.genDoDono ? this.genDoDono.agregadoDe(id, b) : null;
    }
    return this.agregadoNoZoom(id);
  }

  private aoClicar(e: mapboxgl.MapMouseEvent) {
    // o clique abre (ou fecha) a ficha: a etiqueta de pairar sai e não volta sobre o mesmo alvo
    this.ret.aoPairar(null);
    const alvo = this.alvoEm(e.point);
    this.pairarCalado = alvo ? this.chaveDoPairar(alvo) : null;
    if (!alvo) {
      this.ret.aoSelecionar(null);
      return;
    }
    const props = { ...(alvo.feicao.properties ?? {}) } as Record<string, unknown>;
    // o símbolo clicado é um agregado: a ficha recebe a soma, a contagem e as dez maiores
    const ag = this.agregadoDoAlvo(alvo);
    if (ag) props.agregado = resumoDoAgregado(ag);
    const g = alvo.feicao.geometry;
    const lngLat: [number, number] = g.type === 'Point' ? [(g as Point).coordinates[0], (g as Point).coordinates[1]] : [e.lngLat.lng, e.lngLat.lat];
    this.ret.aoSelecionar({ tipo: alvo.tipo, chave: this.chaveDe(alvo.tipo, props), props, lngLat });
  }

  private aoMover(e: mapboxgl.MapMouseEvent) {
    if (!this.montado) return;
    const alvo = this.alvoEm(e.point);
    this.mapa.getCanvas().style.cursor = alvo ? 'pointer' : '';
    // destaque do conjunto sob o cursor (maquete ou membro)
    const emHover = alvo?.idDoPonto ?? null;
    if (emHover !== this.conjuntoEmHover) {
      this.conjuntoEmHover = emHover;
      this.atualizarDestaqueDoConjunto();
    }
    if (!alvo) {
      this.pairarCalado = null;
      this.ret.aoPairar(null);
      return;
    }
    // câmera andando, ou o mesmo alvo que acabou de ser clicado: sem etiqueta
    const chaveDoAlvo = this.chaveDoPairar(alvo);
    if (this.pairarCalado && this.pairarCalado !== chaveDoAlvo) this.pairarCalado = null;
    if (this.emMovimento || this.pairarCalado) {
      this.ret.aoPairar(null);
      return;
    }
    const pr = (alvo.feicao.properties ?? {}) as Record<string, unknown>;
    // a maquete que já tem rótulo na tela não abre etiqueta (diria o mesmo, por cima do rótulo):
    // basta o destaque do conjunto. A etiqueta fica para os discos e os membros sem nome.
    const daMaquete = alvo.idDoPonto ? this.escolha.pontos.find((x) => x.id === alvo.idDoPonto) : undefined;
    if (daMaquete?.rotulo?.mostrar && (alvo.tipo !== 'usina' || daMaquete.ceg === pr.ceg)) {
      this.ret.aoPairar(null);
      return;
    }
    let titulo = '';
    let detalhe: string | null = null;
    switch (alvo.tipo) {
      case 'usina': {
        // o agregado (soma da faixa) fala da soma, com o nome da maior; nunca só o nome da sede
        const ag = this.agregadoDoAlvo(alvo);
        if (ag) {
          titulo = `${inteiroBr(ag.n)} usinas ${FONTE_NO_PLURAL[ag.cat] ?? ''}`.trim();
          detalhe = `${potenciaBr(ag.somaKw)} somados · a maior: ${ag.sede.properties.nome}`;
          break;
        }
        titulo = String(pr.nome);
        detalhe = `${pr.tipo} · ${pr.uf}`;
        if (pr.susp === true || pr.susp === 'true' || pr.susp === 1) detalhe = `${detalhe} · posição a confirmar`;
        // a semente de um conjunto: a segunda linha do rótulo dela ("+n parques · X MW")
        const p = alvo.idDoPonto ? this.escolha.pontos.find((x) => x.id === alvo.idDoPonto) : undefined;
        if (p && p.ceg === pr.ceg && p.rotulo?.linha2) detalhe = `${detalhe} · ${p.rotulo.linha2}`;
        else if (p && p.ceg !== pr.ceg && p.nome) detalhe = `${detalhe} · no conjunto de ${p.nome}`;
        break;
      }
      case 'linha':
        titulo = String(pr.n ?? 'Linha de transmissão');
        detalhe = `${pr.cc === 1 ? 'corrente contínua' : 'corrente alternada'} · ${pr.kv} kV`;
        break;
      case 'subestacao':
        titulo = `SE ${pr.n}`;
        detalhe = pr.kv ? `${pr.kv} kV · ${pr.uf ?? ''}` : (pr.uf as string | null);
        if (pr.op == null && pr.opAntesDe == null && pr.prev != null) detalhe = detalhe ? `${detalhe} · prevista` : 'prevista';
        else if (pr.susp === 1 || pr.susp === true) detalhe = detalhe ? `${detalhe} · posição a confirmar` : 'posição a confirmar';
        break;
      case 'reservatorio':
        titulo = String(pr.n);
        detalhe = pr.rio ? `rio ${pr.rio}` : null;
        break;
      case 'submercado':
        titulo = String(pr.nome ?? pr.sub);
        detalhe = 'submercado';
        break;
      case 'bacia':
        titulo = `Bacia do ${pr.Nome_Bacia}`;
        break;
      case 'pais':
        titulo = String(pr.nomePt ?? pr.nome ?? pr.a3 ?? '');
        break;
      case 'gasoduto':
        titulo = String(pr.duto ?? 'Gasoduto de transporte');
        detalhe = [pr.trecho, pr.diam != null ? `${pr.diam} pol` : null, pr.km != null ? `${Number(pr.km).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} km` : null].filter(Boolean).join(' · ') || 'gasoduto de transporte';
        break;
      case 'instalacao':
        titulo = String(pr.nome ?? pr.rotulo ?? '');
        detalhe = [ROTULO_DA_INSTALACAO[String(pr.tipo)] ?? null, pr.uf ?? null].filter(Boolean).join(' · ');
        break;
      case 'campo':
        titulo = `Campo ${pr.nome ?? ''}`.trim();
        detalhe = [pr.bacia ? `bacia ${pr.bacia}` : null, pr.etapa ?? null].filter(Boolean).join(' · ') || null;
        break;
      case 'bloco':
        titulo = `Bloco ${pr.nome ?? pr.cod ?? ''}`.trim();
        detalhe = pr.bacia ? `bloco exploratório · bacia ${pr.bacia}` : 'bloco exploratório';
        break;
      case 'bacia-sedimentar':
        titulo = String(pr.nome ?? 'Bacia sedimentar');
        detalhe = pr.sit === 'maritima' ? 'bacia sedimentar marítima' : pr.sit === 'terrestre' ? 'bacia sedimentar terrestre' : 'bacia sedimentar';
        break;
      case 'presal':
        titulo = 'Polígono do pré-sal';
        detalhe = 'polígono da ANP';
        break;
      case 'distribuidora':
        // a ficha da mesma área já está aberta: a etiqueta repetiria o título por cima dela (achado 10)
        if (this.estado.selecionado?.tipo === 'distribuidora' && String(this.estado.selecionado.chave) === String(pr.codigo)) {
          this.ret.aoPairar(null);
          return;
        }
        titulo = String(pr.nome ?? '');
        detalhe = pr.perm === 1 || pr.tipo === 'permissionária' ? 'área de permissionária de distribuição' : 'área de concessionária de distribuição';
        break;
      case 'comercio': {
        // a etiqueta é a da camada do comércio ("Petróleo bruto → China · 15,6 Mt")
        const d = this.comercio.descrever(alvo.feicao as mapboxgl.MapboxGeoJSONFeature);
        if (!d) {
          this.ret.aoPairar(null);
          return;
        }
        titulo = d.titulo;
        detalhe = d.linha || null;
        break;
      }
      case 'operacao': {
        // a etiqueta é a da camada do pulso (entidade, geração da hora, corte estimado)
        const d = this.pulso.descrever(alvo.feicao as mapboxgl.MapboxGeoJSONFeature);
        if (!d) {
          this.ret.aoPairar(null);
          return;
        }
        titulo = d.titulo;
        detalhe = d.linha || null;
        break;
      }
    }
    this.ret.aoPairar({ x: e.point.x, y: e.point.y, tipo: alvo.tipo, titulo, detalhe });
  }

  private opacidadeDasUsinas: {
    perto: Record<string, unknown>;
    longe: Record<string, unknown>;
    regime: 'perto' | 'longe' | null;
    /** os valores mudaram (aplicar) e precisam ser postos de novo no mesmo regime */
    sujo: boolean;
  } | null = null;
  /** As duas formas da opacidade (ver aplicar). Nenhuma lê feature-state (critico-desktop 4: a
   *  troca entre uma expressão com estado e outra sem quebrava o laço de pintura do Mapbox); o
   *  vencedor da maquete some pela cor (SOME_SOB_A_MAQUETE), que tem a mesma forma em todo zoom. */
  private porOpacidadeDasUsinas() {
    const o = this.opacidadeDasUsinas;
    if (!o || !this.mapa.getLayer('usinas')) return;
    const z = this.mapa.getZoom();
    // histerese de meio nível: o gesto que oscila na fronteira não troca a expressão a cada quadro
    const regime = o.regime === 'perto' ? (z < ZOOM_DA_RAMPA_SO_CAMERA - 0.5 ? 'longe' : 'perto') : z >= ZOOM_DA_RAMPA_SO_CAMERA ? 'perto' : 'longe';
    if (regime === o.regime && !o.sujo) return;
    o.regime = regime;
    o.sujo = false;
    for (const [id, v] of Object.entries(o[regime])) if (this.mapa.getLayer(id)) this.mapa.setPaintProperty(id, 'icon-opacity', v);
  }
  /** Põe ou tira o feature-state 'maquete' de uma feição. Na fonte das usinas o estado é
   *  espelhado na fonte do dono destacado (mesmo id: entregarDono copia u.id; codigo.md 4). */
  private marcarMaquete(source: string, id: number, sim: boolean) {
    const m = this.mapa;
    for (const s of source === F.usinas ? [F.usinas, F.dono] : [source]) {
      if (!m.getSource(s)) continue;
      if (sim) m.setFeatureState({ source: s, id }, { maquete: true });
      else m.removeFeatureState({ source: s, id }, 'maquete');
    }
  }

  private aoMudarZoom() {
    this.talvezCarregarMenores();
    this.porOpacidadeDasUsinas();
    // o rótulo 2D das usinas sai a partir do zoom das maquetes (e volta abaixo dele)
    if (this.montado) this.aplicarRotuloDasUsinas();
  }

  private avisarCamera() {
    const c = this.mapa.getCenter();
    this.ret.aoMoverCamera({ zoom: this.mapa.getZoom(), centro: [c.lng, c.lat] });
  }

  /** Um ponto da tela (px do canvas) no chão, ou null quando cai fora do globo (céu, horizonte):
   *  o ponto devolvido por unproject tem de voltar ao mesmo pixel por project. */
  private noChao(x: number, y: number): [number, number] | null {
    const l = this.mapa.unproject([x, y]);
    if (!Number.isFinite(l.lng) || !Number.isFinite(l.lat)) return null;
    const q = this.mapa.project(l);
    return Math.hypot(q.x - x, q.y - y) <= 2 ? [l.lng, l.lat] : null;
  }

  /** O retângulo geográfico [oeste, sul, leste, norte] da área LIVRE do mapa (sem os painéis
   *  que o cobrem: as mesmas margens do enquadramento, sem a folga de 24 px), para a soma de
   *  "Nesta tela". Amostra uma grade 7 × 7 da área livre e fica com a caixa dos pontos que
   *  caem no chão; com a câmera inclinada a caixa abraça o trapézio. null quando o mapa não
   *  montou ou quando menos de metade da grade cai no globo (vista do globo inteiro). */
  limitesDaTela(): [number, number, number, number] | null {
    if (!this.montado) return null;
    const cv = this.mapa.getCanvas();
    const w = cv.clientWidth;
    const h = cv.clientHeight;
    if (w <= 0 || h <= 0) return null;
    const mg = this.estado.margens;
    const x0 = Math.max(0, Math.min(w - 1, mg.esquerda));
    const x1 = Math.max(x0 + 1, w - Math.max(0, mg.direita));
    const y0 = Math.max(0, Math.min(h - 1, mg.topo));
    const y1 = Math.max(y0 + 1, h - Math.max(0, mg.base));
    const N = 7;
    let validos = 0;
    let o = Infinity;
    let s = Infinity;
    let l = -Infinity;
    let n = -Infinity;
    for (let i = 0; i < N; i++)
      for (let j = 0; j < N; j++) {
        const p = this.noChao(x0 + ((x1 - x0) * i) / (N - 1), y0 + ((y1 - y0) * j) / (N - 1));
        if (!p) continue;
        validos++;
        o = Math.min(o, p[0]);
        l = Math.max(l, p[0]);
        s = Math.min(s, p[1]);
        n = Math.max(n, p[1]);
      }
    if (validos < (N * N) / 2) return null;
    return [o, s, l, n];
  }

  /** Leva 5: a MESMA área livre de `limitesDaTela()` como polígono no chão (anel [lon, lat], no
   *  sentido horário da tela): o contorno amostrado em POR_LADO pontos por lado e levado ao chão;
   *  ponto do contorno que cai no céu (horizonte) recua em linha reta para o centro da área livre
   *  até o último pixel que ainda é chão. Com a câmera inclinada ou girada a caixa abraça um
   *  trapézio maior que a tela (no RN a z10 a caixa listava Alegria II, fora do canvas); o anel
   *  não. De cima e sem rumo (|inclinação| e |rumo| < 5°) devolve null: ali a caixa já é a tela
   *  e a conta fica como sempre foi. null também quando `limitesDaTela()` é null. */
  poligonoDaTela(): [number, number][] | null {
    if (!this.montado) return null;
    const m = this.mapa;
    if (m.getPitch() < 5 && Math.abs(((m.getBearing() + 540) % 360) - 180) < 5) return null;
    if (!this.limitesDaTela()) return null;
    const cv = m.getCanvas();
    const w = cv.clientWidth;
    const h = cv.clientHeight;
    const mg = this.estado.margens;
    const x0 = Math.max(0, Math.min(w - 1, mg.esquerda));
    const x1 = Math.max(x0 + 1, w - Math.max(0, mg.direita));
    const y0 = Math.max(0, Math.min(h - 1, mg.topo));
    const y1 = Math.max(y0 + 1, h - Math.max(0, mg.base));
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    const POR_LADO = 12;
    const contorno: [number, number][] = [];
    for (let i = 0; i < POR_LADO; i++) contorno.push([x0 + ((x1 - x0) * i) / POR_LADO, y0]);
    for (let i = 0; i < POR_LADO; i++) contorno.push([x1, y0 + ((y1 - y0) * i) / POR_LADO]);
    for (let i = 0; i < POR_LADO; i++) contorno.push([x1 - ((x1 - x0) * i) / POR_LADO, y1]);
    for (let i = 0; i < POR_LADO; i++) contorno.push([x0, y1 - ((y1 - y0) * i) / POR_LADO]);
    const anel: [number, number][] = [];
    for (const [x, y] of contorno) {
      let p = this.noChao(x, y);
      if (!p) {
        // céu: o último chão no caminho até o centro (busca binária em 12 passos)
        let fora = 0;
        let dentro = 1;
        if (!this.noChao(cx, cy)) continue;
        for (let k = 0; k < 12; k++) {
          const t = (fora + dentro) / 2;
          if (this.noChao(x + (cx - x) * t, y + (cy - y) * t)) dentro = t;
          else fora = t;
        }
        p = this.noChao(x + (cx - x) * dentro, y + (cy - y) * dentro);
      }
      if (p) anel.push(p);
    }
    return anel.length >= 3 ? anel : null;
  }

  /** Refaz o obstáculo de borda para a câmera assentada (moveend, resize, montagem). */
  private atualizarBorda() {
    if (!this.montado) return;
    const m = this.mapa;
    const fonte = m.getSource(F.borda) as mapboxgl.GeoJSONSource | undefined;
    if (!fonte) return;
    const cv = m.getCanvas();
    const w = cv.clientWidth;
    const h = cv.clientHeight;
    const f: Feature<Point>[] = [];
    if (m.getZoom() >= ZOOM_DA_BORDA && w > 0 && h > 0) {
      const pt = (x: number, y: number, img: string) => {
        const c = this.noChao(x, y);
        if (c) f.push({ type: 'Feature', geometry: { type: 'Point', coordinates: c }, properties: { img } });
      };
      for (let x = BORDA_PASSO / 2; x < w + BORDA_PASSO / 2; x += BORDA_PASSO) {
        pt(x, 0, 'atlas-borda-h');
        pt(x, h, 'atlas-borda-h');
      }
      for (let y = BORDA_PASSO / 2; y < h + BORDA_PASSO / 2; y += BORDA_PASSO) {
        pt(0, y, 'atlas-borda-v');
        pt(w, y, 'atlas-borda-v');
      }
    }
    // critico-desktop 15: a busca e os controles também são borda (o rótulo do mapa não nasce
    // cortado atrás deles: "Ex" por trás da busca, "VERDE" atrás dos botões). Do zoom do Brasil
    // em diante, fora da composição do Titã; o contorno de cada caixa vira obstáculo.
    if (m.getZoom() >= 2.5 && !this.naComposicao && w > 0 && h > 0) {
      const raiz = cv.closest('.atl') ?? m.getContainer();
      const c = cv.getBoundingClientRect();
      const pt = (x: number, y: number, img: string) => {
        if (x < 0 || y < 0 || x > w || y > h) return;
        const q = this.noChao(x, y);
        if (q) f.push({ type: 'Feature', geometry: { type: 'Point', coordinates: q }, properties: { img } });
      };
      for (const el of raiz.querySelectorAll('.atl-busca, .atl-controles')) {
        const r = el.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0) continue;
        const [x0, y0, x1, y1] = [r.left - c.left - 4, r.top - c.top - 4, r.right - c.left + 4, r.bottom - c.top + 4];
        for (let x = x0 + BORDA_PASSO / 2; x < x1 + BORDA_PASSO / 2; x += BORDA_PASSO) {
          pt(Math.min(x, x1), y0, 'atlas-borda-h');
          pt(Math.min(x, x1), y1, 'atlas-borda-h');
        }
        for (let y = y0 + BORDA_PASSO / 2; y < y1 + BORDA_PASSO / 2; y += BORDA_PASSO) {
          pt(x0, Math.min(y, y1), 'atlas-borda-v');
          pt(x1, Math.min(y, y1), 'atlas-borda-v');
        }
      }
    }
    const chave = f.length ? `${f.length}:${JSON.stringify(f[0].geometry.coordinates)}` : 'vazia';
    if (chave === this.bordaPosta) return;
    this.bordaPosta = chave;
    fonte.setData({ type: 'FeatureCollection', features: f });
  }

  /** O agregado que a usina `id` representa no zoom corrente (null: sozinha, vista de aula ou zoom 10+). */
  agregadoNoZoom(id: number, zoom = this.mapa.getZoom()): Agregado | null {
    if (this.estado.destaque?.deVista || !this.gen) return null;
    const b = faixaDoZoom(zoom);
    return b ? this.gen.agregadoDe(id, b) : null;
  }

  /** codigo.md 3: "Este símbolo, neste zoom" segue o zoom e o ano. A usina selecionada pelo
   *  símbolo somado tem a soma refeita na faixa de agora (câmera assentada, ano trocado); quando
   *  ela não soma mais ninguém, a soma sai da ficha. A página recebe a seleção com as props novas
   *  (mesma chave e mesmo ponto: nada voa). */
  private refazerAgregadoDaSelecao() {
    const s = this.estado.selecionado;
    if (!s || s.tipo !== 'usina' || !s.props || !('agregado' in s.props)) return;
    const pr = s.props as Record<string, unknown>;
    const u = this.usinas.find((x) => x.properties.ceg === pr.ceg);
    const id = typeof u?.id === 'number' ? u.id : null;
    let ag: Agregado | null = null;
    if (id != null) {
      const doDono = this.estado.capitulo === 'rede' && this.cegsDoDono?.has(String(pr.ceg));
      const b = faixaDoZoom(this.mapa.getZoom());
      ag = doDono ? (b && this.genDoDono ? this.genDoDono.agregadoDe(id, b) : null) : this.agregadoNoZoom(id);
    }
    const novo = ag ? resumoDoAgregado(ag) : undefined;
    if (JSON.stringify(novo ?? null) === JSON.stringify(pr.agregado ?? null)) return;
    const props = { ...pr };
    if (novo) props.agregado = novo;
    else delete props.agregado;
    this.ret.aoSelecionar({ ...s, props });
  }

  // ── câmera ─────────────────────────────────────────────────────────

  /** Retângulos (px do canvas) que a casca cobre sobre o mapa: busca, controles, atribuição,
   *  logotipo, ficha e cartão da vista. Medidos no DOM a cada escolha: nenhuma
   *  maquete nem o rótulo dela nasce sob eles. */
  private zonasDaCasca(): [number, number, number, number][] {
    const cv = this.mapa.getCanvas();
    const raiz = cv.closest('.atl') ?? this.mapa.getContainer();
    const c = cv.getBoundingClientRect();
    const zonas: [number, number, number, number][] = [];
    for (const el of raiz.querySelectorAll('.atl-busca, .atl-controles, .mapboxgl-ctrl-attrib, .mapboxgl-ctrl-logo, .atl-ficha, .atl-vista')) {
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) continue;
      const z: [number, number, number, number] = [r.left - c.left, r.top - c.top, r.right - c.left, r.bottom - c.top];
      if (z[2] <= 0 || z[3] <= 0 || z[0] >= c.width || z[1] >= c.height) continue;
      zonas.push(z);
    }
    return zonas;
  }

  /** Depois de uma seleção pelo mapa: se o ativo (com a maquete acima do pé e o rótulo abaixo)
   *  caiu sob a ficha, o cartão da vista ou a folha do celular, a câmera desliza até ele ficar
   *  na área livre. Não muda zoom, inclinação nem rumo. */
  manterVisivel(lngLat: [number, number], tipo?: TipoDeAtivo) {
    const m = this.mapa;
    if (!this.avisouPronto || m.isMoving()) return;
    const { left, right, top, bottom, w, h } = this.margensSeguras();
    const q = m.project(lngLat);
    // a maquete sobe até ~150 px acima do pé e o rótulo desce ~50 px abaixo: essa folga só vale
    // para o que pode ter maquete. Área, linha e país (o ponto é o do clique) só não podem cair
    // sob os painéis.
    const comMaquete = tipo === 'usina' || tipo === 'subestacao' || tipo === 'instalacao';
    const [acima, abaixo] = comMaquete ? [150, 50] : [20, 20];
    const livre = q.x >= left + 40 && q.x <= w - right - 40 && q.y >= top + acima && q.y <= h - bottom - abaixo;
    if (livre || w <= 0 || h <= 0) return;
    this.geracaoDaCamera++;
    m.easeTo({
      center: lngLat,
      offset: [(left - right) / 2, (top - bottom) / 2 + (comMaquete ? 50 : 0)],
      duration: this.estado.movimentoReduzido ? 0 : 600,
      essential: false,
      ...(this.temPadding() ? { padding: SEM_PADDING } : {}),
    });
  }

  /** Margens dos painéis em px, cortadas para caber na tela (painel maior que a tela
   *  não pode virar exceção do Mapbox nem enquadramento invertido). */
  private margensSeguras() {
    const cv = this.mapa.getCanvas();
    const w = cv.clientWidth;
    const h = cv.clientHeight;
    const mg = this.estado.margens;
    let left = Math.max(0, mg.esquerda + 24);
    let right = Math.max(0, mg.direita + 24);
    let top = Math.max(0, mg.topo + 24);
    let bottom = Math.max(0, mg.base + 24);
    // sobra ao menos 40% da largura e da altura para o alvo
    const cabeX = w * 0.6;
    const cabeY = h * 0.6;
    if (left + right > cabeX && left + right > 0) {
      const k = cabeX / (left + right);
      left *= k;
      right *= k;
    }
    if (top + bottom > cabeY && top + bottom > 0) {
      const k = cabeY / (top + bottom);
      top *= k;
      bottom *= k;
    }
    return { left, right, top, bottom, w, h };
  }

  /** O número do pedido de câmera mais novo (ver `geracaoDaCamera`). */
  geracao(): number {
    return this.geracaoDaCamera;
  }

  /** A câmera está num movimento (voo, deslize, gesto). */
  cameraEmMovimento(): boolean {
    return this.mapa.isMoving();
  }

  /** Um pedido novo começa: ganha o número seguinte e para o movimento anterior com os eventos
   *  do fim dele calados para quem mexeria na câmera (ver `parandoCamera`). */
  private novoPedidoDeCamera() {
    this.geracaoDaCamera++;
    this.parandoCamera = true;
    try {
      this.mapa.stop();
    } finally {
      this.parandoCamera = false;
    }
  }

  voarPara(alvo: CameraAlvo, seco = false, duracao = 1800) {
    const m = this.mapa;
    // pedido feito por quem ouviu o fim do voo que um pedido mais novo está parando agora (a
    // subida da gaveta, por exemplo): é mais velho que esse pedido e não vale
    if (this.parandoCamera) return;
    // pedido de câmera de fora: o gesto anterior do leitor deixa de valer (e o voo automático
    // da abertura, se ainda esperava, não vem mais por cima dele)
    this.cameraTocada = false;
    this.movidoPeloLeitor = false;
    this.cancelarVooDaAbertura();
    if (!this.avisouPronto) {
      // o mapa ainda não carregou: a câmera fica guardada e é aplicada no load
      this.geracaoDaCamera++;
      this.cameraPedida = alvo;
      return;
    }
    this.novoPedidoDeCamera();
    this.paddingDaRota = false;
    const semMovimento = seco || this.estado.movimentoReduzido;
    if (alvo.tita) {
      this.irAoTita(alvo.centro ?? CENTRO_DO_TITA, semMovimento, duracao);
      return;
    }
    this.naComposicao = false;
    // A margem NUNCA vai como `padding` a jumpTo/flyTo/easeTo: ali ela fica gravada no
    // transform e desloca (ou espreme) todo enquadramento seguinte. Para alvo com centro,
    // vira `offset`; para limites, entra só no cálculo de cameraForBounds. A única exceção é a
    // composição do Titã (irAoTita); saindo dela, todo voo leva o padding de volta a 0.
    const { left, right, top, bottom, w, h } = this.margensSeguras();
    const offset: [number, number] = [(left - right) / 2, (top - bottom) / 2];
    const comPadding = this.temPadding();
    const mover = (cam: { center: mapboxgl.LngLatLike; zoom: number; pitch: number; bearing: number }, desloca: boolean) => {
      const opcoes = { ...cam, offset: desloca ? offset : ([0, 0] as [number, number]), ...(comPadding ? { padding: SEM_PADDING } : {}) };
      // jumpTo não aceita offset: easeTo de duração zero é o salto equivalente
      if (semMovimento) m.easeTo({ ...opcoes, duration: 0 });
      else m.flyTo({ ...opcoes, duration: duracao, essential: false, curve: 1.3 });
    };
    try {
      if (alvo.limites) {
        const limites = alvo.limites;
        // o enquadramento é calculado como se o padding já fosse 0 (é onde o voo termina)
        const cam =
          w > 0 && h > 0
            ? this.semPaddingDoTita(() =>
                m.cameraForBounds(
                  [
                    [limites[0], limites[1]],
                    [limites[2], limites[3]],
                  ],
                  { padding: { left, right, top, bottom }, pitch: alvo.inclinacao ?? 0, bearing: alvo.rumo ?? 0, maxZoom: 15 },
                ),
              )
            : undefined;
        if (!cam || !Number.isFinite(cam.zoom)) return;
        const pitch = alvo.inclinacao ?? 0;
        const bearing = alvo.rumo ?? 0;
        // Em globo (resultado abaixo do zoom 5,5) o Mapbox 3.0.1 resolve sem ler o padding:
        // desconta-se aqui a área ocupada pelos painéis (zoom) e desloca-se o centro para a livre.
        if (cam.zoom < 5.5) {
          const fracao = Math.min((w - left - right) / w, (h - top - bottom) / h);
          const zoom = fracao > 0 && fracao < 1 ? cam.zoom + Math.log2(fracao) : cam.zoom;
          mover({ center: cam.center, zoom, pitch, bearing }, true);
        } else mover({ center: cam.center, zoom: cam.zoom, pitch, bearing }, false);
        return;
      }
      mover(
        {
          center: alvo.centro ?? ([m.getCenter().lng, m.getCenter().lat] as [number, number]),
          zoom: alvo.zoom ?? m.getZoom(),
          pitch: alvo.inclinacao ?? 0,
          bearing: alvo.rumo ?? 0,
        },
        // exato (o ?cam= do endereço grava o centro real): sem o deslocamento das margens
        !alvo.exato,
      );
    } catch (erro) {
      // enquadramento impossível (tela de tamanho zero, por exemplo): a câmera fica onde está
      console.warn('[atlas] câmera:', erro);
    }
  }

  /** Movimento pedido por botão da interface (aproximar, inclinar, norte): conta como
   *  gesto do leitor, para o pouso inicial não desfazê-lo. */
  moverPorBotao(opcoes: mapboxgl.EaseToOptions) {
    if (this.parandoCamera) return;
    this.novoPedidoDeCamera();
    // os botões ("+", "−", norte, inclinar) mexem a partir de onde a câmera está: o padding da rota
    // fica (o disco segue na área livre ao lado da ficha)
    this.cameraTocada = true;
    this.movidoPeloLeitor = true;
    this.cancelarVooDaAbertura();
    this.naComposicao = false;
    // saindo da escala do Titã (aproximar além dela, inclinar), o padding da composição sai junto
    const z = opcoes.zoom ?? this.mapa.getZoom();
    const sai = !this.tita || z > this.tita.zoom + ZOOM_DE_SAIDA_DO_TITA || (opcoes.pitch ?? 0) > 0;
    this.mapa.easeTo(sai && this.temPadding() && !this.paddingDaRota ? { ...opcoes, padding: SEM_PADDING } : opcoes);
  }

  /** O botão "Inclinar". A1.4: na escala do Titã, inclinar o globo inteiro com o padding da
   *  composição saindo junto afundava o globo na tela no meio da transição; ali o botão leva ao
   *  Brasil já inclinado (um voo só, padding a 0). Fora dela, alterna 0° ↔ 55° como sempre. */
  inclinarPorBotao() {
    const m = this.mapa;
    const t = this.tita;
    if (t && m.getPitch() <= 10 && m.getZoom() <= t.zoom + ZOOM_DE_SAIDA_DO_TITA) {
      this.voarPara({ limites: BRASIL, inclinacao: 50 }, false, 2200);
      this.cameraTocada = true;
      return;
    }
    this.moverPorBotao({ pitch: m.getPitch() > 10 ? 0 : 55, duration: 600 });
  }

  // ── o Titã (frontispício) ──────────────────────────────────────────

  private temPadding(): boolean {
    const p = this.mapa.getPadding();
    return p.top !== 0 || p.bottom !== 0 || p.left !== 0 || p.right !== 0;
  }

  /** Roda `f` com o padding do transform zerado e o devolve (síncrono: nenhum quadro é
   *  desenhado no meio). Para contas de enquadramento que devem valer para o padding 0. */
  private semPaddingDoTita<T>(f: () => T): T {
    const tr = (this.mapa as unknown as { transform: { padding: typeof SEM_PADDING } }).transform;
    const antes = tr.padding;
    if (!this.temPadding()) return f();
    tr.padding = SEM_PADDING;
    try {
      return f();
    } finally {
      tr.padding = antes;
    }
  }

  private cancelarVooDaAbertura() {
    if (this.vooDaAbertura == null) return;
    window.clearTimeout(this.vooDaAbertura);
    this.vooDaAbertura = null;
  }

  /** A composição do Titã para a tela de agora: o globo inteiro em cima, o pedestal embaixo,
   *  entre o fundo da busca e o pé do palco (no celular, o topo do puxador da gaveta). O raio
   *  sai da altura útil (3,41 raios da composição) e, no estreito, da largura; o centro do
   *  globo vai para a tela pelo padding (em globo o `offset` gira o globo em vez de deslocá-lo);
   *  o zoom é o que dá aquele raio, achado num clone do transform (a câmera não se mexe). */
  private comporTita(): { zoom: number; padding: typeof SEM_PADDING; r: number; opacidade: number } | null {
    const m = this.mapa;
    const cv = m.getCanvas();
    const w = cv.clientWidth;
    const h = cv.clientHeight;
    if (w <= 0 || h <= 0) return null;
    const c = cv.getBoundingClientRect();
    const raiz = cv.closest('.atl') ?? m.getContainer();
    const estreito = window.innerWidth <= 860;
    const busca = raiz.querySelector('.atl-busca')?.getBoundingClientRect();
    const puxador = estreito ? raiz.querySelector('.atl-puxador')?.getBoundingClientRect() : undefined;
    const topo = Math.max(0, busca && busca.height > 0 && busca.top - c.top < h / 3 ? busca.bottom - c.top : 0) + (estreito ? 8 : 14);
    // no celular o pedestal chega perto das bordas: fica acima do logotipo do Mapbox também
    const logo = estreito ? raiz.querySelector('.mapboxgl-ctrl-logo')?.getBoundingClientRect() : undefined;
    const pisos = [puxador, logo].filter((r): r is DOMRect => !!r && r.height > 0 && r.top - c.top > h / 2).map((r) => r.top - c.top);
    let base = pisos.length ? Math.min(h, ...pisos) - 6 : h - 8;
    // no celular, a ficha aberta é a folha de baixo: a composição sobe para a área acima dela
    // (medida no DOM: a margem de base do estado não é a altura da folha sobre o canvas)
    const mg = this.estado.margens;
    const folha = estreito ? raiz.querySelector('.atl-ficha')?.getBoundingClientRect() : undefined;
    if (folha && folha.height > 0 && folha.top - c.top > h * 0.25 && folha.top - c.top < h) base = Math.min(base, folha.top - c.top - 6);
    const util = base - topo;
    if (util <= 40) return null;
    // A1.2: na horizontal, a área livre entre os painéis que cobrem o mapa (a ficha aberta à
    // direita, a coluna à esquerda quando ela cobre o canvas). A figura vai de −0,74 r a +0,75 r
    // do centro e as mãos abrem o diâmetro do globo: cabe com 2 r + 16 px de cada lado.
    // No celular a ficha é a folha de baixo e os controles ficam no pé: a largura inteira vale.
    // Enquanto a figura centrada cabe na área livre (os controles do canto não a tocam), ela fica
    // no centro do canvas, como sempre; só quando um painel a cortaria ela vai ao centro da área
    // livre, no raio que couber.
    const x0 = estreito ? 0 : Math.max(0, Math.min(w * 0.6, mg.esquerda));
    const x1 = estreito ? w : Math.max(x0 + 1, w - Math.max(0, Math.min(w * 0.6, mg.direita)));
    const livre = x1 - x0;
    const rIdeal = Math.min(util / ALTURA_DO_TITA_EM_RAIOS, estreito ? (w - 32) / 2 : w * 0.4);
    const cabeNoCentro = w / 2 - rIdeal - 16 >= x0 && w / 2 + rIdeal + 16 <= x1;
    let r = cabeNoCentro ? rIdeal : Math.min(rIdeal, (livre - 32) / 2);
    // a composição centrada na altura útil e na largura livre
    let cy = topo + (util - r * ALTURA_DO_TITA_EM_RAIOS) / 2 + r;
    let opacidade = 1;
    // se a área livre não comporta a figura com um raio razoável, a gravura esmaece e o globo
    // sozinho ocupa a área livre (sem o pedestal embaixo)
    if (r < RAIO_MINIMO_DO_TITA) {
      opacidade = 0;
      r = Math.min((util - 16) / 2, (livre - 32) / 2, estreito ? (w - 32) / 2 : w * 0.4);
      cy = topo + util / 2;
    }
    if (!(r > 20)) return null;
    const cx = cabeNoCentro ? w / 2 : (x0 + x1) / 2;
    const padding = {
      top: Math.max(0, Math.round(2 * cy - h)),
      bottom: Math.max(0, Math.round(h - 2 * cy)),
      left: Math.max(0, Math.round(2 * cx - w)),
      right: Math.max(0, Math.round(w - 2 * cx)),
    };
    type Tr = { clone(): Tr; padding: typeof SEM_PADDING; zoom: number; minZoom: number; pitch: number; bearing: number; center: mapboxgl.LngLat; locationPoint3D(l: mapboxgl.LngLat): { x: number; y: number } };
    try {
      const tr = (m as unknown as { transform: Tr }).transform.clone();
      tr.minZoom = 0;
      tr.pitch = 0;
      tr.bearing = 0;
      tr.padding = padding;
      tr.center = new mapboxgl.LngLat(CENTRO_DO_TITA[0], CENTRO_DO_TITA[1]);
      let z = 1.2;
      for (let i = 0; i < 8; i++) {
        tr.zoom = z;
        const raio = raioDoGlobo((l) => tr.locationPoint3D(l), tr.center, 0);
        if (!(raio > 0)) return null;
        const dz = Math.log2(r / raio);
        z = Math.max(0, Math.min(4, z + dz));
        if (Math.abs(dz) < 0.0005) break;
      }
      return { zoom: z, padding, r, opacidade };
    } catch {
      return null;
    }
  }

  /** Vai à composição do Titã com o globo centrado em `centro`. */
  private irAoTita(centro: [number, number], seco: boolean, duracao: number, como: 'voo' | 'ease' = 'voo') {
    const t = this.tita ?? this.comporTita();
    if (!t) {
      // tela sem medida (tamanho zero): o globo inteiro, sem a gravura
      this.voarPara({ centro, zoom: 1.6, exato: true }, seco, duracao);
      return;
    }
    this.tita = t;
    this.movidoPeloLeitor = false;
    const cam = { center: centro, zoom: t.zoom, pitch: 0, bearing: 0, padding: t.padding };
    if (seco) this.mapa.easeTo({ ...cam, duration: 0 });
    // assentar e deslizar (A1.2, A1.3): curto e sem o arco do flyTo
    else if (como === 'ease') this.mapa.easeTo({ ...cam, duration: duracao, essential: false });
    else this.mapa.flyTo({ ...cam, duration: duracao, essential: false, curve: 1.3 });
    this.naComposicao = true;
  }

  /** Depois de aproximar (ou inclinar) à mão além da escala do Titã: o padding da composição
   *  volta a 0, para todo o resto do Atlas (enquadramento, ?cam, maquetes) valer como sempre. */
  private soltarPaddingDoTita() {
    // o zoomend/pitchend de um voo que um pedido novo está parando não começa movimento
    if (this.parandoCamera) return;
    // o padding é o do enquadramento da rota do comércio (ficha aberta), não o do Titã
    if (this.paddingDaRota) return;
    if (!this.tita || this.mapa.isMoving() || !this.temPadding()) return;
    if (this.mapa.getZoom() <= this.tita.zoom + ZOOM_DE_SAIDA_DO_TITA && this.mapa.getPitch() <= 8) return;
    this.naComposicao = false;
    this.mapa.easeTo({ padding: SEM_PADDING, duration: this.estado.movimentoReduzido ? 0 : 500, essential: false });
  }

  /** A1.3: afastado à mão (ou pelo botão "−") até a escala do Titã, a câmera parada assenta na
   *  composição (zoom de repouso e margens) em ~500 ms, no centro em que o leitor a deixou.
   *  Movimento reduzido: seco. "O comércio" não tem o Titã: fica onde está. */
  private assentarNoTita() {
    if (this.assentoPendente != null) window.clearTimeout(this.assentoPendente);
    if (this.parandoCamera) return;
    const geracao = this.geracaoDaCamera;
    this.assentoPendente = window.setTimeout(() => {
      this.assentoPendente = null;
      const t = this.tita;
      const m = this.mapa;
      if (this.destruido || !t || !this.movidoPeloLeitor || this.naComposicao || m.isMoving() || geracao !== this.geracaoDaCamera) return;
      if (this.estado.capitulo === 'comercio' || m.getPitch() > 8 || m.getZoom() > t.zoom + ZOOM_DE_ASSENTAR_NO_TITA) return;
      const c = m.getCenter();
      this.irAoTita([c.lng, c.lat], this.estado.movimentoReduzido, 500, 'ease');
    }, 140);
  }
  private assentoPendente: number | null = null;
  /** o último movimento da câmera veio do leitor (gesto ou botão), não de um voo pedido */
  private movidoPeloLeitor = false;

  /** A1.2: a área livre mudou (a ficha abriu ou fechou, a tela mudou): a composição é medida de
   *  novo e, parada nela, a câmera desliza para o centro novo (seco no movimento reduzido). */
  private recomporTita() {
    const novo = this.comporTita();
    if (!novo) return;
    const antes = this.tita;
    this.tita = novo;
    this.mapa.setMinZoom(Math.min(0.9, novo.zoom - 0.1));
    if (!antes || Math.abs(antes.zoom - novo.zoom) > 0.01) this.aplicarRampaDoTita();
    if (!this.naComposicao || this.mapa.isMoving() || !this.avisouPronto) {
      this.avisarGlobo();
      return;
    }
    const p = this.mapa.getPadding();
    const igual =
      Math.abs(this.mapa.getZoom() - novo.zoom) < 0.005 &&
      Math.abs(p.left - novo.padding.left) < 2 &&
      Math.abs(p.right - novo.padding.right) < 2 &&
      Math.abs(p.top - novo.padding.top) < 2 &&
      Math.abs(p.bottom - novo.padding.bottom) < 2;
    if (igual) {
      this.avisarGlobo();
      return;
    }
    const c = this.mapa.getCenter();
    this.irAoTita([c.lng, c.lat], this.estado.movimentoReduzido, 500, 'ease');
  }

  /** A1.1: opacidade dos símbolos da rede em rampa a partir do zoom de repouso da composição.
   *  Cada camada guarda a opacidade "de longe" que aplicar() pôs; aqui só se multiplica pela
   *  rampa, num `interpolate` de zoom no topo da expressão (o Mapbox só aceita ['zoom'] ali). */
  private rampaPosta = '';
  private aplicarRampaDoTita() {
    if (!this.montado) return;
    const t = this.tita;
    const chave = t ? t.zoom.toFixed(3) : 'sem';
    if (chave === this.rampaPosta) return;
    this.rampaPosta = chave;
    // o resto vem no próximo aplicar(): as camadas leem rampaDaRede()
    this.aplicar();
  }

  /** Os dois degraus da rampa da rede ([zoom 0, zoom 1]) para a composição corrente; null sem Titã. */
  private degrausDaRampa(): [number, number] | null {
    const t = this.tita;
    if (!t) return null;
    return [t.zoom + RAMPA_DA_REDE_NO_TITA[0], t.zoom + RAMPA_DA_REDE_NO_TITA[1]];
  }

  /** `v` (valor ou expressão SEM ['zoom']) multiplicado pela rampa da rede; `depois` são pares
   *  [zoom, valor] que seguem a rampa (todos acima dela). Sem Titã medido: `v` puro, ou o
   *  interpolate dos pares. */
  private comRampa(v: unknown, depois: [number, unknown][] = [], inicio: unknown = 0): unknown {
    const d = this.degrausDaRampa();
    const pares: [number, unknown][] = d ? [[d[0], inicio], [d[1], v], ...depois.filter(([z]) => z > d[1] + 0.01)] : depois.length ? [[0, v], ...depois] : [];
    if (!pares.length) return v;
    if (pares.length === 1) return pares[0][1];
    const e: unknown[] = ['interpolate', ['linear'], ['zoom']];
    for (const [z, val] of pares) e.push(z, val);
    return e;
  }

  /** O globo na tela agora, ou null quando a gravura não aparece (longe da escala do Titã,
   *  inclinado, ou sem composição medida). ~30 `project` por chamada (busca do limbo). */
  globoNaTela(): GloboNaTela | null {
    const t = this.tita;
    // antes do load o globo ainda não foi desenhado: o Titã não segura o vazio
    if (!t || !this.avisouPronto) return null;
    const m = this.mapa;
    const zoom = m.getZoom();
    const inclinacao = m.getPitch();
    if (zoom > t.zoom + ZOOM_DE_SAIDA_DO_TITA || inclinacao > 8) return null;
    const c = m.getCenter();
    const q = m.project(c);
    const r = raioDoGlobo((l) => m.project(l), c, m.getBearing());
    if (!(r > 0)) return null;
    return { cx: q.x, cy: q.y, r, zoom, inclinacao, zRepouso: t.zoom, opacidade: t.opacidade };
  }

  /** Assina o globo na tela (a gravura do Titã): chamado a cada quadro de movimento. */
  seguirGlobo(f: (g: GloboNaTela | null) => void): () => void {
    this.seguidores.add(f);
    f(this.globoNaTela());
    return () => {
      this.seguidores.delete(f);
    };
  }

  private avisarGlobo() {
    if (!this.seguidores.size) return;
    const g = this.globoNaTela();
    if (!g && !this.globoAvisado) return;
    this.globoAvisado = g;
    for (const f of this.seguidores) f(g);
  }

  /** Enquadra o ativo selecionado (linha, área) ou aproxima do ponto. */
  enquadrar(sel: AtivoSelecionado) {
    // um enquadramento novo descarta o pedido pendente de outra distribuidora
    this.enquadrarAoChegar = null;
    const g = this.geometriaDe(sel);
    if (!g) {
      // a área da distribuidora pedida pela busca antes de o arquivo chegar: enquadra na chegada
      if (sel.tipo === 'distribuidora') this.enquadrarAoChegar = sel;
      return;
    }
    if (g.type === 'Point') {
      // usina, subestação e instalação pousam no nível regional das maquetes (11): em 9,5 a
      // maquete do destino ainda crescia do chão (troca 2D → 3D de 9,4 a 9,8)
      const comMaquete = sel.tipo === 'usina' || sel.tipo === 'instalacao' || sel.tipo === 'subestacao';
      // o ponto do comércio (gás em Corumbá) é lido na escala do continente, não da rua
      // (com teto: vindo de outra seleção já aproximada, o zoom ~11 dela não fica)
      // a entidade do dia real (usina ou conjunto do ONS) também: escala do estado, sem maquete
      const zoom = sel.tipo === 'comercio' ? Math.min(Math.max(this.mapa.getZoom(), 4.5), 6) : sel.tipo === 'operacao' ? Math.min(Math.max(this.mapa.getZoom(), 5.5), 7) : Math.max(this.mapa.getZoom(), comMaquete ? 11 : sel.tipo === 'reservatorio' ? 9.5 : 8);
      this.voarPara({ centro: [g.coordinates[0], g.coordinates[1]], zoom });
    } else if (sel.tipo === 'comercio' && (g.type === 'LineString' || g.type === 'MultiLineString')) {
      // leva 5: a rota do comércio enquadra pelo globo (centro no meio do comprimento, zoom pela
      // abertura angular), não pela caixa lon/lat (a caixa de Óleo diesel ← Rússia punha o centro
      // perto da Arábia e a rota no limbo do disco)
      const pts = (g.type === 'LineString' ? g.coordinates : g.coordinates.flat()) as [number, number][];
      const cam = this.cameraDaRota(pts);
      if (cam) this.voarComPaddingDaRota(cam);
      else this.voarPara({ limites: limitesDe(g) });
    } else {
      this.voarPara({ limites: limitesDe(g) });
    }
  }

  /** O voo do enquadramento da rota, com o padding que põe o disco na área livre. É um pedido de
   *  câmera como o de voarPara (mesma geração, mesmo cancelamento); o padding fica enquanto a
   *  ficha da rota está aberta (soltarPaddingDoTita não o tira) e sai ao fechar a ficha ou no
   *  próximo pedido (todo voo leva o padding a 0). */
  private voarComPaddingDaRota(cam: { centro: [number, number]; zoom: number; padding: typeof SEM_PADDING }) {
    if (this.parandoCamera || !this.avisouPronto) return;
    this.cameraTocada = false;
    this.movidoPeloLeitor = false;
    this.cancelarVooDaAbertura();
    this.novoPedidoDeCamera();
    this.naComposicao = false;
    this.paddingDaRota = true;
    const opcoes = { center: cam.centro, zoom: cam.zoom, pitch: 0, bearing: 0, padding: cam.padding };
    if (this.estado.movimentoReduzido) this.mapa.easeTo({ ...opcoes, duration: 0 });
    else this.mapa.flyTo({ ...opcoes, duration: 1800, essential: false, curve: 1.3 });
  }
  /** o padding do transform é o do enquadramento da rota do comércio (ver voarComPaddingDaRota) */
  private paddingDaRota = false;

  /** Leva 5 (comércio, enquadrar): a câmera que põe a rota inteira (origem e destino) na área
   *  livre do mapa, sem inclinação. Centro no ponto do meio da rota pelo comprimento (arco de
   *  círculo máximo, não a caixa lon/lat; com candidatos um pouco para cada lado quando a casca
   *  cobre o meio); zoom: o maior em que todas as amostras da rota (a cada ~1,5° de arco) caem a
   *  menos de 65° do centro (fora do limbo; medido: a 77° Paranaguá já ficava espremida na borda
   *  do disco a z1,95) e na área livre, menos 0,15 de folga. A área livre é a tela menos a casca
   *  medida no DOM (ficha, busca, controles, atribuição) e, no celular, tudo abaixo do topo da
   *  folha. O globo não anda de lado (o centro com deslocamento só o gira): o disco vai para a
   *  área livre pelo padding devolvido. Quando a rota inteira não cabe, mostra a ponta brasileira
   *  e o meio da rota; null quando nem isso cabe (o chamador cai na caixa). */
  private cameraDaRota(pts: [number, number][]): { centro: [number, number]; zoom: number; padding: typeof SEM_PADDING } | null {
    const m = this.mapa;
    if (pts.length < 2) return null;
    const cv = m.getCanvas();
    const w = cv.clientWidth;
    const h = cv.clientHeight;
    if (w <= 0 || h <= 0) return null;
    const RAD = Math.PI / 180;
    const vet = ([lo, la]: [number, number]) => [Math.cos(la * RAD) * Math.cos(lo * RAD), Math.cos(la * RAD) * Math.sin(lo * RAD), Math.sin(la * RAD)];
    const ang = (a: number[], b: number[]) => Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])));
    const lonlat = (v: number[]): [number, number] => {
      const n = Math.hypot(v[0], v[1], v[2]) || 1;
      return [Math.atan2(v[1], v[0]) / RAD, Math.asin(v[2] / n) / RAD];
    };
    // a ponta brasileira primeiro (a mais perto do centro do Brasil)
    const BR = vet([-50, -14]);
    let linha = pts;
    if (ang(vet(pts[pts.length - 1]), BR) < ang(vet(pts[0]), BR)) linha = [...pts].reverse();
    const vs = linha.map(vet);
    const acum = [0];
    for (let i = 1; i < vs.length; i++) acum.push(acum[i - 1] + ang(vs[i - 1], vs[i]));
    const total = acum[acum.length - 1];
    /** o ponto da rota a uma fração t do comprimento (interpolação no arco do trecho) */
    const noComprimento = (t: number): number[] => {
      const alvo = t * total;
      let i = 1;
      while (i < acum.length - 1 && acum[i] < alvo) i++;
      const a = vs[i - 1];
      const b = vs[i];
      const seg = acum[i] - acum[i - 1];
      const f = seg > 0 ? (alvo - acum[i - 1]) / seg : 0;
      return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
    };
    /** amostras de 0 a `ate` do comprimento, a cada ~1,5° de arco, com as pontas */
    const amostrar = (ate: number) => {
      const n = Math.max(8, Math.ceil((total * ate) / (1.5 * RAD)));
      const out: number[][] = [];
      for (let k = 0; k <= n; k++) out.push(noComprimento((k / n) * ate));
      return out;
    };
    // a área livre: a tela menos o que a cobre de fato, medido no DOM (a ficha, a busca, os
    // controles, a atribuição). No desktop a ficha é um cartão no canto: abaixo dele o mapa é
    // livre (a margem direita de 460 px do estado tomava a coluna inteira e, como o globo não
    // anda de lado, só gira, empurrava a rota para o limbo). No celular a ficha é a folha de baixo.
    const c = cv.getBoundingClientRect();
    // folga de 40 px na borda da tela e de 20 px em volta da casca: a ponta da rota não encosta
    const x0 = 40;
    const x1 = w - 40;
    const y0 = 40;
    const y1 = h - 40;
    const obstaculos = this.zonasDaCasca().map(([a, b, d, e]) => [a - 20, b - 20, d + 20, e + 20] as const);
    // no celular, tudo abaixo do topo da ficha é obstáculo (o fundo da folha passa da tela)
    const ficha = (cv.closest('.atl') ?? m.getContainer()).querySelector('.atl-ficha')?.getBoundingClientRect();
    const piso = ficha && window.innerWidth <= 860 && ficha.height > 0 && ficha.top - c.top > h * 0.2 && ficha.top - c.top < h ? ficha.top - c.top - 16 : y1;
    const livre = (q: { x: number; y: number }) => q.x >= x0 && q.x <= x1 && q.y >= y0 && q.y <= Math.min(y1, piso) && !obstaculos.some(([a, b, d, e]) => q.x >= a && q.x <= d && q.y >= b && q.y <= e);
    type P = { x: number; y: number };
    type Tr = { clone(): Tr; padding: typeof SEM_PADDING; zoom: number; minZoom: number; pitch: number; bearing: number; center: mapboxgl.LngLat; locationPoint3D(l: mapboxgl.LngLat): P };
    let tr: Tr;
    try {
      tr = (m as unknown as { transform: Tr }).transform.clone();
    } catch {
      return null;
    }
    tr.minZoom = 0;
    tr.pitch = 0;
    tr.bearing = 0;
    // o globo não anda de lado (o centro com deslocamento só o gira): quem leva o disco para a
    // área livre é o padding, como na composição do Titã. No desktop, o disco vai para o meio da
    // faixa à esquerda da ficha; no celular, para o meio da faixa acima da folha.
    const fichaNoCanvas = ficha && ficha.width > 0 && ficha.height > 0 ? { l: ficha.left - c.left, t: ficha.top - c.top } : null;
    const padding = { ...SEM_PADDING };
    if (fichaNoCanvas && window.innerWidth <= 860 && piso < y1) padding.bottom = Math.max(0, Math.round(h - piso));
    else if (fichaNoCanvas && window.innerWidth > 860 && fichaNoCanvas.l > w * 0.3 && fichaNoCanvas.l < w) padding.right = Math.max(0, Math.round(w - fichaNoCanvas.l + 16));
    tr.padding = padding;
    const zMin = Math.max(0.3, m.getMinZoom());
    /** todas as amostras na face visível (a menos de 65° do centro: fora do limbo; medido, a 77°
     *  Paranaguá já ficava espremida na borda do disco a z1,95) e na área livre */
    const cabe = (ctr: number[], amostras: number[][]): boolean => {
      for (const v of amostras) {
        if (ang(v, ctr) > 65 * RAD) return false;
        const ll = lonlat(v);
        const q = tr.locationPoint3D(new mapboxgl.LngLat(ll[0], ll[1]));
        if (!Number.isFinite(q.x) || !Number.isFinite(q.y) || !livre(q)) return false;
      }
      return true;
    };
    /** o maior zoom em que a rota cabe com o centro em `ctr` (null: em nenhum) */
    const maiorZoom = (ctr: number[], amostras: number[][]): number | null => {
      tr.center = new mapboxgl.LngLat(...lonlat(ctr));
      for (let z = 6; z >= zMin - 1e-9; z -= 0.05) {
        tr.zoom = z;
        tr.center = new mapboxgl.LngLat(...lonlat(ctr));
        if (cabe(ctr, amostras)) return z;
      }
      return null;
    };
    /** o centro candidato (frações do comprimento, a primeira é a preferida) que dá o maior zoom;
     *  empate a menos de 0,1 de zoom fica com o preferido */
    const tentar = (fracoes: number[], amostras: number[][]): { centro: [number, number]; zoom: number; padding: typeof SEM_PADDING } | null => {
      let melhor: { centro: [number, number]; zoom: number; padding: typeof SEM_PADDING } | null = null;
      for (const t of fracoes) {
        const ctr = noComprimento(t);
        const z = maiorZoom(ctr, amostras);
        // o zoom achado encosta a rota na borda da área livre: recua um pouco (afastar só aproxima
        // a rota do centro do disco, que já está na área livre)
        if (z != null && (!melhor || z - 0.15 > melhor.zoom + 0.1)) melhor = { centro: lonlat(ctr), zoom: Math.max(zMin, z - 0.15), padding };
      }
      return melhor;
    };
    // a rota inteira, com o centro no meio dela (ou um pouco para um lado, quando a ficha ou a
    // busca cobrem o meio); se não couber, a ponta brasileira e o meio da rota
    return tentar([0.5, 0.45, 0.55, 0.4, 0.6, 0.35, 0.65], amostrar(1)) ?? tentar([0.25, 0.2, 0.3, 0.15, 0.35], amostrar(0.5));
  }

  /** Liga o relevo em 3D (exagero leve) — só quando a vista inclina a câmera. */
  relevo3d(ligar: boolean) {
    // guardado antes do teste: pedido feito antes da montagem (ou durante a troca de
    // modo) é aplicado no fim de montar()
    this.relevoLigado = ligar;
    if (!this.montado) return;
    this.mapa.setTerrain(ligar ? { source: 'relevo', exaggeration: 1.5 } : null);
  }

  redimensionar() {
    this.memoria.limpar();
    this.mapa.resize();
  }

  /** Quantas feições de cada camada estão desenhadas agora (para a verificação de render). */
  contarDesenhadas(): Record<string, number> {
    const saida: Record<string, number> = {};
    if (!this.montado) return saida;
    const cv = this.mapa.getCanvas();
    const tela: [mapboxgl.PointLike, mapboxgl.PointLike] = [
      [0, 0],
      [cv.clientWidth, cv.clientHeight],
    ];
    // No globo, em zoom baixo, a consulta pela tela inteira volta vazia para linha e
    // área mesmo com a camada desenhada (medido: 0 feições com a malha na tela). Quando
    // isso acontece, a contagem cai para uma grade de consultas pequenas, que respondem.
    const porGrade = (camada: string): number => {
      const vistas = new Set<string>();
      const passo = 32;
      for (let x = passo / 2; x < cv.clientWidth; x += passo) {
        for (let y = passo / 2; y < cv.clientHeight; y += passo) {
          const caixa: [mapboxgl.PointLike, mapboxgl.PointLike] = [
            [x - 5, y - 5],
            [x + 5, y + 5],
          ];
          for (const f of this.mapa.queryRenderedFeatures(caixa, { layers: [camada] })) vistas.add(String(f.id ?? f.properties?.id ?? f.properties?.n ?? JSON.stringify(f.properties).slice(0, 96)));
        }
      }
      return vistas.size;
    };
    for (const camada of [
      'usinas',
      'usinas-selo',
      'usinas-futuras',
      'linhas',
      'linhas-sub',
      'linhas-cc',
      'linhas-previstas',
      'subestacoes',
      'reservatorios',
      'submercados-area',
      'bacias-area',
      'paises-area',
      // combustível (ANP)
      'gasodutos',
      'combustivel-instalacoes',
      'combustivel-rotulo',
      'campos-area',
      'blocos-area',
      'bacias-sed-area',
      'presal-fio',
      'destaque-ponto',
      'destaque-linha',
      'destaque-area',
      // comércio (MDIC/Comex Stat · ONS)
      'comercio-rota-mar',
      'comercio-rota-ar',
      'comercio-veiculo',
      'comercio-terra',
      // B1, B2
      'usinas-sem-ano',
      'linhas-sem-ano',
      'dono',
      // dia real (ONS)
      ...this.pulso.alvos(),
    ]) {
      const c = this.mapa.getLayer(camada);
      if (!c || this.mapa.getLayoutProperty(camada, 'visibility') === 'none') continue;
      const n = this.mapa.queryRenderedFeatures(tela, { layers: [camada] }).length;
      // (no globo, a consulta da tela inteira também volta vazia para círculo: o pulso do dia real
      // é círculo; a grade responde, e só é chamada quando a tela inteira devolve 0)
      saida[camada] = n > 0 || ((c.type === 'circle' || c.type === 'symbol') && !camada.startsWith('pulso-')) ? n : porGrade(camada);
    }
    saida['base-mar'] = this.mapa.queryRenderedFeatures(tela, { layers: ['base-mar'] }).length;
    if (this.svgDasTrocas) saida.fluxos = this.svgDasTrocas.querySelectorAll('.atl-fluxo').length;
    saida.discos = Object.keys(this.marcadoresDoDia).length;
    return saida;
  }

  // ── medição da colocação das maquetes (só leitura; window.__atlas em desenvolvimento) ──

  /** Os itens da escolha corrente, com a caixa de tela medida na geometria desenhada
   *  (camada3d.caixasDeTela; null quando o item não tem modelo desenhado agora) e o ponto do
   *  cadastro projetado por map.project. */
  depurarMaquetes(): MedidaDasMaquetes {
    const m = this.mapa;
    const cv = m.getCanvas();
    const largura = cv.clientWidth;
    const altura = cv.clientHeight;
    const zoom = m.getZoom();
    const satelite = this.estado.camadas.has('satelite');
    const ligadas = m.getLayer('maquetes') ? m.getLayoutProperty('maquetes', 'visibility') !== 'none' : false;
    // escala local (px por metro) pela projeção de dois pares de pontos a 100 m no chão
    const k = (lon: number, lat: number): number => {
      const dLat = 50 / 110_574;
      const dLon = 50 / (111_320 * Math.cos((lat * Math.PI) / 180));
      const e0 = m.project([lon - dLon, lat]);
      const e1 = m.project([lon + dLon, lat]);
      const n0 = m.project([lon, lat - dLat]);
      const n1 = m.project([lon, lat + dLat]);
      const ex = Math.hypot(e1.x - e0.x, e1.y - e0.y) / 100;
      const ny = Math.hypot(n1.x - n0.x, n1.y - n0.y) / 100;
      return Math.sqrt(ex * ny);
    };
    const centro = m.getCenter();
    const kCentro = k(centro.lng, centro.lat);
    const caixas = new Map((this.maquetes?.caixasDeTela() ?? []).map((c) => [c.ponto, c]));
    const itens: ItemDeMaquete[] = this.escolha.pontos.map((p) => {
      const c = caixas.get(p);
      const q = m.project([p.lon, p.lat]);
      const kp = k(p.lon, p.lat);
      return {
        id: p.id,
        tipo: p.tipo,
        familia: p.familia,
        nome: p.nome,
        mw: p.mw,
        lon: p.lon,
        lat: p.lat,
        arquivo: c?.arquivo ?? MODELOS[p.tipo].arquivo,
        L: p.L,
        Llei: p.Llei,
        pe: [q.x, q.y],
        peDesenhado: c?.pe ?? null,
        caixaMedida: c?.caixa ?? null,
        caixaJusta: c?.caixaJusta ?? null,
        k: kp,
        zEfMedido: kCentro > 0 && kp > 0 ? zoom + Math.log2(kp / kCentro) : zoom,
        mwConjunto: p.mwConjunto ?? undefined,
        membros: p.membros.map((x) => x.id),
        nivel: p.nivel,
        zEf: p.zEf,
        prio: p.prio,
        forcado: p.forcado,
        histerese: p.histerese,
        caixa: p.caixa,
        escalaVertical: c?.vertical ?? 0,
        deCima: p.deCima,
        rotorGira: p.rotorGira && !!c,
        desenhado3d: !!c,
        linha: p.linha,
        rotulo: p.rotulo ? { linha2: p.rotulo.linha2, mostrar: p.rotulo.mostrar, caixa: p.rotulo.caixa } : null,
      };
    });
    const porFamilia: Record<string, number> = { usina: 0, rede: 0, anp: 0, torre: 0 };
    const porTipo: Record<string, number> = {};
    for (const it of itens) {
      porFamilia[it.familia]++;
      porTipo[it.tipo] = (porTipo[it.tipo] ?? 0) + 1;
    }
    const r = this.escolha.resumo;
    const tempos = this.temposDaEscolha;
    return {
      itens,
      resumo: {
        centro: [centro.lng, centro.lat],
        zoom,
        inclinacao: m.getPitch(),
        rumo: m.getBearing(),
        largura,
        altura,
        kCentro,
        satelite,
        relevo: !!m.getTerrain(),
        ligadas,
        capitulo: this.estado.capitulo,
        total: itens.length,
        porFamilia,
        porTipo,
        nivel: r.nivel,
        R_km: r.R_km,
        usinasNaTela: r.usinasNaTela,
        mwNaTela: r.mwNaTela,
        conjuntos: r.conjuntos,
        comMaquete: r.comMaquete,
        mwRepresentado: r.mwRepresentado,
        cortadosPeloTeto: r.cortadosPeloTeto,
        cortadosPorEspaco: r.cortadosPorEspaco,
        forcados: r.forcados.length,
        escolha: r,
        msDaEscolha: tempos.length ? tempos.reduce((s, v) => s + v, 0) / tempos.length : undefined,
      },
    };
  }

  /** Papéis 2D no render (A5, A8): membros visíveis no disco proporcional, vencedores sem
   *  símbolo 2D visível (o feature-state "maquete" apaga pela pintura: conta como oculto),
   *  âncoras contra itens, rótulos de usina em repouso. */
  depurarPapeis() {
    const m = this.mapa;
    const cv = m.getCanvas();
    const w = cv.clientWidth;
    const h = cv.clientHeight;
    const naTela = (q: { x: number; y: number }) => q.x >= 0 && q.y >= 0 && q.x <= w && q.y <= h;
    const visivel = (camada: string) => !!m.getLayer(camada) && m.getLayoutProperty(camada, 'visibility') !== 'none';
    const em = (q: { x: number; y: number }, camadas: string[]) =>
      m.queryRenderedFeatures(
        [
          [q.x - 3, q.y - 3],
          [q.x + 3, q.y + 3],
        ],
        { layers: camadas.filter(visivel) },
      );
    let membros = 0;
    const membrosFaltando: string[] = [];
    /** membros escondidos por estarem sob a própria maquete (esconderMembrosSobAMaquete) */
    const membrosSobAMaquete: string[] = [];
    const vencedores2D: { id: string; camada: string }[] = [];
    for (const p of this.escolha.pontos) {
      if (p.familia !== 'usina') continue;
      for (const mb of p.membros) {
        const q = m.project([mb.lon, mb.lat]);
        if (!naTela(q)) continue;
        membros++;
        const fid = Number(mb.id.slice(6));
        // escondido por desenho: sob a maquete ou o rótulo, ou no celular em repouso (só o toque)
        if (this.membrosSobAMaquete.has(fid) || w < LARGURA_DO_CELULAR) membrosSobAMaquete.push(mb.id);
        else if (!em(q, ['usinas', 'maquetes-membros-ponto']).some((f) => f.id === fid || Number(f.properties?.fid) === fid)) membrosFaltando.push(mb.id);
      }
      const fid = p.origem?.id;
      const q = m.project([p.lon, p.lat]);
      for (const f of em(q, ['usinas', 'usinas-fio', 'usinas-selo', 'usinas-rotulo'])) {
        if (f.id !== fid) continue;
        const oculto = f.layer?.id !== 'usinas-rotulo' && m.getFeatureState({ source: F.usinas, id: fid as number }).maquete === true;
        if (!oculto) vencedores2D.push({ id: p.id, camada: f.layer?.id ?? '' });
      }
    }
    const comAncora = new Set(this.escolha.pontos.filter((p) => p.familia !== 'torre').map((p) => p.id));
    const ancoras = visivel('maquetes-ancora') ? m.queryRenderedFeatures(undefined, { layers: ['maquetes-ancora'] }) : [];
    const idsAncora = new Set(ancoras.map((f) => String(f.properties?.id)));
    const orfas = [...idsAncora].filter((id) => !comAncora.has(id));
    const semAncora = [...comAncora].filter((id) => {
      const p = this.escolha.pontos.find((x) => x.id === id);
      return p && naTela(m.project([p.lon, p.lat])) && !idsAncora.has(id);
    });
    const rotulosDeUsina = visivel('usinas-rotulo') ? m.queryRenderedFeatures(undefined, { layers: ['usinas-rotulo'] }).length : 0;
    const selosDeCima = visivel('maquetes-selo-troca') ? m.queryRenderedFeatures(undefined, { layers: ['maquetes-selo-troca'] }).filter((f) => f.properties?.deCima === 1).length : 0;
    return { membros, membrosVisiveis: membros - membrosFaltando.length - membrosSobAMaquete.length, membrosFaltando: membrosFaltando.slice(0, 10), membrosSobAMaquete, vencedores2D, ancoras: idsAncora.size, orfas, semAncora, rotulosDeUsina, selosDeCima };
  }

  /** Rótulos efetivamente colocados agora, com a caixa de colisão do Mapbox (a mesma que ele
   *  usa para decidir quem cabe: px de tela, com a escala da perspectiva), menos o
   *  text-padding da camada. Lê o índice de colisão interno do mapbox-gl 3 (não é API
   *  pública); se ele faltar, cai para a estimativa por queryRenderedFeatures + measureText. */
  depurarRotulos(camadas: readonly string[] = CAMADAS_DE_ROTULO_MEDIDAS): RotuloMedido[] {
    const m = this.mapa;
    const pedidas = camadas.filter((c) => m.getLayer(c) && m.getLayoutProperty(c, 'visibility') !== 'none');
    const saida: RotuloMedido[] = [];
    type Chave = { bucketInstanceId: number; featureIndex: number };
    type Retido = {
      bucketIndex: number;
      sourceLayerIndex: number;
      featureIndex: {
        bucketLayerIDs: string[][];
        loadVTLayers: () => Record<string, { feature: (i: number) => { id?: number | string; properties: Record<string, unknown> } }>;
        sourceLayerCoder: { decode: (i: number) => string };
      };
    };
    const interno = m as unknown as { style?: { placement?: { collisionIndex?: { grid?: { boxKeys: Chave[]; bboxes: number[] } }; retainedQueryData?: Record<number, Retido> } } };
    const grade = interno.style?.placement?.collisionIndex?.grid;
    const retidos = interno.style?.placement?.retainedQueryData;
    if (grade && retidos) {
      const PAD = 100; // viewportPadding do CollisionIndex do mapbox-gl
      const folga = new Map<string, number>();
      for (const c of pedidas) {
        const t = m.getLayoutProperty(c, 'text-padding');
        // o obstáculo das maquetes é só ícone, com icon-padding 0
        folga.set(c, c === 'maquetes-obstaculo' ? 0 : typeof t === 'number' ? t : 2);
      }
      for (let i = 0; i < grade.boxKeys.length; i++) {
        const chave = grade.boxKeys[i];
        const r = retidos[chave.bucketInstanceId];
        if (!r) continue;
        // ids de camada do mapbox-gl 3 podem vir qualificados ("id␟escopo")
        const ids = (r.featureIndex.bucketLayerIDs?.[r.bucketIndex] ?? []).map((l) => l.split('\u001F')[0]);
        const camada = ids.find((l) => pedidas.includes(l));
        if (!camada) continue;
        let id: string | number | null = null;
        let texto: string | null = null;
        try {
          // loadVTLayers monta o sourceLayerCoder: vem antes do decode
          const vt = r.featureIndex.loadVTLayers();
          const f = vt[r.featureIndex.sourceLayerCoder.decode(r.sourceLayerIndex)]?.feature(chave.featureIndex);
          if (f) {
            const pr = f.properties;
            // a fonte das maquetes não tem id de feição: o id da escolha vem na propriedade
            id = f.id ?? (typeof pr.id === 'string' ? pr.id : null);
            texto = String(pr.nome ?? pr.n ?? pr.rotulo ?? pr.name_pt ?? pr.name ?? '') || null;
          }
        } catch {
          /* feição não legível: fica a caixa */
        }
        const d = folga.get(camada) ?? 0;
        const b = grade.bboxes;
        saida.push({ camada, id, texto, caixa: [b[i * 4] - PAD + d, b[i * 4 + 1] - PAD + d, b[i * 4 + 2] - PAD - d, b[i * 4 + 3] - PAD - d], fonte: 'colisao' });
      }
      return saida;
    }
    // estimativa: ponto da feição + text-size e text-radial-offset avaliados + largura pelo canvas 2D
    const ctx = document.createElement('canvas').getContext('2d');
    for (const c of pedidas) {
      for (const f of m.queryRenderedFeatures(undefined, { layers: [c] })) {
        if (f.geometry.type !== 'Point') continue;
        const pr = (f.properties ?? {}) as Record<string, unknown>;
        const texto = String(pr.nome ?? pr.n ?? pr.rotulo ?? '') || null;
        if (!texto) continue;
        const lay = (f.layer?.layout ?? {}) as Record<string, unknown>;
        const tam = typeof lay['text-size'] === 'number' ? (lay['text-size'] as number) : 12;
        const off = typeof lay['text-radial-offset'] === 'number' ? (lay['text-radial-offset'] as number) : 0;
        const q = m.project((f.geometry as Point).coordinates as [number, number]);
        if (ctx) ctx.font = `${tam}px sans-serif`;
        const larg = ctx ? ctx.measureText(texto).width : texto.length * tam * 0.55;
        const y0 = q.y + off * tam;
        saida.push({ camada: c, id: f.id ?? null, texto, caixa: [q.x - larg / 2, y0, q.x + larg / 2, y0 + tam * 1.2], fonte: 'estimada' });
      }
    }
    return saida;
  }

  /** Liga ou desliga a camada 3D (A/B de quadros por segundo). Não mexe na escolha. */
  ligarMaquetes(ligar: boolean) {
    if (this.mapa.getLayer('maquetes')) this.mapa.setLayoutProperty('maquetes', 'visibility', ligar ? 'visible' : 'none');
    this.mapa.triggerRepaint();
  }

  /** Tempo médio (ms) de `vezes` execuções da escolha pura (escolherMaquetes, sem a entrega)
   *  com o último pedido; os conjuntos já estão no cache, como depois do primeiro moveend. */
  cronometrarEscolha(vezes = 10): number {
    const pedido = this.ultimoPedido;
    if (!pedido) return 0;
    const t0 = performance.now();
    for (let i = 0; i < vezes; i++) escolherMaquetes(pedido);
    return (performance.now() - t0) / Math.max(1, vezes);
  }

  /** Quantos quadros o mapa desenha em `ms` (com o mapa parado: zero é ocioso). */
  contarRepaints(ms: number): Promise<number> {
    return new Promise((resolver) => {
      let n = 0;
      const conta = () => n++;
      this.mapa.on('render', conta);
      window.setTimeout(() => {
        this.mapa.off('render', conta);
        resolver(n);
      }, ms);
    });
  }

  destruir() {
    if (controleEmDepuracao === this) controleEmDepuracao = null;
    this.destruido = true;
    this.cancelarVooDaAbertura();
    this.seguidores.clear();
    this.svgDasTrocas?.remove();
    for (const k of Object.keys(this.marcadoresDoDia) as Subsistema[]) this.marcadoresDoDia[k]?.remove();
    this.maquetes?.destruir();
    if (this.esperaDaEscolha != null) window.clearTimeout(this.esperaDaEscolha);
    lojaDoResumo.definir(RESUMO_INATIVO);
    // o arquivo das áreas que chegar depois disto não toca o mapa removido (CTL-3)
    this.distrib.destruir();
    // o laço de animação do comércio para antes do mapa sumir
    this.comercio.destruir();
    this.pulso.destruir();
    if (this.esperaDoAno != null) window.clearTimeout(this.esperaDoAno);
    if (this.assentoPendente != null) window.clearTimeout(this.assentoPendente);
    this.mapa.remove();
  }
}

/** Raio aparente do globo (px): a maior distância, na tela, entre o centro e um ponto que se
 *  afasta dele por um círculo máximo (no rumo da câmera + 90°). Até o limbo a distância
 *  cresce; depois dele o ponto vai para trás do globo e ela volta a cair. Busca pela razão
 *  áurea em 0,4–1,65 rad (~28 projeções). Medido pelo batedor: não depende da latitude do centro. */
function raioDoGlobo(projetar: (l: mapboxgl.LngLat) => { x: number; y: number }, centro: mapboxgl.LngLat, rumo: number): number {
  const c = projetar(centro);
  const lat0 = (centro.lat * Math.PI) / 180;
  const lon0 = (centro.lng * Math.PI) / 180;
  const b = ((rumo + 90) * Math.PI) / 180;
  const dist = (t: number) => {
    const lat = Math.asin(Math.sin(lat0) * Math.cos(t) + Math.cos(lat0) * Math.sin(t) * Math.cos(b));
    const lon = lon0 + Math.atan2(Math.sin(b) * Math.sin(t) * Math.cos(lat0), Math.cos(t) - Math.sin(lat0) * Math.sin(lat));
    const p = projetar(new mapboxgl.LngLat((((lon * 180) / Math.PI + 540) % 360) - 180, (lat * 180) / Math.PI));
    return Math.hypot(p.x - c.x, p.y - c.y);
  };
  const g = (Math.sqrt(5) - 1) / 2;
  let a = 0.4;
  let d = 1.65;
  let x1 = d - g * (d - a);
  let x2 = a + g * (d - a);
  let f1 = dist(x1);
  let f2 = dist(x2);
  // 18 passos: o intervalo cai a ~2e-4 rad (menos de 0,1 px no raio)
  for (let i = 0; i < 18; i++) {
    if (f1 < f2) {
      a = x1;
      x1 = x2;
      f1 = f2;
      x2 = a + g * (d - a);
      f2 = dist(x2);
    } else {
      d = x2;
      x2 = x1;
      f2 = f1;
      x1 = d - g * (d - a);
      f1 = dist(x1);
    }
  }
  return Math.max(f1, f2);
}

/** Envoltória convexa de pontos [lon, lat], afastada `folgaM` metros para fora (o fio passa
 *  por fora dos discos, não por cima deles), como anel fechado. null com menos de 3 pontos
 *  distintos. Plano local equiretangular: os conjuntos têm poucos km. */
function envoltoria(pontos: [number, number][], folgaM: number): [number, number][] | null {
  if (pontos.length < 3) return null;
  const lat0 = pontos[0][1];
  const kx = 111_320 * Math.cos((lat0 * Math.PI) / 180);
  const ky = 110_574;
  const xy = pontos.map(([lon, lat]) => [lon * kx, lat * ky] as [number, number]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cruz = (o: number[], a: number[], b: number[]) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const baixo: [number, number][] = [];
  for (const p of xy) {
    while (baixo.length >= 2 && cruz(baixo[baixo.length - 2], baixo[baixo.length - 1], p) <= 0) baixo.pop();
    baixo.push(p);
  }
  const cima: [number, number][] = [];
  for (let i = xy.length - 1; i >= 0; i--) {
    const p = xy[i];
    while (cima.length >= 2 && cruz(cima[cima.length - 2], cima[cima.length - 1], p) <= 0) cima.pop();
    cima.push(p);
  }
  const casco = baixo.slice(0, -1).concat(cima.slice(0, -1));
  if (casco.length < 3) return null;
  // cada vértice sai pela bissetriz das normais das duas arestas (anti-horário: normal à direita)
  const n = casco.length;
  const anel = casco.map((p, i) => {
    const a = casco[(i - 1 + n) % n];
    const b = casco[(i + 1) % n];
    const n1 = [p[1] - a[1], -(p[0] - a[0])];
    const n2 = [b[1] - p[1], -(b[0] - p[0])];
    const l1 = Math.hypot(n1[0], n1[1]) || 1;
    const l2 = Math.hypot(n2[0], n2[1]) || 1;
    const bx = n1[0] / l1 + n2[0] / l2;
    const by = n1[1] / l1 + n2[1] / l2;
    const lb = Math.hypot(bx, by) || 1;
    return [(p[0] + (bx / lb) * folgaM) / kx, (p[1] + (by / lb) * folgaM) / ky] as [number, number];
  });
  anel.push(anel[0]);
  return anel;
}

/** Feição mínima de um alvo de clique ou hover (a do Mapbox ou a do dado de origem). */
/** O pedaço do transform do Mapbox que a entrada adiada usa (a tipagem pública não o expõe). */
interface TransformoDoMapa {
  zoom: number;
  getBounds(): mapboxgl.LngLatBounds;
  locationPoint(l: mapboxgl.LngLat): { x: number; y: number };
}

/** Memória por faixa de zoom (batedor das limitações, mecanismo A): cada faixa de 0,05 de zoom
 *  guarda o conjunto entregue por 3 s; ao voltar a uma faixa com a mesma pose (centro a menos de
 *  48 px, rumo e inclinação a menos de 1°), é esse conjunto que ganha a histerese. Com 8 s a
 *  memória velha criava vida curta nova; 3 s não. Limpa na troca de capítulo, de camadas, de
 *  modo (o estilo remonta) e de tamanho da tela. */
class MemoriaDeVencedores {
  static readonly FAIXA = 0.05;
  static readonly MS = 3000;
  static readonly PX = 48;
  private readonly porFaixa = new Map<number, { ids: ReadonlySet<string>; t: number; lon: number; lat: number; rumo: number; incl: number }>();
  private faixa(m: mapboxgl.Map) {
    return Math.round(m.getZoom() / MemoriaDeVencedores.FAIXA);
  }
  anteriores(m: mapboxgl.Map): ReadonlySet<string> | null {
    const r = this.porFaixa.get(this.faixa(m));
    if (!r || performance.now() - r.t >= MemoriaDeVencedores.MS) return null;
    const a = m.project([r.lon, r.lat]);
    const b = m.project(m.getCenter());
    const mesma = Math.hypot(a.x - b.x, a.y - b.y) <= MemoriaDeVencedores.PX && Math.abs(r.rumo - m.getBearing()) < 1 && Math.abs(r.incl - m.getPitch()) < 1;
    return mesma ? r.ids : null;
  }
  guardar(ids: ReadonlySet<string>, m: mapboxgl.Map) {
    const c = m.getCenter();
    this.porFaixa.set(this.faixa(m), { ids, t: performance.now(), lon: c.lng, lat: c.lat, rumo: m.getBearing(), incl: m.getPitch() });
    // nada de acumular: o que passou do prazo sai
    if (this.porFaixa.size > 64) for (const [k, v] of this.porFaixa) if (performance.now() - v.t >= MemoriaDeVencedores.MS) this.porFaixa.delete(k);
  }
  limpar() {
    this.porFaixa.clear();
  }
}

type FeicaoAlvo = { properties: Record<string, unknown> | null; geometry: Geometry };

/** Mistura duas cores hexadecimais (#rrggbb). */
export function misturar(a: string, b: string, t: number): string {
  const h = (s: string, i: number) => parseInt(s.slice(1 + i * 2, 3 + i * 2), 16);
  const c = [0, 1, 2].map((i) => Math.round(h(a, i) + (h(b, i) - h(a, i)) * t));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}
