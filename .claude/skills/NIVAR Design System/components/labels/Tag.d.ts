/**
 * Etiqueta inline curta — família de produto ou marcador de procedência. Retângulo com fio
 * de 1px, sem preenchimento. Nunca pílula, nunca preenchimento sólido colorido.
 * Em variante de família o fio recebe a cor da família e o texto permanece --text-strong:
 * advisory e intelligence a 1.9:1 e 1.4:1 sobre papel não podem ser cor de texto.
 */
export interface TagProps {
  variant?: 'neutro' | 'forte' | 'ilustrativa';
  /** define o fio na cor da família e ignora `variant` */
  familia?: 'intelligence' | 'advisory' | 'software' | 'academy' | 'hardware';
  /** círculo pleno de 7px na cor da família — a única forma redonda do sistema */
  ponto?: boolean;
  children?: React.ReactNode;
  className?: string;
}
export declare function Tag(props: TagProps): JSX.Element;
