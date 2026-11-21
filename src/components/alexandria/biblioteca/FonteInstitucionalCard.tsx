// FonteInstitucionalCard — uma das quatro fontes primárias do setor.
//
// Sigla em Cinzel, razão social em Lora, o que a instituição publica, e
// o domínio oficial como link externo. Fio de 1px nos quatro lados —
// profundidade nunca por sombra, raio zero.
//
// `comFonte: false` marca a entrada cuja razão social por extenso NÃO
// tem procedência interna no repositório. A Wave 10 auditou isso para o
// rodapé e o achado vale aqui: a sigla ANEEL aparece 12+ vezes nos
// módulos, mas a forma por extenso não ocorre uma única vez. Marcar é
// mais honesto que silenciar.

import { A, A2, AT, AS, AR, AE } from '@/design/alexandria-tokens';

export interface FonteInstitucional {
  sigla: string;
  nome: string;
  /** O que a instituição publica — literal do § Ref do Módulo 01. */
  publica: string;
  /** Domínio oficial, como escrito no § Ref. */
  dominio: string;
  /** false quando a razão social por extenso não tem citação interna. */
  comFonte: boolean;
}

interface FonteInstitucionalCardProps {
  fonte: FonteInstitucional;
}

export function FonteInstitucionalCard({ fonte }: FonteInstitucionalCardProps) {
  return (
    <article
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: AS.sm,
        padding: AS.lg,
        background: A2.cremeSuperficie,
        border: `1px solid ${A.fioSobreCreme}`,
        borderRadius: AR.none,
      }}
    >
      {/* Sigla sozinha na primeira linha. A nota de procedência vai no pé
          do card, não aqui: ao lado da sigla ela quebrava em duas linhas
          só na ANEEL e empurrava o nome para baixo, desalinhando as
          quatro razões sociais numa grade que existe para comparação. */}
      <span style={{ ...AT.h2, fontSize: '18px', color: A.tintaSobreCreme }}>
        {fonte.sigla}
      </span>

      <span style={{ ...AT.h3, fontSize: '13px', color: A.tintaSobreCreme, letterSpacing: '0.04em' }}>
        {fonte.nome}
      </span>

      <p style={{ ...AT.corpo, fontSize: '13px', color: A.tintaSuave, margin: 0 }}>
        {fonte.publica}
      </p>

      <a
        href={`https://${fonte.dominio}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          ...AT.dado,
          fontSize: '12px',
          alignSelf: 'flex-start',
          color: A.terracota,
          textDecoration: 'none',
          borderBottom: `1px solid ${A.terracota}`,
          transition: `color ${AE.estado} ${AE.easing}`,
        }}
      >
        {fonte.dominio} ↗
      </a>

      {!fonte.comFonte && (
        <span
          style={{
            ...AT.dado,
            fontSize: '11px',
            fontStyle: 'italic',
            lineHeight: 1.45,
            color: A2.tintaMetadado,
            marginTop: 'auto',
            paddingTop: AS.xs,
            borderTop: `1px solid ${A2.fioClaroSobreCreme}`,
          }}
        >
          Razão social por extenso sem citação interna no repositório.
        </span>
      )}
    </article>
  );
}

export default FonteInstitucionalCard;
