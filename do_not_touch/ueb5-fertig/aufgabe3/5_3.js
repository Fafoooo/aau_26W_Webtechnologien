

const eventLog = document.getElementById('eventLog');     // [GEGEBEN] Originaldatei; Entferntes ist nur auskommentiert, alles Neue steht ganz unten | <p id="eventLog"> für die Ausgabe

function delayedCalc(a,b) {                               // Rechnet a+b mit Verzögerung; gibt SOFORT ein Promise zurück (= Versprechen: "Ergebnis kommt später")
	const promise = new Promise(                          // new Promise bekommt eine Funktion mit resolve (geschafft) und reject (Fehler)
		(resolve, reject) => {
			if (a > b) {                                  // nur wenn a größer als b ist, wird gerechnet
				setTimeout(                               // setTimeout = Funktion erst später ausführen ...
					() => {
						let c = a+b;
						eventLog.innerHTML += a+" + "+b+" = "+c+"<br>";  // Rechnung ins Event Log schreiben
						resolve(c)                        // Promise erfüllen -> c ist das Ergebnis für .then / await
					}, 
					Math.floor(Math.random() * 2000));    // ... nach zufällig 0-1999 ms -> darum ist die Reihenfolge jedes Mal anders
			}
			else {
				reject('error: b larger than a');         // sonst SOFORT ablehnen (ohne Wartezeit)
				eventLog.innerHTML += "rejected<br>";     // "rejected" erscheint daher immer gleich am Anfang
			}
		});
	return promise;                                       // Promise zurückgeben (noch nicht fertig!)
}


// Change the code below to correctly use promises for a delayed incremental computation
// of 5+3+7+14+23+25+1000+1 

// [3b ENTFERNT] 4 Aufrufe ohne Warten -> laufen alle gleichzeitig, Reihenfolge zufällig, 7+14 und 23+25 rechnen nicht weiter; ersetzt durch Kette/await ganz unten (NEU 3b, 3c)
// delayedCalc(5,3);
// delayedCalc(7,14);
// delayedCalc(23,25);
// delayedCalc(1000,1);


function handleError(error) {                             // zeigt den Fehlertext als Popup
	alert(error);
}





// ======================== [NEU] Aufgabe 3b ========================
// Kette aus .then(...): jede Rechnung startet erst, wenn die vorige FERTIG ist -> genau diese Reihenfolge
// Auskommentiert, weil nur eine Version aktiv sein darf (sonst laufen 3b und 3c gleichzeitig und die Ausgabe mischt sich).
// Zum Testen: NUR bei den 8 Code-Zeilen von delayedCalc(5, 3) bis .catch(handleError); das "// " vorne entfernen und unten bei 3c den Aufruf calcWithAwait(); auskommentieren.
// delayedCalc(5, 3)                                 // startet die erste Rechnung, gibt ein Promise zurück
// 	.then(result => delayedCalc(result, 7))      // result = Ergebnis von vorher (8); return des neuen Promise -> die Kette wartet darauf
// 	.then(result => delayedCalc(result, 14))     // 15 + 14
// 	.then(result => delayedCalc(result, 23))     // 29 + 23
// 	.then(result => delayedCalc(result, 25))     // 52 + 25
// 	.then(result => delayedCalc(result, 1000))   // 77 + 1000 -> b größer als a -> reject -> "rejected"
// 	.then(result => delayedCalc(result, 1))      // wird übersprungen, weil vorher abgelehnt wurde
// 	.catch(handleError);                         // EIN catch am Ende fängt den Fehler aus JEDEM Schritt davor ab
// ======================== [ENDE NEU] Aufgabe 3b ========================

// ======================== [NEU] Aufgabe 3c ========================
// Dasselbe mit async/await: liest sich wie normaler Code von oben nach unten
async function calcWithAwait() {                     // async = in dieser Funktion darf man await benutzen
	try {
		let result = await delayedCalc(5, 3);        // await = hier warten, bis das Promise fertig ist, dann den Wert nehmen (8)
		result = await delayedCalc(result, 7);       // 15
		result = await delayedCalc(result, 14);      // 29
		result = await delayedCalc(result, 23);      // 52
		result = await delayedCalc(result, 25);      // 77
		result = await delayedCalc(result, 1000);    // reject -> springt sofort in catch, der Rest wird nicht mehr ausgeführt
		result = await delayedCalc(result, 1);
	} catch (error) {                                 // abgelehntes Promise bei await = wie ein geworfener Fehler
		handleError(error);                           // zeigt "error: b larger than a" als alert
	}
}
calcWithAwait();                                      // Funktion starten (aktiv)
// ======================== [ENDE NEU] Aufgabe 3c ========================
