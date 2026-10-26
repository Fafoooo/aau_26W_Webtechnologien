'use strict';
// Development-only dependencies: Node and Playwright. Product code uses no library.
// Run from any directory: node ueb04/tests_1_2.cjs
// Optional environment: PLAYWRIGHT_MODULE, PLAYWRIGHT_CHROMIUM (or CHROMIUM_EXECUTABLE).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = __dirname;
const ids = ['sonyAIV', 'sony24105', 'NiconDX16400', 'tamron1724'];
const cents = [289000, 130000, 90000, 80000];
const read = name => fs.readFileSync(path.join(root, name));
const file = name => pathToFileURL(path.join(root, name)).href;
let passed = 0;
async function test(name, run) {
    await run();
    passed += 1;
    console.log(`PASS ${name}`);
}
const card = (page, id) => page.locator(`[data-prodid="${id}"]`);
const add = (page, id) => card(page, id).locator('.buy input');
async function state(page) {
    return page.evaluate(() => products.map(p => [p.id, p.numInCart]));
}
async function fixture(page, html, script, prices) {
    // No local assets are loaded here: the original script tag is removed first.
    // A fresh document prevents previous global let/const declarations surviving.
    await page.goto('about:blank');
    await page.setContent(read(html).toString().replace(/<script\b[^>]*>[\s\S]*?<\/script>/i, ''));
    if (prices) {
        await page.locator('.product .price').evaluateAll((nodes, values) => {
            nodes.forEach((node, i) => { node.textContent = values[i]; });
        }, prices);
    }
    await page.addScriptTag({ content: read(script).toString() });
}
async function main() {
    await test('protected A and B HTML byte-identical, including CRLF', () => {
        assert.deepEqual(read('ue4.1/productsA.html'), read('Angabe/files/productsA.html'));
        assert.deepEqual(read('ue4.2/productsB.html'), read('Angabe/files/productsB.html'));
        assert.deepEqual(read('ue4.1/arrow.html'), Buffer.from(read('Angabe/files/productsA.html').toString().replace('src="shopA.js"', 'src="shopA-arrow.js"')));
        assert.deepEqual(read('ue4.2/productsC.html'), Buffer.from(read('Angabe/files/productsB.html').toString().replace('src="shopB.js"', 'src="productsC.js"')));
        assert.equal(read('ue4.1/shopA-arrow.js').toString(), read('ue4.1/shopA.js').toString().replace("clickButton.addEventListener('click', function (e) {", "clickButton.addEventListener('click', (e) => {"));
    });
    const executablePath = process.env.PLAYWRIGHT_CHROMIUM || process.env.CHROMIUM_EXECUTABLE;
    const browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
    const context = await browser.newContext();
    const errors = [];
    context.on('page', page => {
        page.on('pageerror', error => errors.push(error.message));
        page.route(/^https?:/, route => route.abort());
    });
    const page = await context.newPage();
    try {
        await test('original A: let cp keeps one product per closure', async () => {
            await fixture(page, 'Angabe/files/productsA.html', 'Angabe/files/shopA.js');
            await add(page, ids[0]).click();
            await add(page, ids[1]).click();
            assert.deepEqual(await state(page), ids.map((id, i) => [id, i < 2 ? 1 : 0]));
        });
        await test('original A counterexample: ONLY let cp -> var cp sends all clicks to final object', async () => {
            await page.goto('about:blank');
            await page.setContent(read('Angabe/files/productsA.html').toString().replace(/<script\b[^>]*>[\s\S]*?<\/script>/i, ''));
            const original = read('Angabe/files/shopA.js').toString();
            assert.ok(original.includes('let cp = {};'));
            await page.addScriptTag({ content: original.replace('let cp = {};', 'var cp = {};') });
            await add(page, ids[0]).click();
            await add(page, ids[1]).click();
            assert.deepEqual(await state(page), ids.map((id, i) => [id, i === 3 ? 2 : 0]));
            assert.equal(await page.evaluate(() => cp === products[3]), true);
        });
        await test('original B: DOM receiver makes NaN; nested forEach independently loses this', async () => {
            await fixture(page, 'Angabe/files/productsB.html', 'Angabe/files/shopB.js');
            assert.equal(await page.evaluate(() => new Set(products.map(p => p.render)).size), 4);
            await add(page, ids[0]).click();
            assert.deepEqual(await state(page), ids.map(id => [id, 0]));
            assert.equal(await card(page, ids[0]).locator('.buy').evaluate(el => Number.isNaN(el.numInCart)), true);
            assert.equal(await page.evaluate(() => {
                products[0].numInCart = 1;
                try { productList.listProducts(); return 'no error'; }
                catch (error) { return error.name; }
            }), 'TypeError');
        });
        const versions = [
            ['A standard', 'ue4.1/productsA.html', 'ue4.1/shopA.js'],
            ['A arrow', 'ue4.1/arrow.html', 'ue4.1/shopA-arrow.js'],
            ['B fixed', 'ue4.2/productsB.html', 'ue4.2/shopB.js'],
            ['C prototype', 'ue4.2/productsC.html', 'ue4.2/productsC.js']
        ];
        for (const [name, html, script] of versions) {
            await page.goto(file(html));
            await test(`${name}: initial cart cleared and zero total`, async () => {
                assert.equal(await page.locator('#orderedItems li').count(), 0);
                assert.equal(await page.locator('#totalPrice').innerText(), '0.00');
                assert.equal(await page.locator('script').count(), 1);
            });
            await test(`${name}: every button adds exactly its own product; exact totals and one row per item`, async () => {
                const counts = [0, 0, 0, 0];
                for (let i = 0; i < ids.length; i += 1) {
                    for (let n = 0; n <= i; n += 1) {
                        await add(page, ids[i]).click();
                        counts[i] += 1;
                        const actual = new Map(await state(page));
                        assert.deepEqual(ids.map(id => actual.get(id)), counts);
                        const expected = counts.reduce((sum, qty, j) => sum + qty * cents[j], 0);
                        assert.equal(await page.locator('#totalPrice').innerText(), (expected / 100).toFixed(2));
                    }
                }
                assert.equal(await page.locator('#orderedItems li').count(), 4);
                assert.deepEqual(await card(page, ids[0]).locator('.buy').evaluate(el => Object.hasOwn(el, 'numInCart')), false);
            });
            await test(`${name}: empty twice, then add again, without duplicate listeners`, async () => {
                await page.locator('#emptyCard').click();
                await page.locator('#emptyCard').click();
                assert.equal(await page.locator('#orderedItems li').count(), 0);
                assert.equal(await page.locator('#totalPrice').innerText(), '0.00');
                assert.ok((await state(page)).every(([, qty]) => qty === 0));
                await add(page, ids[0]).click();
                assert.equal(await page.locator('#totalPrice').innerText(), '2890.00');
                assert.equal(new Map(await state(page)).get(ids[0]), 1);
            });
            if (name.startsWith('A ')) {
                await test(`${name}: DOM sorted numerically, nodes/listeners retained, order section last`, async () => {
                    assert.deepEqual(await page.locator('.product').evaluateAll(nodes => nodes.map(n => n.dataset.prodid)), [...ids].reverse());
                    assert.equal(await page.locator('.product').last().evaluate(el => el.nextElementSibling.contains(document.getElementById('orderedItems'))), true);
                });
                await test(`${name}: comma fractions parsed and sorted rather than parseFloat-truncated`, async () => {
                    await fixture(page, html, script, ['2,75', '10,50', '0,99', '2,50']);
                    assert.deepEqual(await page.locator('.product').evaluateAll(nodes => nodes.map(n => n.dataset.prodid)), [ids[2], ids[3], ids[0], ids[1]]);
                    await add(page, ids[0]).click();
                    assert.equal(await page.locator('#totalPrice').innerText(), '2.75');
                });
            }
            await test(`${name}: comma decimal prices and repeated quantities keep cents exact`, async () => {
                await fixture(page, html, script, ['0,10', '0,20', '1,25', '2,99']);
                const quantities = [3, 1, 2, 1];
                const prices = [10, 20, 125, 299];
                for (let i = 0; i < ids.length; i += 1) {
                    for (let n = 0; n < quantities[i]; n += 1) await add(page, ids[i]).click();
                }
                const expected = quantities.reduce((sum, qty, i) => sum + qty * prices[i], 0);
                assert.equal(await page.locator('#totalPrice').innerText(), (expected / 100).toFixed(2));
                if (name === 'C prototype') {
                    assert.deepEqual(await page.evaluate(() => products.map(p => p.getTotalPrice().toFixed(2))), ['0.30', '0.20', '2.50', '2.99']);
                    const rows = await page.locator('#orderedItems li').allTextContents();
                    ['0.30', '0.20', '2.50', '2.99'].forEach((value, i) => assert.ok(rows[i].includes(`Total: ${value}`)));
                }
            });
        }
        for (const [label, html] of [['B', 'ue4.2/productsB.html'], ['C', 'ue4.2/productsC.html']]) {
            await page.goto(file(html));
            await test(`${label}: forEach logs the next product, including last -> first wraparound`, async () => {
                const messages = [];
                const listener = message => messages.push(message.text());
                page.on('console', listener);
                try {
                    await add(page, ids[3]).click();
                    assert.deepEqual(messages, ['Log: Updated cart: ', 'Sony Alpha IV;']);
                    messages.length = 0;
                    await add(page, ids[0]).click();
                    assert.deepEqual(messages, ['Log: Updated cart: ', 'Sony 24-105mm lens;', 'Sony Alpha IV;']);
                } finally { page.off('console', listener); }
            });
            await test(`${label}: function object identities match instance/prototype design`, async () => {
                const result = await page.evaluate(() => ({
                    ownRender: products.map(p => Object.hasOwn(p, 'render')),
                    ownUpdate: products.map(p => Object.hasOwn(p, 'updateProduct')),
                    renderCount: new Set(products.map(p => p.render)).size,
                    updateCount: new Set(products.map(p => p.updateProduct)).size,
                    prototype: products.every(p => Object.getPrototypeOf(p) === Product.prototype)
                }));
                assert.equal(result.prototype, true);
                assert.deepEqual(result.ownRender, label === 'B' ? [true, true, true, true] : [true, false, false, false]);
                assert.deepEqual(result.ownUpdate, Array(4).fill(label === 'B'));
                assert.equal(result.renderCount, label === 'B' ? 4 : 2);
                assert.equal(result.updateCount, label === 'B' ? 4 : 1);
            });
        }
        await page.goto(file('ue4.2/productsC.html'));
        await test('C: every Product method on prototype; only first render overridden', async () => {
            assert.deepEqual(await page.evaluate(() => Object.keys(Product.prototype).sort()), ['getTotalPrice', 'removeOneFromCart', 'render', 'updateButtons', 'updateProduct'].sort());
            assert.equal(await page.evaluate(() => products.every(p => ['updateProduct', 'removeOneFromCart', 'getTotalPrice', 'updateButtons'].every(key => p[key] === Product.prototype[key]))), true);
            assert.deepEqual(await page.evaluate(() => products.map(p => Object.keys(p).filter(k => typeof p[k] === 'function'))), [['render'], [], [], []]);
            for (const id of ids) await add(page, id).click();
            const rows = await page.locator('#orderedItems li').allTextContents();
            assert.equal(rows.filter(row => row.endsWith(' New Arrival!')).length, 1);
            assert.ok(rows[0].startsWith('Sony Alpha IV '));
            assert.ok(rows[0].endsWith(' New Arrival!'));
            cents.forEach((price, i) => assert.equal(rows[i], `${['Sony Alpha IV', 'Sony 24-105mm lens', 'Nicon DX 16-600', 'Tamron 17-24mm'][i]} ${(price / 100).toFixed(2)} (1) \u2014 Total: ${(price / 100).toFixed(2)}${i === 0 ? ' New Arrival!' : ''}`));
        });
        await test('C: DOM-generated minus buttons, enable/disable and independent decrement', async () => {
            await page.locator('#emptyCard').click();
            assert.equal(await page.locator('.buy button').count(), 4);
            for (const id of ids) {
                const minus = card(page, id).locator('.buy button');
                assert.ok(await minus.isDisabled());
                assert.equal(await minus.getAttribute('type'), 'button');
                assert.equal(await minus.textContent(), '\u2212');
                await add(page, id).click();
                await add(page, id).click();
                assert.ok(await minus.isEnabled());
                await minus.click();
                assert.equal(new Map(await state(page)).get(id), 1);
                await minus.click();
                assert.equal(new Map(await state(page)).get(id), 0);
                assert.ok(await minus.isDisabled());
                assert.equal(await page.locator('#orderedItems li').count(), 0);
                assert.equal(await page.locator('#totalPrice').innerText(), '0.00');
                // Synthetic dispatch and direct method calls must not underflow either.
                await minus.dispatchEvent('click');
                await page.evaluate(id => products.find(p => p.id === id).removeOneFromCart(), id);
                assert.equal(new Map(await state(page)).get(id), 0);
            }
        });
        await test('C: empty resets all minus controls and totals after a mixed cart', async () => {
            for (const id of ids) await add(page, id).click();
            await page.locator('#emptyCard').click();
            assert.ok(await page.locator('.buy button').evaluateAll(nodes => nodes.every(n => n.disabled)));
            assert.equal(await page.locator('#totalPrice').innerText(), '0.00');
            assert.equal(await page.locator('#orderedItems li').count(), 0);
        });
        await test('no uncaught JavaScript errors in all real-browser runs', () => assert.deepEqual(errors, []));
        console.log(`RESULT ${passed} tests passed (Chromium ${browser.version()}; real headless browser; external network blocked).`);
    } finally {
        await browser.close();
    }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
