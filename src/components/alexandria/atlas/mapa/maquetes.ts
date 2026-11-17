// Atlas da Alexandria v3 — a escolha das maquetes.
//
// O que ganha maquete no enquadramento corrente, qual maquete, onde, com que rumo e com que
// tamanho. Este arquivo não importa o Three.js: o desenho fica em camada3d.ts, que só é
// baixado quando o leitor chega ao zoom das maquetes.
//
// A regra (a interface diz isto numa linha, ver textoDoResumo):
//   · conjunto: usinas em operação da MESMA maquete (fonte e tipo) a menos de R da maior
//     viram um conjunto no ponto da maior (a semente). Ninguém sai do ponto do cadastro: os
//     membros ficam no disco proporcional de sempre, a semente ganha a maquete. O conjunto
//     é leitura derivada por regra declarada; o nome é o da semente (o cadastro não tem
//     complexo) e a segunda linha do rótulo diz "+n parques · X MW";
//   · nível: pelo zoom efetivo NO PONTO (a perspectiva da câmera inclinada conta), quatro
//     faixas com piso de porte, distância mínima entre pés e teto por tela (§2 da
//     especificação de colocação);
//   · fila única: usinas e conjuntos pelos MW, subestações e instalações da ANP por um peso
//     editorial (desempate de espaço, não dado); quem foi desenhado no enquadramento anterior
//     ganha uma folga (histerese); o ativo selecionado, o destino da busca e o destaque da
//     aula furam teto, piso e distância;
//   · escolha gulosa NA TELA: pela caixa projetada da maquete e pela distância entre pés;
//   · tamanho: lei contínua da potência do conjunto (sem degrau), nunca menor que a escala
//     real; medidas dos modelos lidas de modelos.json (gerado pelo Blender), nada copiado.
//
// O que as maquetes são e o que não são: representação esquemática do TIPO de instalação,
// não retrato; escolhida só por atributo do cadastro (fonte, sigla, combustível, potência;
// tensão e linhas que chegam na subestação; tipo da instalação da ANP); posição sempre a do
// cadastro (ou do traçado generalizado do ONS, para as torres); rumo da barragem pela borda
// do reservatório mapeado pela ANA onde o construtor o derivou (`rumoB`), senão a convenção
// leste–oeste; da subestação pela linha de maior tensão; as demais na convenção fixa (o
// cadastro não diz para onde estão viradas).
//
// De perto (onda 2): nos níveis 3 e 4 toda usina com coordenada confirmada pode ganhar
// maquete (piso da semente em podeSemear), o mínimo legível é piso do tamanho (não recusa) e
// a precisão da coordenada vem do campo `prec` da fonte, não do texto do número.

import type { Feature, FeatureCollection, LineString, MultiLineString, Point, Position } from 'geojson';
import type { CamadaId, CapituloId, Categoria, PropsUsina } from '@/lib/alexandria/atlas/tipos';
import modelosJson from '../../../../../public/alexandria/atlas/modelos/modelos.json';

export type TipoDeMaquete =
  // geração
  | 'aerogerador'
  | 'hidreletrica'
  | 'hidreletrica-grande'
  | 'pch'
  | 'solar'
  | 'nuclear'
  | 'termica-gas'
  | 'termica-carvao'
  | 'biomassa-cana'
  | 'biomassa'
  | 'termica-motores'
  | 'termeletrica'
  | 'biogas'
  | 'alto-forno'
  // rede
  | 'subestacao-pequena'
  | 'subestacao'
  | 'subestacao-grande'
  | 'subestacao-no'
  | 'conversora'
  | 'torre'
  | 'torre-ehv'
  | 'torre-cc'
  // gás e petróleo (camada da ANP, capítulo O combustível)
  | 'refinaria'
  | 'terminal-gnl'
  | 'upgn'
  | 'terminal-liquidos';

export type FamiliaDaMaquete = 'usina' | 'rede' | 'anp' | 'torre';

type Caixa = [number, number, number, number];

export interface MembroDoConjunto {
  /** usina:<id da feição> */
  id: string;
  /** código CEG da ANEEL (a chave da seleção e da ficha) */
  ceg: string;
  nome: string;
  mw: number;
  lon: number;
  lat: number;
}

/** Um item escolhido: o que a camada 3D desenha e o que a cartografia 2D ancora. */
export interface PontoDeMaquete {
  /** usina:<id> · se:<id> · anp:<id> · torre:<lon5>,<lat5> */
  id: string;
  tipo: TipoDeMaquete;
  familia: FamiliaDaMaquete;
  lon: number;
  lat: number;
  /** rumo em graus a partir do norte, sentido horário */
  rumo: number;
  /** maior medida do modelo na tela, em px, no ponto (lei de tamanho; nunca menor que a escala real) */
  L: number;
  /** a lei sem a escala real (para conferir o A7) */
  Llei: number;
  /** a maior medida no chão, em metros, no zoom da escolha (L dividido pela escala no ponto) */
  metros: number;
  /** zoom do centro no momento da escolha */
  zoomDaEscolha: number;
  /** escala no ponto (px por metro, na direção horizontal da tela) no momento da escolha */
  k: number;
  nome: string | null;
  cat: Categoria | null;
  /** potência da própria semente (MW); null fora das usinas */
  mw: number | null;
  /** soma dos MW do conjunto (semente + membros) */
  mwConjunto: number | null;
  /** os outros do conjunto (a semente não entra) */
  membros: MembroDoConjunto[];
  /** CEG da usina (semente), para a ficha */
  ceg?: string;
  nivel: 1 | 2 | 3 | 4;
  zEf: number;
  prio: number;
  forcado: boolean;
  /** por que foi forçado (aula, busca, seleção) */
  motivo?: MotivoDoForcado;
  /** forçado por conter o item pedido (um membro do conjunto), não por ser ele */
  porMembro?: boolean;
  /** veio da histerese (estava desenhado no enquadramento anterior) */
  histerese: boolean;
  /** ponto do cadastro na tela (px de CSS, relativos ao canvas) */
  pe: [number, number];
  /** caixa de tela prevista do modelo */
  caixa: Caixa;
  /** câmera de cima (inclinação < 25°): aerogerador não é desenhado em 3D; fica o selo no pé */
  deCima: boolean;
  /** satélite de perto: nenhuma maquete, ficam âncora e rótulo */
  semModelo: boolean;
  /** o rotor gira (só aerogerador semente desenhado) */
  rotorGira: boolean;
  /** feição de origem no mapa (fonte e id numérico), para o símbolo 2D ceder à maquete */
  origem?: { fonte: 'usinas' | 'subestacoes' | 'instalacoes'; id: number };
  /** tensão (subestação) */
  kv?: number | null;
  /** linha da torre (índice da feição), para o teto por linha */
  linha?: number;
  /** rótulo do vencedor (camada maquetes-rotulo) */
  rotulo: { linha2: string; tam: number; tamTela: number; off: number; mostrar: boolean; caixa: Caixa } | null;
}

export interface FichaDoModelo {
  arquivo: string;
  /** versão de poucos triângulos para quando a maquete ocupa poucos pixels */
  lod?: string;
  /** rumo fixo da convenção de desenho (o cadastro não diz para onde a instalação está virada) */
  giro?: number;
}

/** Os modelos de tools/alexandria-atlas/modelos/gerar_modelos.py. As medidas vêm de
 *  modelos.json (abaixo), não daqui. */
export const MODELOS: Record<TipoDeMaquete, FichaDoModelo> = {
  aerogerador: { arquivo: 'aerogerador.glb' },
  // a barragem é um muro comprido: atravessada (giro 90) na convenção
  hidreletrica: { arquivo: 'hidreletrica.glb', giro: 90 },
  // UHE de 1 GW ou mais (potência do cadastro): oito unidades, casa de força mais longa
  'hidreletrica-grande': { arquivo: 'hidreletrica-grande.glb', giro: 90 },
  pch: { arquivo: 'pch.glb', giro: 90 },
  solar: { arquivo: 'solar.glb' },
  nuclear: { arquivo: 'nuclear.glb' },
  'termica-gas': { arquivo: 'termica-gas.glb' },
  'termica-carvao': { arquivo: 'termica-carvao.glb' },
  'biomassa-cana': { arquivo: 'biomassa-cana.glb' },
  biomassa: { arquivo: 'biomassa.glb' },
  'termica-motores': { arquivo: 'termica-motores.glb' },
  termeletrica: { arquivo: 'termeletrica.glb' },
  biogas: { arquivo: 'biogas.glb' },
  'alto-forno': { arquivo: 'alto-forno.glb' },
  'subestacao-pequena': { arquivo: 'subestacao-pequena.glb' },
  subestacao: { arquivo: 'subestacao.glb' },
  'subestacao-grande': { arquivo: 'subestacao-grande.glb' },
  'subestacao-no': { arquivo: 'subestacao-no.glb' },
  conversora: { arquivo: 'conversora.glb' },
  torre: { arquivo: 'torre.glb', lod: 'torre-lod.glb' },
  'torre-ehv': { arquivo: 'torre-ehv.glb', lod: 'torre-ehv-lod.glb' },
  'torre-cc': { arquivo: 'torre-cc.glb', lod: 'torre-cc-lod.glb' },
  refinaria: { arquivo: 'refinaria.glb' },
  'terminal-gnl': { arquivo: 'terminal-gnl.glb' },
  upgn: { arquivo: 'upgn.glb' },
  'terminal-liquidos': { arquivo: 'terminal-liquidos.glb' },
};

/** Medidas [leste, norte, altura] em metros de cada arquivo, como o Blender gravou em
 *  modelos.json (lido no build: regenerar os modelos atualiza a régua). */
const MEDIDAS = new Map<string, [number, number, number]>();
for (const m of (modelosJson as { modelos: { arquivo: string; dimensoes?: number[] }[] }).modelos) {
  const d = m.dimensoes;
  if (d && d.length === 3 && d.every((v) => Number.isFinite(v) && v > 0)) MEDIDAS.set(m.arquivo, [d[0], d[1], d[2]]);
}
/** Fonte (chave de categoria da PALETA) do material "acento" de cada arquivo, como o Blender
 *  gravou em modelos.json; a usina usa a categoria do próprio cadastro, isto é o padrão. */
export const ACENTO_DO_ARQUIVO = new Map<string, Categoria>();
for (const m of (modelosJson as { modelos: { arquivo: string; acento?: string | null }[] }).modelos) {
  if (m.acento) ACENTO_DO_ARQUIVO.set(m.arquivo, m.acento as Categoria);
}
/** Medidas do modelo de um tipo; null se modelos.json não as tem (o tipo fica sem maquete). */
export const medidasDo = (tipo: TipoDeMaquete): [number, number, number] | null => MEDIDAS.get(MODELOS[tipo].arquivo) ?? null;
/** Maior medida (m) de um arquivo de modelo. */
export const dimensaoDoArquivo = (arquivo: string): number => {
  const d = MEDIDAS.get(arquivo);
  return d ? Math.max(d[0], d[1], d[2]) : 1;
};

/** Abaixo deste tamanho na tela a torre usa a versão simplificada (a treliça cheia vira borrão). */
export const PX_DO_LOD = 64;

/** Abaixo deste tamanho na tela a laje (pátio) não é desenhada: só os volumes. */
export const PX_DA_LAJE = 120;

/** Zoom (efetivo, no ponto) a partir do qual há maquete. */
export const ZOOM_DAS_MAQUETES = 9.4;
/** Leva 4 (crítico desktop 1, reprovação): em zoom PARADO não há estado intermediário. A troca
 *  2D → 3D deixou de ser guiada pelo zoom (entre 9,4 e 9,8 a maquete ficava meio crescida,
 *  achatada, com o selo plano por cima: o aerogerador virava "helicóptero") e passou a ser no
 *  TEMPO: a maquete cresce do chão em DURACAO_DA_TROCA_MS quando o item ENTRA na escolha e
 *  encolhe quando SAI (camada3d.ts). O selo do vencedor, a âncora, o rótulo e o recuo dos
 *  perdedores deixaram de depender do zoom (controle, recado da leva 4). Esta constante não guia
 *  mais a maquete: o controle a usa só como o início da saída do selo dos PERDEDORES e dos
 *  membros (9,8 → 10,2), que é símbolo 2D e não mudou. */
export const ZOOM_DA_MAQUETE_INTEIRA = 9.8;
/** Duração (ms) da entrada e da saída de uma maquete (movimento reduzido: troca seca). */
export const DURACAO_DA_TROCA_MS = 300;
/** Leva 4, item 2: o aerogerador nunca de perfil. O cadastro não diz para onde o rotor está
 *  virado (e o rotor real segue o vento): a maquete é esquema e gira com a câmera, a três
 *  quartos dela (este ângulo, em graus, entre o eixo do rotor e a direção da vista). */
export const ROTOR_A_TRES_QUARTOS = 35;
/** Rumo do modelo do aerogerador para a câmera de rumo B (graus). Com rumo 0 o eixo do rotor
 *  do modelo fica norte–sul, de frente para a câmera de rumo 0. */
export const rumoDoAerogerador = (B: number) => B + ROTOR_A_TRES_QUARTOS;

/** Com a foto de satélite ligada, a partir deste zoom não há maquete: a foto já mostra a obra. */
export const ZOOM_SEM_MAQUETE_NO_SATELITE = 12.5;

/** Achados O4 e 13: na metrópole, centenas de grupos geradores a óleo abaixo de 5 MW (prédio,
 *  shopping, banco) cobriam a cena até o zoom 12. O símbolo deles só entra a partir deste zoom;
 *  a linha do painel declara o piso e a busca acha todos. */
export const ZOOM_DO_OLEO_PEQUENO = 13;
export const KW_DO_OLEO_PEQUENO = 5000;

/** Abaixo desta inclinação aerogerador e torre não são desenhados (de cima leem como cruz). */
export const INCLINACAO_DE_PE = 25;

/** Largura (px) abaixo da qual a tela é de celular. */
export const LARGURA_DO_CELULAR = 700;

const CIRCUNFERENCIA = 40_075_016.686;
const RAD = Math.PI / 180;

/** Metros por pixel de tela no zoom e na latitude dados (tiles de 512 px do Mapbox). */
export const metrosPorPixel = (zoom: number, lat: number) => (CIRCUNFERENCIA * Math.cos(lat * RAD)) / (512 * 2 ** zoom);

// ── lei de tamanho (§3) ──────────────────────────────────────────────

/** Números ajustáveis da lei (faixas da especificação: coeficiente 40–50, expoente
 *  0,20–0,25, mínimo do aerogerador 34–42). */
export const LEI = {
  coeficiente: 44,
  expoente: 0.22,
  /** MW de referência do coeficiente */
  mwRef: 30,
  minimo: 30,
  minimoAerogerador: 36,
  maximo: 170,
  maximoCelular: 140,
  fatorCelular: 0.85,
} as const;

/** L (px) de uma usina ou conjunto pela potência somada, sem o fator de tela. */
export function ladoPelaPotencia(tipo: TipoDeMaquete, mw: number): number {
  const minimo = tipo === 'aerogerador' ? LEI.minimoAerogerador : LEI.minimo;
  const v = LEI.coeficiente * (Math.max(mw, 0.001) / LEI.mwRef) ** LEI.expoente;
  return Math.min(LEI.maximo, Math.max(minimo, v));
}

/** L (px) fixo da rede, pela classe: a rede fica um degrau abaixo da geração. */
function ladoDaRede(tipo: TipoDeMaquete, kv: number | null): number {
  // só 345 kV ou mais e a conversora chegam ao mínimo legível (MINIMO_LEGIVEL, 56 px) pela
  // lei; abaixo de 345 kV a subestação só ganha maquete quando a escala real passa do mínimo
  if (tipo === 'conversora') return 72;
  if (tipo === 'subestacao-no') return 60;
  const v = kv ?? 0;
  return v >= 440 ? 60 : v >= 345 ? 56 : v >= 230 ? 38 : 30;
}

const LADO_DA_ANP: Partial<Record<TipoDeMaquete, number>> = { refinaria: 100, 'terminal-gnl': 72, upgn: 80, 'terminal-liquidos': 64 };
const LADO_DA_TORRE: Partial<Record<TipoDeMaquete, number>> = { torre: 24, 'torre-ehv': 28, 'torre-cc': 28 };

/** Teto (px) do aerogerador por nível [-, N1, N2, N3, N4]: cresce ao aproximar, nunca ao afastar. */
const TETO_DO_AEROGERADOR = [0, 76, 96, 112, 124] as const;

/** Aplica o fator da tela (celular) à lei. */
const naTela = (L: number, celular: boolean) => (celular ? Math.min(LEI.maximoCelular, L * LEI.fatorCelular) : L);

/** Erro da coordenada (m): meia unidade da última casa decimal significativa. Com `prec` (casas
 *  significativas NA FONTE bruta, gravadas pelo construtor de dados; 4 quer dizer "4 ou mais"),
 *  é ele que vale. O texto do número não serve para isso: o construtor arredonda a 4 casas e o
 *  zero final some (−35,1230 vira −35,123), e a regra via erro de 55 m onde há 5,6 m. Sem
 *  `prec` (arquivo anterior ao campo) fica a leitura do texto, como era. */
function erroDaCoordenadaM(lon: number, lat: number, prec?: number | null): number {
  if (typeof prec === 'number' && Number.isFinite(prec) && prec >= 0) return 0.5 * 10 ** -Math.min(4, Math.round(prec)) * 111_000;
  const casas = (v: number) => {
    const s = String(v);
    const i = s.indexOf('.');
    return i < 0 ? 0 : s.length - i - 1;
  };
  const c = Math.min(casas(lon), casas(lat));
  return 0.5 * 10 ** -c * 111_000;
}

// ── a maquete de cada usina, pelo cadastro ───────────────────────────

/** Biomassa sólida queimada em caldeira. */
const BIOMASSA_SOLIDA = new Set(['Lenha', 'Resíduos Florestais', 'Casca de Arroz', 'Capim Elefante', 'Carvão Vegetal', 'Licor Negro']);

/** UHE com esta potência ou mais (kW, cadastro) usa a barragem de oito unidades. */
const KW_DA_HIDRELETRICA_GRANDE = 1_000_000;

/** Abaixo disto uma térmica a gás natural fica com o modelo genérico: o cadastro não diz o ciclo. */
const KW_DO_CICLO_COMBINADO = 50_000;

export function maqueteDaUsina(p: Pick<PropsUsina, 'cat' | 'tipo' | 'comb' | 'kw'>): TipoDeMaquete {
  const c: Categoria = p.cat;
  const comb = p.comb ?? '';
  // o combustível vem antes da categoria: gás de alto-forno aparece como carvão e como biomassa
  if (comb.startsWith('Gás de Alto Forno')) return 'alto-forno';
  if (comb.startsWith('Biogás') || comb.startsWith('Resíduos Sólidos Urbanos')) return 'biogas';
  switch (c) {
    case 'hidro':
      return p.tipo === 'UHE' ? (p.kw >= KW_DA_HIDRELETRICA_GRANDE ? 'hidreletrica-grande' : 'hidreletrica') : 'pch';
    case 'eolica':
      return 'aerogerador';
    case 'solar':
      return 'solar';
    case 'nuclear':
      return 'nuclear';
    case 'gas':
      return comb === 'Gás Natural' && p.kw >= KW_DO_CICLO_COMBINADO ? 'termica-gas' : 'termeletrica';
    case 'carvao':
      return comb === 'Carvão Mineral' ? 'termica-carvao' : 'termeletrica';
    case 'biomassa':
      if (comb === 'Bagaço de Cana de Açúcar') return 'biomassa-cana';
      return BIOMASSA_SOLIDA.has(comb) ? 'biomassa' : 'termeletrica';
    case 'oleo':
      return comb === 'Óleo Diesel' || comb === 'Óleo Combustível' ? 'termica-motores' : 'termeletrica';
    default:
      return 'termeletrica';
  }
}

/** Maquete de cada tipo de instalação da camada da ANP. */
const MAQUETE_DA_INSTALACAO: Record<string, TipoDeMaquete> = {
  refinaria: 'refinaria',
  gnl: 'terminal-gnl',
  upgn: 'upgn',
  terminal: 'terminal-liquidos',
};
/** Camada do capítulo que liga cada tipo de instalação. */
const CAMADA_DA_INSTALACAO: Record<string, CamadaId> = { refinaria: 'refinarias', gnl: 'gnl', upgn: 'upgn', terminal: 'terminais' };
/** Peso na fila (MW-equivalente, editorial: desempate de espaço, não dado). */
const PESO_DA_INSTALACAO: Record<string, number> = { refinaria: 1000, gnl: 800, upgn: 300, terminal: 50 };

// ── o que se sabe de cada subestação pelas linhas que chegam nela ────

interface PropsLinha {
  kv: number | null;
  cc?: number | boolean | null;
  op: number | null;
  opAntesDe?: number | null;
}

interface PropsSubestacao {
  n?: string;
  kv: number | null;
  op: number | null;
  opAntesDe?: number | null;
  prev: number | null;
}

interface InfoDaSubestacao {
  /** maior tensão: a do cadastro da subestação; sem ela, a maior das linhas em operação que terminam nela */
  kv: number | null;
  /** ponta de linha de corrente contínua em operação */
  conversora: boolean;
  /** rumo de saída da linha de maior tensão que termina nela (null: nenhuma linha termina ali) */
  rumo: number | null;
  /** pontas de linha em operação a até RAIO_DA_PONTA_M */
  terminais: number;
}

const linhaEmOperacao = (p: PropsLinha) => p.op != null || p.opAntesDe != null;
const ehCC = (p: PropsLinha) => p.cc === 1 || p.cc === true;

/** Rumo (graus do norte, horário) de a para b, em plano local. */
function rumoDe(a: Position, b: Position): number {
  const dx = (b[0] - a[0]) * Math.cos(((a[1] + b[1]) / 2) * RAD);
  const dy = b[1] - a[1];
  return (Math.atan2(dx, dy) * 180) / Math.PI;
}

const distM = (a: Position, b: Position) => Math.hypot((b[0] - a[0]) * 111_320 * Math.cos(a[1] * RAD), (b[1] - a[1]) * 110_574);

/** Ponta de linha conta como chegada na subestação até esta distância (o traçado do ONS
 *  termina a ~100 m do ponto da subestação, medido). */
const RAIO_DA_PONTA_M = 1500;

const cacheDasSubestacoes = new WeakMap<FeatureCollection, WeakMap<FeatureCollection, InfoDaSubestacao[]>>();

function infoDasSubestacoes(subestacoes: FeatureCollection, linhas: FeatureCollection | null): InfoDaSubestacao[] {
  const chaveLinhas = linhas ?? subestacoes;
  let porLinhas = cacheDasSubestacoes.get(subestacoes);
  const salvo = porLinhas?.get(chaveLinhas);
  if (salvo) return salvo;
  // grade de ~0,02° com as pontas das linhas em operação: (ponta, vizinho para dar o rumo, props)
  const passo = 0.02;
  const grade = new Map<string, { ponta: Position; viz: Position; p: PropsLinha }[]>();
  const chave = (lon: number, lat: number) => `${Math.floor(lon / passo)}:${Math.floor(lat / passo)}`;
  for (const f of linhas?.features ?? []) {
    const p = f.properties as PropsLinha;
    if (!linhaEmOperacao(p)) continue;
    const g = f.geometry as LineString | MultiLineString;
    const partes = g.type === 'LineString' ? [g.coordinates] : g.type === 'MultiLineString' ? g.coordinates : [];
    for (const parte of partes) {
      if (parte.length < 2) continue;
      for (const [ponta, viz] of [
        [parte[0], parte[1]],
        [parte[parte.length - 1], parte[parte.length - 2]],
      ] as const) {
        const k = chave(ponta[0], ponta[1]);
        const lista = grade.get(k) ?? [];
        lista.push({ ponta, viz, p });
        grade.set(k, lista);
      }
    }
  }
  const info: InfoDaSubestacao[] = subestacoes.features.map((f) => {
    const sp = f.properties as PropsSubestacao;
    const pos = (f.geometry as Point).coordinates;
    const gx = Math.floor(pos[0] / passo);
    const gy = Math.floor(pos[1] / passo);
    let kvLinha: number | null = null;
    let conversora = false;
    let rumo: number | null = null;
    let terminais = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (const c of grade.get(`${gx + dx}:${gy + dy}`) ?? []) {
          if (distM(pos, c.ponta) > RAIO_DA_PONTA_M) continue;
          terminais++;
          if (ehCC(c.p)) conversora = true;
          const kv = c.p.kv ?? 0;
          if (kvLinha == null || kv > kvLinha) {
            kvLinha = kv;
            rumo = rumoDe(c.ponta, c.viz);
          }
        }
      }
    }
    return { kv: sp.kv ?? (kvLinha && kvLinha > 0 ? kvLinha : null), conversora, rumo, terminais };
  });
  if (!porLinhas) {
    porLinhas = new WeakMap();
    cacheDasSubestacoes.set(subestacoes, porLinhas);
  }
  porLinhas.set(chaveLinhas, info);
  return info;
}

/** Linhas a partir das quais uma subestação de 440 kV ou mais vira nó da rede (oito vãos). */
const TERMINAIS_DO_NO = 8;

/** Subestação por porte, pela maior tensão: até 138 kV pequena; 230–345 kV média; 440 kV
 *  ou mais grande, e nó (oito vãos) quando oito linhas ou mais terminam nela. Sem tensão no
 *  cadastro nem linha que a revele: o modelo pequeno, o que menos afirma. Ponta de linha CC
 *  em operação: conversora. */
function maqueteDaSubestacao(i: InfoDaSubestacao): TipoDeMaquete {
  if (i.conversora) return 'conversora';
  if (i.kv == null || i.kv < 200) return 'subestacao-pequena';
  if (i.kv < 440) return 'subestacao';
  return i.terminais >= TERMINAIS_DO_NO ? 'subestacao-no' : 'subestacao-grande';
}

/** Torre por classe da linha: corrente contínua; 440 kV ou mais (estaiada em V); o resto autoportante. */
const torreDaLinha = (p: PropsLinha): TipoDeMaquete => (ehCC(p) ? 'torre-cc' : (p.kv ?? 0) >= 440 ? 'torre-ehv' : 'torre');

/** Linhas abaixo disto não ganham torre. */
const KV_MINIMO_DA_TORRE = 230;

// ── níveis (§2) ──────────────────────────────────────────────────────

interface Nivel {
  n: 1 | 2 | 3 | 4;
  zMin: number;
  /** piso de porte do conjunto (MW somados) */
  pisoMW: number;
  /** tensão mínima da subestação (conversora sempre) */
  kvMin: number;
  /** subestação sem tensão conhecida entra */
  semKv: boolean;
  /** instalações da ANP entram */
  anp: boolean;
  /** raio de agrupamento: px no zoom de referência (e piso em metros) */
  Rpx: number;
  zRef: number;
  Rmin: number;
  /** distância mínima entre pés (px) */
  D: number;
  /** teto por tela [desktop, celular] */
  teto: [number, number];
}

export const NIVEIS: readonly Nivel[] = [
  { n: 1, zMin: 9.4, pisoMW: 300, kvMin: 500, semKv: false, anp: false, Rpx: 180, zRef: 9.9, Rmin: 600, D: 180, teto: [10, 4] },
  { n: 2, zMin: 10.5, pisoMW: 5, kvMin: 230, semKv: false, anp: true, Rpx: 200, zRef: 11, Rmin: 600, D: 140, teto: [20, 6] },
  { n: 3, zMin: 12, pisoMW: 1, kvMin: 0, semKv: true, anp: true, Rpx: 110, zRef: 12.8, Rmin: 600, D: 110, teto: [24, 8] },
  // nível 4 (decisão 1 da onda 2): toda usina em operação com coordenada confirmada é candidata,
  // de qualquer potência (menos o grupo gerador a óleo abaixo de KW_DO_OLEO_NO_NIVEL_4); o raio
  // do conjunto cai para 250 m (com 600 m, no zoom 16 o disco tinha ~545 px e o membro ficava
  // nele com espaço de sobra para a própria maquete)
  { n: 4, zMin: 14, pisoMW: 0, kvMin: 0, semKv: true, anp: true, Rpx: 90, zRef: 15.5, Rmin: 250, D: 90, teto: [24, 8] },
];

/** Folga de arredondamento na fronteira dos níveis: o item no centro de uma câmera no zoom 14
 *  tem zEf = 14 ± 1e-12 (razão de duas projeções), e o ruído decidia entre nível 3 e 4 (leva 2,
 *  item 3: a SE Itagiba no celular no zoom 14 caía no 3, 32 px no símbolo; a Jaguarari no 4). */
const FOLGA_DO_NIVEL = 1e-3;
/** Nível de um zoom efetivo (0: só 2D). */
export const nivelDe = (zEf: number): 0 | 1 | 2 | 3 | 4 => {
  const z = zEf + FOLGA_DO_NIVEL;
  return z < 9.4 ? 0 : z < 10.5 ? 1 : z < 12 ? 2 : z < 14 ? 3 : 4;
};

/** Raio de agrupamento (m) de um nível na latitude dada. */
export const raioDoConjuntoM = (nv: Nivel, lat: number) => Math.max(nv.Rmin, nv.Rpx * metrosPorPixel(nv.zRef, lat));

/** Distância efetiva entre dois pés (px), §2. */
export const distanciaMinima = (D: number, La: number, Lb: number) => Math.max(D, (La + Lb) / 2 + 16, 72);

/** Depuração (só no servidor de desenvolvimento): por que cada candidato ficou ou saiu. */
const DEPURAR = import.meta.env.DEV;
export const MOTIVOS_DA_ESCOLHA = new Map<string, string>();

/** Folga entre caixas (px) e fator da histerese (§2). */
const FOLGA_DA_CAIXA = 8;
/** Prioridade de quem já estava desenhado: ×2 (a especificação dizia ×1,3; medido no A10, a
 *  paralaxe de um pan de 200 px aproxima ou afasta pares no limite de D e o recém-chegado de
 *  prioridade pouco maior derrubava o desenhado — troca que o leitor vê como piscar). Quem
 *  tem mais que o dobro ainda toma o lugar. */
const HISTERESE_PRIO = 2;
const HISTERESE_D = 0.85;
/** Faixa de zoom efetivo em torno da fronteira de nível em que quem já estava desenhado
 *  mantém o nível de antes. */
const HISTERESE_DE_NIVEL = 0.35;
const FATOR_DO_SATELITE = 0.75;
/** Prioridade dos itens forçados (acima de qualquer potência). */
const PRIO_FORCADO = 1e12;
/** Prioridade do item que contém a maior usina da área útil (leva 4, item 4): abaixo dos
 *  forçados, acima de qualquer potência com histerese. */
const PRIO_DA_MAIOR = 1e9;

/** Usinas em operação da maior para a menor (cache pela lista): a maior da tela é a primeira
 *  que cai na área útil, sem projetar a lista inteira. */
const PELA_POTENCIA = new WeakMap<object, Feature<Point, PropsUsina>[]>();
/** A maior usina em operação (1 MW ou mais, fontes ligadas) com o ponto na área útil, ou null. É
 *  a população da primeira linha de "As maiores desta tela" (piso de 1 MW). */
function maiorDaTela(
  usinas: Feature<Point, PropsUsina>[],
  cats: readonly Categoria[],
  soHidro: boolean,
  dentroDosLimites: (lon: number, lat: number) => boolean,
  noPonto: (chave: number, lon: number, lat: number) => { pe: [number, number]; k: number; zEf: number } | null,
  naTelaUtil: (pe: [number, number]) => boolean,
): { u: Feature<Point, PropsUsina>; m: { pe: [number, number]; k: number; zEf: number } } | null {
  let ordem = PELA_POTENCIA.get(usinas);
  if (!ordem) {
    ordem = usinas.filter((u) => u.properties.fase === 0 && u.properties.kw >= 1000).sort((a, b) => b.properties.kw - a.properties.kw || idDaUsina(a) - idDaUsina(b));
    PELA_POTENCIA.set(usinas, ordem);
  }
  const ligadas = new Set(cats);
  for (const u of ordem) {
    const p = u.properties;
    if (!ligadas.has(p.cat) || (soHidro && p.cat !== 'hidro')) continue;
    const [lon, lat] = u.geometry.coordinates;
    if (!dentroDosLimites(lon, lat)) continue;
    const m = noPonto(idDaUsina(u), lon, lat);
    if (m && naTelaUtil(m.pe)) return { u, m };
  }
  return null;
}

// ── conjuntos por semente, pré-calculados por nível ──────────────────

interface Conjunto {
  semente: Feature<Point, PropsUsina>;
  tipo: TipoDeMaquete;
  membros: Feature<Point, PropsUsina>[];
  mw: number;
}

/** Conjuntos de um nível e uma grade deles (célula de PASSO_DA_GRADE graus) para a escolha
 *  só percorrer os que caem no enquadramento. */
interface ConjuntosDoNivel {
  lista: Conjunto[];
  grade: Map<number, Conjunto[]>;
}
const PASSO_DA_GRADE = 0.25;
const celula = (gx: number, gy: number) => (gx + 2000) * 4000 + (gy + 2000);
const cacheDosConjuntos = new WeakMap<object, Map<string, ConjuntosDoNivel>>();
const idDaUsina = (u: Feature<Point, PropsUsina>) => (typeof u.id === 'number' ? u.id : Number(u.id));

/** Usina marcada no cadastro como de posição a confirmar (a coordenada cai noutro submercado). */
export const posicaoAConfirmar = (p: PropsUsina): boolean => {
  const s = (p as unknown as { susp?: unknown }).susp;
  return s === true || s === 'true' || s === 1;
};

/** Subestação (ou instalação) marcada como de posição a confirmar: sai da escolha, como a usina. */
const propsAConfirmar = (p: unknown): boolean => {
  const s = (p as { susp?: unknown } | null)?.susp;
  return s === true || s === 'true' || s === 1;
};

/** Casas significativas da coordenada na fonte (campo `prec` do construtor), se houver. */
const precDe = (p: unknown): number | null => {
  const v = (p as { prec?: unknown } | null)?.prec;
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
};

/** Rumo do modelo da barragem pelo campo `rumoB` do construtor (decisão 4 da onda 2), ou null.
 *  `rumoB` é o rumo (graus do norte, horário) da direção que sai da crista para o lado da água
 *  (montante), derivado da borda do reservatório mapeado pela ANA. O modelo tem o muro ao longo
 *  do seu eixo y e o montante em −x; girado de r, o montante aponta para r − 90. Logo o giro é
 *  rumoB + 90. Conferido no render (Itaipu, Tucuruí, Sobradinho) contra a foto de satélite. */
export const rumoDaBarragem = (p: unknown): number | null => {
  const v = (p as { rumoB?: unknown } | null)?.rumoB;
  if (typeof v !== 'number' || !Number.isFinite(v)) return null;
  return (((v + 90) % 360) + 360) % 360;
};

/** O nome do cadastro encurtado para o MAPA (a ficha mantém o inteiro): sem o parêntese final
 *  ("(Antiga …)", "(Parte Brasileira)", o nome de homenagem) e, se ainda passar de 22
 *  caracteres, sem o sufixo depois de " - "; se mesmo assim não couber em duas linhas, cortado
 *  na última fronteira de palavra que cabe, com reticências. Nunca troca o nome atual pelo antigo (COL-6: o
 *  "(Antiga X)" virava o rótulo e o mapa usava um nome que o cadastro já não dá à usina). Só
 *  corta o texto da fonte; não inventa. */
const MAX_DO_NOME = 22;
export function encurtarNome(nome: string): string {
  const t = nome.trim();
  const par = /\s*\(([^()]*)\)\s*$/.exec(t);
  const base = par ? t.slice(0, par.index).trim() : t;
  if (!base) return t;
  if (base.length <= MAX_DO_NOME) return base;
  const i = base.indexOf(' - ');
  const curto = i > 0 ? base.slice(0, i).trim() : base;
  // até duas linhas de MAX_DO_NOME o rótulo mostra inteiro (a caixa prevista já conta duas)
  if (curto.length <= 2 * MAX_DO_NOME) return curto;
  // fronteira de palavra: o último espaço que deixa o texto e a reticência nas duas linhas
  const j = curto.lastIndexOf(' ', 2 * MAX_DO_NOME - 1);
  const corte = (j > 0 ? curto.slice(0, j) : curto.slice(0, 2 * MAX_DO_NOME - 1)).replace(/[\s,;:.\-–]+$/, '');
  return `${corte}…`;
}

// A generalização do 2D abaixo do zoom 10 mora em generalizacao.ts (onda 2: o símbolo que
// sobrevive leva a soma das vizinhas). A antiga marcarGeneralizacao daqui saiu.

/** Potência mínima da usina sozinha (sem membros) para ganhar maquete no nível 2 (só nele: de
 *  perto, níveis 3 e 4, o piso é o da semente, abaixo). */
const MW_DA_USINA_SOZINHA = 30;
/** Potência mínima da semente de um agrupamento para ele ganhar maquete no nível 2. */
const MW_DA_SEMENTE = 10;
/** Nível 4: o grupo gerador a óleo abaixo disto (kW) fica no símbolo (gerador de prédio). */
export const KW_DO_OLEO_NO_NIVEL_4 = 1000;
/** Pode semear (e ganhar maquete sozinha), pelo nível (decisão 1 da onda 2):
 *    níveis 1 e 2: 5 MW ou mais e, se a óleo, 30 MW ou mais (o amontoado de longe não volta);
 *    nível 3: 1 MW ou mais e, se a óleo, 5 MW (o mesmo piso do símbolo, KW_DO_OLEO_PEQUENO);
 *    nível 4: qualquer potência, menos o óleo abaixo de KW_DO_OLEO_NO_NIVEL_4. */
const podeSemear = (p: PropsUsina, n: number) =>
  n <= 2 ? p.kw >= 5000 && (p.cat !== 'oleo' || p.kw >= 30_000) : n === 3 ? p.kw >= 1000 && (p.cat !== 'oleo' || p.kw >= KW_DO_OLEO_PEQUENO) : p.kw > 0 && (p.cat !== 'oleo' || p.kw >= KW_DO_OLEO_NO_NIVEL_4);
/** Entra na lista do nível (como semente ou membro): 1 MW ou mais; no nível 4, o que pode semear.
 *  No nível 3 o óleo abaixo de KW_DO_OLEO_PEQUENO não entra nem como membro: o símbolo 2D dele só
 *  nasce no zoom 13 e o membro ficava sem disco (A5, RMSP z12: 1 de 14 membros à vista). */
const entraNoNivel = (p: PropsUsina, n: number) => (n === 4 ? podeSemear(p, 4) : n === 3 && p.cat === 'oleo' ? p.kw >= KW_DO_OLEO_PEQUENO : p.kw >= 1000);

/** Leva 4, item 3 (crítico desktop 2): o conjunto existe para os parques que o cadastro da ANEEL
 *  reparte em vários registros (eólica e solar). Em São Paulo a zoom 10 a única maquete era
 *  "Piratininga · +42 usinas · 391 MW", 42 geradores a diesel de prédios somados a uma térmica,
 *  e a maior usina da tela (Nova Piratininga, 386 MW, gás) ficava no símbolo plano. */
export const FONTES_DO_CONJUNTO: ReadonlySet<Categoria> = new Set<Categoria>(['eolica', 'solar']);

/** Conjuntos de um nível: usinas em operação de 1 MW ou mais, da maior para a menor (id no
 *  desempate); a maior livre vira semente e, se for eólica ou solar (FONTES_DO_CONJUNTO),
 *  absorve as livres da MESMA maquete a menos de R dela (sem encadear: o raio é medido da
 *  semente); nas outras fontes o "conjunto" é a usina sozinha. Cache pela lista de usinas e
 *  pela chave (nível, capítulo, fontes ligadas). */
function conjuntosDo(nv: Nivel, usinas: Feature<Point, PropsUsina>[], cats: readonly Categoria[], soHidro: boolean): ConjuntosDoNivel {
  let porChave = cacheDosConjuntos.get(usinas);
  if (!porChave) {
    porChave = new Map();
    cacheDosConjuntos.set(usinas, porChave);
  }
  const chave = `${nv.n}|${soHidro ? 'h' : ''}|${cats.join(',')}`;
  const salvo = porChave.get(chave);
  if (salvo) return salvo;
  const ligadas = new Set(cats);
  const lista = usinas.filter((u) => {
    const p = u.properties;
    // posição a confirmar no cadastro (susp): nunca maquete, nem como membro (fica o disco no ponto)
    return p.fase === 0 && entraNoNivel(p, nv.n) && ligadas.has(p.cat) && (!soHidro || p.cat === 'hidro') && !posicaoAConfirmar(p);
  });
  lista.sort((a, b) => b.properties.kw - a.properties.kw || idDaUsina(a) - idDaUsina(b));
  const tipos = lista.map((u) => maqueteDaUsina(u.properties));
  // grade em graus, com a célula do maior raio possível (no equador; a longitude folgada até 35°)
  const rMax = raioDoConjuntoM(nv, 0);
  const cLat = rMax / 110_574;
  const cLon = cLat / Math.cos(35 * RAD);
  const grade = new Map<string, number[]>();
  lista.forEach((u, i) => {
    const [lon, lat] = u.geometry.coordinates;
    const k = `${Math.floor(lon / cLon)}:${Math.floor(lat / cLat)}`;
    const g = grade.get(k);
    if (g) g.push(i);
    else grade.set(k, [i]);
  });
  const usada = new Uint8Array(lista.length);
  const saida: Conjunto[] = [];
  for (let i = 0; i < lista.length; i++) {
    if (usada[i]) continue;
    const s = lista[i];
    // não semeia (níveis 1 e 2): registro abaixo de 5 MW e grupo gerador a óleo abaixo de 30 MW
    // (o gerador do shopping e do banco não vira "+26 usinas"); de perto, os pisos de podeSemear.
    // Quem não semeia continua livre para entrar como membro
    if (!podeSemear(s.properties, nv.n)) continue;
    usada[i] = 1;
    const pos = s.geometry.coordinates;
    const r = raioDoConjuntoM(nv, pos[1]);
    const gx = Math.floor(pos[0] / cLon);
    const gy = Math.floor(pos[1] / cLat);
    const membros: Feature<Point, PropsUsina>[] = [];
    let mw = s.properties.kw / 1000;
    // leva 4, item 3: só a eólica e a solar formam conjunto (o cadastro reparte o parque em
    // registros); as demais fontes concorrem cada usina sozinha, pela própria potência
    if (FONTES_DO_CONJUNTO.has(s.properties.cat)) for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (const j of grade.get(`${gx + dx}:${gy + dy}`) ?? []) {
          // a mesma maquete E a mesma fonte do cadastro (COL-1: 'termeletrica' é o tipo de
          // várias fontes; óleo e "outros" juntos somavam MW de fontes diferentes)
          if (usada[j] || tipos[j] !== tipos[i] || lista[j].properties.cat !== s.properties.cat) continue;
          if (distM(pos, lista[j].geometry.coordinates) >= r) continue;
          usada[j] = 1;
          membros.push(lista[j]);
          mw += lista[j].properties.kw / 1000;
        }
      }
    }
    membros.sort((a, b) => b.properties.kw - a.properties.kw || idDaUsina(a) - idDaUsina(b));
    saida.push({ semente: s, tipo: tipos[i], membros, mw });
  }
  const gradeDosConjuntos = new Map<number, Conjunto[]>();
  for (const c of saida) {
    const [lon, lat] = c.semente.geometry.coordinates;
    const k = celula(Math.floor(lon / PASSO_DA_GRADE), Math.floor(lat / PASSO_DA_GRADE));
    const g = gradeDosConjuntos.get(k);
    if (g) g.push(c);
    else gradeDosConjuntos.set(k, [c]);
  }
  const pronto = { lista: saida, grade: gradeDosConjuntos };
  porChave.set(chave, pronto);
  return pronto;
}

// ── o resumo da escolha (o aviso de uma linha lê isto) ───────────────

export interface ResumoDaEscolha {
  /** há escolha neste enquadramento (zoom ≥ 9,4, maquetes ligadas, capítulo com maquete) */
  ativo: boolean;
  zoom: number;
  inclinacao: number;
  /** nível do centro da tela */
  nivel: number;
  /** raio de agrupamento do nível do centro, em km */
  R_km: number;
  D: number;
  teto: number;
  celular: boolean;
  /** usinas em operação de 1 MW ou mais na tela, com zoom efetivo ≥ 9,4 */
  usinasNaTela: number;
  mwNaTela: number;
  /** conjuntos de usinas candidatos (acima do piso de porte do nível) */
  conjuntos: number;
  /** conjuntos de usinas com maquete */
  comMaquete: number;
  redeComMaquete: number;
  anpComMaquete: number;
  torres: number;
  /** MW somados dos conjuntos com maquete */
  mwRepresentado: number;
  cortadosPeloTeto: number;
  cortadosPorEspaco: number;
  /** nomes dos itens forçados com o pé na área visível (a mesma população do N do aviso), com o motivo */
  forcados: { nome: string; motivo: MotivoDoForcado; porMembro?: boolean }[];
  /** câmera de cima: há aerogerador vencedor ou torre que só aparece de pé */
  deCima: boolean;
  /** satélite de perto: nenhuma maquete */
  satelitePerto: boolean;
  /** no capítulo do combustível, uma instalação da ANP tirou o lugar de uma usina */
  anpPrimeiro: boolean;
  /** ms da escolha (medido em atualizarMaquetes) */
  msDaEscolha?: number;
  /** recém-chegados adiados (entrada adiada, adiarEntrada): ficam no símbolo neste enquadramento
   *  e contam em "ficaram só no símbolo" */
  adiados?: number;
}

export type MotivoDoForcado = 'aula' | 'busca' | 'selecao';

export const RESUMO_INATIVO: ResumoDaEscolha = {
  ativo: false,
  zoom: 0,
  inclinacao: 0,
  nivel: 0,
  R_km: 0,
  D: 0,
  teto: 0,
  celular: false,
  usinasNaTela: 0,
  mwNaTela: 0,
  conjuntos: 0,
  comMaquete: 0,
  redeComMaquete: 0,
  anpComMaquete: 0,
  torres: 0,
  mwRepresentado: 0,
  cortadosPeloTeto: 0,
  cortadosPorEspaco: 0,
  forcados: [],
  deCima: false,
  satelitePerto: false,
  anpPrimeiro: false,
};

/** O resumo mais recente, para a interface (useSyncExternalStore). */
export const lojaDoResumo = (() => {
  let atual: ResumoDaEscolha = RESUMO_INATIVO;
  const ouvintes = new Set<() => void>();
  return {
    ler: (): ResumoDaEscolha => atual,
    assinar: (f: () => void) => {
      ouvintes.add(f);
      return () => {
        ouvintes.delete(f);
      };
    },
    definir: (r: ResumoDaEscolha) => {
      atual = r;
      for (const f of ouvintes) f();
    },
  };
})();

/** Uma usina do conjunto, como a ficha a lista (com o que a seleção precisa para abrir a ficha dela). */
export interface UsinaDoConjunto {
  ceg: string;
  nome: string;
  mw: number;
  props: Record<string, unknown>;
  lngLat: [number, number];
}

/** Um conjunto com maquete na tela: a semente primeiro, depois os membros (MW desc). */
export interface ConjuntoNaTela {
  usinas: UsinaDoConjunto[];
  mw: number;
  /** raio de agrupamento do nível do conjunto (km) */
  R_km: number;
}

/** Conjuntos com maquete no enquadramento corrente, por CEG de cada usina (semente ou membro). */
export const lojaDosConjuntos = (() => {
  let atual: ReadonlyMap<string, ConjuntoNaTela> = new Map();
  const ouvintes = new Set<() => void>();
  return {
    ler: (): ReadonlyMap<string, ConjuntoNaTela> => atual,
    assinar: (f: () => void) => {
      ouvintes.add(f);
      return () => {
        ouvintes.delete(f);
      };
    },
    definir: (m: ReadonlyMap<string, ConjuntoNaTela>) => {
      atual = m;
      for (const f of ouvintes) f();
    },
  };
})();

const inteiroBr = (v: number) => Math.round(v).toLocaleString('pt-BR');

/** O texto do aviso data-atlas="resumo-maquetes" (§1): uma linha, números do resumo. */
export function textoDoResumo(r: ResumoDaEscolha): string {
  if (!r.ativo) return '';
  if (r.satelitePerto) return 'Satélite de perto: a foto mostra a obra, sem maquete.';
  // UMA linha (decisão do orquestrador): quantas maquetes há na tela (usinas, subestações e
  // instalações da ANP com o pé na área visível; __atlas.maquetes().itens sem as torres e sem
  // o forçado fora dela) e quantas dessas mesmas famílias ficaram no símbolo à vista. O critério de agrupamento, o raio e o motivo do destaque moram em
  // "Como ler", na ficha e no anel; nunca aqui.
  const total = r.comMaquete + r.redeComMaquete + r.anpComMaquete;
  const cortados = r.cortadosPeloTeto + r.cortadosPorEspaco + (r.adiados ?? 0);
  if (total === 0) return cortados > 0 ? `Nenhuma maquete nesta tela · ${cortados} ${cortados === 1 ? 'ficou' : 'ficaram'} só no símbolo` : r.zoom < 10.5 ? 'Aproxime para ver as maquetes.' : 'Nenhuma maquete nesta tela.';
  // só o item pedido na tela (seleção, busca, aula) e nada cortado: a ficha e o anel já dizem
  if (total === 1 && r.forcados.length === 1 && cortados === 0) return '';
  const partes = [`${total} ${total === 1 ? 'maquete' : 'maquetes'} nesta tela`];
  if (cortados > 0) partes.push(`${cortados} ${cortados === 1 ? 'ficou' : 'ficaram'} só no símbolo`);
  if (r.deCima) partes.push('incline o mapa para ver de pé');
  return partes.join(' · ');
}

// ── a escolha ────────────────────────────────────────────────────────

export interface PedidoDeMaquetes {
  capitulo: CapituloId;
  camadas: ReadonlySet<CamadaId>;
  zoom: number;
  /** inclinação da câmera (graus) */
  inclinacao: number;
  /** rumo da câmera (graus do norte) */
  rumo: number;
  /** centro da tela [lon, lat] */
  centro: [number, number];
  /** [oeste, sul, leste, norte] do enquadramento (pré-filtro barato) */
  limites: [number, number, number, number];
  /** tamanho do mapa na tela, em px */
  largura: number;
  altura: number;
  /** altura sem a folha inferior do celular */
  alturaUtil: number;
  usinas: Feature<Point, PropsUsina>[];
  subestacoes: FeatureCollection | null;
  linhas: FeatureCollection | null;
  /** reservatórios do ONS (ponto): dão o lado de montante da hidrelétrica */
  reservatorios?: FeatureCollection | null;
  /** instalações da ANP (refinaria, GNL, UPGN, terminal) — capítulo O combustível */
  instalacoesCombustivel?: FeatureCollection | null;
  /** posição na tela (px) de um ponto (map.project) */
  projetar: (lon: number, lat: number) => [number, number];
  /** ids desenhados no enquadramento anterior (histerese) */
  anteriores?: ReadonlySet<string>;
  /** nível de cada id desenhado no enquadramento anterior (histerese de nível) */
  niveisAnteriores?: ReadonlyMap<string, number>;
  /** ids forçados (seleção, busca, destaque da aula), com o motivo */
  forcados?: ReadonlyMap<string, MotivoDoForcado>;
  /** retângulos de tela [x0, y0, x1, y1] cobertos pela casca (busca, controles, atribuição,
   *  ficha): nenhuma maquete nem o rótulo dela nasce sob eles (esconder pode, deslocar não) */
  zonasProibidas?: readonly [number, number, number, number][];
  /** tipo cujo modelo não carregou (camada3d.tipoIndisponivel): não é escolhido, e o item fica
   *  no símbolo 2D em vez de ficar sem símbolo nenhum (COL-4) */
  indisponivel?: (tipo: TipoDeMaquete) => boolean;
  /** false: escolha auxiliar (zoom vizinho da entrada adiada), que não escreve o diagnóstico de
   *  __atlas.motivos() (codigo.md 7) */
  diagnostico?: boolean;
}

/** Margem (px) de cada borda da área útil: a maquete e o rótulo dela não encostam na borda. */
export const MARGEM_DA_TELA = 16;
/** No celular cabem três rótulos permanentes (§8), e toda maquete em repouso tem rótulo: são
 *  três maquetes à vista. O item pedido (seleção, busca, aula) conta entre as três quando o pé
 *  dele está na área visível; sob a folha ou fora da tela não ocupa vaga. */
const ROTULOS_NO_CELULAR = 3;

/** Tamanho mínimo (px) em que cada modelo complexo lê; abaixo dele fica o símbolo 2D limpo
 *  (achados O2, O11 e 16: a subestação, a refinaria, a UPGN, a PCH e a usina de cana viravam
 *  rabisco de traço fino entre 38 e 56 px). O aerogerador, a solar e a térmica leem pequenos. */
const MINIMO_LEGIVEL: Partial<Record<TipoDeMaquete, number>> = {
  // a subestação: medido no mapa (r2: São Paulo, RN, Porto Alegre, Itaipu), entre 40 e 60 px o
  // pátio vira barra preta e caixinhas soltas. UM mecanismo: abaixo de 84 px fica o quadrado 2D
  // limpo; acima, o pátio com a laje (camada3d desenha a laje da rede em qualquer tamanho). A
  // lei da rede (ladoDaRede) não passa de 60 px: a maquete da subestação só vem pela escala
  // real (perto) ou pedida (seleção, busca, aula), e então no mínimo legível
  'subestacao-pequena': 84,
  subestacao: 84,
  'subestacao-grande': 84,
  'subestacao-no': 84,
  conversora: 72,
  pch: 56,
  'biomassa-cana': 56,
  // instalações da ANP: os tanques e as colunas só leem como massa acima destes tamanhos (r2:
  // RPBC e U-300 a 60–90 px eram emaranhado); o píer do GNL é um traço comprido e só lê de perto
  upgn: 76,
  'terminal-gnl': 110,
  refinaria: 96,
  'terminal-liquidos': 64,
};

export interface EscolhaDeMaquetes {
  pontos: PontoDeMaquete[];
  resumo: ResumoDaEscolha;
}

/** Caixa [oeste, sul, leste, norte] do traçado de uma linha, calculada uma vez por feição. */
const CAIXAS_DAS_LINHAS = new WeakMap<object, [number, number, number, number]>();
function caixaDaLinha(f: { geometry: unknown }): [number, number, number, number] {
  const ja = CAIXAS_DAS_LINHAS.get(f);
  if (ja) return ja;
  const g = f.geometry as LineString | MultiLineString | null;
  const partes: Position[][] = !g ? [] : g.type === 'LineString' ? [g.coordinates] : g.type === 'MultiLineString' ? g.coordinates : [];
  const c: [number, number, number, number] = [Infinity, Infinity, -Infinity, -Infinity];
  for (const linha of partes)
    for (const [x, y] of linha) {
      if (x < c[0]) c[0] = x;
      if (y < c[1]) c[1] = y;
      if (x > c[2]) c[2] = x;
      if (y > c[3]) c[3] = y;
    }
  CAIXAS_DAS_LINHAS.set(f, c);
  return c;
}

/** Vão típico de linha de transmissão (m): o passo das torres é este vezes uma potência de 2. */
const VAO = 450;
/** Distância mínima entre torres vizinhas na tela (px). */
const PX_ENTRE_TORRES = 160;
const TORRES_POR_LINHA = 3;
const TETO_DE_TORRES: [number, number] = [12, 4];
const ZEF_DAS_TORRES = 13;
const cruza = (a: Caixa, b: Caixa, folga = 0) => a[0] - folga < b[2] + folga && b[0] - folga < a[2] + folga && a[1] - folga < b[3] + folga && b[1] - folga < a[3] + folga;

/** Caixa de tela prevista de um modelo de medidas [X, Y, Z] (m), rumo r, câmera com rumo B e
 *  inclinação i, desenhado com s px por metro do modelo, com o pé em pe. A base do modelo
 *  está centrada no pé; a altura sobe na tela por sen(i), a profundidade encolhe por cos(i). */
function caixaDoModelo(d: [number, number, number], s: number, rumo: number, B: number, incl: number, pe: [number, number]): { caixa: Caixa; meiaProf: number } {
  const a = (rumo - B) * RAD;
  const ca = Math.abs(Math.cos(a));
  const sa = Math.abs(Math.sin(a));
  const hx = s * ((d[0] / 2) * ca + (d[1] / 2) * sa);
  const hy = s * ((d[0] / 2) * sa + (d[1] / 2) * ca) * Math.cos(incl * RAD);
  const h = s * d[2] * Math.sin(incl * RAD);
  return { caixa: [pe[0] - hx, pe[1] - hy - h, pe[0] + hx, pe[1] + hy], meiaProf: hy };
}

/** Corpo (px na tela) do rótulo do vencedor, pelo L. Leva 4, item 5: o rótulo de conjunto tem a
 *  segunda linha ("+22 parques · 698 MW"), que saía com ~9 px; ele vai a 12 px no mínimo, e a
 *  segunda linha sai no mesmo corpo do nome (o controle tira a redução de 0,92). */
const corpoDoRotulo = (familia: FamiliaDaMaquete, L: number, conjunto: boolean) => (familia === 'rede' ? 10 : Math.max(conjunto ? 12 : 0, L < 60 ? 11 : L <= 100 ? 12 : 13));

const formatarMW = (mw: number) => (mw >= 100 ? inteiroBr(mw) : mw.toLocaleString('pt-BR', { maximumFractionDigits: 1 }));

/** Escolhe o que ganha maquete no enquadramento corrente (§11 da especificação). */
export function escolherMaquetes(pedido: PedidoDeMaquetes): EscolhaDeMaquetes {
  const { capitulo, camadas, zoom, inclinacao: incl, rumo: B, largura, alturaUtil, projetar } = pedido;
  const on = (c: CamadaId) => camadas.has(c);
  const celular = largura < LARGURA_DO_CELULAR;
  const satelite = on('satelite');
  const satelitePerto = satelite && zoom >= ZOOM_SEM_MAQUETE_NO_SATELITE;
  const deCimaAgora = incl < INCLINACAO_DE_PE;
  const vazio = (): EscolhaDeMaquetes => ({ pontos: [], resumo: { ...RESUMO_INATIVO, zoom, inclinacao: incl } });
  // a troca 2D → 3D é guiada pelo zoom do centro: abaixo de 9,4 nada é desenhado em 3D, então
  // nada é escolhido (o disco da semente não pode sumir sem a maquete no lugar)
  if (zoom < ZOOM_DAS_MAQUETES) return vazio();

  // escala no ponto: px por metro na direção horizontal da tela (a perpendicular ao rumo da
  // câmera), sem o encurtamento da inclinação. Cache por ponto nesta chamada.
  const cosB = Math.cos(B * RAD);
  const sinB = Math.sin(B * RAD);
  const medir = (lon: number, lat: number, soNaTela = false): { pe: [number, number]; k: number } | null => {
    const pe = projetar(lon, lat);
    if (!Number.isFinite(pe[0]) || !Number.isFinite(pe[1])) return null;
    // fora da tela não precisa da escala (a segunda projeção é metade do custo da escolha)
    if (soNaTela && !naTelaComMargem(pe)) return null;
    const mLon = 111_320 * Math.cos(lat * RAD);
    const q = projetar(lon + (50 * cosB) / mLon, lat - (50 * sinB) / 110_574);
    const k = Math.hypot(q[0] - pe[0], q[1] - pe[1]) / 50;
    if (!Number.isFinite(k) || k <= 0) return null;
    return { pe, k };
  };
  const altura = pedido.altura;
  const mx = largura * 0.04;
  const my = altura * 0.04;
  const naTelaComMargem = (pe: [number, number]) => pe[0] >= -mx && pe[0] <= largura + mx && pe[1] >= -my && pe[1] <= altura + my;
  const centro = medir(pedido.centro[0], pedido.centro[1]);
  if (!centro) return vazio();
  const kC = centro.k;
  const naTelaUtil = (pe: [number, number]) => pe[0] >= 0 && pe[0] <= largura && pe[1] >= 0 && pe[1] <= alturaUtil;
  const [oeste, sul, leste, norte] = pedido.limites;
  const mLon = (leste - oeste) * 0.04;
  const mLat = (norte - sul) * 0.04;
  const dentroDosLimites = (lon: number, lat: number) => lon >= oeste - mLon && lon <= leste + mLon && lat >= sul - mLat && lat <= norte + mLat;
  const memo = new Map<string | number, { pe: [number, number]; k: number; zEf: number } | null>();
  const noPonto = (chave: string | number, lon: number, lat: number) => {
    if (memo.has(chave)) return memo.get(chave) ?? null;
    let r: { pe: [number, number]; k: number; zEf: number } | null = null;
    if (dentroDosLimites(lon, lat)) {
      const m = medir(lon, lat, true);
      if (m) r = { ...m, zEf: zoom + Math.log2(m.k / kC) };
    }
    memo.set(chave, r);
    return r;
  };

  const anteriores = pedido.anteriores ?? new Set<string>();
  const niveisAnteriores = pedido.niveisAnteriores ?? new Map<string, number>();
  /** Nível de um item no zoom efetivo dele, com histerese: quem estava desenhado num nível
   *  vizinho e cruzou a fronteira por menos de HISTERESE_DE_NIVEL fica no nível de antes (sem
   *  isso, no fundo de uma vista inclinada, cada pequeno zoom trocava o piso de porte de
   *  meia tela). Nunca abaixo de 9,4: lá não há maquete. */
  const nivelComHisterese = (id: string, zEf: number): 0 | 1 | 2 | 3 | 4 => {
    const agora = nivelDe(zEf);
    const antes = niveisAnteriores.get(id);
    if (agora === 0 || antes == null || antes === agora || Math.abs(antes - agora) !== 1) return agora;
    const fronteira = NIVEIS[Math.max(antes, agora) - 1].zMin;
    return Math.abs(zEf - fronteira) < HISTERESE_DE_NIVEL ? (antes as 1 | 2 | 3 | 4) : agora;
  };
  const forcados = pedido.forcados ?? new Map<string, MotivoDoForcado>();
  const fatorTeto = satelite ? FATOR_DO_SATELITE : 1;

  interface Candidato {
    p: Omit<PontoDeMaquete, 'L' | 'Llei' | 'metros' | 'caixa' | 'rotulo' | 'prio' | 'histerese' | 'forcado' | 'deCima' | 'semModelo' | 'rotorGira'>;
    medidas: [number, number, number];
    Llei: number;
    prio: number;
    motivo?: MotivoDoForcado;
    porMembro?: boolean;
    /** casas significativas da coordenada na fonte (campo `prec`), se o arquivo o traz */
    prec?: number | null;
    /** contém a maior usina da área útil (leva 4, item 4) */
    maior?: boolean;
  }
  const candidatos: Candidato[] = [];
  let usinasNaTela = 0;
  let mwNaTela = 0;
  let conjuntosCandidatos = 0;

  // 1. usinas: conjuntos de cada nível cuja semente cai naquele nível
  const cats = (['hidro', 'eolica', 'solar', 'nuclear', 'biomassa', 'gas', 'carvao', 'oleo', 'outros'] as const).filter((c) => on(c));
  const soHidro = capitulo === 'agua';
  const usinaForcada = new Map<number, MotivoDoForcado>();
  for (const [id, motivo] of forcados) if (id.startsWith('usina:')) usinaForcada.set(Number(id.slice(6)), motivo);
  const sementes = new Set<number>();
  /** usinas forçadas representadas pelo conjunto de que são membro */
  const forcadoNoConjunto = new Set<number>();
  // achado 12: o ponto do reservatório do ONS não é o eixo do barramento (em Itaipu a barragem
  // saía ao longo do rio, girada pela direção usina → reservatório). Decisão 4 da onda 2: onde o
  // construtor de dados derivou o rumo da borda do reservatório mapeado pela ANA (com o teste da
  // água), a barragem segue esse rumo; nas demais fica o rumo convencional do modelo
  // (leste–oeste), declarado em "Como ler" e na ficha.
  const rumoDaUsina = (u: Feature<Point, PropsUsina>, tipo: TipoDeMaquete) => {
    // leva 4, item 2: o rotor a três quartos da câmera (camada3d.ts refaz isto a cada quadro com
    // o rumo vivo da câmera; aqui é o da escolha, para a caixa prevista)
    if (tipo === 'aerogerador') return rumoDoAerogerador(B);
    const rB = rumoDaBarragem(u.properties);
    return rB != null && (tipo === 'hidreletrica' || tipo === 'hidreletrica-grande' || tipo === 'pch') ? rB : (MODELOS[tipo].giro ?? 0);
  };
  const candidatoDeUsina = (u: Feature<Point, PropsUsina>, tipo: TipoDeMaquete, membros: Feature<Point, PropsUsina>[], mwConj: number, nv: Nivel, m: { pe: [number, number]; k: number; zEf: number }): Candidato | null => {
    const medidas = medidasDo(tipo);
    if (!medidas) return null;
    const [lon, lat] = u.geometry.coordinates;
    const fid = idDaUsina(u);
    return {
      p: {
        id: `usina:${fid}`,
        tipo,
        familia: 'usina',
        lon,
        lat,
        rumo: rumoDaUsina(u, tipo),
        zoomDaEscolha: zoom,
        k: m.k,
        nome: u.properties.nome,
        cat: u.properties.cat,
        mw: u.properties.kw / 1000,
        mwConjunto: mwConj,
        ceg: u.properties.ceg,
        membros: membros.map((x) => ({ id: `usina:${idDaUsina(x)}`, ceg: x.properties.ceg, nome: x.properties.nome, mw: x.properties.kw / 1000, lon: x.geometry.coordinates[0], lat: x.geometry.coordinates[1] })),
        nivel: nv.n,
        zEf: m.zEf,
        pe: m.pe,
        origem: { fonte: 'usinas', id: fid },
      },
      medidas,
      // achado 11: no zoom de troca o conjunto do nível 1 soma centenas de MW e o aerogerador
      // saía com 110–130 px, maior que de perto (~90 a 11): de longe ele nunca passa do teto
      // do nível, que só cresce ao aproximar
      Llei: Math.min(naTela(ladoPelaPotencia(tipo, mwConj), celular), tipo === 'aerogerador' ? TETO_DO_AEROGERADOR[nv.n] : Infinity),
      prio: mwConj,
      motivo: usinaForcada.get(fid),
      prec: precDe(u.properties),
    };
  };
  if (cats.length && (capitulo === 'rede' || capitulo === 'agua' || capitulo === 'combustivel')) {
    const gx0 = Math.floor((oeste - mLon) / PASSO_DA_GRADE);
    const gx1 = Math.floor((leste + mLon) / PASSO_DA_GRADE);
    const gy0 = Math.floor((sul - mLat) / PASSO_DA_GRADE);
    const gy1 = Math.floor((norte + mLat) / PASSO_DA_GRADE);
    for (const nv of NIVEIS) {
      // nível que nenhum ponto da tela alcança não é calculado (o primeiro agrupamento custa)
      const zMax = NIVEIS[nv.n]?.zMin ?? Infinity;
      if (nv.zMin > zoom + 1.5 || zMax < zoom - 3) continue;
      const { grade } = conjuntosDo(nv, pedido.usinas, cats, soHidro);
      const noEnquadramento: Conjunto[] = [];
      // COL-3: a grade é pela célula da SEMENTE; uma semente fora da tela pode ter membros
      // dentro dela (o conjunto refeito abaixo). Folga de células pelo maior raio do nível,
      // para isso não depender de onde cai a linha de 0,25° (os a mais saem por noPonto)
      const folga = Math.ceil(raioDoConjuntoM(nv, 0) / 110_574 / Math.cos(35 * RAD) / PASSO_DA_GRADE);
      for (let gx = gx0 - folga; gx <= gx1 + folga; gx++) for (let gy = gy0 - folga; gy <= gy1 + folga; gy++) for (const c of grade.get(celula(gx, gy)) ?? []) noEnquadramento.push(c);
      for (const c0 of noEnquadramento) {
        let c = c0;
        let fid = idDaUsina(c.semente);
        let m = noPonto(fid, c.semente.geometry.coordinates[0], c.semente.geometry.coordinates[1]);
        // achado 3: de perto a semente sai da tela e o conjunto inteiro virava confete de
        // discos (longe 12 maquetes, perto 1). O membro maior que ficou na tela e pode semear
        // é promovido a semente de um conjunto refeito para este enquadramento, com os membros
        // na tela a menos de R dele (a mesma regra, sem encadear; ninguém sai do ponto)
        if ((!m || !naTelaUtil(m.pe)) && c.membros.length) {
          const r = raioDoConjuntoM(nv, c.semente.geometry.coordinates[1]);
          const naTela = c.membros.filter((u) => {
            const q = noPonto(idDaUsina(u), u.geometry.coordinates[0], u.geometry.coordinates[1]);
            return !!q && naTelaUtil(q.pe);
          });
          const s2 = naTela.find((u) => podeSemear(u.properties, nv.n) && (nv.n > 2 || u.properties.kw / 1000 >= MW_DA_SEMENTE));
          if (s2) {
            const membros = naTela.filter((u) => u !== s2 && distM(s2.geometry.coordinates, u.geometry.coordinates) < r);
            c = { semente: s2, tipo: c.tipo, membros, mw: (s2.properties.kw + membros.reduce((s, u) => s + u.properties.kw, 0)) / 1000 };            fid = idDaUsina(s2);
            m = noPonto(fid, s2.geometry.coordinates[0], s2.geometry.coordinates[1]);
          }
        }
        if (!m || nivelComHisterese(`usina:${fid}`, m.zEf) !== nv.n) continue;
        // conta na tela (a semente e os membros) antes do piso de porte
        if (naTelaUtil(m.pe)) {
          usinasNaTela += 1 + c.membros.length;
          mwNaTela += c.mw;
        }
        // o item pedido (seleção, busca, aula) que é MEMBRO de um conjunto força o conjunto:
        // ele já está representado ali, no disco dele; ganhar maquete própria empurraria a
        // semente e desmancharia o conjunto
        let motivo = usinaForcada.get(fid);
        let porMembro = false;
        if (!motivo && usinaForcada.size) {
          for (const mb of c.membros) {
            const mo = usinaForcada.get(idDaUsina(mb));
            if (mo) {
              motivo = mo;
              porMembro = true;
              forcadoNoConjunto.add(idDaUsina(mb));
              break;
            }
          }
        }
        if (c.mw < nv.pisoMW && !motivo) continue;
        // piso de porte por unidade, SÓ no nível 2: sozinha, 30 MW; agrupamento, semente de 10 MW.
        // De perto (3 e 4) vale o piso da semente (podeSemear), decisão 1 da onda 2
        if (!motivo && nv.n === 2 && (c.membros.length ? c.semente.properties.kw / 1000 < MW_DA_SEMENTE : c.mw < MW_DA_USINA_SOZINHA)) continue;
        const cand = candidatoDeUsina(c.semente, c.tipo, c.membros, c.mw, nv, m);
        if (!cand) continue;
        cand.motivo = motivo;
        cand.porMembro = porMembro;
        candidatos.push(cand);
        sementes.add(fid);
        conjuntosCandidatos++;
      }
    }
    // usina forçada que não é semente: entra sozinha, no ponto dela
    if (usinaForcada.size) {
      for (const u of pedido.usinas) {
        const fid = idDaUsina(u);
        if (!usinaForcada.has(fid) || sementes.has(fid) || forcadoNoConjunto.has(fid)) continue;
        const p = u.properties;
        if (p.fase !== 0 || !cats.includes(p.cat as (typeof cats)[number]) || (soHidro && p.cat !== 'hidro') || posicaoAConfirmar(p)) continue;
        const [lon, lat] = u.geometry.coordinates;
        const m = noPonto(fid, lon, lat);
        if (!m) continue;
        const n = nivelDe(m.zEf);
        if (n === 0) continue;
        const cand = candidatoDeUsina(u, maqueteDaUsina(p), [], p.kw / 1000, NIVEIS[n - 1], m);
        if (cand) candidatos.push(cand);
      }
    }
  }

  // 1b. leva 4, item 4 (coerência com o painel): se a tela desenha alguma maquete de usina, a
  //     MAIOR usina em operação da área útil tem maquete (a primeira de "As maiores desta tela"),
  //     salvo motivo declarado em __atlas.motivos() (chave "maior"): posição a confirmar, aquém do
  //     zoom das maquetes, coordenada imprecisa, sob a casca ou na borda. O item que a contém
  //     (ela mesma, ou o conjunto eólico/solar de que é membro) entra na fila logo depois dos
  //     forçados e sobe ao mínimo legível; se nenhum candidato a contém (porte abaixo do piso do
  //     nível), ela entra sozinha, no ponto dela, desde que haja outra usina candidata.
  let maiorDeclarada: string | null = null;
  const maior = cats.length && (capitulo === 'rede' || capitulo === 'agua' || capitulo === 'combustivel') ? maiorDaTela(pedido.usinas, cats, soHidro, dentroDosLimites, noPonto, naTelaUtil) : null;
  if (maior) {
    const fid = idDaUsina(maior.u);
    const id = `usina:${fid}`;
    const p = maior.u.properties;
    const rotulo = `${id} ${p.nome ?? ''} ${formatarMW(p.kw / 1000)} MW`;
    const n = nivelComHisterese(id, maior.m.zEf);
    if (posicaoAConfirmar(p)) maiorDeclarada = `${rotulo}: posição a confirmar`;
    else if (n === 0) maiorDeclarada = `${rotulo}: aquém do zoom das maquetes (zEf ${maior.m.zEf.toFixed(2)})`;
    else {
      const contem = candidatos.find((c) => c.p.id === id || c.p.membros.some((mb) => mb.id === id));
      // em todos os que a contêm (o mesmo parque pode ser semente num nível e membro noutro): o
      // primeiro entra, o outro sai por "já contada"
      for (const c of candidatos) {
        if (c.p.id === id || c.p.membros.some((mb) => mb.id === id)) c.maior = true;
      }
      if (!contem && candidatos.some((c) => c.p.familia === 'usina')) {
        const cand = candidatoDeUsina(maior.u, maqueteDaUsina(p), [], p.kw / 1000, NIVEIS[n - 1], maior.m);
        if (cand) {
          cand.maior = true;
          candidatos.push(cand);
        }
      }
      maiorDeclarada = `${rotulo}: candidata${contem && contem.p.id !== id ? ` (no conjunto de ${contem.p.nome ?? contem.p.id})` : ''}`;
    }
  }

  // 2. subestações (capítulo da rede): não agregam; prioridade pela tensão
  if (capitulo === 'rede' && on('subestacoes') && pedido.subestacoes) {
    const info = infoDasSubestacoes(pedido.subestacoes, pedido.linhas);
    pedido.subestacoes.features.forEach((f, i) => {
      const pr = f.properties as PropsSubestacao;
      if (pr.op == null && pr.opAntesDe == null && pr.prev != null) return; // ainda não existe
      // posição a confirmar (susp): nunca maquete, como a usina; fica o símbolo no ponto
      if (propsAConfirmar(pr)) return;
      const fid = typeof f.id === 'number' ? f.id : i + 1;
      const id = `se:${fid}`;
      const [lon, lat] = (f.geometry as Point).coordinates;
      const m = noPonto(id, lon, lat);
      if (!m) return;
      const n = nivelComHisterese(id, m.zEf);
      if (n === 0) return;
      const nv = NIVEIS[n - 1];
      const inf = info[i];
      const motivo = forcados.get(id);
      if (!inf.conversora && !motivo) {
        if (inf.kv == null ? !nv.semKv : inf.kv < nv.kvMin) return;
      }
      const tipo = maqueteDaSubestacao(inf);
      const medidas = medidasDo(tipo);
      if (!medidas) return;
      const prio = inf.conversora ? 1500 : inf.kv == null ? 3 : 300 * (inf.kv / 500) ** 2;
      candidatos.push({
        p: { id, tipo, familia: 'rede', lon, lat, rumo: inf.rumo ?? 0, zoomDaEscolha: zoom, k: m.k, nome: pr.n ?? null, cat: null, mw: null, mwConjunto: null, membros: [], nivel: nv.n, zEf: m.zEf, pe: m.pe, origem: { fonte: 'subestacoes', id: fid }, kv: inf.kv },
        medidas,
        Llei: naTela(ladoDaRede(tipo, inf.kv), celular),
        prio,
        motivo,
        prec: precDe(pr),
      });
    });
  }

  // 3. instalações da ANP (capítulo do combustível): não agregam; do nível 2 em diante
  if (capitulo === 'combustivel' && pedido.instalacoesCombustivel) {
    for (const f of pedido.instalacoesCombustivel.features) {
      if (f.geometry?.type !== 'Point') continue;
      const pr = (f.properties ?? {}) as { tipo?: string; sit?: string | null; nome?: string; rotulo?: string };
      const tipoAnp = pr.tipo ?? '';
      const tipo = MAQUETE_DA_INSTALACAO[tipoAnp];
      if (!tipo || !on(CAMADA_DA_INSTALACAO[tipoAnp])) continue;
      // só o que a fonte diz que opera (a situação, quando a fonte a traz)
      if (pr.sit && !/opera/i.test(pr.sit)) continue;
      if (propsAConfirmar(pr)) continue;
      const fid = typeof f.id === 'number' ? f.id : Number(f.id);
      const id = `anp:${fid}`;
      const [lon, lat] = (f.geometry as Point).coordinates;
      const m = noPonto(id, lon, lat);
      if (!m) continue;
      const n = nivelComHisterese(id, m.zEf);
      const motivo = forcados.get(id);
      if (n === 0 || (!NIVEIS[n - 1].anp && !motivo)) continue;
      const medidas = medidasDo(tipo);
      if (!medidas) continue;
      candidatos.push({
        p: { id, tipo, familia: 'anp', lon, lat, rumo: MODELOS[tipo].giro ?? 0, zoomDaEscolha: zoom, k: m.k, nome: pr.rotulo ?? pr.nome ?? null, cat: null, mw: null, mwConjunto: null, membros: [], nivel: NIVEIS[n - 1].n, zEf: m.zEf, pe: m.pe, origem: Number.isFinite(fid) ? { fonte: 'instalacoes', id: fid } : undefined },
        medidas,
        Llei: naTela(LADO_DA_ANP[tipo] ?? 48, celular),
        prio: PESO_DA_INSTALACAO[tipoAnp] ?? 50,
        motivo,
        prec: precDe(pr),
      });
    }
  }

  // 4. a fila única: tamanho, caixa, histerese e forçados; depois a escolha gulosa na tela
  interface Avaliado {
    c: Candidato;
    L: number;
    s: number;
    caixa: Caixa;
    meiaProf: number;
    prio: number;
    hist: boolean;
    forcado: boolean;
  }
  const avaliados: Avaliado[] = candidatos.map((c) => {
    const dimMax = Math.max(...c.medidas);
    // a escala real só vence perto; o mínimo legível do tipo é PISO do tamanho (decisão 1 da
    // onda 2: de perto o item cresce até ele em vez de ser recusado) para usinas e instalações
    // da ANP do nível 3 em diante e para a rede do nível 4 em diante (no 12 e no 13 a subestação
    // de 84 px ficaria maior que a usina de 30 MW, ~44 px: a rede fica um degrau abaixo). O item
    // pedido (seleção, busca, aula) sobe até ele em qualquer nível
    const comPiso = !!c.motivo || !!c.maior || (c.p.familia === 'rede' ? c.p.nivel >= 4 : c.p.nivel >= 3);
    const L = Math.max(c.Llei, dimMax * c.p.k, comPiso ? (MINIMO_LEGIVEL[c.p.tipo] ?? 0) : 0);
    const s = L / dimMax;
    const { caixa, meiaProf } = caixaDoModelo(c.medidas, s, c.p.rumo, B, incl, c.p.pe);
    const hist = anteriores.has(c.p.id);
    const forcado = !!c.motivo;
    const prio = forcado ? PRIO_FORCADO + c.prio : c.maior ? PRIO_DA_MAIOR + c.prio : c.prio * (hist ? HISTERESE_PRIO : 1);
    return { c, L, s, caixa, meiaProf, prio, hist, forcado };
  });
  avaliados.sort((a, b) => b.prio - a.prio || b.L - a.L || (a.c.p.id < b.c.p.id ? -1 : a.c.p.id > b.c.p.id ? 1 : 0));

  const aceitos: Avaliado[] = [];
  const porNivel = [0, 0, 0, 0, 0];
  let cortadosPeloTeto = 0;
  let cortadosPorEspaco = 0;
  let anpPrimeiro = false;
  // codigo.md 7: só a escolha da TELA escreve o diagnóstico (a entrada adiada roda a escolha nos
  // zooms vizinhos com diagnostico: false; antes o mapa ficava com os motivos de z + 0,15). O
  // texto leva o zEf do candidato (o A15 da bancada classifica o nível 4 por ele, codigo.md 9)
  const diagnostico = DEPURAR && pedido.diagnostico !== false;
  const motivo = diagnostico ? (x: Avaliado, m: string) => MOTIVOS_DA_ESCOLHA.set(x.c.p.id, `${x.c.p.nome ?? ''} n${x.c.p.nivel} zEf ${x.c.p.zEf.toFixed(2)} prio ${Math.round(x.prio)}: ${m}`) : () => undefined;
  if (diagnostico) {
    MOTIVOS_DA_ESCOLHA.clear();
    if (maiorDeclarada) MOTIVOS_DA_ESCOLHA.set('maior', maiorDeclarada);
  }
  // área livre: a tela útil menos a margem, e as zonas da casca (infladas 4 px)
  const livre: Caixa = [MARGEM_DA_TELA, MARGEM_DA_TELA, largura - MARGEM_DA_TELA, alturaUtil - MARGEM_DA_TELA];
  const zonas: Caixa[] = (pedido.zonasProibidas ?? []).map((z) => [z[0] - 4, z[1] - 4, z[2] + 4, z[3] + 4]);
  /** Caixa da maquete somada à do rótulo previsto (abaixo dela, centrado no pé). */
  const caixaComRotulo = (x: Avaliado): Caixa => {
    const p = x.c.p;
    const tam = corpoDoRotulo(p.familia, x.L, p.membros.length > 0);
    const nome = encurtarNome(p.nome ?? '');
    const chars = Math.max(Math.min(nome.length, 22), p.membros.length ? 20 : 0);
    const meia = (chars * tam * 0.55) / 2;
    const linhas = (nome.length > 22 ? 2 : 1) + (p.membros.length ? 1 : 0);
    const fundo = x.caixa[3] + 8 + linhas * tam * 1.2;
    return [Math.min(x.caixa[0], p.pe[0] - meia), x.caixa[1], Math.max(x.caixa[2], p.pe[0] + meia), fundo];
  };
  const dentro = (c: Caixa, f: Caixa) => c[0] >= f[0] && c[1] >= f[1] && c[2] <= f[2] && c[3] <= f[3];
  /** ids das usinas (semente e membros) de um candidato de usina: a mesma usina nunca conta duas vezes */
  const usinasDe = (x: Avaliado): Set<string> => new Set(x.c.p.familia === 'usina' ? [x.c.p.id, ...x.c.p.membros.map((m) => m.id)] : []);
  const idsAceitos = new Map<Avaliado, Set<string>>();
  /** O símbolo 2D do item está à vista: pé na área útil (fora da folha do celular) e fora das
   *  zonas da casca. Só esses contam em "k ficaram só no símbolo" (COL-5 / HON-7). */
  const simboloAVista = (x: Avaliado) => naTelaUtil(x.c.p.pe) && !zonas.some((z) => x.c.p.pe[0] >= z[0] && x.c.p.pe[0] <= z[2] && x.c.p.pe[1] >= z[1] && x.c.p.pe[1] <= z[3]);
  for (const x of avaliados) {
    const nv = NIVEIS[x.c.p.nivel - 1];
    if (pedido.indisponivel?.(x.c.p.tipo)) {
      motivo(x, 'modelo não carregou');
      continue;
    }
    const minimo = MINIMO_LEGIVEL[x.c.p.tipo];
    if (!x.forcado && minimo && x.L < minimo) {
      motivo(x, `abaixo do mínimo legível (${Math.round(x.L)} < ${minimo} px)`);
      continue;
    }
    if (!x.forcado) {
      // COL-5: pé fora da área útil antes da caixa (sem contar: o símbolo dele não está à vista)
      if (!naTelaUtil(x.c.p.pe)) {
        motivo(x, 'pé fora da área útil');
        continue;
      }
      // B5: maquete em repouso sempre tem rótulo; sem nome não há rótulo, então não é escolhida
      if (!encurtarNome(x.c.p.nome ?? '')) {
        motivo(x, 'sem nome para o rótulo');
        continue;
      }
      const cr = caixaComRotulo(x);
      if (!dentro(cr, livre) || zonas.some((z) => cruza(cr, z))) {
        motivo(x, 'sob a casca ou na borda');
        if (simboloAVista(x)) cortadosPorEspaco++;        continue;
      }
    }
    // dupla contagem: a semente ou um membro deste já está num conjunto aceito (o N3 perto da
    // câmera cuja semente é membro de um N2 aceito, e o contrário)
    const minhas = usinasDe(x);
    if (minhas.size) {
      const repetidos = [...idsAceitos].filter(([, ids]) => [...minhas].some((id) => ids.has(id))).map(([y]) => y);
      if (repetidos.length) {
        if (!x.forcado || repetidos.some((y) => y.forcado)) {
          motivo(x, `já contada em ${repetidos.map((y) => y.c.p.nome ?? y.c.p.id).join(', ')}`);
          continue;
        }
        for (const y of repetidos) {
          aceitos.splice(aceitos.indexOf(y), 1);
          idsAceitos.delete(y);
          porNivel[y.c.p.nivel]--;
        }
      }
    }
    if (!x.forcado) {
      // a coordenada tem precisão para a maquete? (o erro dela não passa da metade dela no chão)
      if (erroDaCoordenadaM(x.c.p.lon, x.c.p.lat, x.c.prec) > (x.L / x.c.p.k) * 0.5) {
        // a bancada (A15) separa a recusa pela precisão da fonte (legítima) da recusa pelo texto
        // do número (o arquivo ainda sem `prec`)
        motivo(x, `coordenada imprecisa (${x.c.prec != null ? `prec ${x.c.prec} na fonte` : 'texto do número, sem prec'})`);
        continue;
      }
      if (porNivel[nv.n] >= Math.floor(nv.teto[celular ? 1 : 0] * fatorTeto)) {
        if (simboloAVista(x)) cortadosPeloTeto++;
        motivo(x, 'teto');
        continue;
      }
      // B5: no celular só cabem RÓTULOS_NO_CELULAR rótulos permanentes; maquete sem rótulo
      // não é escolhida (antes a quarta saía muda)
      if (celular && aceitos.filter((y) => !y.forcado || naTelaUtil(y.c.p.pe)).length >= ROTULOS_NO_CELULAR) {
        if (simboloAVista(x)) cortadosPeloTeto++;
        motivo(x, 'rótulos do celular');
        continue;
      }
    }
    const colide = (y: Avaliado) => {
      const D = Math.min(nv.D, NIVEIS[y.c.p.nivel - 1].D);
      const dmin = distanciaMinima(D, x.L, y.L) * (x.hist ? HISTERESE_D : 1);
      const d = Math.hypot(x.c.p.pe[0] - y.c.p.pe[0], x.c.p.pe[1] - y.c.p.pe[1]);
      return d < dmin || cruza(x.caixa, y.caixa, FOLGA_DA_CAIXA);
    };
    const conflito = aceitos.filter(colide);
    if (conflito.length) {
      if (!x.forcado) {
        motivo(x, `espaço com ${conflito.map((y) => y.c.p.nome ?? y.c.p.id).join(', ')}`);
        if (simboloAVista(x)) cortadosPorEspaco++;
        if (x.c.p.familia === 'usina' && conflito.some((y) => y.c.p.familia === 'anp')) anpPrimeiro = true;
        continue;
      }
      // o forçado empurra: sai quem colide com ele (menos outro forçado)
      for (const y of conflito) {
        if (y.forcado) continue;
        aceitos.splice(aceitos.indexOf(y), 1);
        idsAceitos.delete(y);
        porNivel[y.c.p.nivel]--;
        if (simboloAVista(y)) cortadosPorEspaco++;
      }
    }
    aceitos.push(x);
    if (minhas.size) idsAceitos.set(x, minhas);
    porNivel[nv.n]++;
    motivo(x, x.hist ? 'aceito (histerese)' : 'aceito');
  }

  // 5. rótulos dos vencedores: abaixo da caixa, no corpo pelo L
  // B5: todo vencedor tem rótulo (no celular a escolha já parou em ROTULOS_NO_CELULAR)
  const comRotulo = new Set(aceitos);
  const pontos: PontoDeMaquete[] = [];
  const caixasDeRotulo: Caixa[] = [];
  for (const x of aceitos) {
    const p = x.c.p;
    const tam = corpoDoRotulo(p.familia, x.L, p.membros.length > 0);
    // o Mapbox escala o texto de tela pela perspectiva (0,5 + 0,5 · distância ao centro /
    // distância ao ponto); a escala no ponto dá a mesma razão
    const q = p.k / kC;
    const razao = Math.min(1.5, 0.5 + 0.5 * q);
    // a maquete tem L px no ponto em qualquer profundidade; o rótulo dela também: o corpo
    // pedido ao Mapbox é dividido pela escala de perspectiva que ele vai aplicar (sem isso o
    // nome do fundo da tela saía com 7 px sob uma maquete de 44)
    const tamTela = tam / razao;
    // vão medido no render (A4: topo do rótulo 2–12 px abaixo da caixa desenhada): perto da
    // câmera o modelo desenhado desce uns px além da caixa prevista (o controle corrige pela
    // caixa medida assim que o modelo é desenhado)
    const vao = 6.5 + 4 * Math.max(0, q - 1);
    const off = (x.meiaProf + vao) / tam;
    let linha2 = '';
    if (p.membros.length) {
      const n = p.membros.length;
      // HON-10: cada membro é um registro próprio do cadastro, que o chama de usina (nunca
      // "unidade", que sugeria unidades geradoras da semente)
      const palavra = p.cat === 'eolica' ? (n === 1 ? 'parque' : 'parques') : n === 1 ? 'usina' : 'usinas';
      // uma linha só: com o corpo cheio (leva 4, item 5) o Mapbox quebrava "+15 parques · / 421 MW"
      // (ele equilibra as linhas pela largura do rótulo inteiro e pode quebrar depois do ponto
      // médio U+00B7). Espaço inquebrável e o ponto do operador U+2219, que ele não quebra
      linha2 = `+${n} ${palavra} ∙ ${formatarMW(p.mwConjunto ?? 0)} MW`;
    }
    const nome = encurtarNome(p.nome ?? '');
    const largRot = Math.max(Math.min(nome.length, 22), linha2.length) * tam * 0.55;
    const altRot = ((linha2 ? 1 : 0) + (nome.length > 22 ? 2 : 1)) * tam * 1.2;
    const topo = x.caixa[3] + vao;
    const caixaRot: Caixa = [p.pe[0] - largRot / 2, topo, p.pe[0] + largRot / 2, topo + altRot];
    const mostrar = comRotulo.has(x) && !!nome;
    if (mostrar) caixasDeRotulo.push(caixaRot);
    const deCima = deCimaAgora && p.tipo === 'aerogerador';
    pontos.push({
      ...p,
      L: x.L,
      Llei: x.c.Llei,
      metros: x.L / p.k,
      prio: x.prio,
      forcado: x.forcado,
      motivo: x.c.motivo,
      porMembro: x.c.porMembro,
      histerese: x.hist,
      caixa: x.caixa,
      deCima,
      semModelo: satelitePerto,
      rotorGira: p.tipo === 'aerogerador' && !deCima && !satelitePerto,
      rotulo: { linha2, tam, tamTela, off, mostrar, caixa: caixaRot },
    });
  }

  // 6. torres: de pé (inclinação ≥ 25°), de perto (zoom efetivo ≥ 13), fora do satélite,
  //    depois de usinas e subestações. Passo = vão × potência de 2 a partir do início de cada
  //    traçado (posições estáveis enquanto a câmera anda); até 3 por linha, escolhidas pela
  //    hierarquia do passo (a que cai em múltiplo de passo maior primeiro: espalhadas e estáveis).
  //    Estabilidade (leva 2, item 1: A10 falhava em RMSP de perto, torre que entrava e saía na
  //    varredura e no arrasto): a escolha era função pura da câmera, e o filtro de perspectiva,
  //    o zEf e o desempate por posição viravam a cada passo. Agora a torre desenhada no
  //    enquadramento anterior (pedido.anteriores) tem MEMÓRIA: entra primeiro (antes de qualquer
  //    recém-chegada, em todas as linhas), não passa pelo filtro de perspectiva, tem 0,15 de
  //    folga no zEf, sobrevive ao passo que dobrou (é procurada também no meio passo) e só cede
  //    ao vizinho a menos de 0,75 × a distância mínima. A recém-chegada passa pela entrada
  //    adiada (adiarEntrada) como as maquetes. E a torre também respeita a área livre e a casca
  //    (antes podia nascer sob "Inclinar").
  let torres = 0;
  if (capitulo === 'rede' && on('linhas') && pedido.linhas && !deCimaAgora && !satelite && zoom >= ZEF_DAS_TORRES - 1.2) {
    const teto = TETO_DE_TORRES[celular ? 1 : 0];
    const mppC = 1 / kC;
    const passo = VAO * 2 ** Math.max(0, Math.ceil(Math.log2((PX_ENTRE_TORRES * mppC) / VAO)));
    // meio passo: só para achar a torre desenhada que o passo dobrado deixaria de fora
    // sem torre desenhada antes, nem o meio passo nem o texto do id por posição (custo da escolha)
    let haTorreAnterior = false;
    for (const id of anteriores)
      if (id.startsWith('torre:')) {
        haTorreAnterior = true;
        break;
      }
    const passoDaBusca = passo > VAO && haTorreAnterior ? passo / 2 : passo;
    const aceitasT: { pe: [number, number]; caixa: Caixa }[] = [];
    const idDaTorre = (lon: number, lat: number) => `torre:${lon.toFixed(5)},${lat.toFixed(5)}`;
    type CandidataT = { id: string; ant: boolean; lon: number; lat: number; rumo: number; pe: [number, number]; k: number; zEf: number; nivelDoPasso: number; d: number };
    const linhas = pedido.linhas.features
      .map((f, i) => ({ f, i }))
      .filter(({ f }) => {
        const lp = f.properties as PropsLinha;
        if (!(linhaEmOperacao(lp) && (ehCC(lp) || (lp.kv ?? 0) >= KV_MINIMO_DA_TORRE))) return false;
        // a linha que não cruza o enquadramento sai antes de medir o comprimento (era a maior
        // parte do custo da escolha de perto: todas as linhas do país, a cada moveend)
        const cx = caixaDaLinha(f);
        return !(cx[2] < oeste - mLon || cx[0] > leste + mLon || cx[3] < sul - mLat || cx[1] > norte + mLat);
      })
      .sort((a, b) => ((b.f.properties as PropsLinha).kv ?? 0) - ((a.f.properties as PropsLinha).kv ?? 0) || a.i - b.i);
    const porLinha: { idx: number; tipo: TipoDeMaquete; medidas: [number, number, number]; candidatas: CandidataT[]; naLinha: number }[] = [];
    for (const { f, i: idx } of linhas) {
      const lp = f.properties as PropsLinha;
      const tipo = torreDaLinha(lp);
      const medidas = medidasDo(tipo);
      if (!medidas) continue;
      const g = f.geometry as LineString | MultiLineString;
      const partes: Position[][] = g.type === 'LineString' ? [g.coordinates] : g.type === 'MultiLineString' ? g.coordinates : [];
      const daLinha: CandidataT[] = [];
      for (const linha of partes) {
        const latMeio = linha[0]?.[1] ?? 0;
        const mPorGrauLon = 111_320 * Math.cos(latMeio * RAD);
        let total = 0;
        for (let i = 1; i < linha.length; i++) total += Math.hypot((linha[i][0] - linha[i - 1][0]) * mPorGrauLon, (linha[i][1] - linha[i - 1][1]) * 110_574);
        const fim = total - VAO;
        let acumulado = 0;
        for (let i = 1; i < linha.length; i++) {
          const [x0, y0] = linha[i - 1];
          const [x1, y1] = linha[i];
          const comp = Math.hypot((x1 - x0) * mPorGrauLon, (y1 - y0) * 110_574);
          const ini = acumulado;
          acumulado += comp;
          if (comp === 0) continue;
          if ((x0 < oeste && x1 < oeste) || (x0 > leste && x1 > leste) || (y0 < sul && y1 < sul) || (y0 > norte && y1 > norte)) continue;
          const rumo = (Math.atan2((x1 - x0) * mPorGrauLon, (y1 - y0) * 110_574) * 180) / Math.PI;
          const pLon = ((x1 - x0) / comp) * passo;
          const pLat = ((y1 - y0) / comp) * passo;
          for (let d = Math.max(passoDaBusca, Math.ceil(ini / passoDaBusca) * passoDaBusca); d < acumulado; d += passoDaBusca) {
            if (d < VAO || d > fim) continue;
            const t = (d - ini) / comp;
            const lon = x0 + (x1 - x0) * t;
            const lat = y0 + (y1 - y0) * t;
            if (!dentroDosLimites(lon, lat)) continue;
            const id = haTorreAnterior ? idDaTorre(lon, lat) : '';
            const ant = haTorreAnterior && anteriores.has(id);
            const noPasso = d % passo === 0;
            // o meio passo só serve à torre que já estava desenhada
            if (!noPasso && !ant) continue;
            const m = medir(lon, lat, true);
            if (!m || !naTelaUtil(m.pe)) continue;
            const zEf = zoom + Math.log2(m.k / kC);
            if (zEf < ZEF_DAS_TORRES - (ant ? 0.15 : 0)) continue;
            const n = Math.round(d / passo);
            // perspectiva: o passo medido na tela AQUI; se encolheu abaixo do mínimo, a torre
            // nova só fica se a posição é múltipla de passo × 2^m (a desenhada fica: quem a tira
            // é a distância ao vizinho, com folga)
            if (!ant) {
              const b = projetar(lon + pLon, lat + pLat);
              const pxDoPasso = Math.hypot(b[0] - m.pe[0], b[1] - m.pe[1]);
              if (Number.isFinite(pxDoPasso) && pxDoPasso > 0 && pxDoPasso < PX_ENTRE_TORRES * 0.9) {
                const mult = 2 ** Math.ceil(Math.log2(PX_ENTRE_TORRES / pxDoPasso));
                if (n % mult !== 0) continue;
              }
            }
            // hierarquia absoluta (múltiplos do vão), a mesma em qualquer zoom
            let nivelDoPasso = 0;
            for (let v = Math.round(d / VAO); v > 0 && v % 2 === 0; v /= 2) nivelDoPasso++;
            daLinha.push({ id, ant, lon, lat, rumo, pe: m.pe, k: m.k, zEf, nivelDoPasso, d });
          }
        }
      }
      daLinha.sort((a, b) => Number(b.ant) - Number(a.ant) || b.nivelDoPasso - a.nivelDoPasso || a.d - b.d);
      if (daLinha.length) porLinha.push({ idx, tipo, medidas, candidatas: daLinha, naLinha: 0 });
    }
    // duas voltas: as desenhadas antes (todas as linhas), depois as novas
    for (const volta of [true, false]) {
      for (const linha of porLinha) {
        const { tipo, medidas, idx } = linha;
        for (const t of linha.candidatas) {
          if (linha.naLinha >= TORRES_POR_LINHA || torres >= teto) break;
          if (t.ant !== volta) continue;
          const L = Math.max(naTela(LADO_DA_TORRE[tipo] ?? 24, false), Math.max(...medidas) * t.k);
          const s = L / Math.max(...medidas);
          const { caixa } = caixaDoModelo(medidas, s, t.rumo, B, incl, t.pe);
          const minimo = t.ant ? PX_ENTRE_TORRES * 0.75 : PX_ENTRE_TORRES;
          if (aceitasT.some((o) => Math.hypot(o.pe[0] - t.pe[0], o.pe[1] - t.pe[1]) < minimo)) continue;
          // a torre inteira na área livre e fora da casca (busca, controles, ficha)
          if (!dentro(caixa, livre) || zonas.some((z) => cruza(caixa, z))) continue;
          // longe das maquetes (caixa inflada 1,2×) e dos rótulos delas (24 px)
          const bate = aceitos.some((y) => {
            const c = y.caixa;
            const w = (c[2] - c[0]) * 0.1;
            const h = (c[3] - c[1]) * 0.1;
            return cruza(caixa, [c[0] - w, c[1] - h, c[2] + w, c[3] + h]);
          });
          if (bate || caixasDeRotulo.some((r) => cruza(caixa, r, 24))) continue;
          aceitasT.push({ pe: t.pe, caixa });
          pontos.push({
            id: t.id || idDaTorre(t.lon, t.lat),
            tipo,
            familia: 'torre',
            lon: t.lon,
            lat: t.lat,
            rumo: t.rumo,
            L,
            Llei: L,
            metros: L / t.k,
            zoomDaEscolha: zoom,
            k: t.k,
            nome: null,
            cat: null,
            mw: null,
            mwConjunto: null,
            membros: [],
            nivel: nivelDe(t.zEf) as 1 | 2 | 3 | 4,
            zEf: t.zEf,
            prio: 0,
            forcado: false,
            // a torre lembrada (memória do enquadramento anterior) tem folga: zEf até 12,85 e
            // vizinha a 120 px; a bancada (A3) lê isto (codigo.md 10)
            histerese: t.ant,
            pe: t.pe,
            caixa,
            deCima: false,
            semModelo: false,
            rotorGira: false,
            linha: idx,
            rotulo: null,
          });
          linha.naLinha++;
          torres++;
        }
      }
    }
  }

  // 7. o resumo
  const nCentro = nivelDe(zoom);
  const nvC = NIVEIS[Math.max(1, nCentro) - 1];
  const usinasAceitas = pontos.filter((p) => p.familia === 'usina');
  // HON-7 / COL-5: o N do aviso conta a mesma população do k (usinas, subestações e ANP) e só
  // o que está na área visível (o forçado com o pé fora dela não conta)
  const contarNaTela = (f: PontoDeMaquete['familia']) => pontos.filter((p) => p.familia === f && naTelaUtil(p.pe)).length;
  const resumo: ResumoDaEscolha = {
    ativo: zoom >= ZOOM_DAS_MAQUETES,
    zoom,
    inclinacao: incl,
    nivel: nCentro,
    R_km: Math.round(raioDoConjuntoM(nvC, pedido.centro[1]) / 100) / 10,
    D: nvC.D,
    teto: Math.floor(nvC.teto[celular ? 1 : 0] * fatorTeto),
    celular,
    usinasNaTela,
    mwNaTela,
    conjuntos: conjuntosCandidatos,
    // toda usina com maquete (semente ou forçada sozinha): o aviso soma isto à rede e à ANP
    comMaquete: contarNaTela('usina'),
    redeComMaquete: contarNaTela('rede'),
    anpComMaquete: contarNaTela('anp'),
    torres,
    mwRepresentado: usinasAceitas.reduce((s, p) => s + (p.mwConjunto ?? 0), 0),
    cortadosPeloTeto,
    cortadosPorEspaco,
    forcados: pontos.filter((p) => p.forcado && p.nome && naTelaUtil(p.pe)).map((p) => ({ nome: p.nome as string, motivo: p.motivo ?? forcados.get(p.id) ?? 'selecao', porMembro: !!p.porMembro })),
    deCima: deCimaAgora && (usinasAceitas.some((p) => p.tipo === 'aerogerador') || (capitulo === 'rede' && on('linhas') && zoom >= ZEF_DAS_TORRES - 1)),
    satelitePerto,
    anpPrimeiro,
  };
  return { pontos, resumo };
}

// ── entrada adiada (estabilidade, decisão 5 da onda 2) ───────────────

/** A câmera num zoom vizinho: o que a escolha precisa para rodar lá (o controle a monta com um
 *  clone do transform do Mapbox; este arquivo não conhece o Mapbox). */
export interface VistaNoZoom {
  limites: [number, number, number, number];
  projetar: (lon: number, lat: number) => [number, number];
}

/** Meia largura (zoom) da olhada aos vizinhos da entrada adiada. */
export const DZ_DA_ENTRADA_ADIADA = 0.15;

/** O mesmo pedido noutro zoom, com a histerese só de quem continua desenhado. */
export function pedidoNoZoom(pedido: PedidoDeMaquetes, z: number, vista: VistaNoZoom, continuam: ReadonlySet<string>, niveis: ReadonlyMap<string, number>): PedidoDeMaquetes {
  return { ...pedido, zoom: z, limites: vista.limites, projetar: vista.projetar, anteriores: continuam, niveisAnteriores: niveis, diagnostico: false };
}

/** Entrada adiada (batedor das limitações, mecanismo B, com dz ±0,15): um RECÉM-CHEGADO (não
 *  estava desenhado, não é forçado) só entra se também vence num zoom vizinho
 *  (z − 0,15 ou z + 0,15; o vizinho abaixo de 9,4 não conta). Sem isso, numa varredura de zoom
 *  um item aparecia num único passo e sumia no seguinte (a "maquete de vida curta"). Quem fica
 *  de fora continua no símbolo e conta em "ficaram só no símbolo" (resumo.adiados). Desde a
 *  leva 2 a torre também passa por aqui (ela piscava em RMSP de perto); a torre adiada não tem
 *  símbolo e não conta em adiados. Custo: duas escolhas extras, só quando há recém-chegado. */
export function adiarEntrada(escolha: EscolhaDeMaquetes, pedido: PedidoDeMaquetes, mostrados: ReadonlySet<string>, vistaEm: (z: number) => VistaNoZoom | null): EscolhaDeMaquetes {
  // codigo.md 8: o item que a memória por faixa de zoom devolveu (pedido.anteriores) não é
  // recém-chegado: ele estava desenhado nesta faixa há pouco, e a ida e volta tem de devolvê-lo
  // (antes ele rodava nos vizinhos sem histerese e era cortado: a volta perdia uma maquete no RN)
  const lembrados = pedido.anteriores ?? new Set<string>();
  const ja = (id: string) => mostrados.has(id) || lembrados.has(id);
  const novos = escolha.pontos.filter((p) => !ja(p.id) && !p.forcado);
  if (!novos.length) return escolha;
  const continuam = new Set(escolha.pontos.filter((p) => ja(p.id)).map((p) => p.id));
  // a histerese de nível no vizinho é só de quem continua (leva 2, item 4: com o nível dos
  // recém-chegados, o vizinho z − 0,15 segurava no nível 2 a usina que só alcançava o nível 2
  // em z, no alto de uma vista inclinada, e a entrada adiada não cortava; no RN, Potiguar,
  // União dos Ventos 2, Santo Cristo e Cabeço Preto III viviam um único passo da varredura)
  const niveis = new Map(escolha.pontos.filter((p) => continuam.has(p.id)).map((p) => [p.id, p.nivel] as [string, number]));
  const vizinhos: Set<string>[] = [];
  for (const dz of [-DZ_DA_ENTRADA_ADIADA, DZ_DA_ENTRADA_ADIADA]) {
    const z = pedido.zoom + dz;
    if (z < ZOOM_DAS_MAQUETES) continue;
    const vista = vistaEm(z);
    if (!vista) continue;
    vizinhos.push(new Set(escolherMaquetes(pedidoNoZoom(pedido, z, vista, continuam, niveis)).pontos.map((p) => p.id)));
  }
  if (!vizinhos.length) return escolha;
  const fora = new Set(novos.filter((p) => !vizinhos.some((v) => v.has(p.id))).map((p) => p.id));
  if (!fora.size) return escolha;
  const sai = escolha.pontos.filter((p) => fora.has(p.id));
  // o diagnóstico diz que o item aceito na tela ficou de fora por aqui (o A15 não o conta como aceito)
  if (DEPURAR && pedido.diagnostico !== false)
    for (const p of sai) {
      const antes = MOTIVOS_DA_ESCOLHA.get(p.id);
      if (antes) MOTIVOS_DA_ESCOLHA.set(p.id, antes.replace(/: aceito.*$/, ': adiado (entrada adiada: não vence em z ± 0,15)'));
    }
  const r = escolha.resumo;
  const de = (f: PontoDeMaquete['familia']) => sai.filter((p) => p.familia === f).length;
  return {
    pontos: escolha.pontos.filter((p) => !fora.has(p.id)),
    resumo: {
      ...r,
      comMaquete: Math.max(0, r.comMaquete - de('usina')),
      redeComMaquete: Math.max(0, r.redeComMaquete - de('rede')),
      anpComMaquete: Math.max(0, r.anpComMaquete - de('anp')),
      mwRepresentado: r.mwRepresentado - sai.reduce((s, p) => s + (p.familia === 'usina' ? (p.mwConjunto ?? 0) : 0), 0),
      torres: Math.max(0, r.torres - de('torre')),
      adiados: (r.adiados ?? 0) + sai.length - de('torre'),
    },
  };
}
