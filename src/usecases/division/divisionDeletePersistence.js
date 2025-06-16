const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token verification
const db = require('../../framework/db/postgresql/config');
const User = require('../../framework/db/postgresql/userModel'); // Import User model from database
const Device = require('../../framework/db/postgresql/deviceModel'); // Import Device model from database
const Division = require('../../framework/db/postgresql/divisionModel'); // Import Division model from database


exports.divisionDeletePersistence = async (token, division) => {
    const transaction = await db.transaction();
    try {
        // Decode the token using JWT
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        // Verify if the user role is 'Hub'
        if (decode.role !== 'User') {
            return { status: 400, message: 'Only Users can delete Divisions' };
        }

        // Get the division based on the id
        const divisionRecord = await Division.findByPk(division.id);

        // Validate if division exists
        if (!divisionRecord) {
            return { status: 400, message: 'Division not found' };
        }

        // Find user associated with the provided email and hubid
        const userRecord = await User.findOne({
            where: { email: decode.email, hubid: divisionRecord.hubid }
        })

        // Check if user exists
        if (!userRecord) {
            return { status: 404, message: 'User not found' };
        }

        // Handle 'Admin' type access
        if (userRecord.role !== 'Admin') {
            return { status: 403, message: 'Only Admins can perform this action' };
        }

        // Update all devices to set divisionid to null
        await Device.update(
            { divisionid: null },
            {
                where: { divisionid: division.id },
                transaction,
            }
        );

        // Delete the division
        await divisionRecord.destroy({ transaction });

        // Commit the transaction
        await transaction.commit();

        return { status: 200, message: 'Division deleted successfully.' };
    } catch (error) {
        // Rollback the transaction in case of error
        await transaction.rollback();
        console.error(error);
        return { status: 500, message: error.message };
    }
};
