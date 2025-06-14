const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token verification
const db = require('../../framework/db/postgresql/config');
const User = require('../../framework/db/postgresql/userModel'); // Import User model from database
const Device = require('../../framework/db/postgresql/deviceModel'); // Import Device model from database
const Division = require('../../framework/db/postgresql/divisionModel'); // Import Division model from database
const { validateAccess } = require('./util/tokenUtil');


exports.divisionDeletePersistence = async (token, division) => {
    const transaction = await db.transaction();
    try {
        // Validate user access (token and hubid)
        const userAccess = await validateAccess("Admin", token, division.hubid);

        if (userAccess.status !== 200) {
            return userAccess; // If user validation fails, return the error response
        }

        // Check if the division exists
        const existingDivision = await Division.findOne({
            where: { id: division.id },
            include: {
                model: Device,
                as: 'devices',
                where: { hubid: division.hubid }
            }
        })

        // Validate if the division exists
        if (!existingDivision) {
            return { status: 404, message: 'Division not found.' };
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
        await existingDivision.destroy({ transaction });

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
