'use strict';
const { DataTypes } = require('sequelize');
const db = require('./config');

const EventType = db.define('EventType', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    tableName: 'eventtypes',
    timestamps: false,
});


module.exports = EventType;