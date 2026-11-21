import { dossierCutoff, type ClaimKey } from "./evidence.ts";

export const field = {
  id: "niv79:asset:mero",
  kind: "Asset",
  assetType: "oil_field",
  name: "Mero",
  location: "Bacia de Santos, Brasil",
  geographyEvidence: "field-operator",
  geometry: null,
} as const;

export const vessel = {
  id: "niv79:asset:marechal-duque-de-caxias",
  kind: "Asset",
  assetType: "fpso",
  name: "Marechal Duque de Caxias",
  fieldRef: field.id,
  associationEvidence: "vessel-roles",
} as const;

type Identifier = { namespace: "br.cnpj" | "us.sec.cik"; value: string; evidence: ClaimKey };

function contractor(id: string, name: string, shortName: string, cnpj: string, cik?: string) {
  const identifiers: Identifier[] = [{ namespace: "br.cnpj", value: cnpj, evidence: "legal-identity" }];
  if (cik) identifiers.push({ namespace: "us.sec.cik", value: cik, evidence: "issuer-identity" });
  return { id: "niv79:entity:" + id, kind: "CorporateEntity" as const, name, shortName, identifiers };
}

export const contractors = {
  petrobras: contractor("petrobras", "Petróleo Brasileiro S.A. — Petrobras", "Petrobras", "33.000.167/0001-01", "0001119639"),
  shell: contractor("shell", "Shell Brasil Petróleo Ltda.", "Shell Brasil", "10.456.016/0001-67"),
  total: contractor("total", "TotalEnergies EP Brasil Ltda.", "TotalEnergies EP Brasil", "02.461.767/0001-43"),
  cnodc: contractor("cnodc", "CNODC Brasil Petróleo e Gás Ltda.", "CNODC Brasil", "19.233.194/0001-01"),
  cnooc: contractor("cnooc", "CNOOC Petroleum Brasil Ltda.", "CNOOC Petroleum Brasil", "19.246.634/0001-57"),
};
export type Contractor = keyof typeof contractors;

export const profile = {
  id: "niv79:profile:petrobras",
  kind: "CompanyProfile",
  name: "Petrobras",
  primaryEntityRef: contractors.petrobras.id,
} as const;

export const union = { id: "niv79:legal-party:uniao", name: "União" } as const;

// These roles are independently sourced. The vessel title is an attributed
// assertion with unknown legal validity dates and no inferred share.
export const roles = {
  fieldOperation: {
    kind: "operator", scope: "field_operation", subjectRef: contractors.petrobras.id,
    objectRef: field.id, evidence: "field-operator",
  },
  governance: {
    kind: "governance_control", scope: "issuer_voting_control", subjectRef: union.id,
    objectRef: contractors.petrobras.id, evidence: "issuer-governance",
  },
  unionRepresentation: {
    kind: "Claim", scope: "marketing_union_production", subjectName: "Pré-Sal Petróleo S.A. (PPSA)",
    objectRef: field.id, evidence: "transfer-signing",
  },
  vesselOwner: {
    kind: "asset_owner", scope: "issuer_reported_vessel_title", subjectName: "MISC Offshore (Singapore) Pte. Ltd.",
    objectRef: vessel.id, evidence: "vessel-roles", effectiveFrom: null,
  },
  vesselMaintenance: {
    kind: "operator", scope: "vessel_operations_and_maintenance", subjectName: "MISC Serviços de Petróleo do Brasil Ltda.",
    objectRef: vessel.id, evidence: "vessel-roles",
  },
} as const satisfies Record<string, { evidence: ClaimKey } & Record<string, unknown>>;

// All values are basis points of one named denominator. The three splits
// are independent, and are intentionally never added across denominators.
const contractedAreaBps = 9650;
const unionAreaBps = 350;
const contractedShares = { petrobras: 4000, shell: 2000, total: 2000, cnodc: 1000, cnooc: 1000 };
const acquiredBlockShares = { petrobras: 8000, shell: 2000 };

export const denominators = {
  reservoir: { label: "Jazida compartilhada", instrument: "Acordo de Individualização da Produção de Mero" },
  contracted: { label: "Área contratada", instrument: "Contrato de partilha Libra · 48610.011150/2013-10" },
  acquired: { label: "Bloco arrematado", instrument: "Alienação da parcela da União · leilão de 04/12/2025" },
} as const;

export type Denominator = keyof typeof denominators;
type Party = Contractor | "union";
type Snapshot = "documented-2026" | "documented-fy2025" | "auction-2025" | "conditional-transfer";
const parties = { ...contractors, union };

const fy2025End = "2025-12-31";
const auctionOn = "2025-12-04";
const snapshotDates: Record<Exclude<Snapshot, "conditional-transfer">, string> = {
  "documented-2026": dossierCutoff,
  "documented-fy2025": fy2025End,
  "auction-2025": auctionOn,
};

const participationEntries = Object.entries(contractedShares) as [Contractor, number][];
const auctionEntries = Object.entries(acquiredBlockShares) as [keyof typeof acquiredBlockShares, number][];
const sliceOf = (share: number, area: number) => share * area / 10_000;

function observation<Participant extends Party>(
  party: Participant, bps: number, denominator: Denominator, snapshot: Snapshot, evidence: readonly ClaimKey[],
) {
  const subject = parties[party];
  return {
    id: "niv79:observation:mero:" + [snapshot, denominator, party, "v1"].join(":"),
    metricRef: "niv79:metric:mero:participation:" + denominator,
    relationKind: snapshot === "documented-2026" || snapshot === "documented-fy2025"
      ? "contractual_participating_interest" as const : null,
    subjectRef: subject.id,
    objectRef: field.id,
    party,
    bps,
    denominator,
    instrument: denominators[denominator].instrument,
    snapshot,
    referenceOn: snapshot === "conditional-transfer" ? transfer.plannedOn : snapshotDates[snapshot],
    type: snapshot === "conditional-transfer" ? "forecast" as const : "reported" as const,
    effectiveFrom: null,
    knownAt: dossierCutoff,
    evidence,
  };
}

export const transfer = {
  id: "niv79:event:mero-union-transfer",
  signedOn: "2026-03-10",
  plannedOn: "2027-03-01",
  effectiveOn: null,
  signingEvidence: "transfer-signing",
  plannedEvidence: "transfer-schedule",
} as const;

const timeline = [
  { on: "2021-12-09", label: "Acordo de individualização aprovado", evidence: "aip-approval" },
  { on: "2024-09-09", label: "Aditivo da partilha assinado", evidence: "aip-addendum" },
  { on: auctionOn, label: "Resultado do leilão divulgado", evidence: "auction-allocation" },
  { on: transfer.signedOn, label: "Alienação assinada", evidence: transfer.signingEvidence },
] as const;

function reservoirRows(snapshot: "documented-2026" | "documented-fy2025") {
  const evidence: readonly ClaimKey[] = snapshot === "documented-2026" ? ["contract-split", "reservoir-split"] : ["reservoir-split"];
  const unionEvidence: readonly ClaimKey[] = snapshot === "documented-2026" ? ["transfer-signing", "reservoir-split"] : evidence;
  return [
    ...participationEntries.map(([party, bps]) => observation(party, sliceOf(bps, contractedAreaBps), "reservoir", snapshot, evidence)),
    observation("union", unionAreaBps, "reservoir", snapshot, unionEvidence),
  ];
}

export function isDate(date: string): boolean {
  if (!/^[1-9]\d{3}-\d{2}-\d{2}$/.test(date)) return false;
  const value = new Date(date);
  return Number.isFinite(value.valueOf()) && value.toISOString().slice(0, 10) === date;
}

// asOf is event time for retrospective replay using the fixed dossier, not
// what ARGOS knew on that date. A schedule never enters the documented rows.
export function replay(asOf: string) {
  if (!isDate(asOf)) throw new RangeError("Use a valid YYYY-MM-DD replay date.");

  const hasBaseline = asOf >= dossierCutoff;
  const hasSigning = asOf >= transfer.signedOn;
  return {
    asOf,
    events: timeline.filter((entry) => entry.on <= asOf),
    baselineOn: hasBaseline ? dossierCutoff : null,
    rows: {
      reservoir: hasBaseline ? reservoirRows("documented-2026") :
        asOf === fy2025End ? reservoirRows("documented-fy2025") : [],
      contracted: hasBaseline ? participationEntries.map(([party, bps]) =>
        observation(party, bps, "contracted", "documented-2026", ["contract-split"])) : [],
      acquired: asOf >= auctionOn ? auctionEntries.map(([party, bps]) =>
        observation(party, bps, "acquired", "auction-2025", ["auction-allocation"])) : [],
    },
    pending: !hasSigning ? null : {
      status: "pending" as const,
      announcedDateReached: asOf >= transfer.plannedOn,
      ...transfer,
    },
    projected: hasBaseline ? auctionEntries.map(([party, blockBps]) => {
      const baseBps = sliceOf(contractedShares[party], contractedAreaBps);
      const incrementBps = sliceOf(blockBps, unionAreaBps);
      return {
        ...observation(party, baseBps + incrementBps, "reservoir", "conditional-transfer",
          ["contract-split", "auction-allocation", "transfer-schedule", ...(party === "petrobras" ? ["petrobras-projection" as const] : [])]),
        baseBps, incrementBps, blockBps,
      };
    }) : [],
  };
}

export const areaSplit = { contractedBps: contractedAreaBps, unionBps: unionAreaBps } as const;

const percent = new Intl.NumberFormat("pt-BR", { style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2 });
export function formatShare(bps: number) {
  return percent.format(bps / 10_000);
}
