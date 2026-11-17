// Atlas da Alexandria v3 — capítulo "O comércio": o arquivo tipado, a carga e o filtro.
//
// Fonte: public/alexandria/atlas/dados/comercio-2025.json (Comex Stat/MDIC 2025 por NCM ×
// país × URF × via; ONS para a eletricidade física). A interface não recalcula o que o arquivo
// já traz: lê, filtra e desenha. Bloco ausente (viagens, rotas aéreas, gás da Bolívia) não
// quebra nada: vira lista vazia ou "sem dado".

export type Sentido = 'exportacao' | 'importacao';

export interface FiltroDoComercio {
  sentido: Sentido | 'ambos';
  /** null = todos os produtos; lista = só esses */
  produtos: string[] | null;
  quantas: 'maiores' | 'todas';
}

export const FILTRO_INICIAL_DO_COMERCIO: FiltroDoComercio = { sentido: 'exportacao', produtos: null, quantas: 'maiores' };

export interface FonteDoComercio {
  orgao: string;
  conjunto: string;
  endereco?: string;
  repositorio?: string;
  acesso?: string;
  atualizadoNaFonte?: string;
  ultimoMesNaFonte?: string;
  licenca?: string;
  [k: string]: unknown;
}

export interface TotalDoSentido {
  kt: number;
  fobUS: number;
}

export interface ProdutoDoComercio {
  id: string;
  nome: string;
  ncms: string[];
  unidade: string;
  unidadeExtra?: string;
  exportacao: TotalDoSentido;
  importacao: TotalDoSentido;
}

export interface AncoraDoComercio {
  nome: string;
  tipo: 'interior' | 'porto' | 'aeroporto' | 'localidade' | string;
  municipio?: string;
  lonlat: [number, number] | null;
  fonteDaCoordenada?: { orgao: string; conjunto: string; item?: string; acesso?: string; porQue?: string };
  nota?: string;
}

export interface PaisDoComercio {
  nome: string;
  iso3n?: string;
  noMapa110m?: boolean;
  lonlat: [number, number] | null;
  como?: string;
}

export interface UrfDoFluxo {
  urf: string;
  kt: number;
  fobUS: number;
  pctDoFluxo: number;
  rota?: string;
}

export interface FluxoDoComercio {
  produto: string;
  sentido: Sentido;
  via: string;
  kt: number;
  fobUS: number;
  mwh?: number;
  pctDoProduto: number;
  urfs: UrfDoFluxo[];
  pctDoFluxoEmUrfsListadas?: number;
  pais: string;
  fonte: string;
  rota: string;
  nota?: string;
}

export interface RotaDoComercio {
  de: string;
  para: string;
  tipo: string;
  /** 'mar' (roteador próprio sobre o Natural Earth) ou 'arco' (via aérea) */
  metodo: string;
  km?: number;
  ligacaoKm?: number;
  chegadaKm?: number;
  portoes?: string[];
  contorno?: string;
  sobreTerraKm?: number;
  passagens?: unknown;
  linha: [number, number][];
  [k: string]: unknown;
}

/** Classe do veículo desenhado (decidida pelo arquivo, não pela interface). */
export type ClasseDoVeiculo = 'petroleiro' | 'graneleiro' | 'gaseiro' | 'aviao' | 'carga';

/** Uma entrada por par produto × sentido × URF × país que tem rota (bloco pronto para desenhar). */
export interface ViagemDoComercio {
  id: string;
  produto: string;
  sentido: Sentido;
  urf: string;
  pais: string;
  rota: string;
  via: string;
  kt: number;
  fobUS: number;
  pctDoProduto: number;
  classe: ClasseDoVeiculo;
  [k: string]: unknown;
}

export interface EletricidadeDoComercio {
  fonte: string;
  /** leva 4: `horasPorMes` = horas que o ONS publicou em cada mês (a soma do ano é a dessas horas) */
  paises: Record<string, { nome: string; exportacaoMWh: number[]; importacaoMWh: number[]; horas?: number; horasPorMes?: number[] }>;
  /** leva 4: horas do ano e de cada mês do calendário, para dizer quantas faltam */
  horasDoAno?: number;
  horasDosMeses?: number[];
  horasNota?: string;
  /** leva 4: a importação do Paraguai no Comex (só valor; URF não informada) */
  paraguaiComex?: { fobUS: number; kt: number; urf: string; nota?: string };
  conversoras: Record<string, { id: string; nome: string; lonlat: [number, number] }[]>;
  conversorasNota?: string;
  sentido?: string;
  itaipu?: string;
  /** leva 2: os pontos clicáveis por terra; `serie` é a chave de `paises` (null: não há série) */
  interligacoes?: InterligacaoDoComercio[];
}

export interface InterligacaoDoComercio {
  id: string;
  nome: string;
  nomeNoCadastro?: string;
  pais: string;
  paisNome?: string;
  lonlat: [number, number] | null;
  fonteDoPonto?: string;
  serie: string | null;
  nota?: string;
}

/** Entrada por duto (gás da Bolívia em Corumbá): sem navio e sem rota. */
export interface CondutoDoComercio {
  id: string;
  produto: string;
  sentido: Sentido;
  urf: string;
  pais: string;
  via: string;
  kt: number;
  fobUS: number;
  pctDoProduto: number;
  lonlat: [number, number] | null;
  fonteDaCoordenada?: { orgao: string; conjunto?: string; item?: string; acesso?: string; [k: string]: unknown };
  fonte?: string;
  nota?: string;
  [k: string]: unknown;
}

export interface Comercio {
  ano: number;
  geradoEm?: string;
  fontes: Record<string, FonteDoComercio>;
  leia: string[];
  produtos: ProdutoDoComercio[];
  ancoras: Record<string, AncoraDoComercio>;
  semAncora?: Record<string, string>;
  paisesComo?: Record<string, string>;
  paisesCodigo?: string;
  paises: Record<string, PaisDoComercio>;
  fluxos: FluxoDoComercio[];
  rotas: Record<string, RotaDoComercio>;
  /** bloco da leva 2 (comercio-dados); ausente em arquivo antigo */
  viagens?: ViagemDoComercio[];
  eletricidade?: EletricidadeDoComercio;
  /** bloco da leva 2 (comercio-dados): o gás da Bolívia por duto */
  condutos?: CondutoDoComercio[];
  conferencia?: {
    nota?: string;
    linhas?: { item: string; comex: number; referencia: number; unidade: string; fonteReferencia: string; diferencaPct: number }[];
    [k: string]: unknown;
  };
  [k: string]: unknown;
}

const URL_DO_COMERCIO = '/alexandria/atlas/dados/comercio-2025.json';
let promessa: Promise<Comercio> | null = null;

/** Busca o arquivo uma vez; a falha não fica em cache (a próxima tentativa busca de novo). */
export const cargaDoComercio = (): Promise<Comercio> => {
  if (!promessa) {
    const p = fetch(URL_DO_COMERCIO).then((r) => {
      if (!r.ok) throw new Error(`comercio-2025.json respondeu ${r.status}`);
      return r.json() as Promise<Comercio>;
    });
    p.catch(() => {
      if (promessa === p) promessa = null;
    });
    promessa = p;
  }
  return promessa;
};

// ── leitura do arquivo (sem recalcular o que ele já traz) ────────────

/** Produtos medidos em valor: o peso é desprezível ou não informado (não somam com toneladas). */
export const medidoEmValor = (p: ProdutoDoComercio | undefined): boolean => !!p && p.unidade.startsWith('US$');

/** Classe do veículo quando o arquivo ainda não traz o bloco `viagens` (arquivo da leva 1). */
const CLASSE_DO_PRODUTO: Record<string, ClasseDoVeiculo> = {
  carvao: 'graneleiro',
  'coque-carvao': 'graneleiro',
  'coque-petroleo': 'graneleiro',
  glp: 'gaseiro',
  gnl: 'gaseiro',
  uranio: 'carga',
};

const r1 = (n: number) => Math.round(n * 10) / 10;

/** As viagens desenháveis: o bloco `viagens` do arquivo; num arquivo sem ele, a mesma lista
 *  lida dos fluxos (uma por URF com rota). A parte do produto, nesse caso, é a da URF no total
 *  do produto no sentido (peso; valor para o que é medido em valor). */
export function viagensDe(d: Comercio): ViagemDoComercio[] {
  const memo = memoDasViagens.get(d);
  if (memo) return memo;
  let lista: ViagemDoComercio[];
  if (Array.isArray(d.viagens)) {
    lista = d.viagens.filter((v) => v && d.rotas?.[v.rota]?.linha?.length >= 2);
  } else {
    lista = [];
    const produtos = new Map(d.produtos.map((p) => [p.id, p]));
    for (const f of d.fluxos) {
      const p = produtos.get(f.produto);
      for (const u of f.urfs) {
        if (!u.rota || !d.rotas?.[u.rota]) continue;
        const total = p?.[f.sentido];
        const valor = medidoEmValor(p);
        const base = total ? (valor ? total.fobUS : total.kt) : 0;
        lista.push({
          id: `${f.produto}|${f.sentido}|${u.urf}|${f.pais}`,
          produto: f.produto,
          sentido: f.sentido,
          urf: u.urf,
          pais: f.pais,
          rota: u.rota,
          via: f.via,
          kt: u.kt,
          fobUS: u.fobUS,
          pctDoProduto: base ? r1((100 * (valor ? u.fobUS : u.kt)) / base) : 0,
          classe: f.via === 'aérea' ? 'aviao' : (CLASSE_DO_PRODUTO[f.produto] ?? 'petroleiro'),
        });
      }
    }
  }
  memoDasViagens.set(d, lista);
  return lista;
}
const memoDasViagens = new WeakMap<Comercio, ViagemDoComercio[]>();

/** Peso para ordenar e escolher "as maiores": toneladas; o que é medido em valor vai pelo fim. */
const pesoDaViagem = (v: ViagemDoComercio) => v.kt;

/** Quantas rotas "as maiores" mostra (decisão da leva 2: cerca de 15). */
export const MAIORES = 15;

/** As viagens que o filtro mostra, da maior para a menor. Com "as duas", metade de cada sentido. */
export function viagensVisiveis(d: Comercio, f: FiltroDoComercio): ViagemDoComercio[] {
  const todas = viagensDe(d)
    .filter((v) => (f.sentido === 'ambos' || v.sentido === f.sentido) && (!f.produtos || f.produtos.includes(v.produto)))
    .sort((a, b) => pesoDaViagem(b) - pesoDaViagem(a) || a.id.localeCompare(b.id));
  if (f.quantas === 'todas') return todas;
  // produto isolado: as maiores dele, seja qual for a via (o querosene isolado mostra os aviões)
  if (f.produtos) return todas.slice(0, MAIORES);
  const ordem = (a: ViagemDoComercio, b: ViagemDoComercio) => pesoDaViagem(b) - pesoDaViagem(a) || a.id.localeCompare(b.id);
  // as maiores de cada via: o mar leva quase toda a tonelagem, e o avião (querosene, centenas de
  // mil t) nunca entraria só pelo peso; as duas maiores aéreas do sentido entram junto
  const porSentido = (s: Sentido, n: number) => {
    const doSentido = todas.filter((v) => v.sentido === s);
    const mar = doSentido.filter((v) => v.via !== 'aérea').slice(0, n);
    const ar = doSentido.filter((v) => v.via === 'aérea').slice(0, AEREAS_ENTRE_AS_MAIORES);
    return [...mar, ...ar];
  };
  if (f.sentido !== 'ambos') return porSentido(f.sentido, MAIORES).sort(ordem);
  const metade = Math.ceil(MAIORES / 2);
  return [...porSentido('exportacao', metade), ...porSentido('importacao', metade)].sort(ordem);
}
/** Quantas rotas aéreas entram em "as maiores", por sentido. */
export const AEREAS_ENTRE_AS_MAIORES = 2;

/** Com "todos" (leva 3): os ids que "os maiores" do mesmo recorte (sentido e produto) mostraria. O
 *  mapa desenha esses em destaque e o resto em fio fraco. Sem "todos", null (tudo em destaque). */
export function viagensEmDestaque(d: Comercio, f: FiltroDoComercio): Set<string> | null {
  if (f.quantas !== 'todas') return null;
  return new Set(viagensVisiveis(d, { ...f, quantas: 'maiores' }).map((v) => v.id));
}

/** Veículos por viagem (decisão da leva 2): clamp(round(sqrt(kt/1000)), 1, 4). */
export const veiculosDaViagem = (kt: number) => Math.min(4, Math.max(1, Math.round(Math.sqrt(kt / 1000))));
/** Teto de veículos em movimento na tela. */
export const TETO_DE_VEICULOS = 40;

// ── chaves de seleção ───────────────────────────────────────────────
// v:<id da viagem> · e:<país da interligação elétrica> · g:<país do gás por duto>

export type AlvoDoComercio = { tipo: 'viagem'; id: string } | { tipo: 'eletrica'; pais: string } | { tipo: 'gas'; pais: string };

export function lerChave(chave: string): AlvoDoComercio | null {
  const i = chave.indexOf(':');
  if (i < 1) return null;
  const tipo = chave.slice(0, i);
  const resto = chave.slice(i + 1);
  if (!resto) return null;
  if (tipo === 'v') return { tipo: 'viagem', id: resto };
  if (tipo === 'e') return { tipo: 'eletrica', pais: resto };
  if (tipo === 'g') return { tipo: 'gas', pais: resto };
  return null;
}
export const chaveDaViagem = (id: string) => `v:${id}`;
export const chaveDaEletrica = (pais: string) => `e:${pais}`;
export const chaveDoGas = (pais: string) => `g:${pais}`;

// ── nomes e números ─────────────────────────────────────────────────

const nf0 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1, minimumFractionDigits: 1 });

export const nomeDoProduto = (d: Comercio, id: string) => d.produtos.find((p) => p.id === id)?.nome ?? id;
export const nomeDoPais = (d: Comercio, a3: string) => d.paises?.[a3]?.nome ?? a3;

/** "15,6 Mt", "612 mil t", "8 t" (kt de entrada). */
export function toneladas(kt: number): string {
  if (kt >= 1000) return `${nf1.format(kt / 1000)} Mt`;
  if (kt >= 1) return `${nf0.format(kt)} mil t`;
  return `${nf0.format(kt * 1000)} t`;
}

/** "US$ 44,5 bi", "US$ 74 mi" (FOB em dólares). */
export function dolares(us: number): string {
  if (us >= 1e9) return `US$ ${nf1.format(us / 1e9)} bi`;
  if (us >= 1e6) return `US$ ${nf0.format(us / 1e6)} mi`;
  if (us >= 1e3) return `US$ ${nf0.format(us / 1e3)} mil`;
  return `US$ ${nf0.format(us)}`;
}

/** Quanto, na medida do produto: toneladas, ou valor FOB para o que é medido em valor. */
export function quanto(d: Comercio, produto: string, kt: number, fobUS: number): string {
  return medidoEmValor(d.produtos.find((p) => p.id === produto)) ? `${dolares(fobUS)} FOB` : toneladas(kt);
}

/** Município da âncora sem a UF ("Itaguaí"), ou o nome da URF. */
export function lugarDaUrf(d: Comercio, urf: string): string {
  const a = d.ancoras?.[urf];
  if (!a) return d.semAncora?.[urf] ? 'URF não informada' : urf;
  return a.municipio ? a.municipio.split('/')[0] : a.nome;
}

/** Produtos de nome feminino (leva 4: "da gasolina exportada", não "do gasolina exportado"). */
const FEMININOS = new Set(['gasolina', 'nafta', 'eletricidade']);
/** "da gasolina exportada" / "do querosene de aviação exportado" (nome do arquivo, em minúscula). */
export function doProdutoNoSentido(d: Comercio, produto: string, sentido: Sentido): string {
  const f = FEMININOS.has(produto);
  const part = sentido === 'exportacao' ? 'exportad' : 'importad';
  return `${f ? 'da' : 'do'} ${nomeDoProduto(d, produto).toLowerCase()} ${part}${f ? 'a' : 'o'}`;
}

/** Comprimento de rota esquemática: arredondado a centenas, com "≈" (leva 4: precisão de régua
 *  numa rota que termina num ponto escolhido pelo método afirmava mais do que o dado sustenta). */
export function kmAproximado(km: number): string {
  return `≈ ${nf0.format(Math.max(100, Math.round(km / 100) * 100))} km`;
}

/** Tira da frase o nome de arquivo e o campo do arquivo (leva 4: "nome de arquivo nunca aparece na tela"). */
export function semArquivo(s: string): string {
  return s
    .replace(/\s*\((?:[^()]*?\b[\w.-]+\.(?:geojson|json|csv|mjs|gpkg|ts)\b[^()]*?)\)/g, '')
    .replace(/\s*\b[\w.-]+\.(?:geojson|json|csv|mjs|gpkg)\b/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export const MESES_CURTOS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'] as const;

/** De onde vem o traçado das rotas, na forma em que o arquivo o declara (o bloco mudou na leva 2:
 *  antes órgão e conjunto da rede MARNET; agora o método próprio e a base de terra). */
export function fonteDasRotas(d: Comercio): string | null {
  const r = d.fontes?.rotas as Record<string, unknown> | undefined;
  if (!r) return null;
  const t = (k: string) => (typeof r[k] === 'string' ? (r[k] as string) : null);
  const partes = [t('orgao') && t('conjunto') ? `${t('orgao')}, ${t('conjunto')}` : null, t('metodo'), t('terra')].filter(Boolean);
  return partes.length ? partes.join('; ') : null;
}

/** Nome legível de um portão de canal ('panama' → 'Canal do Panamá'), do próprio arquivo. */
export function nomeDoPortao(d: Comercio, id: string): string {
  const ps = (d.fontes?.rotas as { portoes?: { id: string; nome: string }[] } | undefined)?.portoes;
  return (Array.isArray(ps) ? ps.find((p) => p.id === id)?.nome : null) ?? id;
}
