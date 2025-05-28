import { CookieSession } from '@social-sdk/core/auth/session';
import { type CookieJar } from 'tough-cookie';
import { fetchGuestToken } from '../security/token/index.js';

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
   * @param _key - The key to refresh. Only 'gt' is supported.
   * @returns A promise that resolves when the guest token has been successfully refreshed.
   */
  // TODO: refresh ct0 too
  public override async refresh(_key: 'gt' = 'gt'): Promise<void> {
    const gt = await fetchGuestToken();

    // expires in ~3.5 hours
    const maxAge = 3.5 * 60 * 60;
    const expires = new Date(Date.now() + maxAge * 1000).toUTCString();

    await this.cookieJar.setCookie(
      `gt=${gt}; Path=/; Domain=.x.com; Secure; HttpOnly; SameSite=None; Max-Age=${String(maxAge)}; Expires=${expires}`,
      this.issuer.toString(),
    );
  }
}
