'use strict';

const {HubEntity} = require('../../entities/HubEntity');

exports.login = async ({hubLoginPersistence}, {id}) => {
    try {
        // Create a new HubEntity with provided hubid
        const hub = new HubEntity({id});

        // Validate the hub
        if (!id) {
            return { status: 400, message: 'Hub ID is required' };
        }

        // Attempt to persist hub login and retrieve result
        const result = await hubLoginPersistence(hub);

        // Return the login result
        return result;
    } catch (err) {
        // Log any errors that occur during the login process
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err;
    }
}

exports.add = async ({hubAddPersistence}, {token, id}) => {
    try {
        // Create a new HubEntity with provided hubid
        const hub = new HubEntity({id});

        // Validate the hub
        if (!id) {
            return { status: 400, message: 'Hub ID is required'};
        }

        // Attempt to persist hub add and retrieve result
        const result = await hubAddPersistence(token, hub);

        // Return the add result
        return result;
    } catch (err) {
        // Log any errors that occur during the process
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err;
    }
}

exports.get = async ({hubGetPersistence}, {token}) => {
    try {
        // Attempt to persist hub get and retrieve result
        const result = await hubGetPersistence(token);

        // Return the get result
        return result;
    } catch (err) {
        // Log any errors that occur during the process
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err;
    }
}

exports.edit = async ({hubEditPersistence}, {token, id, name, users}) => {
    try {
        // Create a new HubEntity with provided hubid
        const hub = new HubEntity({id, name, users});

        // Validate the hub
        if (!id, !name, !users) {
            return { status: 400, message: 'Hub ID, name and users are required' };
        }

        // Attempt to persist hub edit and retrieve result
        const result = await hubEditPersistence(token, hub);

        // Return the edit result
        return result;
    } catch (err) {
        // Log any errors that occur during the process
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err;
    }
}

exports.delete = async ({hubDeletePersistence}, {token, id, type}) => {
    try {
        // Create a new HubEntity with provided hubid
        const hub = new HubEntity({id, type});

        // Validate the hub
        if (!id, !type) {
            return { status: 400, message: 'Hub ID and type are required' };
        }

        // Attempt to persist hub delete and retrieve result
        const result = await hubDeletePersistence(token, hub);

        // Return the delete result
        return result;
    } catch (err) {
        // Log any errors that occur during the process
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err;
    }
}