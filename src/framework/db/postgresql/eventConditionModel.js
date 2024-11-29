'use strict';
const { DataTypes } = require('sequelize');
const db = require('./config');

const EventCondition = db.define('EventCondition', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    eventTargetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'eventtargets',
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
    operatorId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'operators',
            key: 'id',
        },
    },
    operatorQuantity: {
        type: DataTypes.INTEGER,
    },
    statementId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'statements',
            key: 'id',
        },
    },
    statementQuantity: {
        type: DataTypes.INTEGER,
    },
}, {
    tableName: 'eventconditions',
    timestamps: false,
});

module.exports = EventCondition;