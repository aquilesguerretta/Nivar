/** A completed request may publish only into its original visible selection. */
export class DeskSelection {
  private context = "";
  private revision = 0;
  select(context: string) {
    if (context !== this.context) {
      this.context = context;
      this.revision++;
    }
  }
  capture() {
    const revision = this.revision,
      context = this.context;
    return () => revision === this.revision && context === this.context;
  }
}

type MappingShape = {
  sheet: string;
  mapping: Record<string, string>;
  numericMode: string;
  manualRows: unknown[];
  reviewMode?: string;
  defaults?: Record<string, string>;
};
export function sameInterpretation(a: MappingShape, b: MappingShape) {
  const key = (m: MappingShape) =>
    JSON.stringify([
      m.sheet,
      Object.entries(m.mapping).sort(),
      m.numericMode,
      m.manualRows,
      m.reviewMode || "table",
      Object.entries(m.defaults || {}).sort(),
    ]);
  return key(a) === key(b);
}
export function reviewedSelection(
  rows: { index: number; errors: string[] }[],
  mapping: MappingShape,
  confirmation?:
    (MappingShape & { rows: { index: number; eligible?: boolean }[] }) | null,
) {
  const preserved =
    confirmation && sameInterpretation(mapping, confirmation)
      ? new Set(confirmation.rows.filter((r) => r.eligible).map((r) => r.index))
      : null;
  return rows
    .filter((r) => !r.errors.length && (!preserved || preserved.has(r.index)))
    .map((r) => r.index);
}
