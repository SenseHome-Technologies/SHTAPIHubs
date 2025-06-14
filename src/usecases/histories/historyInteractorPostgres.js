'use strict';

const { HistoryEntity } = require('../../entities/HistoryEntity');

exports.create = async ({ historyCreatePersistence }, { token, deviceid, devicevalue, date, hubid }) => {
    try {
        // Create a new historyEntity with provided data
        const history = new HistoryEntity({ deviceid, devicevalue, date, hubid });

        // Validate the history
        const validate = await history.validate();
        if (validate.status !== 200) {
            return validate;
        }

        // Attempt to persist history creation and retrieve result
        const result = await historyCreatePersistence(token, history);

        // Return the result
        return result;
    } catch (err) {

        console.error(err);
        throw err;
    }
};

exports.get = async ({ historyGetPersistence }, { token, hubid, page, limit }) => {
    try {
        // Create a new historyEntity with provided ID
        const history = new HistoryEntity({ hubid });

        // Validate the history ID
        if (!hubid) {
            return { status: 400, message: 'hub ID is required' };
        }

        limit = parseInt(limit) || 10;
        page = parseInt(page) || 1;

        // Attempt to retrieve the history
        const result = await historyGetPersistence(token, history, page, limit);

        // Return the result
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
};