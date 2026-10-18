// AI-assisted implementation; see ../erklaerung_1_2.md and the AI report.
'use strict';

(() => {
    const welcome = document.getElementById('welcome');
    const field = document.getElementById('game-field');
    const input = document.getElementById('guess');
    const check = document.getElementById('check');
    const start = document.getElementById('start');
    const buttons = document.getElementById('buttons');
    const maxAttempts = 3;
    let target = null;
    let attempts = 0;
    let playing = false;
    let previousGuesses = [];
    let feedback = null;
    let history = null;
    let exit = null;

    function validGuess() {
        const value = input.valueAsNumber;
        return input.checkValidity() && Number.isInteger(value) && value >= 1 && value <= 10;
    }

    function updateCheck() {
        check.disabled = !playing || !validGuess();
    }

    function resetGame() {
        playing = false;
        target = null;
        attempts = 0;
        previousGuesses = [];
        input.value = '';
        field.hidden = true;
        check.hidden = true;
        check.disabled = true;
        welcome.hidden = false;
        start.hidden = false;
        feedback.remove();
        history.remove();
        exit.remove();
        feedback = null;
        history = null;
        exit = null;
        start.focus();
    }

    function startGame() {
        if (playing || exit !== null) return;
        target = Math.floor(Math.random() * 10) + 1;
        attempts = 0;
        previousGuesses = [];
        playing = true;
        input.min = '1';
        input.max = '10';
        input.step = '1';
        input.required = true;
        input.value = '1';
        welcome.hidden = true;
        start.hidden = true;
        field.hidden = false;
        check.hidden = false;

        feedback = document.createElement('div');
        feedback.id = 'feedback';
        feedback.setAttribute('role', 'status');
        history = document.createElement('div');
        history.id = 'previous-guesses';
        history.setAttribute('aria-live', 'polite');
        field.after(feedback, history);
        feedback.textContent = 'You have three attempts.';
        history.textContent = 'Previous guesses: none.';

        exit = document.createElement('button');
        exit.id = 'exit';
        exit.type = 'button';
        exit.textContent = 'Exit Game';
        exit.addEventListener('click', resetGame);
        buttons.append(exit);
        updateCheck();
        input.focus();
    }

    function checkGuess() {
        if (!playing || !validGuess()) return;
        const guess = input.valueAsNumber;
        attempts += 1;
        if (guess === target) {
            feedback.textContent = `Congratulations! You guessed ${target} in ${attempts} attempt(s).`;
            playing = false;
        } else {
            previousGuesses.push(guess);
            history.textContent = `Previous guesses: ${previousGuesses.join(', ')}.`;
            const hint = guess > target ? 'Too high!' : 'Too low!';
            if (attempts >= maxAttempts) {
                feedback.textContent = `${hint} Game over. The correct number was ${target}.`;
                playing = false;
            } else {
                feedback.textContent = `${hint} Attempts left: ${maxAttempts - attempts}.`;
            }
        }
        updateCheck();
    }

    start.addEventListener('click', startGame);
    input.addEventListener('input', updateCheck);
    check.addEventListener('click', checkGuess);
})();
