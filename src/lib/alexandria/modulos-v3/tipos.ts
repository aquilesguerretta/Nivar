// O que cada módulo acrescenta ao modelo de aula v3. Um arquivo por módulo
// (m02.ts … m17.ts), para que as sessões de porte trabalhem em paralelo sem
// tocar arquivo compartilhado. O M01 segue nos arquivos originais
// (figuras.ts, previsoes.ts, diagramas/index.ts), que agregam estes.

import type { ComponentType } from 'react';
import type { FiguraDaAula } from '../figuras';
import type { PrevisaoDoInstrumento } from '@/components/alexandria/v3/aula/previsoes';

export interface ModuloV3 {
  moduloId: string;
  /** true quando as aulas do módulo montam no modelo v3. A sessão de porte só
   *  liga depois de verificar as aulas no render. */
  pronto: boolean;
  /** Figuras das aulas (foto, gerada-realista, diagrama), como em figuras.ts. */
  figuras: readonly FiguraDaAula[];
  /** id do bloco da extração → trecho literal que o identifica (âncora das figuras). */
  trechos: Readonly<Record<string, string>>;
  /** Nome em `FiguraDaAula.diagrama` → componente. */
  diagramas: Readonly<Record<string, ComponentType>>;
  /** Previsão e véu de cada instrumento (ver previsoes.ts). */
  previsoes: readonly PrevisaoDoInstrumento[];
}
