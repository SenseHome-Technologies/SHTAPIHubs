const { Sequelize } = require('sequelize');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token verification
const User = require('../../framework/db/postgresql/userModel'); // Import User model from database
const Device = require('../../framework/db/postgresql/deviceModel'); // Import Device model from database
const Division = require('../../framework/db/postgresql/divisionModel'); // Import Division model from database
const { validateAccess } = require('./util/tokenUtil');

exports.get = async (token, hub) => {
    try {
        // Validate user access (token and hubid)
        const userAccess = await validateAccess("User", token, hub.id);

        if (userAccess.status !== 200) {
            return userAccess; // If user validation fails, return the error response
        }

        // Get all devices for the hub
        const result = await Division.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('Division.id')), 'id'],
                'name',
                'icon',
            ], // Fetch unique divisions
            include: [
                {
                    model: Device,
                    as: 'devices',
                    attributes: [], // Do not include device attributes in the result
                    where: {
                        hubid: hub.id,
                    },
                },
            ],
            raw: true, // Return plain objects instead of Sequelize instances
        });

        return { status: 200, message: 'Divisions retrieved successfully.', data: result };
    } catch (error) {
        console.error(error);
        return { status: 500, message: error.message };
    }
};


exports.all = async (token) => {
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        // Validate user access (token and hubid)
        const userAccess = await validateAccess("User", token, hub.id);

        if (userAccess.status !== 200) {
            return userAccess; // If user validation fails, return the error response
        }

        const users = await User.findAll({
            where: { email: decode.email },
        })

        // Extract unique hub IDs and map roles
            const hubRolesMap = users.reduce((map, user) => {
                map[user.hubid] = user.role;
                return map;
            }, {});

        // Get all devices for the hub
        const hubIds = Object.keys(hubRolesMap);
        const result = await Division.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('Division.id')), 'id'],
                'name',
                'icon',
            ], // Fetch unique divisions
            include: [
                {
                    model: Device,
                    as: 'devices',
                    attributes: [], // Do not include device attributes in the result
                    where: {
                        hubid: hubIds,
                    },
                },
            ],
            raw: true, // Return plain objects instead of Sequelize instances
        });

        return { status: 200, message: 'Divisions retrieved successfully.', data: result };
    } catch (error) {
        console.error(error);
        return { status: 500, message: error.message };
    }
};
