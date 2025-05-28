import { type AfterResponseHook } from 'got';
import { type XCookieSession } from '@/auth/session.js';

/**
 * Creates an after-response hook that refreshes session on 401 responses.
 * Retries the request with updated CSRF and guest tokens.
 *
 * @param session - The X cookie session to refresh on auth failure
 * @returns After-response hook for HTTP clients
 */
export const refreshSession =
  (session: XCookieSession): AfterResponseHook =>
  async (resp, retry) => {
    if (resp.statusCode !== 401) {
      return resp;
    }
    await session.refresh();
    return retry({
      headers: {
        'x-csrf-token': session.get('ct0'),
        'x-guest-token': session.get('gt'),
      },
    });
  };
