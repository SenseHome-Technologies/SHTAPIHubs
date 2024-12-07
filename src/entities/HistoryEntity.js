exports.HistoryEntity = class HistoryEntity {
    constructor(history) {
        this.deviceid = history.deviceid; 
        this.devicevalue = history.devicevalue; 
        this.date = history.date; 
        this.hubid = history.hubid;
    }

    async validate() {
        if (!this.deviceid || !this.devicevalue || !this.date || !this.hubid) {
            return {status : 400, message : "Missing deviceid, devicevalue, date or hubid"};
        }
        
        return {status : 200};
    }
};
