import crypto from 'node:crypto';
import { gotScraping } from '@social-sdk/client/http';

/**
 * Bearer token for the X Web app (x.com).
 */
const DEFAULT_X_WEB_APP_TOKEN =
  'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';

/**
 * Bearer token for the X Pro app (pro.x.com).
 */
const DEFAULT_X_PRO_APP_TOKEN =
  'AAAAAAAAAAAAAAAAAAAAAFQODgEAAAAAVHTp76lzh3rFzcHbmHVvQxYYpTw%3DckAlMINMjmCwxUcaXbAN4XqJVdgMJaHqNOFgPMK0zN1qLqLQCF';

/**
 * Retrieves the bearer token for the specified app client.
 *
 * @param app - The app client variant, either 'web' or 'pro'.
 * @returns The bearer token as a string.
 */
function getBearerToken(app: 'web' | 'pro' = 'web'): string {
  return app === 'web' ? DEFAULT_X_WEB_APP_TOKEN : DEFAULT_X_PRO_APP_TOKEN;
}

/**
 * Generates a cryptographically secure CSRF (Cross-Site Request Forgery) token.
 *
 * @param size - The number of random bytes to generate for the token. Defaults to 16.
 * @returns A hexadecimal string representing the generated CSRF token.
 */
function generateCsrfToken(size = 16): string {
  const rand = crypto.randomBytes(size);
  return rand.toString('hex');
}

/**
 * Retrieves a guest token by activating a guest session via the API.
 *
 * @param session - The current XCookieSession used for authentication.
 * @returns A promise that resolves to the guest token as a string.
 */
// TODO: Return a cookie jar?
async function fetchGuestToken(): Promise<string> {
  const res = await gotScraping
    .post('https://api.x.com/1.1/guest/activate.json', {
      headers: {
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'content-type': 'application/json',
        accept: '*/*',
        origin: 'https://x.com',
        referer: 'https://x.com/',
        authorization: `Bearer ${getBearerToken()}`,
        'x-twitter-client-language': 'en',
        'x-twitter-active-user': 'yes',
      },
    })
    .json<{ guest_token: string }>();

  return res.guest_token;
}

export { getBearerToken, generateCsrfToken, fetchGuestToken };
