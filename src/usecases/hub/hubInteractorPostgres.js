'use strict';

const { UserEntity } = require('../../entities/UserEntity');
const { HubEntity } = require('../../entities/HubEntity');

exports.login = async ({ hubLoginPersistence }, { id }) => {
    try {
        // Create a new HubEntity with provided hubid
        const hub = new HubEntity({ id });

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

exports.add = async ({ hubAddPersistence }, { token, id, email }) => {
    try {
        // Create a new UserEntity with provided hubid and user email
        const user = new UserEntity({ hubid: id, email });

        // Validate the user
        const validation = await user.validate('create');
        if (validation.status !== 200) {
            return validation;
        }

        // Attempt to persist hub add and retrieve result
        const result = await hubAddPersistence(token, user);

        // Return the add result
        return result;
    } catch (err) {
        // Log any errors that occur during the process
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err;
    }
}

exports.get = async ({ hubGetPersistence }, { token, id }) => {
    try {
        // Create a new HubEntity with provided hubid
        const hub = new HubEntity({ id });

        // Validate the hub
        if (!id) {
            return { status: 400, message: 'Hub ID is required' };
        }

        // Attempt to persist hub get and retrieve result
        const result = await hubGetPersistence.get(token, hub);

        // Return the get result
        return result;
    } catch (err) {
        // Log any errors that occur during the process
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err;
    }
}

exports.getall = async ({ hubGetPersistence }, { token, page, limit }) => {
    try {
        limit = parseInt(limit) || 10;
        page = parseInt(page) || 1;

        // Attempt to persist hub getall and retrieve result
        const result = await hubGetPersistence.getall(token, page, limit);

        // Return the get result
        return result;
    } catch (err) {
        // Log any errors that occur during the process
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err;
    }
}

exports.edit = async ({ hubEditPersistence }, { token, id, name, users }) => {
    try {
        // Create a new HubEntity with provided hubid
        const hub = new HubEntity({ id, name, users });

        // Validate the hub
        const validation = await hub.validate();
        if (validation.status !== 200) {
            return validation;
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

exports.delete = async ({ hubDeletePersistence }, { token, id, type }) => {
    try {
        // Create a new HubEntity with provided hubid
        const hub = new HubEntity({ id, type });

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