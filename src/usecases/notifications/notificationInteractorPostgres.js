'use strict';

const { NotificationEntity } = require('../../entities/NotificationEntity');

exports.create = async ({ notificationCreatePersistence }, { token, description, date, hubid }) => {
    try {
        // Create a new NotificationEntity with provided data
        const notification = new NotificationEntity({ description, date, hubid });

        // Validate the notification
        const validate = await notification.validate();
        if (validate.status !== 200) {
            return validate;
        }

        // Attempt to persist notification creation and retrieve result
        const result = await notificationCreatePersistence(token, notification);

        // Return the result
        return result;
    } catch (err) {

        console.error(err);
        throw err;
    }
};

exports.get = async ({ notificationGetPersistence }, { token, hubid }) => {
    try {
        // Create a new NotificationEntity with provided ID
        const notification = new NotificationEntity({ hubid });

        // Validate the notification ID
        if (!hubid) {
            return { status: 400, message: 'Notification ID and hub ID is required' };
        }

        // Attempt to retrieve the notification
        const result = await notificationGetPersistence.get(token, notification);

        // Return the result
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

exports.getall = async ({ notificationGetPersistence }, { token }) => {
    try {
        // Attempt to retrieve all notifications
        const result = await notificationGetPersistence.getall(token);

        // Return the result
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

exports.delete = async ({ notificationDeletePersistence }, { token, id, hubid }) => {
    try {
        // Create a new NotificationEntity with provided ID
        const notification = new NotificationEntity({ id, hubid });

        // Validate the notification ID
        if (!id || !hubid) {
            return { status: 400, message: 'Notification ID and hub ID is required' };
        }

        // Attempt to persist notification deletion and retrieve result
        const result = await notificationDeletePersistence(token, notification);

        // Return the result
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
};
