# 🔔 @nekosuneprojects/vrnotications

A simple Node.js module to send **VR notifications** to **XSOverlay**, **OVRToolkit**, and the **Windows desktop** — now with **image / icon attachment** support.  
Built for **VRChat-friendly** overlays and SteamVR setups. 🥽

---

## ✨ Features

- 🥽 Send notifications to **XSOverlay**, **OVRToolkit**, and **Windows** desktop
- 🖼️ **Image / icon attachment** — path, URL, `Buffer`, data URI, or Base64
- ⚡ Simple **async** API
- 🔌 Talks directly to each overlay's **local WebSocket API** — no cloud, no tracking
- 📬 OVRToolkit messages are **queued** until the socket connects
- 🪟 Native Windows toast notifications via [`node-notifier`](https://www.npmjs.com/package/node-notifier)

---

## 📦 Installation

```bash
npm install @nekosuneprojects/vrnotications
```

---

## 💡 Usage

```js
const { XSOverlay, OVRToolkit, WindowsNotifications } = require('@nekosuneprojects/vrnotications');

(async () => {
  // 🟦 XSOverlay
  const xsOverlay = new XSOverlay();
  xsOverlay.connect();
  await xsOverlay.sendNotification({
    title: 'Example Notification!',
    content: "It's an example!",
    icon: './icon.png', // optional image
  });

  // 🟧 OVRToolkit
  const ovrToolkit = new OVRToolkit();
  await ovrToolkit.sendNotification('Cool title', 'My cool body text!', './icon.png');

  // 🪟 Windows Desktop
  const windows = new WindowsNotifications();
  await windows.sendNotification('Hello Windows!', 'This is a Windows notification', './icon.png');
})();
```

---

## 🖼️ Image / Icon Attachment

Every target accepts an image in the same flexible way. The `icon` value is
normalised for you:

| Input | Example |
| --- | --- |
| 📁 Local file path | `'./icon.png'` |
| 🌐 http(s) URL | `'https://example.com/icon.png'` |
| 🧱 `Buffer` | `fs.readFileSync('icon.png')` |
| 🔗 Data URI | `'data:image/png;base64,iVBORw0...'` |
| 🔤 Raw Base64 string | `'iVBORw0KGgo...'` |

> 💡 For best results use a **square PNG**.  
> ⏳ The methods that attach images are **`async`** — `await` them (remote/disk
> images are loaded before the message is sent).

---

## 📘 Targets

### 🟦 XSOverlay

Connects to `ws://localhost:42070/?client=<name>`
([API docs](https://xsoverlay.vercel.app/Developer/API/websockets/websockets)).

```js
const xsOverlay = new XSOverlay();
xsOverlay.connect();

await xsOverlay.sendNotification({
  title: 'Heads up!',
  content: 'Something happened.',
  icon: 'https://example.com/icon.png', // path / URL / Buffer / Base64
  timeout: 6,           // seconds
  height: 120,
  opacity: 1,
  volume: 0.5,
  audioPath: 'default', // 'default' | 'error' | 'warning' | path to .ogg
  type: 1,
});
```

When you pass a real image, `useBase64Icon` is enabled automatically.
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

### 🟧 OVRToolkit

Connects to `ws://127.0.0.1:11450/api`
([API docs](https://wiki.ovrtoolkit.co.uk/#/Websocket?id=send-notification)).

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

OVRToolkit expects a PNG icon (ideally square); it is sent as a Base64 string
per its WebSocket API. Messages sent before the socket connects are queued and
flushed automatically once connected.

| Field | Type |
| --- | --- |
| `title` | string |
| `body` | string |
| `icon` | PNG (path / URL / Buffer / Base64), or `null` |

### 🪟 Windows Notifications

Native desktop toasts via [`node-notifier`](https://www.npmjs.com/package/node-notifier).

```js
const windows = new WindowsNotifications();
await windows.sendNotification('Hello Windows!', 'This is a Windows notification', './icon.png');
```

Because node-notifier needs a file on disk, any non-file image (URL / `Buffer` /
Base64) is written to a temp file automatically.

| Field | Type |
| --- | --- |
| `title` | string |
| `message` | string |
| `icon` | path / URL / Buffer / Base64, or `null` |

---

## 🧩 Supported Overlays

| Overlay | Transport | Image support |
| --- | --- | --- |
| 🟦 XSOverlay | WebSocket `:42070` | ✅ |
| 🟧 OVRToolkit | WebSocket `:11450` | ✅ |
| 🪟 Windows | node-notifier | ✅ |

---

## 🤝 Contributing

Pull requests are welcome! Please keep changes:

- ✅ Consistent with the existing module structure (`modules/`).
- ✅ Documented — update the `README.md` and `CHANGELOG.md`.
- ✅ Respectful of each overlay's official WebSocket API.

---

## ⚠️ Disclaimer

This project is **not** affiliated with or endorsed by VRChat Inc., XSOverlay,
or OVRToolkit. All names, logos, and related elements are property of their
respective owners. Always follow the official
[VRChat Terms of Service](https://hello.vrchat.com/legal) and
[Community Guidelines](https://hello.vrchat.com/community-guidelines).

---

## 🧠 Credits

Maintained by **NekoSune Projects**.  
🐾 Contributions welcome — stay VRChat-friendly!

## GitAds Sponsored
[![Sponsored by GitAds](https://gitads.dev/v1/ad-serve?source=nekosuneprojects/vrnotications@github)](https://gitads.dev/v1/ad-track?source=nekosuneprojects/vrnotications@github)
