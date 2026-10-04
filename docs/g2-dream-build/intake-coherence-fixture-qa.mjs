// Browser-local QA only. Intercepts every API request in a new isolated CDP
// browser context. No credentials, signup, real writes, or backend access.
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { createHash } from 'node:crypto';

const origin = 'http://127.0.0.1:4173';
const screens = path.resolve('docs/g2-dream-build/screens');
const downloads = await fs.mkdtemp(path.join(os.tmpdir(), 'nivar-account-qa-'));
const version = await (await fetch('http://127.0.0.1:9235/json/version')).json();
const socket = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
let sequence = 0;
const pending = new Map();
const events = [];
const exceptions = [];
const requests = [];
const checks = [];
let fixtureSession = true;
let productsFail = false;
let solarFail = false;
let logoutFail = false;
let sessionId;
const cdp = (method, params = {}, sid = sessionId) => new Promise((resolve, reject) => {
  const id = ++sequence;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params, ...(sid ? { sessionId: sid } : {}) }));
});
const pdf = Buffer.from('%PDF-1.4\n% QA FIXTURE ONLY - no actual account document\n1 0 obj<</Type/Catalog>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF');
const sha = createHash('sha256').update(pdf).digest('hex');
const date = '2026-09-10T12:00:00+00:00';
const user = { id: '00000000-0000-4000-8000-000000000001', email: 'qa-fixture@example.invalid', name: 'QA Fixture', authMethods: ['password'], createdAt: date, updatedAt: date };
const products = { products: [{ productId: 'conta-de-luz-express', activatedAt: date }], catalog: ['conta-de-luz-express', 'solar-proposal-validator', 'diagnostico-energetico', 'alexandria'] };
function submission(id, ready) {
  const base = `/api/conta-luz-express/submissions/${id}`;
  return { id, productId: 'conta-de-luz-express', status: ready ? 'ready' : 'submitted', source: { filename: `QA-FIXTURE-source-${ready ? 'ready' : 'pending'}.pdf`, contentType: 'application/pdf', sizeBytes: pdf.length, sha256: sha, downloadUrl: `${base}/source` }, deliverable: ready ? { filename: 'QA-FIXTURE-parecer.pdf', contentType: 'application/pdf', sizeBytes: pdf.length, sha256: sha, downloadUrl: `${base}/deliverable` } : null, createdAt: date, updatedAt: date, deliveredAt: ready ? date : null };
}
const readyId = '00000000-0000-4000-8000-000000000002';
const routes = {
  '/api/conversations': { data: [], summary: { count: 0 } },
  '/api/products/me': products,
  '/api/conta-luz-express/submissions': { data: [submission(readyId, true), submission('00000000-0000-4000-8000-000000000003', false)], summary: { count: 2, submitted: 1, ready: 1 } },
  '/api/solar-proposal-validator/submissions': { data: [], summary: { count: 0, submitted: 0, ready: 0 } },
  '/api/diagnostico-energetico/submissions': { data: [{ id: '00000000-0000-4000-8000-000000000004', productId: 'diagnostico-energetico', sector: 'QA Fixture — indústria', monthlyConsumptionBand: 'QA Fixture — faixa declarada', tariffModality: null, concern: 'QA Fixture: relato sintético usado apenas para verificar a apresentação do contrato.', createdAt: date, updatedAt: date }], summary: { count: 1 } },
};
async function intercept(event) {
  const { requestId, request } = event;
  const url = new URL(request.url);
  if (url.origin !== origin) return cdp('Fetch.failRequest', { requestId, errorReason: 'BlockedByClient' });
  if (!url.pathname.startsWith('/api/')) return cdp('Fetch.continueRequest', { requestId });
  requests.push({ method: request.method, path: url.pathname, fixture: true });
  let responseCode = 200;
  let body;
  let headers = [{ name: 'Content-Type', value: 'application/json' }, { name: 'Cache-Control', value: 'no-store' }];
  if (url.pathname === '/api/auth/me') { responseCode = fixtureSession ? 200 : 401; body = fixtureSession ? { user } : { detail: 'QA fixture: no session' }; }
  else if (url.pathname === '/api/auth/logout' && request.method === 'POST') { responseCode = logoutFail ? 503 : 200; if (!logoutFail) fixtureSession = false; body = logoutFail ? { detail: 'QA fixture: logout unavailable' } : { ok: true }; }
  else if (request.method !== 'GET') { responseCode = 405; body = { detail: 'QA fixture blocks every unplanned mutation' }; }
  else if ((productsFail && url.pathname === '/api/products/me') || (solarFail && url.pathname === '/api/solar-proposal-validator/submissions')) { responseCode = 503; body = { detail: 'QA fixture: unavailable' }; }
  else if (url.pathname === `/api/conta-luz-express/submissions/${readyId}/deliverable`) { body = pdf; headers = [{ name: 'Content-Type', value: 'application/pdf' }, { name: 'Content-Disposition', value: 'attachment; filename="QA-FIXTURE-parecer.pdf"' }]; }
  else if (url.pathname in routes) body = routes[url.pathname];
  else { responseCode = 404; body = { detail: 'No browser-local QA fixture for this endpoint' }; }
  await cdp('Fetch.fulfillRequest', { requestId, responseCode, responseHeaders: headers, body: (Buffer.isBuffer(body) ? body : Buffer.from(JSON.stringify(body))).toString('base64') });
}
socket.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (message.id) { const p = pending.get(message.id); if (!p) return; pending.delete(message.id); if (message.error) p.reject(new Error(JSON.stringify(message.error))); else p.resolve(message.result); return; }
  if (message.method === 'Fetch.requestPaused') intercept(message.params).catch((error) => exceptions.push(`Harness interception: ${error.message}`));
  if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.exception?.description ?? message.params.exceptionDetails.text);
  if (message.method?.startsWith('Browser.download')) events.push({ method: message.method, ...message.params });
};
const evaluate = async (expression) => { const r = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text); return r.result.value; };
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
async function until(expression, label) {
  for (let attempt = 0; attempt < 100; attempt += 1) { if (await evaluate(`Boolean(${expression})`)) return; await delay(100); }
  throw new Error(`Timed out: ${label}`);
}
async function click(selector) {
  const point = await evaluate(`(() => { const e = document.querySelector(${JSON.stringify(selector)}); if (!e) throw Error('Missing selector'); e.scrollIntoView({block:'center',inline:'center'}); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; })()`);
  await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, button: 'left', clickCount: 1 });
  await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, button: 'left', clickCount: 1 });
  await delay(160);
}
async function button(text) { const index = await evaluate(`Array.from(document.querySelectorAll('button')).findIndex(e=>e.textContent.trim()===${JSON.stringify(text)})`); if (index < 0) throw Error(`Missing button: ${text}`); await evaluate(`document.querySelectorAll('button')[${index}].setAttribute('data-qa-action','target')`); await click('[data-qa-action="target"]'); await evaluate(`document.querySelector('[data-qa-action="target"]')?.removeAttribute('data-qa-action')`); }
async function navigate(route) { await cdp('Page.navigate', { url: origin + route }); await until('document.readyState === "complete"', route); }
async function check(label, expression) { const actual = await evaluate(expression); checks.push({ label, pass: Boolean(actual), actual }); if (!actual) throw Error(`Failed check: ${label}`); }
async function screenshot(name, width, height) {
  await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
  await evaluate(`document.querySelector('.g2-account')?.scrollTo(0,0)`);
  await delay(250);
  await check(`viewport ${name}`, `innerWidth === ${width} && innerHeight === ${height}`);
  const { data } = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false, fromSurface: true });
  await fs.writeFile(path.join(screens, `${name}.png`), Buffer.from(data, 'base64'));
}
const { browserContextId } = await cdp('Target.createBrowserContext', {}, null);
const renderedFonts = [];
try {
  const { targetId } = await cdp('Target.createTarget', { url: 'about:blank', browserContextId }, null);
  ({ sessionId } = await cdp('Target.attachToTarget', { targetId, flatten: true }, null));
  await cdp('Page.enable'); await cdp('Runtime.enable'); await cdp('DOM.enable'); await cdp('CSS.enable');
  await cdp('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
  await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: false });
  await navigate('/conta'); await until(`document.querySelector('h1')?.textContent.includes('Olá, QA.')`, 'profile');
  await evaluate('document.fonts.ready.then(()=>true)');
  await check('all four account sections fully visible without horizontal navigation scroll', `(() => {const nav=document.querySelector('.g2-account__profile-nav');const buttons=[...nav.querySelectorAll('button')];const r=nav.getBoundingClientRect();return buttons.length===4 && nav.scrollWidth<=nav.clientWidth && buttons.every(b=>{const v=b.getBoundingClientRect();return v.left>=r.left && v.right<=r.right && v.top>=r.top && v.bottom<=r.bottom && b.scrollWidth<=b.clientWidth})})()`);
  await screenshot('account-profile-fixture-mobile',390,844);
  await click('[aria-label="Usar modo escuro"]'); await screenshot('account-profile-fixture-mobile-dark',390,844);
  for (const [route,key,title] of [['/conta-de-luz-express','cle','Conta de Luz Express'],['/solar-proposal-validator','solar','Solar Proposal Validator'],['/diagnostico-energetico','diagnostico','Diagnóstico Energético']]) {
    await cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
    await navigate(route); await until(`document.querySelector('.g2-intake h1')?.textContent===${JSON.stringify(title)}`,title);
    await evaluate('document.fonts.ready.then(()=>true)');
    await evaluate('Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>null))).then(()=>true)');
    await check(`${key}: real intake opens under browser-local authenticated fixture`, `Boolean(document.querySelector('.g2-intake form')) && document.querySelectorAll('.g2-intake__header .g2-wordmark').length===1 && !document.querySelector('.nivar-wm')`);
    const {root}=await cdp('DOM.getDocument');
    for(const selector of ['.g2-intake h1','.g2-intake form label','.g2-intake__header nav a']) {
      const {nodeId}=await cdp('DOM.querySelector',{nodeId:root.nodeId,selector});
      const {fonts}=await cdp('CSS.getPlatformFontsForNode',{nodeId});
      renderedFonts.push({route,selector,fonts});
      if(!fonts.length || fonts.some(font=>!font.isCustomFont)) throw Error(`Unexpected native font fallback: ${route} ${selector}`);
    }
    await screenshot(`intake-${key}-fixture-desktop`,1440,1000);
    await click('[aria-label="Usar modo escuro"]'); await screenshot(`intake-${key}-fixture-desktop-dark`,1440,1000);
    await click('[aria-label="Usar modo claro"]'); await screenshot(`intake-${key}-fixture-mobile`,390,844);
    await check(`${key}: no horizontal overflow at 390px`, `document.querySelector('.g2-intake').scrollWidth<=innerWidth && document.querySelector('.g2-intake>main').scrollWidth<=innerWidth`);
    await check(`${key}: mobile header links visible`, `[...document.querySelectorAll('.g2-intake__header a,.g2-intake__header button')].every(e=>{const r=e.getBoundingClientRect();return r.left>=0 && r.right<=innerWidth && r.height>0})`);
    await click('[aria-label="Usar modo escuro"]'); await screenshot(`intake-${key}-fixture-mobile-dark`,390,844);
    await check(`${key}: form controls retained`, key==='diagnostico' ? `document.querySelectorAll('.g2-intake form select').length===3 && Boolean(document.querySelector('.g2-intake form textarea'))` : `document.querySelector('.g2-intake input[type=file]').accept.includes('application/pdf') && Boolean(document.querySelector('.g2-intake form button[type=submit]'))`);
  }
  checks.push({label:'all requests were intercepted; no POST was attempted',pass:requests.every(r=>r.method==='GET')});
  checks.push({label:'no runtime exceptions',pass:exceptions.length===0,actual:exceptions});
} catch(error) { checks.push({label:'harness completed',pass:false,error:error.stack}); }
finally {
  const report={fixtureOnly:true,backendAccess:false,realWrites:false,nativeViewports:[[1440,1000],[390,844]],checks,renderedFonts,requests,exceptions,allPassed:checks.every(c=>c.pass)};
  await fs.writeFile('docs/g2-dream-build/intake-coherence-fixture-qa.json',JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({allPassed:report.allPassed,checks:checks.length,failures:checks.filter(c=>!c.pass)},null,2));
  await cdp('Target.disposeBrowserContext',{browserContextId},null);socket.close();if(!report.allPassed)process.exitCode=1;
}
