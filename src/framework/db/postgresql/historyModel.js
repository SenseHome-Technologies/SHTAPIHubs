'use strict';
const { DataTypes } = require('sequelize');
const db = require('./config');

const History = db.define('History', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    deviceId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'devices',
            key: 'id',
        },
    },
    deviceValue: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'histories',
    timestamps: false,
});

module.exports = History;