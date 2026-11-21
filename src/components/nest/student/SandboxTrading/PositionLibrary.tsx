// FORGE Wave 7 — Position library.
//
// Two-section list: open positions on top (active mark-to-market),
// closed positions below (settled realized PnL). Each card shows the
// position's zone-direction-size summary, entry / mark prices, and
// PnL with the standard green/red color treatment.
//
// Card click → open the row's annotations + journal stub controls
// (delegated to props so PositionLibrary stays focused on the list).

import { useMemo } from 'react';
import { C, F, R, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import { EditorialIdentity } from '@/components/terminal/EditorialIdentity';
import { useSandboxStore } from '@/lib/sandbox/positionState';
import type { Position } from '@/lib/sandbox/types';
import {
  MarkToMarketEngine,
  PositionSummaryLine,
} from './MarkToMarketEngine';

interface Props {
  onSelect: (positionId: string) => void;
  selectedPositionId: string | null;
  /** Caller-supplied mark cache update — lets the portfolio overview
   *  reuse the marks the engine computed for each open position. */
  onMark?: (positionId: string, pnlUSD: number, markPrice: number) => void;
}

export function PositionLibrary({ onSelect, selectedPositionId, onMark }: Props) {
  const positions = useSandboxStore((s) => s.positions);

  const { open, closed } = useMemo(() => {
    const open: Position[] = [];
    const closed: Position[] = [];
    for (const p of positions) {
      (p.status === 'open' ? open : closed).push(p);
    }
    closed.sort((a, b) =>
      (b.exitAt ?? b.createdAt).localeCompare(a.exitAt ?? a.createdAt),
    );
    open.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return { open, closed };
  }, [positions]);

  if (positions.length === 0) {
    return (
      <ContainedCard padding={S.xxl}>
        <div
          style={{
            textAlign: 'center',
            fontFamily: F.sans,
            fontSize: 14,
            color: C.textMuted,
            lineHeight: 1.6,
          }}
        >
          No positions yet. Place your first paper trade to start the journal.
        </div>
      </ContainedCard>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S.lg }}>
      <SectionGroup
        eyebrow={`OPEN · ${open.length}`}
        identity="In flight."
        positions={open}
        emptyHint="No open positions."
        onSelect={onSelect}
        selectedPositionId={selectedPositionId}
        onMark={onMark}
      />

      <SectionGroup
        eyebrow={`CLOSED · ${closed.length}`}
        identity="Settled."
        positions={closed}
        emptyHint="Closed positions appear here once the hold period elapses."
        onSelect={onSelect}
        selectedPositionId={selectedPositionId}
      />
    </div>
  );
}

interface GroupProps {
  eyebrow: string;
  identity: string;
  positions: Position[];
  emptyHint: string;
  onSelect: (positionId: string) => void;
  selectedPositionId: string | null;
  onMark?: (positionId: string, pnlUSD: number, markPrice: number) => void;
}

function SectionGroup({
  eyebrow,
  identity,
  positions,
  emptyHint,
  onSelect,
  selectedPositionId,
  onMark,
}: GroupProps) {
  return (
    <div>
      <div style={{ marginBottom: S.sm }}>
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: C.electricBlueLight,
          }}
        >
          {eyebrow}
        </div>
        <EditorialIdentity size="section">{identity}</EditorialIdentity>
      </div>

      {positions.length === 0 ? (
        <div
          style={{
            padding: S.lg,
            fontFamily: F.sans,
            fontSize: 13,
            color: C.textMuted,
            fontStyle: 'italic',
            border: `1px dashed ${C.borderDefault}`,
            borderRadius: R.md,
          }}
        >
          {emptyHint}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
          {positions.map((p) => (
            <PositionCard
              key={p.id}
              position={p}
              isSelected={p.id === selectedPositionId}
              onSelect={() => onSelect(p.id)}
              onMark={onMark}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PositionCard({
  position,
  isSelected,
  onSelect,
  onMark,
}: {
  position: Position;
  isSelected: boolean;
  onSelect: () => void;
  onMark?: (positionId: string, pnlUSD: number, markPrice: number) => void;
}) {
  const borderColor = isSelected ? C.electricBlue : C.borderDefault;

  return (
    <div
      onClick={onSelect}
      style={{
        background: C.bgSurface,
        border: `1px solid ${borderColor}`,
        borderRadius: R.md,
        padding: S.md,
        display: 'flex',
        flexDirection: 'column',
        gap: S.sm,
        cursor: 'pointer',
        transition: 'border-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Header row — zone + status pill + PnL */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: S.md,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: S.sm,
            }}
          >
            <span
              style={{
                fontFamily: F.mono,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.10em',
                color: C.textPrimary,
              }}
            >
              {position.zone}
            </span>
            <StatusPill status={position.status} />
          </div>
          <PositionSummaryLine position={position} />
        </div>

        <MarkToMarketEngine position={position} onMark={onMark} />
      </div>

      {/* Footer row — date, hour, reasoning preview */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: S.md,
          paddingTop: S.sm,
          borderTop: `1px solid ${C.borderDefault}`,
        }}
      >
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.10em',
            color: C.textMuted,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {position.entryDate} ·{' '}
          {String(position.entryHour).padStart(2, '0')}:00 →{' '}
          {String((position.entryHour + position.holdHours) % 24).padStart(
            2,
            '0',
          )}
          :00
        </div>
        {position.reasoning ? (
          <div
            style={{
              fontFamily: F.sans,
              fontSize: 12,
              color: C.textSecondary,
              fontStyle: 'italic',
              maxWidth: 320,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={position.reasoning}
          >
            "{position.reasoning}"
          </div>
        ) : (
          <div
            style={{
              fontFamily: F.mono,
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              color: C.textMuted,
            }}
          >
            NO REASONING
          </div>
        )}
      </div>

      {/* Annotations + journal-link surfaced when selected */}
      {position.annotations.length > 0 && (
        <div
          style={{
            paddingTop: S.sm,
            borderTop: `1px dashed ${C.borderDefault}`,
            display: 'flex',
            alignItems: 'center',
            gap: S.sm,
            fontFamily: F.mono,
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            color: C.textMuted,
          }}
        >
          <span>{position.annotations.length} ANNOTATION{position.annotations.length === 1 ? '' : 'S'}</span>
          {position.journalEntryId && (
            <span style={{ color: C.electricBlueLight }}>
              · LINKED TO JOURNAL
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: Position['status'] }) {
  const color = status === 'open' ? C.electricBlueLight : C.alertNormal;
  const wash = status === 'open' ? C.electricBlueWash : 'rgba(16,185,129,0.10)';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 6px',
        background: wash,
        border: `1px solid ${color}`,
        borderRadius: R.sm,
        fontFamily: F.mono,
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color,
      }}
    >
      <span
        style={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: color,
        }}
      />
      {status}
    </span>
  );
}
