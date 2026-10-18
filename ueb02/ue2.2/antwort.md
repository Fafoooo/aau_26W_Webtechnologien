# Exercise 2 – Number-Guessing Game I

Open `index.html` in a browser. Interaction uses `prompt`, `alert` and `confirm`; the body is empty and `game.js` is loaded externally with `defer` in the head.

- `MAX_ATTEMPTS` is `const` and equals 3. `keepPlaying` is `let`: the instruction's request for a constant replay decision conflicts with updating that decision after each game. A `const` binding cannot be reassigned, so only the attempt limit is constant.
- Each round generates a new integer in [1, 10] using `Math.floor(Math.random() * 10) + 1` and calls `playNumberGame(randomNumber)`.
- Every attempt consumes one of the three attempts, including invalid input. The `guesses` array stores every returned value, including error messages.
- A correct guess reports the number of attempts and returns `true`. An incorrect numeric guess reports the direction, attempts made and guess history. Exhausting the attempts reveals the secret and returns `false`.
- `getUserInput()` converts the prompt result with `Number()`. Within `try...catch`, NaN or a value outside [1, 10] causes an `Error` with exactly `Invalid input. Please enter a number between 1 and 10.` The catch block returns the message.
- Cancel, empty input and whitespace convert to 0, so they are invalid attempts, not an exit command. Fractions within [1, 10] are valid inputs under the stated range rule; only the generated secret must be an integer. No extra integer-only check is added.
- Each completed round asks whether to play again. Declining produces one final thank-you message.

## Verification

Run `node ueb02/tests_2_5.cjs` from the repository root. The shared exercise 2/5 suite passed all 36 tests, including Node VM tests and real Chromium 148.0.7778.96 runs through `file://` with native dialogs and deterministic random values. Coverage includes random endpoints, first/third-attempt wins, loss, replay, high/low hints, complete histories, invalid input, cancel, empty/whitespace input and fractions. The product uses no libraries; Playwright is used only by the test harness.
