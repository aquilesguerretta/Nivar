// Hook de resolução para importar os .ts de src/lib/data em Node 24 (type stripping):
// resolve import sem extensão para .ts e o alias '@/' para src/. Só leitura.
import { registerHooks } from 'node:module';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
const SRC = 'C:/dev/gridalpha-v2-alexandria-v2-restructure/src/';
registerHooks({
  resolve(spec, ctx, next) {
    let s = spec;
    if (s.startsWith('@/')) s = pathToFileURL(SRC + s.slice(2)).href;
    if ((s.startsWith('.') || s.startsWith('file:')) && !/\.[cm]?[jt]sx?$/.test(s)) {
      const base = s.startsWith('file:') ? s : new URL(s, ctx.parentURL).href;
      for (const ext of ['.ts', '.tsx', '/index.ts']) {
        const p = fileURLToPath(base + ext);
        if (fs.existsSync(p)) return next(pathToFileURL(p).href, ctx);
      }
    }
    return next(s, ctx);
  },
});
