import { useMemo, useState } from 'react';
import { A, A2, AE, AR, AS, AT } from '@/design/alexandria-tokens';
import {
  answerIsComplete,
  completeGame,
  documentsForLens,
  evaluateAnswer,
} from '@/lib/games/alexandria-game-engine';
import { persistGameEvidence } from '@/lib/games/alexandria-game-storage';
import {
  DECISION_LABELS,
  MAGNITUDE_LABELS,
  MODULO_08_GAME,
  PERIOD_LABELS,
  STATUS_LABELS,
  UNIT_LABELS,
  UNIVERSE_LABELS,
} from '@/lib/games/modulo-08-game-data';
import type {
  AnswerEvaluation,
  ClaimAnswer,
  ClaimClassification,
  CriticalErrorCode,
  GameDebrief,
  GameLens,
} from '@/lib/games/alexandria-game-types';
import './Modulo08Game.css';

interface Modulo08GameProps {
  onBack: () => void;
}

type Stage = 'lente' | 'dossie' | 'debriefing';

const LENS_COPY: Record<GameLens, { duration: string; title: string; description: string }> = {
  explorador: {
    duration: '10–15 min · 4 documentos',
    title: 'Explorador',
    description: 'Etiquetas guiadas, pistas metodológicas e dois pares de números fundamentais.',
  },
  analista: {
    duration: '15–25 min · 8 documentos',
    title: 'Analista',
    description: 'Operação, MMGD, cadastro, cenário e quebra metodológica entram no dossiê.',
  },
  especialista: {
    duration: '25–40 min · 11 documentos',
    title: 'Especialista',
    description: 'Fontes conflitantes, anúncio corporativo, revisão temporal e casos de qualificação.',
  },
};

const CRITICAL_LABELS: Record<CriticalErrorCode, string> = {
  'capacidade-versus-geracao': 'Capacidade foi tratada como geração.',
  'energetica-versus-eletrica': 'Matriz energética foi confundida com matriz elétrica.',
  'cenario-como-fato': 'Cenário ou simulação foi comunicado como fato garantido.',
  'cadastro-como-operacao': 'Cadastro ou outorga foi tratado como operação.',
  'publicacao-versus-ano-base': 'Data de publicação foi confundida com ano-base.',
  'universos-incompativeis': 'Universos incompatíveis foram comparados sem normalização.',
};

const LOCAL_EVIDENCE_NOTICE =
  'Sua evidência de desempenho fica só neste navegador — não sincroniza com sua conta nem com outros aparelhos.';

const buttonBase = {
  ...AT.rotulo,
  borderRadius: AR.none,
  padding: `${AS.md} ${AS.lg}`,
  cursor: 'pointer',
  transition: `background ${AE.estado} ${AE.easing}, color ${AE.estado} ${AE.easing}`,
} as const;

function emptyAnswer(documentId: string): ClaimAnswer {
  return {
    documentId,
    classification: {},
    justification: '',
    assistanceUsed: false,
  };
}

function entries(record: Record<string, string>): readonly [string, string][] {
  return Object.entries(record);
}

function scrollGameToTop() {
  window.requestAnimationFrame(() => {
    document.getElementById('m8-game-title')?.scrollIntoView({ block: 'start' });
  });
}

export function Modulo08Game({ onBack }: Modulo08GameProps) {
  const [stage, setStage] = useState<Stage>('lente');
  const [lens, setLens] = useState<GameLens>('explorador');
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, ClaimAnswer>>({});
  const [evaluations, setEvaluations] = useState<Record<string, AnswerEvaluation>>({});
  const [conclusion, setConclusion] = useState('');
  const [debrief, setDebrief] = useState<GameDebrief | null>(null);
  const [message, setMessage] = useState('');

  const documents = useMemo(() => documentsForLens(MODULO_08_GAME, lens), [lens]);
  const activeDocument = documents[activeIndex] ?? documents[0];
  const activeAnswer = activeDocument
    ? answers[activeDocument.id] ?? emptyAnswer(activeDocument.id)
    : undefined;
  const completedDocuments = documents.filter((document) =>
    answerIsComplete(answers[document.id]),
  ).length;
  const canFinish = completedDocuments === documents.length && conclusion.trim().length >= 80;

  const patchAnswer = (documentId: string, patch: Partial<ClaimAnswer>) => {
    setAnswers((current) => ({
      ...current,
      [documentId]: { ...(current[documentId] ?? emptyAnswer(documentId)), ...patch },
    }));
  };

  const updateField = <K extends keyof ClaimClassification>(
    documentId: string,
    field: K,
    value: ClaimClassification[K],
  ) => {
    const current = answers[documentId] ?? emptyAnswer(documentId);
    patchAnswer(documentId, {
      classification: { ...current.classification, [field]: value },
    });
  };

  const start = () => {
    setAnswers({});
    setEvaluations({});
    setConclusion('');
    setActiveIndex(0);
    setMessage('Dossiê aberto. Classifique o primeiro documento.');
    setStage('dossie');
    scrollGameToTop();
  };

  const registerDecision = () => {
    if (!activeDocument || !activeAnswer || !answerIsComplete(activeAnswer)) return;
    const evaluation = evaluateAnswer(activeDocument, activeAnswer);
    setEvaluations((current) => ({ ...current, [activeDocument.id]: evaluation }));
    setMessage(evaluation.incorrectFields.length === 0 && evaluation.decisionCorrect
      ? 'Decisão registrada: os cinco campos e a comparabilidade foram reconciliados.'
      : 'Consequência registrada: há recortes que precisam ser reconstruídos antes do parecer.');
  };

  const requestAssistance = () => {
    if (!activeDocument) return;
    patchAnswer(activeDocument.id, { assistanceUsed: true });
    setMessage(activeDocument.assistance ?? 'Revise a nota de procedência do documento.');
  };

  const finish = () => {
    if (!canFinish) return;
    try {
      const result = completeGame({
        scenario: MODULO_08_GAME,
        lens,
        answers: documents.map((document) => answers[document.id]!),
        conclusion,
      });
      setDebrief(result);
      try {
        persistGameEvidence(result.evidence);
        setMessage(LOCAL_EVIDENCE_NOTICE);
      } catch {
        setMessage('Debriefing concluído, mas o navegador não permitiu salvar a evidência local.');
      }
      setStage('debriefing');
      scrollGameToTop();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível concluir a expedição.');
    }
  };

  const replay = () => {
    setDebrief(null);
    setAnswers({});
    setEvaluations({});
    setConclusion('');
    setActiveIndex(0);
    setMessage('Escolha a lente para a nova tentativa.');
    setStage('lente');
    scrollGameToTop();
  };

  return (
    <section className="m8-game" aria-labelledby="m8-game-title" style={{ display: 'flex', flexDirection: 'column', gap: AS.xl }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: AS.sm, borderBottom: `3px double ${A.fioSobreCreme}`, paddingBottom: AS.lg }}>
        <button type="button" onClick={onBack} style={{ ...buttonBase, alignSelf: 'flex-start', padding: 0, border: 'none', background: 'none', color: A2.tintaMetadado }}>
          ← Módulo 08 · Matriz Elétrica
        </button>
        <span style={{ ...AT.rotulo, color: A.terracota }}>Expedição decisória · M08</span>
        <h1 id="m8-game-title" style={{ ...AT.h1, margin: 0, color: A.tintaSobreCreme }}>{MODULO_08_GAME.title}</h1>
        <p style={{ ...AT.corpo, margin: 0, color: A.tintaSuave }}>
          Sua tarefa não é escolher o número “certo”. É descobrir sobre o que cada número é verdadeiro.
        </p>
      </header>

      <nav aria-label="Etapas da expedição" style={{ display: 'flex', flexWrap: 'wrap', gap: AS.md, borderBottom: `1px solid ${A.fioSobreCreme}`, paddingBottom: AS.md }}>
        {(['lente', 'dossie', 'debriefing'] as const).map((item, index) => (
          <span key={item} style={{ ...AT.rotulo, color: stage === item ? A.terracota : A2.tintaMetadado }}>
            {String(index + 1).padStart(2, '0')} · {item === 'lente' ? 'Lente' : item === 'dossie' ? 'Dossiê' : 'Debriefing'}
          </span>
        ))}
      </nav>

      <p aria-live="polite" style={{ ...AT.dado, minHeight: '1.5em', margin: 0, color: A.oliva }}>{message}</p>

      {stage === 'lente' && (
        <section aria-labelledby="lens-title" style={{ display: 'flex', flexDirection: 'column', gap: AS.lg }}>
          <div>
            <span style={{ ...AT.rotulo, color: A2.tintaMetadado }}>Ordem de missão 01</span>
            <h2 id="lens-title" style={{ ...AT.h2, margin: `${AS.sm} 0`, color: A.tintaSobreCreme }}>Escolha a lente</h2>
            <p style={{ ...AT.corpo, margin: 0, color: A.tintaSuave }}>A competência é a mesma. Quantidade de evidência, assistência e exigência da nota mudam.</p>
          </div>
          <aside
            role="note"
            aria-label="Persistência local da evidência"
            style={{ padding: AS.lg, borderLeft: `3px solid ${A.terracota}`, background: A2.cremeSuperficie }}
          >
            <span style={{ ...AT.rotulo, color: A.terracota }}>Antes de começar</span>
            <p style={{ ...AT.corpo, fontSize: '14px', margin: `${AS.sm} 0 0`, color: A.tintaSobreCreme }}>
              {LOCAL_EVIDENCE_NOTICE}
            </p>
          </aside>
          <div className="m8-lens-grid">
            {(Object.keys(LENS_COPY) as GameLens[]).map((option) => {
              const selected = lens === option;
              const copy = LENS_COPY[option];
              return (
                  <button
                  key={option}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setLens(option)}
                  style={{ textAlign: 'left', padding: AS.lg, minHeight: '160px', border: 'none', borderRight: `1px solid ${A.fioSobreCreme}`, borderBottom: `1px solid ${A.fioSobreCreme}`, borderTop: `3px solid ${selected ? A.terracota : 'transparent'}`, borderRadius: AR.none, background: selected ? A2.cremeSuperficie : 'transparent', color: A.tintaSobreCreme, cursor: 'pointer' }}
                >
                  <span style={{ ...AT.h3, display: 'block', color: selected ? A.terracota : A.tintaSobreCreme }}>{copy.title}</span>
                  <span style={{ ...AT.dado, display: 'block', marginTop: AS.sm, color: A2.tintaMetadado }}>{copy.duration}</span>
                  <span style={{ ...AT.corpo, display: 'block', marginTop: AS.md, fontSize: '14px', color: A.tintaSuave }}>{copy.description}</span>
                </button>
              );
            })}
          </div>
          <button type="button" onClick={start} style={{ ...buttonBase, alignSelf: 'flex-start', color: A.tintaSobreNavy, background: A.navy, border: `1px solid ${A.navy}` }}>
            Abrir dossiê · {LENS_COPY[lens].title}
          </button>
        </section>
      )}

      {stage === 'dossie' && activeDocument && activeAnswer && (
        <section aria-labelledby="dossier-title" style={{ display: 'flex', flexDirection: 'column', gap: AS.lg }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: AS.md }}>
            <div>
              <span style={{ ...AT.rotulo, color: A2.tintaMetadado }}>Caixa documental · {LENS_COPY[lens].title}</span>
              <h2 id="dossier-title" style={{ ...AT.h2, margin: `${AS.sm} 0 0`, color: A.tintaSobreCreme }}>Classificar e reconciliar</h2>
            </div>
            <span style={{ ...AT.dado, color: A.oliva }}>{completedDocuments} de {documents.length} decisões preenchidas</span>
          </div>

          <div className="m8-workbench">
            <aside aria-label="Índice do dossiê" style={{ borderRight: `1px solid ${A.fioSobreCreme}`, background: A2.cremeSuperficie }}>
              {documents.map((document, index) => {
                const isActive = index === activeIndex;
                const done = answerIsComplete(answers[document.id]);
                return (
                  <button key={document.id} type="button" onClick={() => setActiveIndex(index)} aria-current={isActive ? 'step' : undefined} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', gap: AS.sm, padding: `${AS.md} ${AS.lg}`, textAlign: 'left', border: 'none', borderBottom: `1px solid ${A2.fioClaroSobreCreme}`, borderLeft: `3px solid ${isActive ? A.terracota : 'transparent'}`, borderRadius: AR.none, background: isActive ? A.cremePapel : 'transparent', color: A.tintaSobreCreme, cursor: 'pointer' }}>
                    <span style={{ ...AT.dado, fontSize: '12px' }}>{document.code}</span>
                    <span aria-label={done ? 'preenchido' : 'pendente'} style={{ color: done ? A.oliva : A2.tintaMetadado }}>{done ? '✓' : '○'}</span>
                  </button>
                );
              })}
            </aside>

            <article style={{ minWidth: 0, padding: AS.xl, display: 'flex', flexDirection: 'column', gap: AS.lg }}>
              <header style={{ borderBottom: `1px solid ${A.fioSobreCreme}`, paddingBottom: AS.md }}>
                <span style={{ ...AT.rotulo, color: A.terracota }}>{activeDocument.code}</span>
                <h3 style={{ ...AT.h3, margin: `${AS.sm} 0`, color: A.tintaSobreCreme }}>{activeDocument.title}</h3>
                <p style={{ ...AT.dado, margin: 0, color: A2.tintaMetadado }}>{activeDocument.source} · {activeDocument.sourceStatusLabel}</p>
              </header>

              <blockquote style={{ ...AT.corpo, maxWidth: 'none', margin: 0, padding: `${AS.md} ${AS.lg}`, borderLeft: `3px solid ${A.terracota}`, color: A.tintaSobreCreme }}>
                “{activeDocument.claim}”
              </blockquote>
              <p style={{ ...AT.corpo, margin: 0, fontSize: '14px', color: A.tintaSuave }}>{activeDocument.context}</p>

              <div className="m8-classification-grid">
                <FieldSelect label="Grandeza" value={activeAnswer.classification.magnitude} options={entries(MAGNITUDE_LABELS)} onChange={(value) => updateField(activeDocument.id, 'magnitude', value as ClaimClassification['magnitude'])} />
                <FieldSelect label="Unidade" value={activeAnswer.classification.unidade} options={entries(UNIT_LABELS)} onChange={(value) => updateField(activeDocument.id, 'unidade', value as ClaimClassification['unidade'])} />
                <FieldSelect label="Universo" value={activeAnswer.classification.universo} options={entries(UNIVERSE_LABELS)} onChange={(value) => updateField(activeDocument.id, 'universo', value as ClaimClassification['universo'])} />
                <FieldSelect label="Período" value={activeAnswer.classification.periodo} options={entries(PERIOD_LABELS)} onChange={(value) => updateField(activeDocument.id, 'periodo', value as ClaimClassification['periodo'])} />
                <FieldSelect label="Status da fonte" value={activeAnswer.classification.status} options={entries(STATUS_LABELS)} onChange={(value) => updateField(activeDocument.id, 'status', value as ClaimClassification['status'])} />
                <FieldSelect label="Decisão" value={activeAnswer.decision} options={entries(DECISION_LABELS)} onChange={(value) => patchAnswer(activeDocument.id, { decision: value as ClaimAnswer['decision'] })} />
              </div>

              <label style={{ display: 'flex', flexDirection: 'column', gap: AS.sm }}>
                <span style={{ ...AT.rotulo, color: A2.tintaMetadado }}>Justificativa da decisão</span>
                <textarea value={activeAnswer.justification} onChange={(event) => patchAnswer(activeDocument.id, { justification: event.target.value })} rows={4} placeholder="Explique quais recortes permitem ou impedem a comparação…" style={{ ...AT.corpo, maxWidth: 'none', resize: 'vertical', padding: AS.md, border: `1px solid ${A.fioSobreCreme}`, borderRadius: AR.none, background: A2.cremeSuperficie, color: A.tintaSobreCreme }} />
              </label>

              <div style={{ display: 'flex', gap: AS.md, flexWrap: 'wrap' }}>
                <button type="button" disabled={!answerIsComplete(activeAnswer)} onClick={registerDecision} style={{ ...buttonBase, opacity: answerIsComplete(activeAnswer) ? 1 : 0.5, color: A.tintaSobreNavy, background: A.navy, border: `1px solid ${A.navy}`, cursor: answerIsComplete(activeAnswer) ? 'pointer' : 'not-allowed' }}>Registrar decisão</button>
                {lens !== 'especialista' && (
                  <button type="button" onClick={requestAssistance} style={{ ...buttonBase, color: A.terracota, background: 'transparent', border: `1px solid ${A.terracota}` }}>Solicitar pista</button>
                )}
              </div>

              {evaluations[activeDocument.id] && <Consequence evaluation={evaluations[activeDocument.id]!} />}

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: AS.md, borderTop: `1px solid ${A.fioSobreCreme}`, paddingTop: AS.md }}>
                <button type="button" disabled={activeIndex === 0} onClick={() => setActiveIndex((index) => Math.max(0, index - 1))} style={{ ...buttonBase, border: 'none', background: 'none', color: A2.tintaMetadado, opacity: activeIndex === 0 ? 0.4 : 1 }}>← anterior</button>
                <button type="button" disabled={activeIndex === documents.length - 1} onClick={() => setActiveIndex((index) => Math.min(documents.length - 1, index + 1))} style={{ ...buttonBase, border: 'none', background: 'none', color: A2.tintaMetadado, opacity: activeIndex === documents.length - 1 ? 0.4 : 1 }}>próximo →</button>
              </div>
            </article>
          </div>

          <section aria-labelledby="conclusion-title" style={{ display: 'flex', flexDirection: 'column', gap: AS.md, padding: AS.lg, border: `1px solid ${A.fioSobreCreme}` }}>
            <div>
              <span style={{ ...AT.rotulo, color: A2.tintaMetadado }}>Peça conclusiva</span>
              <h3 id="conclusion-title" style={{ ...AT.h3, margin: `${AS.sm} 0`, color: A.tintaSobreCreme }}>Conclusão metodológica</h3>
              <p style={{ ...AT.corpo, fontSize: '14px', margin: 0, color: A.tintaSuave }}>Escreva ao menos 80 caracteres. Preserve grandezas, universos, períodos e limites.</p>
            </div>
            <textarea value={conclusion} onChange={(event) => setConclusion(event.target.value)} rows={5} placeholder="Os números não são necessariamente contraditórios porque…" style={{ ...AT.corpo, maxWidth: 'none', resize: 'vertical', padding: AS.md, border: `1px solid ${A.fioSobreCreme}`, borderRadius: AR.none, background: A2.cremeSuperficie, color: A.tintaSobreCreme }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: AS.md, alignItems: 'center' }}>
              <span style={{ ...AT.dado, color: conclusion.trim().length >= 80 ? A.oliva : A2.tintaMetadado }}>{conclusion.trim().length}/80 caracteres mínimos</span>
              <button type="button" disabled={!canFinish} onClick={finish} style={{ ...buttonBase, opacity: canFinish ? 1 : 0.5, color: A.tintaSobreNavy, background: A.terracota, border: `1px solid ${A.terracota}`, cursor: canFinish ? 'pointer' : 'not-allowed' }}>Concluir e abrir debriefing</button>
            </div>
          </section>
        </section>
      )}

      {stage === 'debriefing' && debrief && (
        <Debriefing debrief={debrief} documents={documents} onReplay={replay} />
      )}
    </section>
  );
}

function FieldSelect({ label, value, options, onChange }: { label: string; value?: string; options: readonly [string, string][]; onChange: (value: string) => void }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: AS.xs }}>
      <span style={{ ...AT.rotulo, color: A2.tintaMetadado }}>{label}</span>
      <select value={value ?? ''} onChange={(event) => onChange(event.target.value)} style={{ ...AT.dado, width: '100%', minHeight: '42px', padding: `${AS.sm} ${AS.md}`, border: `1px solid ${A.fioSobreCreme}`, borderRadius: AR.none, background: A2.cremeSuperficie, color: A.tintaSobreCreme }}>
        <option value="" disabled>Selecione…</option>
        {options.map(([id, text]) => <option key={id} value={id}>{text}</option>)}
      </select>
    </label>
  );
}

function Consequence({ evaluation }: { evaluation: AnswerEvaluation }) {
  const correct = evaluation.incorrectFields.length === 0 && evaluation.decisionCorrect;
  return (
    <section aria-live="polite" style={{ padding: AS.lg, borderLeft: `3px solid ${correct ? A.oliva : A.terracota}`, background: A2.cremeSuperficie }}>
      <span style={{ ...AT.rotulo, color: correct ? A.oliva : A.terracota }}>{correct ? 'Reconciliação aceita' : 'Reconstrução necessária'}</span>
      {!correct && <p style={{ ...AT.dado, margin: `${AS.sm} 0`, color: A.tintaSuave }}>Campos a rever: {[...evaluation.incorrectFields, ...(evaluation.decisionCorrect ? [] : ['decisão'])].join(', ')}.</p>}
      {evaluation.criticalErrors.map((error) => <p key={error} style={{ ...AT.dado, margin: `${AS.sm} 0`, color: A.terracota }}><strong>Erro crítico:</strong> {CRITICAL_LABELS[error]}</p>)}
      <p style={{ ...AT.corpo, fontSize: '14px', margin: `${AS.sm} 0 0`, color: A.tintaSobreCreme }}>{evaluation.reconstruction}</p>
    </section>
  );
}

function Debriefing({ debrief, documents, onReplay }: { debrief: GameDebrief; documents: readonly { id: string; code: string; title: string }[]; onReplay: () => void }) {
  const [copyStatus, setCopyStatus] = useState('');
  const download = () => {
    const blob = new Blob([debrief.artifact], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'nota-metodologica-numero-impossivel.txt';
    anchor.click();
    URL.revokeObjectURL(url);
  };
  const copy = () => {
    void navigator.clipboard.writeText(debrief.artifact).then(
      () => setCopyStatus('Nota copiada.'),
      () => setCopyStatus('Não foi possível copiar; use o download.'),
    );
  };
  return (
    <section aria-labelledby="debrief-title" style={{ display: 'flex', flexDirection: 'column', gap: AS.xl }}>
      <header>
        <span style={{ ...AT.rotulo, color: A.terracota }}>Debriefing</span>
        <h2 id="debrief-title" style={{ ...AT.h2, margin: `${AS.sm} 0`, color: A.tintaSobreCreme }}>O que aconteceu com os números</h2>
        <p style={{ ...AT.corpo, margin: 0, color: A.tintaSuave }}>Conclusão da sessão, não declaração de retenção ou domínio futuro.</p>
      </header>
      <div className="m8-debrief-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: AS.md }}>
          <section style={{ border: `1px solid ${A.fioSobreCreme}` }}>
            <h3 style={{ ...AT.h3, margin: 0, padding: AS.md, borderBottom: `1px solid ${A.fioSobreCreme}` }}>Revisão documento a documento</h3>
            {debrief.evaluations.map((evaluation) => {
              const document = documents.find((item) => item.id === evaluation.documentId)!;
              const correct = evaluation.incorrectFields.length === 0 && evaluation.decisionCorrect;
              return (
                <div key={evaluation.documentId} style={{ padding: AS.md, borderBottom: `1px solid ${A2.fioClaroSobreCreme}` }}>
                  <span style={{ ...AT.dado, color: correct ? A.oliva : A.terracota }}>{document.code} · {correct ? 'reconciliado' : 'rever'} · {document.title}</span>
                  {evaluation.criticalErrors.map((error) => <p key={error} style={{ ...AT.dado, margin: `${AS.xs} 0 0`, color: A.terracota }}>{CRITICAL_LABELS[error]}</p>)}
                </div>
              );
            })}
          </section>
          <section style={{ padding: AS.lg, borderLeft: `3px solid ${A.oliva}`, background: A2.cremeSuperficie }}>
            <span style={{ ...AT.rotulo, color: A.oliva }}>Evidência emitida</span>
            <p style={{ ...AT.dado, margin: `${AS.sm} 0`, color: A.tintaSobreCreme }}>{debrief.evidence.documentCount} documentos · {debrief.evidence.correctlyClassifiedDocuments} classificações integrais · {debrief.evidence.assistanceCount} assistências.</p>
            <p style={{ ...AT.corpo, fontSize: '14px', margin: 0, color: A.tintaSuave }}>Tipo: desempenho. Retenção observada: não. Promoção de domínio: nenhuma.</p>
            <p style={{ ...AT.corpo, fontSize: '14px', margin: `${AS.md} 0 0`, paddingTop: AS.md, borderTop: `1px solid ${A.fioSobreCreme}`, color: A.tintaSobreCreme }}>
              {LOCAL_EVIDENCE_NOTICE}
            </p>
          </section>
        </div>
        <section style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: AS.md }}>
          <div>
            <span style={{ ...AT.rotulo, color: A2.tintaMetadado }}>Artefato final</span>
            <h3 style={{ ...AT.h3, margin: `${AS.sm} 0`, color: A.tintaSobreCreme }}>Nota metodológica de reconciliação</h3>
          </div>
          <pre style={{ ...AT.dado, margin: 0, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', padding: AS.lg, border: `1px solid ${A.fioSobreCreme}`, background: A2.cremeSuperficie, color: A.tintaSobreCreme }}>{debrief.artifact}</pre>
          <div style={{ display: 'flex', gap: AS.md, flexWrap: 'wrap' }}>
            <button type="button" onClick={copy} style={{ ...buttonBase, color: A.tintaSobreNavy, background: A.navy, border: `1px solid ${A.navy}` }}>Copiar nota</button>
            <button type="button" onClick={download} style={{ ...buttonBase, color: A.terracota, background: 'transparent', border: `1px solid ${A.terracota}` }}>Baixar .txt</button>
            <button type="button" onClick={onReplay} style={{ ...buttonBase, color: A.tintaSobreCreme, background: A.terracota, border: `1px solid ${A.terracota}` }}>Rejogar</button>
          </div>
          <span aria-live="polite" style={{ ...AT.dado, color: A.oliva }}>{copyStatus}</span>
        </section>
      </div>
    </section>
  );
}

export default Modulo08Game;
