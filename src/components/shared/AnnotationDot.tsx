import { useState } from 'react';
import { C, F } from '@/design/tokens';

// CONDUIT shared — annotation marker.
// Numbered 20×20 circle absolutely positioned over a chart container at
// normalized 0..100% coordinates. Hover scales it slightly so users see
// it's interactive; clicking surfaces the annotation in the drawer.

interface Props {
  sequence: number;
  /** 0..100 percent within the parent container */
  xPercent: number;
  /** 0..100 percent within the parent container */
  yPercent: number;
  active?: boolean;
  onClick?: () => void;
  title?: string;
}

export function AnnotationDot({
  sequence,
  xPercent,
  yPercent,
  active,
  onClick,
  title,
}: Props) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={title}
      aria-label={title ?? `Annotation ${sequence}`}
      style={{
        position: 'absolute',
        left: `${xPercent}%`,
        top: `${yPercent}%`,
        transform: `translate(-50%, -50%) scale(${hover ? 1.1 : 1})`,
        width: 20,
        height: 20,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: active ? C.electricBlue : 'rgba(59,130,246,0.20)',
        border: `1px solid ${C.electricBlue}`,
        borderRadius: '50%',
        color: active ? C.textPrimary : C.electricBlueLight,
        cursor: 'pointer',
        fontFamily: F.mono,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.04em',
        transition:
          'transform 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: active ? '0 0 0 3px rgba(59,130,246,0.20)' : 'none',
      }}
    >
      {sequence}
    </button>
  );
}
