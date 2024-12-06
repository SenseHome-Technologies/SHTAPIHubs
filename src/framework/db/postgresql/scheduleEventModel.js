'use strict';
const { DataTypes } = require('sequelize');
const db = require('./config');

const ScheduleEvent = db.define('ScheduleEvent', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    scheduleid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'schedules',
            key: 'id',
        },
    },
    eventid: {
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