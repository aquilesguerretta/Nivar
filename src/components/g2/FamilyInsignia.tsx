import './family-insignia.css';

export type FamilyInsigniaName = 'intelligence' | 'advisory' | 'academy' | 'software' | 'hardware';

/** Original G2.3.1 compact masters. Patrons and the NIVAR wordmark are separate assets. */
const MARKS: Record<FamilyInsigniaName, { name: string; paths: readonly string[] }> = {
  intelligence: {
    name: "Argos · Campo registrado",
    paths: [
      "M16 8C26 11 28 17 23 23C20 27 15 29 9 29L12 17V13H18Z",
      "M10 3L13 10L5 29H3V3Z",
    ],
  },
  advisory: {
    name: "Sócrates · Contraprova",
    paths: [
      "M3 3H16C16 9 10 10 10 16C10 22 16 23 16 29H3Z",
      "M29 6H25C19 6 16 12 18 17C22 19 22 23 22 28H29Z",
    ],
  },
  academy: {
    name: "Perseu · Matriz e passagem",
    paths: [
      "M3 10L11 4L20 9V13L16 16L18 22L22 24L20 28H9L3 23Z",
      "M26 11L29 10L31 14L28 22L24 20L22 14Z",
    ],
  },
  software: {
    name: "Ariadne · Registro convergente",
    paths: [
      "M4 4H10C15 4 17 10 23 10H28V28H4V23C14 23 16 24 23 24V20C14 20 13 18 4 18V13C12 13 15 16 23 16V12C15 12 13 9 4 9Z",
    ],
  },
  hardware: {
    name: "Hefesto · Esquadro e padrão",
    paths: [
      "M3 28L12 4H18L11 22H22V16H28V28Z",
      "M22 4H28V10H22Z",
    ],
  },
};

export function FamilyInsignia({
  family,
  size = 24,
  className = '',
  decorative = false,
}: {
  family: FamilyInsigniaName;
  size?: number;
  className?: string;
  decorative?: boolean;
}) {
  const mark = MARKS[family];
  return (
    <svg
      className={`g231-family-insignia ${className}`}
      data-family={family}
      data-insignia="g231-reading-marks"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="currentColor"
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : mark.name}
      aria-hidden={decorative || undefined}
      focusable="false"
    >
      {mark.paths.map((d) => <path key={d} d={d} fillRule="evenodd" />)}
    </svg>
  );
}
