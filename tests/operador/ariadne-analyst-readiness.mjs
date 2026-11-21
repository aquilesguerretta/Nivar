// Measures the existing analyst UI. Auth signup is setup; analytical writes are UI-only.
import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";

const base = process.env.ARIADNE_QA_URL || "http://127.0.0.1:5186";
assert.match(base, /^http:\/\/127\.0\.0\.1:\d+$/);
const out = path.resolve(
  process.env.ARIADNE_QA_OUTPUT ||
    path.join(tmpdir(), "ariadne-analyst-readiness"),
);
await mkdir(out, { recursive: true });
const fixtures = path.join(tmpdir(), "ariadne-ux-isolated-synthetic");
const pdf = path.join(fixtures, "synthetic-demand-original.pdf");
const tariff = path.join(fixtures, "synthetic-tariff.csv");
const root = "/api/operator/ariadne";
const email = "ariadne-browser@example.com";
const password = "synthetic-local-qa-password";
const { chromium } = createRequire(
  path.join(process.env.RUNTIME_NODE_MODULES, "package.json"),
)("playwright");
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  acceptDownloads: true,
});
await context.route("**/*", (route) =>
  new URL(route.request().url()).origin === base
    ? route.continue()
    : route.abort(),
);
const page = await context.newPage();
page.setDefaultTimeout(12000);
const operations = [];
const checks = [];
const images = [];
const observations = {};
const pageErrors = [];
let stage = "setup";
let active;
let finding;
let failure;
page.on("pageerror", (e) => pageErrors.push(e.message));

function check(label, value) {
  assert.ok(value, label);
  checks.push({ stage, label });
}

async function action(kind, label, perform, settles) {
  active = { stage, kind, label };
  const pathname = () => new URL(page.url(), base).pathname;
  const before = pathname();
  operations.push(active);
  await perform();
  if (settles) await settles();
  active.pathChanged = before !== pathname();
  active = undefined;
}

const button = (name) => page.getByRole("button", { name, exact: true });
const link = (name) => page.getByRole("link", { name, exact: true });
const click = (control, label, settles) =>
  action("activate", label, () => control.click(), settles);
const fill = (name, value) =>
  action("entry", name, () =>
    page.getByLabel(name, { exact: true }).fill(value),
  );
const choose = (control, value, label, settles) =>
  action("select", label, () => control.selectOption(value), settles);
const waitText = (text) => page.getByText(text, { exact: true }).waitFor();
const settled = () =>
  page.locator('.plan__workspace[aria-busy="false"]').waitFor();
const query = (key) => new URL(page.url()).searchParams.get(key);

async function capture(name) {
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(out, name) });
  images.push(name);
}

async function api(url, expected = 200) {
  const response = await context.request.get(base + url);
  assert.equal(response.status(), expected, url.split("/").at(-1));
  return response;
}

async function intake(file, role, confirmation, contextFields) {
  await action(
    "file",
    path.basename(file),
    () => page.getByLabel("Importar arquivos").setInputFiles(file),
    () => button("Confirmar contexto e preservar fonte").waitFor(),
  );
  const proposedRole = page.getByLabel("Papel proposto");
  if ((await proposedRole.inputValue()) !== role)
    await choose(proposedRole, role, "Papel proposto");
  if (contextFields) {
    for (const [label, value] of Object.entries(contextFields)) {
      if (
        (await page.getByLabel(label, { exact: true }).inputValue()) !== value
      )
        await fill(label, value);
    }
    await capture(
      stage === "A" ? "intake-context.png" : "reconciliation-context.png",
    );
    if (stage === "A") {
      const preview = page.locator(".desk__review");
      check(
        "proposal and missing period are shown before confirmation",
        (await preview.innerText()).includes(
          "Proposta · confirme antes de usar",
        ) &&
          (await preview.innerText()).includes(
            "Referência mensal ausente/ambígua",
          ),
      );
    }
  }
  const previousSource = query("source");
  await click(
    button("Confirmar contexto e preservar fonte"),
    "Preserve source",
    () =>
      page.waitForURL(
        (url) =>
          !!url.searchParams.get("source") &&
          url.searchParams.get("source") !== previousSource &&
          !url.searchParams.has("result"),
      ),
  );
  await button(confirmation).waitFor();
  if (await button("Revisar candidatos").isVisible()) {
    await click(button("Revisar candidatos"), "Review mapped candidates");
  }
  await click(button(confirmation), "Confirm eligible interpretation", () =>
    waitText("Confirmação preservada"),
  );
}

async function closeResult() {
  await click(
    button("Verificar e preservar resultado"),
    "Preserve Close result",
    () =>
      page
        .getByRole("heading", { name: "Itens da revisão", exact: true })
        .waitFor(),
  );
  return `${root}/workspaces/${query("workspace")}/close/reviews/${query("review")}`;
}

async function replay(control, label, text) {
  await click(button(control), label, () => waitText(text));
}

async function download(control, label) {
  const received = page.waitForEvent("download");
  await click(link(control), label);
  return readFile(await (await received).path());
}

try {
  const signup = await context.request.post(base + "/api/auth/signup", {
    data: { name: "Synthetic Ariadne QA", email, password },
  });
  assert.ok([201, 409].includes(signup.status()));
  await page.goto(base + "/entrar");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Senha", { exact: true }).fill(password);
  await button("Entrar").click();
  await page.waitForURL("**/conta");
  assert.equal(
    (await context.request.get(base + "/api/auth/me")).status(),
    200,
  );

  stage = "A";
  const existingWorkspaces = (await (await api(root + "/workspaces")).json())
    .data;
  await action("address", "Open private Core Alpha entry", () =>
    page.goto(base + "/operador/ariadne"),
  );
  await click(
    link("Fechamento assistido · experimento →"),
    "Open Review Desk from Core",
    () => page.getByRole("heading", { name: "Preparar a revisão" }).waitFor(),
  );
  check(
    "Review Desk begins with no active private workspace or review",
    !query("workspace") && !query("review"),
  );
  await capture("empty-review.png");
  await intake(pdf, "invoice", "Confirmar linhas selecionadas", {
    Competência: "2020-02",
    "Unidade / escopo": "123456",
  });
  const invoiceSource = query("source");
  const importedWorkspace = query("workspace");
  const importedReview = query("review");
  check(
    "first import creates a new private workspace automatically",
    importedWorkspace &&
      importedReview &&
      invoiceSource &&
      !existingWorkspaces.some((w) => w.id === importedWorkspace),
  );
  observations.workspaceChoiceActions = 0;
  await intake(tariff, "context", "Reconhecer referência contextual");
  check(
    "second import reuses workspace/review context",
    query("workspace") === importedWorkspace &&
      query("review") === importedReview &&
      query("source") !== invoiceSource,
  );

  stage = "B";
  const reviewRoot = await closeResult();
  const resultPath = reviewRoot + "/calculations/" + query("result");
  const close = await (await api(resultPath)).json();
  await click(button("2020-02"), "Select February observation", () =>
    page.getByRole("heading", { name: "2020-02 · prova" }).waitFor(),
  );
  const original = page.getByRole("link", {
    name: /Abrir fonte original.*página 14/,
  });
  await original.waitFor();
  const popup = context.waitForEvent("page");
  await click(original, "Open original at selected locator");
  const originalTab = await popup;
  await originalTab.waitForURL(/#page=14$/);
  check(
    "selected review row opens the original at physical PDF page 14",
    originalTab.url().startsWith("blob:"),
  );
  await action(
    "return",
    "Close original tab and return to the same proof",
    () => originalTab.close(),
  );
  const proof = page.locator(".desk__proof");
  check(
    "observation remains independently unverified",
    /Não verificável com os dados\/regras disponíveis/i.test(
      await proof.innerText(),
    ),
  );
  await capture("review-proof.png");

  stage = "C";
  observations.reviewProofBeforePlanning = await proof
    .locator("h2")
    .textContent();
  await click(
    link("Planejar a partir deste estado"),
    "Open Planning from preserved Close",
    settled,
  );
  const planRoot = resultPath + "/planning";
  const baseOutput = (await (await api(planRoot)).json()).output;
  observations.initialPlanningProof = await page
    .locator(".plan__proof h2")
    .textContent();
  check(
    "exact Close baseline and carried-forward monthly data",
    query("baseline") === close.id && baseOutput.months.length === 4,
  );
  for (const label of [/Simular regime normal/, /Reconheço a referência A4/]) {
    const field = page.getByRole("checkbox", { name: label });
    await action(
      "select",
      "Acknowledge " + label.source,
      () => field.check(),
      settled,
    );
  }
  await fill("Nome do cenário", "Synthetic readiness baseline");
  await click(button("Preservar cenário"), "Save 280 kW scenario", () =>
    page.waitForURL((url) => url.searchParams.has("scenario")),
  );
  await settled();
  const scenario = query("scenario");
  const firstSaved = (
    await (await api(planRoot + "/scenarios/" + scenario)).json()
  ).output;
  check(
    "new run uses 0.1.1 with separate physical and monetary coverage",
    firstSaved.version === "0.1.1" &&
      firstSaved.coverage.physical === 3 &&
      firstSaved.coverage.covered === 2 &&
      firstSaved.coverage.total === 4,
  );
  const candidate = page.getByLabel("Demanda candidata em kW", { exact: true });
  await fill("Demanda candidata em kW", "260");
  await settled();
  check(
    "unsaved alternative is exploring on the same saved URL",
    query("scenario") === scenario &&
      (await page.locator("[data-ariadne-state]").textContent()) ===
        "Explorando",
  );
  await action(
    "reload",
    "Reload unsaved exploration",
    () => page.reload(),
    settled,
  );
  check(
    "refresh restores saved assumptions without creating a run",
    (await candidate.inputValue()) === firstSaved.assumptions.candidateKw &&
      (await (await api(planRoot + "/scenarios")).json()).length === 1,
  );
  await fill("Demanda candidata em kW", "260");
  await settled();
  await fill("Nome do cenário", "Synthetic readiness alternative");
  await click(button("Preservar cenário"), "Save 260 kW alternative", () =>
    page.waitForURL((url) => url.searchParams.get("scenario") !== scenario),
  );
  await settled();
  const alternate = query("scenario");
  await click(
    page.getByRole("button", { name: /Comparar preservados/ }),
    "Open preserved comparisons",
  );
  const table = page.locator("#ariadne-preserved-comparison");
  check(
    "compare baseline and both saved alternatives with version",
    (await table.locator("tbody tr").count()) === 3 &&
      (await table.getByRole("columnheader", { name: "Modelo" }).isVisible()),
  );
  await table.scrollIntoViewIfNeeded();
  await capture("comparison.png");
  await choose(
    page.getByRole("combobox", { name: /^Cenário/ }),
    scenario,
    "Reopen saved 280 kW scenario",
    () =>
      page.waitForURL((url) => url.searchParams.get("scenario") === scenario),
  );
  await settled();

  stage = "D";
  check(
    "invalid period stays in denominator; missing identity retains only physical coverage",
    firstSaved.months.some(
      (m) => m.period === null && !m.physicalCovered && !m.covered,
    ) &&
      firstSaved.months.some(
        (m) =>
          m.period === "2019-11" &&
          m.physicalCovered &&
          !m.covered &&
          /identidade/i.test(m.reasons.join(" ")),
      ),
  );
  const unavailable = reviewRoot + "/sources/" + randomUUID() + "/original";
  check(
    "unavailable original returns 404",
    (await api(unavailable, 404)).status() === 404,
  );
  check(
    "no contract recommendation in modeled planning",
    /Não é recomendação contratual/.test(
      await page.locator(".plan__curve").innerText(),
    ),
  );
  check(
    "scenario status is exposed as one atomic live region",
    (await page
      .locator(
        '[data-ariadne-state][role="status"][aria-live="polite"][aria-atomic="true"]',
      )
      .count()) === 1,
  );

  stage = "E";
  await replay(
    "Reconstruir resultado",
    "Replay saved Planning result",
    "Replay exato: resultado idêntico.",
  );
  const planBytes = await download(
    "Exportar cenário exato",
    "Download preserved Planning JSON",
  );
  const planExport = JSON.parse(planBytes);
  check(
    "downloaded Planning output matches saved snapshot",
    JSON.stringify(planExport.output) === JSON.stringify(firstSaved),
  );
  check(
    "Planning export includes immutable inputs, model and output",
    !!planExport.output.version &&
      !!planExport.output.assumptions &&
      planExport.output.months.some((m) => m.sourceRef?.locator),
  );
  await click(link("Estado revisado"), "Return to exact reviewed state", () =>
    page.waitForURL((url) => url.searchParams.get("result") === close.id),
  );
  await replay(
    "Reconstituir",
    "Replay reviewed Close result",
    "Histórico reconstruído: resultado idêntico.",
  );
  await click(button("Salvar pacote"), "Preserve Close package", () =>
    link("Baixar pacote ZIP").waitFor(),
  );
  const closeBytes = await download(
    "Baixar pacote ZIP",
    "Download reviewed Close package",
  );
  check(
    "downloaded Close ZIP equals the same preserved package on reread",
    closeBytes.subarray(0, 4).equals(Buffer.from([80, 75, 3, 4])) &&
      closeBytes.equals(
        await (
          await api(await link("Baixar pacote ZIP").getAttribute("href"))
        ).body(),
      ),
  );

  stage = "D-missing-original";
  await click(
    button("2020-02"),
    "Select the saved February proof before recovery",
  );
  const beforeRecovery = page.url();
  const originalRequest = `**/sources/${invoiceSource}/original`;
  // Present a real local 404 for this request without deleting a preserved original.
  await page.route(originalRequest, async (route) => {
    const missing = await route.fetch({ url: base + unavailable });
    assert.equal(missing.status(), 404);
    await route.fulfill({ response: missing });
  });
  await action(
    "reload",
    "Reopen proof with an unavailable original",
    () => page.reload(),
    () =>
      page
        .getByRole("alert")
        .filter({ hasText: "Original indisponível" })
        .waitFor(),
  );
  check(
    "missing original leaves exact preserved proof selected",
    page.url() === beforeRecovery &&
      (await page
        .getByRole("heading", { name: "2020-02 · prova" })
        .isVisible()) &&
      (await original.count()) === 0,
  );
  check(
    "operator session stays valid during the unavailable-original response",
    (await api("/api/auth/me")).status() === 200,
  );
  observations.unavailableOriginalMessage = await page
    .getByRole("alert")
    .filter({ hasText: "Original indisponível" })
    .innerText();
  await capture("missing-original.png");
  await page.unroute(originalRequest);
  await action(
    "reload",
    "Recover after the original becomes available",
    () => page.reload(),
    () => original.waitFor(),
  );
  check(
    "original recovers with exact page and context on reload",
    page.url() === beforeRecovery &&
      (await original.getAttribute("href")).endsWith("#page=14"),
  );

  stage = "B-discrepancy";
  await click(
    button("Nova revisão"),
    "Start separate reconciliation case",
    () => page.getByRole("heading", { name: "Preparar a revisão" }).waitFor(),
  );
  await intake(
    path.resolve("tests/ariadne_close/fixtures/invoice.csv"),
    "invoice",
    "Confirmar linhas selecionadas",
    { Competência: "2026-09", "Unidade / escopo": "SYNTHETIC-UNIT" },
  );
  const invoiceRoot = await closeResult();
  const invoiceResult = await (
    await api(invoiceRoot + "/calculations/" + query("result"))
  ).json();
  const divergent = invoiceResult.output.items.find(
    (i) => i.itemKey === "mandatory",
  );
  check(
    "actual billed vs modeled internal discrepancy is exactly 1000.00 BRL",
    divergent?.internal.difference === "1000.00",
  );
  await click(button("mandatory"), "Inspect the divergent invoice line");
  check(
    "divergent row distinguishes internal arithmetic and unsupported independent proof",
    (await proof.innerText()).includes("1000.00 BRL") &&
      /Não verificável/.test(await proof.innerText()),
  );
  await fill("Motivo", "Synthetic evidence check");
  await fill(
    "Nota / ação",
    "Request independent quantity and price before drawing a conclusion.",
  );
  await click(
    button("Registrar tratamento"),
    "Record follow-up without changing arithmetic",
    () => page.getByText(/follow_up: Synthetic evidence check/).waitFor(),
  );
  const treated = await (
    await api(invoiceRoot + "/calculations/" + query("result"))
  ).json();
  check(
    "treatment preserves exact reconciled output",
    JSON.stringify(treated.output) === JSON.stringify(invoiceResult.output),
  );
  await capture("discrepancy.png");

  check("no uncaught application errors", pageErrors.length === 0);
  finding = {
    preservedAlternatives: 2,
    planExportSha256: createHash("sha256").update(planBytes).digest("hex"),
    closeArchiveBytes: closeBytes.length,
    alternatePersisted: !!alternate,
  };
} catch (error) {
  failure = {
    stage,
    operation: active?.label,
    message: String(error.message).replaceAll(base, "<loopback>"),
  };
  await capture("failure.png").catch(() => {});
  process.exitCode = 1;
} finally {
  const report = {
    browser: browser.version(),
    pass: checks.length,
    fail: failure ? 1 : 0,
    skip: 0,
    checks,
    operations,
    images,
    observations,
    finding,
    failure,
    automated: true,
  };
  await writeFile(
    path.join(out, "readiness.json"),
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(
    JSON.stringify({ pass: report.pass, fail: report.fail, failure, images }),
  );
  await browser.close();
}
