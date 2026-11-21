// TrilhasHub — as três trilhas, sempre todas visíveis.
//
// O `?trilha=` do portal sugere destaque, nunca filtra. Fundamentos
// Universais é relevante em qualquer mercado de entrada e não esconde.
//
// Blocos irmãos separados por fio, não por card dentro de card.

import { useNavigate } from 'react-router-dom';
import { ALEXANDRIA_TRILHAS, getModulesByTrilha } from '@/lib/data/alexandria-trilhas';
import { A, A2, AT, AS } from '@/design/alexandria-tokens';
import { MOCK_USER_PROGRESS } from '@/pages/alexandria/AlexandriaRouter';
import { TrilhaCard } from './TrilhaCard';

interface TrilhasHubProps {
  /** Trilha a destacar. null = nenhum destaque; as três seguem visíveis. */
  trilhaSugeridaId: string | null;
}

export function TrilhasHub({ trilhaSugeridaId }: TrilhasHubProps) {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: AS.xl }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: AS.md }}>
        <span style={{ ...AT.rotulo, color: A.terracota }}>Currículo</span>
        <h1 style={{ ...AT.h1, color: A.tintaSobreCreme, margin: 0 }}>
          Três trilhas
        </h1>
        <p style={{ ...AT.corpo, color: A.tintaSuave, margin: 0, fontSize: '15px' }}>
          Dezessete módulos catalogados do Currículo Definitivo. Três deles têm
          conteúdo escrito e navegável; os outros catorze estão em produção e
          aparecem aqui como estrutura, sem contagem inventada.
        </p>
      </div>

      {/* Números do aluno. Grade separada por fio. */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          borderTop: `1px solid ${A.fioSobreCreme}`,
          borderBottom: `1px solid ${A.fioSobreCreme}`,
        }}
      >
        {[
          { rotulo: 'Aulas', valor: `${MOCK_USER_PROGRESS.aulasCompleted}`, nota: `de ${MOCK_USER_PROGRESS.aulasTotal} confirmadas` },
          { rotulo: 'Experiência', valor: `${MOCK_USER_PROGRESS.exp}`, nota: 'pontos' },
          { rotulo: 'Insígnias', valor: `${MOCK_USER_PROGRESS.badgesEarned}`, nota: `de ${MOCK_USER_PROGRESS.badgesTotal}` },
          { rotulo: 'Sequência', valor: `${MOCK_USER_PROGRESS.studyStreakDays}`, nota: 'dias seguidos' },
        ].map((item, i) => (
          <div
            key={item.rotulo}
            style={{
              padding: `${AS.md} ${AS.lg} ${AS.md} ${i === 0 ? '0' : AS.lg}`,
              borderLeft: i > 0 ? `1px solid ${A.fioSobreCreme}` : 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: AS.xs,
            }}
          >
            <span style={{ ...AT.rotulo, color: A2.tintaMetadado }}>{item.rotulo}</span>
            <span style={{ ...AT.h2, color: A.tintaSobreCreme }}>{item.valor}</span>
            <span style={{ ...AT.dado, color: A.tintaSuave }}>{item.nota}</span>
          </div>
        ))}
      </div>

      {/* As três trilhas. Sempre três — o parâmetro não remove nenhuma. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: AS.xl }}>
        {ALEXANDRIA_TRILHAS.map((trilha) => {
          const modulos = getModulesByTrilha(trilha.id);
          return (
            <TrilhaCard
              key={trilha.id}
              trilha={trilha}
              modulosComFonte={modulos.filter((m) => m.totalAulas !== null).length}
              totalModulos={modulos.length}
              percentual={MOCK_USER_PROGRESS.byLevel[trilha.level]}
              sugerida={trilha.id === trilhaSugeridaId}
              // Caminho absoluto, não relativo: o shell monta sob a splat
              // route `/alexandria/*`, e o React Router avisa que a
              // resolução relativa dentro de splat muda na v7.
              onAbrir={() => navigate(`/alexandria/trilha/${trilha.id}`)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default TrilhasHub;
