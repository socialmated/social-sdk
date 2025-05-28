/* eslint-disable no-bitwise -- bitwise calculation */
/* eslint-disable @typescript-eslint/no-non-null-assertion -- assert indexing */

const DEFAULT_BASE64_ALPHABET = 'ZmserbBoHQtNP+wOcza/LpngG8yJq42KWYj0DSfdikx3VT16IlUAFM97hECvuRX5';

/**
 * Encodes a 24-bit number (triplet) into a 4-character Base64 string using the default Base64 alphabet.
 *
 * @param n - The 24-bit number to encode.
 * @returns The Base64-encoded string representation of the input number.
 */
function tripletToBase64(n: number): string {
  const P = DEFAULT_BASE64_ALPHABET;
  return P[(n >> 18) & 63]! + P[(n >> 12) & 63]! + P[(n >> 6) & 63]! + P[63 & n]!;
}

/**
 * Encodes a chunk of a Uint8Array into a Base64 string representation.
 *
 * @param ns - The input Uint8Array containing the bytes to encode.
 * @param i - The starting index (inclusive) of the chunk to encode.
 * @param j - The ending index (exclusive) of the chunk to encode.
 * @returns The Base64-encoded string of the specified chunk.
 */
function encodeChunk(ns: Uint8Array, i: number, j: number): string {
  const chunks: string[] = [];
  // Process the chunk in groups of 3 bytes (24 bits).
  for (let k = i; k < j; k += 3) {
    const c = ((ns[k]! << 16) & 0xff0000) | ((ns[k + 1]! << 8) & 0xff00) | (ns[k + 2]! & 0xff);
    chunks.push(tripletToBase64(c));
  }
  return chunks.join('');
}

/**
 * Encodes a given string into a UTF-8 encoded Uint8Array.
 *
 * @param str - The string to encode.
 * @returns A Uint8Array containing the UTF-8 encoded bytes of the input string.
 */
function encodeUtf8(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

/**
 * Encodes a given Uint8Array into a Base64 string using a custom alphabet.
 *
 * @param input - The binary data to encode as a Uint8Array.
 * @returns The Base64-encoded string representation of the input.
 */
function b64Encode(input: Uint8Array): string {
  const P = DEFAULT_BASE64_ALPHABET;
  const s: string[] = [];

  const len = input.length;
  const rem = len % 3;
  const n = len - rem;

  // Process the input in chunks of 16383 bytes (or less for the last chunk).
  for (let u = 0; u < n; u += 16383) {
    s.push(encodeChunk(input, u, u + 16383 > n ? n : u + 16383));
  }

  // Add padding characters if necessary.
  let r: number;
  if (rem === 1) {
    r = input[len - 1]!;
    s.push(`${P[r >> 2]! + P[(r << 4) & 63]!}==`);
  } else if (rem === 2) {
    r = (input[len - 2]! << 8) + input[len - 1]!;
    s.push(`${P[r >> 10]! + P[(r >> 4) & 63]! + P[(r << 2) & 63]!}=`);
  }

  return s.join('');
}

/**
 * Computes a CRC32 checksum for the given input string or Uint8Array.
 *
 * @param str - The input data to compute the checksum for. Can be a string or a Uint8Array.
 * @returns The CRC32 checksum as a number.
 */
function encryptMcr(str: string | Uint8Array): number {
  // Precompute the CRC32 table for all 256 possible byte values.
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let crc = i;
    for (let j = 0; j < 8; j++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
    table[i] = crc >>> 0;
  }

  // Compute the CRC32 checksum for the input string or Uint8Array.
  if (typeof str === 'string') {
    let i = -1;
    for (let r = 0; r < str.length; ++r) {
      i = table[(255 & i) ^ str.charCodeAt(r)]! ^ (i >>> 8);
    }
    return -1 ^ i ^ 0xedb88320;
  }

  let i = -1;
  for (const byte of str) {
    i = table[(255 & i) ^ byte]! ^ (i >>> 8);
  }
  return -1 ^ i ^ 0xedb88320;
}

export { b64Encode, encodeUtf8, encryptMcr };
