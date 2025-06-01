import { type AfterResponseHook } from 'got';
import { type RednoteCookieSession } from '@/auth/session.js';
import { isApiResponse } from '@/types/common.js';

/**
 * Creates an after-response hook that refreshes session and retry on auth failures.
 *
 * @param session - The X cookie session to refresh on auth failure
 * @returns After-response hook for HTTP clients
 */
export const retryOnUnauthorized =
  (session: RednoteCookieSession): AfterResponseHook =>
  (resp, retry) => {
    if (resp.statusCode === 200 && isApiResponse(resp.body) && !resp.body.success && resp.body.code === -101) {
      if (session.expiresIn('a1') <= 0) {
        session.refresh('a1');
      }
      if (session.expiresIn('webId') <= 0) {
        session.refresh('webId');
      }
      if (session.expiresIn('loadts') <= 0) {
        session.refresh('loadts');
      }
      if (session.expiresIn('xsecappid') <= 0) {
        session.refresh('xsecappid');
      }

      return retry({
        cookieJar: session.cookieJar,
      });
    }

    return resp;
  };
