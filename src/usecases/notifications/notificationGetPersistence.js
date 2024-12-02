const jwt = require('jsonwebtoken');
const Notification = require('../../framework/db/postgresql/notificationModel');

exports.notificationGetPersistence = async (token) => {
    try {
        jwt.verify(token, process.env.JWT_SECRET);

        const notifications = await Notification.findAll();
        return { status: 200, notifications };
    } catch (err) {
        return { status: 500, message: err.message };
    }
};
