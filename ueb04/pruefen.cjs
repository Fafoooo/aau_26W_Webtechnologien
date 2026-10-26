'use strict';
// Development-only runner: executes real syntax checks and all three test suites.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

function sourceFiles(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
        const target = path.join(directory, entry.name);
        if (entry.isDirectory()) return sourceFiles(target);
        return /\.(?:js|cjs)$/.test(entry.name) ? [target] : [];
    });
}
function execute(args) {
    const result = spawnSync(process.execPath, args, { cwd: __dirname, encoding: 'utf8', env: process.env });
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    if (result.error) throw result.error;
    assert.equal(result.status, 0, 'Failed command: node ' + args.join(' '));
    return result.stdout;
}

const files = sourceFiles(__dirname);
for (const filename of files) execute(['--check', filename]);
console.log(`Syntax: ${files.length} JavaScript files checked`);
const suites = [
    { args: ['tests_1_2.cjs'], pattern: /RESULT (\d+) tests passed/ },
    { args: ['tests_3.cjs'], pattern: /ALL (\d+) EXERCISE-3 TESTS PASSED/ },
    { args: ['--test', 'tests_4_5.cjs'], pattern: /# pass (\d+)/ }
];
const results = [];
for (const suite of suites) {
    const output = execute(suite.args);
    const match = output.match(suite.pattern);
    assert.ok(match, 'Missing success count for ' + suite.args.join(' '));
    results.push({ command: 'node ' + suite.args.join(' '), passed: Number(match[1]), status: 'passed' });
}
const summary = {
    node: process.version,
    syntax_checked: files.length,
    suites: results,
    total_passed: results.reduce((sum, result) => sum + result.passed, 0),
    failed_suites: 0
};
fs.writeFileSync(path.join(__dirname, 'testergebnis.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(`VERIFIED: ${summary.total_passed} tests passed across ${results.length} suites; no failed suites.`);
