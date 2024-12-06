const Division = require('../../framework/db/postgresql/divisionModel'); 
// const Device = require('../../framework/db/postgresql/deviceModel');
const { validateAdminAccess } = require('../util/tokenUtils');
const { DivisionEntity } = require('../../entities/DivisionEntity'); 

exports.divisionCreatePersistence = async (token, hubId, divisionData) => {
    try {
        validateAdminAccess(token);
        
        // Check if a division with the same name already exists for this hub
        const existingDivision = await Device.findOne({
            where: { hubId: hubId },
            include: {
                model: Division,
                where: { name: divisionData.name },
            },
        });

        if (existingDivision) {
            return { status: 409, message: 'A division with the same name already exists in this hub.' };
        }

        // Create a new division
        const newDivision = await Division.create({
            name: divisionData.name,
            icon: divisionData.icon,
        });

        // Map the result to a DivisionEntity
        const divisionEntity = new DivisionEntity({
            id: newDivision.id,
            name: newDivision.name,
        });

        return { status: 201, message: 'Division created successfully.', data: divisionEntity };
    } catch (error) {
        console.error(error);
        return { status: 500, message: error.message };
    }
};
