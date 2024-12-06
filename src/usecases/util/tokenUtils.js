const jwt = require('jsonwebtoken');
const User = require('../../framework/db/postgresql/userModel');

/**
 * Validates if the user has access to a specific hub.
 * Decodes the token and verifies access based on user role and hub association.
 * @param {string} token - The JWT token.
 * @param {number} hubId - The hub ID to check access for.
 * @returns {Promise<void>} Resolves if access is granted, otherwise rejects with an error message.
 */
exports.validateUserAccess = async (token, hubId) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.role) {
        throw { status: 400, message: 'User role not defined.' };
    }

    if (decoded.role !== 'Admin') {
        const userRecord = await User.findOne({
            where: { email: decoded.email, hubId: hubId },
        });

        if (!userRecord) {
            throw { status: 404, message: 'User does not have access to this hub.' };
        }
    }
};

/**
 * Validates if the user has admin permissions.
 * Decodes the token and verifies if the user is an admin.
 * @param {string} token - The JWT token.
 * @returns {void} Resolves if user is an admin, otherwise rejects with an error message.
 */
exports.validateAdminAccess = (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.role || decoded.role !== 'Admin') {
        throw { status: 403, message: 'Only admins have access.' };
    }
};
