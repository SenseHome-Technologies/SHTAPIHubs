exports.NotificationEntity = class NotificationEntity {
    constructor(notification) {
        this.id = notification.id; 
        this.description = notification.description; 
        this.date = notification.date; 
        this.hubId = notification.hubId; 
    }
};
