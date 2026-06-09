// ovrToolkit.js
// WebSocket client for OVR Toolkit notifications.
// API reference: https://wiki.ovrtoolkit.co.uk/#/Websocket?id=send-notification
const WebSocket = require('ws');
const { loadImageAsBase64 } = require('./imageHelper');

class OVRToolkit {
    constructor(url = 'ws://127.0.0.1:11450/api') {
        this.ws = new WebSocket(url);
        this.messageQueue = []; // Queue to hold messages until connected
        this.isConnected = false;

        this.ws.on('open', () => {
            console.log('Connected to OVR Toolkit WebSocket server');
            this.isConnected = true;

            // Send all queued messages
            this.messageQueue.forEach(msg => this.ws.send(msg));
            this.messageQueue = []; // Clear the queue after sending
        });

        this.ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        this.ws.on('close', () => {
            console.log('Disconnected from OVR Toolkit WebSocket server');
            this.isConnected = false;
        });
    }

    /**
     * Send a notification to OVR Toolkit.
     *
     * Two call styles are supported:
     *   sendNotification('Title', 'Body', './icon.png')
     *   sendNotification({ title: 'Title', body: 'Body', icon: 'https://.../icon.png' })
     *
     * `icon` accepts a local file path, an http(s) URL, a Buffer, a data URI,
     * or an existing Base64 string. OVR Toolkit expects a PNG (ideally square);
     * it is sent as a Base64 string per the WebSocket API.
     *
     * @returns {Promise<void>}
     */
    async sendNotification(title, body, icon = null) {
        // Allow a single options object as the first argument.
        let options;
        if (typeof title === 'object' && title !== null) {
            options = title;
        } else {
            options = { title, body, icon };
        }

        const iconBase64 = await loadImageAsBase64(options.icon);

        const payload = {
            title: options.title || '',
            body: options.body || '',
            icon: iconBase64, // Base64-encoded PNG, or null for no icon
        };

        // Pass through any extra documented fields if provided (height, opacity, etc.)
        if (options.height !== undefined) payload.height = options.height;
        if (options.opacity !== undefined) payload.opacity = options.opacity;

        const msg = {
            messageType: 'SendNotification',
            json: JSON.stringify(payload),
        };

        const serializedMsg = JSON.stringify(msg);

        if (this.isConnected) {
            this.ws.send(serializedMsg, (err) => {
                if (err) {
                    console.error('Error sending message:', err);
                } else {
                    console.log('Notification sent To OVRToolkit');
                }
            });
        } else {
            // Queue the message if not connected yet
            this.messageQueue.push(serializedMsg);
            console.log('Message queued until connection is open');
        }
    }
}

module.exports = OVRToolkit;
