const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token verification
const User = require('../../framework/db/postgresql/userModel'); // Import User model from database
const Division = require('../../framework/db/postgresql/divisionModel'); // Import Division model from database

exports.get = async (token, hub) => {
    try {
        // Decode the token using JWT
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        // Verify if the user role is 'Hub'
        if (decode.role !== 'User') {
            return { status: 400, message: 'Only Users can get Divisions' };
        }

        // Find user associated with the provided email and hubid
        const userRecord = await User.findOne({
            where: { email: decode.email, hubid: hub.id }
        });

        // Check if user exists
        if (!userRecord) {
            return { status: 404, message: 'User not found' };
        }

        // Get all devices for the hub
        const result = await Division.findAll({
            where: {
                hubid: hub.id
            }
        });

        return { status: 200, message: 'Divisions retrieved successfully.', data: result };
    } catch (error) {
        console.error(error);
        return { status: 500, message: error.message };
    }
};