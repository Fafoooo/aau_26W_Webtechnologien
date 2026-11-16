

let container = document.getElementById('productContainer');  // [GEGEBEN] Originaldatei; Entferntes ist nur auskommentiert, alles Neue steht ganz unten | das leere div aus products.html
// [4 GEÄNDERT] Port 8080 passt nicht: XAMPP (Apache) läuft auf Port 80 -> neue URL steht unten (NEU 4)
// let productURL = "http://localhost:8080/ex4/products.json"; // adapt to your real location!

// [4 VERSCHOBEN] Aufruf steht jetzt unten, weil productURL erst dort angelegt wird (eine let-Variable darf man erst NACH ihrer Zeile benutzen)
// initialize(productURL,container);

// [4 ENTFERNT] leere Vorlage -> fertige Funktion initialize steht unten (NEU 4)
// function initialize(jsonURL, domElement) {
// 	// This function should retrieve all products from jsonURL and render them
// 	// in the same way as on the last assignment sheet inside of domElement
// }





// ======================== [NEU] Aufgabe 4 ========================
let productURL = "products.json";                            // relativ = gleicher Ordner wie products.html -> z. B. http://localhost/ex4/products.json (passt für jeden Ordner und Port)

// initialize mit XMLHttpRequest (XHR): die "alte" Art, arbeitet mit Events statt Promises
function initialize(jsonURL, domElement) {
	let xhr = new XMLHttpRequest();                          // Anfrage-Objekt anlegen
	xhr.open("GET", jsonURL);                                // was holen wir: GET = Datei abrufen
	xhr.onload = () => {                                     // onload = Antwort ist da (kommt SPÄTER, asynchron)
		if (xhr.status === 200) {                            // 200 = OK; bei 404 (nicht gefunden) kommt auch onload, aber mit anderem Status
			try {
				let products = JSON.parse(xhr.responseText); // Text der Antwort -> JavaScript-Array
				renderProducts(products, domElement);
			} catch (error) {                                // kaputtes JSON -> JSON.parse wirft einen Fehler
				showError(domElement, "invalid JSON (" + error.message + ")");
			}
		} else {
			showError(domElement, "HTTP " + xhr.status + " " + xhr.statusText);  // z. B. "HTTP 404 Not Found"
		}
	};
	xhr.onerror = () => {                                    // onerror = gar keine Antwort (Server aus, Seite über file:// geöffnet)
		showError(domElement, "network error");
	};
	xhr.send();                                              // Anfrage wirklich abschicken; der Code läuft sofort weiter
}

// Ein Produkt so bauen wie in productsA.html von Blatt 4:
// <div class="product" data-prodId="..."><h2>Titel</h2><div><div class="desc">..</div><div class="price">..</div><div class="buy">..</div></div></div>
function renderProducts(products, domElement) {
	for (let p of products) {                                 // products = Array aus der JSON-Datei, p = ein Produkt-Objekt
		let pdiv = document.createElement("div");            // äußeres div für das Produkt
		pdiv.className = "product";
		pdiv.setAttribute("data-prodId", p.id);              // gleiches Attribut wie auf Blatt 4

		let h2 = document.createElement("h2");
		h2.textContent = p.title;                            // textContent = nur Text, kein HTML -> sicher
		pdiv.appendChild(h2);

		let row = document.createElement("div");             // Zeile mit Beschreibung, Preis, Button
		let desc = document.createElement("div");
		desc.className = "desc";
		desc.textContent = p.desc;
		let price = document.createElement("div");
		price.className = "price";
		price.textContent = p.price.toFixed(2).replace(".", ",");  // 2890 -> "2890.00" -> "2890,00" wie auf Blatt 4
		let buy = document.createElement("div");
		buy.className = "buy";
		buy.innerHTML = '<input type="button" value="add to cart">';  // nur Aussehen, ein Warenkorb ist hier nicht verlangt
		row.append(desc, price, buy);                        // append = mehrere Kinder auf einmal anhängen
		pdiv.appendChild(row);

		domElement.appendChild(pdiv);                        // fertiges Produkt in den Container
	}
}

// Fehlermeldung statt Produkten anzeigen
function showError(domElement, text) {
	let p = document.createElement("p");
	p.className = "error";
	p.textContent = "Products could not be loaded: " + text;  // englisch wie die Seite (und keine Umlaut-Probleme am Server)
	domElement.appendChild(p);
	console.error(text);                                     // zusätzlich in der Konsole
}

initialize(productURL, container);                           // Aufruf von oben, jetzt hier unten (nach productURL)
// ======================== [ENDE NEU] Aufgabe 4 ========================
