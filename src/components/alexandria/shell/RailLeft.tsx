// RailLeft — opcional. SEMPRE creme. SEMPRE 232px. NUNCA navy.
// Nunca substitui o header.
//
// ─────────────────────────────────────────────────────────────
// POR QUE ESTE ARQUIVO É DEFENSIVO
//
// Esta regra falhou duas vezes, em duas ferramentas diferentes, em
// telas diferentes, mesmo depois de corrigida uma vez. O prior de
// "app SaaS com navegação lateral escura" vence sempre que o conteúdo
// tem cara de ferramenta multi-seção.
//
// Por isso o componente NÃO aceita prop de cor de fundo. Não há
// `style`, não há `className`, não há `background`, não há spread de
// props. O campo creme é lido direto de A.cremePapel e não existe
// caminho de código — nenhum — pelo qual este rail renderize navy.
//
// Se uma wave futura precisar de variação de campo aqui: isso é
// mudança de contrato, não de prop. Passa por revisão.
// ─────────────────────────────────────────────────────────────

import type { ReactNode } from 'react';
import { A, A2, AT, AS, AR, ALAYOUT } from '../../../design/alexandria-tokens';

// Sem `style`, sem `className`, sem `background`, sem `...rest`.
// A ausência é o mecanismo.
interface RailLeftProps {
  children?: ReactNode;
}

export function RailLeft({ children }: RailLeftProps) {
  return (
    <nav
      data-alx-campo="creme"
      style={{
        width: ALAYOUT.railLeft,
        flex: `0 0 ${ALAYOUT.railLeft}`,
        // Hardcoded a partir do token. Não é parametrizável.
        background: A.cremePapel,
        borderRight: `1px solid ${A.fioSobreCreme}`,
        borderRadius: AR.none,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: AS.md,
        padding: `${AS.lg} 0`,
      }}
    >
      {children ?? (
        <span
          style={{
            ...AT.dado,
            fontStyle: 'italic',
            color: A2.tintaMetadado,
            padding: `0 ${AS.lg}`,
          }}
        >
          Sem navegação nesta tela
        </span>
      )}
    </nav>
  );
}

export default RailLeft;
