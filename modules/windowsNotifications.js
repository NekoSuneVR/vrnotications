// windowsNotifications.js
const notifier = require('node-notifier');
const path = require('path');

class WindowsNotifications {
    constructor() {}

    sendNotification(title, message, iconPath = null) {
        const notificationOptions = {
            title: title,
            message: message,
            sound: true, // Set to true for default sound, or specify a sound file path
            icon: iconPath ? path.join(__dirname, iconPath) : undefined, // Optional icon
            wait: false, // Wait for user action or timeout (if true)
        };

        notifier.notify(notificationOptions, (err, response) => {
            if (err) {
                console.error('Notification error:', err);
            } else {
                console.log('Notification sent To Windows');
            }
        });
    }
}

module.exports = WindowsNotifications;
