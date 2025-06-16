const jwt = require('jsonwebtoken');
const Hub = require('../../framework/db/postgresql/hubModel');
const User = require('../../framework/db/postgresql/userModel');
const DeviceType = require('../../framework/db/postgresql/deviceTypeModel');
const Device = require('../../framework/db/postgresql/deviceModel');

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

        const firstDeviceType = await DeviceType.findOne({
            order: [['id', 'ASC']]
        });

        // Create a new device entry in the database
        await Device.create({
            name: 'New Device',
            accesscode: 'NEWDEVICE',
            type: firstDeviceType.id,
            state: 0,
            value: 0,
            hubid: hubRecord.id
        });

        // Update the hub in the database
        // await hubRecord.update({
        //     discoveryflag: 1
        // });

        // Respond with success message
        return { status: 200, message: "Device will be discovered" };

    } catch (error) {
        // Handle any errors during login process
        return { status: 500, message: error.message };
    }
}