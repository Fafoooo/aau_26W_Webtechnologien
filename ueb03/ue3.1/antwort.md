# Exercise 1 — Number-Guessing Game II

Open `index.html` in a browser. The page uses only plain JavaScript and CSS; no server or library is needed.

## Behaviour

- Initially the heading and welcome paragraph are visible. Among the buttons, only the blue **Start Game** button is visible; the fieldset and disabled green **Check** button are hidden.
- Start generates a fresh integer from 1 through 10, shows the fieldset and Check, and creates a red **Exit Game** button and exactly two feedback/history divs between the fieldset and the buttons.
- The input is required and accepts only integer values from 1 through 10. Invalid or empty values disable Check and do not consume attempts. The handler also validates directly, so a dispatched click cannot bypass these rules.
- A correct guess ends the game with congratulations. An incorrect guess gives a high/low hint and appends that guess to the visible history. At the third incorrect guess, the game ends and reveals the answer. Input events cannot reactivate Check after the game ends.
- Exit removes both temporary divs and the Exit button, clears all state, and returns to the welcome screen. A new start generates a new random number.

## Interpretation of ambiguous requirements

1. The sheet asks for Check to be enabled immediately on starting, but also only for a valid input. Starting therefore prefills **1**, a valid initial guess. Clearing or changing it to an invalid value immediately disables Check. The prefill is not itself an attempt.
2. “Only the starting game button … is visible” is interpreted as referring to the game controls, not the heading and welcome paragraph: the next page explicitly says to hide the welcome message on Start.
3. “Maximum of 3 attempts” takes precedence over “exceeds 3 attempts”: the third wrong guess ends the round, with **no fourth attempt**. A correct third guess still wins.
4. As requested under the incorrect-guess branch, the history contains incorrect guesses; the winning guess appears in the congratulations message.

## Verification

`../tests_1_2.cjs` exercises both pages in a real Chromium browser. The verified run finished with **18 passing tests** in Chromium **148.0.7778.96**, including validity, exact CSS requirements, both random endpoints, loss/win on the third attempt, reset/restart and post-game click protection. See `../erklaerung_1_2.md` for setup, the run command and the detailed German walkthrough.

## AI disclosure

This implementation, documentation and test harness were generated with AI assistance (Hermes Agent using OpenAI's `gpt-6.1-sol`) and exercised with Node/Playwright/Chromium. No personal work or understanding by Fabio is claimed here. The assignment-level AI report is maintained separately; Fabio must review and understand the code before submission.
