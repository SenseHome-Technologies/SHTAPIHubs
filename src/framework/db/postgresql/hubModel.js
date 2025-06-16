'use strict';
const { DataTypes } = require('sequelize');
const db = require('./config');

const User = require('./userModel');

const Hub = db.define('Hub', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    discoveryflag: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    role: {
        type: DataTypes.ENUM('Hub'),
        defaultValue: 'Hub',
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
}, {
    tableName: 'hubs',
    timestamps: false,
});

// Hub has many User
Hub.hasMany(User, {
    foreignKey: 'hubid',
    as: 'users',
});

// User belongs to Hub
User.belongsTo(Hub, {
    foreignKey: 'hubid',
    as: 'hubs',
});

module.exports = Hub;

