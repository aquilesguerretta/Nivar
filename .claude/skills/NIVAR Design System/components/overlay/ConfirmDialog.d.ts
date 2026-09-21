/**
 * Modal de confirmação para ação crítica — exportar, alterar conta. Painel sólido, fio de
 * 1px, raio zero, sem sombra. Nunca cartão flutuante arredondado com sombra difusa.
 */
export interface DialogDetalhe { k: string; v: string }
export interface ConfirmDialogProps {
  eti?: string;
  titulo: string;
  texto?: string;
  /** pares chave/valor com fio entre eles — o que exatamente será feito */
  detalhes?: DialogDetalhe[];
  /** fio advisory de 2px no topo, para ação irreversível */
  critico?: boolean;
  /** normalmente Button terciário 'Cancelar' + primário confirmando */
  acoes?: React.ReactNode;
  className?: string;
}
export declare function ConfirmDialog(props: ConfirmDialogProps): JSX.Element;
