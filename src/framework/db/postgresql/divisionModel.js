'use strict';
const { DataTypes } = require('sequelize');
const db = require('./config');

const Device = require('./deviceModel');

const Division = db.define('Division', {
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
    tableName: 'divisions',
    timestamps: false,
});

// Division has many Device
Division.hasMany(Device, {
    foreignKey: 'divisionid',
    as: 'devices',
});

// Device belongs to Division
Device.belongsTo(Division, {
    foreignKey: 'divisionid',
    as: 'division',
});

module.exports = Division;