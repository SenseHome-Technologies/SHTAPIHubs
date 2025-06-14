'use strict';
const historyInteractorPostgres = require('../../usecases/histories/historyInteractorPostgres');
const { historyCreatePersistence } = require('../../usecases/histories/historyCreatePersistence');
const { historyGetPersistence } = require('../../usecases/histories/historyGetPersistence');
const router = require('express').Router();



/**
 * @api {post} /api/histories Create a history entry
 * @apiName CreateHistoryEntry
 * @apiGroup History
 * @apiDescription Create a history entry
 *
 * @apiHeader {String} token The user's token
 * @apiParam {String} deviceid The ID of the device to create the history entry for
 * @apiParam {String} devicevalue The value of the device to create the history entry for
 * @apiParam {Date} date The date of the history entry
  * @apiParam {String} hubid The ID of the hub to create the history entry for

 *
 * @apiSuccess {Object} history The created history entry
 * @apiSuccess {Number} history.status The status of the history entry
 * @apiSuccess {String} history.message The message of the history entry
 */
router.route('/histories').post(
    // Define an asynchronous function to handle the add route
    // This function will create a new history entry in the database
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract deviceid, devicevalue, and date from the request body
        const { deviceid, devicevalue, date, hubid } = req.body;

        try {
            // Use historyInteractorPostgres to attempt add with the provided deviceid
            const device = await historyInteractorPostgres.create({ historyCreatePersistence }, { token, deviceid, devicevalue, date, hubid });
            // Send the response with the status and device data
            res.status(device.status).send(device);
        } catch (err) {
            // Log any errors that occur during the add process
            console.log(err);
            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
)


/**
 * @api {get} /api/histories/:hubid Get all history entries for a device
 * @apiName GetHistoryEntries
 * @apiGroup History
 * @apiDescription Retrieve all history entries associated with a device
 *
 * @apiHeader {String} token The user's token
 * @apiParam {String} hubid The ID of the hub to retrieve history entries for
 *
 * @apiSuccess {Object} history The history entries
 * @apiSuccess {Number} history.status The status of the history entries
 * @apiSuccess {String} history.message The message of the history entries
 */
router.route('/histories/:hubid').get(
    // Define an asynchronous function to handle the get route
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract data from the request query
        const { page, limit } = req.query;
        // Extract deviceid from the request body
        const { hubid } = req.params;

        try {
            // Use historyInteractorPostgres to attempt get with the provided hubid
            const history = await historyInteractorPostgres.get({ historyGetPersistence }, { token, hubid, page, limit });

            // Send the response with the status and history data
            res.status(history.status).send(history);
        } catch (err) {
            // Log any errors that occur during the add process
            console.log(err);

            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
)


module.exports = router;
