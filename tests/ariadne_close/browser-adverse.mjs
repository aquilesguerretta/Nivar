// Real authenticated browser/server with synthetic files. Run browser.mjs first.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
const { chromium } = createRequire(
  path.join(process.env.RUNTIME_NODE_MODULES, "package.json"),
)("playwright");
const evidence = path.resolve(process.env.ARIADNE_QA_OUTPUT ?? "docs/ariadne-close/browser-evidence");
const previous = JSON.parse(
  await readFile(path.join(evidence, "measurements.json"), "utf8"),
);
const base = process.env.ARIADNE_QA_URL ?? "http://127.0.0.1:5178";
assert.match(base, /^http:\/\/(127\.0\.0\.1|localhost):/);
const files =
  process.env.ARIADNE_QA_FIXTURES ??
  path.join(tmpdir(), "ariadne-close-synthetic-browser");
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  acceptDownloads: true,
});
const page = await context.newPage();
page.setDefaultTimeout(15000);
const checks = [],
  layouts = [],
  errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const check = (name, actual) => {
  assert.ok(actual, name);
  checks.push(name);
};
const click = (name) => page.getByRole("button", { name, exact: true }).click();
const stable = async () => {
  await page
    .getByText("Salvando ação…", { exact: true })
    .waitFor({ state: "hidden" });
  await page
    .getByText("Carregando contexto privado…", { exact: true })
    .waitFor({ state: "hidden" });
};
const table = page.getByRole("table", { name: "Itens do fechamento" });
const root = `/api/operator/ariadne/workspaces/${previous.workspaceId}/close/reviews/${previous.reviewId}`;
const json = async (url) => {
  const response = await context.request.get(base + url);
  assert.equal(response.status(), 200);
  return response.json();
};
const importFile = async (role, filename) => {
  await page.getByLabel("Papel da fonte", { exact: true }).selectOption(role);
  await page
    .getByLabel("Arquivo · até 8 MiB", { exact: true })
    .setInputFiles(filename);
  await click("Importar fonte");
  await page
    .getByLabel("Revisão do lote")
    .getByRole("heading", { name: path.basename(filename), exact: true })
    .waitFor();
  await stable();
};
const confirm = async () => {
  await click("Validar mapeamento");
  await page
    .getByRole("button", { name: "Confirmar lote revisado", exact: true })
    .waitFor();
  await click("Confirmar lote revisado");
  await page.getByLabel("Revisão do lote").waitFor({ state: "hidden" });
  await stable();
};
const image = (name) => page.screenshot({ path: path.join(evidence, name) });
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
  await page.goto(previous.savedUrl);
  await table.waitFor();
  await stable();
  const oldExport = await context.request.get(
    base + root + `/packages/${previous.packageId}/export`,
  );
  const oldBytes = await oldExport.body();
  assert.equal(oldExport.status(), 200);
  const detailBefore = await json(root);
  // Transport fails only AFTER real endpoint committed. Automatic retry reuses same key.
  const keys = [];
  let lost = false;
  await page.route("**/calculate", async (route) => {
    keys.push(route.request().headers()["idempotency-key"]);
    if (!lost) {
      lost = true;
      const response = await route.fetch();
      assert.equal(response.status(), 201);
      await route.abort("failed");
    } else await route.continue();
  });
  await click("Calcular e salvar revisão");
  await page.waitForURL(
    (url) => url.searchParams.get("result") !== previous.firstResult,
  );
  await table.waitFor();
  await stable();
  await page.unroute("**/calculate");
  check(
    "real committed calculation / lost response / retry commits exactly once",
    keys.length === 2 &&
      keys[0] === keys[1] &&
      (await json(root)).calculations.length ===
        detailBefore.calculations.length + 1,
  );
  // Correction uses a new file. Old result and old export remain immutable.
  await page
    .getByLabel("Papel da fonte", { exact: true })
    .selectOption("invoice");
  await page
    .getByLabel("Correção de fonte", { exact: true })
    .selectOption({ label: "invoice.csv" });
  await page
    .getByLabel("Arquivo · até 8 MiB", { exact: true })
    .setInputFiles(path.join(files, "invoice-revised.csv"));
  await click("Importar fonte");
  await page.getByLabel("Revisão do lote").waitFor();
  await confirm();
  await click("Calcular e salvar revisão");
  await table.waitFor();
  await page.waitForFunction(() =>
    document
      .querySelector('table[aria-label="Itens do fechamento"]')
      ?.innerText.includes("0.00 BRL"),
  );
  await stable();
  const correctedUrl = page.url(),
    correctedId = new URL(correctedUrl).searchParams.get("result");
  const corrected = await json(root + `/calculations/${correctedId}`);
  check(
    "revised invoice computes a new reconciled mandatory component",
    corrected.output.items.find((i) => i.itemKey === "mandatory").independent
      .difference === "0.00",
  );
  await page
    .getByLabel("Cálculo histórico", { exact: true })
    .selectOption(previous.firstResult);
  await table.waitFor();
  await stable();
  check(
    "old calculation reload retains 1000.00 difference",
    (await table.innerText()).includes("1000.00 BRL"),
  );
  await click("Reconstruir cálculo");
  await page.getByText("Replay exato confirmado", { exact: true }).waitFor();
  const stillOld = await context.request.get(
    base + root + `/packages/${previous.packageId}/export`,
  );
  check(
    "export bytes unchanged after correction and new execution",
    oldBytes.equals(await stillOld.body()),
  );
  // Duplicate import visibly recovers original source without adding a new one.
  const beforeDuplicate = (await json(root)).sources.length;
  await importFile("invoice", path.join(files, "invoice-revised.csv"));
  await page
    .getByText("Fonte duplicada: original recuperado.", { exact: true })
    .waitFor();
  check(
    "duplicate file returns original source",
    (await json(root)).sources.length === beforeDuplicate,
  );
  await table.getByRole("button", { name: "mandatory", exact: true }).click();
  await page
    .getByRole("button", {
      name: "Quantidade independente · CSV:row:2 →",
      exact: true,
    })
    .click();
  await page
    .getByLabel("Nota / ação", { exact: true })
    .fill("Must not carry to another item");
  await page
    .getByLabel("Filtrar resultado", { exact: true })
    .selectOption("not_verifiable");
  check(
    "filter fallback clears source and treatment draft",
    (await page.getByLabel("Nota / ação", { exact: true }).inputValue()) ===
      "" &&
      !(await page.locator(".close__source-panel").innerText()).includes(
        "100000",
      ),
  );
  // New workspace for ambiguity, PDF and long-content cases.
  await page.getByLabel("Workspace privado", { exact: true }).selectOption("");
  await page
    .getByLabel("Nome", { exact: true })
    .fill("Synthetic adverse browser review");
  await page
    .getByLabel("Este workspace usa evidência sintética de engenharia")
    .check();
  await click("Criar workspace privado");
  await page
    .getByLabel("Escopo privado", { exact: true })
    .fill("SYNTHETIC-UNIT");
  await page.getByLabel("Competência", { exact: true }).fill("2026-09");
  await click("Iniciar revisão");
  await page.getByLabel("Papel da fonte", { exact: true }).waitFor();
  const secondWorkspace = new URL(page.url()).searchParams.get("workspace");
  const secondReview = new URL(page.url()).searchParams.get("review");
  await importFile("invoice", path.join(files, "ambiguous.csv"));
  let release, seen;
  const held = new Promise((r) => (release = r));
  const requested = new Promise((r) => (seen = r));
  let intercepted = false;
  await page.route("**/candidates", async (route) => {
    if (!intercepted) {
      intercepted = true;
      const response = await route.fetch();
      seen();
      await held;
      await route.fulfill({ response }).catch(() => {});
    } else await route.continue();
  });
  await click("Validar mapeamento");
  await requested;
  await page
    .getByLabel("Formato numérico", { exact: true })
    .selectOption("dot");
  await click("Validar mapeamento");
  await page
    .getByText(
      "2/3 linhas elegíveis selecionadas. As demais permanecem excluídas e visíveis.",
      { exact: true },
    )
    .waitFor();
  release();
  await page.unroute("**/candidates");
  check(
    "out-of-order validation response cannot replace newer mapping",
    await page.getByLabel("Confirmar linha 3", { exact: true }).isChecked(),
  );
  check(
    "ambiguous scope/period row remains disabled and blank remains blank",
    (await page
      .getByLabel("Confirmar linha 1", { exact: true })
      .isDisabled()) &&
      (await page.getByLabel("Revisão do lote").innerText()).includes("vazio"),
  );
  await image("ambiguous-review.png");
  await click("Confirmar lote revisado");
  await page.getByLabel("Revisão do lote").waitFor({ state: "hidden" });
  await stable();
  await importFile("context", path.join(files, "context.pdf"));
  await page
    .locator(".close__source-panel")
    .getByLabel("Página", { exact: true })
    .selectOption("2");
  check(
    "preserved PDF page navigation selects actual native page 2",
    (await page.locator(".close__source-panel pre").innerText()).includes(
      "PAGE 2",
    ),
  );
  // Source-linked manual record: no automatic field extraction is claimed.
  const batch = page.getByLabel("Revisão do lote");
  await batch.getByLabel("Página", { exact: true }).fill("2");
  for (const [field, value] of Object.entries({
    item_key: "manual-context",
    component: "context",
    scope: "SYNTHETIC-UNIT",
    period: "2026-09",
  }))
    await batch.getByLabel(field, { exact: true }).fill(value);
  await click("Adicionar registro da página");
  await confirm();
  const secondRoot = `/api/operator/ariadne/workspaces/${secondWorkspace}/close/reviews/${secondReview}`;
  const native = (await json(secondRoot)).sources.find(
    (s) => s.filename === "context.pdf",
  );
  check(
    "PDF manual confirmation preserves page locator and typed raw values",
    native.confirmation.rows[0].locator === "page:2/manual:1" &&
      native.confirmation.manualRows[0].item_key === "manual-context",
  );
  await importFile("context", path.join(files, "scanned.pdf"));
  check(
    "scanned PDF is explicitly identified without fake extraction",
    (await page.locator(".close__source-panel").innerText()).includes(
      "Escaneado/sem texto nativo",
    ),
  );
  await image("scanned-source.png");
  await importFile("invoice", path.join(files, "invalid-metadata.csv"));
  await confirm();
  await importFile("invoice", path.join(files, "long.csv"));
  await confirm();
  await click("Calcular e salvar revisão");
  await table.waitFor();
  await stable();
  await table
    .getByRole("button", { name: "Sem identificação", exact: true })
    .click();
  check(
    "invalid item identifier remains inspectable without React failure",
    (await page.locator(".close__investigation").innerText()).includes(
      "Sem identificação",
    ),
  );
  const foreign = table
    .getByRole("row")
    .filter({
      has: page.getByRole("button", { name: "foreign-currency", exact: true }),
    });
  check(
    "unsupported currency remains USD and never becomes canonical BRL",
    (await foreign.innerText()).includes("100 USD") &&
      !(await foreign.innerText()).includes("100.00 BRL"),
  );
  await table.getByRole("button", { name: /SYNTHETIC-LONG-/ }).click();
  for (const [width, height] of [
    [1440, 900],
    [1920, 1080],
  ]) {
    await page.setViewportSize({ width, height });
    for (const mode of ["light", "dark"]) {
      if (
        (await page.locator(".g2-ops").getAttribute("data-ops-theme")) !== mode
      )
        await click(mode === "dark" ? "Modo escuro" : "Modo claro");
      const metric = await page.evaluate(() => ({
        innerWidth,
        innerHeight,
        documentWidth: document.documentElement.scrollWidth,
        mainWidth: document.querySelector(".g2-ops__main").clientWidth,
        mainScrollWidth: document.querySelector(".g2-ops__main").scrollWidth,
      }));
      layouts.push({ mode, ...metric });
      check(
        `long content ${width}x${height} ${mode} has no viewport overflow`,
        metric.documentWidth <= width &&
          metric.mainScrollWidth <= metric.mainWidth,
      );
      await page.locator(".close__investigation").scrollIntoViewIfNeeded();
      await image(`long-${width}-${mode}.png`);
    }
  }
  // Delayed historical GET cannot land after switching private workspace.
  let releaseGet, seenGet;
  const gate = new Promise((r) => (releaseGet = r)),
    called = new Promise((r) => (seenGet = r));
  await page.route(`**/calculations/${previous.firstResult}`, async (route) => {
    const response = await route.fetch();
    seenGet();
    await gate;
    await route.fulfill({ response }).catch(() => {});
  });
  await page.goto(previous.savedUrl);
  await called;
  await page
    .getByText("Carregando contexto privado…", { exact: true })
    .waitFor();
  await image("loading-context.png");
  await page
    .getByLabel("Workspace privado", { exact: true })
    .selectOption(secondWorkspace);
  releaseGet();
  await stable();
  check(
    "late historical GET cannot populate the switched workspace",
    new URL(page.url()).searchParams.get("workspace") === secondWorkspace &&
      (await table.count()) === 0,
  );
  await writeFile(
    path.join(evidence, "adverse-measurements.json"),
    JSON.stringify(
      { checks, layouts, errors, measuredAt: new Date().toISOString() },
      null,
      2,
    ),
  );
} catch (error) {
  await image("adverse-failure.png").catch(() => {});
  await writeFile(
    path.join(evidence, "adverse-failure.json"),
    JSON.stringify(
      {
        error: String(error),
        checks,
        text: await page.locator("body").innerText(),
      },
      null,
      2,
    ),
  );
  throw error;
} finally {
  await browser.close();
}
console.log(JSON.stringify({ passed: checks.length, layouts, errors }));
