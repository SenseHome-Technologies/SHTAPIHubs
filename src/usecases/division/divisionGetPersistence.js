const Division = require('../../framework/db/postgresql/divisionModel'); 
const Device = require('../../framework/db/postgresql/deviceModel'); 
const validateUserAccess = require('../util/tokenUtils');
const { DivisionEntity } = require('../../entities/DivisionEntity'); // For domain logic mapping
exports.divisionGetPersistence = async (token, hubId) => {
    try {
        await validateUserAccess(token, hubId);

        // Get all devices for the hub
        const devices = await Device.findAll({
            where: { hubId: hubId },
            include: {
                model: Division,
                attributes: ['id', 'name', 'icon'],
                required: true
            }
        });

        if (devices.length === 0) {
            return { status: 404, message: 'No divisions found for this hub.' };
        }

        // Deduplicate divisions
        const divisions = devices.map(device => device.Division);
        const uniqueDivisions = Array.from(new Map(
            divisions.map(div => [div.id, div]) // Use Map to deduplicate by division ID
        ).values());

        // Map to DivisionEntity and return
        const divisionEntities = uniqueDivisions.map(division => new DivisionEntity({
            id: division.id,
            name: division.name,
            icon: division.icon
        }));

        return { status: 200, message: 'Divisions retrieved successfully.', data: divisionEntities };
    } catch (error) {
        console.error(error);
        return { status: 500, message: error.message };
    }
};
