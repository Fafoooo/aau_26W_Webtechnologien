const MAX_ATTEMPTS = 3;  // const = Wert kann nie geändert werden; Anzahl Versuche
// changes after every round, therefore let instead of const
let keepPlaying = true;  // let = Wert darf später geändert werden; true = weiterspielen

while (keepPlaying) {  // while = wiederholt den Block, solange keepPlaying true ist
    let randomNumber = Math.floor(Math.random() * 10) + 1;  // Math.random = Zahl von 0 bis unter 1; *10 -> 0 bis 9,99; Math.floor = abrunden -> 0 bis 9; +1 -> 1 bis 10
    playNumberGame(randomNumber);  // startet eine Spielrunde mit dieser Geheimzahl
    keepPlaying = confirm("Do you want to play again?");  // confirm = Popup mit OK/Abbrechen; OK -> true, Abbrechen -> false
}
alert("Thank you for playing!");  // alert = Popup mit Nachricht; kommt erst, wenn die Schleife fertig ist

function playNumberGame(secretNumber) {  // secretNumber = die übergebene Geheimzahl
    let guesses = [];  // leeres Array (Liste) für alle Tipps

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {  // for = zählt attempt von 1 bis 3; attempt++ = +1 nach jeder Runde
        let guess = getUserInput();  // Zahl oder Fehlertext vom User
        guesses.push(guess);  // push = hängt den Tipp hinten an die Liste an

        if (typeof guess !== "number") {  // typeof = Datentyp; kein number -> es ist der Fehlertext
            // guess contains the error message
            alert(guess);
        } else if (guess === secretNumber) {  // === = gleich (Wert und Typ)
            alert("Correct! You needed " + attempt + " attempt(s).");
            return true;  // return = Funktion sofort beenden; true = gewonnen
        } else {
            if (guess > secretNumber) {
                alert("Too high! Attempts made: " + attempt);
            } else {
                alert("Too low! Attempts made: " + attempt);
            }
            alert("Your previous guesses: " + guesses);  // Array wird als "3,7" angezeigt
        }
    }

    alert("No attempts left. The correct number was " + secretNumber + ".");  // nur erreicht, wenn alle 3 Versuche falsch waren
    return false;  // false = verloren
}

function getUserInput() {
    try {  // try = probiere den Block; bei throw springt es sofort zu catch
        let guess = Number(prompt("Enter a number between 1 and 10:"));  // prompt = Popup mit Eingabefeld, liefert Text; Number = Text -> Zahl ("abc" -> NaN)
        if (isNaN(guess) || guess < 1 || guess > 10) {  // isNaN = ist keine Zahl?; || = oder
            throw new Error("Invalid input. Please enter a number between 1 and 10.");  // throw = Fehler auslösen
        }
        return guess;  // gültige Zahl zurückgeben
    } catch (error) {  // catch = fängt den Fehler auf
        return error.message;  // gibt den Fehlertext zurück statt einer Zahl
    }
}
