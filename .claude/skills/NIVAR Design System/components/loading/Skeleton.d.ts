/**
 * Skeleton de carregamento. Sem shimmer e sem pulso de opacidade em loop: a revelação é
 * desenho — fio de 1px crescendo em 700ms (tabela e texto) ou barra crescendo em altura em
 * 1200ms (card). Roda uma vez e para; não há animação perpétua.
 */
export interface SkeletonProps {
  /** tabela = cabeçalho + linhas de fio · card = barras crescendo · texto = fios escalonados */
  variant?: 'tabela' | 'card' | 'texto';
  rows?: number;
  columns?: number;
  className?: string;
}
export declare function Skeleton(props: SkeletonProps): JSX.Element;
