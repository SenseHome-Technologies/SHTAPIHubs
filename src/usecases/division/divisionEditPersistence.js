const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token verification
const User = require('../../framework/db/postgresql/userModel'); // Import User model from database
const Device = require('../../framework/db/postgresql/deviceModel'); // Import User model from database
const Division = require('../../framework/db/postgresql/divisionModel'); // Import Division model from database
const { validateAccess } = require('./util/tokenUtil');

exports.divisionEditPersistence = async (token, division) => {
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
