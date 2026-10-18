# Exercise 5 – Event Listeners and Target

## 1. Predicted output of the original code

Clicking the button runs its listener first. The click then bubbles to `#outerArea`, whose listener also runs:

```text
inner:
target: [object HTMLButtonElement]
currentTarget: [object HTMLButtonElement]
this: [object HTMLButtonElement]
outer:
target: [object HTMLButtonElement]
currentTarget: [object HTMLDivElement]
this: [object HTMLDivElement]
```

The code concatenates each DOM object with a string. Therefore the console receives these strings, not expandable DOM object entries.

## 2. Actual execution and comparison

The original page `../Angabe/files/ex5/ex5.html` was opened in real headless Chromium 148.0.7778.96 through a `file://` URL and its button was clicked with Playwright. Its eight console lines matched the prediction above exactly. The test also checked actual element identities and event phases: the button listener ran at the target (phase 2), followed by the outer listener during bubbling (phase 3).

## 3. `target`, `currentTarget` and `this`

- `event.target` is the element on which the event originated. For this button click, it remains the button in both listeners.
- `event.currentTarget` is the element whose listener is currently being invoked: first the button, then the surrounding div.
- In these regular functions registered with `addEventListener`, `this` equals `event.currentTarget`: the button in the inner listener and the div in the outer listener. This does not apply to an arrow function, whose `this` comes from its enclosing scope.

## 4. Appended code and modified output

Only the following listener was appended to `ex5.js`:

```js
document.querySelector('#button').addEventListener('click', function (event) {
    event.stopPropagation();
});
```

The original logging listener runs first because it was registered first on the same button. The appended listener then stops propagation to the surrounding div. `stopPropagation()` does not suppress other listeners on the same element; `stopImmediatePropagation()` is not needed. No default browser action needs to be cancelled.

The modified page was also clicked in Chromium. Only these four lines were printed:

```text
inner:
target: [object HTMLButtonElement]
currentTarget: [object HTMLButtonElement]
this: [object HTMLButtonElement]
```

Clicking the div's padding directly still prints its four `outer` lines, with `target`, `currentTarget` and `this` all referring to the div. The original outer listener has not been removed or changed.

## Verification

`node ueb02/tests_2_5.cjs` passed all 36 shared exercise 2/5 tests. Byte comparisons confirmed that `ex5.html` is identical to the provided HTML and the provided `ex5.js` is an exact byte prefix of the extended JS. The suite runs both original and modified pages; it checks their exact console output and the actual element identities. No libraries were added to the product.
