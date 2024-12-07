const jwt = require('jsonwebtoken');
const User = require('../../framework/db/postgresql/userModel');
const Device = require('../../framework/db/postgresql/deviceModel');
const History = require('../../framework/db/postgresql/historyModel');

// Get a history by its ID
exports.historyGetPersistence = async (token, history) => {
    try {
        // Verify the provided token to ensure it's valid
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user role is 'Hub'
        if (decode.role !== 'User') {
            return { status: 400, message: 'Only Users can get Histories' };
        }

        // Verify user with hub
        const user = await User.findOne({ where: { email: decode.email, hubid: history.hubid } });

        // Validate if user exists
        if (!user) {
            return { status: 400, message: 'No hub found for this user' };
        }

        // Get Devices by hub
        const devices = await Device.findAll({ where: { hubid: history.hubid }, attributes: ['id'] });

        // Extract device IDs
        const deviceIds = devices.map((device) => device.id);

        // Check if user has any associated hubs
        if (deviceIds.length === 0) {
            return { status: 404, message: 'No devices found for the user' };
        }

        // Fetch history for all associated hub IDs
        const histories = await History.findAll({
            where: { deviceid: deviceIds }, // Utilize Sequelize's IN query capability
        });

        return { status: 200, message: 'Notification found', data: histories };
    } catch (err) {
        return { status: 500, message: err.message };
    }
};