'use strict';

const {HubEntity} = require('../../entities/HubEntity');
const {DeviceEntity} = require('../../entities/DeviceEntity');

exports.add = async ({deviceAddPersistence}, {token, id}) => {
    try {
        // Create a new HubEntity with provided hubid
        const hub = new HubEntity({id});
        
        // Validate the hub
        if (!id) {
            return { status: 400, message: 'Hub ID is required'};
        }
        
        // Attempt to persist device add and retrieve result
        const result = await deviceAddPersistence(token, hub);
        
        // Return the login result
        return result;
    } catch (err) {
        // Log any errors that occur during the login process
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err;
    }
}

exports.create = async ({deviceCreatePersistence}, {token, name, accesscode, type, state, value}) => {
    try {
        // Create a new deviceEntity with provided deviceid
        const device = new DeviceEntity({name, accesscode, state, value, type});

        // Validate the device
        if (!name, !accesscode) {
            return { status: 400, message: 'Device name and accesscode is required' };
        }

        // Attempt to persist device login and retrieve result
        const result = await deviceCreatePersistence(token, device);

        // Return the login result
        return result;
    } catch (err) {
        // Log any errors that occur during the login process
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err;
    }
}

exports.get = async ({deviceGetPersistence}, {token, id}) => {
    try {
        // Create a new deviceEntity with provided deviceid
        const device = new DeviceEntity({id});

        // Validate the device
        if (!id) {
            return { status: 400, message: 'Device ID is required' };
        }

        // Attempt to persist device login and retrieve result
        const result = await deviceGetPersistence.get(token, device);

        // Return the login result
        return result;
    } catch (err) {
        // Log any errors that occur during the login process
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err;
    }
}

exports.getall = async ({deviceGetPersistence}, {token, id}) => {
    try {
        // Create a new HubEntity with provided hubid
        const hub = new HubEntity({id});

        // Attempt to persist device login and retrieve result
        const result = await deviceGetPersistence.getall(token, hub);

        // Return the login result
        return result;
    } catch (err) {
        // Log any errors that occur during the login process
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err;
    }
}

exports.edit = async ({deviceEditPersistence}, {token, id, name, accesscode, type, state, value, favorite, hubid, divisionid}) => {
    try {
        // Create a new deviceEntity with provided data
        const device = new DeviceEntity({id, name, accesscode, type, state, value, favorite, hubid, divisionid});

        // Validate the device
        if (!id, !name, !accesscode, !type, !hubid) {
            return { status: 400, message: 'Device ID, name, accesscode, type, hubid are required' };
        }

        console.log(device);

        // Attempt to persist device login and retrieve result
        const result = await deviceEditPersistence(token, device);

        // Return the login result
        return result;
    } catch (err) {
        // Log any errors that occur during the login process
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err;
    }
}

exports.delete = async ({deviceDeletePersistence}, {token, id}) => {
    try {
        // Create a new deviceEntity with provided deviceid
        const device = new DeviceEntity({id});

        // Validate the device
        if (!id) {
            return { status: 400, message: 'Device ID are required' };
        }

        // Attempt to persist device login and retrieve result
        const result = await deviceDeletePersistence(token, device);

        // Return the login result
        return result;
    } catch (err) {
        // Log any errors that occur during the login process
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err;
    }
}