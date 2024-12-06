'use strict';
const { DataTypes } = require('sequelize');
const db = require('./config');

const EventCondition = db.define('EventCondition', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    eventtargetid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'eventtargets',
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
    operatorid: {
        type: DataTypes.INTEGER,
        references: {
            model: 'operators',
            key: 'id',
        },
    },
    operatorquantity: {
        type: DataTypes.INTEGER,
    },
    statementid: {
        type: DataTypes.INTEGER,
        references: {
            model: 'statements',
            key: 'id',
        },
    },
    statementquantity: {
        type: DataTypes.INTEGER,
    },
}, {
    tableName: 'eventconditions',
    timestamps: false,
});

module.exports = EventCondition;