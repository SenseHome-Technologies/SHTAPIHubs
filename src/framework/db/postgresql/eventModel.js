'use strict';
const { DataTypes } = require('sequelize');
const db = require('./config');

const Event = db.define('Event', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    state: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'eventtypes',
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
}, {
    tableName: 'events',
    timestamps: false,
});

module.exports = Event;