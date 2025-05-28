/* eslint-disable sonarjs/hashing -- expected */
/* eslint-disable sonarjs/pseudo-random -- expected */
/* eslint-disable no-bitwise -- bitwise calculation */

import crypto from 'node:crypto';
import { getPlatformCode } from '../fingerprint/platform.js';
import { encryptCrc32, genRandomString } from './encrypt.js';
import { type defaultConfig } from '@/client/config.js';

function getMnsToken(resource: string, body: unknown, hash: string): string {
  return 'error';
}

/**
 * Generates a unique local identifier string for a given platform.
 *
 * @remarks This generate the `a1` cookie value.
 *
 * @param platform - The name of the platform for which to generate the local ID.
 * @returns A 52-character unique local identifier string.
 */
function generateLocalId(platform: string): string {
  const platformCode = getPlatformCode(platform).toString();
  const id = ''
    .concat(Number(new Date()).toString(16))
    .concat(genRandomString(30))
    .concat(platformCode)
    .concat('0')
    .concat('000');
  const encryptedId = encryptCrc32(id).toString();
  return ''.concat(id).concat(encryptedId).substring(0, 52);
}

/**
 * Generates a web identifier from a local identifier.
 *
 * @param localId - The local identifier.
 * @returns A web identifier string generated from the local ID.
 */
function generateWebId(localId: string): string {
  return crypto.createHash('md5').update(localId).digest('hex');
}

/**
 * Creates a unique search identifier.
 *
 * @returns A unique search identifier string in base-36 format
 */
function createSearchId(): string {
  const ts = BigInt(Date.now());
  const rand = BigInt(Math.floor(0x7ffffffe * Math.random()));
  return ((ts << BigInt(64)) + rand).toString(36);
}

/**
 * Creates a unique request identifier.
 *
 * @returns A unique request identifier string.
 */
function createRequestId(): string {
  const ts = BigInt(Date.now());
  const rand = BigInt(Math.ceil(0x7ffffffe * Math.random()));
  return ''.concat(rand.toString(), '-').concat(ts.toString());
}

const h = [
  '/t.xiaohongshu.com',
  '/c.xiaohongshu.com',
  'spltest.xiaohongshu.com',
  't2.xiaohongshu.com',
  't2-test.xiaohongshu.com',
  'lng.xiaohongshu.com',
  'apm-track.xiaohongshu.com',
  'apm-track-test.xiaohongshu.com',
  'fse.xiaohongshu.com',
  'fse.devops.xiaohongshu.com',
  'fesentry.xiaohongshu.com',
  'spider-tracker.xiaohongshu.com',
];

function utils_shouldSign(url: string): boolean {
  return url.includes(window.location.host) || url.includes('sit.xiaohongshu.com')
    ? true
    : h.some((i) => url.includes(i));
}

/**
 * Generates an XHS (XiaoHongShu) token for the given URL based on configuration settings.
 *
 * @param config - The configuration object containing settings for XHS token generation
 * @param url - The URL string to generate a token for
 * @returns The XHS token string if conditions are met, null if URL should be ignored, or empty string as fallback
 */
function xhsToken(config: typeof defaultConfig, url: string): string | null {
  const a = config.xsIgnore;
  if (a.some((e) => url.includes(e)) && utils_shouldSign(url)) {
    return null;
  }
  // return window.__xhs_sc__.getXHSToken() || '';
  return '';
}

export { getMnsToken, generateLocalId, generateWebId, createSearchId, createRequestId, xhsToken };
