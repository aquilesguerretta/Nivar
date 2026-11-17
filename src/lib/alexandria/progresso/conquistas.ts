// conquistas.ts — a família CONCLUSÃO, em lógica PURA.
//
// Especificação: `docs/alexandria-v2/estudos/movimento-e-conquistas/
// sistema-de-conquistas.md` §1 (redação e dado), §2.1 (catálogo) e §8
// (casos-limite). É a única família computável hoje: lê `aula_concluida`
// (via `aulasConcluidas` do servidor) e mostra a data real de
// `badge_award.awarded_at`. PRÁTICA, EXPLORAÇÃO e HÁBITO ficam em desenho.
//
// Puro como `regras.ts`: o currículo entra por parâmetro
// (`CurriculoParaConquistas`), nunca por import de `@/lib/data`. Quem monta o
// currículo real é `src/lib/progress/badgeRules.ts`.
//
// CONQUISTA É COMPORTAMENTO REGISTRADO, DATADO E RASTREÁVEL (§0). Ela
// afirma só o que o evento prova — "concluiu as aulas listadas" —, fica na
// camada de motivação e nunca vale como prova de aprendizagem (bar S3).
// Nenhum nome aqui é de persona, e nenhum texto usa as palavras de
// `PALAVRAS_PROIBIDAS` (o teste varre o catálogo inteiro).

export type Territorio = 'I' | 'II' | 'III';
export const TERRITORIOS: readonly Territorio[] = ['I', 'II', 'III'];

export interface ModuloParaConquistas {
  id: string; // 'modulo-01'
  codigo: string; // 'M01'
  territorio: Territorio | null;
  /** Ids das aulas do módulo no registro (`aula-01-01`…). `null` quando a
   *  contagem não é conhecida. */
  aulaIds: string[] | null;
  /** As duas contagens independentes do módulo concordam (P8). Sem isso a
   *  conquista do módulo é "indisponível", nunca `true` nem `false`. */
  reconciliado: boolean;
}

export interface CurriculoParaConquistas {
  modulos: ModuloParaConquistas[];
}

export type AvaliacaoDeConquista =
  | { estado: 'obtida' }
  | { estado: 'nao-obtida'; feitas: number | null; total: number | null }
  | { estado: 'indisponivel'; razao: string };

export interface ConquistaDeConclusao {
  /** Id gravado em `badge_award.badge_id`: `conclusao.modulo.modulo-01`. */
  id: string;
  familia: 'conclusao';
  nome: string;
  /** Uma frase. Diz o que a conquista não mede, quando a confusão é provável. */
  criterio: string;
  eventos: readonly ['aula_concluida'];
  territorio: Territorio | null;
  /** território (1) > módulo (2) > contagem (3) — momento 8 do movimento. */
  hierarquia: 1 | 2 | 3;
  avaliar: (concluidas: ReadonlySet<string>) => AvaliacaoDeConquista;
}

/** §1.1 — proibidas em nome, critério e celebração (D2, S3, P18). */
export const PALAVRAS_PROIBIDAS: readonly string[] = [
  'domínio',
  'dominado',
  'dominada',
  'domina',
  'mestre',
  'maestria',
  'mastery',
  'especialista',
  'expert',
  'aprovado',
  'aprovada',
  'aprovação',
  'excelente',
  'perfeito',
  'perfeita',
  'gênio',
  'craque',
  'fera',
  'sabe',
  'entende',
  'é capaz de',
  'guardião',
  'cartógrafo',
  'tradutor',
  'aferidor',
  'anatomista',
  'analista',
  'leitor de',
];

const RAZAO_CONTAGEM =
  'Ainda não disponível: a contagem de aulas deste módulo está em revisão.';

const obtida = (): AvaliacaoDeConquista => ({ estado: 'obtida' });
const naoObtida = (feitas: number | null, total: number | null): AvaliacaoDeConquista => ({
  estado: 'nao-obtida',
  feitas,
  total,
});
const indisponivel = (razao: string): AvaliacaoDeConquista => ({ estado: 'indisponivel', razao });

/** Avaliação de um módulo, reutilizada pelas de território e currículo. */
function avaliarModulo(m: ModuloParaConquistas, concluidas: ReadonlySet<string>): AvaliacaoDeConquista {
  if (!m.aulaIds || m.aulaIds.length === 0 || !m.reconciliado) return indisponivel(RAZAO_CONTAGEM);
  const feitas = m.aulaIds.filter((id) => concluidas.has(id)).length;
  return feitas === m.aulaIds.length ? obtida() : naoObtida(feitas, m.aulaIds.length);
}

/** Avaliação de um conjunto de módulos: indisponível se QUALQUER um for —
 *  "território concluído" com módulo de contagem em revisão seria
 *  afirmação sem base. */
function avaliarConjunto(mods: ModuloParaConquistas[], concluidas: ReadonlySet<string>): AvaliacaoDeConquista {
  if (mods.length === 0) return indisponivel('Ainda não disponível: este território não tem módulos no índice.');
  let feitas = 0;
  for (const m of mods) {
    const a = avaliarModulo(m, concluidas);
    if (a.estado === 'indisponivel') return indisponivel(RAZAO_CONTAGEM);
    if (a.estado === 'obtida') feitas += 1;
  }
  return feitas === mods.length ? obtida() : naoObtida(feitas, mods.length);
}

const CONTAGENS = [10, 25, 50, 100] as const;

/**
 * O catálogo da família CONCLUSÃO, derivado do currículo — nunca de número
 * digitado (P22). Ordem estável: primeira aula, primeira de cada território,
 * um por módulo, um por território, currículo, contagens.
 */
export function catalogoDeConclusao(c: CurriculoParaConquistas): ConquistaDeConclusao[] {
  const conhecidas = new Set(c.modulos.flatMap((m) => m.aulaIds ?? []));
  const doCurriculo = (concluidas: ReadonlySet<string>) => [...concluidas].filter((id) => conhecidas.has(id));
  const eventos = ['aula_concluida'] as const;
  const out: ConquistaDeConclusao[] = [];

  out.push({
    id: 'conclusao.primeira-aula',
    familia: 'conclusao',
    nome: 'Primeira aula percorrida',
    criterio: 'Marcou a primeira aula como percorrida.',
    eventos,
    territorio: null,
    hierarquia: 3,
    avaliar: (s) => (doCurriculo(s).length >= 1 ? obtida() : naoObtida(0, 1)),
  });

  for (const t of TERRITORIOS) {
    const mods = c.modulos.filter((m) => m.territorio === t);
    const ids = new Set(mods.flatMap((m) => m.aulaIds ?? []));
    out.push({
      id: `conclusao.primeira-do-territorio.${t}`,
      familia: 'conclusao',
      nome: `Primeira aula do Território ${t} percorrida`,
      // A frase do §2.1 ("a primeira aula de um módulo") lia como "a Aula 01".
      // A regra é outra: qualquer aula do território, a primeira a ser
      // percorrida. O critério diz a regra, não a ambiguidade.
      criterio: `Concluiu, pela primeira vez, uma aula de qualquer módulo do Território ${t}.`,
      eventos,
      territorio: t,
      hierarquia: 3,
      avaliar: (s) => {
        if (ids.size === 0) return indisponivel('Ainda não disponível: as aulas deste território não estão no índice.');
        return [...s].some((id) => ids.has(id)) ? obtida() : naoObtida(0, 1);
      },
    });
  }

  for (const m of c.modulos) {
    const codigo = m.codigo.replace(/^M/, '');
    out.push({
      id: `conclusao.modulo.${m.id}`,
      familia: 'conclusao',
      nome: `Módulo ${codigo} concluído`,
      criterio: `Concluiu todas as aulas listadas do ${m.codigo}. Concluir não é ser avaliado.`,
      eventos,
      territorio: m.territorio,
      hierarquia: 2,
      avaliar: (s) => avaliarModulo(m, s),
    });
  }

  for (const t of TERRITORIOS) {
    const mods = c.modulos.filter((m) => m.territorio === t);
    out.push({
      id: `conclusao.territorio.${t}`,
      familia: 'conclusao',
      nome: `Território ${t} concluído`,
      criterio: `Concluiu todos os módulos do Território ${t}.`,
      eventos,
      territorio: t,
      hierarquia: 1,
      avaliar: (s) => avaliarConjunto(mods, s),
    });
  }

  out.push({
    id: 'conclusao.curriculo',
    familia: 'conclusao',
    nome: 'Os três territórios concluídos',
    criterio: 'Concluiu todos os módulos dos três territórios.',
    eventos,
    territorio: null,
    hierarquia: 1,
    avaliar: (s) => avaliarConjunto(c.modulos, s),
  });

  for (const n of CONTAGENS) {
    out.push({
      id: `conclusao.contagem.${n}`,
      familia: 'conclusao',
      nome: `${n} aulas percorridas`,
      criterio: `Concluiu ${n} aulas diferentes, em qualquer módulo. Repetir aula não conta.`,
      eventos,
      territorio: null,
      hierarquia: 3,
      avaliar: (s) => {
        const feitas = new Set(doCurriculo(s)).size;
        if (conhecidas.size < n) return indisponivel('Ainda não disponível: o índice tem menos aulas do que esta contagem.');
        return feitas >= n ? obtida() : naoObtida(feitas, n);
      },
    });
  }

  return out;
}

export interface ConquistaARegistrar {
  id: string;
  /** A regra já estava satisfeita SEM a aula que acabou de ser concluída —
   *  esta conclusão não a causou (regra nova sobre conclusões antigas). O
   *  texto diz isso (§5, "Obtida, retroativa"), e `awarded_at` continua
   *  sendo o dia do registro, nunca fingido como o dia do fato (§8). */
  retroativa: boolean;
}

/**
 * Quais conquistas registrar depois de uma `aula_concluida` CONFIRMADA.
 *
 * - `aulasConcluidas` vem do servidor (`GET /me`), não do estado local.
 * - `jaRegistradas` evita requisição à toa; o backend é idempotente de
 *   qualquer jeito (`badgeAlreadyAwarded`).
 * - "indisponível" nunca registra.
 */
export function conquistasARegistrar(
  catalogo: ConquistaDeConclusao[],
  aulasConcluidas: readonly string[],
  aulaId: string,
  jaRegistradas: readonly string[],
): ConquistaARegistrar[] {
  const com = new Set(aulasConcluidas);
  com.add(aulaId);
  const sem = new Set(aulasConcluidas.filter((id) => id !== aulaId));
  const ja = new Set(jaRegistradas);
  const out: ConquistaARegistrar[] = [];
  for (const c of catalogo) {
    if (ja.has(c.id)) continue;
    if (c.avaliar(com).estado !== 'obtida') continue;
    out.push({ id: c.id, retroativa: c.avaliar(sem).estado === 'obtida' });
  }
  return out;
}

/** Palavras proibidas encontradas num texto, sem diferenciar caixa. Usada
 *  pelo teste; exportada para o chat visual conferir texto novo. */
export function palavrasProibidasEm(texto: string): string[] {
  const t = texto.toLocaleLowerCase('pt-BR');
  const achadas = PALAVRAS_PROIBIDAS.filter((p) => {
    const re = new RegExp(`(^|[^\\p{L}])${p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^\\p{L}])`, 'u');
    return re.test(t);
  });
  if (/\d\s*%/.test(t)) achadas.push('%');
  return achadas;
}
