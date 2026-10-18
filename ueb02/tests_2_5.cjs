'use strict';

// Run from any directory: node /path/to/ueb02/tests_2_5.cjs
// Only this test harness uses Node/Playwright; the submitted pages use plain JS.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { pathToFileURL } = require('node:url');

const ROOT = __dirname;
const source = fs.readFileSync(path.join(ROOT, 'ue2.2/game.js'), 'utf8');
const INVALID = 'Invalid input. Please enter a number between 1 and 10.';
const THANKS = 'Thank you for playing!';
const REPLAY = 'Would you like to play again?';
const PROMPT = 'Enter a number between 1 and 10:';
let passed = 0;

async function test(name, action) {
    await action();
    passed++;
    console.log(`PASS ${name}`);
}

function createGame(inputs, decisions = [false], randoms = [0.4]) {
    const remainingInputs = [...inputs];
    const remainingDecisions = [...decisions];
    const remainingRandoms = [...randoms];
    const alerts = [];
    const dialogs = [];
    const math = Object.create(Math);
    math.random = () => {
        assert.ok(remainingRandoms.length, 'Unexpected random number request');
        return remainingRandoms.shift();
    };
    const context = vm.createContext({
        Math: math,
        prompt(message) {
            assert.equal(message, PROMPT);
            assert.ok(remainingInputs.length, 'Unexpected prompt');
            const reply = remainingInputs.shift();
            dialogs.push(['prompt', message, reply]);
            if (reply instanceof Error) throw reply;
            return reply;
        },
        confirm(message) {
            assert.equal(message, REPLAY);
            assert.ok(remainingDecisions.length, 'Unexpected confirm');
            const reply = remainingDecisions.shift();
            dialogs.push(['confirm', message, reply]);
            return reply;
        },
        alert(message) {
            alerts.push(String(message));
            dialogs.push(['alert', String(message)]);
        }
    });
    vm.runInContext(source, context, { filename: 'game.js', timeout: 1000 });
    return {
        context, alerts, dialogs, remainingInputs,
        assertConsumed() {
            assert.equal(remainingInputs.length, 0, 'Unused prompt inputs');
            assert.equal(remainingDecisions.length, 0, 'Unused replay decisions');
            assert.equal(remainingRandoms.length, 0, 'Unused random values');
        }
    };
}

function directCall(name, inputs, argument) {
    // First finish the main loop, then test the function in that same context.
    const game = createGame(['5', ...inputs]);
    game.alerts.length = 0;
    game.dialogs.length = 0;
    const result = vm.runInContext(`${name}(${argument === undefined ? '' : argument})`,
        game.context, { timeout: 1000 });
    game.assertConsumed();
    return { ...game, result };
}

async function vmTests() {
    await test('game structure: const limit, mutable replay state, external deferred script', () => {
        assert.match(source, /const MAX_ATTEMPTS = 3;/);
        assert.match(source, /let keepPlaying = true;/);
        const html = fs.readFileSync(path.join(ROOT, 'ue2.2/index.html'), 'utf8');
        assert.match(html, /<body>\s*<\/body>/);
        assert.match(html, /<head>[\s\S]*<script src="game\.js" defer><\/script>[\s\S]*<\/head>/);
        assert.equal((html.match(/<script\b/g) || []).length, 1);
    });

    await test('random lower bound 0 -> secret 1; first-attempt win; stop and thank', () => {
        const game = createGame(['1'], [false], [0]);
        game.assertConsumed();
        assert.deepEqual(game.alerts, ['Correct! You needed 1 attempt(s).', THANKS]);
        assert.equal(vm.runInContext('MAX_ATTEMPTS', game.context), 3);
        assert.equal(vm.runInContext('keepPlaying', game.context), false);
        assert.deepEqual(game.dialogs.map(d => d[0]), ['prompt', 'alert', 'confirm', 'alert']);
    });

    await test('random upper bound 0.9999999999999999 -> secret 10', () => {
        const game = createGame(['10'], [false], [0.9999999999999999]);
        game.assertConsumed();
        assert.deepEqual(game.alerts, ['Correct! You needed 1 attempt(s).', THANKS]);
    });

    await test('too high, too low, complete guess history, win on third attempt -> true', () => {
        const game = directCall('playNumberGame', ['9', '2', '5'], 5);
        assert.equal(game.result, true);
        assert.deepEqual(game.alerts, [
            'Too high! Attempts made: 1.', 'Previous guesses: 9',
            'Too low! Attempts made: 2.', 'Previous guesses: 9,2',
            'Correct! You needed 3 attempt(s).'
        ]);
    });

    await test('three wrong guesses reveal secret -> false', () => {
        const game = directCall('playNumberGame', ['1', '2', '3'], 5);
        assert.equal(game.result, false);
        assert.deepEqual(game.alerts, [
            'Too low! Attempts made: 1.', 'Previous guesses: 1',
            'Too low! Attempts made: 2.', 'Previous guesses: 1,2',
            'Too low! Attempts made: 3.', 'Previous guesses: 1,2,3',
            'No attempts left. The correct number was 5.'
        ]);
    });

    await test('invalid inputs count and their error text remains in guesses', () => {
        const game = directCall('playNumberGame', ['oops', '2', '5'], 5);
        assert.equal(game.result, true);
        assert.deepEqual(game.alerts, [INVALID, 'Too low! Attempts made: 2.',
            `Previous guesses: ${INVALID},2`, 'Correct! You needed 3 attempt(s).']);
    });

    await test('three invalid inputs exhaust attempts, with no fourth prompt', () => {
        const game = directCall('playNumberGame', ['oops', null, '11'], 5);
        assert.equal(game.result, false);
        assert.deepEqual(game.alerts, [INVALID, INVALID, INVALID,
            'No attempts left. The correct number was 5.']);
    });

    await test('all consecutive invalid inputs are retained in later history', () => {
        const game = directCall('playNumberGame', [null, '', '2'], 5);
        assert.equal(game.result, false);
        assert.deepEqual(game.alerts, [INVALID, INVALID, 'Too low! Attempts made: 3.',
            `Previous guesses: ${INVALID},${INVALID},2`,
            'No attempts left. The correct number was 5.']);
    });

    const cases = [
        ['minimum', '1', 1], ['maximum', '10', 10],
        ['fraction allowed by range rule', '4.5', 4.5],
        ['numeric whitespace', ' 7 ', 7], ['Number exponent syntax', '1e1', 10],
        ['Number hexadecimal syntax', '0xA', 10],
        ['cancel becomes zero', null, INVALID], ['empty becomes zero', '', INVALID],
        ['whitespace becomes zero', ' \t\n ', INVALID], ['not numeric', 'hello', INVALID],
        ['NaN', 'NaN', INVALID], ['positive infinity', 'Infinity', INVALID],
        ['negative infinity', '-Infinity', INVALID], ['below range', '0', INVALID],
        ['negative number', '-1', INVALID], ['above range', '11', INVALID],
        ['fraction below range', '0.999', INVALID],
        ['fraction above range', '10.001', INVALID], ['decimal comma', '4,5', INVALID]
    ];
    for (const [label, input, expected] of cases) {
        await test(`getUserInput: ${label}`, () => {
            const game = directCall('getUserInput', [input]);
            assert.equal(game.result, expected);
            assert.deepEqual(game.alerts, []);
        });
    }

    await test('try/catch also returns the message from a thrown prompt error', () => {
        const game = directCall('getUserInput', [new Error('Prompt failed')]);
        assert.equal(game.result, 'Prompt failed');
    });

    await test('a valid fraction counts as a low guess, not as an input error', () => {
        const game = directCall('playNumberGame', ['4.5', '5'], 5);
        assert.equal(game.result, true);
        assert.deepEqual(game.alerts, ['Too low! Attempts made: 1.',
            'Previous guesses: 4.5', 'Correct! You needed 2 attempt(s).']);
    });

    await test('replay: win, loss, win; new secret and history each round; one thank-you', () => {
        const game = createGame(['1', '1', '2', '3', '5'], [true, true, false],
            [0, 0.9999999999999999, 0.4]);
        game.assertConsumed();
        assert.deepEqual(game.alerts, ['Correct! You needed 1 attempt(s).',
            'Too low! Attempts made: 1.', 'Previous guesses: 1',
            'Too low! Attempts made: 2.', 'Previous guesses: 1,2',
            'Too low! Attempts made: 3.', 'Previous guesses: 1,2,3',
            'No attempts left. The correct number was 10.',
            'Correct! You needed 1 attempt(s).', THANKS]);
        assert.equal(game.dialogs.filter(d => d[0] === 'confirm').length, 3);
        assert.equal(game.dialogs.at(-1)[1], THANKS);
    });
}

const inner = ['inner:', 'target: [object HTMLButtonElement]',
    'currentTarget: [object HTMLButtonElement]', 'this: [object HTMLButtonElement]'];
const outer = ['outer:', 'target: [object HTMLButtonElement]',
    'currentTarget: [object HTMLDivElement]', 'this: [object HTMLDivElement]'];

function playwrightModule() {
    return require(process.env.PLAYWRIGHT_MODULE || 'playwright');
}

async function browserGame(browser, inputs, decisions, randoms) {
    // Reuse the VM oracle, but run the real HTML, external JS and native dialogs.
    const expected = createGame(inputs, decisions, randoms);
    expected.assertConsumed();
    const queue = [...expected.dialogs];
    const actual = [];
    const errors = [];
    const page = await browser.newPage();
    await page.addInitScript(values => {
        const sequence = [...values];
        Math.random = () => {
            if (!sequence.length) throw new Error('Unexpected random request in browser');
            return sequence.shift();
        };
    }, randoms);
    page.on('pageerror', error => errors.push(error.message));
    page.on('dialog', async dialog => {
        try {
            const next = queue.shift();
            assert.ok(next, 'Unexpected browser dialog');
            const [type, message, reply] = next;
            actual.push([dialog.type(), dialog.message(), ...(type === 'alert' ? [] : [reply])]);
            assert.equal(dialog.type(), type);
            assert.equal(dialog.message(), message);
            if (type === 'prompt') {
                if (reply === null) await dialog.dismiss();
                else await dialog.accept(reply);
            } else if (type === 'confirm' && !reply) {
                await dialog.dismiss();
            } else {
                await dialog.accept();
            }
        } catch (error) {
            errors.push(error.stack);
            await dialog.dismiss().catch(() => {});
        }
    });
    try {
        await page.goto(pathToFileURL(path.join(ROOT, 'ue2.2/index.html')).href);
        assert.deepEqual(errors, []);
        assert.deepEqual(queue, []);
        assert.deepEqual(actual, expected.dialogs);
        const structure = await page.evaluate(() => ({
            // HTML parsing may move trailing source whitespace into the body.
            emptyBody: document.body.innerHTML.trim() === '',
            scriptCount: document.scripts.length,
            deferredInHead: document.head.querySelector('script').defer,
            scriptName: document.head.querySelector('script').getAttribute('src')
        }));
        assert.deepEqual(structure, { emptyBody: true, scriptCount: 1,
            deferredInHead: true, scriptName: 'game.js' });
    } finally {
        await page.close();
    }
}

async function eventPage(browser, relativePath, modified) {
    const page = await browser.newPage();
    const messages = [];
    const errors = [];
    page.on('console', message => {
        if (message.type() === 'log') messages.push(message.text());
    });
    page.on('pageerror', error => errors.push(error.message));
    try {
        await page.goto(pathToFileURL(path.join(ROOT, relativePath)).href);
        await page.evaluate(() => {
            window.eventFacts = [];
            for (const id of ['button', 'outerArea']) {
                document.getElementById(id).addEventListener('click', function (event) {
                    window.eventFacts.push({ listener: id, target: event.target.id,
                        currentTarget: event.currentTarget.id,
                        thisId: this.id, sameThis: this === event.currentTarget,
                        phase: event.eventPhase });
                });
            }
        });
        await page.locator('#button').click();
        assert.deepEqual(messages, modified ? inner : [...inner, ...outer]);
        const expectedFacts = [{ listener: 'button', target: 'button',
            currentTarget: 'button', thisId: 'button', sameThis: true, phase: 2 }];
        if (!modified) expectedFacts.push({ listener: 'outerArea', target: 'button',
            currentTarget: 'outerArea', thisId: 'outerArea', sameThis: true, phase: 3 });
        assert.deepEqual(await page.evaluate(() => window.eventFacts), expectedFacts);
        console.log(`${modified ? 'MODIFIED' : 'ORIGINAL'} BUTTON OUTPUT:\n${messages.join('\n')}`);
        messages.length = 0;
        // Click padding, not the button. The original outer listener must still work.
        await page.locator('#outerArea').click({ position: { x: 10, y: 10 } });
        assert.deepEqual(messages, ['outer:', 'target: [object HTMLDivElement]',
            'currentTarget: [object HTMLDivElement]', 'this: [object HTMLDivElement]']);
        assert.deepEqual(errors, []);
    } finally {
        await page.close();
    }
}

async function main() {
    await vmTests();
    await test('exercise 5 HTML is byte-identical; original JS is an exact byte prefix', () => {
        const originalHtml = fs.readFileSync(path.join(ROOT, 'Angabe/files/ex5/ex5.html'));
        const solutionHtml = fs.readFileSync(path.join(ROOT, 'ue2.5/ex5.html'));
        assert.deepEqual(solutionHtml, originalHtml);
        const originalJs = fs.readFileSync(path.join(ROOT, 'Angabe/files/ex5/ex5.js'));
        const solutionJs = fs.readFileSync(path.join(ROOT, 'ue2.5/ex5.js'));
        assert.ok(solutionJs.length > originalJs.length);
        assert.deepEqual(solutionJs.subarray(0, originalJs.length), originalJs);
    });

    const { chromium } = playwrightModule();
    const executablePath = process.env.CHROMIUM_EXECUTABLE || process.env.PLAYWRIGHT_CHROMIUM;
    const browser = await chromium.launch({ ...(executablePath ? { executablePath } : {}), headless: true,
        args: ['--no-sandbox'] });
    console.log(`BROWSER Chromium ${browser.version()} (headless, file://)`);
    try {
        await test('browser game: replay through win, loss and win; bounds 1 and 10', () =>
            browserGame(browser, ['1', '1', '2', '3', '5'], [true, true, false],
                [0, 0.9999999999999999, 0.4]));
        await test('browser game: cancel, empty and whitespace exhaust three attempts', () =>
            browserGame(browser, [null, '', ' \t '], [false], [0.4]));
        await test('browser game: invalid history, fraction, then third-attempt win', () =>
            browserGame(browser, ['oops', '4.5', '5'], [false], [0.4]));
        await test('browser events: original button bubbles to outer; direct outer click', () =>
            eventPage(browser, 'Angabe/files/ex5/ex5.html', false));
        await test('browser events: appended stopPropagation limits button output; outer still works', () =>
            eventPage(browser, 'ue2.5/ex5.html', true));
    } finally {
        await browser.close();
    }
    console.log(`ALL ${passed} TESTS PASSED`);
}

main().catch(error => {
    console.error('FAIL', error.stack);
    process.exitCode = 1;
});
