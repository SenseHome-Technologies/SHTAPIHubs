'use strict';
const typesInteractorPostgres = require('../../usecases/types/typesInteractorPostgres');
const typesGetPersistence = require('../../usecases/types/typesGetPersistence');
const router = require('express').Router();

/**
 * @api {get} /api/devicetypes Get all device types
 * @apiName GetDeviceTypes
 * @apiGroup Types
 * @apiDescription Retrieve all available device types
 *
 * @apiSuccess {Object} response The response object
 * @apiSuccess {Number} response.status The status code of the response
 * @apiSuccess {String} response.message The message of the response
 * @apiSuccess {Array} response.data The list of device types
 */
router.route('/devicetypes').get(
    // Define an asynchronous function to handle the get route
    async (req, res) => {
        try {
            // Use typesInteractorPostgres to attempt get
            const result = await typesInteractorPostgres.getdevicetypes({ typesGetPersistence });
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
