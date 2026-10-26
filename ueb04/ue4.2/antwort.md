# Exercise 2 — JavaScript objects and `this`

## Files and execution

- Open `productsB.html` to run the corrected constructor-based `shopB.js` for part (a). This HTML is byte-identical to the supplied file.
- Open `productsC.html` to run the prototype-based **`productsC.js`**, named exactly as requested in part (b). The new HTML is derived from `productsB.html`; only its script reference differs.
- Neither page uses a library. Only the separate Node/Playwright test harness has development dependencies.

## Original `shopB.js`, explained in detail

The line references are to the unchanged source in `Angabe/files/shopB.js`.

| Original lines | Explanation |
| --- | --- |
| 1–3 | Enable strict mode and create the product array in a global lexical binding. |
| 5–7 | `productList` retains a reference to the same array. `listProducts` is an ordinary method whose receiver is `productList` when called as `productList.listProducts()`. |
| 8–14 | Iterate over products with a normal `forEach` callback. For each product already in the cart, log the **next** product's title. The modulo expression wraps from the last product to the first. This callback has its own, missing receiver: the first `this.products` access in the true branch fails. |
| 19–22 | Clear cart rows and initialize a fresh numeric total. |
| 23–29 | For every positive quantity, create a row from `p.render()` and accumulate its quantity times unit price. Calling `p.render()` supplies `p` as its receiver. |
| 31–34 | Display the total with two decimal places, log the update and call `productList.listProducts()`. That outer method call is correct; its inner callback is not. |
| 36–41 | `new Product(el)` creates an instance and makes it `this` during construction. The constructor extracts id, title, description and price, then initializes the quantity. Title traversal is whitespace-sensitive; comma decimals are not fully parsed by `parseFloat`. |
| 43–46 | Assign an ordinary `updateProduct` function to each new instance. It expects its receiver to be a Product. It increments the receiver's quantity and updates the cart. |
| 48–51 | Assign an ordinary `render` function to each instance. It returns a string containing title, unit price and quantity; it does not yet display the line's total. |
| 53–55 | Register `this.updateProduct` as a callback on the `.buy` div. Looking up a function through an instance does **not** permanently bind that instance as its receiver. |
| 57–59 | Instantiate a Product for each of the four product divs and push it into the shared array. |
| Blank/comment lines | Separation only. No startup render, empty-cart listener or decrement method is implemented by the original. |

## 2(a)(a) — Why the cart does not work; both `this` problems

### Problem 1: the DOM event supplies a different receiver

At construction time, `this` is the newly created Product. But passing `this.updateProduct` passes a function value, not the expression “call this on the Product later”. For a normal function listener, the browser invokes it with `this` equal to the element on which the listener was registered: here the **`.buy` div**, not the input and not the Product.

The div initially has no `numInCart` property. `undefined + 1` yields `NaN`, so `this.numInCart += 1` creates a useless `NaN` property on that div. The actual product quantity stays zero; the cart remains empty. Strict mode does not make this event receiver undefined: the DOM explicitly supplies the receiver.

The corrected code registers:

```js
clickButton.addEventListener('click', this.updateProduct.bind(this));
```

`bind(this)` creates a bound callback whose receiver is the Product captured during construction. Alternatives would be a constructor-created arrow wrapper `e => this.updateProduct(e)` or an explicitly captured Product reference. Passing `this.updateProduct()` instead would call it immediately and register its return value, which is wrong.

### Problem 2: the nested `forEach` callback loses the list receiver

`productList.listProducts()` correctly makes the outer `this` refer to `productList`. The original inner `function (product, index) { ... }` is a separate normal function, however. `forEach` does not inherit the caller's `this`. Without a `thisArg`, the strict-mode callback sees `undefined`.

When any product has a positive quantity, the callback evaluates `this.products.length` and throws a `TypeError`. The first bug initially hides this second bug because all Product quantities remain zero. Fixing only the DOM listener would therefore still leave a broken application.

Both delivered versions use an **arrow callback** for `forEach`, so it inherits the outer method's `this`:

```js
this.products.forEach((product, index) => {
    if (product.numInCart > 0) {
        const nextProductIndex = (index + 1) % this.products.length;
        const nextProduct = this.products[nextProductIndex];
        console.log(`${nextProduct.title};`);
    }
});
```

An equivalent fix would be passing `this` as the second argument to `forEach`. The original next-product logging semantics are preserved, including last-to-first wraparound; the logger is not silently deleted or replaced with logging the current product.

The corrected versions also parse comma decimals, clear initial placeholder rows, implement the supplied empty-cart button and sum integer cents. These are additional consistency improvements, not substitutes for fixing both receiver bugs.

## 2(a)(b) — How many render functions for four instances?

The original constructor executes `this.render = function () { ... };` once for every `new Product(...)`. Four instances therefore receive **four distinct Function objects**, each stored as an own property:

```js
products[0].render === products[1].render // false in shopB.js
```

This is the observable allocation/sharing answer. The constructor does not define a static `Product.render()` method: the functions are instance properties. It is **not** valid to claim a guaranteed number of engine-internal machine-code or bytecode copies. An engine may share compiled code or optimize it; ECMAScript specifies distinct function identities, not a fixed compilation strategy or memory size.

With a prototype method, instances normally look up one shared Function object through `Product.prototype`, reducing per-instance method allocations. The requested first-item override in part (b) is an explicit exception for `render`.

## 2(b) — New prototype version: `productsC.js`

`Product` initializes only instance data and registers bound event callbacks. Its shared methods are defined on the prototype before instances are constructed:

- `Product.prototype.updateProduct(e)` increments a Product quantity and rerenders.
- `Product.prototype.removeOneFromCart(e)` decrements a positive quantity and rerenders; at zero it returns without changing state.
- `Product.prototype.getTotalPrice()` returns that item's quantity times its unit price, calculated in cents.
- `Product.prototype.render()` returns the title, formatted unit price, quantity and formatted **line total**.
- `Product.prototype.updateButtons()` disables its minus button exactly when its quantity is zero.

The global `updateCart` coordinator and the `productList.listProducts` list method are not per-Product methods. They remain in their appropriate locations. All reusable **Product methods** are on `Product.prototype`; the sole own-method override is the first item's `render`, as explicitly required below. Bound function objects used as DOM listeners are wrappers, not duplicate own Product methods.

### 2(b)(a) — Decrement button and `removeOneFromCart`

The constructor creates a `button` entirely through JavaScript and appends it to the product's `.buy` div. It has type `button`, the visible minus symbol `−`, and an accessible label identifying the product. The script uses the ASCII escape `\u2212` for the minus and `\u2014` for the cart separator: the supplied HTML specifies no character encoding, so literal UTF-8 punctuation in an external script could otherwise be decoded incorrectly. It starts disabled. After each cart update, `updateButtons()` synchronizes its disabled state with the quantity.

The existing add input is wired directly to `updateProduct.bind(this)`. The new minus button is wired to `removeOneFromCart.bind(this)`. Importantly, the add listener is **not** attached to their common `.buy` parent in this version. Otherwise a minus click would bubble into the add handler and increment again. The guard in `removeOneFromCart` also prevents underflow if a synthetic event or direct method call bypasses the disabled UI. Emptying the cart disables all four buttons again.

### 2(b)(b) — Total price per item

`getTotalPrice()` is a shared prototype method:

```js
Product.prototype.getTotalPrice = function () {
    return Math.round(this.price * 100) * this.numInCart / 100;
};
```

`render()` calls it and displays `Total: ...` on each row, in addition to the unit price and quantity. `updateCart()` also uses these line totals for the overall total. Integer-cent accumulation avoids common decimal summation artifacts; the output always has two decimal places. Tests include nonzero comma fractions and quantities greater than one, not just one unit of integer-priced products.

### 2(b)(c) — Override only the first item

After constructing all four Products:

```js
products[0].render = function () {
    return Product.prototype.render.call(this) + ' New Arrival!';
};
```

The code checks that a first product exists. This assignment creates an own `render` property on **only that instance**. It delegates the normal text to the prototype with the correct receiver and appends the requested exact postfix. It does not modify `Product.prototype.render`, so all other Products retain the shared renderer.

For this version, there are two render Function objects reachable through the instances: the shared prototype implementation and the first-instance override. The remaining three products share the prototype function; all four share the other prototype methods.

**Source discrepancy:** the PDF calls the first product “Sony A7V”, but the supplied HTML actually says **Sony Alpha IV**, with ID **`sonyAIV`**. The original title and identifier are preserved. The override applies to that first supplied item; no product is silently renamed or invented. Other supplied spellings such as “Nicon” and the differing Tamron description are preserved as well.

## Verification

Run the shared harness with `node ueb04/tests_1_2.cjs` from the repository root. It resolves Playwright normally, or through the optional `PLAYWRIGHT_MODULE` override; the browser executable can optionally be selected through `PLAYWRIGHT_CHROMIUM`/`CHROMIUM_EXECUTABLE`. No machine-specific installation paths are embedded in submitted files.

The final real-browser run passed **32 tests** across exercises 1 and 2 using Chromium **148.0.7778.96**. Tests reproduce both original receiver failures, assert correct function identities, exercise next-product logging and wraparound, verify every product's independent counts and exact totals, compare protected HTML bytes, verify comma decimals, inspect the one-instance postfix and prototype sharing, and exercise decrement/empty guards and enabled states. There were no uncaught JavaScript errors. External network requests were blocked.

The full German walkthrough of originals, delivered scripts, HTML fixtures and tests is in `../erklaerung_1_2.md`.
