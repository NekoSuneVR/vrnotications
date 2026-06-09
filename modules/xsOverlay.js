// xsOverlay.js
// WebSocket client for XSOverlay notifications.
// API reference: https://xsoverlay.vercel.app/Developer/API/websockets/websockets
const WebSocket = require('ws');
const { loadImageAsBase64 } = require('./imageHelper');

class XSOverlay {
    constructor() {
        this.port = 42070; // Default WebSocket port for XSOverlay
        this.clientName = 'XSOverlay_NodeJS_Example';
        this.ws = null;
    }

    connect() {
        const url = `ws://localhost:${this.port}/?client=${this.clientName}`;

        this.ws = new WebSocket(url);

        this.ws.on('open', () => {
            console.log('Connected to XSOverlay WebSocket API');
        });

        this.ws.on('close', () => {
            console.log('Disconnected from XSOverlay WebSocket API');
        });

        this.ws.on('error', (err) => {
            console.error('WebSocket error:', err);
        });

        this.ws.on('message', (data) => {
            console.log('Received message from XSOverlay:', data);
        });
    }

    /**
     * Send a notification to XSOverlay.
     *
     * `icon` accepts a local file path, an http(s) URL, a Buffer, a data URI,
     * or an existing Base64 string. When an image is supplied it is converted
     * to Base64 and `useBase64Icon` is enabled automatically. To use one of
     * XSOverlay's built-in icons pass a string of 'default', 'error' or
     * 'warning' (these are forwarded untouched, without Base64 encoding).
     *
     * @returns {Promise<void>}
     */
    async sendNotification(options = {}) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            console.error('WebSocket is not connected. Cannot send notification.');
            return;
        }

        const builtInIcons = ['default', 'error', 'warning'];
        let icon = options.icon ?? 'default';
        let useBase64Icon = options.useBase64Icon ?? false;

        // Convert any real image (path/URL/Buffer/data URI) into a Base64 icon.
        if (icon && !builtInIcons.includes(icon)) {
            const iconBase64 = await loadImageAsBase64(icon);
            if (iconBase64) {
                icon = iconBase64;
                useBase64Icon = true;
            }
        }

        const notification = {
            title: 'Default Title',
            type: 1, // Default type for notification
            timeout: 6,
            content: 'Default Content',
            volume: 0.5,
            audioPath: 'default',
            height: 120,
            opacity: 1,
            ...options,
            icon,
            useBase64Icon,
        };

        const message = {
            sender: this.clientName,
            target: 'xsoverlay',
            command: 'SendNotification',
            jsonData: JSON.stringify(notification),
            rawData: null,
        };

        this.ws.send(JSON.stringify(message), (err) => {
            if (err) {
                console.error('Error sending message:', err);
            } else {
                console.log('Notification sent to XSOverlay');
            }
        });
    }
}

module.exports = XSOverlay;
