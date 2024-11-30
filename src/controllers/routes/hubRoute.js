'use strict';
const hubInteractorPostgres = require('../../usecases/hub/hubInteractorPostgres');
const { hubLoginPersistence } = require('../../usecases/hub/hubLoginPersistence');
const { hubAddPersistence } = require('../../usecases/hub/hubAddPersistence');
const { hubGetPersistence } = require('../../usecases/hub/hubGetPersistence');
const { hubEditPersistence } = require('../../usecases/hub/hubEditPersistence');
const { hubDeletePersistence } = require('../../usecases/hub/hubDeletePersistence');
const router = require('express').Router();


router.route('/hub/login').post(
    // Define an asynchronous function to handle the login route
    async (req, res) => {
        // Extract hubid from the request body
        const {id} = req.body;

        try {
            // Use hubInteractorPostgres to attempt login with the provided hubid
            const hub = await hubInteractorPostgres.login({hubLoginPersistence}, {id});
            // Send the response with the status and hub data
            res.status(hub.status).send(hub);
        } catch (err) {
            // Log any errors that occur during the login process
            console.log(err);
            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
)

router.route('/hub/add').post(
    // Define an asynchronous function to handle the add route
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract hubid from the request body
        const {id} = req.body;

        try {
            // Use hubInteractorPostgres to attempt add with the provided hubid
            const hub = await hubInteractorPostgres.add({hubAddPersistence}, {token, id});
            // Send the response with the status and hub data
            res.status(hub.status).send(hub);
        } catch (err) {
            // Log any errors that occur during the add process
            console.log(err);
            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
)

router.route('/hub/get').get(
    // Define an asynchronous function to handle the get route
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];

        try {
            // Use hubInteractorPostgres to attempt get with the provided hubid and type
            const hub = await hubInteractorPostgres.get({hubGetPersistence}, {token});
            // Send the response with the status and hub data
            res.status(hub.status).send(hub);
        } catch (err) {
            // Log any errors that occur during the add process
            console.log(err);
            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
)

router.route('/hub/edit').put(
    // Define an asynchronous function to handle the edit route
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract hubid from the request body
        const {id, name, users} = req.body;

        try {
            // Use hubInteractorPostgres to attempt edit with the provided hubid, name and users
            const hub = await hubInteractorPostgres.edit({hubEditPersistence}, {token, id, name, users});
            // Send the response with the status and hub data
            res.status(hub.status).send(hub);
        } catch (err) {
            // Log any errors that occur during the add process
            console.log(err);
            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
)

router.route('/hub/delete').delete(
    // Define an asynchronous function to handle the delete route
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract hubid from the request body
        const {id, type} = req.body;

        try {
            // Use hubInteractorPostgres to attempt delete with the provided hubid and type
            const hub = await hubInteractorPostgres.delete({hubDeletePersistence}, {token, id, type});
            // Send the response with the status and hub data
            res.status(hub.status).send(hub);
        } catch (err) {
            // Log any errors that occur during the add process
            console.log(err);
            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
)


module.exports = router;
