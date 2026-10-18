// KI-unterstützte Browser-/Originaltreuetests; benötigt Node und Playwright, keinen Server.
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const playwright = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = __dirname;
const original = path.join(root, 'Angabe/files');
let passed = 0;
const errors = [];
async function test(name, run) {
    await run();
    passed++;
    console.log(`OK ${passed}: ${name}`);
}
function identical(a, b) {
    assert.ok(fs.readFileSync(a).equals(fs.readFileSync(b)), `Nicht byteidentisch: ${b}`);
}
function watch(page) {
    page.on('pageerror', error => errors.push(error.message));
    return page;
}
async function priceIs(page, expected) {
    assert.equal(await page.locator('#price').inputValue(), expected);
}
async function main() {
    await test('Originaltreue: Glass-HTML und sämtliche Galerie-Dateien, JS als Byte-Präfix', async () => {
        identical(path.join(original, 'glassOrder.html'), path.join(root, 'ue2.4/glassOrder.html'));
        for (const name of fs.readdirSync(path.join(original, 'gallery'))) {
            const source = path.join(original, 'gallery', name);
            const target = path.join(root, 'ue2.6', name);
            if (name === 'gallery.js') {
                const prefix = fs.readFileSync(source);
                const result = fs.readFileSync(target);
                assert.ok(result.length > prefix.length);
                assert.ok(result.subarray(0, prefix.length).equals(prefix), 'Original-JS-Präfix verändert');
            } else identical(source, target);
        }
    });
    const browser = await playwright.chromium.launch({
        ...(process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {}),
        headless: true
    });
    try {
        const page = watch(await browser.newPage({ viewport: { width: 1200, height: 800 } }));
        await page.goto(pathToFileURL(path.join(root, 'ue2.4/glassOrder.html')).href);
        await test('Glas: DOM-Aufräumen, readonly price, korrektes Label/Fieldset und Startwert', async () => {
            assert.equal(await page.locator('h1').count(), 1);
            assert.equal(await page.locator('body > p').count(), 0);
            assert.equal(await page.locator('#price').count(), 1);
            assert.equal(await page.locator('#price').getAttribute('name'), 'price');
            assert.equal(await page.locator('#price').evaluate(el => el.readOnly), true);
            assert.equal(await page.locator('label[for="price"]').textContent(), 'price');
            assert.equal(await page.locator('#price').evaluate(el => el.closest('fieldset') === document.querySelector('#width').closest('fieldset')), true);
            await priceIs(page, '-');
        });
        await page.locator('#width').fill('100');
        await page.locator('#height').fill('50');
        await page.locator('[id="4mm"]').check();
        await test('Glas: Nur Geometrie reicht wegen erforderlicher Kontaktdaten nicht', () => priceIs(page, '-'));
        for (const [id, value] of Object.entries({ firstName: 'Test', lastName: 'Person', street: 'Testweg 1', zip: '9020', city: 'Teststadt', email: 'test@example.invalid' })) {
            await page.locator(`#${id}`).fill(value);
        }
        await test('Glas: Vollständiges Formular, Standard-Schwarz, 4 mm werden 0,4 cm', () => priceIs(page, '40.00'));
        for (const [mm, expected] of [[6, '60.00'], [8, '80.00'], [12, '120.00']]) {
            await test(`Glas: Radio ${mm} mm aktualisiert den Preis`, async () => {
                await page.locator(`[id="${mm}mm"]`).check();
                await priceIs(page, expected);
            });
        }
        await test('Glas: change-Ereignis allein und Farbpreis (rot)', async () => {
            await page.locator('#color').evaluate(el => { el.value = '#ff0000'; el.dispatchEvent(new Event('change', { bubbles: true })); });
            await priceIs(page, '187.50');
        });
        await test('Glas: calculate in cm, alle 256 Grauwerte und mehrere bunte Farben', async () => {
            const results = await page.evaluate(() => {
                const samples = [];
                for (let i = 0; i < 256; i++) {
                    const channel = i.toString(16).padStart(2, '0');
                    document.querySelector('#color').value = '#' + channel.repeat(3);
                    samples.push(calculate(100, 50, 0.8));
                }
                const colored = ['#010000', '#000100', '#000001', '#808081', '#abcdef'].map(color => {
                    document.querySelector('#color').value = color;
                    return calculate(100, 50, 0.8);
                });
                return { samples, colored };
            });
            assert.ok(results.samples.every(value => value === 80));
            assert.ok(results.colored.every(value => value === 125));
        });
        await page.locator('#color').fill('#ffffff');
        await test('Glas: checkValidity wird tatsächlich aufgerufen', async () => {
            const calls = await page.evaluate(() => {
                const form = document.querySelector('form');
                const originalCheck = form.checkValidity;
                let calls = 0;
                form.checkValidity = function () { calls++; return originalCheck.call(this); };
                update();
                form.checkValidity = originalCheck;
                return calls;
            });
            assert.equal(calls, 1);
            await priceIs(page, '120.00');
        });
        for (const [id, value, reason] of [
            ['width', '', 'fehlende Breite'], ['height', '', 'fehlende Höhe'],
            ['width', '-1', 'unter min'], ['width', '201', 'über max'],
            ['height', '201', 'Höhe über max'], ['width', '1.5', 'stepMismatch'],
            ['email', 'ungueltig', 'ungültige E-Mail'], ['city', '', 'fehlender Pflichtkontakt'],
            ['phone', 'abc', 'optionales Telefon mit ungültigem pattern']
        ]) {
            await test(`Glas: ${reason} liefert '-' und Korrektur aktualisiert sofort`, async () => {
                const input = page.locator(`#${id}`);
                const previous = await input.inputValue();
                await input.fill(value);
                await priceIs(page, '-');
                await input.fill(previous);
                await priceIs(page, '120.00');
            });
        }
        await test('Glas: fehlende Radioauswahl, ungültige Zahl und gültige Null/max-Grenzen', async () => {
            await page.evaluate(() => {
                document.querySelectorAll('[name="thickness"]').forEach(el => { el.checked = false; });
                update();
            });
            await priceIs(page, '-');
            await page.locator('[id="4mm"]').check();
            await page.locator('#width').fill('0');
            await priceIs(page, '0.00');
            await page.locator('#width').fill('200');
            await page.locator('#height').fill('200');
            await priceIs(page, '320.00');
            await page.locator('#width').evaluate(el => { el.value = 'NaN'; el.dispatchEvent(new Event('input', { bubbles: true })); });
            await priceIs(page, '-');
        });
        await page.close();

        const gallery = watch(await browser.newPage({ viewport: { width: 1200, height: 800 } }));
        await gallery.goto(pathToFileURL(path.join(root, 'ue2.6/gallery.html')).href);
        async function galleryIs(p, index) {
            const expected = await p.locator('.gallery img').nth(index).evaluate(el => ({ src: el.dataset.large, alt: el.alt }));
            assert.equal(await p.locator('#displayDIV .bigIMG').getAttribute('src'), expected.src);
            assert.equal(await p.locator('#displayDIV .bigIMG').getAttribute('alt'), expected.alt);
            assert.equal(await p.locator('#displayDIV .desc').textContent(), expected.alt);
            assert.equal(await p.locator('#displayDIV').isVisible(), true);
            await p.waitForFunction(() => {
                const image = document.querySelector('#displayDIV .bigIMG');
                return image.complete && image.naturalWidth > 0;
            });
        }
        const previous = p => p.getByRole('button', { name: 'previous', exact: true });
        const next = p => p.getByRole('button', { name: 'next', exact: true });
        await test('Galerie: Originalbilder laden, dynamische Buttons und anfangs geschlossenes Overlay', async () => {
            assert.equal(await gallery.locator('#displayDIV button').count(), 2);
            assert.equal(await gallery.locator('#displayDIV').isVisible(), false);
            assert.equal(await gallery.locator('.gallery img').evaluateAll(imgs => imgs.every(el => el.complete && el.naturalWidth > 0)), true);
            await gallery.locator('.gallery img').nth(0).click();
            await galleryIs(gallery, 0);
            for (const button of [previous(gallery), next(gallery)]) {
                const box = await button.boundingBox();
                assert.ok(box && box.y >= 0 && box.y + box.height <= 800, 'Button außerhalb des Viewports');
            }
        });
        await test('Galerie: previous am Anfang -> letztes Bild, next am Ende -> erstes; Overlay bleibt offen', async () => {
            await previous(gallery).click();
            await galleryIs(gallery, 2);
            await next(gallery).click();
            await galleryIs(gallery, 0);
            await next(gallery).click();
            await galleryIs(gallery, 1);
        });
        await test('Galerie: Hintergrundklick schließt weiterhin, neue Thumbnailwahl setzt Ausgangsbild neu', async () => {
            await gallery.locator('#displayDIV').click({ position: { x: 5, y: 5 } });
            assert.equal(await gallery.locator('#displayDIV').isVisible(), false);
            await gallery.locator('.gallery img').nth(2).click();
            await previous(gallery).click();
            await galleryIs(gallery, 1);
        });
        await gallery.close();
        for (const count of [0, 1, 2, 5]) {
            await test(`Galerie: anderes HTML gleichen Formats mit ${count} Bildern und wiederholten Bild-URLs`, async () => {
                const fixture = watch(await browser.newPage({ viewport: { width: 900, height: 600 } }));
                // file:-Ursprung statt about:blank, damit lokale Bilder/CSS geladen werden dürfen.
                await fixture.goto(pathToFileURL(path.join(root, 'ue2.6/gallery.css')).href);
                const thumbURL = pathToFileURL(path.join(root, 'ue2.6/hk_small.JPG')).href;
                const largeURL = pathToFileURL(path.join(root, 'ue2.6/hk.JPG')).href;
                const items = Array.from({ length: count }, (_, i) => `<span><img src="${thumbURL}" data-large="${largeURL}" alt="Bild ${i} &amp; Beschreibung"><em>Zusatz ${i}</em></span>`).join('');
                const cssURL = pathToFileURL(path.join(root, 'ue2.6/gallery.css')).href;
                await fixture.setContent(`<!doctype html><html><head><link rel="stylesheet" href="${cssURL}"></head><body><h1>Andere Inhalte</h1><section class="gallery">${items}</section><div id="displayDIV"><img class="bigIMG" src="" alt=""><p class="desc">Andere Beschreibung</p></div></body></html>`);
                await fixture.addScriptTag({ path: path.join(root, 'ue2.6/gallery.js') });
                assert.equal(await fixture.locator('#displayDIV button').count(), 2);
                if (count === 0) {
                    await fixture.locator('#displayDIV').evaluate(el => { el.style.display = 'block'; });
                    await next(fixture).click();
                    await previous(fixture).click();
                    assert.equal(await fixture.locator('#displayDIV .bigIMG').getAttribute('src'), '');
                } else {
                    await fixture.locator('.gallery img').nth(count - 1).click();
                    await next(fixture).click();
                    await galleryIs(fixture, 0);
                    await previous(fixture).click();
                    await galleryIs(fixture, count - 1);
                    for (let i = 0; i < count + 2; i++) await next(fixture).click();
                    await galleryIs(fixture, (count - 1 + count + 2) % count);
                    await fixture.locator('#displayDIV').click({ position: { x: 2, y: 2 } });
                    await fixture.locator('.gallery img').nth(Math.floor(count / 2)).click();
                    await previous(fixture).click();
                    await galleryIs(fixture, (Math.floor(count / 2) - 1 + count) % count);
                }
                await fixture.close();
            });
        }
        await test('Keine unbehandelten Browser-JavaScript-Fehler', async () => assert.deepEqual(errors, []));
        console.log(`BESTANDEN: ${passed} Testgruppen (Chromium, file://, ohne Server).`);
    } finally {
        await browser.close();
    }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
