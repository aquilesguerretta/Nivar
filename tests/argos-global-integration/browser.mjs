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
const output = path.resolve(process.env.ARGOS_QA_OUTPUT ?? path.join(tmpdir(), "niv82-local-evidence"));
const address = { host: "127.0.0.1", port: 5282, strictPort: true };
const origin = "http://127.0.0.1:5282";
const explore = "/br/argos/explore";
let server;
let browser;

before(async () => {
  await mkdir(output, { recursive: true });
  browser = await chromium.launch({ headless: true, channel: "chrome" });
});

after(async () => {
  await browser?.close();
  await server?.close();
});

async function withPage(viewport, theme, run) {
  const context = await browser.newContext({ viewport, serviceWorkers: "block" });
  const requests = [];
  const errors = [];
  const page = await context.newPage();
  page.setDefaultTimeout(45_000);
  await page.addInitScript((mode) => localStorage.setItem("nivar-g2-mode", mode), theme);
  page.on("pageerror", (error) => errors.push(error.message));
  await context.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.origin === origin && !url.pathname.startsWith("/api/")) return route.continue();
    // The house shell checks its session even for an offline reader.
    if (url.origin === origin && url.pathname === "/api/auth/me") {
      return route.fulfill({ status: 401, json: {} });
    }
    requests.push(url.origin + url.pathname);
    return route.abort();
  });
  try {
    await run(page);
    assert.deepEqual(requests, [], "local viewing must use neither external requests nor backend");
    assert.deepEqual(errors, []);
  } finally {
    await context.close();
  }
}

async function open(page, suffix = "") {
  await page.goto(origin + explore + suffix, { waitUntil: "commit" });
  await page.locator(".ax-workspace h1").waitFor({ timeout: 120_000 });
}

async function capture(page, file, width, theme) {
  assert.equal(await page.evaluate(() => innerWidth), width);
  assert.equal(await page.locator(".g2-shell").getAttribute("data-g2-theme"), theme);
  assert.equal(await page.locator(".ax-workspace").evaluate((node) => node.scrollWidth <= node.clientWidth), true);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(output, file + ".png"), animations: "disabled" });
}

const workspace = (page) => page.locator(".ax-workspace");
const heading = (page, name) => workspace(page).getByRole("heading", { level: 1, name, exact: true }).waitFor();
const inspector = (page) => workspace(page).locator(".ax-inspector");
const title = "China adota controles de exportação de terras raras";

test("integrated local browser", async (t) => {
  server = await createServer({ mode: "argos-local", server: address });
  assert.equal(server.config.server.proxy, undefined);
  await server.listen();
  try {
    await t.test("search uses canonical refs, keyboard and original query on return", async () => {
      await withPage({ width: 1440, height: 900 }, "light", async (page) => {
        await open(page);
        await capture(page, "desktop-light-index", 1440, "light");
        assert.ok(await page.locator(".ax-explore-rail img").evaluate((node) => node.naturalWidth > 0));
        const search = page.getByRole("searchbox", { name: "Buscar objetos" });
        for (const [query, ref] of [
          ["j3:country:CHN", "country:CHN"],
          ["technology:solar-pv", "technology:solar-pv"],
          ["variant:solar-pv:c-si:topcon", "variant:solar-pv:c-si:topcon"],
        ]) {
          await search.fill(query);
          const results = page.locator(".ax-results a");
          assert.deepEqual(await results.evaluateAll((links) => links.map((link) => link.dataset.objectRef)), [ref]);
        }
        await search.fill("TOPCon");
        await page.getByRole("link", { name: /^TOPCon Arquitetura/ }).press("Enter");
        await heading(page, "TOPCon");
        const breadcrumb = page.getByRole("navigation", { name: "Trilha da investigação" });
        assert.match(await breadcrumb.innerText(), /Explore.*Solar PV.*Silício cristalino.*TOPCon/s);
        assert.equal(await inspector(page).count(), 0);
        const related = page.getByRole("heading", { name: "Marcos com célula inferior TOPCon" }).locator("..").getByRole("link");
        assert.equal(await related.count(), 2);
        await related.filter({ hasText: "Fraunhofer" }).click();
        assert.equal(await page.locator(".ax-heading").getAttribute("data-object-kind"), "ResearchMilestone");
        assert.match(await page.locator("[data-observation]").innerText(), /30,6%/);
        await page.getByRole("link", { name: "Voltar à origem" }).click();
        await heading(page, "TOPCon");
        await page.getByRole("link", { name: "Explore", exact: true }).click();
        assert.equal(await search.inputValue(), "TOPCon");
      });
    });

    await t.test("J3 distinguishes Event, Document, material, application and canonical jurisdiction on mobile", async () => {
      await withPage({ width: 390, height: 844 }, "dark", async (page) => {
        await open(page);
        await page.getByRole("navigation", { name: "Áreas do ARGOS Explore" }).getByRole("link", { name: "Atualidades" }).click();
        await heading(page, title);
        assert.equal(await page.locator(".ax-heading").getAttribute("data-object-kind"), "Event");
        assert.equal(await inspector(page).count(), 0);
        assert.equal(await page.getByRole("link", { name: /TOPCon/i }).count(), 0);
        await capture(page, "mobile-dark-event", 390, "dark");
        const original = page.getByRole("link", { name: /^Registro oficial do ato/ });
        const documentUrl = new URL(await original.getAttribute("href"), origin);
        await original.click();
        assert.equal(await page.locator(".ax-heading").getAttribute("data-object-kind"), "Document");
        assert.ok(documentUrl.searchParams.get("document_ref").startsWith("j3:document:"));
        assert.equal(documentUrl.searchParams.get("document_version"), "1");
        assert.equal(await inspector(page).count(), 0);
        await page.getByRole("link", { name: /^Item legalmente controlado/ }).click();
        await heading(page, "NdFeB com disprósio");
        await page.getByRole("link", { name: /Aplicação técnica.*PMSM/ }).click();
        await page.getByRole("link", { name: "Jurisdição do ato · China" }).click();
        await heading(page, "China");
        assert.equal(await page.locator(".ax-heading").getAttribute("data-object-ref"), "country:CHN");
        assert.match(await page.locator("[data-observation]").innerText(), /≈95%/);
        await page.getByRole("link", { name: "Voltar à origem" }).click();
        await heading(page, "Motor síncrono de ímã permanente (PMSM)");
        await page.getByRole("link", { name: "Explore", exact: true }).click();
        await open(page, "/j3:country:CHN");
        await heading(page, "China");
        assert.equal(new URL(page.url()).pathname, explore + "/china");
      });
    });

    await t.test("J3 evidence opens only on action and keeps original and translation distinct", async () => {
      await withPage({ width: 1440, height: 900 }, "light", async (page) => {
        await open(page, "/mofcom-2025");
        const rail = workspace(page).getByRole("complementary", { name: "Evidência" });
        await rail.getByRole("link", { name: /inglês|ingl[eê]s|translation/i }).first().click();
        assert.equal(await inspector(page).locator("[data-document]").count(), 1);
        assert.match(await inspector(page).innerText(), /Tradução oficial para referência/);
        assert.equal(await inspector(page).locator("a, iframe, img").count(), 0);
        const pinned = page.url();
        await page.keyboard.press("Escape");
        await inspector(page).waitFor({ state: "detached" });
        assert.equal(new URL(page.url()).searchParams.has("evidence"), false);
        await page.goto(pinned);
        await inspector(page).waitFor();
        await capture(page, "desktop-light-legal-evidence", 1440, "light");
        const invalid = new URL(pinned);
        invalid.searchParams.set("document_version", "99");
        await page.goto(invalid.href);
        await page.getByText(/^Evidência indisponível/).waitFor();
        assert.equal(await workspace(page).locator("[data-document], .ax-inspector").count(), 0);
      });
    });

    await t.test("J4 replay holds the Observation and Document versions and rejects incompatible pins", async () => {
      await withPage({ width: 390, height: 844 }, "light", async (page) => {
        await open(page, "/solar-pv");
        await page.getByRole("link", { name: "Explorar tandem perovskita–silício" }).click();
        await heading(page, "Tandem perovskita–silício");
        await page.getByRole("link", { name: "Módulo protótipo Fraunhofer ISE / Oxford PV" }).click();
        const observation = workspace(page).locator("[data-observation]");
        await observation.and(page.locator('[data-version="2025-05-21"]')).waitFor();
        await page.getByRole("link", { name: "2024-01-31", exact: true }).click();
        const historical = observation.and(page.locator('[data-version="2024-01-31"]'));
        await historical.waitFor();
        await workspace(page).getByRole("complementary", { name: "Evidência" }).getByRole("link").click();
        await inspector(page).waitFor();
        const url = new URL(page.url());
        assert.equal(url.searchParams.get("observation_version"), "2024-01-31");
        assert.match(url.searchParams.get("document_ref"), /ise-oxford-prototype/);
        assert.equal(await inspector(page).locator("[data-document]").getAttribute("data-version"), url.searchParams.get("document_version"));
        await page.waitForFunction(() => {
          const title = document.getElementById("ax-evidence");
          const bounds = title?.getBoundingClientRect();
          const masthead = document.querySelector(".g23-masthead").getBoundingClientRect();
          return title === document.activeElement && bounds?.top >= masthead.bottom && bounds.bottom <= innerHeight;
        });
        await capture(page, "mobile-light-frontier-pinned", 390, "light");
        await page.reload();
        await historical.waitFor();
        assert.equal(await inspector(page).locator("[data-document]").count(), 1);
        await inspector(page).getByRole("button", { name: "Fechar evidência" }).click();
        await inspector(page).waitFor({ state: "detached" });
        await historical.waitFor();
        url.searchParams.set("observation_version", "2025-05-21");
        await page.goto(url.href);
        await page.getByText(/Evidência ou marco indisponível/).waitFor();
        assert.equal(await workspace(page).locator("[data-observation], [data-document]").count(), 0);
      });
    });

    await t.test("restricted output, invalid IDs and absent J2 fail closed", async () => {
      await withPage({ width: 1440, height: 900 }, "dark", async (page) => {
        await open(page, "/longi-esti-cell");
        const reading = page.locator("[data-observation]");
        assert.match(await reading.innerText(), /35,2%/);
        assert.match(await reading.innerText(), /Declaração posterior da fabricante/);
        await workspace(page).getByRole("complementary", { name: "Evidência" }).getByRole("link", { name: /Anúncio em 14 jul/ }).click();
        assert.match(await inspector(page).innerText(), /Link retido/);
        assert.equal(await inspector(page).locator("a, iframe, img").count(), 0);
        const denied = new URL(page.url());
        denied.searchParams.set("output", "raw-document");
        await page.goto(denied.href);
        await page.getByText(/^Evidência indisponível/).waitFor();
        assert.equal(await workspace(page).locator("[data-observation], [data-document], .ax-inspector").count(), 0);
        await open(page, "/constructor");
        await heading(page, "Objeto indisponível");
        await page.getByRole("navigation", { name: "Áreas do ARGOS Explore" }).getByRole("link", { name: /Empresas e ativos/ }).click();
        await heading(page, "Empresas e ativos");
        await page.getByText(/Petrobras → Mero aguarda/).waitFor();
        assert.equal(await workspace(page).locator("[data-object-ref], .ax-inspector").count(), 0);
        await capture(page, "desktop-dark-companies-unavailable", 1440, "dark");
      });
    });
  } finally {
    await server.close();
    server = undefined;
  }
});

const forbidden = /argos-global-integration|ax-global-nav|ax-workspace|observation:iea:etp-2026:cn:pv-wafer|technology:solar-pv|j3:(?:event|document|claim):|(?:document|observation|milestone):frontier:|argos-companies-assets|38[,.]60%|1C905\.a\.4|10\.1016\/j\.joule\.2026\.102494/i;

for (const [label, outDir] of [["Production", "dist"], ["Preview equivalent", process.env.ARGOS_PREVIEW_DIST]]) {
  test(`${label} compiled output excludes routes and source-based assets`, async () => {
    assert.ok(outDir, "Build Preview-equivalent output and set ARGOS_PREVIEW_DIST");
    const files = await readdir(outDir, { recursive: true, withFileTypes: true });
    assert.ok(files.some((entry) => entry.name === "index.html"));
    for (const file of files) {
      const name = path.join(file.parentPath, file.name);
      assert.doesNotMatch(path.relative(outDir, name), forbidden);
      if (file.isFile() && /\.(?:html|m?js|json|map|css|txt)$/i.test(file.name)) {
        assert.doesNotMatch(await readFile(name, "utf8"), forbidden, name);
      }
    }
    const build = await preview({ mode: "argos-local", build: { outDir }, preview: address, logLevel: "error" });
    try {
      await withPage({ width: 1000, height: 800 }, "light", async (page) => {
        for (const suffix of ["", "/china?evidence=iea", "/mofcom-2025", "/tandem", "/empresas-e-ativos"]) {
          await page.goto(origin + explore + suffix);
          await page.getByRole("heading", { name: "Este endereço não existe na plataforma." }).waitFor();
          assert.equal(await workspace(page).count(), 0);
        }
      });
    } finally {
      await build.close();
    }
  });
}
