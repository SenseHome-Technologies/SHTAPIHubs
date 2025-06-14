'use strict';

const admin = require('firebase-admin');

class FirebaseService {
    constructor() {
        this.initialized = false;
    }

    /**
     * Initialize Firebase Admin SDK
     * This should be called once when the application starts
     */
    initialize() {
        if (this.initialized) {
            return;
        }

        try {
            // Check if required environment variables are set
            if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
                throw new Error('Missing required Firebase environment variables. Please check FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL');
            }

            // Initialize Firebase Admin SDK
            const serviceAccount = {
                type: "service_account",
                project_id: process.env.FIREBASE_PROJECT_ID,
                private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
                private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                client_email: process.env.FIREBASE_CLIENT_EMAIL,
                client_id: process.env.FIREBASE_CLIENT_ID,
                auth_uri: "https://accounts.google.com/o/oauth2/auth",
                token_uri: "https://oauth2.googleapis.com/token",
                auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
                client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
            };

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: process.env.FIREBASE_PROJECT_ID
            });

            this.initialized = true;
            //console.log('Firebase Admin SDK initialized successfully');
        } catch (error) {
            console.error('Error initializing Firebase Admin SDK:', error);
            throw error;
        }
    }

    /**
     * Send a notification to a single device
     * @param {string} token - FCM token of the device
     * @param {string} title - Notification title
     * @param {string} body - Notification body
     * @param {object} data - Additional data to send with the notification
     * @returns {Promise<string>} - Message ID if successful
     */
    async sendToDevice(token, title, body, data = {}) {
        if (!this.initialized) {
            this.initialize();
        }

        try {
            const message = {
                notification: {
                    title: title,
                    body: body
                },
                data: {
                    ...data,
                    timestamp: new Date().toISOString()
                },
                android: {
                    notification: {
                        channel_id: '1',
                        priority: 'high',
                        default_sound: true,
                        default_vibrate_timings: true,
                        default_light_settings: true
                    }
                },
                apns: {
                    payload: {
                        aps: {
                            sound: 'default',
                            badge: 1
                        }
                    }
                },
                token: token
            };

            const response = await admin.messaging().send(message);
            //console.log('Successfully sent message:', response);
            return response;
        } catch (error) {
            console.error('Error sending message to device:', error);
            throw error;
        }
    }

    /**
     * Send a notification to multiple devices
     * @param {string[]} tokens - Array of FCM tokens
     * @param {string} title - Notification title
     * @param {string} body - Notification body
     * @param {object} data - Additional data to send with the notification
     * @returns {Promise<object>} - Batch response with success and failure counts
     */
    async sendToMultipleDevices(tokens, title, body, data = {}) {
        if (!this.initialized) {
            this.initialize();
        }

        if (!tokens || tokens.length === 0) {
            throw new Error('No tokens provided');
        }

        //console.log(`Attempting to send notifications to ${tokens.length} devices`);

        try {
            const messaging = admin.messaging();
            //console.log('Messaging instance created successfully');

            // Try to use sendEach if available (newer Firebase Admin SDK versions)
            if (typeof messaging.sendEach === 'function') {
                const messages = tokens.map(token => ({
                    notification: {
                        title: title,
                        body: body
                    },
                    data: {
                        ...data,
                        timestamp: new Date().toISOString()
                    },
                    android: {
                        notification: {
                            channel_id: '1',
                            priority: 'high',
                            default_sound: true,
                            default_vibrate_timings: true,
                            default_light_settings: true
                        }
                    },
                    apns: {
                        payload: {
                            aps: {
                                sound: 'default',
                                badge: 1
                            }
                        }
                    },
                    token: token
                }));

                const response = await messaging.sendEach(messages);
                //console.log(`Successfully sent ${response.successCount} messages out of ${tokens.length}`);

                if (response.failureCount > 0) {
                    console.log(`Failed to send ${response.failureCount} messages`);
                }

                return response;
            }

            // Fallback: Send to each token individually
            const results = [];
            let successCount = 0;
            let failureCount = 0;

            for (const token of tokens) {
                try {
                    const message = {
                        notification: {
                            title: title,
                            body: body
                        },
                        data: {
                            ...data,
                            timestamp: new Date().toISOString()
                        },
                        android: {
                            notification: {
                                channel_id: '1',
                                priority: 'high',
                                default_sound: true,
                                default_vibrate_timings: true,
                                default_light_settings: true
                            }
                        },
                        apns: {
                            payload: {
                                aps: {
                                    sound: 'default',
                                    badge: 1
                                }
                            }
                        },
                        token: token
                    };

                    const response = await messaging.send(message);
                    results.push({ success: true, messageId: response });
                    successCount++;
                } catch (error) {
                    console.error(`Failed to send to token ${token.substring(0, 10)}...`, error.message);
                    results.push({ success: false, error: error.message });
                    failureCount++;
                }
            }

            //console.log(`Successfully sent ${successCount} messages out of ${tokens.length}`);

            if (failureCount > 0) {
                console.log(`Failed to send ${failureCount} messages`);
            }

            return {
                successCount,
                failureCount,
                responses: results
            };
        } catch (error) {
            console.error('Error sending messages to multiple devices:', error);
            throw error;
        }
    }

    /**
     * Validate if an FCM token is valid
     * @param {string} token - FCM token to validate
     * @returns {Promise<boolean>} - True if token is valid
     */
    async validateToken(token) {
        if (!this.initialized) {
            this.initialize();
        }

        try {
            // Try to send a dry-run message to validate the token
            const message = {
                notification: {
                    title: 'Test',
                    body: 'Test'
                },
                token: token
            };

            await admin.messaging().send(message, true); // dry-run mode
            return true;
        } catch (error) {
            console.log('Token validation failed:', error.message);
            return false;
        }
    }
}

// Export a singleton instance
module.exports = new FirebaseService();
