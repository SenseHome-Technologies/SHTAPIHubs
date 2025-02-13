'use strict';
const { DataTypes } = require('sequelize');
const db = require('./config');

const DeviceType = db.define('DeviceType', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    icon: {
        type: DataTypes.STRING(255),
    },
}, {
    tableName: 'devicetypes',
    timestamps: false,
});

module.exports = DeviceType;