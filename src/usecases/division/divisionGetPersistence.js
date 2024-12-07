const { Sequelize } = require('sequelize'); 
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token verification
const User = require('../../framework/db/postgresql/userModel'); // Import User model from database
const Device = require('../../framework/db/postgresql/deviceModel'); // Import Device model from database
const Division = require('../../framework/db/postgresql/divisionModel'); // Import Division model from database

exports.divisionGetPersistence = async (token, hub) => {
    try {
        // Validate user access (token and hubid)
        const userAccess = await validateUserAccess(token, division.hubid);

        if (userAccess.status !== 200) {
            return userAccess; // If user validation fails, return the error response
        }

        // Get all devices for the hub
        const divisions = await Division.findAll({
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

        return { status: 200, message: 'Divisions retrieved successfully.', data: divisions };
    } catch (error) {
        console.error(error);
        return { status: 500, message: error.message };
    }
};
