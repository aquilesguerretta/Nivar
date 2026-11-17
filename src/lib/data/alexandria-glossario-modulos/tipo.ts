// GERADO por tools/alexandria-dados/glossario/gerar-glossario.mjs — não editar à mão.

/** Um verbete do glossário de um módulo, literal da extração. */
export interface VerbeteDaFonte {
  /** id do produto ('gl-…'). */
  id: string;
  /** id do verbete na extração ('m09-lex-001'), para a procedência. */
  fonte: string;
  /** Termo literal da fonte. */
  term: string;
  /** Etiqueta (M01–M03) ou família (M04–M17), literal da fonte. */
  unit: string;
  /** HTML inline da fonte (<b>, <strong>, <em>, <i> e entidades). */
  definition: string;
}
