exports.UserEntity = class UserEntity {
    constructor(user) {
        this.id = user.id;
        this.email = user.email;
        this.hubid = user.hubid;
        this.role = user.role;
    }

    async validate(type) {
        if (type === 'create' && (!this.email || !this.hubid)) {
            return { status: 400, message: 'Email and hubid are required' };
        } else if (!this.email || !this.role) {
            return { status: 400, message: 'Email and role are required' };
        }
        
        return { status: 200 };
    }
}