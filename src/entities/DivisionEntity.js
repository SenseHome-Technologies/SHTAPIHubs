/**
 * DivisionEntity
 * @typedef {Object} DivisionEntity
 * @property {number} id - The division id
 * @property {string} name - The division name
 * @property {string} icon - The division icon
 * @property {string} hubid - The hub id
 */
exports.DivisionEntity = class DivisionEntity {
    constructor(division) {
        this.id = division.id;
        this.name = division.name;
        this.icon = division.icon;
        this.hubid = division.hubid;
    }

    /**
     * Validate the division entity
     * 
     * @param {string} type The type of validation, either 'create' or 'edit'
     * 
     * @returns {Promise<Object>} A promise that resolves with an object containing the status and a message
     */
    async validate(type) {

        // Check if the required fields are present
        if (!this.name || !this.icon || !this.hubid) {
            return { status: 400, message: 'Division name, icon and hub is required' };
        }

        // Check if the id field is present for edits
        if (type !== 'create' && !this.id) {
            return { status: 400, message: 'Division id is required' };
        }

        // If all the checks pass, return a 200 status
        return { status: 200 };
    }
}

