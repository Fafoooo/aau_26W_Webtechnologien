# Exercise 4 — Retrieving Products via XMLHttpRequest

## Running the solution

From the `ueb05/` folder, run `python3 -m http.server 8080 --bind 127.0.0.1` and open `http://127.0.0.1:8080/ue5.4/products.html`. Do not open this exercise through `file:`. `products.json` is a relative URL resolved against the HTML document, so the application is not tied to a particular port or folder name.

## Implementation

`initialize(jsonURL, domElement)` uses a native **XMLHttpRequest** with an asynchronous GET. The `load` handler first checks the HTTP status; HTTP errors such as 404 are not network `error` events. It parses `responseText` with `JSON.parse`, validates the complete product array and renders each product inside the passed DOM element. The implementation also handles network failures, an explicit abort, a ten-second timeout, malformed JSON, unexpected data and synchronous request setup failures. It displays a textual error instead of leaving a stale product list.

The function returns a native Promise that resolves to the loaded product array or `null` after a handled failure. This return value makes completion observable; **the HTTP request itself still uses XMLHttpRequest, not Fetch**. The page's startup call can safely ignore the returned Promise because operational errors are handled internally.

Product cards reuse the previous assignment's structure: `.product[data-prodid]`, `h2`, `.desc`, `.price` and `.buy` with an `add to cart` input. Prices have two decimal places and a decimal comma, as in the supplied previous markup. The new small `.quantity` output gives each button observable local behavior; no order is transmitted or persisted. An aggregate shopping cart was not requested by this exercise. The original product IDs, descriptions, titles and numeric prices are preserved, including the source's spelling. The HTML has been supplied with a UTF-8 declaration, viewport, stylesheet and live region; unlike Exercise 2, this exercise imposes no prohibition on these changes.

`validateProducts` rejects non-array documents, missing or invalid fields, duplicate IDs, non-finite prices and negative prices. All validation is completed before rendering. An empty array is valid and shows `No products available.`. `renderProducts` builds a document fragment and replaces the container's contents once, avoiding duplicate cards after a second load. Product strings are assigned using `textContent`, not interpreted as HTML; an HTML-looking product title remains literal text.

The controls count additions locally per rendered card. Reloading the product list creates new cards and resets these illustrative counters. `initialize` is designed for the single startup request used here; simultaneous calls targeting the same element are not coordinated, so the last request to finish determines its contents.

## Verification

`../test_4_5.cjs` serves the actual files through a loopback HTTP server and opens them in Chromium. It tests original JSON byte identity, all fields and prices, independently working buttons, custom target elements/URLs, reloads, 404/500, invalid JSON, a wrong top-level structure, invalid products, duplicate IDs, empty 204 bodies, connection failures, empty arrays, HTML-looking strings, a real outstanding HTTP request timing out, malformed URLs and recovery. See the sheet-level verification report for the actual results. The test framework is a development tool only, not an application dependency.
