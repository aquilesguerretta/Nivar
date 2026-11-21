import React, { useState } from 'react';
import { C, F, R, S } from '@/design/tokens';
import { useNewsData, type NewsItem } from '@/hooks/useNewsData';
import VideoDrawer from './VideoDrawer';
import IntelligenceBrief from './IntelligenceBrief';
import ArticleAnalysis from './ArticleAnalysis';
import ArticleReader from './ArticleReader';

function isNewsVideo(item: NewsItem): boolean {
  return (
    item.contentType === 'video'
    || (item.videoId != null && String(item.videoId).length > 0)
  );
}

const SOURCE_COLORS: Record<string, string> = {
  EIA:        '#10B981',
  PJM:        '#06B6D4',
  FERC:       '#F59E0B',
  BLOOMBERG:  '#F59E0B',
  REUTERS:    '#3B82F6',
};

type NewsSource = 'ALL' | 'EIA' | 'PJM' | 'FERC' | 'BLOOMBERG' | 'REUTERS';
type FeedTab    = 'news' | 'market';

const CATEGORIES = [
  'ALL','CONGESTION','PRICE','GENERATION',
  'DISPATCH','WEATHER','REGULATORY','SYSTEM','VIDEO',
];

const ENERGY_TYPES = [
  { id: 'ALL',          label: 'All Energy',   icon: '⚡' },
  { id: 'NATURAL_GAS',  label: 'Natural Gas',  icon: '🔥' },
  { id: 'COAL',         label: 'Coal',         icon: '⬛' },
  { id: 'NUCLEAR',      label: 'Nuclear',      icon: '⚛️' },
  { id: 'WIND',         label: 'Wind',         icon: '💨' },
  { id: 'SOLAR',        label: 'Solar',        icon: '☀️' },
  { id: 'HYDRO',        label: 'Hydro',        icon: '💧' },
  { id: 'BATTERY',      label: 'Battery',      icon: '🔋' },
  { id: 'TRANSMISSION', label: 'Transmission', icon: '🔌' },
];

const ENERGY_TYPE_COLORS: Record<string, string> = {
  NATURAL_GAS:  C.fuelGas,
  COAL:         C.fuelCoal,
  NUCLEAR:      C.fuelNuclear,
  WIND:         C.fuelWind,
  SOLAR:        C.fuelSolar,
  HYDRO:        C.fuelHydro,
  BATTERY:      C.fuelBattery,
  TRANSMISSION: C.electricBlue,
  ALL:          C.electricBlue,
};

interface Props {
  selectedZone:  string | null;
  onZoneClick:   (zoneId: string) => void;
  marketAlerts:  React.ReactNode;
}

export default function PeregrineFullPage({
  selectedZone, onZoneClick, marketAlerts,
}: Props) {
  void selectedZone; void onZoneClick;
  const [feedTab,        setFeedTab]        = useState<FeedTab>('news');
  const [newsSource,     setNewsSource]     = useState<NewsSource>('ALL');
  const [catFilter,      setCatFilter]      = useState('ALL');
  const [videoItem,      setVideoItem]      = useState<NewsItem | null>(null);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [showBrief,      setShowBrief]      = useState(false);
  const [activeArticle,  setActiveArticle]  = useState<NewsItem | null>(null);
  const [energyFilter,   setEnergyFilter]   = useState<string>('ALL');
  const [readerItem,     setReaderItem]     = useState<NewsItem | null>(null);

  const { items: liveNews, loading, error, lastFetch, refetch } =
    useNewsData(newsSource === 'ALL' ? undefined : newsSource);

  const filtered = liveNews.filter(item => {
    const matchSearch = !searchQuery
      || item.title.toLowerCase().includes(searchQuery.toLowerCase())
      || item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = catFilter === 'ALL'
      || (catFilter === 'VIDEO' ? isNewsVideo(item) : item.category === catFilter);
    const matchEnergy = energyFilter === 'ALL'
      || (item.energyTypes ?? []).includes(energyFilter);
    return matchSearch && matchCat && matchEnergy;
  });

  return (
    <div style={{
      height: 'calc(100vh - 64px)', width: '100%',
      background: C.bgBase, display: 'flex',
      flexDirection: 'column', overflow: 'hidden',
    }}>

      {/* Page header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${S.xl} ${S.xl} ${S.lg} ${S.xl}`, flexShrink: 0,
        borderBottom: `1px solid ${C.borderDefault}`,
        background: `linear-gradient(135deg, ${C.bgElevated} 0%, ${C.bgBase} 100%)`,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.xs }}>
          <div style={{
            fontFamily: F.mono, fontSize: '10px', fontWeight: '500',
            letterSpacing: '0.16em', textTransform: 'uppercase' as const,
            color: C.electricBlue, marginBottom: S.xs,
          }}>
            PJM MARKET INTELLIGENCE
          </div>
          <div style={{
            fontFamily: F.mono, fontSize: '26px', fontWeight: '700',
            letterSpacing: '0.04em', textTransform: 'uppercase' as const,
            color: C.textPrimary, lineHeight: 1,
          }}>
            PEREGRINE INTELLIGENCE
          </div>
          <div style={{
            fontFamily: F.sans, fontSize: '13px', fontWeight: '400',
            color: C.textMuted, marginTop: S.xs,
          }}>
            Live market alerts · Official energy intelligence · EIA / PJM / FERC
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: S.md }}>
          <input
            type="text"
            placeholder="Search intelligence..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '260px', background: C.bgSurface,
              border: `1px solid ${C.borderDefault}`,
              borderRadius: R.md, color: C.textPrimary,
              fontFamily: F.sans, fontSize: '13px',
              padding: '8px 14px', outline: 'none',
            }}
          />
          <div style={{
            fontFamily: F.mono, fontSize: '10px', color: C.textMuted,
            letterSpacing: '0.06em', whiteSpace: 'nowrap' as const,
          }}>
            {loading ? 'FETCHING...'
             : lastFetch
               ? `UPDATED ${lastFetch.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
               : ''}
          </div>
          <button onClick={refetch} style={{
            background: 'transparent',
            border: `1px solid ${C.borderDefault}`,
            borderRadius: R.md, color: C.textSecondary,
            fontFamily: F.mono, fontSize: '10px',
            padding: '7px 14px', cursor: 'pointer',
            letterSpacing: '0.08em',
            transition: 'all 150ms ease',
          }}>↻ REFRESH</button>
          <button onClick={() => setShowBrief(true)} style={{
            background: C.electricBlue, border: 'none',
            borderRadius: R.md, color: C.textPrimary,
            fontFamily: F.mono, fontSize: '10px', fontWeight: '600',
            padding: '7px 16px', cursor: 'pointer',
            letterSpacing: '0.10em',
            transition: 'all 150ms ease',
            whiteSpace: 'nowrap' as const,
          }}>⚡ GENERATE REPORT</button>
        </div>
      </div>

      {/* Feed tabs */}
      <div style={{
        display: 'flex', flexShrink: 0,
        borderBottom: `1px solid ${C.borderDefault}`,
        background: C.bgElevated, paddingLeft: S.xl, gap: 0,
      }}>
        {([
          { id: 'news',   label: 'ENERGY INTELLIGENCE', count: filtered.length },
          { id: 'market', label: 'MARKET ALERTS',        count: 7 },
        ] as const).map(tab => (
          <button key={tab.id}
            onClick={() => setFeedTab(tab.id)}
            style={{
              padding: '14px 24px',
              background: 'transparent', border: 'none',
              borderBottom: feedTab === tab.id
                ? `2px solid ${C.electricBlue}`
                : '2px solid transparent',
              color: feedTab === tab.id ? C.textPrimary : C.textMuted,
              fontFamily: F.mono, fontSize: '11px',
              fontWeight: feedTab === tab.id ? '600' : '400',
              letterSpacing: '0.10em',
              cursor: 'pointer',
              transition: 'all 150ms ease',
              display: 'flex', alignItems: 'center', gap: S.sm,
            }}>
            {tab.label}
            <span style={{
              background: feedTab === tab.id ? C.electricBlue : C.bgSurface,
              color: feedTab === tab.id ? C.textPrimary : C.textMuted,
              borderRadius: '10px', padding: '1px 7px',
              fontSize: '10px', fontWeight: '500',
              transition: 'all 150ms ease',
            }}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Body */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>

        {feedTab === 'news' && (
          <>
            {/* Source + category sidebar */}
            <div style={{
              width: '200px', flexShrink: 0,
              borderRight: `1px solid ${C.borderDefault}`,
              padding: `${S.lg} 0`, overflowY: 'auto',
            }}>
              <div style={{
                fontFamily: F.mono, fontSize: '9px', fontWeight: '600',
                color: C.textMuted, letterSpacing: '0.18em',
                textTransform: 'uppercase' as const,
                padding: `${S.sm} ${S.lg}`, marginBottom: S.xs,
                borderLeft: `2px solid ${C.borderDefault}`,
              }}>
                SOURCE
              </div>
              {(['ALL','EIA','PJM','FERC','BLOOMBERG','REUTERS'] as NewsSource[]).map(src => {
                const count = src === 'ALL'
                  ? liveNews.length
                  : liveNews.filter(i => i.source === src).length;
                return (
                  <button key={src}
                    onClick={() => setNewsSource(src)}
                    style={{
                      display: 'flex', alignItems: 'center',
                      gap: S.sm, width: '100%',
                      padding: `10px ${S.lg}`,
                      background: newsSource === src
                        ? 'rgba(255,255,255,0.05)' : 'transparent',
                      border: 'none',
                      borderLeft: newsSource === src
                        ? `2px solid ${SOURCE_COLORS[src] ?? C.electricBlue}`
                        : '2px solid transparent',
                      cursor: 'pointer',
                      textAlign: 'left' as const,
                    }}>
                    {src !== 'ALL' && (
                      <div style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: SOURCE_COLORS[src], flexShrink: 0,
                      }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: F.sans, fontSize: '13px',
                        color: newsSource === src ? C.textPrimary : C.textSecondary,
                        fontWeight: newsSource === src ? '600' : '400' }}>
                        {src === 'ALL' ? 'All Sources' : src}
                      </div>
                      {src !== 'ALL' && (
                        <div style={{ fontFamily: F.sans,
                          fontSize: '10px', color: C.textMuted, marginTop: 2 }}>
                          {src === 'EIA' ? 'Energy data & analysis'
                           : src === 'PJM' ? 'Grid operator notices'
                           : src === 'FERC' ? 'Regulatory orders'
                           : src === 'BLOOMBERG' ? 'Video · markets & energy'
                           : 'Video · world news wire'}
                        </div>
                      )}
                    </div>
                    <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>{count}</span>
                  </button>
                );
              })}

              <div style={{ height: 1, background: C.borderDefault, margin: `${S.lg} 0` }} />

              <div style={{
                fontFamily: F.mono, fontSize: '9px', fontWeight: '600',
                color: C.textMuted, letterSpacing: '0.18em',
                textTransform: 'uppercase' as const,
                padding: `${S.sm} ${S.lg}`, marginBottom: S.xs,
                borderLeft: `2px solid ${C.borderDefault}`,
              }}>
                CATEGORY
              </div>
              {CATEGORIES.map(cat => (
                <button key={cat}
                  onClick={() => setCatFilter(cat)}
                  style={{
                    display: 'block', width: '100%',
                    padding: `${S.xs} ${S.lg}`,
                    background: 'transparent', border: 'none',
                    cursor: 'pointer', textAlign: 'left' as const,
                    fontFamily: F.mono, fontSize: '11px',
                    letterSpacing: '0.08em',
                    color: catFilter === cat ? C.textPrimary : C.textMuted,
                    fontWeight: catFilter === cat ? '600' : '400',
                  }}>
                  {cat}
                </button>
              ))}

              <div style={{ height: 1, background: C.borderDefault, margin: `${S.lg} 0` }} />

              <div style={{
                fontFamily: F.mono, fontSize: '9px', fontWeight: '600',
                color: C.textMuted, letterSpacing: '0.18em',
                textTransform: 'uppercase' as const,
                padding: `${S.sm} ${S.lg}`, marginBottom: S.xs,
                borderLeft: `2px solid ${C.borderDefault}`,
              }}>
                ENERGY TYPE
              </div>
              {ENERGY_TYPES.map(et => {
                const active = energyFilter === et.id;
                const clr = ENERGY_TYPE_COLORS[et.id] ?? C.electricBlue;
                return (
                  <button key={et.id}
                    onClick={() => setEnergyFilter(et.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: S.sm,
                      width: '100%', padding: `${S.xs} ${S.lg}`,
                      background: 'transparent', border: 'none',
                      cursor: 'pointer', textAlign: 'left' as const,
                      fontFamily: F.mono, fontSize: '11px',
                      letterSpacing: '0.08em',
                      color: active ? clr : C.textMuted,
                      fontWeight: active ? '600' : '400',
                    }}>
                    <span style={{ fontSize: '10px' }}>{et.icon}</span>
                    {et.label}
                  </button>
                );
              })}
            </div>

            {/* News list */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {loading && (
                <div style={{ padding: S.xl, textAlign: 'center' as const }}>
                  <div style={{ fontFamily: F.mono, fontSize: '11px',
                    color: C.textMuted, letterSpacing: '0.12em' }}>
                    FETCHING INTELLIGENCE...
                  </div>
                </div>
              )}

              {error && !loading && (
                <div style={{ padding: S.xl }}>
                  <div style={{ fontFamily: F.mono, fontSize: '11px',
                    color: C.alertCritical, marginBottom: S.sm }}>
                    FEED UNAVAILABLE — {error}
                  </div>
                  <div style={{ fontFamily: F.sans,
                    fontSize: '12px', color: C.textMuted }}>
                    Backend deploying or unreachable. Check Railway status.
                  </div>
                </div>
              )}

              {!loading && filtered.map((item, idx) => {
                // Editorial hierarchy — first item is hero, the next stretch
                // is standard, the tail is compact. Critical/high priority
                // items can also be promoted to standard from compact.
                const isHero    = idx === 0;
                const isCompact = idx > 6 && item.priority !== 'CRITICAL' && item.priority !== 'HIGH';
                return (
                <div key={`${item.id}-${idx}`}
                  onClick={() => {
                    if (item.videoId && String(item.videoId).length > 0) setVideoItem(item);
                    else setReaderItem(item);
                  }}
                  style={{
                    display: 'flex', gap: isCompact ? S.lg : S.xl,
                    padding: isHero
                      ? `${S.xl} ${S.xl} ${S.xxl}`
                      : isCompact
                        ? `${S.sm} ${S.xl}`
                        : `${S.lg} ${S.xl}`,
                    borderBottom: `1px solid ${C.borderDefault}`,
                    cursor: 'pointer',
                    transition: 'background 120ms ease',
                    // Hero gets a subtle atmospheric glow over its row only
                    ...(isHero ? {
                      background:
                        'radial-gradient(ellipse 70% 100% at 30% 50%, rgba(255,255,255,0.025) 0%, transparent 70%)',
                    } : {}),
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = isHero
                    ? 'radial-gradient(ellipse 70% 100% at 30% 50%, rgba(255,255,255,0.04) 0%, transparent 70%)'
                    : 'rgba(255,255,255,0.025)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = isHero
                    ? 'radial-gradient(ellipse 70% 100% at 30% 50%, rgba(255,255,255,0.025) 0%, transparent 70%)'
                    : 'transparent'; }}
                >
                  {/* Timestamp + source */}
                  <div style={{ width: isCompact ? '64px' : '80px', flexShrink: 0 }}>
                    <div style={{ fontFamily: F.mono, fontSize: '11px',
                      color: C.textMuted, marginBottom: S.xs,
                      fontVariantNumeric: 'tabular-nums' }}>
                      {item.timeAgo}
                    </div>
                    <div style={{
                      display: 'inline-block', padding: '2px 6px',
                      background: `${SOURCE_COLORS[item.source] ?? C.textMuted}18`,
                      border: `1px solid ${SOURCE_COLORS[item.source] ?? C.textMuted}40`,
                      borderRadius: '3px', fontFamily: F.mono, fontSize: '8px',
                      fontWeight: '600', color: SOURCE_COLORS[item.source] ?? C.textMuted,
                      letterSpacing: '0.10em',
                    }}>
                      {item.source}
                    </div>
                    {isNewsVideo(item) && (
                      <div style={{ marginTop: S.xs, fontFamily: F.mono,
                        fontSize: '8px', color: C.alertCritical,
                        letterSpacing: '0.08em' }}>
                        ▶ VIDEO
                      </div>
                    )}
                  </div>

                  {/* Headline + summary + category */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: isHero ? F.display : F.sans,
                      fontSize: isHero ? '32px' : isCompact ? '13px' : '15px',
                      fontWeight: isHero ? '400' : '500',
                      letterSpacing: isHero ? '-0.01em' : 'normal',
                      color: isCompact ? C.textSecondary : C.textPrimary,
                      lineHeight: isHero ? 1.15 : 1.4,
                      marginBottom: isCompact ? 0 : S.sm,
                    }}>
                      {item.title}
                    </div>
                    {item.summary && !isCompact && (
                      <div style={{ fontFamily: F.sans,
                        fontSize: isHero ? '16px' : '13px',
                        color: C.textSecondary,
                        lineHeight: isHero ? 1.6 : 1.65,
                        marginBottom: S.sm,
                        maxWidth: isHero ? 720 : 'none' }}>
                        {item.summary}
                      </div>
                    )}
                    <span style={{
                      padding: '1px 5px',
                      background: `${C.electricBlue}12`,
                      border: `1px solid ${C.electricBlue}30`,
                      borderRadius: '3px', fontFamily: F.mono,
                      fontSize: '8px', color: C.electricBlue,
                      letterSpacing: '0.08em',
                    }}>
                      {item.category}
                    </span>
                    {(item.energyTypes ?? []).filter(t => t !== 'GENERAL').slice(0, 2).map(type => (
                      <span key={type} style={{
                        padding: '1px 5px',
                        background: `${ENERGY_TYPE_COLORS[type] ?? C.textMuted}12`,
                        border: `1px solid ${ENERGY_TYPE_COLORS[type] ?? C.textMuted}30`,
                        borderRadius: '3px', fontFamily: F.mono,
                        fontSize: '8px', color: ENERGY_TYPE_COLORS[type] ?? C.textMuted,
                        letterSpacing: '0.08em', marginLeft: S.xs, cursor: 'pointer',
                      }}
                      onClick={(e) => { e.stopPropagation(); setEnergyFilter(type); }}
                      >{type.replace('_', ' ')}</span>
                    ))}
                    {isNewsVideo(item) && (
                      <span style={{
                        padding: '2px 6px', background: 'rgba(239,68,68,0.15)',
                        border: '1px solid rgba(239,68,68,0.40)', borderRadius: '3px',
                        fontFamily: F.mono, fontSize: '8px', fontWeight: '600',
                        color: C.alertCritical, letterSpacing: '0.10em', marginLeft: S.xs,
                      }}>▶ VIDEO</span>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveArticle(item); }}
                      style={{
                        marginLeft: S.sm, padding: '3px 10px', background: 'transparent',
                        border: `1px solid ${C.borderDefault}`, borderRadius: R.sm,
                        color: C.textMuted, fontFamily: F.mono, fontSize: '9px', fontWeight: '500',
                        letterSpacing: '0.10em', cursor: 'pointer', transition: 'all 120ms ease',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.electricBlue; (e.currentTarget as HTMLButtonElement).style.color = C.electricBlue; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.borderDefault; (e.currentTarget as HTMLButtonElement).style.color = C.textMuted; }}
                    >⚡ ASK AI</button>
                  </div>

                  {/* Thumbnail */}
                  <div style={{
                    width: '80px', height: '54px', flexShrink: 0,
                    borderRadius: R.sm, border: `1px solid ${C.borderDefault}`,
                    overflow: 'hidden', background: C.bgSurface,
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', alignSelf: 'flex-start',
                    position: 'relative' as const,
                  }}>
                    {item.thumbnail
                      ? <img src={item.thumbnail} alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: '22px', opacity: 0.3 }}>
                          {item.source === 'PJM' ? '⚡'
                            : item.source === 'EIA' ? '🔋'
                            : item.source === 'FERC' ? '⚖️'
                            : item.source === 'BLOOMBERG' ? '📊'
                            : item.source === 'REUTERS' ? '🌐'
                            : '📡'}
                        </span>
                    }
                    {isNewsVideo(item) && (
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <span style={{ fontSize: '20px' }}>▶</span>
                      </div>
                    )}
                  </div>
                </div>
                );
              })}

              <div style={{ padding: `${S.sm} ${S.xl}`, opacity: 0.4 }}>
                <span style={{ fontFamily: F.sans, fontSize: '10px', color: C.textMuted }}>
                  LIVE · Auto-refreshes every 5 minutes
                </span>
              </div>
            </div>
          </>
        )}

        {feedTab === 'market' && (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {marketAlerts}
          </div>
        )}
      </div>

      {videoItem?.videoId && (
        <VideoDrawer
          videoId={videoItem.videoId}
          title={videoItem.title}
          source={videoItem.source}
          onClose={() => setVideoItem(null)}
        />
      )}

      {showBrief && (
        <IntelligenceBrief
          newsItems={filtered}
          selectedZone={selectedZone}
          onClose={() => setShowBrief(false)}
        />
      )}

      {readerItem && (
        <ArticleReader
          item={readerItem}
          onClose={() => setReaderItem(null)}
          onAskAI={() => {
            setActiveArticle(readerItem);
            setReaderItem(null);
          }}
        />
      )}

      {activeArticle && (
        <ArticleAnalysis
          item={activeArticle}
          onClose={() => setActiveArticle(null)}
        />
      )}
    </div>
  );
}
