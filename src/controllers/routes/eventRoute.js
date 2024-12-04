'use strict';
const eventInteractorPostgres = require('../../usecases/event/eventInteractorPostgres');
const { eventCreatePersistence } = require('../../usecases/event/eventCreatePersistence');
const eventGetPersistence = require('../../usecases/event/eventGetPersistence');
const { eventEditPersistence } = require('../../usecases/event/eventEditPersistence');
const { eventDeletePersistence } = require('../../usecases/event/eventDeletePersistence');
const router = require('express').Router();


/**
 * @api {post} /api/event/create Create an event
 * @apiName CreateEvent
 * @apiGroup Event
 * @apiDescription Create an event
 *
 * @apiHeader {String} token The user's token
 * @apiParam {String} name The name of the event
 * @apiParam {String} type The type of the event
 * @apiParam {String} state The state of the event
 * @apiParam {String} hubid The id of the hub to which the event belongs
 * @apiParam {Object[]} eventtargets The list of event targets
 * @apiParam {Object[]} schedules The list of schedules
 *
 * @apiSuccess {Object} event The event
 * @apiSuccess {Number} event.status The status of the event
 * @apiSuccess {String} event.message The message of the event
 */
router.route('/event/create').post(
    // Define an asynchronous function to handle the add route
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract eventid from the request body
        const {name, type, state, hubid, eventtargets, schedules} = req.body;

        try {
            // Use eventInteractorPostgres to attempt add with the provided eventid
            const event = await eventInteractorPostgres.create({eventCreatePersistence}, {token, name, type, state, hubid, eventtargets, schedules});
            // Send the response with the status and event data
            res.status(event.status).send(event);
        } catch (err) {
            // Log any errors that occur during the add process
            console.log(err);
            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
)

/**
 * @api {get} /api/event/get Get an event
 * @apiName GetEvent
 * @apiGroup Event
 * @apiDescription Retrieve an event by its ID
 *
 * @apiHeader {String} token The user's token
 * @apiParam {String} id The ID of the event to retrieve
 *
 * @apiSuccess {Object} event The event
 * @apiSuccess {Number} event.status The status of the event
 * @apiSuccess {String} event.message The message of the event
 */
router.route('/event/get').get(
    // Define an asynchronous function to handle the get route
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract eventid from the request body
        const {id} = req.body;

        try {
            // Use eventInteractorPostgres to attempt get with the provided eventid
            const event = await eventInteractorPostgres.get({eventGetPersistence}, {token, id});
            // Send the response with the status and event data
            res.status(event.status).send(event);
        } catch (err) {
            // Log any errors that occur during the add process
            console.log(err);
            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
)

/**
 * @api {get} /api/event/getall Get all events of a hub
 * @apiName GetAllEvents
 * @apiGroup Event
 * @apiDescription Retrieve all events of a hub by its ID
 *
 * @apiHeader {String} token The user's token
 * @apiParam {String} hubid The ID of the hub to retrieve events from
 *
 * @apiSuccess {Object} event The events
 * @apiSuccess {Number} event.status The status of the events
 * @apiSuccess {String} event.message The message of the events
 */
router.route('/event/getall').get(
    // Define an asynchronous function to handle the get route
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract eventid from the request body
        const {hubid} = req.body;

        try {
            // Use eventInteractorPostgres to attempt get with the provided hubid
            const event = await eventInteractorPostgres.getall({eventGetPersistence}, {token, hubid});
            // Send the response with the status and event data
            res.status(event.status).send(event);
        } catch (err) {
            // Log any errors that occur during the add process
            console.log(err);
            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
)

/**
 * @api {put} /api/event/edit Edit an event
 * @apiName EditEvent
 * @apiGroup Event
 * @apiDescription Update an event with the provided data
 *
 * @apiHeader {String} token The user's token
 * @apiParam {String} id The ID of the event to update
 * @apiParam {String} name The new name of the event
 * @apiParam {String} type The new type of the event
 * @apiParam {String} state The new state of the event
 * @apiParam {String} hubid The ID of the hub the event belongs to
 * @apiParam {Object[]} eventtargets The updated list of event targets
 * @apiParam {Object[]} schedules The updated list of schedules
 *
 * @apiSuccess {Object} event The updated event
 * @apiSuccess {Number} event.status The status of the update operation
 * @apiSuccess {String} event.message The message of the update operation
 */
router.route('/event/edit').put(
    // Define an asynchronous function to handle the edit route
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract event data from the request body
        const {id, name, type, state, hubid, eventtargets, schedules} = req.body;

        try {
            // Use eventInteractorPostgres to attempt edit with the provided data
            const event = await eventInteractorPostgres.edit({eventEditPersistence}, {token, id, name, type, state, hubid, eventtargets, schedules});
            // Send the response with the status and event data
            res.status(event.status).send(event);
        } catch (err) {
            // Log any errors that occur during the edit process
            console.log(err);
            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
)

/**
 * @api {delete} /api/event/delete Delete an event
 * @apiName DeleteEvent
 * @apiGroup Event
 * @apiDescription Delete an event by its ID
 *
 * @apiHeader {String} token The user's token
 * @apiParam {String} id The ID of the event to delete
 *
 * @apiSuccess {Object} event The event
 * @apiSuccess {Number} event.status The status of the delete operation
 * @apiSuccess {String} event.message The message of the delete operation
 */
router.route('/event/delete').delete(
    // Define an asynchronous function to handle the delete route
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract eventid from the request body
        const {id} = req.body;

        try {
            // Use eventInteractorPostgres to attempt delete with the provided eventid
            const event = await eventInteractorPostgres.delete({eventDeletePersistence}, {token, id});
            // Send the response with the status and event data
            res.status(event.status).send(event);
        } catch (err) {
            // Log any errors that occur during the delete process
            console.log(err);
            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
)


module.exports = router;
