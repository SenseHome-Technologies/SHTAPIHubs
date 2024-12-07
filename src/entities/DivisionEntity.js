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

    // Validation for `id` and required as default
    validateId(required = true) {
        if (required && !this.id) {
            return { status: 400, message: 'Id is required.' };
        }
        if (!required && this.id) {
            return { status: 400, message: 'Id should not be provided.' };
        }
        return { status: 200 };
    }

    // Validation for `name`
    validateName() {
        if (this.name !== undefined && (!this.name || typeof this.name !== 'string' || this.name.trim().length < 3)) {
            return { status: 400, message: 'Name must be a non-empty string with at least 3 characters.' };
        }
        return { status: 200 };
    }

    // Validation for `icon`
    validateIcon() {
        if (this.icon !== undefined && (typeof this.icon !== 'string' || this.icon.trim().length < 4)) {
            return { status: 400, message: 'Icon, if provided, must be a string with at least 3 characters.' };
        }
        return { status: 200 };
    }

    // Validation for `hubid`
    validateHubId(required = true) {
        if (required && (!this.hubid || typeof this.hubid !== 'string')) {
            return { status: 400, message: 'Hub ID is required and must be a string.' };
        }
        return { status: 200 };
    }

    /**
     * Validate the division entity based on the operation type
     * @param {string} type - The type of operation ('create', 'edit', 'delete', 'get').
     * @returns {Promise<Object>} Validation result with `status` and `message`.
     */
    async validate(type) {
        let result;

        switch (type) {
            case 'create':
                result = this.validateId(false);
                if (result.status !== 200) return result; //to avoid further valdiations

                result = this.validateName();
                if (result.status !== 200) return result;

                result = this.validateIcon();
                if (result.status !== 200) return result;

                return this.validateHubId();

            case 'edit':
                // Ensure `id` is provided for editing
                result = this.validateId(true);
                if (result.status !== 200) return result;

                // Validate only the fields being edited
                if (this.name !== undefined) {
                    result = this.validateName();
                    if (result.status !== 200) return result;
                }

                if (this.icon !== undefined) {
                    result = this.validateIcon();
                    if (result.status !== 200) return result;
                }

                // At least one editable field must be provided
                if (this.name === undefined && this.icon === undefined) {
                    return { status: 400, message: 'At least one field (name or icon) must be provided for editing.' };
                }

                return { status: 200 };

            case 'delete':
                return this.validateId(true);

            case 'get':
                return this.validateHubId();

            default:
                return { status: 400, message: `Invalid validation type: ${type}` };
        }
    }
};
