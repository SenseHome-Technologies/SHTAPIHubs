const jwt = require('jsonwebtoken');
const User = require('../../framework/db/postgresql/userModel');
const Hub = require('../../framework/db/postgresql/hubModel');
const Event = require('../../framework/db/postgresql/eventModel');
const EventTarget = require('../../framework/db/postgresql/eventTargetModel');
const EventCondition = require('../../framework/db/postgresql/eventConditionModel');
const Schedule = require('../../framework/db/postgresql/scheduleModel');
const ScheduleEvent = require('../../framework/db/postgresql/scheduleEventModel');

exports.get = async (token, event) => {
    try {
        // Verify the token using JWT
        jwt.verify(token, process.env.JWT_SECRET);

        // Get the event
        const eventRecord = await Event.findOne({
            where: { id: event.id },
            include: [
                {
                    model: EventTarget,
                    as: 'targets',
                    include: [
                        {
                            model: EventCondition,
                            as: 'conditions',
                        },
                    ],
                },
                {
                    model: ScheduleEvent,
                    as: 'schedules',
                    include: [
                        {
                            model: Schedule,
                            as: 'schedule',
                        },
                    ],
                },
            ],
        });

        // Verify if event exists
        if (!eventRecord) {
            return { status: 400, message: 'Event not found' };
        }

        // Extract schedules
        const schedules = event.schedules.map(se => se.schedule);

        // Update the schedules
        eventRecord.schedules = schedules;

         // Respond with success message
        return { status: 200, message: "Event found", data: eventRecord };

    } catch (error) {
        // Handle any errors during login process
        return { status: 500, message: error.message };
    }
}

exports.getall = async (token, hub) => {
    try {
        // Verify the token using JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify permissions of token
        if (decoded.role === 'Hub') {
            // Verify if hub exists
            if (decoded.id !== hub.id) {
                return { status: 400, message: 'Hub not found' };
            }
        } else {
            // Verify if user has hub access
            const userRecord = await User.findOne({
                where: { email: decoded.email, hubid: hub.id }
            })

            // Validate if hub exists
            if (!userRecord) {
                return { status: 400, message: 'No hub found for this user' };
            }
        }

        // Get Hub
        const hubRecord = await Hub.findByPk(hub.id);

        // Validate if hub exists
        if (!hubRecord) {
            return { status: 400, message: 'Hub not found' };
        }

        // Get all events
        const events = await Event.findAll({
            where: { hubid: hubRecord.id },
            include: [
                {
                    model: EventTarget,
                    as: 'targets',
                    include: [
                        {
                            model: EventCondition,
                            as: 'conditions',
                        },
                    ],
                },
                {
                    model: ScheduleEvent,
                    as: 'schedules',
                    include: [
                        {
                            model: Schedule,
                            as: 'schedule',
                        },
                    ],
                },
            ],
        });

        // Update the schedules
        events.forEach(e => {
            e.schedules = e.schedules.map(se => se.schedule);
        });

        // Respond with success message
        return { status: 200, message: "Events found", data: events };

    } catch (error) {
        // Handle any errors during login process
        return { status: 500, message: error.message };
    }
}