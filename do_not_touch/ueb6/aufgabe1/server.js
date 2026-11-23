let express = require('express');
const app = express();
app.use(express.static('public')); // host public folder
app.get('/', function (req, res) {
    
	res.setHeader('Content-Type', 'text/html'); // Antwort ist HTML
	
    res.status(200).send("This is a simple application");
});

function escapeHtml(s) { // Sonderzeichen als Text anzeigen
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') // HTML-Zeichen ersetzen
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;'); // Anführungszeichen ersetzen
}

app.get('/:text', function (req, res) { // Text aus der URL lesen
    res.setHeader('Content-Type', 'text/html'); // Antwort ist HTML
    res.status(200).send("This is a simple application receiving " + escapeHtml(req.params.text)); // Text sicher ausgeben
});

let port = 3000;
app.listen(port);
console.log("Server running at: http://localhost:"+port);
