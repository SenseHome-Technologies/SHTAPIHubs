'use strict';

const {HubEntity} = require('../../entities/HubEntity');
const {DeviceEntity} = require('../../entities/DeviceEntity');

exports.add = async ({deviceAddPersistence}, {token, hubid}) => {
    try {
        // Create a new HubEntity with provided hubid
        const hub = new HubEntity({id: hubid});
        
        // Validate the hub
        if (!hubid) {
            return { status: 400, message: 'Hub ID is required'};
        }
        
        // Attempt to persist device add and retrieve result
        const result = await deviceAddPersistence(token, hub);
        
        // Return the aff result
        return result;
    } catch (err) {
        // Log any errors that occur during the process
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

        // Attempt to persist device create and retrieve result
        const result = await deviceCreatePersistence(token, device);

        // Return the create result
        return result;
    } catch (err) {
        // Log any errors that occur during the process
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

        // Attempt to persist device get and retrieve result
        const result = await deviceGetPersistence.get(token, device);

        // Return the get result
        return result;
    } catch (err) {
        // Log any errors that occur during the process
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err;
    }
}

exports.getall = async ({deviceGetPersistence}, {token, hubid}) => {
    try {
        // Create a new HubEntity with provided hubid
        const hub = new HubEntity({id: hubid});

        // Validate the device
        if (!hubid) {
            return { status: 400, message: 'Hub ID is required' };
        }

        // Attempt to persist device get and retrieve result
        const result = await deviceGetPersistence.getall(token, hub);

        // Return the get result
        return result;
    } catch (err) {
        // Log any errors that occur during the process
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

        // Attempt to persist device edit and retrieve result
        const result = await deviceEditPersistence(token, device);

        // Return the edit result
        return result;
    } catch (err) {
        // Log any errors that occur during the process
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

        // Attempt to persist device delete and retrieve result
        const result = await deviceDeletePersistence(token, device);

        // Return the delete result
        return result;
    } catch (err) {
        // Log any errors that occur during the process
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err;
    }
}