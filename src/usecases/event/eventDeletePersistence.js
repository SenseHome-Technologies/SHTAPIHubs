const jwt = require('jsonwebtoken');
const db = require('../../framework/db/postgresql/config');
const User = require('../../framework/db/postgresql/userModel');
const Event = require('../../framework/db/postgresql/eventModel');
const EventTarget = require('../../framework/db/postgresql/eventTargetModel');
const EventCondition = require('../../framework/db/postgresql/eventConditionModel');
const Schedule = require('../../framework/db/postgresql/scheduleModel');
const ScheduleEvent = require('../../framework/db/postgresql/scheduleEventModel');


exports.eventDeletePersistence = async (token, event) => {
    const transaction = await db.transaction();
    try {
        // Verify the token using JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "User") {
            return { status: 400, message: 'You are not authorized to delete events' };
        }

        // Get event
        const eventRecord = await Event.findByPk(event.id);

        if (!eventRecord) {
            return { status: 404, message: 'Event not found' };
        }

        // Get User and validate user permissions
        const userRecord = await User.findOne({
            where: { email: decoded.email, hubid: eventRecord.hubid }
        });

        // Validate if user exists and is authorized
        if (!userRecord) {
            return { status: 400, message: 'No hub found for this user' };
        }

        // Verify if User is Admin
        if (userRecord.role !== 'Admin') {
            return { status: 400, message: 'You are not authorized to delete events' };
        }

        // Delete all existing EventTargets for the event
        const eventTargets = await EventTarget.findAll({ where: { eventid: eventRecord.id } });
        for (const target of eventTargets) {
            // Delete associated EventConditions
            await EventCondition.destroy({ where: { eventtargetid: target.id }, transaction });
        }

        // Delete all existing EventTargets for the event
        await EventTarget.destroy({ where: { eventid: eventRecord.id }, transaction });

        // Delete all existing ScheduleEvents for the event
        await ScheduleEvent.destroy({ where: { eventid: eventRecord.id }, transaction });

        // Delete Event
        await Event.destroy({ where: { id: event.id }, transaction });

        // Commit the transaction if all operations succeed
        await transaction.commit();

         // Respond with success message
        return { status: 200, message: "Event deleted successfully" };

    } catch (error) {
        // Rollback the transaction in case of an error
        await transaction.rollback();
        // Handle any errors during login process
        return { status: 500, message: error.message };
    }
}