// FORGE Wave 7 — Sandbox position state.
//
// Pure helpers + a Zustand store that owns the user's paper positions
// and hypothetical project portfolio. Mirrors the analyst store
// (persisted to localStorage via the `persist` middleware), so a future
// Cursor backend wave can swap the storage adapter for a real
// `/api/sandbox/{positions,projects}` endpoint without touching
// consumers.

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  HypotheticalProject,
  Position,
  PositionAnnotation,
  PositionDirection,
  ProjectPerformanceSnapshot,
} from './types';

function makeId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Pure helpers ───────────────────────────────────────────────

export interface NewPositionInput {
  zone: string;
  direction: PositionDirection;
  sizeMW: number;
  entryHour: number;
  entryLMP: number;
  entryDate: string;
  reasoning?: string;
  holdHours?: number;
}

export function buildPosition(input: NewPositionInput): Position {
  const now = new Date().toISOString();
  return {
    id: makeId('pos'),
    zone: input.zone,
    direction: input.direction,
    sizeMW: input.sizeMW,
    entryHour: input.entryHour,
    entryLMP: input.entryLMP,
    entryDate: input.entryDate,
    reasoning: input.reasoning ?? '',
    holdHours: input.holdHours ?? 1,
    createdAt: now,
    status: 'open',
    annotations: [],
  };
}

/**
 * Compute the wall-clock moment a position is eligible to settle.
 * Returns an ISO timestamp at the end of (entryHour + holdHours)
 * on the entry date.
 *
 * The hour math is local-zone naïve (V1 ships PJM eastern-time mental
 * model only) — we anchor on Date constructor with year/month/day
 * pulled from the ISO date string.
 */
export function computeSettleAt(pos: Position): string {
  const [yyyy, mm, dd] = pos.entryDate.split('-').map((n) => Number(n));
  const d = new Date(yyyy, (mm ?? 1) - 1, dd ?? 1, pos.entryHour + pos.holdHours, 0, 0);
  return d.toISOString();
}

export function isPositionDueToSettle(
  pos: Position,
  asOf: Date = new Date(),
): boolean {
  if (pos.status === 'closed') return false;
  return asOf.getTime() >= new Date(computeSettleAt(pos)).getTime();
}

export function applyClosePosition(
  pos: Position,
  exitLMP: number,
  realizedPnL: number,
): Position {
  return {
    ...pos,
    status: 'closed',
    exitLMP,
    exitAt: new Date().toISOString(),
    realizedPnL,
  };
}

// ─── Zustand store ───────────────────────────────────────────────

interface SandboxState {
  positions: Position[];
  projects: HypotheticalProject[];

  // Positions
  addPosition: (input: NewPositionInput) => Position;
  updatePosition: (id: string, patch: Partial<Position>) => void;
  closePosition: (id: string, exitLMP: number, realizedPnL: number) => void;
  deletePosition: (id: string) => void;
  attachAnnotation: (positionId: string, note: string) => PositionAnnotation;
  linkJournalEntry: (positionId: string, journalEntryId: string) => void;
  getPosition: (id: string) => Position | null;

  // Hypothetical projects
  addProject: (project: HypotheticalProject) => void;
  updateProject: (id: string, patch: Partial<HypotheticalProject>) => void;
  recordProjectPerformance: (
    id: string,
    snapshot: ProjectPerformanceSnapshot,
  ) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => HypotheticalProject | null;

  clearAll: () => void;
}

export const useSandboxStore = create<SandboxState>()(
  persist(
    (set, get) => ({
      positions: [],
      projects: [],

      // ─── Positions ────────────────────────────────────────────
      addPosition: (input) => {
        const entry = buildPosition(input);
        set((s) => ({ positions: [entry, ...s.positions] }));
        return entry;
      },

      updatePosition: (id, patch) =>
        set((s) => ({
          positions: s.positions.map((p) =>
            p.id === id ? { ...p, ...patch } : p,
          ),
        })),

      closePosition: (id, exitLMP, realizedPnL) =>
        set((s) => ({
          positions: s.positions.map((p) =>
            p.id === id ? applyClosePosition(p, exitLMP, realizedPnL) : p,
          ),
        })),

      deletePosition: (id) =>
        set((s) => ({
          positions: s.positions.filter((p) => p.id !== id),
        })),

      attachAnnotation: (positionId, note) => {
        const annotation: PositionAnnotation = {
          id: makeId('ann'),
          addedAt: new Date().toISOString(),
          note,
        };
        set((s) => ({
          positions: s.positions.map((p) =>
            p.id === positionId
              ? { ...p, annotations: [...p.annotations, annotation] }
              : p,
          ),
        }));
        return annotation;
      },

      linkJournalEntry: (positionId, journalEntryId) =>
        set((s) => ({
          positions: s.positions.map((p) =>
            p.id === positionId ? { ...p, journalEntryId } : p,
          ),
        })),

      getPosition: (id) => get().positions.find((p) => p.id === id) ?? null,

      // ─── Projects ─────────────────────────────────────────────
      addProject: (project) =>
        set((s) => ({ projects: [project, ...s.projects] })),

      updateProject: (id, patch) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id ? { ...p, ...patch } : p,
          ),
        })),

      recordProjectPerformance: (id, snapshot) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id ? { ...p, performance: snapshot } : p,
          ),
        })),

      deleteProject: (id) =>
        set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),

      getProject: (id) => get().projects.find((p) => p.id === id) ?? null,

      clearAll: () => set({ positions: [], projects: [] }),
    }),
    {
      name: 'gridalpha-sandbox',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
