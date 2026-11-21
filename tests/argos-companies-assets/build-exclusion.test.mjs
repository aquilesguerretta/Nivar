import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { preview } from "vite";

const buildDirs = [process.env.ARGOS_J2_PREVIEW_DIST, process.env.ARGOS_J2_PRODUCTION_DIST];
const fixturePath = "/tests/argos-companies-assets/fixture.html";
const markers = [
  /argos-companies-assets|CompaniesAssetsFixture|niv79:|j2-workspace|Marechal Duque de Caxias/i,
  /pbrform20f_2025\.htm|OBU-Factsheets-v2-FPSO-MDdC\.pdf|assinatura-de-contratos-de-mero-e-atapu/i,
];

for (const [index, target] of ["Preview", "Production"].entries()) {
  test(target + " build excludes the fixture and its evidence", async () => {
    const outDir = buildDirs[index];
    assert.ok(outDir, "Set ARGOS_J2_PREVIEW_DIST and ARGOS_J2_PRODUCTION_DIST to standard build outputs");
    const indexPage = await readFile(path.join(outDir, "index.html"), "utf8");
    assert.match(indexPage, /<script[^>]+type="module"/);
    const files = await readdir(outDir, { recursive: true, withFileTypes: true });
    for (const file of files.filter((entry) => entry.isFile())) {
      assert.doesNotMatch(file.name, /fixture|argos-companies-assets/i);
      if (!/\.(?:html|js|css|map|json|svg|xml|txt)$/.test(file.name)) continue;
      const contents = await readFile(path.join(file.parentPath, file.name), "utf8");
      for (const marker of markers) assert.doesNotMatch(contents, marker, file.name);
    }

    const server = await preview({ build: { outDir }, preview: { host: "127.0.0.1", port: 0, proxy: {} } });
    try {
      const { port } = server.httpServer.address();
      const result = await fetch("http://127.0.0.1:" + port + fixturePath);
      if (result.status === 200) {
        assert.equal(await result.text(), indexPage, "Only the normal SPA fallback may answer the fixture URL");
      } else {
        assert.equal(result.status, 404);
      }
    } finally {
      await server.close();
    }
  });
}
