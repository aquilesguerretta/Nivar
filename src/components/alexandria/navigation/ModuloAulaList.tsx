// ModuloAulaList — as aulas de um módulo.
//
// Contagem e numeração são REAIS: vêm de `CurriculumModule.totalAulas`,
// extraído do HTML do módulo pela FOUNDRY Wave 2 com três sinais
// independentes concordando. "Aula 3 de 9" é verdade.
//
// Título de aula é REAL onde a extração alcançou (Módulo 01 na Wave 4,
// Módulo 02 na Wave 18) — vem de `alexandria-curriculo.ts`, resolvido pelo
// módulo. Onde o conteúdo ainda não existe, a linha cai para "Aula N de T",
// que continua sendo verdade: a numeração é real mesmo sem o título.
//
// O que NÃO se faz aqui é inventar lista onde `totalAulas` é null: módulo
// em produção mostra estado de produção, sem lista fake de tamanho
// arbitrário.

import { useNavigate } from 'react-router-dom';
import type { CurriculumTrilha } from '@/lib/types/alexandria';
import { getAulaDoModulo, MODULOS_COM_CONTEUDO } from '@/lib/data/alexandria-curriculo';
import { A, A2, AT, AS, AR, AE } from '@/design/alexandria-tokens';
import type { ModuloComEstado } from '@/pages/alexandria/AlexandriaRouter';
import { RecursosDoModulo } from './RecursosDoModulo';

interface ModuloAulaListProps {
  item: ModuloComEstado;
  trilha: CurriculumTrilha;
  /** O router é quem conhece as rotas — este componente só diz qual aula. */
  onAbrirAula: (numero: number) => void;
  /** Só existe quando o módulo possui uma expedição decisória implementada. */
  onAbrirJogo?: () => void;
}

export function ModuloAulaList({ item, trilha, onAbrirAula, onAbrirJogo }: ModuloAulaListProps) {
  const navigate = useNavigate();
  const { modulo, estado, aulasFeitas } = item;

  const voltar = () => navigate(`/alexandria/trilha/${trilha.id}`);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: AS.xl }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: AS.sm }}>
        <button
          type="button"
          onClick={voltar}
          style={{
            ...AT.rotulo,
            alignSelf: 'flex-start',
            color: A2.tintaMetadado,
            background: 'none',
            border: 'none',
            borderRadius: AR.none,
            padding: 0,
            cursor: 'pointer',
          }}
        >
          ← {trilha.title}
        </button>

        <span style={{ ...AT.rotulo, color: A.terracota }}>
          Módulo {modulo.number} de {modulo.totalInTrilha}
        </span>

        <h1 style={{ ...AT.h1, color: A.tintaSobreCreme, margin: 0 }}>{modulo.title}</h1>
      </div>

      {onAbrirJogo && (
        <section
          aria-labelledby="expedicao-m08-title"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: AS.lg,
            padding: AS.lg,
            borderTop: `3px double ${A.fioSobreCreme}`,
            borderBottom: `1px solid ${A.fioSobreCreme}`,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: AS.xs }}>
            <span style={{ ...AT.rotulo, color: A.terracota }}>Expedição decisória · M08</span>
            <h2 id="expedicao-m08-title" style={{ ...AT.h3, margin: 0, color: A.tintaSobreCreme }}>
              O Número Impossível
            </h2>
            <span style={{ ...AT.dado, color: A.tintaSuave }}>
              Reconcilie fontes aparentemente contraditórias em três lentes.
            </span>
          </div>
          <button
            type="button"
            onClick={onAbrirJogo}
            style={{
              ...AT.rotulo,
              padding: `${AS.md} ${AS.lg}`,
              border: `1px solid ${A.navy}`,
              borderRadius: AR.none,
              background: A.navy,
              color: A.tintaSobreNavy,
              cursor: 'pointer',
            }}
          >
            Abrir jogo
          </button>
        </section>
      )}

      {modulo.totalAulas === null ? (
        <EmProducao />
      ) : (
        <ListaReal
          moduloId={modulo.id}
          total={modulo.totalAulas}
          feitas={aulasFeitas ?? 0}
          bloqueado={estado === 'bloqueado'}
          onAbrirAula={onAbrirAula}
        />
      )}

      {/* Exercícios soltos e instrumentos de aparato — Wave 34, Fase C.
          Módulo sem nenhum dos dois não renderiza nada aqui. */}
      <RecursosDoModulo moduloId={modulo.id} />
    </div>
  );
}

/** Estado de produção — sem número, sem lista. O conteúdo não existe. */
function EmProducao() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: AS.md,
        borderLeft: `3px solid ${A.terracota}`,
        padding: `${AS.md} ${AS.xl}`,
      }}
    >
      <span style={{ ...AT.h3, color: A.terracota, letterSpacing: '0.08em' }}>
        Conteúdo em produção
      </span>
      <span style={{ ...AT.corpo, fontSize: '14px', color: A.tintaSuave, maxWidth: '58ch' }}>
        Este módulo está catalogado no Currículo Definitivo, mas as aulas ainda
        não foram escritas. Não há contagem a mostrar — o número de aulas será
        conhecido quando o conteúdo existir, e estimá-lo agora seria invenção.
      </span>
      {/* Derivado do resolvedor, nunca digitado — a versão anterior dizia
          "Três dos dezessete" fixo, verdade na Wave 6 e falsa desde a 19. */}
      <span style={{ ...AT.dado, fontSize: '12px', fontStyle: 'italic', color: A2.tintaMetadado }}>
        {MODULOS_COM_CONTEUDO.length} dos dezessete módulos têm conteúdo escrito hoje.
      </span>
    </div>
  );
}

/** Numeração e contagem reais; título real onde a extração alcançou. */
function ListaReal({
  moduloId,
  total,
  feitas,
  bloqueado,
  onAbrirAula,
}: {
  moduloId: string;
  total: number;
  feitas: number;
  bloqueado: boolean;
  onAbrirAula: (numero: number) => void;
}) {
  // Quantas linhas têm título real — decide o texto do rodapé, em vez de
  // afirmar "os títulos chegam com o viewer" numa lista que já os tem.
  const comTitulo = Array.from({ length: total }, (_, i) =>
    getAulaDoModulo(moduloId, i + 1),
  ).filter(Boolean).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: AS.lg }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: AS.md, flexWrap: 'wrap' }}>
        <span style={{ ...AT.rotulo, color: A2.tintaMetadado }}>Aulas</span>
        <span style={{ ...AT.dado, color: A.tintaSuave }}>
          {bloqueado ? `${total} aulas · módulo trancado` : `${feitas} de ${total} concluídas`}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {Array.from({ length: total }, (_, i) => {
          const numero = i + 1;
          const concluida = numero <= feitas;
          const atual = numero === feitas + 1 && !bloqueado;
          // Toda aula do módulo abre. `concluida` e `atual` seguem sendo
          // rótulo de progresso — informam onde o aluno parou, não
          // impedem de ir adiante. Ver a nota em `EstadoModulo`.
          const disponivel = true;
          const aula = getAulaDoModulo(moduloId, numero);

          return (
            <button
              key={numero}
              type="button"
              disabled={!disponivel}
              onClick={disponivel ? () => onAbrirAula(numero) : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: AS.lg,
                textAlign: 'left',
                background: 'none',
                border: 'none',
                borderTop: `1px solid ${i === 0 ? 'transparent' : A2.fioClaroSobreCreme}`,
                // Fio de 3px à esquerda marca a aula atual — mesmo idioma
                // do item ativo de rail no handoff.
                borderLeft: `3px solid ${atual ? A.terracota : 'transparent'}`,
                borderRadius: AR.none,
                padding: `${AS.md} ${AS.md}`,
                font: 'inherit',
                cursor: disponivel ? 'pointer' : 'default',
                transition: `border-color ${AE.estado} ${AE.easing}`,
              }}
            >
              <span
                style={{
                  ...AT.dado,
                  flex: 'none',
                  width: '3ch',
                  color: concluida ? A.oliva : A2.tintaMetadado,
                }}
              >
                {String(numero).padStart(2, '0')}
              </span>

              <span
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    ...AT.corpo,
                    fontSize: '14px',
                    maxWidth: 'none',
                    color: disponivel ? A.tintaSobreCreme : A2.tintaMetadado,
                  }}
                >
                  {aula ? aula.title : `Aula ${numero} de ${total}`}
                </span>
                {aula?.subtitle && (
                  <span
                    style={{
                      ...AT.dado,
                      fontSize: '11px',
                      color: A2.tintaMetadado,
                    }}
                  >
                    {aula.subtitle}
                  </span>
                )}
              </span>

              <span
                style={{
                  ...AT.dado,
                  fontSize: '11px',
                  flex: 'none',
                  color: concluida ? A.oliva : atual ? A.terracota : A2.tintaMetadado,
                }}
              >
                {concluida ? 'concluída' : atual ? 'continuar' : bloqueado ? '' : 'a seguir'}
              </span>
            </button>
          );
        })}
      </div>

      <span
        style={{
          ...AT.dado,
          fontSize: '11px',
          fontStyle: 'italic',
          color: A2.tintaMetadado,
          borderTop: `1px solid ${A.fioSobreCreme}`,
          paddingTop: AS.md,
        }}
      >
        {comTitulo === total
          ? 'Numeração, contagem e títulos são reais, extraídos do HTML do módulo.'
          : comTitulo > 0
            ? `Numeração e contagem são reais. ${comTitulo} de ${total} aulas já têm título extraído.`
            : 'Numeração e contagem são reais, extraídas do HTML do módulo. Os títulos de aula chegam com a extração.'}
      </span>
    </div>
  );
}

export default ModuloAulaList;
