import { milestones, longiAnnouncement, readiness, deployment } from "./milestones.ts";
import type { EvidenceRef, Metric, Milestone, Observation } from "./model.ts";

export function readMilestone(id: string | null, version?: string | null) {
  const milestone: Milestone | undefined = milestones.find((item) => item.id === id);
  if (!milestone) return undefined;

  const observation = version === undefined || version === null
    ? milestone.versions[0]
    : milestone.versions.find((item) => item.version === version);
  if (!observation || observation.subject !== milestone.device.id) return undefined;
  return { milestone, observation };
}

export function readReadiness(subject: string) {
  return subject === readiness.subject ? readiness : undefined;
}

export function readDeployment(subject: string) {
  return subject === deployment.subject ? deployment : undefined;
}

export function hasTopconRelationship(milestoneId: string) {
  const record = readMilestone(milestoneId);
  return record?.milestone.device.silicon === "TOPCon";
}

export function evidenceFor(observation: Observation): readonly EvidenceRef[] {
  if (observation.subject === readiness.subject) return [...observation.evidence, readiness.evidence];
  return observation.subject === "device:frontier:longi-esti-feb-2026-cell"
    ? [...observation.evidence, longiAnnouncement.evidence]
    : observation.evidence;
}

export function metricValue(metric: Metric) {
  const number = (value: number, digits = 0) => value.toLocaleString("pt-BR", { minimumFractionDigits: digits });
  switch (metric.kind) {
    case "pce":
      return `${number(metric.value, metric.digits)}%${metric.uncertainty === null ? "" : ` ± ${number(metric.uncertainty)} p.p.`}`;
    case "max-power":
      return metric.uncertainty === null
        ? `${number(metric.value)} W`
        : `${number(metric.value)} ± ${number(metric.uncertainty)} W`;
    case "relative-pce-loss":
      return `≈${number(metric.value)}% de redução relativa da PCE`;
    case "installed-module-count":
      return `${number(metric.value)} módulos informados pela Kaneka`;
  }
}

type Comparison = {
  status: "COMPARABLE" | "COMPARABLE_WITH_QUALIFICATION" | "NOT_COMPARABLE" | "UNRESOLVED";
  reason: string;
};

type Reading = NonNullable<ReturnType<typeof readMilestone>>;

export function compareMeasurements(left: Reading, right: Reading): Comparison {
  const a = left.observation;
  const b = right.observation;
  if (left.milestone.device.kind !== right.milestone.device.kind) {
    return { status: "NOT_COMPARABLE", reason: "As escalas de dispositivo são diferentes." };
  }
  if (a.metrics[0].kind !== b.metrics[0].kind || (a.setup && b.setup && a.setup.regime !== b.setup.regime)) {
    return { status: "NOT_COMPARABLE", reason: "As grandezas ou os ambientes de ensaio são diferentes." };
  }
  if (a.authority === "project-announcement" || b.authority === "project-announcement" || !a.setup || !b.setup) {
    return { status: "UNRESOLVED", reason: "O método documentado é insuficiente para comparar desempenho." };
  }
  if (a.id === b.id) {
    return a.version === b.version
      ? { status: "COMPARABLE", reason: "As duas referências resolvem a mesma versão da observação." }
      : { status: "COMPARABLE_WITH_QUALIFICATION", reason: "São publicações da mesma observação, sem uma segunda amostra independente." };
  }
  if (a.area && b.area && a.area.basis !== b.area.basis) {
    return { status: "NOT_COMPARABLE", reason: "As convenções de área são diferentes." };
  }
  if (a.setup.regime === "stc" && b.setup.regime === "stc"
    && a.setup.protocol && b.setup.protocol && a.setup.protocol !== b.setup.protocol) {
    return { status: "NOT_COMPARABLE", reason: "Os protocolos de medição são diferentes." };
  }
  return { status: "UNRESOLVED", reason: "Faltam evidências de equivalência entre áreas, protocolos e amostras." };
}

export function findEvidence(observation: Observation, documentId: string, version: string | null) {
  return evidenceFor(observation).find((ref) => ref.documentId === documentId && ref.version === version);
}
