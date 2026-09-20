import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { GUIDED_FIXTURE, resolveGuidedFixture } from "../../src/lib/ariadne/guidedFixture.ts";
import {
  AriadneOperatorApiError,
  replayPresentation,
  settleMutationAgainstWorkspace,
  type WorkspaceDetail,
} from "../../src/lib/ariadne/operatorApi.ts";

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

const router = read("src/pages/operador/OperadorRouter.tsx");
const chrome = read("src/pages/operador/consoleChrome.tsx");
const workbench = read("src/pages/operador/AriadneWorkbench.tsx");
const api = read("src/lib/ariadne/operatorApi.ts");

test("Ariadne has an explicit route while Advisory routes remain catalog-derived", () => {
  assert.match(router, /path="ariadne" element={<AriadneWorkbench\s*\/>}/);
  assert.match(router, /PRODUTOS_COM_FILA\.map/);
  assert.match(router, /path={`\$\{p\.produtoId\}\/\:pedidoId`}/);
});

test("the synthetic classification is unavoidable in shell and workbench", () => {
  assert.match(chrome, /SYNTHETIC WORKSPACE/);
  assert.match(workbench, /SYNTHETIC \/ ILLUSTRATIVE/);
  assert.match(workbench, /CASE-INDEPENDENT CORE TEST/);
});

test("Ariadne stays in the Software family while Advisory keeps its own destination", () => {
  assert.match(chrome, /isAriadne \? "\/br\/software" : "\/br\/advisory"/);
  assert.match(chrome, /isAriadne \? "Conhecer Software" : "Conhecer Advisory"/);
  assert.match(chrome, /isAriadne \? "Ariadne organiza\." : "Sócrates questiona\."/);
});

test("state, assumptions, scenario, run and result stay distinct", () => {
  for (const label of ["OBSERVED STATE", "ASSUMPTIONS", "SCENARIO", "RUN / RESULT"]) {
    assert.ok(workbench.includes(label), `missing ${label}`);
  }
  assert.match(workbench, /CURRENT STATE/);
  assert.match(workbench, /HISTÓRICO \/ SUPERSEDIDO/);
});

test("reconstruction and replay are separate operations", () => {
  assert.match(workbench, />RECONSTRUCT</);
  assert.match(workbench, />REPLAY</);
  assert.match(workbench, /getLineage/);
  assert.match(workbench, /ariadneOperatorApi\.replay/);
});

test("Ariadne truth is server-backed and API paths are relative", () => {
  assert.equal(workbench.includes("sessionStorage"), false);
  assert.match(api, /const BASE = "\/api\/operator\/ariadne"/);
  assert.equal(/https?:\/\//.test(api), false);
  assert.match(api, /Nenhum dado foi inventado/);
});

test("an ambiguous committed POST is reconciled before another attempt", async () => {
  let persisted = false;
  let refreshObservedCommit = false;
  const failure = new AriadneOperatorApiError(0, "response lost");
  const settlement = await settleMutationAgainstWorkspace(
    async () => {
      persisted = true;
      throw failure;
    },
    async () => {
      refreshObservedCommit = persisted;
    },
  );

  assert.equal(refreshObservedCommit, true);
  assert.equal(settlement.reconciled, true);
  assert.equal(settlement.actionError, failure);
  assert.equal(settlement.refreshError, null);
  assert.match(workbench, /reconciliationRequired/);
  assert.match(workbench, /Reler estado persistido/);
});

test("a failed reconciliation remains explicitly locked", async () => {
  const refreshFailure = new Error("still offline");
  const settlement = await settleMutationAgainstWorkspace(
    async () => undefined,
    async () => {
      throw refreshFailure;
    },
  );
  assert.equal(settlement.reconciled, false);
  assert.equal(settlement.refreshError, refreshFailure);
});

function emptyDetail(): WorkspaceDetail {
  return {
    workspace: {
      id: "workspace-1",
      label: "Fixture",
      synthetic: true,
      createdAt: "2026-09-19T00:00:00Z",
    },
    evidenceRefs: [],
    objects: [],
    stateVersions: [],
    assumptionSets: [],
    scenarios: [],
    models: [],
    runs: [],
    results: [],
  };
}

function completeDetail(): WorkspaceDetail {
  const detail = emptyDetail();
  detail.evidenceRefs = [
    {
      id: "e1",
      ...GUIDED_FIXTURE.evidence1,
      observedAt: null,
      recordedAt: "2026-09-19T00:00:00Z",
      transformRef: null,
    },
    {
      id: "e2",
      ...GUIDED_FIXTURE.evidence2,
      observedAt: null,
      recordedAt: "2026-09-19T00:01:00Z",
      transformRef: null,
    },
  ];
  detail.objects = [{
    id: "o1",
    objectType: GUIDED_FIXTURE.objectType,
    createdAt: "2026-09-19T00:00:00Z",
    currentStateVersionId: "v2",
  }];
  detail.stateVersions = [
    {
      id: "v1",
      objectId: "o1",
      version: 1,
      payload: { value: 10 },
      recordedAt: "2026-09-19T00:00:00Z",
      validFrom: null,
      validTo: null,
      previousVersionId: null,
      evidenceRefIds: ["e1"],
      current: false,
    },
    {
      id: "v2",
      objectId: "o1",
      version: 2,
      payload: { value: 12 },
      recordedAt: "2026-09-19T00:01:00Z",
      validFrom: null,
      validTo: null,
      previousVersionId: "v1",
      evidenceRefIds: ["e2"],
      current: true,
    },
  ];
  detail.assumptionSets = [{
    id: "a1",
    name: GUIDED_FIXTURE.assumptionName,
    createdAt: "2026-09-19T00:00:00Z",
    versions: [{
      id: "a1v1",
      version: 1,
      values: { multiplier: 2 },
      valueSchema: { multiplier: "integer" },
      origin: "human_defined",
      previousVersionId: null,
      createdAt: "2026-09-19T00:00:00Z",
    }],
  }];
  detail.scenarios = [
    {
      id: "s1",
      name: GUIDED_FIXTURE.scenario1Name,
      stateVersionId: "v1",
      assumptionSetVersionId: "a1v1",
      hypotheticalState: {},
      createdAt: "2026-09-19T00:00:00Z",
    },
    {
      id: "s2",
      name: GUIDED_FIXTURE.scenario2Name,
      stateVersionId: "v2",
      assumptionSetVersionId: "a1v1",
      hypotheticalState: {},
      createdAt: "2026-09-19T00:01:00Z",
    },
  ];
  detail.models = [{
    id: "m1",
    definitionId: "model-definition-1",
    name: GUIDED_FIXTURE.modelName,
    semanticVersion: GUIDED_FIXTURE.modelSemanticVersion,
    implementationIdentity: GUIDED_FIXTURE.modelImplementation,
    inputContract: {},
    outputContract: {},
    createdAt: "2026-09-19T00:00:00Z",
  }];
  detail.runs = [
    {
      id: "r1",
      modelVersionId: "m1",
      scenarioId: "s1",
      stateVersionId: "v1",
      assumptionSetVersionId: "a1v1",
      executionConfiguration: { arithmetic: "integer" },
      startedAt: "2026-09-19T00:00:00Z",
      producedAt: "2026-09-19T00:00:01Z",
    },
    {
      id: "r2",
      modelVersionId: "m1",
      scenarioId: "s2",
      stateVersionId: "v2",
      assumptionSetVersionId: "a1v1",
      executionConfiguration: { arithmetic: "integer" },
      startedAt: "2026-09-19T00:01:00Z",
      producedAt: "2026-09-19T00:01:01Z",
    },
  ];
  detail.results = [
    { id: "x1", modelRunId: "r1", resultKey: "scalar_result", payload: { value: 20 }, unit: null, producedAt: "2026-09-19T00:00:01Z" },
    { id: "x2", modelRunId: "r2", resultKey: "scalar_result", payload: { value: 24 }, unit: null, producedAt: "2026-09-19T00:01:01Z" },
  ];
  return detail;
}

test("duplicate display labels fail closed instead of selecting the first record", () => {
  const detail = emptyDetail();
  detail.evidenceRefs = ["evidence-a", "evidence-b"].map((id) => ({
    id,
    ...GUIDED_FIXTURE.evidence1,
    observedAt: null,
    recordedAt: "2026-09-19T00:00:00Z",
    transformRef: null,
  }));

  const resolved = resolveGuidedFixture(detail);
  assert.equal(resolved.evidence1, undefined);
  assert.ok(resolved.conflicts.some((message) => message.startsWith("E1:")));
  assert.equal(workbench.includes(".find((item) => item.sourceArtifactId"), false);
});

test("a scenario label with the wrong historical IDs is a conflict", () => {
  const detail = emptyDetail();
  detail.scenarios.push({
    id: "scenario-wrong",
    name: GUIDED_FIXTURE.scenario1Name,
    stateVersionId: "not-v1",
    assumptionSetVersionId: "not-a1v1",
    hypotheticalState: {},
    createdAt: "2026-09-19T00:00:00Z",
  });

  const resolved = resolveGuidedFixture(detail);
  assert.equal(resolved.scenario1, undefined);
  assert.ok(resolved.conflicts.some((message) => message.startsWith("S1:")));
});

test("retry-shaped duplicates for every guided record fail closed", () => {
  assert.deepEqual(resolveGuidedFixture(completeDetail()).conflicts, []);
  const mutations: Array<(detail: WorkspaceDetail) => void> = [
    (detail) => detail.evidenceRefs.push({ ...detail.evidenceRefs[0], id: "e1-retry" }),
    (detail) => detail.objects.push({ ...detail.objects[0], id: "o1-retry" }),
    (detail) => detail.stateVersions.push({
      ...detail.stateVersions[1],
      id: "v3-retry",
      version: 3,
      previousVersionId: "v2",
    }),
    (detail) => detail.assumptionSets.push({ ...detail.assumptionSets[0], id: "a1-retry" }),
    (detail) => detail.assumptionSets[0].versions.push({
      ...detail.assumptionSets[0].versions[0],
      id: "a1v2-retry",
      version: 2,
      previousVersionId: "a1v1",
    }),
    (detail) => detail.scenarios.push({ ...detail.scenarios[0], id: "s1-retry" }),
    (detail) => detail.runs.push({ ...detail.runs[0], id: "r1-retry" }),
    (detail) => detail.results.push({ ...detail.results[0], id: "x1-retry" }),
  ];

  for (const mutate of mutations) {
    const detail = structuredClone(completeDetail());
    mutate(detail);
    assert.ok(resolveGuidedFixture(detail).conflicts.length > 0);
  }
});

test("a replay mismatch is reported as replay divergence, not reconstruction failure", () => {
  const presentation = replayPresentation({
    resultId: "result-1",
    storedPayload: { value: 20 },
    replayedPayload: { value: 21 },
    matches: false,
  });
  assert.equal(presentation.status, "MISMATCH DETECTADO");
  assert.match(presentation.detail, /resultado histórico permanece inalterado/);
  assert.equal(presentation.detail.includes("reconstru"), false);
});

test("empty and error states stay explicit and never synthesize records", () => {
  for (const copy of [
    "Nenhum contexto privado foi criado.",
    "Nenhum objeto gravado.",
    "Nenhuma evidência registrada.",
    "Nenhuma premissa fixada.",
    "Nenhum cenário criado.",
    "Nenhum resultado persistido.",
    "Sessão ausente ou expirada.",
    "Esta conta não está autorizada como operador.",
    "Workspace não encontrado ou não pertence a este operador.",
  ]) {
    assert.ok(workbench.includes(copy), `missing explicit state: ${copy}`);
  }
  assert.match(api, /Backend indisponível ou falha interna\. Nenhum dado foi inventado\./);
  assert.equal(workbench.includes("sessionStorage"), false);
});
