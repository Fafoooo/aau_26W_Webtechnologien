'use strict';
// AI-assisted regression tests; only the tests depend on Node and Playwright.
// Run: node tests_1_2.cjs
// Optional: PLAYWRIGHT_MODULE=/path/to/playwright PLAYWRIGHT_CHROMIUM=/path/to/chrome
// Optional: TEST_SCREENSHOT_DIR=/your/scratch/directory (writes two screenshots).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = __dirname;
let passed = 0;
async function test(name, run) {
    await run();
    passed += 1;
    console.log(`PASS ${name}`);
}
const file = name => pathToFileURL(path.join(root, name)).href;
async function screenshot(page, name) {
    if (!process.env.TEST_SCREENSHOT_DIR) return;
    fs.mkdirSync(process.env.TEST_SCREENSHOT_DIR, { recursive: true });
    await page.screenshot({ path: path.join(process.env.TEST_SCREENSHOT_DIR, name), fullPage: true });
}
async function main() {
    await test('protected editable HTML differs only by its script reference; all 3 assets byte-identical', () => {
        const original = fs.readFileSync(path.join(root, 'Angabe/files/editable/editable.html'));
        const actual = fs.readFileSync(path.join(root, 'ue3.2/editable.html'));
        const reference = Buffer.from('\t<script src="editable.js" defer></script>\r\n');
        const position = actual.indexOf(reference);
        assert.ok(position >= 0);
        assert.deepEqual(Buffer.concat([actual.subarray(0, position), actual.subarray(position + reference.length)]), original);
        for (const name of ['pic1.jpg', 'pic2.jpg', 'pic3.jpg']) {
            assert.deepEqual(fs.readFileSync(path.join(root, 'ue3.2', name)), fs.readFileSync(path.join(root, 'Angabe/files/editable', name)));
        }
    });
    const executablePath = process.env.PLAYWRIGHT_CHROMIUM || process.env.CHROMIUM_EXECUTABLE;
    const browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
    const context = await browser.newContext({ viewport: { width: 1100, height: 850 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    // The provided logo is external; deliberately exclude external network dependencies.
    await page.route(/^https?:/, route => route.abort());
    try {
        await page.addInitScript(() => {
            const values = [0.4, 0.999999, 0, 0.4];
            Math.random = () => values.shift() ?? 0.4;
        });
        await page.goto(file('ue3.1/index.html'));
        await test('game initial state: heading/welcome visible, only blue Start button visible', async () => {
            assert.equal(await page.title(), 'Number-Guessing Game');
            assert.equal(await page.locator('h1').innerText(), 'Number-Guessing Game');
            assert.ok(await page.locator('#welcome').isVisible());
            assert.equal(await page.locator('button:visible').allTextContents().then(a => a.join()), 'Start Game');
            assert.ok(await page.locator('#check').isDisabled());
            assert.ok(await page.locator('#game-field').isHidden());
            assert.equal(await page.locator('#exit, #feedback, #previous-guesses').count(), 0);
            assert.equal(await page.locator('#start').evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(0, 0, 255)');
        });
        await test('game required typography, paragraph margin and button centering', async () => {
            const style = await page.locator('h1').evaluate(e => {
                const s = getComputedStyle(e);
                return { font: s.fontFamily, size: s.fontSize, margin: s.margin };
            });
            assert.match(style.font, /^Verdana/);
            assert.equal(style.size, '32px');
            assert.equal(style.margin, '15px');
            assert.deepEqual(await page.locator('p').evaluate(e => [getComputedStyle(e).textAlign, getComputedStyle(e).margin]), ['center', '10px']);
            const box = await page.locator('#start').boundingBox();
            assert.ok(Math.abs(box.x + box.width / 2 - 550) < 1);
        });
        await page.locator('#start').click();
        await test('start creates exactly two ordered feedback divs and a red Exit; valid prefill enables green Check', async () => {
            assert.ok(await page.locator('#welcome').isHidden());
            assert.ok(await page.locator('#start').isHidden());
            assert.ok(await page.locator('#game-field').isVisible());
            assert.ok(await page.locator('#check').isEnabled());
            assert.equal(await page.locator('#guess').inputValue(), '1');
            assert.deepEqual(await page.locator('#guess').evaluate(e => [e.type, e.min, e.max, e.step, e.required]), ['number', '1', '10', '1', true]);
            assert.deepEqual(await page.locator('#game-field').evaluate(e => [e.nextElementSibling.id, e.nextElementSibling.nextElementSibling.id, e.nextElementSibling.nextElementSibling.nextElementSibling.id]), ['feedback', 'previous-guesses', 'buttons']);
            assert.equal(await page.locator('#exit').evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(255, 0, 0)');
            assert.equal(await page.locator('#check').evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(0, 128, 0)');
            assert.equal(await page.locator('#guess').evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(173, 216, 230)');
            const box = await page.locator('fieldset').boundingBox();
            assert.ok(Math.abs(box.x + box.width / 2 - 550) < 1);
        });
        await test('empty, out-of-range, decimal and malformed input cannot consume attempts', async () => {
            for (const value of ['', '0', '11', '1.5', '-1']) {
                await page.locator('#guess').fill(value);
                assert.ok(await page.locator('#check').isDisabled(), value);
                await page.locator('#check').dispatchEvent('click');
                assert.equal(await page.locator('#feedback').innerText(), 'You have three attempts.');
            }
            await page.locator('#guess').evaluate(e => {
                e.value = 'not a number';
                e.dispatchEvent(new Event('input', { bubbles: true }));
            });
            assert.ok(await page.locator('#check').isDisabled());
            await page.locator('#check').dispatchEvent('click');
            assert.equal(await page.locator('#previous-guesses').innerText(), 'Previous guesses: none.');
        });
        await test('wrong guesses give low/high hints and append history without replacing divs', async () => {
            await page.locator('#feedback').evaluate(e => { e.dataset.identity = 'original'; });
            for (const [guess, text] of [['1', 'Too low! Attempts left: 2.'], ['10', 'Too high! Attempts left: 1.']]) {
                await page.locator('#guess').fill(guess);
                assert.ok(await page.locator('#check').isEnabled());
                await page.locator('#check').click();
                assert.equal(await page.locator('#feedback').innerText(), text);
            }
            assert.equal(await page.locator('#feedback').getAttribute('data-identity'), 'original');
            assert.equal(await page.locator('#previous-guesses').innerText(), 'Previous guesses: 1, 10.');
        });
        await test('third wrong attempt ends game, reveals answer, forbids fourth even after input events', async () => {
            await page.locator('#guess').fill('2');
            await page.locator('#check').click();
            assert.equal(await page.locator('#feedback').innerText(), 'Too low! Game over. The correct number was 5.');
            assert.ok(await page.locator('#check').isDisabled());
            await page.locator('#guess').fill('5');
            assert.ok(await page.locator('#check').isDisabled());
            await page.locator('#check').dispatchEvent('click');
            assert.equal(await page.locator('#previous-guesses').innerText(), 'Previous guesses: 1, 10, 2.');
            await screenshot(page, 'exercise1.png');
        });
        await test('Exit removes temporary nodes and returns to initial state', async () => {
            await page.locator('#exit').click();
            assert.equal(await page.locator('#exit, #feedback, #previous-guesses').count(), 0);
            assert.ok(await page.locator('#game-field').isHidden());
            assert.ok(await page.locator('#welcome').isVisible());
            assert.ok(await page.locator('#start').isVisible());
            assert.ok(await page.locator('#check').isHidden());
            assert.ok(await page.locator('#check').isDisabled());
            assert.equal(await page.locator('#guess').inputValue(), '');
        });
        await test('restart generates endpoint 10, clears history and allows a win on attempt three', async () => {
            await page.locator('#start').click();
            assert.equal(await page.locator('#previous-guesses').innerText(), 'Previous guesses: none.');
            for (const guess of ['1', '2', '10']) {
                await page.locator('#guess').fill(guess);
                await page.locator('#check').click();
            }
            assert.equal(await page.locator('#feedback').innerText(), 'Congratulations! You guessed 10 in 3 attempt(s).');
            assert.equal(await page.locator('#previous-guesses').innerText(), 'Previous guesses: 1, 2.');
            await page.locator('#guess').fill('9');
            assert.ok(await page.locator('#check').isDisabled());
        });
        await test('endpoint 1 can be won immediately; active-game Exit/restarts never duplicate nodes/listeners', async () => {
            await page.locator('#exit').click();
            await page.locator('#start').click();
            await page.locator('#check').click();
            assert.equal(await page.locator('#feedback').innerText(), 'Congratulations! You guessed 1 in 1 attempt(s).');
            await page.locator('#exit').click();
            for (let n = 0; n < 3; n += 1) {
                await page.locator('#start').click();
                assert.equal(await page.locator('#exit').count(), 1);
                assert.equal(await page.locator('#feedback').count(), 1);
                await page.locator('#check').click();
                assert.equal(await page.locator('#feedback').innerText(), 'Too low! Attempts left: 2.');
                await page.locator('#exit').click();
            }
        });
        await page.goto(file('ue3.2/editable.html'));
        await test('editor generated immediately after last section with labels, placeholder and disabled submit', async () => {
            assert.equal(await page.locator('#section-editor').count(), 1);
            assert.equal(await page.locator('section').last().evaluate(e => e.nextElementSibling.id), 'section-editor');
            assert.equal(await page.locator('#section-select').inputValue(), '');
            assert.deepEqual(await page.locator('#section-select option').allTextContents(), ['Choose a section', 'Topic 1', 'Topic 2', 'Topic 3']);
            assert.ok(await page.locator('#section-editor button').isDisabled());
            assert.equal(await page.locator('#section-source').inputValue(), '');
            assert.equal(await page.locator('#section-editor label').count(), 3);
        });
        await test('all local copied images load without external network', async () => {
            await page.waitForFunction(() => [...document.querySelectorAll('section img')].every(e => e.complete && e.naturalWidth > 0));
            assert.equal(await page.locator('section img').count(), 3);
        });
        await test('every section can be selected; full exact innerHTML and heading populate controls', async () => {
            for (let n = 0; n < 3; n += 1) {
                await page.locator('#section-select').selectOption(String(n));
                assert.equal(await page.locator('#heading-input').inputValue(), `Topic ${n + 1}`);
                assert.equal(await page.locator('#section-source').inputValue(), await page.locator('section').nth(n).innerHTML());
                assert.ok(await page.locator('#section-editor button').isEnabled());
            }
        });
        const untouched = await page.locator('section').evaluateAll(elements => elements.map(e => e.innerHTML));
        await test('text heading overrides conflicting HTML heading; dropdown and textarea refresh, siblings unchanged', async () => {
            await page.locator('#section-select').selectOption('0');
            await page.locator('#heading-input').fill('New heading & <text>');
            await page.locator('#section-source').fill('<h1 class="kept">Ignored heading</h1><p id="changed">New <strong>content</strong>.</p>');
            await page.locator('#section-editor button').click();
            assert.equal(await page.locator('section > h1').first().innerText(), 'New heading & <text>');
            assert.equal(await page.locator('section > h1').first().getAttribute('class'), 'kept');
            assert.equal(await page.locator('#changed strong').innerText(), 'content');
            assert.equal(await page.locator('#section-select').inputValue(), '0');
            assert.equal(await page.locator('#section-select option').nth(1).innerText(), 'New heading & <text>');
            assert.equal(await page.locator('#section-source').inputValue(), await page.locator('section').first().innerHTML());
            assert.equal(await page.locator('section').nth(1).innerHTML(), untouched[1]);
            assert.equal(await page.locator('section').nth(2).innerHTML(), untouched[2]);
        });
        await test('removed h1 is recreated as first child and heading input applies; empty HTML still works', async () => {
            await page.locator('#heading-input').fill('Restored');
            await page.locator('#section-source').fill('<p>Without a heading</p>');
            await page.locator('#section-editor button').click();
            assert.deepEqual(await page.locator('section').first().evaluate(e => [e.firstElementChild.tagName, e.firstElementChild.textContent]), ['H1', 'Restored']);
            assert.equal(await page.locator('section').first().locator(':scope > h1').count(), 1);
            await page.locator('#heading-input').fill('');
            await page.locator('#section-source').fill('');
            await page.locator('#section-editor button').click();
            assert.equal(await page.locator('section').first().innerHTML(), '<h1></h1>');
            assert.equal(await page.locator('#section-select option').nth(1).textContent(), '');
        });
        await test('repeated section edits retain selection and work independently; placeholder disables and guards submit', async () => {
            await page.locator('#section-select').selectOption('1');
            await page.locator('#heading-input').fill('Edited second topic');
            await page.locator('#section-source').fill('<h1>Other</h1><ul><li>Item</li></ul>');
            await page.locator('#section-editor button').click();
            assert.equal(await page.locator('#section-select option').nth(2).innerText(), 'Edited second topic');
            await page.locator('#section-select').selectOption('2');
            assert.equal(await page.locator('#heading-input').inputValue(), 'Topic 3');
            await page.locator('#section-select').selectOption('1');
            assert.equal(await page.locator('#heading-input').inputValue(), 'Edited second topic');
            const before = await page.locator('section').evaluateAll(elements => elements.map(e => e.innerHTML));
            await page.locator('#section-select').selectOption('');
            assert.ok(await page.locator('#section-editor button').isDisabled());
            assert.equal(await page.locator('#heading-input').inputValue(), '');
            assert.equal(await page.locator('#section-source').inputValue(), '');
            await page.locator('#section-editor').dispatchEvent('submit');
            assert.deepEqual(await page.locator('section').evaluateAll(elements => elements.map(e => e.innerHTML)), before);
            await page.locator('#section-select').selectOption('1');
            await screenshot(page, 'exercise2.png');
        });
        await test('editor submit prevents navigation; trusted HTML is intentionally not sanitized', async () => {
            const url = page.url();
            await page.locator('#section-source').fill('<h1>Temporary</h1><button onclick="this.textContent=\'handler ran\'">Trusted action</button>');
            await page.locator('#section-editor button').click();
            assert.equal(page.url(), url);
            await page.locator('section button').click();
            assert.equal(await page.locator('section button').innerText(), 'handler ran');
        });
        await test('no JavaScript page errors in either exercise', () => assert.deepEqual(errors, []));
        console.log(`RESULT ${passed} tests passed (Chromium ${browser.version()}; file://; external requests blocked).`);
    } finally {
        await browser.close();
    }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
