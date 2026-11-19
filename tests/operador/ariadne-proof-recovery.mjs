// Chrome regression using the existing disposable PR #33 synthetic review.
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";

const base = process.env.ARIADNE_QA_URL || "http://127.0.0.1:5186";
assert.match(base, /^http:\/\/127\.0\.0\.1:\d+$/);
const output =
  process.env.ARIADNE_QA_OUTPUT ||
  path.join(tmpdir(), "ariadne-proof-recovery");
await mkdir(output, { recursive: true });
const manifest = JSON.parse(
  await readFile(
    process.env.ARIADNE_QA_MANIFEST ||
      path.join(tmpdir(), "ariadne-ux-isolated-manifest.json"),
    "utf8",
  ),
);
const { workspace, review, baseline, source, scenario } = manifest;
const reviewPath = "/operador/ariadne/fechamento";
const planPath = "/operador/ariadne/planejamento";
const reviewURL =
  base +
  reviewPath +
  "?" +
  new URLSearchParams({ workspace, review, result: baseline });
const planURL =
  base + planPath + "?" + new URLSearchParams({ workspace, review, baseline });
const apiRoot = `/api/operator/ariadne/workspaces/${workspace}/close/reviews/${review}`;
const originalURL = apiRoot + `/sources/${source}/original`;
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
page.setDefaultTimeout(10000);
const checks = [];
const failures = [];
const observations = {};
const button = (name) => page.getByRole("button", { name, exact: true });
const original = page.getByRole("link", {
  name: /Abrir fonte original.*página 14/,
});
const reviewProof = page.getByRole("heading", {
  name: "2020-02 · prova",
  exact: true,
});
const planProof = page.locator(".plan__proof");
const alerts = () => page.getByRole("alert").allTextContents();
const settled = () =>
  page.locator('.plan__workspace[aria-busy="false"]').waitFor();

async function capture(name) {
  await page.mouse.move(5, 5);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(output, name + ".png") });
}

async function check(name, fn) {
  try {
    await fn();
    checks.push(name);
  } catch (error) {
    failures.push({
      name,
      message: String(error.message).replaceAll(base, "<loopback>"),
    });
  }
}

async function selectFebruary() {
  await page.goto(reviewURL);
  await button("2020-02").click();
  await reviewProof.waitFor();
}

async function openExactOriginal() {
  await page.waitForFunction(() =>
    [...document.querySelectorAll(".aw-source-action")].some((link) =>
      link.getAttribute("href")?.endsWith("#page=14"),
    ),
  );
  const opened = context.waitForEvent("page");
  await original.click();
  const pdf = await opened;
  await pdf.waitForURL(/#page=14$/);
  assert.ok(pdf.url().startsWith("blob:"));
  await pdf.close();
}

try {
  await page.goto(base + "/entrar");
  await page
    .getByLabel("Email", { exact: true })
    .fill("ariadne-browser@example.com");
  await page
    .getByLabel("Senha", { exact: true })
    .fill("synthetic-local-qa-password");
  await button("Entrar").click();
  await page.waitForURL("**/conta");
  assert.equal(
    (await context.request.get(base + "/api/auth/me")).status(),
    200,
  );

  await check(
    "selected February proof carries through the exact Close baseline to PDF page 14",
    async () => {
      await selectFebruary();
      await original.waitFor();
      observations.review = await reviewProof.textContent();
      await page
        .getByRole("link", {
          name: "Planejar a partir deste estado",
          exact: true,
        })
        .click();
      await settled();
      observations.planning = await planProof
        .getByRole("heading")
        .textContent();
      assert.equal(new URL(page.url()).searchParams.get("baseline"), baseline);
      await capture(
        observations.planning.startsWith("2020-02")
          ? "planning-after"
          : "planning-before",
      );
      assert.equal(observations.planning, "2020-02 · prova");
      await openExactOriginal();
      await page.setViewportSize({ width: 1920, height: 1080 });
      await button("Modo escuro").click();
      await capture("planning-after-dark");
      await page.setViewportSize({ width: 1440, height: 900 });
    },
  );

  await check(
    "missing original preserves context and recovers through one targeted retry",
    async () => {
      const pattern = "**" + originalURL;
      const missing = await context.request.get(
        base + apiRoot + `/sources/${randomUUID()}/original`,
      );
      assert.equal(missing.status(), 404);
      await page.route(pattern, (route) =>
        route.fulfill({ response: missing }),
      );
      try {
        await selectFebruary();
        await page
          .getByRole("alert")
          .filter({ hasText: "Original indisponível" })
          .waitFor();
        const selected = page.url();
        assert.equal(
          (await context.request.get(base + "/api/auth/me")).status(),
          200,
        );
        observations.missing = {
          alerts: await alerts(),
          workingDocumentLinks: await page
            .getByRole("link", { name: /Baixar original|Ampliar página/ })
            .count(),
        };
        await capture(
          observations.missing.workingDocumentLinks
            ? "original-before"
            : "original-unavailable",
        );
        assert.deepEqual(observations.missing, {
          alerts: ["Original indisponível neste contexto."],
          workingDocumentLinks: 0,
        });
        const stateChanges = await page.evaluateHandle(() => {
          const changes = [];
          const status = document.querySelector("[data-ariadne-state]");
          const observer = new MutationObserver(() =>
            changes.push(status.textContent),
          );
          observer.observe(status, {
            childList: true,
            subtree: true,
            characterData: true,
          });
          return changes;
        });
        await page.unroute(pattern);
        const request = page.waitForRequest(
          (req) => new URL(req.url()).pathname === originalURL,
        );
        const otherRequests = [];
        const record = (req) => {
          const url = new URL(req.url());
          if (
            req.isNavigationRequest() ||
            (url.pathname.startsWith(apiRoot) && url.pathname !== originalURL)
          )
            otherRequests.push(url.pathname);
        };
        page.on("request", record);
        await button("Tentar carregar original novamente").click();
        await request;
        await openExactOriginal();
        page.off("request", record);
        assert.equal(page.url(), selected);
        await reviewProof.waitFor();
        assert.deepEqual(await alerts(), []);
        assert.deepEqual(
          otherRequests,
          [],
          "retry does not reload the review or recalculate",
        );
        assert.deepEqual(
          await stateChanges.jsonValue(),
          [],
          "retry does not announce review state again",
        );
        assert.equal(await page.locator("[data-ariadne-state]").count(), 1);
        await stateChanges.dispose();
        await capture("original-recovered");
      } finally {
        await page.unroute(pattern);
      }
    },
  );

  const malformed = "not-a-proof";
  const absent = "";
  const unsupported = JSON.stringify([source, "page:11/demand-observation"]);
  const staleLocator = JSON.stringify([source, "page:99/demand-observation"]);
  const foreignSource = JSON.stringify([
    randomUUID(),
    "page:14/demand-observation",
  ]);
  for (const [label, key] of Object.entries({
    malformed,
    absent,
    unsupported,
    staleLocator,
    foreignSource,
  })) {
    await check(
      `${label} handoff keeps baseline and requires a new explicit selection`,
      async () => {
        const url = new URL(planURL);
        url.searchParams.set("proof", key);
        // A valid-looking label cannot stand in for a missing exact reference.
        url.searchParams.set("month", "2020-02");
        const originals = [];
        const record = (req) => {
          if (new URL(req.url()).pathname.endsWith("/original"))
            originals.push(req.url());
        };
        page.on("request", record);
        try {
          await page.goto(url.href);
          await settled();
          await page
            .getByText(
              "A seleção anterior não corresponde a uma prova deste baseline.",
              { exact: false },
            )
            .waitFor();
          assert.equal(await planProof.count(), 0);
          assert.deepEqual(originals, []);
          assert.equal(
            new URL(page.url()).searchParams.get("baseline"),
            baseline,
          );
          if (label === "staleLocator") await capture("planning-unmatched");
          await page.getByRole("button", { name: /^2020-02/ }).click();
          assert.equal(
            await planProof.getByRole("heading").textContent(),
            "2020-02 · prova",
          );
          assert.equal(new URL(page.url()).searchParams.has("proof"), false);
        } finally {
          page.off("request", record);
        }
      },
    );
  }
  await check(
    "direct entry keeps the default, and a saved scenario keeps its exact selection on refresh",
    async () => {
      await page.goto(planURL);
      await settled();
      assert.equal(
        await planProof.getByRole("heading").textContent(),
        "2019-06 · prova",
      );
      const saved = new URL(planURL);
      saved.searchParams.set("scenario", scenario);
      saved.searchParams.set(
        "item",
        JSON.stringify([source, "page:14/demand-observation"]),
      );
      await page.goto(saved.href);
      await settled();
      await page.reload();
      await settled();
      assert.equal(
        await planProof.getByRole("heading").textContent(),
        "2020-02 · prova",
      );
      assert.equal(new URL(page.url()).searchParams.get("scenario"), scenario);
    },
  );

  for (const [code, message] of [
    [
      401,
      "Sessão indisponível. Entre novamente em outra aba e tente carregar o original aqui.",
    ],
    [403, "Original indisponível neste contexto."],
    [503, "Não foi possível carregar o original agora. Tente novamente."],
    ["network", "Não foi possível carregar o original agora. Tente novamente."],
  ]) {
    await check(
      `Planning handles original ${code} without changing the preserved scenario`,
      async () => {
        const pattern = "**" + originalURL;
        await page.route(pattern, (route) =>
          code === "network"
            ? route.abort()
            : route.fulfill({
                status: code,
                body: "Synthetic server detail that must stay private",
              }),
        );
        try {
          const saved = new URL(planURL);
          saved.searchParams.set("scenario", scenario);
          saved.searchParams.set("month", "2020-02");
          await page.goto(saved.href);
          await settled();
          await page.getByRole("alert").waitFor();
          assert.deepEqual(await alerts(), [message]);
          assert.equal(await original.count(), 0);
          assert.equal(
            await planProof.getByRole("heading").textContent(),
            "2020-02 · prova",
          );
          assert.equal(
            await page.locator("[data-ariadne-state]").textContent(),
            "Cenário preservado",
          );
          const before = page.url();
          await page.unroute(pattern);
          await button("Tentar carregar original novamente").click();
          await openExactOriginal();
          assert.equal(page.url(), before);
          assert.deepEqual(await alerts(), []);
        } finally {
          await page.unroute(pattern);
        }
      },
    );
  }

  for (const screen of ["planning", "review"]) {
    await check(
      `${screen} keeps separate errors when an analytical operation and the original fail`,
      async () => {
        const isPlanning = screen === "planning";
        const simulation = `${apiRoot}/calculations/${baseline}/planning`;
        const operationURL = isPlanning
          ? simulation + "/preview"
          : apiRoot + "/calculate";
        const operationPattern = (url) => url.pathname === operationURL;
        const originalPattern = "**" + originalURL;
        const snapshotURL = isPlanning
          ? simulation + `/scenarios/${scenario}/export`
          : apiRoot + `/calculations/${baseline}`;
        const body = async () => {
          const response = await context.request.get(base + snapshotURL);
          assert.equal(response.status(), 200);
          return response.body();
        };
        const before = await body();
        const unavailable = "Original indisponível neste contexto.";
        const failure = isPlanning
          ? "Não foi possível atualizar a simulação."
          : "Não foi possível verificar e preservar o resultado.";
        const privateDetail = "Synthetic private server details";
        const save = button("Preservar cenário");
        let failuresSeen = 0;
        await page.route(originalPattern, (route) =>
          route.fulfill({
            status: 404,
            json: { detail: privateDetail },
          }),
        );
        try {
          if (isPlanning) {
            const saved = new URL(planURL);
            saved.searchParams.set("scenario", scenario);
            saved.searchParams.set("month", "2020-02");
            const initial = page.waitForResponse(
              (response) => new URL(response.url()).pathname === operationURL,
            );
            await page.goto(saved.href);
            await initial;
            await settled();
          } else {
            await selectFebruary();
          }
          await page.getByText(unavailable, { exact: true }).waitFor();
          await page.route(operationPattern, (route) => {
            failuresSeen++;
            return route.fulfill({
              status: 503,
              json: { detail: privateDetail },
            });
          });
          const failedResponse = page.waitForResponse(
            (response) =>
              new URL(response.url()).pathname === operationURL &&
              response.status() === 503,
          );
          if (isPlanning) {
            await page.getByLabel("Demanda candidata em kW").fill("259");
            await failedResponse;
            await settled();
            assert.ok(await save.isDisabled());
          } else {
            const calculate = button("Verificar e preservar resultado");
            await calculate.click();
            await failedResponse;
            await page.waitForFunction(() =>
              [...document.querySelectorAll("button")].some(
                (control) =>
                  control.textContent.trim() ===
                    "Verificar e preservar resultado" && !control.disabled,
              ),
            );
            assert.equal(
              failuresSeen,
              2,
              "the test denies both automatic write attempts",
            );
          }

          const concurrentAlerts = await alerts();
          observations[`${screen}ConcurrentErrors`] = concurrentAlerts;
          await capture(`${screen}-concurrent-errors`);
          assert.equal(concurrentAlerts.length, 2);
          const proof = isPlanning ? planProof : page.locator(".desk__proof");
          assert.deepEqual(await proof.getByRole("alert").allTextContents(), [
            unavailable,
          ]);
          const operationMessage = concurrentAlerts.find((message) =>
            message.startsWith(failure),
          );
          assert.ok(
            operationMessage,
            "the analytical failure is visible alongside the original failure",
          );
          assert.ok(
            !(await page.locator("body").textContent()).includes(privateDetail),
          );
          if (isPlanning) {
            const description = await save.getAttribute("aria-describedby");
            assert.ok(description);
            assert.equal(
              await page.locator(`#${description}`).textContent(),
              operationMessage,
            );
            await page.setViewportSize({ width: 1920, height: 1080 });
            await button("Modo escuro").click();
            await capture("planning-concurrent-errors-dark");
            await page.setViewportSize({ width: 1440, height: 900 });
          }

          const selected = page.url();
          const recoveryRequests = [];
          const record = (request) =>
            recoveryRequests.push(new URL(request.url()).pathname);
          const stateChanges = await page.evaluateHandle(() => {
            const changes = [];
            const status = document.querySelector("[data-ariadne-state]");
            new MutationObserver(() =>
              changes.push(status.textContent),
            ).observe(status, {
              childList: true,
              subtree: true,
              characterData: true,
            });
            return changes;
          });
          await page.unroute(originalPattern);
          page.on("request", record);
          try {
            await button("Tentar carregar original novamente").click();
            await openExactOriginal();
          } finally {
            page.off("request", record);
          }
          assert.deepEqual(
            recoveryRequests.filter((url) => url.startsWith(apiRoot)),
            [originalURL],
          );
          assert.deepEqual(await stateChanges.jsonValue(), []);
          assert.equal(await page.locator("[data-ariadne-state]").count(), 1);
          await stateChanges.dispose();
          assert.equal(page.url(), selected);
          assert.deepEqual(await alerts(), [operationMessage]);
          if (isPlanning) assert.ok(await save.isDisabled());
          assert.ok(
            before.equals(await body()),
            "recovery must preserve the persisted result bytes",
          );
        } finally {
          await page.unroute(originalPattern);
          await page.unroute(operationPattern);
        }
      },
    );
  }
  await check(
    "failed draft suppresses stale results until a matching preview succeeds",
    async () => {
      const simulation = apiRoot + "/calculations/" + baseline + "/planning";
      const previewPattern = (url) => url.pathname === simulation + "/preview";
      const originalPattern = "**" + originalURL;
      const exportScenario = async (id) => {
        const response = await context.request.get(
          base + simulation + "/scenarios/" + id + "/export",
        );
        assert.equal(response.status(), 200);
        return response.body();
      };
      const history = await Promise.all([
        exportScenario(scenario),
        exportScenario(manifest.legacy),
      ]);
      const saved = new URL(planURL);
      saved.searchParams.set("scenario", scenario);
      saved.searchParams.set("month", "2020-02");
      await page.route(originalPattern, (route) =>
        route.fulfill({
          status: 404,
          json: { detail: "Synthetic original unavailable" },
        }),
      );
      try {
        await page.goto(saved.href);
        await settled();
        const candidate = page.getByLabel("Demanda candidata em kW");
        const save = button("Preservar cenário");
        const curve = page.locator(".plan__curve svg");
        const impact = page.locator(".plan__delta");
        const previewAlert = page.getByRole("alert").filter({
          hasText: "Não foi possível atualizar a simulação.",
        });
        const workspace = page.locator(".plan__workspace");
        await page
          .getByText("Original indisponível neste contexto.", { exact: true })
          .waitFor();
        assert.equal(Number(await candidate.inputValue()), 280);
        await curve.waitFor();
        assert.equal(await impact.textContent(), "R$ 0,00");
        assert.ok(await save.isEnabled());

        const changes = await page.evaluateHandle(() => {
          const changes = [];
          const status = document.querySelector("[data-ariadne-state]");
          new MutationObserver(() => changes.push(status.textContent)).observe(
            status,
            { childList: true, subtree: true, characterData: true },
          );
          return changes;
        });
        await page.route(previewPattern, (route) =>
          route.fulfill({
            status: 503,
            json: { detail: "Synthetic preview unavailable" },
          }),
        );
        const failed = page.waitForResponse(
          (response) =>
            previewPattern(new URL(response.url())) &&
            response.status() === 503,
        );
        await candidate.fill("259");
        await failed;
        await settled();
        await previewAlert.waitFor();

        async function assertUnvalidated() {
          assert.equal(await impact.count(), 0);
          assert.equal(await curve.count(), 0);
          await page
            .getByText("Sem resultado para as premissas atuais.", {
              exact: true,
            })
            .waitFor();
          assert.equal(
            await planProof
              .getByText("Subtotal modelado do mês", { exact: true })
              .count(),
            0,
          );
          assert.equal(
            await planProof
              .getByText("Demanda candidata", { exact: true })
              .count(),
            0,
          );
          assert.equal(
            await workspace
              .locator('[data-key="candidate"], [data-key="threshold"]')
              .count(),
            0,
          );
          assert.ok(await save.isDisabled());
          assert.equal(
            await save.getAttribute("aria-describedby"),
            await previewAlert.getAttribute("id"),
          );
          assert.equal(
            await planProof.getByRole("heading").textContent(),
            "2020-02 · prova",
          );
          assert.equal(page.url(), saved.href);
        }
        await assertUnvalidated();
        await capture("failed-259-after");
        await button("Reconstruir resultado").click();
        await page
          .getByText("Replay exato: resultado idêntico.", { exact: true })
          .waitFor();
        await assertUnvalidated();

        const recoveryRequests = [];
        const record = (request) => {
          const { pathname } = new URL(request.url());
          if (pathname.startsWith(apiRoot)) recoveryRequests.push(pathname);
        };
        await page.unroute(originalPattern);
        page.on("request", record);
        try {
          await button("Tentar carregar original novamente").click();
          await openExactOriginal();
        } finally {
          page.off("request", record);
        }
        assert.deepEqual(recoveryRequests, [originalURL]);
        await assertUnvalidated();

        // A successful HTTP response cannot validate a different set of premises.
        await page.unroute(previewPattern);
        await page.route(previewPattern, async (route) => {
          const response = await route.fetch();
          assert.equal(response.status(), 200);
          const payload = await response.json();
          payload.output.assumptions.normalRegime =
            !payload.output.assumptions.normalRegime;
          await route.fulfill({ response, json: payload });
        });
        const mismatched = page.waitForResponse(
          (response) =>
            previewPattern(new URL(response.url())) &&
            response.status() === 200,
        );
        await candidate.fill("260");
        await mismatched;
        await settled();
        await assertUnvalidated();

        await page.unroute(previewPattern);
        const matched = page.waitForResponse(
          (response) =>
            previewPattern(new URL(response.url())) &&
            response.status() === 200,
        );
        await candidate.fill("259");
        const result = await (await matched).json();
        await settled();
        assert.equal(result.output.assumptions.candidateKw, "259");
        assert.equal(result.output.cost, "9516.42");
        await page.getByText("R$ 9.516,42", { exact: true }).waitFor();
        await curve.waitFor();
        assert.equal(
          await planProof.getByText("259 kW", { exact: true }).count(),
          1,
        );
        assert.ok(await save.isEnabled());
        assert.equal(await previewAlert.count(), 0);
        assert.equal(
          await page
            .getByText("Replay exato: resultado idêntico.", { exact: true })
            .count(),
          0,
        );
        assert.deepEqual(await changes.jsonValue(), ["Explorando"]);
        assert.equal(await page.locator("[data-ariadne-state]").count(), 1);
        await changes.dispose();
        await page.setViewportSize({ width: 1920, height: 1080 });
        await button("Modo escuro").click();
        await capture("matching-259-after-dark");
        await page.setViewportSize({ width: 1440, height: 900 });

        const after = await Promise.all([
          exportScenario(scenario),
          exportScenario(manifest.legacy),
        ]);
        assert.ok(history.every((body, i) => body.equals(after[i])));
        observations.failedDraftAfterFix = {
          failedCandidateKw: "259",
          failedResultVisible: false,
          saveEnabledAfterReplay: false,
          saveEnabledAfterOriginalRetry: false,
          mismatchedResponseAccepted: false,
          matchingCandidateKw: result.output.assumptions.candidateKw,
          matchingCost: result.output.cost,
          saveEnabledAfterMatchingPreview: true,
          scenarioStateMutations: ["Explorando"],
          preservedExportsByteIdentical: true,
        };
      } finally {
        await page.unroute(originalPattern);
        await page.unroute(previewPattern);
      }
    },
  );
} finally {
  const result = {
    browser: browser.version(),
    pass: checks.length,
    fail: failures.length,
    skip: 0,
    checks,
    failures,
    observations,
  };
  await writeFile(
    path.join(output, "proof-recovery.json"),
    JSON.stringify(result, null, 2) + "\n",
  );
  console.log(JSON.stringify(result));
  await browser.close();
  if (failures.length) process.exitCode = 1;
}
