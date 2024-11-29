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
    accessCode: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    state: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    favorite: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    hubId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'hubs',
            key: 'id',
        },
    },
    divisionId: {
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