

// identisch zu Aufgabe 4
let container = document.getElementById('productContainer');
let productURL = "products.json";

initialize(productURL,container);

// ANDERS als Aufgabe 4: fetch statt XMLHttpRequest
function initialize(jsonURL, domElement) {
	// This function should retrieve all products from jsonURL and render them
	// in the same way as on the last assignment sheet inside of domElement
	fetch(jsonURL)   // Anfrage abschicken, gibt sofort ein Promise zurück.
		.then(response => {   // Antwort ist da (Status da, Inhalt noch nicht gelesen)
			if (!response.ok) {   // ok = Status 200-299. fetch meldet 404 NICHT selbst als Fehler
				throw new Error("HTTP " + response.status);   // selbst Fehler werfen -> springt ins catch
			}
			return response.json();   // Inhalt als JSON lesen -> gibt an die Promise kette zurück.
		})
		.then(products => renderProducts(products, domElement))   // products = fertiges Array
		.catch(error => showError(domElement, error.message));   // EIN catch für alles: 404, Server aus, kaputtes JSON
}

// identisch zu Aufgabe 4
function renderProducts(products, domElement) {
	for (let p of products) {
		let pdiv = document.createElement("div");
		pdiv.className = "product";
		pdiv.setAttribute("data-prodId", p.id);

		let h2 = document.createElement("h2");
		h2.textContent = p.title;
		pdiv.appendChild(h2);

		let row = document.createElement("div");
		let desc = document.createElement("div");
		desc.className = "desc";
		desc.textContent = p.desc;
		let price = document.createElement("div");
		price.className = "price";
		price.textContent = p.price.toFixed(2).replace(".", ",");
		let buy = document.createElement("div");
		buy.className = "buy";
		buy.innerHTML = '<input type="button" value="add to cart">';
		row.append(desc, price, buy);
		pdiv.appendChild(row);

		domElement.appendChild(pdiv);
	}
}

// identisch zu Aufgabe 4
function showError(domElement, text) {
	let p = document.createElement("p");
	p.textContent = "Products could not be loaded: " + text;
	domElement.appendChild(p);
}