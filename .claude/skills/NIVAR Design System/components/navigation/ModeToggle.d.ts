/**
 * Seletor de modo. Texto em mono, sem caixa e sem ícone de sol ou lua. O ativo recebe fio
 * inferior de 1px. Transição de 150ms com o easing do sistema.
 */
export interface ModeToggleProps {
  /** controlado; omita para deixar o componente guardar o estado */
  value?: 'claro' | 'noturno';
  onChange?: (modo: 'claro' | 'noturno') => void;
  /** 'documento' escreve data-mode em <html> */
  target?: 'documento';
  className?: string;
}
export declare function ModeToggle(props: ModeToggleProps): JSX.Element;
