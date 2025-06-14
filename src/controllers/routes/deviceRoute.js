'use strict';
const deviceInteractorPostgres = require('../../usecases/device/deviceInteractorPostgres');
const { deviceAddPersistence } = require('../../usecases/device/deviceAddPersistence');
const { deviceCreatePersistence } = require('../../usecases/device/deviceCreatePersistence');
const deviceGetPersistence = require('../../usecases/device/deviceGetPersistence');
const { deviceEditPersistence } = require('../../usecases/device/deviceEditPersistence');
const { deviceDeletePersistence } = require('../../usecases/device/deviceDeletePersistence');
const router = require('express').Router();


/**
 * @api {post} /api/devices/add Add a device to a hub
 * @apiName AddDevice
 * @apiGroup Device
 * @apiDescription Add a device to a hub
 *
 * @apiHeader {String} token The user's token
 * @apiParam {String} hubid The hubid to add the device to
 *
 * @apiSuccess {Object} device The device
 * @apiSuccess {Number} device.status The status of the device
 * @apiSuccess {String} device.message The message of the device
 */
router.route('/devices/add').post(
    // Define an asynchronous function to handle the add route
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract deviceid from the request body
        const { hubid } = req.body;

        try {
            // Use deviceInteractorPostgres to attempt add with the provided deviceid
            const device = await deviceInteractorPostgres.add({ deviceAddPersistence }, { token, hubid });
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
 * @api {post} /api/devices Create a device
 * @apiName CreateDevice
 * @apiGroup Device
 * @apiDescription Create a device
 *
 * @apiHeader {String} token The user's token
 * @apiParam {String} name The name of the device
 * @apiParam {String} accesscode The access code of the device
 * @apiParam {Number} type The type of the device
 * @apiParam {Number} state The state of the device
 * @apiParam {Number} value The value of the device
 *
 * @apiSuccess {Object} device The device
 * @apiSuccess {Number} device.status The status of the device
 * @apiSuccess {String} device.message The message of the device
 */
router.route('/devices').post(
    // Define an asynchronous function to handle the add route
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract deviceid from the request body
        const { name, accesscode, type, state, value } = req.body;

        try {
            // Use deviceInteractorPostgres to attempt add with the provided deviceid
            const device = await deviceInteractorPostgres.create({ deviceCreatePersistence }, { token, name, accesscode, type, state, value });
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
 * @api {get} /api/device/getall Get all devices of a hub
 * @apiName GetAllDevices
 * @apiGroup Device
 * @apiDescription Retrieve all devices of a hub by its ID
 *
 * @apiHeader {String} token The user's token
 * @apiParam {String} hubid The ID of the hub to retrieve devices from
 *
 * @apiSuccess {Object} device The devices
 * @apiSuccess {Number} device.status The status of the devices
 * @apiSuccess {String} device.message The message of the devices
 */
router.route('/devices/').get(
    // Define an asynchronous function to handle the get route
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract data from the request query
        const { page, limit, favorite } = req.query;

        console.log("ENTER HERE");

        try {
            // Use deviceInteractorPostgres to attempt get with the provided hubid
            const device = await deviceInteractorPostgres.getall({ deviceGetPersistence }, { token, page, limit, favorite });
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
 * @api {get} /api/devices/hub/:hubid Get all devices of a hub
 * @apiName GetAllDevicesOfHub
 * @apiGroup Device
 * @apiDescription Retrieve all devices of a hub by its ID
 *
 * @apiHeader {String} token The user's token
 * @apiParam {String} hubid The ID of the hub to retrieve devices from
 *
 * @apiSuccess {Object} device The devices
 * @apiSuccess {Number} device.status The status of the devices
 * @apiSuccess {String} device.message The message of the devices
 */
router.route('/devices/hub/:hubid').get(
    // Define an asynchronous function to handle the get route
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract data from the request query
        const { page, limit, favorite } = req.query;
        // Extract hubid from the request params
        const { hubid } = req.params;

        try {
            // Use deviceInteractorPostgres to attempt get with the provided hubid
            const device = await deviceInteractorPostgres.gethuball({ deviceGetPersistence }, { token, hubid, page, limit, favorite });
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
 * @api {get} /api/devices/:id Get a device by ID
 * @apiName GetDeviceByID
 * @apiGroup Device
 * @apiDescription Retrieve a device by its ID
 *
 * @apiHeader {String} token The user's token
 * @apiParam {String} id The ID of the device to retrieve
 *
 * @apiSuccess {Object} device The device
 * @apiSuccess {Number} device.status The status of the device
 * @apiSuccess {String} device.message The message of the device
 */

router.route('/devices/:id').get(
    // Define an asynchronous function to handle the get route
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract device id from the URL parameter
        const { id } = req.params;

        try {
            // Use deviceInteractorPostgres to attempt get with the provided deviceid
            const device = await deviceInteractorPostgres.get({ deviceGetPersistence }, { token, id });
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
 * @api {put} /api/devices/:id Edit a device
 * @apiName EditDevice
 * @apiGroup Device
 * @apiDescription Edit a device by its ID
 *
 * @apiHeader {String} token The user's token
 * @apiParam {String} id The ID of the device to edit
 * @apiParam {String} name The name of the device
 * @apiParam {String} accesscode The access code of the device
 * @apiParam {String} type The type of the device
 * @apiParam {String} state The state of the device
 * @apiParam {String} value The value of the device
 * @apiParam {Boolean} favorite The favorite status of the device
 * @apiParam {String} hubid The ID of the hub of the device
 * @apiParam {String} divisionid The ID of the division of the device
 *
 * @apiSuccess {Object} device The device
 * @apiSuccess {Number} device.status The status of the device
 * @apiSuccess {String} device.message The message of the device
 */
router.route('/devices/:id').put(
    // Define an asynchronous function to handle the edit route
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract deviceid from the request body
        const { id } = req.params;
        const { name, accesscode, type, state, value, favorite, hubid, divisionid } = req.body;

        try {
            // Use deviceInteractorPostgres to attempt edit with the provided data
            const device = await deviceInteractorPostgres.edit({ deviceEditPersistence }, { token, id, name, accesscode, type, state, value, favorite, hubid, divisionid });
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
 * @api {delete} /api/devices/:id Delete a device
 * @apiName DeleteDevice
 * @apiGroup Device
 * @apiDescription Delete a device by its ID
 *
 * @apiHeader {String} token The user's token
 * @apiParam {String} id The ID of the device to delete
 *
 * @apiSuccess {Object} device The device
 * @apiSuccess {Number} device.status The status of the device
 * @apiSuccess {String} device.message The message of the device
 */
router.route('/devices/:id').delete(
    // Define an asynchronous function to handle the delete route
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Extract deviceid from the request body
        const { id } = req.params;

        try {
            // Use deviceInteractorPostgres to attempt delete with the provided deviceid
            const device = await deviceInteractorPostgres.delete({ deviceDeletePersistence }, { token, id });
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

