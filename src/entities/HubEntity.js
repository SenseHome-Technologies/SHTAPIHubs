/**
 * HubEntity
 * @typedef {Object} HubEntity
 * @property {String} id - The ID of the hub
 * @property {String} name - The name of the hub
 * @property {Boolean} discoveryflag - The discovery flag of the hub
 * @property {String} type - The type of the hub
 * @property {Array<UserEntity>} users - The users of the hub
 */
const {UserEntity} = require('./UserEntity');

// Entity class to represent a Hub
exports.HubEntity = class HubEntity {
    // Constructor to create a new HubEntity
    constructor(hub) {
        // Hub ID
        this.id = hub.id;
        // Hub name
        this.name = hub.name;
        // Hub discovery flag
        this.discoveryflag = hub.discoveryflag;
        // Hub type
        this.type = hub.type;
        // Hub users
        this.users = hub.users?.map(condition => new UserEntity(condition)) || [];
    }

    // Validate the Hub
    async validate() {
        // Check if Hub has all required fields
        if (!this.id || !this.name) {
            return { status: 400, message: 'Hub must have id and name' };
        }

        // Validate all users
        const userValidation = await Promise.all(this.users.map(user => user.validate('edit')));

        // Check for invalid users
        const invalidUsers = userValidation.filter(validation => validation.status !== 200);
        if (invalidUsers.length) {
            return invalidUsers[0];
        }

        // Return valid result
        return { status: 200 };
    }
}

