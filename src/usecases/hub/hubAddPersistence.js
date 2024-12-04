const jwt = require('jsonwebtoken');
const Hub = require('../../framework/db/postgresql/hubModel');
const User = require('../../framework/db/postgresql/userModel');

exports.hubAddPersistence = async (token, user) => {
    try {
        // Verify the token using JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify userid with decoded email
        if (decoded.email !== user.email || decoded.role !== 'User') {
            return { status: 401, message: 'Unauthorized' };
        }

        // Find the hub based on the id
        const hubRecord = await Hub.findByPk(user.hubid);

        // Validate if hub exists
        if (!hubRecord) {
            return { status: 400, message: 'Hub not found' };
        }

        // Find if hub already exists
        const userRecord = await User.findOne({
            where: {
                hubid: hubRecord.id
            }
        });

        // Validate if hub exists
        if (userRecord) {
            return { status: 400, message: 'Hub already exists, please ask your admin to add you to the hub' };
        }

        // Create a new UserHub entry
        await User.create({
            email: decoded.email,
            hubid: hubRecord.id,
            role: 'Admin'
        })

         // Respond with success message
        return { status: 200, message: "Hub added successfully" };

    } catch (error) {
        // Handle any errors during login process
        return { status: 500, message: error.message };
    }
}