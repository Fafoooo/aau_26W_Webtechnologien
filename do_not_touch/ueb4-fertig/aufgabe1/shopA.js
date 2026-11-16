'use strict';  // [GEGEBEN] Originaldatei aus der Angabe; Entferntes ist nur auskommentiert, alles Neue steht ganz unten | strenger Modus

let products = [];  // Liste aller Produkte als Objekte, der Warenkorb liest daraus

function updateCart() {                                   // Warenkorb unten neu zeichnen
	let output = document.getElementById("orderedItems");  // die <ul> "Your Order"
	output.innerHTML= "";                                  // erst alles löschen, dann neu aufbauen
	let total = 0;                                         // Gesamtpreis, startet bei 0
	for (let p of products) {                              // jedes Produkt anschauen
		if (p.numInCart >0) {                              // nur Produkte, die mindestens 1x im Warenkorb sind
			let newP = document.createElement ("li");      // neuer Listenpunkt
			newP.appendChild(document.createTextNode (p.title+" "+p.price+"("+p.numInCart +")"));  // Text z. B. "Sony Alpha IV 2890(2)"
			output.appendChild(newP);                      // Listenpunkt in die Liste
			total += p.numInCart*p.price;                  // Anzahl mal Preis zum Gesamtpreis dazu
		}
	}
	document.getElementById("totalPrice").innerHTML = total.toFixed(2);  // toFixed(2) = immer 2 Nachkommastellen, z. B. 4190.00
}

for (let pdiv of document.querySelectorAll("div.product")) {  // jedes Produkt-div der Seite einmal durchgehen
	let cp = {};                                              // cp = "current product", leeres Objekt; let -> jede Runde ein NEUES cp
	// Parsing Data from HTML
	cp.id = pdiv.dataset.prodid;                              // data-prodId -> HTML macht Attributnamen klein -> dataset.prodid
	cp.title = pdiv.firstChild.nextSibling.firstChild.nodeValue;  // firstChild = Leerzeichen/Zeilenumbruch, nextSibling = <h2>, firstChild = Text darin
	cp.desc = pdiv.getElementsByClassName('desc')[0].innerText;   // Text aus <div class="desc">
	cp.price = parseFloat(pdiv.getElementsByClassName('price')[0].innerText);  // "2890,00" -> parseFloat liest bis zum Komma -> 2890
	cp.numInCart = 0;                                         // am Anfang 0 Stück im Warenkorb
	cp.domElement = pdiv;                                     // das div selbst merken (brauchen wir unten in 1b und 1d)
	products.push(cp);                                        // Produkt in die Liste

	// [1b ENTFERNT] Funktion MIT Namen -> ersetzt durch Funktion OHNE Namen direkt im addEventListener (ganz unten, NEU 1b)
	// function addListener(e) {
	// 	console.log(e);
	// 	cp.numInCart +=1;
	// 	updateCart();
	// }

	//set Event Listener
	// [1b ENTFERNT] Listener wird jetzt ganz unten bei NEU 1b angehängt
	// let clickButton = pdiv.getElementsByClassName('buy')[0];
	// clickButton.addEventListener('click', addListener);
}







// ======================== [NEU] Aufgabe 1b ========================
// Statt addListener mit Namen: die Funktion OHNE Namen direkt in addEventListener schreiben.
// Eigene Schleife über products, weil alles Neue hier unten steht; cp ist mit let wieder pro Runde neu -> Closure wie im Original

// 1b-a: standard anonymous function (auskommentiert: nur eine Version darf aktiv sein, sonst zählt jeder Klick doppelt)
// for (let cp of products) {
// 	let clickButton = cp.domElement.getElementsByClassName('buy')[0];
// 	clickButton.addEventListener('click', function (e) {
// 		console.log(e);
// 		cp.numInCart +=1;
// 		updateCart();
// 	});
// }

// 1b-b: arrow function (aktiv)
for (let cp of products) {                                    // jedes Produkt; let -> jede Runde ein eigenes cp
	let clickButton = cp.domElement.getElementsByClassName('buy')[0];  // domElement = das Produkt-div (oben war das pdiv)
	clickButton.addEventListener('click', (e) => {            // (e) => { ... } = Kurzschreibweise für function (e) { ... }
		console.log(e);                                       // e = das Klick-Event, nur zum Anschauen in der Konsole
		cp.numInCart +=1;                                     // Closure: die Funktion "merkt" sich das cp aus DIESER Runde -> richtiges Produkt
		updateCart();                                         // Warenkorb neu zeichnen
	});
}
// ======================== [ENDE NEU] Aufgabe 1b ========================

// ======================== [NEU] Aufgabe 1c ========================
// "Empty Shopping Cart"
document.getElementById("emptyCard").addEventListener('click', () => {  // Button hat im HTML die id "emptyCard" (so geschrieben)
	for (let p of products) {
		p.numInCart = 0;                                      // bei jedem Produkt die Anzahl auf 0
	}
	updateCart();                                             // Warenkorb neu zeichnen -> leer, Total 0.00
});
// ======================== [ENDE NEU] Aufgabe 1c ========================

// ======================== [NEU] Aufgabe 1d ========================
// Produkte auf der Seite nach Preis sortieren (aufsteigend)
products.sort((a, b) => a.price - b.price);                   // sort vergleicht immer 2: negativ = a zuerst, positiv = b zuerst -> billigstes vorne
let orderDiv = document.getElementById("orderedItems").parentElement;  // das div mit "Your Order", steht unter den Produkten
for (let p of products) {                                     // in sortierter Reihenfolge
	orderDiv.before(p.domElement);                            // before VERSCHIEBT das schon vorhandene div direkt vor "Your Order" -> am Ende sortiert
}
// ======================== [ENDE NEU] Aufgabe 1d ========================
