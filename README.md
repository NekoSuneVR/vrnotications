# vrnotications
Notications for VR and VRChat Stuff

## Usage

```node
// example.js
const { XSOverlay, OVRToolkit, WindowsNotifications } = require('vrnotications');

// XSOverlay Example
const xsOverlay = new XSOverlay();
xsOverlay.sendNotification({
    title: 'Example Notification!',
    content: "It's an example!",
});

// OVR Toolkit Example
const ovrToolkit = new OVRToolkit();
ovrToolkit.sendNotification('Cool title', 'My cool body text!');

// Windows Notifications Example
const windowsNotifications = new WindowsNotifications();
windowsNotifications.sendNotification('Hello Windows!', 'This is a Windows notification', null);

```
