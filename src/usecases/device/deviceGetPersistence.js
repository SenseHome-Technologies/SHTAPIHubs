const jwt = require('jsonwebtoken');
const Hub = require('../../framework/db/postgresql/hubModel');
const Device = require('../../framework/db/postgresql/deviceModel');    

exports.get = async (token, device) => {
    try {
        // Verify the token using JWT
        jwt.verify(token, process.env.JWT_SECRET);

        // verify if device exists
        const deviceRecord = await Device.findByPk(device.id);
        if (!deviceRecord) {
            return { status: 400, message: 'Device not found' };
        }

         // Respond with success message
        return { status: 200, message: "Device found", data: deviceRecord };

    } catch (error) {
        // Handle any errors during login process
        return { status: 500, message: error.message };
    }
}

exports.getall = async (token, hub) => {
    try {
        // Verify the token using JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Determine the hub ID
        const hubId = decoded.role === 'User' 
            ? hub.id 
            : (await Hub.findByPk(decoded.id))?.id;

        if (!hubId) {
            return { status: 400, message: 'Hub not found' };
        }

        // Get all devices for the hub
        const devices = await Device.findAll({
            where: { hubid: hubId }
        });

         // Respond with success message
        return { status: 200, message: "Devices found", data: devices };

    } catch (error) {
        // Handle any errors during login process
        return { status: 500, message: error.message };
    }
}