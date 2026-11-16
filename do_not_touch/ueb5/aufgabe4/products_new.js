

let container = document.getElementById('productContainer');   // das leere div aus der HTML
let productURL = "products.json";   // GEÄNDERT: relativ = gleicher Ordner wie die HTML (Original-URL passt nicht zum Server)

initialize(productURL,container);

function initialize(jsonURL, domElement) {
	// This function should retrieve all products from jsonURL and render them
	// in the same way as on the last assignment sheet inside of domElement
	let xhr = new XMLHttpRequest();   // Anfrage-Objekt anlegen
	xhr.open("GET", jsonURL);   // GET = Datei holen. POST senden
	xhr.onload = () => {   // Wenn Antwort da -> mach weiter. Kein Promise/Await sondern Callback funktion
		if (xhr.status === 200) {   // 200 = OK, sonst z. B. 404 = nicht gefunden
			try {
				let products = JSON.parse(xhr.responseText);   // Text -> Array mit Produkten. 
				renderProducts(products, domElement); // Zeige die geladenen Produkte im HTML-Container an.
			} catch (error) {   // kaputtes JSON
				showError(domElement, "invalid JSON");
			}
		} else {
			showError(domElement, "HTTP " + xhr.status);
		}
	};
	xhr.onerror = () => {   // gar keine Antwort (z. B. Server aus)
		showError(domElement, "network error");
	};
	xhr.send();   // Anfrage abschicken, Code läuft sofort weiter. onload, onerror
}

// Produkt so bauen wie auf Blatt 4
function renderProducts(products, domElement) {
	for (let p of products) {   // p = ein Produkt aus der JSON
		let pdiv = document.createElement("div");
		pdiv.className = "product";
		pdiv.setAttribute("data-prodId", p.id); //als HTML data attribut die Prod. ID

		let h2 = document.createElement("h2");
		h2.textContent = p.title;
		pdiv.appendChild(h2);

		let row = document.createElement("div");   // Zeile: Beschreibung, Preis, Button
		let desc = document.createElement("div");
		desc.className = "desc";
		desc.textContent = p.desc;
		let price = document.createElement("div");
		price.className = "price";
		price.textContent = p.price.toFixed(2).replace(".", ",");   // 2890 -> "2890,00". toFixed: zwei nachkomma mit . ; macht . -> , 
		let buy = document.createElement("div");
		buy.className = "buy";
		buy.innerHTML = '<input type="button" value="add to cart">';
		row.append(desc, price, buy);
		pdiv.appendChild(row);

		domElement.appendChild(pdiv);   // fertiges Produkt in den Container

		// Aufbau eines Produkts:
		// Produkt-Kasten (product)
		// ├── Überschrift (h2): "Sony Alpha IV"
		// └── Zeile (row)
		//     ├── Beschreibung (desc): "New 2021 arrival, hot deal"
		//     ├── Preis (price): "2890,00"
		//     └── Kaufen (buy): [add to cart]
	}
}

// Fehlermeldung statt Produkten anzeigen
function showError(domElement, text) {
	let p = document.createElement("p");
	p.textContent = "Products could not be loaded: " + text;
	domElement.appendChild(p);
}