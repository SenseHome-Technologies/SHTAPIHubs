'use strict';
const { DataTypes } = require('sequelize');
const db = require('./config');

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
}, {
    tableName: 'hubs',
    timestamps: false
});


module.exports = Hub;
