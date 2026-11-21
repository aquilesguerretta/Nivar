/**
 * Controle deslizante. Trilho de 3px com raio zero, preenchido até a alça na cor de acento em
 * uso no contexto (`--acento-contexto`). Alça quadrada de 13px com fio de 1px e preenchimento
 * do substrato — **sem sombra**: profundidade vem do fio, aqui como em todo o sistema.
 *
 * A leitura do valor é obrigatória por padrão e fica em mono tabular à direita do rótulo: um
 * deslizante sem número é um controle que esconde o dado que está mudando.
 *
 * A alça é quadrada porque raio zero é a regra; o círculo é exceção reservada a ponto de série,
 * nó de grafo, ponto de família e `Radio`.
 */
export interface SliderProps {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (valor: number) => void;
  /** unidade em mono versalete ao lado da leitura: 'R$/MWh', '%', 'MWmed' */
  unidade?: string;
  casas?: number;
  disabled?: boolean;
  /** extremos min e max em mono abaixo do trilho */
  marcas?: boolean;
  /** leitura do valor corrente ao lado do rótulo */
  leitura?: boolean;
  id?: string;
  className?: string;
}
export declare function Slider(props: SliderProps): JSX.Element;
