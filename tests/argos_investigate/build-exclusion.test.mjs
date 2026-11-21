import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { preview } from "vite";

const forbidden = /argos_investigate|Investigue o setor energético|claim:investigate:|document:frontier:green-v68:table-4|observation:iea:etp-2026:cn:pv-wafer:capacity-share:2024|j3:event:cn-2025-04-04-export-licensing|milestone:frontier:ise-oxford-prototype/i;
const targets = [
  { label: "Production", directory: "dist" },
  { label: "Preview equivalente", directory: process.env.ARGOS_INVESTIGATE_PREVIEW_DIST },
];

for (const { label, directory } of targets) {
  test(`${label}: artefatos e servidor compilado excluem o Investigate local`, async () => {
    assert.ok(directory, "Configure ARGOS_INVESTIGATE_PREVIEW_DIST antes do teste de exclusão.");
    const outDir = path.resolve(directory);
    const files = await readdir(outDir, { recursive: true, withFileTypes: true });
    const index = await readFile(path.join(outDir, "index.html"), "utf8");
    for (const file of files) {
      const fullPath = path.join(file.parentPath, file.name);
      const name = path.relative(outDir, fullPath);
      assert.doesNotMatch(name, forbidden);
      if (file.isFile() && /\.(?:html|m?js|json|map|css|txt)$/i.test(name)) {
        assert.doesNotMatch(await readFile(fullPath, "utf8"), forbidden, `Conteúdo local em ${name}`);
      }
    }

    const server = await preview({
      configFile: false,
      envFile: false,
      build: { outDir },
      preview: { host: "127.0.0.1", port: 0, strictPort: true },
      logLevel: "error",
    });
    try {
      const address = server.httpServer.address();
      assert.equal(address.address, "127.0.0.1");
      const base = `http://127.0.0.1:${address.port}`;
      for (const route of ["/tests/argos_investigate/fixture.html", "/src/features/argos_investigate/Investigate.tsx"]) {
        const response = await fetch(base + route);
        const body = await response.text();
        assert.doesNotMatch(body, forbidden);
        if (response.status !== 404) assert.equal(body, index);
      }
    } finally {
      await server.close();
    }
  });
}
