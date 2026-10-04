/**
 * Abas de alternância de vista. A ativa é marcada por fio de 2px sob o texto, na cor da
 * família quando houver — nunca fundo preenchido, nunca pílula.
 */
export interface TabItem { value: string; label: string; disabled?: boolean }
export interface TabsProps {
  items: Array<string | TabItem>;
  /** controlado; omita para o componente guardar o estado */
  value?: string;
  onChange?: (value: string) => void;
  /** cor do fio da aba ativa; sem isso usa --accent-house */
  familia?: 'intelligence' | 'advisory' | 'software' | 'academy' | 'hardware';
  /** força o hover num item — só para especimen */
  stateHover?: string;
  className?: string;
}
export declare function Tabs(props: TabsProps): JSX.Element;
