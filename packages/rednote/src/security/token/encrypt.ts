/* eslint-disable @typescript-eslint/no-non-null-assertion -- assert indexing */
/* eslint-disable no-bitwise -- bitwise calculation */
/* eslint-disable sonarjs/pseudo-random -- expected */

/**
 * Computes the CRC32 checksum of a given string.
 *
 * @param str - The input string to compute the CRC32 checksum for.
 * @returns The CRC32 checksum as an unsigned 32-bit integer.
 */
function encryptCrc32(str: string): number {
  // Precompute the CRC32 table for all 256 possible byte values.
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let crc = i;
    for (let j = 0; j < 8; j++) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }
    table[i] = crc;
  }

  // Compute the CRC32 checksum for the input string.
  let crc = -1;
  for (let i = 0; i < str.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ str.charCodeAt(i)) & 0xff]!;
  }
  return (crc ^ -1) >>> 0;
}

/**
 * Generates a random alphanumeric string of the specified length.
 *
 * @param length - The desired length of the generated string.
 * @returns A randomly generated alphanumeric string.
 */
function genRandomString(length: number): string {
  return Array(length)
    .fill(undefined)
    .map(() => 'abcdefghijklmnopqrstuvwxyz1234567890'[Math.floor(36 * Math.random())])
    .join('');
}

export { encryptCrc32, genRandomString };
