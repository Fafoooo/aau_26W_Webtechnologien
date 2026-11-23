let express = require('express');
const app = express();
app.use(express.static('public')); // host public folder
app.get('/', function (req, res) {
    
	// TODO: set the content type of output to be plain HTML
	
    res.status(200).send("This is a simple application");
});

// TODO: provide the code to handle a route parameter

let port = 3000;
app.listen(port);
console.log("Server running at: http://localhost:"+port);
