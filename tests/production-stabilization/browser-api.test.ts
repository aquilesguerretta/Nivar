import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import {
  browserApiUrl,
  getBackendBase,
  getNewsApiBase,
} from '../../src/lib/backendBase.ts';

const root = fileURLToPath(new URL('../..', import.meta.url));

async function source(path: string): Promise<string> {
  return readFile(`${root}/${path}`, 'utf8');
}

test('browser API resolution is same-origin in production and development', () => {
  assert.equal(browserApiUrl('/api/lmp/current?zone=WEST_HUB'), '/api/lmp/current?zone=WEST_HUB');
  assert.equal(getBackendBase(), '');
  assert.equal(getNewsApiBase(), '');
  assert.throws(() => browserApiUrl('https://example.com/api/lmp/current'));
});

test('local development retains the /api proxy and configurable target', async () => {
  const viteConfig = await source('vite.config.ts');
  assert.match(viteConfig, /env\.VITE_BACKEND_URL/);
  assert.match(viteConfig, /['"]\/api['"]:\s*\{\s*target/);
});

test('Alexandria world Atlas uses a same-origin browser API path', async () => {
  const atlas = await source('src/lib/atlas/worldApi.ts');
  assert.match(atlas, /browserApiUrl\(['"]\/api\/atlas\/world\/countries/);
  assert.doesNotMatch(atlas, /railway\.app/);
});

test('/us live operations uses V2 same-origin endpoints and no V1 runtime', async () => {
  const liveOps = await source('src/hooks/data/useLiveOpsData.ts');
  const globalShell = await source('src/components/GlobalShell.tsx');
  const everyoneNest = await source('src/components/nest/everyone/EveryoneNest.tsx');
  assert.match(liveOps, /\/api\/lmp\/current/);
  assert.match(liveOps, /\/api\/lmp\/24h/);
  assert.match(liveOps, /\/api\/weather\/current/);
  assert.doesNotMatch(liveOps, /VITE_API_URL|gridalpha-production\.up\.railway\.app/);
  assert.doesNotMatch(globalShell, /WESTERN_HUB/);
  assert.doesNotMatch(everyoneNest, /id: 'WESTERN_HUB'|id: 'MET_ED'|id: 'DOM'/);
});

test('SSE builds a valid same-origin EventSource URL', async () => {
  const stream = await source('src/services/api/stream.ts');
  assert.match(stream, /new EventSource\(browserApiUrl\(['"]\/api\/stream['"]\)/);
  assert.doesNotMatch(stream, /railway\.app/);
});

test('AI assistant gates anonymous users with the shared auth state', async () => {
  const assistant = await source('src/components/shared/AIAssistant.tsx');
  const anthropic = await source('src/services/anthropic.ts');

  assert.match(assistant, /useAuth\(\)/);
  assert.match(assistant, /const canUseAI = !authLoading && user !== null/);
  assert.match(assistant, /if \(!canUseAI \|\| !text\.trim\(\) \|\| isStreaming\) return/);
  assert.match(assistant, /to="\/entrar"/);
  assert.match(assistant, /disabled=\{!canUseAI\}/);
  assert.match(assistant, /Sign in required/);
  assert.doesNotMatch(assistant, /isApiKeyConfigured/);
  assert.doesNotMatch(anthropic, /isApiKeyConfigured|VITE_ANTHROPIC/);
});

test('migrated market drivers show unavailable state instead of numeric fallbacks', async () => {
  const lmpCard = await source('src/components/LMPCard.tsx');
  const blockStart = lmpCard.indexOf('Market Drivers row');
  const blockEnd = lmpCard.indexOf('function LMPExpandedZone');
  assert.ok(blockStart >= 0 && blockEnd > blockStart);
  const marketDrivers = lmpCard.slice(blockStart, blockEnd);

  assert.match(marketDrivers, /PJM regional avg/);
  assert.match(marketDrivers, /Comparison unavailable/);
  assert.match(marketDrivers, /price === null \? '—'/);
  assert.match(marketDrivers, /liveOps\.highestZone/);
  assert.doesNotMatch(marketDrivers, /Live station/);
  assert.doesNotMatch(marketDrivers, /\b(?:41|128\.4|2\.1|92|36\.60|32\.04|1\.58)\b/);
});
