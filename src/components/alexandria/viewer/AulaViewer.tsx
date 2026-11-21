// AulaViewer — a aula completa.
//
//   VideoArea (estado "em produção" nas nove)
//   → Apostila — o corpo da aula, conteúdo de página
//   → InstrumentPanel, onde a aula tiver instrumento
//   → ExercicioBlock
//   → MaterialComplementar — referência real, ou a ausência declarada
//   → ConclusaoAula — LYCEUM Wave 31, ver abaixo
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
// PROGRESSO REAL — LYCEUM Wave 31. `aula_iniciada` dispara uma vez por
// `aula.id` genuinamente aberta (dependência do efeito é `aula.id`, não
// toda renderização — trocar de aula via "Próxima aula" re-renderiza este
// mesmo componente sem desmontar, e é exatamente aí que o efeito precisa
// refirar). Falha de rede no evento é best-effort: loga e segue, nunca
// bloqueia a leitura da aula.
//
// Não existia ponto de conclusão explícito na interface antes desta wave
// (sem botão "terminei", exercícios sem checagem, `activities: []` em
// boa parte das aulas). Confirmado com o Aquiles: em vez de reaproveitar
// "Próxima aula/Voltar" como afirmação implícita de conclusão, entra um
// botão dedicado — `ConclusaoAula`, ao final, depois do `ExercicioBlock`.

import { useEffect, useState } from 'react';
import type { CurriculumAula, LessonReference } from '@/lib/types/alexandria';
import { getCorpoAula, getLeadAula } from '@/lib/data/alexandria-curriculo';
import { recordEvent, type AulaStatusInfo } from '@/lib/progress/progressApi';
import { avaliarPorConclusao, concederBadges } from '@/lib/progress/badgeRules';
import { A, A2, AT, AS, AR, AE } from '@/design/alexandria-tokens';
import { VideoArea } from './VideoArea';
import { ApostilaPanel } from './ApostilaPanel';
import { InstrumentPanel } from './InstrumentPanel';
import { ExercicioBlock } from './ExercicioBlock';

export function AulaViewer({ aula }: { aula: CurriculumAula }) {
  // Resolvido pelo id da aula, não por módulo fixo — ver
  // `alexandria-curriculo.ts`.
  const blocos = getCorpoAula(aula.id);
  const lead = getLeadAula(aula.id);

  // `null` = ainda não sabemos (efeito não resolveu, ou falhou). Nunca
  // afirma "concluído" sem confirmação real do backend.
  const [status, setStatus] = useState<AulaStatusInfo['status'] | null>(null);
  const [marcando, setMarcando] = useState(false);
  const [erroMarcar, setErroMarcar] = useState<string | null>(null);

  useEffect(() => {
    // Troca de aula (Próxima/Anterior não desmonta este componente) —
    // limpa o status da aula anterior antes de perguntar pela nova, para
    // não mostrar "concluído" da aula que acabou de sair de cena.
    setStatus(null);
    setErroMarcar(null);
    let vivo = true;

    recordEvent('aula_iniciada', aula.id)
      .then((r) => {
        if (vivo && r.aulaStatus) setStatus(r.aulaStatus.status);
      })
      .catch((err: unknown) => {
        // Best-effort: a aula continua legível mesmo sem registrar.
        console.error('[alexandria] falha ao registrar aula_iniciada', err);
      });

    return () => {
      vivo = false;
    };
  }, [aula.id]);

  async function marcarConcluida() {
    setMarcando(true);
    setErroMarcar(null);
    try {
      const r = await recordEvent('aula_concluida', aula.id);
      setStatus(r.aulaStatus?.status ?? 'concluido');

      // Concessão de badge — LYCEUM Wave 39. Conclusão de aula é o único
      // sinal que o produto emite, então é aqui que a avaliação cabe.
      // Hoje NENHUMA das 13 regras dispara (ver `badgeRules.ts`: o
      // veredito da wave é que nenhum critério tem evento real
      // disponível), então isto devolve lista vazia sem abrir requisição.
      // O caminho fica ligado para que abrir um bloqueio seja escrever
      // uma regra, não montar encanamento.
      await concederBadges(avaliarPorConclusao({ aulaId: aula.id }));
    } catch (err) {
      console.error('[alexandria] falha ao registrar aula_concluida', err);
      setErroMarcar('Não foi possível salvar agora. Tente de novo.');
    } finally {
      setMarcando(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: AS.xxl }}>
      <VideoArea video={aula.video} />

      {/* O corpo da aula. Conteúdo de página — nunca atrás de um controle
          que possa dispensá-lo. */}
      <ApostilaPanel lead={lead} blocos={blocos} gravuras={aula.illustrations} />

      {aula.instruments.map((inst) => (
        <InstrumentPanel key={inst.id} instrumento={inst} />
      ))}

      <ExercicioBlock atividades={aula.activities} />

      <MaterialComplementar referencias={aula.references} />

      <ConclusaoAula
        status={status}
        marcando={marcando}
        erro={erroMarcar}
        onMarcar={marcarConcluida}
      />
    </div>
  );
}

/** O único ponto de conclusão explícito da aula — LYCEUM Wave 31. Estado
 *  desconhecido (efeito ainda não resolveu ou falhou) mostra o botão, não
 *  um terceiro estado visual: nunca afirma "concluído" sem confirmação. */
function ConclusaoAula({
  status,
  marcando,
  erro,
  onMarcar,
}: {
  status: AulaStatusInfo['status'] | null;
  marcando: boolean;
  erro: string | null;
  onMarcar: () => void;
}) {
  if (status === 'concluido') {
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
        <span style={{ ...AT.corpo, fontSize: '14px', color: A.oliva }}>
          ✓ Aula concluída
        </span>
      </div>
    );
  }

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
        onClick={onMarcar}
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
        {marcando ? 'Marcando…' : 'Marcar aula como concluída'}
      </button>
      {erro && (
        <span style={{ ...AT.dado, fontSize: '11px', color: A.terracota }}>{erro}</span>
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
function MaterialComplementar({ referencias }: { referencias: LessonReference[] }) {
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
