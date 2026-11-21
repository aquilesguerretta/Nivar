import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";
import { fixtureUrl, startFixture } from "./server.mjs";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.ARGOS_PLAYWRIGHT ?? "playwright");
const evidenceDir = process.env.ARGOS_INVESTIGATE_SCREENSHOTS ?? path.join(os.tmpdir(), "niv-86-investigate");
let server;
let browser;

before(async () => {
  await mkdir(evidenceDir, { recursive: true });
  server = await startFixture();
  browser = await chromium.launch({ channel: "chrome" });
});

after(async () => {
  await browser?.close();
  await server?.close();
});

async function withPage(options, run) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  const outbound = [];
  const api = [];
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.startsWith("/api/")) api.push(url.pathname);
    if (url.origin === new URL(fixtureUrl).origin) return route.continue();
    outbound.push(url.origin);
    return route.abort();
  });
  try {
    await page.goto(fixtureUrl);
    await page.getByRole("heading", { name: "Investigue o setor energético" }).waitFor();
    await page.waitForFunction(() => {
      const logo = document.querySelector("img[alt=NIVAR]");
      return logo?.complete && logo.naturalWidth > 0;
    });
    assert.equal(await page.evaluate(() => innerWidth), options.viewport.width);
    assert.equal(await page.locator("img[alt=NIVAR]").evaluate((img) => img.complete && img.naturalWidth > 0), true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await run(page);
    assert.deepEqual(outbound, []);
    assert.deepEqual(api, []);
    assert.deepEqual(errors, []);
  } finally {
    await context.close();
  }
}

async function shot(page, name, fullPage = true) {
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(evidenceDir, name), fullPage });
}

async function search(page, query) {
  const field = page.getByRole("searchbox");
  await field.fill(query);
  await field.press("Enter");
  await page.getByRole("heading", { name: query, exact: true }).waitFor();
}

test("Chrome desktop searches TOPCon, follows wafer and China, opens evidence with the keyboard and returns", async () => {
  await withPage({ viewport: { width: 1440, height: 950 }, colorScheme: "light" }, async (page) => {
    await shot(page, "01-desktop-busca.png");
    await search(page, "TOPCon");
    await page.getByRole("region", { name: "Variantes" }).getByRole("link", { name: "TOPCon", exact: true }).click();
    const title = page.getByRole("heading", { name: "TOPCon", exact: true });
    await title.waitFor();
    assert.equal(await title.evaluate((el) => el === document.activeElement), true);
    await shot(page, "02-desktop-topcon.png");
    await page.getByRole("navigation", { name: "Relações do objeto" }).getByRole("link", { name: "Wafer fotovoltaico" }).click();
    const opener = page.getByRole("button", { name: /Ver evidência · Capacidade de fabricação/ });
    await opener.waitFor();
    assert.equal(await page.locator("dialog").count(), 0);
    await opener.focus();
    await page.keyboard.press("Enter");
    const drawer = page.getByRole("dialog", { name: "Evidência" });
    const close = drawer.getByRole("button", { name: "Fechar" });
    await close.waitFor();
    assert.equal(await close.evaluate((el) => el === document.activeElement), true);
    assert.match(await drawer.getByRole("link", { name: /Abrir documento original/ }).getAttribute("href"), /^https:\/\/www\.iea\.org\//u);
    await shot(page, "03-desktop-evidencia-iea.png", false);
    const pinned = await drawer.getByRole("textbox", { name: "Link local desta versão" }).inputValue();
    await page.keyboard.press("Shift+Tab");
    assert.equal(await page.evaluate(() => document.activeElement === document.body || Boolean(document.activeElement?.closest("dialog"))), true);
    await page.keyboard.press("Escape");
    await drawer.waitFor({ state: "detached" });
    await page.waitForFunction(() => document.activeElement?.matches(".ai-evidence-button"));
    assert.equal(await opener.evaluate((el) => el === document.activeElement), true);

    await page.goto(pinned);
    await opener.waitFor();
    assert.equal(await page.locator("dialog").count(), 0);
    await page.getByRole("link", { name: "China", exact: true }).click();
    await page.getByRole("heading", { name: "China", exact: true }).waitFor();
    assert.equal(new URL(page.url()).searchParams.get("evidence_ref"), new URL(pinned).searchParams.get("evidence_ref"));
    assert.equal(new URL(page.url()).searchParams.get("document_version"), new URL(pinned).searchParams.get("document_version"));
    await page.goBack();
    await page.getByRole("heading", { name: "Wafer fotovoltaico", exact: true }).waitFor();
    await page.getByRole("link", { name: "Voltar aos resultados" }).click();
    await page.getByRole("region", { name: "Variantes" }).waitFor();
    assert.equal(await page.getByRole("searchbox").inputValue(), "TOPCon");
    await search(page, "China wafers 2024");
    await page.getByRole("region", { name: "Materiais e componentes" }).getByRole("link", { name: "Wafer fotovoltaico" }).waitFor();
    await page.getByRole("region", { name: "Países" }).getByRole("link", { name: "China", exact: true }).waitFor();
    await search(page, "China wafers 2025");
    await page.getByText(/recorte disponível não estabelece uma resposta/).waitFor();
  });
});

test("Chrome mobile noturno shows bibliographic-only MOFCOM and restores the originating button", async () => {
  await withPage({ viewport: { width: 390, height: 844 }, colorScheme: "dark", isMobile: true, hasTouch: true }, async (page) => {
    await page.getByRole("link", { name: "Evento MOFCOM" }).click();
    await page.getByRole("link", { name: /Anúncio 18\/2025/ }).click();
    await page.getByText(/Revisão histórica com corte em/).first().waitFor();
    const rel = page.getByRole("navigation", { name: "Relações do objeto" });
    await rel.getByRole("link", { name: "NdFeB com disprósio" }).click();
    const opener = page.getByRole("button", { name: /Ver evidência · Ímãs e pós magnéticos/ });
    await opener.click();
    const drawer = page.getByRole("dialog");
    await drawer.getByText("Consulta por referência bibliográfica.").waitFor();
    assert.equal(await drawer.getByRole("link", { name: /documento original/i }).count(), 0);
    assert.equal((await drawer.boundingBox()).width, 390);
    assert.equal(await page.locator(".ai-fixture").getAttribute("data-mode"), "noturno");
    await shot(page, "04-mobile-noturno-evidencia-mofcom.png", false);
    await drawer.getByRole("button", { name: "Fechar" }).click();
    await page.waitForFunction(() => document.activeElement?.matches(".ai-evidence-button"));
    assert.equal(await opener.evaluate((el) => el === document.activeElement), true);
    await page.getByRole("link", { name: "Voltar ao objeto anterior" }).click();
    await page.getByRole("heading", { name: /Anúncio 18\/2025 do MOFCOM/ }).waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  });
});

test("Chrome opens a real tandem publication revision and fails closed on bad and restricted pins", async () => {
  await withPage({ viewport: { width: 412, height: 915 }, colorScheme: "light", isMobile: true, hasTouch: true }, async (page) => {
    await search(page, "Pesquisa tandem");
    await page.getByRole("link", { name: "Tandem perovskita–silício", exact: true }).click();
    await page.getByRole("link", { name: /Módulo protótipo Fraunhofer ISE/ }).click();
    await page.getByText(/25,00%/).waitFor();
    await page.getByRole("button", { name: /Ver evidência/ }).click();
    let drawer = page.getByRole("dialog");
    await drawer.getByRole("link", { name: "2024-01-31 · Histórica" }).click();
    assert.equal(await page.locator("dialog").count(), 0);
    await page.getByText("Versão histórica · 2024-01-31").waitFor();
    await page.getByText(/Fraunhofer ISE reportou 25%/).waitFor();
    assert.equal(await page.getByText(/25,00%/).count(), 0);
    await shot(page, "05-mobile-tandem-historico.png");
    await page.getByRole("button", { name: /Ver evidência/ }).click();
    drawer = page.getByRole("dialog");
    await drawer.getByRole("heading", { name: /Comunicado sobre o protótipo/ }).waitFor();
    const field = drawer.getByRole("textbox", { name: "Link local desta versão" });
    const historical = new URL(await field.inputValue());
    await page.goto(historical.href);
    await page.getByText("Versão histórica · 2024-01-31").waitFor();
    assert.equal(await page.locator("dialog").count(), 0);
    historical.searchParams.set("document_version", "latest");
    await page.goto(historical.href);
    await page.getByRole("heading", { name: "Referência não resolvida" }).waitFor();
    assert.equal(await page.getByText(/421 W/).count(), 0);

    const denied = new URL(fixtureUrl);
    denied.search = new URLSearchParams({
      object: "milestone:frontier:longi-esti-cell", evidence_ref: "document:frontier:green-v68:table-4",
      evidence_version: "v68", document_ref: "document:frontier:green-v68", document_version: "v68",
    }).toString();
    await page.goto(denied.href);
    await page.getByRole("heading", { name: "Acesso restrito" }).waitFor();
    assert.equal(await page.getByText(/35,2|Green et al\.|10\.1016|tabela 4/i).count(), 0);
    assert.equal(await page.locator("dialog").count(), 0);
  });
});
