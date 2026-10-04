/**
 * Paginação de tabela. A faixa é sempre '1–25 de 28 934 linhas' — espaço fino no milhar.
 * Controles são texto com fio, sem caixa e sem chip.
 */
export interface PaginationProps {
  pagina?: number;
  porPagina?: number;
  total?: number;
  onChange?: (pagina: number) => void;
  className?: string;
}
export declare function Pagination(props: PaginationProps): JSX.Element;
