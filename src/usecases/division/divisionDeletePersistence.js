const { validateAdminAccess } = require('../util/tokenUtils');
const Division = require('../../framework/db/postgresql/divisionModel'); 

exports.divisionDeletePersistence = async (token, hubId, name) => {
    try {   
        validateAdminAccess(token);

        // Check if the division exists
        const existingDivision = await Device.findOne({
            where: { hubId: hubId },
            include: {
                model: Division,
                where: { name: name },
            },
        });

        if (!existingDivision) {
            return { status: 404, message: 'Division not found.' };
        }
        
        // Delete the division
        await existingDivision.destroy();

        return { status: 200, message: 'Division deleted successfully.' };
    } catch (error) {
        console.error(error);
        return { status: 500, message: error.message };
    }
};
