const jwt = require('jsonwebtoken');
const Division = require('../../framework/db/postgresql/divisionModel'); 
const { DivisionEntity } = require('../../entities/DivisionEntity'); 

exports.divisionEditPersistence = async (token, divisionData) => {
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify permissions of token (only admins can edit divisions)
        if (decoded.role !== 'Admin') {
            return { status: 403, message: 'Only admins can edit divisions.' };
        }

        // Fetch the division to edit from the database by its ID
        const divisionToEdit = await Division.findByPk(divisionData.id);

        // Validate if the division exists
        if (!divisionToEdit) {
            return { status: 404, message: 'Division not found.' };
        }

        // Update the division data in the database
        divisionToEdit.name = divisionData.name || divisionToEdit.name;
        divisionToEdit.icon = divisionData.icon || divisionToEdit.icon;

        // Save the updated division
        await divisionToEdit.save();

        // Map the updated division data to a DivisionEntity (without hubId)
        const divisionEntity = new DivisionEntity({
            id: divisionToEdit.id,
            name: divisionToEdit.name,
            icon: divisionToEdit.icon,
        });

        // Return success response
        return { status: 200, message: 'Division updated successfully.', data: divisionEntity };
    } catch (error) {
        console.error(error);
        return { status: 500, message: error.message };
    }
};
