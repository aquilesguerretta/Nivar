// TrilhaCard — uma trilha no hub.
//
// Contagem de aula é REAL onde existe e "em produção" onde não. A Trilha 1
// mostra 29 aulas confirmadas em 3 dos 5 módulos — o rótulo diz
// "confirmadas", nunca "total", porque `totalAulasPartial` é true e o
// número é piso, não total. Trilhas 2 e 3 têm `totalAulas: null` e não
// mostram número nenhum.
//
// Destaque de sugestão é discreto — fio terracota de 1px à esquerda mais
// um rótulo. Nunca esconde nem rebaixa as outras duas.

import type { CurriculumTrilha } from '@/lib/types/alexandria';
import { A, A2, AT, AS, AR, AE } from '@/design/alexandria-tokens';

interface TrilhaCardProps {
  trilha: CurriculumTrilha;
  /** Módulos com contagem conhecida / total de módulos. */
  modulosComFonte: number;
  totalModulos: number;
  /** Percentual 0-100 de MOCK_USER_PROGRESS.byLevel. */
  percentual: number;
  sugerida: boolean;
  onAbrir: () => void;
}

export function TrilhaCard({
  trilha,
  modulosComFonte,
  totalModulos,
  percentual,
  sugerida,
  onAbrir,
}: TrilhaCardProps) {
  const temContagem = trilha.totalAulas !== null;

  return (
    <button
      type="button"
      onClick={onAbrir}
      style={{
        textAlign: 'left',
        background: 'none',
        border: 'none',
        borderRadius: AR.none,
        // Destaque discreto: fio à esquerda. Sem fundo, sem sombra, sem
        // escala — as três trilhas têm o mesmo peso de leitura.
        borderLeft: `${sugerida ? '3px' : '1px'} solid ${sugerida ? A.terracota : A.fioSobreCreme}`,
        padding: `${AS.lg} ${AS.xl}`,
        display: 'flex',
        flexDirection: 'column',
        gap: AS.md,
        cursor: 'pointer',
        transition: `border-color ${AE.hover} ${AE.easing}`,
        font: 'inherit',
        color: 'inherit',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: AS.md, flexWrap: 'wrap' }}>
        <span style={{ ...AT.rotulo, color: A2.tintaMetadado }}>
          Nível {trilha.level}
        </span>
        {sugerida && (
          <span style={{ ...AT.rotulo, color: A.terracota }}>
            · Sugerida pelo seu portal
          </span>
        )}
      </div>

      <span style={{ ...AT.h2, color: A.tintaSobreCreme }}>{trilha.title}</span>

      <span
        style={{
          ...AT.corpo,
          fontSize: '14px',
          lineHeight: 1.6,
          color: A.tintaSuave,
          maxWidth: '52ch',
        }}
      >
        {trilha.description}
      </span>

      {/* Barra de progresso. Fio de 1px de trilho, preenchimento oliva —
          oliva é "concluído", que é exatamente o que a barra mede. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: AS.sm, marginTop: AS.xs }}>
        <div
          style={{
            height: '5px',
            background: A2.cremeAfundado,
            borderRadius: AR.none,
          }}
        >
          <div
            style={{
              width: `${percentual}%`,
              height: '5px',
              background: A.oliva,
              borderRadius: AR.none,
              transition: `width ${AE.desenhoLongo} ${AE.easing}`,
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: AS.lg, flexWrap: 'wrap' }}>
          {temContagem ? (
            <span style={{ ...AT.dado, color: A.tintaSuave }}>
              {trilha.totalAulas} aulas confirmadas
              {trilha.totalAulasPartial && (
                <span style={{ color: A2.tintaMetadado }}>
                  {' '}· {modulosComFonte} de {totalModulos} módulos com fonte
                </span>
              )}
            </span>
          ) : (
            // Sem número. `totalAulas` é null e inventar seria mentir.
            <span style={{ ...AT.dado, fontStyle: 'italic', color: A.terracota }}>
              Conteúdo em produção · {totalModulos} módulos catalogados
            </span>
          )}
          <span style={{ ...AT.dado, color: A2.tintaMetadado }}>{percentual}% concluído</span>
        </div>
      </div>
    </button>
  );
}

export default TrilhaCard;
