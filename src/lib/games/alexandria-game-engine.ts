import type {
  AnswerEvaluation,
  ClaimAnswer,
  ClassificationField,
  CriticalErrorCode,
  DecisionGameScenario,
  DossierDocument,
  GameDebrief,
  GameEvidence,
  GameLens,
  GameRubric,
  RubricBand,
} from './alexandria-game-types.ts';
import { LENS_DOCUMENT_LIMIT } from './alexandria-game-types.ts';

const CLASSIFICATION_FIELDS: readonly ClassificationField[] = [
  'magnitude',
  'unidade',
  'universo',
  'periodo',
  'status',
];

export function documentsForLens(
  scenario: DecisionGameScenario,
  lens: GameLens,
): readonly DossierDocument[] {
  return scenario.documents
    .filter((document) => document.lenses.includes(lens))
    .slice(0, LENS_DOCUMENT_LIMIT[lens]);
}

export function answerIsComplete(answer: ClaimAnswer | undefined): boolean {
  if (!answer?.decision || answer.justification.trim().length < 12) return false;
  return CLASSIFICATION_FIELDS.every((field) => answer.classification[field] !== undefined);
}

export function evaluateAnswer(
  document: DossierDocument,
  answer: ClaimAnswer,
): AnswerEvaluation {
  const correctFields = CLASSIFICATION_FIELDS.filter(
    (field) => answer.classification[field] === document.expected[field],
  );
  const incorrectFields = CLASSIFICATION_FIELDS.filter(
    (field) => answer.classification[field] !== document.expected[field],
  );
  const decisionCorrect = answer.decision === document.expectedDecision;
  const criticalErrors = new Set<CriticalErrorCode>();

  for (const field of incorrectFields) {
    const critical = document.criticalWhenWrong?.[field];
    if (critical) criticalErrors.add(critical);
  }
  if (!decisionCorrect) {
    const critical = document.criticalWhenWrong?.decisao;
    if (critical) criticalErrors.add(critical);
  }

  return {
    documentId: document.id,
    correctFields,
    incorrectFields,
    decisionCorrect,
    criticalErrors: [...criticalErrors],
    reconstruction: document.reconstruction,
  };
}

function band(correct: number, total: number): RubricBand {
  if (total === 0 || correct / total < 0.6) return 'fragil';
  if (correct / total < 0.85) return 'parcial';
  return 'consistente';
}

function buildRubric(
  evaluations: readonly AnswerEvaluation[],
  answers: readonly ClaimAnswer[],
  conclusion: string,
): GameRubric {
  const totalFields = evaluations.length * CLASSIFICATION_FIELDS.length;
  const correctFields = evaluations.reduce((sum, item) => sum + item.correctFields.length, 0);
  const correctDecisions = evaluations.filter((item) => item.decisionCorrect).length;
  const justified = answers.filter((answer) => answer.justification.trim().length >= 40).length;
  return {
    classificacao: band(correctFields, totalFields),
    reconciliacao: band(correctDecisions, evaluations.length),
    justificativa: band(justified, evaluations.length),
    artefato: conclusion.trim().length >= 180
      ? 'consistente'
      : conclusion.trim().length >= 80
        ? 'parcial'
        : 'fragil',
  };
}

function buildArtifact(
  scenario: DecisionGameScenario,
  lens: GameLens,
  documents: readonly DossierDocument[],
  evaluations: readonly AnswerEvaluation[],
  conclusion: string,
): string {
  const divergences = documents
    .map((document, index) => {
      const evaluation = evaluations[index];
      const result = evaluation?.decisionCorrect ? 'reconciliação adequada' : 'revisão necessária';
      return `- ${document.code} — ${document.source}: ${document.claim} [${result}]`;
    })
    .join('\n');

  return [
    `NOTA METODOLÓGICA — ${scenario.title}`,
    `Lente: ${lens}`,
    '',
    'Pergunta',
    'Os números apresentados são contraditórios ou respondem a recortes diferentes?',
    '',
    'Fontes e recortes examinados',
    divergences,
    '',
    'Método',
    'Cada afirmação foi separada por grandeza, unidade, universo, período e status da fonte antes da comparação.',
    '',
    'Conclusão do analista',
    conclusion.trim(),
    '',
    'Limitações',
    'Esta nota registra desempenho nesta sessão. Não comprova retenção futura nem promove estado de domínio automaticamente.',
  ].join('\n');
}

export function completeGame(params: {
  scenario: DecisionGameScenario;
  lens: GameLens;
  answers: readonly ClaimAnswer[];
  conclusion: string;
  completedAt?: string;
}): GameDebrief {
  const { scenario, lens, answers, conclusion } = params;
  const documents = documentsForLens(scenario, lens);
  const answerByDocument = new Map(answers.map((answer) => [answer.documentId, answer]));
  const evaluations = documents.map((document) => {
    const answer = answerByDocument.get(document.id);
    if (!answer || !answerIsComplete(answer)) {
      throw new Error(`Resposta incompleta para ${document.code}.`);
    }
    return evaluateAnswer(document, answer);
  });
  const rubric = buildRubric(evaluations, answers, conclusion);
  const criticalErrors = [...new Set(evaluations.flatMap((item) => item.criticalErrors))];
  const completedAt = params.completedAt ?? new Date().toISOString();
  const correctlyClassifiedDocuments = evaluations.filter(
    (item) => item.incorrectFields.length === 0,
  ).length;
  const justifiedDecisions = answers.filter((answer) => answer.justification.trim().length >= 40).length;
  const specialistTransferCases = new Set(scenario.transferCaseIds ?? []);
  const transferObserved = lens === 'especialista'
    && evaluations.filter(
      (item) => specialistTransferCases.has(item.documentId)
        && item.incorrectFields.length === 0
        && item.decisionCorrect,
    ).length >= 2;

  const evidence: GameEvidence = {
    id: `${scenario.id}:${lens}:${completedAt}`,
    scenarioId: scenario.id,
    moduleId: scenario.moduleId,
    competenceIds: scenario.competenceIds,
    lens,
    completedAt,
    documentCount: documents.length,
    correctlyClassifiedDocuments,
    justifiedDecisions,
    assistanceCount: answers.filter((answer) => answer.assistanceUsed).length,
    criticalErrors,
    rubric,
    transferObserved,
    retentionObserved: false,
    domainStateChange: null,
    evidenceKind: 'performance',
  };

  return {
    evaluations,
    evidence,
    artifact: buildArtifact(scenario, lens, documents, evaluations, conclusion),
  };
}
