'use strict';
// AI-assisted regression tests (OpenAI gpt-6.1-sol). Product code uses no libraries.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = __dirname;
let groups = 0;
const pass = (name) => console.log(`PASS ${++groups}: ${name}`);
const read = (name) => fs.readFileSync(path.join(root, name));
const fileURL = (name) => pathToFileURL(path.join(root, name)).href;

function preservation() {
    const previous = fs.readFileSync(path.join(root, '../ueb02/ue2.6/gallery.js'));
    assert(read('ue3.3/gallery.js').subarray(0, previous.length).equals(previous));
    for (const name of ['gallery.html', 'gallery.css', 'hk.JPG', 'hk_small.JPG',
        'street.JPG', 'street_small.JPG', 'taichung.JPG', 'taichung_small.JPG']) {
        assert(read(`ue3.3/${name}`).equals(fs.readFileSync(path.join(root, '../ueb02/ue2.6', name))), name);
    }
    pass('gallery original JS prefix, HTML, CSS and all six images are byte-identical');
    for (let i = 1; i <= 4; i++) {
        assert(read(`ue3.4/bus-${i}.jpg`).equals(read(`Angabe/files/puzzle/bus-${i}.jpg`)));
    }
    const puzzleHTML = read('ue3.4/puzzle.html').toString();
    assert.equal(puzzleHTML.replace('    <script src="puzzle.js" defer></script>\r\n', ''),
        read('Angabe/files/puzzle/puzzle.html').toString());
    pass('puzzle images unchanged; HTML changed only by adding deferred script reference');
}

async function loaded(page, selector) {
    // Poll from Node so image checks also work while the browser clock is paused.
    for (let attempt = 0; attempt < 200; attempt++) {
        if (await page.locator(selector).evaluateAll((images) =>
            images.every((image) => image.complete && image.naturalWidth > 0))) return;
        await new Promise((resolve) => setTimeout(resolve, 25));
    }
    throw new Error(`Images did not finish loading: ${selector}`);
}

async function galleryPage(browser, count) {
    const page = await browser.newPage({ viewport: { width: 1200, height: 850 } });
    page.setDefaultTimeout(5000);
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
    await page.clock.pauseAt(new Date('2026-01-01T00:00:01Z'));
    await page.addInitScript(() => {
        const set = window.setInterval.bind(window);
        const clear = window.clearInterval.bind(window);
        window.__intervals = { active: new Set(), starts: [], ticks: 0 };
        window.setInterval = (callback, delay) => {
            const id = set(() => { window.__intervals.ticks++; callback(); }, delay);
            window.__intervals.active.add(id);
            window.__intervals.starts.push(delay);
            return id;
        };
        window.clearInterval = (id) => {
            window.__intervals.active.delete(id);
            clear(id);
        };
    });
    if (count === undefined) {
        await page.goto(fileURL('ue3.3/gallery.html'));
    } else {
        // First establish a local-file origin; about:blank cannot reliably load file images.
        await page.goto(fileURL('ue3.3/gallery.css'));
        const images = Array.from({ length: count }, (_, i) =>
            `<span><img src="hk_small.JPG" data-large="hk.JPG" alt="Caption ${i} &lt;literal&gt;"></span>`).join('');
        await page.setContent(`<!DOCTYPE html><html lang="en"><head>
            <base href="${fileURL('ue3.3/')}"><link rel="stylesheet" href="gallery.css"></head>
            <body><article class="gallery">${images}</article><section id="displayDIV">
            <img class="bigIMG" src="" alt=""><p class="desc"></p></section></body></html>`);
        await page.addScriptTag({ path: path.join(root, 'ue3.3/gallery.js') });
    }
    await loaded(page, '.gallery img');
    return { page, errors };
}

const active = (page) => page.evaluate(() => window.__intervals.active.size);
const caption = (page) => page.locator('#displayDIV .desc').textContent();
const button = (page, name) => page.getByRole('button', { name, exact: true, includeHidden: true });
async function expectCaption(page, text) {
    assert.equal(await caption(page), text);
    await loaded(page, '#displayDIV .bigIMG');
}

async function galleryTests(browser) {
    const { page, errors } = await galleryPage(browser);
    const names = await page.locator('.gallery img').evaluateAll((images) => images.map((image) => image.alt));
    await page.locator('.gallery img').nth(1).click();
    await expectCaption(page, names[1]);
    assert.equal(await page.getByLabel('Seconds per picture:').inputValue(), '3');
    for (const name of ['play', 'exit', 'previous', 'next']) assert(await button(page, name).isVisible());
    pass('gallery opens selected image with default 3 seconds and all controls visible');

    await button(page, 'play').click();
    assert.equal(await active(page), 1);
    assert.equal(await button(page, 'pause').getAttribute('aria-pressed'), 'true');
    await page.clock.runFor(2999);
    await expectCaption(page, names[1]);
    await page.clock.runFor(1);
    await expectCaption(page, names[2]);
    await page.clock.runFor(3000);
    await expectCaption(page, names[0]);
    await page.clock.runFor(9000);
    await expectCaption(page, names[0]);
    pass('real setInterval uses 3000 ms, advances at boundary and loops indefinitely');

    await button(page, 'pause').click();
    assert.equal(await active(page), 0);
    await page.clock.runFor(12000);
    await expectCaption(page, names[0]);
    await button(page, 'previous').click();
    await expectCaption(page, names[2]);
    await button(page, 'next').click();
    await expectCaption(page, names[0]);
    assert(await page.locator('#displayDIV').isVisible());
    pass('pause clears timer; previous/next still wrap without closing the overlay');

    await page.getByLabel('Seconds per picture:').fill('2');
    await button(page, 'play').click();
    await page.clock.runFor(1500);
    await page.getByLabel('Seconds per picture:').fill('0.5');
    assert.equal(await active(page), 1);
    await page.clock.runFor(499);
    await expectCaption(page, names[0]);
    await page.clock.runFor(1);
    await expectCaption(page, names[1]);
    assert.equal(await page.evaluate(() => window.__intervals.starts.at(-1)), 500);
    await page.getByLabel('Seconds per picture:').fill('2');
    await page.clock.runFor(1999);
    await expectCaption(page, names[1]);
    await page.clock.runFor(1);
    await expectCaption(page, names[2]);
    pass('live shorter/longer duration changes clear the old timer and restart a full interval');

    await page.getByLabel('Seconds per picture:').fill('0');
    assert.equal(await active(page), 0);
    for (const value of ['', '-1', '2147484']) {
        await page.getByLabel('Seconds per picture:').fill(value);
        await button(page, 'play').click();
        assert.equal(await active(page), 0);
    }
    await page.getByLabel('Seconds per picture:').fill('1');
    await button(page, 'play').click();
    await button(page, 'exit').click();
    assert.equal(await active(page), 0);
    assert.equal(await page.locator('#displayDIV').isVisible(), false);
    const ticks = await page.evaluate(() => window.__intervals.ticks);
    await page.clock.runFor(10000);
    assert.equal(await page.evaluate(() => window.__intervals.ticks), ticks);
    pass('invalid durations never start a timer; exit clears timer and closes full-window mode');

    for (let i = 0; i < 3; i++) {
        await page.locator('.gallery img').nth(i).click();
        assert.equal(await active(page), 0);
        await expectCaption(page, names[i]);
        await button(page, 'play').click();
        assert.equal(await active(page), 1);
        // The original listener closes on a background click; cleanup must still run.
        await page.locator('#displayDIV').click({ position: { x: 5, y: 5 } });
        assert.equal(await active(page), 0);
        assert.equal(await page.locator('#displayDIV').isVisible(), false);
    }
    await page.locator('.gallery img').first().click();
    await button(page, 'play').click();
    await button(page, 'next').click();
    assert.equal(await active(page), 1);
    await expectCaption(page, names[1]);
    await page.locator('#displayDIV .bigIMG').click();
    assert.equal(await active(page), 0);
    assert.equal(await page.locator('#displayDIV').isVisible(), false);
    await page.clock.runFor(10000);
    assert.equal(await page.locator('#displayDIV').isVisible(), false);
    assert.deepEqual(errors, []);
    pass('original overlay close and repeated reopening leave no hidden or duplicate timers');
    await page.close();

    for (const count of [0, 1, 2, 5]) {
        const fixture = await galleryPage(browser, count);
        const p = fixture.page;
        if (count === 0) {
            // Hidden controls are exercised programmatically only in the empty fixture.
            await button(p, 'previous').evaluate((element) => element.click());
            await button(p, 'next').evaluate((element) => element.click());
            await button(p, 'play').evaluate((element) => element.click());
            assert.equal(await active(p), 0);
        } else {
            await p.locator('.gallery img').last().click();
            await expectCaption(p, `Caption ${count - 1} <literal>`);
            await button(p, 'next').click();
            await expectCaption(p, 'Caption 0 <literal>');
            await button(p, 'previous').click();
            await expectCaption(p, `Caption ${count - 1} <literal>`);
            await p.getByLabel('Seconds per picture:').click();
            assert(await p.locator('#displayDIV').isVisible());
            await button(p, 'play').click();
            await p.clock.runFor(3000);
            await expectCaption(p, 'Caption 0 <literal>');
            await p.clock.runFor(3000 * count);
            await expectCaption(p, 'Caption 0 <literal>');
            assert.equal(await active(p), 1);
            await button(p, 'exit').click();
            assert.equal(await active(p), 0);
        }
        assert.deepEqual(fixture.errors, []);
        pass(`arbitrary gallery: ${count} thumbnails, changed wrappers and repeated large URLs`);
        await p.close();
    }
}

async function puzzlePage(browser, arbitrary = false) {
    const page = await browser.newPage({ viewport: { width: 1300, height: 1100 } });
    page.setDefaultTimeout(5000);
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(fileURL(arbitrary ? 'ue3.3/gallery.css' : 'ue3.4/puzzle.html'));
    if (arbitrary) {
        await page.setContent(`<!DOCTYPE html><html lang="en"><head><base href="${fileURL('ue3.4/')}"></head><body>
            <div data-result="bus-3.jpg" style="position:absolute;left:60px;top:30px;width:220px;height:130px"><span>Nested label</span></div>
            <section><div data-result="bus-1.jpg" style="position:absolute;left:760px;top:280px;width:240px;height:150px"></div></section>
            <div data-result="bus-4.jpg" style="position:absolute;left:350px;top:180px;width:230px;height:150px"></div>
            <div data-result="bus-2.jpg" style="position:absolute;left:80px;top:440px;width:230px;height:150px"></div>
            <div data-result="bus-1.jpg" style="position:absolute;left:740px;top:600px;width:230px;height:150px"></div>
            <div id="puzzleSource" style="position:absolute;top:800px;left:10px;display:flex;gap:8px">
            ${[4, 2, 1, 3, 1].map((i) => `<img src="bus-${i}.jpg" style="width:150px" alt="Piece ${i}">`).join('')}
            </div></body></html>`);
        await page.addScriptTag({ path: path.join(root, 'ue3.4/puzzle.js') });
    }
    await loaded(page, '#puzzleSource img');
    return { page, errors };
}

async function pick(page, filename) {
    const piece = page.locator(`#puzzleSource img[src="${filename}"]`).first();
    await piece.click();
    assert.equal(await page.locator('.puzzle-ghost').count(), 1);
}
async function drop(page, index) {
    const target = page.locator('div[data-result]').nth(index);
    await target.scrollIntoViewIfNeeded();
    const box = await target.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    assert.equal(await page.locator('.puzzle-ghost').count(), 0);
}
async function background(page, index, file) {
    const value = await page.locator('div[data-result]').nth(index).evaluate((target) => target.style.backgroundImage);
    assert(value.includes(file), `${value} should contain ${file}`);
}

async function puzzleTests(browser) {
    const { page, errors } = await puzzlePage(browser);
    await pick(page, 'bus-4.jpg');
    await page.mouse.move(200, 170);
    const preview = await page.locator('.puzzle-ghost').evaluate((ghost) => ({
        left: ghost.style.left, top: ghost.style.top,
        position: ghost.style.position, pointerEvents: ghost.style.pointerEvents
    }));
    assert.deepEqual(preview, { left: '216px', top: '186px', position: 'fixed', pointerEvents: 'none' });
    await page.mouse.click(1180, 100);
    assert.equal(await page.locator('.puzzle-ghost').count(), 1);
    assert.equal(await page.locator('#puzzleSource img').count(), 4);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.puzzle-ghost').count(), 0);
    pass('piece follows actual mouse with 16px offset, ignores hit tests; outside clicks and Escape are safe');

    const oldPiece = await page.locator('#puzzleSource img[src="bus-4.jpg"]').elementHandle();
    await pick(page, 'bus-4.jpg');
    await drop(page, 0);
    await background(page, 0, 'bus-4.jpg');
    assert.equal(await page.locator('#puzzleSource img').count(), 3);
    assert.match(await page.getByRole('status').textContent(), /Wrong placement/);
    await pick(page, 'bus-1.jpg');
    await drop(page, 0);
    await background(page, 0, 'bus-1.jpg');
    assert.equal(await page.locator('#puzzleSource img').count(), 3);
    assert.equal(await page.locator('#puzzleSource img[src="bus-4.jpg"]').count(), 1);
    assert(await oldPiece.evaluate((image) => image === document.querySelector('#puzzleSource img[src="bus-4.jpg"]')));
    assert.doesNotMatch(await page.getByRole('status').textContent(), /You win/);
    pass('wrong placement feedback; occupied-cell replacement returns the exact old image to source');

    await pick(page, 'bus-4.jpg');
    await drop(page, 3);
    await pick(page, 'bus-2.jpg');
    await drop(page, 1);
    assert.doesNotMatch(await page.getByRole('status').textContent(), /You win/);
    await pick(page, 'bus-3.jpg');
    await drop(page, 2);
    assert.equal(await page.locator('#puzzleSource img').count(), 0);
    assert.match(await page.getByRole('status').textContent(), /You win/);
    pass('win appears only after all four targets match their data-result values');

    await page.locator('div[data-result]').nth(0).click();
    assert.equal(await page.locator('.puzzle-ghost').count(), 1);
    assert.doesNotMatch(await page.getByRole('status').textContent(), /You win/);
    await drop(page, 0);
    assert.match(await page.getByRole('status').textContent(), /You win/);
    assert.deepEqual(errors, []);
    pass('placed pieces can be picked up again, so an exhausted source cannot deadlock the game');
    await page.close();

    const fixture = await puzzlePage(browser, true);
    const p = fixture.page;
    // Hit a nested span, not the div itself. The target is discovered via closest().
    await pick(p, 'bus-1.jpg');
    await p.locator('div[data-result] span').click();
    await background(p, 0, 'bus-1.jpg');
    assert.match(await p.getByRole('status').textContent(), /Wrong placement/);
    await pick(p, 'bus-3.jpg');
    await drop(p, 0);
    assert.equal(await p.locator('#puzzleSource img[src="bus-1.jpg"]').count(), 2);
    for (const [index, name] of [[1, 'bus-1.jpg'], [2, 'bus-4.jpg'], [3, 'bus-2.jpg']]) {
        await pick(p, name);
        await drop(p, index);
    }
    assert.doesNotMatch(await p.getByRole('status').textContent(), /You win/);
    await pick(p, 'bus-1.jpg');
    await drop(p, 4);
    assert.match(await p.getByRole('status').textContent(), /You win/);
    assert.equal(await p.locator('#puzzleSource img').count(), 0);
    assert.deepEqual(fixture.errors, []);
    pass('five arbitrarily positioned targets, no target IDs/grid classes, nested content and duplicate images');
    await p.close();

    const wrong = await puzzlePage(browser);
    for (const [index, name] of [[0, 'bus-2.jpg'], [1, 'bus-1.jpg'], [2, 'bus-4.jpg'], [3, 'bus-3.jpg']]) {
        await pick(wrong.page, name);
        await drop(wrong.page, index);
    }
    assert.equal(await wrong.page.locator('#puzzleSource img').count(), 0);
    assert.match(await wrong.page.getByRole('status').textContent(), /Wrong placement/);
    assert.doesNotMatch(await wrong.page.getByRole('status').textContent(), /You win/);
    assert.deepEqual(wrong.errors, []);
    pass('all cells occupied incorrectly never produces a false win');
    await wrong.page.close();
}

(async () => {
    preservation();
    const browser = await chromium.launch({ headless: true,
        ...(process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {}) });
    try {
        await galleryTests(browser);
        await puzzleTests(browser);
    } finally {
        await browser.close();
    }
    console.log(`OK: ${groups} test groups passed in Chromium; no page errors.`);
})().catch((error) => { console.error(error); process.exitCode = 1; });
