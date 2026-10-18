# Exercise 6 – Image Gallery

Open `gallery.html` locally in a browser. The original HTML, CSS and all six image files are copied byte for byte. The entire original `gallery.js` is retained as an exact byte prefix; the solution is appended after it.

## Original structure and behaviour

- `.gallery` contains the thumbnail images. Each thumbnail's `src` addresses the small image, `data-large` supplies the full-size image path, and `alt` supplies the description.
- `#displayDIV` is the initially hidden full-window overlay. It contains `.bigIMG`, the full-size image, and `.desc`, the caption.
- `showImg(e)` copies `e.target.dataset.large` to the large image's `src`, writes `e.target.alt` into the caption using `innerHTML`, and sets the overlay's display to `block`.
- The original loop attaches `showImg` to every `.gallery img` existing at script initialization.
- `hideImg(e)` hides `e.currentTarget`. It is registered on the overlay, so clicks bubbling to that element close it.

## Appended extension

- Two real buttons labelled `previous` and `next` are created dynamically inside `#displayDIV`. They are positioned near the bottom using JavaScript-assigned styles; the CSS file remains unchanged.
- An additional thumbnail listener remembers the actual selected DOM element, not a fixed index or an image URL. It also updates the large image's alternative text and the caption as plain text.
- Navigation queries the thumbnail list, finds the current element and calculates `(index + direction + count) % count`, where `direction` is `-1` or `1`. This wraps from the first image to the last and from the last to the first.
- No filenames, captions or image count are hard-coded. Repeated large-image URLs do not confuse the selection. With one image, both controls keep showing that image; an empty gallery is handled without an exception.
- Each button calls `event.stopPropagation()` so its click does not reach the original overlay listener and trigger `hideImg`. Clicking the overlay background still closes it. `type="button"` avoids accidental form submission if used in a form.
- The expected HTML format retains `.gallery img`, `data-large`, `alt`, `#displayDIV`, `.bigIMG` and `.desc`. As in the original, thumbnails are wired when the script initializes; inserting new thumbnails afterwards is outside the task's static-document contract.

## Verification

```sh
node ueb02/tests_4_6.cjs
```

The combined Exercise 4/6 run passed **28 test groups** in real Chromium, without a server. Gallery tests cover the supplied three images and independent documents containing 0, 1, 2 and 5 images, different wrappers/captions, repeated image URLs, wrap-around, reopening on a different thumbnail, unchanged close behaviour, visible buttons and exact original-file preservation.

## AI assistance and limitations

Implemented and tested with Hermes Agent using OpenAI model `gpt-6.1-sol`; see `../erklaerung_4_6.md` for the German line-block explanations. The original thumbnail handler's `innerHTML` assignment is intentionally preserved and is not suitable for untrusted descriptions without further hardening. The added plain-text assignments do not remove the original assignment. Only Chromium was tested. No commit, push or Moodle submission was performed.
