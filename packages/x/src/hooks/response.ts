import { type AfterResponseHook } from 'got';
import { type XCookieSession } from '@/auth/session.js';

/**
 * Creates an after-response hook that refreshes session and retry on auth failures.
 *
 * @param session - The X cookie session to refresh on auth failure
 * @returns After-response hook for HTTP clients
 */
export const retryOnUnauthorized =
  (session: XCookieSession): AfterResponseHook =>
  async (resp, retry) => {
    // Retry on 401 Unauthorized or 403 Forbidden
    if (resp.statusCode === 401 || resp.statusCode === 403) {
      return retry({
        headers: {
          'x-csrf-token': await session.refresh('ct0'),
          'x-guest-token': await session.refresh('gt'),
        },
      });
    }

    return resp;
  };
