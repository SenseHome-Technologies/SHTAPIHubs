'use strict';

const { HubEntity } = require('../../entities/HubEntity');
const { DivisionEntity } = require('../../entities/DivisionEntity');

exports.create = async ({ divisionCreatePersistence }, { token, name, icon, hubid }) => {
    try {
        // Create a new divisionEntity with provided data
        const division = new DivisionEntity({ name, icon, hubid });

        // Validate the division
        const validationResult = await division.validate('create');

        if (validationResult.status !== 200) {
            return validationResult;
        }

        // Attempt to persist division create and retrieve result
        const result = await divisionCreatePersistence(token, division);

        return result;
    } catch (err) {
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err;
    }
}

exports.delete = async ({ divisionDeletePersistence }, { token, id }) => {
    try {
        // Create a new divisionEntity with provided data
        const division = new DivisionEntity({ id });

        // Check if the id is present
        const validationResult = await division.validate('delete');

        if (validationResult.status !== 200) {
            return validationResult;
        }

        // Attempt to persist division delete and retrieve result
        const result = await divisionDeletePersistence(token, division);

        return result;
    } catch (error) {
        console.error(error);
        // Return the error to be handled by the caller
        return { status: 500, message: error.message };
    }
};

exports.edit = async ({ divisionEditPersistence }, { token, id, name, icon, hubid }) => {
    try {
        // Create a new divisionEntity with provided data
        const division = new DivisionEntity({ id, name, icon, hubid });

        // Validate the division
        const validationResult = await division.validate('edit');

        if (validationResult.status !== 200) {
            return validationResult;
        }

        // Attempt to persist division edit and retrieve result
        const result = await divisionEditPersistence(token, division);

        return result;
    } catch (error) {
        console.error(error);
        // Return the error to be handled by the caller
        return { status: 500, message: error.message };
    }
};

exports.get = async ({ divisionGetPersistence }, { token, hubid }) => {
    try {
        // Create a new hubEntity with provided data
        const hub = new HubEntity({ id: hubid });

        // Validate the hub ID
        const validationResult = hubid ? { status: 200 } : { status: 400, message: 'Hub ID is required' };

        if (validationResult.status !== 200) {
            return validationResult;
        }

        // Attempt to persist division get and retrieve result
        const result = await divisionGetPersistence.get(token, hub);

        return result;
    } catch (error) {
        console.error(error);
        // Return the error to be handled by the caller
        return { status: 500, message: error.message };
    }
};