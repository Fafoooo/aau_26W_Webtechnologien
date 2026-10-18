# Exercise 4 – Puzzle Game in JavaScript

Open `puzzle.html` in a browser. No server, build step or product dependency is required.

## Playing

1. Click an image in **Puzzle Pieces** to select it. A translucent preview follows the mouse with a 16-pixel offset; no mouse button must be held down.
2. Move the pointer onto a target and click. The **actual mouse position**, not the preview's position, determines the target.
3. The original image is removed from the source list and becomes the target's CSS background. If that target was occupied, its original image is returned to the source list.
4. Incorrect placements produce **Wrong placement** feedback. Correct but incomplete placements ask the player to continue. **You win!** appears only if every `div[data-result]` contains its matching image.
5. Click an occupied target while no piece is selected to pick its image up again. This makes incorrect complete boards recoverable even when the source list is empty. Press **Escape** to cancel a selection; clicking outside targets does not discard a piece. Selecting another source image switches the selection.

## Implementation

All four supplied JPEG files are copied unchanged. The supplied HTML differs only by the deferred reference to `puzzle.js`; all behaviour, feedback and additional styles are created with plain JavaScript.

The script queries **all `div[data-result]` elements**. It does not use `ul`, `ur`, `ll`, `lr`, `.puzzlePic`, grid coordinates or a fixed target count. The source list retains the supplied `puzzleSource` ID. `document.elementFromPoint(event.clientX, event.clientY)` and `closest('div[data-result]')` locate the clicked target, including clicks on child elements. The fixed-position preview uses the same viewport-coordinate system and `pointer-events: none`, so it cannot cover the target for hit-testing.

A `Map` records each target's actual image element. Replacement restores that element, rather than manufacturing a new image. Matching compares the image's absolute URL with `new URL(target.dataset.result, document.baseURI).href`; image paths are therefore not hard-coded. Duplicate filenames can still refer to distinct image elements. The win check uses every target, not merely an empty source list.

## Verification

Run from the repository root with a current Playwright installation and Chromium available:

```sh
node ueb03/tests_3_4.cjs
```

Optional environment overrides: `PLAYWRIGHT_MODULE` for an externally installed Playwright module and `PLAYWRIGHT_CHROMIUM` for a Chromium executable. Product folders do not contain test dependencies.

The combined Exercise 3/4 run passed **18 test groups** in real Chromium. Puzzle checks cover mouse-follow coordinates and offset, nonblocking preview, outside clicks, Escape, wrong placements, source removal, background assignment, exact original-element restoration on replacement, partial-board non-win, complete-board win, recovering placed pieces, and a fully occupied incorrect board. An independent fixture uses **five non-grid targets without target IDs or grid classes**, nested target content, different positions and sizes, and two distinct images sharing the same URL. Four correct cells are insufficient to win that five-target game. Loaded images are checked with `complete && naturalWidth > 0`.

## AI assistance and limits

AI-assisted implementation and tests: Hermes Agent, OpenAI `gpt-6.1-sol`. The per-file German explanation is `../erklaerung_3_4.md`. The page intentionally implements the lecture's click–move–click mouse interaction, not HTML5 drag and drop. It is not a complete keyboard/touch-accessible game. Targets and source images are expected to exist when the deferred script initializes. Only Chromium was tested. No commit, push or Moodle submission was performed.
