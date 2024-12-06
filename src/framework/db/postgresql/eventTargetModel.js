'use strict';
const { DataTypes } = require('sequelize');
const db = require('./config');

const EventTarget = db.define('EventTarget', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    eventid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'events',
            key: 'id',
        },
    },
    deviceid: {
        type: DataTypes.UUID,
        references: {
            model: 'devices',
            key: 'id',
        },
    },
    devicetype: {
        type: DataTypes.INTEGER,
        references: {
            model: 'devicetypes',
            key: 'id',
        },
    },
    devicestate: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    devicevalue: {
        type: DataTypes.INTEGER,
    },
}, {
    tableName: 'eventtargets',
    timestamps: false,
});

module.exports = EventTarget;