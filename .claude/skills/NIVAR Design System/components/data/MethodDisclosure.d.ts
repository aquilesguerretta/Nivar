/**
 * Divulgação de metodologia — disclosure inline, nunca modal. Ancora junto à etiqueta de
 * procedência (`Provenance` passa como `children`) e expande para baixo; a revelação é
 * desenho de fio em `stroke-dashoffset` de 700ms, não animação de altura.
 *
 * O gatilho é texto sublinhado por fio de 1px. Nunca botão preenchido, nunca ícone de
 * interrogação circular.
 *
 * A ordem das linhas é fixa e não é configurável: método → fonte → **método publicado em**
 * → **dado coletado em** → premissas. A data do método vem antes da data do dado porque é
 * essa ordem que prova a tese: o método é público antes de existir número para defender.
 */
export interface MethodDisclosureProps {
  /** texto do gatilho; sentence case, sem interrogação */
  gatilho?: string;
  /** o cálculo em uma frase */
  metodo?: string;
  /** fonte exata — órgão, série e recorte, não só a sigla */
  fonte?: string;
  /** data ISO de publicação do MÉTODO — renderizada antes da coleta */
  metodoPublicadoEm?: string;
  /** data ISO da coleta do dado */
  dadoColetadoEm?: string;
  premissas?: string[];
  href?: string;
  hrefRotulo?: string;
  /** frase que declara a ordem das datas; passe `null` para omitir */
  nota?: string | null;
  /** controlado: informe `aberta` + `onToggle`. Omitido, o componente guarda o próprio estado. */
  aberta?: boolean;
  onToggle?: (aberta: boolean) => void;
  id?: string;
  /** fio superior de 1px acima da âncora */
  fio?: boolean;
  /** normalmente `<Provenance fio={false} />` */
  children?: React.ReactNode;
  className?: string;
}
export declare function MethodDisclosure(props: MethodDisclosureProps): JSX.Element;
