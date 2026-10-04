/**
 * Rádio. Exatamente o tratamento do `Checkbox`, só redondo — 15px, fio de 1px em repouso,
 * marcado preenche com a cor de acento em uso no contexto (`--acento-contexto`).
 *
 * **É a segunda exceção declarada de raio pleno**, ao lado do ponto de série, do nó de grafo e
 * do ponto de família. Redondo aqui não é enfeite: é a convenção que distingue escolha única de
 * escolha múltipla sem precisar de texto explicando.
 *
 * Marcado não usa glifo: um disco pleno concêntrico, porque `×` dentro de círculo lê como
 * "cancelado". A caixa quadrada usa glifo; o rádio usa disco.
 */
export interface RadioProps {
  label?: React.ReactNode;
  nota?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  state?: 'repouso' | 'hover' | 'foco';
  id?: string;
  /** obrigatório para agrupar: rádios com o mesmo `name` são mutuamente exclusivos */
  name?: string;
  value?: string;
  className?: string;
}
export declare function Radio(props: RadioProps): JSX.Element;
