/**
 * Card de dado: região delimitada por fio de 1px, sem raio e sem sombra. Dentro de
 * DataCardGrid os cards compartilham fio com o vizinho — nunca card dentro de card.
 *
 * @startingPoint section="Dado" subtitle="Grade de cards com fio compartilhado" viewport="700x200"
 */
export interface DataCardProps {
  /** etiqueta versalete de 11px */
  etiqueta?: string;
  /** número (formatado) ou string já pronta */
  valor: number | string;
  casas?: number;
  unidade?: string;
  /** variação; colore por direção de mercado, não por sucesso/erro */
  delta?: number;
  deltaSufixo?: string;
  nota?: string;
  /** fio de 2px no topo na cor da família */
  familia?: 'intelligence' | 'advisory' | 'software' | 'academy' | 'hardware';
  /** fio próprio, para uso fora da grade */
  solto?: boolean;
  className?: string;
}
export declare function DataCard(props: DataCardProps): JSX.Element;

export interface DataCardGridProps {
  columns?: number;
  children?: React.ReactNode;
  className?: string;
}
/** Grade de fio colapsado. Adição intencional: é o que torna real o fio compartilhado. */
export declare function DataCardGrid(props: DataCardGridProps): JSX.Element;
