/**
 * Campo com unidade — o padrão único de prefixo e sufixo dentro do campo: `R$` à esquerda,
 * `MWh` ou `%` à direita. A unidade é mono, em `--text-faint`, **parte visual do campo e não
 * editável**; não recebe fio separador, porque não é uma segunda célula: é a legenda do número
 * que está sendo digitado.
 *
 * `NumberInput` mantém a unidade atrás de um fio de 1px, e a distinção é declarada: lá a
 * unidade encabeça uma coluna de entrada tabular (uma unidade por coluna, repetida linha a
 * linha); aqui ela qualifica um campo isolado. Fora desses dois casos, este é o padrão.
 *
 * Também hospeda os dois estados novos do sistema:
 * - **obrigatório** — asterisco em `--accent-house` junto ao rótulo, mais texto para leitor de
 *   tela. É a convenção única: não existe a palavra "obrigatório" em versalete, nem "opcional"
 *   nos outros campos.
 * - **verificando** — validação assíncrona antes da resposta. O sinal é um fio de 1px se
 *   desenhando na base do campo, em loop, e a palavra `verificando` em mono. **Nunca spinner
 *   circular**: a revelação neste sistema é desenho de traço.
 */
export interface UnitFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  hint?: string;
  error?: string;
  /** unidade à esquerda do número: 'R$' */
  prefixo?: string;
  /** unidade à direita do número: 'MWh', '%', 'R$/MWh' */
  sufixo?: string;
  obrigatorio?: boolean;
  /** verificação em andamento: fio se desenhando na base, sem spinner */
  verificando?: boolean;
  disabled?: boolean;
  state?: 'repouso' | 'foco';
  /** alinha o valor à direita em mono tabular; `false` para texto */
  numerico?: boolean;
  id?: string;
  className?: string;
}
export declare function UnitField(props: UnitFieldProps): JSX.Element;
