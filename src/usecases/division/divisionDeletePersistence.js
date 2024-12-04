const jwt = require('jsonwebtoken');
const Division = require('../../framework/db/postgresql/divisionModel'); 

exports.divisionDeletePersistence = async (token, name) => {
    try {   
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify permissions of token
        if (decoded.role !== 'Admin') {
            return { status: 403, message: 'Only admins can delete divisions.' };
        }

        // Check if the division exists
        const division = await Division.findOne({
            where: { name: name }  // Search for the division by name
        });

        if (!division) {
            return { status: 404, message: 'Division not found.' };
        }
        
        // Delete the division
        await division.destroy();

        return { status: 200, message: 'Division deleted successfully.' };
    } catch (error) {
        console.error(error);
        return { status: 500, message: error.message };
    }
};
