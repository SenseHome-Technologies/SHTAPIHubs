'use strict';
const notificationInteractorPostgres = require('../../usecases/notification/notificationInteractorPostgres');
const { notificationCreatePersistence } = require('../../usecases/notification/notificationCreatePersistence');
const { notificationGetPersistence } = require('../../usecases/notification/notificationGetPersistence');
const { notificationEditPersistence } = require('../../usecases/notification/notificationEditPersistence');
const { notificationDeletePersistence } = require('../../usecases/notification/notificationDeletePersistence');
const router = require('express').Router();

router.route('/notification/create').post(
    async (req, res) => {
        const token = req.headers['token'];
        const { description, date, hubId } = req.body;

        try {
            const notification = await notificationInteractorPostgres.create({ notificationCreatePersistence }, { token, description, date, hubId });
            res.status(notification.status).send(notification);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
);

router.route('/notification/get').get(
    async (req, res) => {
        const token = req.headers['token'];

        try {
            const notifications = await notificationInteractorPostgres.get({ notificationGetPersistence }, { token });
            res.status(notifications.status).send(notifications);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
);

router.route('/notification/edit').put(
    async (req, res) => {
        const token = req.headers['token'];
        const { id, description, date } = req.body;

        try {
            const notification = await notificationInteractorPostgres.edit({ notificationEditPersistence }, { token, id, description, date });
            res.status(notification.status).send(notification);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
);

router.route('/notification/delete').delete(
    async (req, res) => {
        const token = req.headers['token'];
        const { id } = req.body;

        try {
            const notification = await notificationInteractorPostgres.delete({ notificationDeletePersistence }, { token, id });
            res.status(notification.status).send(notification);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
);

module.exports = router;
