const DeviceType = require('../../framework/db/postgresql/deviceTypeModel');

exports.getdevicetypes = async () => {
    try {
        // Get device types
        const devicetypes = await DeviceType.findAll();

        // Respond with success message
        return { status: 200, message: "Device types found", data: devicetypes };

    } catch (error) {
        // Handle any errors during login process
        return { status: 500, message: error.message };
    }
}