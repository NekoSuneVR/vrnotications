// windowsNotifications.js
const notifier = require('node-notifier');
const path = require('path');
const fs = require('fs');
const { loadImageAsFilePath } = require('./imageHelper');

class WindowsNotifications {
    constructor() {}

    /**
     * Send a desktop notification.
     *
     * `icon` accepts a local file path, an http(s) URL, a Buffer, a data URI
     * or a raw Base64 string. node-notifier needs a file on disk, so anything
     * that isn't already a local file is written to a temp file first.
     *
     * @returns {Promise<void>}
     */
    async sendNotification(title, message, icon = null) {
        let iconPath;
        if (icon) {
            // Backwards-compatible: a bare relative name that doesn't exist on
            // its own is resolved against the module directory (old behaviour).
            const legacyPath = path.join(__dirname, typeof icon === 'string' ? icon : '');
            if (typeof icon === 'string' && !fs.existsSync(icon) && fs.existsSync(legacyPath)) {
                iconPath = legacyPath;
            } else {
                iconPath = await loadImageAsFilePath(icon);
            }
        }

        const notificationOptions = {
            title: title,
            message: message,
            sound: true, // Set to true for default sound, or specify a sound file path
            icon: iconPath || undefined, // Optional icon (local path/URL/Buffer/Base64)
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
