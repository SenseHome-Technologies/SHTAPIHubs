'use strict';
const { DataTypes } = require('sequelize');
const db = require('./config');

const EventTarget = db.define('EventTarget', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    eventId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'events',
            key: 'id',
        },
    },
    deviceId: {
        type: DataTypes.UUID,
        references: {
            model: 'devices',
            key: 'id',
        },
    },
    deviceType: {
        type: DataTypes.INTEGER,
        references: {
            model: 'devicetypes',
            key: 'id',
        },
    },
    deviceState: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    deviceValue: {
        type: DataTypes.INTEGER,
    },
}, {
    tableName: 'eventtargets',
    timestamps: false,
});

module.exports = EventTarget;