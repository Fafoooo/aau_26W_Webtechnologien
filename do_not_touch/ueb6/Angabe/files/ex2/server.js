let express = require('express');
const app = express();
let fs = require('fs');
let cors = require('cors');
app.use(cors()); // allow all origins -> Access-Control-Allow-Origin: *
app.use(express.static('public')); // host public folder

// TODO: read the products.json file here into a string

app.get('/', function (req, res) {
    
	// TODO: set a content type (from ex.1)
	
    res.status(200).send("EX2: This is a simple application");
});
app.get('/products', function (req, res) {
    
	// write your code here to output the list of products as JSON

});

// write your route handler to output a single product by its ID as JSON here

let port = 3000;
app.listen(port);
console.log("Server running at: http://localhost:"+port);
