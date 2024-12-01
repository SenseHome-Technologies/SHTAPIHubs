exports.UserEntity = class UserEntity {
    constructor(user) {
        this.id = user.id;
        this.email = user.email;
        this.hubid = user.hubid;
        this.role = user.role;
    }
}