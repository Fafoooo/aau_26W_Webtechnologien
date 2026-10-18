# Exercise 3 – DOM Operations

## 1. Sketch

Open `dom-skizze.svg` for the full sketch of the **original** `ex3.html`, or read `dom-baum.txt`. Indentation marks parent/child relationships; every text node is shown, including whitespace as `\n`. Attributes are shown on their elements but are not child nodes. The document has a document-type node and an `html` element; `html` contains `head` and `body`. The body contains three anchor elements and the text between them. The second anchor contains a `p`, a text node, an `img`, and another text node.

The solution page adds a deferred `dom.js` script in the head. The sketch deliberately describes the provided document, before that addition and before removing the third link's `target`.

## 2. Console output, line by line

`getElementsByTagName("a")[1]` selects the **second** anchor because indices start at zero. The following results were observed in headless Chromium 148.0.7778.96. `browser-ergebnis.json` contains all actual console messages and serialised DOM values. Node objects appear as expandable elements in DevTools; the test transport describes them as `JSHandle@node`.

1. `link.attributes["href"].nodeValue` → `https://de.wikipedia.org`. The named `href` attribute node stores the written attribute value, without a trailing slash.
2. `link.getAttributeNode("href").nodeValue` → `https://de.wikipedia.org`. It retrieves the same attribute node by another API.
3. `link.href` → `https://de.wikipedia.org/`. The anchor property resolves and serialises the URL; a root path is serialised with `/`.
4. `link.firstChild` → the element `<p>Text</p>`. In the supplied source, `<p>` immediately follows the opening `<a>`: there is no intervening whitespace text node.
5. `link.attributes[0].nodeType` → `2`, the node type `ATTRIBUTE_NODE`. Here the first attribute is `href`.
6. `link.firstChild.nodeType` → `1`, the node type `ELEMENT_NODE`, because the first child is the paragraph element, not its text.
7. `link.parentNode.nodeName` → `BODY`. The second anchor is directly inside the body.
8. `link.lastChild.parentNode.nodeName` → `A`. The last child is the text node containing the final newline and `After`; its parent is the anchor itself.
9. `link.attributes.length` → `2`, counting `href` and `target`.
10. `link.innerHTML` → all the markup **inside** the second anchor:

```html
<p>Text</p>
    Before <img src="https://cdn3.iconfinder.com/data/icons/flags-37/300/austria-national-world-512.png" alt="Austrian Flag">
    After
```

11. `link.outerHTML` → the same markup wrapped in the anchor itself:

```html
<a href="https://de.wikipedia.org" target="_new"><p>Text</p>
    Before <img src="https://cdn3.iconfinder.com/data/icons/flags-37/300/austria-national-world-512.png" alt="Austrian Flag">
    After
</a>
```

12. `link.innerText` → rendered text. In the tested layout the exact JSON-escaped string is `"Text\n\nBefore  After "`. Layout collapses source whitespace and the block paragraph introduces line breaks. The `img` attribute text is not a text child. Whitespace details can depend on rendering and external image availability.
13. `link.outerText` → the same `"Text\n\nBefore  After "` when **read**. The difference matters on assignment: setting `innerText` replaces the contents; setting `outerText` replaces the element itself.
14. `link.textContent` → `"Text\n    Before \n    After\n"`. It concatenates descendant text nodes in source order, preserving their whitespace, without inspecting layout. The image has no text children, so its `alt` is not included.
15. `link` → the second anchor **object**, shown as an expandable `<a href="https://de.wikipedia.org" target="_new">…</a>` element in browser DevTools; this is not a plain string. `outerHTML` in the recorded values is only a stable serialisation for comparison.
16. `link.nodeValue` → `null`. Element nodes do not have a node value; their content is accessed through children or `textContent`, unlike an attribute node or text node.

## 3. Removing `target`

`document.getElementsByTagName("a").item(2)` selects the **third** link, the Japanese Wikipedia link. `removeAttribute("target")` removes its `_new` browsing-context target. Its destination and child image remain unchanged. With no `base target` in this document, a normal click now navigates in the current browsing context instead of the named `_new` context. The first and second anchors keep `target="_new"`.

## Verification

`node ueb02/tests_3.cjs` executes the supplied 16 log calls, verifies node types, URL serialisation and the three target attributes, checks for JavaScript errors, and creates the complete DOM sketch from the original HTML. External image requests were blocked in the test so the DOM exercise does not depend on third-party hosts; the provided image URLs in the solution HTML were not changed. No navigation to Wikipedia was triggered.

AI-assisted solution using OpenAI `gpt-6.1-sol`, Hermes Agent and browser testing; see the sheet-wide AI report and German explanation.
