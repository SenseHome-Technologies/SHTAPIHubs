'use strict';

const { NotificationEntity } = require('../../entities/NotificationEntity');

exports.create = async ({ notificationCreatePersistence }, { token, description, date, hubId }) => {
    try {
        // Create a new NotificationEntity with provided data
        const notification = new NotificationEntity({ description, date, hubId });

        // Validate the notification
        if (!description || !date || !hubId) {
            return { status: 400, message: 'Description, date, and hubId are required' };
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

exports.get = async ({ notificationGetPersistence }, { token, id }) => {
    try {
        // Create a new NotificationEntity with provided ID
        const notification = new NotificationEntity({ id });

        // Validate the notification ID
        if (!id) {
            return { status: 400, message: 'Notification ID is required' };
        }

        // Attempt to retrieve the notification
        const result = await notificationGetPersistence(token, notification);

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

exports.edit = async ({ notificationEditPersistence }, { token, id, description, date }) => {
    try {
        // Create a new NotificationEntity with provided data
        const notification = new NotificationEntity({ id, description, date });

        // Validate the notification
        if (!id || !description || !date) {
            return { status: 400, message: 'Notification ID, description, and date are required' };
        }

        // Attempt to persist notification edit and retrieve result
        const result = await notificationEditPersistence(token, notification);

        // Return the result
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

exports.delete = async ({ notificationDeletePersistence }, { token, id }) => {
    try {
        // Create a new NotificationEntity with provided ID
        const notification = new NotificationEntity({ id });

        // Validate the notification ID
        if (!id) {
            return { status: 400, message: 'Notification ID is required' };
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
