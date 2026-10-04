// Local QA fixture origin. Every /api response is synthetic; no request or cookie
// is forwarded to the backend. Ports 5188 / 5189 render authenticated / public UI.
// Usage: node docs/g2-dream-build/g2-3/evidence/client/fixture-server.mjs
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const date = '2026-09-12T12:00:00Z';
const logPath = path.resolve('docs/g2-dream-build/g2-3/evidence/client/fixture-requests.jsonl');
const user = { id: 'fixture-user', name: 'Ensaio local', email: 'qa@example.invalid', authMethods: ['password'], createdAt: date, updatedAt: date };
const cases = ['Indústria de ensaio', 'Operação de ensaio'].map((sector, i) => ({ id: `fixture-scope-${i + 1}`, productId: 'diagnostico-energetico', sector, monthlyConsumptionBand: i ? '200 a 500 MWh/mês' : '50 a 200 MWh/mês', tariffModality: null, concern: `Dado de teste local ${i + 1}: verificar contexto e correspondência sem acessar uma conta real.`, createdAt: date, updatedAt: date }));
const conversation = { id: 'fixture-conversation', userId: user.id, productId: 'diagnostico-energetico', status: 'open', subject: 'Ensaio local', originKind: 'diagnostico_energetico_submission', originId: cases[0].id, createdAt: date, updatedAt: date, messages: [{ id: 'fixture-message', conversationId: 'fixture-conversation', authorUserId: user.id, role: 'customer', body: 'Mensagem de teste local: o relato pertence ao primeiro escopo.', createdAt: date }] };

for (const [port, authenticated] of [[5188, true], [5189, false]]) {
  http.createServer(async (request, response) => {
    const url = new URL(request.url, `http://127.0.0.1:${port}`);
    if (url.pathname.startsWith('/api/')) {
      fs.appendFileSync(logPath, JSON.stringify({ at: new Date().toISOString(), port, method: request.method, path: url.pathname, fixture: true }) + '\n');
      response.setHeader('Content-Type', 'application/json');
      response.setHeader('Cache-Control', 'no-store');
      let status = 200;
      let body;
      if (request.method !== 'GET') { status = 503; body = { detail: 'Synthetic local failure; all writes blocked by fixture server.' }; }
      else if (url.pathname === '/api/auth/me') { status = authenticated ? 200 : 401; body = authenticated ? { user } : { detail: 'No local QA session' }; }
      else if (!authenticated) { status = 401; body = { detail: 'No local QA session' }; }
      else if (url.pathname === '/api/products/me') body = { products: ['conta-de-luz-express', 'solar-proposal-validator', 'diagnostico-energetico'].map(productId => ({ productId, activatedAt: date })), catalog: ['conta-de-luz-express', 'solar-proposal-validator', 'diagnostico-energetico', 'alexandria'] };
      else if (url.pathname === '/api/diagnostico-energetico/submissions') body = { data: cases, summary: { count: cases.length } };
      else if (url.pathname === '/api/conversations') body = { data: [conversation], summary: { count: 1 } };
      else if (url.pathname === '/api/conversations/fixture-conversation') body = conversation;
      else if (/\/submissions$/.test(url.pathname)) body = { data: [], summary: { count: 0, submitted: 0, ready: 0 } };
      else { status = 404; body = { detail: 'No local fixture for this API' }; }
      response.writeHead(status); response.end(JSON.stringify(body)); return;
    }
    // Local Vite assets only. Cookies and authorization are intentionally omitted.
    const upstream = http.request({ hostname: '127.0.0.1', port: 5173, path: request.url, method: 'GET', headers: { accept: request.headers.accept || '*/*' } }, upstreamResponse => {
      const headers = { ...upstreamResponse.headers }; delete headers['set-cookie'];
      response.writeHead(upstreamResponse.statusCode || 502, headers); upstreamResponse.pipe(response);
    });
    upstream.on('error', () => { response.writeHead(502); response.end('Local Vite is unavailable.'); });
    upstream.end();
  }).listen(port, '127.0.0.1', () => console.log(`Local synthetic QA: http://127.0.0.1:${port} (${authenticated ? 'authenticated' : 'public'})`));
}
