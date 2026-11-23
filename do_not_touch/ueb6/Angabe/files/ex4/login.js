const express = require('express');
const router = express.Router();

const pool = require('./pool.js');

// login route creating/returning a session on successful login
// note that the path here is "/" as "/login" is defined for the whole module, so no further path is necessary
// this route will be still called on http://localhost:3000/login
router.post('/', (req, res) => {

    // TODO: get login parameters from request body

    // prepare DB query

    // issue query (returns promise)
    pool.query(query)
        .then (results => {

			// TODO: handle no match (login failed)

            // handle the case if everything is ok
            resultUser = resultRows[0];
            
			// TODO: create the session here
			
			res.status(200).json({
                "message": "login successful",
                login: resultUser.login,
            });

        })
        .catch(error => {
            // handle the errors accessing the database
        });

});

module.exports = router;
