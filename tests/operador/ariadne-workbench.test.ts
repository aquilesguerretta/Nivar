import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

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
