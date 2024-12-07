const jwt = require('jsonwebtoken');
const User = require('../../framework/db/postgresql/userModel');
const Notification = require('../../framework/db/postgresql/notificationModel');

exports.notificationDeletePersistence = async (token, notification) => {
    try {
        // Verify the provided token to ensure it's valid
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user role is 'User'
        if (decode.role !== 'User') {
            return { status: 400, message: 'Only Users can delete notifications' };
        }

        // Retrieve user record from the database using the decoded email and hubid
        const userRecord = await User.findOne({
            where: { email: decode.email, hubid: notification.hubid }
        });

        // Validate if user exists and is authorized to delete notifications
        if (!userRecord) {
            return { status: 400, message: 'No hub found for this user' };
        }

        // Ensure the user has the 'Admin' role
        if (userRecord.role !== 'Admin') {
            return { status: 403, message: 'Unauthorized' };
        }

        // Fetch the notification record from the database using the notification ID
        const notificationRecord = await Notification.findByPk(notification.id);

        // Return an error if the notification does not exist
        if (!notificationRecord) {
            return { status: 404, message: 'Notification not found' };
        }

        // Delete the notification from the database
        await notificationRecord.destroy();

        // Return a success message upon successful deletion
        return { status: 200, message: 'Notification deleted' };
    } catch (err) {
        // Handle any errors that occur during the process
        return { status: 500, message: err.message };
    }
};

