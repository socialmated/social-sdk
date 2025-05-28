/* eslint-disable sonarjs/pseudo-random -- expected */

/**
 * Utility for integer sequence and random number generation.
 */
export const Int = {
  /**
   * Maximum sequence number allowed, which is 2^23 - 1.
   */
  MAX_SEQ: 8388607,

  /**
   * Current sequence number, initialized to a random value.
   */
  SEQ: Math.floor(Math.random() * Math.pow(2, 23)),

  /**
   * Generates a sequential number, wrapping around if it exceeds MAX_SEQ.
   *
   * @returns A sequential number.
   */
  seq(): number {
    if (this.SEQ > this.MAX_SEQ) {
      this.SEQ = 0;
    }
    return this.SEQ++;
  },

  /**
   * Generates a random number with the specified number of bits.
   *
   * @param n - The number of bits for the random number.
   * @returns A random number between 0 and 2^n - 1.
   */
  random(n: number): number {
    return Math.floor(Math.random() * Math.pow(2, n));
  },
};
