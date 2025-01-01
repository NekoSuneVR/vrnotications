// xsOverlay.js
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

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

    sendNotification(options) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            console.error('WebSocket is not connected. Cannot send notification.');
            return;
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
            icon: 'default',
            useBase64Icon: false,
            ...options,
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
