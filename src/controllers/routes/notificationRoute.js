'use strict';
const notificationInteractorPostgres = require('../../usecases/notifications/notificationInteractorPostgres');
const { notificationCreatePersistence } = require('../../usecases/notifications/notificationCreatePersistence');
const notificationGetPersistence = require('../../usecases/notifications/notificationGetPersistence');
const { notificationDeletePersistence } = require('../../usecases/notifications/notificationDeletePersistence');
const router = require('express').Router();

/**
 * @api {post} /api/notifications Create a notification
 * @apiName CreateNotification
 * @apiGroup Notification
 * @apiDescription Create a new notification
 *
 * @apiHeader {String} token The user's token
 * @apiParam {String} description The description of the notification
 * @apiParam {Date} date The date of the notification
 * @apiParam {UUID} hubid The ID of the hub associated with the notification
 *
 * @apiSuccess {Object} notification The created notification
 * @apiSuccess {Number} notification.status The status of the notification
 * @apiSuccess {String} notification.message The message of the notification
 */
router.route('/notifications').post(
    // Asynchronous function to handle notification creation
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];

        // Extract notification details from request body
        const { description, date, hubid } = req.body;

        try {
            // Attempt to create a notification using the interactor
            const notification = await notificationInteractorPostgres.create(
                { notificationCreatePersistence },
                { token, description, date, hubid }
            );

            // Send the response with the status and notification data
            res.status(notification.status).send(notification);
        } catch (err) {
            // Log any errors that occur during the creation process
            console.log(err);
            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
);

/**
 * @api {get} /api/notifications/:hubid Get all notifications for a hub
 * @apiName GetAllNotifications
 * @apiGroup Notification
 * @apiDescription Retrieve all notifications for a hub by its ID
 *
 * @apiHeader {String} token The user's token
 * @apiParam {String} hubid The ID of the hub to retrieve notifications for
 *
 * @apiSuccess {Object} notifications The notifications
 * @apiSuccess {Number} notifications.status The status of the notifications
 * @apiSuccess {String} notifications.message The message of the notifications
 */
router.route('/notifications/:hubid').get(
    // Asynchronous function to handle the notification get request
    async (req, res) => {
        // Get token from request headers
        const token = req.headers['token'];
        // Get hubid from request body
        const { hubid } = req.params;

        try {
            // Retrieve notifications for the given hubid
            const notifications = await notificationInteractorPostgres.get({ notificationGetPersistence }, { token, hubid });
            // Send response with status and notifications data
            res.status(notifications.status).send(notifications);
        } catch (err) {
            // Log any errors
            console.log(err);
            // Propagate the error
            throw err;
        }
    }
);

/**
 * @api {get} /api/notification Get all notifications for a hub
 * @apiName GetAllNotifications
 * @apiGroup Notification
 * @apiDescription Retrieve all notifications for a hub by its ID
 *
 * @apiHeader {String} token The user's token
 *
 * @apiSuccess {Object} notifications The notifications
 * @apiSuccess {Number} notifications.status The status of the notifications
 * @apiSuccess {String} notifications.message The message of the notifications
 */
router.route('/notifications').get(
    // Asynchronous function to handle the notification get request
    async (req, res) => {
        // Get token from request headers
        const token = req.headers['token'];
        const { page, limit, date } = req.query;

        try {
            // Retrieve notifications for the given hubid
            const notifications = await notificationInteractorPostgres.getall({ notificationGetPersistence }, { token, page, limit, date });
            // Send response with status and notifications data
            res.status(notifications.status).send(notifications);
        } catch (err) {
            // Log any errors
            console.log(err);
            // Propagate the error
            throw err;
        }
    }
);

/**
 * @api {delete} /api/notifications/:id Delete a notification
 * @apiName DeleteNotification
 * @apiGroup Notification
 * @apiDescription Delete a notification by its ID
 *
 * @apiHeader {String} token The user's token
 * @apiParam {String} id The ID of the notification to delete
 * @apiParam {String} hubid The ID of the hub the notification belongs to
 *
 * @apiSuccess {Object} notification The notification
 * @apiSuccess {Number} notification.status The status of the delete operation
 * @apiSuccess {String} notification.message The message of the delete operation
 */
router.route('/notifications/:id').delete(
    async (req, res) => {
        const token = req.headers['token'];
        const { id } = req.params;
        const { hubid } = req.body;

        try {
            // Delete the notification and retrieve the result
            const notification = await notificationInteractorPostgres.delete({ notificationDeletePersistence }, { token, id, hubid });

            // Send the response with the status and notification data
            res.status(notification.status).send(notification);
        } catch (err) {
            // Log any errors that occur during the delete process
            console.log(err);
            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
);

module.exports = router;
