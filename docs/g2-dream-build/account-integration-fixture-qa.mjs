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
try {
  const { targetId } = await cdp('Target.createTarget', { url: 'about:blank', browserContextId }, null);
  ({ sessionId } = await cdp('Target.attachToTarget', { targetId, flatten: true }, null));
  await cdp('Page.enable'); await cdp('Runtime.enable'); await cdp('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
  await cdp('Browser.setDownloadBehavior', { behavior: 'allowAndName', browserContextId, downloadPath: downloads, eventsEnabled: true }, null);
  await cdp('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await navigate('/conta');
  await until(`document.querySelector('h1')?.textContent.includes('Olá, QA.')`, 'profile identity');
  await until(`document.body.textContent.includes('1 de 4 produtos ativados.')`, 'product fixture');
  await check('fixture identity renders exact name/email', `document.body.textContent.includes('QA Fixture') && document.body.textContent.includes('qa-fixture@example.invalid')`);
  await screenshot('account-profile-fixture-desktop', 1440, 1000);
  await click('[aria-label="Usar modo escuro"]');
  await screenshot('account-profile-fixture-desktop-dark', 1440, 1000);
  await click('[aria-label="Usar modo claro"]');
  await screenshot('account-profile-fixture-mobile', 390, 844);
  await check('mobile page has no horizontal overflow', `document.querySelector('.g2-account').scrollWidth <= innerWidth`);
  await click('[aria-label="Usar modo escuro"]');
  await screenshot('account-profile-fixture-mobile-dark', 390, 844);
  await click('[aria-label="Usar modo claro"]');
  await button('Análises e pedidos');
  await check('ready, pending, empty solar and null diagnostic contracts', `document.querySelectorAll('.g2-account__request').length===3 && document.body.textContent.includes('PARECER PRONTO') && document.body.textContent.includes('EM LEITURA') && document.body.textContent.includes('Não informada') && document.body.textContent.includes('QA Fixture: relato sintético')`);
  await check('mobile requests have no horizontal overflow', `document.querySelector('.g2-account').scrollWidth <= innerWidth`);
  await click('a[download="QA-FIXTURE-parecer.pdf"]');
  for (let i=0;i<60 && !events.some(e=>e.state==='completed');i++) await delay(100);
  const accountDownload = events.find(e=>e.method==='Browser.downloadWillBegin');
  if (!accountDownload || !events.some(e=>e.guid===accountDownload.guid && e.state==='completed')) throw Error('No completed fixture PDF download');
  const downloaded = await fs.readFile(path.join(downloads,accountDownload.guid));
  checks.push({label:'account download uses exact fixture bytes and relative endpoint',pass:downloaded.equals(pdf), filename:accountDownload.suggestedFilename, sha256:createHash('sha256').update(downloaded).digest('hex')});
  await button('Seus produtos');
  await check('catalog uses all four fixture product ids', `document.querySelectorAll('.g2-account__product-list>li').length===4`);
  productsFail = true; solarFail = true;
  await navigate('/conta'); await until(`document.querySelector('h1')?.textContent.includes('Olá, QA.')`, 'profile error scenario');
  await button('Seus produtos'); await until(`document.querySelector('[role="alert"]')?.textContent.includes('Não foi possível')`, 'products error');
  productsFail = false; solarFail = false; await button('Tentar novamente');
  await until(`document.querySelectorAll('.g2-account__product-list>li').length===4`, 'retry success');
  checks.push({label:'product failure state retries actual client requests',pass:true});
  await button('Acesso e segurança'); await check('security shows password method', `document.body.textContent.includes('Email e senha')`);
  logoutFail = true; await button('Sair da conta');
  await until(`document.querySelector('[role="alert"]')?.textContent.includes('não confirmou')`, 'failed logout warning');
  await check('failed logout stays visible without claiming session ended', `location.pathname==='/conta' && document.body.textContent.includes('pode continuar ativo')`);
  logoutFail = false; await button('Tentar sair novamente'); await until(`location.pathname==='/br'`, 'successful logout');
  await navigate('/conta'); await until(`location.pathname==='/entrar'`, 'cleared session guard');
  checks.push({label:'logout retry succeeds and profile redirects after cleared fixture session',pass:true});
  await navigate('/operador/conta-de-luz-express/cle-8f2a');
  await until(`document.querySelector('.g2-case')`, 'case');
  await evaluate(`sessionStorage.setItem('nivar.g2.case-draft.cle-8f2a',JSON.stringify({text:{},questions:42,annotations:{distribuidora:{note:42,reference:{bad:true},nature:[],sourceHash:'invalid'},modalidade:null},history:[null,{at:'invalid',action:'bad'},{at:'2026-09-10T12:00:00Z',action:'QA fixture valid history'}]}))`);
  await navigate('/operador/conta-de-luz-express/cle-8f2a');
  await until(`document.querySelector('.g2-case__annotation textarea')`, 'malformed draft recovery');
  await check('malformed stored annotation types are normalized without crash', `document.querySelector('.g2-case__annotation textarea').value==='' && document.body.textContent.includes('0/10 com anotação local')`);
  await button('Histórico'); await check('malformed history ignored; valid entry preserved', `document.body.textContent.includes('QA fixture valid history') && !document.body.textContent.includes('Invalid Date')`);
  await click('.g2-case__tabs button:first-child');
  await evaluate(`window.__qaUrls=[]; window.__qaRevoked=[]; const make=URL.createObjectURL.bind(URL);const revoke=URL.revokeObjectURL.bind(URL);URL.createObjectURL=(blob)=>{const url=make(blob);window.__qaUrls.push(url);return url};URL.revokeObjectURL=(url)=>{window.__qaRevoked.push(url);revoke(url)}`);
  const fileA = path.join(downloads,'QA-FIXTURE-local-A.pdf');
  const fileB = path.join(downloads,'QA-FIXTURE-local-B.pdf');
  await fs.writeFile(fileA,pdf); await fs.writeFile(fileB,Buffer.concat([pdf,Buffer.from('\n% second QA fixture')]));
  async function attach(file) { const {root} = await cdp('DOM.getDocument'); const {nodeId} = await cdp('DOM.querySelector',{nodeId:root.nodeId,selector:'input[type="file"]'}); await cdp('DOM.setFileInputFiles',{nodeId,files:[file]}); await until(`document.querySelector('.g2-case__document-toolbar')?.textContent.includes(${JSON.stringify(path.basename(file))})`, 'attach fixture'); }
  await attach(fileA); await button('Vincular anotação a esta fonte');
  await click('.g2-case__annotation textarea'); await cdp('Input.insertText',{text:'QA fixture note with explicit source A.'});
  await attach(fileB); await click('.g2-case__annotation textarea'); await cdp('Input.insertText',{text:' Edit after opening B.'});
  await check('changing open source and editing preserves explicit source A hash', `document.querySelector('.g2-case__annotation-hash code')?.textContent===${JSON.stringify(sha)} && document.body.textContent.includes('a fonte aberta agora é diferente')`);
  await button('Salvar rascunho'); await check('save is clearly browser-session only', `document.body.textContent.includes('Salvo nesta sessão. Nenhum envio realizado.')`);
  const countBefore = events.filter(e=>e.method==='Browser.downloadWillBegin').length;
  await button('Exportar caderno');
  for (let i=0;i<60 && events.filter(e=>e.method==='Browser.downloadWillBegin').length<=countBefore;i++) await delay(100);
  const caseDownload = events.filter(e=>e.method==='Browser.downloadWillBegin').at(-1);
  for (let i=0;i<60 && !events.some(e=>e.guid===caseDownload.guid && e.state==='completed');i++) await delay(100);
  const exported = JSON.parse(await fs.readFile(path.join(downloads,caseDownload.guid),'utf8'));
  checks.push({label:'case export distinguishes original fixture, locally opened source B and annotation source A',pass:exported.case.arquivo==='fatura-julho.pdf' && exported.source.filename==='QA-FIXTURE-local-B.pdf' && exported.source.localOnly===true && exported.draft.annotations.distribuidora.sourceHash===sha && exported.disclaimer.includes('Nenhum dado foi enviado')});
  await click('[aria-label="Remover documento local"]'); await delay(1250);
  await check('local sources and export object URLs revoked', `window.__qaUrls.length===3 && window.__qaUrls.every(url=>window.__qaRevoked.includes(url))`);
  await navigate('/operador/conta-de-luz-express/cle-8f2a'); await until(`document.querySelector('.g2-case__annotation textarea')`, 'saved case');
  await check('session draft restores without pretending source bytes persisted', `document.querySelector('.g2-case__annotation textarea').value===${JSON.stringify(exported.draft.annotations.distribuidora.note)} && document.querySelector('.g2-case__annotation textarea').value.length>0 && !document.querySelector('.g2-case__document') && document.body.textContent.includes('reabra a fonte para conferir')`);
  await evaluate(`sessionStorage.clear()`); await navigate('/operador/conta-de-luz-express/cle-8f2a'); await until(`document.querySelector('.g2-case__annotation textarea')`, 'clear local draft');
  await check('session clear removes saved case draft', `document.querySelector('.g2-case__annotation textarea').value===''`);
  checks.push({label:'only mocked logout POST; no other mutation requests',pass:requests.filter(r=>r.method!=='GET').every(r=>r.path==='/api/auth/logout')});
  checks.push({label:'no runtime exceptions',pass:exceptions.length===0,actual:exceptions});
} catch (error) { checks.push({label:'harness completed',pass:false,error:error.stack}); }
finally {
  await fs.mkdir(screens,{recursive:true});
  const report = { fixtureOnly:true, backendAccess:false, realWrites:false, viewportCapture:'Native CDP PNG, deviceScaleFactor 1', contracts:['app/routers/auth.py','app/routers/products.py','app/routers/conta_luz.py','app/routers/solar_proposal.py','app/routers/diagnostico.py'], checks, requests, exceptions, fixtureDownloads:events.filter(e=>e.method==='Browser.downloadWillBegin').map(e=>({filename:e.suggestedFilename,url:e.url})), allPassed:checks.every(c=>c.pass) };
  await fs.writeFile('docs/g2-dream-build/account-integration-fixture-qa.json',JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({allPassed:report.allPassed,checks:checks.length,failures:checks.filter(c=>!c.pass),screens,downloads},null,2));
  await cdp('Target.disposeBrowserContext',{browserContextId},null); socket.close();
  if (!report.allPassed) process.exitCode=1;
}
