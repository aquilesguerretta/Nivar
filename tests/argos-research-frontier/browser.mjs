import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";
import { after, before, test } from "node:test";
import { createServer } from "vite";

const require = process.env.RUNTIME_NODE_MODULES
  ? createRequire(path.join(process.env.RUNTIME_NODE_MODULES, "package.json"))
  : createRequire(import.meta.url);
const { chromium } = require("playwright");
const fixturePath = "/tests/argos-research-frontier/fixture.html";
const transport = { host: "127.0.0.1", port: 5190, strictPort: false };
let server;
let browser;
let base;

function loopback(httpServer) {
  const address = httpServer.address();
  assert.equal(address.address, "127.0.0.1");
  return `http://127.0.0.1:${address.port}`;
}

before(async () => {
  server = await createServer({ mode: "argos-local", server: transport, logLevel: "error" });
  assert.equal(server.config.server.proxy, undefined);
  await server.listen();
  base = loopback(server.httpServer);
  browser = await chromium.launch({ headless: true, channel: "chrome" });
});

after(async () => {
  await browser?.close();
  await server?.close();
});

async function withPage(options, run) {
  const context = await browser.newContext({ ...options, serviceWorkers: "block" });
  const page = await context.newPage();
  const outside = [];
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("websocket", (socket) => {
    if (new URL(socket.url()).host !== new URL(base).host) outside.push(socket.url());
  });
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.origin === base && !url.pathname.startsWith("/api/")) return route.continue();
    outside.push(url.href);
    return route.abort();
  });
  try {
    await run(page);
    assert.deepEqual(outside, [], "fixture must have zero external and API requests");
    assert.deepEqual(errors, [], "fixture must have no unhandled browser errors");
  } finally {
    await context.close();
  }
}

function title(page, name) {
  return page.getByRole("heading", { level: 1, name, exact: true }).waitFor();
}

function modifyRoute(url, fields) {
  const page = new URL(url);
  const [route, search] = page.hash.split("?");
  const params = new URLSearchParams(search);
  for (const [key, value] of Object.entries(fields)) {
    if (value === null) params.delete(key);
    else params.set(key, value);
  }
  page.hash = `${route}?${params.toString()}`;
  return page.href;
}

const prototype = "Módulo protótipo Fraunhofer ISE / Oxford PV";
const longi = "Célula de pesquisa LONGi · medição ESTI";
const fraunhofer = "Célula de pesquisa Fraunhofer ISE · TOPCon";
const saitama = "Demonstração Kaneka–Saitama · HJT";

for (const scenario of [
  { name: "desktop light, keyboard", width: 1440, height: 900, colorScheme: "light" },
  { name: "mobile dark", width: 390, height: 844, colorScheme: "dark" },
]) {
  const { name, width, height, colorScheme } = scenario;
  test(`${name}: technology → variant → milestone → measurement → source → return`, async () => {
    await withPage({ viewport: { width, height }, colorScheme }, async (page) => {
      const response = await page.goto(base + fixturePath);
      assert.match(response.headers()["content-security-policy"], /connect-src 'self'/);
      await title(page, "Solar PV");
      const tandem = page.getByRole("link", { name: "Explorar variante tandem perovskita–silício" });
      await tandem.focus();
      await page.keyboard.press("Enter");
      await title(page, "Tandem perovskita–silício");
      await page.getByRole("link", { name: "Investigar os cinco marcos de pesquisa" }).click();
      await title(page, "Marcos de pesquisa");
      assert.equal(await page.locator(".frontier-list > li").count(), 5);
      await page.getByRole("link", { name: longi }).click();
      await title(page, longi);
      const measurement = page.locator("[data-observation]");
      const measurementKey = await measurement.getAttribute("data-observation");
      const version = await measurement.getAttribute("data-version");
      const body = await measurement.innerText();
      assert.match(body, /35,2% ± 1,1 p\.p\./);
      assert.match(body, /0,9994 cm² de área de iluminação designada/);
      assert.match(body, /AM1.5G · 1.000 W\/m² · referência a 25 °C/);
      assert.match(body, /European Solar Test Installation \(JRC-ESTI\)/);
      assert.match(body, /Green et al\., Joule v68/);
      assert.match(body, /35,5% de PCE/);
      assert.doesNotMatch(body, /TRL 6/);

      await page.getByRole("combobox").selectOption("milestone:frontier:ise-oxford-prototype");
      assert.match(await page.getByRole("status").innerText(), /Não comparável.*escalas de dispositivo/s);
      const green = page.getByRole("link", { name: /Tabela 4, entrada da célula tandem LONGi/ });
      await green.focus();
      await page.keyboard.press("Enter");
      const evidence = page.getByRole("region", { name: "Evidência" });
      await evidence.waitFor();
      assert.equal(await page.locator(":focus").getAttribute("id"), "evidence");
      assert.match(await evidence.innerText(), /CC BY-NC 4.0/);
      assert.equal(await evidence.locator("table, figure, img, iframe, [download]").count(), 0);
      assert.equal(await evidence.getByRole("link", { name: "Consultar fonte original" }).getAttribute("href"),
        "https://doi.org/10.1016/j.joule.2026.102494");
      await page.reload();
      await evidence.waitFor();
      await page.getByRole("link", { name: "Voltar à medição" }).click();
      assert.equal(await measurement.getAttribute("data-observation"), measurementKey);
      assert.equal(await measurement.getAttribute("data-version"), version);

      await page.getByRole("link", { name: /Anúncio em 14 jul/ }).click();
      await evidence.waitFor();
      assert.match(await evidence.innerText(), /LONGi/);
      assert.equal(await evidence.getByRole("link", { name: "Consultar fonte original" }).count(), 0);
      await page.goBack();
      await measurement.waitFor();
      await page.getByRole("link", { name: "Voltar aos marcos" }).click();
      await title(page, "Marcos de pesquisa");
      assert.equal(await page.evaluate(() => window.innerWidth), width);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    });
  });
}

test("historical documents stay pinned and restricted or cross-wired direct links fail closed", async () => {
  await withPage({}, async (page) => {
    await page.goto(base + fixturePath + "#/?view=milestones");
    await page.getByRole("link", { name: prototype }).click();
    const measurement = page.locator("[data-observation]");
    const id = await measurement.getAttribute("data-observation");
    assert.match(await measurement.innerText(), /25,00% ± 0,83 p\.p\..*421 ± 13 W/s);
    await page.getByRole("link", { name: "2024-01-31", exact: true }).click();
    assert.equal(await measurement.getAttribute("data-observation"), id);
    assert.equal(await measurement.getAttribute("data-version"), "2024-01-31");
    assert.doesNotMatch(await measurement.innerText(), /0,83 p\.p\.|13 W/);
    await page.getByRole("link", { name: /Comunicado 04/ }).click();
    assert.match(await page.getByRole("region", { name: "Evidência" }).innerText(), /Fraunhofer ISE.*2024-01-31/s);

    await page.getByRole("link", { name: "Marcos de pesquisa", exact: true }).click();
    await page.getByRole("link", { name: longi }).click();
    await page.getByRole("link", { name: /Tabela 4, entrada/ }).click();
    const greenUrl = page.url();
    for (const fields of [
      { output: "reproduction" },
      { version: null },
      { output: "certificate" },
      { document: "document:frontier:invented-certificate", edition: "v1" },
      { edition: "v69" },
      { document: "document:frontier:iea-innovation-2026", edition: "2026" },
    ]) {
      await page.goto(modifyRoute(greenUrl, fields));
      assert.match(await page.getByRole("status").innerText(), /Evidência indisponível/);
      assert.equal(await page.locator("#evidence, table, figure, img, iframe, [download]").count(), 0);
    }
    await page.goto(modifyRoute(greenUrl, { version: "2026-07-15" }));
    await title(page, "Marco indisponível");
  });
});

test("TOPCon route resolves the same evidence and rejects HJT; IEA and site-host attributions are scoped", async () => {
  await withPage({}, async (page) => {
    await page.goto(base + fixturePath + "#/?view=milestones");
    await page.getByRole("link", { name: fraunhofer }).click();
    const measurement = page.locator("[data-observation]");
    const shared = await measurement.getAttribute("data-observation");
    const version = await measurement.getAttribute("data-version");
    await page.getByRole("link", { name: "TOPCon como célula inferior neste marco" }).click();
    await title(page, "TOPCon como célula inferior");
    assert.equal(await page.locator(".frontier-list > li").count(), 2);
    assert.equal(await page.getByRole("link", { name: saitama }).count(), 0);
    await page.getByRole("link", { name: fraunhofer }).click();
    assert.equal(await measurement.getAttribute("data-observation"), shared);
    assert.equal(await measurement.getAttribute("data-version"), version);
    assert.match(await measurement.innerText(), /TRL 6 · IEA.*Fraunhofer ISE TOPCon de 30,6%/s);
    await page.getByRole("link", { name: /p\. 53, avaliação/ }).click();
    assert.match(await page.getByRole("region", { name: "Evidência" }).innerText(), /IEA \(2026\)/);
    await page.getByRole("link", { name: "Voltar à medição" }).click();
    await page.getByRole("link", { name: "Voltar ao vínculo TOPCon" }).click();
    await title(page, "TOPCon como célula inferior");

    await page.getByRole("link", { name: "Marcos de pesquisa", exact: true }).click();
    await page.getByRole("link", { name: saitama }).click();
    const saitamaUrl = page.url();
    const content = await measurement.innerText();
    assert.match(content, /heterojunção \(HJT\)/);
    assert.match(content, /Prefeitura de Saitama \(início\); Kaneka \(quantidade, arquitetura e dimensões\)/);
    assert.match(content, /Demonstração · NIVAR/);
    assert.doesNotMatch(content, /TRL 6/);
    assert.equal(await page.getByRole("link", { name: "TOPCon como célula inferior neste marco" }).count(), 0);
    await page.goto(modifyRoute(saitamaUrl, { via: "topcon" }));
    await title(page, "Marco indisponível");
  });
});

test("ordinary Vite development mode does not mount the local fixture", async () => {
  const standard = await createServer({ mode: "development", server: transport, logLevel: "error" });
  try {
    await standard.listen();
    const page = await browser.newPage();
    try {
      await page.goto(loopback(standard.httpServer) + fixturePath);
      await page.getByText("Este protótipo requer o modo argos-local em 127.0.0.1.").waitFor();
      assert.equal(await page.locator(".frontier").count(), 0);
    } finally {
      await page.close();
    }
  } finally {
    await standard.close();
  }
});
