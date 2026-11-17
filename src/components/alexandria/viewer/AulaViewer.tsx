// AulaViewer — a aula completa.
//
//   Apostila — o corpo da aula, conteúdo de página
//   → InstrumentPanel, onde a aula tiver instrumento
//   → ExercicioBlock
//   → MaterialComplementar — referência real, ou a ausência declarada
//   → VideoArea — a linha de vídeo, no metadado do fim
//   → ConclusaoAula — LYCEUM Wave 31, ver abaixo
//
// O VÍDEO SAIU DO TOPO — r13 da Peça C. Ele abria a aula como um retângulo
// tracejado em terracota escrito "VÍDEO EM PRODUÇÃO", e a 390 isso ocupava
// o primeiro viewport inteiro, empurrando a pergunta da aula e o primeiro
// ato para fora da tela (A2/D3). O tronco proíbe por duas portas: T12
// ("ausência honesta … nunca no topo da aula") e T14 ("vídeo nunca é
// herói"). Agora a ausência é linha de metadado, junto do resto do
// metadado; ver `VideoArea.tsx`.
//
// ESTRUTURA DE ABA DESFEITA — LYCEUM Wave 39. Até aqui havia um tab strip
// de quatro abas: Referência técnica · Apostila · Notas · Transcrição. A
// auditoria mediu o que ele de fato governava e o achado inverteu o
// diagnóstico esperado: instrumento, exercício e conclusão JÁ estavam
// fora do sistema de aba. O problema era o contrário — a Apostila é o
// corpo INTEIRO da aula (89 a 194 blocos, conforme o módulo), e o tab
// strip permitia trocá-la por um parágrafo de três linhas dizendo que
// não existe conteúdo. Três das quatro abas eram estado vazio, então o
// controle não oferecia alternativa nenhuma: só oferecia dispensar a
// aula.
//
// Composição nova: a Apostila sai do sistema de aba e vira conteúdo de
// página — nunca atrás de um controle que a dispense, mesmo registro do
// instrumento e do exercício. As três ausências viram UM bloco só ao
// final, declarando cada uma com a razão real, no lugar de quatro
// controles fingindo navegação. Quando `references` for populado (a
// extração alcançar o § Ref), a referência aparece ali como conteúdo de
// verdade — a decisão é derivada de `aula.references`, não digitada.
//
// PROGRESSO REAL — LYCEUM Wave 31, refeito na v3 (eventos). Até aqui
// `aula_iniciada` disparava no `useEffect` de MONTAGEM: "percorrido"
// significava "a rota foi aberta". Agora toda a mecânica vem de
// `useLoopDaAula` (`src/lib/alexandria/`), e este arquivo só liga:
//
//   - `refRaiz` na raiz da aula — `aula_iniciada` sai no primeiro gesto
//     real do aluno nela (rolar, tocar, digitar), nunca na montagem;
//   - `refFim` logo depois do TEXTO da aula (a Apostila) — o fim visto é
//     pré-condição do registro;
//   - `ExercicioBlock.aoRegistrar` → `exercicio_respondido`, com `aulaId`;
//   - `InstrumentPanel.aoUsar` → `instrumento_usado`, com `aulaId`;
//   - o botão do fim → `aula_concluida`, SÓ com a pré-condição de
//     `vereditoDeConclusao` (conta + gesto + fim do texto). Sem ela, o
//     clique diz o que falta — mesmo contrato de `AcaoDeRegistro`.
//
// A aula é PERCORRIDA, não "concluída" (bar C9, P18): o botão e a
// confirmação dizem isso. Conclusão confirmada avalia a família CONCLUSÃO
// de conquistas (`badgeRules.ts`).

import { useState } from 'react';
import type { CurriculumAula, LessonReference } from '@/lib/types/alexandria';
import { getCorpoAula, getLeadAula } from '@/lib/data/alexandria-curriculo';
import { useLoopDaAula, type LoopDaAulaMecanico } from '@/lib/alexandria/useLoopDaAula';
import { A, A2, AT, AS, AR, AE } from '@/design/alexandria-tokens';
import { VideoArea } from './VideoArea';
import { ApostilaPanel } from './ApostilaPanel';
import { InstrumentPanel } from './InstrumentPanel';
import { ExercicioBlock } from './ExercicioBlock';

export function AulaViewer({ aula }: { aula: CurriculumAula }) {
  // `key` por aula: "Próxima aula" reaproveita este componente, e sem a
  // chave o gesto, o fim visto e as tentativas da aula anterior vazariam
  // para a seguinte.
  return <CorpoDaAula key={aula.id} aula={aula} />;
}

function CorpoDaAula({ aula }: { aula: CurriculumAula }) {
  // Resolvido pelo id da aula, não por módulo fixo — ver
  // `alexandria-curriculo.ts`.
  const blocos = getCorpoAula(aula.id);
  const lead = getLeadAula(aula.id);
  const loop = useLoopDaAula({ aulaId: aula.id, moduloId: aula.moduleId });

  return (
    <div ref={loop.refRaiz} style={{ display: 'flex', flexDirection: 'column', gap: AS.xxl }}>
      {/* O corpo da aula. Conteúdo de página — nunca atrás de um controle
          que possa dispensá-lo. E é ele que abre a aula: nada de ausência
          acima dele (T12, T14). O marcador de 1 px logo depois dele é o
          "fim do texto" da regra de conclusão. */}
      <div>
        <ApostilaPanel lead={lead} blocos={blocos} gravuras={aula.illustrations} />
        <span ref={loop.refFim} aria-hidden="true" data-capture="fim-do-texto" style={{ display: 'block', height: '1px' }} />
      </div>

      {aula.instruments.map((inst) => (
        <InstrumentPanel
          key={inst.id}
          instrumento={inst}
          aoUsar={(uso) => loop.usarInstrumento(inst.id, uso)}
        />
      ))}

      <ExercicioBlock
        atividades={aula.activities}
        registro={loop.conta === 'conta' ? 'conta' : loop.conta === 'visitante' ? 'visitante' : 'indefinido'}
        aoRegistrar={(r) =>
          void loop.emitirExercicio({
            entidadeId: r.atividadeId,
            ato: 'exercicio',
            resposta: r.resposta,
            antesDaReferencia: r.antesDaReferencia,
          })
        }
      />

      {/* A gravação, quando existir, entra DEPOIS da aula — nunca acima
          dela (T14). A ausência de vídeo não vira bloco: é uma linha da
          declaração compacta de ausências, logo abaixo. */}
      <VideoArea video={aula.video} />

      <MaterialComplementar referencias={aula.references} temVideo={Boolean(aula.video)} />

      <ConclusaoAula loop={loop} />
    </div>
  );
}

/** O único ponto de registro explícito da aula — LYCEUM Wave 31, com
 *  pré-condição desde a v3. Estado desconhecido mostra o botão, nunca um
 *  "percorrida" sem confirmação do servidor. O botão nunca fica
 *  desabilitado: sem a pré-condição, o clique DIZ o que falta. */
function ConclusaoAula({ loop }: { loop: LoopDaAulaMecanico }) {
  const [aviso, setAviso] = useState<string | null>(null);
  const marcando = loop.envioDaConclusao === 'enviando';

  if (loop.status === 'concluido') {
    return (
      <div
        style={{
          borderTop: `1px solid ${A.fioSobreCreme}`,
          paddingTop: AS.lg,
          display: 'flex',
          alignItems: 'center',
          gap: AS.sm,
        }}
      >
        <span data-capture="aula-percorrida" style={{ ...AT.corpo, fontSize: '14px', color: A.oliva }}>
          ✓ Aula percorrida · registrada na sua conta
        </span>
      </div>
    );
  }

  const erro =
    loop.envioDaConclusao === 'falhou' ? 'Não foi possível registrar agora. Tente de novo.' : aviso;

  return (
    <div
      style={{
        borderTop: `1px solid ${A.fioSobreCreme}`,
        paddingTop: AS.lg,
        display: 'flex',
        flexDirection: 'column',
        gap: AS.sm,
        alignItems: 'flex-start',
      }}
    >
      <button
        type="button"
        data-capture="registrar-aula"
        onClick={async () => {
          setAviso(null);
          const r = await loop.concluir();
          if (!r.registrada && 'veredito' in r && !r.veredito.pode) setAviso(r.veredito.frase);
        }}
        disabled={marcando}
        style={{
          ...AT.rotulo,
          fontSize: '10px',
          color: marcando ? A2.tintaMetadado : A.terracota,
          background: 'none',
          border: `1px solid ${marcando ? A2.fioClaroSobreCreme : A.terracota}`,
          borderRadius: AR.none,
          padding: `${AS.sm} ${AS.lg}`,
          cursor: marcando ? 'default' : 'pointer',
          transition: `color ${AE.estado} ${AE.easing}, border-color ${AE.estado} ${AE.easing}`,
        }}
      >
        {marcando ? 'Registrando…' : 'Registrar aula como percorrida'}
      </button>
      {erro && (
        <span role="status" style={{ ...AT.dado, fontSize: '11px', color: A.terracota }}>{erro}</span>
      )}
    </div>
  );
}

/** Material complementar — LYCEUM Wave 39, no lugar das três abas vazias.
 *
 *  Referência é a única das três que pode ter conteúdo real hoje, e a
 *  decisão é DERIVADA de `aula.references`: com documento, ele renderiza
 *  como conteúdo; sem, entra na lista de ausências ao lado das outras
 *  duas. Nada aqui é digitado por módulo — quando a extração alcançar o
 *  § Ref, esta seção passa a mostrar documento sozinha.
 *
 *  Uma declaração compacta em vez de três blocos empilhados: a regra de
 *  densidade do produto vale também para o que NÃO existe. */
function MaterialComplementar({ referencias, temVideo }: { referencias: LessonReference[]; temVideo: boolean }) {
  // Notas e Transcrição são ausência estrutural, não de extração — cada
  // uma com a razão real e atual, não a herdada.
  const ausencias: [string, string][] = [
    [
      'Notas',
      'A Alexandria registra progresso por conta desde a Wave 31, mas não guarda texto livre: o backend não tem tabela de anotação, e o único campo livre do log de progresso é de escrita, não de leitura. Anotar exige uma wave de backend antes de uma wave de interface.',
    ],
    [
      'Transcrição',
      'Derivada de vídeo, e nenhuma aula extraída tem gravação — os HTML de origem não trazem vídeo nenhum. O texto da aula está acima, inteiro, e não é resumo.',
    ],
  ];
  // O vídeo entra AQUI, na mesma declaração compacta, e não como bloco
  // próprio no topo da aula (T12, T14 — r13 da Peça C). Fica antes da
  // transcrição porque é a causa dela: sem gravação, não há o que
  // transcrever.
  if (!temVideo) {
    ausencias.splice(1, 0, [
      'Vídeo',
      'Nenhuma aula do currículo tem gravação hoje. O texto acima é a aula completa — não é resumo nem transcrição de um vídeo que exista em outro lugar.',
    ]);
  }
  if (referencias.length === 0) {
    ausencias.unshift([
      'Referência técnica',
      'Os módulos extraídos reúnem as fontes numa seção de fim de módulo (§ Ref), não por aula — por isso `references` está vazio em todas elas. Quando a extração alcançar o aparato, os documentos aparecem aqui.',
    ]);
  }

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: AS.md }}>
      <span
        style={{
          ...AT.rotulo,
          fontSize: '10px',
          color: A2.tintaMetadado,
          paddingBottom: AS.xs,
          borderBottom: `1px solid ${A.fioSobreCreme}`,
        }}
      >
        Material complementar
      </span>

      {referencias.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {referencias.map((r, i) => (
            <a
              key={r.id}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...AT.corpo,
                fontSize: '14px',
                color: A.terracota,
                textDecoration: 'none',
                padding: `${AS.sm} 0`,
                borderTop: i > 0 ? `1px solid ${A2.fioClaroSobreCreme}` : 'none',
              }}
            >
              {r.title} · {r.source}
            </a>
          ))}
        </div>
      )}

      <div
        style={{
          borderLeft: `3px solid ${A2.fioColunaSobreCreme}`,
          padding: `${AS.xs} ${AS.lg}`,
          display: 'flex',
          flexDirection: 'column',
          gap: AS.sm,
        }}
      >
        {ausencias.map(([titulo, corpo]) => (
          <div key={titulo} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ ...AT.rotulo, fontSize: '10px', color: A.tintaSuave }}>
              {titulo} — ainda não existe
            </span>
            <span
              style={{
                ...AT.corpo,
                fontSize: '13px',
                lineHeight: 1.55,
                color: A2.tintaMetadado,
                maxWidth: '62ch',
              }}
            >
              {corpo}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AulaViewer;
