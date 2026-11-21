/**
 * Bloco de citação editorial — destaca um número ou um achado central dentro de um relatório
 * longo. Tipográfico, não decorativo: Zilla Slab em corpo maior e um fio de acento de 2px à
 * esquerda na cor da família do conteúdo.
 *
 * Sem aspas decorativas grandes, sem fundo colorido, sem itálico. O número, quando existe, é
 * mono tabular em 40px e fica em `--text-strong`: número grande em cor de família sobre papel
 * é o erro mais fácil de cometer neste sistema.
 */
export interface PullQuoteProps {
  /** número já formatado — vírgula decimal, espaço fino no milhar */
  numero?: string | number;
  unidade?: string;
  /** a frase; alternativamente passe como children */
  texto?: string;
  /** procedência ou origem do achado, em mono versalete */
  fonte?: string;
  /** define a cor do fio de acento */
  familia?: 'intelligence' | 'advisory' | 'software' | 'academy' | 'hardware';
  children?: React.ReactNode;
  className?: string;
}
export declare function PullQuote(props: PullQuoteProps): JSX.Element;
