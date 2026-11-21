// Local integration only. Reuses the optional Playwright runtime used by Ariadne QA.
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { createRequire } from "node:module";
import path from "node:path";
import { after, before, test } from "node:test";

const require = createRequire(path.join(process.env.RUNTIME_NODE_MODULES, "package.json"));
const { chromium } = require("playwright");
const origin = new URL(process.env.NIV66_BROWSER_URL ?? "http://127.0.0.1:5167");
assert.equal(origin.protocol, "http:");
assert.equal(origin.hostname, "127.0.0.1");

const realMode = process.env.NIV66_BROWSER_REAL === "1";
const email = process.env.NIV66_BROWSER_OPERATOR;
assert.ok(email, "Set NIV66_BROWSER_OPERATOR to the disposable operator email");
const password = randomBytes(32).toString("hex");
const mapPath = "/br/mapa-corporativo";
const terminalPath = "/br/terminal/ativos";
const apiPath = "/api/operator/argos/belo-monte";
const sourceCode = realMode ? "PAPI--0UG01" : "TEST-NIV65-UG01";
const siteName = realMode ? "Pimental" : "Pimental (dados sintéticos)";
let browser;

before(async () => {
  browser = await chromium.launch({
    headless: true,
    executablePath: process.env.NIV66_BROWSER_CHROME || undefined,
  });
});
after(async () => {
  await browser?.close();
});

async function inspectUnit(page) {
  await page.getByRole("heading", { name: siteName + " · UG 01", exact: true }).waitFor();
  await page.getByText("Identidade verificada nesta versão", { exact: true }).waitFor();
  const details = page.locator(".bm-evidence");
  if (await details.getAttribute("open") === null) {
    await details.getByText("Verificar evidência", { exact: true }).click();
  }
  const asset = await details.getByText(/^Referência do ativo/).locator("code").innerText();
  const observation = await details.getByText(/^Observação ·/).locator("code").innerText();
  const snapshot = await detailValue(details, "Versão do snapshot");
  assert.equal(await page.getByText("Concessionária no contrato original", { exact: true }).count(), 0);
  const url = new URL(page.url());
  assert.equal(asset, "asset:ons:cod_equipamento:" + sourceCode);
  assert.ok(observation.startsWith(asset + ":"));
  assert.ok(observation.endsWith(":" + snapshot));
  assert.equal(url.searchParams.get("asset"), asset);
  return { asset, observation, snapshot, knownAt: url.searchParams.get("known_at") };
}

function detailValue(details, name) {
  return details.getByText(name, { exact: true }).locator("xpath=following-sibling::dd[1]").innerText();
}

async function handoff(page, title, destination) {
  await page.getByRole("link", { name: "Abrir em " + title + " →", exact: true }).click();
  await page.waitForURL(url => url.pathname === destination);
  return inspectUnit(page);
}

async function assertDenied(response) {
  assert.equal(response.status(), 401);
  assert.equal(response.headers()["cache-control"], "private, no-store");
}

for (const [width, height, tone] of [[1440, 900, "graphite"], [390, 844, "paper"]]) {
  test("real Map ↔ Terminal routes, " + tone + " " + width + "×" + height, { timeout: 120_000 }, async () => {
    const context = await browser.newContext({ baseURL: origin.origin, viewport: { width, height } });
    try {
      await context.route("**/*", route =>
        new URL(route.request().url()).origin === origin.origin ? route.continue() : route.abort());
      const denied = await context.request.get(apiPath);
      await assertDenied(denied);
      assert.equal(denied.headers()["x-niv66-browser-fixture"], realMode ? undefined : "synthetic");

      const signup = await context.request.post("/api/auth/signup", {
        data: { email, password, name: "NIV-66 browser QA" },
      });
      if (signup.status() === 409) {
        const login = await context.request.post("/api/auth/login", { data: { email, password } });
        assert.equal(login.status(), 200);
      } else {
        assert.equal(signup.status(), 201);
      }

      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(mapPath);
      await page.getByRole("heading", { name: "Complexo Hidrelétrico de Belo Monte" }).waitFor();
      const inspector = page.locator(".bm-inspector");
      if (await inspector.getAttribute("data-tone") !== tone) {
        await page.getByRole("button", { name: /Usar tema/ }).click();
      }
      assert.equal(await inspector.getAttribute("data-tone"), tone);
      assert.equal(await page.evaluate(() => window.innerWidth), width);
      assert.ok(await inspector.evaluate(el => el.scrollWidth <= el.clientWidth));

      await page.getByText("Concessionária no contrato original", { exact: true }).waitFor();
      await page.getByText("Verificar evidência", { exact: true }).click();
      await page.getByRole("link", { name: /Extrato republicado do Contrato de Concessão/ }).waitFor();
      await page.getByRole("link", { name: /enquadramento no REIDI/ }).waitFor();

      const selector = page.getByLabel("Versão disponível no Argos Memory");
      const choices = await selector.locator("option").evaluateAll(options => options.map(option => option.value));
      if (!realMode) {
        assert.equal(choices.length, 4);
        await selector.selectOption(choices[1]);
      }
      await page.getByRole("button", { name: siteName + " · " }).click();
      await page.getByRole("button", { name: "UG 01", exact: true }).click();
      await page.getByText(realMode ? "38,85 MW" : "99,50 MW", { exact: true }).waitFor();
      const selected = await inspectUnit(page);
      if (!realMode) assert.equal(selected.knownAt, choices[1]);
      const terminal = await handoff(page, "Terminal Brasil", terminalPath);
      assert.equal(terminal.asset, selected.asset);
      assert.equal(terminal.observation, selected.observation);
      assert.equal(terminal.snapshot, selected.snapshot);
      if (selected.knownAt) assert.equal(terminal.knownAt, selected.knownAt);
      assert.deepEqual(await handoff(page, "Brazil Corporate Energy Map", mapPath), terminal);

      if (!realMode) {
        await selector.selectOption(choices[2]);
        await page.getByText("100,00 MW", { exact: true }).waitFor();
        const historical = await inspectUnit(page);
        assert.equal(historical.knownAt, choices[2]);
        assert.equal(historical.asset, selected.asset);
        assert.notEqual(historical.snapshot, selected.snapshot);
        assert.notEqual(historical.observation, selected.observation);
        assert.deepEqual(await handoff(page, "Terminal Brasil", terminalPath), historical);
        const details = page.locator(".bm-evidence");
        assert.equal(await detailValue(details, "Conjunto de dados ONS"), "Alterado");
        assert.equal(await detailValue(details, "Registros de Belo Monte"), "Sem alteração identificada");
        assert.deepEqual(await handoff(page, "Brazil Corporate Energy Map", mapPath), historical);

        await selector.selectOption("");
        await page.getByRole("button", { name: "UG 02", exact: true }).click();
        await assertUnresolved(page);
        const unresolved = new URL(page.url());
        unresolved.pathname = terminalPath;
        await page.goto(unresolved.href);
        await assertUnresolved(page);
      }

      const reopen = new URL(terminalPath, origin);
      reopen.search = new URLSearchParams({ asset: terminal.asset, version: terminal.snapshot });
      if (terminal.knownAt) reopen.searchParams.set("known_at", terminal.knownAt);
      await page.goto("/conta");
      await page.getByRole("button", { name: "Acesso e segurança", exact: true }).click();
      await page.getByRole("button", { name: "Sair da conta", exact: true }).click();
      await page.waitForURL(url => url.pathname !== "/conta");
      await page.goto(reopen.href);
      await page.getByText("Entre com uma conta autorizada para consultar esta evidência.").waitFor();
      assert.equal(await page.locator(".bm-evidence").count(), 0);
      await assertDenied(await context.request.get(apiPath));
      assert.deepEqual(errors, []);
    } finally {
      await context.close();
    }
  });
}

async function assertUnresolved(page) {
  await page.getByText("Vínculo da unidade não resolvido", { exact: true }).waitFor();
  assert.equal(await page.getByRole("link", { name: /^Abrir em / }).count(), 0);
  assert.equal(await page.getByText(/^Observação ·/).count(), 0);
}
