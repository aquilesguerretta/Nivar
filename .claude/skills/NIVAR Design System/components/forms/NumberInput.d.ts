/**
 * Campo numérico. JetBrains Mono com tabular-nums, alinhado à direita, sufixo de unidade
 * separado por fio de 1px. Vírgula decimal e espaço fino no milhar.
 */
export interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  /** unidade exibida em etiqueta mono à direita do fio (ex. 'R$/MWh', 'MW', '%') */
  unidade?: string;
  /** asterisco em acento junto ao rótulo — a convenção única de campo obrigatório */
  obrigatorio?: boolean;
  /** verificação assíncrona em andamento: fio se desenhando na base do campo, nunca spinner */
  verificando?: boolean;
  disabled?: boolean;
  state?: 'foco';
  id?: string;
  className?: string;
}
export declare function NumberInput(props: NumberInputProps): JSX.Element;
