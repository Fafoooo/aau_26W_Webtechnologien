# Exercise 2 — Promises I

Run `ex2.html`. The main `5_2.js` changes **only `runTaskPromise`**; its constructor, `endTask`, `cancelTask`, initialization and supplied HTML are unchanged. The destructive experiment for part (c) is isolated in `experiment-c/`.

## a) The adopted constructor

As in Exercise 1, the constructor stores the label, log and buttons. End and Cancel are initially disabled. All constructor arrow functions capture the newly created task object as `this`.

The Start click listener now calls:

```js
runTaskPromise(this)
    .then(() => { endTask(this); })
    .catch(() => { cancelTask(this); });
```

`runTaskPromise(this)` immediately logs the start, adjusts the buttons and returns a **new pending Promise for that run**. Its executor runs synchronously and installs the event handlers. Returning the Promise is essential: otherwise the constructor would attempt `.then` on `undefined`.

`.then(...)` registers the fulfilment reaction and returns a new Promise. Clicking End fulfils the original Promise, so `endTask(this)` runs in a subsequent Promise microtask. `.catch(...)` handles rejection of the preceding chain and calls `cancelTask(this)`; clicking Cancel rejects the original Promise and its rejection propagates through the `.then` without a rejection callback to this `.catch`. It therefore also runs asynchronously as a Promise reaction, although the click handler changes the Promise's state synchronously. The callback version instead calls its completion function directly in the event handler.

A subtlety: this `.catch` also handles an exception thrown by the `.then` callback (`endTask`), not only an explicit Cancel. The supplied constructor treats such an exception as cancellation as well. That constructor must remain unchanged. The original `counter` property is preserved but unused by the Promise implementation.

## b) `runTaskPromise` implementation

The original start logging/button statements stay in place. The added code returns `new Promise((resolve, reject) => { ... })` and defines three local functions:

1. `cleanup()` removes **both** the End and the Cancel listener, using the same named function objects that were registered.
2. `onEnd()` cleans up, then calls `resolve()`.
3. `onCancel()` cleans up, then calls `reject()`.

The two event listeners are registered at the end of the executor. Their closures retain the task, settlement functions and cleanup function for that individual run. Each Start creates fresh closures and a fresh Promise. The Promise fulfils or rejects without a value/reason (`undefined`), which is sufficient because the unchanged constructor ignores the arguments.

Removing both listeners is important: Promise settlement prevents a second outcome, but does **not** remove DOM listeners. Even using `{ once: true }` on both listeners independently would leave the losing listener installed until that button was clicked. Main-solution cleanup prevents stale callbacks accumulating across many start/end/cancel cycles. Cleanup happens before settlement, so even two artificially dispatched events in one JavaScript turn cannot act on the same run twice. It is local to that task and does not affect the other task's active run.

`endTask`/`cancelTask` still perform the final log and button changes via the constructor's reactions. There is no additional library and no change outside the permitted function in the main JavaScript file.

## c) Callbacks versus Promises: End after Cancel

Open these **separate experimental copies**:

- `experiment-c/ex1.html`: callback version, with `task.endButton.disabled = false;` in `cancelTask`.
- `experiment-c/ex2.html`: Promise version, with the same cancellation change.

For each, click **Start A → Cancel A → End A**, without starting another run between Cancel and End.

### Callback result

```text
A started
A cancelled
A ended
```

The original End listener remains installed. `cancelTask` now leaves End enabled. A later End click invokes the completion callback and `endTask`, which logs `ended` and disables End again. Ordinary callbacks do not themselves impose a mutually exclusive one-time result.

### Promise result

```text
A started
A cancelled
```

The experiment intentionally uses direct End/Cancel listeners with `{ once: true }` **without the main solution's competing-listener cleanup**. Thus Cancel really calls `reject()`, and the later End really calls `resolve()` on the **same** Promise. The browser test records those two actual settlement attempts, in that order. Since the first call has already rejected the Promise, the later `resolve()` has no effect. Its fulfilment handler is not executed, no `ended` entry appears, and End remains enabled because `endTask` was not called. Rejecting the original Promise stays permanent even though the separate Promise returned by `.catch` can fulfil after its rejection handler finishes.

This deliberately minimal experiment separates the two mechanisms: in the main solution the late End handler is removed; in the experiment it executes, but the Promise itself rejects the attempted second settlement. The experiment is not the cleanup strategy recommended for repeated production runs. The callback main file in `../ue5.1/5_1.js` remains byte-identical to the supplied original. A fresh Start creates a different Promise; the one-settlement guarantee does not prevent a new run from ending normally.

## Browser verification

`../test_1_3.cjs` checks exact preserved byte regions, real button states, overlapping independent A/B runs, both completion orders and 12 paired cycles (24 task runs). Listener instrumentation verifies exactly one End/Cancel listener per active task and zero after settlement, and forced events after cleanup produce no new entries. It also runs the isolated Cancel-then-End comparison and records `reject` followed by `resolve` in the experimental Promise version. No unexpected browser page errors occurred in either completed main solution.
