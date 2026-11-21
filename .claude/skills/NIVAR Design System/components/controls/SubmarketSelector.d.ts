/**
 * Seletor de submercado — as quatro opções fixas (Norte, Nordeste, Sudeste/Centro-Oeste, Sul)
 * que aparecem em filtro, tabela e gráfico o tempo todo. Componente próprio em vez de `Select`
 * genérico reinventado a cada tela: a lista não é configuração, é o recorte do setor.
 *
 * Quatro opções lado a lado, texto com fio de 1px. A ativa recebe fio de 2px na cor da família
 * em uso — nunca preenchimento sólido, nunca pílula. O padding compensa o fio mais grosso para
 * que a linha de base não se mova entre estados.
 *
 * A lista canônica vive em `components/controls/submercados.js` e não é prop: uma tela que
 * mostra três submercados está errada, não customizada.
 */
export interface SubmarketSelectorProps {
  /** id único ('SE') ou array de ids quando `multiplo` */
  valor?: string | string[];
  onChange?: (valor: string | string[]) => void;
  /** filtro de tabela costuma aceitar mais de um; gráfico de série, um só */
  multiplo?: boolean;
  /** rótulo em versalete; `''` remove (o `aria-label` permanece) */
  rotulo?: string;
  /** cor do fio da opção ativa */
  familia?: 'intelligence' | 'advisory' | 'software' | 'academy' | 'hardware';
  /** usa N / NE / SE-CO / S em vez do nome — só onde a largura é medida, como cabeçalho de coluna */
  sigla?: boolean;
  desabilitados?: string[];
  className?: string;
}
export declare function SubmarketSelector(props: SubmarketSelectorProps): JSX.Element;
