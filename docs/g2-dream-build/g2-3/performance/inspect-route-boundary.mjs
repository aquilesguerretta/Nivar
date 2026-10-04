import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { gzipSync } from 'node:zlib';
import ts from 'typescript';

const root = process.cwd();
const out = path.join(root, 'docs/g2-dream-build/g2-3/performance');
const label = process.argv[2] ?? 'inspection';
const relative = file => path.relative(root, file).replaceAll('\\', '/');
const seen = new Set();
const css = [];
const packages = new Map();
const resolveLocal = (from, specifier) => {
  const base = specifier.startsWith('@/') ? path.join(root, 'src', specifier.slice(2)) : path.resolve(path.dirname(from), specifier);
  return [base, ...['.tsx', '.ts', '.jsx', '.js', '.json', '.css'].map(ext => base + ext), ...['index.ts', 'index.tsx', 'index.js'].map(name => path.join(base, name))].find(file => fs.existsSync(file) && fs.statSync(file).isFile());
};
function staticImports(file) {
  const code = fs.readFileSync(file, 'utf8');
  const source = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, false, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.JS);
  return source.statements.filter(node => (ts.isImportDeclaration(node) && !node.importClause?.isTypeOnly) || (ts.isExportDeclaration(node) && !node.isTypeOnly))
    .map(node => node.moduleSpecifier?.text).filter(Boolean);
}
function visit(file) {
  if (seen.has(file)) return;
  seen.add(file);
  if (file.endsWith('.css')) { css.push(relative(file)); return; }
  if (file.endsWith('.json')) return;
  for (const specifier of staticImports(file)) {
    if (specifier.startsWith('.') || specifier.startsWith('@/')) {
      const resolved = resolveLocal(file, specifier);
      if (resolved) visit(resolved);
    } else {
      if (!packages.has(specifier)) packages.set(specifier, []);
      packages.get(specifier).push(relative(file));
      if (specifier.endsWith('.css') && !css.includes(specifier)) css.push(specifier);
    }
  }
}
visit(path.join(root, 'src/main.tsx'));
const index = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8');
const entry = index.match(/<script[^>]+src="([^"]+)"/)?.[1];
const eager = [];
const chunkSeen = new Set();
function chunk(file) {
  if (chunkSeen.has(file)) return;
  chunkSeen.add(file);
  const bytes = fs.readFileSync(file);
  eager.push({ file: relative(file), bytes: bytes.length, gzipBytes: gzipSync(bytes).length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') });
  for (const specifier of staticImports(file)) {
    if (specifier.startsWith('.') && specifier.endsWith('.js')) chunk(path.resolve(path.dirname(file), specifier));
  }
}
chunk(path.join(root, 'dist', entry.replace(/^\//, '')));
const cssAssets = [...index.matchAll(/<link[^>]+href="([^"]+\.css)"/g)].map(([, url]) => {
  const file = path.join(root, 'dist', url.replace(/^\//, ''));
  const bytes = fs.readFileSync(file);
  return { file: relative(file), bytes: bytes.length, gzipBytes: gzipSync(bytes).length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
});
const report = { label, staticSourceModules: seen.size, cssImportOrder: css, packageImports: Object.fromEntries(packages), entry, eagerJavaScript: eager, eagerJavaScriptBytes: eager.reduce((sum, item) => sum + item.bytes, 0), eagerJavaScriptGzipBytes: eager.reduce((sum, item) => sum + item.gzipBytes, 0), entryCss: cssAssets };
fs.writeFileSync(path.join(out, `${label}.json`), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(out, `${label}-main.tsx.txt`), fs.readFileSync(path.join(root, 'src/main.tsx')));
console.log(JSON.stringify({ label, staticSourceModules: report.staticSourceModules, entry, eagerJavaScript: eager, eagerJavaScriptBytes: report.eagerJavaScriptBytes, eagerJavaScriptGzipBytes: report.eagerJavaScriptGzipBytes, cssImportOrder: css, entryCss: cssAssets }, null, 2));
