import { type Options } from 'got';
import { type Promisable } from 'type-fest';

/**
 * Represents a signer that can sign requests.
 *
 * @typeParam T - The type of the signed request.
 */
export interface Signer<T> {
  /**
   * Signs the request with the provided options.
   *
   * @param req - The request options to sign.
   * @returns A promise that resolves to the signed request.
   */
  sign: (req: Options) => Promisable<T>;
}
