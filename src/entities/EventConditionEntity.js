exports.EventConditionEntity = class EventConditionEntity {
    constructor(eventcondition) {
        this.id = eventcondition.id;
        this.eventtargetid = eventcondition.eventtargetid;
        this.deviceid = eventcondition.deviceid;
        this.devicetype = eventcondition.devicetype;
        this.devicestate = eventcondition.devicestate;
        this.devicevalue = eventcondition.devicevalue;
        this.operatorid = eventcondition.operatorid;
        this.operatorquantity = eventcondition.operatorquantity;
        this.statementid = eventcondition.statementid;
        this.statementquantity = eventcondition.statementquantity;
    }

    async validate(type) {
        if (type !== "create" && !this.eventtargetid) {
            return { status: 400, message: 'Event condition must have eventtargetid' };
        }

        if (this.devicestate === undefined || !this.operatorid || !this.operatorquantity) {
            return { status: 400, message: 'Event condition must have devicestate, operatorid and operatorquantity' };
        }

        if ((!this.deviceid && !this.devicetype)) {
            return { status: 400, message: 'Event condition must have deviceid or devicetype' };
        }

        if (!this.deviceid && this.devicetype && !this.statementid && !this.statementquantity) {
            return { status: 400, message: 'Event condition must have statementid and statmentquantity' };
        }

        if (this.deviceid && !this.devicetype) {
            return { status: 400, message: 'Event condition must have devicetype' };
        }

        return { status: 200 };
    }
}
