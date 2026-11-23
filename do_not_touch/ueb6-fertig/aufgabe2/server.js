let express = require('express');
const app = express();
let fs = require('fs');
let cors = require('cors');
app.use(cors()); // allow all origins -> Access-Control-Allow-Origin: *
app.use(express.static('public')); // host public folder

let productText = fs.readFileSync(__dirname + '/products.json', 'utf8'); // Datei als Text lesen
let products = JSON.parse(productText); // Text in Produktliste umwandeln
console.log(products); // Liste in der Konsole prüfen

app.get('/', function (req, res) {
    
	res.setHeader('Content-Type', 'text/html'); // Antwort ist HTML
	
    res.status(200).send("EX2: This is a simple application");
});
app.get('/products', function (req, res) {
    
	res.status(200).json({ productIds: products.map(product => product.id) }); // IDs in Dateireihenfolge senden

});

app.get('/product/:id', function (req, res) { // Produkt über die ID suchen
    let product = products.find(product => product.id === req.params.id); // Passendes Objekt finden
    if (!product) { // Unbekannte ID behandeln
        return res.status(404).json({ error: "product not found" }); // Fehler als JSON senden
    }
    res.status(200).json(product); // Ganzes Produkt senden
});

let port = 3000;
app.listen(port);
console.log("Server running at: http://localhost:"+port);
