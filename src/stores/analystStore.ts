// FORGE Wave 6 — Analyst saved queries + reports store.
//
// V1 persists everything to localStorage. A future Cursor backend wave
// can swap the `storage` adapter for a real `/api/analyst/{queries,reports}`
// endpoint without touching consumers — the persist middleware is the
// seam.

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  QueryAST,
  QueryResult,
  Report,
  SavedQuery,
  ScheduleKind,
} from '@/lib/analyst/types';

function makeId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

interface AnalystState {
  savedQueries: SavedQuery[];
  reports: Report[];

  // Saved queries
  addSavedQuery: (input: {
    name: string;
    description?: string;
    tags: string[];
    ast: QueryAST;
    schedule: ScheduleKind;
  }) => SavedQuery;
  updateSavedQuery: (id: string, patch: Partial<SavedQuery>) => void;
  deleteSavedQuery: (id: string) => void;
  recordQueryRun: (id: string, result: QueryResult) => void;
  getSavedQuery: (id: string) => SavedQuery | null;

  // Reports
  createReport: (input: { title: string; templateId?: string; sections?: Report['sections'] }) => Report;
  updateReport: (id: string, patch: Partial<Report>) => void;
  deleteReport: (id: string) => void;
  getReport: (id: string) => Report | null;
}

export const useAnalystStore = create<AnalystState>()(
  persist(
    (set, get) => ({
      savedQueries: [],
      reports: [],

      addSavedQuery: (input) => {
        const now = new Date().toISOString();
        const entry: SavedQuery = {
          id: makeId('sq'),
          name: input.name,
          description: input.description,
          tags: input.tags,
          ast: input.ast,
          schedule: input.schedule,
          lastRunAt: null,
          lastResult: null,
          createdAt: now,
        };
        set((s) => ({ savedQueries: [entry, ...s.savedQueries] }));
        return entry;
      },

      updateSavedQuery: (id, patch) =>
        set((s) => ({
          savedQueries: s.savedQueries.map((q) =>
            q.id === id ? { ...q, ...patch } : q,
          ),
        })),

      deleteSavedQuery: (id) =>
        set((s) => ({
          savedQueries: s.savedQueries.filter((q) => q.id !== id),
        })),

      recordQueryRun: (id, result) =>
        set((s) => ({
          savedQueries: s.savedQueries.map((q) =>
            q.id === id
              ? { ...q, lastRunAt: result.runAt, lastResult: result }
              : q,
          ),
        })),

      getSavedQuery: (id) => get().savedQueries.find((q) => q.id === id) ?? null,

      createReport: (input) => {
        const now = new Date().toISOString();
        const entry: Report = {
          id: makeId('rep'),
          title: input.title,
          authorName: 'GridAlpha Analyst',
          sections: input.sections ?? [],
          createdAt: now,
          updatedAt: now,
          templateId: input.templateId,
        };
        set((s) => ({ reports: [entry, ...s.reports] }));
        return entry;
      },

      updateReport: (id, patch) =>
        set((s) => ({
          reports: s.reports.map((r) =>
            r.id === id
              ? { ...r, ...patch, updatedAt: new Date().toISOString() }
              : r,
          ),
        })),

      deleteReport: (id) =>
        set((s) => ({ reports: s.reports.filter((r) => r.id !== id) })),

      getReport: (id) => get().reports.find((r) => r.id === id) ?? null,
    }),
    {
      name: 'gridalpha-analyst',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
