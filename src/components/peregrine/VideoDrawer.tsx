import { useEffect } from 'react';
import { C, F, R, S } from '@/design/tokens';

interface VideoDrawerProps {
  videoId: string;
  title:   string;
  source:  string;
  onClose: () => void;
}

export default function VideoDrawer({
  videoId, title, source, onClose,
}: VideoDrawerProps) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.75)',
        zIndex: 300, backdropFilter: 'blur(4px)',
      }} />
      <div style={{
        position: 'fixed', top: 64, right: 0, bottom: 0,
        width: '640px', zIndex: 301,
        background: C.bgOverlay,
        borderLeft: `1px solid ${C.borderDefault}`,
        display: 'flex', flexDirection: 'column',
        animation: 'drawerIn 200ms cubic-bezier(0.16,1,0.30,1) forwards',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${S.lg} ${S.xl}`, flexShrink: 0,
          borderBottom: `1px solid ${C.borderDefault}`,
        }}>
          <div>
            <div style={{ fontFamily: F.mono, fontSize: '10px',
              color: C.textMuted, letterSpacing: '0.10em',
              marginBottom: S.xs }}>
              {source}
            </div>
            <div style={{ fontFamily: F.sans,
              fontSize: '13px', fontWeight: '500',
              color: C.textPrimary, lineHeight: 1.4,
              maxWidth: '460px' }}>
              {title}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'transparent',
            border: `1px solid ${C.borderDefault}`,
            borderRadius: R.md, color: C.textSecondary,
            fontFamily: F.mono, fontSize: '10px',
            padding: '6px 12px', cursor: 'pointer',
            flexShrink: 0, marginLeft: S.xl,
            letterSpacing: '0.08em',
          }}>ESC / CLOSE</button>
        </div>
        <div style={{
          position: 'relative', paddingTop: '56.25%',
          flexShrink: 0, background: C.bgBase,
        }}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', border: 'none',
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
            allowFullScreen
          />
        </div>
        <div style={{ flex: 1, padding: S.xl, overflowY: 'auto' }}>
          <div style={{ fontFamily: F.mono, fontSize: '10px',
            color: C.textMuted, letterSpacing: '0.10em',
            marginBottom: S.md }}>
            MORE FROM {source}
          </div>
          <div style={{ fontFamily: F.sans,
            fontSize: '12px', color: C.textMuted, lineHeight: 1.6 }}>
            Related items load when live data is wired.
          </div>
        </div>
      </div>
    </>
  );
}
