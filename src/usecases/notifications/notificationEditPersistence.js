const jwt = require('jsonwebtoken');
const Notification = require('../../framework/db/postgresql/notificationModel');

exports.notificationEditPersistence = async (token, notification) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'Admin') {
            return { status: 403, message: 'Unauthorized' };
        }

        const existingNotification = await Notification.findByPk(notification.id);
        if (!existingNotification) {
            return { status: 404, message: 'Notification not found' };
        }

        await existingNotification.update({
            description: notification.description,
            date: notification.date,
        });

        return { status: 200, message: 'Notification updated', notification: existingNotification };
    } catch (err) {
        return { status: 500, message: err.message };
    }
};
