import { type BeforeRequestHook } from 'got';
import { type OAuthSession } from '@/auth/session/oauth.js';

/**
 * Creates a before-request hook that handles OAuth authorization headers.
 * Automatically refreshes expired tokens before adding Bearer token to requests.
 *
 * @param session - OAuth session with token and refresh capabilities
 * @returns Before-request hook that adds Bearer token to headers
 */
export const setAuthorization =
  (session: OAuthSession): BeforeRequestHook =>
  async (options) => {
    if (session.expiresIn() <= 0) {
      await session.refresh();
    }
    options.headers['authorization'] = `Bearer ${session.tokenResponse.access_token}`;
  };
