const jwt = require('jsonwebtoken');
const User = require('../../../framework/db/postgresql/userModel');

/**
 * Validates access based on the provided type, token, and hub ID.
 * 
 * @param {string} type - The type of access to validate ('Hub' or 'Admin').
 * @param {string} token - The JWT token to decode and verify access rights.
 * @param {string} hubid - The ID of the hub associated with the user.
 * 
 * @returns {Promise<Object>} A promise that resolves to an object containing
 * the status code and message indicating the result of the validation.
 * 
 * @throws {Error} Throws an error if the token is invalid or access is denied.
 * 
 * - Returns { status: 400, message: 'Only Hubs can perform this action' } if
 *   the type is 'Hub' and the token role is not 'Hub'.
 * - Returns { status: 404, message: 'User not found' } if no user is associated
 *   with the provided email and hub ID.
 * - Returns { status: 403, message: 'Only Admins can perform this action' } if
 *   the type is 'Admin' and the user's role is not 'Admin'.
 * - Returns { status: 200 } if access is successfully validated.
 * - Returns { status: 401, message: 'Invalid token or access denied' } for any
 *   other token errors or access denial.
 */
exports.validateAccess = async (type, token, hubid) => {
    try {
        // Decode the token using JWT
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        // Handle 'Hub' type access
        if (type === 'Hub') {
            // Validate that the token role is 'Hub'
            if (decode.role !== 'Hub') {
                return { status: 400, message: 'Only Hubs can perform this action' };
            }
            return { status: 200 };
        }

        // Find user associated with the provided email and hubid
        const userRecord = await User.findOne({
            where: { email: decode.email, hubid: hubid }
        });

        // Check if user exists
        if (!userRecord) {
            return { status: 404, message: 'User not found' };
        }

        // Handle 'Admin' type access
        if (type === 'Admin' && userRecord.role !== 'Admin') {
            return { status: 403, message: 'Only Admins can perform this action' };
        }

        // Access is validated
        return { status: 200 };
    } catch (error) {
        // Return error response for invalid token or access denial
        return { status: 401, message: 'Invalid token or access denied' };
    }
};

