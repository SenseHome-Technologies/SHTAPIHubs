const jwt = require('jsonwebtoken');
const Hub = require('../../framework/db/postgresql/hubModel');
const User = require('../../framework/db/postgresql/userModel');

exports.deviceAddPersistence = async (token, hub) => {
    try {
        // Verify the token using JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify permissions of token
        if (decoded.role !== 'User') {
            return { status: 400, message: 'You are not authorized to add devices' };
        }

        // Find the hub based on the id
        const hubRecord = await Hub.findByPk(hub.id);

        // Validate if hub exists
        if (!hubRecord) {
            return { status: 400, message: 'Hub not found' };
        }

        // Find if hub already exists
        const userRecord = await User.findOne({
            where: { email: decoded.email, hubid: hubRecord.id }
        });

        // Validate if hub exists
        if (!userRecord) {
            return { status: 400, message: 'Hub not found for this user' };
        }

        if (userRecord.role !== 'Admin') {
            return { status: 400, message: 'You are not authorized to add devices' };
        }

        // Update the hub in the database
        await hubRecord.update({
            discoveryflag: 1
        });

        // Respond with success message
        return { status: 200, message: "Device will be discovered" };

    } catch (error) {
        // Handle any errors during login process
        return { status: 500, message: error.message };
    }
}