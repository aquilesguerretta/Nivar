// Hook de resolução para importar os .ts de src/ em scripts Node 24 (o Node remove os
// tipos; este hook resolve a extensão omitida e o alias '@/'). Importe ANTES dos .ts:
//   import './ts-hooks-m12-m13.mjs';
// Mesmo hook de verificar-instrumentos-m12.mjs, isolado para os scripts do porte M12/M13.
import { registerHooks } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const SRC = path.join(RAIZ, 'src') + path.sep;
registerHooks({
  resolve(spec, ctx, next) {
    let s = spec;
    if (s.startsWith('@/')) s = pathToFileURL(SRC + s.slice(2)).href;
    if ((s.startsWith('.') || s.startsWith('file:')) && !/\.[cm]?[jt]sx?$|\.json$|\.css$/.test(s)) {
      const base = s.startsWith('file:') ? s : new URL(s, ctx.parentURL).href;
      for (const ext of ['.ts', '.tsx', '/index.ts']) {
        const p = fileURLToPath(base + ext);
        if (fs.existsSync(p)) return next(pathToFileURL(p).href, ctx);
      }
    }
    return next(s, ctx);
  },
});

export { RAIZ };
