import { CookieSession } from '@social-sdk/core/auth/session';
import { type CookieJar } from 'tough-cookie';
import { addHour, addYear } from '@formkit/tempo';
import { fetchGuestToken, generateCsrfToken } from '../security/token/index.js';

/**
 * Represents a session for the X platform (formerly Twitter) using cookies.
 */
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
  public override async refresh(key: 'gt' | 'ct0'): Promise<string> {
    if (key === 'ct0') {
      const csrfToken = generateCsrfToken();
      this.set('ct0', csrfToken, {
        expires: addYear(new Date(), 1),
        path: '/',
        domain: '.x.com',
        secure: true,
        sameSite: 'Lax',
      });
      return csrfToken;
    }

    const guestToken = await fetchGuestToken();
    this.set('gt', guestToken, {
      expires: addHour(new Date(), 2.5),
      path: '/',
      domain: '.x.com',
      secure: true,
      sameSite: 'None',
    });
    return guestToken;
  }
}
