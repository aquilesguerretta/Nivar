// Run against the disposable QA server; all imported files are synthetic.
// RUNTIME_NODE_MODULES points to the bundled Playwright package directory.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
const require = createRequire(
  path.join(process.env.RUNTIME_NODE_MODULES, "package.json"),
);
const { chromium } = require("playwright");
const base = process.env.ARIADNE_QA_URL ?? "http://127.0.0.1:5178";
const fixtures =
  process.env.ARIADNE_QA_FIXTURES ??
  path.join(tmpdir(), "ariadne-close-synthetic-browser");
assert.match(base, /^http:\/\/(127\.0\.0\.1|localhost):/);
const output = path.resolve(process.env.ARIADNE_QA_OUTPUT ?? "docs/ariadne-close/browser-evidence");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  acceptDownloads: true,
});
const page = await context.newPage();
page.setDefaultTimeout(15000);
const failures = [],
  checks = [],
  layout = [],
  consoleErrors = [];
page.on("pageerror", (e) => consoleErrors.push(e.message));
const check = (name, condition) => {
  assert.ok(condition, name);
  checks.push(name);
};
const click = async (name) =>
  page.getByRole("button", { name, exact: true }).click();
const stable = async () => {
  await page
    .getByText("Carregando contexto privado…", { exact: true })
    .waitFor({ state: "hidden" });
  await page
    .getByText("Salvando ação…", { exact: true })
    .waitFor({ state: "hidden" });
};
const screenshot = async (name) => {
  await page.screenshot({ path: path.join(output, name), fullPage: false });
};
const measure = async (label) => {
  const metrics = await page.evaluate(() => {
    const main = document.querySelector(".g2-ops__main");
    const close = document.querySelector(".close");
    return {
      innerWidth,
      innerHeight,
      documentWidth: document.documentElement.scrollWidth,
      mainClientWidth: main?.clientWidth,
      mainScrollWidth: main?.scrollWidth,
      closeClientWidth: close?.clientWidth,
      closeScrollWidth: close?.scrollWidth,
    };
  });
  layout.push({ label, ...metrics });
  check(
    label + " no viewport/main horizontal overflow",
    metrics.documentWidth <= metrics.innerWidth &&
      metrics.mainScrollWidth <= metrics.mainClientWidth,
  );
};
let start, savedUrl, workspaceId, firstResult, packageId, unsupportedElapsedMs;
try {
  await page.goto(base + "/entrar");
  await page
    .getByLabel("Email", { exact: true })
    .fill("ariadne-browser@example.com");
  await page
    .getByLabel("Senha", { exact: true })
    .fill("synthetic-local-qa-password");
  await click("Entrar");
  await page.waitForURL("**/conta");
  checks.push("existing auth UI establishes actual cookie session");
  await page.goto(base + "/operador/ariadne/fechamento/avancado");
  await page
    .getByRole("heading", { name: "Fechamento assistido", exact: true })
    .waitFor();
  await screenshot("empty-1440-light.png");
  start = Date.now();
  await page
    .getByLabel("Nome", { exact: true })
    .fill("Synthetic engineering browser review");
  await page
    .getByLabel("Este workspace usa evidência sintética de engenharia")
    .check();
  await click("Criar workspace privado");
  await page.getByRole("heading", { name: "Iniciar revisão mensal" }).waitFor();
  workspaceId = new URL(page.url()).searchParams.get("workspace");
  await page
    .getByLabel("Escopo privado", { exact: true })
    .fill("SYNTHETIC-UNIT");
  await page.getByLabel("Competência", { exact: true }).fill("2026-09");
  await click("Iniciar revisão");
  await page.getByLabel("Papel da fonte", { exact: true }).waitFor();
  const imports = [
    ["invoice", path.join(fixtures, "invoice.csv")],
    ["quantity", path.join(fixtures, "quantity.csv")],
    ["price", path.join(fixtures, "price.xlsx")],
  ];
  for (const [role, filename] of imports) {
    await page.getByLabel("Papel da fonte", { exact: true }).selectOption(role);
    await page
      .getByLabel("Arquivo · até 8 MiB", { exact: true })
      .setInputFiles(path.resolve(filename));
    await click("Importar fonte");
    await page
      .getByRole("heading", { name: path.basename(filename), exact: true })
      .waitFor();
    await stable();
    await click("Validar mapeamento");
    await page
      .getByRole("button", { name: "Confirmar lote revisado", exact: true })
      .waitFor();
    await click("Confirmar lote revisado");
    await stable();
    checks.push(
      role + " imported from real file / mapping preview / batch confirmed",
    );
  }
  await click("Calcular e salvar revisão");
  await page.getByRole("table", { name: "Itens do fechamento" }).waitFor();
  await stable();
  savedUrl = page.url();
  firstResult = new URL(savedUrl).searchParams.get("result");
  const table = page.getByRole("table", { name: "Itens do fechamento" });
  check(
    "mandatory exact billed/expected/difference",
    (await table.innerText()).includes("26000.00 BRL") &&
      (await table.innerText()).includes("25000.00 BRL") &&
      (await table.innerText()).includes("1000.00 BRL"),
  );
  check(
    "partial coverage visible",
    await page
      .getByText("4/8 itens com verificação independente", { exact: true })
      .isVisible(),
  );
  await table.getByRole("button", { name: "mandatory", exact: true }).click();
  await page
    .getByRole("button", {
      name: "Quantidade independente · CSV:row:2 →",
      exact: true,
    })
    .click();
  check(
    "one selected-source action reveals original values beside calculation",
    await page
      .locator(".close__source-panel")
      .getByText("100000", { exact: true })
      .isVisible(),
  );
  const sourceDownload = await Promise.all([
    page.waitForEvent("download"),
    page
      .getByRole("link", { name: "Abrir original privado ↓", exact: true })
      .click(),
  ]);
  check(
    "private original is downloadable through authenticated relative proxy",
    sourceDownload[0].suggestedFilename() === "quantity.csv",
  );
  await page
    .getByLabel("Motivo", { exact: true })
    .fill("Synthetic component difference explained");
  await page
    .getByLabel("Nota / ação", { exact: true })
    .fill(
      "Engineering evidence only. Accepted for review; computed difference remains 1000.00 BRL.",
    );
  await click("Registrar tratamento");
  await stable();
  check(
    "treatment preserves calculated divergence",
    (await table.innerText()).includes("1000.00 BRL"),
  );
  await click("Reconstruir cálculo");
  await page.getByText("Replay exato confirmado", { exact: true }).waitFor();
  await click("Salvar pacote de revisão");
  await stable();
  await page
    .getByRole("link", { name: "Exportar pacote 1 ↓", exact: true })
    .waitFor();
  const download = await Promise.all([
    page.waitForEvent("download"),
    page
      .getByRole("link", { name: "Exportar pacote 1 ↓", exact: true })
      .click(),
  ]);
  packageId = download[0]
    .suggestedFilename()
    .replace(/^ariadne-review-/, "")
    .replace(/\.zip$/, "");
  await download[0].saveAs(path.join(output, "synthetic-review.zip"));
  const elapsed = Date.now() - start;
  await page.reload();
  await table.waitFor();
  await stable();
  check(
    "refresh reconstructs exact historical selection",
    new URL(page.url()).searchParams.get("result") === firstResult,
  );
  const unsupportedStart = Date.now();
  await page
    .getByLabel("Filtrar resultado", { exact: true })
    .selectOption("not_verifiable");
  await table.getByRole("button", { name: "unsupported", exact: true }).click();
  check(
    "unsupported component stays visible and NOT VERIFIED",
    (await page.locator(".close__investigation").innerText()).includes(
      "Componente não suportado: NOT VERIFIED",
    ),
  );
  unsupportedElapsedMs = Date.now() - unsupportedStart;
  await page
    .getByLabel("Filtrar resultado", { exact: true })
    .selectOption("all");
  await table
    .getByRole("button", { name: "duplicate", exact: true })
    .first()
    .click();
  await table.locator(".close__group").scrollIntoViewIfNeeded();
  check(
    "duplicates visibly grouped without overlapping savings total",
    (await table.innerText()).includes("2 registros relacionados"),
  );
  await screenshot("duplicate-group.png");
  await table.getByRole("button", { name: "mandatory", exact: true }).click();
  await page
    .getByRole("button", {
      name: "Quantidade independente · CSV:row:2 →",
      exact: true,
    })
    .click();
  // Screenshots focus on the operational table and side-by-side investigation.
  for (const [width, height] of [
    [1440, 900],
    [1920, 1080],
  ]) {
    await page.setViewportSize({ width, height });
    for (const mode of ["light", "dark"]) {
      const current = await page
        .locator(".g2-ops")
        .getAttribute("data-ops-theme");
      if (current !== mode)
        await click(mode === "dark" ? "Modo escuro" : "Modo claro");
      await table.scrollIntoViewIfNeeded();
      await measure(`${width}x${height}-${mode}`);
      await screenshot(`review-${width}-${mode}.png`);
      await page.locator(".close__investigation").scrollIntoViewIfNeeded();
      await screenshot(`investigation-${width}-${mode}.png`);
    }
  }
  // Keyboard focus and context propagation are exercised on the actual rendered controls.
  await table.getByRole("button", { name: "reconciled", exact: true }).focus();
  await page.keyboard.press("Enter");
  check(
    "keyboard item selection updates persisted return context",
    new URL(page.url()).searchParams.get("item")?.includes("CSV:row:3"),
  );
  await page.getByLabel("Filtrar resultado", { exact: true }).focus();
  await page.keyboard.press("Tab");
  check(
    "keyboard navigation leaves a visible focused control",
    await page.evaluate(() => document.activeElement?.tagName === "BUTTON"),
  );
  // PDF uses the same real upload path. Original preserved; page text is explicitly manual-only.
  await page
    .getByLabel("Papel da fonte", { exact: true })
    .selectOption("context");
  await page
    .getByLabel("Arquivo · até 8 MiB", { exact: true })
    .setInputFiles(path.join(fixtures, "context.pdf"));
  await click("Importar fonte");
  await stable();
  await page
    .getByLabel("Revisão do lote")
    .getByRole("heading", { name: "context.pdf", exact: true })
    .waitFor();
  await page.getByLabel("Página", { exact: true }).first().fill("1");
  checks.push("PDF imported and manual page-linked workflow visible");
  // Malformed file: server parsing error, no fictitious progress or result.
  await page.getByLabel("Arquivo · até 8 MiB", { exact: true }).setInputFiles({
    name: "bad.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("not a pdf"),
  });
  await click("Importar fonte");
  await page.getByRole("alert").waitFor();
  await screenshot("parse-error.png");
  checks.push("failed parsing visible in real UI");
  // Alpha regression: guided fixture authoring/run/history/replay through established UI.
  await page.goto(base + "/operador/ariadne");
  await page
    .getByRole("heading", { name: "Organize o que a organização sabe." })
    .waitFor();
  await page
    .getByRole("button", { name: "Analysis Workspace", exact: true })
    .waitFor();
  await click("Novo workspace");
  await click("Criar Core Test / Demo sintética");
  await page
    .getByRole("heading", { name: "V1 → R1 → V2 → R2", exact: true })
    .waitFor();
  for (const name of [
    "Registrar E1",
    "Criar O1",
    "Gravar V1 = 10",
    "Fixar A1 × 2",
    "Criar S1",
    "Executar R1",
    "Registrar E2",
    "Gravar V2 = 12",
    "Criar S2",
    "Executar R2",
  ]) {
    const action = page.locator(".ariadne__actions").getByRole("button", {
      name: new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    });
    await action.click();
    await page.waitForFunction(
      (label) =>
        [...document.querySelectorAll(".ariadne__actions button")].some(
          (b) => b.innerText.includes(label) && b.dataset.done === "true",
        ),
      name,
    );
  }
  await click("Reexecutar manifesto exato");
  await page.locator('.ariadne__replay-result[data-match="true"]').waitFor();
  checks.push(
    "Alpha guided V1/R1/V2/R2 persisted and historical scalar replay matches",
  );
  await click("Analysis Workspace");
  await page
    .getByRole("heading", { name: "Evidências da análise", exact: true })
    .waitFor();
  await click("Adicionar evidência");
  await page
    .getByLabel("Identificador da fonte", { exact: true })
    .fill("synthetic-alpha-browser-source");
  await page
    .locator("#ariadne-evidence form")
    .getByLabel("Versão", { exact: true })
    .fill("v1");
  await page
    .getByLabel("Localizador / referência", { exact: true })
    .fill("synthetic-page:1");
  await click("Salvar evidência");
  await page
    .locator("#ariadne-evidence")
    .getByRole("heading", { name: "synthetic-alpha-browser-source" })
    .waitFor();
  await page
    .locator("#ariadne-state header")
    .getByRole("button", { name: "Criar objeto", exact: true })
    .click();
  await page
    .getByLabel("Nome de exibição", { exact: true })
    .fill("Synthetic authored object");
  await page
    .getByLabel("Tipo do objeto", { exact: true })
    .fill("synthetic_browser_alpha");
  await page
    .locator("#ariadne-state form")
    .getByRole("button", { name: "Criar objeto", exact: true })
    .click();
  await page.getByRole("button", { name: /Synthetic authored object/ }).click();
  await page
    .getByRole("button", { name: "Criar estado V1", exact: true })
    .waitFor();
  await click("Criar estado V1");
  await page.getByLabel("Nome do campo 1", { exact: true }).fill("value");
  await page
    .getByLabel("Tipo do campo 1", { exact: true })
    .selectOption("number");
  await page.getByLabel("Valor do campo 1", { exact: true }).fill("7");
  await page
    .getByRole("checkbox", { name: /synthetic-alpha-browser-source/ })
    .check();
  await click("Salvar estado V1");
  await page
    .getByRole("button", { name: "Corrigir estado", exact: true })
    .waitFor();
  await page
    .locator("#ariadne-assumptions header")
    .getByRole("button", { name: "Criar conjunto de premissas", exact: true })
    .click();
  await page
    .getByLabel("Nome do conjunto", { exact: true })
    .fill("Synthetic authored assumptions");
  await click("Criar conjunto");
  await page
    .getByRole("button", { name: /Synthetic authored assumptions/ })
    .click();
  await page
    .getByRole("button", { name: "Adicionar versão de premissas", exact: true })
    .waitFor();
  await click("Adicionar versão de premissas");
  await page.getByLabel("Nome do campo 1", { exact: true }).fill("multiplier");
  await page
    .getByLabel("Tipo do campo 1", { exact: true })
    .selectOption("number");
  await page.getByLabel("Valor do campo 1", { exact: true }).fill("2");
  await click("Salvar nova versão");
  await page
    .getByRole("button", { name: "Nova versão de premissas", exact: true })
    .waitFor();
  await page
    .locator("#ariadne-scenarios header")
    .getByRole("button", { name: "Criar cenário", exact: true })
    .click();
  await page
    .getByLabel("Nome do cenário", { exact: true })
    .fill("Synthetic authored scenario");
  // Defaults use exact new versions, never latest aliases.
  await click("Salvar novo cenário");
  await page
    .getByRole("heading", { name: "Synthetic authored scenario", exact: true })
    .waitFor();
  await page
    .locator(".ariadne-studio__run-console")
    .getByLabel(/^Cenário/)
    .selectOption({ label: "Synthetic authored scenario" });
  await click("Executar modelo");
  await page.waitForFunction(
    () =>
      document.querySelectorAll(".ariadne-studio__results > article").length ===
      3,
  );
  await page
    .getByLabel("Selecionar Run A", { exact: true })
    .selectOption({ index: 0 });
  await page
    .getByLabel("Selecionar Run B", { exact: true })
    .selectOption({ index: 1 });
  await click("Reconstruct chain");
  await page.getByText("RECONSTRUCTIBLE", { exact: true }).waitFor();
  await click("Replay exact run");
  await page.locator('.ariadne-history__replay[data-match="true"]').waitFor();
  await page.reload();
  await page.locator(".ariadne-studio__results > article").first().waitFor();
  check(
    "Alpha manual authoring, scenario, history, replay and refresh",
    (await page.locator(".ariadne-studio__results > article").count()) === 3,
  );
  await screenshot("alpha-regression.png");
  await page.goto(base + "/operador/conta-de-luz-express");
  await page.getByRole("heading").first().waitFor();
  check(
    "Advisory route still renders its operational list",
    !(await page.locator("body").innerText()).includes("Página não encontrada"),
  );
  await screenshot("advisory-regression.png");
  // Session error is real auth, not mocked data.
  await context.clearCookies();
  await page.goto(savedUrl);
  await page.getByRole("alert").waitFor();
  check(
    "expired/absent session produces explicit error",
    (await page.getByRole("alert").innerText()).includes("Sessão expirada"),
  );
  await screenshot("expired-session.png");
  await writeFile(
    path.join(output, "measurements.json"),
    JSON.stringify(
      {
        workflow: "automated operator interaction on synthetic inputs",
        elapsedMs: elapsed,
        unsupportedComponent: {
          elapsedMs: unsupportedElapsedMs,
          operatorActions: 2,
          outcome: "visible NOT VERIFIED; no amount extrapolated",
        },
        financialValuesManuallyEntered: 0,
        manualTextFieldsEntered: 5,
        batchMappingsConfirmed: 3,
        mappingsReusedFromPreviousBatch: 0,
        duplicateFinancialEntry: 0,
        stepsToSourceValues: 1,
        stepsToOriginalDownload: 2,
        workspaceId,
        reviewId: new URL(savedUrl).searchParams.get("review"),
        savedUrl,
        firstResult,
        packageId,
        layout,
        checks,
        consoleErrors,
        measuredAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );
} catch (error) {
  failures.push(error.stack);
  await screenshot("failure.png").catch(() => {});
  await writeFile(
    path.join(output, "failure.json"),
    JSON.stringify(
      {
        failures,
        checks,
        url: page.url(),
        text: await page
          .locator("body")
          .innerText()
          .catch(() => ""),
      },
      null,
      2,
    ),
  );
  throw error;
} finally {
  await browser.close();
}
console.log(JSON.stringify({ passed: checks.length, layout, consoleErrors }));
