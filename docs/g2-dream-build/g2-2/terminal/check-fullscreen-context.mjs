import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { connect } from '../../g2-1/terminal/native-session.mjs';

globalThis.WebSocket = createRequire('C:/dev/nivar-g21-tools/package.json')('ws');
const out = new URL('./fullscreen-context/', import.meta.url);
await fs.mkdir(out, { recursive: true });
const s = await connect();
const checks = [];
const click = async selector => {
  await s.evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'center',behavior:'instant'})`);
  await s.delay(120);
  await s.click(selector);
};
const assert = (name, pass, details) => { checks.push({ name, pass, details }); if (!pass) throw Error(name); };
const key = async (key, code = key) => {
  await s.cdp('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: ({ Home:36, End:35, ArrowRight:39, ArrowDown:40, Enter:13 })[key] });
  await s.cdp('Input.dispatchKeyEvent', { type: 'keyUp', key, code });
};
const range = async (selector, index) => {
  await click(selector); await key('Home');
  for (let i = 0; i < index; i++) await key('ArrowRight');
  await s.delay(180);
};
const navigate = async (url, width = 1440) => {
  await s.cdp('Emulation.setDeviceMetricsOverride', { width, height:width === 390 ? 844 : 1100, deviceScaleFactor:1, mobile:false });
  await s.cdp('Page.navigate', { url:`http://127.0.0.1:4173${url}` });
  await s.until('document.querySelector(".g22-ariadne, .g2-terminal")');
  await s.evaluate('document.fonts.ready');
};
const read = () => s.evaluate(`(() => {
  const e=document.querySelector('.g2-terminal');
  return {width:innerWidth,period:e.dataset.period,metric:e.dataset.metric,source:e.dataset.source,tone:e.dataset.tone,
    region:e.querySelector('.g2t-regions [aria-pressed="true"] .g2t-region-code')?.textContent ?? e.querySelector('.g2t-spatial-tag span')?.childNodes[0].textContent,
    point:e.querySelector('.g2t-time-scrub')?.value ?? null,
    observation:e.querySelector('.g2t-time-scrub')?.getAttribute('aria-valuetext') ?? null,
    note:[...e.querySelectorAll('.g2t-timeline-events button')].findIndex(b=>b.getAttribute('aria-pressed')==='true'),
    question:e.querySelector('.g2t-reading-annotation--question')?.textContent,
    unavailable:!!e.querySelector('.g2t-unavailable'), overflow:document.documentElement.scrollWidth>innerWidth};
})()`);
const handoff = async name => {
  const before = await read();
  const href = await s.evaluate('document.querySelector(".g22-aj-terminal-title a").getAttribute("href")');
  await s.screenshot(new URL(`${name}-embedded.png`, out).pathname.replace(/^\/([A-Z]:)/, '$1'));
  await click('.g22-aj-terminal-title a');
  await s.until('location.pathname==="/br/terminal" && document.querySelector(".g2t-masthead")');
  await s.delay(800);
  const after = await read();
  assert(name, JSON.stringify(before) === JSON.stringify(after), { href, before, after });
  await s.screenshot(new URL(`${name}-fullscreen.png`, out).pathname.replace(/^\/([A-Z]:)/, '$1'));
};
const earn = async width => {
  await navigate('/br/familia/software', width);
  await click('.g22-aj-regions button:nth-child(4)');
  await s.delay(2300);
  await range('.g22-aj-scrubber input', 15);
  await click('.g22-aj-action button');
  await s.delay(850);
  await click('.g22-aj-action button:last-child');
  await s.until('document.querySelector(".g2-terminal") && document.querySelector(".g22-aj-terminal-title a").href.includes("period=")');
  await s.delay(1100);
};

try {
  await earn(1440);
  const initial = await read();
  assert('Ariadne entry Sul 15h', initial.region === 'S' && initial.point === '15' && initial.observation.includes('161,96'), initial);
  await handoff('desktop-initial');

  await earn(1440);
  await click('.g2t-regions button:nth-child(2)');
  await click('[aria-label="Métrica da série"] button:nth-child(2)');
  await click('[aria-label="Janela da série"] button:nth-child(2)');
  await range('.g2t-time-scrub', 2);
  await click('[aria-label="Usar tema claro"]');
  await handoff('desktop-changed');

  await earn(1440);
  await click('.g2t-timeline-events button:first-child');
  await handoff('desktop-note');

  await earn(1440);
  await click('.g2t-source-select select'); await key('End'); await key('Enter');
  await s.until('document.querySelector(".g2-terminal").dataset.source==="unavailable"');
  await handoff('desktop-unavailable');

  await earn(390);
  await click('[aria-label="Métrica da série"] button:nth-child(3)');
  await click('[aria-label="Janela da série no celular"] button:nth-child(3)');
  await range('.g2t-time-scrub', 29);
  await handoff('phone-month-final-observation');

  const cases = [
    ['', {period:'24h', metric:'price', point:'14', tone:'graphite', source:'sample', note:1}],
    ['?region=invalid&period=bogus&metric=__proto__&observation=&note=-1&source=live&tone=other', {period:'24h',metric:'price',point:'14',tone:'graphite',source:'sample',note:1}],
    ['?region=sul&period=7d&observation=7', {period:'7d',point:'4',region:'S'}],
    ['?region=norte&period=30d&metric=storage&observation=29', {period:'30d',metric:'storage',point:'29',region:'N'}],
    ['?observation=1.5&note=2', {point:'19',note:2}],
    ['?observation=Infinity&note=999', {point:'14',note:1}],
  ];
  for (const [query, expected] of cases) {
    await navigate('/br/terminal'+query);
    const actual=await read();
    assert('validated query '+(query||'default'), Object.entries(expected).every(([k,v])=>actual[k]===v), {expected, actual});
  }
  assert('native browser exceptions', s.exceptions.length === 0, s.exceptions);
} finally {
  await fs.writeFile(new URL('results.json', out), JSON.stringify({capturedAt:new Date().toISOString(), method:'Native Chrome CDP mouse/keyboard interactions; live Vite application. No synthetic data injection.',checks,exceptions:s.exceptions},null,2));
  await s.close();
}
console.log(JSON.stringify({passed:checks.filter(c=>c.pass).length,total:checks.length}));
