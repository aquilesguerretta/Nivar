// Agrega a avaliação de M02–M17 (o M01 está em ../avaliacao.dados.ts, gerado).
import * as M02 from './m02.dados';
import * as M03 from './m03.dados';
import * as M04 from './m04.dados';
import * as M05 from './m05.dados';
import * as M06 from './m06.dados';
import * as M07 from './m07.dados';
import * as M08 from './m08.dados';
import * as M09 from './m09.dados';
import * as M10 from './m10.dados';
import * as M11 from './m11.dados';
import * as M12 from './m12.dados';
import * as M13 from './m13.dados';
import * as M14 from './m14.dados';
import * as M15 from './m15.dados';
import * as M16 from './m16.dados';
import * as M17 from './m17.dados';

const TODOS = [M02, M03, M04, M05, M06, M07, M08, M09, M10, M11, M12, M13, M14, M15, M16, M17];

export const EXERCICIOS_DAS_AULAS = TODOS.flatMap((m) => m.EXERCICIOS_DAS_AULAS);
export const EXERCICIOS_DO_MODULO = TODOS.flatMap((m) => m.EXERCICIOS_DO_MODULO);
export const PROVAS = TODOS.flatMap((m) => m.PROVAS);
export const CHECKLISTS = TODOS.flatMap((m) => m.CHECKLISTS);
