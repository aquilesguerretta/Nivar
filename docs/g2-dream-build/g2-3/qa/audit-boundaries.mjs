// Read-only repository audit. Writes reports only; never alters git/runtime.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';

const qa = 'docs/g2-dream-build/g2-3/qa';
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).trimEnd();
const hash = buffer => createHash('sha256').update(buffer).digest('hex').toUpperCase();
const baseline = fs.readFileSync('docs/g2-dream-build/g2-3/baseline/alexandria-sha256.txt', 'utf8').trim().split(/\r?\n/).map(line => {
  const [, expected, filename] = line.match(/^([A-Fa-f0-9]{64})\s+(.+)$/);
  const exists = fs.existsSync(filename);
  const actual = exists ? hash(fs.readFileSync(filename)) : null;
  return { path: filename, baselineSha256: expected.toUpperCase(), actualSha256: actual, unchanged: exists && expected.toUpperCase() === actual };
});
const starting = fs.readFileSync('docs/g2-dream-build/g2-3/baseline/starting-worktree.txt', 'utf8').split(/\r?\n/).filter(Boolean).map(line => ({ status: line.slice(0, 2), path: line.slice(3).replaceAll('\\', '/') }));
const current = git('status', '--porcelain=v1', '--untracked-files=all', '-z').split('\0').filter(Boolean).map(line => ({ status: line.slice(0, 2), path: line.slice(3).replaceAll('\\', '/') }));
const preexisting = file => starting.some(item => item.path === file || item.path.endsWith('/') && file.startsWith(item.path));
const changed = current.filter(item => !preexisting(item.path));
const protectedPrefixes = ['app/', 'alembic/', 'migrations/', 'src/pages/operador/', 'src/components/operador/', 'src/lib/types/', 'src/lib/auth/', 'src/lib/submissoes/', 'src/lib/conversas/', 'src/lib/diagnostico/'];
const protectedPaths = git('ls-files', '--', ...protectedPrefixes).split(/\r?\n/).filter(Boolean);
const protectedChanges = current.filter(item => protectedPrefixes.some(prefix => item.path.startsWith(prefix)));
const before = git('show', 'HEAD:src/main.tsx');
const after = fs.readFileSync('src/main.tsx', 'utf8');
function entryFacts(text) {
  const source = ts.createSourceFile('main.tsx', text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const imports = source.statements.filter(ts.isImportDeclaration).map(node => ({ source: node.moduleSpecifier.text, declaration: node.getText(source) }));
  const routes = [];
  const visit = node => {
    if ((ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) && node.tagName.getText(source) === 'Route') {
      const attributes = node.attributes.properties.filter(ts.isJsxAttribute);
      const route = attributes.find(item => item.name.getText(source) === 'path');
      const element = attributes.find(item => item.name.getText(source) === 'element');
      if (route?.initializer && ts.isStringLiteral(route.initializer)) routes.push({ path: route.initializer.text, element: element?.initializer?.getText(source) });
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return { imports, routes };
}
const oldFacts = entryFacts(before);
const newFacts = entryFacts(after);
const main = {
  routePathsUnchanged: JSON.stringify(oldFacts.routes.map(item => item.path)) === JSON.stringify(newFacts.routes.map(item => item.path)),
  routeCount: newFacts.routes.length,
  alexandriaRouteBefore: oldFacts.routes.find(item => item.path === '/alexandria/*'),
  alexandriaRouteAfter: newFacts.routes.find(item => item.path === '/alexandria/*'),
  alexandriaImportUnchanged: oldFacts.imports.find(item => item.source.includes('/alexandria/'))?.declaration === newFacts.imports.find(item => item.source.includes('/alexandria/'))?.declaration,
  alexandriaRouteUnchanged: JSON.stringify(oldFacts.routes.find(item => item.path === '/alexandria/*')) === JSON.stringify(newFacts.routes.find(item => item.path === '/alexandria/*')),
  eagerGlobalStyles: newFacts.imports.filter(item => item.source.endsWith('.css')).map(item => item.source),
  indexCssUnchanged: git('diff', 'HEAD', '--', 'src/index.css') === '',
  operatorStylesUnchanged: git('diff', 'HEAD', '--', 'src/pages/operador/g2-operations.css') === '',
  changedRouteElements: newFacts.routes.filter(route => oldFacts.routes.find(old => old.path === route.path)?.element !== route.element),
};
const summary = {
  timestamp: new Date().toISOString(), branch: git('branch', '--show-current'), head: git('rev-parse', 'HEAD'),
  alexandria: { total: baseline.length, unchanged: baseline.filter(item => item.unchanged).length, discrepancies: baseline.filter(item => !item.unchanged), addedOrChangedPaths: current.filter(item => /^(src|public)\//.test(item.path) && /alexandria/i.test(item.path)) },
  protectedSource: { trackedFiles: protectedPaths.length, prefixes: protectedPrefixes, changes: protectedChanges },
  main,
  inventory: {
    preexistingStatusEntries: starting.length,
    currentPreexistingFiles: current.filter(item => preexisting(item.path)).length,
    preexistingTrackedChanges: starting.filter(item => item.status !== '??'),
    newRuntime: changed.filter(item => item.path.startsWith('src/')),
    newTests: changed.filter(item => item.path.startsWith('tests/')),
    newPublicAssets: changed.filter(item => item.path.startsWith('public/')),
    newDocs: changed.filter(item => item.path.startsWith('docs/')),
    unclassified: changed.filter(item => !['src/', 'tests/', 'public/', 'docs/'].some(prefix => item.path.startsWith(prefix))),
  },
};
fs.mkdirSync(qa, { recursive: true });
fs.writeFileSync(path.join(qa, 'alexandria-hash-comparison.json'), JSON.stringify(baseline, null, 2) + '\n');
fs.writeFileSync(path.join(qa, 'boundary-and-inventory.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify({ alexandria: summary.alexandria, protectedSource: summary.protectedSource, main: summary.main, inventoryCounts: Object.fromEntries(Object.entries(summary.inventory).map(([key, value]) => [key, Array.isArray(value) ? value.length : value])) }, null, 2));
if (summary.alexandria.discrepancies.length || summary.alexandria.addedOrChangedPaths.length || protectedChanges.length || !main.routePathsUnchanged || !main.alexandriaImportUnchanged || !main.alexandriaRouteUnchanged) process.exitCode = 1;
