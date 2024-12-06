'use strict';
const { DataTypes } = require('sequelize');
const db = require('./config');

const EventTarget = require('./eventTargetModel');
const EventCondition = require('./eventConditionModel');
const Schedule = require('./scheduleModel');
const ScheduleEvent = require('./scheduleEventModel'); 

const Event = db.define('Event', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    state: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'eventtypes',
            key: 'id',
        },
    },
    hubid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'hubs',
            key: 'id',
        },
    },
}, {
    tableName: 'events',
    timestamps: false,
});

// Event has many EventTargets
Event.hasMany(EventTarget, {
    foreignKey: 'eventid',
    as: 'targets',
});

// EventTarget belongs to Event
EventTarget.belongsTo(Event, {
    foreignKey: 'eventid',
    as: 'event',
});

// EventTarget has many EventConditions
EventTarget.hasMany(EventCondition, {
    foreignKey: 'eventtargetid',
    as: 'conditions',
});

// EventCondition belongs to EventTarget
EventCondition.belongsTo(EventTarget, {
    foreignKey: 'eventtargetid',
    as: 'target',
});

// Event has many ScheduleEvents
Event.hasMany(ScheduleEvent, {
    foreignKey: 'eventid',
    as: 'schedules',
});

// ScheduleEvent belongs to Event
ScheduleEvent.belongsTo(Event, {
    foreignKey: 'eventid',
    as: 'event',
});

// ScheduleEvent belongs to Schedule
ScheduleEvent.belongsTo(Schedule, {
    foreignKey: 'scheduleid',
    as: 'schedule',
});

// Schedule has many ScheduleEvents
Schedule.hasMany(ScheduleEvent, {
    foreignKey: 'scheduleid',
    as: 'schedules',
});

module.exports = Event;