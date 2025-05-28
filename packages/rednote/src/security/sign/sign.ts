import { getMnsToken } from '../token/token.js';
import { aes128cbc, encodeBase64, encodeSignature, md5 } from './encrypt.js';

/**
 * Represents the output of the XHS signature generation process.
 */
export interface XhsSignOutput {
  /**
   * The signature string.
   */
  'X-s': string;
  /**
   * The timestamp of the signature.
   */
  'X-t': string;
  /**
   * The MNS token or 'unload' if not applicable.
   */
  'X-Mns': string;
}

/**
 * Default words used to generate the key bytes for AES encryption.
 */
const DEFAULT_WORDS = [929260340, 1633971297, 895580464, 925905270];

/**
 * Default key bytes used as the key for AES encryption.
 */
const DEFAULT_KEY_BYTES = Buffer.concat(
  DEFAULT_WORDS.map((word) => Buffer.from(word.toString(16).padStart(8, '0'), 'hex')),
);

/**
 * The default initialization vector (IV) used for encryption operations.
 */
const DEFAULT_IV = Buffer.from('4uzjr7mbsibcaldp', 'utf-8');

/**
 * Default keyword used in the signing process.
 */
const DEFAULT_KEYWORD = 'test';

/**
 * Generates a signed and encrypted string for API requests.
 *
 * @privateRemarks This is the `window._webmsxyw` sign method in Xiaohongshu(XHS) Web.
 *
 * @param resource - The API resource to be signed, e.g., '/api/v1/resource?param=value'.
 * @param body - The request body.
 * @param a1 - The a1 cookie value used for signing.
 * @param timestamp - The timestamp to use for the signature. Defaults to the current time.
 * @param appId - The app client identifier. Defaults to 'xhs-pc-web'.
 * @returns The signature string and timestamp.
 */
function signNew(
  resource: string,
  body: unknown,
  a1: string,
  timestamp: number = Date.now(),
): Omit<XhsSignOutput, 'X-Mns'> {
  const urlHash = md5(encodeURIComponent(`url=${resource}${body ? JSON.stringify(body) : ''}`));
  const ts = timestamp.toString();

  const data = `x1=${urlHash};x2=0|0|0|1|0|0|1|0|0|0|1|0|0|0|0|1|0|0|0;x3=${a1};x4=${ts};`;
  const encrypted = aes128cbc(
    DEFAULT_KEY_BYTES.toString('hex'),
    DEFAULT_IV.toString('hex'),
    Buffer.from(data, 'utf-8').toString('base64'),
  );

  return {
    'X-s': `XYW_${encodeSignature(encrypted)}`,
    'X-t': ts,
  };
}

/**
 * Generates a signed string for API requests using an older signing method.
 *
 * @privateRemarks This is the `encrypt_sign` sign method in Xiaohongshu(XHS) Web.
 *
 * @param resource - The API resource to be signed, e.g., '/api/v1/resource?param=value'.
 * @param body - The request body.
 * @param timestamp - The timestamp to use for the signature. Defaults to the current time.
 * @returns The signature string and timestamp.
 *
 * @deprecated Use `signNew` instead for new implementations.
 */
function signOld(resource: string, body: unknown, timestamp: number = Date.now()): Omit<XhsSignOutput, 'X-Mns'> {
  const data = [timestamp, DEFAULT_KEYWORD, resource, body ? JSON.stringify(body) : ''].join('');
  const encrypted = md5(encodeURIComponent(data));

  return {
    'X-s': encodeBase64(encrypted),
    'X-t': timestamp.toString(),
  };
}

function generateMns(resource: string, body: unknown): string {
  const data = [resource, body ? JSON.stringify(body) : ''].join('');
  const hash = md5(data);

  return getMnsToken(resource, body, hash);
}

function signV2(resource: string, body: unknown, a1: string): Omit<XhsSignOutput, 'X-Mns'> {
  const data = [resource, body ? JSON.stringify(body) : ''].join('');
  const hash = md5(data);
  return mnsv2(data, hash);
}

function mnsv2(data: string, hash: string): Omit<XhsSignOutput, 'X-Mns'> {
  throw new Error('Not implemented');
}

export {
  signNew,
  signNew as _webmsxyw, // alias
  signOld,
  signOld as encryptSign, // alias
  generateMns,
};
