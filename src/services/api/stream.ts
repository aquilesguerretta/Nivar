// FORGE Wave 4 — Server-sent events wrapper for `/api/stream`.
// Multi-consumer EventSource subscription. The single underlying
// EventSource is shared across the page; per-zone callbacks and outage
// callbacks fan out from the central event listener. Reconnects with
// exponential backoff on disconnect.

import { MOCK_MODE } from './client';
import { browserApiUrl } from '@/lib/backendBase';
import type {
  HeartbeatStreamUpdate,
  LMPStreamUpdate,
  OutageStreamUpdate,
} from '@/lib/types/api';

export type StreamConnectionStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected';

type LMPCallback = (update: LMPStreamUpdate) => void;
type OutageCallback = (update: OutageStreamUpdate) => void;
type HeartbeatCallback = (update: HeartbeatStreamUpdate) => void;
type StatusCallback = (status: StreamConnectionStatus) => void;

interface StreamRegistry {
  /** Zone → set of callbacks listening for that zone's LMP updates. */
  lmpByZone: Map<string, Set<LMPCallback>>;
  outage: Set<OutageCallback>;
  heartbeat: Set<HeartbeatCallback>;
  status: Set<StatusCallback>;
}

const registry: StreamRegistry = {
  lmpByZone: new Map(),
  outage: new Set(),
  heartbeat: new Set(),
  status: new Set(),
};

let source: EventSource | null = null;
let reconnectAttempts = 0;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let currentStatus: StreamConnectionStatus = 'idle';

function setStatus(next: StreamConnectionStatus): void {
  if (currentStatus === next) return;
  currentStatus = next;
  for (const cb of registry.status) cb(next);
}

function clearReconnectTimer(): void {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}

function scheduleReconnect(): void {
  clearReconnectTimer();
  reconnectAttempts++;
  // Exponential backoff capped at 30s. 1s, 2s, 4s, 8s, 16s, 30s, 30s …
  const delayMs = Math.min(30_000, 1000 * Math.pow(2, reconnectAttempts - 1));
  setStatus('reconnecting');
  reconnectTimer = setTimeout(() => {
    ensureConnection();
  }, delayMs);
}

function totalListeners(): number {
  let n = registry.outage.size + registry.heartbeat.size;
  for (const zoneSet of registry.lmpByZone.values()) n += zoneSet.size;
  return n;
}

function ensureConnection(): void {
  if (MOCK_MODE) {
    // Mock mode: no real SSE. We just hold status at 'connected' so the
    // UI can render the live affordance; consumers receive nothing.
    setStatus('connected');
    return;
  }

  if (totalListeners() === 0) return;
  if (source && source.readyState !== EventSource.CLOSED) return;

  setStatus('connecting');
  try {
    source = new EventSource(browserApiUrl('/api/stream'), {
      withCredentials: false,
    });
  } catch {
    scheduleReconnect();
    return;
  }

  source.onopen = () => {
    reconnectAttempts = 0;
    setStatus('connected');
  };

  source.onerror = () => {
    // EventSource auto-attempts reconnect on transient errors, but the
    // browser doesn't surface anything useful when the server is down.
    // Close and rebuild with our backoff schedule so we have control.
    if (source) {
      source.close();
      source = null;
    }
    scheduleReconnect();
  };

  source.addEventListener('lmp-update', (event) => {
    try {
      const payload = JSON.parse((event as MessageEvent).data) as LMPStreamUpdate;
      const zoneSet = registry.lmpByZone.get(payload.zone);
      if (zoneSet) for (const cb of zoneSet) cb(payload);
    } catch {
      // Ignore malformed frames — the next valid frame recovers state.
    }
  });

  source.addEventListener('outage', (event) => {
    try {
      const payload = JSON.parse((event as MessageEvent).data) as OutageStreamUpdate;
      for (const cb of registry.outage) cb(payload);
    } catch {
      // Ignore.
    }
  });

  source.addEventListener('heartbeat', (event) => {
    try {
      const payload = JSON.parse(
        (event as MessageEvent).data,
      ) as HeartbeatStreamUpdate;
      for (const cb of registry.heartbeat) cb(payload);
    } catch {
      // Ignore.
    }
  });
}

function disconnectIfIdle(): void {
  if (totalListeners() > 0) return;
  clearReconnectTimer();
  if (source) {
    source.close();
    source = null;
  }
  setStatus('disconnected');
}

// ─── Public subscription API ─────────────────────────────────────

export function subscribeLMP(zone: string, cb: LMPCallback): () => void {
  let set = registry.lmpByZone.get(zone);
  if (!set) {
    set = new Set();
    registry.lmpByZone.set(zone, set);
  }
  set.add(cb);
  ensureConnection();
  return () => {
    const inner = registry.lmpByZone.get(zone);
    if (!inner) return;
    inner.delete(cb);
    if (inner.size === 0) registry.lmpByZone.delete(zone);
    disconnectIfIdle();
  };
}

export function subscribeOutages(cb: OutageCallback): () => void {
  registry.outage.add(cb);
  ensureConnection();
  return () => {
    registry.outage.delete(cb);
    disconnectIfIdle();
  };
}

export function subscribeHeartbeat(cb: HeartbeatCallback): () => void {
  registry.heartbeat.add(cb);
  ensureConnection();
  return () => {
    registry.heartbeat.delete(cb);
    disconnectIfIdle();
  };
}

export function subscribeStatus(cb: StatusCallback): () => void {
  registry.status.add(cb);
  // Fire the current status immediately so subscribers get the latest.
  cb(currentStatus);
  return () => {
    registry.status.delete(cb);
  };
}

export function streamStatus(): StreamConnectionStatus {
  return currentStatus;
}
