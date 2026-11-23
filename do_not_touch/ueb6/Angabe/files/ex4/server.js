let cfg = require('./config.json')

let express = require('express');
let cors = require('cors')
const app = express();

app.use(express.static('public')); // host public folder
app.use(cors()); // allow all origins -> Access-Control-Allow-Origin: *

// the database pool, see EX3
const pool = require('./pool.js');

// this is necessary to implement session-based authentication 
const session = require('express-session');
// this is necessary to allow session data to be stored in the PostgreSQL database
const pgSession = require('connect-pg-simple')(session);

// EX3: this is necessary to allow parsing request bodies which contain json 
// it is also necessary to set the proper content type (application/json) in the request (e.g. in postman or RESTer)
let bodyParser = require('body-parser');
app.use(bodyParser.json());

// this is necessary to provide authentication to access the routes
const checkAuth = require('./check_auth');

app.use(session({
 resave: false,  // let it be like this
 saveUninitialized: false,  // let it be like this

// TODO: initialize further session parameters here 

}));

// the express router inherits the properties of the application
// including the session, so this has to be defined after the session is added to the app object
const loginRoutes = require('./login');
app.use("/login", loginRoutes);

// default route, no principal changes from EX3
app.get("/", (req, res) => {
    
	// TODO: set content type (from EX1)
	
    res.status(200).send("EX4: This is a database-backed application which uses JWT");
});

// TODO: copy the /products and /product route handlers from EX3 here
// TODO: and add the authentication callback from check_auth.js to their definitions

// TODO: implement the logout handler here
  
let port = 3000;
app.listen(port);
console.log("Server running at: http://localhost:"+port);
