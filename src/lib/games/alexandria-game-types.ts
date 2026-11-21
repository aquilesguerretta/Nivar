export type GameLens = 'explorador' | 'analista' | 'especialista';

export type ClaimMagnitude =
  | 'capacidade'
  | 'geracao'
  | 'carga'
  | 'curtailment'
  | 'transmissao'
  | 'renovabilidade';

export type ClaimUnit = 'gw' | 'twh' | 'gwh' | 'mw-medio' | 'percentual' | 'quilometro';

export type ClaimUniverse =
  | 'eletrico-amplo'
  | 'energetico-nacional'
  | 'sin-operativo'
  | 'centralizado-regulatorio'
  | 'planejamento'
  | 'perimetro-corporativo';

export type ClaimPeriod =
  | 'ano-base'
  | 'fotografia-data'
  | 'intervalo-operativo'
  | 'horizonte-cenario'
  | 'data-publicacao';

export type SourceStatus = 'fato-consolidado' | 'operacao' | 'cadastro' | 'cenario' | 'anuncio';

export type ReconciliationDecision =
  | 'comparavel'
  | 'normalizar'
  | 'nao-comparavel'
  | 'insuficiente';

export type ClassificationField = 'magnitude' | 'unidade' | 'universo' | 'periodo' | 'status';

export interface ClaimClassification {
  magnitude: ClaimMagnitude;
  unidade: ClaimUnit;
  universo: ClaimUniverse;
  periodo: ClaimPeriod;
  status: SourceStatus;
}

export type CriticalErrorCode =
  | 'capacidade-versus-geracao'
  | 'energetica-versus-eletrica'
  | 'cenario-como-fato'
  | 'cadastro-como-operacao'
  | 'publicacao-versus-ano-base'
  | 'universos-incompativeis';

export interface DossierDocument {
  id: string;
  code: string;
  title: string;
  source: string;
  sourceStatusLabel: string;
  claim: string;
  context: string;
  lenses: readonly GameLens[];
  expected: ClaimClassification;
  expectedDecision: ReconciliationDecision;
  criticalWhenWrong?: Partial<Record<ClassificationField | 'decisao', CriticalErrorCode>>;
  reconstruction: string;
  assistance?: string;
}

export interface DecisionGameScenario {
  id: string;
  moduleId: string;
  title: string;
  subtitle: string;
  competenceIds: readonly string[];
  transferCaseIds?: readonly string[];
  documents: readonly DossierDocument[];
}

export interface ClaimAnswer {
  documentId: string;
  classification: Partial<ClaimClassification>;
  decision?: ReconciliationDecision;
  justification: string;
  assistanceUsed: boolean;
}

export interface AnswerEvaluation {
  documentId: string;
  correctFields: readonly ClassificationField[];
  incorrectFields: readonly ClassificationField[];
  decisionCorrect: boolean;
  criticalErrors: readonly CriticalErrorCode[];
  reconstruction: string;
}

export type RubricBand = 'consistente' | 'parcial' | 'fragil';

export interface GameRubric {
  classificacao: RubricBand;
  reconciliacao: RubricBand;
  justificativa: RubricBand;
  artefato: RubricBand;
}

export interface GameEvidence {
  id: string;
  scenarioId: string;
  moduleId: string;
  competenceIds: readonly string[];
  lens: GameLens;
  completedAt: string;
  documentCount: number;
  correctlyClassifiedDocuments: number;
  justifiedDecisions: number;
  assistanceCount: number;
  criticalErrors: readonly CriticalErrorCode[];
  rubric: GameRubric;
  transferObserved: boolean;
  retentionObserved: false;
  domainStateChange: null;
  evidenceKind: 'performance';
}

export interface GameDebrief {
  evaluations: readonly AnswerEvaluation[];
  evidence: GameEvidence;
  artifact: string;
}

export const LENS_DOCUMENT_LIMIT: Record<GameLens, number> = {
  explorador: 4,
  analista: 8,
  especialista: 11,
};
