const jwt = require('jsonwebtoken');
const Hub = require('../../framework/db/postgresql/hubModel');
const User = require('../../framework/db/postgresql/userModel');

exports.get = async (token, hub) => {
    try {
        // Verify the token using JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify permissions of token
        if (decoded.role !== 'User') {
            return { status: 400, message: 'You are not authorized to get this hub' };
        }

        // Find the hubS based on the user email
        const user = await User.findOne({
            where: { email: decoded.email, hubid: hub.id }
        })

        // Validate if hub exists
        if (!user) {
            return { status: 400, message: 'No hub found for this user' };
        }

        // Get hub
        const hubRecord = await Hub.findByPk(hub.id);

        // Validate if hub exists
        if (!hubRecord) {
            return { status: 400, message: 'Hub not found' };
        }

        // Set role in hub
        hubRecord.role = user.role;

         // Respond with success message
        return { status: 200, message: "Hub found", data: hubRecord };

    } catch (error) {
        // Handle any errors during login process
        return { status: 500, message: error.message };
    }
}

exports.getall = async (token, user) => {
    try {
        // Verify the token using JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify permissions of token
        if (decoded.role !== 'User') {
            return { status: 400, message: 'You are not authorized to get this hub' };
        }

        // Verify userid with decoded email
        if (decoded.email !== user.email) {
            return { status: 401, message: 'Unauthorized' };
        }

        // Find the hubS based on the user email
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
        const hubs = await Hub.findAll({
            where: { id: hubIds }
        });

        // Validate if hub exists
        if (!hubs || hubs.length === 0) {
            return { status: 400, message: 'No hubs found' };
        }

        // Map roles to hubs in the response
        const hubsWithRoles = hubs.map(hub => ({
            ...hub.toJSON(), // Convert Sequelize instance to plain object
            role: hubRolesMap[hub.id] // Attach the role from the map
        }));

         // Respond with success message
        return { status: 200, message: "Hub found", data: hubsWithRoles };

    } catch (error) {
        // Handle any errors during login process
        return { status: 500, message: error.message };
    }
}