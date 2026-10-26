# Exercise 3 — Closures and currying

## Execution

Open `index.html` and the browser console for parts (a), (b), (c), and (e), or run `node examples.js` and `node console-output.js`. Open `productsD.html` for part (d). The implementation uses plain JavaScript only.

## 3(a) — Higher-order and first-class functions

A **higher-order function** accepts a function as an argument, returns a function, or both. The example `repeatTransform(transform, times, initial)` receives a callback, applies it repeatedly, and returns the final value:

```js
repeatTransform(value => value * 2, 3, 5); // 40
```

The intermediate values are 5, 10, 20, and 40. The callback is passed as a value; it is called inside the loop, not while being passed.

Three standard JavaScript examples, all executed in `examples.js`, are:

- `map`: `[1, 2, 3].map(value => value * 2)` returns `[2, 4, 6]`.
- `filter`: `[1, 2, 3, 4].filter(value => value % 2 === 0)` returns `[2, 4]`.
- `reduce`: `[1, 2, 3].reduce((sum, value) => sum + value, 0)` returns `6`.

**First-class functions** can be assigned to variables, stored in objects or arrays, passed as arguments, and returned as values. This describes how the language treats function values. “Higher-order” describes what a particular function does with functions. Every function need not itself be higher-order just because functions are first-class.

## 3(b) — Closure

A **closure** is a function together with access to the lexical environment in which it was created. It keeps access to bindings, not a frozen copy of their values.

`createCounter(start)` creates a local mutable `value` and returns a function that changes it. The returned function still accesses that binding after `createCounter` returns:

```js
const first = createCounter(10);
const second = createCounter(100);
first();   // 11
first(2);  // 13
second();  // 101
```

The first counter preserves its state between calls. The second factory invocation creates a separate environment, so it does not share the first counter's value. The caller cannot access `value` directly through an object property.

## 3(c) — Currying

**Currying** transforms an n-argument function into successive functions that each take one argument. Here the uncurried calculation `(base, perItem, quantity) => base + perItem * quantity` becomes `shippingCost(base)(perItem)(quantity)`:

```js
shippingCost(5)(2)(3); // 11
const localRate = shippingCost(5)(2);
localRate(4);         // 13
```

Each nested function closes over the earlier argument bindings. Saving `localRate` is **partial application**: two arguments have been fixed, while quantity is still missing. Currying is the single-argument function structure; partial application is supplying only some arguments to obtain a specialized function.

## 3(d) — Constructor-defined event-handler factory

`shopD.js` starts from the corrected `shopB.js`. The Product constructor now defines:

```js
this.getEventHandler = function () {
    return (event) => this.updateProduct(event);
};
const clickButton = el.querySelector('.buy');
clickButton.addEventListener('click', this.getEventHandler());
```

The factory is called **once during construction**, as a method of the Product. Its ordinary-function `this` therefore refers to that Product. The returned arrow function captures this receiver lexically. The event system calls the arrow later, and its dynamic receiver cannot replace the captured Product. The event is forwarded to `updateProduct`.

Calling `this.updateProduct(event)` inside the arrow also supplies the Product as the receiver for that method. The method property is looked up when the event occurs, so replacing `product.updateProduct` after registration changes which method runs. The browser tests explicitly verify this and that the event is forwarded unchanged.

A returned ordinary function such as `function (event) { this.updateProduct(event); }` does not capture the factory's `this`. When registered unbound on `.buy`, its receiver becomes the DOM div; the div has no `updateProduct` method, causing a `TypeError`. A normal function could work with explicit binding or a captured `self` reference, but not with the unbound implementation above. The arrow is important for the requested lexical-`this` solution, not the only possible JavaScript technique.

The separate `productList.listProducts` callback is also an arrow: the nested original `forEach(function (...) {...})` independently lost the list's receiver. Fixing only the click handler would not fix that second bug. The supplied logger's next-product behavior is retained.

## 3(e) — Exact console output

`console-output.js` transcribes the code image on page 2, including the unused third parameter `x` and the final call `y(9,33)`.

The output, in order, is:

```text
20
21
21
16
```

1. `myFunct(12,8)` creates `calc` with access to this call's `b = 8`. Since `12 < 20`, it calls `calc(12)`. The inner function logs `12 + 8 = 20` and returns 20, so the outer top-level `x` becomes the number 20.
2. `myFunct(21,7)` creates a different `calc`, closing over `b = 7`. Since `21 < 20` is false, the `else` branch logs the value of `a`, which is 21, and returns the function without calling it. Thus `y` is a function.
3. `y(14)` calls the saved function with `i = 14` and its retained `b = 7`. It logs `14 + 7 = 21` and returns 21. The return value is discarded by this statement; it is not a second explicit log.
4. `y(9,33)` calls that same function with `i = 9`. It logs `9 + 7 = 16` and returns 16. The extra argument 33 does not bind to `b`: the returned function has only the parameter `i`, and its body does not read the extra argument. Its lexical `b` remains 7.

The outer function's parameter `x` is unused and is undefined in both given calls because only two arguments are supplied. It is distinct from the top-level `let x`. No code reads either binding before its initialization, so the top-level declaration causes no temporal-dead-zone error here.

## Verification

`tests_3.cjs` passed 11 tests, including actual browser execution. It verifies all shown results, callback counts, independent closures, zero-step behavior, partial application, exact snippet output and return types, all four cart buttons, emptying, lexical receiver preservation, method replacement, event forwarding, and a failing ordinary-function counterexample. The tests exercise both Node and browser execution of the examples. The detailed German walkthrough is in `../erklaerung_3.md` and the combined `../erklaerung_blatt04.md`.
