'use strict';
const { DataTypes } = require('sequelize');
const db = require('./config');

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
    hubid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'hubs',
            key: 'id',
        },
    },
}, {
    tableName: 'divisions',
    timestamps: false,
});

module.exports = Division;