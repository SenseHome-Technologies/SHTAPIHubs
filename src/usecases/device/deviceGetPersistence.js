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

        // Respond with success message
        return { status: 200, message: "Device found", data: deviceRecord };

    } catch (error) {
        // Handle any errors during login process
        return { status: 500, message: error.message };
    }
}

exports.gethuball = async (token, hub, page, limit, favorite) => {
    const start = (page - 1) * limit;
    const end = page * limit;

    try {
        // Verify the token using JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify userid with decoded email
        if (decoded.role !== 'User') {
            return { status: 401, message: 'Unauthorized' };
        }

        // Find the hub based on the id
        const hubRecord = await Hub.findByPk(hub.id);

        // Validate if hub exists
        if (!hubRecord) {
            return { status: 400, message: 'Hub not found' };
        }

        // Get all devices for the hub
        const devices = await Device.findAll({
            where: {
                hubid: hub.id
            }
        })

        if (favorite != undefined) {
            devices = devices.filter(device => device.favorite === favorite);
        }

        const paginatedResult = devices.slice(start, end);

        // Respond with success message
        return {
            status: 200,
            message: "Devices found",
            data: paginatedResult,
            total: devices.length,
            page,
            limit,
            totalPages: Math.ceil(devices.length / limit)
        };
    } catch (error) {
        // Handle any errors during login process
        return { status: 500, message: error.message };
    }
}

exports.getall = async (token, page, limit, favorite) => {
    const start = (page - 1) * limit;
    const end = page * limit;

    try {
        // Verify the token using JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        var devices = [];

        // Verify permissions of token
        if (decoded.role === 'Hub') {
            // Get all devices for the hub
            devices = await Device.findAll({
                where: {
                    hubid: decoded.id
                }
            })
        } else {
            // Find the hubs based on the user email
            const users = await User.findAll({
                where: { email: decoded.email }
            })

            // Validate if hub exists
            if (!users || users.length === 0) {
                return { status: 400, message: 'No hubs found for this user' };
            }

            // Extract unique hub IDs and map roles
            const hubRolesMap = users.reduce((map, user) => {
                map[user.hubid] = user.role;
                return map;
            }, {});

            // Fetch all hubs in a single query
            const hubIds = Object.keys(hubRolesMap);
            devices = await Device.findAll({
                where: {
                    hubid: hubIds
                }
            });
        }

        if (favorite != undefined) {
            devices = devices.filter(device => device.favorite === favorite);
        }

        const paginatedResult = devices.slice(start, end);

        // Respond with success message
        return {
            status: 200,
            message: "Devices found",
            data: paginatedResult,
            total: devices.length,
            page,
            limit,
            totalPages: Math.ceil(devices.length / limit)
        };
    } catch (error) {
        // Handle any errors during login process
        return { status: 500, message: error.message };
    }
}