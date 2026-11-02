'use strict';
// Development-only aggregate runner. Product pages have no third-party dependencies.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
function sourceFiles(directory) {
    return fs.readdirSync(directory, { withFileTypes:true }).flatMap(entry => {
        const filename = path.join(directory,entry.name);
        return entry.isDirectory() ? sourceFiles(filename) : /\.(?:js|cjs)$/.test(entry.name) ? [filename] : [];
    });
}
function run(args) {
    const result = spawnSync(process.execPath,args,{cwd:__dirname,env:process.env,encoding:'utf8'});
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    if (result.error) throw result.error;
    assert.equal(result.status,0,'Failed: node '+args.join(' '));
    return result.stdout;
}
const files = sourceFiles(__dirname);
for (const filename of files) run(['--check',filename]);
console.log('Syntax: '+files.length+' JavaScript files checked');
const suites = [
    {file:'test_1_3.cjs',pattern:/ALL (\d+) TEST GROUPS PASSED/},
    {file:'test_4_5.cjs',pattern:/ALL (\d+) PRODUCT TEST GROUPS PASSED/}
];
const results = suites.map(suite => {
    const output = run([suite.file]);
    const match = output.match(suite.pattern);
    assert.ok(match,'Missing verified suite total');
    return {command:'node '+suite.file,passed:Number(match[1]),status:'passed'};
});
const report = {node:process.version,syntax_checked:files.length,suites:results,total_passed:results.reduce((sum,result)=>sum+result.passed,0),failed_suites:0};
fs.writeFileSync(path.join(__dirname,'testergebnis.json'),JSON.stringify(report,null,2)+'\n');
console.log('VERIFIED: '+report.total_passed+' test groups passed; no failed suites.');
