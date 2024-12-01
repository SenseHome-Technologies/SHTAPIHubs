'use strict';
const deviceInteractorPostgres = require('../../usecases/device/deviceInteractorPostgres');
const { deviceAddPersistence } = require('../../usecases/device/deviceAddPersistence');
const { deviceCreatePersistence } = require('../../usecases/device/deviceCreatePersistence');
const deviceGetPersistence = require('../../usecases/device/deviceGetPersistence');
const { deviceEditPersistence } = require('../../usecases/device/deviceEditPersistence');
const { deviceDeletePersistence } = require('../../usecases/device/deviceDeletePersistence');
const router = require('express').Router();


router.route('/device/add').post(
    // Define an asynchronous function to handle the add route
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract deviceid from the request body
        const {hubid} = req.body;

        try {
            // Use deviceInteractorPostgres to attempt add with the provided deviceid
            const device = await deviceInteractorPostgres.add({deviceAddPersistence}, {token, hubid});
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

router.route('/device/create').post(
    // Define an asynchronous function to handle the add route
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract deviceid from the request body
        const {name, accesscode, type, state, value} = req.body;

        try {
            // Use deviceInteractorPostgres to attempt add with the provided deviceid
            const device = await deviceInteractorPostgres.create({deviceCreatePersistence}, {token, name, accesscode, type, state, value});
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

router.route('/device/get').get(
    // Define an asynchronous function to handle the get route
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract deviceid from the request body
        const {id} = req.body;

        try {
            // Use deviceInteractorPostgres to attempt get with the provided deviceid
            const device = await deviceInteractorPostgres.get({deviceGetPersistence}, {token, id});
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

router.route('/device/getall').get(
    // Define an asynchronous function to handle the get route
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract deviceid from the request body
        const {hubid} = req.body;

        try {
            // Use deviceInteractorPostgres to attempt get with the provided hubid
            const device = await deviceInteractorPostgres.getall({deviceGetPersistence}, {token, hubid});
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

router.route('/device/edit').put(
    // Define an asynchronous function to handle the edit route
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract deviceid from the request body
        const {id, name, accesscode, type, state, value, favorite, hubid, divisionid} = req.body;

        try {
            // Use deviceInteractorPostgres to attempt edit with the provided data
            const device = await deviceInteractorPostgres.edit({deviceEditPersistence}, {token, id, name, accesscode, type, state, value, favorite, hubid, divisionid});
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

router.route('/device/delete').delete(
    // Define an asynchronous function to handle the delete route
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract deviceid from the request body
        const {id} = req.body;

        try {
            // Use deviceInteractorPostgres to attempt delete with the provided deviceid
            const device = await deviceInteractorPostgres.delete({deviceDeletePersistence}, {token, id});
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


module.exports = router;
