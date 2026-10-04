/**
 * Estado de erro. Advisory como fio de 2px no topo — nunca vermelho de UI, porque neste
 * sistema cor é temperatura e não semântica de interface. A mensagem nomeia a fonte que
 * falhou e o horário da última apuração bem-sucedida; as duas linhas são obrigatórias.
 */
export interface ErrorStateProps {
  variant?: 'falha-carregamento' | 'dado-desatualizado' | 'fonte-indisponivel';
  titulo?: string;
  corpo?: string;
  eti?: string;
  /** fonte que falhou, ex. 'ONS · carga verificada' */
  fonte?: string;
  /** ISO + fuso da última apuração bem-sucedida */
  ultimaApuracao?: string;
  acoes?: React.ReactNode;
  className?: string;
}
export declare function ErrorState(props: ErrorStateProps): JSX.Element;
