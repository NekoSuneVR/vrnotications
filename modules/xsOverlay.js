// xsOverlay.js
const dgram = require('dgram');
const { v4: uuidv4 } = require('uuid');

class XSOverlay {
    constructor() {
        this.port = 42069;
        this.broadcastIP = '127.0.0.1';
        this.socket = dgram.createSocket('udp4');
    }

    sendNotification(options) {
        const defaultMsg = {
            messageType: 1,
            index: 0,
            volume: 0.5,
            audioPath: 'default',
            timeout: 6,
            title: 'Default Title',
            content: 'Default Content',
            icon: 'default',
            height: 120,
            opacity: 1,
            useBase64Icon: false,
            sourceApp: 'XSOverlay_NodeJS_Example'
        };

        const msg = { ...defaultMsg, ...options };
        const byteBuffer = Buffer.from(JSON.stringify(msg));

        this.socket.send(byteBuffer, 0, byteBuffer.length, this.port, this.broadcastIP, (err) => {
            if (err) {
                console.error('Error sending message:', err);
            } else {
                console.log('Message sent:', msg);
            }
        });
    }
}

module.exports = XSOverlay;
