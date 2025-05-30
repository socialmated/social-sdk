import got, { type Got } from 'got';
import { type GotScraping, gotScraping } from 'got-scraping';
import { type CookieSession } from '@/auth/session/cookie.js';
import { type OAuthSession } from '@/auth/session/oauth.js';
import { setAuthorization } from '@/hooks/auth.js';

/**
 * Represents the HTTP client interface
 *
 * @see Got
 * @see GotScraping
 */
export type HttpClient = Got | GotScraping;

/**
 * Creates an OAuth-enabled API client with automatic token refresh.
 *
 * @param session - The OAuth session object containing access and refresh tokens.
 * @returns An API client instance configured with OAuth authentication and automatic token refresh.
 */
export function createOAuthHttpClient(session: OAuthSession): HttpClient {
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

/**
 * Creates an API client instance with cookie session support.
 *
 * @param session - The cookie session object containing the cookie jar.
 * @returns An API client instance with cookie session capabilities.
 */
export function createCookieHttpClient(session: CookieSession): HttpClient {
  const client = gotScraping.extend({
    cookieJar: session.cookieJar,
    headers: {
      connection: 'keep-alive',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'sec-fetch-site': 'same-origin',
    },
  });
  return client;
}
