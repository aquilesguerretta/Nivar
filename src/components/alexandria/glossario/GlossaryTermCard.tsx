// GlossaryTermCard — um verbete do glossário, em layout de dicionário:
// coluna do termo à esquerda, definição e âncoras de aula à direita.
//
// Profundidade por fio de 1px, nunca sombra. A definição preserva o HTML
// inline da fonte (<b>) e renderiza com o mesmo idioma dos blocos de
// apostila. `aulaIds` vazio é estado honesto e diz isso ao aluno em vez
// de esconder a linha.

import type { GlossaryTerm } from '@/lib/types/alexandria';
import { getAulaModulo01 } from '@/lib/data/alexandria-modulo-01-content';
import { A, A2, AT, AS, AR, AE } from '@/design/alexandria-tokens';

interface GlossaryTermCardProps {
  termo: GlossaryTerm;
  onAbrirAula: (aulaId: string) => void;
}

/** 'aula-01-05' → 5. A numeração está no próprio id, convenção da Wave 4. */
const numeroDaAula = (aulaId: string) => Number(aulaId.slice(-2));

export function GlossaryTermCard({ termo, onAbrirAula }: GlossaryTermCardProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: AS.xl,
        padding: `${AS.lg} 0`,
        borderTop: `1px solid ${A2.fioClaroSobreCreme}`,
        borderRadius: AR.none,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: AS.xs }}>
        <span style={{ ...AT.h3, color: A.tintaSobreCreme, letterSpacing: '0.06em' }}>
          {termo.term}
        </span>
        <span style={{ ...AT.rotulo, fontSize: '10px', color: A2.tintaMetadado }}>
          {termo.unit}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: AS.sm }}>
        <p
          style={{ ...AT.corpo, fontSize: '14px', color: A.tintaSobreCreme, margin: 0 }}
          dangerouslySetInnerHTML={{ __html: termo.definition }}
        />

        {termo.aulaIds.length > 0 ? (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'baseline',
              columnGap: AS.lg,
              rowGap: AS.xs,
            }}
          >
            <span style={{ ...AT.rotulo, fontSize: '10px', color: A2.tintaMetadado }}>
              Aparece em {termo.aulaIds.length} {termo.aulaIds.length === 1 ? 'aula' : 'aulas'}
            </span>
            {termo.aulaIds.map((aulaId) => {
              const aula = getAulaModulo01(aulaId);
              return (
                <button
                  key={aulaId}
                  type="button"
                  onClick={() => onAbrirAula(aulaId)}
                  title={aula?.title}
                  style={{
                    ...AT.dado,
                    fontSize: '12px',
                    color: A.terracota,
                    background: 'none',
                    border: 'none',
                    borderBottom: `1px solid ${A.terracota}`,
                    borderRadius: AR.none,
                    padding: 0,
                    cursor: 'pointer',
                    transition: `color ${AE.estado} ${AE.easing}`,
                  }}
                >
                  Aula {numeroDaAula(aulaId)}
                  {aula ? ` · ${aula.title}` : ''}
                </button>
              );
            })}
          </div>
        ) : (
          <span
            style={{
              ...AT.dado,
              fontSize: '11px',
              fontStyle: 'italic',
              color: A2.tintaMetadado,
            }}
          >
            {/* Wave 34: era "…do Módulo 01" fixo — verdade com um módulo
                só, falso desde que o glossário passou a agregar os § Lex
                dos Módulos 01-08. Mesma classe da correção do eyebrow. */}
            Definido no § Lex; nenhuma aula extraída trata o termo como
            assunto central.
          </span>
        )}
      </div>
    </div>
  );
}

export default GlossaryTermCard;
