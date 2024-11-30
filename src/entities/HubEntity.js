exports.HubEntity = class HubEntity {
    constructor(hub) {
        this.id = hub.id;
        this.name = hub.username;
        this.discoveryflag = hub.discoveryflag;
        this.users = hub.users;
        this.type = hub.type;
    }
}