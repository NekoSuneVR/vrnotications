// imageHelper.js
// Shared helper to normalise an image into either a Base64 string (for the VR
// WebSocket APIs) or a local file path (for desktop notifiers that need a file
// on disk).
//
// Accepts any of the following:
//   - null / undefined / ''       -> null
//   - Buffer                      -> the bytes as-is
//   - data URI ("data:image/...") -> the embedded payload, decoded
//   - http(s) URL                 -> downloaded
//   - local file path             -> read from disk
//   - existing Base64 string      -> decoded
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const axios = require('axios');

const HTTP_REGEX = /^https?:\/\//i;
const DATA_URI_REGEX = /^data:(.*?);base64,/i;

/**
 * Resolve an image input into a Buffer of its bytes.
 * @param {string|Buffer|null|undefined} input
 * @returns {Promise<{buffer: Buffer, ext: string}|null>}
 */
async function loadImageAsBuffer(input) {
    if (input === null || input === undefined || input === '') {
        return null;
    }

    // Raw bytes
    if (Buffer.isBuffer(input)) {
        return { buffer: input, ext: '.png' };
    }

    if (typeof input !== 'string') {
        throw new TypeError(`Unsupported image type: ${typeof input}`);
    }

    // data:image/png;base64,XXXX
    const dataMatch = input.match(DATA_URI_REGEX);
    if (dataMatch) {
        const ext = extFromMime(dataMatch[1]);
        return { buffer: Buffer.from(input.replace(DATA_URI_REGEX, ''), 'base64'), ext };
    }

    // Remote image
    if (HTTP_REGEX.test(input)) {
        const response = await axios.get(input, { responseType: 'arraybuffer' });
        const ext = path.extname(new URL(input).pathname) || '.png';
        return { buffer: Buffer.from(response.data), ext };
    }

    // Local file on disk
    if (fs.existsSync(input)) {
        return { buffer: fs.readFileSync(input), ext: path.extname(input) || '.png' };
    }

    // Assume the caller passed a raw Base64 string
    return { buffer: Buffer.from(input, 'base64'), ext: '.png' };
}

/**
 * Resolve an image input into a raw Base64 string (no data URI prefix).
 * @returns {Promise<string|null>}
 */
async function loadImageAsBase64(input) {
    const result = await loadImageAsBuffer(input);
    return result ? result.buffer.toString('base64') : null;
}

/**
 * Resolve an image input into a local file path that exists on disk.
 * Local paths are returned as-is (absolute); everything else is written to a
 * temp file. Returns null when no image was supplied.
 * @returns {Promise<string|null>}
 */
async function loadImageAsFilePath(input) {
    if (input === null || input === undefined || input === '') {
        return null;
    }

    // Already a local file -> use it directly, no copy needed.
    if (typeof input === 'string' && !HTTP_REGEX.test(input) && !DATA_URI_REGEX.test(input) && fs.existsSync(input)) {
        return path.resolve(input);
    }

    const result = await loadImageAsBuffer(input);
    if (!result) return null;

    // Name the temp file after a hash of its contents to avoid collisions and
    // re-downloading the same image repeatedly.
    const hash = crypto.createHash('md5').update(result.buffer).digest('hex');
    const filePath = path.join(os.tmpdir(), `vrnotications-${hash}${result.ext}`);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, result.buffer);
    }
    return filePath;
}

function extFromMime(mime) {
    if (!mime) return '.png';
    if (/jpe?g/i.test(mime)) return '.jpg';
    if (/gif/i.test(mime)) return '.gif';
    if (/bmp/i.test(mime)) return '.bmp';
    if (/ico/i.test(mime)) return '.ico';
    return '.png';
}

module.exports = { loadImageAsBase64, loadImageAsFilePath, loadImageAsBuffer };
