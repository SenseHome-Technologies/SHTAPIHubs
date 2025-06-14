const jwt = require('jsonwebtoken');
const User = require('../../framework/db/postgresql/userModel');
const Notification = require('../../framework/db/postgresql/notificationModel');

// Get a notification by its ID
exports.get = async (token, notification) => {
    try {
        // Verify the provided token to ensure it's valid
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user role is 'Hub'
        if (decode.role !== 'User') {
            return { status: 400, message: 'Only Users can get Notifications' };
        }

        // Verify user with hub
        const user = await User.findOne({ where: { email: decode.email, hubid: notification.hubid } });

        // Validate if user exists
        if (!user) {
            return { status: 400, message: 'No hub found for this user' };
        }

        // Get the notification record from the database using the notification ID
        const notificationRecord = await Notification.findByPk(notification.id);

        // Return an error if the notification does not exist
        if (!notificationRecord) {
            return { status: 404, message: 'Notification not found' };
        }

        return { status: 200, message: 'Notification found', data: notificationRecord };
    } catch (err) {
        return { status: 500, message: err.message };
    }
};

exports.getall = async (token, page, limit, date) => {
    const start = (page - 1) * limit;
    const end = page * limit;

    try {
        // Verify the provided token to ensure it's valid
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user role is 'User', only users can access notifications
        if (decode.role !== 'User') {
            return { status: 400, message: 'Only Users can get Notifications' };
        }

        // Retrieve all hub IDs associated with the user's email
        const userHubs = await User.findAll({
            where: { email: decode.email },
            attributes: ['hubid'], // Optimize query by selecting only hubid
        });

        // Extract hub IDs from user records
        const hubIds = userHubs.map((user) => user.hubid);

        // Check if user has any associated hubs
        if (hubIds.length === 0) {
            return { status: 404, message: 'No hubs found for the user' };
        }

        // Fetch and sort notifications
        const notifications = await Notification.findAll({
            where: { hubid: hubIds }, // Utilize Sequelize's IN query capability
            order: [[date, 'DESC']], // Change 'DESC' to 'ASC' if needed
        });

        paginatedResult = notifications.slice(start, end);

        // Return found notifications with success status
        return {
            status: 200,
            message: "Notifications found",
            data: paginatedResult,
            total: notifications.length,
            page,
            limit,
            totalPages: Math.ceil(notifications.length / limit)
        };
    } catch (err) {
        // Return error status and message in case of failure
        return { status: 500, message: err.message };
    }
};


