import { type Options, type BeforeRequestHook } from 'got-scraping';
import { type Promisable } from 'type-fest';

/**
 * Creates a BeforeRequestHook that sets a specific search parameter in the request options.
 *
 * @param key - The key of the search parameter to set.
 * @param valueOrGetValue - A value or a function that returns a value to set for the search parameter.
 * @returns A BeforeRequestHook that sets the specified search parameter in the request options.
 */
const setRequestSearchParam =
  (
    key: string,
    valueOrGetValue: Promisable<string | undefined> | ((options: Options) => Promisable<string | undefined>),
  ): BeforeRequestHook =>
  async (options) => {
    const value = typeof valueOrGetValue === 'function' ? await valueOrGetValue(options) : await valueOrGetValue;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- should be defined in the request
    const url = new URL(options.url!);
    if (value !== undefined) {
      url.searchParams.set(key, value);
    }
    options.url = url;
  };

/**
 * Creates a BeforeRequestHook that sets multiple search parameters in the request options.
 *
 * @param params - An object where keys are search parameter names and values are either static values or functions
 *                 that return values to set for those parameters.
 * @returns A BeforeRequestHook that sets the specified search parameters in the request options.
 */
const setRequestSearchParams =
  (
    params: Record<string, Promisable<string | undefined> | ((options: Options) => Promisable<string | undefined>)>,
  ): BeforeRequestHook =>
  async (options) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- should be defined in the request
    const url = new URL(options.url!);
    for (const [key, valueOrGetValue] of Object.entries(params)) {
      const value = typeof valueOrGetValue === 'function' ? await valueOrGetValue(options) : await valueOrGetValue;
      if (value !== undefined) {
        url.searchParams.set(key, value);
      }
    }
    options.url = url;
  };

export { setRequestSearchParam, setRequestSearchParams };
