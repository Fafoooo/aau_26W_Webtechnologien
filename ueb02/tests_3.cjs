'use strict';
// Browser-only test tooling; the submitted page uses plain JavaScript.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = __dirname;
async function main() {
    const browser = await chromium.launch({ headless: true,
        ...(process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {}) });
    try {
        const page = await browser.newPage();
        // The task concerns the DOM, not availability of third-party flag hosts.
        await page.route('https://**/*', route => route.abort());
        const lines = [], errors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', message => { if (message.type() === 'log') lines.push(message.text()); });
        await page.goto(pathToFileURL(path.join(root, 'ue2.3/ex3.html')).href);
        const actual = await page.evaluate(() => {
            const a = document.getElementsByTagName('a')[1];
            return [a.attributes.href.nodeValue, a.getAttributeNode('href').nodeValue, a.href,
                a.firstChild.outerHTML, a.attributes[0].nodeType, a.firstChild.nodeType,
                a.parentNode.nodeName, a.lastChild.parentNode.nodeName, a.attributes.length,
                a.innerHTML, a.outerHTML, a.innerText, a.outerText, a.textContent,
                a.outerHTML, a.nodeValue];
        });
        assert.equal(lines.length, 16);
        assert.deepEqual(actual.slice(0, 9), ['https://de.wikipedia.org', 'https://de.wikipedia.org',
            'https://de.wikipedia.org/', '<p>Text</p>', 2, 1, 'BODY', 'A', 2]);
        assert.equal(actual[15], null);
        assert.equal(actual[11], actual[12]);
        assert.ok(actual[13].includes('\n    Before '));
        assert.equal(await page.locator('a').nth(2).getAttribute('target'), null);
        assert.equal(await page.locator('a').nth(1).getAttribute('target'), '_new');
        assert.equal(await page.locator('a').nth(0).getAttribute('target'), '_new');
        assert.deepEqual(errors, []);
        console.log('PASS exercise 3: all 16 console calls executed, exact DOM types/values, third target removed');
        console.log(JSON.stringify({ browser: browser.version(), console: lines, values: actual }, null, 2));
        // Store real observations to compare with the written answer.
        fs.writeFileSync(path.join(root, 'ue2.3/browser-ergebnis.json'), JSON.stringify({
            browser: browser.version(), externalImages: 'blocked in test; actual HTML unchanged', console: lines, values: actual
        }, null, 2) + '\n');
        await page.goto(pathToFileURL(path.join(root, 'Angabe/files/ex3.html')).href);
        const nodes = await page.evaluate(() => {
            const result = [];
            function walk(node, depth) {
                let label;
                if (node.nodeType === Node.TEXT_NODE) label = '#text ' + JSON.stringify(node.nodeValue);
                else if (node.nodeType === Node.DOCUMENT_TYPE_NODE) label = '<!DOCTYPE ' + node.name + '>';
                else if (node.nodeType === Node.ELEMENT_NODE) label = node.tagName.toLowerCase() +
                    Array.from(node.attributes).map(a => ' ' + a.name + '=' + JSON.stringify(a.value)).join('');
                else label = node.nodeName;
                result.push({depth, label});
                for (const child of node.childNodes) walk(child, depth + 1);
            }
            walk(document, 0);
            return result;
        });
        const tree = nodes.map(({depth,label}) => '  '.repeat(depth) + label).join('\n');
        fs.writeFileSync(path.join(root, 'ue2.3/dom-baum.txt'), tree + '\n');
        const escape = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1650" height="' + (nodes.length * 24 + 72) + '">\n' +
            '<rect width="100%" height="100%" fill="white"/>\n<g font-family="monospace" font-size="14" fill="#182b49">\n' +
            '<text x="20" y="24">DOM of original ex3.html — indentation represents parent/child relationships</text>\n' +
            nodes.map(({depth,label},i) => '<text x="' + (20+depth*24) + '" y="' + (60+i*24) + '">' + escape(label) + '</text>').join('\n') +
            '\n</g></svg>\n';
        fs.writeFileSync(path.join(root, 'ue2.3/dom-skizze.svg'), svg);
        console.log('PASS complete DOM sketch generated from original HTML, including whitespace and attributes');
    } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
