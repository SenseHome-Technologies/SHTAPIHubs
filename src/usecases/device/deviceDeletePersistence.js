const jwt = require('jsonwebtoken');
const User = require('../../framework/db/postgresql/userModel');
const Device = require('../../framework/db/postgresql/deviceModel');

exports.deviceDeletePersistence = async (token, device) => {
    try {
        // Verify the token using JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify permissions of token
        if (decoded.role !== 'User') {
            return { status: 400, message: 'You are not authorized to delete this device' };
        }

        // Get the device based on the id
        const deviceRecord = await Device.findByPk(device.id);

        // Validate if device exists
        if (!deviceRecord) {
            return { status: 400, message: 'Device not found' };
        }

        // Get User and validate user permissions
        const userRecord = await User.findOne({
            where: { email: decoded.email, hubid: deviceRecord.hubid }
        });

        // Validate if user exists and is authorized
        if (!userRecord) {
            return { status: 400, message: 'User not found' };
        }

        if (userRecord.role !== 'Admin') {
            return { status: 400, message: 'You are not authorized to delete this device' };
        }

        // Delete the device from the database
        await deviceRecord.destroy();

        // Respond with success message
        return { status: 200, message: "Device deleted successfully" };

    } catch (error) {
        // Handle any errors
        return { status: 500, message: error.message };
    }
};