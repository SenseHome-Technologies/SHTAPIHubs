'use strict';
const { DataTypes } = require('sequelize');
const db = require('./config');

const User = db.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    hubid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'hubs',
            key: 'id',
        },
    },
    role: {
        type: DataTypes.ENUM('Admin'),
        defaultValue: 'Admin',
    },
}, {
    tableName: 'users',
    timestamps: false,
});


module.exports = User;