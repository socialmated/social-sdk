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
    const searchParams = new URLSearchParams(new URL(options.url!).searchParams);
    if (value !== undefined) {
      searchParams.set(key, value);
    }
    options.searchParams = searchParams;
  };

const setRequestSearchParams =
  (
    params: Record<string, Promisable<string | undefined> | ((options: Options) => Promisable<string | undefined>)>,
  ): BeforeRequestHook =>
  async (options) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- should be defined in the request
    const searchParams = new URLSearchParams(new URL(options.url!).searchParams);
    for (const [key, valueOrGetValue] of Object.entries(params)) {
      const value = typeof valueOrGetValue === 'function' ? await valueOrGetValue(options) : await valueOrGetValue;
      if (value !== undefined) {
        searchParams.set(key, value);
      }
    }
    options.searchParams = searchParams;
  };

export { setRequestSearchParam, setRequestSearchParams };
