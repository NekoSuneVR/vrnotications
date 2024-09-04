// ovrToolkit.js
const WebSocket = require('ws');

class OVRToolkit {
    constructor() {
        this.ws = new WebSocket('ws://127.0.0.1:11450/api');
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

    sendNotification(title, body, icon = null) {
        const msg = {
            messageType: 'SendNotification',
            json: JSON.stringify({
                title: title,
                body: body,
                icon: icon,
            }),
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
            console.log('Message queued until connection is open:', msg);
        }
    }
}

module.exports = OVRToolkit;
