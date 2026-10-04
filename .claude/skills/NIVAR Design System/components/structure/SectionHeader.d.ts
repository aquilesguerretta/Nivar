/**
 * Cabeçalho de seção: número em mono de dois dígitos em brasa, título em Zilla Slab, fio
 * que preenche o vão e nota à direita — tudo numa única linha de baseline. Sem container.
 *
 * @startingPoint section="Estrutura" subtitle="Número, título, fio e nota numa linha de baseline" viewport="700x150"
 */
export interface SectionHeaderProps {
  /** número ou string; recebe padStart(2,'0') */
  numero?: number | string;
  titulo: React.ReactNode;
  /** nota à direita, em mono versalete */
  nota?: string;
  /** título em 24px em vez de 19px */
  grande?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  className?: string;
}
export declare function SectionHeader(props: SectionHeaderProps): JSX.Element;
