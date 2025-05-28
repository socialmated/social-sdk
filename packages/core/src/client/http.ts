import got, { type Options, type Got } from 'got';
import { type GotScraping, gotScraping } from 'got-scraping';
import { type CookieSession } from '@/auth/session/cookie.js';
import { type OAuthSession } from '@/auth/session/oauth.js';

/**
 * Represents the HTTP client interface
 *
 * @see Got
 * @see GotScraping
 */
export type HttpClient = Got | GotScraping;

/**
 * Creates an OAuth2-enabled API client with automatic token refresh.
 *
 * @param baseUrl - The base URL for the API endpoints.
 * @param session - The OAuth session object containing access and refresh tokens.
 * @param preset - Determines the client type: `'public'` uses the standard client, `'private'` uses a scraping client. Defaults to `'public'`.
 * @returns An API client instance configured with OAuth2 authentication and automatic token refresh.
 */
export function createOAuth2HttpClient(baseUrl: string | URL, session: OAuthSession, preset: 'public'): Got;
export function createOAuth2HttpClient(baseUrl: string | URL, session: OAuthSession, preset?: 'private'): GotScraping;
export function createOAuth2HttpClient(
  baseUrl: string | URL,
  session: OAuthSession,
  preset: 'public' | 'private' = 'public',
): HttpClient {
  // TODO: make expiresIn threshold configurable
  const refreshToken = async (options: Options): Promise<void> => {
    if (session.expiresIn() < 60) {
      await session.refresh();
    }
    options.headers['authorization'] = `Bearer ${session.tokenResponse.access_token}`;
  };
  return (preset === 'public' ? got : gotScraping).extend({
    prefixUrl: baseUrl,
    headers: {
      'user-agent': 'social-sdk/0.1.0',
      'content-type': 'application/json',
      accept: 'application/json',
    },
    responseType: 'json',
    hooks: {
      beforeRequest: [refreshToken],
    },
  });
}

/**
 * Creates an API client instance with cookie session support.
 *
 * @param baseUrl - The base URL for all API requests.
 * @param session - The cookie session object containing the cookie jar.
 * @param preset - Determines the type of client to use: `'public'` for unauthenticated or `'private'` for authenticated requests. Defaults to `'private'`.
 * @returns An API client instance with cookie session capabilities.
 */
export function createCookieHttpClient(baseUrl: string | URL, session: CookieSession, preset: 'public'): Got;
export function createCookieHttpClient(baseUrl: string | URL, session: CookieSession, preset?: 'private'): GotScraping;
export function createCookieHttpClient(
  baseUrl: string | URL,
  session: CookieSession,
  preset: 'public' | 'private' = 'private',
): HttpClient {
  const client = (preset === 'public' ? got : gotScraping).extend({
    prefixUrl: baseUrl,
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
