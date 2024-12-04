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
        if (type !== "create" && !this.eventid) {
            return { status: 400, message: 'Event target must have eventid' };
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

        const conditionValidation = await Promise.all(this.eventconditions.map(condition => condition.validate(type)));
        const invalidConditions = conditionValidation.filter(validation => validation.status !== 200);
        if (invalidConditions.length) {
            return invalidConditions[0];
        }

        return { status: 200 };
    }
}