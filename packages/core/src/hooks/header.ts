import { type Options, type BeforeRequestHook, type Headers } from 'got';
import { type Promisable, type ValueOf } from 'type-fest';

function setRequestHeader(
  header: string,
  getValue: (options: Options) => Promisable<ValueOf<Headers>>,
): BeforeRequestHook;
// eslint-disable-next-line @typescript-eslint/unified-signatures -- explicitly overload
function setRequestHeader(header: string, value: ValueOf<Headers>): BeforeRequestHook;
function setRequestHeader(
  header: string,
  valueOrGetValue: Promisable<ValueOf<Headers>> | ((options: Options) => Promisable<ValueOf<Headers>>),
): BeforeRequestHook {
  return async (options) => {
    const value = typeof valueOrGetValue === 'function' ? await valueOrGetValue(options) : await valueOrGetValue;
    if (value !== undefined) options.headers[header] = value;
  };
}

function setRequestHeaders(
  headers: Record<string, Promisable<ValueOf<Headers>> | ((options: Options) => Promisable<ValueOf<Headers>>)>,
): BeforeRequestHook {
  return async (options) => {
    for (const [key, valueOrGetValue] of Object.entries(headers)) {
      const value = typeof valueOrGetValue === 'function' ? await valueOrGetValue(options) : await valueOrGetValue;
      if (value !== undefined) options.headers[key] = value;
    }
  };
}

export { setRequestHeader, setRequestHeaders };
