// FORGE Wave 6 — Query scheduler.
//
// Pure scheduling logic — given a SavedQuery's last-run timestamp and
// its schedule kind, decide whether a re-run is due. Caller (the
// ScheduledQueryRunner UI) ticks this once a minute and fires
// `executeQuery` for any due queries.

import type { SavedQuery, ScheduleKind } from './types';

/**
 * Return true when the query is due to re-run. `nowMs` is parameterized
 * so tests can advance a virtual clock; defaults to Date.now().
 */
export function isDue(query: SavedQuery, nowMs: number = Date.now()): boolean {
  if (query.schedule === 'none') return false;
  // First-run case: any non-`none` schedule is due immediately.
  if (!query.lastRunAt) return true;

  const lastMs = Date.parse(query.lastRunAt);
  if (!Number.isFinite(lastMs)) return true;
  const elapsedMs = nowMs - lastMs;

  const now = new Date(nowMs);
  const last = new Date(lastMs);

  switch (query.schedule) {
    case 'hourly':
      // Re-run after at least 60 minutes have elapsed.
      return elapsedMs >= 60 * 60_000;
    case 'daily-8am':
      // Re-run at 8 AM local if last run was on a different calendar day.
      return now.getHours() >= 8 && (
        now.getFullYear() !== last.getFullYear() ||
        now.getMonth() !== last.getMonth() ||
        now.getDate() !== last.getDate()
      );
    case 'weekly-monday':
      // Re-run on Monday after 8 AM if last run was more than 6 days ago
      // OR on a different ISO week.
      return now.getDay() === 1 && now.getHours() >= 8 &&
        elapsedMs >= 6 * 86400_000;
    case 'monthly-1st':
      return now.getDate() === 1 &&
        (now.getMonth() !== last.getMonth() || now.getFullYear() !== last.getFullYear());
    default:
      return false;
  }
}

/**
 * Filter a list of saved queries to just those due to run now.
 */
export function dueQueries(queries: SavedQuery[], nowMs: number = Date.now()): SavedQuery[] {
  return queries.filter((q) => isDue(q, nowMs));
}

/**
 * Next-run human-readable label, e.g. "in 2h 14m" or "in 3 days".
 * Returns null when there's no schedule.
 */
export function nextRunIn(query: SavedQuery, nowMs: number = Date.now()): string | null {
  if (query.schedule === 'none') return null;
  const next = nextRunAtMs(query, nowMs);
  if (next === null) return 'soon';
  const deltaMs = next - nowMs;
  if (deltaMs <= 0) return 'now';
  const minutes = Math.round(deltaMs / 60_000);
  if (minutes < 60) return `in ${minutes}m`;
  const hours = Math.round(deltaMs / 3_600_000);
  if (hours < 48) return `in ${hours}h`;
  const days = Math.round(deltaMs / 86_400_000);
  return `in ${days}d`;
}

function nextRunAtMs(query: SavedQuery, nowMs: number): number | null {
  switch (query.schedule) {
    case 'none':
      return null;
    case 'hourly': {
      if (!query.lastRunAt) return nowMs;
      const last = Date.parse(query.lastRunAt);
      return last + 60 * 60_000;
    }
    case 'daily-8am': {
      const today8am = new Date(nowMs);
      today8am.setHours(8, 0, 0, 0);
      if (today8am.getTime() <= nowMs) {
        // Move to tomorrow 8 AM.
        today8am.setDate(today8am.getDate() + 1);
      }
      return today8am.getTime();
    }
    case 'weekly-monday': {
      const next = new Date(nowMs);
      const dow = next.getDay(); // 0 = Sun, 1 = Mon
      const daysUntilMon = dow === 1 ? (next.getHours() >= 8 ? 7 : 0) : (8 - dow) % 7;
      next.setDate(next.getDate() + daysUntilMon);
      next.setHours(8, 0, 0, 0);
      return next.getTime();
    }
    case 'monthly-1st': {
      const next = new Date(nowMs);
      if (next.getDate() === 1 && next.getHours() < 8) {
        next.setHours(8, 0, 0, 0);
        return next.getTime();
      }
      next.setMonth(next.getMonth() + 1, 1);
      next.setHours(8, 0, 0, 0);
      return next.getTime();
    }
    default:
      return null;
  }
}

export type { ScheduleKind };
