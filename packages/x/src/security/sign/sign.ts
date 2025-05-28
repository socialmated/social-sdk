/* eslint-disable prefer-named-capture-group -- unnamed */
/* eslint-disable sonarjs/pseudo-random -- expected */
/* eslint-disable @typescript-eslint/no-non-null-assertion -- assert indexed access */

import { generateSessionId, writeSessionBoilerplate } from 'sdp';
import { type Keyframe, animate } from './animate.js';
import { decodeBase64, sha256, encodeBase64 } from './encrypt.js';
import { scale, isOdd, xor } from './utils.js';

/**
 * Default salt value used in the transaction ID generation.
 */
const DEFAULT_SALT = 3;

/**
 * Total time for the animation in milliseconds.
 */
const ANIMATION_TOTAL_TIME = 4096;

/**
 * Default keyword used in transaction ID generation.
 */
const DEFAULT_KEYWORD = 'obfiowerehiring';

/**
 * Decodes a base64-encoded verification key string into a Uint8Array.
 *
 * @param key - The base64-encoded verification key to decode.
 * @returns The decoded verification key as a Uint8Array.
 */
function decodeVerificationKey(key: string): Uint8Array {
  return decodeBase64(key);
}

/**
 * Extracts and parses the path data from an SVG element.
 *
 * @param svg - The SVGElement containing the path data to extract.
 * @returns An 2D array of the coordinates and control points for each cubic Bézier segment found in the path data.
 */
function extractSvgPathData(svg: SVGElement): number[][] {
  // Extract the path data from the SVG element.
  const g = svg.childNodes[0] as SVGGElement;
  const path = g.childNodes[1] as SVGPathElement;
  const dAttr = path.getAttribute('d') ?? '';

  // Remove the first 9 characters and split the path by "C" to get segments.
  return dAttr
    .substring(9)
    .split('C')
    .map((segment) =>
      segment
        .replace(/[^\d]+/g, ' ')
        .trim()
        .split(' ')
        .map(Number),
    );
}

/**
 * Generates a `Keyframe` object based on the provided path data.
 *
 * @param pathData - An array of numbers representing the path data. The first 6 elements are used for color,
 * the 7th for rotation, and the remaining elements are used for cubic bezier easing.
 * @returns A `Keyframe` object containing color, transform, and easing properties.
 */
function getAnimationKeyframe(pathData: number[]): Keyframe {
  const points = Array.from(pathData.slice(7)).map((n, i) => scale(n, isOdd(i), 1));
  return {
    color: [
      [pathData[0]!, pathData[1]!, pathData[2]!],
      [pathData[3]!, pathData[4]!, pathData[5]!],
    ],
    transform: {
      rotate: [0, scale(pathData[6]!, 60, 360, true)],
    },
    easing: {
      cubicBezier: [points[0]!, points[1]!, points[2]!, points[3]!],
    },
  };
}

/**
 * Derives the animation key from the key bytes and frame data.
 *
 * @param keyBytes - Key bytes derived from site verification.
 * @param rowIndex - Index used to select the frame row.
 * @param keyByteIndices - Indices used for frame time calculation.
 * @param svgs - SVG frame elements from the DOM.
 * @returns Animation key string.
 */
function deriveAnimationKey(
  keyBytes: Uint8Array,
  indices: [number, number, number, number],
  svgs: SVGElement[],
): string {
  // Select the frame and convert it to a 2D array.
  const frame = svgs[keyBytes[5]! % 4]!;
  const pathData = extractSvgPathData(frame);

  // Select a row of path data and get the keyframe.
  const row = pathData[keyBytes[indices[0]]! % 16]!;
  const keyframe = getAnimationKeyframe(row);

  // Calculate frame time using the provided indices and key bytes.
  const frameTime = (keyBytes[indices[1]]! % 16) * (keyBytes[indices[2]]! % 16) * (keyBytes[indices[3]]! % 16);

  // Do the animation and get the style.
  const computedStyle = animate(keyframe, frameTime / ANIMATION_TOTAL_TIME);

  // Convert the computed style to a hexadecimal string.
  return Array.from(`${computedStyle.color}${computedStyle.transform}`.matchAll(/([\d.-]+)/g))
    .map((n) => Number(Number(n[0]).toFixed(2)).toString(16))
    .join('')
    .replace(/[.-]/g, '');
}

/**
 * Generates a WebRTC SDP fingerprint based on the provided key bytes.
 *
 * @param keyBytes - A `Uint8Array` containing key bytes used to determine which characters to select from the SDP string.
 * @returns An array of strings representing the generated fingerprint.
 */
function generateWebRtcFingerprint(keyBytes: Uint8Array): string[] {
  const label = Math.random().toString(36);
  const sessionId = generateSessionId();
  const sdp = writeSessionBoilerplate(sessionId, 2, '-')
    .concat('a=extmap-allow-mixed\r\n')
    .concat('a=msid-semantic: WMS\r\n');

  const source = sdp || label;
  const fingerprint = [source[keyBytes[5]! % 8] ?? '4', source[keyBytes[8]! % 8]!];

  return Array.from(fingerprint);
}

/**
 * Generates a signed transaction ID for API requests.
 *
 * @param method - HTTP method (e.g., 'GET', 'POST').
 * @param path - API endpoint path (e.g., '/api/endpoint').
 * @param key - Verification key string.
 * @param animationKey - Animation key string.
 * @param timestamp - Optional timestamp in milliseconds (defaults to current time).
 * @param webRtcFingerprint - Optional WebRTC fingerprint array (defaults to empty).
 * @returns Base64-encoded transaction ID string.
 */
async function transactionId(
  method: string,
  path: string,
  keyBytes: Uint8Array,
  animationKey: string,
  timestamp: number = Date.now(),
  webRtcFingerprint: number[] = [],
): Promise<string> {
  // Calculate the current time offset in seconds from a fixed epoch.
  const epochTime = Math.floor((timestamp - 1682924400 * 1000) / 1000);
  const epochTimeBytes = new Uint8Array(new Uint32Array([epochTime]).buffer);

  // Construct the data string for hashing.
  const data = `${[method, path, epochTime].join('!')}${DEFAULT_KEYWORD}${animationKey}`;

  // Compute SHA-256 hash of the data string.
  const hashBuffer = await sha256(data);
  const hashBytes = Array.from(new Uint8Array(hashBuffer)).concat(webRtcFingerprint);

  // Generate a random byte for obfuscation.
  const rand = Math.floor(Math.random() * 256);

  // Construct the byte array for the transaction ID then obfuscate with XOR.
  const bytesArr = new Uint8Array(
    [rand].concat(Array.from(keyBytes), Array.from(epochTimeBytes), hashBytes.slice(0, 16), DEFAULT_SALT),
  ).map(xor);

  return encodeBase64(bytesArr);
}

export { decodeVerificationKey, deriveAnimationKey, generateWebRtcFingerprint, transactionId };
