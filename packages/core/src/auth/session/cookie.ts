import { canonicalDomain, Cookie, CookieJar } from 'tough-cookie';
import { type Page } from 'playwright';
import { LocalStorage, SessionStorage } from '@denostack/shim-webstore';
import { type Session } from './session.js';

/**
 * Manages session data using browser-like cookies.
 *
 * The `CookieSession` class provides methods to get, set, remove, and clear cookies
 * for a specific URL using a `CookieJar`. It implements the `Session` interface.
 *
 * @example
 * ```typescript
 * const session = new CookieSession(new URL('https://example.com'));
 * await session.set('token', 'abc123');
 * const token = await session.get('token');
 * await session.remove('token');
 * await session.clear();
 * ```
 *
 * @remarks
 * - Cookies are scoped to the provided URL's domain.
 * - Uses a `CookieJar` to manage cookies in-memory or via a persistent store.
 *
 * @see {@link Session}
 */
export class CookieSession implements Session {
  /**
   * Creates an instance of `CookieSession`.
   *
   * @param url - The URL for which cookies are managed.
   * @param cookieJar - An optional `CookieJar` instance for cookie management.
   */
  constructor(
    private url: URL | string,
    public cookieJar = new CookieJar(),
  ) {}

  /**
   * Creates a new `CookieSession` instance from the cookies present in the given Playwright `Page`.
   *
   * This method extracts all cookies from the page's browser context, converts them into `tough-cookie` `Cookie` objects,
   * and stores them in a `CookieJar`. The resulting `CookieSession` is initialized with the current page URL and the populated cookie jar.
   *
   * @param page - The Playwright `Page` instance from which to extract cookies.
   * @returns A promise that resolves to a new `CookieSession` containing the cookies from the page.
   */
  public static async fromPage(page: Page): Promise<CookieSession> {
    const url = page.url();

    // Get all cookies from the context
    const context = page.context();
    const cookies = await context.cookies(url);

    // Create a new CookieJar to store the cookies
    const cookieJar = new CookieJar();

    // Iterate over the cookies and add them to the jar
    for (const cookie of cookies) {
      const toughCookie = new Cookie({
        key: cookie.name,
        value: cookie.value,
        domain: canonicalDomain(cookie.domain), // Normalize domain
        path: cookie.path,
        expires: cookie.expires ? new Date(cookie.expires * 1000) : undefined,
        httpOnly: cookie.httpOnly,
        secure: cookie.secure,
        sameSite: cookie.sameSite,
      });

      // Set the cookie in the jar, ignoring errors for invalid cookies
      await cookieJar.setCookie(toughCookie, url.toString(), {
        ignoreError: true,
      });
    }

    return new CookieSession(url, cookieJar);
  }

  /**
   * Retrieves the value of a cookie by its key from the current cookie jar.
   *
   * @param key - The name of the cookie to retrieve.
   * @returns The value of the cookie as a string, or `undefined` if the cookie does not exist.
   */
  public get(key: string): string | undefined {
    const found = this.cookieJar.getCookiesSync(this.issuer.toString(), {
      expire: false,
      allPaths: true,
    });
    const cookie = found.find((c) => c.key === key);

    return cookie?.value;
  }

  /**
   * Retrieves all cookies associated with the current URL as a key-value map.
   *
   * @returns An object containing all cookies, where the keys are cookie names and the values are cookie values.
   */
  public getAll(): Record<string, string> {
    const cookies = this.cookieJar.getCookiesSync(this.issuer.toString(), {
      expire: false,
      allPaths: true,
    });
    const cookieMap: Record<string, string> = {};
    cookies.forEach((cookie) => {
      cookieMap[cookie.key] = cookie.value;
    });

    return cookieMap;
  }

  /**
   * Removes all cookies from the internal cookie jar, effectively clearing any stored session data.
   */
  public clear(): void {
    this.cookieJar.removeAllCookiesSync();
  }

  /**
   * Refreshes the session by updating the cookies in the cookie jar.
   *
   * @remarks
   * This method is a placeholder for any additional logic that may be needed to refresh the session.
   *
   * @returns A promise that resolves to the refreshed cookie value.
   */
  public refresh(_?: string): Promise<string> {
    return Promise.reject(new Error('Not implemented.'));
  }

  /**
   * Revokes the session by clearing all cookies from the cookie jar.
   *
   * @remarks
   * This method is a placeholder for any additional logic that may be needed to revoke the session.
   *
   * @returns A promise that resolves when the revoke operation is complete.
   */
  public async revoke(_?: string): Promise<void> {
    // Implement any necessary logic to revoke the session if needed
    return Promise.reject(new Error('Not implemented.'));
  }

  /**
   * Retrieves the remaining time in seconds until the specified cookie expires.
   *
   * @param key - The key of the cookie to check for expiration.
   * @returns The remaining time in seconds until the cookie expires, or `NaN` if the cookie does not exist.
   */
  public expiresIn(key?: string): number {
    const cookies = this.cookieJar.getCookiesSync(this.issuer.toString(), {
      expire: false,
      allPaths: true,
    });

    const found = cookies.find((c) => c.key === key);
    if (!found) {
      return -Infinity;
    }
    if (!found.expires) {
      return NaN;
    }
    if (found.expires === 'Infinity') {
      return Infinity;
    }
    return Math.floor((found.expires.getTime() - Date.now()) / 1000);
  }

  /**
   * Retrieves the path of a cookie with the specified key from the cookie jar.
   *
   * @param key - The key of the cookie to search for. If not provided, the method will return `undefined`.
   * @returns The path of the found cookie, or `undefined` if no cookie with the given key exists.
   */
  public scope(key?: string): string | undefined {
    const cookies = this.cookieJar.getCookiesSync(this.issuer.toString(), {
      expire: false,
      allPaths: true,
    });

    const found = cookies.find((c) => c.key === key);

    return found?.path ?? undefined;
  }

  /**
   * The issuer of the session, typically the base URL or domain.
   */
  public get issuer(): URL {
    return new URL(this.url);
  }
}

/**
 * Extends {@link CookieSession} to provide unified management of cookies, localStorage, and sessionStorage
 * for web sessions, with persistent storage for localStorage data.
 *
 * @remarks
 * - LocalStorage data is persisted to disk in a file path based on the issuer's hostname.
 * - SessionStorage data is managed in-memory for the duration of the session.
 *
 * @example
 * ```typescript
 * const session = await WebStoreCookieSession.fromPage(page);
 * const token = session.get('authToken', 'local');
 * session.clear();
 * ```
 *
 * @public
 */
export class WebStoreCookieSession extends CookieSession {
  /**
   * Creates an instance of `WebStoreCookieSession`.
   *
   * @param url - The URL for which cookies are managed.
   * @param cookieJar - An optional `CookieJar` instance for cookie management.
   * @param localStorage - An optional `LocalStorage` instance for managing local storage.
   * @param sessionStorage - An optional `SessionStorage` instance for managing session storage.
   */
  constructor(
    url: URL | string,
    cookieJar?: CookieJar,
    public localStorage = new LocalStorage(`.data/${new URL(url).hostname}/localstorage.json`),
    public sessionStorage = new SessionStorage(),
  ) {
    super(url, cookieJar);
  }

  /**
   * Creates a {@link WebStoreCookieSession} instance from the given Playwright {@link Page}.
   *
   * This method extracts the session information, localStorage, and sessionStorage data
   * from the provided page. It persists the localStorage data to a file based on the session's
   * issuer hostname and assigns the sessionStorage data directly.
   *
   * @param page - The Playwright {@link Page} from which to extract session and storage data.
   * @returns A promise that resolves to a {@link WebStoreCookieSession} containing the session,
   *          localStorage, and sessionStorage data.
   */
  public static override async fromPage(page: Page): Promise<WebStoreCookieSession> {
    const session = await CookieSession.fromPage(page);
    const localStorage = new LocalStorage(`.data/${new URL(session.issuer).hostname}/localstorage.json`);
    const sessionStorage = new SessionStorage();

    const storageState = await page.context().storageState();
    const localStorageData =
      storageState.origins
        .find((origin) => origin.origin === session.issuer.origin)
        ?.localStorage.reduce(
          (acc, item) => {
            acc[item.name] = item.value;
            return acc;
          },
          {} as Record<string, string>,
        ) ?? {};
    localStorage._persistData(localStorageData);

    const sessionStorageData = await page.evaluate(() => window.sessionStorage);
    sessionStorage._data = sessionStorageData;

    return new WebStoreCookieSession(session.issuer, session.cookieJar, localStorage, sessionStorage);
  }

  /**
   * Retrieves the value associated with the specified key from the chosen storage type.
   *
   * @param key - The key whose value should be retrieved.
   * @param from - The storage type to retrieve the value from. Can be `'cookie'`, `'local'`, or `'session'`. Defaults to `'cookie'`.
   * @returns The value associated with the key if it exists, otherwise `undefined`.
   */
  public override get(key: string, from: 'cookie' | 'local' | 'session' = 'cookie'): string | undefined {
    if (from === 'cookie') {
      return super.get(key);
    }
    if (from === 'local') {
      return this.localStorage.getItem(key) ?? undefined;
    }
    return this.sessionStorage.getItem(key) ?? undefined;
  }

  /**
   * Retrieves all stored session data from the specified storage type.
   *
   * @param from - The storage type to retrieve data from. Can be 'cookie', 'local', or 'session'.
   * @returns An object containing all key-value pairs from the selected storage.
   */
  public override getAll(from: 'cookie' | 'local' | 'session' = 'cookie'): Record<string, string> {
    if (from === 'cookie') {
      return super.getAll();
    }
    if (from === 'local') {
      return this.localStorage._readData();
    }
    return this.sessionStorage._data;
  }

  /**
   * Clears all data from both localStorage and sessionStorage, effectively removing all stored session data.
   */
  public override clear(): void {
    super.clear();
    this.localStorage.clear();
    this.sessionStorage.clear();
  }
}
