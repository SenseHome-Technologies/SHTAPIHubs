'use strict';

exports.create = async ({ divisionCreatePersistence }, { token, hubId, name, icon }) => {
    try {
        //check this 
        const division = new DivisionEntity({ name, icon });

        const validationResult = await division.validate('create');
        if (validationResult.status !== 200) {
            return validationResult;
        }

        const divisionData = { name: division.name, icon: division.icon };

        const result = await divisionCreatePersistence(token, hubId, divisionData);

        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

exports.delete = async ({ divisionDeletePersistence }, { token, hubId, name }) => {
    try {
        //check this 
        if (!name) {
            return { status: 400, message: 'Division name is required to delete the division' };
        }

        const result = await divisionDeletePersistence(token, hubId, name);

        return result;
    } catch (err) {
        console.error(err);
        return { status: 500, message: error.message };
    }
};

exports.edit = async ({ divisionEditPersistence }, { token, hubId, name, icon }) => {
    try {
        //check this 
        if (!divisionData.name && !divisionData.icon) {
            return { status: 400, message: 'Division ID is required to edit the division' };
        }

        const division = new DivisionEntity({ name, icon });

        const validationResult = await division.validate('edit');
        if (validationResult.status !== 200) {
            return validationResult;
        }

        const result = await divisionEditPersistence(token, divisionData);

        return result;
    } catch (err) {
        console.error(err);
        return { status: 500, message: error.message };
    }
};


exports.get = async ({ divisionGetPersistence }, { token, hubId }) => {
    try {
        //check this 
        if (!hubId) {
            return { status: 400, message: 'Hub ID is required to fetch divisions' };
        }

        const result = await divisionGetPersistence(token, hubId);

        return result;
    } catch (err) {
        console.error(err);
        return { status: 500, message: error.message };
    }
};

module.exports = DivisionInteractorPostgres;
