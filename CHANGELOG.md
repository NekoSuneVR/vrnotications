# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.1] - 2026-06-09

### Fixed

- Release pipeline: rewrote `CHANGELOG.md` in strict Keep a Changelog format so the npmjs publish workflow can parse it, repaired the GitHub Packages publish workflow (removed a broken tag-push step), and made the changelog the single source the release body is read from.

## [1.0.0] - 2026-06-09

First release under the `@nekosuneprojects` scope.

### Added

- **XSOverlay** notification support over its local WebSocket API (`ws://localhost:42070`).
- **OVRToolkit** notification support over its local WebSocket API (`ws://127.0.0.1:11450/api`), with automatic message queueing until the socket connects.
- **Windows** desktop notifications via [`node-notifier`](https://www.npmjs.com/package/node-notifier).
- **Image / icon attachment** across all three targets — accepts a local file path, an `http(s)` URL, a `Buffer`, a data URI, or a raw Base64 string.
- Shared `imageHelper` that normalises any image input into Base64, a `Buffer`, or a local temp file (the latter for desktop notifiers that need a file on disk).
- XSOverlay automatically enables `useBase64Icon` when a real image is supplied (built-in `default` / `error` / `warning` icons pass through untouched).
- OVRToolkit `sendNotification` accepts either positional arguments (`title, body, icon`) or a single options object (`{ title, body, icon }`).

### Changed

- `sendNotification` is now `async` on all three targets so images can be loaded from disk/URLs before the notification is sent.

### Fixed

- Removed a broken, undeclared `uuid` import in `xsOverlay.js` that would throw on require.

[Unreleased]: https://github.com/NekoSuneProjects/vrnotications/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/NekoSuneProjects/vrnotications/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/NekoSuneProjects/vrnotications/releases/tag/v1.0.0
