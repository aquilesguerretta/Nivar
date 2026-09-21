// Native Chrome, isolated context. Anonymous API fixture is limited to this QA tab.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const out = path.dirname(fileURLToPath(import.meta.url));
const version = await (await fetch('http://127.0.0.1:9235/json/version')).json();
const socket = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
let seq = 0, sessionId;
const pending = new Map(), exceptions = [], results = [];
const cdp = (method, params = {}, sid = sessionId) => new Promise((resolve, reject) => {
  const id = ++seq;
  const timer = setTimeout(() => { pending.delete(id); reject(Error(method + ' timeout')); }, 25000);
  pending.set(id, { resolve, reject, timer });
  socket.send(JSON.stringify({ id, method, params, ...(sid ? { sessionId: sid } : {}) }));
});
socket.onmessage = ({ data }) => {
  const m = JSON.parse(data);
  if (m.id) {
    const p = pending.get(m.id); if (!p) return;
    clearTimeout(p.timer); pending.delete(m.id);
    m.error ? p.reject(Error(JSON.stringify(m.error))) : p.resolve(m.result); return;
  }
  if (m.sessionId !== sessionId) return;
  if (m.method === 'Runtime.exceptionThrown') exceptions.push(m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text);
  if (m.method === 'Fetch.requestPaused') cdp('Fetch.fulfillRequest', { requestId: m.params.requestId, responseCode: 401, responseHeaders: [{ name: 'Content-Type', value: 'application/json' }], body: Buffer.from('{"detail":"Anonymous QA fixture"}').toString('base64') }).catch(e => exceptions.push(e.message));
};
const delay = ms => new Promise(r => setTimeout(r, ms));
const evaluate = async expression => {
  const r = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
  return r.result.value;
};
const until = async expression => { for (let i = 0; i < 150; i++) { if (await evaluate(`Boolean(${expression})`)) return; await delay(100); } throw Error('Timeout: ' + expression); };
const scrollTo = async selector => {
  await evaluate(`(()=>{const s=document.querySelector('.g2-shell'),e=s.querySelector(${JSON.stringify(selector)});s.scrollTo({top:s.scrollTop+e.getBoundingClientRect().top-95,behavior:'instant'});})()`);
  await delay(100);
};
const shot = async file => {
  const image = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await fs.writeFile(path.join(out, file), Buffer.from(image.data, 'base64'));
};
const { browserContextId } = await cdp('Target.createBrowserContext', {}, null);
try {
  const { targetId } = await cdp('Target.createTarget', { url: 'about:blank', browserContextId }, null);
  ({ sessionId } = await cdp('Target.attachToTarget', { targetId, flatten: true }, null));
  await cdp('Page.enable'); await cdp('Runtime.enable');
  await cdp('Fetch.enable', { patterns: [{ urlPattern: 'http://127.0.0.1:4173/api/*', requestStage: 'Request' }] });
  await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await cdp('Page.navigate', { url: 'http://127.0.0.1:4173/br/sistema' });
  await until("document.querySelector('.g21-lab')");
  for (const mode of ['light', 'dark']) {
    await evaluate(`localStorage.setItem('nivar-g2-mode','${mode}')`);
    for (const [width, height] of [[1440, 1000], [390, 844]]) {
      await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width === 390 });
      await cdp('Page.navigate', { url: 'http://127.0.0.1:4173/br/sistema' });
      await until("document.querySelector('.g21-lab-materials')");
      await cdp('Page.bringToFront');
      await evaluate('document.fonts.ready.then(()=>true)');
      await evaluate("(()=>{for(const i of document.images)i.loading='eager';return Promise.all([...document.images].map(i=>i.decode().catch(()=>null)));})()");
      await delay(100);
      const prefix = `system-${width}-${mode}`;
      await shot(prefix + '-overview.png');
      await scrollTo('.g21-lab-selector'); await shot(prefix + '-observed.png');
      const before = await evaluate("({state:document.querySelector('.g21-lab-materials').dataset.labState,values:[...document.querySelectorAll('.g21-lab-paper-value strong,.g21-lab-glass-value strong,.g21-lab-reading strong')].map(e=>e.textContent)})");
      // Focus a real button, then activate it with the native keyboard.
      await evaluate("document.querySelector('[data-lab-observation=\"2\"]').focus()");
      await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32, nativeVirtualKeyCode: 32 });
      await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32, nativeVirtualKeyCode: 32 });
      await delay(80);
      const missing = await evaluate("({state:document.querySelector('.g21-lab-materials').dataset.labState,values:[...document.querySelectorAll('.g21-lab-paper-value strong,.g21-lab-glass-value strong,.g21-lab-reading strong')].map(e=>e.textContent),focus:document.activeElement.dataset.labObservation,focusVisible:document.activeElement.matches(':focus-visible'),outline:getComputedStyle(document.activeElement).outlineWidth,pressed:document.activeElement.getAttribute('aria-pressed'),seriesSegments:document.querySelectorAll('.g21-lab-series').length,gaps:document.querySelectorAll('.g21-lab-gap').length})");
      await shot(prefix + '-missing-focus.png');
      if (width === 390) {
        for (const [label, selector] of [['glass', '.g21-lab-glass'], ['instrument', '.g21-lab-dark']]) { await scrollTo(selector); await shot(prefix + '-' + label + '.png'); }
      }
      await scrollTo('.g21-lab-bottom');
      await evaluate("document.querySelector('.g21-lab-provenance summary').click()");
      await shot(prefix + '-provenance.png');
      await evaluate("document.querySelector('[data-lab-toggle]').click()");
      const toggledBack = await evaluate("document.querySelector('.g21-lab-materials').dataset.labState==='observed' && document.querySelector('[data-lab-observation=\"3\"]').getAttribute('aria-pressed')==='true'");
      await scrollTo('[data-system-section="brand"]'); await shot(prefix + '-brand.png');
      await scrollTo('.g21-system-emblems'); await shot(prefix + '-portraits.png');
      await scrollTo('.g21-system-type'); await shot(prefix + '-type.png');
      const measured = await evaluate("(()=>{const s=document.querySelector('.g2-shell');return {width:innerWidth,scrollWidth:s.scrollWidth,theme:s.dataset.g2Theme,font:getComputedStyle(s.querySelector('h1')).fontFamily,sans:getComputedStyle(s).fontFamily,mono:getComputedStyle(s.querySelector('.g21-lab-label')).fontFamily,broken:[...s.querySelectorAll('img')].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src),heroCount:s.querySelectorAll('.g21-system-portrait[data-emblem-variant=hero]').length,backdrop:getComputedStyle(s.querySelector('.g21-lab-glass-pane')).backdropFilter,paper:getComputedStyle(s.querySelector('.g21-lab-paper')).backgroundImage,instrumentLayers:['.g21-lab-dark','.g21-lab-instrument','.g21-lab-reading'].map(q=>getComputedStyle(s.querySelector(q)).backgroundColor)};})()");
      results.push({ width, mode, before, missing, toggledBack, ...measured, pass: measured.scrollWidth <= width && measured.theme === mode && measured.broken.length === 0 && measured.heroCount === 6 && before.values.every(v => v === '81') && missing.values.every(v => v === '—') && missing.state === 'missing' && missing.pressed === 'true' && missing.focusVisible && missing.seriesSegments === 1 && missing.gaps === 2 && toggledBack });
      console.log(prefix + ' captured');
    }
  }
} finally {
  await fs.writeFile(path.join(out, 'results.json'), JSON.stringify({ date: new Date().toISOString(), route: '/br/sistema', browser: 'Chrome native CDP :9235', apiFixture: 'Browser-local anonymous 401 only', results, exceptions }, null, 2));
  await cdp('Target.disposeBrowserContext', { browserContextId }, null); socket.close();
}
console.log(JSON.stringify({ pass: results.filter(r => r.pass).length, total: results.length, failures: results.filter(r => !r.pass), exceptions }));
if (exceptions.length || results.some(r => !r.pass)) process.exitCode = 1;
