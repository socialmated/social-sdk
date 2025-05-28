/* eslint-disable sonarjs/hashing -- expected */

import crypto from 'node:crypto';
import Long from 'long';
import { Int } from './utils.js';

/**
 * Generates a B3 trace ID.
 *
 * @param timestamp - The timestamp in milliseconds. Defaults to `Date.now()`.
 * @returns A B3 trace ID string formatted as a 32-character hexadecimal string.
 */
function b3TraceId(timestamp = Date.now()): string {
  return ''
    .concat(Long.fromNumber(timestamp, true).shiftLeft(23).or(Int.seq()).toString(16).padStart(16, '0'))
    .concat(new Long(Int.random(32), Int.random(32), true).toString(16).padStart(16, '0'));
}

/**
 * Generates an X-Ray Trace ID from a B3 trace ID.
 *
 * @param b3TraceId - The B3 trace ID to be converted.
 * @returns The X-Ray Trace ID as a 32-character hexadecimal string.
 */
// eslint-disable-next-line @typescript-eslint/no-shadow -- name clash
function xrayTraceId(b3TraceId: string): string {
  return crypto.createHash('md5').update(b3TraceId).digest('hex');
}

export { b3TraceId, xrayTraceId };
