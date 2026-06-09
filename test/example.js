// example.js
const { XSOverlay, OVRToolkit, WindowsNotifications } = require('../index');

// XSOverlay Example
const xsOverlay = new XSOverlay();
xsOverlay.connect();
xsOverlay.sendNotification({
    title: 'Example Notification!',
    content: "It's an example!",
    // icon can be a local path, an http(s) URL, a Buffer, a data URI or Base64.
    // useBase64Icon is enabled automatically when a real image is supplied.
    icon: './icon.png',
});

// OVR Toolkit Example
const ovrToolkit = new OVRToolkit();
ovrToolkit.sendNotification('Cool title', 'My cool body text!', 'https://example.com/icon.png');

// Windows Notifications Example
const windowsNotifications = new WindowsNotifications();
windowsNotifications.sendNotification('Hello Windows!', 'This is a Windows notification', null);
