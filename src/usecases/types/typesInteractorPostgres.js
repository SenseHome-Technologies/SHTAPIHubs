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