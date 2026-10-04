/**
 * Campo de seleção. Nativo, sem raio, glifo ▾ em mono — sem ícone importado.
 */
export interface SelectOption { value: string; label: string }
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  hint?: string;
  error?: string;
  /** strings ou pares { value, label } */
  options?: Array<string | SelectOption>;
  /** primeira opção vazia */
  placeholder?: string;
  /** asterisco em acento junto ao rótulo — a convenção única de campo obrigatório */
  obrigatorio?: boolean;
  disabled?: boolean;
  state?: 'foco';
  id?: string;
  className?: string;
}
export declare function Select(props: SelectProps): JSX.Element;
