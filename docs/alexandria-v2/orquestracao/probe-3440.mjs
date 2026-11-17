import { createRequire } from 'node:module';
const req = createRequire('C:/Users/aquil/AppData/Roaming/npm/node_modules/@playwright/cli/package.json');
const { chromium } = req('playwright');
const b = await chromium.launch({ headless: true, channel: 'chrome' });
for (const [w,h] of [[3440,1440],[1920,1080]]) {
  const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
  const failed = [];
  p.on('requestfailed', r => failed.push(r.url()+' '+r.failure()?.errorText));
  p.on('response', r => { if (r.status() >= 400 && /alexandria\/v2/.test(r.url())) failed.push(r.status()+' '+r.url()); });
  await p.goto('http://127.0.0.1:5311/alexandria', { waitUntil: 'networkidle' });
  await p.waitForTimeout(3000);
  const imgs = await p.evaluate(() => [...document.querySelectorAll('img')].map(i => ({ cur: i.currentSrc.split('/').pop(), src: (i.getAttribute('src')||'').split('/').pop(), complete: i.complete, nw: i.naturalWidth, w: Math.round(i.getBoundingClientRect().width), h: Math.round(i.getBoundingClientRect().height), cls: i.getAttribute('data-media-class'), loading: i.loading, vis: getComputedStyle(i).visibility, op: getComputedStyle(i).opacity })));
  console.log(w, JSON.stringify(imgs, null, 0));
  console.log('failed', failed);
}
await b.close();
