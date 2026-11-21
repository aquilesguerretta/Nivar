// Check the actual locally served production build, without any API access.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";
import { writeFile } from "node:fs/promises";

const { chromium } = createRequire(
  path.join(process.env.RUNTIME_NODE_MODULES, "package.json"),
)("playwright");
const base = process.env.ARIADNE_QA_BUILD_URL ?? "http://127.0.0.1:5179";
assert.match(base, /^http:\/\/(127\.0\.0\.1|localhost):/);
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  // The route gate is independent of auth. Do not let a proxy contact any backend.
  await page.route("**/api/**", (route) =>
    route.fulfill({
      status: 401,
      contentType: "application/json",
      body: '{"detail":"synthetic local gate check"}',
    }),
  );
  await page.goto(base + "/operador/ariadne/fechamento");
  await page.getByText("Endereço não encontrado", { exact: true }).waitFor();
  const controls = await page
    .getByRole("button", { name: "Criar workspace privado", exact: true })
    .count();
  assert.equal(controls, 0);
  const evidence = {
    check: "actual production build excludes experimental assisted-close route",
    passed: 1,
    failed: 0,
    skipped: 0,
    apiRequestsSent: 0,
    experimentalControls: controls,
    measuredAt: new Date().toISOString(),
  };
  await writeFile(
    "docs/ariadne-close/browser-evidence/production-gate.json",
    JSON.stringify(evidence, null, 2) + "\n",
  );
  process.stdout.write(JSON.stringify(evidence) + "\n");
} finally {
  await browser.close();
}
