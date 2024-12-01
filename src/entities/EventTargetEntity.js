const { EventConditionEntity } = require('./EventConditionEntity');

exports.EventTargetEntity = class EventTargetEntity {
    constructor(eventtarget) {
        this.id = eventtarget.id;
        this.eventid = eventtarget.eventid;
        this.deviceid = eventtarget.deviceid;
        this.devicetype = eventtarget.devicetype;
        this.devicestate = eventtarget.devicestate;
        this.devicevalue = eventtarget.devicevalue;
        this.eventconditions = eventtarget.eventconditions?.map(condition => new EventConditionEntity(condition)) || [];
    }

    async validate(type) {
        if (type !== "create") {
            if (!this.eventid) {
                return { status: 400, message: 'Event target must have eventid' };
            }
        }

        if (!this.devicestate) {
            return { status: 400, message: 'Event target must have devicestate' };
        }

        if (!this.deviceid && !this.devicetype) {
            return { status: 400, message: 'Event target must have deviceid or devicetype' };
        }

        if (this.deviceid && !this.devicetype) {
            return { status: 400, message: 'Event target must have devicetype' };
        }

        for (const condition of this.eventconditions) {
            var validate = await condition.validate(type);
            if (validate.status !== 200) {
                return validate;
            }
        }

        return { status: 200 };
    }
};