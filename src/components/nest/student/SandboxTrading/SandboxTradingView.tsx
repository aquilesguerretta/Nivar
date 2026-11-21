// FORGE Wave 7 — Sandbox Trading orchestrator view.
//
// Top-level view embedded under the Student Nest's "SANDBOX TRADING"
// tab. Two-column layout (8/12 + 4/12):
//
//   LEFT  · Portfolio overview hero, performance history line, then
//          the position library beneath. The annotations panel
//          appears below the library when a position is selected.
//   RIGHT · Position entry form, persistent on the right so the
//          student can keep placing positions without scrolling.
//
// Mark cache: PositionLibrary's MarkToMarketEngine pushes per-position
// PnL through `onMark`. We hold the cache in a useState ref so
// PortfolioOverview can roll up unrealized PnL without re-fetching.

import { useCallback, useEffect, useState } from 'react';
import { C, F, S } from '@/design/tokens';
import { EditorialIdentity } from '@/components/terminal/EditorialIdentity';
import { useSandboxStore } from '@/lib/sandbox/positionState';
import { setSandboxState } from '@/services/contextProviders/studentNestContext';
import type { PositionPnL } from '@/lib/sandbox/types';
import { PortfolioOverview } from './PortfolioOverview';
import { PerformanceHistory } from './PerformanceHistory';
import { PositionEntryForm } from './PositionEntryForm';
import { PositionLibrary } from './PositionLibrary';
import { TradeAnnotations } from './TradeAnnotations';
import { promoteToJournalEntry } from './PaperTradeJournalEntry';

export function SandboxTradingView() {
  const addPosition = useSandboxStore((s) => s.addPosition);
  const positions = useSandboxStore((s) => s.positions);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [markCache, setMarkCache] = useState<Record<string, PositionPnL>>({});

  // Cache new marks as they come in from each card's engine.
  const handleMark = useCallback(
    (positionId: string, pnlUSD: number, markPrice: number) => {
      setMarkCache((prev) => ({
        ...prev,
        [positionId]: {
          positionId,
          pnlUSD,
          markPrice,
          isRealized: false,
          computedAt: new Date().toISOString(),
        },
      }));
    },
    [],
  );

  // Auto-select the most recent open position when none is picked.
  useEffect(() => {
    if (selectedId) return;
    const first = positions.find((p) => p.status === 'open') ?? positions[0];
    if (first) setSelectedId(first.id);
  }, [positions, selectedId]);

  // Bridge state into ORACLE.
  useEffect(() => {
    setSandboxState({
      positions,
      markCache,
      selectedPositionId: selectedId,
    });
    return () => setSandboxState(null);
  }, [positions, markCache, selectedId]);

  const selectedPosition = selectedId
    ? positions.find((p) => p.id === selectedId) ?? null
    : null;

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        padding: S.xl,
        display: 'flex',
        flexDirection: 'column',
        gap: S.lg,
      }}
    >
      <div style={{ marginBottom: S.sm }}>
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: C.electricBlue,
            marginBottom: S.xs,
          }}
        >
          SANDBOX TRADING · PAPER POSITIONS
        </div>
        <EditorialIdentity size="hero">Try a trade.</EditorialIdentity>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: S.lg,
          alignItems: 'start',
        }}
      >
        {/* LEFT */}
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: S.lg }}
        >
          <PortfolioOverview markCache={markCache} />
          <PerformanceHistory onSelectEvent={setSelectedId} />
          <PositionLibrary
            onSelect={setSelectedId}
            selectedPositionId={selectedId}
            onMark={handleMark}
          />
          {selectedPosition && (
            <TradeAnnotations
              position={selectedPosition}
              onPromoteToJournal={() => {
                if (selectedPosition.status === 'closed') {
                  promoteToJournalEntry(selectedPosition);
                }
              }}
            />
          )}
        </div>

        {/* RIGHT — sticky entry form */}
        <div
          style={{
            position: 'sticky',
            top: S.lg,
            display: 'flex',
            flexDirection: 'column',
            gap: S.lg,
          }}
        >
          <PositionEntryForm
            onSubmit={(input) => {
              const entry = addPosition(input);
              setSelectedId(entry.id);
            }}
          />
        </div>
      </div>
    </div>
  );
}
