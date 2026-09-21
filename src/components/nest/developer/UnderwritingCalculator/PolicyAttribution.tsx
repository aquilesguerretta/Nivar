// FORGE Wave 5 — Policy attribution waterfall.
//
// Shows the discounted value contribution of each policy lever to the
// project's equity NPV. Order: base energy → +ITC → +PTC → +capacity →
// total. Each segment is rendered as a horizontal bar with $-labelled
// width, so the reader can see at a glance which policy carries the
// project.

import { C, F, R, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import type { PolicyAttribution as PolicyAttr } from '@/lib/underwriting/types';

interface Props {
  attribution: PolicyAttr;
}

function formatUSD(v: number): string {
  if (!Number.isFinite(v)) return '—';
  const sign = v < 0 ? '−' : '';
  const abs = Math.abs(v);
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}k`;
  return `${sign}$${abs.toFixed(0)}`;
}

interface Segment {
  label: string;
  value: number;
  color: string;
  note: string;
}

export function PolicyAttribution({ attribution }: Props) {
  const total =
    attribution.baseEnergyNPVUSD +
    attribution.itcValueUSD +
    attribution.ptcValueUSD +
    attribution.capacityValueUSD;

  const segments: Segment[] = [
    {
      label: 'BASE ENERGY',
      value: attribution.baseEnergyNPVUSD,
      color: C.electricBlue,
      note: 'Hourly LMP × CF × capacity, net of opex / debt / taxes (pre-policy).',
    },
    {
      label: '+ ITC',
      value: attribution.itcValueUSD,
      color: C.alertNormal,
      note: 'Investment tax credit realized in Year 1, discounted to NPV.',
    },
    {
      label: '+ PTC',
      value: attribution.ptcValueUSD,
      color: C.alertNormal,
      note: 'Production tax credit over Years 1-10 if eligible.',
    },
    {
      label: '+ CAPACITY',
      value: attribution.capacityValueUSD,
      color: C.falconGold,
      note: 'PJM RPM capacity-market payment ($/MW-yr × ELCC), full life.',
    },
  ];

  // Max absolute value for scaling — use total positive span so each
  // segment renders proportionally without crushing small slices.
  const positiveTotal = segments.reduce((s, x) => s + Math.max(0, x.value), 0);
  const maxAbs = Math.max(positiveTotal, Math.abs(total)) || 1;

  return (
    <ContainedCard padding={S.lg}>
      <div
        style={{
          fontFamily: F.mono,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: C.electricBlueLight,
          marginBottom: S.md,
        }}
      >
        POLICY ATTRIBUTION · NPV CONTRIBUTION
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: S.md }}>
        {segments.map((seg) => {
          const widthPct =
            (Math.max(0, seg.value) / maxAbs) * 100;
          return (
            <div key={seg.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  fontFamily: F.mono,
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                <span style={{ color: seg.color, fontWeight: 600 }}>
                  {seg.label}
                </span>
                <span
                  style={{
                    color: seg.value < 0 ? C.alertCritical : C.textPrimary,
                    fontVariantNumeric: 'tabular-nums',
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  {formatUSD(seg.value)}
                </span>
              </div>
              <div
                style={{
                  height: 10,
                  background: C.bgSurface,
                  border: `1px solid ${C.borderDefault}`,
                  borderRadius: R.sm,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${Math.max(2, widthPct)}%`,
                    height: '100%',
                    background:
                      seg.value < 0
                        ? C.alertCritical
                        : seg.color,
                    opacity: seg.value < 0 ? 0.7 : 0.9,
                    transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </div>
              <div
                style={{
                  fontFamily: F.sans,
                  fontSize: 11,
                  color: C.textMuted,
                  lineHeight: 1.5,
                }}
              >
                {seg.note}
              </div>
            </div>
          );
        })}

        {/* Total row */}
        <div
          style={{
            marginTop: S.sm,
            paddingTop: S.sm,
            borderTop: `1px solid ${C.borderDefault}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            fontFamily: F.mono,
            fontSize: 12,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          <span style={{ color: C.textSecondary, fontWeight: 600 }}>
            TOTAL DISCOUNTED EQUITY VALUE
          </span>
          <span
            style={{
              color: total < 0 ? C.alertCritical : C.alertNormal,
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            {formatUSD(total)}
          </span>
        </div>
      </div>
    </ContainedCard>
  );
}
