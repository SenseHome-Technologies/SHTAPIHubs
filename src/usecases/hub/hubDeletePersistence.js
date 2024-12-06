const jwt = require('jsonwebtoken');
const Hub = require('../../framework/db/postgresql/hubModel');
const User = require('../../framework/db/postgresql/userModel');

exports.hubDeletePersistence = async (token, hub) => {
    try {
        // Verify the token using JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify permissions of token
        if (decoded.role !== 'User') {
            return { status: 400, message: 'You are not authorized to delete this hub' };
        }

        // Find the hub based on the id
        const hubRecord = await Hub.findByPk(hub.id);

        // Validate if hub exists
        if (!hubRecord) {
            return { status: 400, message: 'Hub not found' };
        }

        // Find if hub already exists
        const userRecord = await User.findOne({
            where: { email: decoded.email, hubid: hubRecord.id }
        });

        // Validate if hub exists
        if (!userRecord) {
            return { status: 400, message: 'Hub not found for this user' };
        }

        // Delete the hub
        if (hub.type === 'all' && userRecord.role === 'Admin') {
            // Delete all users in the hub
            await User.destroy({
                where: { hubid: hubRecord.id }
            });
        }
        else {
            // Delete a specific user in the hub
            await User.destroy({
                where: { hubid: hubRecord.id, email: decoded.email }
            });
        }

         // Respond with success message
        return { status: 200, message: "Hub deleted successfully" };

    } catch (error) {
        // Handle any errors during login process
        return { status: 500, message: error.message };
    }
}