import { type Options, type BeforeRequestHook, type Headers } from 'got';
import { type Promisable, type ValueOf } from 'type-fest';

/**
 * Creates a BeforeRequestHook that sets a specific HTTP header in the request options.
 *
 * @param header - The HTTP header to set in the request.
 * @param getValue - A value or a function that returns a value to set for the header.
 * @returns A BeforeRequestHook that sets the specified header in the request options.
 */
const setRequestHeader =
  (
    header: string,
    valueOrGetValue: Promisable<ValueOf<Headers>> | ((options: Options) => Promisable<ValueOf<Headers>>),
  ): BeforeRequestHook =>
  async (options) => {
    const value = typeof valueOrGetValue === 'function' ? await valueOrGetValue(options) : await valueOrGetValue;
    if (value !== undefined) options.headers[header] = value;
  };

/**
 * Creates a BeforeRequestHook that sets multiple HTTP headers in the request options.
 *
 * @param headers - An object where keys are header names and values are either:
 *                 - A value to set for the header, or
 *                - A function that returns a value to set for the header.
 * @returns A BeforeRequestHook that sets the specified headers in the request options.
 */
const setRequestHeaders =
  (
    headers: Record<string, Promisable<ValueOf<Headers>> | ((options: Options) => Promisable<ValueOf<Headers>>)>,
  ): BeforeRequestHook =>
  async (options) => {
    for (const [key, valueOrGetValue] of Object.entries(headers)) {
      const value = typeof valueOrGetValue === 'function' ? await valueOrGetValue(options) : await valueOrGetValue;
      if (value !== undefined) options.headers[key] = value;
    }
  };

export { setRequestHeader, setRequestHeaders };
