// FORGE Wave 3 — DA Bid Optimizer main view.
// State machine:
//  - no fleet → render AssetRegistrationForm (initial setup)
//  - fleet + no results + not editing → CTA (READY TO RUN)
//  - editing → AssetRegistrationForm pre-filled
//  - isRunning → loading panel
//  - results + not editing → FleetOverview + AssetDetail in a grid

import { useMemo, useState } from 'react';
import { C, F, R, S } from '@/design/tokens';
import { ContainedCard } from '@/components/terminal/ContainedCard';
import { EditorialIdentity } from '@/components/terminal/EditorialIdentity';
import { Skeleton } from '@/components/terminal/Skeleton';
import { useStorageOptimizer } from '@/hooks/useStorageOptimizer';
import { useDAForecastAllZones } from '@/hooks/data/useDAForecastAllZones';
import { useAncillary } from '@/hooks/data/useAncillary';
import { AssetRegistrationForm } from './AssetRegistrationForm';
import { FleetOverview } from './FleetOverview';
import { AssetDetail } from './AssetDetail';
import type {
  AncillaryService,
  Fleet,
  MarketContext,
} from '@/lib/types/storage';

export function OptimizerView() {
  const {
    fleet,
    results,
    isRunning,
    selectedAssetId,
    run,
    setFleet,
    selectAsset,
    clear,
  } = useStorageOptimizer();

  // Live market data — DA forecast across all zones + ancillary MCPs.
  // Composed into a MarketContext on each render; passed to run().
  const daAll = useDAForecastAllZones();
  const anc = useAncillary('all');

  const liveMarket: MarketContext | undefined = useMemo(() => {
    if (!daAll.data || !anc.data) return undefined;
    const daHourlyLMPByZone: Record<string, number[]> = {};
    for (const [zone, series] of Object.entries(daAll.data)) {
      // Expect 24 hourly entries; coerce defensively.
      const hours = new Array<number>(24).fill(0);
      for (const p of series) {
        if (p.hour >= 0 && p.hour < 24) hours[p.hour] = p.lmp;
      }
      daHourlyLMPByZone[zone] = hours;
    }
    const ancillaryHourlyMCP: Record<AncillaryService, number[]> = {
      'reg-d': new Array<number>(24).fill(anc.data.regulation_d_mcp),
      'reg-a': new Array<number>(24).fill(anc.data.regulation_a_mcp),
      spin: new Array<number>(24).fill(anc.data.spinning_reserve_mcp),
    };
    return {
      daHourlyLMPByZone,
      ancillaryHourlyMCP,
      regulationMileagePayment: anc.data.regulation_mileage_payment,
      asOfDate: new Date().toISOString().slice(0, 10),
    };
  }, [daAll.data, anc.data]);

  const [editing, setEditing] = useState(false);

  function handleFleetSubmit(f: Fleet) {
    setFleet(f);
    setEditing(false);
    setTimeout(() => run(liveMarket), 0);
  }

  const selectedResult = useMemo(() => {
    if (!results || results.perAssetRanking.length === 0) return null;
    if (selectedAssetId) {
      return (
        results.perAssetRanking.find((r) => r.asset.id === selectedAssetId) ??
        results.perAssetRanking[0]
      );
    }
    return results.perAssetRanking[0];
  }, [results, selectedAssetId]);

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
      {/* Header */}
      <div>
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
          03 · STORAGE OPERATOR · DA BID OPTIMIZER
        </div>
        <EditorialIdentity size="hero">
          What's tomorrow's optimal bid for your fleet?
        </EditorialIdentity>
      </div>

      {/* No fleet — registration form */}
      {!fleet && <AssetRegistrationForm onSubmit={handleFleetSubmit} />}

      {/* Editing — pre-filled form */}
      {fleet && editing && (
        <AssetRegistrationForm
          existing={fleet}
          onSubmit={handleFleetSubmit}
        />
      )}

      {/* Fleet set, no results, not editing — CTA */}
      {fleet && !results && !isRunning && !editing && (
        <ContainedCard padding={S.xl}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: S.md,
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                fontFamily: F.mono,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: C.electricBlueLight,
              }}
            >
              READY TO RUN
            </div>
            <EditorialIdentity size="section">
              {fleet.operatorName + '.'}
            </EditorialIdentity>
            <div
              style={{
                fontFamily: F.sans,
                fontSize: 14,
                color: C.textSecondary,
                lineHeight: 1.6,
              }}
            >
              {fleet.assets.length}{' '}
              {fleet.assets.length === 1 ? 'asset' : 'assets'} ·{' '}
              {(
                fleet.assets.reduce((s, a) => s + a.powerKW, 0) / 1000
              ).toFixed(0)}{' '}
              MW total
            </div>
            <button
              type="button"
              onClick={() => run(liveMarket)}
              style={{
                background: C.electricBlue,
                border: 'none',
                borderRadius: R.md,
                padding: `0 ${S.xl}`,
                height: 44,
                fontFamily: F.mono,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: C.textPrimary,
                cursor: 'pointer',
              }}
            >
              RUN OPTIMIZATION →
            </button>
          </div>
        </ContainedCard>
      )}

      {/* Running — CHROMA Wave 4: pulsing dot + status copy + result
          panel skeleton stack matching the FleetOverview / AssetDetail
          shape that's about to land. */}
      {isRunning && (
        <ContainedCard padding={S.xl}>
          <div
            style={{
              display:    'flex',
              alignItems: 'center',
              gap:        S.md,
              marginBottom: S.lg,
            }}
          >
            <span
              aria-hidden
              style={{
                width:        8,
                height:       8,
                borderRadius: '50%',
                background:   C.electricBlue,
                animation:    'ga-connection-reconnect 1.2s ease-in-out infinite',
                flexShrink:   0,
              }}
            />
            <div
              style={{
                fontFamily: F.mono,
                fontSize: 13,
                color: C.electricBlueLight,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
              }}
            >
              Generating bid curves across {fleet?.assets.length ?? 0} assets ×
              3 scenarios…
            </div>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: S.lg,
              alignItems: 'start',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
              <Skeleton.Line width="80%" height={16} label="Loading fleet header" />
              <Skeleton.Block height={120} label="Loading fleet ranking" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
              <Skeleton.Line width="50%" height={18} label="Loading asset header" />
              <Skeleton.Chart height={220} gridLines={4} label="Loading bid curve" />
            </div>
          </div>
        </ContainedCard>
      )}

      {/* Results */}
      {fleet && results && !isRunning && (
        <>
          {/* Toolbar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: S.md,
            }}
          >
            <span
              style={{
                fontFamily: F.mono,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: C.textSecondary,
              }}
            >
              {fleet.operatorName}
            </span>
            <span
              style={{
                fontFamily: F.mono,
                fontSize: 11,
                color: C.textMuted,
                letterSpacing: '0.10em',
              }}
            >
              · {results.perAssetRanking.length}{' '}
              {results.perAssetRanking.length === 1 ? 'ASSET' : 'ASSETS'}{' '}
              OPTIMIZED
            </span>

            <span style={{ marginLeft: 'auto', display: 'flex', gap: S.sm }}>
              <button
                type="button"
                onClick={() => setEditing(true)}
                style={toolbarBtnStyle()}
              >
                EDIT FLEET
              </button>
              <button
                type="button"
                onClick={() => run(liveMarket)}
                style={toolbarBtnStyle()}
              >
                RE-RUN
              </button>
              <button
                type="button"
                onClick={clear}
                style={toolbarBtnStyle(C.alertCritical)}
              >
                CLEAR
              </button>
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: S.lg,
              alignItems: 'start',
            }}
          >
            <FleetOverview
              fleet={fleet}
              result={results}
              selectedAssetId={selectedAssetId}
              onSelectAsset={selectAsset}
            />
            {selectedResult && (
              <AssetDetail
                assetResult={selectedResult}
                fleetResult={results}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

function toolbarBtnStyle(color?: string): React.CSSProperties {
  return {
    background: 'transparent',
    border: `1px solid ${color ?? C.borderDefault}`,
    borderRadius: R.sm,
    padding: '6px 10px',
    fontFamily: F.mono,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: color ?? C.textSecondary,
    cursor: 'pointer',
  };
}
