// ATLAS Wave 5 — useGenerationUnits hook.
//
// Bbox-driven viewport fetch for the all-US generation layer. Mirrors
// FORGE Wave 4's hook structure (compact, single-purpose, MOCK-aware
// via the underlying service), but uses a request-id stale guard
// instead of useEnvelopeQuery — viewport-scoped queries can race
// each other as the user pans, and a stale response landing after
// a fresher one would corrupt the layer.
//
// Authorized boundary blur: this file lives under src/hooks/data/
// (FORGE territory) per the ATLAS Wave 5 brief. Pattern matches
// FORGE's useLMP.ts exactly — same import order, same return shape
// keys (`data`, `loading`, `live`).

import { useEffect, useRef, useState } from 'react';
import {
  fetchGenerationUnits,
  type GenerationUnitsQuery,
} from '@/services/api/generation';
import type { GenerationUnit } from '@/lib/types/infrastructure';

export interface UseGenerationUnitsState {
  data: GenerationUnit[];
  loading: boolean;
  live: boolean;
  /** Backend-reported total before truncation; matches data.length when not truncated. */
  count: number;
  truncated: boolean;
}

const EMPTY: UseGenerationUnitsState = {
  data: [],
  loading: false,
  live: false,
  count: 0,
  truncated: false,
};

/**
 * Pass `null` to disable the hook (e.g., layer toggled off) — the
 * hook still mounts to keep React's hook order stable but skips
 * the fetch and returns the empty state.
 */
export function useGenerationUnits(query: GenerationUnitsQuery | null): UseGenerationUnitsState {
  const [state, setState] = useState<UseGenerationUnitsState>(EMPTY);
  const lastReqId = useRef(0);

  // Serialize the query to a stable hash so a new bbox tuple identity
  // doesn't refire when the values are unchanged (React useEffect is
  // shallow-equal on deps).
  const cacheKey = query ? JSON.stringify(query) : null;

  useEffect(() => {
    if (!query) { setState(EMPTY); return; }
    const reqId = ++lastReqId.current;
    setState((prev) => ({ ...prev, loading: true }));

    const controller = new AbortController();
    fetchGenerationUnits(query, controller.signal)
      .then((r) => {
        if (reqId !== lastReqId.current) return; // stale response, ignore
        setState({
          data:      r.data,
          loading:   false,
          live:      r.live,
          count:     r.count,
          truncated: r.truncated,
        });
      })
      .catch((err) => {
        if (reqId !== lastReqId.current) return;
        if (err instanceof Error && err.name === 'AbortError') return;
        setState({ ...EMPTY, loading: false });
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey]);

  return state;
}
