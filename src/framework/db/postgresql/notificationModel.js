'use strict';
const { DataTypes } = require('sequelize');
const db = require('./config');

const Notification = db.define('Notification', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    hubId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'hubs',
            key: 'id',
        },
    },
}, {
    tableName: 'notifications',
    timestamps: false,
});

module.exports = Notification;
