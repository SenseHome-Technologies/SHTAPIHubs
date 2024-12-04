'use strict';

exports.getdevicetypes = async ({typesGetPersistence}) => {
    try {
        // Attempt to persist devicetypes get and retrieve result
        const result = await typesGetPersistence.getdevicetypes();

        // Return the login result
        return result;
    } catch (err) {
        // Log any errors that occur during the login process
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err;
    }
}

exports.geteventtypes = async ({typesGetPersistence}) => {
    try {
        // Attempt to persist eventtypes get and retrieve result
        const result = await typesGetPersistence.geteventtypes();

        // Return the login result
        return result;
    } catch (err) {
        // Log any errors that occur during the login process
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err;
    }
}

exports.getoperators = async ({typesGetPersistence}) => {
    try {
        // Attempt to persist operators get and retrieve result
        const result = await typesGetPersistence.getoperators();

        // Return the login result
        return result;
    } catch (err) {
        // Log any errors that occur during the login process
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err;
    }
}

exports.getstatments = async ({typesGetPersistence}) => {
    try {
        // Attempt to persist statments get and retrieve result
        const result = await typesGetPersistence.getstatments();

        // Return the login result
        return result;
    } catch (err) {
        // Log any errors that occur during the login process
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err;
    }
}