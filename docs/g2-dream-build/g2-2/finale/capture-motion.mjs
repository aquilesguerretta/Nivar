import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const require = createRequire('C:/dev/nivar-g21-tools/package.json');
const WebSocket = require('ws');
const directory = path.dirname(fileURLToPath(import.meta.url));
const width = Number(process.argv[2] ?? 1440);
const height = width < 700 ? 844 : 1000;
const url = process.argv[3] ?? 'http://127.0.0.1:4173/docs/g2-dream-build/g2-2/finale/preview.html';
const label = width < 700 ? 'mobile' : 'desktop';
const version = await (await fetch('http://127.0.0.1:9235/json/version')).json();
const socket = new WebSocket(version.webSocketDebuggerUrl);
await new Promise(resolve => socket.once('open', resolve));
let sequence = 0;
const pending = new Map();
const calls = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
  const id = ++sequence;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
});
socket.on('message', raw => {
  const message = JSON.parse(String(raw));
  if (!message.id) return;
  const promise = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) promise?.reject(message.error);
  else promise?.resolve(message.result);
});
const context = (await calls('Target.createBrowserContext')).browserContextId;
const target = (await calls('Target.createTarget', { url: 'about:blank', browserContextId: context })).targetId;
const session = (await calls('Target.attachToTarget', { targetId: target, flatten: true })).sessionId;
const api = (method, params = {}) => calls(method, params, session);
const evaluate = async expression => {
  const result = await api('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
  return result.result.value;
};
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const screenshots = async name => {
  const { data } = await api('Page.captureScreenshot', { format: 'png' });
  await fs.writeFile(path.join(directory, name + '.png'), Buffer.from(data, 'base64'));
};
const wheel = async delta => {
  await api('Input.dispatchMouseEvent', { type: 'mouseWheel', x: width - 35, y: height * .62, deltaX: 0, deltaY: delta });
  await delay(260);
};
const click = async selector => {
  const position = await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
  if (position.y < 110 || position.y > height - 60) await wheel(position.y - height * .55);
  const next = await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,hit:document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('button')===e}})()`);
  if (!next.hit) throw new Error('Click target is obscured: ' + selector);
  await api('Input.dispatchMouseEvent', { type: 'mousePressed', x: next.x, y: next.y, button: 'left', clickCount: 1 });
  await api('Input.dispatchMouseEvent', { type: 'mouseReleased', x: next.x, y: next.y, button: 'left', clickCount: 1 });
  await delay(450);
};
const frames = [];
const writes = [];
const frameDirectory = path.join(directory, 'frames-' + label);
await fs.mkdir(frameDirectory, { recursive: true });
let recording = false;
let recordingLoop;
const capture = async () => {
  while (recording) {
    const { data } = await api('Page.captureScreenshot', { format: 'jpeg', quality: 80 });
    const index = frames.length;
    const file = path.join(frameDirectory, String(index).padStart(5, '0') + '.jpg');
    frames.push({ index, time: Date.now() / 1000 });
    writes.push(fs.writeFile(file, Buffer.from(data, 'base64')));
    await delay(70);
  }
};
const events = [];
try {
  await api('Page.enable');
  await api('Runtime.enable');
  await api('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
  await api('Page.navigate', { url });
  for (let i = 0; i < 40; i++) {
    if (await evaluate('Boolean(document.querySelector(".g22-finale"))')) break;
    await delay(200);
  }
  await evaluate('document.fonts.ready');
  await evaluate('(()=>{const root=document.querySelector(".g2-shell"),s=document.querySelector(".g22-finale");root.scrollTo({top:root.scrollTop+s.getBoundingClientRect().top-360,behavior:"instant"});})()');
  await delay(700);
  await screenshots(`portal-${label}-approach`);
  recording = true;
  recordingLoop = capture();
  await delay(650);
  await wheel(120);
  await wheel(120);
  await screenshots(`portal-${label}-opening`);
  for (let i = 0; i < (width < 700 ? 11 : 6); i++) await wheel(width < 700 ? 80 : 70);
  events.push({ event: 'scroll-approach', ...(await evaluate('({scroll:document.querySelector(".g2-shell").scrollTop,trace:document.querySelector(".g22-finale-stage").dataset.activeTrace})')) });
  await click('.g22-finale-reveal');
  events.push({ event: 'source-open', expanded: await evaluate('document.querySelector(".g22-finale-reveal").getAttribute("aria-expanded")') });
  await wheel(width < 700 ? 220 : 180);
  await delay(700);
  await screenshots(`portal-${label}-source`);
  await click('.g22-finale-reveal');
  await wheel(width < 700 ? 300 : 250);
  await click('.g22-finale-traces button:nth-child(4)');
  events.push({ event: 'question-selected', ...(await evaluate('({trace:document.querySelector(".g22-finale-stage").dataset.activeTrace,reading:document.querySelector(".g22-finale-trace-reading").innerText})')) });
  await delay(600);
  const distance = await evaluate(`document.querySelector('.g22-finale-resolution').getBoundingClientRect().bottom-${height - 40}`);
  if (distance > 0) await wheel(distance);
  await delay(650);
  await screenshots(`portal-${label}-resolution`);
  recording = false;
  await recordingLoop;
  await Promise.all(writes);
  const concat = frames.map((frame, i) => `file '${path.join(frameDirectory, String(i).padStart(5, '0') + '.jpg').replaceAll('\\', '/')}'\nduration ${Math.max(.016, Math.min(1, (frames[i + 1]?.time ?? frame.time + .15) - frame.time))}`).join('\n');
  const concatFile = path.join(directory, 'motion-' + label + '-concat.txt');
  await fs.writeFile(concatFile, concat);
  const output = path.join(directory, 'portal-' + label + '-motion.mp4');
  const process = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', concatFile, '-vf', 'fps=30,format=yuv420p', '-c:v', 'libx264', '-crf', '23', '-movflags', '+faststart', output], { encoding: 'utf8', windowsHide: true });
  if (process.status !== 0) throw new Error(process.stderr);
  const report = { url, width, height, captureMethod: 'Native CDP pointer/wheel input with timed real browser screenshot frames; timestamps preserved in encoding.', nativeDuration: frames.at(-1).time - frames[0].time, frames: frames.length, events, frameTimes: frames, output };
  await fs.writeFile(path.join(directory, 'motion-' + label + '-report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ ...report, frameTimes: undefined }, null, 2));
  const safeRoot = path.resolve(directory) + path.sep;
  if (!path.resolve(frameDirectory).startsWith(safeRoot) || !path.basename(frameDirectory).startsWith('frames-')) throw new Error('Unsafe temporary directory');
  await fs.rm(frameDirectory, { recursive: true });
  await fs.unlink(concatFile);
} finally {
  recording = false;
  await recordingLoop;
  await calls('Target.disposeBrowserContext', { browserContextId: context });
  socket.close();
}
