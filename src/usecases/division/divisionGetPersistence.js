const jwt = require('jsonwebtoken');
const Division = require('../../framework/db/postgresql/divisionModel'); 
const Device = require('../../framework/db/postgresql/deviceModel'); 
const User = require('../../framework/db/postgresql/userModel'); 
const { DivisionEntity } = require('../../entities/DivisionEntity'); // For domain logic mapping

exports.divisionGetPersistence = async (token, hubId) => {
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify user role
        if (!decoded.role) {
            return { status: 400, message: 'User role not defined.' };
        }

        // Check if user has access to the hub
        if (decoded.role !== 'Admin') {
            const userRecord = await User.findOne({
                where: { email: decoded.email, hubId: hubId }
            });

            if (!userRecord) {
                return { status: 404, message: 'User does not have access to this hub.' };
            }
        }

        // Get all devices associated with the hub to find related divisions
        const devices = await Device.findAll({
            where: { hubId: hubId },
            include: {
                model: Division,  // Join Division to get the divisions related to the devices
                attributes: ['id', 'name', 'icon'],  // Only fetch required attributes
                required: true  // Ensure only devices linked to divisions are fetched
            }
        });

        // Handle if no devices (and therefore no divisions) are found
        if (devices.length === 0) {
            return { status: 404, message: 'No divisions found for this hub.' };
        }

        // Extract the divisions (one division per device)
        const divisions = devices.map(device => device.Division);

        // Map to DivisionEntities and return
        const divisionEntities = divisions.map(division => new DivisionEntity({
            id: division.id,
            name: division.name,
            icon: division.icon,
        }));

        return { status: 200, message: 'Divisions retrieved successfully.', data: divisionEntities };
    } catch (error) {
        console.error(error);
        return { status: 500, message: error.message };
    }
};
