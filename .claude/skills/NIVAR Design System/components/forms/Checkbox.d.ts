/**
 * Caixa de seleção. Quadrado de 15px, raio zero, fio de 1px em repouso. Marcada, preenche com
 * a **cor de acento em uso no contexto** (`--acento-contexto`, que cai para `--accent-house`)
 * — nunca uma cor própria fixa: a caixa herda a temperatura da família da tela onde está.
 *
 * O glifo de marcação é `×` em mono, não um "check" de biblioteca de ícone: nenhuma biblioteca
 * entrou no sistema, e o `×` já é o glifo de marcação declarado. Estado indeterminado usa `–`.
 *
 * Estados: repouso, hover (cor de fio), marcado, desabilitado (opacidade 0.4, sem troca de cor).
 * `state` força um estado só para especimen.
 */
export interface CheckboxProps {
  label?: React.ReactNode;
  /** segunda linha em corpo menor, para qualificar a opção */
  nota?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  /** força visualmente um estado — só para especimen e documentação */
  state?: 'repouso' | 'hover' | 'foco';
  /** marca parcial de um grupo: glifo `–` no lugar de `×` */
  indeterminado?: boolean;
  id?: string;
  name?: string;
  value?: string;
  className?: string;
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;
