'use strict';
const hubInterfactorPostgres = require('../../usecases/hub/hubInterfactorPostgres');
const router = require('express').Router();



router.route('/hub/login').post(
    // Define an asynchronous function to handle the login route
    async (req, res) => {
        // Extract hubid from the request body
        const {hubid} = req.body;

        try {
            // Use hubInterfactorPostgres to attempt login with the provided hubid
            const user = await hubInterfactorPostgres.login({}, {hubid});
            // Send the response with the status and user data
            res.status(user.status).send(user);
        } catch (err) {
            // Log any errors that occur during the login process
            console.log(err);
            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
)


module.exports = router;
