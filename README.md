# vrnotications

Notifications for VR and VRChat — send native notifications to **XSOverlay**,
**OVRToolkit** and the **Windows** desktop from Node.js, now with **image /
icon attachment** support.

## Install

```bash
npm install vrnotications
```

## Usage

```js
const { XSOverlay, OVRToolkit, WindowsNotifications } = require('vrnotications');

// XSOverlay Example
const xsOverlay = new XSOverlay();
xsOverlay.connect();
xsOverlay.sendNotification({
    title: 'Example Notification!',
    content: "It's an example!",
    icon: './icon.png', // optional image
});

// OVR Toolkit Example
const ovrToolkit = new OVRToolkit();
ovrToolkit.sendNotification('Cool title', 'My cool body text!', './icon.png');

// Windows Notifications Example
const windowsNotifications = new WindowsNotifications();
windowsNotifications.sendNotification('Hello Windows!', 'This is a Windows notification', null);
```

## Image / Icon attachment

Every notification target now accepts an image. The `icon` value can be **any**
of the following and is normalised for you:

| Input | Example |
| --- | --- |
| Local file path | `'./icon.png'` |
| http(s) URL | `'https://example.com/icon.png'` |
| `Buffer` | `fs.readFileSync('icon.png')` |
| Data URI | `'data:image/png;base64,iVBORw0...'` |
| Raw Base64 string | `'iVBORw0KGgo...'` |

For best results use a **square PNG**.

> **Note:** the methods that attach images (`XSOverlay` and `OVRToolkit`) are
> `async` because remote/disk images are loaded before the message is sent.
> You can `await` them or fire-and-forget.

### XSOverlay

Connection: `ws://localhost:42070/?client=<name>`
([API docs](https://xsoverlay.vercel.app/Developer/API/websockets/websockets))

```js
const xsOverlay = new XSOverlay();
xsOverlay.connect();

await xsOverlay.sendNotification({
    title: 'Heads up!',
    content: 'Something happened.',
    icon: 'https://example.com/icon.png', // path / URL / Buffer / Base64
    timeout: 6,      // seconds
    height: 120,
    opacity: 1,
    volume: 0.5,
    audioPath: 'default', // 'default' | 'error' | 'warning' | path to .ogg
    type: 1,
});
```

When you pass a real image, `useBase64Icon` is set to `true` automatically.
To use a built-in icon instead, pass `icon: 'default' | 'error' | 'warning'`.

| Field | Type | Default |
| --- | --- | --- |
| `title` | string | `'Default Title'` |
| `content` | string | `'Default Content'` |
| `type` | int | `1` |
| `timeout` | float (s) | `6` |
| `height` | float | `120` |
| `opacity` | float | `1` |
| `volume` | float | `0.5` |
| `audioPath` | string | `'default'` |
| `icon` | string | `'default'` |
| `useBase64Icon` | bool | auto |

### OVRToolkit

Connection: `ws://127.0.0.1:11450/api`
([API docs](https://wiki.ovrtoolkit.co.uk/#/Websocket?id=send-notification))

```js
const ovrToolkit = new OVRToolkit();

// Positional style
await ovrToolkit.sendNotification('Title', 'Body text', './icon.png');

// Or an options object
await ovrToolkit.sendNotification({
    title: 'Title',
    body: 'Body text',
    icon: 'https://example.com/icon.png', // path / URL / Buffer / Base64
});
```

OVRToolkit expects a PNG icon (ideally square); the image is sent as a Base64
string per its WebSocket API. Messages sent before the socket connects are
queued and flushed automatically once connected.

| Field | Type |
| --- | --- |
| `title` | string |
| `body` | string |
| `icon` | PNG (path / URL / Buffer / Base64), or `null` |

### Windows Notifications

Desktop notifications via [node-notifier](https://www.npmjs.com/package/node-notifier).

```js
const win = new WindowsNotifications();
await win.sendNotification('Hello Windows!', 'This is a Windows notification', './icon.png');
```

`sendNotification` is `async`. The `icon` accepts the same inputs as the VR
targets — a local file path, an http(s) URL, a `Buffer`, a data URI or a raw
Base64 string. Because node-notifier needs a file on disk, anything that isn't
already a local file is written to a temp file automatically.

| Field | Type |
| --- | --- |
| `title` | string |
| `message` | string |
| `icon` | path / URL / Buffer / Base64, or `null` |

## License

MIT © NekoSuneVR
