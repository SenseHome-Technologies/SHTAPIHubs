const jwt = require('jsonwebtoken');
const Hub = require('../../framework/db/postgresql/hubModel');
const User = require('../../framework/db/postgresql/userModel');

exports.hubEditPersistence = async (token, hub) => {
    try {
        // Verify the token using JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify permissions of token
        if (decoded.role !== 'User') {
            return { status: 400, message: 'You are not authorized to edit this hub' };
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
        if (userRecord.role !== 'Admin') {
            return { status: 400, message: 'You are not authorized to edit this hub'};
        }

        // Find all users in the hub
        const existingUsers = await User.findAll({
            where: { hubid: hubRecord.id }
        });

        
        const existingUserMap = new Map(
            existingUsers.map(user => [user.email, { id: user.id, role: user.role }])
        );

        // Determine users to add, update, or delete
        const listToAdd = [];
        const listToUpdate = [];
        const listToDelete = [];

        for (const incomingUser of hub.users) {
            const existingUser = existingUserMap.get(incomingUser.email);
            if (existingUser) {
                if (existingUser.role !== incomingUser.role) {
                    listToUpdate.push({ id: existingUser.id, role: incomingUser.role });
                }
                existingUserMap.delete(incomingUser.email); // Mark as processed
            } else {
                listToAdd.push({
                    email: incomingUser.email,
                    hubid: hubRecord.id,
                    role: incomingUser.role
                });
            }
        }

        // Remaining users in the map are to be deleted
        for (const [email, user] of existingUserMap) {
            listToDelete.push(user.id);
        }

        // Perform bulk operations
        if (listToAdd.length > 0) {
            await User.bulkCreate(listToAdd);
        }
        if (listToUpdate.length > 0) {
            await Promise.all(
                listToUpdate.map(user =>
                    User.update({ role: user.role }, { where: { id: user.id } })
                )
            );
        }
        if (listToDelete.length > 0) {
            await User.destroy({ where: { id: listToDelete } });
        }

        // Respond with success message
        return { status: 200, message: 'Hub updated successfully' };

    } catch (error) {
        // Handle any errors during login process
        return { status: 500, message: error.message };
    }
}