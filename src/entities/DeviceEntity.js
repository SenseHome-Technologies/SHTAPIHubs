/**
 * DeviceEntity
 * @typedef {Object} DeviceEntity
 * @property {String} id - The ID of the device
 * @property {String} name - The name of the device
 * @property {String} accesscode - The access code of the device
 * @property {String} type - The type of the device
 * @property {Number} state - The state of the device
 * @property {Number} value - The value of the device
 * @property {Boolean} favorite - The favorite status of the device
 * @property {String} hubid - The ID of the hub of the device
 * @property {String} divisionid - The ID of the division of the device
 */
/**
 * DeviceEntity
 */
exports.DeviceEntity = class DeviceEntity {
    /**
     * Creates an instance of DeviceEntity.
     * @param {Object} device - The device data
     */
    constructor(device) {
        this.id = device.id;
        this.name = device.name;
        this.accesscode = device.accesscode;
        this.type = device.type;
        this.state = device.state;
        this.value = device.value;
        this.favorite = device.favorite;
        this.hubid = device.hubid;
        this.divisionid = device.divisionid;
    }
}
