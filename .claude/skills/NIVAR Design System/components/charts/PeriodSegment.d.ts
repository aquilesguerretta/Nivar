/**
 * Controle segmentado de período — `1D · 1S · 1M · 1A · MÁX` sobre série temporal.
 *
 * **Não é `Tabs`.** Aba troca de vista e usa corpo de 13.5px com fio de 2px da família; isto é
 * seletor denso e curto, em mono de 10.5px com separador `·`, e vive dentro do cabeçalho do
 * gráfico. Um sobre o outro na mesma tela não confunde porque a tipografia declara a diferença:
 * mono versalete é recorte de dado, corpo é navegação.
 *
 * O ativo é marcado por **fio mais forte** (2px na cor de acento em uso no contexto) e texto em
 * `--text-strong`. Nunca fundo preenchido, nunca pílula, nunca cápsula com o segmento ativo
 * deslizando — o sistema não anima posição de layout.
 */
export interface PeriodoOpcao {
  id: string;
  /** rótulo curto em versalete: '1D', '1S', 'MÁX' */
  rotulo: string;
  /** texto de `title`, por extenso */
  titulo?: string;
}
export interface PeriodSegmentProps {
  value?: string;
  onChange?: (id: string) => void;
  /** por padrão 1D · 1S · 1M · 1A · MÁX (`PERIODOS`) */
  opcoes?: PeriodoOpcao[];
  /** recortes sem dado no período — opacidade 0.4, sem troca de cor */
  desabilitados?: string[];
  rotulo?: string;
  className?: string;
}
export declare function PeriodSegment(props: PeriodSegmentProps): JSX.Element;
/** A lista canônica de recortes. */
export declare const PERIODOS: PeriodoOpcao[];
