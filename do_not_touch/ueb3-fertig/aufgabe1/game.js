const MAX_ATTEMPTS = 3;  // Anzahl Versuche, ändert sich nie

const welcome = document.getElementById("welcome");          // die Elemente aus dem HTML einmal holen
const gameArea = document.getElementById("gameArea");
const guessInput = document.getElementById("guessInput");
const buttons = document.getElementById("buttons");
const checkButton = document.getElementById("checkButton");
const startButton = document.getElementById("startButton");

let secretNumber;  // Geheimzahl der aktuellen Runde
let attempts;      // wie oft schon geraten wurde
let guesses;       // Liste der falschen Tipps
let messageDiv;    // div für "Too high!" usw.
let guessesDiv;    // div für die bisherigen Tipps
let exitButton;    // roter Button, wird erst beim Start erzeugt

startButton.addEventListener("click", startGame);          // Klick auf Start -> startGame
guessInput.addEventListener("input", updateCheckButton);   // "input" = bei jeder Änderung im Feld
checkButton.addEventListener("click", checkGuess);         // Klick auf Check -> checkGuess

function startGame() {
    welcome.style.display = "none";           // style.display ändert das CSS direkt am Element; "none" = Willkommenstext weg
    startButton.style.display = "none";       // Start-Button weg
    gameArea.style.display = "block";         // "block" = Fieldset sichtbar, in eigener Zeile
    checkButton.style.display = "inline-block"; // "inline-block" = sichtbar, aber neben anderen -> Check und Exit nebeneinander
    checkButton.disabled = false;             // disabled = false -> nicht mehr ausgegraut, anklickbar

    guessInput.min = 1;                       // Attribute: nur 1 bis 10, nur ganze Zahlen, Pflichtfeld
    guessInput.max = 10;
    guessInput.step = 1;
    guessInput.required = true;
    guessInput.disabled = false;
    guessInput.value = "";

    secretNumber = Math.floor(Math.random() * 10) + 1;  // Zufallszahl 1 bis 10
    attempts = 0;
    guesses = [];

    messageDiv = document.createElement("div");   // neues <div> für "Too low!" usw. bauen, ist erst im Speicher, noch NICHT auf der Seite
    messageDiv.className = "feedback";            // Klasse "feedback" geben -> CSS zentriert es
    guessesDiv = document.createElement("div");   // zweites <div> für die bisherigen Tipps
    guessesDiv.className = "feedback";
    buttons.before(messageDiv, guessesDiv);        // erst jetzt auf die Seite: vor die Button-Leiste, also zwischen Fieldset und Buttons

    exitButton = document.createElement("button");  // roten Exit-Button erzeugen
    exitButton.textContent = "Exit Game";
    exitButton.className = "exitButton";
    exitButton.addEventListener("click", exitGame);
    buttons.append(exitButton);                     // append = hinten in die Button-Leiste hängen

    guessInput.focus();                             // Cursor gleich ins Feld setzen
}

function updateCheckButton() {
    checkButton.disabled = !guessInput.checkValidity();  // Zeile 28-33 checkValidity prüft min, max, step, required -> nur 1 bis 10 ist gültig
}

function checkGuess() {
    if (!guessInput.checkValidity()) {                   // ungültig (z. B. leer) -> kein Versuch verbraucht
        messageDiv.textContent = "Please enter a number between 1 and 10.";
        return;
    }

    let guess = Number(guessInput.value);  // Text aus dem Feld -> Zahl
    attempts++;                            // ein Versuch mehr

    if (guess === secretNumber) {
        messageDiv.textContent = "Congratulations! " + guess + " is correct. You needed " + attempts + " attempt(s).";
        endGame();
        return;
    }

    guesses.push(guess);                               // falscher Tipp kommt in die Liste
    if (guess > secretNumber) {
        messageDiv.textContent = "Too high!";
    } else {
        messageDiv.textContent = "Too low!";
    }
    guessesDiv.textContent = "Previous guesses: " + guesses.join(", ");  // join = Liste zu Text "3, 7"

    if (attempts >= MAX_ATTEMPTS) {                    // alle 3 Versuche verbraucht
        messageDiv.textContent += " Game over! The correct number was " + secretNumber + ".";
        endGame();
    } else {
        guessInput.value = "";                         // Feld leeren für den nächsten Tipp
        checkButton.disabled = true;                   // erst wieder aktiv, wenn eine gültige Zahl drinsteht
        guessInput.focus();
    }
}

function endGame() {
    checkButton.disabled = true;   // Check-Button aus, Spiel ist vorbei
    guessInput.disabled = true;    // Feld sperren
}

function exitGame() {
    gameArea.style.display = "none";            // Spielfeld weg
    checkButton.style.display = "none";         // Check-Button weg
    welcome.style.display = "block";            // Willkommenstext wieder da
    startButton.style.display = "inline-block"; // Start-Button wieder da

    guesses = [];                               // alte Tipps löschen
    messageDiv.remove();                        // remove = Element ganz aus der Seite löschen
    guessesDiv.remove();
    exitButton.remove();                        // wird beim nächsten Start neu erzeugt
}
