/**
 * Campo de texto. Fio de 1px, raio 0, rótulo em etiqueta versalete de 11px.
 * Estados: vazio, preenchido, foco, erro, desabilitado.
 *
 * @startingPoint section="Formulário" subtitle="Texto, numérico e seleção com todos os estados" viewport="700x400"
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** rótulo em etiqueta versalete — caixa alta aplicada por CSS */
  label?: string;
  /** nota auxiliar; suprimida quando há erro */
  hint?: string;
  /** mensagem de erro. Presente = fio de erro + glifo × */
  error?: string;
  /** asterisco em acento junto ao rótulo — a convenção única de campo obrigatório */
  obrigatorio?: boolean;
  /** verificação assíncrona em andamento: fio se desenhando na base do campo, nunca spinner */
  verificando?: boolean;
  disabled?: boolean;
  /** força o anel de foco — só para especimen */
  state?: 'foco';
  id?: string;
  className?: string;
}
export declare function Input(props: InputProps): JSX.Element;
