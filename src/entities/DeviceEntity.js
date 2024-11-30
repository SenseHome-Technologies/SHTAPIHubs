exports.DeviceEntity = class DeviceEntity {
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