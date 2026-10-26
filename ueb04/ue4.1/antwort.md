# Exercise 1 — Working with closures

## Files and execution

- Open `productsA.html` for the **standard anonymous function** solution (`shopA.js`). This HTML is a byte-for-byte copy of the supplied file, including its CRLF line endings.
- Open the separate fixture `arrow.html` for the **arrow function** solution (`shopA-arrow.js`). This fixture differs from the supplied HTML only in its script reference. It does not replace or modify `productsA.html`.
- Each page loads exactly one script. The two alternative add-to-cart listeners are never registered together.
- The product uses only browser JavaScript and the supplied inline CSS. Playwright is a development-only test dependency.

## Original `shopA.js`, explained in detail

The line numbers below refer to the supplied, unchanged source in `Angabe/files/shopA.js`.

| Original lines | Explanation |
| --- | --- |
| 1 | Strict mode changes error handling and scoping rules, including block-level function declarations. |
| 3 | `products` is an array referenced by a top-level lexical `let` binding. In a classic script this is global lexical state, not a `window.products` property. |
| 5–8 | `updateCart` finds the order list, removes the old rows and initializes a new total for each rendering. |
| 9–10 | Iterate through the product objects; only quantities greater than zero produce a cart row. |
| 11–13 | Create an `li`, create a text node containing title, unit price and quantity, and append that row. Using a text node does not interpret a title as HTML. |
| 14–18 | Accumulate quantity times unit price, then display two decimal places. `toFixed(2)` produces a string. The original does not call this function on startup. |
| 20–21 | Iterate through product divs and create a fresh `cp` object and lexical binding in each execution of the loop body. |
| 23 | Read `data-prodId` through `dataset.prodid`; HTML normalizes the attribute name to lowercase. |
| 24 | Obtain the title by traversing text and element nodes. It works for the supplied whitespace but is fragile: `firstChild` can be a whitespace text node. |
| 25–26 | Read the description and parse the price. `parseFloat('2890,00')` returns `2890`, not a general comma-decimal parse. It only happens to work for these integer prices. |
| 27–29 | Initialize the quantity, retain the DOM node and push the same object reference into the array. |
| 31–35 | Create `addListener`, a closure over this iteration's `cp`. Log the event, increment that product and render the entire cart. |
| 38–40 | Select the `.buy` div, not the input itself, and register the function reference. A click on the input bubbles to this div. The function is not invoked at registration time. |
| Empty/comment lines | Visual separation and comments; no additional runtime operation. The original never implements emptying or sorting. |

## 1(a)(a) — Why can `addListener` access the current product?

A function retains access to the lexical environment in which it was created: this is a **closure**. Each loop body execution creates its own `let cp` binding and its own object. The event system retains the callback after the iteration has finished, and the callback retains access to that iteration's binding. The array and that callback reference the same object, so changing `cp.numInCart` is visible to `updateCart()`.

This is not a snapshot of the object's values. A closure retains access to a **binding** and the referenced object, which can subsequently change. The event parameter `e` is supplied by the browser; `cp` is resolved lexically, not passed by the browser.

## 1(a)(b) — Replacing only `let cp = {};` with `var cp = {};`

`var` is function-scoped or, here outside a function in a classic script, global-scoped. It is not scoped to the loop body. Repeated `var cp` declarations refer to one shared binding. Each iteration assigns a newly created object to that one binding. After initialization, it refers to the **last product object**, Tamron 17-24mm.

All callbacks then resolve `cp` through the same shared binding and increment the last product, no matter which input is clicked. The array still contains four different objects; they are not all the same object. The first three simply stop being the object referred to by `cp`. `pdiv` remains declared with `let` and is not the cause of this failure. This is also not the usual out-of-range numeric loop-counter example: the final value is a product object, not an index past the array.

### Scope rules relevant here

- **Global scope:** top-level declarations in a classic script. Top-level `let`/`const` have a global lexical binding, not a `window` property; top-level `var` normally creates a property of the global object. Modules have different top-level scope and are not used here.
- **Function scope:** parameters and local `var` declarations belong to the function invocation; a nested block does not create a separate `var` binding.
- **Block scope:** `let` and `const` belong to their enclosing block. `const` prevents rebinding, not mutation of an object. These declarations have a temporal dead zone before initialization. A strict-mode function declaration inside this loop block is block-scoped as well.
- **Lexical lookup:** search the function's own environment, then its enclosing environments. Callback execution time does not change where a function was defined.
- **`this` is different:** an ordinary function's `this` follows its call form, not lexical variable lookup. An arrow inherits lexical `this`. Exercise 1's callback does not use `this` at all.

## 1(b)(a) — Standard anonymous callback

The executable solution in `shopA.js` directly contains:

```js
clickButton.addEventListener('click', function (e) {
    console.log(e);
    cp.numInCart += 1;
    updateCart();
});
```

The anonymous function closes over the same per-iteration `cp`. As an ordinary DOM event callback its `this` would be the listener's `.buy` div, but that receiver is intentionally unused. `e.target` is typically the input; `e.currentTarget` is the listener's div during dispatch.

## 1(b)(b) — Arrow callback

The independently runnable `shopA-arrow.js` instead contains:

```js
clickButton.addEventListener('click', (e) => {
    console.log(e);
    cp.numInCart += 1;
    updateCart();
});
```

Both callbacks receive the event argument and close over `cp`. An arrow does not establish its own `this` or `arguments`, but this difference does not affect the result here. The alternative script differs only at this callback declaration; it is not an extra listener added on top of the first one.

## 1(c) — Empty Shopping Cart

The existing element has the ID `emptyCard` (the spelling from the supplied HTML is preserved). Its listener sets **every** product's `numInCart` to zero and calls `updateCart()`. Removing the visible rows alone would be incorrect because the old quantities would reappear on the next update. Emptying repeatedly is harmless; adding afterwards starts at quantity one.

## 1(d) — Ascending numeric price order, JavaScript only

Prices are parsed with `Number(text.trim().replace(',', '.'))`, so the supplied comma decimals, including nonzero fractions, are handled. The solution sorts the product objects with `(a, b) => a.price - b.price`, then moves their existing `domElement` nodes before the order section with `insertBefore`.

The resulting order for the supplied data is:

1. Tamron 17-24mm — 800.00
2. Nicon DX 16-600 — 900.00
3. Sony 24-105mm lens — 1300.00
4. Sony Alpha IV — 2890.00

Moving a node preserves its identity and listeners; copying HTML would not. Merely sorting the JavaScript array would not reorder the page. The order section remains after all products. Nothing is edited in the protected HTML.

The final renderer uses safe `textContent`, robust `querySelector('h2')` title extraction, initializes the empty cart on startup and sums integer cents before formatting. Price parsing deliberately targets the provided ungrouped comma-decimal format, not every international thousands-separator convention.

## Verification

The shared `tests_1_2.cjs` runs real Chromium with Playwright. Both alternative pages are exercised separately. Tests verify protected HTML byte identity, original `let` behavior, the exact `var cp` counterexample, per-product quantities, totals, repeat emptying, preserved listeners, numeric DOM sorting and comma-decimal prices. The final full run passed **32 tests** across exercises 1 and 2 with Chromium **148.0.7778.96**, with no uncaught JavaScript errors and external network requests blocked.

For the detailed German walkthrough of the originals, all delivered files and the harness, see `../erklaerung_1_2.md`.
