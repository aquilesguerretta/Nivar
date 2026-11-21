export const solarPv = "technology:solar-pv";
export const tandem = "variant:solar-pv:tandem:perovskite-silicon";
export const topcon = "variant:solar-pv:c-si:topcon";

export type SourceId = `source:${string}`;
export type DocumentId = `document:frontier:${string}`;
export type ObservationId = `observation:frontier:${string}`;
export type MilestoneId = `milestone:frontier:${string}`;
export type DeviceId = `device:frontier:${string}`;
export type EvidenceRef = Readonly<{ documentId: DocumentId; version: string; locator: string }>;

export type Device = Readonly<{
  id: DeviceId;
  kind: "research-cell" | "prototype-module" | "mini-tandem" | "field-system";
  terminals: 2 | 4 | null;
  silicon: "TOPCon" | "HJT" | null;
  description: string;
}>;

export type Metric = Readonly<{
  kind: "pce" | "max-power" | "relative-pce-loss" | "installed-module-count";
  value: number;
  digits: number;
  uncertainty: number | null;
  denominator: string;
}>;

export type TestSetup =
  | Readonly<{
    regime: "stc";
    spectrum: "AM1.5G";
    irradiance: 1000;
    temperature: 25;
    protocol: "stabilized-mpp" | "iv-sweep" | null;
    details: string;
  }>
  | Readonly<{ regime: "outdoor" | "installation"; details: string }>
  | null;

export type Observation = Readonly<{
  id: ObservationId;
  subject: DeviceId;
  version: string;
  previousVersion?: string;
  // Date of the supporting publication, distinct from measurement and first-known dates.
  publishedOn: string;
  observedPeriod: string | null;
  knownOn: string | null;
  authority: "external-lab" | "research-team" | "project-announcement" | "host-and-issuer";
  reporter: string;
  measurer: string | null;
  area: Readonly<{
    basis: "designated-illumination" | "active" | "nominal-active" | "external-dimensions";
    description: string;
  }> | null;
  setup: TestSetup;
  metrics: readonly [Metric, ...Metric[]];
  limitations: string;
  evidence: readonly [EvidenceRef, ...EvidenceRef[]];
}>;

export type Milestone = Readonly<{
  id: MilestoneId;
  title: string;
  variant: typeof tandem;
  device: Device;
  reachedBy: string;
  versions: readonly [Observation, ...Observation[]];
  nextEvidence: string;
}>;
