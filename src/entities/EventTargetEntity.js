/** 
 * EventConditionEntity
 * @typedef {Object} EventConditionEntity
 * @property {Number} id - The ID of the event condition
 * @property {Number} eventtargetid - The ID of the event target of the event condition
 * @property {String} deviceid - The ID of the device of the event condition
 * @property {Number} devicetype - The type of the device of the event condition
 * @property {Number} devicestate - The state of the device of the event condition
 * @property {Number} devicevalue - The value of the device of the event condition
 * @property {Number} operatorid - The ID of the operator of the event condition
 * @property {Number} operatorquantity - The quantity of the operator of the event condition
 * @property {Number} statementid - The ID of the statement of the event condition
 * @property {Number} statementquantity - The quantity of the statement of the event condition
 */

const { EventConditionEntity } = require('./EventConditionEntity');

// EventTargetEntity class to represent an event target
exports.EventTargetEntity = class EventTargetEntity {
    /**
     * Constructor to initialize an event target entity.
     * 
     * @param {Object} eventtarget - The event target object.
     */
    constructor(eventtarget) {
        // Initialize properties from the given event target object
        this.id = eventtarget.id;
        this.eventid = eventtarget.eventid;
        this.deviceid = eventtarget.deviceid;
        this.devicetype = eventtarget.devicetype;
        this.devicestate = eventtarget.devicestate;
        this.devicevalue = eventtarget.devicevalue;
        this.eventconditions = eventtarget.eventconditions?.map(condition => new EventConditionEntity(condition)) || [];
    }

    /**
     * Validate the event target.
     * 
     * @param {string} type - The type of validation, either "create" or "edit".
     * @returns {Object} The validation result, including the status code and message.
     */
    async validate(type) {
        // Validate eventid for non-create operations
        if (type !== "create" && !this.eventid) {
            return { status: 400, message: 'Event target must have eventid' };
        }

        // Ensure devicestate is present
        if (this.devicestate === undefined) {
            return { status: 400, message: 'Event target must have devicestate' };
        }

        // Check for presence of either deviceid or devicetype
        if (!this.deviceid && !this.devicetype) {
            return { status: 400, message: 'Event target must have deviceid or devicetype' };
        }

        // Ensure devicetype is present if deviceid is provided
        if (this.deviceid && !this.devicetype) {
            return { status: 400, message: 'Event target must have devicetype' };
        }

        // Validate each event condition
        const conditionValidation = await Promise.all(this.eventconditions.map(condition => condition.validate(type)));
        const invalidConditions = conditionValidation.filter(validation => validation.status !== 200);
        if (invalidConditions.length) {
            return invalidConditions[0];
        }

        // Return success if all validations pass
        return { status: 200 };
    }
}

