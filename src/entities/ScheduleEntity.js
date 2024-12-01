exports.ScheduleEntity = class ScheduleEntity {
    constructor(schedule) {
        this.id = schedule.id;
        this.hour = schedule.hour;
        this.weekday = schedule.weekday;
    }

    async validate() {
        if (!this.hour || !this.weekday) {
            return {
                status: 400,
                message: 'Schedule hour and weekday are required'
            };
        }

        return { status: 200 };
    }
}