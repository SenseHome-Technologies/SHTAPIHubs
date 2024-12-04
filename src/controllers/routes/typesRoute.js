'use strict';
const typesInteractorPostgres = require('../../usecases/types/typesInteractorPostgres');
const typesGetPersistence = require('../../usecases/types/typesGetPersistence');
const router = require('express').Router();

/**
 * @api {get} /api/devicetypes/get Get all device types
 * @apiName GetDeviceTypes
 * @apiGroup Types
 * @apiDescription Retrieve all available device types
 *
 * @apiSuccess {Object} response The response object
 * @apiSuccess {Number} response.status The status code of the response
 * @apiSuccess {String} response.message The message of the response
 * @apiSuccess {Array} response.data The list of device types
 */
router.route('/devicetypes/get').get(
    // Define an asynchronous function to handle the get route
    async (req, res) => {
        try {
            // Use typesInteractorPostgres to attempt get
            const result = await typesInteractorPostgres.getdevicetypes({typesGetPersistence});
            // Send the response with the status and data
            res.status(result.status).send(result);
        } catch (err) {
            // Log any errors that occur during the get process
            console.log(err);
            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
)

/**
 * @api {get} /api/eventtypes/get Get all event types
 * @apiName GetEventTypes
 * @apiGroup Types
 * @apiDescription Retrieve all available event types
 *
 * @apiSuccess {Object} response The response object
 * @apiSuccess {Number} response.status The status code of the response
 * @apiSuccess {String} response.message The message of the response
 * @apiSuccess {Array} response.data The list of event types
 */
router.route('/eventtypes/get').get(
    // Define an asynchronous function to handle the get route
    async (req, res) => {
        try {
            // Use hubInteractorPostgres to attempt get
            const hub = await typesInteractorPostgres.geteventtypes({typesGetPersistence});
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
 * @api {get} /api/operators/get Get all operators
 * @apiName GetOperators
 * @apiGroup Types
 * @apiDescription Retrieve all available operators
 *
 * @apiSuccess {Object} response The response object
 * @apiSuccess {Number} response.status The status code of the response
 * @apiSuccess {String} response.message The message of the response
 * @apiSuccess {Array} response.data The list of operators
 */
router.route('/operators/get').get(
    // Define an asynchronous function to handle the get route
    async (req, res) => {
        try {
            // Use hubInteractorPostgres to attempt get
            const hub = await typesInteractorPostgres.getoperators({typesGetPersistence});
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
 * @api {get} /api/statments/get Get all statements
 * @apiName GetStatements
 * @apiGroup Types
 * @apiDescription Retrieve all available statements
 *
 * @apiSuccess {Object} response The response object
 * @apiSuccess {Number} response.status The status code of the response
 * @apiSuccess {String} response.message The message of the response
 * @apiSuccess {Array} response.data The list of statements
 */
router.route('/statments/get').get(
    // Define an asynchronous function to handle the get route
    async (req, res) => {
        try {
            // Use typesInteractorPostgres to attempt get
            const result = await typesInteractorPostgres.getstatments({typesGetPersistence});
            // Send the response with the status and data
            res.status(result.status).send(result);
        } catch (err) {
            // Log any errors that occur during the get process
            console.log(err);
            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
)


module.exports = router;
