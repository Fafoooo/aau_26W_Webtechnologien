'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { pathToFileURL } = require('node:url');
const { repeatTransform, createCounter, shippingCost } = require('./ue4.3/examples.js');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
let passed = 0;
async function test(name, callback) {
    await callback();
    passed += 1;
    console.log('PASS ' + name);
}
async function main() {
    await test('3a higher-order example and callback invocation count', () => {
        let calls = 0;
        assert.equal(repeatTransform(value => { calls += 1; return value * 2; }, 3, 5), 40);
        assert.equal(calls, 3);
        assert.equal(repeatTransform(() => { throw new Error('not called'); }, 0, 5), 5);
    });
    await test('3a three standard higher-order examples', () => {
        assert.deepEqual([1, 2, 3].map(value => value * 2), [2, 4, 6]);
        assert.deepEqual([1, 2, 3, 4].filter(value => value % 2 === 0), [2, 4]);
        assert.equal([1, 2, 3].reduce((sum, value) => sum + value, 0), 6);
    });
    await test('3b closures persist and two counter environments stay independent', () => {
        const first = createCounter(10);
        const second = createCounter(100);
        assert.equal(first(), 11);
        assert.equal(first(2), 13);
        assert.equal(second(), 101);
        assert.equal(first(0), 13);
        assert.equal(first(-3), 10);
    });
    await test('3c currying and partial application', () => {
        assert.equal(shippingCost.length, 1);
        assert.equal(shippingCost(5).length, 1);
        assert.equal(shippingCost(5)(2).length, 1);
        assert.equal(shippingCost(5)(2)(3), 11);
        const local = shippingCost(5)(2);
        assert.equal(local(4), 13);
        assert.equal(local(0), 5);
    });
    const snippet = fs.readFileSync(path.join(__dirname, 'ue4.3/console-output.js'), 'utf8');
    await test('3e exact console values and return types', () => {
        const output = [];
        const context = vm.createContext({ console: { log: value => output.push(value) } });
        vm.runInContext(snippet, context);
        assert.deepEqual(output, [20, 21, 21, 16]);
        assert.equal(vm.runInContext('x', context), 20);
        assert.equal(vm.runInContext('typeof y', context), 'function');
        assert.equal(vm.runInContext('y(9, 999)', context), 16);
        assert.equal(vm.runInContext('myFunct(20, 2)(3)', context), 5);
    });
    const executablePath = process.env.PLAYWRIGHT_CHROMIUM;
    const browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
    try {
        const page = await browser.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await test('3d browser initial state and constructor-defined factory', async () => {
            await page.goto(pathToFileURL(path.join(__dirname, 'ue4.3/productsD.html')).href);
            assert.equal(await page.locator('#totalPrice').innerText(), '0.00');
            assert.deepEqual(await page.evaluate(() => products.map(p => Object.hasOwn(p, 'getEventHandler'))), [true, true, true, true]);
        });
        await test('3d all four buttons increment the right product without this errors', async () => {
            for (let i = 0; i < 4; i += 1) await page.locator('.buy input').nth(i).click();
            assert.deepEqual(await page.evaluate(() => products.map(p => p.numInCart)), [1, 1, 1, 1]);
            assert.equal(await page.locator('#totalPrice').innerText(), '5890.00');
            assert.equal(await page.locator('#orderedItems li').count(), 4);
            assert.deepEqual(errors, []);
        });
        await test('3d returned arrow ignores dynamic receiver and forwards event to current method', async () => {
            const result = await page.evaluate(() => {
                const p = products[0];
                const handler = p.getEventHandler();
                const original = p.updateProduct;
                const sentinel = { type: 'sentinel' };
                let receiverMatches = false;
                let eventMatches = false;
                p.updateProduct = function (event) {
                    receiverMatches = this === p;
                    eventMatches = event === sentinel;
                    original.call(this, event);
                };
                handler.call(products[1], sentinel);
                p.updateProduct = original;
                return { receiverMatches, eventMatches, counts: products.map(product => product.numInCart) };
            });
            assert.deepEqual(result, { receiverMatches: true, eventMatches: true, counts: [2, 1, 1, 1] });
            assert.equal(await page.locator('#totalPrice').innerText(), '8780.00');
        });
        await test('3d normal returned function loses receiver when used unbound', async () => {
            const result = await page.evaluate(() => {
                const p = products[0];
                function wrongFactory() {
                    return function (event) { return this.updateProduct(event); };
                }
                try {
                    wrongFactory.call(p).call(document.querySelector('.buy'), new Event('click'));
                    return false;
                } catch (error) {
                    return error instanceof TypeError;
                }
            });
            assert.equal(result, true);
        });
        await test('3d empty cart clears every count and rendering', async () => {
            await page.locator('#emptyCard').click();
            assert.equal(await page.locator('#totalPrice').innerText(), '0.00');
            assert.deepEqual(await page.evaluate(() => products.map(p => p.numInCart)), [0, 0, 0, 0]);
            assert.equal(await page.locator('#orderedItems li').count(), 0);
            assert.deepEqual(errors, []);
        });
        await test('3a-c/e also run in browser without Node globals', async () => {
            const output = [];
            page.on('console', message => output.push(message.text()));
            await page.goto(pathToFileURL(path.join(__dirname, 'ue4.3/index.html')).href);
            assert.deepEqual(output.slice(-4), ['20', '21', '21', '16']);
            assert.ok(output.some(line => line === '3c - curried: 11'));
            assert.deepEqual(errors, []);
        });
    } finally {
        await browser.close();
    }
    console.log(`ALL ${passed} EXERCISE-3 TESTS PASSED`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
