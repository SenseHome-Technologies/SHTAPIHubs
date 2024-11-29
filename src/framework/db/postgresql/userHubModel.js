'use strict';
const { DataTypes } = require('sequelize');
const db = require('./config');

const UserHub = db.define('UserHub', {
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
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
    role: {
        type: DataTypes.ENUM('Admin'),
        defaultValue: 'Admin',
    },
}, {
    tableName: 'userhubs',
    timestamps: false,
});


module.exports = UserHub;