/**
 * Frescor do dado — três estados, diferenciados por texto em JetBrains Mono.
 *
 * **Proibido semáforo verde / amarelo / vermelho.** Frescor de dado é a mesma categoria de
 * informação que a variação numérica, e o sistema já rejeitou semântica de status na cor do
 * dado: cor é direção de mercado, não estado de UI. Aqui a cor não carrega o estado — o
 * texto carrega. O único marcador visual é um círculo pleno de 6px em neutro quente, no
 * estado `vivo`, e ele nunca é colorido.
 *
 * `amostra ilustrativa` é a única exceção cromática, e é fio, não texto colorido: no claro o
 * rótulo lê em `--text-strong` com fio advisory de 1px embaixo; no noturno o próprio texto
 * passa a advisory (8.6:1 sobre tinta).
 */
export interface DataFreshnessProps {
  estado?: 'vivo' | 'desatualizado' | 'ilustrativa';
  /** o recorte temporal em minúsculas: 'atualizado há 4min', 'última apuração há 6 dias' */
  detalhe?: string;
  /** força o ponto neutro; por padrão só aparece em `vivo` */
  ponto?: boolean;
  className?: string;
}
export declare function DataFreshness(props: DataFreshnessProps): JSX.Element;
