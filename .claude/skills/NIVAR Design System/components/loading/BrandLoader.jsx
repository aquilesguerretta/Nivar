import React from 'react';

/** Geometria estática do N da casa — idêntica a assets/marks/nivar-casa.svg. Nunca anima `d`. */
export const PATH_N = 'M24 84 C24 62 24 38 24 16 C50 32 50 68 76 84 C76 62 76 38 76 16';

export function BrandLoader({ size = 64, legenda, className = '' }) {
  return (
    <div className={('nv-loader ' + className).trim()} role="status" aria-live="polite">
      <svg className="nv-loader__marca" width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <linearGradient id="nivar-loader-grad" gradientUnits="userSpaceOnUse" x1="24" y1="0" x2="76" y2="0">
            <stop offset="0%" stopColor="#7A1F0D" />
            <stop offset="50%" stopColor="#C17D1F" />
            <stop offset="100%" stopColor="#F5C63C" />
          </linearGradient>
          <style>{`
      @keyframes nivar-colapsa-forma {
        0%   { transform: scale(0.12) rotate(0deg); }
        45%  { transform: scale(1) rotate(360deg); }
        58%  { transform: scale(1) rotate(360deg); }
        100% { transform: scale(0.12) rotate(720deg); }
      }
      .nivar-loader-nucleo {
        transform-box: fill-box;
        transform-origin: center;
        animation: nivar-colapsa-forma 3.4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
    `}</style>
        </defs>
        <path
          className="nivar-loader-nucleo"
          fill="none"
          stroke="url(#nivar-loader-grad)"
          strokeWidth="11"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          vectorEffect="non-scaling-stroke"
          d={PATH_N}
        />
      </svg>
      {legenda ? <span className="nv-loader__legenda">{legenda}</span> : null}
    </div>
  );
}
