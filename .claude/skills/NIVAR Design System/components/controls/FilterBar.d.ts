/**
 * Barra de filtro: campos numa linha, mais aplicar e limpar. Cada campo mantém o próprio fio
 * de 1px; a barra NÃO recebe container ao redor do conjunto — container só quando o conteúdo
 * precisa de fronteira real, e um agrupamento de filtros não precisa.
 */
export interface FilterBarProps {
  /** Input, NumberInput, Select — cada filho vira uma célula flexível */
  children?: React.ReactNode;
  /** normalmente Button primário 'Aplicar' + terciário 'Limpar' */
  acoes?: React.ReactNode;
  /** eco do filtro em vigor, em mono versalete */
  resumo?: string[];
  className?: string;
}
export declare function FilterBar(props: FilterBarProps): JSX.Element;
