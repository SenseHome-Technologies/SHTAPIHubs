const jwt = require('jsonwebtoken');
const Notification = require('../../framework/db/postgresql/notificationModel');
const Hub = require('../../framework/db/postgresql/hubModel');

exports.notificationCreatePersistence = async (token, notification) => {
    try {
        // Verify the provided token to ensure it's valid
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user role is 'Hub'
        if (decode.role !== 'Hub') {
            return { status: 400, message: 'Only Hubs can create Notifications' };
        }

        // Ensure the hub ID from the token matches the notification hub ID
        if (decode.id !== notification.hubid) {
            return { status: 400, message: 'Hub ID mismatch' };
        }

        // Retrieve the hub from the database using the hub ID
        const hub = await Hub.findByPk(notification.hubid);
        if (!hub) {
            return { status: 400, message: 'Hub not found' };
        }

        // Create a new notification entry in the database
        const newNotification = await Notification.create({
            description: notification.description,
            date: notification.date,
            hubid: notification.hubid,
        });

        // Return success status and the created notification
        return { status: 200, message: 'Notification created', data: newNotification };
    } catch (err) {
        // Return error status and message in case of failure
        return { status: 500, message: err.message };
    }
};

