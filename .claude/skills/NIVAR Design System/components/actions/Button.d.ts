/**
 * Botão NIVAR. Três variantes, raio 0, sem sombra. Hover muda cor de texto e de fio em
 * 200ms — nunca elevação, nunca escala. Press desce um passo na escala de incandescência.
 * Foco é anel advisory 2px com offset 2px.
 *
 * @startingPoint section="Ações" subtitle="Primário, secundário e terciário nos dois modos" viewport="700x340"
 */
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** primario = ação da casa (preenchimento brasa) · secundario = fio · terciario = texto com fio inferior */
  variant?: 'primario' | 'secundario' | 'terciario';
  size?: 'padrao' | 'compacto';
  /** glifo unicode em mono, à esquerda do rótulo (ex. '→', '↓', '×') */
  glifo?: string;
  /** força visualmente um estado — só para especimen e documentação */
  state?: 'repouso' | 'hover' | 'press' | 'foco';
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}
export declare function Button(props: ButtonProps): JSX.Element;
