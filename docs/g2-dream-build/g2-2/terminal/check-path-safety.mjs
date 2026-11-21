import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { compatiblePaths } from '../../../../src/pages/terminal-brasil/terminal-motion.ts';
const cases = [
  ['matching separated segments', 'M0 1L2 3M4 5L6 7', 'M0 2L2 4M4 6L6 8', true],
  ['null gap removed', 'M0 1L2 3M4 5L6 7', 'M0 2L2 4L4 6L6 8', false],
  ['observation count changed', 'M0 1L2 3', 'M0 2L2 4L4 6', false],
  ['invalid coordinate rejected', 'M0 1L2 3', 'M0 2L2 NaN', false],
  ['empty path rejected', '', '', false],
];
const report = cases.map(([name, from, to, expected]) => {
  const actual = compatiblePaths(from, to);
  assert.equal(actual, expected, name);
  return { name, expected, actual, pass: actual === expected };
});
await fs.writeFile(new URL('./path-safety-results.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
console.log(`${report.length} path topology checks passed. The existing sample contains no null observations; this verifies guard behavior, not a nonexistent sample gap.`);
