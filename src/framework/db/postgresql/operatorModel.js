'use strict';
const { DataTypes } = require('sequelize');
const db = require('./config');

const Operator = db.define('Operator', {
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
    tableName: 'operators',
    timestamps: false,
});

module.exports = Operator;