import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { preview } from "vite";

const fixture = "/tests/argos-research-frontier/fixture.html";
const code = "/src/features/argos-research-frontier/milestones.ts";
const forbidden = /argos-research-frontier|(?:document|observation|milestone|device):frontier:|10\.1016\/j\.joule\.2026\.102494|10\.1002\/pip\.3928|20841591|0,9994 cm²/i;

for (const [label, directory] of [
  ["Production", "dist"],
  ["Vercel Preview equivalent", process.env.ARGOS_PREVIEW_DIST],
]) {
  test(`${label}: standard build excludes the local entrypoint, source and evidence`, async () => {
    assert.ok(directory, "set ARGOS_PREVIEW_DIST to the standard build made with VERCEL_ENV=preview");
    const outDir = path.resolve(directory);
    const files = await readdir(outDir, { recursive: true, withFileTypes: true });
    assert.ok(files.some((file) => file.name === "index.html"));
    for (const file of files) {
      const fullPath = path.join(file.parentPath, file.name);
      const name = path.relative(outDir, fullPath);
      assert.doesNotMatch(name, forbidden);
      if (file.isFile() && /\.(?:html|m?js|json|map|css|txt)$/i.test(name)) {
        assert.doesNotMatch(await readFile(fullPath, "utf8"), forbidden, `unexpected Frontier content in ${name}`);
      }
    }

    const server = await preview({
      build: { outDir },
      preview: { host: "127.0.0.1", port: 0, strictPort: true },
      logLevel: "error",
    });
    try {
      const address = server.httpServer.address();
      assert.equal(address.address, "127.0.0.1");
      const base = `http://127.0.0.1:${address.port}`;
      const index = await readFile(path.join(outDir, "index.html"), "utf8");
      const response = await fetch(base + "/");
      assert.equal(await response.text(), index);
      for (const route of [fixture, code]) {
        const appRoute = await fetch(base + route);
        const text = await appRoute.text();
        assert.doesNotMatch(text, forbidden);
        if (appRoute.status !== 404) {
          assert.match(appRoute.headers.get("content-type"), /text\/html/);
          assert.equal(text, index);
        }
      }
    } finally {
      await server.close();
    }
  });
}
