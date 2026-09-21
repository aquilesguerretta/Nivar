/**
 * Link de download. Nome do arquivo e extensão em mono, com a extensão em peso 500 — ela é a
 * informação que decide se o leitor vai conseguir abrir. Tamanho e formato em texto secundário,
 * e um `↓` mono à esquerda.
 *
 * **O glifo é unicode, não ícone de biblioteca.** Nenhuma biblioteca de ícone entrou no sistema
 * e a decisão continua aberta.
 *
 * Não é `Button`. Um download é navegação para um arquivo, não uma ação de estado: usa cor de
 * link, sublinha só o nome do arquivo, e no hover muda cor de texto e de fio como qualquer link.
 * Botão primário para exportar (que gera algo); link de download para o que já existe.
 */
export interface DownloadLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** nome com extensão: 'pld-julho-2026.csv' — a extensão é separada e destacada */
  arquivo: string;
  /** tamanho legível: '284 KB', '1,2 MB' */
  tamanho?: string;
  /** rótulo de formato em versalete: 'CSV', 'PDF', 'XLSX' */
  formato?: string;
  /** recorte ou procedência do arquivo, em mono, na linha de baixo */
  nota?: string;
  href?: string;
  disabled?: boolean;
  className?: string;
}
export declare function DownloadLink(props: DownloadLinkProps): JSX.Element;
