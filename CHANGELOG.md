# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## 1.2.1 - 2026-06-09
### Added
- Image / icon attachment support for XSOverlay, OVRToolkit **and Windows**
  notifications. `icon` now accepts a local file path, an http(s) URL, a
  `Buffer`, a data URI or a raw Base64 string and is normalised automatically.
- Shared `imageHelper` that resolves any image input to Base64, a Buffer or a
  local file path (the latter for desktop notifiers that need a file on disk).
- Windows notifications convert non-file images (URL/Buffer/Base64) to a temp
  file automatically so node-notifier can display them.
- XSOverlay automatically enables `useBase64Icon` when a real image is supplied
  (built-in `default`/`error`/`warning` icons are forwarded untouched).
- OVRToolkit `sendNotification` now also accepts a single options object
  (`{ title, body, icon }`) in addition to positional arguments.

### Changed
- `XSOverlay.sendNotification`, `OVRToolkit.sendNotification` and
  `WindowsNotifications.sendNotification` are now `async` to support loading
  images from disk/URLs before sending.
- Updated implementations to match the current XSOverlay and OVRToolkit
  WebSocket API documentation.
- Rewrote the README with full usage, field tables and image attachment docs.

### Fixed
- Removed a broken `uuid` import in `xsOverlay.js` that was never used and was
  not declared as a dependency (would throw on require).

## 1.2.0 - 2025-01-23

## 1.1.2 - 2024-09-04

## 1.1.1 - 2024-09-04

## 1.1.0 - 2024-09-04

## 1.0.0 - 2024-09-04
### Added
- Changelog
- Supports XSOverlay
- Supports OVRToolkit
- Supports Windows Notications
