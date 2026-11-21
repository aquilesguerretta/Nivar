import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { after, before, test } from "node:test";
import { createServer, preview } from "vite";

const require = process.env.RUNTIME_NODE_MODULES
  ? createRequire(path.join(process.env.RUNTIME_NODE_MODULES, "package.json"))
  : createRequire(import.meta.url);
const { chromium } = require("playwright");
const fixture = "/tests/argos-current-energy/fixture.html";
const host = "127.0.0.1";
const cutoff = "2026-11-18T04:15:59Z";
let server;
let browser;
let origin;

function loopbackUrl(httpServer) {
  const address = httpServer.address();
  assert.equal(address.address, "127.0.0.1");
  return "http://127.0.0.1:" + address.port;
}

before(async () => {
  server = await createServer({ mode: "argos-local", server: { host, strictPort: false } });
  assert.equal(server.config.server.proxy, undefined);
  await server.listen();
  origin = loopbackUrl(server.httpServer);
  browser = await chromium.launch({ headless: true, channel: "chrome" });
});

after(async () => {
  await browser?.close();
  await server?.close();
});

async function withPage(options, run, allowedOrigin = origin) {
  const context = await browser.newContext({ ...options, serviceWorkers: "block" });
  const page = await context.newPage();
  page.setDefaultTimeout(45_000);
  const denied = [];
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.origin === allowedOrigin && !/^\/api(?:\/|$)/.test(url.pathname)) return route.continue();
    denied.push(url.href);
    await route.abort();
  });
  page.on("websocket", (socket) => {
    const url = new URL(socket.url());
    if (url.host !== new URL(allowedOrigin).host) denied.push(socket.url());
  });
  try {
    await run(page);
    assert.deepEqual(denied, [], "no external or API requests");
    assert.deepEqual(errors, [], "no browser errors");
  } finally {
    await context.close();
  }
}

const headings = [
  "China adota controles de exportação de terras raras",
  "Anúncio 18/2025 · Original em chinês",
  "NdFeB com disprósio",
  "Motores e geradores de ímã permanente",
  "China",
];

async function expectHeading(page, name) {
  const heading = page.getByRole("heading", { level: 1, name, exact: true });
  await heading.waitFor();
  assert.equal(await page.locator("header time").getAttribute("datetime"), cutoff);
  return heading;
}

for (const { label, width, height, colorScheme } of [
  { label: "desktop dark", width: 1440, height: 900, colorScheme: "dark" },
  { label: "mobile light", width: 390, height: 844, colorScheme: "light" },
]) {
  test(label + ": forward and reverse J3, evidence metadata, keyboard and zero API traffic", async () => {
    await withPage({ viewport: { width, height }, colorScheme }, async (page) => {
      const response = await page.goto(origin + fixture, { waitUntil: "commit" });
      assert.match(response.headers()["content-security-policy"], /default-src 'self'/);
      await expectHeading(page, headings[0]);
      assert.match(await page.locator("main").innerText(), /Efeito empresarial não estabelecido/);
      assert.equal(await page.locator('[data-event]').count(), 6);
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      assert.match(await page.locator(":focus").innerText(), /Registro oficial do ato/);
      await page.keyboard.press("Enter");
      const heading = await expectHeading(page, headings[1]);
      await page.waitForFunction(() => document.activeElement === document.querySelector("h1"));
      assert.equal(await heading.evaluate((node) => document.activeElement === node), true);
      assert.match(await page.locator("[data-document]").innerText(), /CN\/MOFCOM \+ GACC\/Announcement\/2025\/18/);
      await page.getByRole("link", { name: "Verificar evidências" }).click();
      await expectHeading(page, "Evidências");
      await page.getByText("Anúncio 18/2025 · Versão oficial em inglês para referência", { exact: true }).click();
      const translation = page.locator('[data-document$="-18-en"]');
      assert.match(await translation.innerText(), /para referência.*original em chinês é autêntico/i);
      assert.match(await translation.innerText(), /Publicação da página\s+UNKNOWN/);
      await page.getByRole("link", { name: "Voltar: " + headings[1], exact: true }).click();
      await expectHeading(page, headings[1]);
      await page.getByRole("link", { name: "Item legalmente controlado · " + headings[2] }).click();
      await expectHeading(page, headings[2]);
      assert.match(await page.locator("main").innerText(), /1C905\.a\.4.*ímã ou pó magnético/);
      const itemClaim = await page.locator("[data-claim]").getAttribute("data-claim");
      await page.getByRole("link", { name: "Aplicação técnica do material · " + headings[3] }).click();
      await expectHeading(page, headings[3]);
      assert.match(await page.locator("main").innerText(), /Segundo a FAQ 5.*geralmente/);
      await page.getByRole("link", { name: "Verificar evidências" }).click();
      await expectHeading(page, "Evidências");
      await page.getByText(/Rare Earth Permanent Magnets.*paginação impressa/).click();
      const technical = page.locator('[data-source="j3:source:us-doe"]');
      assert.match(await technical.innerText(), /U\.S\. Department of Energy/);
      assert.match(await technical.innerText(), /download e API pendentes/);
      assert.equal(await page.locator('a[href^="http"], [download], iframe, object, img').count(), 0);
      await page.getByRole("link", { name: "Voltar: " + headings[3], exact: true }).click();
      await expectHeading(page, headings[3]);
      await page.getByRole("link", { name: "Jurisdição do ato · China", exact: true }).click();
      await expectHeading(page, headings[4]);
      assert.match(await page.locator("main").innerText(), /jurisdição da medida de licenciamento/);
      await page.getByRole("link", { name: "Verificar evidências" }).click();
      await expectHeading(page, "Evidências");
      await page.getByText(/Registro de políticas do MOFCOM · Campo/).click();
      assert.match(await page.locator('[data-source="j3:source:mofcom-policy-register"]').innerText(), /Coleta automatizada proibida/);
      assert.deepEqual(await page.evaluate(() => [window.innerWidth, document.documentElement.scrollWidth]), [width, width]);
      await page.reload();
      await expectHeading(page, "Evidências");
      await page.getByRole("link", { name: "Voltar: China", exact: true }).click();
      await expectHeading(page, headings[4]);
      for (const title of headings.slice(0, -1).reverse()) {
        await page.getByRole("link", { name: "Voltar: " + title, exact: true }).click();
        await expectHeading(page, title);
        if (title === headings[2]) assert.equal(await page.locator("[data-claim]").getAttribute("data-claim"), itemClaim);
      }
      await page.goBack();
      await expectHeading(page, headings[1]);
      await page.goForward();
      await expectHeading(page, headings[0]);
    });
  });
}

test("later legal action has its own source, interval and evidence return; restricted paths fail closed", async () => {
  await withPage({}, async (page) => {
    await page.goto(origin + fixture);
    await expectHeading(page, headings[0]);
    const actionTitle = "Anúncio 58/2026 · Continuação da suspensão";
    await page.getByRole("link", { name: actionTitle }).click();
    await expectHeading(page, actionTitle);
    const text = await page.locator("main").innerText();
    assert.match(text, /55\/2025, 56\/2025, 57\/2025, 58\/2025, 61\/2025, 62\/2025/);
    assert.match(text, /Anúncio 18\/2025 está fora dessa lista/);
    for (const date of ["2026-11-09", "2026-11-11", "2027-01-10"]) {
      assert.ok(await page.locator('time[datetime="' + date + '"]').count(), date);
    }
    await page.getByRole("link", { name: "Verificar evidências" }).click();
    await expectHeading(page, "Evidências");
    await page.getByRole("link", { name: "Voltar: " + actionTitle }).click();
    await expectHeading(page, actionTitle);
    await page.getByRole("link", { name: "Voltar ao evento", exact: true }).click();
    await expectHeading(page, headings[0]);
    await page.getByRole("link", { name: /Anúncio 52\/2026/ }).click();
    await page.getByRole("link", { name: /GACC 123\/2025/ }).click();
    assert.match(await page.locator("main").innerText(), /Republicação consultada/);
    for (const hash of ["#evidencias/raw", "#cronologia/2025-58", "#topcon", "#empresa"]) {
      await page.evaluate((target) => { window.location.hash = target; }, hash);
      await expectHeading(page, "Referência indisponível");
      assert.equal(await page.locator("[data-document], [data-claim]").count(), 0);
    }
  });
});

test("fixture denies rendering through the localhost alias", async () => {
  const alias = origin.replace("127.0.0.1", "localhost");
  await withPage({}, async (page) => {
    await page.goto(alias + fixture);
    await page.getByText("Disponível no servidor local de desenvolvimento.").waitFor();
    assert.equal(await page.locator("main").count(), 0);
    const resources = await page.evaluate(() => performance.getEntriesByType("resource").map((entry) => entry.name));
    assert.ok(resources.every((url) => !url.includes("/src/features/argos-current-energy/")));
  }, alias);
});

test("standard dist and preview contain no J3 fixture, source identity or content", async () => {
  const files = await readdir("dist", { recursive: true, withFileTypes: true });
  const artifacts = files.filter((file) => file.isFile());
  assert.ok(artifacts.some((file) => file.name === "index.html"));
  assert.ok(artifacts.some((file) => file.name.endsWith(".js")));
  const markers = /argos-current-energy|j3:document:|1C905\.a\.4|art_46a13d76cf7243b7af4394ecbdf13b90|2026-11-18T04:15:59Z/;
  for (const file of artifacts) {
    assert.doesNotMatch(path.join(file.parentPath, file.name), markers);
    if (/\.(html|m?js|css|json|map)$/.test(file.name)) {
      assert.doesNotMatch(await readFile(path.join(file.parentPath, file.name), "utf8"), markers, file.name);
    }
  }
  const compiled = await preview({ preview: { host, port: 0, proxy: {} } });
  try {
    const url = loopbackUrl(compiled.httpServer);
    const index = await fetch(url).then((response) => response.text());
    const result = await fetch(url + fixture);
    const body = await result.text();
    // Vite Preview may serve its generic SPA fallback for this path.
    assert.ok(result.status === 404 || body === index);
    assert.doesNotMatch(body, markers);
  } finally {
    await compiled.close();
  }
});
