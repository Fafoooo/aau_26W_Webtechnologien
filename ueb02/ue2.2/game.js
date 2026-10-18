const MAX_ATTEMPTS = 3;
// The replay decision must change after each round, so it cannot be const.
let keepPlaying = true;

while (keepPlaying) {
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    playNumberGame(randomNumber);
    keepPlaying = confirm("Would you like to play again?");
}

alert("Thank you for playing!");

function playNumberGame(secretNumber) {
    const guesses = [];

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        const guess = getUserInput();
        guesses.push(guess);

        if (typeof guess !== "number") {
            alert(guess);
        } else if (guess === secretNumber) {
            alert(`Correct! You needed ${attempt} attempt(s).`);
            return true;
        } else {
            const direction = guess > secretNumber ? "high" : "low";
            alert(`Too ${direction}! Attempts made: ${attempt}.`);
            alert(`Previous guesses: ${guesses}`);
        }
    }

    alert(`No attempts left. The correct number was ${secretNumber}.`);
    return false;
}

function getUserInput() {
    try {
        const input = prompt("Enter a number between 1 and 10:");
        const guess = Number(input);

        if (Number.isNaN(guess) || guess < 1 || guess > 10) {
            throw new Error("Invalid input. Please enter a number between 1 and 10.");
        }

        return guess;
    } catch (error) {
        return error.message;
    }
}
