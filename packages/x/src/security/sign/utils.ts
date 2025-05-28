/* eslint-disable @typescript-eslint/no-non-null-assertion -- assert indexed access */
/* eslint-disable no-bitwise -- bitwise calculation */

/**
 * Returns a specific value based on whether the input number is odd.
 *
 * @param num - Number to check.
 * @returns -1.0 if odd, 0.0 if even.
 */
function isOdd(num: number): number {
  return num % 2 ? -1.0 : 0.0;
}

/**
 * Converts a number to a two-character hexadecimal string.
 * @param n - The number to convert.
 * @returns The hexadecimal string.
 */
function toHex(n: number): string {
  return (n < 16 ? '0' : '') + n.toString(16);
}

/**
 * Computes the bitwise XOR of the given number `n` with the first element of the `arr`
 * if the `index` is non-zero; otherwise, returns `n` unchanged.
 *
 * @param n - The number to be XORed.
 * @param index - The index indicating whether to perform the XOR operation.
 * @param arr - The array whose first element is used for the XOR operation.
 * @returns The result of `n ^ arr[0]` if `index` is non-zero; otherwise, returns `n`.
 */
function xor(n: number, index: number, arr: Uint8Array): number {
  return index ? n ^ arr[0]! : n;
}

/**
 * Scales a number `n` from the range [0, 255] to a new range [`min`, `max`].
 *
 * @param n - The input number to scale, expected in the range [0, 255].
 * @param min - The minimum value of the target range.
 * @param max - The maximum value of the target range.
 * @param floor - If `true`, the result is floored to the nearest integer; otherwise, it is rounded to two decimal places.
 * @returns The scaled number in the range [`min`, `max`], either floored or rounded.
 */
function scale(n: number, min: number, max: number, floor?: boolean): number {
  const result = (n * (max - min)) / 255 + min;
  return floor ? Math.floor(result) : Math.round(result * 100) / 100;
}

export { isOdd, toHex, scale, xor };
