const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token verification
const User = require('../../framework/db/postgresql/userModel'); // Import User model from database
const Division = require('../../framework/db/postgresql/divisionModel'); // Import Division model from database

// Function to handle the persistence logic for creating a division
exports.divisionCreatePersistence = async (token, division) => {
    try {
        // Decode the token using JWT
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        // Verify if the user role is 'Hub'
        if (decode.role !== 'User') {
            return { status: 400, message: 'Only Users can create Divisions' };
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

        // Check if a division with the same name already exists in the database
        const existingDivision = await Division.findOne({
            where: {
                name: division.name,
                hubid: division.hubid
            }
        })

        // If a division already exists, return a conflict status
        if (existingDivision) {
            return { status: 409, message: 'Division already exists.' };
        }

        // Create a new division in the database with the provided name and icon
        const result = await Division.create({
            name: division.name, // Set the name of the new division
            icon: division.icon, // Set the icon of the new division
            hubid: division.hubid // Set the hubid of the new division
        });

        // Return a success response indicating the division was created successfully
        return { status: 201, message: 'Division created successfully.', data: result };
    } catch (error) {
        console.error(error); // Log any errors that occur during the process
        // Return an error response with the corresponding error message
        return { status: 500, message: error.message };
    }
};

