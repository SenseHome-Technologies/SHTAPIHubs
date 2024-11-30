'use strict';
const { DataTypes } = require('sequelize');
const db = require('./config');

const Device = db.define('Device', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    accesscode: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    state: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    favorite: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    value: {
        type: DataTypes.FLOAT,
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'devicetypes',
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
    divisionid: {
        type: DataTypes.INTEGER,
        references: {
            model: 'divisions',
            key: 'id',
        },
    },
}, {
    tableName: 'devices',
    timestamps: false,
});


module.exports = Device;