/* eslint-disable no-bitwise -- bitwise calculation */
/* eslint-disable @typescript-eslint/no-non-null-assertion -- assert indexing */
/* eslint-disable sonarjs/encryption-secure-mode -- expected */
/* eslint-disable sonarjs/hashing -- expected */

import crypto from 'node:crypto';

/**
 * Generates an MD5 hash of the input string.
 *
 * @param input - The input string to hash.
 * @returns The MD5 hash of the input string as a hexadecimal string.
 */
function md5(input: string): string {
  return crypto.createHash('md5').update(input).digest('hex');
}

/**
 * Encrypts a UTF-8 string using AES-128-CBC mode.
 *
 * @param key - The encryption key as a hexadecimal string (16 bytes).
 * @param iv - The initialization vector as a hexadecimal string (16 bytes).
 * @param input - The plaintext input string to encrypt.
 * @returns The encrypted data encoded in base64.
 *
 * @throws If the key or IV are not valid hexadecimal strings of the correct length.
 */
function aes128cbc(key: string, iv: string, input: string): string {
  const cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
  let encrypted = cipher.update(input, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

/**
 * Converts a base64-encoded string to its hexadecimal representation.
 *
 * @param str - The base64-encoded string to convert.
 * @returns The hexadecimal string representation of the decoded data.
 */
function base64ToHex(str: string): string {
  const decodedData = Buffer.from(str, 'base64');
  return Array.from(decodedData)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Default base64 alphabet used for encoding.
 */
const DEFAULT_BASE64_ALPHABET = 'A4NjFqYu5wPHsO0XTdDgMa2r1ZQocVte9UJBvk6/7=yRnhISGKblCWi+LpfE8xzm3';

/**
 * Default app client identifier.
 */
const DEFAULT_APP_ID = 'xhs-pc-web';

/**
 * Encodes the given payload and app ID information into a base64-encoded JSON string
 * with additional signing metadata.
 *
 * @param signature - The signature string.
 * @param appId - The app client identifier.
 * @returns A base64-encoded string representing the signed data object.
 */
function encodeSignature(signature: string, appId = DEFAULT_APP_ID): string {
  const data = {
    signSvn: '56',
    signType: 'x2',
    appId,
    signVersion: '1',
    payload: base64ToHex(signature),
  };

  return Buffer.from(JSON.stringify(data), 'utf-8').toString('base64');
}

/**
 * Encodes a string into a custom base64 format using a specific alphabet.
 *
 * @param str - The string to be encoded.
 * @returns The base64-encoded string.
 */
function encodeBase64(str: string): string {
  const input = new TextEncoder().encode(str);
  const a = DEFAULT_BASE64_ALPHABET;

  let output = '';
  let i = 0;

  while (i < input.length) {
    const chr1 = input[i++]!;
    const chr2 = input[i++]!;
    const chr3 = input[i++]!;

    const enc1 = chr1 >> 2;
    const enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);

    let enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    let enc4 = chr3 & 63;
    if (isNaN(chr2)) {
      enc3 = 64;
      enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }

    output += a.charAt(enc1) + a.charAt(enc2) + a.charAt(enc3) + a.charAt(enc4);
  }

  return output;
}

export { md5, aes128cbc, encodeSignature, encodeBase64 };
