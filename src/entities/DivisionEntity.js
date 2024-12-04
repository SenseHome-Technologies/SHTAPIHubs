exports.DivisionEntity = class DivisionEntity {
    constructor(division) {
        this.id = division.id;
        this.name = division.name;
        this.icon = division.icon;
    }


    
    async validate(type) {
        // Ensure at least one of id or name is provided
        if (!this.id && !this.name) {
            return { status: 400, message: 'Either division id or name is required' };
        }

        // If both are provided, check if icon exists
        if (!this.icon) {
            return { status: 400, message: 'Division icon is required' };
        }

        return { status: 200 };
    }
}