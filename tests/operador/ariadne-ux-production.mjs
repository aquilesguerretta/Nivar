// Actual local production build: both flags may be set, import.meta.env.DEV is false.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
const { chromium } = createRequire(
  path.join(process.env.RUNTIME_NODE_MODULES, "package.json"),
)("playwright");
const base = process.env.ARIADNE_QA_BUILD_URL || "http://127.0.0.1:5193";
assert.match(base, /^http:\/\/127\.0\.0\.1:\d+$/);
const chunks = await readdir("dist/assets");
const js = (
  await Promise.all(
    chunks
      .filter((file) => file.endsWith(".js"))
      .map((file) => readFile(path.join("dist/assets", file), "utf8")),
  )
).join("\n");
for (const marker of [
  "data-ariadne-state",
  "ariadne-preserved-comparison",
  "Navegação Ariadne",
])
  assert.equal(
    js.includes(marker),
    false,
    marker + " excluded from production JS",
  );
const browser = await chromium.launch({ headless: true, channel: "chrome" });
try {
  const page = await browser.newPage();
  let intercepted = 0;
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.hostname !== "127.0.0.1") return route.abort();
    if (url.pathname.startsWith("/api/")) {
      intercepted++;
      return route.fulfill({
        status: 401,
        contentType: "application/json",
        body: '{"detail":"local gate check"}',
      });
    }
    return route.continue();
  });
  for (const route of [
    "/operador/ariadne/fechamento",
    "/operador/ariadne/planejamento",
  ]) {
    await page.goto(base + route);
    await page.getByText("Endereço não encontrado", { exact: true }).waitFor();
    assert.equal(await page.locator(".aw-shell").count(), 0);
  }
  const result = {
    pass: 5,
    fail: 0,
    skip: 0,
    excludedMarkers: 3,
    excludedRoutes: 2,
    interceptedApiRequests: intercepted,
    outboundApiRequests: 0,
  };
  if (process.env.ARIADNE_QA_GATE_OUTPUT)
    await writeFile(
      process.env.ARIADNE_QA_GATE_OUTPUT,
      JSON.stringify(result, null, 2),
    );
  console.log(JSON.stringify(result));
} finally {
  await browser.close();
}
