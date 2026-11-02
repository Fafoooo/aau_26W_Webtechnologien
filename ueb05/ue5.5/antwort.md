# Exercise 5 — Retrieving Products via the Fetch API

## Running the solution

From `ueb05/`, run `python3 -m http.server 8080 --bind 127.0.0.1` and open `http://127.0.0.1:8080/ue5.5/products.html`. The page and JSON must be served through HTTP, not opened directly from the file system. The relative `products.json` URL works with other ports and equivalent folder locations.

## Implementation and error handling

`async initialize(jsonURL, domElement)` performs `await fetch(jsonURL, { signal })`. Native Fetch resolves its Promise even for HTTP failures such as 404 or 500, so `response.ok` is explicitly checked before decoding the body. `await response.json()` waits for the body and parses JSON; both network and parsing failures reach the surrounding `catch`.

An `AbortController` aborts the request after ten seconds, covering both waiting for headers and reading the body. `finally` clears the timer on success and failure. The controller is local to each call, so one request does not abort another. An `AbortError` is rendered as `Request timed out.`; other errors retain their message. The function resolves to the loaded product array on success and `null` after a handled failure. The startup call therefore produces no unhandled Promise rejection for the tested operational failures.

The same complete-array validation and DOM renderer as in Exercise 4 are included locally. Only native browser APIs are used. Fields must have the expected types; prices must be finite and non-negative, and IDs must be unique and non-empty. Cards reuse `.product[data-prodid]`, `h2`, `.desc`, `.price`, `.buy` and the input from the previous assignment. A small per-card count makes `add to cart` testable; it is not a persisted order or an aggregate shopping-cart implementation. The count resets when the list is reloaded. The original JSON is byte-identical to the supplied file.

All remote text goes through `textContent`. Building a fragment and replacing children prevents partial/duplicated results. Failure replaces old cards with an accessible error, while an empty array produces a distinct non-error empty-state message. The HTML explicitly declares UTF-8 and loads the local stylesheet. Separate, matching helpers in the two folders keep both exercises independently runnable. There is no library import or build step.

Concurrent calls for the same container are outside this single-load example's interface guarantees: they are not serialized or versioned; the last one to finish determines the visible content. The timeout aborts the request rather than merely hiding a still-running operation. Fetch is a Promise-based API, but it still uses callbacks internally and in the timeout; Promises do not remove the concept of callbacks.

## Verification

`../test_4_5.cjs` uses a real local HTTP server, a headless Chromium page and the page's actual native Fetch implementation. It covers success, field/price fidelity, button isolation, custom arguments, reload, HTTP errors, malformed/invalid data, connection failure, timeout, literal-text safety and recovery. The timeout test leaves a real HTTP request outstanding and advances the browser clock, rather than replacing Fetch with an invented response. See the sheet-level report for the actual test totals and browser limitations.
