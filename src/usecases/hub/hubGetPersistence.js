const jwt = require('jsonwebtoken');
const Hub = require('../../framework/db/postgresql/hubModel');
const User = require('../../framework/db/postgresql/userModel');

exports.hubGetPersistence = async (token) => {
    try {
        // Verify the token using JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

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