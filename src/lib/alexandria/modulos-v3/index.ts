// Agrega os módulos M02–M17 do modelo de aula v3 (o M01 vive nos arquivos originais).
import type { ModuloV3 } from './tipos';
import { MODULO_V3 as M02 } from './m02';
import { MODULO_V3 as M03 } from './m03';
import { MODULO_V3 as M04 } from './m04';
import { MODULO_V3 as M05 } from './m05';
import { MODULO_V3 as M06 } from './m06';
import { MODULO_V3 as M07 } from './m07';
import { MODULO_V3 as M08 } from './m08';
import { MODULO_V3 as M09 } from './m09';
import { MODULO_V3 as M10 } from './m10';
import { MODULO_V3 as M11 } from './m11';
import { MODULO_V3 as M12 } from './m12';
import { MODULO_V3 as M13 } from './m13';
import { MODULO_V3 as M14 } from './m14';
import { MODULO_V3 as M15 } from './m15';
import { MODULO_V3 as M16 } from './m16';
import { MODULO_V3 as M17 } from './m17';

export type { ModuloV3 };

export const MODULOS_V3: readonly ModuloV3[] = [M02, M03, M04, M05, M06, M07, M08, M09, M10, M11, M12, M13, M14, M15, M16, M17];

/** Módulos cujas aulas montam no modelo v3 (o M01 sempre). */
export const MODULOS_NO_MODELO_V3: ReadonlySet<string> = new Set([
  'modulo-01',
  ...MODULOS_V3.filter((m) => m.pronto).map((m) => m.moduloId),
]);
