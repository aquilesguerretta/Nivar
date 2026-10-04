/**
 * Loader da marca: o próprio N da casa, geometria estática. A animação é só `transform` —
 * scale de 0.12 a 1 com dois giros completos, 3.4s, em loop. Nunca anima `d`.
 * `vector-effect="non-scaling-stroke"` mantém os 11px de traço constantes em qualquer escala,
 * o que funde as pernas num núcleo denso quando colapsado, sem afinar.
 * O traço carrega o gradiente de incandescência interno e não aceita troca de cor.
 */
export interface BrandLoaderProps {
  /** lado do quadrado em px; o viewBox é sempre 100×100 */
  size?: number;
  /** etiqueta mono abaixo da marca, ex. 'Lendo CCEE · ciclo 2026-08' */
  legenda?: string;
  className?: string;
}
export declare function BrandLoader(props: BrandLoaderProps): JSX.Element;
/** Geometria estática do N. Idêntica a assets/marks/nivar-casa.svg. */
export declare const PATH_N: string;
