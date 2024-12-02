const jwt = require('jsonwebtoken');
const Notification = require('../../framework/db/postgresql/notificationModel');
const Hub = require('../../framework/db/postgresql/hubModel');

exports.notificationCreatePersistence = async (token, notification) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'Admin') {
            return { status: 403, message: 'Unauthorized' };
        }

        const hub = await Hub.findByPk(notification.hubId);
        if (!hub) {
            return { status: 400, message: 'Hub not found' };
        }

        const newNotification = await Notification.create({
            description: notification.description,
            date: notification.date,
            hubId: notification.hubId,
        });

        return { status: 200, message: 'Notification created', notification: newNotification };
    } catch (err) {
        return { status: 500, message: err.message };
    }
};
