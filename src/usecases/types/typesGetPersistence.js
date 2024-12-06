const jwt = require('jsonwebtoken');
const DeviceType = require('../../framework/db/postgresql/deviceTypeModel');
const EventType = require('../../framework/db/postgresql/eventTypeModel');
const Operator = require('../../framework/db/postgresql/operatorModel');
const Statment = require('../../framework/db/postgresql/statementModel');

exports.getdevicetypes = async () => {
    try {
        // Get device types
        const devicetypes = await DeviceType.findAll();

        // Respond with success message
        return { status: 200, message: "Device types found", data: devicetypes };

    } catch (error) {
        // Handle any errors during login process
        return { status: 500, message: error.message };
    }
}

exports.geteventtypes = async () => {
    try {
        // Get event types
        const eventtypes = await EventType.findAll();

        // Respond with success message
        return { status: 200, message: "Event types found", data: eventtypes };

    } catch (error) {
        // Handle any errors during login process
        return { status: 500, message: error.message };
    }
}

exports.getoperators = async () => {
    try {
        // Get operators
        const operators = await Operator.findAll();

        // Respond with success message
        return { status: 200, message: "Operators found", data: operators };

    } catch (error) {
        // Handle any errors during login process
        return { status: 500, message: error.message };
    }
}

exports.getstatments = async () => {
    try {
        // Get statments
        const statments = await Statment.findAll();

        // Respond with success message
        return { status: 200, message: "Statments found", data: statments };

    } catch (error) {
        // Handle any errors during login process
        return { status: 500, message: error.message };
    }
}