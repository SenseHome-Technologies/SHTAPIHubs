const {UserEntity} = require('./UserEntity');

exports.HubEntity = class HubEntity {
    constructor(hub) {
        this.id = hub.id;
        this.name = hub.username;
        this.discoveryflag = hub.discoveryflag;
        this.type = hub.type;
        this.users = hub.users?.map(condition => new UserEntity(condition)) || [];
    }
}