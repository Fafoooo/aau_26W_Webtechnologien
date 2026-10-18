# Exercise 4 – Calculating Glass Price

Open `glassOrder.html` locally in a browser. The HTML is an exact copy of the supplied file; all DOM changes are implemented in `calculate.js`.

- The paragraph repeating the heading is removed.
- A text input named `price`, with `readOnly = true` and the associated label `price`, is appended to the Glass Specification fieldset below its existing Price legend.
- `calculate(width, height, thickness)` takes dimensions in **cm**. It reads the selected colour from the form. In `#rrggbb`, equal red, green and blue channels identify a shade of grey (including black and white). The price is `width * height * thickness / 50` for grey, otherwise `/ 32`.
- `update()` converts the selected thickness from **mm to cm** by dividing by 10. The calculated result is displayed with two decimal places; `calculate()` itself returns the unrounded number.
- `form.checkValidity()` checks the existing HTML constraints. An invalid form displays `-`. The original `min="0"` permits zero dimensions; no different minimum is invented.
- “All required inputs” is interpreted literally: required contact fields count as well as the glass dimensions and the required thickness radio group. Checking only the geometry would ignore the explicitly required contact fields in the supplied HTML. This implementation also rejects invalid values entered in optional fields, e.g. letters in the telephone field. Leaving that optional field empty is valid.
- Bubbling `input` and `change` events on the form trigger `update()` for all relevant fields, including contact fields. An initial call sets the empty form's price to `-`.

## Verification

Run from the repository root:

```sh
node ueb02/tests_4_6.cjs
```

The combined Exercise 4/6 test run passed **28 test groups** in a real Chromium browser using local `file://` pages. Tests include all 256 grey channel values, coloured glass, all four thickness choices, missing/invalid fields, range and step constraints, contact validity, event updates and byte-identical HTML.

## AI assistance

Implemented and tested with Hermes Agent using OpenAI model `gpt-6.1-sol`. Detailed German explanations, test limitations and the actual workflow are in `../erklaerung_4_6.md`. This note does not replace the course-wide mandatory AI report or the student's own review.
