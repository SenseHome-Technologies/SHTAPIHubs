const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token verification
const User = require('../../framework/db/postgresql/userModel'); // Import User model from database
const Device = require('../../framework/db/postgresql/deviceModel'); // Import Device model from database
const Division = require('../../framework/db/postgresql/divisionModel'); // Import Division model from database
const { validateAccess } = require('./util/tokenUtil');

// Function to handle the persistence logic for creating a division
exports.divisionCreatePersistence = async (token, division) => {
    try {
        // Validate user access (token and hubid)
        const userAccess = await validateAccess("Admin", token, division.hubid);

        if (userAccess.status !== 200) {
            return userAccess; // If user validation fails, return the error response
        }

        // Check if a division with the same name already exists in the database
        const existingDivision = await Division.findOne({
            where: { name: division.name },
            include: {
                model: Device,
                as: 'devices',
                where: { hubid: division.hubid }
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
        });

        // Return a success response indicating the division was created successfully
        return { status: 201, message: 'Division created successfully.', data: result };
    } catch (error) {
        console.error(error); // Log any errors that occur during the process
        // Return an error response with the corresponding error message
        return { status: 500, message: error.message };
    }
};

