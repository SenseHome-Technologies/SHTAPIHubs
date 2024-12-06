'use strict';
const hubInteractorPostgres = require('../../usecases/hub/hubInteractorPostgres');
const { hubLoginPersistence } = require('../../usecases/hub/hubLoginPersistence');
const { hubAddPersistence } = require('../../usecases/hub/hubAddPersistence');
const hubGetPersistence = require('../../usecases/hub/hubGetPersistence');
const { hubEditPersistence } = require('../../usecases/hub/hubEditPersistence');
const { hubDeletePersistence } = require('../../usecases/hub/hubDeletePersistence');
const router = require('express').Router();


/**
 * @api {post} /api/hub/login Login a hub
 * @apiName LoginHub
 * @apiGroup Hub
 * @apiDescription Login a hub by its ID
 *
 * @apiHeader {String} Content-Type The content type of the request
 * @apiParam {String} id The ID of the hub to login
 *
 * @apiSuccess {Object} hub The logged in hub
 * @apiSuccess {Number} hub.status The status of the hub
 * @apiSuccess {String} hub.message The message of the hub
 * @apiSuccess {String} hub.token The JWT token of the hub
 */
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

/**
 * @api {post} /api/hub/add Add a hub
 * @apiName AddHub
 * @apiGroup Hub
 * @apiDescription Add a hub by its ID
 *
 * @apiHeader {String} token The user's token
 * @apiParam {String} id The ID of the hub to add
 * @apiParam {String} email The email to register the hub with
 *
 * @apiSuccess {Object} hub The added hub
 * @apiSuccess {Number} hub.status The status of the hub
 * @apiSuccess {String} hub.message The message of the hub
 */
router.route('/hub/add').post(
    // Define an asynchronous function to handle the add route
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract hubid from the request body
        const {id, email} = req.body;

        try {
            // Use hubInteractorPostgres to attempt add with the provided hubid
            const hub = await hubInteractorPostgres.add({hubAddPersistence}, {token, id, email});
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

/**
 * @api {get} /api/hub/get Get a hub
 * @apiName GetHub
 * @apiGroup Hub
 * @apiDescription Retrieve a hub by its ID
 *
 * @apiHeader {String} token The user's token
 * @apiParam {String} id The ID of the hub to retrieve
 *
 * @apiSuccess {Object} hub The retrieved hub
 * @apiSuccess {Number} hub.status The status of the hub
 * @apiSuccess {String} hub.message The message of the hub
 */
router.route('/hub/get').get(
    // Define an asynchronous function to handle the get route
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract hubid from the request body
        const {id} = req.body;

        try {
            // Use hubInteractorPostgres to attempt get with the provided hubid
            const hub = await hubInteractorPostgres.get({hubGetPersistence}, {token, id});
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

/**
 * @api {get} /api/hub/getall Get all hubs for a user
 * @apiName GetAllHubs
 * @apiGroup Hub
 * @apiDescription Retrieve all hubs associated with the user's email
 *
 * @apiHeader {String} token The user's token
 * @apiParam {String} email The email of the user to retrieve hubs for
 *
 * @apiSuccess {Object} hub The hubs
 * @apiSuccess {Number} hub.status The status of the hubs
 * @apiSuccess {String} hub.message The message of the hubs
 */
router.route('/hub/getall').get(
    // Define an asynchronous function to handle the get route
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract email from the request body
        const {email} = req.body;

        try {
            // Use hubInteractorPostgres to attempt get with the provided email
            const hub = await hubInteractorPostgres.getall({hubGetPersistence}, {token, email});
            // Send the response with the status and hub data
            res.status(hub.status).send(hub);
        } catch (err) {
            // Log any errors that occur during the get process
            console.log(err);
            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
)

/**
 * @api {put} /api/hub/edit Edit a hub
 * @apiName EditHub
 * @apiGroup Hub
 * @apiDescription Edit a hub by its ID
 *
 * @apiHeader {String} token The user's token
 * @apiParam {String} id The ID of the hub to edit
 * @apiParam {String} name The name of the hub to update
 * @apiParam {Array} users The users to update in the hub
 *
 * @apiSuccess {Object} hub The hub
 * @apiSuccess {Number} hub.status The status of the edit operation
 * @apiSuccess {String} hub.message The message of the edit operation
 */
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

/**
 * @api {delete} /api/hub/delete Delete a hub
 * @apiName DeleteHub
 * @apiGroup Hub
 * @apiDescription Delete a hub by its ID and type
 *
 * @apiHeader {String} token The user's token
 * @apiParam {String} id The ID of the hub to delete
 * @apiParam {String} type The type of the hub to delete
 *
 * @apiSuccess {Object} hub The hub
 * @apiSuccess {Number} hub.status The status of the delete operation
 * @apiSuccess {String} hub.message The message of the delete operation
 */
router.route('/hub/delete').delete(
    // Define an asynchronous function to handle the delete route
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract hubid and type from the request body
        const {id, type} = req.body;

        try {
            // Use hubInteractorPostgres to attempt delete with the provided hubid and type
            const hub = await hubInteractorPostgres.delete({hubDeletePersistence}, {token, id, type});
            // Send the response with the status and hub data
            res.status(hub.status).send(hub);
        } catch (err) {
            // Log any errors that occur during the delete process
            console.log(err);
            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
)


module.exports = router;
