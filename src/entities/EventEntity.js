const {EventTargetEntity} = require('./EventTargetEntity');
const {ScheduleEntity} = require('./ScheduleEntity');

exports.EventEntity = class EventEntity {
    /**
     * Construct an EventEntity with the provided event data
     * @param {Object} event the event data
     * @param {String} event.id the ID of the event
     * @param {String} event.name the name of the event
     * @param {Number} event.state the state of the event
     * @param {Number} event.type the type of the event (1 = instant, 2 = scheduled)
     * @param {String} event.hubid the ID of the hub to which the event belongs
     * @param {EventTargetEntity[]} [event.eventtargets] the list of event targets
     * @param {ScheduleEntity[]} [event.schedules] the list of schedules (required for event type 2)
     */
    constructor(event) {
        this.id = event.id;
        this.name = event.name;
        this.state = event.state;
        this.type = event.type;
        this.hubid = event.hubid;
        /**
         * The list of event targets
         * @type {EventTargetEntity[]}
         */
        this.eventtargets = event.eventtargets?.map(target => new EventTargetEntity(target)) || [];
        /**
         * The list of schedules (required for event type 2)
         * @type {ScheduleEntity[]}
         */
        this.schedules = event.schedules?.map(schedule => new ScheduleEntity(schedule)) || [];
    }

    /**
     * Validate the event
     * @param {String} type the type of the event ('create' or 'edit')
     * @returns {Promise<Object>} the validation result
     */
    async validate(type) {
        // Validate the event data
        if (!this.name || !this.type || !this.hubid) {
            return { status: 400, message: 'Event name, type and hubid are required' };
        }

        if (!this.eventtargets.length) {
            return { status: 400, message: 'Event must have at least one event target' };
        }

        // Validate the event targets
        const targetValidation = await Promise.all(this.eventtargets.map(target => target.validate(type)));
        const invalidTargets = targetValidation.filter(validation => validation.status !== 200);
        if (invalidTargets.length) {
            return invalidTargets[0];
        }

        // Validate the schedules (if applicable)
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