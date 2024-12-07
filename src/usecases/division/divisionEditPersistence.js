const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token verification
const User = require('../../framework/db/postgresql/userModel'); // Import User model from database
const Device = require('../../framework/db/postgresql/deviceModel'); // Import User model from database
const Division = require('../../framework/db/postgresql/divisionModel'); // Import Division model from database

exports.divisionEditPersistence = async (token, division) => {
    try {
        // Verify the provided token to ensure it's valid
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user role is 'User'
        if (decode.role !== 'User') {
            return { status: 400, message: 'Only Users can edit divisions' };
        }

        // Get userRecord from database
        const userRecord = await User.findOne({
            where: { email: decode.email, hubid: division.hubid }
        });

        // Validate if user exists and is authorized
        if (!userRecord) {
            return { status: 400, message: 'No hub found for this user' };
        }

        // Check if the division exists
        const existingDivision = await Division.findOne({
            where: { name: division.name },
            include: {
                model: Device,
                as: 'devices',
                where: { hubid: division.hubid }
            }
        })
        
        // Validate if the division exists
        if (!existingDivision) {
            return { status: 400, message: 'Division not found.' };
        }

        // Fetch the division to edit from the database by its ID
        const divisionRecord = await Division.findByPk(division.id);

        // Validate if the division exists
        if (!divisionRecord) {
            return { status: 404, message: 'Division not found.' };
        }

        await divisionRecord.update({
            name: division.name,
            icon: division.icon
        });

        // Return success response
        return { status: 200, message: 'Division updated successfully.', data: divisionRecord };
    } catch (error) {
        console.error(error);
        return { status: 500, message: error.message };
    }
};
