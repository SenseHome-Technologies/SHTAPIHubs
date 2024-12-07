exports.NotificationEntity = class NotificationEntity {
    constructor(notification) {
        this.id = notification.id; 
        this.description = notification.description; 
        this.date = notification.date; 
        this.hubid = notification.hubid; 
    }

    async validate() {
        if (!this.description || !this.date || !this.hubid) {
            return {status : 400, message : "Missing description, date or hubid"};
        }
        
        return {status : 200};
    }
};
