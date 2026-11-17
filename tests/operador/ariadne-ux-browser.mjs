// Real loopback-only Chrome + normal session + disposable synthetic file intake.
// Run prepare_ariadne_ux.py first. See docs/ariadne-ui/design-qa.md for gates.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomUUID, createHash } from "node:crypto";
const { chromium } = createRequire(
  path.join(process.env.RUNTIME_NODE_MODULES, "package.json"),
)("playwright");
const base = process.env.ARIADNE_QA_URL || "http://127.0.0.1:5186";
assert.match(base, /^http:\/\/127\.0\.0\.1:\d+$/);
const fixtures = path.join(tmpdir(), "ariadne-ux-isolated-synthetic");
const output = path.resolve(
  process.env.ARIADNE_QA_OUTPUT || "docs/ariadne-ui/evidence",
);
const manifest =
  process.env.ARIADNE_QA_MANIFEST ||
  path.join(tmpdir(), "ariadne-ux-isolated-manifest.json");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  acceptDownloads: true,
});
const page = await context.newPage();
page.setDefaultTimeout(20000);
const checks = [],
  errors = [],
  layouts = [],
  skipped = [];
const started = performance.now();
page.on("pageerror", (e) => errors.push(e.message));
await page.route("**/*", (route) => {
  const url = new URL(route.request().url());
  return url.hostname === "127.0.0.1" ? route.continue() : route.abort();
});
const check = (name, value) => {
  assert.ok(value, name);
  checks.push(name);
};
const click = (name) => page.getByRole("button", { name, exact: true }).click();
const stable = () =>
  page.waitForFunction(
    () =>
      document.querySelector(".plan__workspace")?.getAttribute("aria-busy") ===
      "false",
  );
async function get(url) {
  const response = await context.request.get(base + url);
  assert.equal(response.status(), 200, await response.text());
  return response.json();
}
async function post(url, data, expected = 201) {
  const response = await context.request.post(base + url, {
    data,
    headers: { "Idempotency-Key": randomUUID() },
  });
  assert.equal(response.status(), expected, await response.text());
  return response.json();
}
async function importSource(root, file, role, reviewMode) {
  const response = await context.request.post(base + root + "/sources", {
    headers: { "Idempotency-Key": randomUUID() },
    multipart: {
      role,
      inspection: "true",
      file: {
        name: file,
        mimeType: file.endsWith("pdf") ? "application/pdf" : "text/csv",
        buffer: await readFile(path.join(fixtures, file)),
      },
    },
  });
  assert.equal(response.status(), 201, await response.text());
  const source = (await response.json()).id;
  const detail = await get(root);
  const stored = detail.sources.find((s) => s.id === source);
  const mapping = {
    sheet: stored.preview.tables[0]?.name || "",
    mapping: {},
    numericMode: "strict",
    manualRows: [],
    reviewMode,
  };
  const candidates = await post(
    root + `/sources/${source}/candidates`,
    mapping,
    200,
  );
  await post(root + `/sources/${source}/confirm`, {
    ...mapping,
    selectedRows: candidates.rows
      .filter((r) => !r.errors.length)
      .map((r) => r.index),
    previousConfirmationVersionId: null,
  });
  return source;
}
async function screenshot(name) {
  await page.evaluate(() => document.fonts.ready);
  const size = page.viewportSize();
  const metrics = await page.evaluate(() => ({
    width: innerWidth,
    height: innerHeight,
    document: document.documentElement.scrollWidth,
    main: document.querySelector(".aw-shell__main")?.scrollWidth,
    mainClient: document.querySelector(".aw-shell__main")?.clientWidth,
  }));
  assert.deepEqual({ width: metrics.width, height: metrics.height }, size);
  check(
    name + " no horizontal overflow",
    metrics.document <= size.width && metrics.main <= metrics.mainClient,
  );
  layouts.push({ name, ...metrics });
  await page.screenshot({ path: path.join(output, name), fullPage: false });
}
try {
  const signup = await context.request.post(base + "/api/auth/signup", {
    data: {
      name: "Synthetic Ariadne UX QA",
      email: "ariadne-browser@example.com",
      password: "synthetic-local-qa-password",
    },
  });
  assert.ok([201, 409].includes(signup.status()), await signup.text());
  await page.goto(base + "/entrar");
  await page
    .getByLabel("Email", { exact: true })
    .fill("ariadne-browser@example.com");
  await page
    .getByLabel("Senha", { exact: true })
    .fill("synthetic-local-qa-password");
  await click("Entrar");
  await page.waitForURL("**/conta");
  check("normal QA login establishes actual authenticated session", true);
  let data;
  try {
    data = JSON.parse(await readFile(manifest, "utf8"));
  } catch {
    const workspace = await post("/api/operator/ariadne/close/workspaces", {
      label: "SYNTHETIC · Ariadne UX",
      synthetic: true,
    });
    const reviews = `/api/operator/ariadne/workspaces/${workspace.id}/close/reviews`;
    const review = await post(reviews, {
      scope: "123456",
      period: "2020-02",
      ruleVersion: "0.2.0",
    });
    const root = reviews + "/" + review.id;
    const source = await importSource(
      root,
      "synthetic-demand-original.pdf",
      "invoice",
      "demand_profile",
    );
    await importSource(
      root,
      "synthetic-tariff.csv",
      "context",
      "tariff_reference",
    );
    const detail = await get(root);
    const close = await post(root + "/calculate", {
      confirmationVersions: Object.fromEntries(
        detail.sources.map((s) => [s.id, s.confirmationVersionId]),
      ),
    });
    const planning = root + `/calculations/${close.id}/planning`;
    const scenario = await post(planning + "/scenarios", {
      candidateKw: "280",
      normalRegime: true,
      tariffApplicability: true,
      name: "SYNTHETIC · 280 kW",
      acknowledgeHistoricalBaseline: false,
    });
    const alternative = await post(planning + "/scenarios", {
      candidateKw: "260",
      normalRegime: true,
      tariffApplicability: true,
      name: "SYNTHETIC · 260 kW",
      acknowledgeHistoricalBaseline: false,
    });
    data = {
      workspace: workspace.id,
      review: review.id,
      baseline: close.id,
      scenario: scenario.id,
      alternative: alternative.id,
      source,
      root,
      planning,
    };
    await writeFile(manifest, JSON.stringify(data, null, 2));
  }
  const planningURL =
    base +
    "/operador/ariadne/planejamento?" +
    new URLSearchParams({
      workspace: data.workspace,
      review: data.review,
      baseline: data.baseline,
      scenario: data.scenario,
      month: "2020-02",
    });
  const reviewURL =
    base +
    "/operador/ariadne/fechamento?" +
    new URLSearchParams({
      workspace: data.workspace,
      review: data.review,
      result: data.baseline,
    });
  const saved = await get(data.planning + `/scenarios/${data.scenario}`);
  check(
    "saved calculation uses PR30 executor 0.1.1",
    saved.output.version === "0.1.1",
  );
  check(
    "physical and money coverage remain separate",
    saved.output.coverage.physical === 3 &&
      saved.output.coverage.covered === 2 &&
      saved.output.coverage.total === 4,
  );
  await page.goto(planningURL);
  await stable();
  await page
    .locator(".plan__proof h2")
    .filter({ hasText: "2020-02" })
    .waitFor();
  const sourceAction = page.getByRole("link", { name: /Abrir fonte original/ });
  await page.waitForFunction(() =>
    document
      .querySelector(".plan__proof .aw-source-action")
      ?.getAttribute("href")
      ?.endsWith("#page=14"),
  );
  check(
    "original action preserves exact page 14 and new-tab intent",
    (await sourceAction.getAttribute("href")).endsWith("#page=14") &&
      (await sourceAction.getAttribute("target")) === "_blank",
  );
  await page.waitForFunction(() =>
    document
      .querySelector(".plan__proof .aw-source-action")
      ?.getAttribute("href")
      ?.startsWith("blob:"),
  );
  const originalHash = await page.evaluate(async () => {
    const href = document.querySelector(".plan__proof .aw-source-action").href;
    const bytes = await (await fetch(href)).arrayBuffer();
    return Array.from(
      new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)),
      (n) => n.toString(16).padStart(2, "0"),
    ).join("");
  });
  check(
    "authenticated original bytes equal uploaded PDF",
    originalHash ===
      createHash("sha256")
        .update(
          await readFile(path.join(fixtures, "synthetic-demand-original.pdf")),
        )
        .digest("hex"),
  );
  const openedPDF = context.waitForEvent("page");
  await sourceAction.click();
  const pdfTab = await openedPDF;
  await pdfTab.waitForURL(/#page=14$/);
  check(
    "click opens original PDF in another tab at page 14",
    pdfTab.url().startsWith("blob:"),
  );
  await pdfTab.close();
  const status = page.locator("[data-ariadne-state]");
  check(
    "one atomic polite status region",
    (await status.count()) === 1 &&
      (await status.getAttribute("role")) === "status" &&
      (await status.getAttribute("aria-live")) === "polite" &&
      (await status.getAttribute("aria-atomic")) === "true",
  );
  await page.waitForFunction(
    () =>
      document.querySelector("[data-ariadne-state]")?.textContent ===
      "Cenário preservado",
  );
  const beforeNavigation = page.url();
  await page
    .getByRole("navigation", { name: "Navegação Ariadne" })
    .getByRole("link", { name: "Planejamento", exact: true })
    .click();
  check(
    "saved self-navigation keeps scenario and baseline",
    page.url() === beforeNavigation,
  );
  await page.evaluate(() => {
    window.ariadneAnnouncements = [];
    window.ariadneStatusObserver = new MutationObserver(() => {
      const text = document.querySelector("[data-ariadne-state]")?.textContent;
      if (text) window.ariadneAnnouncements.push(text);
    });
    window.ariadneStatusObserver.observe(
      document.querySelector("[data-ariadne-state]"),
      { childList: true, subtree: true, characterData: true },
    );
  });
  const candidate = page.getByLabel("Demanda candidata em kW", { exact: true });
  let response = page.waitForResponse(
    (r) =>
      r.url().includes("/planning/preview") && r.request().method() === "POST",
  );
  await candidate.fill("260");
  await response;
  await stable();
  check(
    "edited saved assumptions announce Exploring",
    (await status.textContent()) === "Explorando",
  );
  await page
    .getByRole("navigation", { name: "Navegação Ariadne" })
    .getByRole("link", { name: "Planejamento", exact: true })
    .click();
  check(
    "unsaved self-navigation keeps current inputs and URL",
    (await candidate.inputValue()) === "260" && page.url() === beforeNavigation,
  );
  response = page.waitForResponse(
    (r) =>
      r.url().includes("/planning/preview") && r.request().method() === "POST",
  );
  await candidate.fill("280");
  await response;
  await stable();
  check(
    "returning to saved assumptions announces Preserved once",
    JSON.stringify(await page.evaluate(() => window.ariadneAnnouncements)) ===
      JSON.stringify(["Explorando", "Cenário preservado"]),
  );
  await page.evaluate(() => window.ariadneStatusObserver.disconnect());
  await page.reload();
  await stable();
  check(
    "refresh restores same saved scenario",
    new URL(page.url()).searchParams.get("scenario") === data.scenario &&
      (await candidate.inputValue()) === "280",
  );
  await page.getByRole("button", { name: /Comparar preservados/ }).click();
  await page
    .getByRole("heading", { name: "Baseline e alternativas preservadas" })
    .waitFor();
  check(
    "scenario comparison includes exact saved alternatives",
    (await page.locator("#ariadne-preserved-comparison tbody tr").count()) >= 3,
  );
  await page.locator("#ariadne-preserved-comparison").scrollIntoViewIfNeeded();
  await screenshot("planning-comparison.png");
  await page.getByRole("button", { name: /Comparar preservados/ }).click();
  await page.locator(".aw-shell__main").evaluate(el => el.scrollTo(0,0));
  await click("Reconstruir resultado");
  await page
    .getByText("Replay exato: resultado idêntico.", { exact: true })
    .waitFor();
  check("saved scenario replays exactly", true);
  const exported = await get(
    data.planning + `/scenarios/${data.scenario}/export`,
  );
  check(
    "historical export matches saved output byte values",
    JSON.stringify(exported.output) === JSON.stringify(saved.output),
  );
  const downloadPromise = page.waitForEvent("download");
  await page
    .getByRole("link", { name: "Exportar cenário exato", exact: true })
    .click();
  const download = await downloadPromise;
  check(
    "actual downloaded package preserves exact saved result",
    JSON.stringify(
      JSON.parse(await readFile(await download.path(), "utf8")).output,
    ) === JSON.stringify(saved.output),
  );
  await page.locator(".plan__impact-detail summary").focus();
  await page.keyboard.press("Tab");
  check(
    "keyboard reaches visible original action",
    await sourceAction.evaluate(
      (el) =>
        el === document.activeElement &&
        getComputedStyle(el).outlineStyle === "solid",
    ),
  );
  await screenshot("planning-source-focus.png");
  for (const [width, height] of [
    [1440, 900],
    [1920, 1080],
  ]) {
    await page.setViewportSize({ width, height });
    for (const dark of [false, true]) {
      const currentDark =
        (await page.locator(".aw-shell").getAttribute("data-ops-theme")) ===
        "dark";
      if (currentDark !== dark)
        await click(dark ? "Modo escuro" : "Modo claro");
      await screenshot(`planning-${width}-${dark ? "dark" : "light"}.png`);
    }
  }
  await page.goto(reviewURL);
  await page.getByRole("button", { name: "2020-02", exact: true }).click();
  await page
    .getByRole("heading", { name: "2020-02 · prova", exact: true })
    .waitFor();
  await page.waitForFunction(() =>
    document
      .querySelector(".desk__proof .aw-source-action")
      ?.getAttribute("href")
      ?.endsWith("#page=14"),
  );
  check("review selected row and original page correspond", true);
  await page.getByRole("button", { name: "2019-06", exact: true }).click();
  await page.waitForFunction(() =>
    document
      .querySelector(".desk__proof .aw-source-action")
      ?.getAttribute("href")
      ?.endsWith("#page=13"),
  );
  check("changing reviewed row updates source locator", true);
  await page.getByRole("button", { name: "2020-02", exact: true }).click();
  for (const [width, height] of [
    [1440, 900],
    [1920, 1080],
  ]) {
    await page.setViewportSize({ width, height });
    for (const dark of [false, true]) {
      const currentDark =
        (await page.locator(".aw-shell").getAttribute("data-ops-theme")) ===
        "dark";
      if (currentDark !== dark)
        await click(dark ? "Modo escuro" : "Modo claro");
      await screenshot(`review-${width}-${dark ? "dark" : "light"}.png`);
    }
  }
  await page.getByRole("button", { name: "Histórico", exact: true }).click();
  await page.getByText("Revisões preservadas", { exact: true }).waitFor();
  check("review history remains available", true);
  await page.goto(base + "/operador/ariadne/planejamento");
  await page
    .getByRole("heading", { name: "Planeje a partir de um estado revisado" })
    .waitFor();
  check(
    "direct entry offers review without inferred private context",
    (await page
      .getByRole("link", { name: /Ir para a mesa de revisão/ })
      .getAttribute("href")) === "/operador/ariadne/fechamento",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await screenshot("planning-direct-mobile.png");
  await page
    .getByRole("navigation", { name: "Navegação Ariadne" })
    .getByRole("link", { name: "Mesa de revisão", exact: true })
    .click();
  await page.getByRole("heading", { name: "Preparar a revisão" }).waitFor();
  await screenshot("review-empty-mobile.png");
  check("mobile navigation supports empty direct entry", true);
  await page.goto(planningURL);
  await stable();
  await screenshot("planning-saved-mobile.png");
  await page.goto(reviewURL);
  await page.getByRole("button", { name: "2020-02", exact: true }).click();
  await screenshot("review-selected-mobile.png");
  await page.goto(planningURL.replace("&scenario=" + data.scenario, ""));
  await stable();
  const unsavedURL = page.url();
  response = page.waitForResponse(
    (r) =>
      r.url().includes("/planning/preview") && r.request().method() === "POST",
  );
  await candidate.fill("261");
  await response;
  await stable();
  await page
    .getByRole("navigation", { name: "Navegação Ariadne" })
    .getByRole("link", { name: "Planejamento", exact: true })
    .click();
  check(
    "unsaved baseline self-navigation preserves inputs without inventing a saved scenario",
    page.url() === unsavedURL &&
      !new URL(page.url()).searchParams.has("scenario") &&
      (await candidate.inputValue()) === "261",
  );
  const savedBefore = (await get(data.planning + "/scenarios")).length;
  await page.reload();
  await stable();
  check(
    "unsaved refresh restores reviewed baseline and never auto-saves",
    (await candidate.inputValue()) === "280.00" &&
      (await get(data.planning + "/scenarios")).length === savedBefore,
  );
  if (data.legacy) {
    const legacy = await get(data.planning + `/scenarios/${data.legacy}`);
    const preview = page.waitForResponse(
      (r) =>
        r.url().includes("/planning/preview") &&
        r.request().method() === "POST",
    );
    await page.goto(planningURL.replace(data.scenario, data.legacy));
    await preview;
    await stable();
    check(
      "retained 0.1.0 view is not overwritten by latest preview",
      (await page
        .getByText("Regra e fórmula · " + legacy.output.version, {
          exact: true,
        })
        .count()) === 1,
    );
    check(
      "latest curve is not attributed to historical model",
      (await page.getByText(/Resultado preservado no modelo 0.1.0/).count()) ===
        1,
    );
    check(
      "retained 0.1.0 payload is unchanged after UI navigation",
      JSON.stringify(
        (await get(data.planning + `/scenarios/${data.legacy}/export`)).output,
      ) === JSON.stringify(legacy.output),
    );
    const nextPreview = page.waitForResponse(
      (r) => r.url().includes("/planning/preview") && r.request().method() === "POST",
    );
    await candidate.fill("260");
    await nextPreview;
    await stable();
    check(
      "explicit exploration of historical assumptions uses current executor",
      (await status.textContent()) === "Explorando" &&
        (await page.getByText("Regra e fórmula · 0.1.1", { exact: true }).count()) === 1,
    );
  } else {
    skipped.push(
      "legacy browser fixture unavailable; prepare disposable legacy run",
    );
  }
  check("no browser page errors", errors.length === 0);
  const evidence = {
    measuredAt: new Date().toISOString(),
    browser: browser.version(),
    automationElapsedMs: Math.round(performance.now() - started),
    pass: checks.length,
    fail: 0,
    skip: skipped.length,
    checks,
    skipped,
    errors,
    layouts,
    automationOnly: true,
  };
  console.log(JSON.stringify(evidence));
  await writeFile(
    path.join(output, "qa.json"),
    JSON.stringify(evidence, null, 2),
  );
} finally {
  await browser.close();
}
