import assert from 'node:assert/strict';
import test from 'node:test';
import {
  answerIsComplete,
  completeGame,
  documentsForLens,
  evaluateAnswer,
} from '../../src/lib/games/alexandria-game-engine.ts';
import { MODULO_08_GAME } from '../../src/lib/games/modulo-08-game-data.ts';
import type { ClaimAnswer, GameLens } from '../../src/lib/games/alexandria-game-types.ts';

function correctAnswers(lens: GameLens): ClaimAnswer[] {
  return documentsForLens(MODULO_08_GAME, lens).map((document) => ({
    documentId: document.id,
    classification: { ...document.expected },
    decision: document.expectedDecision,
    justification: 'Os recortes de grandeza, unidade, universo, período e status sustentam esta decisão metodológica.',
    assistanceUsed: false,
  }));
}

test('as três lentes usam o mesmo cenário com 4, 8 e 11 documentos', () => {
  assert.equal(documentsForLens(MODULO_08_GAME, 'explorador').length, 4);
  assert.equal(documentsForLens(MODULO_08_GAME, 'analista').length, 8);
  assert.equal(documentsForLens(MODULO_08_GAME, 'especialista').length, 11);
  assert.equal(new Set(MODULO_08_GAME.documents.map((document) => document.id)).size, 11);
});

test('detecta capacidade versus geração como erro crítico', () => {
  const document = MODULO_08_GAME.documents[0]!;
  const answer: ClaimAnswer = {
    documentId: document.id,
    classification: { ...document.expected, magnitude: 'geracao' },
    decision: 'comparavel',
    justification: 'Decisão intencionalmente errada para validar a reconstrução e o erro crítico.',
    assistanceUsed: false,
  };
  const result = evaluateAnswer(document, answer);
  assert.deepEqual(result.incorrectFields, ['magnitude']);
  assert.ok(result.criticalErrors.includes('capacidade-versus-geracao'));
});

test('detecta cenário do PDE comunicado como fato', () => {
  const document = MODULO_08_GAME.documents.find((item) => item.id === 'm8-07')!;
  const answer: ClaimAnswer = {
    documentId: document.id,
    classification: { ...document.expected, status: 'fato-consolidado' },
    decision: 'comparavel',
    justification: 'Decisão intencionalmente errada para provar que cenário não vira fato garantido.',
    assistanceUsed: false,
  };
  const result = evaluateAnswer(document, answer);
  assert.ok(result.criticalErrors.includes('cenario-como-fato'));
});

test('resposta exige cinco campos, decisão e justificativa', () => {
  const document = MODULO_08_GAME.documents[0]!;
  assert.equal(answerIsComplete({
    documentId: document.id,
    classification: { ...document.expected },
    decision: document.expectedDecision,
    justification: 'curta',
    assistanceUsed: false,
  }), false);
});

test('fluxo completo gera nota e evidência sem promover domínio ou retenção', () => {
  const debrief = completeGame({
    scenario: MODULO_08_GAME,
    lens: 'analista',
    answers: correctAnswers('analista'),
    conclusion: 'As aparentes contradições desaparecem quando cada afirmação preserva sua grandeza, unidade, universo, período e status. Capacidade, geração, operação, cadastro e cenário respondem a perguntas diferentes.',
    completedAt: '2026-08-04T12:00:00.000Z',
  });
  assert.equal(debrief.evidence.documentCount, 8);
  assert.equal(debrief.evidence.correctlyClassifiedDocuments, 8);
  assert.equal(debrief.evidence.retentionObserved, false);
  assert.equal(debrief.evidence.domainStateChange, null);
  assert.equal(debrief.evidence.evidenceKind, 'performance');
  assert.match(debrief.artifact, /NOTA METODOLÓGICA/);
  assert.match(debrief.artifact, /Não comprova retenção futura/);
});

test('especialista emite transferência apenas ao reconciliar casos novos', () => {
  const debrief = completeGame({
    scenario: MODULO_08_GAME,
    lens: 'especialista',
    answers: correctAnswers('especialista'),
    conclusion: 'A reconciliação preserva denominadores corporativos, datas operativas e ano-base, além de separar capacidade, geração, cadastro e cenários. A comunicação final mantém qualificadores e declara insuficiência quando faltam recortes.',
    completedAt: '2026-08-04T12:30:00.000Z',
  });
  assert.equal(debrief.evidence.transferObserved, true);
});

