import type { GameEvidence } from './alexandria-game-types.ts';

const EVIDENCE_KEY = 'alexandria:decision-game-evidence:v1';

export function readGameEvidence(): readonly GameEvidence[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(EVIDENCE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as GameEvidence[] : [];
  } catch {
    return [];
  }
}

export function persistGameEvidence(evidence: GameEvidence): void {
  if (typeof window === 'undefined') return;
  const previous = readGameEvidence();
  window.localStorage.setItem(EVIDENCE_KEY, JSON.stringify([...previous, evidence]));
}
