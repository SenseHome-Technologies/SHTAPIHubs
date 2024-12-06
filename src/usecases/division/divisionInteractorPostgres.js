const jwt = require('jsonwebtoken');
const Division = require('../../framework/db/postgresql/divisionModel'); 
const Device = require('../../framework/db/postgresql/deviceModel');
const User = require('../../framework/db/postgresql/userModel'); 

exports.create = async ({ divisionCreatePersistence }, { token, name, icon }) => {
    try {
        const division = new DivisionEntity({ name, icon });

        const validationResult = await division.validate('create');
        if (validationResult.status !== 200) {
            return validationResult; 
        }

        const result = await divisionCreatePersistence(token, division);

        return result;
    } catch (err) {
        console.error(err);
        throw err; 
    }
}

exports.delete = async ({ divisionDeletePersistence }, { token, name }) => {
    try {
        if (!name ) {
            return { status: 400, message: 'Division name is required to delete the division' };
        }

        const result = await divisionDeletePersistence(token, name);

        return result; 
    } catch (error) {
        console.error(error);
        return { status: 500, message: error.message };
    }
};

exports.get = async ({ divisionGetPersistence }, { token, hubId }) => {
    try {
        if (!hubId) {
            return { status: 400, message: 'Hub ID is required to fetch divisions' };
        }

        const result = await divisionGetPersistence(token, hubId);

        return result; 
    } catch (error) {
        console.error(error);
        return { status: 500, message: error.message };
    }
};

exports.edit = async ({ divisionEditPersistence }, { token, divisionData: {id, name, icon} }) => {
    try {

        if (!divisionData.id || !divisionData.name && !divisionData.icon ) {
            return { status: 400, message: 'Division ID is required to edit the division' };
        }

        const division = new DivisionEntity(divisionData);

        const validationResult = await division.validate('edit');
        if (validationResult.status !== 200) {
            return validationResult; 
        }

        const result = await divisionEditPersistence(token, divisionData);

        return result; 
    } catch (error) {
        console.error(error);
        return { status: 500, message: error.message };
    }
};

module.exports = DivisionInteractorPostgres;
