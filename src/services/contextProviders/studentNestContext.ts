// ORACLE Wave 2 — Student Nest context provider.
//
// FORGE Wave 7 extended the provider with two module-level bridges
// the Sandbox Trading and Project Sandbox views write into. ORACLE
// reads them on each synthesis so the AI surface can answer "what's
// in my current portfolio" or "how's my $RECO position doing".

import type { ContextProvider } from '../aiContext';
import {
  TODAY_EXPLAINER,
  STUDENT_CONCEPT_NODES,
  INTERVIEW_QUESTIONS,
} from '@/lib/mock/student-mock';
import type {
  HypotheticalProject,
  Position,
  PositionPnL,
} from '@/lib/sandbox/types';
import { summarizePortfolio } from '@/lib/sandbox/markToMarket';

// ─── Sandbox state bridges ──────────────────────────────────────

interface SandboxStateSnapshot {
  positions: Position[];
  markCache: Record<string, PositionPnL>;
  selectedPositionId: string | null;
}

interface ProjectPortfolioStateSnapshot {
  projects: HypotheticalProject[];
  selectedProjectId: string | null;
}

let currentSandboxState: SandboxStateSnapshot | null = null;
let currentProjectPortfolioState: ProjectPortfolioStateSnapshot | null = null;

/**
 * Called by SandboxTradingView whenever the position list or mark
 * cache changes. Pass null on unmount to clear the snapshot.
 */
export function setSandboxState(state: SandboxStateSnapshot | null): void {
  currentSandboxState = state;
}

/**
 * Called by ProjectSandboxView whenever the project portfolio changes.
 */
export function setProjectPortfolioState(
  state: ProjectPortfolioStateSnapshot | null,
): void {
  currentProjectPortfolioState = state;
}

// ─── Context provider ──────────────────────────────────────────

export const studentNestContextProvider: ContextProvider = (input) => {
  const zone = input.selectedZone ?? null;

  const sandboxLines: string[] = [];
  if (currentSandboxState && currentSandboxState.positions.length > 0) {
    const summary = summarizePortfolio(
      currentSandboxState.positions,
      currentSandboxState.markCache,
    );
    const realized = Math.round(summary.realizedPnLUSD).toLocaleString();
    const unrealized = Math.round(summary.unrealizedPnLUSD).toLocaleString();
    sandboxLines.push(
      `Sandbox portfolio: ${summary.openPositions} open + ${summary.closedPositions} closed. ` +
        `Realized PnL $${realized}, unrealized $${unrealized}. ` +
        `Win rate ${
          Number.isNaN(summary.winRate)
            ? 'n/a'
            : `${(summary.winRate * 100).toFixed(0)}%`
        }.`,
    );
    if (currentSandboxState.selectedPositionId) {
      const sel = currentSandboxState.positions.find(
        (p) => p.id === currentSandboxState!.selectedPositionId,
      );
      if (sel) {
        const mark = currentSandboxState.markCache[sel.id];
        const pnl = sel.realizedPnL ?? mark?.pnlUSD ?? 0;
        sandboxLines.push(
          `Selected position: ${sel.direction.toUpperCase()} ${sel.sizeMW} MW ${sel.zone} ` +
            `@ $${sel.entryLMP.toFixed(2)} (${sel.status}, PnL $${Math.round(pnl).toLocaleString()}).`,
        );
      }
    }
  }

  const projectLines: string[] = [];
  if (
    currentProjectPortfolioState &&
    currentProjectPortfolioState.projects.length > 0
  ) {
    const ps = currentProjectPortfolioState.projects;
    const totalMW = ps.reduce((s, p) => s + p.capacityMW, 0);
    const avgIRR =
      ps.reduce((s, p) => s + p.projection.scenarios.base.irr, 0) / ps.length;
    projectLines.push(
      `Project portfolio: ${ps.length} hypothetical projects, ${totalMW} MW total. ` +
        `Average projected IRR ${(avgIRR * 100).toFixed(1)}%.`,
    );
    if (currentProjectPortfolioState.selectedProjectId) {
      const sel = ps.find(
        (p) => p.id === currentProjectPortfolioState!.selectedProjectId,
      );
      if (sel) {
        const base = sel.projection.scenarios.base;
        projectLines.push(
          `Selected project: ${sel.name} (${sel.technology} ${sel.capacityMW} MW @ ${sel.zone}, ` +
            `COD ${sel.codYear}, IRR ${(base.irr * 100).toFixed(1)}%).`,
        );
      }
    }
  }

  const description =
    `Student Nest. Today's market explainer headline: "${TODAY_EXPLAINER.headline}". ` +
    `Concept map shows ${STUDENT_CONCEPT_NODES.length} nodes from foundation ` +
    `through advanced. Interview-question rail surfaces ` +
    `${INTERVIEW_QUESTIONS.length} curated questions across difficulty tiers. ` +
    `The user is a student or career-switcher building energy market literacy.` +
    (sandboxLines.length > 0 ? ` ${sandboxLines.join(' ')}` : '') +
    (projectLines.length > 0 ? ` ${projectLines.join(' ')}` : '');

  return {
    surfaceLabel: 'Student Nest',
    selectedZone: zone,
    visibleData: {
      description,
      metrics: {
        todayExplainer: TODAY_EXPLAINER.headline,
        conceptNodes: STUDENT_CONCEPT_NODES.length,
        interviewQuestions: INTERVIEW_QUESTIONS.length,
        sandboxPositions: currentSandboxState?.positions.length ?? 0,
        sandboxProjects: currentProjectPortfolioState?.projects.length ?? 0,
      },
    },
  };
};
