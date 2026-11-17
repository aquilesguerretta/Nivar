// Atlas da Alexandria v3 — capítulo "Um dia", modo "dia real": o arquivo tipado, a carga e a
// leitura (hora interpolada, somas da hora, chaves de seleção).
//
// Fonte: public/alexandria/atlas/dados/operacao-dias.json (ONS: geração por usina em base
// horária, corte de geração eólica e fotovoltaica, carga por subsistema), publicado pela
// ferramenta tools/alexandria-atlas/operacao/ (esquema v1, anunciado pelo dados-operacao).
// A interface não recalcula o que o arquivo traz: lê, interpola a hora ao tocar e soma o que
// está na tela. Campo ausente não quebra: vira lista vazia, null ou "sem dado".

import { CATEGORIAS, ROTULO_CATEGORIA, type Categoria, type Subsistema } from './tipos';

/** O nome da fonte no dia real. "outros" aqui é só térmica do ONS ("Outras Multi-Combustível" e
 *  "Resíduos Industriais"): o arquivo não diz se é fóssil, então não se chama "fóssil". */
export const rotuloDaFonte = (c: Categoria): string => (c === 'outros' ? 'Outras térmicas' : ROTULO_CATEGORIA[c]);

export interface MomentoDaOperacao {
  /** AAAA-MM-DD, um dos dias do arquivo */
  dia: string;
  /** 0–23; fracionária enquanto o dia toca */
  hora: number;
}

// ── o arquivo (esquema v1) ─────────────────────────────────────────────

export interface FonteDaOperacao {
  orgao?: string;
  conjunto?: string;
  pagina?: string;
  endereco?: string;
  licenca?: string;
  acesso?: string;
  [k: string]: unknown;
}

export interface CorteDaEntidadeNoArquivo {
  i: number;
  /** geração não realizada apurada (GNRa), ESTIMATIVA do ONS, MW médios na hora */
  naoRealizadaEstimada?: number[];
  /** por hora: índice em ORDEM_DOS_MOTIVOS, ou -1 */
  motivo?: number[];
  /** MWh no dia, por motivo */
  porMotivo?: Record<string, number>;
  dominante?: string | null;
  origem?: string | null;
  /** o texto do fluxo controlado mais frequente, como a fonte escreve */
  texto?: string | null;
  [k: string]: unknown;
}

export interface CorteColunarNoArquivo {
  n?: number;
  i: number[];
  naoRealizadaEstimada: number[][];
  /** uma letra por hora (ver `letrasDoMotivo`), ou índices em ORDEM_DOS_MOTIVOS */
  motivo?: (string | number[])[];
  porMotivo?: Record<string, number>[];
  dominante?: (string | null)[];
  origem?: (string | null)[];
  /** índice em `textos` do arquivo, ou o próprio texto */
  texto?: (number | string | null)[];
}

export interface DiaNoArquivo {
  dia: string;
  razao?: string;
  /** alinhado com `entidades`; null = a entidade não aparece no dia */
  mw: (number[] | null)[];
  /** índice da entidade → índice em `subsistemas`: o subsistema que o arquivo de geração do mês dá,
   *  quando difere do de `entidades` (o que o Atlas usa e o balanço do ONS conta) */
  subNoDia?: Record<string, number>;
  /** índice da entidade → os membros do conjunto NESTE dia, quando a composição difere da de `entidades` */
  membrosNoDia?: Record<string, { membros?: string[]; membrosSemPonto?: number | null; kw?: number | null }>;
  carga?: Partial<Record<Subsistema, number[]>>;
  semPonto?: {
    grupos?: { grupo: string; previsao?: boolean; sub?: number | null; cat?: number | null; mw: number[] }[];
    mw?: number[];
    [k: string]: unknown;
  };
  /** frase curta para o seletor ("maior carga do trimestre") e o trimestre ("2025-T4") */
  rotulo?: string;
  trimestre?: string;
  cargaSinMWh?: number;
  corte?: {
    /** lista de objetos, ou colunar (como o arquivo publica: n, i[], naoRealizadaEstimada[][], motivo[] em letras…) */
    entidades?: CorteDaEntidadeNoArquivo[] | CorteColunarNoArquivo;
    porHora?: Record<string, number[]>;
    textoMaisFrequente?: string | null;
    semEntidade?: number;
    [k: string]: unknown;
  };
  conferencia?: {
    porSubsistema?: Record<string, { publicadoMWh?: number; balancoMWh?: number; difPct?: number; maxDifHoraPct?: number }>;
    sin?: { publicadoMWh?: number; balancoMWh?: number; difPct?: number; [k: string]: unknown };
    comPonto?: { entidades?: number; mwh?: number; pct?: number };
    itaipu50MWh?: number;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}

/** O arquivo, tipado. */
export interface Operacao {
  versao?: number;
  geradoEm?: string;
  unidade?: string;
  horario?: string;
  regraDosDias?: string;
  categorias?: string[];
  subsistemas?: string[];
  /** modalidade de operação como o ONS escreve ("TIPO I", "Conjunto de Usinas"…) */
  modalidades?: string[];
  motivos?: Record<string, string>;
  /** letra do motivo por hora → código ("E" → "ENE"; "-" → null) */
  letrasDoMotivo?: Record<string, string | null>;
  origens?: Record<string, string>;
  /** o que cada campo é, com o texto do dicionário do ONS */
  definicoes?: Record<string, string>;
  /** textos de restrição (dsc_restricao) referidos por índice no corte */
  textos?: string[];
  entidades: {
    n?: number;
    id: string[];
    nome?: (string | null)[];
    tipo?: string[];
    cat?: (number | string)[];
    sub?: (number | string | null)[];
    uf?: (string | null)[];
    /** índice em `modalidades` (arquivo publicado) ou o texto */
    mod?: (number | string | null)[];
    ceg?: (string | null)[];
    lon?: (number | null)[];
    lat?: (number | null)[];
    membros?: (string[] | null)[];
    membrosSemPonto?: (number | null)[];
    kw?: (number | null)[];
    obs?: (string | null)[];
    /** as outras linhas do ONS da mesma usina da ANEEL (kw é o do CEG inteiro) */
    cegEmLinhas?: (string[] | null)[];
    [k: string]: unknown;
  };
  dias: DiaNoArquivo[];
  fontes?: FonteDaOperacao[] | Record<string, FonteDaOperacao>;
  leia?: string[];
  [k: string]: unknown;
}

const URL_DA_OPERACAO = '/alexandria/atlas/dados/operacao-dias.json';
let promessa: Promise<Operacao> | null = null;

/** Busca o arquivo uma vez; a falha não fica em cache. */
export const cargaDaOperacao = (): Promise<Operacao> => {
  if (!promessa) {
    const p = fetch(URL_DA_OPERACAO).then((r) => {
      if (!r.ok) throw new Error(`operacao-dias.json respondeu ${r.status}`);
      return r.json() as Promise<Operacao>;
    });
    p.catch(() => {
      if (promessa === p) promessa = null;
    });
    promessa = p;
  }
  return promessa;
};

// ── o modelo lido ─────────────────────────────────────────────────────

/** A ordem dos códigos de motivo no campo `motivo` por hora (esquema v1). */
export const ORDEM_DOS_MOTIVOS = ['REL', 'CNF', 'ENE', 'PAR'] as const;

export interface EntidadeDaOperacao {
  i: number;
  id: string;
  nome: string;
  tipo: 'usina' | 'conjunto';
  cat: Categoria;
  sub: Subsistema | null;
  uf: string | null;
  mod: string | null;
  ceg: string | null;
  lonlat: [number, number] | null;
  membros: string[];
  membrosSemPonto: number | null;
  kw: number | null;
  obs: string | null;
  /** setor paraguaio de Itaipu (50 Hz): aparece no mapa, mas NUNCA entra na soma do Brasil */
  foraDoBrasil: boolean;
  /** as outras linhas do ONS da mesma usina da ANEEL: `kw` é a potência do CEG inteiro, não a desta linha */
  cegEmLinhas: string[];
}

export interface MembrosNoDia {
  membros: string[];
  membrosSemPonto: number | null;
  kw: number | null;
}

export interface CorteDaEntidade {
  /** MW médios estimados na hora (24) */
  mw: number[];
  motivoPorHora: (string | null)[];
  porMotivo: Record<string, number>;
  dominante: string | null;
  origem: string | null;
  texto: string | null;
}

export interface GrupoSemPonto {
  /** 'mmgd' | 'tipo3' (previsão do ONS) | 'semPar' (verificada, sem usina no Atlas) */
  grupo: string;
  previsao: boolean;
  sub: Subsistema | null;
  cat: Categoria;
  mw: number[];
}

export interface DiaDaOperacao {
  dia: string;
  razao: string | null;
  rotulo: string | null;
  trimestre: string | null;
  mw: (number[] | null)[];
  carga: Partial<Record<Subsistema, number[]>>;
  semPonto: { mw: number[]; grupos: GrupoSemPonto[] } | null;
  corte: Map<number, CorteDaEntidade>;
  corteSemEntidade: number;
  corteTextoMaisFrequente: string | null;
  conferencia: DiaNoArquivo['conferencia'] | null;
  /** o subsistema que o arquivo de geração do mês dá, quando difere do da entidade */
  subNoArquivoDoMes: Map<number, Subsistema>;
  /** a composição do conjunto neste dia, quando difere da do dia mais novo */
  membrosNoDia: Map<number, MembrosNoDia>;
}

export interface ModeloDaOperacao {
  entidades: EntidadeDaOperacao[];
  porId: Map<string, EntidadeDaOperacao>;
  dias: DiaDaOperacao[];
  motivos: Record<string, string>;
  origens: Record<string, string>;
  definicoes: Record<string, string>;
  fontes: FonteDaOperacao[];
  leia: string[];
  regraDosDias: string | null;
  unidade: string | null;
  horario: string | null;
  geradoEm: string | null;
}

const SUBS_PADRAO: Subsistema[] = ['N', 'NE', 'S', 'SE'];
const ehCategoria = (x: unknown): x is Categoria => typeof x === 'string' && (CATEGORIAS as readonly string[]).includes(x);
const ehSub = (x: unknown): x is Subsistema => x === 'N' || x === 'NE' || x === 'S' || x === 'SE';
const vinte4 = (a: unknown): number[] | null => (Array.isArray(a) && a.length >= 24 ? (a as number[]).slice(0, 24).map((x) => (Number.isFinite(x) ? x : 0)) : null);

const memo = new WeakMap<Operacao, ModeloDaOperacao>();

/** Lê o arquivo uma vez (memo por objeto). */
export function lerOperacao(d: Operacao): ModeloDaOperacao {
  const m = memo.get(d);
  if (m) return m;
  const E = d.entidades ?? ({ id: [] } as Operacao['entidades']);
  const cats = (d.categorias ?? (CATEGORIAS as readonly string[])) as string[];
  const subs = (d.subsistemas ?? SUBS_PADRAO) as string[];
  const entidades: EntidadeDaOperacao[] = (E.id ?? []).map((id, i) => {
    const c = E.cat?.[i];
    const cat = typeof c === 'number' ? cats[c] : c;
    const s = E.sub?.[i];
    const sub = typeof s === 'number' ? subs[s] : s;
    const lon = E.lon?.[i];
    const lat = E.lat?.[i];
    const obs = E.obs?.[i] ?? null;
    return {
      i,
      id,
      nome: E.nome?.[i] ?? id,
      tipo: E.tipo?.[i] === 'conjunto' ? 'conjunto' : 'usina',
      cat: ehCategoria(cat) ? cat : 'outros',
      sub: ehSub(sub) ? sub : null,
      uf: E.uf?.[i] ?? null,
      mod: (() => {
        const v = E.mod?.[i];
        return typeof v === 'number' ? (d.modalidades?.[v] ?? null) : (v ?? null);
      })(),
      ceg: E.ceg?.[i] ?? null,
      lonlat: lon != null && lat != null && Number.isFinite(lon) && Number.isFinite(lat) ? [lon, lat] : null,
      membros: E.membros?.[i] ?? [],
      membrosSemPonto: E.membrosSemPonto?.[i] ?? null,
      kw: E.kw?.[i] ?? null,
      obs,
      // o setor paraguaio vem marcado pelo id do ONS (PYIT50) e pela observação do arquivo
      foraDoBrasil: id === 'PYIT50' || /paragua/i.test(obs ?? ''),
      cegEmLinhas: E.cegEmLinhas?.[i] ?? [],
    };
  });
  const motivosOrdem = ORDEM_DOS_MOTIVOS as readonly string[];
  const letras = d.letrasDoMotivo ?? { R: 'REL', C: 'CNF', E: 'ENE', P: 'PAR', '-': null };
  const textos = Array.isArray(d.textos) ? d.textos : [];
  const motivoPorHora = (mo: unknown): (string | null)[] => {
    if (typeof mo === 'string') return Array.from({ length: 24 }, (_, h) => letras[mo[h] ?? '-'] ?? null);
    if (Array.isArray(mo)) return Array.from({ length: 24 }, (_, h) => (typeof mo[h] === 'number' && mo[h] >= 0 ? (motivosOrdem[mo[h]] ?? null) : null));
    return new Array(24).fill(null);
  };
  const texto = (t: unknown): string | null => (typeof t === 'number' ? (textos[t] ?? null) : typeof t === 'string' ? t : null);
  const dias: DiaDaOperacao[] = (d.dias ?? []).map((x) => {
    const corte = new Map<number, CorteDaEntidade>();
    const ce = x.corte?.entidades;
    if (Array.isArray(ce)) {
      for (const c of ce) {
        const mw = vinte4(c.naoRealizadaEstimada);
        if (!mw || typeof c.i !== 'number') continue;
        corte.set(c.i, { mw, motivoPorHora: motivoPorHora(c.motivo), porMotivo: c.porMotivo ?? {}, dominante: c.dominante ?? null, origem: c.origem ?? null, texto: texto(c.texto) });
      }
    } else if (ce && Array.isArray(ce.i)) {
      ce.i.forEach((i, k) => {
        const mw = vinte4(ce.naoRealizadaEstimada?.[k]);
        if (!mw) return;
        corte.set(i, {
          mw,
          motivoPorHora: motivoPorHora(ce.motivo?.[k]),
          porMotivo: ce.porMotivo?.[k] ?? {},
          dominante: ce.dominante?.[k] ?? null,
          origem: ce.origem?.[k] ?? null,
          texto: texto(ce.texto?.[k]),
        });
      });
    }
    const sp = x.semPonto;
    const spMw = vinte4(sp?.mw);
    const grupos: GrupoSemPonto[] = (sp?.grupos ?? []).flatMap((g) => {
      const mw = vinte4(g.mw);
      if (!mw) return [];
      const c = typeof g.cat === 'number' ? cats[g.cat] : g.cat;
      const s = typeof g.sub === 'number' ? subs[g.sub] : g.sub;
      return [{ grupo: g.grupo, previsao: !!g.previsao, sub: ehSub(s) ? s : null, cat: ehCategoria(c) ? c : 'outros', mw }];
    });
    const subNoArquivoDoMes = new Map<number, Subsistema>();
    for (const [k, v] of Object.entries(x.subNoDia ?? {})) {
      const s = subs[v];
      if (ehSub(s)) subNoArquivoDoMes.set(Number(k), s);
    }
    const membrosNoDia = new Map<number, MembrosNoDia>();
    for (const [k, v] of Object.entries(x.membrosNoDia ?? {}))
      if (Array.isArray(v?.membros)) membrosNoDia.set(Number(k), { membros: v.membros, membrosSemPonto: v.membrosSemPonto ?? null, kw: v.kw ?? null });
    return {
      dia: x.dia,
      razao: x.razao ?? null,
      rotulo: x.rotulo ?? null,
      trimestre: x.trimestre ?? null,
      mw: Array.isArray(x.mw) ? x.mw : [],
      carga: x.carga ?? {},
      semPonto: spMw ? { mw: spMw, grupos } : null,
      corte,
      corteSemEntidade: x.corte?.semEntidade ?? 0,
      corteTextoMaisFrequente: x.corte?.textoMaisFrequente ?? null,
      conferencia: x.conferencia ?? null,
      subNoArquivoDoMes,
      membrosNoDia,
    };
  });
  const fontes = Array.isArray(d.fontes) ? d.fontes : d.fontes ? Object.values(d.fontes) : [];
  const modelo: ModeloDaOperacao = {
    entidades,
    porId: new Map(entidades.map((e) => [e.id, e])),
    dias,
    motivos: d.motivos ?? {},
    origens: d.origens ?? {},
    definicoes: d.definicoes ?? {},
    geradoEm: d.geradoEm ?? null,
    fontes,
    leia: Array.isArray(d.leia) ? d.leia : [],
    regraDosDias: d.regraDosDias ?? null,
    unidade: d.unidade ?? null,
    horario: d.horario ?? null,
  };
  memo.set(d, modelo);
  return modelo;
}

export const diaDe = (m: ModeloDaOperacao, dia: string | null | undefined): DiaDaOperacao | null => (dia ? (m.dias.find((x) => x.dia === dia) ?? null) : null);

/** Os membros do conjunto no dia mostrado (a relação do ONS tem data de início e de fim); `doDia`
 *  diz se a composição do dia difere da do dia mais novo do arquivo. */
export function membrosDoDia(dia: DiaDaOperacao | null, e: EntidadeDaOperacao): MembrosNoDia & { doDia: boolean } {
  const x = dia?.membrosNoDia.get(e.i);
  return x ? { ...x, doDia: true } : { membros: e.membros, membrosSemPonto: e.membrosSemPonto, kw: e.kw, doDia: false };
}

/** Valor de uma série de 24 horas numa hora fracionária (interpolação linear; 23 é o fim). */
export function naHora(serie: number[] | null | undefined, hora: number): number {
  if (!serie) return 0;
  const h = Math.max(0, Math.min(23, hora));
  const a = Math.floor(h);
  const b = Math.min(23, a + 1);
  const t = h - a;
  const va = serie[a] ?? 0;
  const vb = serie[b] ?? 0;
  return va + (vb - va) * t;
}

/** Geração da entidade na hora (MW médios). */
export const geracaoNaHora = (dia: DiaDaOperacao, i: number, hora: number): number => Math.max(0, naHora(dia.mw[i], hora));
/** Corte estimado da entidade na hora (MW médios). */
export const corteNaHora = (dia: DiaDaOperacao, i: number, hora: number): number => Math.max(0, naHora(dia.corte.get(i)?.mw, hora));

export interface SomaDaHora {
  /** geração do SIN na hora como o arquivo a confere com o balanço do ONS: as entidades (sem o
   *  setor paraguaio de Itaipu) mais o bloco sem ponto */
  total: number;
  porCategoria: Record<Categoria, number>;
  /** a parte de cada categoria que o ONS publica como PREVISÃO (pequenas usinas e geração
   *  distribuída por estado); o resto da categoria é geração verificada */
  previsaoPorCategoria: Record<Categoria, number>;
  /** geração verificada (entidades, sem o setor paraguaio de Itaipu) */
  verificada: number;
  /** previsão do ONS (pequenas usinas e geração distribuída, sem ponto) */
  previsao: number;
  /** o que está no total mas não tem ponto no mapa */
  semPonto: { previsao: number; verificada: number };
  /** setor paraguaio de Itaipu (fora do total) */
  foraDoBrasil: number;
  corte: number;
  /** motivo com mais MW de corte na hora */
  motivoDominante: string | null;
  carga: number | null;
}

/** As somas da hora para o painel (interpolando a hora fracionária). */
export function somaDaHora(m: ModeloDaOperacao, dia: DiaDaOperacao, hora: number): SomaDaHora {
  const porCategoria = Object.fromEntries(CATEGORIAS.map((c) => [c, 0])) as Record<Categoria, number>;
  const previsaoPorCategoria = Object.fromEntries(CATEGORIAS.map((c) => [c, 0])) as Record<Categoria, number>;
  let total = 0;
  let foraDoBrasil = 0;
  const semPonto = { previsao: 0, verificada: 0 };
  for (const e of m.entidades) {
    const g = geracaoNaHora(dia, e.i, hora);
    if (e.foraDoBrasil) {
      foraDoBrasil += g;
      continue;
    }
    total += g;
    porCategoria[e.cat] += g;
    if (!e.lonlat) semPonto.verificada += g;
  }
  if (dia.semPonto) {
    if (dia.semPonto.grupos.length) {
      for (const g of dia.semPonto.grupos) {
        const v = Math.max(0, naHora(g.mw, hora));
        total += v;
        porCategoria[g.cat] += v;
        if (g.previsao) {
          semPonto.previsao += v;
          previsaoPorCategoria[g.cat] += v;
        } else semPonto.verificada += v;
      }
    } else {
      // só o total por hora, sem os grupos: entra no total como "outros" e conta como sem ponto
      const v = Math.max(0, naHora(dia.semPonto.mw, hora));
      total += v;
      porCategoria.outros += v;
      semPonto.verificada += v;
    }
  }
  let corte = 0;
  const porMotivo: Record<string, number> = {};
  const hInteira = Math.round(Math.max(0, Math.min(23, hora)));
  for (const [i, c] of dia.corte) {
    const v = corteNaHora(dia, i, hora);
    corte += v;
    const k = c.motivoPorHora[hInteira] ?? c.dominante;
    if (k && v > 0) porMotivo[k] = (porMotivo[k] ?? 0) + v;
  }
  const motivoDominante = Object.entries(porMotivo).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const subs = Object.values(dia.carga).filter((s): s is number[] => Array.isArray(s) && s.length >= 24);
  return {
    total,
    porCategoria,
    previsaoPorCategoria,
    verificada: total - semPonto.previsao,
    previsao: semPonto.previsao,
    semPonto,
    foraDoBrasil,
    corte,
    motivoDominante,
    carga: subs.length ? subs.reduce((s, x) => s + naHora(x, hora), 0) : null,
  };
}

// ── chaves de seleção ─────────────────────────────────────────────────
// u:<id_ons da entidade> · ceg:<CEG da ANEEL> (membro de um conjunto: a página abre a usina do Atlas)

export const chaveDaEntidade = (id: string) => `u:${id}`;
export const chaveDoMembro = (ceg: string) => `ceg:${ceg}`;
export function lerChave(chave: string): { tipo: 'entidade'; id: string } | { tipo: 'membro'; ceg: string } | null {
  if (chave.startsWith('u:') && chave.length > 2) return { tipo: 'entidade', id: chave.slice(2) };
  if (chave.startsWith('ceg:') && chave.length > 4) return { tipo: 'membro', ceg: chave.slice(4) };
  return null;
}

// ── nomes e números ───────────────────────────────────────────────────

const nf0 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });

/** "12.345 MW", "<1 MW". */
export function megawatts(mw: number): string {
  if (mw > 0 && mw < 0.5) return '<1 MW';
  return `${nf0.format(Math.round(mw))} MW`;
}

/** "12.345" (sem unidade). */
export const mwInteiro = (mw: number): string => nf0.format(Math.round(mw));

/** "19h", "19h30" (hora fracionária). */
export function horaBr(hora: number): string {
  const h = Math.floor(hora);
  const min = Math.round((hora - h) * 60);
  return min === 0 || min === 60 ? `${String(min === 60 ? h + 1 : h).padStart(2, '0')}h` : `${String(h).padStart(2, '0')}h${String(min).padStart(2, '0')}`;
}

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const SEMANA = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

/** "14 de novembro de 2026". */
export function diaBr(iso: string): string {
  const [a, m, d] = iso.split('-').map(Number);
  if (!a || !m || !d) return iso;
  return `${d} de ${MESES[m - 1]} de ${a}`;
}

/** "sábado" (dia da semana do calendário, sem fuso). */
export function semanaBr(iso: string): string {
  const [a, m, d] = iso.split('-').map(Number);
  if (!a || !m || !d) return '';
  return SEMANA[new Date(Date.UTC(a, m - 1, d)).getUTCDay()];
}

const MINUSCULAS = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'a', 'o']);
/** Ficam em caixa alta: numerais romanos e as siglas de tipo de usina que o ONS usa. */
const SIGLAS = /^(?:I{1,3}|IV|V|VI{1,3}|IX|X{1,3}|UHE|UTE|UTN|PCH|CGH|EOL|UFV|SIN|ONS)$/;

/** O nome do ONS (em caixa alta) em caixa de leitura: "ITAIPU 60 HZ" → "Itaipu 60 Hz",
 *  "CONJUNTO EÓLICO PAULINO NEVES" → "Conjunto Eólico Paulino Neves". Siglas e numerais romanos
 *  ficam como estão. A ficha mostra também o nome como a fonte escreve. */
export function nomeLegivel(nome: string): string {
  if (nome !== nome.toUpperCase()) return nome;
  return nome
    .split(/(\s+|-|\/|\.)/)
    .map((p, i) => {
      if (!/[A-ZÀ-Ý]/.test(p)) return p;
      if (p === 'HZ') return 'Hz';
      if (p === 'KV') return 'kV';
      // "230KV" → "230 kV"; outros com algarismo ficam como estão ("CJU_X1")
      const kv = p.match(/^(\d+)KV$/);
      if (kv) return `${kv[1]} kV`;
      if (/\d/.test(p) || SIGLAS.test(p)) return p;
      const b = p.toLowerCase();
      if (i > 0 && MINUSCULAS.has(b)) return b;
      return b.charAt(0).toUpperCase() + b.slice(1);
    })
    .join('');
}

/** O texto do motivo como o dicionário da fonte escreve (do arquivo; o código, se faltar). */
export const textoDoMotivo = (m: ModeloDaOperacao, codigo: string | null | undefined): string | null =>
  codigo ? (m.motivos[codigo] ? `${m.motivos[codigo]} (${codigo})` : codigo) : null;
