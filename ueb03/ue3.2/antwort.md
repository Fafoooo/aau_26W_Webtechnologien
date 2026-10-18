# Exercise 2 — Making an HTML Page Editable

Open `editable.html` in a browser and select a section. The heading field and source textarea are populated from that section. Edit either field and press **Update section**. Changes affect the current browser DOM only, not files on disk, and disappear on reload.

## Implementation

- The provided HTML is preserved byte for byte except for one added `<script src="editable.js" defer></script>` reference before `</head>`. Original CRLF line endings, styles, language attribute, text and links are preserved. `pic1.jpg`, `pic2.jpg` and `pic3.jpg` are unchanged copies.
- JavaScript generates the entire labelled form directly after the last section. The initial “Choose a section” placeholder does not select a section, and Submit is disabled.
- Selecting any section fills the text input with its direct-child `h1` text and the textarea with its **full `innerHTML`**, including that heading, images and other markup. Submit becomes enabled.
- Submitting first replaces that section's HTML, then sets its direct-child `h1` to the text input's value. Thus the separate input wins over a conflicting heading in the textarea. If no direct-child `h1` remains, a new one is prepended. An empty heading is permitted because the assignment specifies no required heading value.
- All option labels are refreshed after an edit while retaining the selected section. The textarea is also refreshed to reflect the final normalized HTML. Selecting the placeholder again clears both fields and disables Submit.
- The section list refers to the original sections of the given document, not new nested sections typed into their source. Navigation list entries and the page header are not rewritten: the assignment requires updating the select box, not the navigation.

## Trust boundary

This is deliberately a **local editor for trusted HTML**, not a sanitizer or a safe renderer for untrusted input. `innerHTML` interprets markup; event handlers, iframes, URLs and other active content can have effects in the document. Merely noting that scripts inserted through `innerHTML` do not normally execute would not make it safe. Only use HTML you trust. Heading text uses `textContent`, so it is treated as text, not markup. Do not deploy this implementation as an untrusted multi-user HTML editor.

## Verification and known original dependencies

`../tests_1_2.cjs` passed **18 tests** across both exercises in Chromium **148.0.7778.96**. Tests verify the exact protected HTML bytes, all three image files, actual local image decoding, every section, exact source loading, conflicting/removed/empty headings, repeated edits, refreshed options and prevented navigation. A harmless click-handler test confirms that HTML is intentionally **not** sanitized.

The original external Wikimedia CSS logo is intentionally blocked in the offline tests; its network availability is not verified. The supplied `erat.html` link has no supplied target file; it is preserved unchanged, not fabricated. Neither dependency prevents editing. No changes were made to the original layout or its missing stylesheet exercise.

## AI disclosure

This implementation, documentation and test harness were generated with AI assistance (Hermes Agent using OpenAI's `gpt-6.1-sol`) and exercised with Node/Playwright/Chromium. No personal work or understanding by Fabio is claimed here. See the separate assignment-level AI report and the detailed German walkthrough in `../erklaerung_1_2.md`.
