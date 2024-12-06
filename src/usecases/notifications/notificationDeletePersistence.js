const jwt = require('jsonwebtoken');
const Notification = require('../../framework/db/postgresql/notificationModel');

exports.notificationDeletePersistence = async (token, id) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'Admin') {
            return { status: 403, message: 'Unauthorized' };
        }

        const notification = await Notification.findByPk(id);
        if (!notification) {
            return { status: 404, message: 'Notification not found' };
        }

        await notification.destroy();

        return { status: 200, message: 'Notification deleted' };
    } catch (err) {
        return { status: 500, message: err.message };
    }
};
