import { useState } from 'react';
import { C, F, R } from '@/design/tokens';
import { useAnnotations } from '@/hooks/useAnnotations';
import { AnnotationLayer } from './AnnotationLayer';
import { AnnotationDrawer } from './AnnotationDrawer';

// CONDUIT shared — opt-in wrapper that adds annotation capability to any
// chart without modifying the chart itself. Chart owners (TERMINAL, ATLAS,
// the Trader Nest team, etc.) wrap their existing chart JSX with this
// component and get a numbered-dot overlay, drawer, and toggle button
// for free.
//
// Usage:
//
//   <AnnotatableChart chartId="trader-nest:lmp-24h">
//     <LMP24HChart {...props} />
//   </AnnotatableChart>
//
// `chartId` should follow the pattern "<screen>:<chart-id>" so cross-chart
// features (search, jump-to) can route correctly.

interface Props {
  chartId: string;
  children: React.ReactNode;
  /** Hide the toolbar entirely — useful when the chart container has its
   *  own external controls. The wrapper still mounts the AnnotationLayer
   *  (read-only) so existing dots render. */
  hideToolbar?: boolean;
  /** Optional override for the toolbar position. Default top-right. */
  toolbarPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function AnnotatableChart({
  chartId,
  children,
  hideToolbar,
  toolbarPosition = 'top-right',
}: Props) {
  const { annotations } = useAnnotations(chartId);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDotClick = (id: string) => {
    setActiveId(id);
    setDrawerOpen(true);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {children}
      <AnnotationLayer
        chartId={chartId}
        enabled={addMode}
        onAddDone={() => setAddMode(false)}
        activeId={activeId}
        onDotClick={handleDotClick}
      />
      {!hideToolbar && (
        <Toolbar
          position={toolbarPosition}
          count={annotations.length}
          addMode={addMode}
          onToggleAdd={() => setAddMode((v) => !v)}
          onOpenDrawer={() => setDrawerOpen(true)}
        />
      )}
      <AnnotationDrawer
        chartId={chartId}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setActiveId(null);
        }}
        onRequestAdd={() => {
          setAddMode(true);
          setDrawerOpen(false);
        }}
        activeId={activeId}
        onRowClick={setActiveId}
      />
    </div>
  );
}

interface ToolbarProps {
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  count: number;
  addMode: boolean;
  onToggleAdd: () => void;
  onOpenDrawer: () => void;
}

function Toolbar({
  position,
  count,
  addMode,
  onToggleAdd,
  onOpenDrawer,
}: ToolbarProps) {
  const positionStyle: React.CSSProperties = {
    position: 'absolute',
    ...(position.startsWith('top') ? { top: 8 } : { bottom: 8 }),
    ...(position.endsWith('right') ? { right: 8 } : { left: 8 }),
  };
  return (
    <div
      style={{
        ...positionStyle,
        display: 'flex',
        gap: 4,
        zIndex: 15,
        pointerEvents: 'auto',
      }}
    >
      <ToolbarButton
        label={addMode ? 'Cancel adding' : 'Add annotation'}
        active={addMode}
        onClick={onToggleAdd}
      >
        {addMode ? <CloseIcon /> : <PlusIcon />}
      </ToolbarButton>
      <ToolbarButton
        label={`${count} annotation${count === 1 ? '' : 's'}`}
        onClick={onOpenDrawer}
      >
        <NoteIcon />
        {count > 0 && (
          <span
            style={{
              marginLeft: 4,
              fontFamily: F.mono,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}
          >
            {count}
          </span>
        )}
      </ToolbarButton>
    </div>
  );
}

interface ToolbarButtonProps {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function ToolbarButton({ label, active, onClick, children }: ToolbarButtonProps) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={label}
      title={label}
      style={{
        height: 26,
        minWidth: 26,
        padding: '0 6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: active
          ? C.electricBlue
          : hover
            ? C.bgOverlay
            : C.bgElevated,
        border: `1px solid ${active ? C.electricBlue : C.borderDefault}`,
        borderRadius: R.sm,
        color: active ? C.textPrimary : hover ? C.electricBlue : C.textSecondary,
        cursor: 'pointer',
        transition:
          'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1), border-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </button>
  );
}

function PlusIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function NoteIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="13" y2="17" />
    </svg>
  );
}
