import {
  type CookieJar,
  type LocalStorage,
  type SessionStorage,
  WebStoreCookieSession,
} from '@social-sdk/auth/session';
import { addYear } from '@formkit/tempo';
import { generateLocalId, generateWebId } from '@/security/token/token.js';

export class RednoteCookieSession extends WebStoreCookieSession {
  /**
   * Creates an instance of the session class.
   *
   * @param url - The base URL for the session. Defaults to 'https://xiaohongshu.com' if not provided.
   * @param jar - An optional `CookieJar` instance to manage cookies for the session.
   * @param localStorage - An optional `LocalStorage` instance for managing local storage.
   * @param sessionStorage - An optional `SessionStorage` instance for managing session storage.
   */
  constructor(jar?: CookieJar, localStorage?: LocalStorage, sessionStorage?: SessionStorage) {
    super(new URL('https://www.xiaohongshu.com'), jar, localStorage, sessionStorage);
  }

  /**
   * Wraps a given `WebStoreCookieSession` into a `RednoteCookieSession` instance.
   *
   * @param session - The session object to wrap. Must have an issuer with hostname 'xiaohongshu.com'.
   * @returns A new instance of `RednoteCookieSession` initialized with the provided session's cookie jar, local storage, and session storage.
   * @throws If the session's issuer hostname is not 'xiaohongshu.com'.
   */
  public static wrap(session: WebStoreCookieSession): RednoteCookieSession {
    if (session.issuer.hostname !== 'www.xiaohongshu.com') {
      throw new Error('Invalid session host. Expected www.xiaohongshu.com.');
    }
    return new RednoteCookieSession(session.cookieJar, session.localStorage, session.sessionStorage);
  }

  /**
   * Refreshes and returns a specific session key value.
   *
   * @param key - The session key to refresh ('a1', 'webId', 'loadts', or 'xsecappid')
   * @returns Promise resolving to the refreshed key value
   */
  public override refresh(key: 'a1' | 'webId' | 'loadts' | 'xsecappid'): string {
    if (key === 'a1') {
      const localId = generateLocalId('Mac OS');
      this.set('a1', localId, {
        expires: addYear(new Date(), 1),
        path: '/',
        domain: '.xiaohongshu.com',
      });
      return localId;
    }
    if (key === 'loadts') {
      const ts = String(Date.now());
      this.set('loadts', ts, {
        expires: addYear(new Date(), 1),
        path: '/',
        domain: '.xiaohongshu.com',
      });
      return ts;
    }
    if (key === 'webId') {
      const webId = generateWebId(this.get('a1') ?? generateLocalId('Mac OS'));
      this.set('webId', webId, {
        expires: addYear(new Date(), 1),
        path: '/',
        domain: '.xiaohongshu.com',
      });
      return webId;
    }

    const appId = 'xhs-pc-web';
    this.set('xsecappid', appId, {
      expires: addYear(new Date(), 1),
      path: '/',
      domain: '.xiaohongshu.com',
    });
    return appId;
  }
}
