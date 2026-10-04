/**
 * Item de navegação. Texto com fio, nunca caixa — elemento de navegação não recebe
 * container individual. Ativo é fio inferior de 2px em --accent-house.
 */
export interface NavItemProps {
  children?: React.ReactNode;
  href?: string;
  ativo?: boolean;
  /** força o hover — só para especimen */
  state?: 'hover';
  onClick?: () => void;
  className?: string;
}
export declare function NavItem(props: NavItemProps): JSX.Element;

export interface NavProps { children?: React.ReactNode; className?: string }
/** Fila de NavItem com gap de 20px. */
export declare function Nav(props: NavProps): JSX.Element;
