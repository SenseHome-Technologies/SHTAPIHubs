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

        // Return the create result
        return result;
    } catch (err) {
        // Log any errors that occur during the process
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err; 
    }
}

exports.get = async ({ divisionGetPersistence }, { token, hubid }) => {
    try {
        // Create a new hubEntity with provided data
        const hub = new HubEntity({id: hubid});

        // Check if the hubid is present
        if (!hubid) {
            return { status: 400, message: 'Hub ID is required' };
        }

        // Attempt to persist division get and retrieve result
        const result = await divisionGetPersistence(token, hub);

        // Return the get result
        return result; 
    } catch (error) {
        // Log any errors that occur during the process
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

        // Return the edit result
        return result; 
    } catch (error) {
        // Log any errors that occur during the process
        console.error(error);
        // Return the error to be handled by the caller
        return { status: 500, message: error.message };
    }
};

exports.delete = async ({ divisionDeletePersistence }, { token, id, hubid }) => {
    try {
        // Create a new divisionEntity with provided data
        const division = new DivisionEntity({ id, hubid });

        // Check if the id is present
        if (!id ) {
            return { status: 400, message: 'Division id is required to delete the division' };
        }

        // Attempt to persist division delete and retrieve result
        const result = await divisionDeletePersistence(token, division);

        // Return the delete result
        return result; 
    } catch (error) {
        // Log any errors that occur during the process
        console.error(error);
        // Return the error to be handled by the caller
        return { status: 500, message: error.message };
    }
};

