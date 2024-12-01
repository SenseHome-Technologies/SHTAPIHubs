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

        for (const target of this.eventtargets) {
            var validate = await target.validate(type);
            if (validate.status !== 200) {
                return validate;
            }
        }

        if (parseInt(this.type) === 2) {
            if (!this.schedules.length) {
                return { status: 400, message: 'Event type 2 requires at least one schedule' };
            }

            for (const schedule of this.schedules) {
                var validate = await schedule.validate(type);
                if (validate.status !== 200) {
                    return validate;
                }
            }
        }

        return { status: 200 };
    }
};