'use strict';
// Development-only: Node.js + externally installed Playwright. Products use plain JS.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = __dirname;
const original = fs.readFileSync(path.join(root, 'Angabe/files/ex4/products.json'));
const expected = JSON.parse(original);
let mode = 'success';
let waiting;
let passed = 0;
const sockets = new Set();
const server = http.createServer((request, response) => {
    const url = new URL(request.url, 'http://localhost');
    if (url.pathname.endsWith('/products.json')) {
        if (mode === 'network') { request.socket.destroy(); return; }
        if (mode === 'timeout') { if (waiting) waiting(); return; }
        if (mode === '404' || mode === '500') {
            response.writeHead(Number(mode), { 'Content-Type': 'text/plain' });
            response.end('Server failure'); return;
        }
        response.writeHead(mode === '204' ? 204 : 200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
        if (mode === 'invalid-json') response.end('{broken');
        else if (mode === 'wrong-shape') response.end('{"products":[]}');
        else if (mode === 'bad-product') response.end('[{"id":"bad","title":"Bad","desc":"d","price":"4"}]');
        else if (mode === 'duplicate') response.end(JSON.stringify([expected[0], expected[0]]));
        else if (mode === 'empty') response.end('[]');
        else if (mode === 'unsafe') response.end(JSON.stringify([{ id:'safe', title:'<img src=x onerror=alert(1)>', desc:'<script>window.bad=true</script>', price:12.5 }]));
        else response.end(original);
        return;
    }
    const filename = path.resolve(root, '.' + url.pathname);
    if (!filename.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
    fs.readFile(filename, (error, data) => {
        if (error) { response.writeHead(404).end(); return; }
        const type = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript' }[path.extname(filename)] || 'application/octet-stream';
        response.writeHead(200, { 'Content-Type':type, 'Cache-Control':'no-store' });
        response.end(data);
    });
});
server.on('connection', socket => { sockets.add(socket); socket.on('close', () => sockets.delete(socket)); });
async function test(name, run) { await run(); passed++; console.log('PASS ' + name); }
async function main() {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const base = 'http://127.0.0.1:' + server.address().port;
    const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
    const browser = await chromium.launch({ headless:true, ...(executablePath ? { executablePath } : {}) });
    console.log('Browser: ' + browser.version());
    try {
        for (const exercise of ['ue5.4','ue5.5']) {
            const page = await browser.newPage();
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            const url = base + '/' + exercise + '/products.html';
            await test(exercise + ': original JSON byte-identical', () => {
                assert.deepEqual(fs.readFileSync(path.join(root, exercise, 'products.json')), original);
            });
            await test(exercise + ': HTTP rendering, fields, prices and independent buttons', async () => {
                mode = 'success';
                await page.goto(url);
                await page.locator('.product').nth(3).waitFor();
                const cards = await page.locator('.product').evaluateAll(nodes => nodes.map(node => ({ id:node.dataset.prodid, title:node.querySelector('h2').textContent, desc:node.querySelector('.desc').textContent, price:node.querySelector('.price').textContent })));
                assert.deepEqual(cards, expected.map(p => ({id:p.id,title:p.title,desc:p.desc,price:p.price.toFixed(2).replace('.', ',')})));
                await page.locator('.buy input').nth(0).click();
                await page.locator('.buy input').nth(0).click();
                await page.locator('.buy input').nth(1).click();
                assert.deepEqual(await page.locator('.quantity').allTextContents(), [' (2)',' (1)',' (0)',' (0)']);
                if (process.env.SCREENSHOT_DIR) await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,exercise+'-products.png'),fullPage:true});
            });
            await test(exercise + ': initialize uses supplied URL and DOM element, no duplicate append', async () => {
                const result = await page.evaluate(async () => {
                    const other = document.createElement('section');
                    document.body.appendChild(other);
                    const products = await initialize('products.json?test=custom',other);
                    await initialize('products.json?test=again',other);
                    return [products.length, other.querySelectorAll('.product').length, document.querySelector('#productContainer').querySelectorAll('.product').length];
                });
                assert.deepEqual(result, [4,4,4]);
            });
            for (const failure of ['404','500','invalid-json','wrong-shape','bad-product','duplicate','204','network']) {
                await test(exercise + ': handles ' + failure + ' and removes stale cards', async () => {
                    mode = failure;
                    const result = await page.evaluate(async () => {
                        const value = await initialize('products.json?test=failure', document.getElementById('productContainer'));
                        return { value, cards:document.querySelectorAll('#productContainer .product').length, message:document.querySelector('#productContainer [role=alert]').textContent };
                    });
                    assert.equal(result.value,null);
                    assert.equal(result.cards,0);
                    assert.match(result.message,/Could not load products:/);
                    if (/^\d/.test(failure) && failure !== '204') assert.match(result.message,new RegExp('HTTP '+failure));
                });
            }
            await test(exercise + ': empty array is a valid response', async () => {
                mode = 'empty';
                const result = await page.evaluate(async () => {
                    const p = await initialize('products.json',document.getElementById('productContainer'));
                    return [p,document.getElementById('productContainer').textContent];
                });
                assert.deepEqual(result,[[],'No products available.']);
            });
            await test(exercise + ': data is rendered as text, not interpreted as HTML', async () => {
                mode = 'unsafe';
                const result = await page.evaluate(async () => {
                    await initialize('products.json',document.getElementById('productContainer'));
                    const card = document.querySelector('.product');
                    return [card.querySelector('h2').textContent,card.querySelector('.desc').textContent,card.querySelector('.price').textContent,card.querySelectorAll('img,script').length];
                });
                assert.deepEqual(result,['<img src=x onerror=alert(1)>','<script>window.bad=true</script>','12,50',0]);
            });
            await test(exercise + ': ten-second timeout covers pending real HTTP request', async () => {
                mode = 'timeout';
                await page.clock.install();
                const requestSeen = new Promise(resolve => { waiting = resolve; });
                await page.evaluate(() => { window.pendingLoad = initialize('products.json?test=timeout',document.getElementById('productContainer')); });
                await requestSeen;
                waiting = undefined;
                await page.clock.fastForward(10001);
                const result = await page.evaluate(async () => [await window.pendingLoad,document.querySelector('#productContainer [role=alert]').textContent]);
                assert.equal(result[0],null);
                assert.match(result[1],/timed out/);
                await page.clock.resume();
            });
            await test(exercise + ': malformed URL is handled', async () => {
                const result = await page.evaluate(async () => {
                    const value = await initialize('http://[',document.getElementById('productContainer'));
                    return [value,document.querySelectorAll('#productContainer [role=alert]').length];
                });
                assert.deepEqual(result,[null,1]);
            });
            await test(exercise + ': recovers after errors without unhandled exceptions', async () => {
                mode = 'success';
                const value = await page.evaluate(async () => (await initialize('products.json',document.getElementById('productContainer'))).length);
                assert.equal(value,4);
                assert.equal(await page.locator('#productContainer .product').count(),4);
                assert.deepEqual(errors,[]);
            });
            await page.close();
        }
        console.log('ALL ' + passed + ' PRODUCT TEST GROUPS PASSED');
    } finally {
        await browser.close();
        for (const socket of sockets) socket.destroy();
        await new Promise(resolve => server.close(resolve));
    }
}
main().catch(error => { console.error(error); for (const socket of sockets) socket.destroy(); server.close(); process.exitCode=1; });
