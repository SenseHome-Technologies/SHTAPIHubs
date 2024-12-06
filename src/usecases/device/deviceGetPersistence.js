const jwt = require('jsonwebtoken');
const User = require('../../framework/db/postgresql/userModel');
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

        deviceRecord.devicetype

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

        // Verify permissions of token
        if (decoded.role === 'Hub') {  
            // Verify if hub exists
            if (decoded.id !== hub.id) {
                return { status: 400, message: 'Hub not found' };
            }
        } else {
            
            // Verify if user has hub access
            const userRecord = await User.findOne({
                where: { email: decoded.email, hubid: hub.id }
            })

            // Validate if hub exists
            if (!userRecord) {
                return { status: 400, message: 'No hub found for this user' };
            }
        }

        // Get Hub
        const hubRecord = await Hub.findByPk(hub.id); 

        // Validate if hub exists
        if (!hubRecord) {
            return { status: 400, message: 'Hub not found' };
        }

        // Get all devices for the hub
        const devices = await Device.findAll({
            where: { hubid: hub.id }
        });

         // Respond with success message
        return { status: 200, message: "Devices found", data: devices };

    } catch (error) {
        // Handle any errors during login process
        return { status: 500, message: error.message };
    }
}