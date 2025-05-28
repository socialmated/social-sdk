/**
 * Encodes a Uint8Array to a base64 string without padding.
 *
 * @param byte - Uint8Array to encode.
 * @returns Base64 encoded string with padding characters ('=') removed.
 */
function encodeBase64(byte: Uint8Array): string {
  const buffer = new Uint8Array(byte.buffer, byte.byteOffset, byte.byteLength);
  return Buffer.from(buffer).toString('base64').replace(/=/g, '');
}

/**
 * Decodes a base64 string to a Uint8Array.
 *
 * @param str - Base64 encoded string.
 * @returns Uint8Array of decoded bytes.
 */
function decodeBase64(str: string): Uint8Array {
  const buffer = Buffer.from(str, 'base64');
  return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
}

/**
 * Converts a string or Uint8Array to Uint8Array.
 * @param input - The input string or Uint8Array.
 * @returns The Uint8Array.
 */
function toUint8Array(input: string | Uint8Array): Uint8Array {
  return typeof input === 'string' ? new TextEncoder().encode(input) : input;
}

/**
 * Computes the SHA-256 digest of the input.
 * @param input - The input string or Uint8Array.
 * @returns A promise resolving to the digest as an ArrayBuffer.
 */
function sha256(input: string | Uint8Array): Promise<ArrayBuffer> {
  return crypto.subtle.digest('SHA-256', toUint8Array(input));
}

export { encodeBase64, decodeBase64, sha256 };
