# Assignment 5 — Asynchronous JavaScript

Lösungen zu allen fünf Aufgaben. Die Benutzeroberflächen und `antwort.md` folgen dem englischen Original; die ausführliche Lernerklärung ist Deutsch. Es wurde nichts in Moodle abgegeben. Die Lösung ist KI-generiert; die eigene Prüfung/Erklärung durch Fabio bleibt vor einer Abgabe erforderlich und ist nicht als erfolgt behauptet.

## Einstieg

- [Original assignment](angabe_blatt05.pdf), [original templates](Angabe/files/)
- [Exercise 1: callbacks, answers a–d](ue5.1/antwort.md), page `ue5.1/ex1.html`
- [Exercise 2: Promises, answers a–c](ue5.2/antwort.md), main page `ue5.2/ex2.html`
- Exercise 2(c): separate `ue5.2/experiment-c/ex1.html` and `ex2.html`; click Start → Cancel → End.
- [Exercise 3: ordering, chaining and async/await](ue5.3/antwort.md)
  - part (a): `Angabe/files/ex3.html` (intentionally unhandled original rejections)
  - part (b): `ue5.3/ex3.html`
  - part (c): `ue5.3/async/ex3.html`
- [Exercise 4: XMLHttpRequest](ue5.4/antwort.md), page `ue5.4/products.html`
- [Exercise 5: Fetch](ue5.5/antwort.md), page `ue5.5/products.html`
- [German step-by-step explanation of all files](erklaerung_blatt05.md)
- [AI report PDF](ki-bericht_blatt05.pdf), [LaTeX source](ki-bericht_blatt05.tex)
- [Final verification report](pruefbericht_abschluss.md), [machine-readable result](testergebnis.json)

## Start the applications

From this `ueb05/` directory:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Open the relevant page, for example:

- `http://127.0.0.1:8080/ue5.1/ex1.html`
- `http://127.0.0.1:8080/ue5.2/ex2.html`
- `http://127.0.0.1:8080/ue5.3/ex3.html`
- `http://127.0.0.1:8080/ue5.3/async/ex3.html`
- `http://127.0.0.1:8080/ue5.4/products.html`
- `http://127.0.0.1:8080/ue5.5/products.html`

Stop the server with Ctrl+C. Exercises 1–3 can also be opened as local files; Exercises 4/5 must use HTTP. GitHub's source viewer does not execute the applications. Use a local clone/download and server. Product code uses only native browser APIs; no build or package installation is needed to use it.

## Reproduce the automated verification

Only the development tests need Node.js and Playwright. Install these outside the submitted product directories:

```sh
npm install --prefix /path/to/dev-tools playwright
/path/to/dev-tools/node_modules/.bin/playwright install chromium
PLAYWRIGHT_MODULE=/path/to/dev-tools/node_modules/playwright node pruefen.cjs
```

`/path/to/dev-tools` is a placeholder, not a private installation path. With normally resolvable Playwright, use `node pruefen.cjs`. Optionally set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to a Chromium executable. The runner syntax-checks all JS, executes both browser suites and writes `testergebnis.json` only on success. `test_4_5.cjs` starts/stops its own loopback HTTP server; it does not need the manual server above. Tests include deliberately invalid server responses; these are labeled test fixtures, not production data.

## Original-code boundaries

- Exercise 1 main JS/HTML: original bytes preserved.
- Exercise 2 main JS: only `runTaskPromise` changed; original HTML preserved. The cancellation experiment is kept separate so it does not violate the main solution's restriction.
- Exercise 3: `delayedCalc` and `handleError` unchanged in both variants; only invocation code changes. The expected rejection at the large summand stops the chain before the last `+1`.
- Exercises 4/5: separate complete implementations with byte-identical product JSON, relative URLs and native APIs. The HTML/CSS are made explicit and accessible; the product-card structure matches the previous assignment. Local add counters are illustrative, not a persisted shopping cart.

## Recommended project preparations

Asynchronous programming would be needed when retrieving a product list, searching/filtering through a server endpoint, checking authentication, loading saved cart data or placing an order. These operations should keep the UI responsive and provide loading, success, empty and error states. Independent reads may run concurrently; dependent operations must wait for the previous result. Fetch/Promises and `async`/`await` can express these dependencies, while event listeners remain callbacks. This is a general design reflection, not a claim that these features have already been chosen or implemented in a particular project.
