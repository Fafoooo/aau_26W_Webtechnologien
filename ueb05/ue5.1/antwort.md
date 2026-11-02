# Exercise 1 — Callbacks

Run `ex1.html` in a browser. `5_1.js` and `ex1.html` are exact byte copies of the supplied files; the explanatory exercise does not require changing them.

## a) Code and observable behaviour

The HTML contains the three buttons Start, Cancel and End for each of tasks A and B, plus the shared `eventLog`. The deferred script executes after the HTML has been parsed, so `getElementById` can find those elements.

`new task('A', evlog)` and `new task('B', evlog)` create separate task objects. In the constructor, `this` is the new object. Each object stores its label, the shared log, its own three DOM references and a counter initially equal to zero. Its start listener uses arrow functions to retain that object as `this`. End and Cancel initially become disabled; Start remains enabled.

Clicking Start calls `runTask(this, endCallback, cancelCallback)`. The two callbacks are functions, not the results of calling `endTask` or `cancelTask` immediately. `runTask` appends a timestamped `started` entry, disables Start and enables End and Cancel. On the first run only (`counter === 0`), it registers listeners on those two buttons. It then increments `counter`. The existing listeners are reused on later runs, preventing duplicate log entries. Their closures retain the first run's callbacks, which still refer to the same task object.

Clicking End invokes the stored completion callback. It calls `endTask` with the captured task object, disables End and Cancel, enables Start and appends `ended` with a timestamp. Cancel analogously calls `cancelTask`, restores the same button states and appends `cancelled`. The user can start A and B in either order, leave both active and finish them in either order: their buttons and state are independent even though their entries share one log. This is overlapping manual activity, not JavaScript executing those handlers on multiple threads. The script only records user actions; it does not perform, time or automatically finish any real task.

A detail of the original code: `addEventListener` returns `undefined`, so `task.endListener` and `task.cancelListener` do **not** contain usable listener references. Registration still works because the browser retains the callbacks. Those properties are not used later. Also, `endCallback(task)` supplies an argument that the parameterless arrow callback ignores; it instead uses its lexically captured `this`.

## b) Higher-order functions and callbacks

A **higher-order function** accepts a function as an argument and/or returns a function. A **callback** describes the role of the function passed to another operation: the receiving operation calls it at the appropriate point.

Here `runTask` is a higher-order function because it accepts `endCallback` and `cancelCallback`. `addEventListener` also accepts functions, making it a higher-order API. The supplied listener functions and the supplied completion/cancellation functions are callbacks. These terms are related but not synonyms: “higher-order” describes the receiving function; “callback” describes how the passed function is used. A callback is not necessarily asynchronous (for example, an array's `forEach` callback is synchronous). Here the click listeners run later, on user events.

## c) Callback locations

- Constructor, lines 14–19: the arrow passed to the Start button's `addEventListener` is an event callback.
- Constructor, lines 16–17: the two arrows passed to `runTask` are the completion and cancellation callbacks.
- `runTask`, lines 31–32: the arrows registered on End and Cancel are event callbacks. They call `endCallback(task)` or `cancelCallback(task)`.

`endTask` and `cancelTask` do the final work. In this particular source, they are called **inside** the supplied callbacks rather than being passed directly as callback arguments.

## d) Arrow functions, `this` and actual errors

Arrow functions have no own `this`; they capture it from the surrounding constructor call. That means `runTask(this, ...)`, `endTask(this)` and `cancelTask(this)` all receive the task object even when the browser invokes an event handler later.

If the outer Start listener is replaced with a standard anonymous `function () { ... }`, the DOM invokes it with `this` equal to the Start `<input>` element (`event.currentTarget`), **not** the task. Consequently `runTask` receives that input. The input has no `evlog` property, so the first statement tries to access `undefined.innerHTML`. Chromium actually reported:

```text
TypeError: Cannot read properties of undefined (reading 'innerHTML')
```

It fails before the button state changes or a start entry is written. Replacing all arrows with ordinary functions produces this same first failure; the later callbacks are not reached.

There is a second, separate binding issue if only an inner completion callback is changed. `runTask`'s listener invokes `endCallback(task)` as a plain function call. It does not bind a receiver to that callback, and passing an argument does not assign `this`. In the supplied non-strict classic script, an ordinary inner callback therefore gets `window` as `this` (strict code would get `undefined`). `endTask(window)` fails when accessing its missing `endButton`. The separately reproduced Chromium error was:

```text
TypeError: Cannot set properties of undefined (setting 'disabled')
```

Arrow syntax is necessary for the **unchanged binding strategy**, not the only possible solution in JavaScript: explicitly capturing the task in a variable or using `.bind(this)` would also work, but is not applied to this preserved source.

## Browser verification

`../test_1_3.cjs` opens the actual file page, checks initial and running button states, overlaps A/B, alternates their start and finish order, and executes 12 paired cycles (24 task runs, 48 log entries) without duplicate entries. It also reproduces both binding failures in isolated browser fixtures without altering the submitted main file. The destructive Cancel-then-End comparison belongs to Exercise 2(c), under `../ue5.2/experiment-c/`.
