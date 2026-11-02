#!/usr/bin/env node
'use strict';
// Dev-only: npm install playwright in a separate directory, then provide
// PLAYWRIGHT_MODULE=/path/to/node_modules/playwright if normal require fails.
// Optional: PLAYWRIGHT_CHROMIUM_EXECUTABLE=/path/to/chromium.
// Run from any directory: node /path/to/ueb05/test_1_3.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { createHash } = require('node:crypto');
let chromium;
try {
  ({ chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright'));
} catch (error) {
  console.error('Install dev-only Playwright outside the product folders and set PLAYWRIGHT_MODULE if needed.');
  throw error;
}
const ROOT = __dirname;
const read = relative => fs.readFileSync(path.join(ROOT, relative));
const text = relative => read(relative).toString('utf8');
let passed = 0;
async function test(name, body) {
  await body();
  passed++;
  console.log(`PASS ${name}`);
}
function unchangedExcept(original, modified, begin, end) {
  const a = read(original), b = read(modified);
  const i = a.indexOf(begin), j = a.indexOf(end, i);
  const x = b.indexOf(begin), y = b.indexOf(end, x);
  assert.ok(i >= 0 && j > i && x >= 0 && y > x);
  assert.deepEqual(b.subarray(0, x), a.subarray(0, i), 'unchanged byte prefix');
  assert.deepEqual(b.subarray(y), a.subarray(j), 'unchanged byte suffix');
}
function trackListeners() {
  const add = EventTarget.prototype.addEventListener;
  const remove = EventTarget.prototype.removeEventListener;
  const tracked = new Map();
  window.__active = () => Object.fromEntries([...tracked].map(([id, handlers]) => [id, handlers.size]));
  EventTarget.prototype.addEventListener = function(type, callback, options) {
    if (type === 'click' && /^(end|cancel)[AB]$/.test(this.id || '')) {
      if (!tracked.has(this.id)) tracked.set(this.id, new Set());
      tracked.get(this.id).add(callback);
    }
    return add.call(this, type, callback, options);
  };
  EventTarget.prototype.removeEventListener = function(type, callback, options) {
    if (type === 'click' && tracked.has(this.id)) tracked.get(this.id).delete(callback);
    return remove.call(this, type, callback, options);
  };
}
function recordSettlements() {
  const NativePromise = window.Promise;
  window.__attempts = [];
  function RecordedPromise(executor) {
    return new NativePromise((resolve, reject) => executor(
      value => { window.__attempts.push('resolve'); resolve(value); },
      reason => { window.__attempts.push('reject'); reject(reason); }
    ));
  }
  RecordedPromise.prototype = NativePromise.prototype;
  Object.setPrototypeOf(RecordedPromise, NativePromise);
  window.Promise = RecordedPromise;
}
async function log(page) {
  return page.locator('#eventLog').innerText();
}
async function state(page, label, expected) {
  assert.deepEqual(await page.evaluate(label => ['start', 'end', 'cancel'].map(
    prefix => document.getElementById(prefix + label).disabled), label), expected);
}
async function main() {
  await test('protected files: exact HTML/callback bytes, only runTaskPromise changed, calculation functions preserved', () => {
    for (const [original, copy] of [
      ['5_1.js', 'ue5.1/5_1.js'], ['ex1.html', 'ue5.1/ex1.html'],
      ['ex2.html', 'ue5.2/ex2.html'], ['ex3.html', 'ue5.3/ex3.html'],
      ['ex3.html', 'ue5.3/async/ex3.html'],
      ['ex1.html', 'ue5.2/experiment-c/ex1.html'], ['ex2.html', 'ue5.2/experiment-c/ex2.html']
    ]) assert.deepEqual(read(copy), read(`Angabe/files/${original}`), copy);
    unchangedExcept('Angabe/files/5_2.js', 'ue5.2/5_2.js', 'function runTaskPromise(task)', 'function endTask(task)');
    for (const file of ['ue5.3/5_3.js', 'ue5.3/async/5_3.js']) {
      unchangedExcept('Angabe/files/5_3.js', file, '// Change the code below', 'function handleError(error)');
    }
    const expected = text('Angabe/files/5_1.js').replace(
      'function cancelTask(task) {\r\n\ttask.endButton.disabled = true;',
      'function cancelTask(task) {\r\n\ttask.endButton.disabled = false;');
    assert.equal(text('ue5.2/experiment-c/5_1.js'), expected);
    const hash = createHash('sha256').update(read('ue5.1/5_1.js')).digest('hex');
    console.log(`  Original 5_1.js SHA-256: ${hash}`);
  });
  const browser = await chromium.launch({ headless: true,
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {}) });
  console.log(`Browser: Chromium ${browser.version()}`);
  const context = await browser.newContext();
  const pages = [];
  async function open(relative, init, argument) {
    const page = await context.newPage();
    pages.push(page);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    if (init) await page.addInitScript(init, argument);
    await page.goto(pathToFileURL(path.join(ROOT, relative)).href);
    return { page, errors };
  }
  try {
    for (const [name, relative] of [['callbacks', 'ue5.1/ex1.html'], ['promises', 'ue5.2/ex2.html']]) {
      await test(`${name}: real file page, disabled controls, concurrent A/B, both completion orders, repeated cycles`, async () => {
        const { page, errors } = await open(relative, trackListeners);
        await state(page, 'A', [false, true, true]);
        await state(page, 'B', [false, true, true]);
        // Normal clicks on disabled controls have no effect.
        await page.evaluate(() => { endA.click(); cancelB.click(); });
        assert.equal((await log(page)).trim(), '');
        const expected = [];
        for (let cycle = 0; cycle < 12; cycle++) {
          const startOrder = cycle % 2 ? ['B', 'A'] : ['A', 'B'];
          for (const label of startOrder) {
            await page.locator(`#start${label}`).click();
            expected.push(`${label} started`);
            await state(page, label, [true, false, false]);
          }
          if (name === 'promises') assert.deepEqual(await page.evaluate(() => window.__active()), { endA: 1, cancelA: 1, endB: 1, cancelB: 1 });
          const finishOrder = cycle % 2 ? ['A', 'B'] : ['B', 'A'];
          for (const label of finishOrder) {
            const action = (cycle + (label === 'B' ? 1 : 0)) % 2 ? 'cancel' : 'end';
            await page.locator(`#${action}${label}`).click();
            expected.push(`${label} ${action === 'end' ? 'ended' : 'cancelled'}`);
            await state(page, label, [false, true, true]);
          }
          if (name === 'promises') assert.deepEqual(await page.evaluate(() => window.__active()), { endA: 0, cancelA: 0, endB: 0, cancelB: 0 });
        }
        const actual = await page.locator('#eventLog pre').allTextContents();
        assert.deepEqual(actual.map(line => line.match(/^[AB] (started|ended|cancelled)/)[0]), expected);
        assert.ok(actual.every(line => /\d{4}/.test(line)), 'real date in every log');
        const before = await log(page);
        // Also dispatch bypassing disabled state: Promise handlers must be removed.
        if (name === 'promises') {
          await page.evaluate(() => ['endA', 'cancelA', 'endB', 'cancelB'].forEach(id => document.getElementById(id).dispatchEvent(new MouseEvent('click'))));
          assert.equal(await log(page), before);
        }
        assert.deepEqual(errors, []);
        console.log(`  ${name}: ${actual.length} ordered log entries, 24 task runs`);
        await page.close();
      });
    }
    await test('1(d): standard outer DOM listener receives input element and fails at task.evlog', async () => {
      const { page } = await open('ue5.1/ex1.html');
      await page.goto('about:blank');
      await page.setContent(text('ue5.1/ex1.html').replace(/<script[^>]*><\/script>/, ''));
      const observedErrors = [];
      page.on('pageerror', error => observedErrors.push(error.message));
      await page.evaluate(() => { window.__receiver = null; });
      const modified = text('ue5.1/5_1.js').replace('()=> {runTask(this,', 'function() { window.__receiver = this; runTask(this,');
      await page.addScriptTag({ content: modified });
      await page.locator('#startA').click();
      assert.equal(await page.evaluate(() => window.__receiver === document.getElementById('startA')), true);
      assert.ok(observedErrors.some(message => /undefined.*innerHTML|innerHTML.*undefined/.test(message)), JSON.stringify(observedErrors));
      assert.equal((await log(page)).trim(), '');
      console.log(`  Observed browser error: ${observedErrors[0]}`);
      await page.close();
    });
    await test('1(d): ordinary inner callback called plainly receives window, not the task', async () => {
      const { page } = await open('ue5.1/ex1.html');
      await page.goto('about:blank');
      await page.setContent(text('ue5.1/ex1.html').replace(/<script[^>]*><\/script>/, ''));
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.addScriptTag({ content: text('ue5.1/5_1.js').replace('()=> { endTask(this)}', 'function() { window.__innerReceiver = this; endTask(this); }') });
      await page.locator('#startA').click();
      await page.locator('#endA').click();
      assert.equal(await page.evaluate(() => window.__innerReceiver === window), true);
      assert.ok(errors.some(message => /disabled/.test(message)), JSON.stringify(errors));
      console.log(`  Observed browser error: ${errors[0]}`);
      await page.close();
    });
    await test('2(c): cancel then End invokes callbacks twice, but rejected promise ignores later resolve', async () => {
      for (const type of ['callback', 'promise']) {
        const { page, errors } = await open(`ue5.2/experiment-c/ex${type === 'callback' ? 1 : 2}.html`, recordSettlements);
        await page.locator('#startA').click();
        await page.locator('#cancelA').click();
        await state(page, 'A', [false, false, true]);
        await page.locator('#endA').click();
        const lines = (await page.locator('#eventLog pre').allTextContents()).map(line => line.match(/^A \w+/)[0]);
        assert.deepEqual(lines, type === 'callback' ? ['A started', 'A cancelled', 'A ended'] : ['A started', 'A cancelled']);
        if (type === 'promise') {
          assert.deepEqual(await page.evaluate(() => window.__attempts), ['reject', 'resolve']);
          await state(page, 'A', [false, false, true]);
        } else await state(page, 'A', [false, true, true]);
        assert.deepEqual(errors, []);
        console.log(`  ${type}: ${lines.join(' -> ')}${type === 'promise' ? '; actual settlement attempts: reject, resolve' : ''}`);
        await page.close();
      }
    });
    await test('original 3(a): repeated real refreshes, synchronous rejections, random timer order, unhandled rejections', async () => {
      const { page, errors } = await open('Angabe/files/ex3.html');
      const outcomes = new Set();
      for (let run = 0; run < 10; run++) {
        if (run) await page.reload();
        await page.waitForFunction(() => document.getElementById('eventLog').innerText.trim().split('\n').filter(Boolean).length === 4);
        const lines = (await log(page)).trim().split('\n').filter(Boolean);
        assert.deepEqual(lines.slice(0, 2), ['rejected', 'rejected']);
        assert.deepEqual([...lines.slice(2)].sort(), ['1000 + 1 = 1001', '5 + 3 = 8']);
        outcomes.add(lines.slice(2).join(' | '));
      }
      // Native random observations are reported, not fabricated or used as a flaky assertion.
      console.log(`  10 actual loads/refreshes; observed timer orders (${outcomes.size}): ${[...outcomes].join(' / ')}`);
      // Playwright may normalize a string rejection beginning with "error:".
      assert.equal(errors.filter(message => /^(error: )?b larger than a$/.test(message)).length, 20, JSON.stringify(errors));
      console.log('  20 unhandled rejection events observed (2 per load).');
      await page.close();
    });
    const expected = ['5 + 3 = 8', '8 + 7 = 15', '15 + 14 = 29', '29 + 23 = 52', '52 + 25 = 77', 'rejected'];
    for (const relative of ['ue5.3/ex3.html', 'ue5.3/async/ex3.html']) {
      await test(`${relative}: real random timers, exact incremental output and caught rejection`, async () => {
        const page = await context.newPage();
        pages.push(page);
        const errors = [], dialogs = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('dialog', async dialog => { dialogs.push({ type: dialog.type(), message: dialog.message() }); await dialog.dismiss(); });
        await page.goto(pathToFileURL(path.join(ROOT, relative)).href);
        await page.waitForFunction(() => document.getElementById('eventLog').innerText.includes('rejected'));
        assert.deepEqual((await log(page)).trim().split('\n').filter(Boolean), expected);
        assert.deepEqual(dialogs, [{ type: 'alert', message: 'error: b larger than a' }]);
        assert.deepEqual(errors, []);
        console.log(`  ${expected.join(' -> ')}; one handled alert; no page errors`);
        await page.close();
      });
    }
    for (const variant of ['ue5.3/5_3.js', 'ue5.3/async/5_3.js']) {
      await test(`${variant}: instrumented input trace, real results forwarded, +1 skipped`, async () => {
        const page = await context.newPage();
        pages.push(page);
        await page.setContent('<p id="eventLog"></p>');
        const dialogs = [];
        page.on('dialog', async dialog => { dialogs.push(dialog.message()); await dialog.dismiss(); });
        const source = text(variant);
        const marker = '// Change the code below';
        const instrumentation = `window.__calls = []; const originalDelayedCalc = delayedCalc;
          delayedCalc = (a,b) => { window.__calls.push([a,b]); return originalDelayedCalc(a,b); };\n`;
        await page.addScriptTag({ content: source.replace(marker, instrumentation + marker) });
        await page.waitForFunction(() => document.getElementById('eventLog').innerText.includes('rejected'));
        assert.deepEqual(await page.evaluate(() => window.__calls), [[5,3], [8,7], [15,14], [29,23], [52,25], [77,1000]]);
        assert.deepEqual(dialogs, ['error: b larger than a']);
        assert.deepEqual((await log(page)).trim().split('\n').filter(Boolean), expected);
        await page.close();
      });
    }
    // Deterministic supplementary scheduling tests avoid relying on luck when
    // demonstrating that either independent original timer can finish first.
    await test('original 3(a): deterministic random extremes demonstrate both legal timer orders', async () => {
      for (const random of [[0, 0.999], [0.999, 0]]) {
        const { page } = await open('Angabe/files/ex3.html', values => {
          let index = 0;
          Math.random = () => values[index++];
        }, random);
        await page.waitForFunction(() => document.getElementById('eventLog').innerText.trim().split('\n').filter(Boolean).length === 4);
        const timerLines = (await log(page)).trim().split('\n').filter(Boolean).slice(2);
        assert.deepEqual(timerLines, random[0] === 0 ? ['5 + 3 = 8', '1000 + 1 = 1001'] : ['1000 + 1 = 1001', '5 + 3 = 8']);
        await page.close();
      }
    });
  } finally {
    await context.close();
    await browser.close();
  }
  console.log(`ALL ${passed} TEST GROUPS PASSED`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
