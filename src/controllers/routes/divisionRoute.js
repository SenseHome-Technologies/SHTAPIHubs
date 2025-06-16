'use strict';
const divisionInteractorPostgres = require('../../usecases/division/divisionInteractorPostgres');
const { divisionCreatePersistence } = require('../../usecases/division/divisionCreatePersistence');
const divisionGetPersistence = require('../../usecases/division/divisionGetPersistence');
const { divisionEditPersistence } = require('../../usecases/division/divisionEditPersistence');
const { divisionDeletePersistence } = require('../../usecases/division/divisionDeletePersistence');
const router = require('express').Router();



/**
 * @api {post} /api/divisions Create a division
 * @apiName CreateDivision
 * @apiGroup Division
 * @apiDescription Create a division with the provided data
 *
 * @apiHeader {String} token The user's token
 * @apiParam {String} name The name of the division
 * @apiParam {String} icon The icon of the division
 * @apiParam {String} hubid The ID of the hub the division belongs to
 *
 * @apiSuccess {Object} division The created division
 * @apiSuccess {Number} division.status The status of the division
 * @apiSuccess {String} division.message The message of the division
 */
router.route('/divisions').post(
    // Define an asynchronous function to handle the create route
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract division data from the request body
        const { name, icon, hubid } = req.body;

        try {
            // Use divisionInteractorPostgres to attempt create with the provided data
            const division = await divisionInteractorPostgres.create({ divisionCreatePersistence }, { token, name, icon, hubid });
            // Send the response with the status and division data
            res.status(division.status).send(division);
        } catch (err) {
            // Log any errors that occur during the create process
            console.log(err);
            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
);

/**
 * @api {get} /api/divisions/:hubid Get a division
 * @apiName GetDivision
 * @apiGroup Division
 * @apiDescription Retrieve a division by its ID
 *
 * @apiHeader {String} token The user's token
 * @apiParam {String} hubid The ID of the division to retrieve
 *
 * @apiSuccess {Object} division The retrieved division
 * @apiSuccess {Number} division.status The status of the division
 * @apiSuccess {String} division.message The message of the division
 */
router.route('/divisions/:hubid').get(
    /**
     * Get a division by its ID
     *
     * @param {Object} req The request object
     * @param {Object} res The response object
     */
    async (req, res) => {
        const token = req.headers['token'];
        const { hubid } = req.params;

        try {
            // Attempt to get the division with the provided hubid
            const division = await divisionInteractorPostgres.get({ divisionGetPersistence }, { token, hubid });

            // Send the response with the status and division data
            res.status(division.status).send(division);
        } catch (err) {
            // Log any errors that occur during the get process
            console.log(err);
            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
);

/**
 * @api {put} /api/divisions/:id Edit a division
 * @apiName EditDivision
 * @apiGroup Division
 * @apiDescription Edit a division by its ID
 *
 * @apiHeader {String} token The user's token
 * @apiParam {String} id The ID of the division to edit
 * @apiParam {String} name The name of the division
 * @apiParam {String} icon The icon of the division
 * @apiParam {String} hubid The ID of the hub the division belongs to
 *
 * @apiSuccess {Object} division The edited division
 * @apiSuccess {Number} division.status The status of the division
 * @apiSuccess {String} division.message The message of the division
 */
router.route('/divisions/:id').put(
    // Define an asynchronous function to handle the edit route
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract divisionid from the request body
        const { id } = req.params;
        // Extract division data from the request body
        const { name, icon, hubid } = req.body;

        try {
            // Use divisionInteractorPostgres to attempt edit with the provided data
            const division = await divisionInteractorPostgres.edit({ divisionEditPersistence }, { token, id, name, icon, hubid });
            // Send the response with the status and division data
            res.status(division.status).send(division);
        } catch (err) {
            // Log any errors that occur during the edit process
            console.log(err);
            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
);

/**
 * @api {delete} /api/divisions/:id Delete a division
 * @apiName DeleteDivision
 * @apiGroup Division
 * @apiDescription Delete a division by its ID
 *
 * @apiHeader {String} token The user's token
 * @apiParam {String} id The ID of the division to delete
 * @apiParam {String} hubid The ID of the hub the division belongs to
 *
 * @apiSuccess {Object} division The division
 * @apiSuccess {Number} division.status The status of the delete operation
 * @apiSuccess {String} division.message The message of the delete operation
 */
router.route('/divisions/:id').delete(
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract divisionid from the request body
        const { id } = req.params;

        try {
            // Use divisionInteractorPostgres to attempt delete with the provided divisionid
            const division = await divisionInteractorPostgres.delete({ divisionDeletePersistence }, { token, id });
            // Send the response with the status and division data
            res.status(division.status).send(division);
        } catch (err) {
            // Log any errors that occur during the delete process
            console.log(err);
            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
);

module.exports = router;
