// Perfil da Alexandria (V2) — regras da casa, em lógica PURA.
//
// Founder, 15/11/2026: perfil de jogo "como se fosse Duolingo", com foto
// (só da Alexandria), medalhas e faixas, nível e XP, sequência e
// calendário, progresso por trilha e módulo, estatísticas e histórico.
// Sem ligas; placar por jogo chega com os jogos.
//
// O QUE O XP É, E O QUE NÃO É. XP é regra da casa sobre atividade
// registrada. Ele não mede conhecimento, não aparece na Home e não entra
// em nenhuma conquista (sistema-de-conquistas.md §0.5 e S3). Repetição não
// rende: só a PRIMEIRA vez de cada aula, exercício e instrumento conta —
// é por isso que o backend devolve `primeiras` e não o log inteiro.
//
// Puro como `progresso/conquistas.ts`: nada de `@/lib/data`, nada de rede.
// O currículo entra por parâmetro. Testes: tests/alexandria-progresso/perfil.test.ts.

export type TipoDeEstudo = 'aula_iniciada' | 'aula_concluida' | 'instrumento_usado' | 'exercicio_respondido';

export interface PrimeiraVez {
  tipo: TipoDeEstudo | string;
  entityId: string;
  em: string; // ISO
  aulaId: string | null;
}

export interface DiaDeEstudo {
  dia: string; // AAAA-MM-DD, no fuso do aluno
  eventos: number;
}

// ── XP ──────────────────────────────────────────────────────────────────

export const XP_POR_TIPO: Record<TipoDeEstudo, number> = {
  aula_iniciada: 0,
  aula_concluida: 50,
  instrumento_usado: 15,
  exercicio_respondido: 10,
};
export const XP_POR_DIA = 5;

export const REGRAS_DE_XP: { rotulo: string; xp: number }[] = [
  { rotulo: 'Aula concluída pela primeira vez', xp: XP_POR_TIPO.aula_concluida },
  { rotulo: 'Instrumento usado pela primeira vez', xp: XP_POR_TIPO.instrumento_usado },
  { rotulo: 'Exercício respondido pela primeira vez', xp: XP_POR_TIPO.exercicio_respondido },
  { rotulo: 'Dia com estudo registrado', xp: XP_POR_DIA },
];

const xpDe = (tipo: string): number => (tipo in XP_POR_TIPO ? XP_POR_TIPO[tipo as TipoDeEstudo] : 0);

/** XP total. Os dias entram pela lista de dias (janela do backend); as
 *  primeiras vezes valem uma vez cada, porque o backend já devolve uma
 *  linha por (tipo, entidade). */
export function xpTotal(primeiras: readonly PrimeiraVez[], dias: readonly DiaDeEstudo[]): number {
  const deAtos = primeiras.reduce((s, p) => s + xpDe(p.tipo), 0);
  const deDias = dias.filter((d) => d.eventos > 0).length * XP_POR_DIA;
  return deAtos + deDias;
}

// ── Nível ───────────────────────────────────────────────────────────────
//
// O nível n começa em 50·n·(n−1) XP: 0, 100, 300, 600, 1.000, 1.500…
// Cada nível pede 100 XP a mais que o anterior. O currículo inteiro
// (141 aulas, instrumentos, exercícios, dias) passa do nível 15.

export const inicioDoNivel = (n: number): number => 50 * n * (n - 1);

export interface Nivel {
  nivel: number;
  xp: number;
  inicio: number;
  proximo: number;
  /** 0–1 dentro do nível atual. */
  fracao: number;
}

export function nivelDe(xp: number): Nivel {
  const seguro = Math.max(0, Math.floor(xp));
  let n = 1;
  while (inicioDoNivel(n + 1) <= seguro) n++;
  const inicio = inicioDoNivel(n);
  const proximo = inicioDoNivel(n + 1);
  return { nivel: n, xp: seguro, inicio, proximo, fracao: (seguro - inicio) / (proximo - inicio) };
}

// ── Sequências e dias ───────────────────────────────────────────────────

const DIA_MS = 86_400_000;
const paraDia = (iso: string): number => Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10)) / DIA_MS;
const deDia = (n: number): string => new Date(n * DIA_MS).toISOString().slice(0, 10);

/** O dia (AAAA-MM-DD) em que uma corrida de `n` dias seguidos foi
 *  alcançada pela primeira vez, ou null. Só olha a janela que o backend
 *  devolve: fora dela, não afirma nada. */
export function diaEmQueAlcancouSequencia(dias: readonly DiaDeEstudo[], n: number): string | null {
  const ordenados = [...new Set(dias.filter((d) => d.eventos > 0).map((d) => paraDia(d.dia)))].sort((a, b) => a - b);
  let corrida = 0;
  for (let i = 0; i < ordenados.length; i++) {
    corrida = i > 0 && ordenados[i] - ordenados[i - 1] === 1 ? corrida + 1 : 1;
    if (corrida >= n) return deDia(ordenados[i]);
  }
  return null;
}

/** O dia em que o aluno somou `n` dias distintos de estudo, ou null. */
export function diaEmQueSomouDias(dias: readonly DiaDeEstudo[], n: number): string | null {
  const ordenados = [...new Set(dias.filter((d) => d.eventos > 0).map((d) => d.dia))].sort();
  return ordenados.length >= n ? ordenados[n - 1] : null;
}

// ── Medalhas derivadas (HÁBITO e EXPLORAÇÃO) ────────────────────────────
//
// A família CONCLUSÃO já existe (`progresso/conquistas.ts`, gravada em
// badge_award). Estas duas famílias nascem aqui, DERIVADAS do log a cada
// leitura: os dois ajustes que o §2.4 pedia (fuso do aluno e só eventos
// de estudo contando) já estão no backend desde a Peça D.

export type FamiliaDeMedalha = 'conclusao' | 'habito' | 'exploracao';

export interface MedalhaDerivada {
  id: string;
  familia: Exclude<FamiliaDeMedalha, 'conclusao'>;
  nome: string;
  criterio: string;
  /** AAAA-MM-DD ou ISO; null = não obtida. */
  obtidaEm: string | null;
  /** Para o disco cego: quanto falta, quando se sabe. */
  feito: number;
  alvo: number;
}

export interface EntradaDasMedalhas {
  dias: readonly DiaDeEstudo[];
  primeiras: readonly PrimeiraVez[];
  /** Aula → território (I, II, III), do índice. */
  territorioDaAula: (aulaId: string) => string | null;
}

export function medalhasDerivadas(e: EntradaDasMedalhas): MedalhaDerivada[] {
  const out: MedalhaDerivada[] = [];
  const ordenados = [...new Set(e.dias.filter((d) => d.eventos > 0).map((d) => d.dia))].sort();

  let maiorCorrida = 0;
  {
    let c = 0;
    for (let i = 0; i < ordenados.length; i++) {
      c = i > 0 && paraDia(ordenados[i]) - paraDia(ordenados[i - 1]) === 1 ? c + 1 : 1;
      maiorCorrida = Math.max(maiorCorrida, c);
    }
  }
  for (const n of [3, 7, 30, 100]) {
    out.push({
      id: `habito.sequencia.${n}`,
      familia: 'habito',
      nome: `${n} dias seguidos com estudo`,
      criterio: `Registrou estudo em ${n} dias seguidos.`,
      obtidaEm: diaEmQueAlcancouSequencia(e.dias, n),
      feito: Math.min(maiorCorrida, n),
      alvo: n,
    });
  }
  for (const n of [10, 50]) {
    out.push({
      id: `habito.dias.${n}`,
      familia: 'habito',
      nome: `${n} dias com estudo`,
      criterio: `Registrou estudo em ${n} dias diferentes, seguidos ou não.`,
      obtidaEm: diaEmQueSomouDias(e.dias, n),
      feito: Math.min(ordenados.length, n),
      alvo: n,
    });
  }

  // Os três territórios abertos: a primeira aula iniciada ou concluída de
  // cada território; a data é a do último dos três a ser aberto.
  const primeiroPorTerritorio = new Map<string, string>();
  for (const p of [...e.primeiras].sort((a, b) => a.em.localeCompare(b.em))) {
    if (p.tipo !== 'aula_iniciada' && p.tipo !== 'aula_concluida') continue;
    const t = e.territorioDaAula(p.entityId);
    if (t && !primeiroPorTerritorio.has(t)) primeiroPorTerritorio.set(t, p.em);
  }
  const abertos = ['I', 'II', 'III'].filter((t) => primeiroPorTerritorio.has(t));
  out.push({
    id: 'exploracao.tres-territorios-abertos',
    familia: 'exploracao',
    nome: 'Os três territórios abertos',
    criterio: 'Abriu ao menos uma aula em cada um dos três territórios.',
    obtidaEm: abertos.length === 3 ? abertos.map((t) => primeiroPorTerritorio.get(t)!).sort().at(-1)! : null,
    feito: abertos.length,
    alvo: 3,
  });

  const instrumentos = e.primeiras.filter((p) => p.tipo === 'instrumento_usado').sort((a, b) => a.em.localeCompare(b.em));
  for (const n of [1, 10, 50]) {
    out.push({
      id: `exploracao.instrumentos.${n}`,
      familia: 'exploracao',
      nome: n === 1 ? 'Primeiro instrumento usado' : `${n} instrumentos usados`,
      criterio:
        n === 1
          ? 'Usou um instrumento de aula pela primeira vez.'
          : `Usou ${n} instrumentos diferentes. Repetir o mesmo não conta.`,
      obtidaEm: instrumentos.length >= n ? instrumentos[n - 1].em : null,
      feito: Math.min(instrumentos.length, n),
      alvo: n,
    });
  }
  return out;
}

// ── Faixas (banners) ────────────────────────────────────────────────────

export interface Faixa {
  id: string;
  nome: string;
  /** Raiz do arquivo em /public, sem largura e extensão; null = papel liso. */
  imagem: string | null;
  /** Como se destrava, em uma frase. */
  criterio: string;
}

export const FAIXAS: readonly Faixa[] = [
  { id: 'papel', nome: 'Papel', imagem: null, criterio: 'Disponível desde o início.' },
  { id: 'farol', nome: 'O farol', imagem: '/alexandria/v3/home/home-farol', criterio: 'Concluir a primeira aula.' },
  { id: 'trilha-i', nome: 'Trilha I', imagem: '/alexandria/v3/trilhas/trilha-I', criterio: 'Concluir um módulo da Trilha I.' },
  { id: 'trilha-ii', nome: 'Trilha II', imagem: '/alexandria/v3/trilhas/trilha-II', criterio: 'Concluir um módulo da Trilha II.' },
  { id: 'trilha-iii', nome: 'Trilha III', imagem: '/alexandria/v3/trilhas/trilha-III', criterio: 'Concluir um módulo da Trilha III.' },
  { id: 'sala-de-aula', nome: 'A sala de aula', imagem: '/alexandria/v3/home/home-aula', criterio: 'Chegar ao nível 5.' },
];

export interface EntradaDasFaixas {
  aulasConcluidas: number;
  /** Territórios com ao menos um módulo concluído. */
  territoriosComModulo: ReadonlySet<string>;
  nivel: number;
}

export function faixaDestravada(id: string, e: EntradaDasFaixas): boolean {
  switch (id) {
    case 'papel':
      return true;
    case 'farol':
      return e.aulasConcluidas >= 1;
    case 'trilha-i':
      return e.territoriosComModulo.has('I');
    case 'trilha-ii':
      return e.territoriosComModulo.has('II');
    case 'trilha-iii':
      return e.territoriosComModulo.has('III');
    case 'sala-de-aula':
      return e.nivel >= 5;
    default:
      return false;
  }
}

/** A faixa que a tela mostra: a escolhida, se existe e está destravada;
 *  senão a de papel. Nunca uma faixa que o aluno não destravou. */
export function faixaEmUso(escolhida: string | null, e: EntradaDasFaixas): Faixa {
  const f = FAIXAS.find((x) => x.id === escolhida);
  return f && faixaDestravada(f.id, e) ? f : FAIXAS[0];
}

// ── Histórico ───────────────────────────────────────────────────────────

export interface DiaDoHistorico {
  dia: string; // AAAA-MM-DD no fuso do aluno
  aulasConcluidas: string[];
  aulasIniciadas: string[];
  instrumentos: number;
  exercicios: number;
  xp: number;
}

/** Agrupa as primeiras vezes por dia, no fuso declarado. Mais recente primeiro. */
export function historico(primeiras: readonly PrimeiraVez[], fuso: string, limite = 30): DiaDoHistorico[] {
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: fuso, year: 'numeric', month: '2-digit', day: '2-digit' });
  const porDia = new Map<string, DiaDoHistorico>();
  for (const p of primeiras) {
    const dia = fmt.format(new Date(p.em));
    let d = porDia.get(dia);
    if (!d) {
      d = { dia, aulasConcluidas: [], aulasIniciadas: [], instrumentos: 0, exercicios: 0, xp: XP_POR_DIA };
      porDia.set(dia, d);
    }
    d.xp += xpDe(p.tipo);
    if (p.tipo === 'aula_concluida') d.aulasConcluidas.push(p.entityId);
    else if (p.tipo === 'aula_iniciada') d.aulasIniciadas.push(p.entityId);
    else if (p.tipo === 'instrumento_usado') d.instrumentos++;
    else if (p.tipo === 'exercicio_respondido') d.exercicios++;
  }
  return [...porDia.values()].sort((a, b) => b.dia.localeCompare(a.dia)).slice(0, limite);
}

// ── Calendário ──────────────────────────────────────────────────────────

export interface CelulaDoCalendario {
  dia: string;
  eventos: number;
  /** 0 = nenhum; 1–4 = faixas de intensidade. */
  tom: 0 | 1 | 2 | 3 | 4;
  futuro: boolean;
}

/** `semanas` colunas de domingo a sábado, terminando na semana de `hoje`. */
export function calendario(dias: readonly DiaDeEstudo[], hoje: string, semanas: number): CelulaDoCalendario[][] {
  const mapa = new Map(dias.map((d) => [d.dia, d.eventos]));
  const h = paraDia(hoje);
  const diaDaSemana = new Date(h * DIA_MS).getUTCDay(); // 0 = domingo
  const primeiro = h - diaDaSemana - (semanas - 1) * 7;
  const tom = (n: number): CelulaDoCalendario['tom'] => (n <= 0 ? 0 : n <= 2 ? 1 : n <= 5 ? 2 : n <= 10 ? 3 : 4);
  const colunas: CelulaDoCalendario[][] = [];
  for (let s = 0; s < semanas; s++) {
    const col: CelulaDoCalendario[] = [];
    for (let d = 0; d < 7; d++) {
      const n = primeiro + s * 7 + d;
      const dia = deDia(n);
      const eventos = mapa.get(dia) ?? 0;
      col.push({ dia, eventos, tom: n > h ? 0 : tom(eventos), futuro: n > h });
    }
    colunas.push(col);
  }
  return colunas;
}

// ── Estatísticas da semana (V2, "estude o Duolingo") ────────────────────
//
// O Duolingo mostra XP por dia na semana, a comparação com a semana
// anterior e o turno em que a pessoa estuda. Tudo aqui sai das mesmas
// duas listas do backend; nada é estimado.

const diaNoFuso = (iso: string, fuso: string) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: fuso, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso));

/** XP de cada dia (AAAA-MM-DD no fuso): primeiras vezes do dia + 5 por dia com estudo. */
export function xpPorDia(primeiras: readonly PrimeiraVez[], dias: readonly DiaDeEstudo[], fuso: string): Map<string, number> {
  const m = new Map<string, number>();
  for (const d of dias) if (d.eventos > 0) m.set(d.dia, (m.get(d.dia) ?? 0) + XP_POR_DIA);
  for (const p of primeiras) {
    const xp = xpDe(p.tipo);
    if (!xp) continue;
    const dia = diaNoFuso(p.em, fuso);
    m.set(dia, (m.get(dia) ?? 0) + xp);
  }
  return m;
}

export interface Semana {
  /** Sete dias terminando em `hoje`, do mais antigo ao mais novo. */
  dias: { dia: string; xp: number }[];
  total: number;
  anterior: number;
}

export function semanaDeXp(porDia: ReadonlyMap<string, number>, hoje: string): Semana {
  const h = paraDia(hoje);
  const dias = Array.from({ length: 7 }, (_, i) => {
    const dia = deDia(h - 6 + i);
    return { dia, xp: porDia.get(dia) ?? 0 };
  });
  let anterior = 0;
  for (let i = 7; i < 14; i++) anterior += porDia.get(deDia(h - i)) ?? 0;
  return { dias, total: dias.reduce((s, d) => s + d.xp, 0), anterior };
}

export function melhorDia(porDia: ReadonlyMap<string, number>): { dia: string; xp: number } | null {
  let melhor: { dia: string; xp: number } | null = null;
  for (const [dia, xp] of porDia) if (!melhor || xp > melhor.xp || (xp === melhor.xp && dia > melhor.dia)) melhor = { dia, xp };
  return melhor;
}

export type Turno = 'madrugada' | 'manhã' | 'tarde' | 'noite';

/** O turno com mais atividades registradas pela primeira vez (hora no fuso). null sem registro. */
export function turnoPreferido(primeiras: readonly PrimeiraVez[], fuso: string): { turno: Turno; parte: number } | null {
  if (primeiras.length === 0) return null;
  const hora = new Intl.DateTimeFormat('en-GB', { timeZone: fuso, hour: '2-digit', hourCycle: 'h23' });
  const conta: Record<Turno, number> = { madrugada: 0, manhã: 0, tarde: 0, noite: 0 };
  for (const p of primeiras) {
    const h = Number(hora.format(new Date(p.em)));
    conta[h < 5 ? 'madrugada' : h < 12 ? 'manhã' : h < 18 ? 'tarde' : 'noite']++;
  }
  const [turno, n] = (Object.entries(conta) as [Turno, number][]).sort((a, b) => b[1] - a[1])[0];
  return { turno, parte: n / primeiras.length };
}
