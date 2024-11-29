'use strict';
const { DataTypes } = require('sequelize');
const db = require('./config');

const ScheduleEvent = db.define('ScheduleEvent', {
    scheduleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'schedules',
            key: 'id',
        },
    },
    eventId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'events',
            key: 'id',
        },
    },
}, {
    tableName: 'scheduleevents',
    timestamps: false,
});

module.exports = ScheduleEvent;