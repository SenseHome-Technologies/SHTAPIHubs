const jwt = require('jsonwebtoken');
const Hub = require('../../framework/db/postgresql/hubModel');

exports.hubLoginPersistence = async (hub) => {
    try {
        // Search for the hub in the database
        const hubRecord = await Hub.findByPk(hub.id);

        // Validate if hub exists
        if (!hubRecord) {
            return { status: 400, message: 'Hub not found' };
        }

        // Generate a JWT token for the hub
        const token = jwt.sign({ id: hubRecord.id, role: 'Hub' }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Return success response with token
        return { status: 200, message: 'Hub logged in successfully', token: token };
    } catch (error) {
        // Handle any errors during login process
        return { status: 500, message: error.message };
    }
}