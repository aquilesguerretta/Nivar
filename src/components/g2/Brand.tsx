import { FamilyInsignia, type FamilyInsigniaName } from "./FamilyInsignia";
import "./insignia-context.css";

/** G2.3 Interval optical: authored outlines; no font or bitmap dependency. */
export function Wordmark({
  height = 26,
  className = "",
}: {
  height?: number;
  className?: string;
}) {
  return (
    <svg
      className={`g2-wordmark ${className}`}
      width={height * (333 / 80)}
      height={height}
      viewBox="0 0 333 80"
      fill="none"
      role="img"
      aria-label="NIVAR"
    >
      <g fill="currentColor" fillRule="evenodd">
        <path d="M0 76V4h13l39 50V4h13v72H52L13 26v50z" />
        <path d="M81 4h13v72H81z" />
        <path d="M108 4h14l22 54 22-54h14l-30 72h-12z" />
        <path d={height <= 18
          ? "M180 76l29-72h13l29 72h-14l-7-18h-25l5-12h16l-11-27-22 57z"
          : "M180 76l29-72h13l29 72h-14l-7-18h-29l4-11h21l-11-28-22 57z"} />
        <path d="M265 76V4h31c23 0 34 10 34 25 0 12-7 20-19 23l22 24h-17l-29-34h9c15 0 21-4 21-13s-6-14-21-14h-18v61z" />
      </g>
    </svg>
  );
}

/** Large patrons and compact insignias are complementary identity layers. */
const EMBLEMS: Record<string, { file: string; name: string; verb: string; index: string }> = {
  intelligence: { file: "argos", name: "Argos", verb: "Observar", index: "01" },
  advisory: { file: "socrates", name: "Sócrates", verb: "Questionar", index: "02" },
  academy: { file: "perseu", name: "Perseu", verb: "Transmitir", index: "03" },
  software: { file: "ariadne", name: "Ariadne", verb: "Organizar", index: "04" },
  hardware: { file: "hefesto", name: "Hefesto", verb: "Medir e construir", index: "05" },
  house: { file: "diogenes", name: "Diógenes", verb: "Procurar", index: "N" },
};
export type FamilyEmblemVariant = "micro" | "standard" | "hero";

export function FamilyEmblem({
  family,
  size = 48,
  variant = size <= 28 ? "micro" : size >= 200 ? "hero" : "standard",
  className = "",
  decorative = false,
}: {
  family: string;
  size?: number;
  variant?: FamilyEmblemVariant;
  className?: string;
  decorative?: boolean;
}) {
  const emblem = EMBLEMS[family] ?? EMBLEMS.house;
  const label = `${emblem.name} · ${emblem.verb}`;
  if (variant !== "hero" && family in EMBLEMS && family !== "house") {
    return <FamilyInsignia family={family as FamilyInsigniaName} size={size} className={className} decorative={decorative} />;
  }
  if (variant !== "hero") {
    return <span className={`g23-family-index ${className}`} data-family={family}
      aria-label={decorative ? undefined : `${emblem.index} / ${label}`} aria-hidden={decorative || undefined}>
      {emblem.index}
    </span>;
  }
  return (
    <img
      className={`g2-emblem g2-emblem--hero ${className}`}
      data-emblem-variant="hero"
      src={`/g2/g21/emblems/${emblem.file}-hero-600.webp`}
      srcSet={`/g2/g21/emblems/${emblem.file}-hero-600.webp 600w, /g2/g21/emblems/${emblem.file}-hero-1200.webp 1200w`}
      sizes={`${size}px`}
      width={size}
      height={size}
      alt={decorative ? "" : label}
      aria-hidden={decorative || undefined}
      loading="lazy"
      decoding="async"
    />
  );
}
