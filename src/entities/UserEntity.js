exports.UserEntity = class UserEntity {
    /**
     * Constructs a new UserEntity instance.
     * @param {Object} user - The user object containing user properties.
     */
    constructor(user) {
        this.id = user.id; // Assign user ID
        this.email = user.email; // Assign user email
        this.hubid = user.hubid; // Assign hub ID
        this.role = user.role; // Assign user role
    }

    /**
     * Validates the user entity based on the specified type.
     * @param {string} type - The type of validation, either 'create' or 'edit'.
     * @returns {Promise<Object>} A promise that resolves with a validation result object.
     */
    async validate(type) {
        if (type === 'create' && (!this.email || !this.hubid)) {
            return { status: 400, message: 'Email and hubid are required' };
        } else if (type === 'edit' && (!this.email || !this.role)) {
            return { status: 400, message: 'Email and role are required' };
        }
        
        return { status: 200 }; // Return success if validations pass
    }
}
