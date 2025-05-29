/* eslint-disable sonarjs/pseudo-random -- expected */

import Long from 'long';
import { Int } from './utils.js';

/**
 * Generates an X-Ray trace ID using timestamp and random values.
 *
 * @param timestamp - Timestamp for trace ID generation, defaults to current time
 * @returns 32-character hexadecimal trace ID
 */
function xrayTraceId(timestamp = Date.now()): string {
  return ''
    .concat(Long.fromNumber(timestamp, true).shiftLeft(23).or(Int.seq()).toString(16).padStart(16, '0'))
    .concat(new Long(Int.random(32), Int.random(32), true).toString(16).padStart(16, '0'));
}

/**
 * Generates a B3 trace ID for distributed tracing.
 *
 * @returns 16-character hexadecimal trace ID
 */
function b3TraceId(): string {
  const characters = 'abcdef0123456789';
  return Array.from({ length: 16 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
}

export { b3TraceId, xrayTraceId };
