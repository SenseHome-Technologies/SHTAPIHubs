'use strict';
const { DataTypes } = require('sequelize');
const db = require('./config');

const Statement = db.define('Statement', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    tableName: 'statements',
    timestamps: false,
});

module.exports = Statement;