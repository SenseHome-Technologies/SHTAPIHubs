const jwt = require('jsonwebtoken');
const User = require('../../../framework/db/postgresql/userModel');

/**
 * Validates if the user has access to a specific hub.
 * Decodes the token and verifies access based on user role and hub association.
 * @param {string} token - The JWT token.
 * @param {number} hubId - The hub ID to check access for.
 * @returns {Promise<void>} Resolves if access is granted, otherwise rejects with an error message.
 */
exports.validateUserAccess = async (token, hubid) => {
    try {
        // Decode the token
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        // Check if user exists and has same hubid as division
        const userRecord = await User.findOne({
            where: { email: decode.email, hubid: hubid }
        });

        // Validate user existence
        if (!userRecord) {
            return { status: 404, message: 'User not found' };
        }

        // Validate role is 'User'
        if (userRecord.role !== 'User') {
            return { status: 403, message: 'Only Users can perform this action' };
        }

        return { status: 200, message: 'Access validated', user: userRecord };
    } catch (error) {
        return { status: 401, message: 'Invalid token or access denied' };
    }
};


/**
 * Validates if the user has admin permissions.
 * Decodes the token and verifies if the user is an admin.
 * @param {string} token - The JWT token.
 * @returns {void} Resolves if user is an admin, otherwise rejects with an error message.
 */
exports.validateAdminAccess = async (token, hubid) => {
    try {
        // Decode the token
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        // Check if user exists and has same hubid as division
        const userRecord = await User.findOne({
            where: { email: decode.email, hubid: hubid }
        });

        // Validate user existence
        if (!userRecord) {
            return { status: 404, message: 'User not found' };
        }

        // Validate role is 'Admin'
        if (userRecord.role !== 'Admin') {
            return { status: 403, message: 'Only Admins can perform this action' };
        }

        return { status: 200, message: 'Access validated', user: userRecord };
    } catch (error) {
        return { status: 401, message: 'Invalid token or access denied' };
    }
};
