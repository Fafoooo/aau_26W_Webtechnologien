

const eventLog = document.getElementById('eventLog');   // holt den Absatz aus der HTML, dort wird alles ausgegeben

function delayedCalc(a,b) {   // rechnet a + b mit Verzögerung
	const promise = new Promise(   // Promise = Bon: Ergebnis kommt später (oder Fehler)
		(resolve, reject) => {   // resolve = geschafft, reject = Fehler (1. erfüllt es, 2. Lehnt es ab)
			if (a > b) { // logisch lol
				setTimeout( // timeout, weil es länger dauern soll
					() => {
						let c = a+b;
						eventLog.innerHTML += a+" + "+b+" = "+c+"<br>";						
						resolve(c)   // Ergebnis c weitergeben
					}, 
					Math.floor(Math.random() * 2000));   // Wartezeit in ms: random = Zufall 0 bis <1, * 2000 = 0 bis <2000, floor = abrunden -> 0 bis 1999 = 0 - ~ 2 sec.
			}
			else {
				reject('error: b larger than a');   // Fehler: Promise abgelehnt
				eventLog.innerHTML += "rejected<br>";   // "rejected" auf die Seite schreiben
			}
		});
	return promise;
}


// Change the code below to correctly use promises for a delayed incremental computation
// of 5+3+7+14+23+25+1000+1 

// a) Original (hier ersetzt):
// delayedCalc(5,3);      // wartet zufällig, dann 8
// delayedCalc(7,14);     // 7 nicht größer als 14 -> sofort rejected
// delayedCalc(23,25);    // 23 nicht größer als 25 -> sofort rejected
// delayedCalc(1000,1);   // wartet zufällig, dann 1001
// Reihenfolge: 2x rejected immer zuerst (kein Warten),
// dann 8 und 1001: wer kürzer wartet, kommt zuerst -> wechselt beim Neuladen.
// Keiner wartet auf den anderen -> keine Gesamtsumme.
// Kein catch -> 2x "Uncaught (in promise)" in der Konsole.

// b) Kette: jeder Schritt wartet auf den vorigen und rechnet mit dem Ergebnis weiter
function mitThen() {
	delayedCalc(5,3)
		.then(result => delayedCalc(result,7))   // then = wenn fertig und result, dann: result = Ergebnis davor, damit weiterrechnen
		.then(result => delayedCalc(result,14))
		.then(result => delayedCalc(result,23))
		.then(result => delayedCalc(result,25))
		.then(result => delayedCalc(result,1000)) //hier fehler
		.then(result => delayedCalc(result,1))
		.catch(error => handleError(error));
}

// c) async/await: gleiche Rechnung, liest sich von oben nach unten
async function mitAwait() {   // async = darin darf man await benutzen -> auf die vars warten. 
	try {
		let result = await delayedCalc(5,3);   // await = warten bis fertig, dann Ergebnis nehmen
		result = await delayedCalc(result,7);
		result = await delayedCalc(result,14);
		result = await delayedCalc(result,23);
		result = await delayedCalc(result,25);
		result = await delayedCalc(result,1000);
		result = await delayedCalc(result,1);
	} catch (error) {   // reject bei await -> springt hierher
		handleError(error);
	}
}

// async kennzeichnet eine asynchrone Funktion, wartet aber selbst nicht. 
// await wartet auf das Ergebnis eines Promises und pausiert dabei nur die aktuelle async-Funktion.
// .then() wartet nicht aktiv, sondern führt den angegebenen Code aus, sobald das Promise erfolgreich erfüllt wurde.

// UMSCHALTEN: 'b' = .then-Kette, 'c' = async/await
const variante = 'b';

if (variante === 'b') {
	mitThen();
} else {
	mitAwait();
}


function handleError(error) {
	alert(error);
}



