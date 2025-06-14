'use strict';

const firebaseService = require('./firebaseService');
const User = require('../framework/db/postgresql/userModel');
const Notification = require('../framework/db/postgresql/notificationModel');
const axios = require('axios');

class NotificationService {
    /**
     * Fetch FCM tokens from the other API for users of a hub
     * @param {string} jwtToken - The JWT token for authentication
     * @param {Array} users - Array of user objects with email
     * @returns {Promise<string[]>} - Array of FCM tokens
     */
    async fetchFCMTokensFromAPI(jwtToken, users) {
        try {
            const apiUsersUrl = process.env.API_USERS_URL || 'http://localhost:3001';
            const endpoint = `${apiUsersUrl}/api/users/tokens`;

            // Prepare the request body with hub ID and list of emails
            const requestBody = {
                emails: users.map(user => user.email)
            };

            const response = await axios.post(endpoint, requestBody, {
                timeout: 5000, // 5 second timeout
                headers: {
                    'Content-Type': 'application/json',
                    'token': jwtToken
                }
            });

            if (response.data && response.data.tokens) {
                //console.log(`Received ${response.data.tokens.length} FCM tokens`);
                return response.data.tokens.filter(token => token && token.trim() !== '');
            }

            console.log(`No FCM tokens received for hub`);
            return [];
        } catch (error) {
            console.error(`Error fetching FCM tokens from other API:`, error.response.data);
            return [];
        }
    }

    /**
     * Send device update notification to all users of a hub
     * @param {string} jwtToken - The JWT token for authentication
     * @param {string} hubId - The hub ID
     * @param {string} deviceName - The name of the updated device
     * @param {object} deviceChanges - Object containing the changes made to the device
     * @returns {Promise<object>} - Result of the notification operation
     */
    async sendDeviceUpdateNotification(jwtToken, hubId, deviceName, deviceChanges = {}) {
        try {
            // Get all users for this hub (for counting purposes)
            const users = await User.findAll({
                where: { hubid: hubId },
                attributes: ['id', 'email']
            });

            if (!users || users.length === 0) {
                //console.log(`No users found for hub ${hubId}`);
                return { status: 404, message: 'No users found for this hub' };
            }

            // Fetch FCM tokens from the other API
            const fcmTokens = await this.fetchFCMTokensFromAPI(jwtToken, users);

            if (fcmTokens.length === 0) {
                console.log(`No FCM tokens available for hub ${hubId}`);
                // Still create the notification in the database even if no FCM tokens
            }

            // Create notification description based on changes
            const description = this.createDeviceUpdateDescription(deviceName, deviceChanges);

            // Create notification in database
            const notification = await Notification.create({
                description: description,
                date: new Date(),
                hubid: hubId
            });

            let fcmResult = null;

            // Send FCM notifications if there are tokens available
            if (fcmTokens.length > 0) {
                const title = 'Device Updated';
                const body = description;
                const data = {
                    type: 'device_update',
                    hubId: hubId,
                    deviceName: deviceName,
                    notificationId: notification.id.toString(),
                    changes: JSON.stringify(deviceChanges)
                };

                try {
                    fcmResult = await firebaseService.sendToMultipleDevices(fcmTokens, title, body, data);
                } catch (fcmError) {
                    console.error('Error sending FCM notifications:', fcmError);
                    // Don't fail the entire operation if FCM fails
                }
            }

            return {
                status: 200,
                message: 'Device update notification sent successfully',
                data: {
                    notification: notification,
                    fcmResult: fcmResult,
                    tokensNotified: fcmTokens.length,
                    totalUsers: users.length
                }
            };

        } catch (error) {
            console.error('Error sending device update notification:', error);
            return { status: 500, message: error.message };
        }
    }

    /**
     * Create a human-readable description of device changes
     * @param {string} deviceName - The name of the device
     * @param {object} changes - Object containing the changes made
     * @returns {string} - Human-readable description
     */
    createDeviceUpdateDescription(deviceName, changes) {
        const changeDescriptions = [];

        if (changes.state !== undefined) {
            changeDescriptions.push(`state changed to ${changes.state}`);
        }

        if (changes.value !== undefined) {
            changeDescriptions.push(`value changed to ${changes.value}`);
        }

        if (changes.name !== undefined) {
            changeDescriptions.push(`name changed to "${changes.name}"`);
        }

        if (changes.favorite !== undefined) {
            changeDescriptions.push(`${changes.favorite ? 'added to' : 'removed from'} favorites`);
        }

        if (changes.divisionid !== undefined) {
            changeDescriptions.push(`moved to different division`);
        }

        if (changeDescriptions.length === 0) {
            return `Device "${deviceName}" was updated`;
        }

        return `Device "${deviceName}" was updated: ${changeDescriptions.join(', ')}`;
    }

    /**
     * Send a custom notification to all users of a hub
     * @param {string} hubId - The hub ID
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     * @param {object} data - Additional data to send
     * @returns {Promise<object>} - Result of the notification operation
     */
    async sendCustomNotification(hubId, title, message, data = {}) {
        try {
            // Get all users for this hub (for counting purposes)
            const users = await User.findAll({
                where: { hubid: hubId },
                attributes: ['id', 'email']
            });

            if (!users || users.length === 0) {
                return { status: 404, message: 'No users found for this hub' };
            }

            // Fetch FCM tokens from the other API
            const fcmTokens = await this.fetchFCMTokensFromAPI(users);

            // Create notification in database
            const notification = await Notification.create({
                description: message,
                date: new Date(),
                hubid: hubId
            });

            let fcmResult = null;

            // Send FCM notifications if there are tokens available
            if (fcmTokens.length > 0) {
                const fcmData = {
                    ...data,
                    type: 'custom_notification',
                    hubId: hubId,
                    notificationId: notification.id.toString()
                };

                try {
                    fcmResult = await firebaseService.sendToMultipleDevices(fcmTokens, title, message, fcmData);
                } catch (fcmError) {
                    console.error('Error sending FCM notifications:', fcmError);
                }
            }

            return {
                status: 200,
                message: 'Custom notification sent successfully',
                data: {
                    notification: notification,
                    fcmResult: fcmResult,
                    tokensNotified: fcmTokens.length,
                    totalUsers: users.length
                }
            };

        } catch (error) {
            console.error('Error sending custom notification:', error);
            return { status: 500, message: error.message };
        }
    }
}

// Export a singleton instance
module.exports = new NotificationService();
