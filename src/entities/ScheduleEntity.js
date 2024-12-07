/**
 * Represents a schedule entity
 * @class ScheduleEntity
 */
exports.ScheduleEntity = class ScheduleEntity {
    /**
     * Constructs a schedule entity with the provided schedule data
     * @param {Object} schedule the schedule data
     * @param {String} schedule.hour the hour of the schedule
     * @param {Number} schedule.weekday the weekday of the schedule
     */
    constructor(schedule) {
        this.id = schedule.id;
        this.hour = schedule.hour;
        this.weekday = schedule.weekday;
    }

    /**
     * Validates the schedule
     * @returns {Promise<Object>} the validation result
     */
    async validate() {
        if (!this.hour || !this.weekday) {
            return { status: 400, message: 'Schedule hour and weekday are required' };
        }

        return { status: 200 };
    }
}
