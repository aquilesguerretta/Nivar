// ATLAS Wave 5 — useTransmissionSegments hook.
//
// Mirror of useGenerationUnits but for transmission segments — bbox-
// driven viewport fetch with LOD passed through to the backend.
// Same request-id stale guard so a fresh fetch landing first wins.

import { useEffect, useRef, useState } from 'react';
import {
  fetchTransmissionSegments,
  type TransmissionSegmentsQuery,
} from '@/services/api/transmission';
import type { TransmissionSegment, LodLevel } from '@/lib/types/infrastructure';

export interface UseTransmissionSegmentsState {
  data: TransmissionSegment[];
  loading: boolean;
  live: boolean;
  count: number;
  truncated: boolean;
  /** LOD echoed from the response — useful when the backend coerces a request. */
  lod: LodLevel | null;
}

const EMPTY: UseTransmissionSegmentsState = {
  data: [],
  loading: false,
  live: false,
  count: 0,
  truncated: false,
  lod: null,
};

export function useTransmissionSegments(
  query: TransmissionSegmentsQuery | null,
): UseTransmissionSegmentsState {
  const [state, setState] = useState<UseTransmissionSegmentsState>(EMPTY);
  const lastReqId = useRef(0);

  const cacheKey = query ? JSON.stringify(query) : null;

  useEffect(() => {
    if (!query) { setState(EMPTY); return; }
    const reqId = ++lastReqId.current;
    setState((prev) => ({ ...prev, loading: true }));

    const controller = new AbortController();
    fetchTransmissionSegments(query, controller.signal)
      .then((r) => {
        if (reqId !== lastReqId.current) return;
        setState({
          data:      r.data,
          loading:   false,
          live:      r.live,
          count:     r.count,
          truncated: r.truncated,
          lod:       r.lod,
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
