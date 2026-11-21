import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";
import { createServer } from "vite";

const require = process.env.RUNTIME_NODE_MODULES
  ? createRequire(path.join(process.env.RUNTIME_NODE_MODULES, "package.json"))
  : createRequire(import.meta.url);
const { chromium } = require("playwright");
const output = process.env.ARGOS_J2_QA_OUTPUT ?? path.join(tmpdir(), "niv79-browser-evidence");
const fixture = "/tests/argos-companies-assets/fixture.html";
const serverOptions = { host: "127.0.0.1", port: 41779 };
let server;
let browser;
let origin;

before(async () => {
  await mkdir(output, { recursive: true });
  server = await createServer({ mode: "argos-local", server: serverOptions });
  assert.equal(server.config.server.proxy, undefined);
  await server.listen();
  const address = server.httpServer.address();
  assert.equal(address.address, "127.0.0.1");
  origin = "http://127.0.0.1:" + address.port;
  browser = await chromium.launch({ channel: "chrome", headless: true });
});

after(async () => {
  await browser?.close();
  await server?.close();
});

async function withPage(options, run) {
  const context = await browser.newContext({ locale: "pt-BR", ...options, serviceWorkers: "block" });
  const page = await context.newPage();
  page.setDefaultTimeout(35_000);
  const unexpectedRequests = [];
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await context.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.origin === origin && !url.pathname.startsWith("/api")) return route.continue();
    unexpectedRequests.push(url.origin + url.pathname);
    return route.abort();
  });
  try {
    await run(page);
    assert.deepEqual(unexpectedRequests, [], "Fixture makes no backend or external requests");
    assert.deepEqual(errors, [], "Fixture has no uncaught page errors");
  } finally {
    await context.close();
  }
}

async function heading(page, name) {
  await page.getByRole("heading", { level: 1, name, exact: true }).waitFor();
}

async function setDate(page, value) {
  await page.getByLabel("Data de consulta histórica").fill(value);
  await page.getByRole("button", { name: "Aplicar" }).click();
  await page.waitForURL((url) => url.hash.includes("data=" + value));
}

async function capture(page, name) {
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await page.screenshot({ path: path.join(output, name + ".png"), fullPage: true, animations: "disabled" });
}

for (const variant of [
  { name: "desktop-dark", viewport: { width: 1440, height: 900 }, colorScheme: "dark" },
  { name: "mobile-light", viewport: { width: 390, height: 844 }, colorScheme: "light" },
]) {
  test(variant.name + " follows the investigation and returns with date and denominator intact", async () => {
    await withPage({ viewport: variant.viewport, colorScheme: variant.colorScheme }, async (page) => {
      await page.goto(origin + fixture, { waitUntil: "commit" });
      await heading(page, "Petrobras");
      assert.equal(await page.locator(".j2-frame").getAttribute("data-g2-theme"), variant.colorScheme);
      const legal = page.getByRole("link", { name: /Petróleo Brasileiro S\.A\./ });
      await legal.focus();
      await page.keyboard.press("Enter");
      await heading(page, "Petróleo Brasileiro S.A. — Petrobras");
      await page.getByText("33.000.167/0001-01", { exact: true }).waitFor();
      await page.getByText("0001119639", { exact: true }).waitFor();
      if (variant.colorScheme === "dark") await capture(page, "desktop-legal-entity");

      await page.getByRole("link", { name: /Operação do campo e participação/ }).click();
      await heading(page, "Mero");
      await page.getByRole("row", { name: "Petrobras 38,60%" }).waitFor();
      await page.getByRole("row", { name: "União · área não contratada 3,50%" }).waitFor();
      assert.equal(await page.evaluate(() => innerWidth), variant.viewport.width);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      if (variant.colorScheme === "dark") await capture(page, "desktop-mero-reservoir");

      const denominator = page.getByRole("navigation", { name: "Denominador" });
      await denominator.getByRole("link", { name: "Área contratada" }).click();
      await page.getByRole("row", { name: "Petrobras 40,00%" }).waitFor();
      assert.equal(await page.getByRole("row", { name: /União/ }).count(), 0);
      await denominator.getByRole("link", { name: "Bloco arrematado" }).click();
      await page.getByRole("row", { name: "Petrobras 80,00%" }).waitFor();

      await page.getByRole("link", { name: /Histórico e projeção/ }).click();
      await heading(page, "Histórico de Mero");
      await page.getByText("41,40%", { exact: true }).waitFor();
      await setDate(page, "2026-03-09");
      assert.equal(await page.getByText("Alienação assinada", { exact: true }).count(), 0);
      assert.equal(await page.getByText("41,40%", { exact: true }).count(), 0);
      await setDate(page, "2027-03-04");
      await page.getByText("Pendente de confirmação", { exact: true }).waitFor();
      await page.getByText("41,40%", { exact: true }).waitFor();
      if (variant.colorScheme === "light") await capture(page, "mobile-conditional-transfer");

      const source = page.getByRole("link", { name: "Cronograma · MME", exact: true });
      await source.focus();
      await page.keyboard.press("Enter");
      const evidenceTitle = page.getByRole("heading", { name: "Assinatura da alienação da parcela da União" });
      await evidenceTitle.waitFor();
      await page.waitForFunction(() => document.activeElement?.id === "j2-evidence-title");
      assert.match(await page.getByRole("link", { name: "Abrir fonte original" }).getAttribute("href"), /^https:\/\/www\.gov\.br\/mme\//);
      assert.equal(await page.getByText("01/03/2027", { exact: true }).count(), 1);
      if (variant.colorScheme === "dark") await capture(page, "desktop-transfer-evidence");
      await page.keyboard.press("Shift+Tab");
      await page.keyboard.press("Enter");
      await page.waitForFunction(() => document.activeElement?.id === "j2-evidence-transfer-schedule");
      await page.getByRole("link", { name: /Voltar às participações/ }).click();
      await heading(page, "Mero");
      assert.equal(await page.getByLabel("Data de consulta histórica").inputValue(), "2027-03-04");
      assert.equal(await denominator.getByRole("link", { name: "Bloco arrematado" }).getAttribute("aria-current"), "page");
      await denominator.getByRole("link", { name: "Jazida compartilhada" }).click();
      await page.getByRole("row", { name: "Petrobras 38,60%" }).waitFor();
      assert.equal(await page.getByRole("row", { name: /41,40%/ }).count(), 0);
    });
  });
}

test("visible Mero evidence matches the selected denominator and preserves the replay context", async () => {
  await withPage({}, async (page) => {
    const replayDate = "2027-03-04";
    await page.goto(origin + fixture + "#/mero", { waitUntil: "commit" });
    await heading(page, "Mero");
    await setDate(page, replayDate);

    const anp = "Composição contratual · ANP";
    const operator = ["Operadora do campo · ANP", "field-operator"];
    const scopes = [
      ["Jazida compartilhada", [
        [anp, "contract-split"],
        ["Jazida compartilhada · Form 20-F", "reservoir-split"],
        ["Ver comunicado", "transfer-signing"],
        operator,
      ]],
      ["Bloco arrematado", [["Resultado do leilão · Petrobras", "auction-allocation"], operator]],
      ["Área contratada", [[anp, "contract-split"], operator]],
    ];
    const navigation = page.getByRole("navigation", { name: "Denominador" });

    for (const [scope, claims] of scopes) {
      const denominator = navigation.getByRole("link", { name: scope, exact: true });
      await denominator.click();
      const returnUrl = page.url();
      if (scope === "Bloco arrematado") {
        assert.equal(await page.getByRole("link", { name: anp, exact: true }).count(), 0);
      }
      assert.equal(await page.getByRole("link").and(page.locator("a[href*='evidencia=']")).count(), claims.length, scope);

      for (const [label, claim] of claims) {
        await page.getByRole("link", { name: label, exact: true }).click();
        const back = page.getByRole("link", { name: "Voltar à consulta", exact: true });
        const panel = page.getByRole("complementary").filter({ has: back });
        await panel.getByText("Referências da evidência", { exact: true }).click();
        await panel.getByText("niv79:claim:" + claim + ":v1", { exact: true }).waitFor();
        await back.click();
        await panel.waitFor({ state: "hidden" });
        assert.equal(page.url(), returnUrl);
        assert.equal(await denominator.getAttribute("aria-current"), "page");
        assert.equal(await page.getByLabel("Data de consulta histórica").inputValue(), replayDate);
      }
    }

    await page.getByRole("link", { name: /Histórico e projeção/ }).click();
    await heading(page, "Histórico de Mero");
    assert.equal(await page.getByLabel("Data de consulta histórica").inputValue(), replayDate);
    const projection = page.locator(".j2-projection");
    await projection.getByText("Pendente de confirmação", { exact: true }).waitFor();
    await projection.getByText("Petrobras · se efetivada", { exact: true }).waitFor();
    await projection.getByText("41,40%", { exact: true }).waitFor();
  });
});

test("FPSO and Brazil Map links preserve the field and reject unrelated evidence links", async () => {
  await withPage({}, async (page) => {
    await page.goto(origin + fixture + "#/mero");
    await heading(page, "Mero");
    const fieldRef = await page.locator("[data-object-ref]").getAttribute("data-object-ref");
    await page.getByRole("link", { name: /Marechal Duque de Caxias/ }).click();
    await heading(page, "Marechal Duque de Caxias");
    assert.notEqual(await page.locator("[data-object-ref]").getAttribute("data-object-ref"), fieldRef);
    await page.getByText("MISC Offshore (Singapore) Pte. Ltd.", { exact: true }).waitFor();
    await page.getByText("MISC Serviços de Petróleo do Brasil Ltda.", { exact: true }).waitFor();
    await page.getByRole("link", { name: "Ficha técnica · MISC" }).click();
    await page.getByText("Data não identificada", { exact: true }).waitFor();
    await page.goBack();
    await page.getByRole("link", { name: /Mapa Corporativo do Brasil/ }).click();
    await heading(page, "Mapa Corporativo do Brasil");
    assert.equal(await page.locator("[data-object-ref]").getAttribute("data-object-ref"), fieldRef);
    assert.equal(await page.locator("canvas, iframe, [data-latitude], [data-longitude]").count(), 0);
    await page.getByRole("link", { name: /Voltar a Mero/ }).click();
    await heading(page, "Mero");
    await page.goto(origin + fixture + "#/mero/historico?data=2026-03-09&evidencia=transfer-schedule");
    await page.getByRole("status").getByText(/Evidência indisponível/).waitFor();
    assert.equal(await page.getByRole("link", { name: "Abrir fonte original" }).count(), 0);
    await page.goto(origin + fixture + "#/mero?data=2027-03-01&effectiveOn=2027-03-01&status=completed");
    await page.getByRole("row", { name: "Petrobras 38,60%" }).waitFor();
    assert.equal(await page.getByRole("row", { name: /41,40%/ }).count(), 0);
  });
});
