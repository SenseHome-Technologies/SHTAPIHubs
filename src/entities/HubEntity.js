const {UserEntity} = require('./UserEntity');

exports.HubEntity = class HubEntity {
    constructor(hub) {
        this.id = hub.id;
        this.name = hub.name;
        this.discoveryflag = hub.discoveryflag;
        this.type = hub.type;
        this.users = hub.users?.map(condition => new UserEntity(condition)) || [];
    }

    async validate() {
        if (!this.id || !this.name) {
            return { status: 400, message: 'Hub must have id and name' };
        }

        const userValidation = await Promise.all(this.users.map(user => user.validate('edit')));
        const invalidUsers = userValidation.filter(validation => validation.status !== 200);
        if (invalidUsers.length) {
            return invalidUsers[0];
        }

        return { status: 200 };
    }
}