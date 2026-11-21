// ExercicioBlock — pergunta com gabarito que revela sob demanda.
//
// A numeração `Ex · NN` é preservada verbatim do § Drill, incluindo os dois
// tags fora da forma canônica: 'Ex · 07 · 3 níveis · Aula 05' e
// 'Ex · 08 · Síntese · Diagnóstico inicial'.
//
// O gabarito vive em `LessonActivity.config.gabarito`. O contrato deixa
// `config` solto de propósito ("LYCEUM tipa em detalhe quando construir
// cada mecânica"), então não precisou de mudança de tipo.

import { useState } from 'react';
import type { LessonActivity } from '@/lib/types/alexandria';
import { A, A2, AT, AS, AR, AE } from '@/design/alexandria-tokens';

const lerConfig = (a: LessonActivity, chave: string): string | null => {
  const v = a.config?.[chave];
  return typeof v === 'string' ? v : null;
};

export function ExercicioBlock({ atividades }: { atividades: LessonActivity[] }) {
  if (!atividades.length) return null;

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: AS.lg }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: AS.md }}>
        <span style={{ ...AT.rotulo, color: A.terracota }}>Exercícios</span>
        <span style={{ ...AT.dado, fontSize: '12px', color: A2.tintaMetadado }}>
          Resolva antes de revelar.
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {atividades.map((a, i) => (
          <Exercicio key={a.id} atividade={a} primeiro={i === 0} />
        ))}
      </div>
    </section>
  );
}

function Exercicio({ atividade, primeiro }: { atividade: LessonActivity; primeiro: boolean }) {
  const [aberto, setAberto] = useState(false);
  const tag = lerConfig(atividade, 'tag');
  const gabarito = lerConfig(atividade, 'gabarito');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: AS.md,
        padding: `${AS.lg} 0`,
        borderTop: primeiro ? `1px solid ${A.fioSobreCreme}` : `1px solid ${A2.fioClaroSobreCreme}`,
      }}
    >
      {tag && <span style={{ ...AT.rotulo, fontSize: '10px', color: A2.tintaMetadado }}>{tag}</span>}

      <p
        style={{ ...AT.corpo, fontSize: '15px', color: A.tintaSobreCreme, margin: 0 }}
        dangerouslySetInnerHTML={{ __html: atividade.prompt }}
      />

      {gabarito ? (
        <>
          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            aria-expanded={aberto}
            style={{
              ...AT.rotulo,
              fontSize: '10px',
              alignSelf: 'flex-start',
              color: aberto ? A2.tintaMetadado : A.terracota,
              background: 'none',
              border: `1px solid ${aberto ? A2.fioClaroSobreCreme : A.terracota}`,
              borderRadius: AR.none,
              padding: `${AS.xs} ${AS.md}`,
              cursor: 'pointer',
              transition: `color ${AE.estado} ${AE.easing}, border-color ${AE.estado} ${AE.easing}`,
            }}
          >
            {aberto ? 'Ocultar gabarito' : 'Revelar gabarito'}
          </button>

          {aberto && (
            <div
              style={{
                borderLeft: `3px solid ${A.oliva}`,
                padding: `${AS.sm} ${AS.lg}`,
              }}
            >
              <p
                style={{
                  ...AT.corpo,
                  fontSize: '14px',
                  lineHeight: 1.65,
                  color: A.tintaSuave,
                  margin: 0,
                  maxWidth: 'none',
                }}
                dangerouslySetInnerHTML={{ __html: gabarito }}
              />
            </div>
          )}
        </>
      ) : (
        <span style={{ ...AT.dado, fontSize: '12px', fontStyle: 'italic', color: A2.tintaMetadado }}>
          Sem gabarito na fonte.
        </span>
      )}
    </div>
  );
}

export default ExercicioBlock;
