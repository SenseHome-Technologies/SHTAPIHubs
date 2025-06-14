const jwt = require('jsonwebtoken');
const Hub = require('../../framework/db/postgresql/hubModel');
const Device = require('../../framework/db/postgresql/deviceModel');

exports.deviceCreatePersistence = async (token, device) => {
    try {
        // Verify the token using JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Validate if the role is Hub
        if (decoded.role !== 'Hub') {
            return { status: 400, message: 'Only Hubs can add devices' };
        }

        // Find the hub based on the id
        const hubRecord = await Hub.findByPk(decoded.id);

        // Validate if hub exists
        if (!hubRecord) {
            return { status: 400, message: 'Hub not found' };
        }

        // Add device to database
        await Device.create({
            name: device.name,
            accesscode: device.accesscode,
            type: device.type,
            state: device.state,
            value: device.value,
            hubid: hubRecord.id
        });

        // Update the hub in the database
        await hubRecord.update({
            discoveryflag: 0
        });

        // Respond with success message
        return { status: 200, message: "Device created successfully" };

    } catch (error) {
        // Handle any errors during login process
        return { status: 500, message: error.message };
    }
}