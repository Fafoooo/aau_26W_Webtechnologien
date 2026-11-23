// take the connection pool capabilities from the pg module
const { Pool } = require('pg');

let cfg = require('./config.json')

let express = require('express');
let cors = require('cors')
const app = express();
app.use(express.static('public')); // host public folder
app.use(cors()); // allow all origins -> Access-Control-Allow-Origin: *

const pool = require('./pool.js');  // the database pool

// EX3: this is necessary to allow parsing request bodies which contain json 
// it is also necessary to set the proper content type (application/json) in the request (e.g. in postman or RESTer)
let bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies

app.get("/", (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send("EX3: This is a simple database-backed application");
});

app.get("/products", async (req, res) => { // GEÄNDERT: Datenbankabfrage abwarten

    try { // Datenbankfehler abfangen
        let result = await pool.query('SELECT id FROM products'); // Alle Produkt-IDs laden
        res.status(200).json({ productIds: result.rows.map(product => product.id) }); // IDs als Liste senden
    } catch (error) { // Fehler bei der Abfrage
        console.error(error); // Ursache in der Konsole anzeigen
        res.status(500).json({ error: "database error" }); // Datenbankfehler melden
    }
 
});

app.get("/product/:id", async (req, res) => { // Einzelnes Produkt laden
    try { // Datenbankfehler abfangen
        let result = await pool.query('SELECT id, title, description, price FROM products WHERE id = $1', [req.params.id]); // ID getrennt übergeben
        if (result.rows.length === 0) { // Kein Produkt gefunden
            return res.status(404).json({ error: "product not found" }); // Unbekannte ID melden
        }
        res.status(200).json(result.rows[0]); // Gefundenes Produkt senden
    } catch (error) { // Fehler bei der Abfrage
        console.error(error); // Ursache in der Konsole anzeigen
        res.status(500).json({ error: "database error" }); // Datenbankfehler melden
    }
});
 
app.put("/product/:id", async (req, res) => { // Beschreibung ändern
    let description = req.body && req.body.description; // Beschreibung aus JSON lesen
    if (typeof description !== 'string' || description.trim().length === 0 || description.length > 100) { // Typ, Inhalt und Länge prüfen
        return res.status(400).json({ error: "description must be a non-empty string with at most 100 characters" }); // Ungültige Eingabe melden
    }
    try { // Datenbankfehler abfangen
        let result = await pool.query('UPDATE products SET description = $1 WHERE id = $2 RETURNING id, title, description, price', [description, req.params.id]); // Werte getrennt übergeben
        if (result.rowCount === 0) { // Kein Produkt geändert
            return res.status(404).json({ error: "product not found" }); // Unbekannte ID melden
        }
        res.status(200).json(result.rows[0]); // Aktualisiertes Produkt senden
    } catch (error) { // Fehler bei der Abfrage
        console.error(error); // Ursache in der Konsole anzeigen
        res.status(500).json({ error: "database error" }); // Datenbankfehler melden
    }
});
	
let port = 3000;
app.listen(port);
console.log("Server running at: http://localhost:"+port);
