# Exercise 3 — Promises II

- Part (a), unchanged supplied program: `../Angabe/files/ex3.html`.
- Part (b), `.then`/`.catch` solution: `ex3.html` and `5_3.js`.
- Part (c), independent `async`/`await` solution: `async/ex3.html` and `async/5_3.js`.

The two solution pages run separately so they do not interleave their logs or display two error alerts. Both copies preserve `delayedCalc` and `handleError` exactly, and their HTML is identical to the supplied HTML.

## a) What the original code does and why

`eventLog` references the paragraph in the HTML. `delayedCalc(a,b)` returns a new Promise. Its executor runs **synchronously**, immediately when the function is called:

- When `a > b`, it schedules a timer with a random integer delay `Math.floor(Math.random() * 2000)` milliseconds. The timer later calculates `a + b`, appends the equation to the page and calls `resolve(c)` to fulfil the Promise with the result. The timer delay is not a guarantee of its exact wall-clock execution time.
- Otherwise, it immediately calls `reject('error: b larger than a')` and writes `rejected`. The condition also rejects equality, although the supplied error message says only “larger”. Rejecting a Promise does not throw out of its executor or stop the following logging statement.

The four original calls are independent; none waits for another or uses its result:

1. `delayedCalc(5,3)` schedules a timer.
2. `delayedCalc(7,14)` rejects and writes `rejected` immediately.
3. `delayedCalc(23,25)` rejects and writes another `rejected` immediately.
4. `delayedCalc(1000,1)` schedules a second timer.

Therefore the first two log lines are always:

```text
rejected
rejected
```

After the current script finishes, the two timer callbacks can run. They print `5 + 3 = 8` and `1000 + 1 = 1001` in whichever order their independent random scheduling produces. Even a zero-delay timer cannot interrupt the synchronous script and overtake the immediate rejection logs. `resolve`/`reject` settle the Promise, whereas `.then`/`.catch` reactions, if attached, execute later as microtasks. In this original file there are **no rejection handlers**: the browser additionally reports two unhandled Promise rejections. `handleError` is defined but never called by the original invocations, so those failures do not trigger its alert.

### Actual repeated refresh observations

The automated browser test opened the **unchanged real page 10 times** (initial load plus nine refreshes), without replacing its random source for this observation. It observed both legal tails:

```text
1000 + 1 = 1001
5 + 3 = 8
```

and:

```text
5 + 3 = 8
1000 + 1 = 1001
```

Each load still began with the two synchronous `rejected` lines. There were 20 unhandled-rejection page-error reports in total, two per load. Chromium/Playwright may display the string rejection without its `error:` prefix; the supplied rejection value itself remains unchanged. A separate deterministic diagnostic sets random extremes only in the browser test to demonstrate both possible timer orders reliably; that is not substituted for the real refresh observation.

## b) Chained `.then` calls and `.catch`

```js
delayedCalc(5,3)
    .then(result => delayedCalc(result,7))
    .then(result => delayedCalc(result,14))
    .then(result => delayedCalc(result,23))
    .then(result => delayedCalc(result,25))
    .then(result => delayedCalc(result,1000))
    .then(result => delayedCalc(result,1))
    .catch(error => handleError(error));
```

Every concise arrow returns the next Promise. The chain adopts that Promise's state and waits for its fulfilment before invoking the next callback, supplying the actual previous result. For example, the first callback receives `8` and calls `delayedCalc(8,7)`, rather than computing an unrelated independent pair. Merely putting independent calls on successive source lines would not create this dependency. Omitting the returned Promise in a block-bodied callback would also break the chain's waiting and value propagation.

The actual input trace is `(5,3) → (8,7) → (15,14) → (29,23) → (52,25) → (77,1000)`. The last of those calls rejects because its first operand is not greater than its second. That rejection propagates past the remaining fulfilment callback to `.catch`, so the requested final `+1` step is present in the source but is **never invoked**. `handleError(error)` displays the provided alert message.

## c) `async`/`await` and `try`/`catch`

`async/5_3.js` puts the same sequence in `async function calculateSequence()`. The first `await` obtains the result of `delayedCalc(5,3)`; each following assignment uses `result` as its first operand and awaits the next result.

`await` suspends only this asynchronous function, not the browser event loop. A fulfilled Promise resumes the function with its fulfilment value. A rejected Promise resumes it by throwing the rejection reason at the `await` expression. Therefore `await delayedCalc(result,1000)` transfers control to `catch (error)`, which calls the unchanged `handleError(error)`. The following `+1` call is skipped. The function is called once; its error is handled internally. `async`/`await` is Promise-based control flow, not a separate parallel-execution mechanism.

## Output of both completed solutions

```text
5 + 3 = 8
8 + 7 = 15
15 + 14 = 29
29 + 23 = 52
52 + 25 = 77
rejected
```

Both also display exactly one alert, `error: b larger than a`, via `handleError`. There is no line for an addition involving `1000`, because the supplied function rejects before computing it, and there is no final `+1` call. The spaces in the first equation are retained from the original `delayedCalc` formatter.

## Browser verification

`../test_1_3.cjs` opens both actual solution pages with their unchanged random timers and checks the entire output, the single alert and the absence of unhandled page errors. Separate instrumented browser fixtures trace every actual `delayedCalc` argument pair and verify that `+1` is not called. Byte comparisons verify that neither `delayedCalc` nor `handleError` was modified. The only expected unhandled rejections belong to the unchanged part-(a) program, not to the completed solutions.
