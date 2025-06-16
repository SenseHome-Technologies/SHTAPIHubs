const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token verification
const User = require('../../framework/db/postgresql/userModel'); // Import User model from database
const Division = require('../../framework/db/postgresql/divisionModel'); // Import Division model from database

exports.divisionEditPersistence = async (token, division) => {
    try {
        // Decode the token using JWT
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        // Verify if the user role is 'Hub'
        if (decode.role !== 'User') {
            return { status: 400, message: 'Only Users can edit Divisions' };
        }

        // Find user associated with the provided email and hubid
        const userRecord = await User.findOne({
            where: { email: decode.email, hubid: division.hubid }
        });

        // Check if user exists
        if (!userRecord) {
            return { status: 404, message: 'User not found' };
        }

        // Handle 'Admin' type access
        if (userRecord.role !== 'Admin') {
            return { status: 403, message: 'Only Admins can perform this action' };
        }

        // Fetch the division to edit from the database by its ID
        const divisionRecord = await Division.findByPk(division.id);

        // Validate if the division exists
        if (!divisionRecord) {
            return { status: 404, message: 'Division not found.' };
        }

        var result = await divisionRecord.update({
            name: division.name,
            icon: division.icon
        });

        // Return success response
        return { status: 200, message: 'Division updated successfully.', data: result };
    } catch (error) {
        console.error(error);
        return { status: 500, message: error.message };
    }
};
