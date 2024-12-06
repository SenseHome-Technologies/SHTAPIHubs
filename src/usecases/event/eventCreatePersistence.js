const jwt = require('jsonwebtoken');
const db = require('../../framework/db/postgresql/config');
const User = require('../../framework/db/postgresql/userModel');
const Event = require('../../framework/db/postgresql/eventModel');
const EventTarget = require('../../framework/db/postgresql/eventTargetModel');
const EventCondition = require('../../framework/db/postgresql/eventConditionModel');
const Schedule = require('../../framework/db/postgresql/scheduleModel');
const ScheduleEvent = require('../../framework/db/postgresql/scheduleEventModel');


exports.eventCreatePersistence = async (token, event) => {
    const transaction = await db.transaction();

    try {
        // Verify the token using JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify permissions of token
        if (decoded.role !== 'User') {
            return { status: 400, message: 'You are not authorized to create events' };
        }

        // Get User and validate user permissions
        const userRecord = await User.findOne({
            where: { email: decoded.email, hubid: event.hubid }
        });

        // Validate if user exists and is authorized
        if (!userRecord) {
            return { status: 400, message: 'No hub found for this user' };
        }

        // Verify if User is Admin
        if (userRecord.role !== 'Admin') {
            return { status: 400, message: 'You are not authorized to create events' };
        }

        // Create a new Event entry
        const eventRecord = await Event.create({
            name: event.name,
            type: event.type,
            state: event.state ? 1 : 0,
            hubid: event.hubid
        }, { transaction });

        // Create a new EventTarget entry for each event target
        for (const target of event.eventtargets) {
            const eventTargetRecord = await EventTarget.create({
                eventid: eventRecord.id,
                deviceid: target.deviceid,
                devicetype: target.devicetype,
                decicestate: target.devicestate ? 1 : 0,
                devicevalue: target.devicevalue
            }, { transaction });

            // Create a new EventCondition entry for each event condition
            for (const condition of target.eventconditions) {
                await EventCondition.create({
                    eventtargetid: eventTargetRecord.id,
                    deviceid: condition.deviceid,
                    devicetype: condition.devicetype,
                    devicestate: condition.devicestate ? 1 : 0,
                    devicevalue: condition.devicevalue,
                    operatorid: condition.operatorid,
                    operatorquantity: condition.operatorquantity,
                    statementid: condition.statementid,
                    statementquantity: condition.statementquantity
                }, { transaction });
            }
        }

        if (event.schedules.length) {
            // Get all schedules
            const schedules = await Schedule.findAll();

            // Create a new ScheduleEvent entry for each schedule
            for (const schedule of event.schedules) {
                var scheduleRecord = schedules.find(s => s.hour === schedule.hour && s.weekday === schedule.weekday);

                await ScheduleEvent.create({
                    eventid: eventRecord.id,
                    scheduleid: scheduleRecord.id
                }, { transaction });
            }
        }

        // Commit the transaction if all operations succeed
        await transaction.commit();

         // Respond with success message
        return { status: 200, message: "Event created successfully" };

    } catch (error) {
        // Rollback the transaction in case of an error
        await transaction.rollback();
        // Handle any errors during login process
        return { status: 500, message: error.message };
    }
}