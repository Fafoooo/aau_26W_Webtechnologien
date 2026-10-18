# Exercise 3 – Image Gallery Part 2

Open `gallery.html` in a browser and click any thumbnail. No server, build step or product dependency is required.

## Controls

- **previous / next:** navigate the thumbnails, wrapping at either end.
- **play / pause:** start or stop an endless slideshow. The selected picture remains visible for the first full interval before advancing.
- **Seconds per picture:** defaults to **3**. Positive values from **0.001** to **2147483** seconds are accepted, including decimals. Changing a valid duration during playback clears the old interval and starts a fresh full interval. Blank, out-of-range and nonnumeric values stop playback and use native input validation; correct the value and press play again.
- **exit:** clear any running interval and close the full-window overlay.
- Clicking the overlay background or its large image preserves the old close behaviour and also clears the slideshow interval. Reopening always starts paused; the duration value is retained.

## Implementation

All files from Assignment 2 Exercise 6 were copied. `gallery.html`, `gallery.css` and all six image files remain byte-identical. The entire previous `gallery.js`, including its previous/next extension and original line endings, remains an exact byte prefix. Only a new self-contained slideshow block is appended. This block reuses the existing next button instead of maintaining a second navigation index.

The existing navigation tracks the thumbnail **DOM element**, not its image URL, so identical `data-large` URLs remain separate entries. The solution works with static documents following the lecture format: `.gallery img` with `data-large` and `alt`, and `#displayDIV` containing `.bigIMG` and `.desc`. No image names, captions or image count are hard-coded. Zero thumbnails do not start a timer; one thumbnail loops safely. New controls stop click propagation, so using them never triggers the original overlay-close listener.

`pause()` is the common cleanup path for play/pause, exit, overlay closing, thumbnail selection, duration restarts and leaving the page. Clearing the old timer before every start prevents duplicate intervals. The upper duration limit avoids the browser timer's signed 32-bit millisecond overflow.

## Verification

Run from the repository root with a current Playwright installation and Chromium available:

```sh
node ueb03/tests_3_4.cjs
```

For externally installed tools, set `PLAYWRIGHT_MODULE` to the installed Playwright module and `PLAYWRIGHT_CHROMIUM` to the Chromium executable. Neither dependency is bundled in the exercise folders. The test requires Playwright's `page.clock` API.

The combined Exercise 3/4 browser run passed **18 test groups** in Chromium: original-file preservation, correct selection, three-second timing boundaries, endless wrapping, pause, previous/next, shorter and longer live-duration changes, invalid durations, exit, old background/image closing, repeated reopening, timer counts, and independent galleries containing 0, 1, 2 and 5 thumbnails with repeated large-image URLs. Tests wait for `complete && naturalWidth > 0` when checking loaded images. Timing is driven deterministically using Playwright's browser clock, not long wall-clock sleeps.

## AI assistance and limits

AI-assisted implementation and tests: Hermes Agent, OpenAI `gpt-6.1-sol`. Detailed German explanations: `../erklaerung_3_4.md`. The older comment referring to Assignment 2's explanation is preserved as part of the original byte prefix; the current explanation covers that code too. The original `innerHTML` caption assignment is intentionally unchanged and should not be used with untrusted descriptions. This static exercise is not a security-hardened application. Only Chromium was tested. No commit, push or Moodle submission was performed.
