import got, { type Got } from 'got';
import { gotScraping } from 'got-scraping';
import { OAuthSession, type CookieSession } from '@social-sdk/auth/session';
import { setAuthorization } from '@/hooks/index.js';

/**
 * Type representing an HTTP client that can be used to make requests.
 *
 * @see {@link Got}
 */
type HttpClient = Got;

/**
 * Creates an API client instance with OAuth authentication support.
 *
 * @param session - The OAuth session object containing access and refresh tokens.
 * @returns An API client instance configured with OAuth authentication and automatic token refresh.
 */
function createHttpClient(session: OAuthSession | CookieSession): HttpClient {
  if (session instanceof OAuthSession) {
    return got.extend({
      headers: {
        'user-agent': 'social-sdk/0.1.0',
        'content-type': 'application/json',
        accept: 'application/json',
      },
      hooks: {
        beforeRequest: [setAuthorization(session)],
      },
    });
  }

  return gotScraping.extend({
    cookieJar: session.cookieJar,
    headerGeneratorOptions: {
      browsers: ['chrome'],
      devices: ['desktop'],
      operatingSystems: ['macos'],
      locales: ['en-US'],
    },
    headers: {
      connection: 'keep-alive',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'sec-fetch-site': 'same-origin',
    },
  }) as HttpClient;
}

export { createHttpClient };
export type { HttpClient };

export { gotScraping } from 'got-scraping';
export { got } from 'got';
export type * from 'got';
