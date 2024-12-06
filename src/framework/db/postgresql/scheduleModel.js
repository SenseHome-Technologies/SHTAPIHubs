'use strict';
const { DataTypes } = require('sequelize');
const db = require('./config');

const Schedule = db.define('Schedule', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    hour: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    weekday: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'schedules',
    timestamps: false,
});

module.exports = Schedule;