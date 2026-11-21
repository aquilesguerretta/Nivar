import assert from "node:assert/strict";
import { mkdir, readdir, readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";
import { createServer, preview } from "vite";

const require = process.env.RUNTIME_NODE_MODULES
  ? createRequire(path.join(process.env.RUNTIME_NODE_MODULES, "package.json"))
  : createRequire(import.meta.url);
const { chromium } = require("playwright");
const output = path.resolve(process.env.ARGOS_QA_OUTPUT ?? path.join(tmpdir(), "niv77-local-evidence"));
const transport = { host: "127.0.0.1", port: 0, strictPort: true };
const explore = "/br/argos/explore";
let server;
let browser;
let base;

before(async () => {
  await mkdir(output, { recursive: true });
  server = await createServer({ mode: "argos-local", server: transport });
  assert.equal(server.config.server.proxy, undefined, "local mode must disable the production proxy");
  await server.listen();
  base = loopbackUrl(server.httpServer);
  browser = await chromium.launch({ headless: true, channel: "chrome" });
});

after(async () => {
  await browser?.close();
  await server?.close();
});

function loopbackUrl(httpServer) {
  const address = httpServer.address();
  assert.equal(address.address, "127.0.0.1");
  return `http://127.0.0.1:${address.port}`;
}

async function withPage(options, origin, run, corrected = () => false) {
  const context = await browser.newContext({ ...options, serviceWorkers: "block" });
  const page = await context.newPage();
  page.setDefaultTimeout(45_000);
  const external = [];
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.origin === origin && corrected() && url.pathname === "/src/lib/argos/globalExploreEvidence.ts") {
      const response = await route.fetch();
      assert.equal(response.status(), 200);
      const fixture = '/tests/argos-global-explore/historical-fixture.ts';
      return route.fulfill({ response, body: `${await response.text()}
import { syntheticCorrection } from "${fixture}";
Object.assign(exploreEvidenceCatalog, syntheticCorrection(exploreEvidenceCatalog));` });
    }
    if (url.origin === origin) return route.continue();
    external.push(url.origin);
    await route.abort();
  });
  try {
    await run(page);
    assert.deepEqual(external, [], "no outbound network attempts");
    assert.deepEqual(errors, [], "no unhandled browser errors");
  } finally {
    await context.close();
  }
}

async function heading(page, text) {
  await page.getByRole("heading", { level: 1, name: text, exact: true }).waitFor();
}

async function capture(page, name) {
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await page.screenshot({ path: path.join(output, `${name}.png`), animations: "disabled" });
}

async function verifyLayout(page, width) {
  assert.equal(await page.evaluate(() => window.innerWidth), width);
  assert.equal(await page.locator(".ax-workspace").evaluate((node) => node.scrollWidth <= node.clientWidth), true);
}

for (const variant of [
  { name: "desktop-dark", width: 1440, height: 900, theme: "dark" },
  { name: "mobile-light", width: 390, height: 844, theme: "light" },
]) {
  test(`${variant.name}: complete typed investigation, evidence and reverse navigation`, async () => {
    await withPage({ viewport: { width: variant.width, height: variant.height } }, base, async (page) => {
      await page.addInitScript((theme) => localStorage.setItem("nivar-g2-mode", theme), variant.theme);
      await page.goto(`${base}/br/familia/intelligence`, { waitUntil: "commit" });
      await page.getByRole("link", { name: "Abrir ARGOS Explore" }).click();
      await heading(page, "Explorar tecnologias");
      assert.equal(await page.locator(".g2-shell").getAttribute("data-g2-theme"), variant.theme);
      const search = page.getByRole("searchbox", { name: "Buscar objetos" });
      await search.fill("Solar PV");
      const result = page.locator(".ax-results").getByRole("link");
      assert.equal(await result.count(), 1);
      assert.equal(await result.getAttribute("data-object-ref"), "technology:solar-pv");
      await capture(page, `${variant.name}-search`);
      await result.focus();
      await result.press("Enter");
      await heading(page, "Solar PV");
      const object = page.locator(".ax-heading");
      assert.equal(await object.getAttribute("data-object-kind"), "Technology");
      await capture(page, `${variant.name}-solar-pv`);
      await page.getByRole("link", { name: "Explorar Silício cristalino (c-Si)" }).press("Enter");
      await heading(page, "Silício cristalino (c-Si)");
      assert.equal(await object.getAttribute("data-object-ref"), "variant:solar-pv:c-si");
      await capture(page, `${variant.name}-c-si`);
      await page.getByRole("link", { name: "Explorar TOPCon" }).press("Enter");
      await heading(page, "TOPCon");
      await page.getByText("SHJ / HJT", { exact: true }).waitFor();
      await verifyLayout(page, variant.width);
      await capture(page, `${variant.name}-topcon`);

      await page.getByRole("link", { name: "Ver estudo original" }).click();
      assert.match(await page.getByRole("link", { name: "Abrir fonte original" }).getAttribute("href"), /10\.1016\/j\.solmat/);
      await page.goBack();
      await page.getByRole("link", { name: /Wafer Lâmina/ }).click();
      await heading(page, "Wafer fotovoltaico");
      assert.match(await page.locator(".ax-heading").innerText(), /TechnologyElement/i);
      const wafer = page.locator("[data-observation]");
      const ref = await wafer.getAttribute("data-observation");
      const metric = await wafer.getAttribute("data-metric");
      const waferContent = await wafer.innerText();
      assert.ok(ref && metric);
      assert.match(waferContent, /≈95%/);
      assert.match(waferContent, /UNKNOWN.*não consta no gráfico público/s);
      assert.doesNotMatch(waferContent, /\d+\s*GW/);
      await capture(page, `${variant.name}-wafer`);

      await page.getByRole("link", { name: "Ver manufatura na China" }).click();
      await heading(page, "China");
      const china = page.locator("[data-observation]");
      assert.equal(await china.getAttribute("data-observation"), ref);
      assert.equal(await china.getAttribute("data-metric"), metric);
      assert.equal(await china.getAttribute("data-version"), "1");
      assert.equal(await china.innerText(), waferContent);
      assert.match(await china.innerText(), /Referência 2024.*Relatório IEA 2026.*Wafer fotovoltaico/s);
      await page.getByText("NOT COMPARABLE", { exact: true }).waitFor();
      await page.getByText("UNRESOLVED", { exact: true }).waitFor();
      await verifyLayout(page, variant.width);
      await capture(page, `${variant.name}-china`);

      await page.getByRole("link", { name: "Ver evidência da IEA" }).click();
      const panel = page.getByRole("complementary", { name: "Energy Technology Perspectives 2026" });
      assert.match(await panel.getByRole("link", { name: "Abrir fonte original" }).getAttribute("href"), /^https:\/\/www\.iea\.org\/reports\//);
      await panel.getByRole("link", { name: "Abrir gráfico no IEA" }).waitFor();
      assert.equal(await panel.locator("time").getAttribute("datetime"), "2026-03-26");
      assert.match(await panel.innerText(), /Captura: UNKNOWN.*Primeira ciência: UNKNOWN/s);
      assert.equal(await panel.getByText("RESTRICTED", { exact: true }).count(), 3);
      assert.equal(await panel.locator("img, iframe, video, a[download], a[href*='/api/']").count(), 0);
      await verifyLayout(page, variant.width);
      await capture(page, `${variant.name}-evidence`);
      await page.getByRole("button", { name: "Fechar evidência" }).click();
      await panel.waitFor({ state: "detached" });
      assert.equal(new URL(page.url()).searchParams.has("evidence"), false);
      await page.getByRole("link", { name: "Voltar a Wafer fotovoltaico" }).click();
      await heading(page, "Wafer fotovoltaico");
      await page.getByRole("link", { name: "Voltar a TOPCon" }).click();
      await heading(page, "TOPCon");
      await page.getByRole("link", { name: "Voltar a Silício cristalino (c-Si)" }).click();
      await heading(page, "Silício cristalino (c-Si)");
      await page.getByRole("link", { name: "Voltar a Solar PV" }).click();
      await heading(page, "Solar PV");
      await page.getByRole("link", { name: "Voltar à busca" }).click();
      assert.equal(await search.inputValue(), "Solar PV");
      await search.fill("fábrica inexistente");
      await page.getByText(/UNRESOLVED · Nenhum objeto/).waitFor();
    });
  });
}

test("direct evidence URLs retain typed context and invalid references fail closed", async () => {
  await withPage({}, base, async (page) => {
    await page.goto(`${base}${explore}/china?q=TOPCon&evidence=iea`);
    await page.getByRole("complementary", { name: "Energy Technology Perspectives 2026" }).waitFor();
    await page.getByRole("button", { name: "Fechar evidência" }).click();
    await page.getByRole("heading", { name: "Fontes e evidência" }).waitFor();
    assert.equal(new URL(page.url()).search, "?q=TOPCon");
    await page.goto(`${base}${explore}/china?evidence=raw`);
    await page.getByText(/UNRESOLVED · Evidência fora do escopo/).waitFor();
    assert.equal(await page.getByRole("link", { name: "Abrir fonte original" }).count(), 0);
    await page.goto(`${base}${explore}/constructor`);
    await heading(page, "Objeto indisponível");
    assert.equal(await page.locator("[data-observation]").count(), 0);
  });
});

test("a copied v1 link survives a synthetic v2 and rejects restricted or incompatible revisions", async () => {
  let applyCorrection = false;
  await withPage({ viewport: { width: 1440, height: 900 } }, base, async (page) => {
    const metric = page.locator("[data-observation]");
    const evidence = page.locator("[data-document-ref]");
    await page.goto(`${base}${explore}/china?q=Solar+PV&evidence=iea`);
    await evidence.waitFor();
    assert.equal(await evidence.getAttribute("data-source-ref"), "source:iea");
    const pinLink = evidence.getByRole("link", { name: "Abrir versão fixada" });
    const v1 = new URL(await pinLink.getAttribute("href"), base);
    assert.equal(v1.searchParams.get("observation_ref"), await metric.getAttribute("data-observation"));
    assert.equal(v1.searchParams.get("document_ref"), await evidence.getAttribute("data-document-ref"));
    assert.equal(v1.searchParams.get("observation_version"), "1");
    assert.equal(v1.searchParams.get("document_version"), "1");
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"], { origin: base });
    await evidence.getByRole("button", { name: "Copiar link fixado" }).press("Enter");
    await page.getByText("Link fixado copiado.").waitFor();
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), v1.href);

    applyCorrection = true;
    await page.reload();
    await page.getByRole("heading", { name: "Documento sintético v2", exact: true }).waitFor();
    assert.match(await metric.innerText(), /≈94%/);
    assert.match(await metric.innerText(), /Fixture sintético/);
    assert.equal(await metric.getAttribute("data-version"), "2");
    assert.equal(await evidence.getAttribute("data-document-version"), "2");
    await page.goto(v1.href);
    await page.getByRole("heading", { name: "Energy Technology Perspectives 2026", exact: true }).waitFor();
    assert.match(await metric.innerText(), /≈95%/);
    assert.match(await metric.innerText(), /v1 · Fixada/);
    assert.equal(await evidence.getAttribute("data-document-version"), "1");
    await capture(page, "desktop-pinned-observation-document-v1");

    await page.getByRole("button", { name: "Fechar evidência" }).press("Enter");
    await evidence.waitFor({ state: "detached" });
    await page.getByRole("link", { name: "Voltar a Wafer fotovoltaico" }).click();
    await heading(page, "Wafer fotovoltaico");
    assert.equal(await metric.getAttribute("data-version"), "1");
    assert.equal(new URL(page.url()).searchParams.get("document_version"), "1");
    await page.goBack();
    await heading(page, "China");
    await page.goForward();
    await heading(page, "Wafer fotovoltaico");
    assert.equal(await metric.getAttribute("data-version"), "1");

    const blocked = new URL(v1);
    for (const [observation, document, message] of [
      ["1", "2", "UNRESOLVED"],
      ["01", "1", "UNRESOLVED"],
      ["99", "99", "UNRESOLVED"],
      ["3", "3", "RESTRICTED"],
    ]) {
      blocked.searchParams.set("observation_version", observation);
      blocked.searchParams.set("document_version", document);
      await page.goto(blocked.href);
      await page.getByText(message, { exact: true }).waitFor();
      assert.equal(await metric.count(), 0);
      assert.equal(await evidence.count(), 0);
      assert.equal(await page.getByRole("link", { name: "Abrir fonte original" }).count(), 0);
    }
  }, () => applyCorrection);
});

test("the compiled production app has no Explore entry, route or evidence payload", async () => {
  const assets = await readdir("dist/assets");
  for (const asset of assets.filter((file) => /\.(js|css)$/.test(file))) {
    const payload = await readFile(path.join("dist/assets", asset), "utf8");
    assert.doesNotMatch(payload, /observation:iea:etp-2026:cn:pv-wafer|document:iea:etp-2026:wafer-capacity|technology:solar-pv|Documento sintético|\.ax-workspace/, asset);
  }
  const build = await preview({ mode: "argos-local", preview: transport });
  try {
    assert.equal(build.config.preview.proxy, undefined);
    const origin = loopbackUrl(build.httpServer);
    await withPage({}, origin, async (page) => {
      await page.goto(`${origin}/br/familia/intelligence`);
      await page.getByText("O que muda.", { exact: false }).first().waitFor();
      assert.equal(await page.getByRole("link", { name: "Abrir ARGOS Explore" }).count(), 0);
      await page.goto(`${origin}${explore}/china?evidence=iea`);
      await heading(page, "Este endereço não existe na plataforma.");
      assert.equal(await page.locator(".ax-workspace, [data-observation]").count(), 0);
    });
  } finally {
    await build.close();
  }
});
