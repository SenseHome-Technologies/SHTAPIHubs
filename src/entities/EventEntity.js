const {EventTargetEntity} = require('./EventTargetEntity');
const {ScheduleEntity} = require('./ScheduleEntity');

exports.EventEntity = class EventEntity {
    constructor(event) {
        this.id = event.id;
        this.name = event.name;
        this.state = event.state;
        this.type = event.type;
        this.hubid = event.hubid;
        this.eventtargets = event.eventtargets?.map(target => new EventTargetEntity(target)) || [];
        this.schedules = event.schedules?.map(schedule => new ScheduleEntity(schedule)) || [];
    }

    async validate(type) {
        if (!this.name || !this.type || !this.hubid) {
            return { status: 400, message: 'Event name, type and hubid are required' };
        }

        if (!this.eventtargets.length) {
            return { status: 400, message: 'Event must have at least one event target' };
        }

        const targetValidation = await Promise.all(this.eventtargets.map(target => target.validate(type)));
        const invalidTargets = targetValidation.filter(validation => validation.status !== 200);
        if (invalidTargets.length) {
            return invalidTargets[0];
        }

        if (parseInt(this.type) === 2) {
            if (!this.schedules.length) {
                return { status: 400, message: 'Event type 2 requires at least one schedule' };
            }

            const scheduleValidation = await Promise.all(this.schedules.map(schedule => schedule.validate(type)));
            const invalidSchedules = scheduleValidation.filter(validation => validation.status !== 200);
            if (invalidSchedules.length) {
                return invalidSchedules[0];
            }
        }

        return { status: 200 };
    }
}