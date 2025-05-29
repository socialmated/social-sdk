import { CookieSession } from '@social-sdk/core/auth/session';
import { type CookieJar } from 'tough-cookie';
import { fetchGuestToken, generateCsrfToken } from '../security/token/index.js';

export class XCookieSession extends CookieSession {
  /**
   * Creates an instance of the session class.
   *
   * @param url - The base URL for the session. Defaults to 'https://x.com' if not provided.
   * @param jar - An optional `CookieJar` instance to manage cookies for the session.
   */
  constructor(jar?: CookieJar) {
    super(new URL('https://x.com'), jar);
  }

  /**
   * Wraps a given `CookieSession` into an `XCookieSession` instance.
   *
   * @param session - The `CookieSession` object to be wrapped.
   * @returns An `XCookieSession` instance created from the provided `CookieSession`.
   * @throws If the session's issuer hostname is not `x.com`.
   */
  public static wrap(session: CookieSession): XCookieSession {
    if (session.issuer.hostname !== 'x.com') {
      throw new Error('Invalid session host. Expected x.com.');
    }
    return new XCookieSession(session.cookieJar);
  }

  /**
   * Refreshes the session by updating the guest token.
   *
   * @param key - The key to refresh. Defaults to 'gt' (guest token).
   * @returns A promise that resolves when the guest token has been successfully refreshed.
   */
  public override async refresh(key: 'gt' | 'ct0' = 'gt'): Promise<string> {
    if (key === 'ct0') {
      const ct0 = generateCsrfToken();
      const maxAge = 365 * 24 * 60 * 60; // 1 year in seconds
      const expires = new Date(Date.now() + maxAge * 1000).toUTCString();
      const cookie = `${key}=${ct0}; Path=/; Domain=.x.com; Secure; HttpOnly; SameSite=None; Max-Age=${String(maxAge)}; Expires=${expires}`;

      await this.cookieJar.setCookie(cookie, this.issuer.toString());
      return ct0;
    }

    const gt = await fetchGuestToken();
    const maxAge = 3.5 * 60 * 60; // 3.5 hours in seconds
    const expires = new Date(Date.now() + maxAge * 1000).toUTCString();
    const cookie = `${key}=${gt}; Path=/; Domain=.x.com; Secure; HttpOnly; SameSite=None; Max-Age=${String(maxAge)}; Expires=${expires}`;

    await this.cookieJar.setCookie(cookie, this.issuer.toString());
    return gt;
  }
}
