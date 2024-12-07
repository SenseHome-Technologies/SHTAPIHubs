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
/**
 * Class representing an event condition entity.
 * 
 * @class
 */
exports.EventConditionEntity = class EventConditionEntity {
    /**
     * Constructor to initialize an event condition entity.
     * 
     * @param {Object} eventcondition - The event condition object.
     */
    constructor(eventcondition) {
        // Initialize properties from the given event condition object
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

    /**
     * Validate the event condition.
     * 
     * @param {string} type - The type of validation, either "create" or "edit".
     * @returns {Object} The validation result, including the status code and message.
     */
    async validate(type) {
        // Validate eventtargetid for non-create operations
        if (type !== "create" && !this.eventtargetid) {
            return { status: 400, message: 'Event condition must have eventtargetid' };
        }

        // Ensure required fields devicestate, operatorid, and operatorquantity are present
        if (this.devicestate === undefined || !this.operatorid || !this.operatorquantity) {
            return { status: 400, message: 'Event condition must have devicestate, operatorid and operatorquantity' };
        }

        // Check for presence of either deviceid or devicetype
        if ((!this.deviceid && !this.devicetype)) {
            return { status: 400, message: 'Event condition must have deviceid or devicetype' };
        }

        // Validate statementid and statementquantity if deviceid is absent and devicetype is present
        if (!this.deviceid && this.devicetype && !this.statementid && !this.statementquantity) {
            return { status: 400, message: 'Event condition must have statementid and statementquantity' };
        }

        // Ensure devicetype is present if deviceid is provided
        if (this.deviceid && !this.devicetype) {
            return { status: 400, message: 'Event condition must have devicetype' };
        }

        // Return success if all validations pass
        return { status: 200 };
    }
}

