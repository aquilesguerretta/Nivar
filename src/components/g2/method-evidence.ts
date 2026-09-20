/** One didactic record shared by the film and the inspectable method.
 * It has no relationship to telemetry or to the Terminal's market fixture. */
export const METHOD_SAMPLES = [68, 64, null, 81, null, 108] as const;
export const METHOD_HOURS = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"] as const;
export const METHOD_SOURCE = "EV–001 · Série sintética NIVAR · dia didático · MW";

export function compareMethodSamples(from: number, to: number) {
  const first = METHOD_SAMPLES[from], last = METHOD_SAMPLES[to];
  if (first == null || last == null || from >= to) return null;
  return { change: last - first, percent: (last - first) / first * 100,
    gaps: METHOD_SAMPLES.slice(from, to + 1).filter(value => value === null).length };
}
