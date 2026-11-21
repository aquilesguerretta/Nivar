// ATLAS Wave 5 — useBatteryAssets hook.
//
// Mirror of useGenerationUnits for the battery-storage layer. The
// fetcher returns server-side aggregates (totalMw, totalMwh) so the
// intel panel can render them without an extra client-side reduce.

import { useEffect, useRef, useState } from 'react';
import {
  fetchBatteryAssets,
  type BatteryAssetsQuery,
} from '@/services/api/batteries';
import type { BatteryAsset } from '@/lib/types/infrastructure';

export interface UseBatteryAssetsState {
  data: BatteryAsset[];
  loading: boolean;
  live: boolean;
  count: number;
  truncated: boolean;
  totalMw: number;
  totalMwh: number;
}

const EMPTY: UseBatteryAssetsState = {
  data: [],
  loading: false,
  live: false,
  count: 0,
  truncated: false,
  totalMw: 0,
  totalMwh: 0,
};

export function useBatteryAssets(query: BatteryAssetsQuery | null): UseBatteryAssetsState {
  const [state, setState] = useState<UseBatteryAssetsState>(EMPTY);
  const lastReqId = useRef(0);

  const cacheKey = query ? JSON.stringify(query) : null;

  useEffect(() => {
    if (!query) { setState(EMPTY); return; }
    const reqId = ++lastReqId.current;
    setState((prev) => ({ ...prev, loading: true }));

    const controller = new AbortController();
    fetchBatteryAssets(query, controller.signal)
      .then((r) => {
        if (reqId !== lastReqId.current) return;
        setState({
          data:      r.data,
          loading:   false,
          live:      r.live,
          count:     r.count,
          truncated: r.truncated,
          totalMw:   r.totalMw,
          totalMwh:  r.totalMwh,
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
