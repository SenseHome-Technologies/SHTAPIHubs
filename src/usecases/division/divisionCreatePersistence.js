const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token verification
const User = require('../../framework/db/postgresql/userModel'); // Import User model from database
const Device = require('../../framework/db/postgresql/deviceModel'); // Import Device model from database
const Division = require('../../framework/db/postgresql/divisionModel'); // Import Division model from database

// Function to handle the persistence logic for creating a division
exports.divisionCreatePersistence = async (token, division) => {
    try {
        // Verify the provided token to ensure it's valid
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user role is 'User'
        if (decode.role !== 'User') {
            return { status: 400, message: 'Only Users can create divisions' };
        }

        // Get userRecord from database
        const userRecord = await User.findOne({
            where: { email: decode.email, hubid: division.hubid }
        });

        // Validate if user exists and is authorized
        if (!userRecord) {
            return { status: 400, message: 'No hub found for this user' };
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
        const newDivision = await Division.create({
            name: division.name, // Set the name of the new division
            icon: division.icon, // Set the icon of the new division
        });

        // Return a success response indicating the division was created successfully
        return { status: 201, message: 'Division created successfully.', data: newDivision };
    } catch (error) {
        console.error(error); // Log any errors that occur during the process
        // Return an error response with the corresponding error message
        return { status: 500, message: error.message };
    }
};

