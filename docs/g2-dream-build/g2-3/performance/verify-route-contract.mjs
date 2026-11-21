import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';

const directory = 'docs/g2-dream-build/g2-3/performance';
const beforeText = fs.readFileSync(`${directory}/before-route-split-main.tsx.txt`, 'utf8').replaceAll('\r\n', '\n');
const afterText = fs.readFileSync('src/main.tsx', 'utf8').replaceAll('\r\n', '\n');
const parse = text => ts.createSourceFile('main.tsx', text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
function routes(text) {
  const source = parse(text);
  const result = [];
  function element(node) {
    if (ts.isJsxElement(node) && node.openingElement.tagName.getText(source) === 'Suspense') {
      return element(node.children.find(child => ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child)));
    }
    const opening = ts.isJsxElement(node) ? node.openingElement : node;
    return {
      component: opening.tagName.getText(source).replace(/^TerminalRoute$/, 'GlobalShell'),
      props: opening.attributes.properties.map(prop => prop.getText(source)),
    };
  }
  function walk(node) {
    if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && node.tagName.getText(source) === 'Route') {
      const attributes = node.attributes.properties;
      const routePath = attributes.find(prop => prop.name?.getText(source) === 'path')?.initializer?.text ?? null;
      const expression = attributes.find(prop => prop.name?.getText(source) === 'element')?.initializer?.expression;
      result.push({ path: routePath, element: element(expression) });
    }
    if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && node.tagName.getText(source) === 'Routes') {
      for (let parent = node.parent; parent; parent = parent.parent) {
        if (ts.isJsxElement(parent)) assert.notEqual(parent.openingElement.tagName.getText(source), 'Suspense', 'The route tree must never be suspended as a whole.');
      }
    }
    ts.forEachChild(node, walk);
  }
  walk(source);
  return result;
}
const beforeRoutes = routes(beforeText);
const afterRoutes = routes(afterText);
assert.deepEqual(afterRoutes, beforeRoutes, 'Route order, paths, target components and props must remain unchanged after unwrapping only the new loading boundaries.');
const before = JSON.parse(fs.readFileSync(`${directory}/before-route-split.json`, 'utf8'));
const after = JSON.parse(fs.readFileSync(`${directory}/after-route-split.json`, 'utf8'));
const retainedCss = after.cssImportOrder.filter(file => before.cssImportOrder.includes(file));
assert.deepEqual(retainedCss, before.cssImportOrder, 'All prior eager styles must retain their cascade order.');
const alexandriaImport = "import { AlexandriaHome } from './pages/alexandria/AlexandriaHome';";
assert(beforeText.includes(alexandriaImport) && afterText.includes(alexandriaImport));
const providerChain = '<StrictMode>\n    <BrowserRouter>';
assert(beforeText.includes(providerChain) && afterText.includes(providerChain));
assert.equal((afterText.match(/<AuthProvider>/g) ?? []).length, 1);
assert.equal((afterText.match(/<\/AuthProvider>/g) ?? []).length, 1);
const report = {
  passed: true,
  routeElements: beforeRoutes.length,
  routeContract: afterRoutes,
  eagerAlexandriaImportPreserved: true,
  previousEagerCssOrderPreserved: true,
  newStylesFromConcurrentPortalWork: after.cssImportOrder.filter(file => !before.cssImportOrder.includes(file)),
  wholeRouteTreeSuspense: false,
  limitation: 'AST/build verification is not browser navigation evidence. Direct route loading and client transitions still belong to the coordinated browser check.',
};
fs.writeFileSync(`${directory}/route-contract-verification.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
