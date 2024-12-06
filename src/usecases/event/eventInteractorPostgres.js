'use strict';

const {HubEntity} = require('../../entities/HubEntity');
const {EventEntity} = require('../../entities/EventEntity');

exports.create = async ({eventCreatePersistence}, {token, name, type, state, hubid, eventtargets, schedules}) => {
    try {
        // Create a new EventEntity with provided eventid
        const event = new EventEntity({name, type, hubid, state, eventtargets, schedules});

        // Validate the event
        const validate = (await event.validate("create"));
        if (validate.status !== 200) {
            return validate;
        }

        // Attempt to persist event create and retrieve result
        const result = await eventCreatePersistence(token, event);

        // Return the create result
        return result;
    } catch (err) {
        // Log any errors that occur during the process
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err;
    }
}

exports.get = async ({eventGetPersistence}, {token, id}) => {
    try {
        // Create a new EventEntity with provided eventid
        const event = new EventEntity({id});

        // Validate the event
        if (!id) {
            return { status: 400, message: 'Event ID is required' };
        }

        // Attempt to persist event get and retrieve result
        const result = await eventGetPersistence.get(token, event);

        // Return the get result
        return result;
    } catch (err) {
        // Log any errors that occur during the process
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err;
    }
}

exports.getall = async ({eventGetPersistence}, {token, hubid}) => {
    try {
        // Create a new HubEntity with provided hubid
        const hub = new HubEntity({id: hubid});

        if (!hubid) {
            return { status: 400, message: 'Hub ID is required' };
        }

        // Attempt to persist event get and retrieve result
        const result = await eventGetPersistence.getall(token, hub);

        // Return the get result
        return result;
    } catch (err) {
        // Log any errors that occur during the process
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err;
    }
}

exports.edit = async ({eventEditPersistence}, {token, id, name, type, state, hubid, eventtargets, schedules}) => {
    try {
        // Create a new EventEntity with provided data
        const event = new EventEntity({id, name, type, state, hubid, eventtargets, schedules});

        // Validate the event
        const validate = (await event.validate("edit"));
        if (validate.status !== 200) {
            return validate;
        }

        // Attempt to persist event edit and retrieve result
        const result = await eventEditPersistence(token, event);

        // Return the edit result
        return result;
    } catch (err) {
        // Log any errors that occur during the process
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err;
    }
}

exports.delete = async ({eventDeletePersistence}, {token, id}) => {
    try {
        // Create a new EventEntity with provided eventid
        const event = new EventEntity({id});

        // Validate the event
        if (!id) {
            return { status: 400, message: 'Event ID are required' };
        }

        // Attempt to persist event delete and retrieve result
        const result = await eventDeletePersistence(token, event);

        // Return the delete result
        return result;
    } catch (err) {
        // Log any errors that occur during the process
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err;
    }
}