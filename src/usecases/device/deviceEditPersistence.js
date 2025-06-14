const jwt = require('jsonwebtoken');
const User = require('../../framework/db/postgresql/userModel');
const Device = require('../../framework/db/postgresql/deviceModel');
const notificationService = require('../../services/notificationService');

exports.deviceEditPersistence = async (token, device) => {
    try {
        // Verify the token using JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the device based on the id
        const deviceRecord = await Device.findByPk(device.id);

        // Validate if device exists
        if (!deviceRecord) {
            return { status: 400, message: 'Device not found' };
        }

        // Handle user role-based checks
        if (decoded.role === 'User') {
            // Get User and validate user permissions
            const userRecord = await User.findOne({
                where: { email: decoded.email, hubid: deviceRecord.hubid }
            });

            // Validate if user exists and is authorized
            if (!userRecord) {
                return { status: 400, message: 'User not found' };
            }

            if (userRecord.role !== 'Admin') {
                // Check if only the state or value is allowed to be updated by non-admin
                if (device.name !== deviceRecord.name ||
                    device.accesscode !== deviceRecord.accesscode ||
                    device.type !== deviceRecord.type ||
                    device.favorite !== deviceRecord.favorite ||
                    device.divisionid !== deviceRecord.divisionid) {
                    return { status: 400, message: 'You are not authorized to edit this device' };
                }
            }
        }

        // Track changes for notification
        const changes = {};

        // Check what fields are actually changing
        if (device.name !== deviceRecord.name) changes.name = device.name;
        if (device.accesscode !== deviceRecord.accesscode) changes.accesscode = device.accesscode;
        if (device.type !== deviceRecord.type) changes.type = device.type;
        if (device.state !== deviceRecord.state) changes.state = device.state;
        if (device.value !== deviceRecord.value) changes.value = device.value;
        if (device.favorite !== deviceRecord.favorite) changes.favorite = device.favorite;
        if (device.divisionid !== deviceRecord.divisionid) changes.divisionid = device.divisionid;

        // Perform the update based on the device data
        var result = await deviceRecord.update({
            name: device.name,
            accesscode: device.accesscode,
            type: device.type,
            state: device.state,
            value: device.value,
            favorite: device.favorite,
            divisionid: device.divisionid
        });

        // Send notification to all users of the hub if there are actual changes
        if (Object.keys(changes).length > 0) {
            try {
                await notificationService.sendDeviceUpdateNotification(
                    token,
                    deviceRecord.hubid,
                    deviceRecord.name,
                    changes
                );
                console.log(`Notification sent for device update: ${deviceRecord.name}`);
            } catch (notificationError) {
                console.error('Error sending device update notification:', notificationError);
                // Don't fail the device update if notification fails
            }
        }

        // Respond with success message
        return { status: 200, message: "Device updated successfully", data: result };

    } catch (error) {
        // Handle any errors
        return { status: 500, message: error.message };
    }
};