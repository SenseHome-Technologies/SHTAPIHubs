'use strict';
const eventInteractorPostgres = require('../../usecases/event/eventInteractorPostgres');
const { eventCreatePersistence } = require('../../usecases/event/eventCreatePersistence');
const eventGetPersistence = require('../../usecases/event/eventGetPersistence');
const { eventEditPersistence } = require('../../usecases/event/eventEditPersistence');
const { eventDeletePersistence } = require('../../usecases/event/eventDeletePersistence');
const router = require('express').Router();


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

router.route('/event/edit').put(
    // Define an asynchronous function to handle the edit route
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract eventid from the request body
        const {id, name, type, state, hubid, eventtargets, schedules} = req.body;

        try {
            // Use eventInteractorPostgres to attempt edit with the provided data
            const event = await eventInteractorPostgres.edit({eventEditPersistence}, {token, id, name, type, state, hubid, eventtargets, schedules});
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
            // Log any errors that occur during the add process
            console.log(err);
            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
)


module.exports = router;
