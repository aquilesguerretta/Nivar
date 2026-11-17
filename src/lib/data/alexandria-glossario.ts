// alexandria-glossario.ts
// Glossário Alexandria — os glossários dos 17 módulos, 2.124 verbetes.
//
// DADO. Os verbetes vivem em `alexandria-glossario-modulos/mNN.ts`, um arquivo
// por módulo, GERADOS por `tools/alexandria-dados/glossario/gerar-glossario.mjs`
// a partir só da extração verificada (`docs/alexandria-v2/extraction/glossario/
// glossario.json`). Termo, etiqueta/família e definição são literais da fonte;
// o HTML inline (<b>, <em>, entidades) é preservado. O verificador
// (`verificar-glossario.mjs`) confere 0 falta / 0 órfão contra a extração.
//
// Os 637 verbetes dos M01–M08 que o produto já tinha mantêm o id de antes
// (`gl-…` no M01, `gl-mNN-…` nos demais); os 1.487 novos (M09–M17) seguem a
// mesma convenção. Ids são namespaçados por módulo porque o mesmo termo é
// definido em mais de um módulo, cada um com a sua definição — são verbetes
// distintos, nunca fundidos (decisão de 15/11/2026, seção Glossário).
//
// Divergências de contagem da própria fonte (M01: a prosa diz «Vinte e oito
// termos» e o markup tem 38) estão registradas na extração (COBERTURA.md) e não
// são corrigidas aqui. O markup vence.
//
// AULA. A fonte não liga verbete a aula. O vínculo é MECÂNICO (decisão 5): o
// termo aparece literalmente no texto da aula — `aulaIds` é calculado aqui, sob
// demanda e por módulo, sobre o corpo REAL das aulas (`getCorpoAula`), pela
// regra de `src/lib/alexandria/glossario-ocorrencia.ts`. Como o corpo das aulas
// está sendo portado em paralelo, o vínculo acompanha o texto que está no
// produto, sem lista a manter. A tela diz "aparece na Aula N", nunca "ensinado".
// Os `aulaIds` de antes (Wave 8 por leitura, Wave 34 por cabeçalho) saíram.

import type { GlossaryTerm } from '@/lib/types/alexandria';
import { indice } from '@/lib/alexandria/indice';
import { aulasOndeAparece } from '@/lib/alexandria/glossario-ocorrencia';
import { getCorpoAula, idDaAula } from './alexandria-curriculo';
import { GLOSSARIO_POR_MODULO, type VerbeteDaFonte } from './alexandria-glossario-modulos';

export type { VerbeteDaFonte };

const cacheAulas = new Map<string, Map<string, string[]>>();

/** Para cada verbete do glossário de um módulo, as aulas DO MESMO módulo em
 *  que o termo aparece. Calculado uma vez por módulo, na primeira leitura. */
export function aulasDoGlossarioDoModulo(moduloId: string): Map<string, string[]> {
  const pronto = cacheAulas.get(moduloId);
  if (pronto) return pronto;
  const verbetes = GLOSSARIO_POR_MODULO.find((m) => m.moduloId === moduloId)?.verbetes ?? [];
  const modulo = indice.modulos.find((m) => m.id === moduloId);
  const aulas = (modulo?.aulas ?? []).map((a) => {
    const id = idDaAula(moduloId, a.numero);
    return { id, blocos: getCorpoAula(id) };
  });
  const mapa = aulasOndeAparece(
    aulas,
    verbetes.map((v) => ({ id: v.id, termo: v.term })),
  );
  cacheAulas.set(moduloId, mapa);
  return mapa;
}

function comoTermo(v: VerbeteDaFonte, moduloId: string): GlossaryTerm {
  return {
    id: v.id,
    term: v.term,
    unit: v.unit,
    definition: v.definition,
    get aulaIds() {
      return aulasDoGlossarioDoModulo(moduloId).get(v.id) ?? [];
    },
  };
}

/** Módulo de origem de cada verbete ('modulo-09'), pelo arquivo de onde veio. */
export const MODULO_DO_VERBETE: ReadonlyMap<string, string> = new Map(
  GLOSSARIO_POR_MODULO.flatMap((m) => m.verbetes.map((v) => [v.id, m.moduloId] as const)),
);

/** Id do verbete na extração ('m09-lex-001'), para a procedência. */
export const FONTE_DO_VERBETE: ReadonlyMap<string, string> = new Map(
  GLOSSARIO_POR_MODULO.flatMap((m) => m.verbetes.map((v) => [v.id, v.fonte] as const)),
);

const VERBETES: GlossaryTerm[] = GLOSSARIO_POR_MODULO.flatMap((m) =>
  m.verbetes.map((v) => comoTermo(v, m.moduloId)),
);

/** Ordem ALFABÉTICA global no export — o GlossarioView agrupa por letra
 *  inicial assumindo catálogo ordenado. A ordenação mora aqui, na fronteira
 *  do dado, para os arquivos continuarem organizados por procedência. */
export const ALEXANDRIA_GLOSSARIO: GlossaryTerm[] = [...VERBETES].sort((a, b) =>
  a.term.localeCompare(b.term, 'pt-BR', { sensitivity: 'base' }),
);

/** Verbetes do glossário do módulo da aula que aparecem nela. */
export const getTermosByAula = (aulaId: string): GlossaryTerm[] => {
  const moduloId = `modulo-${aulaId.slice(5, 7)}`;
  return ALEXANDRIA_GLOSSARIO.filter(
    (t) => MODULO_DO_VERBETE.get(t.id) === moduloId && t.aulaIds.includes(aulaId),
  );
};

export const getTermoById = (id: string): GlossaryTerm | undefined =>
  ALEXANDRIA_GLOSSARIO.find((t) => t.id === id);
