/**
 * Notificação transitória: barra de texto plana, sem ícone e sem emoji, com auto-dispensa.
 * Nunca bolha flutuante centralizada — a barra é ancorada na largura do conteúdo.
 */
export interface ToastProps {
  mensagem: string;
  /** horário em mono, ex. '14:32 BRT' */
  timestamp?: string;
  /** ms até dispensar; 0 desliga a auto-dispensa */
  duracao?: number;
  /** fio advisory de 2px no topo, para aviso que pede atenção */
  advisory?: boolean;
  onDispensar?: () => void;
  className?: string;
}
export declare function Toast(props: ToastProps): JSX.Element;
