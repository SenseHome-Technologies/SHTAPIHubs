const jwt = require('jsonwebtoken');
const Division = require('../../framework/db/postgresql/divisionModel'); 
const { DivisionEntity } = require('../../entities/DivisionEntity'); 

exports.divisionCreatePersistence = async (token, divisionData) => {
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify permissions of token
        if (decoded.role !== 'Admin') {
            return { status: 403, message: 'Only admins can create divisions.' };
        }

        // Check for an existing division with the same name or ID in the same hub
        const existingDivision = await Division.findOne({
            where: {
                name: divisionData.name,
                hubId: divisionData.hubId, // Ensure uniqueness within the same hub
            },
        });

        if (existingDivision) {
            return { status: 409, message: 'A division with the same name already exists in this hub.' };
        }

        // Persist the division in the database
        const newDivision = await Division.create({
            name: divisionData.name,
            icon: divisionData.icon,
            hubId: divisionData.hubId, // Ensure hubId is passed in divisionData
        });

        // Map the result to a DivisionEntity
        const divisionEntity = new DivisionEntity({
            id: newDivision.id,
            name: newDivision.name,
            hubId: newDivision.hubId,
        });

        return { status: 201, message: 'Division created successfully.', data: divisionEntity };
    } catch (error) {
        console.error(error);
        return { status: 500, message: error.message };
    }
};
