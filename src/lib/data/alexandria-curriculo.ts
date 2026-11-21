// alexandria-curriculo.ts
// Resolvedor único de conteúdo de aula — o índice que a interface consulta.
//
// POR QUE ESTE ARQUIVO EXISTE
//
// Antes dele, três consumidores fixavam o Módulo 01 na mão:
//   · `AlexandriaRouter.tsx`  → `getAulaModulo01(...)`
//   · `AulaViewer.tsx`        → `MODULO_01_CORPO` / `MODULO_01_LEAD`
//   · `ModuloAulaList.tsx`    → nem consultava; imprimia "Aula N de T"
//
// O resultado era que o Módulo 02, extraído e testado na Wave 18, existia
// no disco e não chegava na tela: a aula caía no estado "ainda não
// extraída" e a lista mostrava título genérico.
//
// Com o índice centralizado aqui, acrescentar o Módulo 03 é editar as
// três linhas de `import` e as três de agregação ABAIXO — nenhum
// componente muda. Era esse o acoplamento que precisava sumir.

import type { CurriculumAula } from '@/lib/types/alexandria';
import {
  MODULO_01_AULAS,
  MODULO_01_CORPO,
  MODULO_01_LEAD,
  type AulaBloco,
} from './alexandria-modulo-01-content';
import {
  MODULO_02_AULAS,
  MODULO_02_CORPO,
  MODULO_02_LEAD,
} from './alexandria-modulo-02-content';
import {
  MODULO_03_AULAS,
  MODULO_03_CORPO,
  MODULO_03_LEAD,
} from './alexandria-modulo-03-content';
import {
  MODULO_04_AULAS,
  MODULO_04_CORPO,
  MODULO_04_LEAD,
} from './alexandria-modulo-04-content';
import {
  MODULO_05_AULAS,
  MODULO_05_CORPO,
  MODULO_05_LEAD,
} from './alexandria-modulo-05-content';
import {
  MODULO_06_AULAS,
  MODULO_06_CORPO,
  MODULO_06_LEAD,
} from './alexandria-modulo-06-content';
import {
  MODULO_07_AULAS,
  MODULO_07_CORPO,
  MODULO_07_LEAD,
} from './alexandria-modulo-07-content';
import {
  MODULO_08_AULAS,
  MODULO_08_CORPO,
  MODULO_08_LEAD,
} from './alexandria-modulo-08-content';
import {
  MODULO_11_AULAS,
  MODULO_11_CORPO,
  MODULO_11_LEAD,
} from './alexandria-modulo-11-content';
import {
  MODULO_09_AULAS,
  MODULO_09_CORPO,
  MODULO_09_LEAD,
} from './alexandria-modulo-09-content';
import {
  MODULO_12_AULAS,
  MODULO_12_CORPO,
  MODULO_12_LEAD,
} from './alexandria-modulo-12-content';
import {
  MODULO_13_AULAS,
  MODULO_13_CORPO,
  MODULO_13_LEAD,
} from './alexandria-modulo-13-content';
import {
  MODULO_10_AULAS,
  MODULO_10_CORPO,
  MODULO_10_LEAD,
} from './alexandria-modulo-10-content';
import {
  MODULO_14_AULAS,
  MODULO_14_CORPO,
  MODULO_14_LEAD,
} from './alexandria-modulo-14-content';
import {
  MODULO_15_AULAS,
  MODULO_15_CORPO,
  MODULO_15_LEAD,
} from './alexandria-modulo-15-content';
import {
  MODULO_16_AULAS,
  MODULO_16_CORPO,
  MODULO_16_LEAD,
} from './alexandria-modulo-16-content';
import {
  MODULO_17_AULAS,
  MODULO_17_CORPO,
  MODULO_17_LEAD,
} from './alexandria-modulo-17-content';

// ── Agregação. Acrescentar módulo novo é acrescentar aqui. ─────────
//
// O Módulo 03 (Wave 19) entrou exatamente assim: um bloco de `import` e
// três spreads. Nenhum componente foi tocado — o desacoplamento que a
// fiação do Módulo 02 construiu se pagou na primeira vez que foi usado.
const AULAS: CurriculumAula[] = [
  ...MODULO_01_AULAS,
  ...MODULO_02_AULAS,
  ...MODULO_03_AULAS,
  ...MODULO_04_AULAS,
  ...MODULO_05_AULAS,
  ...MODULO_06_AULAS,
  ...MODULO_07_AULAS,
  ...MODULO_08_AULAS,
  ...MODULO_09_AULAS,
  ...MODULO_10_AULAS,
  ...MODULO_12_AULAS,
  ...MODULO_11_AULAS,
  ...MODULO_13_AULAS,
  ...MODULO_14_AULAS,
  ...MODULO_15_AULAS,
  ...MODULO_16_AULAS,
  ...MODULO_17_AULAS,
];
const CORPO: Record<string, AulaBloco[]> = {
  ...MODULO_01_CORPO,
  ...MODULO_02_CORPO,
  ...MODULO_03_CORPO,
  ...MODULO_04_CORPO,
  ...MODULO_05_CORPO,
  ...MODULO_06_CORPO,
  ...MODULO_07_CORPO,
  ...MODULO_08_CORPO,
  ...MODULO_09_CORPO,
  ...MODULO_10_CORPO,
  ...MODULO_12_CORPO,
  ...MODULO_11_CORPO,
  ...MODULO_13_CORPO,
  ...MODULO_14_CORPO,
  ...MODULO_15_CORPO,
  ...MODULO_16_CORPO,
  ...MODULO_17_CORPO,
};
const LEAD: Record<string, string> = {
  ...MODULO_01_LEAD,
  ...MODULO_02_LEAD,
  ...MODULO_03_LEAD,
  ...MODULO_04_LEAD,
  ...MODULO_05_LEAD,
  ...MODULO_06_LEAD,
  ...MODULO_07_LEAD,
  ...MODULO_08_LEAD,
  ...MODULO_09_LEAD,
  ...MODULO_10_LEAD,
  ...MODULO_12_LEAD,
  ...MODULO_11_LEAD,
  ...MODULO_13_LEAD,
  ...MODULO_14_LEAD,
  ...MODULO_15_LEAD,
  ...MODULO_16_LEAD,
  ...MODULO_17_LEAD,
};

// Os ids são únicos por construção (`aula-01-NN` × `aula-02-NN`), mas o
// spread acima é silencioso em caso de colisão — um módulo novo com id
// repetido apagaria o corpo do anterior sem aviso. A trava avisa em DEV.
if (import.meta.env.DEV) {
  const vistos = new Set<string>();
  const duplicados = AULAS.map((a) => a.id).filter((id) => {
    if (vistos.has(id)) return true;
    vistos.add(id);
    return false;
  });
  if (duplicados.length > 0) {
    console.warn(
      `[alexandria] ids de aula duplicados no catálogo: ${duplicados.join(', ')}. ` +
        'O último módulo agregado sobrescreveu o corpo do anterior.',
    );
  }
}

/** `('modulo-02', 3)` → `'aula-02-03'`. A convenção de id é da fonte:
 *  o número do módulo vive no próprio id da aula. */
export const idDaAula = (moduloId: string, numero: number): string =>
  `${moduloId.replace('modulo', 'aula')}-${String(numero).padStart(2, '0')}`;

/** A aula extraída, ou null quando o módulo ainda não tem conteúdo. */
export const getAula = (aulaId: string): CurriculumAula | null =>
  AULAS.find((a) => a.id === aulaId) ?? null;

/** Atalho para quem tem módulo + número em mãos (router e lista). */
export const getAulaDoModulo = (moduloId: string, numero: number): CurriculumAula | null =>
  getAula(idDaAula(moduloId, numero));

/** Blocos de apostila. Vazio — nunca undefined — quando não há corpo. */
export const getCorpoAula = (aulaId: string): AulaBloco[] => CORPO[aulaId] ?? [];

/** Lead da aula, ou undefined quando a fonte não traz. */
export const getLeadAula = (aulaId: string): string | undefined => LEAD[aulaId];

/** Módulos com conteúdo extraído hoje — derivado, nunca digitado.
 *  Alimenta as cópias de estado vazio, para não citarem "Módulo 01" fixo. */
export const MODULOS_COM_CONTEUDO: string[] = [
  ...new Set(AULAS.map((a) => a.moduleId)),
];

/** Total de aulas com corpo real, somando todos os módulos extraídos. */
export const TOTAL_AULAS_EXTRAIDAS = AULAS.length;
