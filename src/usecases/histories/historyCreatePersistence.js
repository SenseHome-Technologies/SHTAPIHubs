const jwt = require('jsonwebtoken');
const History = require('../../framework/db/postgresql/historyModel');
const Hub = require('../../framework/db/postgresql/hubModel');

exports.historyCreatePersistence = async (token, history) => {
    try {
        // Verify the provided token to ensure it's valid
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user role is 'Hub'
        if (decode.role !== 'Hub') {
            return { status: 400, message: 'Only Hubs can create Histories' };
        }

        // Ensure the hub ID from the token matches the history hub ID
        if (decode.id !== history.hubid) {
            return { status: 400, message: 'Hub ID mismatch' };
        }

        // Retrieve the hub from the database using the hub ID and check if it exists
        const hub = await Hub.findByPk(history.hubid);
        if (!hub) {
            return { status: 400, message: 'Hub not found' };
        }

        // Create a new history entry in the database
        const result = await History.create({
            deviceid: history.deviceid,
            devicevalue: history.devicevalue,
            date: history.date,
            hubid: history.hubid,
        });

        // Return success status and the created history
        return { status: 200, message: 'History created', data: result };
    } catch (err) {
        // Return error status and message in case of failure
        return { status: 500, message: err.message };
    }
};

